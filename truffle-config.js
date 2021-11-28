const HDWalletProvider = require('truffle-hdwallet-provider')
const infuraKey = "1ef3d962c3d94399a52d3305f19de345"
const fs = require('fs');
const memonic = fs.readFileSync(".secret").toString().trim()

const private_keys = [
  '3a8fe9c11142cd4f7db88221df90cfa8555251220b4c7b6f12bd72dee7d6e025'
]

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider:() => new HDWalletProvider(memonic,'https://rinkeby.infura.io/v3/1ef3d962c3d94399a52d3305f19de345'),
      network_id : 4,
      gas : 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun : true
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version : "0.8.0"
      }
    }
}
