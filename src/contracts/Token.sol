// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public admin;

    event MinterChanged(address indexed from, address to);

    constructor() payable ERC20("HP Currency", "HP") {
        admin = msg.sender; //only initially
    }

    function passMinterRole(address pool) public returns (bool) {
        require(
            msg.sender == admin,
            "Error, only owner can change pass minter role"
        );
        admin = pool;

        emit MinterChanged(msg.sender, pool);
        return true;
    }

    function mint(address account, uint256 amount) public {
        require(
            msg.sender == admin,
            "Error, msg.sender does not have minter role"
        ); //dBank
        _mint(account, amount);
    }
}
