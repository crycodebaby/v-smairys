"use client";

import React, { useEffect } from "react";
import { GlassSheet } from "@/components/ui/glass/GlassSheet";
import { DashButton } from "@/components/intern/DashButton";
import type { CampaignActionState } from "@/app/intern/marketing/actions";

type ActionConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  action: (
    prevState: CampaignActionState,
    formData: FormData
  ) => Promise<CampaignActionState>;
  id: string;
  tone?: "success" | "neutral";
  statusLine?: string;
};

const INITIAL_STATE: CampaignActionState = { ok: false, message: "" };

/**
 * Reusable Confirm-Dialog for dashboard actions.
 *
 * Replaces browser `window.confirm` with a mobile-safe GlassSheet:
 * Esc/backdrop close via GlassSheet, pending state blocks double submits,
 * and success closes the dialog after the server action resolves.
 */
export function ActionConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  action,
  id,
  tone = "neutral",
  statusLine,
}: ActionConfirmDialogProps) {
  const [state, formAction, isPending] = React.useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  const handleClose = () => {
    if (!isPending) onClose();
  };

  return (
    <GlassSheet open={open} onClose={handleClose} title={title}>
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-foreground/72">{description}</p>

        {statusLine && (
          <p
            className={
              "rounded-xl border px-3 py-2 text-xs " +
              (tone === "success"
                ? "border-emerald-400/18 bg-emerald-400/[0.06] text-emerald-100/80"
                : "border-white/10 bg-white/[0.035] text-foreground/55")
            }
          >
            {statusLine}
          </p>
        )}

        {state.message && !state.ok && (
          <p className="rounded-xl border border-rose-400/25 bg-rose-400/[0.08] px-3 py-2 text-xs text-rose-100">
            {state.message}
          </p>
        )}

        <form action={formAction} className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <input type="hidden" name="id" value={id} />
          <DashButton type="button" variant="ghost" size="sm" onClick={handleClose} disabled={isPending}>
            Abbrechen
          </DashButton>
          <button
            type="submit"
            disabled={isPending}
            className={
              "dash-btn dash-btn--sm " +
              (tone === "success" ? "dash-btn--confirm-success" : "dash-btn--confirm-neutral")
            }
          >
            {isPending ? "Bitte warten…" : confirmLabel}
          </button>
        </form>
      </div>
    </GlassSheet>
  );
}
