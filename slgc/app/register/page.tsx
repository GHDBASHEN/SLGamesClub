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
    <div className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden">
      {/* Background Blobs - matching Login page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 glass-card rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2 gaming-text-gradient font-gaming tracking-wide">
            Create Profile
          </h1>
          <p className="text-muted-foreground">Join the ultimate SL gaming community.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center animate-pulse font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username Input */}
          <div className="relative group">
            <FaUser className="absolute left-4 top-4 text-muted-foreground transition-colors z-10" />
            <input
              type="text"
              placeholder="Username / Gamertag"
              required
              className="w-full bg-black/50 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 outline-none"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email Input */}
          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-4 text-muted-foreground transition-colors z-10" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full bg-black/50 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 outline-none"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <FaLock className="absolute left-4 top-4 text-muted-foreground transition-colors z-10" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-black/50 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 outline-none"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : <>Start Your Journey <FaRocket /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-muted-foreground text-sm">
          Already have an account? <Link href="/login" className="text-accent font-bold hover:text-accent-foreground hover:underline transition-colors">Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
}