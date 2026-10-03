// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "./vendor/chainlink/AggregatorV3Interface.sol";

/// @title PriceConsumer - reads a Chainlink Data Feed with staleness + sanity checks
contract PriceConsumer {
    AggregatorV3Interface public immutable feed;
    uint256 public immutable maxStaleness;

    error StalePrice(uint256 updatedAt, uint256 nowTs);
    error InvalidPrice(int256 answer);

    constructor(address feed_, uint256 maxStaleness_) {
        feed = AggregatorV3Interface(feed_);
        maxStaleness = maxStaleness_;
    }

    /// @return price latest answer, @return decimals feed decimals
    function latestPrice() public view returns (int256 price, uint8 decimals) {
        (, int256 answer,, uint256 updatedAt,) = feed.latestRoundData();
        if (answer <= 0) revert InvalidPrice(answer);
        if (block.timestamp - updatedAt > maxStaleness) revert StalePrice(updatedAt, block.timestamp);
        return (answer, feed.decimals());
    }

    /// @notice Converts an amount of the base asset (18 decimals) to quote units (18 decimals)
    function quote(uint256 baseAmount) external view returns (uint256) {
        (int256 price, uint8 dec) = latestPrice();
        return baseAmount * uint256(price) / (10 ** dec);
    }
}
