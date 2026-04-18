import hre from "hardhat";

async function main() {
  const signers = await hre.ethers.getSigners();
  
  if (signers.length === 0) {
    throw new Error("No signers available. Please check your PRIVATE_KEY in .env file");
  }

  const deployer = signers[0];

  console.log("Deploying contracts with the account:", deployer.address);

  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = await CeloToken.deploy(
    "My Celo Token",
    "MCT",
    1000000, // Initial supply: 1,000,000 tokens
    10000000 // Max supply: 10,000,000 tokens
  );

  await token.waitForDeployment();

  console.log("Token deployed to:", await token.getAddress());
  console.log("\nAdd this to your .env file:");
  console.log(`TOKEN_ADDRESS=${await token.getAddress()}`);
  console.log(`NEXT_PUBLIC_TOKEN_ADDRESS=${await token.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
