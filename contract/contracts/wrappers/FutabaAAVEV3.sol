// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "../interfaces/ILendingProtocol.sol";
import "../interfaces/IAAVELendingPoolV3.sol";

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FutabaAAVEV3 is AxelarExecutable {
    using SafeERC20 for IERC20;

    IAxelarGasService public immutable gasReceiver;
    IAAVELendingPoolV3 public lendingPool;

    struct Message {
        uint32 chainId;
        string chainName;
        string dstContract;
    }

    constructor(
        address _lendingPool,
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        gasReceiver = IAxelarGasService(gasReceiver_);
        lendingPool = IAAVELendingPoolV3(_lendingPool);
    }

    function _executeWithToken(
        string calldata,
        string calldata,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        Message memory message = abi.decode(payload, (Message));
        assert(message.chainId == 80001);
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        IERC20(tokenAddress).transfer(
            0x330C4fBDa3b1a47088934289CF6039b5bAB20e45,
            amount
        );
        // TODO implement uniswap
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

    function _mint(uint256 _amount) internal {
        lendingPool.supply(address(this), _amount, msg.sender, 0);
    }

    function _redeem(uint256 _amount) internal returns (uint256 lastAmount) {
        lastAmount = lendingPool.withdraw(address(this), _amount, msg.sender);
    }

    function _swap() internal {}
}
