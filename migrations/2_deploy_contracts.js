const NftToken = artifacts.require("NftToken");
const Pool = artifacts.require("Pool");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
  await deployer.deploy(Token)
  const token = await Token.deployed()

  await deployer.deploy(Pool , token.address)
  const pool = await Pool.deployed()

  await token.passMinterRole(pool.address)

  await deployer.deploy(NftToken , pool.address)
};
