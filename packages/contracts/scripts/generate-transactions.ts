import hre from "hardhat";

async function main() {
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "";
  
  if (!TOKEN_ADDRESS) {
    throw new Error("Please set TOKEN_ADDRESS in .env file");
  }

  const [signer] = await hre.ethers.getSigners();
  
  console.log("Generating transactions for token at:", TOKEN_ADDRESS);
  console.log("Using account:", signer.address);

  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);

  // Generate random addresses for testing
  const randomAddresses = Array.from({ length: 5 }, () => 
    hre.ethers.Wallet.createRandom().address
  );

  console.log("\n=== Generating Multiple Transactions ===\n");

  // 1. Multiple transfers
  console.log("1. Sending transfers to random addresses...");
  for (let i = 0; i < randomAddresses.length; i++) {
    const amount = hre.ethers.parseUnits((Math.random() * 100 + 1).toFixed(2), 18);
    const tx = await token.transfer(randomAddresses[i], amount);
    await tx.wait();
    console.log(`   Transfer ${i + 1}: ${hre.ethers.formatUnits(amount, 18)} tokens to ${randomAddresses[i].slice(0, 10)}...`);
    console.log(`   Tx hash: ${tx.hash}`);
  }

  // 2. Batch transfer
  console.log("\n2. Batch transfer...");
  const batchAmounts = randomAddresses.map(() => 
    hre.ethers.parseUnits((Math.random() * 50 + 1).toFixed(2), 18)
  );
  const batchTx = await token.batchTransfer(randomAddresses, batchAmounts);
  await batchTx.wait();
  console.log(`   Batch transferred to ${randomAddresses.length} addresses`);
  console.log(`   Tx hash: ${batchTx.hash}`);

  // 3. Mint tokens
  console.log("\n3. Minting tokens...");
  const mintAmount = hre.ethers.parseUnits("10000", 18);
  const mintTx = await token.mint(signer.address, mintAmount);
  await mintTx.wait();
  console.log(`   Minted ${hre.ethers.formatUnits(mintAmount, 18)} tokens`);
  console.log(`   Tx hash: ${mintTx.hash}`);

  // 4. Burn tokens
  console.log("\n4. Burning tokens...");
  const burnAmount = hre.ethers.parseUnits("1000", 18);
  const burnTx = await token.burn(burnAmount);
  await burnTx.wait();
  console.log(`   Burned ${hre.ethers.formatUnits(burnAmount, 18)} tokens`);
  console.log(`   Tx hash: ${burnTx.hash}`);

  // 5. Approve transactions
  console.log("\n5. Creating approvals...");
  for (let i = 0; i < 3; i++) {
    const approveAmount = hre.ethers.parseUnits((Math.random() * 1000 + 100).toFixed(2), 18);
    const approveTx = await token.approve(randomAddresses[i], approveAmount);
    await approveTx.wait();
    console.log(`   Approval ${i + 1}: ${hre.ethers.formatUnits(approveAmount, 18)} tokens for ${randomAddresses[i].slice(0, 10)}...`);
    console.log(`   Tx hash: ${approveTx.hash}`);
  }

  // Summary
  console.log("\n=== Transaction Summary ===");
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
