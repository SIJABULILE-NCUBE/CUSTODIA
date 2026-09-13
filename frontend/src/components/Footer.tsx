// this is my site wide footer, it shows on every page since i mount it once in App.tsx

import { Link } from 'react-router-dom';

export default function Footer() {
  // i pull the year from the browser instead of hardcoding it, so it never goes stale
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/30 bg-ink dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-hero text-lg text-ivory">Custodia</p>
            <p className="mt-1 text-sm text-cream/70">Riverside Community Hub</p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-cream/80">
            <Link to="/programmes" className="hover:text-gold">
              Programmes
            </Link>
            <Link to="/book" className="hover:text-gold">
              Book a space
            </Link>
            <Link to="/donate" className="hover:text-gold">
              Donate
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-cream/50">
          &copy; {year} Custodia. Built for Riverside Community Hub, a fictional nonprofit used
          for this project.
        </p>
      </div>
    </footer>
  );
}
