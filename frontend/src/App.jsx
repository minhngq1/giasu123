// App.jsx — định nghĩa toàn bộ routes của ứng dụng
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import TutorList from './pages/TutorList'
import TutorDetail from './pages/TutorDetail'
import StudentList from './pages/StudentList'
import StudentDetail from './pages/StudentDetail'
import RegisterTutor from './pages/RegisterTutor'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutors" element={<TutorList />} />
            <Route path="/tutors/:id" element={<TutorDetail />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/register-tutor" element={<RegisterTutor />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
