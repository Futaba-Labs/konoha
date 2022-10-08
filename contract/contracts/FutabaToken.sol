// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/IToken.sol";

contract FutabaToken is IToken, ERC20 {
    uint8 private immutable _DECIMALS;

    uint256 private immutable _BASE_UNIT;

    address public immutable vault;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _vault
    ) ERC20(_name, _symbol) {
        _DECIMALS = _decimals;
        _BASE_UNIT = 10**_decimals;
        vault = _vault;
    }

    function decimals() public view override(ERC20) returns (uint8) {
        return _DECIMALS;
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyVault {
        _burn(account, amount);
    }

    modifier onlyVault() {
        require(msg.sender == vault, "Token:Only vault can mint/burn");
        _;
    }
}
