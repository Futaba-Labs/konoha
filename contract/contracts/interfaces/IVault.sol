// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IVault {
    function rebalabce() external payable;

    function mintFutabaToken(uint256 _amount, uint256[] calldata)
        external
        returns (uint256 mintedTokens);

    function redeemIdleToken(uint256 _amount, uint256[] calldata)
        external
        returns (uint256 redeemedTokens);

    function getAPRs()
        external
        view
        returns (address[] memory addresses, uint256[] memory aprs);
}
