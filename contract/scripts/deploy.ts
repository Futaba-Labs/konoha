import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const { utils: { setJSON }, testnetInfo } = require('@axelar-network/axelar-local-dev');
import { Wallet, getDefaultProvider } from 'ethers';
const {
  utils: { deployContract },
} = require('@axelar-network/axelar-local-dev');
import DistributionExecutable from "../artifacts/contracts/axelar-test/AxelarTest.sol/AxelarTest.json"
import { Chain } from './utils/type';

async function deploy(env: string, chains: Chain[], wallet: Wallet) {
  const promises = [];
  for (const chain of chains) {
    const rpc = chain.rpc;
    const provider = getDefaultProvider(rpc);
    promises.push(deployAxelarTest(chain, wallet.connect(provider)));
  }
  await Promise.all(promises);
  // if (example.postDeploy) {
  //   for (const chain of chains) {
  //     const rpc = chain.rpc;
  //     const provider = getDefaultProvider(rpc);
  //     promises.push(example.postDeploy(chain, chains, wallet.connect(provider)));
  //   }
  //   await Promise.all(promises);
  // }
  setJSON(chains, `./info/${env}.json`);
}

module.exports = {
  deploy,
}


if (require.main === module) {
  const env = process.argv[3];
  if (env == null || (env != 'testnet' && env != 'local')) throw new Error('Need to specify tesntet or local as an argument to this script.');
  let temp;
  if (env == 'local') {
    temp = require(`../scripts/info/local.json`);
  } else {
    try {
      temp = require(`../info/testnet.json`);
    } catch {
      temp = testnetInfo;
    }
  }
  const chains = temp;

  const private_key = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
  const wallet = new Wallet(private_key);

  deploy(env, chains, wallet);
}
async function deployAxelarTest(chain: Chain, wallet: any) {
  if (chain.name === "Ethereum" || chain.name === "Polygon") {
    console.log(`Deploying DistributionExecutable for ${chain.name}.`);
    const contract = await deployContract(wallet, DistributionExecutable, [chain.gateway, chain.gasReceiver]);
    chain.distributionExecutable = contract.address;
    console.log(`Deployed DistributionExecutable for ${chain.name} at ${chain.distributionExecutable}.`);
  }
}
