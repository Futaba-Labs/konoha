// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IAAVELendingPoolV3 {
    function supply(bytes32 args) external;

    function encodeSupplyParams(
        address asset,
        uint256 amount,
        uint16 referralCode
    ) external view returns (bytes32);

    function withdraw(bytes32 args) external;

    function encodeWithdrawParams(address asset, uint256 amount)
        external
        view
        returns (bytes32);
}
