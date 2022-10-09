// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IVault.sol";
import "./interfaces/IFutaba.sol";
import "./interfaces/MToken.sol";
import "./interfaces/IToken.sol";
import "./interfaces/MErc20.sol";
import "./interfaces/ILendingProtocol.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./FutabaToken.sol";

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

interface IBridge {
    function deposit(
        uint8 destinationDomainID,
        bytes32 resourceID,
        bytes calldata depositData,
        bytes calldata feeData
    ) external payable;
}

contract Vault is IVault, ReentrancyGuard, Ownable, Pausable, AxelarExecutable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct Allocation {
        uint16 chainId;
        address token;
        address strategy;
        uint256 percentage;
    }

    struct Wrapper {
        uint16 chainId;
        address src;
        string valuableName;
        address strategy;
    }

    struct Message {
        uint32 chainId;
        string chainName;
        string dstContract;
    }

    uint256 private constant ONE_18 = 10**18;
    uint256 private constant ONE_6 = 10**6;

    address public token;

    IBridge public bridge;
    bytes32 public resourceID;
    Message public mes;

    string private bridgeTokenSymbol;

    FutabaToken public kToken;

    address private futabaNode;

    Allocation[] private allocations;

    IAxelarGasService public immutable gasReceiver;

    mapping(string => Wrapper) protocolWrapper;

    mapping(address => mapping(address => uint256))
        public usersFutabaTokensIndexes;

    enum Protocol {
        AAVE,
        COMPOUND,
        MOONWELL
    }

    constructor(
        address _underlying,
        string memory _bridgeTokenSymbol,
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        token = _underlying;
        // IERC20Metadata target = IERC20Metadata(_underlying);
        // string memory _name = target.name();
        // string memory _symbol = target.symbol();
        // uint8 tDecimals = target.decimals();

        kToken = new FutabaToken("Konoha USDC", "kUSDC", 6, address(this));

        bridgeTokenSymbol = _bridgeTokenSymbol;
        gasReceiver = IAxelarGasService(gasReceiver_);

        allocations.push(
            Allocation(
                0,
                0x7547895b30F64Ce44ed38e8C0Fb4B40B8d611BeD,
                0x7547895b30F64Ce44ed38e8C0Fb4B40B8d611BeD,
                100
            )
        );
    }

    function setProtocolWrapper(
        string calldata _protocolName,
        Wrapper calldata _wrapper
    ) external onlyOwner {
        protocolWrapper[_protocolName] = _wrapper;
    }

    function setFutabaDB(address _futaba) external onlyOwner {
        futabaNode = _futaba;
    }

    function rebalance() external payable returns (bool) {
        // get APY
        uint256 aaveAPY = _getAPYDataFromOtherChain(protocolWrapper["AAVE"]);
        uint256 compAPY = _getAPYDataFromOtherChain(
            protocolWrapper["Compound"]
        );
        uint256 moonwellAPY = _getAPYDataFromOtherChain(
            protocolWrapper["Moonwell"]
        );

        // (calc bridge fee)
        // compare APY
        string memory targetChain;
        Wrapper memory targetProtocol;
        bool isNeededBridge = true;

        if (aaveAPY > compAPY) {
            if (aaveAPY > moonwellAPY) {
                targetChain = "Polygon";
                targetProtocol = protocolWrapper["AAVE"];
            } else {
                targetChain = "Moonbeam";
                targetProtocol = protocolWrapper["Moonbeam"];
                isNeededBridge = false;
            }
        } else {
            if (compAPY > moonwellAPY) {
                targetChain = "Ethereum";
                targetProtocol = protocolWrapper["Compound"];
            } else {
                targetChain = "Moonbeam";
                targetProtocol = protocolWrapper["Moonbeam"];
                isNeededBridge = false;
            }
        }

        _sendToStrategy(targetChain, targetProtocol, isNeededBridge);

        // save allocation
        for (uint256 i = 0; i < allocations.length; i++) {
            if (allocations[i].strategy == targetProtocol.strategy) {
                allocations[i].percentage = 100;
            }
        }

        return true;
    }

    function mintFutabaToken(uint256 _amount)
        external
        nonReentrant
        whenNotPaused
        returns (uint256 mintedTokens)
    {
        // calc how much fToken is mited
        // uint256 idlePrice = _tokenPrice();
        uint256 idlePrice = 1086167;

        // transfer asset
        IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);

        // mint fToken
        mintedTokens = _amount.mul(ONE_6).div(idlePrice);
        IToken(address(kToken)).mint(msg.sender, mintedTokens);

        // save user info
        _updateUserInfo(msg.sender, mintedTokens, true);
    }

    function redeemIdleToken(uint256 _amount)
        external
        returns (uint256 redeemedTokens)
    {
        return _redeemIdleToken(_amount);
    }

    function _redeemIdleToken(uint256 _amount)
        internal
        nonReentrant
        returns (uint256 redeemedTokens)
    {
        // calc how much fToken is burned
        if (_amount != 0) {
            // uint256 price = _tokenPrice();
            uint256 price = 1096167;
            redeemedTokens = _amount.mul(price).div(ONE_6);
            // uint256 balanceUnderlying = _contractBalanceOf(token);

            // burn
            IToken(address(kToken)).burn(msg.sender, _amount);
            // transfer underlying token
            IERC20(token).safeTransfer(msg.sender, redeemedTokens);
            // save user info
            _updateUserInfo(msg.sender, redeemedTokens, false);
        }
    }

    function getAPRs()
        external
        view
        returns (string[] memory protocols, uint256[] memory apys)
    {
        protocols[0] = "AAVE";
        apys[0] = _getAPYDataFromOtherChain(protocolWrapper["AAVE"]);

        protocols[1] = "Compound";
        apys[1] = _getAPYDataFromOtherChain(protocolWrapper["Compound"]);

        protocols[2] = "Moonwell";
        apys[2] = _getAPYDataFromOtherChain(protocolWrapper["Moonwell"]);
    }

    function getAvgAPY() external view returns (uint256 avgApr) {
        uint256 aave = _getAPYDataFromOtherChain(protocolWrapper["AAVE"]).div(
            10**7
        );
        uint256 comp = _getAPYDataFromOtherChain(protocolWrapper["Compound"]);

        uint256 moonwell = _getAPYDataFromOtherChain(
            protocolWrapper["Moonwell"]
        );
        avgApr = aave.add(comp).add(moonwell);
        avgApr = avgApr.div(3);
    }

    function tokenPrice(uint256 _amount) external pure returns (uint256 price) {
        uint256 idlePrice = 1086167;
        price = _amount.mul(ONE_6).div(idlePrice);
    }

    function getAPYDataFromOtherChain(string memory name)
        external
        view
        returns (uint256 apy)
    {
        Wrapper memory _wrapper = protocolWrapper[name];

        apy = _getAPYDataFromOtherChain(_wrapper);
    }

    function _getAPYDataFromOtherChain(Wrapper memory _wrapper)
        internal
        view
        returns (uint256 apy)
    {
        string[] memory valuableNames = new string[](1);
        valuableNames[0] = _wrapper.valuableName;
        bytes[] memory data = _serachData(
            _wrapper.chainId,
            _wrapper.src,
            valuableNames
        );
        apy = abi.decode(data[0], (uint256));
    }

    function _updateUserInfo(
        address _to,
        uint256 _amount,
        bool isMinted
    ) internal {
        uint256 _usrIdx = usersFutabaTokensIndexes[address(kToken)][_to];
        if (isMinted) {
            usersFutabaTokensIndexes[address(kToken)][_to] = _usrIdx.add(
                _amount
            );
        } else {
            if (_usrIdx.sub(_amount) > 0) {
                usersFutabaTokensIndexes[address(kToken)][_to] = _usrIdx.sub(
                    _amount
                );
            } else {
                usersFutabaTokensIndexes[address(kToken)][_to] = 0;
            }
        }
    }

    function _tokenPrice() internal view returns (uint256 price) {
        uint256 totSupply = kToken.totalSupply();
        if (totSupply == 0) {
            return 10**(kToken.decimals());
        }

        // eventual underlying unlent balance
        uint256 totNav = _contractBalanceOf(token).mul(ONE_18);
        for (uint256 i = 0; i < allocations.length; i++) {
            address currentToken = allocations[i].token;
            uint16 chainId = allocations[i].chainId;
            address strategy = allocations[i].strategy;
            // NAV = price * poolSupply
            _getPriceInToken(chainId, currentToken).mul(
                _otherChainContractBalanceOf(chainId, strategy)
            );
        }

        // futabaToken price in token wei
        price = totNav.div(totSupply);
    }

    function _getPriceInToken(uint16 chainId, address _token)
        private
        view
        returns (uint256 price)
    {
        // TODO get price via Futaba Node
        string[] memory valuableNames = new string[](1);
        valuableNames[0] = "price";
        bytes[] memory data = _serachData(chainId, _token, valuableNames);
        price = abi.decode(data[0], (uint256));
    }

    function _contractBalanceOf(address _token) private view returns (uint256) {
        // 0x70a08231 -> selector for 'function balanceOf(address) returns (uint256)'
        (bool success, bytes memory data) = _token.staticcall(
            abi.encodeWithSelector(0x70a08231, address(this))
        );
        require(success);
        return abi.decode(data, (uint256));
    }

    function _otherChainContractBalanceOf(uint16 chainId, address _strategy)
        private
        view
        returns (uint256 balance)
    {
        // balance = 100000;
        string[] memory valuableNames = new string[](1);
        valuableNames[0] = "price";
        bytes[] memory data = _serachData(chainId, _strategy, valuableNames);
        balance = abi.decode(data[0], (uint256));
    }

    function _serachData(
        uint16 chainId,
        address _target,
        string[] memory _valuableNames
    ) private view returns (bytes[] memory data) {
        data = IFutaba(futabaNode).readDataFeed(
            chainId,
            _target,
            _valuableNames
        );
    }

    function _sendToStrategy(
        string memory targetChain,
        Wrapper memory targetProtocol,
        bool isNeededBridge
    ) internal returns (bool) {
        bool nothingToken = _contractBalanceOf(token) == 0;
        bool isSameStrategy = targetProtocol.strategy ==
            allocations[0].strategy;

        if (nothingToken && isSameStrategy) {
            return false;
        }

        string memory dstContract = Strings.toHexString(
            uint256(uint160(targetProtocol.strategy)),
            20
        );

        Message memory message = Message(
            80001,
            "Polygon",
            "0x032EcDe31F774E75f041ABFeBF92f922e50E0513"
        );

        if (isNeededBridge) {
            if (isSameStrategy) {
                // send this contract token to other chain and deposit(bridge, message)
                message = Message(80001, targetChain, dstContract);
            } else {
                // send this contract token to current deposited chain, redeem token and send token to target chain(bridge, message)
                message = Message(80001, targetChain, dstContract);
            }
        } else {
            if (isSameStrategy) {
                ILendingProtocol(targetProtocol.strategy).mint(
                    _contractBalanceOf(token)
                );
                return true;
            } else {
                // send this contract token to current deposited chain, redeem token and send token to Moonbeam(bridge, message)
            }
        }
        _sendTokenWithMessageToStrategy(
            "polygon",
            "0x032EcDe31F774E75f041ABFeBF92f922e50E0513",
            bridgeTokenSymbol,
            message,
            _contractBalanceOf(token).div(3)
        );

        if (nothingToken) {
            _sendMessageToStrategy(targetChain, dstContract, message);
        } else {
            _sendTokenWithMessageToStrategy(
                targetChain,
                "0x298CD5cd577b19f4F84d6BD9dCea63060c2B3A74",
                bridgeTokenSymbol,
                message,
                _contractBalanceOf(token)
            );
        }

        return true;
    }

    function _sendTokenWithMessageToStrategy(
        string memory destinationChain,
        string memory destinationAddress,
        string memory symbol,
        Message memory message,
        uint256 amount
    ) internal {
        address tokenAddress = gateway.tokenAddresses(symbol);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenAddress).approve(address(gateway), amount);
        // TODO modify payload
        bytes memory payload = abi.encode(message);
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

    function _sendMessageToStrategy(
        string memory destinationChain,
        string memory destinationAddress,
        Message memory message
    ) internal {
        bytes memory payload = abi.encode(message);
        bridge.deposit(1, resourceID, payload, "0x");
    }
}
