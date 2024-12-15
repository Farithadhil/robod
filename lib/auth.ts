import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const [users] = await db.query("SELECT * FROM users WHERE email = ?", [credentials.email]);
          
          if (!users || users.length === 0) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            users[0].password_hash
          );

          if (!isValidPassword) {
            return null;
          }

          return { 
            id: users[0].id, 
            email: users[0].email, 
            name: users[0].name 
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/", // Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};