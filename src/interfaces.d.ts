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
