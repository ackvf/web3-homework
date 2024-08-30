import type { User } from 'next-auth'
import NextAuth, { getServerSession, type AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { ROUTE } from '@/routes'
import { get, verifyPassword, type UserFormPayload } from '@/services/redis'

/*
  https://next-auth.js.org/getting-started/example
  https://next-auth.js.org/getting-started/client#signin
  https://next-auth.js.org/providers/credentials
  https://next-auth.js.org/providers/credentials#example---web3--signin-with-ethereum
  https://github.com/spruceid/siwe-quickstart/blob/main/02_backend/src/index.js
*/

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: 'email-password',
      name: 'Email',
      credentials: {
        // name: { label: 'Name', type: 'text', placeholder: 'John Smith' },
        email: { label: 'Emai', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      } satisfies Partial<{ [key in keyof UserFormPayload]: any }>,
      async authorize(credentials, req) {
        if (!credentials) return null

        try {
          const isPasswordCorrect = await verifyPassword({ email: credentials.email, password: credentials.password })

          if (isPasswordCorrect) {
            const user = await get({ email: credentials.email })
            console.debug('user', user)
            // Any object returned will be saved in `user` property of the JWT
            return user as any as User
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null
          }
        } catch (error) {
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          console.error(error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    // https://next-auth.js.org/configuration/callbacks#sign-in-callback
    async jwt({ token, account, profile, ...rest }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        // token.id = profile.id
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      ;(session as any).accessToken! = token.accessToken
      session.user!.email = token.email
      session.user!.name = token.name
      ;(session.user as any).address = token.address
      // // TODO the data are not there
      // console.debug('token', token)
      // console.debug('session', session)
      return session
    },
  },
  pages: {
    signIn: ROUTE.SIGNIN,
    signOut: ROUTE.HOME,
    newUser: ROUTE.SIGNUP,
  },
}

export function getSession() {
  return getServerSession(authOptions)
}

export default NextAuth(authOptions)
