// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "fhevm@0.3.x/lib/TFHE.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RockPaperScissors is Ownable {
    using SafeERC20 for IERC20;
    address public betTokenAddress;
    bool public isInitialised;

    modifier onlyWhenInitialised() {
        if (isInitialised == false) {
            revert();
        }
        _;
    }

    constructor(address _tokenAddress) Ownable(msg.sender) {
        betTokenAddress = _tokenAddress;
    }

    function initialize() external onlyOwner {
        require(
            IERC20(betTokenAddress).transferFrom(
                msg.sender,
                address(this),
                1000000 * 10**18
            ),
            "Initial funding failed"
        );
        isInitialised = true;
    }

    event RockPaperScissors_Outcome_Event(
        address indexed playerAddress,
        uint256 wager,
        uint256 payout,
        address tokenAddress,
        uint256[] payouts,
        uint32[] randomNumberArray,
        uint32 numGames
    );

    error InvalidAction();
    error InvalidNumBets(uint256 maxNumBets);
    error BlockNumberTooLow(uint256 have, uint256 want);
    error ZeroWager();

    function ROCKPAPERSCISSORS_PLAY(
        uint256 wager,
        uint8 action,
        uint32 numBets,
        uint256 stopGain,
        uint256 stopLoss
    ) external {
        address msgSender = _msgSender();
        if (action >= 3) {
            revert InvalidAction();
        }
        if (!(numBets > 0 && numBets <= 100)) {
            revert InvalidNumBets(100);
        }
        _transferWager(wager * numBets, msgSender);
        getRandomNumberAndSettleBets(
            numBets,
            msgSender,
            action,
            wager,
            stopGain,
            stopLoss
        );
    }

    function settleBet(
        address playerAddress,
        uint32[] memory randomWords,
        uint8 action,
        uint32 numBets,
        uint256 wager,
        uint256 stopGain,
        uint256 stopLoss
    ) internal {
        if (playerAddress == address(0)) revert();
        uint8[] memory randomActions = new uint8[](numBets);
        uint256[] memory payouts = new uint256[](numBets);
        int256 totalValue;
        uint256 payout;
        uint32 i;

        for (i = 0; i < numBets; i++) {
            if (totalValue >= int256(stopGain)) {
                break;
            }
            if (totalValue <= -int256(stopLoss)) {
                break;
            }
            randomActions[i] = uint8(randomWords[i] % 3);
            if (randomActions[i] == action) {
                payout += wager;
                payouts[i] = wager;
                totalValue += int256(payouts[i]);
            } else if (
                (action == 0 && randomActions[i] == 2) ||
                (action == 1 && randomActions[i] == 0) ||
                (action == 2 && randomActions[i] == 1)
            ) {
                payout += wager * 7/4;
                payouts[i] = wager * 7/4;
                totalValue += int256(payouts[i]);
            } else {
                totalValue -= int256(wager);
            }
        }
        payout += (numBets - i) * wager;
        emit RockPaperScissors_Outcome_Event(
            playerAddress,
            wager,
            payout,
            betTokenAddress,
            payouts,
            randomWords,
            i
        );
        if (payout > 0) {
            _transferPayout(playerAddress, payout);
        }
    }

    //need  to figure out logic

    function getRandomNumberAndSettleBets(
        uint32 numBets,
        address playerAddress,
        uint8 action,
        uint256 wager,
        uint256 stopGain,
        uint256 stopLoss
    ) public {
        require(numBets > 0, "Invalid number of bets");
        uint32[] memory randomNumberArray = new uint32[](numBets);
        uint32 encryptedRandomNumber = uint32(
            generateEncryptedRandomNumber() % 6
        );
        for (uint256 i = 0; i < numBets; i++) {
            if (i % 2 == 0) {
                randomNumberArray[i] =
                    ((encryptedRandomNumber + uint32(i)) % 3) +
                    uint32(block.timestamp % 5);
            } else if (i % 3 == 0) {
                randomNumberArray[i] =
                    ((encryptedRandomNumber + uint32(i)) % 7) +
                    uint32(block.timestamp % 8);
            } else {
                randomNumberArray[i] =
                    ((encryptedRandomNumber + uint32(i)) % 6) +
                    uint32(block.timestamp % 4);
            }
        }
        settleBet(
            playerAddress,
            randomNumberArray,
            action,
            numBets,
            wager,
            stopGain,
            stopLoss
        );
    }

    function generateEncryptedRandomNumber() internal view returns (uint32) {
        return TFHE.decrypt(TFHE.randEuint32());
    }

    function _transferWager(uint256 wager, address msgSender) internal {
        if (wager == 0) {
            revert ZeroWager();
        }
        IERC20(betTokenAddress).safeTransferFrom(
            msgSender,
            address(this),
            wager
        );
    }

    function _transferPayout(address player, uint256 payout) internal {
        IERC20(betTokenAddress).safeTransfer(player, payout);
    }
}
