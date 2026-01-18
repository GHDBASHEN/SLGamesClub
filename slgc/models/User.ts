import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image: String,
    bio: { type: String, default: "New Player" },
    gamesPlayed: [String], // e.g. ["PUBG", "Valorant"]
    socialLinks: {
        discord: String,
        twitch: String
    }
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);