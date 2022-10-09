import { ethers } from "hardhat";

// Moonbase: 0xe58Bbba485d2e7196a8D8f22198c6f7bf681e465
// Mumbui: 0x83595756829e7F7f97453eE1b90bD2B1613Ec730

async function main() {
  const SygmaTest = await ethers.getContractFactory("SygmaTest");
  const sygma = await SygmaTest.deploy("0xc52C264877f17481a1859f2afB5793E4a9d2088b");

  await sygma.deployed();

  console.log(`deployed to ${sygma.address}`);
  const id = toHex(sygma.address + toHex(2, 1).substr(2), 32)
  const tx = await sygma.setResourceID(id)
  await tx.wait()
  console.log(tx)
}

const toHex = (covertThis: any, padding: number): string => {
  return ethers.utils.hexZeroPad(ethers.utils.hexlify(covertThis), padding);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});