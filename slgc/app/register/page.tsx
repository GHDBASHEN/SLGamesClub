'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Registration successful! Check your Gmail for the verification link.");
            setForm({ name: "", email: "", password: "" }); // Reset
        } else {
            setError(data.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 w-96">
                <h1 className="text-2xl font-bold text-white mb-6">Join GameHub</h1>

                {error && <div className="bg-red-500/20 text-red-400 p-2 text-sm rounded mb-4">{error}</div>}
                {message && <div className="bg-green-500/20 text-green-400 p-2 text-sm rounded mb-4">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-2 bg-gray-800 rounded text-white"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 bg-gray-800 rounded text-white"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 bg-gray-800 rounded text-white"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button className="w-full bg-indigo-600 p-2 rounded text-white hover:bg-indigo-500">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
