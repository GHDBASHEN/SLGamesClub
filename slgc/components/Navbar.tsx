'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide Navbar on login/register pages
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl shadow-2xl shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
              🎮
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              SL Games Club
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/" active={pathname === '/'}>Home</NavLink>
            <NavLink href="/feed" active={pathname === '/feed'}>Feed</NavLink>
            {session && <NavLink href="/create" active={pathname === '/create'}>Post</NavLink>}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-800">
                <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition">
                   <img 
                     src={session.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Gamer"} 
                     className="w-9 h-9 rounded-full bg-gray-800" 
                     alt="Profile"
                   />
                   <div className="text-sm">
                     <p className="font-bold leading-none">{session.user?.name}</p>
                     <p className="text-xs text-indigo-400">Online</p>
                   </div>
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white transition">
                  Log In
                </Link>
                <Link href="/register" className="px-6 py-2.5 text-sm font-bold bg-indigo-600 rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 transform hover:-translate-y-0.5">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 p-2">
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="md:hidden bg-gray-900 border-t border-gray-800 p-4 space-y-4 shadow-xl"
        >
          <MobileLink href="/">Home</MobileLink>
          <MobileLink href="/feed">Feed</MobileLink>
          {session ? (
            <>
              <MobileLink href="/profile">Profile</MobileLink>
              <MobileLink href="/create">Create Post</MobileLink>
              <button onClick={() => signOut()} className="block w-full text-left text-red-400 font-bold py-2">Logout</button>
            </>
          ) : (
            <>
              <MobileLink href="/login">Log In</MobileLink>
              <MobileLink href="/register">Register</MobileLink>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
}

function NavLink({ href, active, children }: any) {
  return (
    <Link href={href} className={`text-sm font-bold transition-colors ${active ? "text-white" : "text-gray-400 hover:text-white"}`}>
      {children}
    </Link>
  );
}

function MobileLink({ href, children }: any) {
  return <Link href={href} className="block text-base font-bold text-gray-300 hover:text-white py-2">{children}</Link>;
}