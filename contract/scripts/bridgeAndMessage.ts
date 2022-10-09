import * as dotenv from 'dotenv';
import { abi } from "../artifacts/contracts/axelar-test/AxelarTest.sol/AxelarTest.json";
import erc20ABI from "./utils/erc20.json";
import { BigNumber, ethers } from "ethers";
import { getGasPrice, sleep } from "./utils/utils";
import { AxelarQueryAPI, Environment, EvmChain, GasToken } from "@axelar-network/axelarjs-sdk"


dotenv.config({ path: '../.env' });

const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
const ACCOUNT = "0x330C4fBDa3b1a47088934289CF6039b5bAB20e45"
const AXELAR_TEST_ADDRESS = "0xc0596348A25618E5CD1BCe2576D3D73c9227b8b1"
const TOKEN_ADDRESS = "0x2c852e740B62308c46DD29B982FBb650D063Bd07"
const DISTINATION_TOKEN_ADDRESS = "0xD1633F7Fb3d716643125d6415d4177bC36b7186b"
const TOKEN_VALUE = BigNumber.from("100000"); // 1 aUSDC
const DISTINATION_CHAIN = "moonbeam"
const DISTINATION_CONTRACT_ADDRESS = "0x61396b70A06bFD097e687054D4A543431EDDE936" // Moonbeam


async function main() {
  const provider = new ethers.providers.JsonRpcProvider(`https://moonbase-alpha.blastapi.io/${process.env.MOONBASE_API_KEY}`);
  const walletWithProvider = new ethers.Wallet(PRIVATE_KEY, provider);
  const signer = walletWithProvider.connect(provider);

  const ropstenProvider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.POLYGON_TESTNET_API_KEY}`);
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

  let balance = BigInt(await distinationToken.balanceOf(ACCOUNT));
  console.log(balance)

  const sdk = new AxelarQueryAPI({
    environment: Environment.TESTNET,
  });

  const estimateGasUsed = 700000;

  // Returns avax amount to pay gas
  const gasFee = await sdk.estimateGasFee(
    EvmChain.POLYGON,
    EvmChain.MOONBEAM,
    GasToken.MATIC,
    estimateGasUsed
  );

  const gasPrice = await getGasPrice("polygon", DISTINATION_CHAIN, TOKEN_ADDRESS)
  const gasLimit = 3e6
  // console.log(Math.floor(gasLimit * gasFee), Math.floor(gasLimit * gasPrice))

  const approveTx = await targetToken.approve(AXELAR_TEST_ADDRESS, TOKEN_VALUE.mul(2))
  console.log('approving token...')
  await approveTx.wait()
  console.log('approved!')

  await sleep(2000)

  const tx = await axelarTest.sendToMany(DISTINATION_CHAIN, DISTINATION_CONTRACT_ADDRESS, [ACCOUNT], "aUSDC", TOKEN_VALUE, {
    value: BigNumber.from(gasFee),
    gasLimit: estimateGasUsed
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
