# Staxial Health System

> Decentralized health management platform on Stacks blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Progress](https://img.shields.io/badge/Progress-45%25-blue.svg)](./PROGRESS.md)

## 🏥 Overview

Staxial Health is a comprehensive decentralized health management system that enables:
- 🏥 **Multi-hospital registration** with on-chain verification
- 📋 **Patient-controlled medical records** with consent management
- 📅 **Appointment booking** with token-based payments
- 💊 **Prescription issuance** and pharmacy fulfillment
- 🔐 **Secure access control** and audit trails

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x
- pnpm 10.x
- Clarinet (for contract deployment)
- Stacks wallet (Hiro or Leather)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd stackx

# Install dependencies
pnpm install

# Start development server
pnpm --filter web dev
```

### Configuration

Create `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your-contract-address
NEXT_PUBLIC_DEPLOYER_ADDRESS=your-deployer-address
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
```

## 📁 Project Structure

```
stackx/
├── apps/
│   ├── web/              # Next.js admin dashboard
│   ├── mobile/           # React Native app (planned)
│   └── api/              # NestJS backend (planned)
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── contracts/        # Legacy contracts
│   └── config/           # Shared configurations
├── PROGRESS.md           # Development progress
├── PROJECT_SUMMARY.md    # Comprehensive overview
└── DEPLOYMENT_GUIDE.md   # Quick deployment guide
```

## 🔗 Related Repositories

- **[staxial-contract](../staxial-contract)** - Smart contracts in Clarity
- **[staxial-sdk](../staxial-sdk)** - TypeScript SDK for contract interactions

## 🎯 Features

### ✅ Completed

- **Smart Contracts** (100%)
  - Health token (SIP-010)
  - Hospital registry
  - Patient records
  - Appointments
  - Prescriptions

- **Admin Dashboard** (70%)
  - Wallet authentication
  - Hospital management (CRUD)
  - Real-time blockchain data
  - Transaction handling
  - Live statistics

- **SDK** (100%)
  - TypeScript SDK published
  - Full type safety
  - Contract interaction utilities

### 🚧 In Progress

- Patient management interface
- Appointments overview
- Prescriptions management
- Analytics dashboard

### 📋 Planned

- Mobile application (React Native)
- Backend API (NestJS)
- IPFS integration
- Push notifications

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start all apps
pnpm --filter web dev       # Start web app only
pnpm --filter mobile dev    # Start mobile app

# Build
pnpm build                  # Build all packages
pnpm --filter web build     # Build web app

# Testing
pnpm test                   # Run all tests
pnpm lint                   # Lint all packages

# Types
pnpm --filter @staxial/types build  # Build types package
```

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Stacks Connect

**Blockchain:**
- Stacks Blockchain
- Clarity 2.0
- Clarinet

**Tools:**
- pnpm (monorepo)
- Turbo (build system)
- ESLint + Prettier

## 📚 Documentation

- [Progress Tracking](./PROGRESS.md) - Current development status
- [Project Summary](./PROJECT_SUMMARY.md) - Comprehensive overview
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Quick start for deployment
- [Task Breakdown](./HEALTH_SYSTEM_TASKS.md) - Detailed task list

## 🚀 Deployment

### Testnet Deployment

1. Deploy contracts (see [staxial-contract](../staxial-contract))
2. Update environment variables
3. Build and deploy web app

```bash
# Build for production
pnpm --filter web build

# Start production server
pnpm --filter web start
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📊 Progress

- **Overall:** 45% Complete
- **Smart Contracts:** 100% ✅
- **SDK:** 100% ✅
- **Web App:** 70% 🚧
- **Mobile App:** 0% 📋
- **Documentation:** 40% 🚧

See [PROGRESS.md](./PROGRESS.md) for detailed breakdown.

## 🔐 Security

- All medical data encrypted before storage
- Patient-controlled access permissions
- On-chain audit trails
- Role-based access control
- Emergency access mechanisms

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- Stacks Foundation
- Hiro Systems
- Clarity Language Team

## 📞 Support

- Documentation: See `/docs` folder
- Issues: GitHub Issues
- Discussions: GitHub Discussions

---

**Status:** Active Development  
**Version:** 0.2.0  
**Last Updated:** January 2024

Built with ❤️ on Stacks Blockchain
