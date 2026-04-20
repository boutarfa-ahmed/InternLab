import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

import StudentDashboard from '@/pages/student/Dashboard'
import InternshipsPage from '@/pages/student/InternshipsPage'
import InternshipDetail from '@/pages/student/InternshipDetail'
import MyApplications from '@/pages/student/MyApplications'
import StudentProfile from '@/pages/student/Profile'

import CompanyDashboard from '@/pages/company/Dashboard'
import PostInternship from '@/pages/company/PostInternship'
import ManageApplications from '@/pages/company/ManageApplications'
import CompanyProfile from '@/pages/company/Profile'

import AdminDashboard from '@/pages/admin/Dashboard'

import MainLayout from '@/components/layout/MainLayout'
import LandingPage from '@/pages/LandingPage'

function PrivateRoute({ children, allowedRoles }) {
  const { user, token } = useAuthStore()
  
  if (!token) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/student" element={
          <PrivateRoute allowedRoles={['STUDENT']}>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="internships" element={<InternshipsPage />} />
          <Route path="internships/:id" element={<InternshipDetail />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="/company" element={
          <PrivateRoute allowedRoles={['COMPANY']}>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<CompanyDashboard />} />
          <Route path="post" element={<PostInternship />} />
          <Route path="applications" element={<ManageApplications />} />
          <Route path="profile" element={<CompanyProfile />} />
        </Route>

        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}