// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Savings {
  IERC20 private tokenContract;

  uint private TARGET;

  constructor (IERC20 _tokenContract, uint target) {
    tokenContract = _tokenContract;
    TARGET = target;
  }

  function check() external view returns (bool) {
    uint _balance = tokenContract.balanceOf(msg.sender);
    return _balance > TARGET;
  }

  function balance() external view returns (uint) {
    return tokenContract.balanceOf(msg.sender);
  }
}

interface IERC20 {
  function balanceOf(address account) external view returns (uint256);
}
