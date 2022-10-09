// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface MErc20 {
    function mint(uint256 mintAmount) external returns (uint256);

    function redeem(uint256 redeemTokens) external returns (uint256);
}
