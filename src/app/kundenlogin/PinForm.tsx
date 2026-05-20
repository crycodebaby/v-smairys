"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { PinDots } from "@/components/ui/glass/PinDots";
import { PinKeypad } from "@/components/ui/glass/PinKeypad";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import { loginWithPin, type LoginActionResult } from "./actions";

type PinFormProps = {
  pinLength: number;
  /** Wo soll nach erfolgreichem Login hin redirected werden? */
  next: string;
};

type Phase = "idle" | "submitting" | "success" | "error";

export function PinForm({ pinLength, next }: PinFormProps) {
  const [pin, setPin] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const shakeTimer = useRef<number | null>(null);
  const successTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
      if (successTimer.current !== null) window.clearTimeout(successTimer.current);
    };
  }, []);

  function triggerError(message: string) {
    setPhase("error");
    setError(message);
    if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
    shakeTimer.current = window.setTimeout(() => {
      setPhase((p) => (p === "error" ? "idle" : p));
    }, 600);
  }

  function submitPin(currentPin: string) {
    if (currentPin.length !== pinLength) return;
    if (pending || phase === "success") return;

    setError(null);
    setPhase("submitting");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("pin", currentPin);
      formData.append("next", next);

      let result: LoginActionResult;
      try {
        result = await loginWithPin(null, formData);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("[kundenlogin] Server Action error", err);
        }
        setPin("");
        triggerError("Anmeldung fehlgeschlagen. Bitte erneut versuchen.");
        return;
      }

      if (result.ok) {
        // Erfolgs-Animation kurz zeigen, dann hart navigieren.
        // (Der redirect aus der Server Action sollte das eigentlich schon
        // tun, aber wir setzen einen Fallback.)
        setPhase("success");
        if (successTimer.current !== null) window.clearTimeout(successTimer.current);
        successTimer.current = window.setTimeout(() => {
          window.location.href = next;
        }, 500);
        return;
      }

      setPin("");
      switch (result.reason) {
        case "rate-limited": {
          const minutes = result.retryAfterSeconds
            ? Math.max(1, Math.ceil(result.retryAfterSeconds / 60))
            : 15;
          triggerError(
            `Zu viele Versuche. Bitte in etwa ${minutes} Minute${minutes === 1 ? "" : "n"} erneut versuchen.`
          );
          break;
        }
        case "not-configured":
          triggerError("Login ist serverseitig nicht konfiguriert.");
          break;
        case "missing":
        case "invalid":
        default:
          triggerError("PIN nicht korrekt.");
      }
    });
  }

  function appendDigit(digit: string) {
    if (pending || phase === "success") return;
    if (pin.length >= pinLength) return;
    const nextValue = pin + digit;
    setPin(nextValue);
    setPhase("idle");
    setError(null);
    if (nextValue.length === pinLength) {
      submitPin(nextValue);
    }
  }

  function backspace() {
    if (pending || phase === "success") return;
    setPin((p) => p.slice(0, -1));
    setPhase("idle");
    setError(null);
  }

  // Desktop-Tastatur-Support: 0-9, Backspace, Enter.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (pending || phase === "success") return;
      if (event.key >= "0" && event.key <= "9") {
        event.preventDefault();
        appendDigit(event.key);
      } else if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
      } else if (event.key === "Enter") {
        if (pin.length === pinLength) {
          event.preventDefault();
          submitPin(pin);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, pending, pinLength, phase]);

  const showShake = phase === "error";
  const showSuccess = phase === "success";

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex flex-col items-center gap-3">
        <PinDots
          filled={showSuccess ? pinLength : pin.length}
          length={pinLength}
          shake={showShake}
          success={showSuccess}
        />
        <p
          className={
            "min-h-[1.25rem] text-sm transition-opacity duration-200 " +
            (error
              ? "text-rose-200 opacity-100"
              : phase === "success"
                ? "text-emerald-200 opacity-100"
                : "text-foreground/60 opacity-0")
          }
          aria-live="polite"
        >
          {phase === "success" ? "Willkommen zurück." : (error ?? " ")}
        </p>
      </div>

      <PinKeypad
        onDigit={appendDigit}
        onBackspace={backspace}
        disabled={pending || phase === "success"}
      />

      <GlassButton
        type="button"
        variant="subtle"
        size="sm"
        onClick={() => {
          setPin("");
          setError(null);
          setPhase("idle");
        }}
        disabled={pending || phase === "success" || pin.length === 0}
      >
        Eingabe leeren
      </GlassButton>
    </div>
  );
}
