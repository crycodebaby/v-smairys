"use client";

import React, { useActionState } from "react";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import {
  CAMPAIGN_DESTINATION_PATHS,
  type MarketingCampaign,
} from "@/lib/marketing-campaigns";
import type { CampaignActionState } from "../actions";

type CampaignFormAction = (
  prevState: CampaignActionState,
  formData: FormData
) => Promise<CampaignActionState>;

type CampaignFormProps = {
  mode: "create" | "edit";
  campaign?: MarketingCampaign;
  action: CampaignFormAction;
  archiveAction?: CampaignFormAction;
  disabled?: boolean;
  disabledReason?: string;
};

const INITIAL_STATE: CampaignActionState = { ok: false, message: "" };

export function CampaignForm({
  mode,
  campaign,
  action,
  archiveAction,
  disabled = false,
  disabledReason,
}: CampaignFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  const [archiveState, archiveFormAction, isArchiving] = useActionState(
    archiveAction ?? action,
    INITIAL_STATE
  );

  const isEdit = mode === "edit";
  const title = isEdit ? "Kampagne bearbeiten" : "Neue QR-Kampagne";
  const description = isEdit
    ? "Änderungen werden serverseitig in Supabase gespeichert."
    : "Legt eine neue Kampagne in Supabase an. Keine localStorage-Persistenz.";

  return (
    <GlassCard label={isEdit ? "CRUD" : "Builder"} title={title} description={description}>
      {disabled && disabledReason && (
        <p className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs leading-relaxed text-amber-100">
          {disabledReason}
        </p>
      )}

      <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {campaign?.id && <input type="hidden" name="id" value={campaign.id} />}

        <Field label="Interner Name" name="internal_name" defaultValue={campaign?.internalName} disabled={disabled} />
        <Field label="Externer Titel" name="external_title" defaultValue={campaign?.externalTitle} disabled={disabled} />
        <Field label="Slug" name="slug" defaultValue={campaign?.slug} disabled={disabled} placeholder="vk-sommer-saarmitte-2026" />
        <SelectField
          label="Status"
          name="status"
          defaultValue={campaign?.status ?? "draft"}
          disabled={disabled}
          options={[
            ["draft", "Entwurf"],
            ["active", "Live"],
            ["paused", "Pausiert"],
            ["archived", "Archiviert"],
          ]}
        />
        <DestinationField
          defaultValue={campaign?.destinationPath ?? "/"}
          disabled={disabled}
        />
        <Field label="Medium-Label" name="medium_label" defaultValue={campaign?.medium_label} disabled={disabled} placeholder="Visitenkarte" required={false} />
        <Field label="Region" name="region" defaultValue={campaign?.region} disabled={disabled} placeholder="Saarland" required={false} />
        <Field label="Stadt (optional)" name="city" defaultValue={campaign?.city} disabled={disabled} required={false} />
        <Field label="Jahr" name="year" type="number" defaultValue={campaign?.year?.toString()} disabled={disabled} placeholder="2026" required={false} />
        <Field label="Version" name="version" defaultValue={campaign?.version} disabled={disabled} placeholder="v1" required={false} />
        <Field label="UTM Source" name="utm_source" defaultValue={campaign?.utm_source} disabled={disabled} placeholder="visitenkarte" />
        <SelectField
          label="UTM Medium"
          name="utm_medium"
          defaultValue={campaign?.utm_medium ?? "print"}
          disabled={disabled}
          options={[
            ["print", "print"],
            ["qr", "qr"],
            ["email", "email"],
            ["social", "social"],
            ["referral", "referral"],
            ["offline", "offline"],
            ["video", "video"],
          ]}
        />
        <Field label="UTM Campaign" name="utm_campaign" defaultValue={campaign?.utm_campaign} disabled={disabled} placeholder="vk-sommer-saarmitte-2026" />
        <Field label="UTM Content" name="utm_content" defaultValue={campaign?.utm_content} disabled={disabled} placeholder="qr-v1" />
        <Field label="UTM Term (optional)" name="utm_term" defaultValue={campaign?.utm_term} disabled={disabled} required={false} />

        <label className="md:col-span-2">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
            Notizen
          </span>
          <textarea
            name="notes"
            defaultValue={campaign?.notes}
            disabled={disabled}
            rows={3}
            className={inputClassName}
          />
        </label>

        <div className="flex flex-col gap-2 md:col-span-2 sm:flex-row sm:items-center">
          <GlassButton
            type="submit"
            size="sm"
            variant="solid"
            disabled={disabled || isPending}
          >
            {isPending ? "Speichert..." : isEdit ? "Speichern" : "Erstellen"}
          </GlassButton>
          {state.message && (
            <p className={state.ok ? successClassName : errorClassName}>
              {state.message}
            </p>
          )}
        </div>
      </form>

      {isEdit && campaign?.id && archiveAction && (
        <form action={archiveFormAction} className="mt-4 border-t border-white/10 pt-4">
          <input type="hidden" name="id" value={campaign.id} />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <GlassButton
              type="submit"
              size="sm"
              variant="subtle"
              className="border-rose-400/30 bg-rose-400/10 text-rose-100 hover:border-rose-300/50 hover:bg-rose-400/15"
              disabled={disabled || isArchiving || campaign.status === "archived"}
            >
              {isArchiving ? "Archiviert..." : "Archivieren"}
            </GlassButton>
            {archiveState.message && (
              <p className={archiveState.ok ? successClassName : errorClassName}>
                {archiveState.message}
              </p>
            )}
          </div>
        </form>
      )}
    </GlassCard>
  );
}

function DestinationField({
  defaultValue,
  disabled,
}: {
  defaultValue: string;
  disabled?: boolean;
}) {
  const options: [string, string][] = CAMPAIGN_DESTINATION_PATHS.map((entry) => [
    entry.path,
    `${entry.label} (${entry.path})`,
  ]);
  const hasCustom = !options.some(([path]) => path === defaultValue);
  if (hasCustom) {
    options.unshift([defaultValue, `Aktuell (${defaultValue})`]);
  }

  return (
    <SelectField
      label="Zielseite"
      name="destination_path"
      defaultValue={defaultValue}
      disabled={disabled}
      options={options}
    />
  );
}

function Field({
  label,
  name,
  defaultValue,
  disabled,
  required = true,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "number";
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={inputClassName}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  disabled,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  disabled?: boolean;
  options: readonly [string, string][];
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className={inputClassName}
      >
        {options.map(([value, labelText]) => (
          <option key={value} value={value}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

const inputClassName =
  "block w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-foreground " +
  "placeholder:text-foreground/35 transition-colors focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/20 " +
  "disabled:cursor-not-allowed disabled:opacity-55";

const successClassName = "text-xs text-emerald-200";
const errorClassName = "text-xs text-rose-200";
