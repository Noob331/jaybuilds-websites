-- JAYBUILDS.IN business management database
-- Run in Supabase Dashboard > SQL Editor after creating a Supabase project.
-- Admin access is controlled by public.admin_users and Supabase Auth.
-- Never put a Supabase secret/service_role key in browser code.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Admin',
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  company_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  email text,
  phone text,
  business_name text,
  service_type text not null default 'Website development',
  budget text,
  message text,
  source text not null default 'website',
  status text not null default 'new'
    check (status in ('new','contacted','qualified','quoted','won','lost','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  enquiry_id uuid references public.enquiries(id) on delete set null,
  project_name text not null,
  service_type text not null default 'Website development',
  status text not null default 'lead'
    check (status in ('lead','planning','in_progress','review','completed','on_hold','cancelled')),
  start_date date,
  due_date date,
  live_url text,
  repository_url text,
  scope_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  details text,
  visible_to_customer boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid references public.enquiries(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  quote_number text not null unique default ('JAY-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'INR',
  description text,
  status text not null default 'draft'
    check (status in ('draft','sent','accepted','rejected','expired')),
  valid_until date,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'INR',
  payment_method text,
  payment_reference text,
  status text not null default 'pending'
    check (status in ('pending','paid','failed','refunded','cancelled')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  details text,
  status text not null default 'todo'
    check (status in ('todo','in_progress','done','blocked')),
  priority text not null default 'normal'
    check (priority in ('low','normal','high','urgent')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_status_created_idx on public.enquiries(status, created_at desc);
create index if not exists projects_status_created_idx on public.projects(status, created_at desc);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists tasks_project_status_idx on public.tasks(project_id, status);

-- Helper checks whether the signed-in user is explicitly listed as an admin.
create or replace function public.is_jaybuilds_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_jaybuilds_admin() from public;
grant execute on function public.is_jaybuilds_admin() to authenticated;

-- Enable RLS on every business table.
alter table public.admin_users enable row level security;
alter table public.customers enable row level security;
alter table public.enquiries enable row level security;
alter table public.projects enable row level security;
alter table public.project_updates enable row level security;
alter table public.quotes enable row level security;
alter table public.payments enable row level security;
alter table public.tasks enable row level security;

-- Remove broad default access first.
revoke all on public.admin_users, public.customers, public.enquiries,
  public.projects, public.project_updates, public.quotes, public.payments,
  public.tasks from anon, authenticated;

-- Public visitors may submit an enquiry only; they cannot read or alter enquiries.
grant insert on public.enquiries to anon, authenticated;

-- Signed-in users only get business-management access if they are allow-listed admins.
grant select, insert, update, delete on public.admin_users, public.customers,
  public.enquiries, public.projects, public.project_updates, public.quotes,
  public.payments, public.tasks to authenticated;

drop policy if exists "Admins can read admin list" on public.admin_users;
create policy "Admins can read admin list" on public.admin_users
  for select to authenticated using (public.is_jaybuilds_admin());

drop policy if exists "Public can submit a new enquiry" on public.enquiries;
create policy "Public can submit a new enquiry" on public.enquiries
  for insert to anon, authenticated
  with check (
    status = 'new'
    and length(trim(customer_name)) between 2 and 120
    and (email is null or length(email) <= 254)
    and (phone is null or length(phone) <= 30)
    and length(trim(message)) <= 5000
  );

-- Admin-only access to internal business records.
do $$
declare t text;
begin
  foreach t in array array['customers','enquiries','projects','project_updates','quotes','payments','tasks']
  loop
    execute format('drop policy if exists %I on public.%I', 'Admins manage ' || t, t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_jaybuilds_admin()) with check (public.is_jaybuilds_admin())',
      'Admins manage ' || t, t
    );
  end loop;
end $$;

-- Admin users are added manually from the SQL Editor after creating their Auth account.
-- Example (replace with the real Auth user UUID; do not use a made-up UUID):
-- insert into public.admin_users (user_id, display_name)
-- values ('YOUR-AUTH-USER-UUID', 'Jay')
-- on conflict (user_id) do update set display_name = excluded.display_name;
