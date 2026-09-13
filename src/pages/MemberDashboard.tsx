// this is the page a member sees after logging in
// it pulls together their programme enrolments and their booking history in one view

import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Enrollment {
  id: string;
  programmes: { name: string; schedule: string | null } | null;
}

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  facilities: { name: string; type: string } | null;
}

export default function MemberDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    // i load both lists at once, they are independent of each other
    apiRequest('/api/members/me/enrollments')
      .then((body) => setEnrollments(body.enrollments || []))
      .catch(() => setEnrollments([]));

    apiRequest('/api/bookings/me')
      .then((body) => setBookings(body.bookings || []))
      .catch(() => setBookings([]));
  }, []);

  // this just makes a status word look a bit nicer without me writing a switch statement for colours
  function statusStyle(status: string) {
    if (status === 'approved') return 'text-green-700';
    if (status === 'rejected' || status === 'cancelled') return 'text-red-700';
    return 'text-gold-dark';
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-hero text-3xl text-charcoal dark:text-cream">Hello, {profile?.full_name}</h1>
      <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70">Here is everything linked to your account.</p>

      <section className="mt-10">
        <h2 className="font-hero text-xl text-charcoal dark:text-cream">My programmes</h2>
        {enrollments.length === 0 ? (
          <p className="mt-2 text-sm text-charcoal/60 dark:text-cream/60">you have not enrolled in a programme yet</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {enrollments.map((enrollment) => (
              <li key={enrollment.id} className="rounded-md border border-gold/30 bg-ivory dark:bg-charcoal/60 px-4 py-3 text-sm">
                {enrollment.programmes?.name}
                {enrollment.programmes?.schedule && (
                  <span className="text-charcoal/60 dark:text-cream/60"> — {enrollment.programmes.schedule}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-hero text-xl text-charcoal dark:text-cream">My bookings</h2>
        {bookings.length === 0 ? (
          <p className="mt-2 text-sm text-charcoal/60 dark:text-cream/60">you have not made a booking yet</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {bookings.map((booking) => (
              <li key={booking.id} className="rounded-md border border-gold/30 bg-ivory dark:bg-charcoal/60 px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>{booking.facilities?.name}</span>
                  <span className={statusStyle(booking.status)}>{booking.status}</span>
                </div>
                <p className="mt-1 text-xs text-charcoal/60 dark:text-cream/60">
                  {new Date(booking.start_time).toLocaleString()} to {new Date(booking.end_time).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
