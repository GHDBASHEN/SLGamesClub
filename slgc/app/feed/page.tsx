import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { Comment } from "@/models/Comment";
import { getServerSession } from "next-auth";
import CreatePostForm from "@/components/CreatePostForm";
import PostCard from "@/components/PostCard";

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    await connectDB();
    const session = await getServerSession();

    // Fetch current user details if logged in
    let currentUserDetails = null;
    if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) {
            currentUserDetails = {
                _id: user._id.toString(),
                name: user.name,
                image: user.image,
                role: user.role
            };
        }
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
                    const cleanComments = postComments.map((c: any) => ({
                        ...c,
                        _id: c._id.toString(),
                        createdAt: c.createdAt.toISOString(),
                        // Ensure author has _id for permission checks in client
                        author: {
                            ...c.author,
                            _id: c.author._id.toString()
                        }
                    }));

                    return (
                        <PostCard
                            key={post._id.toString()}
                            post={{
                                ...post,
                                _id: post._id.toString(),
                                likes: post.likes ? post.likes.map((id: any) => id.toString()) : [],
                                createdAt: post.createdAt.toISOString(),
                                author: {
                                    ...post.author,
                                    _id: post.author._id.toString()
                                }
                            }}
                            currentUser={currentUserDetails}
                            comments={cleanComments}
                        />
                    );
                })
            )}
        </main>
    );
}