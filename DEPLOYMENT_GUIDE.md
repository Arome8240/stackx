# Staxial Health - Quick Deployment Guide

This guide will help you deploy the contracts and test the web application.

## Prerequisites

1. **Clarinet** - Install from https://docs.hiro.so/clarinet
2. **Stacks Wallet** - Install Hiro Wallet or Leather Wallet browser extension
3. **Testnet STX** - Get from https://explorer.hiro.so/sandbox/faucet?chain=testnet

## Step 1: Deploy Contracts to Testnet

Navigate to the contracts repository:

```bash
cd staxial-contract
```

### Check Contracts

```bash
clarinet check
```

### Deploy to Testnet

```bash
clarinet deployments apply -p deployments/testnet-plan.yaml
```

This will deploy all 5 contracts:
- health-token
- hospital-registry
- patient-records
- appointments
- prescriptions

### Note Your Contract Address

After deployment, note the deployer address (your testnet address). You'll need this for the web app configuration.

## Step 2: Configure Web Application

Navigate to the web app:

```bash
cd stackx/apps/web
```

### Create .env File

Create a `.env.local` file with your contract details:

```env
# Network Configuration
NEXT_PUBLIC_NETWORK=testnet

# Contract Addresses (use your deployer address)
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
NEXT_PUBLIC_DEPLOYER_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# Stacks API
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
```

Replace `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM` with your actual testnet address.

## Step 3: Run the Web Application

Install dependencies (if not already done):

```bash
cd stackx
pnpm install
```

Start the development server:

```bash
pnpm --filter web dev
```

The app will be available at http://localhost:3000

## Step 4: Test the Application

### Connect Wallet

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Select your wallet (Hiro or Leather)
4. Approve the connection

### Access Admin Dashboard

1. Navigate to http://localhost:3000/admin
2. You should see the admin dashboard (since you're the deployer)

### Test Hospital Management

Since no hospitals are registered yet, you'll need to register one first using Clarinet console or by creating a registration interface.

For testing, you can use Clarinet console:

```bash
cd staxial-contract
clarinet console
```

Then register a test hospital:

```clarity
(contract-call? .hospital-registry register-hospital 
  "Test Hospital" 
  "LIC-2024-001" 
  "New York, NY" 
  (list "general" "cardiology"))
```

After registering, the hospital should appear in the admin dashboard where you can:
- View hospital details
- Approve the hospital
- Suspend/reactivate hospitals
- View real-time stats

## Step 5: Test Contract Interactions

### Approve a Hospital

1. Go to Hospitals page
2. Find a pending hospital
3. Click "Approve"
4. Confirm the transaction in your wallet
5. Wait for confirmation (check Stacks Explorer)
6. Refresh to see updated status

### Suspend a Hospital

1. Find an active hospital
2. Click "Suspend"
3. Confirm in wallet
4. Wait for confirmation

### View Transaction

Click "View on Explorer" in the transaction modal to see your transaction on the Stacks blockchain explorer.

## Troubleshooting

### "No hospitals found"

- Make sure contracts are deployed
- Check that NEXT_PUBLIC_CONTRACT_ADDRESS is set correctly
- Verify you're on the correct network (testnet)
- Register at least one hospital using Clarinet console

### "Access Denied" on Admin Dashboard

- Make sure NEXT_PUBLIC_DEPLOYER_ADDRESS matches your wallet address
- Ensure you're connected with the deployer wallet

### Transaction Fails

- Check you have enough STX for gas fees
- Verify the contract function exists
- Check Stacks Explorer for error details

### Wallet Not Connecting

- Make sure you have a Stacks wallet extension installed
- Try refreshing the page
- Check browser console for errors

## Next Steps

1. **Register More Hospitals** - Use Clarinet console or build a registration UI
2. **Test All Features** - Try approving, suspending, and reactivating hospitals
3. **Monitor Transactions** - Use Stacks Explorer to track all transactions
4. **Add More Data** - Register patients, create appointments, issue prescriptions
5. **Deploy to Mainnet** - Once testing is complete, deploy to mainnet

## Useful Links

- **Stacks Explorer (Testnet)**: https://explorer.hiro.so/?chain=testnet
- **Stacks Faucet**: https://explorer.hiro.so/sandbox/faucet?chain=testnet
- **Clarinet Docs**: https://docs.hiro.so/clarinet
- **Stacks Connect Docs**: https://docs.hiro.so/stacks-connect

## Support

For issues or questions:
- Check the DEPLOYMENT.md in staxial-contract for detailed deployment info
- Review contract code in staxial-contract/contracts/
- Check web app code in stackx/apps/web/

Happy testing! 🚀
