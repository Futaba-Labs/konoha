// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface MToken {
    function supplyRatePerTimestamp() external virtual returns (uint);
}
