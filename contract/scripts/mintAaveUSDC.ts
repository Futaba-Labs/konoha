import * as dotenv from 'dotenv';
import { BigNumber, ethers } from 'ethers';
import erc20ABI from "./utils/erc20.json";
import { abi } from "../artifacts/contracts/Vault.sol/Vault.json";
import { abi as futabaABI } from "../artifacts/contracts/FutabaToken.sol/FutabaToken.json"

dotenv.config({ path: '../.env' });

const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
const TOKEN_ADDRESS = "0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2"
const TOKEN_AMOUNT = BigNumber.from("10000000"); // 10USDC

async function init(): Promise<ethers.Wallet> {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.POLYGON_TESTNET_API_KEY}`);
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

  const tx = await targetToken.mint(TOKEN_AMOUNT)
  await tx.wait()
  console.log(tx)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
