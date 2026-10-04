// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {IERC20} from "@openzeppelin/contracts@5.0.2/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts@5.0.2/token/ERC20/utils/SafeERC20.sol";

/// @title CrossChainMessenger - send text (+ optional tokens) to another chain over Chainlink CCIP, fees in LINK,
///        with an allowlist of source chains/senders on the receiving side.
contract CrossChainMessenger is CCIPReceiver {
    using SafeERC20 for IERC20;

    IERC20 public immutable link;
    address public owner;

    mapping(uint64 => bool) public allowedDestination;
    mapping(uint64 => mapping(address => bool)) public allowedSender; // sourceChainSelector => sender

    bytes32 public lastMessageId;
    uint64 public lastSourceChain;
    address public lastSender;
    string public lastText;
    address public lastToken;
    uint256 public lastAmount;

    event MessageSent(bytes32 indexed id, uint64 indexed destChain, address receiver, string text, address token, uint256 amount, uint256 fee);
    event MessageReceived(bytes32 indexed id, uint64 indexed sourceChain, address sender, string text, address token, uint256 amount);

    error NotOwner();
    error DestinationNotAllowed(uint64 chain);
    error SenderNotAllowed(uint64 chain, address sender);
    error InsufficientLink(uint256 balance, uint256 fee);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address router, address linkToken) CCIPReceiver(router) {
        link = IERC20(linkToken);
        owner = msg.sender;
    }

    function allowDestination(uint64 chain, bool allowed) external onlyOwner {
        allowedDestination[chain] = allowed;
    }

    function allowSender(uint64 chain, address sender, bool allowed) external onlyOwner {
        allowedSender[chain][sender] = allowed;
    }

    function _message(address receiver, string calldata text, address token, uint256 amount) internal view returns (Client.EVM2AnyMessage memory m) {
        Client.EVMTokenAmount[] memory tokens = new Client.EVMTokenAmount[](token == address(0) ? 0 : 1);
        if (token != address(0)) tokens[0] = Client.EVMTokenAmount({token: token, amount: amount});
        m = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encode(text),
            tokenAmounts: tokens,
            extraArgs: Client._argsToBytes(Client.GenericExtraArgsV2({gasLimit: 300_000, allowOutOfOrderExecution: true})),
            feeToken: address(link)
        });
    }

    /// @notice Fee in LINK for a send with these parameters.
    function quote(uint64 destChain, address receiver, string calldata text, address token, uint256 amount) external view returns (uint256) {
        return IRouterClient(getRouter()).getFee(destChain, _message(receiver, text, token, amount));
    }

    /// @notice Send `text` (and optionally `amount` of `token`, pulled from the caller) to `receiver` on `destChain`. LINK fee is paid by this contract.
    function send(uint64 destChain, address receiver, string calldata text, address token, uint256 amount) external onlyOwner returns (bytes32 id) {
        if (!allowedDestination[destChain]) revert DestinationNotAllowed(destChain);
        Client.EVM2AnyMessage memory m = _message(receiver, text, token, amount);
        IRouterClient router = IRouterClient(getRouter());
        uint256 fee = router.getFee(destChain, m);
        uint256 bal = link.balanceOf(address(this));
        if (fee > bal) revert InsufficientLink(bal, fee);
        link.forceApprove(address(router), fee);
        if (token != address(0)) {
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
            IERC20(token).forceApprove(address(router), amount);
        }
        id = router.ccipSend(destChain, m);
        emit MessageSent(id, destChain, receiver, text, token, amount, fee);
    }

    function _ccipReceive(Client.Any2EVMMessage memory m) internal override {
        address sender = abi.decode(m.sender, (address));
        if (!allowedSender[m.sourceChainSelector][sender]) revert SenderNotAllowed(m.sourceChainSelector, sender);
        lastMessageId = m.messageId;
        lastSourceChain = m.sourceChainSelector;
        lastSender = sender;
        lastText = abi.decode(m.data, (string));
        (lastToken, lastAmount) = m.destTokenAmounts.length > 0 ? (m.destTokenAmounts[0].token, m.destTokenAmounts[0].amount) : (address(0), 0);
        emit MessageReceived(m.messageId, m.sourceChainSelector, sender, lastText, lastToken, lastAmount);
    }

    function withdraw(address token, address to) external onlyOwner {
        IERC20(token).safeTransfer(to, IERC20(token).balanceOf(address(this)));
    }
}
