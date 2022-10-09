import { contractABI, contractAddress } from "../utils/consts";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3 } from "./useWeb3";

export const useContract = () => {
  const { provider } = useWeb3();

  const [contract, setContract] = useState<ethers.Contract>();

  const getContract = () => {
    try {
      if (provider) {
        const signer = provider.getSigner();
        const gameItemContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(gameItemContract);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => getContract(), [provider]);
  return contract;
};
