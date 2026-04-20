import { expect } from "chai";
import hre from "hardhat";
import { HospitalRegistry, HealthToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("HospitalRegistry", function () {
  let healthToken: HealthToken;
  let hospitalRegistry: HospitalRegistry;
  let owner: SignerWithAddress;
  let hospital1: SignerWithAddress;
  let hospital2: SignerWithAddress;
  let hospital3: SignerWithAddress;
  let patient: SignerWithAddress;
  let verifier: SignerWithAddress;

  const TOKEN_NAME = "Health Token";
  const TOKEN_SYMBOL = "HLTH";
  const INITIAL_SUPPLY = 10000000; // 10M tokens
  const MAX_SUPPLY = 100000000; // 100M tokens
  const HOSPITAL_STAKE = 10000; // 10K tokens
  const MINIMUM_STAKE = hre.ethers.parseUnits("10000", 18);
  const REGISTRATION_FEE = hre.ethers.parseUnits("1000", 18);

  const HOSPITAL_1_DATA = {
    name: "City General Hospital",
    registrationNumber: "HOS-001",
    physicalAddress: "123 Main St, City",
    specialties: ["Cardiology", "Neurology", "Pediatrics"],
  };

  const HOSPITAL_2_DATA = {
    name: "County Medical Center",
    registrationNumber: "HOS-002",
    physicalAddress: "456 Oak Ave, County",
    specialties: ["Orthopedics", "Oncology"],
  };

  beforeEach(async function () {
    [owner, hospital1, hospital2, hospital3, patient, verifier] = await hre.ethers.getSigners();

    // Deploy HealthToken
    const HealthTokenFactory = await hre.ethers.getContractFactory("HealthToken");
    healthToken = await HealthTokenFactory.deploy(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      INITIAL_SUPPLY,
      MAX_SUPPLY,
      HOSPITAL_STAKE
    );
    await healthToken.waitForDeployment();

    // Deploy HospitalRegistry
    const HospitalRegistryFactory = await hre.ethers.getContractFactory("HospitalRegistry");
    hospitalRegistry = await HospitalRegistryFactory.deploy(
      await healthToken.getAddress(),
      MINIMUM_STAKE,
      REGISTRATION_FEE
    );
    await hospitalRegistry.waitForDeployment();

    // Transfer tokens to hospitals for registration
    const transferAmount = hre.ethers.parseUnits("50000", 18);
    await healthToken.transfer(hospital1.address, transferAmount);
    await healthToken.transfer(hospital2.address, transferAmount);
    await healthToken.transfer(hospital3.address, transferAmount);

    // Grant verifier role
    const VERIFIER_ROLE = await hospitalRegistry.VERIFIER_ROLE();
    await hospitalRegistry.grantRole(VERIFIER_ROLE, verifier.address);
  });

  describe("Deployment", function () {
    it("Should set the correct health token address", async function () {
      expect(await hospitalRegistry.healthToken()).to.equal(await healthToken.getAddress());
    });

    it("Should set the correct minimum stake", async function () {
      expect(await hospitalRegistry.minimumStake()).to.equal(MINIMUM_STAKE);
    });

    it("Should set the correct registration fee", async function () {
      expect(await hospitalRegistry.registrationFee()).to.equal(REGISTRATION_FEE);
    });

    it("Should grant admin roles to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await hospitalRegistry.DEFAULT_ADMIN_ROLE();
      const ADMIN_ROLE = await hospitalRegistry.ADMIN_ROLE();
      const VERIFIER_ROLE = await hospitalRegistry.VERIFIER_ROLE();

      expect(await hospitalRegistry.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await hospitalRegistry.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
      expect(await hospitalRegistry.hasRole(VERIFIER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Hospital Registration", function () {
    it("Should allow hospital to register with valid data", async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);

      await expect(
        hospitalRegistry.connect(hospital1).registerHospital(
          HOSPITAL_1_DATA.name,
          HOSPITAL_1_DATA.registrationNumber,
          HOSPITAL_1_DATA.physicalAddress,
          HOSPITAL_1_DATA.specialties
        )
      )
        .to.emit(hospitalRegistry, "HospitalRegistered")
        .withArgs(hospital1.address, HOSPITAL_1_DATA.name, HOSPITAL_1_DATA.registrationNumber, MINIMUM_STAKE);
    });

    it("Should create hospital with pending status", async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);

      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );

      const hospital = await hospitalRegistry.hospitals(hospital1.address);
      expect(hospital.status).to.equal(0); // Pending
      expect(hospital.exists).to.be.true;
    });

    it("Should store hospital data correctly", async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);

      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );

      const hospitalData = await hospitalRegistry.getHospital(hospital1.address);
      expect(hospitalData.name).to.equal(HOSPITAL_1_DATA.name);
      expect(hospitalData.registrationNumber).to.equal(HOSPITAL_1_DATA.registrationNumber);
      expect(hospitalData.physicalAddress).to.equal(HOSPITAL_1_DATA.physicalAddress);
      expect(hospitalData.stakeAmount).to.equal(MINIMUM_STAKE);
    });

    it("Should not allow registration without sufficient tokens", async function () {
      const insufficientAmount = MINIMUM_STAKE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), insufficientAmount);

      await expect(
        hospitalRegistry.connect(hospital1).registerHospital(
          HOSPITAL_1_DATA.name,
          HOSPITAL_1_DATA.registrationNumber,
          HOSPITAL_1_DATA.physicalAddress,
          HOSPITAL_1_DATA.specialties
        )
      ).to.be.reverted;
    });

    it("Should not allow duplicate registration", async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired * 2n);

      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );

      await expect(
        hospitalRegistry.connect(hospital1).registerHospital(
          "Another Hospital",
          "HOS-999",
          "Another Address",
          ["Specialty"]
        )
      ).to.be.revertedWith("Hospital already registered");
    });

    it("Should not allow duplicate registration number", async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);
      await healthToken.connect(hospital2).approve(await hospitalRegistry.getAddress(), totalRequired);

      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );

      await expect(
        hospitalRegistry.connect(hospital2).registerHospital(
          HOSPITAL_2_DATA.name,
          HOSPITAL_1_DATA.registrationNumber, // Same registration number
          HOSPITAL_2_DATA.physicalAddress,
          HOSPITAL_2_DATA.specialties
        )
      ).to.be.revertedWith("Registration number already used");
    });

    it("Should require at least one specialty", async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);

      await expect(
        hospitalRegistry.connect(hospital1).registerHospital(
          HOSPITAL_1_DATA.name,
          HOSPITAL_1_DATA.registrationNumber,
          HOSPITAL_1_DATA.physicalAddress,
          [] // Empty specialties
        )
      ).to.be.revertedWith("At least one specialty required");
    });

    it("Should add hospital to addresses array", async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);

      const initialCount = await hospitalRegistry.getHospitalCount();

      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );

      expect(await hospitalRegistry.getHospitalCount()).to.equal(initialCount + 1n);
    });
  });

  describe("Hospital Verification", function () {
    beforeEach(async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);
      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );
    });

    it("Should allow verifier to verify hospital", async function () {
      await expect(hospitalRegistry.connect(verifier).verifyHospital(hospital1.address))
        .to.emit(hospitalRegistry, "HospitalVerified")
        .withArgs(hospital1.address, verifier.address);
    });

    it("Should change hospital status to active", async function () {
      await hospitalRegistry.connect(verifier).verifyHospital(hospital1.address);

      const hospital = await hospitalRegistry.hospitals(hospital1.address);
      expect(hospital.status).to.equal(1); // Active
    });

    it("Should not allow non-verifier to verify", async function () {
      await expect(
        hospitalRegistry.connect(patient).verifyHospital(hospital1.address)
      ).to.be.reverted;
    });

    it("Should not allow verifying non-existent hospital", async function () {
      await expect(
        hospitalRegistry.connect(verifier).verifyHospital(patient.address)
      ).to.be.revertedWith("Hospital not found");
    });

    it("Should not allow verifying already active hospital", async function () {
      await hospitalRegistry.connect(verifier).verifyHospital(hospital1.address);

      await expect(
        hospitalRegistry.connect(verifier).verifyHospital(hospital1.address)
      ).to.be.revertedWith("Hospital not pending");
    });
  });

  describe("Hospital Status Management", function () {
    beforeEach(async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);
      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );
      await hospitalRegistry.connect(verifier).verifyHospital(hospital1.address);
    });

    it("Should allow admin to suspend hospital", async function () {
      const reason = "Violation of terms";
      await expect(hospitalRegistry.suspendHospital(hospital1.address, reason))
        .to.emit(hospitalRegistry, "HospitalSuspended")
        .withArgs(hospital1.address, reason);

      const hospital = await hospitalRegistry.hospitals(hospital1.address);
      expect(hospital.status).to.equal(2); // Suspended
    });

    it("Should allow admin to reactivate suspended hospital", async function () {
      await hospitalRegistry.suspendHospital(hospital1.address, "Test");
      
      await expect(hospitalRegistry.reactivateHospital(hospital1.address))
        .to.emit(hospitalRegistry, "HospitalReactivated")
        .withArgs(hospital1.address);

      const hospital = await hospitalRegistry.hospitals(hospital1.address);
      expect(hospital.status).to.equal(1); // Active
    });

    it("Should allow admin to revoke hospital", async function () {
      const reason = "Serious violation";
      await expect(hospitalRegistry.revokeHospital(hospital1.address, reason))
        .to.emit(hospitalRegistry, "HospitalRevoked")
        .withArgs(hospital1.address, reason);

      const hospital = await hospitalRegistry.hospitals(hospital1.address);
      expect(hospital.status).to.equal(3); // Revoked
    });

    it("Should not allow non-admin to suspend", async function () {
      await expect(
        hospitalRegistry.connect(patient).suspendHospital(hospital1.address, "Test")
      ).to.be.reverted;
    });

    it("Should not allow suspending non-active hospital", async function () {
      await hospitalRegistry.suspendHospital(hospital1.address, "Test");

      await expect(
        hospitalRegistry.suspendHospital(hospital1.address, "Test again")
      ).to.be.revertedWith("Hospital not active");
    });
  });

  describe("Hospital Updates", function () {
    beforeEach(async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);
      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );
    });

    it("Should allow hospital to update its information", async function () {
      const newName = "Updated Hospital Name";
      const newAddress = "New Address";
      const newSpecialties = ["Surgery", "Emergency"];

      await expect(
        hospitalRegistry.connect(hospital1).updateHospitalInfo(newName, newAddress, newSpecialties)
      ).to.emit(hospitalRegistry, "HospitalUpdated").withArgs(hospital1.address);

      const hospitalData = await hospitalRegistry.getHospital(hospital1.address);
      expect(hospitalData.name).to.equal(newName);
      expect(hospitalData.physicalAddress).to.equal(newAddress);
    });

    it("Should not allow updating with empty name", async function () {
      await expect(
        hospitalRegistry.connect(hospital1).updateHospitalInfo("", "Address", ["Specialty"])
      ).to.be.revertedWith("Name required");
    });

    it("Should not allow updating with empty specialties", async function () {
      await expect(
        hospitalRegistry.connect(hospital1).updateHospitalInfo("Name", "Address", [])
      ).to.be.revertedWith("At least one specialty required");
    });

    it("Should not allow non-hospital to update", async function () {
      await expect(
        hospitalRegistry.connect(patient).updateHospitalInfo("Name", "Address", ["Specialty"])
      ).to.be.revertedWith("Hospital not registered");
    });
  });

  describe("Stake Management", function () {
    beforeEach(async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);
      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );
      await hospitalRegistry.connect(verifier).verifyHospital(hospital1.address);
    });

    it("Should allow hospital to increase stake", async function () {
      const increaseAmount = hre.ethers.parseUnits("5000", 18);
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), increaseAmount);

      await expect(hospitalRegistry.connect(hospital1).increaseStake(increaseAmount))
        .to.emit(hospitalRegistry, "StakeIncreased")
        .withArgs(hospital1.address, increaseAmount, MINIMUM_STAKE + increaseAmount);

      const hospital = await hospitalRegistry.hospitals(hospital1.address);
      expect(hospital.stakeAmount).to.equal(MINIMUM_STAKE + increaseAmount);
    });

    it("Should allow hospital to withdraw excess stake", async function () {
      const increaseAmount = hre.ethers.parseUnits("5000", 18);
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), increaseAmount);
      await hospitalRegistry.connect(hospital1).increaseStake(increaseAmount);

      const withdrawAmount = hre.ethers.parseUnits("3000", 18);
      await expect(hospitalRegistry.connect(hospital1).withdrawStake(withdrawAmount))
        .to.emit(hospitalRegistry, "StakeWithdrawn")
        .withArgs(hospital1.address, withdrawAmount);
    });

    it("Should not allow withdrawing below minimum stake", async function () {
      const withdrawAmount = hre.ethers.parseUnits("1000", 18);
      await expect(
        hospitalRegistry.connect(hospital1).withdrawStake(withdrawAmount)
      ).to.be.revertedWith("Cannot withdraw below minimum stake");
    });

    it("Should not allow non-active hospital to withdraw", async function () {
      await hospitalRegistry.suspendHospital(hospital1.address, "Test");

      const withdrawAmount = hre.ethers.parseUnits("100", 18);
      await expect(
        hospitalRegistry.connect(hospital1).withdrawStake(withdrawAmount)
      ).to.be.revertedWith("Hospital not active");
    });
  });

  describe("Rating System", function () {
    beforeEach(async function () {
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);
      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );
      await hospitalRegistry.connect(verifier).verifyHospital(hospital1.address);
    });

    it("Should allow rating a hospital", async function () {
      const rating = 85;
      await expect(hospitalRegistry.rateHospital(hospital1.address, rating))
        .to.emit(hospitalRegistry, "HospitalRated")
        .withArgs(hospital1.address, rating, rating);

      const hospital = await hospitalRegistry.hospitals(hospital1.address);
      expect(hospital.rating).to.equal(rating);
      expect(hospital.totalRatings).to.equal(1);
    });

    it("Should calculate average rating correctly", async function () {
      await hospitalRegistry.rateHospital(hospital1.address, 80);
      await hospitalRegistry.rateHospital(hospital1.address, 90);
      await hospitalRegistry.rateHospital(hospital1.address, 70);

      const hospital = await hospitalRegistry.hospitals(hospital1.address);
      expect(hospital.rating).to.equal(80); // (80 + 90 + 70) / 3
      expect(hospital.totalRatings).to.equal(3);
    });

    it("Should not allow rating outside valid range", async function () {
      await expect(
        hospitalRegistry.rateHospital(hospital1.address, 0)
      ).to.be.revertedWith("Rating must be 1-100");

      await expect(
        hospitalRegistry.rateHospital(hospital1.address, 101)
      ).to.be.revertedWith("Rating must be 1-100");
    });

    it("Should increment completed appointments", async function () {
      await hospitalRegistry.incrementCompletedAppointments(hospital1.address);
      await hospitalRegistry.incrementCompletedAppointments(hospital1.address);

      const hospital = await hospitalRegistry.hospitals(hospital1.address);
      expect(hospital.completedAppointments).to.equal(2);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Register multiple hospitals
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);
      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );

      await healthToken.connect(hospital2).approve(await hospitalRegistry.getAddress(), totalRequired);
      await hospitalRegistry.connect(hospital2).registerHospital(
        HOSPITAL_2_DATA.name,
        HOSPITAL_2_DATA.registrationNumber,
        HOSPITAL_2_DATA.physicalAddress,
        HOSPITAL_2_DATA.specialties
      );

      await hospitalRegistry.connect(verifier).verifyHospital(hospital1.address);
    });

    it("Should return all hospitals", async function () {
      const allHospitals = await hospitalRegistry.getAllHospitals();
      expect(allHospitals.length).to.equal(2);
      expect(allHospitals).to.include(hospital1.address);
      expect(allHospitals).to.include(hospital2.address);
    });

    it("Should return hospitals by status", async function () {
      const pendingHospitals = await hospitalRegistry.getHospitalsByStatus(0); // Pending
      expect(pendingHospitals.length).to.equal(1);
      expect(pendingHospitals[0]).to.equal(hospital2.address);

      const activeHospitals = await hospitalRegistry.getHospitalsByStatus(1); // Active
      expect(activeHospitals.length).to.equal(1);
      expect(activeHospitals[0]).to.equal(hospital1.address);
    });

    it("Should check if hospital is active", async function () {
      expect(await hospitalRegistry.isHospitalActive(hospital1.address)).to.be.true;
      expect(await hospitalRegistry.isHospitalActive(hospital2.address)).to.be.false;
    });

    it("Should get hospital by registration number", async function () {
      const address = await hospitalRegistry.getHospitalByRegistrationNumber(
        HOSPITAL_1_DATA.registrationNumber
      );
      expect(address).to.equal(hospital1.address);
    });

    it("Should return hospital count", async function () {
      expect(await hospitalRegistry.getHospitalCount()).to.equal(2);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow admin to update minimum stake", async function () {
      const newMinimumStake = hre.ethers.parseUnits("20000", 18);
      await expect(hospitalRegistry.updateMinimumStake(newMinimumStake))
        .to.emit(hospitalRegistry, "MinimumStakeUpdated")
        .withArgs(newMinimumStake);

      expect(await hospitalRegistry.minimumStake()).to.equal(newMinimumStake);
    });

    it("Should allow admin to update registration fee", async function () {
      const newFee = hre.ethers.parseUnits("2000", 18);
      await expect(hospitalRegistry.updateRegistrationFee(newFee))
        .to.emit(hospitalRegistry, "RegistrationFeeUpdated")
        .withArgs(newFee);

      expect(await hospitalRegistry.registrationFee()).to.equal(newFee);
    });

    it("Should allow admin to withdraw fees", async function () {
      // Register a hospital to collect fees
      const totalRequired = MINIMUM_STAKE + REGISTRATION_FEE;
      await healthToken.connect(hospital1).approve(await hospitalRegistry.getAddress(), totalRequired);
      await hospitalRegistry.connect(hospital1).registerHospital(
        HOSPITAL_1_DATA.name,
        HOSPITAL_1_DATA.registrationNumber,
        HOSPITAL_1_DATA.physicalAddress,
        HOSPITAL_1_DATA.specialties
      );

      const withdrawAmount = REGISTRATION_FEE;
      const initialBalance = await healthToken.balanceOf(owner.address);

      await hospitalRegistry.withdrawFees(owner.address, withdrawAmount);

      expect(await healthToken.balanceOf(owner.address)).to.equal(initialBalance + withdrawAmount);
    });

    it("Should not allow non-admin to update settings", async function () {
      await expect(
        hospitalRegistry.connect(patient).updateMinimumStake(hre.ethers.parseUnits("20000", 18))
      ).to.be.reverted;

      await expect(
        hospitalRegistry.connect(patient).updateRegistrationFee(hre.ethers.parseUnits("2000", 18))
      ).to.be.reverted;
    });
  });
});
