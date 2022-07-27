/*
This file is an "Ambient Module". The types defined here are available globally.

To contribute ambient declarations from any file, even non-ambient, use this:
declare global {
  interface Window {
    ethereum: any
  }
}

Don't use `import` and `export` in this file directly! It breaks ambience. To import external types in an ambient module (this file) use the following:
declare type React = import('react')
*/

declare type BaseContract = import('ethers').BaseContract
declare type _MockContract = import('ethereum-waffle').MockContract
declare type Stub = import('ethereum-waffle').Stub
interface MockContract<T extends BaseContract = BaseContract> extends _MockContract {
  mock: {
    [key in keyof T['functions']]: Stub
  }
}


type UTCString = `${number}-${number}-${number} ${number}:${number}:${number} UTC` // e.g. 2022-06-01 16:47:55 UTC

type AnyObject<T = any> = Record<string, T>
type AnyFunction = (...args: any[]) => any

type AllowArray<T> = T | T[]

type ValuesOf<T> = T[keyof T]

type Modify<T, R> = Omit<T, keyof R> & R

type AllOrNone<T> = T | { [K in keyof T]?: never }

// Window and library interfaces overrides -------------------------------------------------------------------------------------

interface Window {
  ethereum: EthereumProvider
  web3: any
  d: any // debug object, put anything here without TypeScript complaining about "Property 'd' does not exist on Window."
}


// ExternalProvider is the official type for the window.ethereum object, however, `new Web3(ethereum)` does not like it so we must improvise. https://github.com/MetaMask/providers
declare type ExternalProvider = import('@ethersproject/providers').ExternalProvider
declare type AbstractProvider = import('web3/node_modules/web3-core/types').AbstractProvider
interface EthereumProvider extends ExternalProvider {
  _state: {
    accounts: string[]
  }
  /** web3-react/injected-connector listens to these events and re-emits them as its own type `ConnectorEvent`.*/
  on(event: 'close' | 'accountsChanged' | 'chainChanged' | 'networkChanged', callback: (payload: any) => void): void
  once(event: 'close' | 'accountsChanged' | 'chainChanged' | 'networkChanged', callback: (payload: any) => void): void
  removeAllListeners(): void
  sendAsync: AbstractProvider['sendAsync']
}
