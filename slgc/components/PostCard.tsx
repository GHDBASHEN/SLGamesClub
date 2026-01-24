'use client';

import { useState } from 'react';
import { deletePost, editPost } from '@/lib/actions';
import PostInteractions from './PostInteractions';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface PostType {
    _id: string;
    content: string;
    imageUrl?: string;
    gameTag?: string;
    createdAt: string;
    author: {
        _id: string;
        name: string;
        image: string;
    };
    likes: string[];
}

interface Props {
    post: PostType;
    currentUser?: { _id: string; name: string; image: string; role: string } | null;
    comments: any[];
}

export default function PostCard({ post, currentUser, comments }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);

    // Convert likes to strings safely
    const likeIds = post.likes ? post.likes.map((id: any) => id.toString()) : [];

    const isAuthor = currentUser?._id === post.author._id.toString();
    const isAdmin = currentUser?.role === 'admin';
    const canModify = isAuthor || isAdmin;
    const canEdit = isAuthor; // Only author should edit content usually, admin deletes.

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this post?")) {
            await deletePost(post._id);
        }
    };

    const handleEdit = async () => {
        await editPost(post._id, editContent);
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-900 p-6 mb-6 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-800 relative group">

            {/* Moderation Controls */}
            {canModify && (
                <div className="absolute top-6 right-6 flex gap-3">
                    {canEdit && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-gray-400 hover:text-indigo-400 bg-gray-800 p-2 rounded-full"
                            title="Edit Post"
                        >
                            <FaEdit size={14} />
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-red-500 bg-gray-800 p-2 rounded-full"
                        title="Delete Post"
                    >
                        <FaTrash size={14} />
                    </button>
                </div>
            )}

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

            {isEditing ? (
                <div className="mb-4">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs text-gray-400">Cancel</button>
                        <button onClick={handleEdit} className="px-3 py-1 bg-indigo-600 rounded text-xs text-white">Save</button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-200 mb-4 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
            )}

            {post.imageUrl && (
                <div className="overflow-hidden rounded-2xl bg-black mb-4">
                    <img src={post.imageUrl} alt="Post Content" className="w-full h-auto object-cover hover:scale-[1.01] transition duration-500" />
                </div>
            )}

            {/* Interactions */}
            <PostInteractions
                postId={post._id}
                initialLikes={likeIds}
                currentUser={currentUser}
                initialComments={comments}
            />
        </div>
    );
}