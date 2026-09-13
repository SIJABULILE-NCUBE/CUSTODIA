// this page lets a logged in member pick a facility and request a booking slot

import { useEffect, useState, FormEvent } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

export default function Book() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityId, setFacilityId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    fetch(`${API_URL}/api/facilities`)
      .then((res) => res.json())
      .then((body) => setFacilities(body.facilities || []));
  }, [API_URL]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await apiRequest('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          facility_id: facilityId,
          start_time: startTime,
          end_time: endTime,
          notes,
        }),
      });
      setMessage('your booking request has been sent, staff will confirm it soon');
      setStartTime('');
      setEndTime('');
      setNotes('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'i could not create that booking');
    } finally {
      setLoading(false);
    }
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="font-hero text-2xl text-charcoal">Please log in to book a space</h1>
        <Link to="/login" className="mt-4 inline-block text-gold-dark hover:underline">
          go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-hero text-3xl text-charcoal">Book a space</h1>
      <p className="mt-2 text-sm text-charcoal/70">Choose a room, gym slot or piece of equipment and a time.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal">Facility</label>
          <select
            required
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory px-4 py-2 focus:border-gold"
          >
            <option value="">choose a facility</option>
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name} ({facility.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal">Start time</label>
          <input
            type="datetime-local"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory px-4 py-2 focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal">End time</label>
          <input
            type="datetime-local"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory px-4 py-2 focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory px-4 py-2 focus:border-gold"
          />
        </div>

        {message && <p className="rounded-md bg-gold-light/30 px-4 py-2 text-sm text-charcoal">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold py-3 font-medium text-ink hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? 'sending your request' : 'request this booking'}
        </button>
      </form>
    </div>
  );
}
