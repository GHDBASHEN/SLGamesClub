import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import { connectDB } from "@/lib/db";
import { redirect } from "next/navigation";
import TournamentForm from "@/components/TournamentForm";

export default async function CreateTournamentPage() {
    await connectDB();
    const session = await getServerSession();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || (user.role !== 'admin' && user.role !== 'sponsor')) {
        redirect("/tournaments"); // Unauthorized
    }

    return (
        <main className="min-h-screen p-8 md:p-12 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Create New Tournament</h1>
            <TournamentForm />
        </main>
    );
}
