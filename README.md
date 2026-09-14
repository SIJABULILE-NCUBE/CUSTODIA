# Custodia

I named this platform **Custodia**, from *custodian*, since that is really what it does: it looks after the things a community trusts it with, memberships, bookings, and donations, in one reliable place.

I built it for a fictional but realistic nonprofit client, **Riverside Community Hub**. They run youth programmes, a small gym, meeting and event rooms, and a food parcel donation drive. Before this, everything lived on paper and WhatsApp.

Custodia brings membership, bookings, and donations into one platform, with a public site for the community and a staff dashboard for the team running it.

## What This Covers

* Public members can register, log in, browse programmes and enrol, book a room or the gym, and donate cash or log a food parcel drop-off. Donations do not require an account.
* Staff with the `admin` role get a dashboard with funder-ready numbers and can approve or reject booking requests.
* Row Level Security (RLS) in Supabase means the database itself enforces who can see what, rather than relying only on frontend code.

## The Admin Role

Every account starts as a plain `member` when it registers. There is no signup option for an admin, on purpose, since allowing users to choose an admin role would let anyone grant themselves full access.

Admin access has to be switched on manually, directly in the `profiles` table in Supabase.

My own account (`s.mabhena@gmail.com`) is already set to `admin`, so I can see and use everything below without any extra setup.

### What an Admin Can Do

An admin can:

* See the **Staff Dashboard** link in the navigation. This is hidden from regular members entirely, both in the UI and at the API level. The backend checks the user's role on every admin request, rather than relying only on the frontend.
* View the funder-style report, including:

  * Total and active members
  * Programmes currently running
  * Pending and approved bookings
  * Food parcels logged
  * Total cash donated
* See every pending booking across all members, rather than only their own bookings.
* Approve or reject pending bookings.
* Create new programmes and facilities through the API.

There is no admin form for creating programmes and facilities in the UI yet, so for now I add these directly in Supabase.

### Promoting Another Account to Admin

To promote another account to admin later, it is the same manual process:

1. Open Supabase.
2. Go to **Table Editor**.
3. Open the `profiles` table.
4. Find the person's row.
5. Change `role` from `member` to `admin`.
6. Save the change.

That's it.

## Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express
* TypeScript

### Database and Authentication

* Supabase
* PostgreSQL
* Supabase Auth
* Row Level Security (RLS)

## Colour Scheme

I chose **gold, black, cream, and ivory** because it feels warm and community-minded rather than corporate. This felt like a better fit for a nonprofit than a typical blue SaaS palette.

**Fraunces** carries the headings to give the platform a bit of personality, while **Inter** handles the body text for readability.

## Project Layout

```text
custodia/
├── backend/       # My Express API, with one route file per feature area
├── frontend/      # My React application
└── supabase/      # schema.sql used to set up the database
```

## Getting This Running Locally

### 1. Create a Supabase Project

Create a new project on Supabase.

### 2. Set Up the Database

Open the **SQL Editor**, click **New query**, paste in the entire contents of:

```text
supabase/schema.sql
```

Then click **Run**.

This creates all six tables:

* `profiles`
* `programmes`
* `programme_enrollments`
* `facilities`
* `bookings`
* `donations`

It also creates the Row Level Security policies and the database trigger that automatically creates a profile when a user signs up.

### 3. Get the Supabase API Keys

Supabase now issues two types of API keys under:

**Project Settings → API Keys**

#### Publishable Key

The **publishable key** starts with:

```text
sb_publishable_...
```

This is the modern name for what used to be called the `anon` key.

It is safe to expose in browser-based frontend code when the database is correctly protected with Row Level Security.

#### Secret Key

The **secret key** starts with:

```text
sb_secret_...
```

This is the modern name for what used to be called the service role key.

It has full access and must **never** be placed in frontend code or committed to GitHub.

### 4. Configure the Backend

Inside the `backend` folder, copy:

```text
.env.example
```

to:

```text
.env
```

> **Important:** The file must be `backend/.env`, not `backend/src/.env`. It needs to sit next to `package.json`.

Fill in the following:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_secret_key
SUPABASE_ANON_KEY=your_publishable_key
```

`SUPABASE_URL` should be the actual project URL:

```text
https://<project-ref>.supabase.co
```

It should **not** be the Supabase dashboard URL.

Then run:

```bash
npm install
npm run dev
```

Run these commands from inside the `backend` folder.

### 5. Configure the Frontend

Inside the `frontend` folder, copy:

```text
.env.example
```

to:

```text
.env
```

Fill in:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key
VITE_API_URL=http://localhost:4000
```

Then run:

```bash
npm install
npm run dev
```

Run these commands from inside the `frontend` folder.

The frontend should run in a **second terminal**, while the backend continues running in the first terminal.

### 6. Seed Starter Data

The new database tables start empty.

This means the **Book a Space** and **Programmes** pages will initially show nothing.

To make the application usable, I need to add some starter facilities and programmes.

I can do this by running a quick `INSERT` query through the Supabase SQL Editor, in the same way that I ran `schema.sql`.

### 7. Admin Access

Registering through the website only ever creates a `member` account.

To get admin access, follow the process described in the **The Admin Role** section above.

## A Mistake Worth Flagging to Future Me

Early on, I accidentally committed my real `backend/.env`, which contained my live secret key, as well as my entire `backend/node_modules` folder to Git before `.gitignore` existed.

GitHub's push protection caught the secret and blocked the push before it went live.

However, it meant I had to wipe my local Git history and start with a clean first commit once `.gitignore` was properly in place.

### The Lesson

Create `.gitignore` **before** the first:

```bash
git add .
```

and include at least:

```text
node_modules
dist
.env
.env.local
```

This is one of those mistakes that is easy to make when starting a project, but much easier to prevent when the ignore file is created first.

## Deployment Notes

I am planning to deploy the frontend on **Netlify or Vercel** and the backend on **Render or Railway**, since these provide a straightforward deployment path for a small Node.js API.

The environment variables described above are the values that need to be configured in the relevant deployment platform.

### Live Links

**Live frontend:**

https://frontend-black-seven-vnxlt5gu4i.vercel.app

**Live backend API:**

https://custodia-midk.onrender.com

Visiting the bare backend address shows a `404`, because the backend only serves `/api/...` routes and is not a webpage.

To confirm that the API is running, use:

```text
https://custodia-midk.onrender.com/api/health
```

**Live Loom walkthrough:**

TBD

## Conclusion

Custodia was built to have the scope of a real client engagement rather than just one isolated feature.

Building it forced me to think about **database schema design, typed contracts between the frontend and backend, authentication, access control, and deployment** as parts of the same system rather than treating them as separate problems.

Getting the application running end to end also meant working through real problems along the way, including mismatched environment variable names, a leaked secret key caught by GitHub's own protections, an empty database with nothing to show until I seeded it, and the everyday friction of running two servers and a database together.

None of that is visible directly in the final interface, but it is exactly the kind of debugging, problem-solving, and ownership that a real project requires.

**Custodia gave me practical experience in taking an application from an idea, through development and debugging, to a working end-to-end platform.**
