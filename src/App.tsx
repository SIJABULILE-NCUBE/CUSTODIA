// this is my top level app component, it sets up routing and wraps everything in the auth and theme providers

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* i use flex column with min-h-screen so the footer sits at the bottom even on short pages */}
          <div className="flex min-h-screen flex-col bg-cream dark:bg-charcoal">
            <Navbar />

            <main className="flex-1">
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
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

