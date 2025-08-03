// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Betting {
    mapping(address => bytes32[]) public userBets;
    bytes32[] public allBets;

    event BetPlaced(address indexed user, bytes32 commitment);

    function placeBet(bytes32 commitment) external {
        userBets[msg.sender].push(commitment);
        allBets.push(commitment);
        emit BetPlaced(msg.sender, commitment);
    }

    function getUserBets(address user) external view returns (bytes32[] memory) {
        return userBets[user];
    }

    function getAllBets() external view returns (bytes32[] memory) {
        return allBets;
    }
}