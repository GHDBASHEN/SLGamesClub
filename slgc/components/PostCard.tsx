// components/PostCard.tsx
import { useSession } from "next-auth/react";
import { deletePost } from "@/lib/actions";

export default function PostCard({ post }: { post: any }) {
    const { data: session } = useSession();
    const userRole = session?.user?.role; // 'admin', 'moderator', etc.

    // Moderators and Admins can delete ANY post. 
    // Regular users can only delete their OWN posts.
    const canDelete =
        userRole === 'admin' ||
        userRole === 'moderator' ||
        session?.user?.id === post.authorId;

    return (
        <div className="card">
            <p>{post.content}</p>
            {canDelete && <button onClick={() => deletePost(post._id)}>Delete Post</button>}

            {/* Editor Special Feature: Highlighted Post */}
            {post.authorRole === 'editor' && (
                <span className="badge">Featured Editor</span>
            )}
        </div>
    );
}