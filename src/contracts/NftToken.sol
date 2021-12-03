// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Pool.sol";

contract NftToken is ERC721Enumerable {
    Pool private bank;

    constructor(Pool _bank) ERC721("Blockie", "BLC") {
        bank = _bank;
    }

    uint256 c = 0;
    mapping(address => bool) public minted;
    mapping(address => bool) public isPlayed;

    mapping(uint256 => string) private _tokenURIs;

    // function played() public {
    //     isPlayed[msg.sender] = true;
    // }
    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory _tokenURI)
    {
        return _tokenURIs[_tokenId];
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

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
