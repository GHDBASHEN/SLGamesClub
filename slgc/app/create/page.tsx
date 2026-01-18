import { createPost } from "@/lib/actions";

export default function CreatePost() {
    return (
        <div className="p-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Share a Play</h1>
            <form action={createPost} className="flex flex-col gap-4">
                {/* Hidden inputs for user ID would go here in real auth flow */}
                <input name="gameTitle" placeholder="Game Name (e.g. PUBG)" className="p-2 border rounded text-black" />
                <textarea name="content" placeholder="How was the match?" className="p-2 border rounded text-black" />
                <input name="imageUrl" placeholder="Image URL (Upload to Cloudinary first)" className="p-2 border rounded text-black" />
                <button type="submit" className="bg-green-600 text-white p-2 rounded">Post</button>
            </form>
        </div>
    );
}