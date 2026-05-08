# StackX — Project Summary (Farcaster-like social, web + mobile)

## What we’re building

StackX is a **Farcaster-like social product**: a lightweight, identity-first network for short posts (“casts”), replies, reactions, and following—shipped as a **web app and a mobile app** with a shared backend and shared types.

The goal is to make it feel like:
- **Fast to open**, fast to post, fast to catch up
- **Identity you own** (wallet-based sign-in and portable profile)
- **Public-by-default** content with clear controls, safety, and moderation

## Who it’s for

- People who want a **clean, high-signal social feed** (builders, communities, creators)
- Teams/communities that want **channels** and a lightweight distribution layer
- Users who prefer **wallet-based identity** over email/password (while still allowing optional web2 onboarding later)

## Core product loops

1. **Post loop**: create a cast → get replies/reactions → return to continue the thread  
2. **Follow loop**: discover people/topics → follow → personalized feed improves  
3. **Channel loop**: join channels → post into channels → build a shared timeline  
4. **Notification loop**: replies/mentions/reactions → open → respond

## Core concepts (product model)

- **Identity**
  - Wallet-based authentication (sign-in, signatures)
  - User profile: handle, display name, bio, avatar, links
- **Social graph**
  - Follow/unfollow
  - Optional: blocks/mutes
- **Content**
  - Casts (short posts)
  - Replies (threaded conversations)
  - Recasts (reshare) (optional for MVP)
  - Reactions (like) (MVP)
- **Feeds**
  - Home feed (following)
  - Channel feed
  - Profile feed
  - Single-thread view
- **Discovery**
  - Search (profiles + casts) (phase 2)
  - Trending / recommended follows (phase 2)
- **Safety & moderation**
  - Reporting, basic rate limits, abuse prevention
  - Admin tooling (phase 2+)

## MVP scope (first shippable version)

### Web (apps/web)
- **Auth**: connect wallet, create session
- **Onboarding**: pick handle, set profile basics
- **Feed**: following feed + channel feed
- **Composer**: post cast, reply to cast
- **Engagement**: like/unlike, follow/unfollow
- **Notifications**: replies + mentions (at least in-app)
- **Profile**: view profile, edit profile

### Mobile (apps/mobile)
- **Auth**: wallet connect flow suitable for mobile (deep link / in-app signing strategy)
- **Read-first experience**: home feed, channel feed, thread view
- **Create**: composer for cast + reply
- **Engagement**: like + follow
- **Notifications**: in-app (push later)

### API (apps/api)
- **Sessions**: wallet signature verification → session tokens
- **CRUD**: users, profiles, casts, reactions, follows, notifications
- **Feed assembly**: timeline endpoints (following, channel, profile)
- **Moderation primitives**: report endpoint, basic rate limiting

### Shared packages (packages/*)
- `packages/types`: shared types/contracts between web/mobile/api
- `packages/config`: shared config (env schema, constants)

## Architecture (intended)

- **Monorepo**: pnpm + Turbo
- **Clients**: Next.js web + React Native/Expo mobile
- **Backend**: NestJS API providing auth, content, graph, and feeds
- **Storage**: database for content + graph + notifications
- **Identity**: wallet signatures for login and posting authority (with room for optional email/passkeys later)

> Note: the repo currently contains legacy documentation and contracts from earlier experiments. This doc reflects the **current target**: Farcaster-like social for web + mobile.

## Product principles (how we decide)

- **Speed over complexity**: ship the simplest thing that feels great
- **Composable content**: everything is shareable and linkable (casts, threads, profiles)
- **Portable identity**: users control identity; we avoid lock-in
- **Safety is a feature**: basic protections in MVP, richer tooling later

## Roadmap (phased)

### Phase 0 — Foundations
- Shared type models (`User`, `Profile`, `Cast`, `Reaction`, `Follow`)
- Auth/session strategy (web + mobile)
- Minimal database schema + migrations

### Phase 1 — MVP
- Post/reply, like, follow
- Feeds: following + channel + profile
- In-app notifications
- Basic reporting + rate limiting

### Phase 2 — Discovery + polish
- Search (profiles + casts)
- Recommendations (who to follow, suggested channels)
- Push notifications (mobile)
- Better spam defenses + moderation dashboard

### Phase 3 — Protocol-ish features (optional)
- Portable identity enhancements
- On-chain anchoring or verifiable signatures for casts (if desired)
- Open API / integrations

## Success criteria (MVP)

- A new user can **sign in, follow 3 people, and post a cast in < 2 minutes**
- Feed is **fast** and feels alive (threads, reactions, notifications)
- Web and mobile share the same mental model and endpoints

## Repo structure (current)

```
stackx/
├── apps/
│   ├── web/      # Web client (Next.js)
│   ├── mobile/   # Mobile client (React Native / Expo)
│   └── api/      # Backend API (NestJS)
└── packages/
    ├── types/    # Shared TypeScript types
    ├── config/   # Shared configuration
    └── contracts/# Existing/legacy contracts (optional)
```

