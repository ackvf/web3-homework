This project is a hybrid **Next.js** app with **Hardhat** for building contracts, **TypeChain** for type safety, **Mocha** for testing and **Waffle** for mocking contracts.

 * *@author* Qwerty <qwerty@qwerty.xyz>

# Folder structure

```sh
/pages          # Next.js frontend routing
/pages/api      # Next.js backend api

/test           # Mocha tests for Contracts

/abi            # provide ABI files for contracts without *.sol source
/contracts      # provide solidity contracts

/artifacts      # generated ABIs and hardhat artifacts for /contracts (git-ignored)
/typings        # generated typescript interfaces and classes (git-ignored)
  - abi             # Contract typings for /abi
  - artifacts       # Contract typings for /artifacts ( = /contracts)
  - factories/      # Contract factories (read below)
      - abi         # Contract factories for /abi
      - artifacts   # Contract factories for /artifacts ( = /contracts)
```

## Contract typings (interfaces)

The main files generated are `<contract-name>.ts` in `typings` folder. They declare typesafe **interfaces** for the contracts
on top of ethers `Contract` instances:

- typed contract's methods, available both at `contract.someMethod(...)` and `contract.functions.someMethod(...)`
- typed events in `contract.interface.events.AnEvent` and filters in `contract.filters.AnEvent`
- typed method gas estimates in `contract.estimateGas.someMethod`
- overrides for the event listener methods (`on`, `once`, etc) that return the same contract type.

Note: these are just _type declarations_ to help call the blockchain properly, so they're not available at runtime,
and all of the contracts are still instances of the same `Contract` class.

## Contract factories (classes)

Other generated files in `typings/factories` folder are a concrete factory **classes** for each contract, to help deploy or connect to contract
instances. The factory classes are an extension of ethers' `ContractFactory`. They serve two main purposes:

- wrap passing **contract ABI** and bytecode to the `ContractFactory` class, so you don't have to load and parse the JSON
  manually
- provide a correctly typed interface to `ContractFactory` (since it returns plain `Contract` instances).

Abstract contracts or solidity interfaces are handled a bit different, because they have no bytecode. For those, a
simplified factory is generated that doesn't extends `ContractFactory`, and only includes the static `connect` method,
so you can easily connect to a deployed instance without having to pass the ABI manually.

# Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks or see `package.json` "scripts":

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
