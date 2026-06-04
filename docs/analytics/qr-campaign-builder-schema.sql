-- QR Campaign Builder MVP schema for Supabase/Postgres.
--
-- Manual step: run this block in the Supabase SQL Editor (or via MCP
-- apply_migration) before enabling dashboard CRUD. The app uses a server-side
-- service role key only; never expose service credentials to the browser.

create table if not exists public.marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  internal_name text not null,
  external_title text not null,
  slug text not null unique,
  status text not null default 'draft',
  destination_path text not null default '/',
  utm_source text not null,
  utm_medium text not null default 'print',
  utm_campaign text not null,
  utm_content text,
  utm_term text,
  medium_label text,
  region text,
  city text,
  year integer,
  version text,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint marketing_campaigns_status_check
    check (status in ('draft', 'active', 'paused', 'archived')),
  constraint marketing_campaigns_slug_kebab_check
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint marketing_campaigns_utm_campaign_kebab_check
    check (utm_campaign ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint marketing_campaigns_destination_relative_check
    check (destination_path like '/%'),
  constraint marketing_campaigns_destination_not_internal_check
    check (
      destination_path not like '/intern%'
      and destination_path not like '/kundenlogin%'
      and destination_path not like '/login%'
    ),
  constraint marketing_campaigns_required_non_empty_check
    check (
      length(trim(slug)) > 0
      and length(trim(internal_name)) > 0
      and length(trim(external_title)) > 0
      and length(trim(destination_path)) > 0
      and length(trim(utm_source)) > 0
      and length(trim(utm_medium)) > 0
      and length(trim(utm_campaign)) > 0
    ),
  constraint marketing_campaigns_active_required_check
    check (
      status <> 'active'
      or (
        length(trim(slug)) > 0
        and length(trim(internal_name)) > 0
        and length(trim(external_title)) > 0
        and length(trim(destination_path)) > 0
        and length(trim(utm_source)) > 0
        and length(trim(utm_medium)) > 0
        and length(trim(utm_campaign)) > 0
        and utm_content is not null
        and length(trim(utm_content)) > 0
      )
    )
);

create index if not exists marketing_campaigns_status_idx
  on public.marketing_campaigns (status);

create index if not exists marketing_campaigns_utm_campaign_idx
  on public.marketing_campaigns (utm_campaign);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from anon;
revoke execute on function public.set_updated_at() from authenticated;
revoke execute on function public.set_updated_at() from public;

drop trigger if exists marketing_campaigns_set_updated_at
  on public.marketing_campaigns;

create trigger marketing_campaigns_set_updated_at
before update on public.marketing_campaigns
for each row
execute function public.set_updated_at();

-- Optional: datensparsame technische Shortlink-Zählung (nicht im Dashboard).
-- Keine IP, kein User-Agent, kein Fingerprinting, keine Profile.
create table if not exists public.qr_redirect_daily_counts (
  campaign_slug text not null references public.marketing_campaigns (slug) on delete cascade,
  date date not null,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (campaign_slug, date),
  constraint qr_redirect_daily_counts_count_non_negative_check
    check (count >= 0)
);

create or replace function public.increment_qr_redirect_daily_count(
  campaign_slug_input text
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.qr_redirect_daily_counts (campaign_slug, date, count)
  values (campaign_slug_input, current_date, 1)
  on conflict (campaign_slug, date)
  do update set
    count = public.qr_redirect_daily_counts.count + 1,
    updated_at = now();
$$;

-- Datensparsame Zähl-RPC nicht öffentlich aufrufbar machen.
revoke execute on function public.increment_qr_redirect_daily_count(text) from anon;
revoke execute on function public.increment_qr_redirect_daily_count(text) from authenticated;
revoke execute on function public.increment_qr_redirect_daily_count(text) from public;

alter table public.marketing_campaigns enable row level security;
alter table public.qr_redirect_daily_counts enable row level security;

-- Keine öffentlichen Policies: Zugriff nur über serverseitigen Service Role.
