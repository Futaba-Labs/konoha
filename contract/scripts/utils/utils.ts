import axios from 'axios';

interface Params {
  method: string
  destinationChain: string
  sourceChain: string
  sourceTokenAddress?: string
  sourceTokenSymbol?: string
}

export async function getGasPrice(sourceChainName: string, destinationChainName: string, tokenAddress: string) {
  const api_url = 'https://devnet.api.gmp.axelarscan.io';

  const requester = axios.create({ baseURL: api_url });
  const params: Params = {
    method: 'getGasPrice',
    destinationChain: destinationChainName,
    sourceChain: sourceChainName,
  };

  // set gas token address to params
  // if (tokenAddress != "0") {
  //   params.sourceTokenAddress = tokenAddress;
  // }
  // else {
  //   params.sourceTokenSymbol = "MATIC";
  // }
  params.sourceTokenSymbol = "aUSDC";
  // send request
  const response = await requester.get('/', { params })
    .catch(error => { return { data: { error } }; });
  const result = response.data.result;
  const dest = result.destination_native_token;
  const destPrice = 1e18 * dest.gas_price * dest.token_price.usd;
  return destPrice / result.source_token.token_price.usd;
}

export async function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
