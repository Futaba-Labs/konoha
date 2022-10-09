// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IVault {
    function rebalance() external payable returns (bool);

    function mintFutabaToken(uint256 _amount)
        external
        returns (uint256 mintedTokens);

    function redeemIdleToken(uint256 _amount)
        external
        returns (uint256 redeemedTokens);

    function getAvgAPY() external returns (uint256 avgApr);

    // function getAPRs()
    //     external
    //     view
    //     returns (address[] memory addresses, uint256[] memory aprs);
}
