// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/CERC20.sol";

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FutabaCompound is AxelarExecutable {
    using SafeERC20 for IERC20;

    CERC20 public cToken;

    IAxelarGasService public immutable gasReceiver;

    constructor(
        address _cToken,
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        gasReceiver = IAxelarGasService(gasReceiver_);
        cToken = CERC20(_cToken);
    }

    function _executeWithToken(
        string calldata,
        string calldata,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        address[] memory recipients = abi.decode(payload, (address[]));
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        uint256 sentAmount = amount / recipients.length;
        for (uint256 i = 0; i < recipients.length; i++) {
            IERC20(tokenAddress).transfer(recipients[i], sentAmount);
        }
        mint(amount);
    }

    function _sendTokenWithMessageToStrategy(
        string memory destinationChain,
        string memory destinationAddress,
        string memory symbol,
        uint256 amount
    ) internal {
        address tokenAddress = gateway.tokenAddresses(symbol);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenAddress).approve(address(gateway), amount);
        // TODO modify payload
        bytes memory payload = abi.encode(tokenAddress);
        if (msg.value > 0) {
            gasReceiver.payNativeGasForContractCallWithToken{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amount,
                msg.sender
            );
        }
        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            symbol,
            amount
        );
    }

    function mint(uint256 mintAmount) internal returns (uint256) {
        uint256 result = cToken.mint(mintAmount);
        return result;
    }

    function redeem(uint256 redeemTokens) internal returns (uint256) {
        uint256 result = cToken.redeem(redeemTokens);
        return result;
    }

    function _swap() internal {}
}
