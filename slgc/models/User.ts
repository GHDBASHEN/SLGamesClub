import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false },
    image: { type: String, default: "" },
    
    // Updated Role System
    role: { 
      type: String, 
      enum: ["user", "editor", "moderator", "sponsor", "admin"], 
      default: "user" 
    },

    isVerified: { type: Boolean, default: false }, 
    
    // Profile Fields
    bio: { type: String, default: "New Player" },
    gamesPlayed: { type: [String], default: [] },
    socials: {
      discord: String,
      twitch: String,
    },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);