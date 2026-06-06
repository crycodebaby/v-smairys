# 07 · Lokale Entwicklung – Stabilität & `.next`-Cache

Dieses Dokument beschreibt sporadische **lokale** Dev-Server-Fehler, die nach
einem Neustart von `npm run dev` oder nach Löschen von `.next` verschwinden —
ohne dass der Quellcode defekt ist.

## Beobachtete Symptome

- Runtime / Internal Server Error auf Routen wie `/ueber-uns`, `/leistungen`
- `Cannot find module './331.js'` (oder andere Chunk-IDs) aus
  `.next/server/webpack-runtime.js` oder `.next/server/pages/_document.js`
- `ChunkLoadError`: Loading chunk `app/layout` failed (timeout)
- `ENOENT: no such file or directory, open '.next/routes-manifest.json'`
- Nach **Stoppen** des Dev-Servers, **Löschen** von `.next` und **Neustart**
  funktioniert die Seite wieder
- `npm run build` nach sauberem `.next` läuft durch

## Wahrscheinliche Ursache

**Korrupte oder veraltete `.next`-Artefakte** und/oder **gleichzeitiger Zugriff**
auf dasselbe `.next`-Verzeichnis — typisch wenn:

1. `npm run dev` und `npm run build` parallel laufen
2. `.next` gelöscht wird, während `next dev` noch läuft
3. Ein Agent/Terminal `build` startet, während der Nutzer lokal `dev` offen hat
4. **Windows:** Dateisperren durch Antivirus, Indexer oder Cloud-Sync
   (OneDrive/Dropbox) auf dem Projektordner
5. **Webpack-Dev-Cache:** große Seiten (z. B. `/leistungen` mit 3D) erhöhen
   Compile-Druck; unterbrochene Compiles hinterlassen halbfertige Chunks

> **Hinweis:** Wenn `npm run build:clean` mit **gestopptem** Dev-Server
> fehlschlägt, liegt eher ein echter Quellcode- oder Config-Fehler vor — nicht
> nur Cache.

## Regeln (Pflicht)

| Regel | Warum |
|-------|--------|
| **Nicht** `npm run build` während `npm run dev` läuft | Beide schreiben in `.next` |
| **Nicht** `.next` manuell löschen, während `next dev` läuft | Dev hält Dateien offen → ENOENT / fehlende Chunks |
| Vor Agent-`build` prüfen, ob lokal `dev` auf demselben Checkout läuft | Gleiches Verzeichnis, gleicher Cache |
| Nach Cache-Problemen: `build:clean` statt blind `build` wiederholen | Deterministischer Ausgangszustand |

## Empfohlene Recovery (Dev kaputt)

1. Dev-Server stoppen (Ctrl+C im Terminal, alle `next dev`-Prozesse beenden)
2. `npm run clean:next`
3. `npm run dev` — oder `npm run dev:clean` (Schritte 2+3 kombiniert)

## Saubere Verifikation (Release-Check)

```bash
npm run build:clean
npm run lint
```

`build:clean` = `.next` entfernen + Production-Build. Bei grünem Build ist der
Quellstand in Ordnung; verbleibende Laufzeitfehler im Dev-Modus deuten auf
Cache/Prozess-Konflikt.

## Optionale Scripts

| Script | Zweck |
|--------|--------|
| `npm run clean:next` | Nur `.next` löschen (`scripts/clean-next.mjs`) |
| `npm run dev:clean` | Cache leeren, dann `next dev` |
| `npm run build:clean` | Cache leeren, dann `next build` |
| `npm run dev:turbo` | `next dev --turbo` (Turbopack, Next 15+) |

### Turbopack (`dev:turbo`)

- **Nicht** Default — Webpack bleibt `npm run dev`
- Manuell testen: manche `next.config`-Features oder Edge-Cases können abweichen
- Bei stabilerem HMR weniger Webpack-Chunk-Probleme möglich — projektspezifisch
  prüfen

## Windows-spezifisch

- Projektordner oder mindestens `.next` von aggressivem Echtzeit-Scan
  (Defender/AV) ausnehmen, wenn Fehler häufig wiederkehren
- Aktives Repo **nicht** in OneDrive/Dropbox-Sync legen
- Nach hartnäckigen ENOENT: Terminal schließen, ggf. verwaiste `node.exe`
  beenden, dann `npm run dev:clean`
- Mehrere Dev-Instanzen auf verschiedenen Ports (3000, 3003, …) nutzen trotzdem
  **dieselbe** `.next` — nur **eine** Dev-Instanz pro Checkout

## Agent-Workflow

- Feature-Agents: **kein** `npm run build`, solange der Nutzer `npm run dev`
  auf demselben Workspace laufen hat (oder zuerst explizit stoppen lassen)
- Bei Chunk-/manifest-Fehlern: Recovery-Reihenfolge oben, nicht sofort App-Code
  umbauen
- Verifikation nach Cache-Verdacht: `npm run build:clean`

## Lockfile / Package Manager

- Repo nutzt **npm** (`package-lock.json` only)
- Kein gemischtes yarn/pnpm/bun-Lockfile — `npm ci` / `npm install` beibehalten

## `.gitignore`

- `/.next/` ist ignoriert — Cache wird nicht committed
