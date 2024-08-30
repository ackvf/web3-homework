This app is also deployed on https://exodus.qwerty.art/

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

Secrets in `.env` are not included. Contact `qwerty@qwerty.xyz`.

---

Working flows

1. User signs up with email and a custodial wallet is created in database
2. User signs in with email
3. User can sign out
4. User can connect their bank account with plaid
5. User can see their bank account in the plaid dashboard

There are numerous api endpoints that support both POST and GET requests for testing
