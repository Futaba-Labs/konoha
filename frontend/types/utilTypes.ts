export interface Chain {
  id: number
  name: string
}
export interface Chains {
  id: number
  name: string
}


export interface Coin {
  name: string
  address: string
}

export interface TransactionData {
  chain: Chain
  coin: Coin
  amount: string
}

export interface TransactionStatus {
  step: number
  transactionHash: string
}