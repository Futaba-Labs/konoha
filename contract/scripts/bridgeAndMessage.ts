import * as dotenv from 'dotenv';
import { abi } from "../artifacts/contracts/axelar-test/AxelarTest.sol/AxelarTest.json";
import erc20ABI from "./utils/erc20.json";
import { BigNumber, ethers } from "ethers";
import { getGasPrice, sleep } from "./utils/utils";


dotenv.config({ path: '../.env' });

const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
const ACCOUNT = "0x330C4fBDa3b1a47088934289CF6039b5bAB20e45"
const AXELAR_TEST_ADDRESS = "0x5C52E47D8ea8B04C251BC3d8d47285C3480b337a"
const TOKEN_ADDRESS = "0x526f0A95EDC3DF4CBDB7bb37d4F7Ed451dB8e369"
const DISTINATION_TOKEN_ADDRESS = "0x2c852e740B62308c46DD29B982FBb650D063Bd07"
const TOKEN_VALUE = BigNumber.from("1000000"); // 1 aUSDC
const DISTINATION_CHAIN = "Polygon"
const DISTINATION_CONTRACT_ADDRESS = "0xc0596348A25618E5CD1BCe2576D3D73c9227b8b1" // Polygon


async function main() {
  const provider = new ethers.providers.AlchemyProvider("maticmum", process.env.POLYGON_TESTNET_API_KEY);
  const walletWithProvider = new ethers.Wallet(PRIVATE_KEY, provider);
  const signer = walletWithProvider.connect(provider);

  const ropstenProvider = new ethers.providers.InfuraProvider("ropsten", "9aa3d95b3bc440fa88ea12eaa4456161");
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

  const gasPrice = await getGasPrice("Ethereum", DISTINATION_CHAIN, TOKEN_ADDRESS)
  const gasLimit = 3e6
  console.log(BigInt(Math.floor(gasLimit * gasPrice)))

  const approveTx = await targetToken.approve(AXELAR_TEST_ADDRESS, TOKEN_VALUE.mul(2))
  console.log('approving token...')
  await approveTx.wait()
  console.log('approved!')

  await sleep(2000)

  const tx = await axelarTest.sendToMany(DISTINATION_CHAIN, DISTINATION_CONTRACT_ADDRESS, [ACCOUNT], "aUSDC", TOKEN_VALUE, {
    value: BigInt(Math.floor(gasLimit * gasPrice)),
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
