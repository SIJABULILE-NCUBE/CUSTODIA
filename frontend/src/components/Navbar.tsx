// this is my site wide navigation bar
// i keep it simple, the links change slightly depending on whether someone is logged in

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="border-b border-gold/30 bg-ink">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* i named the platform Custodia, since a custodian is who a community trusts to look after what matters to it */}
        {/* i keep the client name underneath in smaller text, since the site itself still belongs to Riverside */}
        <Link to="/" className="leading-tight">
          <span className="block font-hero text-xl text-ivory">Custodia</span>
          <span className="block text-xs tracking-wide text-gold/80">Riverside Community Hub</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-cream">
          <Link to="/programmes" className="hover:text-gold">
            Programmes
          </Link>
          <Link to="/book" className="hover:text-gold">
            Book a space
          </Link>
          <Link to="/donate" className="hover:text-gold">
            Donate
          </Link>

          {profile ? (
            <>
              <Link to="/dashboard" className="hover:text-gold">
                My account
              </Link>
              {profile.role === 'admin' && (
                <Link to="/admin" className="hover:text-gold">
                  Staff dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="rounded-full border border-gold px-4 py-1.5 text-gold hover:bg-gold hover:text-ink">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gold">
                Log in
              </Link>
              <Link to="/register" className="rounded-full bg-gold px-4 py-1.5 text-ink hover:bg-gold-light">
                Join us
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
