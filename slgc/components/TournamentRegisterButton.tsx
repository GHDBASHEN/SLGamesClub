'use client';

import { useState } from "react";
import { registerForTournament } from "@/lib/tournamentActions";
import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function TournamentRegisterButton({ tournamentId, isRegistered, isFull, status }: any) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (status !== 'open' && status !== 'upcoming') {
        return (
            <button disabled className="bg-gray-800 text-gray-500 font-bold py-3 px-8 rounded-xl cursor-not-allowed">
                {status === 'ongoing' ? 'Tournament in Progress' : 'Registration Closed'}
            </button>
        );
    }

    if (isRegistered) {
        return (
            <div className="bg-green-600/20 border border-green-500 text-green-400 font-bold py-3 px-8 rounded-xl text-center">
                ✓ You are Registered
            </div>
        );
    }

    if (isFull) {
        return (
            <button disabled className="bg-red-900/50 text-red-400 font-bold py-3 px-8 rounded-xl cursor-not-allowed border border-red-800">
                Tournament Full
            </button>
        );
    }

    const handleRegister = async () => {
        if (!confirm("Are you sure you want to register?")) return;

        setLoading(true);
        try {
            await registerForTournament(tournamentId);
            router.refresh(); // Refresh to update UI
        } catch (error) {
            alert("Failed to register. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/30 transition flex items-center gap-2"
        >
            {loading ? 'Registering...' : <><FaPlay /> Register Now</>}
        </button>
    );
}
