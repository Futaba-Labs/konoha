// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ILendingProtocol {
    function mint(uint256 mintAmount) external payable returns (uint256);

    function redeem(uint256 redeemTokens) external payable returns (uint256);
}
