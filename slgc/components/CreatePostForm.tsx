'use client';
import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { createPost } from '@/lib/actions';

export default function CreatePostForm() {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div className="bg-gray-900 p-6 rounded-3xl mb-8 shadow-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">Share your gaming moments</h2>

            <form action={async (formData) => {
                setLoading(true);
                await createPost(formData, imageUrl);
                setLoading(false);
                setImageUrl("");
            }} className="space-y-4">

                <textarea
                    name="content"
                    placeholder="What are you playing today?"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 min-h-[100px]"
                    required
                />

                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <input
                        name="gameTag"
                        placeholder="Game Tag (e.g. Valorant)"
                        className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500 w-full md:w-auto"
                        required
                    />

                    <div className="flex items-center gap-4">
                        {imageUrl && (
                            <div className="relative">
                                <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-indigo-500" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl("")}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "profile-pics-slgameclub"}
                            onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
                        >
                            {({ open }) => (
                                <button type="button" onClick={() => open()} className="text-indigo-400 text-sm font-bold hover:text-indigo-300">
                                    📷 Add Image
                                </button>
                            )}
                        </CldUploadWidget>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold transition disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
