-- lib/db/schema.sql
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  password_hash text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  branding jsonb not null default '{
    "logoUrl": null,
    "primaryColor": "#F5A623",
    "font": "fraunces",
    "radius": "soft",
    "theme": "dark"
  }'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  place_name text not null,
  lat double precision not null,
  lon double precision not null,
  created_at timestamptz not null default now(),
  unique (user_id, lat, lon)
);

create table if not exists weather_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  lat double precision not null,
  lon double precision not null,
  place_name text not null,
  temperature double precision not null,
  weather_code int not null,
  humidity double precision,
  wind_speed double precision,
  recorded_at timestamptz not null default now()
);
create index if not exists idx_snapshots_user_time on weather_snapshots (user_id, recorded_at desc);
create index if not exists idx_snapshots_location on weather_snapshots (lat, lon, recorded_at desc);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  label text not null,
  lat double precision not null,
  lon double precision not null,
  place_name text not null,
  condition text not null,
  threshold double precision not null,
  active boolean not null default true,
  last_triggered_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_alerts_active on alerts (active) where active = true;

alter table users enable row level security;
alter table favorites enable row level security;
alter table weather_snapshots enable row level security;
alter table alerts enable row level security;

create policy "deny all by default - users" on users for all using (false);
create policy "deny all by default - favorites" on favorites for all using (false);
create policy "deny all by default - snapshots" on weather_snapshots for all using (false);
create policy "deny all by default - alerts" on alerts for all using (false);