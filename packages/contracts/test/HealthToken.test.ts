import { expect } from "chai";
import hre from "hardhat";
import { HealthToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("HealthToken", function () {
  let healthToken: HealthToken;
  let owner: SignerWithAddress;
  let hospital: SignerWithAddress;
  let patient: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const TOKEN_NAME = "Health Token";
  const TOKEN_SYMBOL = "HLTH";
  const INITIAL_SUPPLY = 1000000; // 1M tokens
  const MAX_SUPPLY = 10000000; // 10M tokens
  const HOSPITAL_STAKE = 10000; // 10K tokens

  beforeEach(async function () {
    [owner, hospital, patient, addr1, addr2] = await hre.ethers.getSigners();

    const HealthTokenFactory = await hre.ethers.getContractFactory("HealthToken");
    healthToken = await HealthTokenFactory.deploy(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      INITIAL_SUPPLY,
      MAX_SUPPLY,
      HOSPITAL_STAKE
    );
    await healthToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right token name and symbol", async function () {
      expect(await healthToken.name()).to.equal(TOKEN_NAME);
      expect(await healthToken.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await healthToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(hre.ethers.parseUnits(INITIAL_SUPPLY.toString(), 18));
    });

    it("Should set the correct max supply", async function () {
      const maxSupply = await healthToken.maxSupply();
      expect(maxSupply).to.equal(hre.ethers.parseUnits(MAX_SUPPLY.toString(), 18));
    });

    it("Should set the correct hospital stake amount", async function () {
      const stakeAmount = await healthToken.hospitalStakeAmount();
      expect(stakeAmount).to.equal(hre.ethers.parseUnits(HOSPITAL_STAKE.toString(), 18));
    });

    it("Should grant admin roles to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await healthToken.DEFAULT_ADMIN_ROLE();
      const MINTER_ROLE = await healthToken.MINTER_ROLE();
      const PAUSER_ROLE = await healthToken.PAUSER_ROLE();

      expect(await healthToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await healthToken.hasRole(MINTER_ROLE, owner.address)).to.be.true;
      expect(await healthToken.hasRole(PAUSER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint tokens", async function () {
      const mintAmount = hre.ethers.parseUnits("1000", 18);
      await healthToken.mint(addr1.address, mintAmount);
      expect(await healthToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should not allow minting beyond max supply", async function () {
      const excessAmount = hre.ethers.parseUnits((MAX_SUPPLY - INITIAL_SUPPLY + 1).toString(), 18);
      await expect(
        healthToken.mint(addr1.address, excessAmount)
      ).to.be.revertedWith("Exceeds max supply");
    });

    it("Should not allow non-minter to mint", async function () {
      const mintAmount = hre.ethers.parseUnits("1000", 18);
      await expect(
        healthToken.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.reverted;
    });

    it("Should emit TokensMinted event", async function () {
      const mintAmount = hre.ethers.parseUnits("1000", 18);
      await expect(healthToken.mint(addr1.address, mintAmount))
        .to.emit(healthToken, "TokensMinted")
        .withArgs(addr1.address, mintAmount);
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      const transferAmount = hre.ethers.parseUnits("1000", 18);
      await healthToken.transfer(addr1.address, transferAmount);
    });

    it("Should allow users to burn their tokens", async function () {
      const burnAmount = hre.ethers.parseUnits("500", 18);
      const initialBalance = await healthToken.balanceOf(addr1.address);
      
      await healthToken.connect(addr1).burn(burnAmount);
      
      expect(await healthToken.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
    });

    it("Should emit TokensBurned event", async function () {
      const burnAmount = hre.ethers.parseUnits("500", 18);
      await expect(healthToken.connect(addr1).burn(burnAmount))
        .to.emit(healthToken, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
    });

    it("Should allow burning with allowance", async function () {
      const burnAmount = hre.ethers.parseUnits("500", 18);
      await healthToken.connect(addr1).approve(addr2.address, burnAmount);
      await healthToken.connect(addr2).burnFrom(addr1.address, burnAmount);
      
      expect(await healthToken.balanceOf(addr1.address)).to.equal(
        hre.ethers.parseUnits("500", 18)
      );
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      const transferAmount = hre.ethers.parseUnits("20000", 18);
      await healthToken.transfer(hospital.address, transferAmount);
    });

    it("Should allow users to stake tokens", async function () {
      const stakeAmount = hre.ethers.parseUnits("10000", 18);
      await healthToken.connect(hospital).stake(stakeAmount);
      
      expect(await healthToken.stakedBalanceOf(hospital.address)).to.equal(stakeAmount);
      expect(await healthToken.totalStaked()).to.equal(stakeAmount);
    });

    it("Should emit Staked event", async function () {
      const stakeAmount = hre.ethers.parseUnits("10000", 18);
      await expect(healthToken.connect(hospital).stake(stakeAmount))
        .to.emit(healthToken, "Staked")
        .withArgs(hospital.address, stakeAmount);
    });

    it("Should not allow staking more than balance", async function () {
      const excessAmount = hre.ethers.parseUnits("30000", 18);
      await expect(
        healthToken.connect(hospital).stake(excessAmount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should allow unstaking", async function () {
      const stakeAmount = hre.ethers.parseUnits("10000", 18);
      await healthToken.connect(hospital).stake(stakeAmount);
      
      const unstakeAmount = hre.ethers.parseUnits("5000", 18);
      await healthToken.connect(hospital).unstake(unstakeAmount);
      
      expect(await healthToken.stakedBalanceOf(hospital.address)).to.equal(
        stakeAmount - unstakeAmount
      );
    });

    it("Should emit Unstaked event", async function () {
      const stakeAmount = hre.ethers.parseUnits("10000", 18);
      await healthToken.connect(hospital).stake(stakeAmount);
      
      const unstakeAmount = hre.ethers.parseUnits("5000", 18);
      await expect(healthToken.connect(hospital).unstake(unstakeAmount))
        .to.emit(healthToken, "Unstaked")
        .withArgs(hospital.address, unstakeAmount);
    });

    it("Should check if address has hospital stake", async function () {
      const stakeAmount = hre.ethers.parseUnits("10000", 18);
      expect(await healthToken.hasHospitalStake(hospital.address)).to.be.false;
      
      await healthToken.connect(hospital).stake(stakeAmount);
      expect(await healthToken.hasHospitalStake(hospital.address)).to.be.true;
    });

    it("Should record stake timestamp", async function () {
      const stakeAmount = hre.ethers.parseUnits("10000", 18);
      await healthToken.connect(hospital).stake(stakeAmount);
      
      const timestamp = await healthToken.stakeTimestampOf(hospital.address);
      expect(timestamp).to.be.gt(0);
    });
  });

  describe("Rewards", function () {
    it("Should allow minter to distribute rewards", async function () {
      const rewardAmount = hre.ethers.parseUnits("100", 18);
      await healthToken.distributeReward(patient.address, rewardAmount);
      
      expect(await healthToken.rewardBalance(patient.address)).to.equal(rewardAmount);
      expect(await healthToken.rewardPool()).to.equal(rewardAmount);
    });

    it("Should emit RewardDistributed event", async function () {
      const rewardAmount = hre.ethers.parseUnits("100", 18);
      await expect(healthToken.distributeReward(patient.address, rewardAmount))
        .to.emit(healthToken, "RewardDistributed")
        .withArgs(patient.address, rewardAmount);
    });

    it("Should allow users to claim rewards", async function () {
      const rewardAmount = hre.ethers.parseUnits("100", 18);
      await healthToken.distributeReward(patient.address, rewardAmount);
      
      const initialBalance = await healthToken.balanceOf(patient.address);
      await healthToken.connect(patient).claimRewards();
      
      expect(await healthToken.balanceOf(patient.address)).to.equal(
        initialBalance + rewardAmount
      );
      expect(await healthToken.rewardBalance(patient.address)).to.equal(0);
    });

    it("Should emit RewardClaimed event", async function () {
      const rewardAmount = hre.ethers.parseUnits("100", 18);
      await healthToken.distributeReward(patient.address, rewardAmount);
      
      await expect(healthToken.connect(patient).claimRewards())
        .to.emit(healthToken, "RewardClaimed")
        .withArgs(patient.address, rewardAmount);
    });

    it("Should not allow claiming when no rewards", async function () {
      await expect(
        healthToken.connect(patient).claimRewards()
      ).to.be.revertedWith("No rewards to claim");
    });

    it("Should support batch reward distribution", async function () {
      const recipients = [patient.address, addr1.address, addr2.address];
      const amounts = [
        hre.ethers.parseUnits("100", 18),
        hre.ethers.parseUnits("200", 18),
        hre.ethers.parseUnits("300", 18),
      ];
      
      await healthToken.batchDistributeRewards(recipients, amounts);
      
      expect(await healthToken.rewardBalance(patient.address)).to.equal(amounts[0]);
      expect(await healthToken.rewardBalance(addr1.address)).to.equal(amounts[1]);
      expect(await healthToken.rewardBalance(addr2.address)).to.equal(amounts[2]);
    });
  });

  describe("Role Management", function () {
    beforeEach(async function () {
      const transferAmount = hre.ethers.parseUnits("20000", 18);
      await healthToken.transfer(hospital.address, transferAmount);
      const stakeAmount = hre.ethers.parseUnits("10000", 18);
      await healthToken.connect(hospital).stake(stakeAmount);
    });

    it("Should grant hospital role when stake requirement met", async function () {
      await healthToken.grantHospitalRole(hospital.address);
      
      const HOSPITAL_ROLE = await healthToken.HOSPITAL_ROLE();
      expect(await healthToken.hasRole(HOSPITAL_ROLE, hospital.address)).to.be.true;
    });

    it("Should not grant hospital role without sufficient stake", async function () {
      await expect(
        healthToken.grantHospitalRole(patient.address)
      ).to.be.revertedWith("Insufficient stake for hospital role");
    });

    it("Should allow admin to revoke hospital role", async function () {
      await healthToken.grantHospitalRole(hospital.address);
      await healthToken.revokeHospitalRole(hospital.address);
      
      const HOSPITAL_ROLE = await healthToken.HOSPITAL_ROLE();
      expect(await healthToken.hasRole(HOSPITAL_ROLE, hospital.address)).to.be.false;
    });
  });

  describe("Pause Functionality", function () {
    it("Should allow pauser to pause transfers", async function () {
      await healthToken.pause();
      
      await expect(
        healthToken.transfer(addr1.address, hre.ethers.parseUnits("100", 18))
      ).to.be.reverted;
    });

    it("Should allow pauser to unpause", async function () {
      await healthToken.pause();
      await healthToken.unpause();
      
      await expect(
        healthToken.transfer(addr1.address, hre.ethers.parseUnits("100", 18))
      ).to.not.be.reverted;
    });

    it("Should not allow non-pauser to pause", async function () {
      await expect(healthToken.connect(addr1).pause()).to.be.reverted;
    });
  });

  describe("Batch Operations", function () {
    it("Should support batch transfers", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [
        hre.ethers.parseUnits("100", 18),
        hre.ethers.parseUnits("200", 18),
      ];
      
      await healthToken.batchTransfer(recipients, amounts);
      
      expect(await healthToken.balanceOf(addr1.address)).to.equal(amounts[0]);
      expect(await healthToken.balanceOf(addr2.address)).to.equal(amounts[1]);
    });

    it("Should revert batch transfer with mismatched arrays", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [hre.ethers.parseUnits("100", 18)];
      
      await expect(
        healthToken.batchTransfer(recipients, amounts)
      ).to.be.revertedWith("Arrays length mismatch");
    });
  });

  describe("Token-Gated Access", function () {
    it("Should check minimum balance correctly", async function () {
      const minBalance = hre.ethers.parseUnits("1000", 18);
      
      expect(await healthToken.hasMinimumBalance(owner.address, minBalance)).to.be.true;
      expect(await healthToken.hasMinimumBalance(patient.address, minBalance)).to.be.false;
    });
  });

  describe("Supply Management", function () {
    it("Should allow admin to update max supply", async function () {
      const newMaxSupply = hre.ethers.parseUnits("20000000", 18);
      await healthToken.updateMaxSupply(newMaxSupply);
      
      expect(await healthToken.maxSupply()).to.equal(newMaxSupply);
    });

    it("Should not allow decreasing max supply", async function () {
      const lowerMaxSupply = hre.ethers.parseUnits("5000000", 18);
      await expect(
        healthToken.updateMaxSupply(lowerMaxSupply)
      ).to.be.revertedWith("New max supply must be greater than current");
    });

    it("Should allow admin to update hospital stake amount", async function () {
      const newStakeAmount = 20000;
      await healthToken.updateHospitalStakeAmount(newStakeAmount);
      
      expect(await healthToken.hospitalStakeAmount()).to.equal(
        hre.ethers.parseUnits(newStakeAmount.toString(), 18)
      );
    });
  });
});
