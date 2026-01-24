'use client';

import { useState } from "react";
import { toggleLikePost, addComment, deleteComment, editComment } from "@/lib/actions";
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaEdit } from "react-icons/fa";

interface CommentType {
    _id: string;
    content: string;
    author: { _id?: string; name: string; image: string };
    createdAt: string;
}

interface Props {
    postId: string;
    initialLikes: string[];
    currentUser?: { _id: string; name: string; image: string; role: string } | null;
    initialComments: CommentType[];
}

export default function PostInteractions({ postId, initialLikes, currentUser, initialComments }: Props) {
    const [likes, setLikes] = useState(initialLikes);
    const [comments, setComments] = useState(initialComments);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isLiked, setIsLiked] = useState(currentUser ? initialLikes.includes(currentUser._id) : false);

    // Editing state for comments: map commentId -> boolean or content
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentContent, setEditCommentContent] = useState("");

    const handleLike = async () => {
        if (!currentUser) return; // Prevent action if not logged in

        // Optimistic update
        if (isLiked) {
            setLikes(prev => prev.filter(id => id !== currentUser._id));
        } else {
            setLikes(prev => [...prev, currentUser._id]);
        }
        setIsLiked(!isLiked);

        await toggleLikePost(postId);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        // Optimistic UI Update
        const optimisticComment: CommentType = {
            _id: Math.random().toString(), // Temp ID
            content: newComment,
            author: {
                _id: currentUser._id, // Include _id for optimistic comment
                name: currentUser.name,
                image: currentUser.image
            },
            createdAt: new Date().toISOString()
        };

        setComments(prev => [...prev, optimisticComment]);

        await addComment(postId, newComment);
        setNewComment("");
    };

    const handleDeleteComment = async (commentId: string) => {
        if (confirm("Delete this comment?")) {
            setComments(prev => prev.filter(c => c._id !== commentId));
            await deleteComment(commentId);
        }
    };

    const startEditComment = (comment: CommentType) => {
        setEditingCommentId(comment._id);
        setEditCommentContent(comment.content);
    };

    const saveEditComment = async (commentId: string) => {
        setComments(prev => prev.map(c => c._id === commentId ? { ...c, content: editCommentContent } : c));
        setEditingCommentId(null);
        await editComment(commentId, editCommentContent);
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
                            comments.map((comment) => {
                                // Determine if current user can modify this comment
                                // We need to check if we have the author ID in the comment author object
                                // NOTE: The comment author object from populate might be an object or ID.
                                // In the optimistic update it is an object.
                                // In the fetch from DB (actions.ts -> page.tsx) it is populated with name/image but _id is usually available on the top level if populated correctly or we need to check how mongoose populates.
                                // Mongoose populate replaces the field. So `author._id` should be the ID.
                                // But in page.tsx we lean() and then map to clean objects. `author` is just name/image there?
                                // Let's check page.tsx: `.populate('author', 'name image')`. The _id is still there by default unless supressed?
                                // Actually, `_id` IS NOT included in 'name image' unless explicitly requested IF we use select string?
                                // Wait, `populate('author', 'name image')` means select ONLY name and image. _id is usually included by default in find, but for populated docs?
                                // It IS included by default for the SUB-DOCUMENT unless suppressed like `-_id`.
                                // Let's assume `comment.author._id` is available.
                                // Wait, simple populate does include _id.

                                // However, my previous code in page.tsx might have stripped it or not typed it.
                                // Let's look at `PostCard` logic again or `page.tsx` fetch.
                                // `posts` fetch: `.populate('author', 'name image')`.
                                // `comments` fetch: `.populate('author', 'name image')`.

                                // If I can't access `comment.author._id` easily here due to type mismatch or missing data, I might need to update page.tsx fetch.
                                // BUT, `comment` object in `comments` array has `author` which is `{ _id, name, image }`.

                                const canDelete = currentUser && (currentUser.role === 'admin' || (comment.author && comment.author._id === currentUser._id));
                                const canEdit = currentUser && (comment.author && comment.author._id === currentUser._id);

                                return (
                                    <div key={comment._id} className="bg-gray-800/50 p-3 rounded-xl text-sm border border-gray-700/50 group relative">
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={comment.author?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                                                className="w-8 h-8 rounded-full bg-gray-700 object-cover mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-indigo-300">{comment.author?.name || "User"}</span>
                                                        <span className="text-gray-600 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                    </div>

                                                    {/* Comment Actions */}
                                                    {(canDelete || canEdit) && (
                                                        <div className="flex gap-2">
                                                            {canEdit && (
                                                                <button
                                                                    onClick={() => startEditComment(comment)}
                                                                    className="text-gray-500 hover:text-indigo-400"
                                                                >
                                                                    <FaEdit size={10} />
                                                                </button>
                                                            )}
                                                            {canDelete && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment._id)}
                                                                    className="text-gray-500 hover:text-red-400"
                                                                >
                                                                    <FaTrash size={10} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {editingCommentId === comment._id ? (
                                                    <div className="mt-1">
                                                        <input
                                                            value={editCommentContent}
                                                            onChange={(e) => setEditCommentContent(e.target.value)}
                                                            className="w-full bg-gray-900 border border-gray-700 rounded p-1 text-white text-xs"
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2 mt-1 text-xs">
                                                            <button onClick={() => setEditingCommentId(null)} className="text-gray-400">Cancel</button>
                                                            <button onClick={() => saveEditComment(comment._id)} className="text-indigo-400">Save</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-300 mt-0.5 break-words">{comment.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-sm italic">No comments yet.</p>
                        )}
                    </div>

                    {/* Add Comment */}
                    {currentUser && (
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
