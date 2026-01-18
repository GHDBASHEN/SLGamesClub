import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session }) {
            // Add user ID to session from DB
            await connectDB();
            const dbUser = await User.findOne({ email: session.user?.email });
            if (session.user && dbUser) {
                session.user.id = dbUser._id.toString();
            }
            return session;
        },
        async signIn({ user }) {
            await connectDB();
            const exists = await User.findOne({ email: user.email });
            if (!exists) {
                await User.create({ name: user.name, email: user.email, image: user.image });
            }
            return true;
        },
    },
});

export { handler as GET, handler as POST };