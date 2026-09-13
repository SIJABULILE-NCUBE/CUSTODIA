// this page lists every youth programme and lets a logged in member enrol with one click

import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Programme {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  schedule: string | null;
}

export default function Programmes() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [message, setMessage] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { profile } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL as string;

  // i load the programme list once when the page first opens
  useEffect(() => {
    fetch(`${API_URL}/api/programmes`)
      .then((res) => res.json())
      .then((body) => setProgrammes(body.programmes || []))
      .catch(() => setMessage('i could not load the programmes right now'));
  }, [API_URL]);

  async function handleEnroll(programmeId: string) {
    setLoadingId(programmeId);
    setMessage('');

    try {
      await apiRequest(`/api/programmes/${programmeId}/enroll`, { method: 'POST' });
      setMessage('you are enrolled, see you there');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'i could not enrol you in that programme');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-hero text-3xl text-charcoal">Youth programmes</h1>
      <p className="mt-2 text-sm text-charcoal/70">Everything running at Riverside this term.</p>

      {message && <p className="mt-4 rounded-md bg-gold-light/30 px-4 py-2 text-sm text-charcoal">{message}</p>}

      <div className="mt-8 space-y-4">
        {programmes.length === 0 && <p className="text-charcoal/60">nothing is listed yet, please check back soon</p>}

        {programmes.map((programme) => (
          <div key={programme.id} className="rounded-lg border border-gold/40 bg-ivory p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-hero text-xl text-charcoal">{programme.name}</h2>
                {programme.schedule && <p className="mt-1 text-sm text-gold-dark">{programme.schedule}</p>}
                {programme.description && <p className="mt-2 text-sm text-charcoal/80">{programme.description}</p>}
                <p className="mt-2 text-xs text-charcoal/50">capacity: {programme.capacity} spots</p>
              </div>

              {profile ? (
                <button
                  onClick={() => handleEnroll(programme.id)}
                  disabled={loadingId === programme.id}
                  className="whitespace-nowrap rounded-full bg-gold px-5 py-2 text-sm font-medium text-ink hover:bg-gold-light disabled:opacity-60"
                >
                  {loadingId === programme.id ? 'enrolling' : 'enrol now'}
                </button>
              ) : (
                <Link to="/login" className="whitespace-nowrap text-sm text-gold-dark hover:underline">
                  log in to enrol
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
