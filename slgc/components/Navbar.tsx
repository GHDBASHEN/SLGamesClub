'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaGamepad, FaHome, FaTrophy, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: 'Feed', href: '/feed', icon: FaGamepad },
    { name: 'Tournaments', href: '/tournaments', icon: FaTrophy },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-primary/10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <span className="font-gaming font-bold text-white text-xl">SL</span>
            </div>
            <span className="font-gaming font-bold text-lg hidden sm:block tracking-wider group-hover:text-primary transition-colors">
              GAMES CLUB
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-white bg-white/10 shadow-inner"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("text-lg", isActive && "text-primary")} />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-xl bg-white/5 border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/profile">
                  <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-white">{session.user?.name || 'Gamer'}</div>
                      <div className="text-xs text-primary">Level 1</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-muted border border-white/10 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <FaUser className="text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                  title="Sign Out"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="hidden sm:flex px-5 py-2.5 rounded-xl text-sm font-bold text-white/80 hover:text-white hover:bg-white/5 transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2"
                >
                  <span>Join Club</span>
                  <FaSignInAlt />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}