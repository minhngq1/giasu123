// Chạy trước mọi file test.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Gỡ component đã render sau mỗi test để test sau không thấy DOM của test trước.
afterEach(() => cleanup())
