"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaRocket } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export default function CTASection() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Ready to Join?
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mt-4 mb-6 font-gaming">
                        Start Your <span className="gaming-text-gradient">Gaming Journey</span> Today
                    </h2>
                    <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of Sri Lankan gamers who are already leveling up their profiles,
                        sharing epic moments, and finding their squads.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button variant="hero" size="xl" asChild>
                            <Link href="/register" className="flex items-center gap-3">
                                <FaRocket />
                                Create Your Free Profile
                            </Link>
                        </Button>
                        <p className="text-sm text-muted-foreground mt-4">
                            Free forever. No credit card required.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}