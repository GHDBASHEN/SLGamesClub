'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaGamepad, FaUsers, FaTrophy } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
        
        {/* Background Glow (No Borders) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <span className="px-4 py-1.5 rounded-full bg-white/5 text-indigo-300 text-sm font-bold mb-8 inline-block backdrop-blur-md">
            🚀 The #1 Community for SL Gamers
          </span>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-6 leading-tight">
            LEVEL UP <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              YOUR LEGACY
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Share your best clips, find your squad, and build your ultimate gaming profile. 
            Join thousands of players in Sri Lanka.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-105">
              Join the Club <FaArrowRight />
            </Link>
            <Link href="/feed" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-lg backdrop-blur-md transition hover:scale-105">
              Explore Feed
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid (Borderless Cards) */}
      <section className="py-24 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FaGamepad />} 
            title="Game Library" 
            desc="Showcase what you're playing. From Valorant to GTA V, track your journey."
          />
          <FeatureCard 
            icon={<FaUsers />} 
            title="Squad Finder" 
            desc="Never play alone. Find teammates who match your rank and style."
          />
          <FeatureCard 
            icon={<FaTrophy />} 
            title="Leaderboards" 
            desc="Compete with the best players in SL and earn your verified badge."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 rounded-3xl bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:-translate-y-2 shadow-2xl">
      <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}