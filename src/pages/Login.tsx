// this is my login page, it signs the person in with supabase directly from the browser
// i use the supabase client here instead of my backend, since supabase handles the session storage for me

import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError('that email or password does not look right');
      setLoading(false);
      return;
    }

    // i refresh my auth context so the navbar and the rest of the app knows i am logged in now
    await refreshProfile();
    navigate('/dashboard');
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-hero text-3xl text-charcoal dark:text-cream">Welcome back</h1>
      <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70">Log in to manage your bookings and programmes.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-cream">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory dark:bg-charcoal/60 px-4 py-2 focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-cream">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory dark:bg-charcoal/60 px-4 py-2 focus:border-gold"
          />
        </div>

        {error && <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold py-3 font-medium text-ink hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? 'logging you in' : 'log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-charcoal/70 dark:text-cream/70">
        New to Riverside?{' '}
        <Link to="/register" className="text-gold-dark hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
