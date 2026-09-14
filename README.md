# Custodia

**Community Membership, Bookings & Donations Platform**

I named this platform **Custodia**, from *custodian*, since that is really what it does: it looks after the things a community trusts it with, memberships, bookings and donations, in one reliable place.

I built it for a fictional but realistic nonprofit client, **Riverside Community Hub**. They run youth programmes, a small gym, meeting and event rooms, and a food parcel donation drive. Before Custodia, everything lived on paper and WhatsApp.

Custodia brings membership, bookings and donations into one platform, with a public site for the community and a staff dashboard for the team running it.

---

## What This Covers

### Members

Public members can:

* Register and log in
* Browse available programmes
* Enrol in programmes
* Book a room or gym facility
* Donate cash
* Log a food parcel drop-off
* Make donations without needing an account

### Staff

Staff users with the `admin` role get access to a dashboard with funder-ready numbers and can:

* View total and active members
* See programmes currently running
* View pending and approved bookings
* See food parcels logged
* View total cash donations
* See booking requests across all members
* Approve or reject booking requests

### Security

Custodia uses **Supabase Row Level Security (RLS)** so that the database itself enforces who can see and modify what, rather than relying only on frontend code.

---

# The Admin Role

Every account starts as a plain `member` when it registers.

There is deliberately **no signup option for admin**. Allowing users to choose the admin role during registration would allow anyone to grant themselves full access.

Admin access has to be switched on manually through the `profiles` table in Supabase.

My own account is already set to admin, so I can see and use everything without any additional setup.

### What an Admin Can Do

An admin can do everything a regular member can, plus:

* See the **Staff Dashboard** link in the navigation
* Access the staff dashboard
* View the funder-style report
* See total and active members
* See programmes currently running
* View pending and approved bookings
* See food parcels logged
* See total cash donations
* See every pending booking across all members, not just their own
* Approve or reject booking requests
* Create new programmes through the API
* Create new facilities through the API

The Staff Dashboard link is hidden from regular members in the UI, but this is not being treated as the security layer. The backend also checks the user's role on every admin request.

This means a regular member cannot simply bypass the frontend and call the admin functionality directly.

### Promoting Another Account to Admin

To promote another account to admin later:

1. Open the Supabase project.
2. Go to **Table Editor**.
3. Open the `profiles` table.
4. Find the person's profile row.
5. Change `role` from `member` to `admin`.

The account will then have access to the staff functionality.

> There is currently no admin form in the UI for creating programmes or facilities. The API functionality exists, but for now I add these directly through Supabase.

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router

## Backend

* Node.js
* Express
* TypeScript

## Database & Authentication

* Supabase
* PostgreSQL
* Supabase Auth
* Row Level Security

---

# Colour Scheme

I chose **gold, black, cream and ivory** because it feels warm and community-minded rather than corporate.

That felt more appropriate for a nonprofit community organisation than a typical blue SaaS palette.

### Typography

* **Fraunces** for headings, giving the interface some personality
* **Inter** for body text, keeping the content clean and readable

---

# Project Layout

```text
custodia/
│
├── backend/
│   └── Express API
│
├── frontend/
│   └── React application
│
└── supabase/
    └── schema.sql
```

The backend uses one route file per feature area.

The `supabase/schema.sql` file contains the database schema, Row Level Security policies and the trigger that automatically creates a profile when a user signs up.

---

# Getting This Running Locally

## 1. Create a Supabase Project

Create a new project on Supabase.

Open the **SQL Editor**, click **New query**, paste in the entire contents of:

```text
supabase/schema.sql
```

and click **Run**.

This creates the six main tables:

* `profiles`
* `programmes`
* `programme_enrollments`
* `facilities`
* `bookings`
* `donations`

It also creates the Row Level Security policies and the trigger that automatically creates a profile when a user signs up.

---

# 2. Supabase API Keys

Supabase now issues two types of API keys under:

**Project Settings → API Keys**

### Publishable Key

The publishable key starts with:

```text
sb_publishable_...
```

This is the modern name for what was previously called the `anon` key and is safe to expose in browser code.

### Secret Key

The secret key starts with:

```text
sb_secret_...
```

This is the modern name for what was previously called the service role key.

It provides full access and must **never** be placed in frontend code or committed to Git.

---

# 3. Backend Setup

Inside the `backend` folder, copy:

```text
.env.example
```

to:

```text
.env
```

The file must be located directly inside the `backend` folder, next to `package.json`.

Add the following:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_secret_key
SUPABASE_ANON_KEY=your_publishable_key
```

`SUPABASE_URL` must be the actual Supabase project URL:

```text
https://<project-ref>.supabase.co
```

It should **not** be the Supabase dashboard URL.

Then, from inside the `backend` folder:

```bash
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:4000
```

---

# 4. Frontend Setup

Inside the `frontend` folder, copy:

```text
.env.example
```

to:

```text
.env
```

Add:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key
VITE_API_URL=http://localhost:4000
```

Then, from inside the `frontend` folder:

```bash
npm install
npm run dev
```

The frontend should be run in a **second terminal** so that the backend can continue running in the first terminal.

---

# 5. Seed the Database

A new Supabase database starts empty.

This means the **Book a Space** and **Programmes** pages will initially show nothing until some starter data is added.

I add a few facilities and programmes directly through the Supabase SQL Editor using `INSERT` statements.

The same SQL Editor used to run `schema.sql` can be used to seed the starter data.

---

# Authentication

Registering through the website only ever creates a standard `member` account.

There is no option for a user to register as an administrator.

To get admin access, the role must be changed manually in the Supabase `profiles` table.

This is intentional because it prevents users from granting themselves administrative access.

---

# A Mistake Worth Flagging to Future Me

Early in development, I accidentally committed my real `backend/.env` file, including my live secret key, and my entire `backend/node_modules` folder to Git before `.gitignore` existed.

GitHub's push protection caught the secret and blocked the push before it went live.

However, it meant I had to wipe my local Git history and start again with a clean first commit once `.gitignore` was properly in place.

The lesson was simple:

> **Create `.gitignore` before the first `git add .`, not after.**

My `.gitignore` includes:

```text
node_modules/
dist/
.env
.env.local
```

This was a useful real-world lesson because security and repository hygiene need to be considered from the beginning of a project, rather than added afterwards.

---

# Test Credentials

For grading and demonstration purposes, there is a dedicated demo account that has already been promoted to the `admin` role.

This account is separate from my own personal account and was created specifically so the lecturer can test the staff functionality without having to register a new account or manually change the role.

### Demo Admin Account

```text
Email: admin@outlook.com
Password: admin@1212
```

This is a throwaway demo account created only for this project and does not belong to a real person's login.

The account can be used to log in and test the **Staff Dashboard**, including the admin reporting and booking approval functionality.

---

# Deployment Notes

The frontend is deployed separately from the backend.

The environment variables described above are the variables required by the respective deployments.

## Live Frontend

https://frontend-black-seven-vnxlt5gu4i.vercel.app

## Live Backend API

https://custodia-midk.onrender.com

Visiting the bare backend address will show a `404`.

This is expected because the backend is an Express API and does not serve a webpage from the root URL.

The health endpoint can be used to confirm that the backend is running:

https://custodia-midk.onrender.com/api/health

## Live Loom Walkthrough

https://www.loom.com/share/b4600191007e4da1bd014fb353504431

---

# Future Improvements

If I were to continue developing Custodia beyond the current project scope, I would add:

* An admin interface for creating and editing programmes
* An admin interface for creating and managing facilities
* More detailed reporting and analytics
* Email notifications for booking approvals and rejections
* Booking availability and conflict detection
* Pagination and filtering for the staff dashboard
* Automated frontend and backend tests
* Production-level monitoring and error logging

---

# Conclusion

Custodia was built to have the scope of a real client engagement, rather than just one isolated feature.

It forced me to think about schema design, authentication, access control, typed contracts between the frontend and backend, API development and deployment as parts of one system rather than treating each area in isolation.

Getting it running end to end also meant working through real problems along the way: mismatched environment variable names, a leaked secret key caught by GitHub's own protections, an empty database with nothing to show until I seeded it, and the everyday friction of running two servers and a database together.

None of that is necessarily visible in the finished interface, but it is exactly the kind of debugging, problem-solving and ownership that a real project requires.

Most importantly, this project gave me practical experience taking an application from a client scenario and idea through **database design, full-stack development, authentication, security, API integration, deployment and a working end-to-end product**.
