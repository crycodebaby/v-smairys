"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { GlassSheet } from "@/components/ui/glass/GlassSheet";
import { DashButton } from "@/components/intern/DashButton";
import { GlassSegmented, type SegmentedOption } from "@/components/ui/glass/GlassSegmented";
import { GlassListbox } from "@/components/ui/glass/GlassListbox";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import {
  ALLOWED_CAMPAIGN_DESTINATION_PATHS,
  CAMPAIGN_DESTINATION_PATHS,
  slugify,
  type CampaignStatus,
  type MarketingCampaign,
  type UtmMedium,
} from "@/lib/marketing-campaigns";
import type { CampaignBuilderPreset } from "@/lib/campaign-builder-presets-db";
import {
  deriveFields,
  deriveDuplicate,
  type BuilderSelection,
} from "./builder-presets";
import { BuilderPresetField } from "./BuilderPresetField";
import type { CampaignActionState, PresetActionState } from "../actions";

type BuilderMode = "create" | "edit" | "duplicate";

type BuilderAction = (
  prevState: CampaignActionState,
  formData: FormData
) => Promise<CampaignActionState>;

type PresetAction = (
  prevState: PresetActionState,
  formData: FormData
) => Promise<PresetActionState>;

type CampaignBuilderProps = {
  open: boolean;
  mode: BuilderMode;
  campaign?: MarketingCampaign;
  action: BuilderAction;
  createPresetAction: PresetAction;
  deactivatePresetAction: PresetAction;
  presets: readonly CampaignBuilderPreset[];
  onClose: () => void;
  disabled?: boolean;
  disabledReason?: string;
};

const SHEET_COPY: Record<BuilderMode, { title: string; description: string; submit: string }> = {
  create: {
    title: "Neue QR-Kampagne",
    description: "Presets auswählen oder eigene Wörter anlegen.",
    submit: "Kampagne anlegen",
  },
  edit: {
    title: "QR-Kampagne bearbeiten",
    description: "Ändert die ausgewählte Kampagne.",
    submit: "Speichern",
  },
  duplicate: {
    title: "QR-Kampagne duplizieren",
    description: "Erstellt eine neue Kampagne – Original bleibt unverändert.",
    submit: "Duplikat anlegen",
  },
};

const INITIAL_STATE: CampaignActionState = { ok: false, message: "" };

const STATUS_OPTIONS: SegmentedOption<CampaignStatus>[] = [
  { value: "draft", label: "Entwurf", tone: "draft" },
  { value: "active", label: "Live", tone: "live" },
  { value: "paused", label: "Pause", tone: "pause" },
  { value: "archived", label: "Archiv", tone: "archiv" },
];

const DESTINATION_OPTIONS = CAMPAIGN_DESTINATION_PATHS.map((entry) => ({
  value: entry.path,
  label: entry.label,
  hint: entry.path,
}));

const UTM_MEDIUM_OPTIONS = [
  { value: "print", label: "print" },
  { value: "qr", label: "qr" },
  { value: "email", label: "email" },
  { value: "social", label: "social" },
  { value: "referral", label: "referral" },
  { value: "offline", label: "offline" },
  { value: "video", label: "video" },
];

export function CampaignBuilder({
  open,
  mode,
  campaign,
  action,
  createPresetAction,
  deactivatePresetAction,
  presets: initialPresets,
  onClose,
  disabled = false,
  disabledReason,
}: CampaignBuilderProps) {
  const formId = useId();
  const isEdit = mode === "edit";
  const isDuplicate = mode === "duplicate";
  const isCreate = mode === "create";
  const copy = SHEET_COPY[mode];
  const currentYear = new Date().getFullYear();

  const [state, formAction, isPending] = React.useActionState(action, INITIAL_STATE);
  const [localPresets, setLocalPresets] = useState<readonly CampaignBuilderPreset[]>(initialPresets);

  const [mediumValue, setMediumValue] = useState<string | null>(null);
  const [topicValue, setTopicValue] = useState<string | null>(null);
  const [regionValue, setRegionValue] = useState<string | null>(null);
  const [version, setVersion] = useState("v1");
  const [year, setYear] = useState<number>(currentYear);

  const [externalTitle, setExternalTitle] = useState("");
  const [status, setStatus] = useState<CampaignStatus>("draft");
  const [destinationPath, setDestinationPath] = useState("/");
  const [notes, setNotes] = useState("");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [override, setOverride] = useState<Partial<Record<string, string>>>({});
  const [city, setCity] = useState("");
  const [customDestination, setCustomDestination] = useState("");

  useEffect(() => {
    setLocalPresets(initialPresets);
  }, [initialPresets]);

  useEffect(() => {
    if (!open) return;

    if (isEdit && campaign) {
      const dest = campaign.destinationPath ?? "/";
      const isAllowed = ALLOWED_CAMPAIGN_DESTINATION_PATHS.includes(
        dest as (typeof ALLOWED_CAMPAIGN_DESTINATION_PATHS)[number]
      );
      setExternalTitle(campaign.externalTitle ?? "");
      setStatus(campaign.status);
      setDestinationPath(isAllowed ? dest : "/");
      setCustomDestination(isAllowed ? "" : dest);
      setNotes(campaign.notes ?? "");
      setCity(campaign.city ?? "");
      setYear(campaign.year ?? currentYear);
      setVersion(campaign.version ?? "v1");
      setOverride({
        internal_name: campaign.internalName,
        slug: campaign.slug,
        utm_source: campaign.utm_source,
        utm_medium: campaign.utm_medium,
        utm_campaign: campaign.utm_campaign,
        utm_content: campaign.utm_content,
        medium_label: campaign.medium_label ?? "",
        region: campaign.region ?? "",
      });
      setShowAdvanced(!isAllowed);
    } else if (isDuplicate && campaign) {
      const dup = deriveDuplicate(campaign);
      setExternalTitle(campaign.externalTitle ?? "");
      setStatus("draft");
      setDestinationPath(
        ALLOWED_CAMPAIGN_DESTINATION_PATHS.includes(
          campaign.destinationPath as (typeof ALLOWED_CAMPAIGN_DESTINATION_PATHS)[number]
        )
          ? campaign.destinationPath
          : "/"
      );
      setCustomDestination("");
      setNotes(campaign.notes ?? "");
      setCity(campaign.city ?? "");
      setYear(campaign.year ?? currentYear);
      setVersion(dup.version);
      setOverride({
        internal_name: dup.internal_name,
        slug: dup.slug,
        utm_source: campaign.utm_source,
        utm_medium: campaign.utm_medium,
        utm_campaign: dup.utm_campaign,
        utm_content: dup.utm_content,
        medium_label: campaign.medium_label ?? "",
        region: campaign.region ?? "",
      });
      setShowAdvanced(true);
    } else {
      setExternalTitle("");
      setStatus("draft");
      setDestinationPath("/");
      setCustomDestination("");
      setNotes("");
      setCity("");
      setYear(currentYear);
      setVersion("v1");
      setMediumValue(null);
      setTopicValue(null);
      setRegionValue(null);
      setOverride({});
      setShowAdvanced(false);
    }
  }, [open, isEdit, isDuplicate, campaign, currentYear]);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  const pick = (category: CampaignBuilderPreset["category"], value: string | null) =>
    value ? localPresets.find((p) => p.category === category && p.value === value) : undefined;

  const selection: BuilderSelection = useMemo(() => {
    const medium = pick("medium", mediumValue);
    const topic = pick("topic", topicValue);
    const region = pick("region", regionValue);
    return {
      medium: medium ? { label: medium.label, value: medium.value } : undefined,
      topic: topic ? { label: topic.label, value: topic.value } : undefined,
      region: region ? { label: region.label, value: region.value } : undefined,
      year,
      version,
    };
  }, [localPresets, mediumValue, topicValue, regionValue, year, version]);

  const derived = deriveFields(selection);

  const eff = (key: keyof typeof derived): string =>
    override[key] !== undefined ? (override[key] as string) : derived[key];

  const effMediumLabel =
    override.medium_label !== undefined
      ? override.medium_label
      : selection.medium?.label ?? "";
  const effRegion =
    override.region !== undefined ? override.region : selection.region?.label ?? "";

  const usesCustomDestination = showAdvanced && customDestination.trim().length > 0;
  const effectiveDestination = usesCustomDestination ? customDestination.trim() : destinationPath;

  const setOv = (key: string, value: string) =>
    setOverride((prev) => ({ ...prev, [key]: value }));

  const handlePresetCreated = (preset: CampaignBuilderPreset) => {
    setLocalPresets((prev) => {
      if (prev.some((p) => p.id === preset.id)) return prev;
      return [...prev, preset].sort(
        (a, b) =>
          a.category.localeCompare(b.category) ||
          a.sort_order - b.sort_order ||
          a.label.localeCompare(b.label)
      );
    });
  };

  const handlePresetRemoved = (presetId: string) => {
    setLocalPresets((prev) => prev.filter((preset) => preset.id !== presetId));
  };

  const yearOptions = [
    { value: String(currentYear), label: String(currentYear) },
    { value: String(currentYear + 1), label: String(currentYear + 1) },
  ];

  return (
    <GlassSheet
      open={open}
      onClose={onClose}
      title={copy.title}
      description={copy.description}
      footer={
        <>
          <DashButton type="button" variant="ghost" size="sm" onClick={onClose}>
            Abbrechen
          </DashButton>
          <DashButton
            type="submit"
            form={formId}
            variant="primary"
            size="sm"
            disabled={disabled || isPending}
          >
            {isPending ? "Speichert…" : copy.submit}
          </DashButton>
        </>
      }
    >
      {disabled && disabledReason && (
        <p className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs leading-relaxed text-amber-100">
          {disabledReason}
        </p>
      )}

      {isDuplicate && (
        <p className="mb-4 rounded-xl border border-[hsl(var(--brand)/0.35)] bg-[hsl(var(--brand)/0.1)] px-4 py-3 text-xs leading-relaxed text-foreground/85">
          Erstellt eine <strong className="font-semibold">neue</strong> Kampagne – das Original
          bleibt unverändert.
        </p>
      )}

      <form id={formId} action={formAction} className="intern-scrollbar flex flex-col gap-5">
        {isEdit && campaign?.id && <input type="hidden" name="id" value={campaign.id} />}

        <input type="hidden" name="internal_name" value={eff("internal_name")} />
        <input type="hidden" name="slug" value={eff("slug")} />
        <input type="hidden" name="utm_source" value={eff("utm_source")} />
        <input type="hidden" name="utm_medium" value={eff("utm_medium")} />
        <input type="hidden" name="utm_campaign" value={eff("utm_campaign")} />
        <input type="hidden" name="utm_content" value={eff("utm_content")} />
        <input type="hidden" name="medium_label" value={effMediumLabel} />
        <input type="hidden" name="region" value={effRegion} />
        <input type="hidden" name="city" value={city} />
        <input type="hidden" name="year" value={year ? String(year) : ""} />
        <input type="hidden" name="version" value={version} />
        <input type="hidden" name="destination_path" value={effectiveDestination} />
        <input
          type="hidden"
          name="allow_custom_destination"
          value={usesCustomDestination ? "true" : "false"}
        />

        {/* 1–3: Titel, Status, Ziel */}
        <FieldBlock label="Externer Titel">
          <input
            name="external_title"
            value={externalTitle}
            onChange={(e) => setExternalTitle(e.target.value)}
            placeholder="Deine neue Website – Sommer 2026"
            required
            className={inputClass}
          />
        </FieldBlock>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldBlock label="Status">
            <GlassSegmented
              ariaLabel="Status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
            />
            <input type="hidden" name="status" value={status} />
          </FieldBlock>

          <FieldBlock label="Zielseite">
            <GlassListbox
              ariaLabel="Zielseite"
              options={DESTINATION_OPTIONS}
              value={destinationPath}
              onChange={setDestinationPath}
            />
          </FieldBlock>
        </div>

        {/* 4–8: Dynamische Presets (nur Create) */}
        {isCreate && (
          <section className="grid grid-cols-1 gap-4">
            <BuilderPresetField
              category="medium"
              title="Medium"
              hint="Quelle des Print-Kontakts"
              presets={localPresets}
              value={mediumValue}
              onChange={setMediumValue}
              onPresetCreated={handlePresetCreated}
              onPresetRemoved={handlePresetRemoved}
              createPresetAction={createPresetAction}
              deactivatePresetAction={deactivatePresetAction}
              disabled={disabled}
            />
            <BuilderPresetField
              category="region"
              title="Region"
              hint="Ort oder Gebiet der Verteilung"
              presets={localPresets}
              value={regionValue}
              onChange={setRegionValue}
              onPresetCreated={handlePresetCreated}
              onPresetRemoved={handlePresetRemoved}
              createPresetAction={createPresetAction}
              deactivatePresetAction={deactivatePresetAction}
              disabled={disabled}
            />
            <BuilderPresetField
              category="topic"
              title="Thema"
              hint="Saison, Angebot oder Kontext"
              presets={localPresets}
              value={topicValue}
              onChange={setTopicValue}
              onPresetCreated={handlePresetCreated}
              onPresetRemoved={handlePresetRemoved}
              createPresetAction={createPresetAction}
              deactivatePresetAction={deactivatePresetAction}
              disabled={disabled}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldBlock label="Jahr">
                <div className="flex flex-wrap items-center gap-2">
                  <ChipRow
                    ariaLabel="Jahr"
                    options={yearOptions}
                    value={String(year)}
                    onChange={(v) => setYear(Number(v))}
                  />
                  <input
                    type="number"
                    value={year || ""}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className={inputClass + " h-10 w-24"}
                    min={2000}
                    max={2100}
                  />
                </div>
              </FieldBlock>

              <BuilderPresetField
                category="version"
                title="Version"
                hint="z. B. v1, v2, test-a"
                presets={localPresets}
                value={version}
                onChange={(next) => setVersion(next ?? "v1")}
                onPresetCreated={handlePresetCreated}
                onPresetRemoved={handlePresetRemoved}
                createPresetAction={createPresetAction}
                deactivatePresetAction={deactivatePresetAction}
                disabled={disabled}
              />
            </div>
          </section>
        )}

        {/* Abgeleitete Werte – kompakt */}
        <section className="flex flex-col gap-2">
          <SectionTitle>Automatisch abgeleitet</SectionTitle>
          <GlassPanel emphasis="subtle" className="grid grid-cols-1 gap-1.5 px-3 py-3 sm:grid-cols-2">
            <PreviewRow label="internal_name" value={eff("internal_name")} />
            <PreviewRow label="slug" value={eff("slug")} mono />
            <PreviewRow label="utm_campaign" value={eff("utm_campaign")} mono />
            <PreviewRow label="utm_source" value={eff("utm_source")} mono />
            <PreviewRow label="utm_medium" value={eff("utm_medium")} mono />
            <PreviewRow label="utm_content" value={eff("utm_content")} mono />
          </GlassPanel>
        </section>

        {/* Erweitert – standardmäßig zu */}
        <section className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            aria-expanded={showAdvanced}
            className="flex items-center justify-between gap-3 text-left opacity-70 hover:opacity-100"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/45">
              Erweitert · manuell überschreiben
            </span>
            <Chevron open={showAdvanced} />
          </button>

          {showAdvanced && (
            <div className="animate-panel-in grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AdvancedField
                label="Interner Name"
                value={eff("internal_name")}
                onChange={(v) => setOv("internal_name", v)}
              />
              <AdvancedField label="Slug" value={eff("slug")} onChange={(v) => setOv("slug", slugify(v))} mono />
              <AdvancedField
                label="UTM Source"
                value={eff("utm_source")}
                onChange={(v) => setOv("utm_source", v)}
                mono
              />
              <FieldBlock label="UTM Medium">
                <GlassListbox
                  ariaLabel="UTM Medium"
                  options={UTM_MEDIUM_OPTIONS}
                  value={eff("utm_medium")}
                  onChange={(v) => setOv("utm_medium", v as UtmMedium)}
                />
              </FieldBlock>
              <AdvancedField
                label="UTM Campaign"
                value={eff("utm_campaign")}
                onChange={(v) => setOv("utm_campaign", slugify(v))}
                mono
              />
              <AdvancedField
                label="UTM Content"
                value={eff("utm_content")}
                onChange={(v) => setOv("utm_content", v)}
                mono
              />
              <AdvancedField
                label="Medium-Label"
                value={effMediumLabel}
                onChange={(v) => setOv("medium_label", v)}
              />
              <AdvancedField label="Region" value={effRegion} onChange={(v) => setOv("region", v)} />
              <AdvancedField label="Stadt (optional)" value={city} onChange={setCity} />
              <div className="sm:col-span-2">
                <FieldBlock label="Freie Zielseite (nur Advanced)">
                  <input
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    placeholder="/leistungen/webseiten"
                    className={inputClass + " font-mono text-xs"}
                  />
                  <p className="mt-1 text-[10px] text-foreground/40">
                    Interne Ziele werden serverseitig blockiert. Leer lassen = Auswahl oben.
                  </p>
                </FieldBlock>
              </div>
              <div className="sm:col-span-2">
                <DashButton type="button" variant="ghost" size="sm" onClick={() => setOverride({})}>
                  Aus Presets neu ableiten
                </DashButton>
              </div>
            </div>
          )}
        </section>

        <FieldBlock label="Notizen (optional)">
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </FieldBlock>

        {state.message && !state.ok && (
          <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-100">
            {state.message}
          </p>
        )}
      </form>
    </GlassSheet>
  );
}

function ChipRow({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={
              "h-9 rounded-full border px-3.5 text-xs font-medium transition-all duration-200 " +
              (active
                ? "border-[hsl(var(--brand)/0.5)] bg-[hsl(var(--brand)/0.14)] text-foreground"
                : "border-white/10 bg-white/[0.04] text-foreground/70 hover:border-white/20 hover:bg-white/[0.08]")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
      {children}
    </h3>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-foreground/70">{label}</span>
      {children}
    </label>
  );
}

function AdvancedField({
  label,
  value,
  onChange,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
}) {
  return (
    <FieldBlock label={label}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass + (mono ? " font-mono text-xs" : "")}
      />
    </FieldBlock>
  );
}

function PreviewRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1.5">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/40">
        {label}
      </span>
      <span
        className={
          "min-w-0 truncate text-right text-[11px] " +
          (value ? "text-foreground/80" : "text-foreground/30") +
          (mono ? " font-mono" : "")
        }
      >
        {value || "—"}
      </span>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="14"
      height="14"
      aria-hidden="true"
      className={"text-foreground/45 transition-transform duration-200 " + (open ? "rotate-180" : "")}
    >
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
    </svg>
  );
}

const inputClass =
  "block w-full rounded-xl border border-white/12 bg-white/[0.05] px-3.5 py-2.5 text-sm text-foreground " +
  "placeholder:text-foreground/35 backdrop-blur-xl transition-colors " +
  "focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/20 " +
  "disabled:cursor-not-allowed disabled:opacity-55";
