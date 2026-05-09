# StackX Smart Contract & IPFS Integration - Summary

## ✅ What's Been Built

### 1. Complete Clarity Smart Contract (`contracts/clarity/social-platform.clar`)

#### Core Features Implemented:
- ✅ **User Management**
  - Register users with username, display name, bio, avatar
  - Update profile with banner support
  - Username to principal mapping
  - User verification system
  - Follower/following counts

- ✅ **Social Interactions**
  - Create casts (posts) with 280 char limit
  - Support for up to 4 images per cast
  - Mention up to 10 users
  - Reply to casts (threading)
  - Post to channels
  - Like/unlike casts
  - Recast/unrecast posts
  - Follow/unfollow users

- ✅ **Channels**
  - Create channels with name, description, image
  - Join/leave channels
  - Member counting
  - Cast counting per channel
  - Creator permissions

- ✅ **Data Tracking**
  - Total users, casts, channels
  - Individual user stats
  - Cast engagement metrics
  - Platform-wide statistics

#### Read-Only Functions:
- `get-user` - Fetch user profile
- `get-cast` - Fetch cast data
- `get-channel` - Fetch channel data
- `is-following` - Check follow status
- `has-liked-cast` - Check like status
- `has-recasted` - Check recast status
- `is-channel-member` - Check membership
- `get-platform-stats` - Platform statistics

### 2. IPFS Integration (`apps/web/lib/ipfs/client.ts`)

#### Features:
- ✅ **File Upload**
  - Single file upload to Pinata
  - Multiple file uploads
  - JSON data upload
  - Automatic metadata tagging

- ✅ **File Management**
  - Pin files by CID
  - Unpin files
  - List pinned files
  - Connection testing

- ✅ **Helper Functions**
  - `uploadImage()` - Quick image upload
  - `uploadImages()` - Batch upload
  - `getImageUrl()` - Get IPFS gateway URL

#### Supported Media:
- Images: JPG, PNG, GIF, WebP
- Max size: 100MB per file
- Gateway: Pinata (configurable)

### 3. Contract SDK (`apps/web/lib/contracts/social-platform.ts`)

#### All Frontend Functions Covered:
- ✅ `registerUser()` - Register new user
- ✅ `updateProfile()` - Update user profile
- ✅ `createCast()` - Create post
- ✅ `likeCast()` / `unlikeCast()` - Like interactions
- ✅ `recast()` / `unrecast()` - Recast interactions
- ✅ `followUser()` / `unfollowUser()` - Follow system
- ✅ `createChannel()` - Create channel
- ✅ `joinChannel()` / `leaveChannel()` - Channel membership
- ✅ All read-only functions for queries

### 4. Deployment Infrastructure

#### Files Created:
- `contracts/clarity/deploy.ts` - Deployment script
- `contracts/clarity/Clarinet.toml` - Clarinet config
- `contracts/clarity/package.json` - Dependencies
- `contracts/clarity/.env.example` - Environment template
- `contracts/clarity/README.md` - Contract documentation
- `DEPLOYMENT_GUIDE_SOCIAL.md` - Complete deployment guide

#### Scripts Available:
```bash
npm run deploy:testnet  # Deploy to testnet
npm run deploy:mainnet  # Deploy to mainnet
clarinet test          # Run tests
clarinet check         # Check syntax
```

## 📋 Frontend Integration Checklist

### Required Environment Variables:
```bash
# Stacks Blockchain
STACKS_NETWORK=testnet
STACKS_PRIVATE_KEY=your_key

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_address
NEXT_PUBLIC_CONTRACT_NAME=social-platform
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so

# IPFS (Pinata)
NEXT_PUBLIC_PINATA_API_KEY=your_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

### Integration Steps:

#### 1. Initialize Contract
```typescript
import { createSocialPlatformContract } from '@/lib/contracts/social-platform';
import { StacksTestnet } from '@stacks/network';

const contract = createSocialPlatformContract({
  network: new StacksTestnet(),
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  contractName: 'social-platform',
});
```

#### 2. Upload Image to IPFS
```typescript
import { uploadImage } from '@/lib/ipfs/client';

const handleImageUpload = async (file: File) => {
  const cid = await uploadImage(file);
  return cid; // Use this in contract calls
};
```

#### 3. Register User
```typescript
await contract.registerUser(
  'alice',                    // username
  'Alice Chen',              // display name
  'Web3 developer',          // bio
  'QmXxxx...',              // avatar IPFS CID
  userAddress
);
```

#### 4. Create Cast
```typescript
const imageCIDs = await uploadImages(imageFiles);

await contract.createCast(
  'Hello, StackX!',          // content
  imageCIDs,                 // images
  [],                        // mentions
  undefined,                 // parent cast
  undefined                  // channel
);
```

#### 5. Like/Recast
```typescript
await contract.likeCast(castId);
await contract.recast(castId);
```

#### 6. Follow User
```typescript
await contract.followUser(userAddress);
```

## 🔄 Data Flow

### Creating a Cast with Image:
1. User selects image in frontend
2. Image uploaded to IPFS via Pinata → Returns CID
3. CID passed to `createCast()` contract function
4. Contract stores CID on-chain
5. Frontend retrieves CID and displays image from IPFS gateway

### User Registration:
1. User fills profile form
2. Avatar uploaded to IPFS → Returns CID
3. `registerUser()` called with CID
4. Contract creates user profile with IPFS reference
5. Username mapped to principal address

## 📊 Contract Data Structure

### User Profile (On-Chain):
```clarity
{
  username: "alice",
  display-name: "Alice Chen",
  bio: "Web3 developer",
  avatar-ipfs: "QmXxxx...",
  banner-ipfs: some("QmYyyy..."),
  verified: false,
  followers-count: 150,
  following-count: 200,
  casts-count: 45,
  joined-at: 12345
}
```

### Cast (On-Chain):
```clarity
{
  author: ST1PQHQKV...,
  content: "Hello, StackX!",
  images-ipfs: ["QmXxxx...", "QmYyyy..."],
  mentions: [ST2ABC..., ST3DEF...],
  parent-cast-id: none,
  channel-id: some(u1),
  likes-count: 42,
  recasts-count: 15,
  replies-count: 8,
  timestamp: 12345
}
```

## 💰 Transaction Costs (Testnet)

| Operation | Estimated Cost |
|-----------|---------------|
| Deploy Contract | ~0.5 STX |
| Register User | ~0.005 STX |
| Create Cast | ~0.003 STX |
| Like/Unlike | ~0.002 STX |
| Recast | ~0.002 STX |
| Follow/Unfollow | ~0.002 STX |
| Create Channel | ~0.004 STX |
| Join Channel | ~0.002 STX |

## 🚀 Deployment Status

### ✅ Ready to Deploy:
- [x] Smart contract written and tested
- [x] IPFS client implemented
- [x] Contract SDK created
- [x] Deployment scripts ready
- [x] Documentation complete
- [x] Environment configuration

### ⏳ Next Steps:
1. Get testnet STX from faucet
2. Set up Pinata account
3. Configure environment variables
4. Deploy contract to testnet
5. Test all functions
6. Deploy to mainnet (when ready)

## 📚 Documentation

- **Contract README**: `contracts/clarity/README.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE_SOCIAL.md`
- **IPFS Client**: Inline documentation in `apps/web/lib/ipfs/client.ts`
- **Contract SDK**: Inline documentation in `apps/web/lib/contracts/social-platform.ts`

## 🔐 Security Features

- ✅ Access control (users can only modify their own data)
- ✅ Input validation (length limits, format checks)
- ✅ Duplicate prevention (can't like twice, etc.)
- ✅ Owner-only admin functions
- ✅ IPFS content addressing (immutable references)

## 🎯 All Frontend Features Supported

Every feature in your frontend now has blockchain backend:
- ✅ User registration and profiles
- ✅ Creating casts with images
- ✅ Liking and recasting
- ✅ Following users
- ✅ Channels
- ✅ Image storage via IPFS
- ✅ All read operations

## 📞 Support

Need help deploying?
1. Check `DEPLOYMENT_GUIDE_SOCIAL.md`
2. Review contract README
3. Test on testnet first
4. Join Stacks Discord for support

---

**Status**: ✅ Complete and Ready for Deployment
**Last Updated**: 2026-05-08
