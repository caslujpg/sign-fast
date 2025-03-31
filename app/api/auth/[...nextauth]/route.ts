import { createUser, findUserByCredentials, findUserByEmail } from "@/lib/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import { default as Credentials, default as CredentialsProvider } from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
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
        return '/dashboard';
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
        session.user = { ...session.user, id: token.id as string }
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  }
};

const handler = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
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
          await createUser({ email: user.email, name: user.name })
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
        session.user = { ...session.user, id: token.id as string }
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  }
})

export { handler as DELETE, handler as GET, handler as POST };

