// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "../src/vendor/chainlink/AggregatorV3Interface.sol";

contract MockV3Aggregator is AggregatorV3Interface {
    uint8 public override decimals;
    int256 public answer;
    uint256 public updatedAt;
    uint80 public round;

    constructor(uint8 d, int256 a) { decimals = d; update(a); }
    function update(int256 a) public { answer = a; updatedAt = block.timestamp; round++; }
    function setUpdatedAt(uint256 t) external { updatedAt = t; }
    function description() external pure override returns (string memory) { return "MOCK / USD"; }
    function version() external pure override returns (uint256) { return 4; }
    function getRoundData(uint80 r) external view override returns (uint80, int256, uint256, uint256, uint80) {
        return (r, answer, updatedAt, updatedAt, r);
    }
    function latestRoundData() external view override returns (uint80, int256, uint256, uint256, uint80) {
        return (round, answer, updatedAt, updatedAt, round);
    }
}
