// this context keeps track of who is logged in across my whole app
// i wrap my app in this once, then any page can call useAuth() to see the current user

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { apiRequest } from '../lib/api';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'member' | 'admin';
  membership_status: string;
}

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // this asks my backend who i am, using whatever session token supabase currently has
  async function refreshProfile() {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setProfile(null);
        return;
      }
      const result = await apiRequest('/api/auth/me');
      setProfile(result.profile);
    } catch (err) {
      // if this fails i just treat the person as logged out, rather than crashing the app
      console.error('i could not refresh the profile', err);
      setProfile(null);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  useEffect(() => {
    // i check the session once when the app first loads
    refreshProfile().finally(() => setLoading(false));

    // i also listen for supabase auth changes, so login and logout in one tab update everywhere
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      refreshProfile();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ profile, loading, refreshProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// this is the hook i actually use inside my components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth has to be called inside an AuthProvider');
  }
  return context;
}
