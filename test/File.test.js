const { assert } = require('chai')

const NftToken = artifacts.require('./Nftoken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Nft Token', (accounts) => {
   let token

   before(async () => {
     token = await NftToken.deployed()
   })

  describe('deployment', async() => {
    it('deploys successfully', async () => {
        const address = token.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('has a name', async () =>{
      const name = await token.name()
      assert.equal(name, 'Blockie')
    })

    it('has a symbol', async () =>{
      const symbol = await token.symbol()
      assert.equal(symbol, 'BLC')
    })
  })

  describe('token distribution', async () =>{
    let result

    it('mints tokens', async () => {
      await token.mint(accounts[0],'https://nft')

      result = await token.totalSupply()
      assert.equal(result.toString(), '1', 'Supply is corrrect')
    
      result = await token.balanceOf(accounts[0])
      assert.equal(result.toString(), '1', 'balanceOf is corrrect')

      result = await token.ownerOf('1')
      assert.equal(result.toString(), accounts[0].toString(), 'owner is correct')
      
      result = await token.tokenOfOwnerByIndex(accounts[0], 0)

      let balanceOf = await token.balanceOf(accounts[0])
      let tokenIds = []
      for (let i = 0; i < balanceOf; i++){
        let id = await token.tokenOfOwnerByIndex(accounts[0],i)
        tokenIds.push(id.toString())
      }

      let expected = ['1']
      assert.equal(tokenIds.toString(), expected.toString(),'tokenIds are correct')

      let tokenURI = await token.tokenURI('1')
      assert.equal(tokenURI, 'https://nft')
    })
  })
})
