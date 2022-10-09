// async function main() {
//   // Optionally, do the vefication as a separate script

//   await hre.run("verify:verify", {
//     address: "0xa4055C7A1f6e898BFA24fCdFac804598388C1f26", // Deployed contract address -- potentially, use `hre` to help here
//     constructorArguments: ['0x5c4e6A9e5C1e1BF445A062006faF19EA6c49aFeA'], // Tableland address on Polygon mainnet
//   })
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
//   })
import * as dotenv from 'dotenv';
import { abi } from "../artifacts/contracts/axelar-test/AxelarTest.sol/AxelarTest.json";
import erc20ABI from "./utils/erc20.json";
import { BigNumber, ethers } from "ethers";
import { getGasPrice, sleep } from "./utils/utils";


dotenv.config({ path: '../.env' });

const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
const ACCOUNT = "0x330C4fBDa3b1a47088934289CF6039b5bAB20e45"
const AXELAR_TEST_ADDRESS = "0xAEb90fCD11B8d917699e40F5aFA239623376e362"
const TOKEN_ADDRESS = "0x254d06f33bDc5b8ee05b2ea472107E300226659A"
const DISTINATION_TOKEN_ADDRESS = "0xD1633F7Fb3d716643125d6415d4177bC36b7186b"
const TOKEN_VALUE = BigNumber.from("1000000"); // 1 aUSDC
const DISTINATION_CHAIN = "moonbeam"
const DISTINATION_CONTRACT_ADDRESS = "0x61396b70A06bFD097e687054D4A543431EDDE936" // Moonbeam


async function main() {
  const provider = new ethers.providers.JsonRpcProvider(`https://moonbase-alpha.blastapi.io/${process.env.MOONBASE_API_KEY}`);
  const walletWithProvider = new ethers.Wallet(PRIVATE_KEY, provider);
  const signer = walletWithProvider.connect(provider);

  const ropstenProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ETHEREUM_GOERLI_API_KEY);
  const walletWithRopstenProvider = new ethers.Wallet(PRIVATE_KEY, ropstenProvider);
  const ropstenSigner = walletWithRopstenProvider.connect(ropstenProvider);

  const targetToken = new ethers.Contract(
    TOKEN_ADDRESS,
    erc20ABI,
    ropstenSigner
  )

  const distinationToken = new ethers.Contract(
    DISTINATION_TOKEN_ADDRESS,
    erc20ABI,
    signer
  )

  const axelarTest = new ethers.Contract(AXELAR_TEST_ADDRESS, abi, ropstenSigner);

  let balance = BigInt(await targetToken.balanceOf(ACCOUNT));
  console.log(balance)

  const gasPrice = await getGasPrice("ethereum", DISTINATION_CHAIN, TOKEN_ADDRESS)
  const gasLimit = 3e6
  console.log(BigInt(Math.floor(gasLimit * gasPrice)))

  const approveTx = await targetToken.approve(AXELAR_TEST_ADDRESS, TOKEN_VALUE.mul(2))
  console.log('approving token...')
  await approveTx.wait()
  console.log('approved!')

  await sleep(2000)

  const tx = await axelarTest.sendToMany(DISTINATION_CHAIN, DISTINATION_CONTRACT_ADDRESS, [ACCOUNT], "aUSDC", 1, {
    value: BigInt(Math.floor(gasLimit * gasPrice)),
    gasLimit
  })

  console.log('sending transaction...')

  await tx.wait();

  while (BigInt(await distinationToken.balanceOf(ACCOUNT)) === balance) {
    console.log("waiting for messaging...")
    await sleep(2000);
  }
  balance = BigInt(await distinationToken.balanceOf(ACCOUNT))
  console.log('--- After ---');
  console.log(`balance: ${balance}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
