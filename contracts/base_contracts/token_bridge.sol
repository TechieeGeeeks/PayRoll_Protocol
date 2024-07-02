// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenLockAndMint is Ownable, ReentrancyGuard {
    IERC20 public token;
    address public mailbox = 0xe306C7CebE03cD7BcCD8259E4D34016a0A156b3b;
    address public remoteContract;
    uint32 public remoteDomain;
    uint256 public lastAmount;
    event TokensLocked(address indexed user, uint256 amount, uint256 timestamp);
    event TokensMinted(address indexed user, uint256 amount, uint256 timestamp);
    event DispatchProxy(
        uint32 indexed destination,
        bytes32 indexed recipient,
        bytes actualMessage
    );

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
        remoteDomain = 9090;
    }

    function initialize(address _remoteContract) external onlyOwner {
        remoteContract = _remoteContract;
    }

    function lockTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens from sender to this contract
        token.transferFrom(msg.sender, address(this), amount);
        uint32 _amount = usdcToUint32(amount);
        // Send a message to the remote chain to mint the tokens
        bytes memory message = abi.encode(msg.sender, _amount);
        IMailbox(mailbox).dispatch(
            remoteDomain,
            addressToBytes32(remoteContract),
            message
        );
        emit DispatchProxy(
            remoteDomain,
            addressToBytes32(remoteContract),
            message
        );
        emit TokensLocked(msg.sender, amount, block.timestamp);
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _data
    ) public payable {
        require(_origin == remoteDomain, "Invalid source domain");
        require(
            _sender == bytes32(addressToBytes32(remoteContract)),
            "Invalid source contract"
        );
        (address user, uint256 amount) = abi.decode(_data, (address, uint256));
        token.transfer(user, amount);
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
        return address(uint160(uint256(_buf)));
    }

    function usdcToUint32(uint256 usdcAmount) public pure returns (uint32) {
        // USDC has 6 decimal places, so we divide by 10^6 to get the whole number part
        uint32 wholeNumber = uint32(usdcAmount / 10**18);
        return wholeNumber;
    }

    modifier onlyMailbox() {
        require(msg.sender == mailbox, "MailboxClient: sender not mailbox");
        _;
    }
}

interface IMailbox {
    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external payable returns (bytes32 messageId);

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external payable;
}
//0x531d86ca391c01cb5aa3fd184580ae1276b0fae0
//0x531D86CA391C01Cb5AA3FD184580ae1276b0FAe0
