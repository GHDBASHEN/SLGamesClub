'use server';

import { connectDB } from "./db";
import { Tournament } from "@/models/Tournament";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

export async function createTournament(formData: FormData, imageUrl: string) {
    await connectDB();
    const session = await getServerSession();
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    // Allow Admins and Sponsors to create
    if (user.role !== 'admin' && user.role !== 'sponsor') {
        throw new Error("Forbidden: Only Admins and Sponsors can create tournaments");
    }

    const title = formData.get('title');
    const description = formData.get('description');
    const game = formData.get('game');
    const date = formData.get('date');
    const prizePool = formData.get('prizePool');
    const entryFee = formData.get('entryFee');
    const maxTeams = formData.get('maxTeams');
    const rules = formData.get('rules');

    const newTournament = await Tournament.create({
        title,
        description,
        game,
        date: new Date(date as string),
        prizePool,
        entryFee,
        maxTeams,
        rules,
        image: imageUrl || "",
        organizer: user._id,
        status: 'open'
    });

    revalidatePath('/tournaments');
    return newTournament._id.toString();
}

export async function registerForTournament(tournamentId: string) {
    await connectDB();
    const session = await getServerSession();
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) throw new Error("Tournament not found");
    if (tournament.status === 'completed' || tournament.status === 'ongoing') {
        throw new Error("Registration closed");
    }

    // Check if already registered
    if (tournament.participants.includes(user._id)) {
        throw new Error("Already registered");
    }

    // Add to participants and increment count
    await Tournament.findByIdAndUpdate(tournamentId, {
        $addToSet: { participants: user._id },
        $inc: { registeredTeams: 1 }
    });

    revalidatePath(`/tournaments/${tournamentId}`);
}

export async function deleteTournament(tournamentId: string) {
    await connectDB();
    const session = await getServerSession();
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) throw new Error("Not found");

    // Only Organizer or Admin
    if (tournament.organizer.toString() !== user._id.toString() && user.role !== 'admin') {
        throw new Error("Forbidden");
    }

    await Tournament.findByIdAndDelete(tournamentId);
    revalidatePath('/tournaments');
}

export async function removeParticipant(tournamentId: string, userId: string) {
    await connectDB();
    const session = await getServerSession();
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) throw new Error("Not found");

    // Only Organizer or Admin can remove participants
    if (tournament.organizer.toString() !== user._id.toString() && user.role !== 'admin') {
        throw new Error("Forbidden");
    }

    await Tournament.findByIdAndUpdate(tournamentId, {
        $pull: { participants: userId },
        $inc: { registeredTeams: -1 }
    });

    revalidatePath(`/tournaments/${tournamentId}`);
}
