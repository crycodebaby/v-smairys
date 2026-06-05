"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { GlassSheet } from "@/components/ui/glass/GlassSheet";
import { DashButton } from "@/components/intern/DashButton";
import { GlassSegmented, type SegmentedOption } from "@/components/ui/glass/GlassSegmented";
import { GlassListbox, type ListboxOption } from "@/components/ui/glass/GlassListbox";
import { ChipGroup } from "@/components/ui/glass/ChipGroup";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import {
  CAMPAIGN_DESTINATION_PATHS,
  slugify,
  type CampaignStatus,
  type MarketingCampaign,
  type UtmMedium,
} from "@/lib/marketing-campaigns";
import {
  MEDIUM_PRESETS,
  THEME_PRESETS,
  REGION_PRESETS,
  THEME_CUSTOM,
  REGION_CUSTOM,
  toInternalToken,
  deriveFields,
  deriveDuplicate,
  type BuilderSelection,
} from "./builder-presets";
import type { CampaignActionState } from "../actions";

type BuilderMode = "create" | "edit" | "duplicate";

type BuilderAction = (
  prevState: CampaignActionState,
  formData: FormData
) => Promise<CampaignActionState>;

type CampaignBuilderProps = {
  open: boolean;
  mode: BuilderMode;
  campaign?: MarketingCampaign;
  action: BuilderAction;
  archiveAction?: BuilderAction;
  onClose: () => void;
  disabled?: boolean;
  disabledReason?: string;
};

const SHEET_COPY: Record<BuilderMode, { title: string; description: string; submit: string }> = {
  create: {
    title: "Neue QR-Kampagne",
    description: "Erstellt eine neue Kampagne in Supabase.",
    submit: "Kampagne anlegen",
  },
  edit: {
    title: "QR-Kampagne bearbeiten",
    description: "Ändert die ausgewählte Kampagne.",
    submit: "Speichern",
  },
  duplicate: {
    title: "QR-Kampagne duplizieren",
    description: "Erstellt eine neue Kampagne auf Basis der bestehenden Werte.",
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
  archiveAction,
  onClose,
  disabled = false,
  disabledReason,
}: CampaignBuilderProps) {
  const formId = useId();
  const isEdit = mode === "edit";
  const isDuplicate = mode === "duplicate";
  const copy = SHEET_COPY[mode];
  const currentYear = new Date().getFullYear();

  const [state, formAction, isPending] = React.useActionState(action, INITIAL_STATE);
  const [archiveState, archiveFormAction, isArchiving] = React.useActionState(
    archiveAction ?? action,
    INITIAL_STATE
  );

  // ─── Preset-Auswahl (Schnellauswahl) ──────────────────────────────────────
  const [mediumValue, setMediumValue] = useState<string | null>(null);
  const [themeValue, setThemeValue] = useState<string | null>(null);
  const [themeCustom, setThemeCustom] = useState("");
  const [regionValue, setRegionValue] = useState<string | null>(null);
  const [regionCustom, setRegionCustom] = useState("");
  const [city, setCity] = useState("");
  const [year, setYear] = useState<number>(currentYear);
  const [version, setVersion] = useState("v1");

  // ─── Titel/Status/Ziel ─────────────────────────────────────────────────────
  const [externalTitle, setExternalTitle] = useState("");
  const [status, setStatus] = useState<CampaignStatus>("draft");
  const [destinationPath, setDestinationPath] = useState("/");
  const [notes, setNotes] = useState("");

  // ─── Manuelle Overrides (Erweitert) ────────────────────────────────────────
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [override, setOverride] = useState<Partial<Record<string, string>>>({});

  // Beim Öffnen Felder initialisieren.
  useEffect(() => {
    if (!open) return;
    if (isEdit && campaign) {
      setExternalTitle(campaign.externalTitle ?? "");
      setStatus(campaign.status);
      setDestinationPath(campaign.destinationPath ?? "/");
      setNotes(campaign.notes ?? "");
      setCity(campaign.city ?? "");
      setYear(campaign.year ?? currentYear);
      setVersion(campaign.version ?? "v1");
      setRegionCustom(campaign.region ?? "");
      // Vorhandene Werte als Overrides, da Presets nicht rückwärts ableitbar.
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
      setShowAdvanced(true);
    } else if (isDuplicate && campaign) {
      const dup = deriveDuplicate(campaign);
      setExternalTitle(campaign.externalTitle ?? "");
      setStatus("draft");
      setDestinationPath(campaign.destinationPath ?? "/");
      setNotes(campaign.notes ?? "");
      setCity(campaign.city ?? "");
      setYear(campaign.year ?? currentYear);
      setVersion(dup.version);
      setRegionCustom(campaign.region ?? "");
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
      setNotes("");
      setCity("");
      setYear(currentYear);
      setVersion("v1");
      setMediumValue(null);
      setThemeValue(null);
      setThemeCustom("");
      setRegionValue(null);
      setRegionCustom("");
      setOverride({});
      setShowAdvanced(false);
    }
  }, [open, isEdit, isDuplicate, campaign, currentYear]);

  // Bei erfolgreicher Aktion schließen.
  useEffect(() => {
    if (state.ok || archiveState.ok) onClose();
  }, [state.ok, archiveState.ok, onClose]);

  // ─── Ableitung aus Presets ─────────────────────────────────────────────────
  const medium = MEDIUM_PRESETS.find((m) => m.value === mediumValue);

  const themeTokens = useMemo(() => {
    if (themeValue === THEME_CUSTOM) {
      return { internal: toInternalToken(themeCustom), slug: slugify(themeCustom) };
    }
    const preset = THEME_PRESETS.find((t) => t.value === themeValue);
    return preset ? { internal: preset.internal, slug: preset.slug } : { internal: "", slug: "" };
  }, [themeValue, themeCustom]);

  const regionTokens = useMemo(() => {
    if (regionValue === REGION_CUSTOM) {
      return {
        internal: toInternalToken(regionCustom),
        slug: slugify(regionCustom),
        label: regionCustom.trim(),
      };
    }
    const preset = REGION_PRESETS.find((r) => r.value === regionValue);
    return preset
      ? { internal: preset.internal, slug: preset.slug, label: preset.label }
      : { internal: "", slug: "", label: "" };
  }, [regionValue, regionCustom]);

  const selection: BuilderSelection = {
    medium,
    themeInternal: themeTokens.internal,
    themeSlug: themeTokens.slug,
    regionInternal: regionTokens.internal,
    regionSlug: regionTokens.slug,
    year,
    version,
  };

  const derived = deriveFields(selection);

  // effektiver Wert: Override hat Vorrang vor Ableitung.
  const eff = (key: keyof typeof derived): string =>
    override[key] !== undefined ? (override[key] as string) : derived[key];

  const effMediumLabel =
    override.medium_label !== undefined ? override.medium_label : medium?.label ?? "";
  const effRegion =
    override.region !== undefined ? override.region : regionTokens.label;

  const setOv = (key: string, value: string) =>
    setOverride((prev) => ({ ...prev, [key]: value }));

  const resetOverrides = () => setOverride({});

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
        <p className="mb-5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs leading-relaxed text-amber-100">
          {disabledReason}
        </p>
      )}

      {isDuplicate && (
        <p className="mb-5 rounded-xl border border-[hsl(var(--brand)/0.35)] bg-[hsl(var(--brand)/0.1)] px-4 py-3 text-xs leading-relaxed text-foreground/85">
          Erstellt eine <strong className="font-semibold">neue</strong> Kampagne – das Original
          bleibt unverändert. Slug und UTM-Werte wurden für die neue Version automatisch angepasst.
        </p>
      )}

      <form id={formId} action={formAction} className="flex flex-col gap-7">
        {isEdit && campaign?.id && <input type="hidden" name="id" value={campaign.id} />}

        {/* Hidden = tatsächlich abgesendete Werte (effektiv) */}
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

        {/* ─── Schnellauswahl ─────────────────────────────────────────────── */}
        {!isEdit && !isDuplicate && (
          <section className="flex flex-col gap-5">
            <SectionTitle>Schnellauswahl</SectionTitle>

            <FieldBlock label="Medium">
              <ChipGroup
                ariaLabel="Medium"
                options={MEDIUM_PRESETS.map((m) => ({ value: m.value, label: m.label }))}
                value={mediumValue}
                onChange={setMediumValue}
              />
            </FieldBlock>

            <FieldBlock label="Thema / Saison">
              <ChipGroup
                ariaLabel="Thema"
                options={[
                  ...THEME_PRESETS.map((t) => ({ value: t.value, label: t.label })),
                  { value: THEME_CUSTOM, label: "Eigenes Thema" },
                ]}
                value={themeValue}
                onChange={setThemeValue}
              />
              {themeValue === THEME_CUSTOM && (
                <input
                  value={themeCustom}
                  onChange={(e) => setThemeCustom(e.target.value)}
                  placeholder="Eigenes Thema"
                  className={inputClass + " mt-2"}
                />
              )}
            </FieldBlock>

            <FieldBlock label="Region / Ort">
              <ChipGroup
                ariaLabel="Region"
                options={[
                  ...REGION_PRESETS.map((r) => ({ value: r.value, label: r.label })),
                  { value: REGION_CUSTOM, label: "Eigener Ort" },
                ]}
                value={regionValue}
                onChange={setRegionValue}
              />
              {regionValue === REGION_CUSTOM && (
                <input
                  value={regionCustom}
                  onChange={(e) => setRegionCustom(e.target.value)}
                  placeholder="Eigener Ort"
                  className={inputClass + " mt-2"}
                />
              )}
            </FieldBlock>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FieldBlock label="Jahr">
                <div className="flex items-center gap-2">
                  <ChipGroup
                    ariaLabel="Jahr"
                    options={yearOptions}
                    value={String(year)}
                    onChange={(v) => setYear(Number(v))}
                  />
                  <input
                    type="number"
                    value={year || ""}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className={inputClass + " h-9 w-24"}
                    min={2000}
                    max={2100}
                  />
                </div>
              </FieldBlock>

              <FieldBlock label="Version">
                <ChipGroup
                  ariaLabel="Version"
                  options={[
                    { value: "v1", label: "v1" },
                    { value: "v2", label: "v2" },
                    { value: "v3", label: "v3" },
                  ]}
                  value={version}
                  onChange={setVersion}
                />
              </FieldBlock>
            </div>
          </section>
        )}

        {/* ─── Titel, Status, Ziel ─────────────────────────────────────────── */}
        <section className="flex flex-col gap-5">
          <SectionTitle>Inhalt & Status</SectionTitle>

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

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                options={destinationOptions(destinationPath)}
                value={destinationPath}
                onChange={setDestinationPath}
              />
              <input type="hidden" name="destination_path" value={destinationPath} />
            </FieldBlock>
          </div>

          <FieldBlock label="Stadt (optional)">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="z. B. Eppelborn"
              className={inputClass}
            />
          </FieldBlock>
        </section>

        {/* ─── Live-Vorschau ───────────────────────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <SectionTitle>Automatisch abgeleitet</SectionTitle>
          <GlassPanel emphasis="subtle" className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-2">
            <PreviewRow label="internal_name" value={eff("internal_name")} />
            <PreviewRow label="slug" value={eff("slug")} mono />
            <PreviewRow label="utm_campaign" value={eff("utm_campaign")} mono />
            <PreviewRow label="utm_source" value={eff("utm_source")} mono />
            <PreviewRow label="utm_medium" value={eff("utm_medium")} mono />
            <PreviewRow label="utm_content" value={eff("utm_content")} mono />
          </GlassPanel>
        </section>

        {/* ─── Erweitert ───────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            aria-expanded={showAdvanced}
            className="flex items-center justify-between gap-3 text-left"
          >
            <SectionTitle>Erweitert · manuell überschreiben</SectionTitle>
            <Chevron open={showAdvanced} />
          </button>

          {showAdvanced && (
            <div className="animate-panel-in grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AdvancedField label="Interner Name" value={eff("internal_name")} onChange={(v) => setOv("internal_name", v)} />
              <AdvancedField label="Slug" value={eff("slug")} onChange={(v) => setOv("slug", slugify(v))} mono />
              <AdvancedField label="UTM Source" value={eff("utm_source")} onChange={(v) => setOv("utm_source", v)} mono />
              <FieldBlock label="UTM Medium">
                <GlassListbox
                  ariaLabel="UTM Medium"
                  options={UTM_MEDIUM_OPTIONS}
                  value={eff("utm_medium")}
                  onChange={(v) => setOv("utm_medium", v as UtmMedium)}
                />
              </FieldBlock>
              <AdvancedField label="UTM Campaign" value={eff("utm_campaign")} onChange={(v) => setOv("utm_campaign", slugify(v))} mono />
              <AdvancedField label="UTM Content" value={eff("utm_content")} onChange={(v) => setOv("utm_content", v)} mono />
              <AdvancedField label="Medium-Label" value={effMediumLabel} onChange={(v) => setOv("medium_label", v)} />
              <AdvancedField label="Region" value={effRegion} onChange={(v) => setOv("region", v)} />
              <div className="sm:col-span-2">
                <DashButton type="button" variant="ghost" size="sm" onClick={resetOverrides}>
                  Aus Presets neu ableiten
                </DashButton>
              </div>
            </div>
          )}
        </section>

        <FieldBlock label="Notizen">
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </FieldBlock>

        {state.message && !state.ok && (
          <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-100">
            {state.message}
          </p>
        )}
      </form>

      {/* Archivieren – getrenntes Formular, dezent unten. */}
      {isEdit && campaign?.id && archiveAction && (
        <form action={archiveFormAction} className="mt-6 border-t border-white/10 pt-5">
          <input type="hidden" name="id" value={campaign.id} />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground/85">Kampagne archivieren</p>
              <p className="text-xs text-foreground/55">
                Archivierte Kampagnen leiten über <code className="font-mono">/go</code> nicht mehr weiter.
              </p>
            </div>
            <DashButton
              type="submit"
              size="sm"
              variant="danger"
              disabled={disabled || isArchiving || campaign.status === "archived"}
            >
              {isArchiving ? "Archiviert…" : "Archivieren"}
            </DashButton>
          </div>
          {archiveState.message && !archiveState.ok && (
            <p className="mt-2 text-xs text-rose-200">{archiveState.message}</p>
          )}
        </form>
      )}
    </GlassSheet>
  );
}

function destinationOptions(current: string): ListboxOption[] {
  const options: ListboxOption[] = CAMPAIGN_DESTINATION_PATHS.map((entry) => ({
    value: entry.path,
    label: entry.label,
    hint: entry.path,
  }));
  if (!options.some((o) => o.value === current)) {
    options.unshift({ value: current, label: "Aktuell", hint: current });
  }
  return options;
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
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
        {label}
      </span>
      <span
        className={
          "min-w-0 truncate text-right text-xs " +
          (value ? "text-foreground/85" : "text-foreground/30") +
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
      className={"text-foreground/55 transition-transform duration-200 " + (open ? "rotate-180" : "")}
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
