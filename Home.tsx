// this is my landing page, it introduces riverside and points people to the three main things they can do

import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* my hero section, i wanted this to feel like a warm community notice board rather than a corporate banner */}
      <section className="bg-ink px-6 py-24 text-ivory">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-hero text-5xl leading-tight">
            One home for everyone Riverside welcomes
          </h1>
          <p className="mt-6 text-lg text-cream">
            Sign up as a member, book a room or the gym, or drop off a donation for the food parcel drive.
            Everything the centre runs now lives in one place, for you and for our team.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/register" className="rounded-full bg-gold px-6 py-3 font-medium text-ink hover:bg-gold-light">
              Become a member
            </Link>
            <Link to="/donate" className="rounded-full border border-gold px-6 py-3 font-medium text-gold hover:bg-gold hover:text-ink">
              Make a donation
            </Link>
          </div>
        </div>
      </section>

      {/* i laid these three cards out to mirror the three services this platform actually combines */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-gold/40 bg-ivory dark:bg-charcoal/60 p-8">
            <h2 className="font-hero text-2xl text-charcoal dark:text-cream">Youth programmes</h2>
            <p className="mt-3 text-sm text-charcoal/80 dark:text-cream/80">
              From after school coding to sports, browse what is running and enrol your spot in a few taps.
            </p>
            <Link to="/programmes" className="mt-4 inline-block text-gold-dark hover:underline">
              See what is on
            </Link>
          </div>

          <div className="rounded-lg border border-gold/40 bg-ivory dark:bg-charcoal/60 p-8">
            <h2 className="font-hero text-2xl text-charcoal dark:text-cream">Rooms and the gym</h2>
            <p className="mt-3 text-sm text-charcoal/80 dark:text-cream/80">
              Check what is free and request a time slot for a meeting room, event space, or a gym session.
            </p>
            <Link to="/book" className="mt-4 inline-block text-gold-dark hover:underline">
              Book a space
            </Link>
          </div>

          <div className="rounded-lg border border-gold/40 bg-ivory dark:bg-charcoal/60 p-8">
            <h2 className="font-hero text-2xl text-charcoal dark:text-cream">Food parcel drive</h2>
            <p className="mt-3 text-sm text-charcoal/80 dark:text-cream/80">
              Give cash toward groceries or log items you are dropping off, no account needed if you prefer.
            </p>
            <Link to="/donate" className="mt-4 inline-block text-gold-dark hover:underline">
              Give today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
