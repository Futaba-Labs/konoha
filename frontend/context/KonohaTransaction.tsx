import { TransactionStatus } from "../types/utilTypes";
import { Web3ContextInterface } from "../types/web3Types";
import { getWeb3Provider } from "../utils/web3Util";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

type Interface = Web3ContextInterface;

interface Window {
  ethereum?: import("ethers").providers.ExternalProvider;
}

const getDefaultContextValue = (): Web3ContextInterface => ({
  transactionStatuses: [],
  provider: null,
  visible: false,
  setVisible: (visible: boolean) => {},
  connectWallet: async () => {},
  addTransactionStatus: (transactionStatus: TransactionStatus) => {},
});

export const KonohaTransaction = createContext<Web3ContextInterface>(
  getDefaultContextValue()
);

export const TransactionProvider: React.FC<
  React.PropsWithChildren<{ key?: string }>
> = ({ children }) => {
  const [provider, setProvider] = useState<Interface["provider"]>(null);
  const [transactionStatuses, setTransactionStatuses] = useState<
    TransactionStatus[]
  >([]);
  const [visible, setVisible] = useState(false);

  const connectWallet = async () => {
    try {
      if (!provider) {
        const [instance, _provider] = await getWeb3Provider();
        setProvider(_provider);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changeNetwork = async () => {
    console.log("melkmgkwnokn");
    if (provider != null) {
      const chainId = (await provider.getNetwork()).chainId;
      if (chainId !== 1287) {
        const w = window as Window;
        try {
          if (w.ethereum !== undefined) {
            await w.ethereum.request!({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x507",
                  rpcUrls: ["https://moonbase-alpha.public.blastapi.io	"],
                  chainName: "Moonbase Alpha",
                  nativeCurrency: {
                    name: "DEV",
                    symbol: "DEV",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://moonbase.moonscan.io/"],
                },
              ],
            });
            await connectWallet();
            const afterChainId = (await provider.getNetwork()).chainId;
            if (afterChainId !== 137) {
              toast.error("Unsupported Chain Id");
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const addTransactionStatus = (transactionStatus: TransactionStatus) => {
    console.log(transactionStatuses);
    setTransactionStatuses([...transactionStatuses, transactionStatus]);
  };

  useEffect(() => {
    connectWallet();
  });
  useEffect(() => {
    changeNetwork();
  }, []);

  return (
    <KonohaTransaction.Provider
      value={{
        provider,
        transactionStatuses,
        visible,
        setVisible,
        connectWallet,
        addTransactionStatus,
      }}
    >
      {children}
    </KonohaTransaction.Provider>
  );
};
