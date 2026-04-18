# Celo ERC20 Token

A simple ERC20 token contract for Celo blockchain.

## Features

- Standard ERC20 functionality
- Burnable tokens
- Mintable by owner
- OpenZeppelin contracts for security

## Setup

```bash
pnpm install
```

## Compile

```bash
pnpm compile
```

## Deploy

1. Create a `.env` file with your private key:
```
PRIVATE_KEY=your_private_key_here
```

2. Deploy to Alfajores testnet:
```bash
pnpm deploy:alfajores
```

3. Deploy to Celo mainnet:
```bash
pnpm deploy:celo
```

## Customize

Edit `contracts/CeloToken.sol` to change:
- Token name
- Token symbol
- Initial supply
- Add custom functionality
