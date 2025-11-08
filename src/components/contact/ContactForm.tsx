// src/components/contact/ContactForm.tsx
"use client";

import { useState } from "react";

const FORMCARRY_ENDPOINT = "https://formcarry.com/s/JOH5HI9XWVI";

type Status = {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
};

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "loading" });

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Formcarry unterstützt JSON-POST; wir senden klassisch multipart/form-data via fetch,
      // damit File-Felder später erweiterbar sind.
      const res = await fetch(FORMCARRY_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const json = (await res.json().catch(() => ({}))) as {
        status?: string;
        message?: string;
      };

      if (res.ok && (json.status === "success" || !json.status)) {
        form.reset();
        setStatus({
          type: "success",
          message:
            "Danke! Ihre Nachricht ist eingegangen. Wir melden uns zeitnah.",
        });
      } else {
        throw new Error(json.message || "Senden fehlgeschlagen.");
      }
    } catch (err) {
      setStatus({
        type: "error",
        message:
          "Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border shadow-sm rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl sm:p-7"
      noValidate
    >
      <h2 className="text-xl font-semibold tracking-tight font-heading">
        Schreiben Sie uns
      </h2>

      {/* Honeypot */}
      <input
        type="text"
        name="_gotcha"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground/85"
          >
            Ihr Name *
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className="w-full px-3 py-2 mt-1 text-sm border rounded-md outline-none border-border/60 bg-background/70 ring-0 placeholder:text-foreground/40 focus:border-foreground/50"
            placeholder="Vor- und Nachname"
          />
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground/85"
          >
            E-Mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            className="w-full px-3 py-2 mt-1 text-sm border rounded-md outline-none border-border/60 bg-background/70 ring-0 placeholder:text-foreground/40 focus:border-foreground/50"
            placeholder="ihre@adresse.de"
          />
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-foreground/85"
          >
            Telefon (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="w-full px-3 py-2 mt-1 text-sm border rounded-md outline-none border-border/60 bg-background/70 ring-0 placeholder:text-foreground/40 focus:border-foreground/50"
            placeholder="+49 …"
          />
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-foreground/85"
          >
            Betreff
          </label>
          <input
            id="subject"
            name="subject"
            className="w-full px-3 py-2 mt-1 text-sm border rounded-md outline-none border-border/60 bg-background/70 ring-0 placeholder:text-foreground/40 focus:border-foreground/50"
            placeholder="Worum geht es?"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-foreground/85"
          >
            Ihre Nachricht *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="w-full px-3 py-2 mt-1 text-sm border rounded-md outline-none resize-y border-border/60 bg-background/70 ring-0 placeholder:text-foreground/40 focus:border-foreground/50"
            placeholder="Ein paar Stichpunkte genügen – Ziel, aktueller Stand, Wunschzeitraum."
          />
        </div>

        {/* DSGVO Checkbox */}
        <div className="sm:col-span-2">
          <label className="flex items-start gap-2 text-sm text-foreground/75">
            <input
              type="checkbox"
              name="privacy"
              required
              className="w-4 h-4 mt-1 rounded border-border/60 text-primary focus:ring-primary/40"
            />
            <span>
              Ich habe die{" "}
              <a
                href="/datenschutz"
                target="_blank"
                className="underline decoration-foreground/30 underline-offset-4 hover:text-primary"
              >
                Datenschutzhinweise
              </a>{" "}
              gelesen und bin einverstanden, dass meine Angaben zur
              Kontaktaufnahme verarbeitet werden.
            </span>
          </label>
        </div>
      </div>

      {/* Status */}
      {status.type === "success" && (
        <p className="px-3 py-2 mt-4 text-sm text-green-600 rounded-md bg-green-500/10 dark:text-green-400">
          {status.message}
        </p>
      )}
      {status.type === "error" && (
        <p className="px-3 py-2 mt-4 text-sm text-red-600 rounded-md bg-red-500/10 dark:text-red-400">
          {status.message}
        </p>
      )}

      {/* Submit */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={status.type === "loading"}
          className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold transition rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status.type === "loading" ? "Senden …" : "Nachricht senden"}
        </button>
        <p className="mt-3 text-[11px] text-foreground/60">
          100&nbsp;% fokussiert · 0&nbsp;% Verkaufsdruck
        </p>
      </div>
    </form>
  );
}
