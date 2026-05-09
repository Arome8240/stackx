# StackX Social Platform - Complete Deployment Guide

This guide covers the complete deployment process for the StackX social platform, including smart contracts, IPFS setup, and frontend configuration.

## Prerequisites

### Required Tools
- Node.js 18+ and npm/pnpm
- Clarinet CLI (for Clarity contracts)
- Stacks wallet with testnet STX
- Pinata account (for IPFS)

### Required Accounts
1. **Stacks Wallet** - Get testnet STX from [faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
2. **Pinata Account** - Sign up at [pinata.cloud](https://pinata.cloud)

## Step 1: Install Clarinet

### Linux/Mac
```bash
curl -L https://github.com/hirosystems/clarinet/releases/download/v1.7.0/clarinet-linux-x64.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/
```

### Verify Installation
```bash
clarinet --version
```

## Step 2: Setup IPFS (Pinata)

### Create Pinata Account
1. Go to [pinata.cloud](https://pinata.cloud)
2. Sign up for free account
3. Navigate to API Keys section
4. Create new API key with permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
   - `unpin`

### Save API Keys
You'll receive:
- API Key
- API Secret

Keep these secure - you'll need them for the `.env` file.

## Step 3: Configure Environment Variables

### Create .env file
```bash
cp env.example .env
```

### Edit .env with your values
```bash
# Stacks Blockchain
STACKS_NETWORK=testnet
STACKS_PRIVATE_KEY=your_64_char_hex_private_key

# Contract (leave empty until deployed)
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_CONTRACT_NAME=social-platform
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so

# IPFS (Pinata)
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

### Get Your Stacks Private Key

#### From Hiro Wallet
1. Open Hiro Wallet
2. Go to Settings → View Secret Key
3. Copy the 24-word phrase
4. Convert to hex using:
```bash
npm install -g @stacks/cli
stx make_keychain -t | grep "private"
```

#### Generate New Key (for testing)
```bash
npm install -g @stacks/cli
stx make_keychain -t
```

## Step 4: Test Smart Contract

### Navigate to contracts directory
```bash
cd contracts/clarity
```

### Check contract syntax
```bash
clarinet check
```

Expected output:
```
✓ social-platform syntax ok
```

### Run tests (optional)
```bash
clarinet test
```

## Step 5: Deploy Smart Contract

### Install dependencies
```bash
cd contracts/clarity
npm install
```

### Deploy to Testnet
```bash
STACKS_PRIVATE_KEY=your_key npm run deploy:testnet
```

### Expected Output
```
🚀 Deploying social-platform to testnet...

📝 Transaction created
Transaction ID: 0x...

✅ Contract deployed successfully!
Transaction ID: 0x...

🔍 View on explorer:
https://explorer.hiro.so/txid/0x...?chain=testnet

📋 Contract Details:
Contract Name: social-platform
Network: testnet
```

### Save Contract Address
After deployment, you'll see a transaction ID. Wait 2-3 minutes for confirmation, then:

1. Visit the explorer link
2. Find your contract address (format: `ST...`)
3. Update `.env`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

## Step 6: Configure Frontend

### Update apps/web/.env.local
```bash
cd apps/web
cp .env.example .env.local
```

### Add your values
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_CONTRACT_NAME=social-platform
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so

NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## Step 7: Install Dependencies

### Root level
```bash
pnpm install
```

### Web app
```bash
cd apps/web
npm install
```

## Step 8: Run the Application

### Development Mode
```bash
cd apps/web
npm run dev
```

Visit: `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Step 9: Test the Platform

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve connection in Hiro Wallet
- Your address should appear

### 2. Register User
- Fill in username, display name, bio
- Upload avatar image (will be stored on IPFS)
- Submit transaction
- Wait for confirmation (~30 seconds)

### 3. Create First Cast
- Type your message (max 280 chars)
- Optionally add images
- Click "Cast" button
- Approve transaction

### 4. Test Interactions
- Like/unlike casts
- Recast posts
- Follow/unfollow users
- Create channels
- Join channels

## Troubleshooting

### Contract Deployment Fails

**Error: Insufficient balance**
- Get testnet STX from [faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
- Wait 5 minutes for confirmation

**Error: Contract already exists**
- Change contract name in `Clarinet.toml`
- Or use different deployer address

### IPFS Upload Fails

**Error: 401 Unauthorized**
- Check Pinata API keys are correct
- Verify keys have correct permissions
- Try regenerating keys

**Error: File too large**
- Max file size is 100MB
- Compress images before upload
- Use image optimization

### Transaction Stuck

**Pending for >5 minutes**
- Check [Stacks Status](https://status.hiro.so/)
- Verify transaction on [explorer](https://explorer.hiro.so/?chain=testnet)
- May need to increase fee in contract call

### Wallet Connection Issues

**Wallet not detected**
- Install [Hiro Wallet](https://wallet.hiro.so/)
- Refresh page after installation
- Check browser console for errors

## Production Deployment

### 1. Deploy to Mainnet

```bash
# Get mainnet STX
# Update .env with mainnet private key
STACKS_NETWORK=mainnet
STACKS_PRIVATE_KEY=your_mainnet_key

# Deploy
cd contracts/clarity
npm run deploy:mainnet
```

### 2. Update Frontend Config

```bash
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_STACKS_API_URL=https://api.hiro.so
NEXT_PUBLIC_CONTRACT_ADDRESS=your_mainnet_contract_address
```

### 3. Deploy Frontend

#### Vercel
```bash
vercel --prod
```

#### Netlify
```bash
netlify deploy --prod
```

#### Docker
```bash
docker build -t stackx-social .
docker run -p 3000:3000 stackx-social
```

## Monitoring

### Contract Activity
- [Stacks Explorer](https://explorer.hiro.so/)
- [Hiro API](https://api.hiro.so/)

### IPFS Storage
- [Pinata Dashboard](https://app.pinata.cloud/)
- Monitor pinned files
- Check storage usage

### Application Logs
```bash
# View logs
pm2 logs stackx

# Monitor errors
tail -f logs/error.log
```

## Cost Estimates

### Testnet (Free)
- All transactions free
- Get STX from faucet
- Unlimited testing

### Mainnet
- Contract deployment: ~0.5 STX
- Register user: ~0.005 STX
- Create cast: ~0.003 STX
- Like/recast: ~0.002 STX
- Follow user: ~0.002 STX

### IPFS (Pinata)
- Free tier: 1GB storage
- Paid plans: $20/month for 100GB

## Security Checklist

- [ ] Private keys stored securely (never commit to git)
- [ ] Environment variables configured correctly
- [ ] IPFS API keys have minimal permissions
- [ ] Contract tested on testnet before mainnet
- [ ] Frontend validates all user inputs
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] HTTPS enabled in production

## Support

### Documentation
- [Clarity Docs](https://docs.stacks.co/clarity)
- [Stacks.js Docs](https://stacks.js.org/)
- [Pinata Docs](https://docs.pinata.cloud/)

### Community
- [Stacks Discord](https://discord.gg/stacks)
- [GitHub Issues](https://github.com/your-repo/issues)

### Need Help?
- Check [FAQ](./FAQ.md)
- Open an issue
- Join our Discord

## Next Steps

1. ✅ Deploy contract to testnet
2. ✅ Test all features
3. ✅ Set up IPFS
4. ⏳ Deploy to mainnet
5. ⏳ Set up indexer (optional)
6. ⏳ Launch to users

Congratulations! Your StackX social platform is now live! 🎉
