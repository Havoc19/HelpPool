// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Pool.sol";

contract NftToken is ERC721URIStorage {
    Pool private bank;

    constructor(Pool _bank) ERC721("Blockie", "BLC") {
        bank = _bank;
    }

    uint256 c = 0;
    mapping(address => bool) public minted;
    mapping(address => bool) public isPlayed;

    // function played() public {
    //     isPlayed[msg.sender] = true;
    // }

    function mint(address _to, string memory _tokenURI) public returns (bool) {
        require(bank.checkBalance(_to) >= 1e16, "Balance is Low");
        require(minted[_to] != true);
        uint256 _tokenId = c++;
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        minted[_to] = true;
        return true;
    }
}
