import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";

export default async function Home() {
    await connectDB();
    // Fetch posts with author details populated
    const posts = await Post.find().populate('author').sort({ createdAt: -1 });

    return (
        <main className="p-8 max-w-2xl mx-auto">
            {posts.map((post) => (
                <div key={post._id} className="bg-gray-800 text-white p-4 mb-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={post.author?.image} className="w-8 h-8 rounded-full" />
                        <span className="font-bold">{post.author?.name}</span>
                        <span className="text-xs text-gray-400">playing {post.gameTitle}</span>
                    </div>
                    <p>{post.content}</p>
                    {post.imageUrl && (
                        <img src={post.imageUrl} alt="Game Screenshot" className="mt-2 rounded w-full" />
                    )}
                </div>
            ))}
        </main>
    );
}