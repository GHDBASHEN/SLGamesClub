import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    // The Gamer who posted this
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    
    // Content
    title: { type: String, required: true },
    content: { type: String, required: true }, // The blog text
    imageUrl: { type: String, required: true }, // The Screenshot from Cloudinary
    
    // Metadata
    gameTag: { type: String, required: true }, // e.g., "Cyberpunk 2077"
    
    // Interaction
    // We store an array of User IDs to know EXACTLY who liked the post
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], 
  },
  { timestamps: true }
);

export const Post = models.Post || model("Post", PostSchema);