# StackX - Farcaster-like Social Platform

## 🎉 Overview
Successfully transformed the healthcare app into a decentralized social media platform similar to Farcaster, built on Stacks blockchain.

## ✅ Completed Features

### Core Social Features
- **Home Feed** - Main timeline displaying all casts (posts) on the homepage
- **Cast Composer** - Create posts with 280 character limit
- **Cast Interactions** - Like, recast (retweet), reply, and share functionality
- **User Profiles** - Profile pages with bio, avatar, banner, stats, and follow/unfollow
- **Channels** - Browse and join topic-based channels
- **Search** - Find users and casts with tabbed results
- **Notifications** - Activity feed for follows, likes, recasts, replies, and mentions

### Layout & Navigation
- **Desktop Sidebar** - Left navigation with Home, Channels, Notifications, Profile, Search
- **Mobile Bottom Nav** - Responsive mobile navigation
- **Right Sidebar** - Suggested users and trending channels
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Mock Data
- **8 Users** - Including Vitalik Buterin, Dan Romero, Jesse Pollak, Balaji, etc.
- **12 Casts** - Sample posts with text, images, and mentions
- **8 Channels** - crypto, defi, nfts, builders, daos, memes, stacks, ethereum

## 🎨 Design System
- **Color Scheme**: Mint Confetti (existing design)
- **Dark Mode**: Default theme
- **Typography**: Space Grotesk (sans), Space Mono (mono)
- **Styling**: Tailwind CSS with custom color variables

## 📁 Project Structure

```
apps/web/
├── app/
│   ├── (main)/
│   │   ├── channels/page.tsx
│   │   ├── feed/page.tsx (legacy, can be removed)
│   │   ├── notifications/page.tsx
│   │   ├── profile/[username]/page.tsx
│   │   └── search/page.tsx
│   ├── layout.tsx (includes sidebar & nav)
│   └── page.tsx (main feed - homepage)
├── components/
│   ├── cast/
│   │   ├── cast-card.tsx
│   │   └── cast-composer.tsx
│   └── layout/
│       ├── sidebar.tsx
│       ├── mobile-nav.tsx
│       └── right-sidebar.tsx
└── lib/
    ├── mock-data/
    │   ├── users.ts
    │   ├── casts.ts
    │   └── channels.ts
    └── types/
        └── social.ts
```

## 🚀 Running the App

```bash
cd apps/web
npm run dev
```

Visit `http://localhost:3000` - The feed displays immediately on the homepage!

## 🔧 Build Status
✅ **Build Successful** - No errors, all TypeScript types resolved

## 📱 Features Breakdown

### Cast Card Component
- User avatar and display name with verification badge
- Timestamp with relative time (e.g., "2h ago")
- Cast content with image support
- Action buttons: Reply, Recast, Like, Share
- Interactive state management (likes and recasts update in real-time)

### Cast Composer
- Auto-expanding textarea
- Character counter (280 max)
- Action buttons for images, GIFs, emojis
- Disabled state when empty or over limit

### User Profiles
- Banner image and profile avatar
- Bio and join date
- Following/followers counts
- Tabs: Casts, Replies, Likes
- Follow/Unfollow button (Following button shows on hover)
- Edit Profile button for own profile

### Channels
- Grid layout with channel cards
- Search functionality
- Member and cast counts
- Join button for each channel

### Search
- Tabbed interface (Users / Casts)
- Real-time filtering
- Result counts
- Follow buttons on user results

### Notifications
- Grouped by type (follow, like, recast, reply, mention)
- Unread indicator
- Timestamp for each notification
- Links to relevant users and casts

## 🎯 Next Steps (Optional Enhancements)

1. **Individual Channel Pages** - `/channels/[name]` with channel-specific feeds
2. **Cast Thread View** - Click a cast to see full conversation
3. **Image Upload** - Actual image upload to IPFS
4. **Real-time Updates** - WebSocket for live feed
5. **Blockchain Integration** - Store casts on Stacks
6. **Direct Messages** - 1-on-1 encrypted messaging
7. **Advanced Search** - Hashtags, trending topics
8. **User Settings** - Theme, notifications, privacy
9. **Wallet Integration** - Connect Stacks wallet for identity
10. **Token Gating** - Require tokens to access certain channels

## 🔐 Blockchain Integration (Future)

The app is designed to integrate with Stacks blockchain:
- User identity via wallet addresses
- Casts stored as on-chain data
- Channels as smart contracts
- Token-gated communities
- Decentralized storage (IPFS) for media

## 📊 Current State

- **Frontend**: 100% Complete ✅
- **Mock Data**: 100% Complete ✅
- **Responsive Design**: 100% Complete ✅
- **Build**: Passing ✅
- **Blockchain Integration**: 0% (Future work)

## 🎨 Design Highlights

- Clean, modern UI inspired by Farcaster and Twitter
- Smooth transitions and hover effects
- Consistent spacing and typography
- Accessible color contrast
- Mobile-first responsive design

---

**Built with**: Next.js 15, React 18, TypeScript, Tailwind CSS, Stacks Connect
**Status**: Production Ready (with mock data)
**Last Updated**: 2026-05-08
