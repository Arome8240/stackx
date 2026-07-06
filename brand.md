# Brand — StackX

StackX — a wallet-first social feed like Farcaster (web + mobile).

_Rebranded 2026-07-06: palette and typography now follow [getanchor.co](https://getanchor.co/)'s fintech design system. Update by re-running the `brand-design` skill or editing this file directly to match `apps/web/app/globals.css`._

> Note: `apps/mobile` ("Staxial Health") is a separate telehealth product that shares this monorepo — it does not use the StackX brand and is out of scope for this doc.

## Palette — Anchor Green

**Vibe:** fintech · trustworthy · flat · clean
**Category:** consumer/social + web3
**Mood:** confident · understated

### Seeds (from getanchor.co)

| Role | Hex | Source |
|---|---|---|
| primary (deep green) | `#045137` | Anchor `--primary-green` |
| primary-bright (dark-mode) | `#0be49b` | Anchor `--neon-green` |
| accent (royal blue) | `#1865ff` | Anchor `--royal-blue` |
| bg-tint (light green) | `#f1f9f6` | Anchor `--daf1ea` |
| success | `#04704b` | Anchor button-bg green |
| warning | `#d05f0d` | Anchor `--burnt-orange` |
| destructive | `#dd524c` | Anchor `--indian-red` |

### Tokens (applied to `apps/web/app/globals.css`, HSL format)

**Light mode (`:root`, default theme):**

```css
--background: 0 0% 100%;
--foreground: 160 15% 10%;
--card: 0 0% 100%;
--card-foreground: 160 15% 10%;
--popover: 0 0% 100%;
--popover-foreground: 160 15% 10%;
--primary: 160 91% 17%;
--primary-foreground: 159 39% 97%;
--secondary: 159 20% 93%;
--secondary-foreground: 160 30% 10%;
--muted: 159 39% 96%;
--muted-foreground: 160 5% 40%;
--accent: 220 100% 96%;
--accent-foreground: 220 100% 55%;
--destructive: 3 68% 55%;
--destructive-foreground: 0 0% 100%;
--success: 160 90% 25%;
--warning: 25 85% 45%;
--border: 160 8% 90%;
--input: 160 8% 93%;
--ring: 220 100% 55%;
--radius: 1rem;
--nft: 190 85% 50%;
```

**Dark mode (`.dark`, reachable via the theme toggle in the user menu):**

```css
--background: 160 20% 6%;
--foreground: 159 30% 95%;
--card: 160 18% 9%;
--primary: 160 91% 47%;
--primary-foreground: 160 30% 8%;
--secondary: 160 15% 16%;
--muted: 160 15% 14%;
--accent: 220 60% 18%;
--accent-foreground: 220 100% 65%;
--border: 160 12% 18%;
--ring: 220 100% 60%;
```

## Typography — DM Sans + Space Grotesk + JetBrains Mono

- **Body/UI:** DM Sans — matches Anchor's actual body font.
- **Headings/display:** Space Grotesk — Anchor's real display font ("Teg") is a proprietary self-hosted webfont, not licensable for reuse; Space Grotesk is the closest legally-available geometric-grotesk substitute.
- **Mono (addresses, hashes, numbers):** JetBrains Mono — unchanged, a StackX-specific web3 need Anchor's marketing site doesn't have.

Wired via `next/font/google` in `apps/web/app/layout.tsx`. CSS variables: `--font-sans`, `--font-heading`, `--font-mono`.

## Effects — flat, no glow

Anchor's site has no glow/gradient decoration. StackX previously had `glow-violet` box-shadows and `gradient-text`/`gradient-border` utilities — **these have been removed**. Buttons use a plain `hover:opacity-90`; no colored shadows.

Border-radius is `1rem` (16px) base, matching Anchor's `.c-button` radius — a rounded-but-not-circular shape, not the previous `rounded-full` pill.

## Tone and voice

### Words to use

Understated, confident, a little internet-native. Short sentences. Clear verbs. Use numbers when helpful.

### Words to avoid

Hype words ("revolutionary", "unleash", "supercharge"), over-promising, and exclamation marks.

### Voice example

> "New replies in #builders. Jump in when you're ready."

## Usage dos and don'ts

**Do:**
- Use tokens everywhere (`bg-background`, `text-foreground`, `bg-primary`, `bg-accent`, `bg-nft`). No hardcoded hex or `violet`/`purple`/`fuchsia` classes in components.
- Use `font-mono tabular-nums` for counters, timestamps, and any number that changes.
- Use `font-heading` for hero/display headlines where the geometric Space Grotesk look matters; leave body copy on the default `font-sans` (DM Sans).
- Check both light and dark mode before calling a screen done — light is now the default theme.

**Don't:**
- Use `transition: all` — prefer `transition-colors`, `transition-transform`, etc.
- Reintroduce glow/gradient decoration — the aesthetic is flat now.
- Introduce extra brand colors ad-hoc; adjust tokens once in `apps/web/app/globals.css` if needed.

---

_Last updated: 2026-07-06. Palette: Anchor Green (deep green `#045137` + royal blue `#1865ff`) · Typography: DM Sans + Space Grotesk + JetBrains Mono · Effects: flat, no glow._
