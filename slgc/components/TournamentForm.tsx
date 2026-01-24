'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { createTournament } from '@/lib/tournamentActions';
import { FaImage } from 'react-icons/fa';

export default function TournamentForm() {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <form
            action={async (formData) => {
                setLoading(true);
                await createTournament(formData, imageUrl);
                setLoading(false);
            }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-bold ml-1">Tournament Title</label>
                    <input name="title" required placeholder="e.g. SLGC Valorant Cup" className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500" />
                </div>

                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-bold ml-1">Game</label>
                    <input name="game" required placeholder="e.g. Valorant" className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold ml-1">Description</label>
                <textarea name="description" required rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-bold ml-1">Date</label>
                    <input type="datetime-local" name="date" required className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-bold ml-1">Prize Pool</label>
                    <input name="prizePool" defaultValue="TBD" className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-bold ml-1">Max Teams</label>
                    <input type="number" name="maxTeams" defaultValue={16} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold ml-1">Rules</label>
                <textarea name="rules" rows={4} placeholder="Tournament rules..." className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500" />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold ml-1">Cover Image</label>
                <div className="bg-gray-800 border border-gray-700 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4">
                    {imageUrl ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button onClick={() => setImageUrl("")} type="button" className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center">×</button>
                        </div>
                    ) : (
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "profile-pics-slgameclub"}
                            onSuccess={(result: any) => {
                                setImageUrl(result.info.secure_url);
                                document.body.style.overflow = "auto";
                            }}
                            onClose={() => {
                                document.body.style.overflow = "auto";
                            }}
                        >
                            {({ open }) => (
                                <button type="button" onClick={() => open()} className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition">
                                    <FaImage size={32} />
                                    <span>Click to upload cover image</span>
                                </button>
                            )}
                        </CldUploadWidget>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition disabled:opacity-50"
            >
                {loading ? 'Creating Tournament...' : 'Create Tournament'}
            </button>
        </form>
    );
}
