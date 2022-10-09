import { KonohaTransaction } from "../context/KonohaTransaction";
import { Web3ContextInterface } from "../types/web3Types";
import { useContext } from "react";

export const useWeb3 = (): Web3ContextInterface =>
  useContext(KonohaTransaction);
