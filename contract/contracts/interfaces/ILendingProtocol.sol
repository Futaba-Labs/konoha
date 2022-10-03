// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ILendingProtocol {
    function mint() external returns (uint256);

    function redeem(address account) external returns (uint256);
}
