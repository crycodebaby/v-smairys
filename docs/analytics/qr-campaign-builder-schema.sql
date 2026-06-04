-- QR Campaign Builder MVP schema for Supabase/Postgres.
--
-- This is a preparation file only. The current app does not yet include a
-- Supabase client or server-side persistence layer. Do not run partial app code
-- against this schema until the Supabase project, service-role env vars and
-- protected server actions/routes are wired up.

create table if not exists public.marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  internal_name text not null,
  external_title text not null,
  status text not null default 'draft',
  destination_path text not null,
  utm_source text not null,
  utm_medium text not null default 'print',
  utm_campaign text not null,
  utm_content text not null,
  utm_term text,
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
      and destination_path not like '/api%'
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
      and length(trim(utm_content)) > 0
    )
);

create index if not exists marketing_campaigns_status_idx
  on public.marketing_campaigns (status);

create index if not exists marketing_campaigns_utm_campaign_idx
  on public.marketing_campaigns (utm_campaign);

-- Datensparsame technische Shortlink-Zählung.
-- Keine IP, kein User-Agent, kein Fingerprinting, keine Profile.
create table if not exists public.qr_redirect_daily_counts (
  slug text not null references public.marketing_campaigns (slug) on delete cascade,
  date date not null,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (slug, date),
  constraint qr_redirect_daily_counts_count_non_negative_check
    check (count >= 0)
);

-- Suggested increment statement for a future server-side /go/[slug] handler:
--
-- insert into public.qr_redirect_daily_counts (slug, date, count)
-- values ($1, current_date, 1)
-- on conflict (slug, date)
-- do update set
--   count = public.qr_redirect_daily_counts.count + 1,
--   updated_at = now();
--
-- RLS recommendation:
-- - Enable RLS.
-- - No public/browser write access.
-- - Read/write only through protected server code using server-side Supabase
--   credentials. The current PIN gate protects /intern/*, but DB credentials
--   must still never be shipped to the client.
