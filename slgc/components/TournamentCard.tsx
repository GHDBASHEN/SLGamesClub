import Link from "next/link";
import { FaTrophy, FaCalendar, FaUsers, FaGamepad } from "react-icons/fa";

interface TournamentType {
    _id: string;
    title: string;
    game: string;
    date: Date;
    prizePool: string;
    image: string;
    participants: any[];
    maxTeams: number;
    status: string;
}

export default function TournamentCard({ tournament }: { tournament: TournamentType }) {
    const isFull = tournament.participants.length >= tournament.maxTeams;

    return (
        <Link href={`/tournaments/${tournament._id}`} className="block group">
            <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-800 transition transform hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-500/50">
                <div className="h-48 overflow-hidden relative">
                    <img
                        src={tournament.image}
                        alt={tournament.title}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 uppercase tracking-wider">
                        {tournament.status}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <FaGamepad className="text-indigo-400" />
                        <span className="text-sm text-indigo-300 font-bold uppercase tracking-wider">{tournament.game}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{tournament.title}</h3>

                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                        <FaCalendar />
                        <span>{new Date(tournament.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-2 text-yellow-500">
                            <FaTrophy />
                            <span className="font-bold">{tournament.prizePool}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <FaUsers />
                            <span>{tournament.participants.length}/{tournament.maxTeams}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
