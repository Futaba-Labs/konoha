// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IBridge {
    function deposit(
        uint8 destinationDomainID,
        bytes32 resourceID,
        bytes calldata depositData,
        bytes calldata feeData
    ) external payable;
}

contract SygmaTest {
    using SafeMath for uint256;

    IBridge public bridge;
    bytes32 public resourceID;

    event MetadataDepositorEvent(address depositorAddress);
    event Message(bytes32 message);

    constructor(address _bridge) {
        bridge = IBridge(_bridge);
    }

    function setResourceID(bytes32 _resourceID) external {
        resourceID = _resourceID;
    }

    function deposit() external payable {
        bytes memory message = abi.encode("Hello World");
        bridge.deposit(1, resourceID, message, "0x");
    }

    function recieveExecutionFromSygma(
        bytes32 metadataDepositor,
        bytes32 message
    ) external {
        address depositorAddress = address(uint160(uint256(metadataDepositor)));
        emit MetadataDepositorEvent(depositorAddress);
        emit Message(message);
    }
}
