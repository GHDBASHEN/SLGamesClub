import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import EditProfileForm from "@/components/EditProfileForm";
import { FaGamepad, FaTrophy, FaUserShield } from "react-icons/fa";

export default async function ProfilePage() {
    // 1. Verify Session
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        redirect("/api/auth/signin");
    }

    await connectDB();

    // 2. Fetch User Data
    const user = await User.findOne({ email: session.user.email });

    // 3. Fetch Only This User's Posts
    const userPosts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

    return (
        <main className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="bg-gray-900 rounded-xl p-8 mb-8 border border-gray-800 flex flex-col md:flex-row items-center gap-8">
                    <img
                        src={user.image || "/default-avatar.png"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg shadow-indigo-500/20"
                    />

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                        <p className="text-gray-400 mb-4">{user.bio}</p>

                        {/* Stats Row */}
                        <div className="flex gap-6 justify-center md:justify-start text-sm text-gray-300">
                            <span className="flex items-center gap-2">
                                <FaGamepad className="text-indigo-400" /> {user.gamesPlayed?.length || 0} Games
                            </span>
                            <span className="flex items-center gap-2">
                                <FaTrophy className="text-yellow-400" /> {userPosts.length} Posts
                            </span>
                        </div>
                    </div>

                    {/* Edit Trigger */}
                    <EditProfileForm
                        currentBio={user.bio}
                        currentGames={user.gamesPlayed}
                        email={user.email}
                    />
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Left Sidebar: Game Library */}
                    <aside className="md:col-span-1">
                        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">My Library</h2>
                            <div className="flex flex-wrap gap-2">
                                {user.gamesPlayed?.length > 0 ? (
                                    user.gamesPlayed.map((game: string, index: number) => (
                                        <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-indigo-300 border border-gray-700">
                                            {game}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No games added yet.</p>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Admin Zone: Only Visible to Admins */}
                    {user.role === 'admin' && (
                        <div className="md:col-span-3 bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/30 p-6 rounded-xl flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-red-100 flex items-center gap-2">
                                    <FaUserShield className="text-red-400" /> Admin Command Center
                                </h2>
                                <p className="text-red-200/70 text-sm mt-1">Manage users, tournaments, and platform settings.</p>
                            </div>
                            <a
                                href="/admin"
                                className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-lg shadow-red-900/20"
                            >
                                Open Dashboard
                            </a>
                        </div>
                    )}

                    {/* Right Section: Activity Feed */}
                    <section className="md:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                        {userPosts.map((post) => (
                            <div key={post._id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-indigo-900/30 text-indigo-400 text-xs px-2 py-1 rounded">
                                        Playing: {post.gameTitle}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-200 mb-3">{post.content}</p>
                                {post.imageUrl && (
                                    <img src={post.imageUrl} className="rounded-lg w-full object-cover max-h-80" />
                                )}
                            </div>
                        ))}

                        {userPosts.length === 0 && (
                            <div className="text-center p-10 border-2 border-dashed border-gray-800 rounded-xl">
                                <p className="text-gray-500">You haven't posted any updates yet.</p>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </main>
    );
}