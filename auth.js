import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), // will be necessary for OAuth
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });

        if (!user || !user.passwordHash)
          return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid)
          return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
    // oauth https://authjs.dev/getting-started/providers/google
  ],

  // might be necessary https://medium.com/@mrsaadmasood1/exploring-the-depths-of-next-auth-hell-part-2-07710a04985b
  // callbacks: {
  //   async jwt({ token, user, account }) {
  //      // user from authorize function is returned here after
  //      // if signIn callback returns true
  //     return token
  //   },
  //   async session({ session, token }) {
  //     // token from the jwt callback is returned here
  //     return session
  //   },
  //   async signIn({ user, account }) {
  //     // user from authorize function is return first here and
  //     // it controls if the user is allowed to sign in
  //     return true
  //   }
  // }
});
