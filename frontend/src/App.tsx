// this is my top level app component, it sets up routing and wraps everything in the auth provider

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Programmes from './pages/Programmes';
import Book from './pages/Book';
import Donate from './pages/Donate';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-cream">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/book" element={<Book />} />
            <Route path="/donate" element={<Donate />} />

            {/* these two routes need a logged in user, ProtectedRoute handles the redirect if not */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
