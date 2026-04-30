# Stacks Mobile Wallet Integration

## Overview
This document outlines the wallet integration strategy for the Staxial Health mobile app.

## Wallet Options for Stacks on Mobile

### 1. Hiro Wallet Mobile
- **Status:** Available
- **Platform:** iOS & Android
- **Deep Linking:** Supported
- **Features:** Full Stacks wallet functionality
- **Integration:** Via deep links and custom URL schemes

### 2. Xverse Mobile
- **Status:** Available
- **Platform:** iOS & Android
- **Deep Linking:** Supported
- **Features:** Bitcoin & Stacks support
- **Integration:** Via deep links

### 3. Leather Wallet (formerly Hiro Web Wallet)
- **Status:** Web-based, mobile browser compatible
- **Platform:** Mobile browsers
- **Integration:** WebView or browser redirect

### 4. Custom Wallet Implementation
- **Status:** To be implemented
- **Platform:** Native
- **Features:** 
  - Secure key storage using device keychain
  - Biometric authentication
  - Transaction signing
  - Account management

## Recommended Approach

### Phase 1: Deep Link Integration (Current)
Use deep linking to connect with existing Stacks mobile wallets:
- Hiro Wallet Mobile
- Xverse Mobile

**Pros:**
- Quick implementation
- Users can use existing wallets
- No key management responsibility

**Cons:**
- Requires users to have wallet installed
- Context switching between apps
- Limited UX control

### Phase 2: In-App Wallet (Future)
Implement custom wallet functionality:
- Secure key generation and storage
- Biometric authentication
- Seamless UX

**Pros:**
- Better user experience
- No app switching
- Full control over UX

**Cons:**
- More complex implementation
- Security responsibility
- Maintenance overhead

## Implementation Strategy

### Current Implementation (Deep Link)

1. **Wallet Detection**
   - Check if Hiro/Xverse is installed
   - Provide install links if not

2. **Connection Flow**
   - Generate authentication request
   - Open wallet via deep link
   - Receive authentication response
   - Store session

3. **Transaction Signing**
   - Prepare transaction
   - Send to wallet via deep link
   - Receive signed transaction
   - Broadcast to network

### Deep Link Schemes

```typescript
// Hiro Wallet
const hiroScheme = 'hiro://';

// Xverse Wallet
const xverseScheme = 'xverse://';

// Authentication Request
const authRequest = `${scheme}auth?request=${encodedRequest}`;

// Transaction Request
const txRequest = `${scheme}sign?transaction=${encodedTx}`;
```

### Security Considerations

1. **Key Storage**
   - Never store private keys in app
   - Use secure storage for session tokens
   - Implement biometric authentication

2. **Transaction Verification**
   - Always verify transaction details
   - Show clear confirmation screens
   - Implement spending limits

3. **Session Management**
   - Implement session timeouts
   - Require re-authentication for sensitive operations
   - Clear sessions on logout

## Dependencies

```json
{
  "expo-local-authentication": "^14.0.0",
  "expo-secure-store": "^13.0.0",
  "expo-linking": "^6.0.0",
  "@stacks/transactions": "^7.4.0",
  "@stacks/network": "^7.3.1"
}
```

## Next Steps

1. ✅ Research wallet options
2. ⏳ Install wallet dependencies
3. ⏳ Create wallet context provider
4. ⏳ Implement connect wallet screen
5. ⏳ Add secure key storage
6. ⏳ Implement biometric authentication

## Resources

- [Stacks Connect Documentation](https://docs.stacks.co/build-apps/connect)
- [Hiro Wallet Mobile](https://wallet.hiro.so/)
- [Xverse Wallet](https://www.xverse.app/)
- [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo Local Authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)
