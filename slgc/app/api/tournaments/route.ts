import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Tournament } from "@/models/Tournament";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        await connectDB();
        const tournaments = await Tournament.find({}).sort({ date: 1 });
        return NextResponse.json(tournaments);
    } catch (error) {
        console.error("Error fetching tournaments:", error);
        return NextResponse.json(
            { error: "Failed to fetch tournaments" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Basic protection: only admins can create tournaments
        // Note: session.user.role might need type augmentation if not already done, 
        // but we'll check it safely.
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();

        const { title, description, game, date, prizePool, entryFee, maxTeams, image } = body;

        if (!title || !description || !game || !date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newTournament = await Tournament.create({
            title,
            description,
            game,
            date: new Date(date),
            prizePool,
            entryFee,
            maxTeams,
            image,
        });

        return NextResponse.json(newTournament, { status: 201 });
    } catch (error) {
        console.error("Error creating tournament:", error);
        return NextResponse.json(
            { error: "Failed to create tournament" },
            { status: 500 }
        );
    }
}
