import { ethers } from "hardhat";

async function main() {
  const FutabaAAVEV3 = await ethers.getContractFactory("FutabaAAVEV3");
  const aave = await FutabaAAVEV3.deploy("0x1758d4e6f68166C4B2d9d0F049F33dEB399Daa1F", "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6");

  await aave.deployed();

  console.log(`deployed to ${aave.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
