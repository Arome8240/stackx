# StackX Social Platform - Smart Contracts

Clarity smart contracts for the decentralized social media platform on Stacks blockchain.

## Features

### Core Functionality
- ✅ User registration and profiles
- ✅ Create, like, and recast posts (casts)
- ✅ Follow/unfollow users
- ✅ Create and join channels
- ✅ IPFS integration for media storage
- ✅ Notifications system
- ✅ User verification

### Contract Functions

#### User Management
- `register-user` - Register a new user with username, display name, bio, and avatar
- `update-profile` - Update user profile information
- `verify-user` - Admin function to verify users
- `get-user` - Read user profile data
- `get-username-owner` - Get principal from username

#### Social Interactions
- `create-cast` - Create a new post with optional images, mentions, and channel
- `like-cast` / `unlike-cast` - Like/unlike posts
- `recast` / `unrecast` - Repost content
- `follow-user` / `unfollow-user` - Follow/unfollow users

#### Channels
- `create-channel` - Create a new channel
- `join-channel` / `leave-channel` - Join/leave channels
- `get-channel` - Read channel data

#### Read-Only Functions
- `is-following` - Check if user A follows user B
- `has-liked-cast` - Check if user liked a cast
- `has-recasted` - Check if user recasted a cast
- `is-channel-member` - Check channel membership
- `get-platform-stats` - Get platform statistics

## Setup

### Prerequisites
- Node.js 18+
- Clarinet CLI
- Stacks wallet with testnet STX

### Installation

1. Install Clarinet:
```bash
curl -L https://github.com/hirosystems/clarinet/releases/download/v1.7.0/clarinet-linux-x64.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your keys
```

### Testing

Run contract tests:
```bash
clarinet test
```

Check contract syntax:
```bash
clarinet check
```

### Deployment

#### Testnet Deployment
```bash
STACKS_PRIVATE_KEY=your_key npm run deploy:testnet
```

#### Mainnet Deployment
```bash
STACKS_PRIVATE_KEY=your_key npm run deploy:mainnet
```

## IPFS Integration

The platform uses IPFS (via Pinata) for decentralized media storage:

### Setup Pinata

1. Create account at [pinata.cloud](https://pinata.cloud)
2. Generate API keys
3. Add keys to `.env`:
```
NEXT_PUBLIC_PINATA_API_KEY=your_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret
```

### Supported Media Types
- Images: JPG, PNG, GIF, WebP
- Videos: MP4, WebM (future)
- Max file size: 100MB per file

### IPFS Usage in Contract

Media is stored as IPFS CID (Content Identifier) in the contract:
- User avatars: `avatar-ipfs` field
- User banners: `banner-ipfs` field
- Cast images: `images-ipfs` list (up to 4 images)
- Channel images: `image-ipfs` field

## Contract Architecture

### Data Structures

#### User Profile
```clarity
{
  username: string-ascii 50,
  display-name: string-utf8 100,
  bio: string-utf8 500,
  avatar-ipfs: string-ascii 100,
  banner-ipfs: optional string-ascii 100,
  verified: bool,
  followers-count: uint,
  following-count: uint,
  casts-count: uint,
  joined-at: uint
}
```

#### Cast (Post)
```clarity
{
  author: principal,
  content: string-utf8 280,
  images-ipfs: list 4 string-ascii 100,
  mentions: list 10 principal,
  parent-cast-id: optional uint,
  channel-id: optional uint,
  likes-count: uint,
  recasts-count: uint,
  replies-count: uint,
  timestamp: uint
}
```

#### Channel
```clarity
{
  name: string-ascii 50,
  description: string-utf8 500,
  image-ipfs: string-ascii 100,
  creator: principal,
  members-count: uint,
  casts-count: uint,
  created-at: uint
}
```

## Gas Costs

Estimated transaction costs (testnet):

| Operation | Cost (STX) |
|-----------|-----------|
| Register User | ~0.005 |
| Create Cast | ~0.003 |
| Like/Unlike | ~0.002 |
| Follow/Unfollow | ~0.002 |
| Create Channel | ~0.004 |
| Join Channel | ~0.002 |

## Security Considerations

1. **Access Control**: Users can only modify their own data
2. **Input Validation**: All inputs are validated for length and format
3. **Duplicate Prevention**: Checks prevent duplicate likes, follows, etc.
4. **IPFS Pinning**: Media should be pinned to prevent loss
5. **Rate Limiting**: Consider implementing rate limits in frontend

## Frontend Integration

### Initialize Contract
```typescript
import { createSocialPlatformContract } from '@/lib/contracts/social-platform';
import { StacksTestnet } from '@stacks/network';

const contract = createSocialPlatformContract({
  network: new StacksTestnet(),
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'social-platform',
});
```

### Create a Cast
```typescript
await contract.createCast(
  'Hello, StackX!',
  ['QmXxxx...'], // IPFS CIDs
  [], // mentions
  undefined, // parent cast
  undefined  // channel
);
```

### Upload Image to IPFS
```typescript
import { uploadImage } from '@/lib/ipfs/client';

const file = event.target.files[0];
const cid = await uploadImage(file);
```

## Roadmap

- [ ] Direct messaging
- [ ] Token-gated channels
- [ ] NFT profile pictures
- [ ] Tipping with STX
- [ ] Content moderation tools
- [ ] Advanced search indexing
- [ ] Mobile app integration

## Support

- Documentation: [docs.stackx.io](https://docs.stackx.io)
- Discord: [discord.gg/stackx](https://discord.gg/stackx)
- Twitter: [@stackx_social](https://twitter.com/stackx_social)

## License

MIT License - see LICENSE file for details
