import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { Comment } from "@/models/Comment";
import { getServerSession } from "next-auth";
import CreatePostForm from "@/components/CreatePostForm";
import PostInteractions from "@/components/PostInteractions";

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    await connectDB();
    const session = await getServerSession();

    // Fetch current user ID if logged in
    let currentUserId = null;
    if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) currentUserId = user._id.toString();
    }

    // Fetch posts with author populated
    const posts = await Post.find()
        .populate('author', 'name image') // Only get name and image
        .sort({ createdAt: -1 })
        .lean(); // Use lean for better performance and JSON serialization

    // Fetch all comments (naive approach, better to fetch per post or aggregate)
    // For small scale, fetching all and filtering is okay, or fetching comments for these posts
    const postIds = posts.map(p => p._id);
    const comments = await Comment.find({ postId: { $in: postIds } })
        .populate('author', 'name image')
        .sort({ createdAt: 1 })
        .lean();

    return (
        <main className="p-4 md:p-8 max-w-3xl mx-auto min-h-screen">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Community Feed</h1>
                    <p className="text-gray-400">See what's happening in SL gaming</p>
                </div>
            </div>

            {/* Create Post Section - Logged In Only */}
            {session && <CreatePostForm />}

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-20 bg-gray-900/50 rounded-3xl">
                    <p>No posts yet. Be the first to share a moment!</p>
                </div>
            ) : (
                posts.map((post: any) => {
                    const postComments = comments.filter((c: any) => c.postId.toString() === post._id.toString());
                    // Convert ObjectIds to strings for props
                    const cleanComments = postComments.map((c: any) => ({
                        ...c,
                        _id: c._id.toString(),
                        createdAt: c.createdAt.toISOString()
                    }));

                    // Likes array contains ObjectIds, convert to strings
                    const likeIds = post.likes ? post.likes.map((id: any) => id.toString()) : [];

                    return (
                        <div key={post._id.toString()} className="bg-gray-900 p-6 mb-6 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-800">
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={post.author?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                                    className="w-12 h-12 rounded-full bg-gray-800 object-cover"
                                    alt="Author"
                                />
                                <div>
                                    <div className="font-bold text-lg text-white">{post.author?.name || "Unknown Gamer"}</div>
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

                            <p className="text-gray-200 mb-4 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>

                            {post.imageUrl && (
                                <div className="overflow-hidden rounded-2xl bg-black mb-4">
                                    <img src={post.imageUrl} alt="Post Content" className="w-full h-auto object-cover hover:scale-[1.01] transition duration-500" />
                                </div>
                            )}

                            {/* Interactions */}
                            <PostInteractions
                                postId={post._id.toString()}
                                initialLikes={likeIds}
                                currentUserId={currentUserId}
                                initialComments={cleanComments}
                            />
                        </div>
                    );
                })
            )}
        </main>
    );
}