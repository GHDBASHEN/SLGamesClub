import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    await connectDB();
    const posts = await Post.find().populate('author').sort({ createdAt: -1 });

    return (
        <main className="p-4 md:p-8 max-w-3xl mx-auto min-h-screen">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Community Feed</h1>
                    <p className="text-gray-400">See what's happening in SL gaming</p>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-20 bg-gray-900/50 rounded-3xl">
                    <p>No posts yet. Be the first to share a moment!</p>
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post._id} className="bg-gray-900 p-6 mb-6 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={post.author?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                className="w-12 h-12 rounded-full bg-gray-800 object-cover"
                                alt="Author"
                            />
                            <div>
                                <div className="font-bold text-lg text-white">{post.author?.name}</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                                        {post.gameTag || "General"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-200 mb-4 text-lg leading-relaxed">{post.content}</p>

                        {post.imageUrl && (
                            <div className="overflow-hidden rounded-2xl bg-black">
                                <img src={post.imageUrl} alt="Post Content" className="w-full h-auto object-cover hover:scale-[1.02] transition duration-500" />
                            </div>
                        )}

                        {/* Interaction Bar (Visual Only for now) */}
                        <div className="flex gap-6 mt-4 pt-4 border-t border-gray-800/50 text-gray-400">
                            <button className="hover:text-pink-500 transition">❤️ Like</button>
                            <button className="hover:text-indigo-500 transition">💬 Comment</button>
                            <button className="hover:text-white transition">🚀 Share</button>
                        </div>
                    </div>
                ))
            )}
        </main>
    );
}