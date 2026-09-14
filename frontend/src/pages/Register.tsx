// this is my sign up page, it posts straight to my backend register route

import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL as string;

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, phone, password }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || 'i could not create that account');
      }

      // once registration works i send them to log in, since i am not auto logging them in here
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-hero text-3xl text-charcoal dark:text-cream">Join Riverside</h1>
      <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70">
        Create your membership account to book spaces and join programmes.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-cream">Full name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory dark:bg-charcoal/60 px-4 py-2 focus:border-gold"
          />
        </div>

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
          <label className="block text-sm font-medium text-charcoal dark:text-cream">Phone (optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory dark:bg-charcoal/60 px-4 py-2 focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-cream">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory dark:bg-charcoal/60 px-4 py-2 focus:border-gold"
          />
        </div>

        {/* i only show this box when there is actually an error, no point showing an empty red box */}
        {error && <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold py-3 font-medium text-ink hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? 'creating your account' : 'create my account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-charcoal/70 dark:text-cream/70">
        Already a member?{' '}
        <Link to="/login" className="text-gold-dark hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}
