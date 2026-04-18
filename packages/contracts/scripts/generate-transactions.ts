import hre from "hardhat";

// Helper function to add delay between transactions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "";
  
  if (!TOKEN_ADDRESS) {
    throw new Error("Please set TOKEN_ADDRESS in .env file");
  }

  const [signer] = await hre.ethers.getSigners();
  
  console.log("Generating 50+ transactions for token at:", TOKEN_ADDRESS);
  console.log("Using account:", signer.address);

  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);

  // Generate random addresses for testing
  const randomAddresses = Array.from({ length: 20 }, () => 
    hre.ethers.Wallet.createRandom().address
  );

  let txCount = 0;
  const DELAY_MS = 2000; // 2 seconds between transactions

  console.log("\n=== Generating Multiple Transactions ===\n");

  // 1. Multiple transfers (20 transactions)
  console.log("1. Sending 20 transfers to random addresses...");
  for (let i = 0; i < randomAddresses.length; i++) {
    try {
      const amount = hre.ethers.parseUnits((Math.random() * 100 + 1).toFixed(2), 18);
      const tx = await token.transfer(randomAddresses[i], amount);
      await tx.wait();
      txCount++;
      console.log(`   Transfer ${txCount}: ${hre.ethers.formatUnits(amount, 18)} tokens to ${randomAddresses[i].slice(0, 10)}...`);
      console.log(`   Tx hash: ${tx.hash}`);
      
      // Add delay to avoid rate limiting
      if (i < randomAddresses.length - 1) {
        await delay(DELAY_MS);
      }
    } catch (error: any) {
      console.error(`   Transfer ${i + 1} failed:`, error.message);
    }
  }

  // 2. Batch transfers (5 transactions)
  console.log("\n2. Sending 5 batch transfers...");
  for (let i = 0; i < 5; i++) {
    try {
      const batchSize = 4;
      const recipients = randomAddresses.slice(i * batchSize, (i + 1) * batchSize);
      const batchAmounts = recipients.map(() => 
        hre.ethers.parseUnits((Math.random() * 50 + 1).toFixed(2), 18)
      );
      const batchTx = await token.batchTransfer(recipients, batchAmounts);
      await batchTx.wait();
      txCount++;
      console.log(`   Batch ${i + 1}: Transferred to ${recipients.length} addresses`);
      console.log(`   Tx hash: ${batchTx.hash}`);
      
      if (i < 4) {
        await delay(DELAY_MS);
      }
    } catch (error: any) {
      console.error(`   Batch ${i + 1} failed:`, error.message);
    }
  }
  const batchTx = await token.batchTransfer(randomAddresses, batchAmounts);
  await batchTx.wait();
  console.log(`   Batch transferred to ${randomAddresses.length} addresses`);
  console.log(`   Tx hash: ${batchTx.hash}`);

  // 3. Mint tokens (10 transactions)
  console.log("\n3. Minting tokens (10 times)...");
  for (let i = 0; i < 10; i++) {
    try {
      const mintAmount = hre.ethers.parseUnits((Math.random() * 5000 + 1000).toFixed(2), 18);
      const mintTx = await token.mint(signer.address, mintAmount);
      await mintTx.wait();
      txCount++;
      console.log(`   Mint ${i + 1}: ${hre.ethers.formatUnits(mintAmount, 18)} tokens`);
      console.log(`   Tx hash: ${mintTx.hash}`);
      
      if (i < 9) {
        await delay(DELAY_MS);
      }
    } catch (error: any) {
      console.error(`   Mint ${i + 1} failed:`, error.message);
    }
  }

  // 4. Burn tokens (5 transactions)
  console.log("\n4. Burning tokens (5 times)...");
  for (let i = 0; i < 5; i++) {
    try {
      const burnAmount = hre.ethers.parseUnits((Math.random() * 500 + 100).toFixed(2), 18);
      const burnTx = await token.burn(burnAmount);
      await burnTx.wait();
      txCount++;
      console.log(`   Burn ${i + 1}: ${hre.ethers.formatUnits(burnAmount, 18)} tokens`);
      console.log(`   Tx hash: ${burnTx.hash}`);
      
      if (i < 4) {
        await delay(DELAY_MS);
      }
    } catch (error: any) {
      console.error(`   Burn ${i + 1} failed:`, error.message);
    }
  }

  // 5. Approve transactions (15 transactions)
  console.log("\n5. Creating approvals (15 times)...");
  for (let i = 0; i < 15; i++) {
    try {
      const approveAmount = hre.ethers.parseUnits((Math.random() * 1000 + 100).toFixed(2), 18);
      const randomAddr = randomAddresses[i % randomAddresses.length];
      const approveTx = await token.approve(randomAddr, approveAmount);
      await approveTx.wait();
      txCount++;
      console.log(`   Approval ${i + 1}: ${hre.ethers.formatUnits(approveAmount, 18)} tokens for ${randomAddr.slice(0, 10)}...`);
      console.log(`   Tx hash: ${approveTx.hash}`);
      
      if (i < 14) {
        await delay(DELAY_MS);
      }
    } catch (error: any) {
      console.error(`   Approval ${i + 1} failed:`, error.message);
    }
  }

  // Summary
  console.log("\n=== Transaction Summary ===");
  console.log(`Total transactions generated: ${txCount}`);
  const totalSupply = await token.totalSupply();
  const balance = await token.balanceOf(signer.address);
  console.log("Total Supply:", hre.ethers.formatUnits(totalSupply, 18));
  console.log("Your Balance:", hre.ethers.formatUnits(balance, 18));
  
  console.log("\n✅ Transaction generation complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
