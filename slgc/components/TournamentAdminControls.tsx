'use client';

import { deleteTournament, removeParticipant } from "@/lib/tournamentActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrash, FaUserMinus } from "react-icons/fa";

export function DeleteTournamentButton({ tournamentId }: { tournamentId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to DELETE this tournament? This cannot be undone.")) return;
        setLoading(true);
        try {
            await deleteTournament(tournamentId);
            router.push('/tournaments');
        } catch (error) {
            alert("Failed to delete tournament");
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 px-4 rounded-lg text-sm font-bold border border-red-900/50 flex items-center justify-center gap-2 w-full transition"
        >
            {loading ? "Deleting..." : <><FaTrash /> Delete Tournament</>}
        </button>
    );
}

export function RemoveParticipantButton({ tournamentId, userId, userName }: { tournamentId: string, userId: string, userName: string }) {
    const [loading, setLoading] = useState(false);

    const handleRemove = async () => {
        if (!confirm(`Remove ${userName} from this tournament?`)) return;
        setLoading(true);
        try {
            await removeParticipant(tournamentId, userId);
        } catch (error) {
            alert("Failed to remove user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRemove}
            disabled={loading}
            className="text-gray-500 hover:text-red-500 p-2 transition"
            title="Remove User"
        >
            <FaUserMinus />
        </button>
    );
}
