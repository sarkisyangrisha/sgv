import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { AuthProvider } from './lib/auth';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCars from './pages/admin/Cars';
import AdminNews from './pages/admin/News';
import AdminReviews from './pages/admin/Reviews';
import AdminFAQ from './pages/admin/FAQ';
import AdminSubmissions from './pages/admin/Submissions';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/cars" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminCars />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/news" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminNews />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminReviews />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/faq" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminFAQ />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/submissions" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSubmissions />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Redirect /admin/index.html to /admin */}
          <Route path="/admin/index.html" element={<Navigate to="/admin" replace />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;