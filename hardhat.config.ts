import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  typechain: {
    outDir: 'contracts/typings',
    externalArtifacts: ['contracts/abi/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
}

export default config
