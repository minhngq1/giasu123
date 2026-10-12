import { describe, it, expect, vi } from 'vitest'
import { createApiClient } from './api'
import { ApiError } from '../lib/problem'

/**
 * Adapter giả thay cho mạng thật: token "new" hợp lệ, token khác → 401.
 * Đếm số request để kiểm tra hành vi.
 */
function fakeServer() {
  const calls = []
  const adapter = async (config) => {
    calls.push(config.url)
    const ok = config.headers.Authorization === 'Bearer new'
    if (!ok) {
      const err = new Error('401')
      err.config = config
      err.response = { status: 401, data: { title: 'Unauthorized', status: 401, code: 'TOKEN_EXPIRED' }, config }
      throw err
    }
    return { status: 200, statusText: 'OK', headers: {}, config, data: { url: config.url } }
  }
  return { adapter, calls }
}

function setup({ refreshFails = false } = {}) {
  let token = 'old'
  const server = fakeServer()
  const refreshRequest = vi.fn(async () => {
    await new Promise((r) => setTimeout(r, 10)) // refresh mất chút thời gian → các request khác phải chờ
    if (refreshFails) throw new Error('refresh hỏng')
    return 'new'
  })
  const onAuthFailure = vi.fn()
  const client = createApiClient({
    adapter: server.adapter,
    refreshRequest,
    getAccessToken: () => token,
    onRefreshed: (t) => { token = t },
    onAuthFailure,
  })
  return { client, refreshRequest, onAuthFailure, server }
}

describe('createApiClient — single-flight refresh', () => {
  it('3 request cùng gặp 401 → chỉ gọi refresh 1 lần, cả 3 đều thành công', async () => {
    const { client, refreshRequest } = setup()
    const results = await Promise.all([client.get('/a'), client.get('/b'), client.get('/c')])
    expect(refreshRequest).toHaveBeenCalledTimes(1)
    expect(results.map((r) => r.data.url)).toEqual(['/a', '/b', '/c'])
  })

  it('refresh thất bại → đăng xuất và ném ApiError 401', async () => {
    const { client, onAuthFailure } = setup({ refreshFails: true })
    const err = await client.get('/a').catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(401)
    expect(onAuthFailure).toHaveBeenCalledTimes(1)
  })

  it('request có skipAuthRefresh không kích hoạt refresh (tránh vòng lặp)', async () => {
    const { client, refreshRequest } = setup()
    await client.post('/auth/refresh', null, { skipAuthRefresh: true }).catch(() => {})
    expect(refreshRequest).not.toHaveBeenCalled()
  })
})
