import { ethers } from "hardhat";

async function main() {
  const FutabaAAVEV3 = await ethers.getContractFactory("FutabaMoonwell");
  const aave = await FutabaAAVEV3.deploy("0x02e9081DfadD37A852F9a73C4d7d69e615E61334");

  await aave.deployed();

  console.log(`deployed to ${aave.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
