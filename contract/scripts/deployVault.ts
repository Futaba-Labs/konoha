import { ethers } from "hardhat";

async function main() {
  const Database = await ethers.getContractFactory("Vault");
  const db = await Database.deploy("0xD1633F7Fb3d716643125d6415d4177bC36b7186b", "aUSDC", "0x5769D84DD62a6fD969856c75c7D321b84d455929", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6");

  await db.deployed();

  console.log(`deployed to ${db.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
