import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CeloToken = await ethers.getContractFactory("CeloToken");
  const token = await CeloToken.deploy(
    "My Celo Token",
    "MCT",
    1000000, // Initial supply: 1,000,000 tokens
    10000000 // Max supply: 10,000,000 tokens
  );

  await token.waitForDeployment();

  console.log("Token deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
