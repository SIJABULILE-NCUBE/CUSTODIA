# Custodia

I named this platform Custodia, from custodian, since that is really what it does: it looks
after the things a community trusts it with, memberships, bookings and donations, in one
reliable place.

I built it for a fictional but realistic nonprofit client, Riverside Community Hub. They run
youth programmes, a small gym, meeting and event rooms, and a food parcel donation drive, and
before this everything lived on paper and WhatsApp. Custodia brings membership, bookings and
donations into one platform, with a public site for the community and a staff dashboard for
the team running it.

## What this covers

- Public members can register, log in, browse programmes and enrol, book a room or the gym,
  and donate cash or log a food parcel drop off, all without needing an account for donations.
- Staff (admin role) get a dashboard with funder ready numbers and can approve or reject
  booking requests.
- Row level security in Supabase means the database itself enforces who can see what, not just
  my frontend code.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, TypeScript
- Database and auth: Supabase (Postgres plus built in auth)

## Colour scheme

I chose gold, black, cream and ivory since it feels warm and community minded rather than
corporate, which fits a nonprofit better than a typical blue SaaS palette. Fraunces carries the
headings for a bit of personality, Inter handles the body text for readability.

## Project layout

```
custodia/
  backend/     my express api, one route file per feature area
  frontend/    my react app
  supabase/    schema.sql, this is what i ran in the supabase SQL editor to set up my tables
```

## Getting this running myself

1. I create a new project on supabase.com, then open the SQL editor and run the whole of
   `supabase/schema.sql` in one go.
2. In the backend folder, I copy `.env.example` to `.env` and fill in my supabase URL and
   service role key from Project Settings, then run `npm install` and `npm run dev`.
3. In the frontend folder, I copy `.env.example` to `.env.local` and fill in my supabase URL,
   anon key, and the backend URL, then run `npm install` and `npm run dev`.
4. To make myself an admin for testing, i register a normal account through the site, then in
   the supabase table editor i open the profiles table and change my row's role from member to
   admin by hand.

## Deployment notes

I am planning to deploy the frontend on Netlify or Vercel and the backend on Render or
Railway, since both give a straightforward path for a small Node api. The environment
variables above are exactly what each platform needs set in its dashboard.
