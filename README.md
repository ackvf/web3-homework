# Web3 Home assignments

This repository contains solutions to several home assignments.
Each resides in its own branch and has its own deployment. See [**main**](https://github.com/ackvf/web3-homework/tree/main) branch's README for all links or their respective READMEs for more relevant information.

- 129bit https://129bit.qwerty.art/

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install dependencies and get environment variables from example file.

```bash
pnpm install
```

Then run the development server:

```bash
pnpm dev
```

### environment vartiables

Get your free Alchemy API key https://dashboard.alchemy.com/apps/excputcq0ik8e7a1/setup and addit to [`.env.local`](.env.local) file. (Copy [`.env.sample`](.env.sample) and rename it to `.env.local`)

### Troubleshooting

- 🚨 `Cannot find module 'postcss-load-config' or its corresponding type declarations.` @ [postcss.config.mjs](./postcss.config.mjs)  
  👉 Install [`tsx`](https://www.npmjs.com/package/tsx) package.
