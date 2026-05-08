# Farcaster-Like Social Platform - Build Plan

## Project Overview
Transform the healthcare app into a decentralized social media platform similar to Farcaster, built on Stacks blockchain.

## Core Features

### Phase 1: Foundation & Feed (Priority: HIGH)
1. **Home Feed**
   - Infinite scroll feed of casts (posts)
   - Like, recast, reply actions
   - Image/video support
   - Trending casts

2. **User Authentication**
   - Wallet connection (Stacks)
   - User profile creation
   - Username/display name

3. **Casting (Posting)**
   - Text casts (280 chars)
   - Image uploads
   - Link previews
   - Mentions (@username)

### Phase 2: Social Features (Priority: HIGH)
4. **User Profiles**
   - Profile page with bio, avatar, banner
   - User's casts
   - Following/followers count
   - Joined date

5. **Social Graph**
   - Follow/unfollow users
   - Following feed
   - Followers list
   - Following list

6. **Interactions**
   - Like casts
   - Recast (retweet)
   - Reply to casts
   - Quote casts

### Phase 3: Discovery (Priority: MEDIUM)
7. **Channels**
   - Browse channels
   - Join/leave channels
   - Channel-specific feeds
   - Create channels

8. **Search & Discovery**
   - Search users
   - Search casts
   - Trending topics
   - Suggested users

### Phase 4: Advanced Features (Priority: LOW)
9. **Notifications**
   - New followers
   - Likes, recasts, replies
   - Mentions

10. **Direct Messages**
    - 1-on-1 messaging
    - Message encryption

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (existing config)
- **Blockchain**: Stacks (wallet integration exists)
- **State**: React hooks + Context
- **Data**: Mock data initially, then blockchain

## File Structure
```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/
│   │   ├── feed/
│   │   ├── profile/[username]/
│   │   ├── channels/
│   │   ├── notifications/
│   │   └── search/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── cast/
│   │   ├── cast-card.tsx
│   │   ├── cast-composer.tsx
│   │   ├── cast-actions.tsx
│   │   └── cast-thread.tsx
│   ├── profile/
│   │   ├── profile-header.tsx
│   │   ├── profile-tabs.tsx
│   │   └── edit-profile-modal.tsx
│   ├── channel/
│   │   ├── channel-card.tsx
│   │   └── channel-list.tsx
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── navbar.tsx
│   │   └── right-sidebar.tsx
│   └── ui/ (existing)
├── lib/
│   ├── types/
│   │   ├── cast.ts
│   │   ├── user.ts
│   │   └── channel.ts
│   ├── hooks/
│   │   ├── use-feed.ts
│   │   ├── use-profile.ts
│   │   └── use-social.ts
│   └── mock-data/
│       ├── users.ts
│       ├── casts.ts
│       └── channels.ts
```

## Build Order
1. ✅ Create mock data (users, casts, channels)
2. ✅ Build layout (sidebar, navbar)
3. ✅ Create cast card component
4. ✅ Build home feed page
5. ✅ Create cast composer
6. ✅ Build user profile page
7. ✅ Implement follow/unfollow
8. ✅ Add cast interactions (like, recast, reply)
9. ✅ Build channels feature
10. ✅ Add search functionality

## Design Notes
- Use existing Mint Confetti color scheme
- Dark mode by default
- Clean, modern UI similar to Farcaster/Twitter
- Mobile-responsive
