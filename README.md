## Staxial

Short GitHub description: **Social DeFi platform on Stacks that fuses social networking with on-chain financial primitives for creators, communities, and investors.**

---

### Overview

**Staxial** is a monorepo for a Social DeFi platform built on the Stacks blockchain.

This project is a Social DeFi platform built on the Stacks blockchain that combines social networking with decentralized finance primitives. The goal is to enable creators, communities, and investors to interact financially on-chain through social actions such as posts, tipping, creator tokens, and community-driven financial primitives.

The repository is structured as a production-ready, scalable monorepo that hosts:
- **Web application** for primary user interaction
- **Mobile application** for on-the-go engagement
- **Backend API** for orchestration, data access and off-chain services
- **Smart contracts** written in Clarity for on-chain logic

No business logic is implemented yet—this repository focuses on **architecture, tooling, and developer experience**.

---

### Architecture Overview

- **Monorepo**: Managed with **pnpm workspaces** and **Turborepo** for fast, consistent workflows across all apps and packages.
- **Applications layer**:
  - **Web**: Next.js App Router frontend for the main user experience.
  - **Mobile**: Expo React Native app using Expo Router and NativeWind for styling.
  - **API**: NestJS backend providing HTTP APIs, configuration management, and integration points.
- **Smart contracts layer**:
  - **Clarity** contracts managed with **Clarinet** for development and testing.
- **Shared packages**:
  - **`config`**: Centralized ESLint, Prettier, and TypeScript configuration.
  - **`types`**: Shared TypeScript types across apps and services.
  - **`contracts`**: Clarinet project and Clarity contracts.

The design emphasizes:
- **Scalability**: Modular architecture in NestJS and clear separation of concerns across apps.
- **Consistency**: Shared configs and types reduce drift between applications.
- **DX**: Simple top-level scripts for running each part of the system.

---

### Tech Stack

- **Monorepo & Tooling**
  - **pnpm workspaces**
  - **Turborepo** for task orchestration (`dev`, `build`, `lint`, `test`)
  - **TypeScript** across all Node/React projects
  - **Prettier** and **ESLint** with shared configuration

- **Web App (`apps/web`)**
  - **Next.js (App Router, latest stable)**
  - **React** + **TypeScript**
  - **TailwindCSS** for utility-first styling
  - **ESLint** + **Prettier** via shared config

- **Mobile App (`apps/mobile`)**
  - **Expo** (React Native)
  - **Expo Router**
  - **TypeScript**
  - **NativeWind** (Tailwind for React Native)

- **Backend API (`apps/api`)**
  - **NestJS** (modular architecture)
  - **TypeScript**
  - **`@nestjs/config`** for environment configuration

- **Smart Contracts (`packages/contracts`)**
  - **Clarity** smart contracts
  - **Clarinet** for development, testing, and local networks

---

### Monorepo Structure

Top-level layout:

- **`apps/`**: Runtime applications
  - **`apps/web`**: Next.js web frontend using the App Router and TailwindCSS.
  - **`apps/mobile`**: Expo React Native application with Expo Router and NativeWind.
  - **`apps/api`**: NestJS backend API with modular setup and environment configuration.

- **`packages/`**: Shared libraries and tooling
  - **`packages/contracts`**:
    - Clarinet project configuration (`Clarinet.toml`)
    - Clarity contracts under `contracts/`
  - **`packages/config`**:
    - Shared ESLint configurations (`eslint/`)
    - Shared TypeScript configs (`tsconfig/`)
    - Shared Prettier config (`prettier/`)
  - **`packages/types`**:
    - Shared TypeScript types (`src/index.ts`)

- **Root configuration**
  - **`package.json`**: Monorepo scripts and dev tooling dependencies (TypeScript, Turborepo, ESLint, Prettier).
  - **`pnpm-workspace.yaml`**: Workspace configuration for `apps/*` and `packages/*`.
  - **`turbo.json`**: Pipeline configuration for `dev`, `build`, `lint`, and `test`.
  - **`tsconfig.base.json`**: Base TypeScript compiler options shared across projects.
  - **`prettier.config.cjs`**: Root Prettier config delegating to shared style.
  - **`env.example`**: Example environment variables.

---

### Getting Started

#### Prerequisites

- **Node.js** (LTS or later)
- **pnpm** (recommended package manager)
- **Clarinet** (for smart contract development)
  - Install from the official Stacks tooling distribution.

#### Install dependencies

From the repository root:

```bash
pnpm install
```

This will install dependencies for all apps and packages defined in `pnpm-workspace.yaml`.

---

### Development Scripts

From the repository root, you can run:

- **Run all dev tasks via Turborepo**

```bash
pnpm dev
```

- **Web app (Next.js)**

```bash
pnpm dev:web
```

Runs `next dev` in `apps/web`.

- **Mobile app (Expo + React Native)**

```bash
pnpm dev:mobile
```

Runs `expo start` in `apps/mobile` (use the Expo CLI UI or additional scripts for iOS/Android/web).

- **Backend API (NestJS)**

```bash
pnpm dev:api
```

Runs `nest start --watch` in `apps/api` and reads configuration via `@nestjs/config`.

- **Contracts (Clarinet)**

```bash
pnpm dev:contracts
```

Runs `clarinet console` in `packages/contracts`. Use this for iterating on and inspecting Clarity contracts.

- **Build all**

```bash
pnpm build
```

- **Lint all**

```bash
pnpm lint
```

- **Test all**

```bash
pnpm test
```

- **Format code**

```bash
pnpm format
```

---

### Environment Variables

Environment variables are not committed to the repo. Use the provided `env.example` as a starting point and create environment-specific files (e.g. `.env.local`, `.env.development`) in your own environment.

Representative variables:

- **Web (`apps/web`)**
  - `NEXT_PUBLIC_STACKS_API_URL` – Base URL for Stacks API.
  - `NEXT_PUBLIC_APP_URL` – Public URL for the web frontend.

- **Mobile (`apps/mobile`)**
  - `EXPO_PUBLIC_STACKS_API_URL` – Base URL for Stacks API exposed to the mobile app.

- **Backend API (`apps/api`)**
  - `API_PORT` – Port for the NestJS HTTP server (default: `4000`).
  - `API_LOG_LEVEL` – Logging level (e.g. `debug`, `info`, `warn`, `error`).

- **Contracts / Clarinet**
  - `STACKS_NETWORK` – Target network for Clarinet (e.g. `devnet`).

Each app or service should load environment variables using its own mechanism:
- **Next.js**: `process.env` (with `NEXT_PUBLIC_` prefix for client-side variables).
- **Expo**: `EXPO_PUBLIC_` variables.
- **NestJS**: `@nestjs/config` with `ConfigModule.forRoot`.

---

### Contribution Guidelines

- **No business logic yet**: This repository currently focuses on **structure, tooling, and architecture**. Keep contributions within these boundaries unless there is a clear, agreed design for protocol features.
- **Follow shared configs**:
  - Use the existing **ESLint** and **Prettier** configurations from `packages/config`.
  - Do not override formatting or lint rules locally without a strong reason.
- **Type safety first**:
  - Prefer adding or reusing types in `packages/types` for anything shared between apps.
  - Avoid `any` unless absolutely necessary and documented.
- **Monorepo conventions**:
  - Place new runtime apps under `apps/`.
  - Place reusable libraries and tools under `packages/`.
  - Wire new workspaces into `pnpm-workspace.yaml` and, if relevant, into `turbo.json`.
- **Git & CI hygiene**:
  - Ensure `pnpm lint` and `pnpm test` pass before opening a PR.
  - Keep PRs small and focused (e.g. “add new shared config”, “scaffold new module in API”).

As the project evolves from foundation to full-featured Social DeFi protocol, these guidelines can be extended with domain-specific architecture, security, and audit requirements.


