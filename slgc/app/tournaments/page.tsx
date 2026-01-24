import { connectDB } from "@/lib/db";
import { Tournament } from "@/models/Tournament";
import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import TournamentCard from "@/components/TournamentCard";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export const dynamic = 'force-dynamic';

export default async function TournamentsPage() {
    await connectDB();
    const session = await getServerSession();
    const tournaments = await Tournament.find({}).sort({ date: 1 });

    let canCreate = false;
    if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user && (user.role === 'admin' || user.role === 'sponsor')) {
            canCreate = true;
        }
    }

    return (
        <main className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        TOURNAMENTS
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Compete in the hottest esports events in Sri Lanka. From Valorant to PUBG, prove your skills and win big.
                    </p>
                </div>

                {canCreate && (
                    <Link
                        href="/tournaments/create"
                        className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20"
                    >
                        <FaPlus /> Create Tournament
                    </Link>
                )}
            </div>

            {tournaments.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
                    <h2 className="text-2xl text-white font-bold mb-2">No Tournaments Yet</h2>
                    <p className="text-gray-500">Check back later for upcoming events!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tournaments.map((t) => (
                        <TournamentCard key={t._id} tournament={JSON.parse(JSON.stringify(t))} />
                    ))}
                </div>
            )}
        </main>
    );
}
