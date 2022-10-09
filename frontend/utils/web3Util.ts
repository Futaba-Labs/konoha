import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

const providerOptions = async () => ({
  walletconnect: {
    package: (await import('@walletconnect/web3-provider')).default,
    infuraId: '27e484dcd9e3efcfd25a83a78777cdf1',
  },
})

export const getWeb3Provider = async (): Promise<
  [ethers.providers.ExternalProvider, ethers.providers.Web3Provider]
> => {
  const web3Modal = new Web3Modal({
    providerOptions: await providerOptions(),
    cacheProvider: true,
  })
  const instance = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(instance, 'any')
  return [instance, provider]
}

export const getTargetContract = () => { }