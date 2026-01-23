import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    // 1. Credentials Login (Email & Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();

        // Find user
        const user = await User.findOne({ email: credentials?.email }).select("+password");
        if (!user) throw new Error("User not found");

        // Verify Password
        const isValid = await bcrypt.compare(credentials?.password || "", user.password);
        if (!isValid) throw new Error("Invalid password");

        // Verify Email (Optional, keep if you want strict verification)
        if (!user.isVerified) {
          throw new Error("Please verify your email first!");
        }

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user._id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: "jwt" as const } // Ensure "jwt" is treated as the correct literal type
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };