import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class SupabaseServerConfigError extends Error {
  constructor(message = "Supabase server configuration is missing.") {
    super(message);
    this.name = "SupabaseServerConfigError";
  }
}

export function isSupabaseServerConfigured(): boolean {
  return Boolean(readSupabaseUrl() && readServiceRoleKey());
}

export function createSupabaseServerClient(): SupabaseClient {
  const url = readSupabaseUrl();
  const serviceRoleKey = readServiceRoleKey();

  if (!url || !serviceRoleKey) {
    throw new SupabaseServerConfigError();
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function readSupabaseUrl(): string | undefined {
  const value = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  return normalizeEnvValue(value);
}

function readServiceRoleKey(): string | undefined {
  return normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
