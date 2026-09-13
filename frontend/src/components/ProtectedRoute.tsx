// i use this to wrap any page that should only be visible to a logged in person
// i pass adminOnly when the page should also be restricted to staff accounts

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

export default function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { profile, loading } = useAuth();

  // while i am still checking the session, i show a simple loading state instead of flashing content
  if (loading) {
    return <div className="p-10 text-center text-charcoal">checking your login, one moment</div>;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
