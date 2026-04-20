// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title HealthToken
 * @dev Enhanced ERC20 token for the health management system with:
 * - Role-based access control
 * - Reward/incentive mechanisms
 * - Staking for hospital registration
 * - Token-gated access control
 */
contract HealthToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");
    
    uint256 private _maxSupply;
    uint256 public hospitalStakeAmount;
    
    // Staking tracking
    mapping(address => uint256) private _stakes;
    mapping(address => uint256) private _stakeTimestamp;
    uint256 public totalStaked;
    
    // Reward tracking
    mapping(address => uint256) public rewardBalance;
    uint256 public rewardPool;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardDistributed(address indexed to, uint256 amount);
    event HospitalStakeAmountUpdated(uint256 newAmount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 maxSupply_,
        uint256 _hospitalStakeAmount
    ) ERC20(name, symbol) {
        require(maxSupply_ >= initialSupply, "Max supply must be >= initial supply");
        
        _maxSupply = maxSupply_ * 10 ** decimals();
        hospitalStakeAmount = _hospitalStakeAmount * 10 ** decimals();
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // ============ Minting Functions ============
    
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= _maxSupply, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // ============ Burning Functions ============
    
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }

    // ============ Pause Functions ============
    
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ============ Supply Management ============
    
    function maxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    function updateMaxSupply(uint256 newMaxSupply) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newMaxSupply >= totalSupply(), "New max supply must be >= current supply");
        require(newMaxSupply > _maxSupply, "New max supply must be greater than current");
        _maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }

    function updateHospitalStakeAmount(uint256 newAmount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        hospitalStakeAmount = newAmount * 10 ** decimals();
        emit HospitalStakeAmountUpdated(hospitalStakeAmount);
    }

    // ============ Staking Functions ============
    
    /**
     * @dev Stake tokens (primarily for hospital registration)
     * @param amount Amount to stake
     */
    function stake(uint256 amount) public nonReentrant whenNotPaused {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        _stakes[msg.sender] += amount;
        _stakeTimestamp[msg.sender] = block.timestamp;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Unstake tokens
     * @param amount Amount to unstake
     */
    function unstake(uint256 amount) public nonReentrant {
        require(amount > 0, "Cannot unstake 0");
        require(_stakes[msg.sender] >= amount, "Insufficient staked balance");
        
        _stakes[msg.sender] -= amount;
        totalStaked -= amount;
        _transfer(address(this), msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Get staked balance of an address
     */
    function stakedBalanceOf(address account) public view returns (uint256) {
        return _stakes[account];
    }

    /**
     * @dev Get stake timestamp
     */
    function stakeTimestampOf(address account) public view returns (uint256) {
        return _stakeTimestamp[account];
    }

    /**
     * @dev Check if address has minimum hospital stake
     */
    function hasHospitalStake(address account) public view returns (bool) {
        return _stakes[account] >= hospitalStakeAmount;
    }

    // ============ Reward Functions ============
    
    /**
     * @dev Distribute rewards to an address (only admin or authorized contracts)
     * @param to Recipient address
     * @param amount Reward amount
     */
    function distributeReward(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(amount > 0, "Reward must be > 0");
        rewardBalance[to] += amount;
        rewardPool += amount;
        emit RewardDistributed(to, amount);
    }

    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() public nonReentrant whenNotPaused {
        uint256 reward = rewardBalance[msg.sender];
        require(reward > 0, "No rewards to claim");
        require(totalSupply() + reward <= _maxSupply, "Exceeds max supply");
        
        rewardBalance[msg.sender] = 0;
        rewardPool -= reward;
        _mint(msg.sender, reward);
        
        emit RewardClaimed(msg.sender, reward);
    }

    // ============ Token-Gated Access ============
    
    /**
     * @dev Check if address has minimum token balance for access
     * @param account Address to check
     * @param minBalance Minimum balance required
     */
    function hasMinimumBalance(address account, uint256 minBalance) public view returns (bool) {
        return balanceOf(account) >= minBalance;
    }

    /**
     * @dev Grant hospital role (requires stake)
     */
    function grantHospitalRole(address hospital) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(hasHospitalStake(hospital), "Insufficient stake for hospital role");
        _grantRole(HOSPITAL_ROLE, hospital);
    }

    /**
     * @dev Revoke hospital role
     */
    function revokeHospitalRole(address hospital) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(HOSPITAL_ROLE, hospital);
    }

    // ============ Batch Operations ============
    
    /**
     * @dev Batch transfer to multiple addresses
     */
    function batchTransfer(address[] memory recipients, uint256[] memory amounts) 
        public 
        returns (bool) 
    {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
        return true;
    }

    /**
     * @dev Batch reward distribution
     */
    function batchDistributeRewards(address[] memory recipients, uint256[] memory amounts) 
        public 
        onlyRole(MINTER_ROLE) 
    {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            distributeReward(recipients[i], amounts[i]);
        }
    }

    // ============ Override Functions ============
    
    function _update(address from, address to, uint256 value) 
        internal 
        override(ERC20, ERC20Pausable) 
    {
        super._update(from, to, value);
    }
}
