// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./BetVerifier.sol";

interface IPoseidonT3 {
    function poseidon(uint256[3] memory input) external pure returns (uint256);
}

contract Betting {
    BetVerifier public betVerifier;
    IPoseidonT3 public poseidon;
    address public owner;
    uint public bettingDeadline;
    bool public betsClosed;
    uint public totalStakes;
    uint public totalWinningStakes;
    uint public winnerEntry;

    struct Bet {
        uint256 commitment;
        uint256 stake;
        bool claimed;
    }

    mapping(address => Bet) public bets;

    constructor(address _betVerifier, address _poseidon) {
        betVerifier = BetVerifier(_betVerifier);
        poseidon = IPoseidonT3(_poseidon);
        owner = msg.sender;
        bettingDeadline = block.timestamp + 1 days;
    }

    function submitBet(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) public payable {
        require(block.timestamp < bettingDeadline, "Betting closed");
        require(bets[msg.sender].stake == 0, "Already bet");
        require(betVerifier.verifyProof(a, b, c, input), "Invalid Bet proof");

        bets[msg.sender] = Bet(input[0], msg.value, false);
        totalStakes += msg.value;
    }

    function closeBets(uint winnerId, uint totalWinnerStake) public {
        require(msg.sender == owner, "Only owner");
        require(!betsClosed, "Already closed");
        winnerEntry = winnerId;
        totalWinningStakes = totalWinnerStake;
        betsClosed = true;
    }

    function claimPayout(uint entryId, uint stake, uint secret) public {
        require(betsClosed, "Bets not closed");
        Bet storage bet = bets[msg.sender];
        require(!bet.claimed, "Already claimed");

        uint256 recomputed = poseidon.poseidon([entryId, stake, secret]);
        require(recomputed == bet.commitment, "Invalid reveal");

        if (entryId == winnerEntry) {
            uint payout = (bet.stake * totalStakes) / totalWinningStakes;
            payable(msg.sender).transfer(payout);
        }
        bet.claimed = true;
    }
}
