import * as dotenv from 'dotenv';
import { BigNumber, ethers } from 'ethers';
import fee_router from "./utils/fee_router.json";
import bridgeABI from "./utils/bridge.json";
import { abi as sygmaABI } from "../artifacts/contracts/axelar-test/SygmaTest.sol/SygmaTest.json"

dotenv.config({ path: '../.env' });

const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
const ADDRESS = "0xe58Bbba485d2e7196a8D8f22198c6f7bf681e465"
const FEE_ROUTER = "0xAAC25f02aeafa90a2E5985604A2b27D70edc9aE2"
const BRIDGE = "0xc52C264877f17481a1859f2afB5793E4a9d2088b"
const TOKEN_AMOUNT = BigNumber.from("10000000"); // 10USDC

async function init(): Promise<ethers.Wallet> {
  const provider = new ethers.providers.JsonRpcProvider(`https://moonbase-alpha.blastapi.io/${process.env.MOONBASE_API_KEY}`);
  const walletWithProvider = new ethers.Wallet(PRIVATE_KEY, provider);
  const signer = walletWithProvider.connect(provider);
  return signer
}
async function main() {
  const signer = await init()

  const targetToken = new ethers.Contract(
    ADDRESS,
    sygmaABI,
    signer
  )

  const fee = new ethers.Contract(
    FEE_ROUTER,
    fee_router,
    signer
  )

  const bridge = new ethers.Contract(
    BRIDGE,
    bridgeABI,
    signer
  )

  const resourceID = await targetToken.resourceID();
  const r = createResourceID(ADDRESS, 2)
  console.log(r, resourceID)

  const message = ethers.utils.defaultAbiCoder.encode(["string"], ["Hello World"])
  console.log(await fee._domainResourceIDToFeeHandlerAddress(1, r))

  const { f, t } = await fee.calculateFee("0x330C4fBDa3b1a47088934289CF6039b5bAB20e45", 2, 1, resourceID, message, "0x")

  // const tx = await targetToken.deposit({ gasLimit: 2000000, value: f });
  // await tx.wait()
  // console.log(tx)
}
const toHex = (covertThis: number | bigint | ethers.utils.BytesLike | ethers.utils.Hexable, padding: number) => {
  return ethers.utils.hexZeroPad(ethers.utils.hexlify(covertThis), padding);
};

const createResourceID = (contractAddress: string, domainID: any) => {
  return toHex(contractAddress + toHex(domainID, 1).substr(2), 32)
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
