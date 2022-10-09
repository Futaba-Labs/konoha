// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "../interfaces/ILendingProtocol.sol";
import "../interfaces/IAAVELendingPoolV3.sol";
import "../interfaces/ISwapRouter.sol";

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FutabaAAVEV3 is AxelarExecutable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    IAxelarGasService public immutable gasReceiver;
    IAAVELendingPoolV3 public lendingPool;
    ISwapRouter public router;

    struct Message {
        uint32 chainId;
        string chainName;
        string dstContract;
    }

    constructor(
        address _lendingPool,
        address _router,
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        gasReceiver = IAxelarGasService(gasReceiver_);
        lendingPool = IAAVELendingPoolV3(_lendingPool);
        router = ISwapRouter(_router);
    }

    function _executeWithToken(
        string calldata,
        string calldata,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        Message memory message = abi.decode(payload, (Message));
        if (message.chainId == block.chainid) {
            uint256 feeDeadline = block.timestamp.add(1800);
            uint256 minimumAmount = amount.mul(95).div(100);
            ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
                .ExactInputSingleParams(
                    0x2c852e740B62308c46DD29B982FBb650D063Bd07,
                    0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2,
                    10000,
                    address(this),
                    feeDeadline,
                    amount,
                    minimumAmount,
                    0
                );

            uint256 amountOut = router.exactInputSingle(params);
            // mint token
            _mint(amountOut);
        } else {
            _sendTokenToStrategy(
                message.chainName,
                message.dstContract,
                "aUSDC",
                amount
            );
        }
    }

    function _sendTokenToStrategy(
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
        gasReceiver.payNativeGasForContractCall{value: 10 * 18}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );
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
