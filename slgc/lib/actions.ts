'use server';

import { connectDB } from "./db";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { Comment } from "@/models/Comment";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

export async function createPost(formData: FormData, imageUrl?: string) {
    await connectDB();
    const session = await getServerSession();
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    const content = formData.get('content');
    const gameTag = formData.get('gameTag');

    await Post.create({
        content,
        imageUrl: imageUrl || "",
        gameTitle: gameTag, // Assuming gameTag maps to gameTitle in schema
        gameTag: gameTag,
        author: user._id,
        title: "New Post" // Schema requires title but form doesn't seem to have it, using placeholder or could add to form
    });
    revalidatePath('/feed');
}

export async function toggleLikePost(postId: string) {
    await connectDB();
    const session = await getServerSession();
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    const post = await Post.findById(postId);

    if (post.likes.includes(user._id)) {
        await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } });
    } else {
        await Post.findByIdAndUpdate(postId, { $addToSet: { likes: user._id } });
    }
    revalidatePath('/feed');
}

export async function addComment(postId: string, content: string) {
    await connectDB();
    const session = await getServerSession();
    if (!session || !session.user?.email) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });

    await Comment.create({
        content,
        author: user._id,
        postId
    });
    revalidatePath('/feed');
}

export async function deletePost(postId: string) {
    await connectDB();
    await Post.findByIdAndDelete(postId);
    revalidatePath('/');
}

export async function updateProfile(email: string, newBio: string, games: string, image?: string) {
    await connectDB();
    const gamesArray = games.split(',').map(g => g.trim());

    const updateData: any = { bio: newBio, gamesPlayed: gamesArray };
    if (image) updateData.image = image;

    await User.findOneAndUpdate({ email }, updateData);
    revalidatePath('/profile');
}