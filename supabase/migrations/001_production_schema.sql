-- SA Agent Marketplace — Production Schema
-- This migration creates all tables needed for a production-ready paid marketplace.

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. PROFILES (extends Supabase auth.users)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  plan text not null default 'free',
  stripe_customer_id text unique,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid());

-- Service role can do everything (used by webhooks, admin)
create policy "profiles_service_all" on public.profiles
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. STRIPE EVENTS (webhook idempotency)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists public.stripe_events (
  event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

-- Only service role writes to stripe_events
create policy "stripe_events_service_only" on public.stripe_events
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. SUBSCRIPTIONS
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan text not null,
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_self_select" on public.subscriptions
  for select using (user_id = auth.uid());

create policy "subscriptions_service_all" on public.subscriptions
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. AGENT CATALOG (server-side source of truth)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists public.agent_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null,
  status text not null default 'demo' check (status in ('live','beta','demo','coming_soon','disabled')),
  min_plan text not null default 'starter',
  risk_level text not null default 'low' check (risk_level in ('low','medium','high')),
  disclaimer_key text,
  capabilities jsonb not null default '[]'::jsonb,
  config jsonb not null default '{}'::jsonb,
  icon_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Agent catalog is public read
alter table public.agent_catalog enable row level security;

create policy "agent_catalog_public_read" on public.agent_catalog
  for select using (true);

create policy "agent_catalog_service_write" on public.agent_catalog
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. DEPLOYMENTS (user's active agent subscriptions)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists public.deployments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  agent_id uuid not null references public.agent_catalog(id),
  name text not null,
  status text not null default 'active',
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.deployments enable row level security;

create policy "deployments_self_select" on public.deployments
  for select using (user_id = auth.uid());

create policy "deployments_self_insert" on public.deployments
  for insert with check (user_id = auth.uid());

create policy "deployments_self_update" on public.deployments
  for update using (user_id = auth.uid());

create policy "deployments_service_all" on public.deployments
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. AGENT RUNS (execution history)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  agent_slug text not null,
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed','canceled')),
  input_summary text,
  output_summary text,
  tokens_used integer not null default 0,
  latency_ms integer,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.agent_runs enable row level security;

create policy "agent_runs_self_select" on public.agent_runs
  for select using (user_id = auth.uid());

create policy "agent_runs_service_all" on public.agent_runs
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. QBO SYNC JOBS (async QuickBooks accounting sync)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists public.qbo_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null,
  stripe_invoice_id text,
  status text not null default 'pending' check (status in ('pending','processing','completed','failed')),
  attempts integer not null default 0,
  last_error text,
  qbo_receipt_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  next_retry_at timestamptz,
  completed_at timestamptz
);

alter table public.qbo_sync_jobs enable row level security;

create policy "qbo_sync_service_only" on public.qbo_sync_jobs
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════════════════════
-- 8. WAITLIST / LEADS
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  last_name text,
  branch text,
  source text default 'website',
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

create policy "waitlist_service_only" on public.waitlist
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════════════════════
-- 9. INDEXES
-- ══════════════════════════════════════════════════════════════════════════════
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe on public.subscriptions(stripe_subscription_id);
create index if not exists idx_deployments_user on public.deployments(user_id);
create index if not exists idx_agent_runs_user on public.agent_runs(user_id);
create index if not exists idx_agent_runs_created on public.agent_runs(created_at desc);
create index if not exists idx_qbo_sync_status on public.qbo_sync_jobs(status) where status in ('pending', 'processing');
create index if not exists idx_agent_catalog_category on public.agent_catalog(category);
create index if not exists idx_agent_catalog_status on public.agent_catalog(status);

-- ══════════════════════════════════════════════════════════════════════════════
-- 10. PROFILE AUTO-CREATE TRIGGER
-- ══════════════════════════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger if any, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
