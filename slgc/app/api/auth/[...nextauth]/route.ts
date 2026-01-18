import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        // 1. Find user by Email OR Name
        const user = await User.findOne({
          $or: [
            { email: credentials?.email },
            { name: credentials?.email } // Allow login via username
          ]
        });

        if (!user) throw new Error("User not found");

        // 2. Check Password
        const isValid = await bcrypt.compare(credentials?.password || "", user.password);
        if (!isValid) throw new Error("Invalid password");

        // 3. Check Verification
        if (!user.isVerified) throw new Error("Please verify your email first!");

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image };
      }
    })
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!; // Add ID to session
      }
      return session;
    }
  },
  session: { strategy: "jwt" } // Required for Credentials provider
});

export { handler as GET, handler as POST };