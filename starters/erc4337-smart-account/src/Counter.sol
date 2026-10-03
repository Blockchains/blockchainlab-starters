// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// Simple target contract the smart account calls.
contract Counter {
    mapping(address => uint256) public count;
    event Incremented(address indexed caller, uint256 value);

    function increment() external {
        uint256 v = ++count[msg.sender];
        emit Incremented(msg.sender, v);
    }
}
