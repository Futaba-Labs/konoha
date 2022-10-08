// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IAAVELendingPoolV3 {
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
}
