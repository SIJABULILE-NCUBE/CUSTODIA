-- i built this schema for Riverside Community Hub
-- it covers three things in one platform: membership, bookings and donations
-- i am using supabase auth for login, so this table extends auth.users with the extra info i need

-- STEP 1: profiles table
-- this holds the extra info about a person that supabase auth does not store for me
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'member' check (role in ('member', 'admin')),
  membership_status text not null default 'active' check (membership_status in ('active', 'inactive', 'pending')),
  created_at timestamptz not null default now()
);

-- STEP 2: programmes table
-- these are the youth programmes that Riverside runs, like after school coding or sports
create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  capacity int not null default 20,
  schedule text, -- i kept this as plain text for now, e.g. "Mon and Wed 3pm to 5pm"
  created_at timestamptz not null default now()
);

-- STEP 3: programme enrollments
-- this links a member to a programme, i split it out so i can count how many people joined
create table public.programme_enrollments (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid references public.programmes on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  created_at timestamptz not null default now(),
  unique (programme_id, user_id) -- this stops someone signing up twice for the same programme
);

-- STEP 4: facilities table
-- rooms, gym slots and equipment that people can book
create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('room', 'gym', 'equipment')),
  capacity int not null default 1,
  description text,
  created_at timestamptz not null default now()
);

-- STEP 5: bookings table
-- i store the actual time slot someone wants, then staff approve or reject it
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid references public.facilities on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  constraint valid_time_range check (end_time > start_time) -- this makes sure the booking actually makes sense
);

-- STEP 6: donations table
-- this covers both money donations and food parcel drop offs in one table
create table public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete set null, -- i allow this to be null for anonymous donors
  donor_name text not null,
  donor_email text,
  type text not null check (type in ('money', 'food_parcel')),
  amount numeric(10,2), -- only used when type is money
  item_description text, -- only used when type is food_parcel, e.g. "10kg maize meal, tinned beans"
  status text not null default 'received' check (status in ('received', 'processed', 'distributed')),
  created_at timestamptz not null default now()
);

-- STEP 7: turn on row level security
-- i am doing this on every table so people can only see what they are allowed to see
alter table public.profiles enable row level security;
alter table public.programmes enable row level security;
alter table public.programme_enrollments enable row level security;
alter table public.facilities enable row level security;
alter table public.bookings enable row level security;
alter table public.donations enable row level security;

-- helper function so i do not have to repeat this subquery in every policy
-- this checks if the currently logged in user has the admin role
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- PROFILES policies
-- anyone logged in can read their own profile, admins can read everyone
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- a person can only update their own profile, they cannot make themselves admin through this
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- PROGRAMMES policies
-- everyone can view programmes, this is public info on the site
create policy "programmes_select_all" on public.programmes
  for select using (true);

-- only admins can create, edit or remove programmes
create policy "programmes_admin_write" on public.programmes
  for all using (public.is_admin());

-- PROGRAMME ENROLLMENTS policies
-- a member can see their own enrollments, admins see all of them
create policy "enrollments_select_own_or_admin" on public.programme_enrollments
  for select using (auth.uid() = user_id or public.is_admin());

-- a member can enroll themselves, i check the user_id matches who is logged in
create policy "enrollments_insert_own" on public.programme_enrollments
  for insert with check (auth.uid() = user_id);

-- FACILITIES policies
-- everyone can view what facilities exist so they know what they can book
create policy "facilities_select_all" on public.facilities
  for select using (true);

create policy "facilities_admin_write" on public.facilities
  for all using (public.is_admin());

-- BOOKINGS policies
-- a member sees only their own bookings, admins see every booking for the reports
create policy "bookings_select_own_or_admin" on public.bookings
  for select using (auth.uid() = user_id or public.is_admin());

-- a member can request a booking for themselves
create policy "bookings_insert_own" on public.bookings
  for insert with check (auth.uid() = user_id);

-- only admins can approve, reject or edit a booking status
create policy "bookings_admin_update" on public.bookings
  for update using (public.is_admin());

-- DONATIONS policies
-- a logged in donor can see their own donation history, admins see everything for funder reports
create policy "donations_select_own_or_admin" on public.donations
  for select using (auth.uid() = user_id or public.is_admin());

-- anyone can create a donation record, even without an account, since donations can be anonymous
create policy "donations_insert_any" on public.donations
  for insert with check (true);

-- only admins can update donation status, e.g. moving it from received to distributed
create policy "donations_admin_update" on public.donations
  for update using (public.is_admin());

-- STEP 8: a trigger so a profile row gets created automatically when someone signs up
-- this saves me from having to manually insert a profile every time someone registers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'New Member'), new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
