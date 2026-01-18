'use client';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="flex justify-between p-4 bg-gray-900 text-white">
            <h1 className="text-xl font-bold">GameHub</h1>
            <div className="space-x-4">
                <Link href="/">Feed</Link>
                {session ? (
                    <>
                        <Link href="/create">Post</Link>
                        <Link href="/profile">Profile</Link>
                        <button onClick={() => signOut()} className="text-red-400">Logout</button>
                    </>
                ) : (
                    <button onClick={() => signIn('google')} className="bg-blue-600 px-4 rounded">Login</button>
                )}
            </div>
        </nav>
    );
}