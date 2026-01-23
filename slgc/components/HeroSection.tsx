"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaPlay } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
    return (
        <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-4 pt-20">

            {/* Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-4xl mx-auto"
            >
                <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-5 py-2 rounded-full bg-muted/50 text-primary text-sm font-bold mb-8 inline-flex items-center gap-2 backdrop-blur-md border border-primary/20"
                >
                    <span className="w-2 h-2 rounded-full bg-online animate-pulse" />
                    The #1 Community for SL Gamers
                </motion.span>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.1] font-gaming">
                    LEVEL UP <br />
                    <span className="gaming-text-gradient">YOUR LEGACY</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    Share your best clips, find your squad, and build your ultimate gaming profile.
                    Join thousands of players across Sri Lanka.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="hero" size="xl" asChild>
                        <Link href="/register" className="flex items-center gap-2">
                            Join the Club
                            <FaArrowRight />
                        </Link>
                    </Button>
                    <Button variant="heroOutline" size="xl" asChild>
                        <Link href="/feed" className="flex items-center gap-2">
                            <FaPlay className="text-sm" />
                            Explore Feed
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
                    {[
                        { value: '10K+', label: 'Active Gamers' },
                        { value: '50K+', label: 'Screenshots Shared' },
                        { value: '100+', label: 'Games Tracked' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-black gaming-text-gradient font-gaming">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}