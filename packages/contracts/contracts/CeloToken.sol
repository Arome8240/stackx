// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CeloToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    uint256 private _maxSupply;

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event MaxSupplyUpdated(uint256 newMaxSupply);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 maxSupply_
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(maxSupply_ >= initialSupply, "Max supply must be >= initial supply");
        _maxSupply = maxSupply_ * 10 ** decimals();
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Mint new tokens (only owner)
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= _maxSupply, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // Burn tokens from caller's balance
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    // Burn tokens from another account (requires allowance)
    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }

    // Pause all token transfers (only owner)
    function pause() public onlyOwner {
        _pause();
    }

    // Unpause token transfers (only owner)
    function unpause() public onlyOwner {
        _unpause();
    }

    // Get max supply
    function maxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    // Update max supply (only owner, can only increase)
    function updateMaxSupply(uint256 newMaxSupply) public onlyOwner {
        require(newMaxSupply >= totalSupply(), "New max supply must be >= current supply");
        require(newMaxSupply > _maxSupply, "New max supply must be greater than current");
        _maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }

    // Batch transfer to multiple addresses
    function batchTransfer(address[] memory recipients, uint256[] memory amounts) public returns (bool) {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
        return true;
    }

    // Override required by Solidity for multiple inheritance
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
