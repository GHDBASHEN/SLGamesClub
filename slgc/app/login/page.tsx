'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(res.error);
        } else {
            router.push("/profile");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 w-96">
                <h1 className="text-2xl font-bold text-white mb-6">Login</h1>

                {error && <div className="bg-red-500/20 text-red-400 p-2 text-sm rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Email or Username"
                        className="w-full p-2 bg-gray-800 rounded text-white"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 bg-gray-800 rounded text-white"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-full bg-indigo-600 p-2 rounded text-white hover:bg-indigo-500">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}