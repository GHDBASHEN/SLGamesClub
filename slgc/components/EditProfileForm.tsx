'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/actions'; // We defined this in the previous step
import { CldUploadWidget } from 'next-cloudinary';

interface Props {
  currentBio: string;
  currentGames: string[];
  currentImage?: string;
  email: string;
}

export default function EditProfileForm({ currentBio, currentGames, currentImage, email }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImage || "");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition"
      >
        Edit Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 w-full max-w-md p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            {/* The Server Action is bound to this form */}
            <form action={async (formData) => {
              await updateProfile(email, formData.get('bio') as string, formData.get('games') as string, imageUrl);
              setIsOpen(false);
            }}>

              <div className="mb-6 text-center">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET }
                  onSuccess={(result: any) => {
                    setImageUrl(result.info.secure_url);
                  }}
                >
                  {({ open }) => {
                    return (
                      <div className="flex flex-col items-center gap-4">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => open()}
                          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                        >
                          {imageUrl ? 'Change Picture' : 'Upload Profile Picture'}
                        </button>
                      </div>
                    );
                  }}
                </CldUploadWidget>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Bio</label>
                <textarea
                  name="bio"
                  defaultValue={currentBio}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-indigo-500"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Games (comma separated)</label>
                <input
                  name="games"
                  defaultValue={currentGames?.join(", ")}
                  placeholder="E.g. Valorant, Apex Legends, Minecraft"
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}