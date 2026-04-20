// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./HealthToken.sol";

/**
 * @title HospitalRegistry
 * @dev Manages hospital registration, verification, and reputation on the health platform
 */
contract HospitalRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    enum HospitalStatus {
        Pending,
        Active,
        Suspended,
        Revoked
    }

    struct Hospital {
        string name;
        string registrationNumber;
        string physicalAddress;
        string[] specialties;
        uint256 registrationDate;
        uint256 stakeAmount;
        HospitalStatus status;
        uint256 rating; // Out of 100
        uint256 totalRatings;
        uint256 completedAppointments;
        bool exists;
    }

    HealthToken public healthToken;
    uint256 public minimumStake;
    uint256 public registrationFee;

    mapping(address => Hospital) public hospitals;
    mapping(string => address) public registrationNumberToAddress;
    address[] public hospitalAddresses;

    // Events
    event HospitalRegistered(
        address indexed hospitalAddress,
        string name,
        string registrationNumber,
        uint256 stakeAmount
    );
    event HospitalVerified(address indexed hospitalAddress, address indexed verifier);
    event HospitalSuspended(address indexed hospitalAddress, string reason);
    event HospitalReactivated(address indexed hospitalAddress);
    event HospitalRevoked(address indexed hospitalAddress, string reason);
    event HospitalUpdated(address indexed hospitalAddress);
    event HospitalRated(address indexed hospitalAddress, uint256 rating, uint256 newAverage);
    event StakeIncreased(address indexed hospitalAddress, uint256 amount, uint256 newTotal);
    event StakeWithdrawn(address indexed hospitalAddress, uint256 amount);
    event MinimumStakeUpdated(uint256 newMinimumStake);
    event RegistrationFeeUpdated(uint256 newFee);

    constructor(address _healthToken, uint256 _minimumStake, uint256 _registrationFee) {
        require(_healthToken != address(0), "Invalid token address");
        
        healthToken = HealthToken(_healthToken);
        minimumStake = _minimumStake;
        registrationFee = _registrationFee;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    // ============ Registration Functions ============

    /**
     * @dev Register a new hospital
     * @param name Hospital name
     * @param registrationNumber Government registration number
     * @param physicalAddress Physical location
     * @param specialties Array of medical specialties
     */
    function registerHospital(
        string memory name,
        string memory registrationNumber,
        string memory physicalAddress,
        string[] memory specialties
    ) external nonReentrant {
        require(!hospitals[msg.sender].exists, "Hospital already registered");
        require(bytes(name).length > 0, "Name required");
        require(bytes(registrationNumber).length > 0, "Registration number required");
        require(
            registrationNumberToAddress[registrationNumber] == address(0),
            "Registration number already used"
        );
        require(specialties.length > 0, "At least one specialty required");

        // Transfer stake + registration fee
        uint256 totalRequired = minimumStake + registrationFee;
        require(
            healthToken.transferFrom(msg.sender, address(this), totalRequired),
            "Token transfer failed"
        );

        // Stake the minimum amount
        healthToken.stake(minimumStake);

        hospitals[msg.sender] = Hospital({
            name: name,
            registrationNumber: registrationNumber,
            physicalAddress: physicalAddress,
            specialties: specialties,
            registrationDate: block.timestamp,
            stakeAmount: minimumStake,
            status: HospitalStatus.Pending,
            rating: 0,
            totalRatings: 0,
            completedAppointments: 0,
            exists: true
        });

        registrationNumberToAddress[registrationNumber] = msg.sender;
        hospitalAddresses.push(msg.sender);

        emit HospitalRegistered(msg.sender, name, registrationNumber, minimumStake);
    }

    /**
     * @dev Verify a pending hospital (admin only)
     */
    function verifyHospital(address hospitalAddress) external onlyRole(VERIFIER_ROLE) {
        Hospital storage hospital = hospitals[hospitalAddress];
        require(hospital.exists, "Hospital not found");
        require(hospital.status == HospitalStatus.Pending, "Hospital not pending");

        hospital.status = HospitalStatus.Active;

        // Grant hospital role in token contract
        healthToken.grantHospitalRole(hospitalAddress);

        emit HospitalVerified(hospitalAddress, msg.sender);
    }

    /**
     * @dev Suspend a hospital
     */
    function suspendHospital(address hospitalAddress, string memory reason)
        external
        onlyRole(ADMIN_ROLE)
    {
        Hospital storage hospital = hospitals[hospitalAddress];
        require(hospital.exists, "Hospital not found");
        require(hospital.status == HospitalStatus.Active, "Hospital not active");

        hospital.status = HospitalStatus.Suspended;

        emit HospitalSuspended(hospitalAddress, reason);
    }

    /**
     * @dev Reactivate a suspended hospital
     */
    function reactivateHospital(address hospitalAddress) external onlyRole(ADMIN_ROLE) {
        Hospital storage hospital = hospitals[hospitalAddress];
        require(hospital.exists, "Hospital not found");
        require(hospital.status == HospitalStatus.Suspended, "Hospital not suspended");

        hospital.status = HospitalStatus.Active;

        emit HospitalReactivated(hospitalAddress);
    }

    /**
     * @dev Revoke a hospital's registration permanently
     */
    function revokeHospital(address hospitalAddress, string memory reason)
        external
        onlyRole(ADMIN_ROLE)
    {
        Hospital storage hospital = hospitals[hospitalAddress];
        require(hospital.exists, "Hospital not found");
        require(hospital.status != HospitalStatus.Revoked, "Already revoked");

        hospital.status = HospitalStatus.Revoked;

        // Revoke hospital role in token contract
        healthToken.revokeHospitalRole(hospitalAddress);

        emit HospitalRevoked(hospitalAddress, reason);
    }

    // ============ Update Functions ============

    /**
     * @dev Update hospital information
     */
    function updateHospitalInfo(
        string memory name,
        string memory physicalAddress,
        string[] memory specialties
    ) external {
        Hospital storage hospital = hospitals[msg.sender];
        require(hospital.exists, "Hospital not registered");
        require(bytes(name).length > 0, "Name required");
        require(specialties.length > 0, "At least one specialty required");

        hospital.name = name;
        hospital.physicalAddress = physicalAddress;
        hospital.specialties = specialties;

        emit HospitalUpdated(msg.sender);
    }

    // ============ Stake Management ============

    /**
     * @dev Increase stake amount
     */
    function increaseStake(uint256 amount) external nonReentrant {
        Hospital storage hospital = hospitals[msg.sender];
        require(hospital.exists, "Hospital not registered");
        require(amount > 0, "Amount must be > 0");

        require(
            healthToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        healthToken.stake(amount);
        hospital.stakeAmount += amount;

        emit StakeIncreased(msg.sender, amount, hospital.stakeAmount);
    }

    /**
     * @dev Withdraw excess stake (above minimum)
     */
    function withdrawStake(uint256 amount) external nonReentrant {
        Hospital storage hospital = hospitals[msg.sender];
        require(hospital.exists, "Hospital not registered");
        require(hospital.status == HospitalStatus.Active, "Hospital not active");
        require(amount > 0, "Amount must be > 0");
        require(
            hospital.stakeAmount - amount >= minimumStake,
            "Cannot withdraw below minimum stake"
        );

        hospital.stakeAmount -= amount;
        healthToken.unstake(amount);
        require(healthToken.transfer(msg.sender, amount), "Token transfer failed");

        emit StakeWithdrawn(msg.sender, amount);
    }

    // ============ Rating System ============

    /**
     * @dev Rate a hospital (called by appointment contract)
     */
    function rateHospital(address hospitalAddress, uint256 rating) external {
        Hospital storage hospital = hospitals[hospitalAddress];
        require(hospital.exists, "Hospital not found");
        require(hospital.status == HospitalStatus.Active, "Hospital not active");
        require(rating >= 1 && rating <= 100, "Rating must be 1-100");

        // Calculate new average rating
        uint256 totalScore = (hospital.rating * hospital.totalRatings) + rating;
        hospital.totalRatings += 1;
        hospital.rating = totalScore / hospital.totalRatings;

        emit HospitalRated(hospitalAddress, rating, hospital.rating);
    }

    /**
     * @dev Increment completed appointments
     */
    function incrementCompletedAppointments(address hospitalAddress) external {
        Hospital storage hospital = hospitals[hospitalAddress];
        require(hospital.exists, "Hospital not found");
        
        hospital.completedAppointments += 1;
    }

    // ============ View Functions ============

    /**
     * @dev Get hospital details
     */
    function getHospital(address hospitalAddress)
        external
        view
        returns (
            string memory name,
            string memory registrationNumber,
            string memory physicalAddress,
            string[] memory specialties,
            uint256 registrationDate,
            uint256 stakeAmount,
            HospitalStatus status,
            uint256 rating,
            uint256 totalRatings,
            uint256 completedAppointments
        )
    {
        Hospital storage hospital = hospitals[hospitalAddress];
        require(hospital.exists, "Hospital not found");

        return (
            hospital.name,
            hospital.registrationNumber,
            hospital.physicalAddress,
            hospital.specialties,
            hospital.registrationDate,
            hospital.stakeAmount,
            hospital.status,
            hospital.rating,
            hospital.totalRatings,
            hospital.completedAppointments
        );
    }

    /**
     * @dev Check if hospital is active
     */
    function isHospitalActive(address hospitalAddress) external view returns (bool) {
        return hospitals[hospitalAddress].exists && 
               hospitals[hospitalAddress].status == HospitalStatus.Active;
    }

    /**
     * @dev Get all hospital addresses
     */
    function getAllHospitals() external view returns (address[] memory) {
        return hospitalAddresses;
    }

    /**
     * @dev Get hospitals by status
     */
    function getHospitalsByStatus(HospitalStatus status)
        external
        view
        returns (address[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < hospitalAddresses.length; i++) {
            if (hospitals[hospitalAddresses[i]].status == status) {
                count++;
            }
        }

        address[] memory result = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < hospitalAddresses.length; i++) {
            if (hospitals[hospitalAddresses[i]].status == status) {
                result[index] = hospitalAddresses[i];
                index++;
            }
        }

        return result;
    }

    /**
     * @dev Get hospital count
     */
    function getHospitalCount() external view returns (uint256) {
        return hospitalAddresses.length;
    }

    /**
     * @dev Get hospital by registration number
     */
    function getHospitalByRegistrationNumber(string memory registrationNumber)
        external
        view
        returns (address)
    {
        return registrationNumberToAddress[registrationNumber];
    }

    // ============ Admin Functions ============

    /**
     * @dev Update minimum stake requirement
     */
    function updateMinimumStake(uint256 newMinimumStake) external onlyRole(ADMIN_ROLE) {
        minimumStake = newMinimumStake;
        emit MinimumStakeUpdated(newMinimumStake);
    }

    /**
     * @dev Update registration fee
     */
    function updateRegistrationFee(uint256 newFee) external onlyRole(ADMIN_ROLE) {
        registrationFee = newFee;
        emit RegistrationFeeUpdated(newFee);
    }

    /**
     * @dev Withdraw collected registration fees
     */
    function withdrawFees(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(healthToken.transfer(to, amount), "Token transfer failed");
    }
}
