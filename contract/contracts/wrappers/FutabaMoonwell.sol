// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/MErc20.sol";
import "../interfaces/ILendingProtocol.sol";

contract FutabaMoonwell is ILendingProtocol {
    MErc20 public mToken;

    constructor(address _mToken) {
        mToken = MErc20(_mToken);
    }

    function mint(uint256 mintAmount) external payable returns (uint256) {
        uint256 result = mToken.mint(mintAmount);
        return result;
    }

    function redeem(uint256 redeemTokens) external payable returns (uint256) {
        uint256 result = mToken.redeem(redeemTokens);
        return result;
    }

    function _swap() internal {}
}
