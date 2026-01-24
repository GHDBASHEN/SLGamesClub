import { connectDB } from "@/lib/db";
import { Tournament } from "@/models/Tournament";
import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { FaGamepad, FaCalendar, FaTrophy, FaUsers, FaInfoCircle } from "react-icons/fa";
import TournamentRegisterButton from "@/components/TournamentRegisterButton";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function TournamentDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await connectDB();
    const session = await getServerSession();

    let currentUser = null;
    if (session?.user?.email) {
        currentUser = await User.findOne({ email: session.user.email });
    }

    let tournament;
    try {
        tournament = await Tournament.findById(params.id)
            .populate('organizer', 'name image')
            .populate('participants', 'name image');
    } catch (e) {
        return notFound();
    }

    if (!tournament) return notFound();

    const isOrganizer = currentUser && (tournament.organizer._id.toString() === currentUser._id.toString() || currentUser.role === 'admin');
    const isRegistered = currentUser && tournament.participants.some((p: any) => p._id.toString() === currentUser._id.toString());
    const isFull = tournament.registeredTeams >= tournament.maxTeams;

    return (
        <main className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0">
                    <img
                        src={tournament.image}
                        alt={tournament.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">
                            {tournament.game}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/20 
                            ${tournament.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800'}`}>
                            {tournament.status}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                        {tournament.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 text-gray-300 font-medium">
                        <div className="flex items-center gap-2">
                            <FaCalendar className="text-indigo-400" />
                            <span>{new Date(tournament.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaTrophy className="text-yellow-400" />
                            <span className="text-yellow-100">{tournament.prizePool}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUsers className="text-blue-400" />
                            <span>{tournament.participants.length} / {tournament.maxTeams} Teams</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-10 relative z-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <FaInfoCircle className="text-indigo-500" /> About Tournament
                        </h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                            {tournament.description}
                        </p>
                    </div>

                    {/* Rules */}
                    {tournament.rules && (
                        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-4">Rules & Regulations</h2>
                            <div className="text-gray-400 leading-relaxed whitespace-pre-wrap bg-black/30 p-6 rounded-xl border border-gray-800/50">
                                {tournament.rules}
                            </div>
                        </div>
                    )}

                    {/* Participants */}
                    <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Registered Players ({tournament.participants.length})</h2>
                        {tournament.participants.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {tournament.participants.map((p: any) => (
                                    <div key={p._id} className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl border border-gray-700">
                                        <img
                                            src={p.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + p.name}
                                            className="w-10 h-10 rounded-full bg-gray-700 object-cover"
                                        />
                                        <span className="font-bold text-gray-200 truncate">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No registrations yet. Be the first!</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl sticky top-24">
                        <div className="mb-6">
                            <p className="text-gray-400 text-sm font-bold uppercase mb-1">Entry Fee</p>
                            <p className="text-3xl font-bold text-white">{tournament.entryFee}</p>
                        </div>

                        <div className="mb-8">
                            <p className="text-gray-400 text-sm font-bold uppercase mb-1">Organizer</p>
                            <div className="flex items-center gap-3 mt-2">
                                <img
                                    src={tournament.organizer?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
                                    className="w-10 h-10 rounded-full bg-gray-800"
                                />
                                <span className="text-white font-bold">{tournament.organizer?.name}</span>
                            </div>
                        </div>

                        {currentUser ? (
                            <TournamentRegisterButton
                                tournamentId={tournament._id.toString()}
                                isRegistered={isRegistered}
                                isFull={isFull}
                                status={tournament.status}
                            />
                        ) : (
                            <Link href="/login" className="block w-full bg-indigo-600 text-white text-center font-bold py-3 rounded-xl hover:bg-indigo-500 transition">
                                Login to Register
                            </Link>
                        )}

                        {isOrganizer && (
                            <div className="mt-8 pt-8 border-t border-gray-800">
                                <p className="text-gray-500 text-sm font-bold uppercase mb-4 text-center">Organizer Controls</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-bold">Edit</button>
                                    <button className="bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 rounded-lg text-sm font-bold border border-red-900/50">Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
