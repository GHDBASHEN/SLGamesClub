'use client';

import { useState } from "react";
import { toggleLikePost, addComment } from "@/lib/actions";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";

interface CommentType {
    _id: string;
    content: string;
    author: { name: string; image: string };
    createdAt: string;
}

interface Props {
    postId: string;
    initialLikes: string[];
    currentUserId?: string;
    initialComments: CommentType[];
}

export default function PostInteractions({ postId, initialLikes, currentUserId, initialComments }: Props) {
    const [likes, setLikes] = useState(initialLikes);
    const [comments, setComments] = useState(initialComments);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isLiked, setIsLiked] = useState(currentUserId ? initialLikes.includes(currentUserId) : false);

    const handleLike = async () => {
        if (!currentUserId) return; // Prevent action if not logged in

        // Optimistic update
        if (isLiked) {
            setLikes(prev => prev.filter(id => id !== currentUserId));
        } else {
            setLikes(prev => [...prev, currentUserId]);
        }
        setIsLiked(!isLiked);

        await toggleLikePost(postId);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUserId) return;

        // Note: For true optimistic UI on comments, we'd need the user's details available here.
        // For simplicity, we'll wait for the server revalidation or could fetch to append.
        // We'll trust revalidatePath for now to refresh the list, but we can clear the input.

        await addComment(postId, newComment);
        setNewComment("");
        // Ideally we fetch updated comments here or use a server action that returns the new comment
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-800/50">
            {/* Action Bar */}
            <div className="flex gap-6 text-gray-400 mb-4">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>{likes.length}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 hover:text-indigo-500 transition"
                >
                    <FaComment />
                    <span>{comments.length}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="space-y-4">
                    {/* Comment List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className="bg-gray-800/50 p-3 rounded-xl text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-indigo-300">{comment.author?.name || "User"}</span>
                                        <span className="text-gray-600 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-300">{comment.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">No comments yet.</p>
                        )}
                    </div>

                    {/* Add Comment */}
                    {currentUserId && (
                        <form onSubmit={handleCommentSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
                            >
                                Send
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
