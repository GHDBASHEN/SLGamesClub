'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    
    if (res?.error) {
      alert("Login Failed: " + res.error);
      setLoading(false);
    } else {
      router.push("/feed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-10 bg-gray-900 rounded-3xl shadow-2xl shadow-black/80"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Login to continue your streak.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-4 text-gray-500" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl focus:bg-gray-700 transition-colors placeholder-gray-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-4 text-gray-500" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl focus:bg-gray-700 transition-colors placeholder-gray-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {loading ? "Loading..." : <>Login <FaArrowRight /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          No account? <Link href="/register" className="text-indigo-400 font-bold hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}