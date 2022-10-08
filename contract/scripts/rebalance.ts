import * as dotenv from 'dotenv';
import { BigNumber, ethers } from 'ethers';
import erc20ABI from "./utils/erc20.json";
import { abi } from "../artifacts/contracts/Vault.sol/Vault.json";
import { abi as futabaABI } from "../artifacts/contracts/FutabaToken.sol/FutabaToken.json"

dotenv.config({ path: '../.env' });

const VAULT_ADDRESS = "0x336dB3a68e30dffea72D002c99c41ac20ae4E5bB"
const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
// const ACCOUNT = "0x330C4fBDa3b1a47088934289CF6039b5bAB20e45"
const TOKEN_ADDRESS = "0xD1633F7Fb3d716643125d6415d4177bC36b7186b"
// const TOKEN_AMOUNT = BigNumber.from("100000"); // 1 aUSDC
const FUTABA_NODE = "0xAEb90fCD11B8d917699e40F5aFA239623376e362"

async function init(): Promise<ethers.Wallet> {
  const provider = new ethers.providers.JsonRpcProvider(`https://moonbase-alpha.blastapi.io/${process.env.MOONBASE_API_KEY}`);
  const walletWithProvider = new ethers.Wallet(PRIVATE_KEY, provider);
  const signer = walletWithProvider.connect(provider);
  return signer
}
async function main() {
  const signer = await init()

  const targetToken = new ethers.Contract(
    TOKEN_ADDRESS,
    erc20ABI,
    signer
  )

  const vaultContract = new ethers.Contract(VAULT_ADDRESS, abi, signer)
  const protocols = [{
    name: "Compound",
    wrapper: {
      chainId: 1,
      src: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
      valuableName: "supplyRate",
      strategy: "0x39aa39c021dfbae8fac545936693ac917d5e7563"
    }
  },
  {
    name: "AAVE",
    wrapper: {
      chainId: 137,
      src: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
      valuableName: "liquidityRate",
      strategy: "0x1ea1207a5DAE9C3b31A45796894F4066a5835dAe"
    }
  }, {
    name: "Moonwell",
    wrapper: {
      chainId: 1284,
      src: "0x02e9081DfadD37A852F9a73C4d7d69e615E61334",
      valuableName: "supplyRate",
      strategy: "0x02e9081DfadD37A852F9a73C4d7d69e615E61334"
    }
  }]
  // for (let index = 0; index < protocols.length; index++) {
  //   const element = protocols[index];
  //   const tx = await vaultContract.setProtocolWrapper(element.name, element.wrapper)
  //   await tx.wait()
  //   console.log('complete!')
  // }

  // const setFutaba = await vaultContract.setFutabaDB(FUTABA_NODE, { gasLimit: 2000000 })

  // console.log('sending transaction...')

  // await setFutaba.wait()

  // console.log('complete!')

  const tx = await vaultContract.rebalance({ gasLimit: 2000000 })
  await tx.wait()
  console.log(tx)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
