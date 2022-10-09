import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

dotenv.config();
const accounts =
  process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
    },
    polygon_testnet: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.POLYGON_TESTNET_API_KEY}`,
      accounts
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ETHEREUM_GOERLI_API_KEY}`,
      accounts
    },
    moonbase: {
      url: `https://moonbase-alpha.blastapi.io/${process.env.MOONBASE_API_KEY}`,
      accounts
    }
  },
};

export default config;
