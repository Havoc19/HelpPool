// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Token.sol";

contract Pool {
    Token private token;

    event Deposit(address indexed user, uint256 etherAmount, uint256 timeStart);
    event Withdraw(
        address indexed user,
        uint256 etherAmount,
        uint256 depositTime,
        uint256 interest
    );

    mapping(address => uint256) public etherBalanceOf;
    mapping(address => uint256) public depositStart;
    mapping(address => bool) public isDeposited;

    constructor(Token _token) {
        token = _token;
    }

    function deposit() public payable {
        require(
            isDeposited[msg.sender] == false,
            "Error deposit already active"
        );
        require(msg.value >= 1e16, "Error,deposit must be >= 0.01 ETH");
        etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
        isDeposited[msg.sender] = true;
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function checkBalance(address _user) public view returns (uint256) {
        return etherBalanceOf[_user];
    }

    function withdraw() public payable {
        require(isDeposited[msg.sender] == true, "Error, no previous deposit");
        uint256 userBalance = etherBalanceOf[msg.sender];
        uint256 depositTime = block.timestamp - depositStart[msg.sender];

        uint256 interestPerSecond = 31668017 *
            (etherBalanceOf[msg.sender] / 1e16);
        uint256 interest = interestPerSecond * depositTime;

        payable(msg.sender).transfer(userBalance);
        token.mint(msg.sender, interest);

        etherBalanceOf[msg.sender] = 0;
        depositStart[msg.sender] = 0;
        isDeposited[msg.sender] = false;

        emit Withdraw(msg.sender, userBalance, depositTime, interest);
    }
}
