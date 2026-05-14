-- RigCheck database schema
-- Safe to run multiple times (idempotent)

create extension if not exists "uuid-ossp";

-- Organizations (fleets)
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  plan text not null default 'free' check (plan in ('free','owner_op','small_fleet','mid_fleet','enterprise')),
  stripe_customer_id text unique,
  tier2_credits int not null default 0,
  created_at timestamptz not null default now()
);

-- User profiles (extends auth.users)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  org_id uuid references organizations(id),
  role text not null default 'member' check (role in ('owner','admin','member','driver')),
  created_at timestamptz not null default now()
);

-- Vehicles
create table if not exists vehicles (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id),
  vin text not null,
  year int,
  make text,
  model text,
  trim text,
  fleet_id text,
  odometer int,
  gvwr text,
  body_class text,
  color text,
  silhouette text not null default 'tractor' check (silhouette in ('tractor','box')),
  created_at timestamptz not null default now()
);

-- Estimates
create table if not exists estimates (
  id uuid primary key default uuid_generate_v4(),
  rc_number text unique not null default '',
  org_id uuid references organizations(id),
  vehicle_id uuid references vehicles(id),
  guest_session_id text,
  tier text not null default 'tier1' check (tier in ('tier1','tier2')),
  status text not null default 'pending' check (status in (
    'draft','pending','photos_pending','processing','ready','error',
    'sent_to_shop','quote_received','approved','repair_complete','closed'
  )),
  severity text check (severity in ('Minor','Moderate','Severe')),
  headline text,
  tier1_low int,
  tier1_high int,
  tier2_total int,
  confidence float,
  teardown boolean not null default false,
  hours float,
  labor_rate int not null default 149,
  notes text,
  hotspots jsonb default '[]',
  reasoning jsonb,
  stripe_payment_id text,
  ai_tokens_in int,
  ai_tokens_out int,
  incident_type text,
  incident_description text,
  incident_location text,
  incident_date text,
  incident_speed text,
  incident_fault text,
  incident_injuries text,
  incident_police boolean default false,
  airbags_deploy boolean not null default false,
  driveable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-generate RC number
create sequence if not exists estimate_rc_seq start 2400;

create or replace function set_rc_number()
returns trigger language plpgsql as $$
begin
  if new.rc_number is null or new.rc_number = '' then
    new.rc_number := 'RC-' || nextval('estimate_rc_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists estimate_rc_before_insert on estimates;
create trigger estimate_rc_before_insert
  before insert on estimates
  for each row execute function set_rc_number();

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists estimates_updated_at on estimates;
create trigger estimates_updated_at
  before update on estimates
  for each row execute function update_updated_at();

-- Line items
create table if not exists estimate_line_items (
  id uuid primary key default uuid_generate_v4(),
  estimate_id uuid not null references estimates(id) on delete cascade,
  part text not null,
  action text not null,
  severity text,
  confidence float,
  part_no text,
  part_cost int not null default 0,
  hours float not null default 0,
  labor_rate int not null default 149,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Photos
create table if not exists estimate_photos (
  id uuid primary key default uuid_generate_v4(),
  estimate_id uuid not null references estimates(id) on delete cascade,
  storage_path text not null,
  angle_label text,
  hash text,
  gps text,
  guest_session_id text,
  captured_at timestamptz not null default now()
);

-- Capture tokens (for SMS driver flow)
create table if not exists capture_tokens (
  id uuid primary key default uuid_generate_v4(),
  estimate_id uuid not null references estimates(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used boolean not null default false,
  driver_phone text,
  created_at timestamptz not null default now()
);

-- Nearby shops
create table if not exists shops (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text not null,
  rating float,
  rate int,
  distance int,
  lat float,
  lng float
);

-- Seed shops (skip if already present)
insert into shops (name, city, rating, rate, distance) values
  ('Blaine Brothers Heavy Truck Repair', 'Clearwater, MN', 4.6, 142, 18),
  ('OTR Performance — Fort Worth', 'Fort Worth, TX', 4.7, 155, 6),
  ('MJ Truck Nation Body Shop', 'Houston, TX', 4.3, 138, 42),
  ('TA Petro Truck Service #214', 'Sweetwater, TX', 4.0, 168, 73)
on conflict do nothing;

-- Row Level Security
alter table organizations enable row level security;
alter table users enable row level security;
alter table vehicles enable row level security;
alter table estimates enable row level security;
alter table estimate_line_items enable row level security;
alter table estimate_photos enable row level security;
alter table capture_tokens enable row level security;
alter table shops enable row level security;

-- RLS policies (drop first so re-runs don't error)
drop policy if exists "users: own profile" on users;
create policy "users: own profile" on users
  for all using (auth.uid() = id);

drop policy if exists "organizations: members" on organizations;
create policy "organizations: members" on organizations
  for select using (
    id in (select org_id from users where id = auth.uid())
  );

drop policy if exists "vehicles: org members" on vehicles;
create policy "vehicles: org members" on vehicles
  for all using (
    org_id in (select org_id from users where id = auth.uid())
  );

drop policy if exists "estimates: org members" on estimates;
create policy "estimates: org members" on estimates
  for all using (
    org_id in (select org_id from users where id = auth.uid())
    or guest_session_id = current_setting('request.headers', true)::json->>'x-guest-session'
  );

drop policy if exists "line_items: via estimate" on estimate_line_items;
create policy "line_items: via estimate" on estimate_line_items
  for all using (
    estimate_id in (
      select id from estimates where
        org_id in (select org_id from users where id = auth.uid())
        or guest_session_id = current_setting('request.headers', true)::json->>'x-guest-session'
    )
  );

drop policy if exists "photos: via estimate" on estimate_photos;
create policy "photos: via estimate" on estimate_photos
  for all using (
    estimate_id in (
      select id from estimates where
        org_id in (select org_id from users where id = auth.uid())
        or guest_session_id = current_setting('request.headers', true)::json->>'x-guest-session'
    )
  );

drop policy if exists "shops: public read" on shops;
create policy "shops: public read" on shops
  for select using (true);

drop policy if exists "capture_tokens: valid read" on capture_tokens;
create policy "capture_tokens: valid read" on capture_tokens
  for select using (
    expires_at > now() and not used
  );

-- Storage bucket for photos (skip if already exists)
insert into storage.buckets (id, name, public)
  values ('photos', 'photos', true)
  on conflict (id) do nothing;

drop policy if exists "photos: anyone can upload" on storage.objects;
create policy "photos: anyone can upload"
  on storage.objects for insert
  with check (bucket_id = 'photos');

drop policy if exists "photos: public read" on storage.objects;
create policy "photos: public read"
  on storage.objects for select
  using (bucket_id = 'photos');
