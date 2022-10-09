// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IFutaba {
    function readDataFeed(
        uint32 srcChainId,
        address srcContract,
        string[] calldata valuableNames
    ) external view returns (bytes[] memory values);
}
