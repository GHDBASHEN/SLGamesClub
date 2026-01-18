import mongoose, { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    imageUrl: String, // Screenshot URL
    gameTitle: String,
    likes: { type: Number, default: 0 },
}, { timestamps: true });

export const Post = models.Post || model('Post', PostSchema);