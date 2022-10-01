export interface Chain {
  name: string,
  chainId: number,
  gateway: never,
  gasReceiver: never,
  constAddressDeployer: string,
  tokens: any
  rpc: string,
  tokenName: string,
  tokenSymbol: string,
  distributionExecutable: string,
}
