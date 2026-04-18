import { ethers } from "hardhat";

async function main() {
  // Replace with your deployed token address
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "";
  
  if (!TOKEN_ADDRESS) {
    throw new Error("Please set TOKEN_ADDRESS in .env file");
  }

  const [owner, addr1, addr2] = await ethers.getSigners();
  
  console.log("Interacting with token at:", TOKEN_ADDRESS);
  console.log("Using account:", owner.address);

  // Get contract instance
  const CeloToken = await ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);

  // Get token info
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();
  const maxSupply = await token.maxSupply();
  
  console.log("\n=== Token Info ===");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Decimals:", decimals);
  console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals));
  console.log("Max Supply:", ethers.formatUnits(maxSupply, decimals));

  // Check balance
  const balance = await token.balanceOf(owner.address);
  console.log("\n=== Balance ===");
  console.log("Owner balance:", ethers.formatUnits(balance, decimals));

  // Transfer tokens
  console.log("\n=== Transfer ===");
  const transferAmount = ethers.parseUnits("100", decimals);
  const transferTx = await token.transfer(addr1.address, transferAmount);
  await transferTx.wait();
  console.log("Transferred 100 tokens to:", addr1.address);
  console.log("Transaction hash:", transferTx.hash);

  // Check new balances
  const newBalance = await token.balanceOf(owner.address);
  const addr1Balance = await token.balanceOf(addr1.address);
  console.log("Owner new balance:", ethers.formatUnits(newBalance, decimals));
  console.log("Recipient balance:", ethers.formatUnits(addr1Balance, decimals));

  // Approve and transferFrom
  console.log("\n=== Approve & TransferFrom ===");
  const approveAmount = ethers.parseUnits("50", decimals);
  const approveTx = await token.connect(addr1).approve(owner.address, approveAmount);
  await approveTx.wait();
  console.log("Addr1 approved owner to spend 50 tokens");
  
  const allowance = await token.allowance(addr1.address, owner.address);
  console.log("Allowance:", ethers.formatUnits(allowance, decimals));

  const transferFromTx = await token.transferFrom(addr1.address, addr2.address, approveAmount);
  await transferFromTx.wait();
  console.log("Transferred 50 tokens from addr1 to addr2");
  console.log("Transaction hash:", transferFromTx.hash);

  // Mint new tokens
  console.log("\n=== Mint ===");
  const mintAmount = ethers.parseUnits("1000", decimals);
  const mintTx = await token.mint(owner.address, mintAmount);
  await mintTx.wait();
  console.log("Minted 1000 tokens to owner");
  console.log("Transaction hash:", mintTx.hash);

  const newTotalSupply = await token.totalSupply();
  console.log("New total supply:", ethers.formatUnits(newTotalSupply, decimals));

  // Burn tokens
  console.log("\n=== Burn ===");
  const burnAmount = ethers.parseUnits("500", decimals);
  const burnTx = await token.burn(burnAmount);
  await burnTx.wait();
  console.log("Burned 500 tokens");
  console.log("Transaction hash:", burnTx.hash);

  const finalTotalSupply = await token.totalSupply();
  console.log("Final total supply:", ethers.formatUnits(finalTotalSupply, decimals));

  // Batch transfer
  console.log("\n=== Batch Transfer ===");
  const recipients = [addr1.address, addr2.address];
  const amounts = [
    ethers.parseUnits("10", decimals),
    ethers.parseUnits("20", decimals)
  ];
  const batchTx = await token.batchTransfer(recipients, amounts);
  await batchTx.wait();
  console.log("Batch transferred tokens to multiple addresses");
  console.log("Transaction hash:", batchTx.hash);

  console.log("\n=== Final Balances ===");
  const finalOwnerBalance = await token.balanceOf(owner.address);
  const finalAddr1Balance = await token.balanceOf(addr1.address);
  const finalAddr2Balance = await token.balanceOf(addr2.address);
  console.log("Owner:", ethers.formatUnits(finalOwnerBalance, decimals));
  console.log("Addr1:", ethers.formatUnits(finalAddr1Balance, decimals));
  console.log("Addr2:", ethers.formatUnits(finalAddr2Balance, decimals));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
