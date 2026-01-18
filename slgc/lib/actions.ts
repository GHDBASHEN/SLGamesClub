'use server';

import { connectDB } from "./db";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

export async function createPost(formData: FormData) {
    await connectDB();

    // In a real app, use auth() to get the actual user ID
    // const session = await getServerSession(); 
    // const authorId = session?.user?.id;

    const content = formData.get('content');
    const imageUrl = formData.get('imageUrl');
    const gameTitle = formData.get('gameTitle');
    const authorId = formData.get('authorId'); // Temporary for demo

    await Post.create({ content, imageUrl, gameTitle, author: authorId });
    revalidatePath('/'); // Refresh feed
}

export async function deletePost(postId: string) {
    await connectDB();
    await Post.findByIdAndDelete(postId);
    revalidatePath('/');
}

export async function updateProfile(email: string, newBio: string, games: string) {
    await connectDB();
    const gamesArray = games.split(',').map(g => g.trim());
    await User.findOneAndUpdate({ email }, { bio: newBio, gamesPlayed: gamesArray });
    revalidatePath('/profile');
}