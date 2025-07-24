import type { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { login } from "@/services/auth/login";
import type { IRequestLogin } from "@/services/auth/login/type";

const secret = process.env.NEXTAUTH_SECRET;
export const authOptions: AuthOptions = {
  secret,
  session: {
    maxAge: 15 * 24 * 60 * 60,
    strategy: "jwt",
  },
  jwt: {
    maxAge: 15 * 24 * 60 * 60,
  },
  /**
   * Providers
   */
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrPhone: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        type: { label: "Type", type: "type" },
      },
      // @ts-expect-erro
      async authorize(credentials) {
        try {
          if (credentials) {
            const response = await login(credentials as IRequestLogin);
            return {
              ...(response.data as any),
            };
          }
        } catch (error: any) {
          throw new Error(error.response.data.message);
        }
      },
    }),
  ],
  /**
   * Callbacks
   */
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },

  /**
   * Pages
   */
  pages: {
    signIn: "/auth/sign-in",
    // signOut: "/auth/sign-in",
  },
};

export default NextAuth(authOptions);
