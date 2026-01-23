import mongoose, { Schema, model, models } from "mongoose";

const TournamentSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        game: { type: String, required: true }, // e.g., "Valorant", "COD Mobile"
        date: { type: Date, required: true },
        prizePool: { type: String, default: "0 LKR" },
        entryFee: { type: String, default: "Free" },
        maxTeams: { type: Number, default: 16 },
        registeredTeams: { type: Number, default: 0 },
        image: { type: String, default: "/images/tournament-placeholder.jpg" }, // Add a placeholder image later
        status: {
            type: String,
            enum: ["upcoming", "open", "ongoing", "completed"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

export const Tournament = models.Tournament || model("Tournament", TournamentSchema);
