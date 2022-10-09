import { BigNumber, ethers } from 'ethers'
import { TransactionStatus } from './utilTypes'

export interface Web3ContextInterface {
  transactionStatuses: TransactionStatus[]
  provider: ethers.providers.Web3Provider | null;
  visible: boolean
  setVisible: (visible: boolean) => void
  connectWallet: () => Promise<void>;
  addTransactionStatus: (transactionStatus: TransactionStatus) => void
}

export interface NFT {
  tokenId: string
  price: number
  jpycPrice: number
  image: string
  name: string
}

export interface TransferDesc {
  to: string,
  nativeIn: boolean,
  nativeOut: boolean,
  amountIn: BigNumber,
  tokenIn: string,
  tokenOut: string,
  srcSkipSwap: boolean,
  dstSkipSwap: boolean,
  dstTokenOut: string,
  router: string,
  dstRouter: string,
  srcChainId: number,
  dstChainId: number
}

export interface Amount {
  _hex: string
  _isBigNumber: boolean
}
