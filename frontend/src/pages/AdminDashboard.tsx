// this is the staff facing dashboard, it shows the funder report numbers and lets staff approve bookings
// this whole page is wrapped in ProtectedRoute with adminOnly set to true, so only staff ever reach it

import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

interface Report {
  totalMembers: number;
  activeMembers: number;
  pendingBookings: number;
  approvedBookings: number;
  totalDonated: number;
  foodParcels: number;
  programmeCount: number;
}

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  facilities: { name: string } | null;
  profiles: { full_name: string; email: string } | null;
}

export default function AdminDashboard() {
  const [report, setReport] = useState<Report | null>(null);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');

  // i pull this out as its own function so i can call it again after approving or rejecting a booking
  function loadPendingBookings() {
    apiRequest('/api/bookings?status=pending')
      .then((body) => setPendingBookings(body.bookings || []))
      .catch(() => setPendingBookings([]));
  }

  useEffect(() => {
    apiRequest('/api/admin/report')
      .then((body) => setReport(body.report))
      .catch(() => setMessage('i could not load the funder report'));

    loadPendingBookings();
  }, []);

  async function handleDecision(bookingId: string, status: 'approved' | 'rejected') {
    try {
      await apiRequest(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      // i just reload the pending list rather than trying to patch state by hand, it is less error prone
      loadPendingBookings();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'i could not update that booking');
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-hero text-3xl text-charcoal">Staff dashboard</h1>
      <p className="mt-2 text-sm text-charcoal/70">A quick snapshot for your board and funders.</p>

      {message && <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{message}</p>}

      {/* my funder report cards, i kept these plain since the numbers are the point, not decoration */}
      {report && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <ReportCard label="total members" value={report.totalMembers} />
          <ReportCard label="active members" value={report.activeMembers} />
          <ReportCard label="programmes running" value={report.programmeCount} />
          <ReportCard label="pending bookings" value={report.pendingBookings} />
          <ReportCard label="approved bookings" value={report.approvedBookings} />
          <ReportCard label="food parcels logged" value={report.foodParcels} />
          <ReportCard label="total donated" value={`R${report.totalDonated.toFixed(2)}`} />
        </div>
      )}

      <section className="mt-12">
        <h2 className="font-hero text-xl text-charcoal">Bookings waiting on you</h2>

        {pendingBookings.length === 0 ? (
          <p className="mt-3 text-sm text-charcoal/60">nothing waiting right now, nice and clear</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pendingBookings.map((booking) => (
              <li key={booking.id} className="rounded-lg border border-gold/40 bg-ivory p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-charcoal">{booking.facilities?.name}</p>
                    <p className="text-sm text-charcoal/70">
                      requested by {booking.profiles?.full_name} ({booking.profiles?.email})
                    </p>
                    <p className="mt-1 text-xs text-charcoal/60">
                      {new Date(booking.start_time).toLocaleString()} to {new Date(booking.end_time).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision(booking.id, 'approved')}
                      className="rounded-full bg-gold px-4 py-1.5 text-sm font-medium text-ink hover:bg-gold-light"
                    >
                      approve
                    </button>
                    <button
                      onClick={() => handleDecision(booking.id, 'rejected')}
                      className="rounded-full border border-charcoal/30 px-4 py-1.5 text-sm text-charcoal hover:bg-charcoal/5"
                    >
                      reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// this is a small helper component just for the report number tiles, saves me repeating the markup seven times
function ReportCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-gold/40 bg-ink px-4 py-5 text-center">
      <p className="font-hero text-2xl text-gold">{value}</p>
      <p className="mt-1 text-xs text-cream/80">{label}</p>
    </div>
  );
}
