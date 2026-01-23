import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import Link from "next/link";

export default async function VerifyEmailPage(props: { searchParams: Promise<{ token: string }> }) {
    const searchParams = await props.searchParams;
    const token = searchParams.token;

    if (!token) return <div className="p-10 text-red-500">Invalid Token</div>;

    await connectDB();

    // Find user with matching token and check expiry
    const user = await User.findOne({
        verifyToken: token,
        verifyTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid or Expired Link</h1>
                <p>Please try registering again.</p>
            </div>
        );
    }

    // Update user to Verified
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
            <h1 className="text-3xl font-bold text-green-500 mb-4">Account Verified! 🎉</h1>
            <p className="mb-6">You can now login to GameHub.</p>
            <Link href="/login" className="bg-indigo-600 px-6 py-2 rounded hover:bg-indigo-500">
                Go to Login
            </Link>
        </div>
    );
}