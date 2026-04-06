import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email || credentials?.password) {
          throw new Error("Missing Email or Password");
        }

        try {
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("User not found");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            throw new Error("Invalid Password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("auth error");
          throw error;
        }
      },
    }),
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
    },
  },
  pages: {
    signIn : "/login",
    error : "/login"
  },
  session : {
    strategy : "jwt",
    maxAge : 30 * 24 * 60 * 60, // 30 days,
    updateAge : 24 * 60 * 60, // 24 hours,
  },
  secret : process.env.NEXTAUTH_SECRET,
};
