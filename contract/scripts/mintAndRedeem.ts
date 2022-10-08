import * as dotenv from 'dotenv';
import { BigNumber, ethers } from 'ethers';
import erc20ABI from "./utils/erc20.json";
import { abi } from "../artifacts/contracts/Vault.sol/Vault.json";
import { abi as futabaABI } from "../artifacts/contracts/FutabaToken.sol/FutabaToken.json"

dotenv.config({ path: '../.env' });

const VAULT_ADDRESS = "0x336dB3a68e30dffea72D002c99c41ac20ae4E5bB"
const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
const ACCOUNT = "0x330C4fBDa3b1a47088934289CF6039b5bAB20e45"
const TOKEN_ADDRESS = "0xD1633F7Fb3d716643125d6415d4177bC36b7186b"
const TOKEN_AMOUNT = BigNumber.from("1000000"); // 1 aUSDC
const FUTABA_NODE = "0xAEb90fCD11B8d917699e40F5aFA239623376e362"
// const DISTINATION_CHAIN = "Polygon"
// const DISTINATION_CONTRACT_ADDRESS = "0xc0596348A25618E5CD1BCe2576D3D73c9227b8b1" // Polygon

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
  const te = await vaultContract.fToken()
  // const te = await vaultContract.tokenPrice(TOKEN_AMOUNT)
  console.log(te)

  const futabaToken = new ethers.Contract(
    te,
    futabaABI,
    signer
  )

  // const mintedTokens = TOKEN_AMOUNT.mul(1000000).div(1086167);
  // const t = await futabaToken.mint(ACCOUNT, mintedTokens)
  // console.log(parseInt(mintedTokens._hex))
  // await t.wait()
  // console.log(t)


  // const setFutaba = await vaultContract.setFutabaDB(FUTABA_NODE, { gasLimit: 2000000 })

  // console.log('sending transaction...')

  // await setFutaba.wait()

  // console.log('complete!')


  let approveTx = await targetToken.approve(VAULT_ADDRESS, TOKEN_AMOUNT.mul(2))
  console.log('approving token...')
  await approveTx.wait()
  console.log('approved!')

  let tx = await vaultContract.mintFutabaToken(TOKEN_AMOUNT, { gasLimit: 2000000 })

  console.log('sending transaction...')

  await tx.wait()

  console.log(tx)

  // approveTx = await futabaToken.approve(VAULT_ADDRESS, TOKEN_AMOUNT.mul(2))
  // console.log('approving token...')
  // await approveTx.wait()
  // console.log('approved!')

  // tx = await vaultContract.redeemIdleToken(TOKEN_AMOUNT, { gasLimit: 2000000 })

  // console.log('sending transaction...')

  // await tx.wait()

  // console.log(tx)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
