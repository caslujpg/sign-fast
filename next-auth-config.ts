import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createUser, findUserByCredentials, findUserByEmail } from "./lib/user";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        id: {},
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const user = await findUserByCredentials(
          credentials.email as string,
          credentials.password as string
        );
        return user;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    })
  ],
  callbacks: {
    signIn: async ({ account, user }) => {
      if (account?.provider === 'google') {
        if (!user?.email || !user.name) {
          return false;
        }

        const dbUser = await findUserByEmail(user.email);
        if (!dbUser) {
          await createUser({ email: user.email, name: user.name });
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token)
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    newUser: '/register',
    signIn: '/login',
    signOut: '/',

  }
};