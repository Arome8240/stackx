# StackX Social Platform - Quick Start Guide

Get your decentralized social platform running in 15 minutes!

## Prerequisites

- Node.js 18+
- Stacks wallet (Hiro Wallet)
- Pinata account (free)

## Step 1: Clone and Install (2 min)

```bash
# Install dependencies
pnpm install

# Navigate to web app
cd apps/web
npm install
```

## Step 2: Get Testnet STX (3 min)

1. Install [Hiro Wallet](https://wallet.hiro.so/)
2. Create/import wallet
3. Switch to Testnet
4. Get free STX: https://explorer.hiro.so/sandbox/faucet?chain=testnet
5. Wait 2-3 minutes for confirmation

## Step 3: Setup Pinata (2 min)

1. Sign up: https://pinata.cloud
2. Go to API Keys
3. Create new key with these permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
   - `unpin`
4. Save API Key and Secret

## Step 4: Configure Environment (2 min)

```bash
# Copy example
cp env.example .env

# Edit .env with your values
nano .env
```

Add:
```bash
# Get from Hiro Wallet → Settings → View Secret Key
STACKS_PRIVATE_KEY=your_64_char_hex_key

# From Pinata dashboard
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret

# Leave empty for now
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

## Step 5: Deploy Contract (3 min)

```bash
cd contracts/clarity

# Install dependencies
npm install

# Deploy to testnet
STACKS_PRIVATE_KEY=your_key npm run deploy:testnet
```

Wait for output:
```
✅ Contract deployed successfully!
Transaction ID: 0x...
```

Copy the contract address from the explorer link.

## Step 6: Update Frontend Config (1 min)

```bash
# Edit .env
nano .env
```

Add your contract address:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

## Step 7: Run the App (2 min)

```bash
cd apps/web
npm run dev
```

Visit: http://localhost:3000

## Step 8: Test It Out!

### Connect Wallet
1. Click "Connect Wallet"
2. Approve in Hiro Wallet
3. Your address appears

### Register User
1. Fill in profile form
2. Upload avatar (stored on IPFS!)
3. Submit transaction
4. Wait ~30 seconds

### Create First Cast
1. Type message
2. Add image (optional)
3. Click "Cast"
4. Approve transaction

### Try Interactions
- ❤️ Like posts
- 🔁 Recast
- 👥 Follow users
- 📺 Create channels

## Troubleshooting

### "Insufficient balance"
→ Get more testnet STX from faucet

### "IPFS upload failed"
→ Check Pinata API keys in .env

### "Contract not found"
→ Wait 2-3 minutes after deployment
→ Verify contract address in .env

### "Transaction pending"
→ Normal! Testnet can be slow
→ Check explorer for status

## What's Next?

- ✅ Invite friends to test
- ✅ Create channels
- ✅ Post content with images
- ✅ Build your community
- 📚 Read full docs: `DEPLOYMENT_GUIDE_SOCIAL.md`
- 🚀 Deploy to mainnet when ready

## Need Help?

- 📖 Full Guide: `DEPLOYMENT_GUIDE_SOCIAL.md`
- 📝 Contract Docs: `contracts/clarity/README.md`
- 💬 Stacks Discord: https://discord.gg/stacks
- 🐛 Issues: GitHub Issues

## Architecture Overview

```
┌─────────────┐
│   Frontend  │ ← React/Next.js
│  (Port 3000)│
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐ ┌──────────┐
│   Stacks    │ │   IPFS   │
│ Blockchain  │ │ (Pinata) │
│  (Testnet)  │ │          │
└─────────────┘ └──────────┘
     │               │
     │               │
     ▼               ▼
  Contract        Images
   Data           Storage
```

## Key Features

✅ **Decentralized**
- No central server
- Data on blockchain
- Images on IPFS

✅ **Wallet-First**
- Your wallet = your identity
- No email/password
- Full ownership

✅ **Open Source**
- All code public
- Auditable
- Forkable

## Costs

### Testnet (Free!)
- All transactions free
- Unlimited testing
- Get STX from faucet

### Mainnet (When Ready)
- ~$0.01 per cast
- ~$0.005 per like
- ~$0.005 per follow

### IPFS
- Free: 1GB storage
- Paid: $20/month for 100GB

## Success! 🎉

You now have a fully functional decentralized social platform!

Share your contract address with friends so they can join your network.

---

**Time to Deploy**: ~15 minutes
**Difficulty**: Beginner-friendly
**Cost**: Free on testnet
