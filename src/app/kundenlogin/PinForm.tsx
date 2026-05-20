"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { PinDots } from "@/components/ui/glass/PinDots";
import { PinKeypad } from "@/components/ui/glass/PinKeypad";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import {
  loginWithPin,
  type LoginActionResult,
} from "./actions";

type PinFormProps = {
  pinLength: number;
  /** Wo soll nach erfolgreichem Login hin redirected werden? */
  next: string;
};

export function PinForm({ pinLength, next }: PinFormProps) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const shakeTimer = useRef<number | null>(null);

  // PIN nach erfolgreichem Submit nicht behalten.
  useEffect(() => {
    return () => {
      if (shakeTimer.current !== null) {
        window.clearTimeout(shakeTimer.current);
      }
    };
  }, []);

  function triggerShake() {
    setShake(true);
    if (shakeTimer.current !== null) {
      window.clearTimeout(shakeTimer.current);
    }
    shakeTimer.current = window.setTimeout(() => {
      setShake(false);
    }, 500);
  }

  function submitPin(currentPin: string) {
    if (currentPin.length !== pinLength) return;
    if (pending) return;

    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("pin", currentPin);
      formData.append("next", next);

      let result: LoginActionResult;
      try {
        result = await loginWithPin(null, formData);
      } catch (err) {
        // Wenn `redirect()` aus der Server Action throwt, fängt Next das normal
        // selbst ab – dieser Block wird nur bei echten Fehlern erreicht.
        // Wir loggen bewusst nichts mit PII.
        if (process.env.NODE_ENV === "development") {
          console.error("[kundenlogin] Server Action error", err);
        }
        triggerShake();
        setPin("");
        setError("Anmeldung fehlgeschlagen. Bitte erneut versuchen.");
        return;
      }

      if (result.ok) {
        // Im Erfolgsfall hat die Server Action bereits via redirect()
        // weiternavigiert. Falls wir doch hier landen, hart navigieren.
        window.location.href = next;
        return;
      }

      triggerShake();
      setPin("");

      switch (result.reason) {
        case "rate-limited":
          {
            const minutes = result.retryAfterSeconds
              ? Math.max(1, Math.ceil(result.retryAfterSeconds / 60))
              : 15;
            setError(
              `Zu viele Versuche. Bitte in etwa ${minutes} Minute${minutes === 1 ? "" : "n"} erneut versuchen.`
            );
          }
          break;
        case "not-configured":
          setError("Login ist serverseitig nicht konfiguriert.");
          break;
        case "missing":
        case "invalid":
        default:
          setError("PIN nicht korrekt.");
      }
    });
  }

  function appendDigit(digit: string) {
    if (pending) return;
    if (pin.length >= pinLength) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === pinLength) {
      submitPin(next);
    }
  }

  function backspace() {
    if (pending) return;
    setPin((p) => p.slice(0, -1));
    setError(null);
  }

  // Tastatur-Support (Desktop): 0-9 hinzufügen, Backspace löschen.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (pending) return;
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
    // pending/pin in Closures gefangen – State wird in Handler-Body neu gelesen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, pending, pinLength]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <PinDots filled={pin.length} length={pinLength} shake={shake} />
        <p
          className={`min-h-[1.25rem] text-sm transition-opacity ${
            error ? "opacity-100" : "opacity-0"
          } ${error ? "text-red-300" : "text-foreground/60"}`}
          aria-live="polite"
        >
          {error ?? " "}
        </p>
      </div>

      <PinKeypad
        onDigit={appendDigit}
        onBackspace={backspace}
        disabled={pending}
      />

      <div className="flex items-center gap-3">
        <GlassButton
          type="button"
          size="sm"
          onClick={() => {
            setPin("");
            setError(null);
          }}
          disabled={pending || pin.length === 0}
        >
          Zurücksetzen
        </GlassButton>
      </div>
    </div>
  );
}
