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

## The admin role

Every account starts as a plain `member` when it registers, there is no signup option for
admin, on purpose, since that would let anyone grant themselves full access. Admin has to be
switched on by hand, directly in the `profiles` table in Supabase.

My own account (`s.mabhena@gmail.com`) is already set to `admin`, so I can see and use
everything below without any extra setup.

What an admin can actually do that a regular member cannot:
- See the **Staff dashboard** link in the nav, which is hidden from regular members entirely,
  both in the UI and at the API level (the backend checks the role on every admin request, not
  just the frontend).
- View the funder style report: total and active members, programmes running, pending and
  approved bookings, food parcels logged, and total cash donated.
- See every pending booking across all members, not just their own, and approve or reject each
  one.
- Create new programmes and facilities through the API (there is no admin form for this yet in
  the UI, so for now I add these directly in Supabase, see the seeding step above).

To promote another account to admin later, it is the same manual step: Supabase, Table Editor,
`profiles` table, find that person's row, change `role` from `member` to `admin`, done.

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

1. I create a new project on supabase.com.
2. I open the SQL editor, click New query, paste in the whole of `supabase/schema.sql`, and
   click Run. This creates all six tables (profiles, programmes, programme_enrollments,
   facilities, bookings, donations) along with the row level security policies and the trigger
   that auto creates a profile on signup.
3. Supabase now issues two kinds of API keys, under Project Settings then API Keys:
   - the **publishable key** (starts `sb_publishable_...`) is the modern name for what used to
     be called the anon key, safe to expose in the browser.
   - the **secret key** (starts `sb_secret_...`) is the modern name for the service role key,
     full access, never goes in frontend code.
4. In the backend folder, I copy `.env.example` to `.env` (note: `backend/.env`, not
   `backend/src/.env`, it has to sit right next to `package.json`) and fill in:
   - `SUPABASE_URL` as the actual project URL, `https://<project-ref>.supabase.co`, not the
     dashboard page link.
   - `SUPABASE_SERVICE_ROLE_KEY` as my secret key.
   - `SUPABASE_ANON_KEY` as my publishable key.
   Then I run `npm install` and `npm run dev` from inside `backend`.
5. In the frontend folder, I copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL`
   (same project URL), `VITE_SUPABASE_ANON_KEY` (the publishable key), and `VITE_API_URL` as
   `http://localhost:4000`. Then `npm install` and `npm run dev` from inside `frontend`, in a
   second terminal, so the backend keeps running in the first one.
6. My new tables start empty, so the Book a space and Programmes pages show nothing until I
   seed some starter rows. I run a quick insert for a few facilities and programmes the same
   way I ran schema.sql, through the SQL editor.
7. Registering through the site only ever creates a `member` account. To get admin access, see
   the "The admin role" section above.

## A mistake worth flagging to future me

Early on I accidentally committed my real `backend/.env` (with my live secret key inside) and
my entire `backend/node_modules` folder to git before `.gitignore` existed. GitHub's push
protection caught the secret and blocked the push before it went live, but it meant wiping my
local git history and starting a clean first commit once `.gitignore` was actually in place.
Lesson: create `.gitignore` (with `node_modules`, `dist`, `.env`, `.env.local` on separate
lines) **before** the first `git add .`, not after.

## Deployment notes

I am planning to deploy the frontend on Netlify or Vercel and the backend on Render or
Railway, since both give a straightforward path for a small Node api. The environment
variables above are exactly what each platform needs set in its dashboard.

- Live frontend: https://frontend-9hkc9pgnk-smabhena-5612s-projects.vercel.app/
- Live backend API: https://custodia-midk.onrender.com
- Live Loom walkthrough: `TBD`

## Conclusion

Custodia was built to have the scope of a real client engagement, not just one isolated
feature, so it forced me to think about schema design, typed contracts between the frontend
and backend, access control, and deployment all at once, rather than any one of those in
isolation. Getting it actually running end to end also meant working through real problems
along the way: mismatched environment variable names, a leaked secret key caught by GitHub's
own protections, an empty database with nothing to show until I seeded it, and the everyday
friction of running two servers and a database together. None of that is in the code itself,
but it is exactly the kind of debugging and ownership a real project asks for, and it is what
this one gave me practice in. 