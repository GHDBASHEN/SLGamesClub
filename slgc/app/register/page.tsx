'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaRocket } from 'react-icons/fa';

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
      
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[128px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
            Create Profile
          </h1>
          <p className="text-gray-400">Join the ultimate SL gaming community.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div className="relative group">
            <FaUser className="absolute left-4 top-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors z-10" />
            <input 
              type="text" 
              placeholder="Username / Gamertag" 
              required
              className="w-full bg-black/40 border border-gray-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500 backdrop-blur-sm"
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>

          {/* Email Input */}
          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors z-10" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full bg-black/40 border border-gray-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500 backdrop-blur-sm"
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <FaLock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors z-10" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full bg-black/40 border border-gray-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500 backdrop-blur-sm"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : <>Start Your Journey <FaRocket /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Already have an account? <Link href="/login" className="text-pink-400 font-bold hover:text-pink-300 hover:underline">Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
}