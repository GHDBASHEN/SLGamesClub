"use client";

import { motion } from 'framer-motion';
import { FaGamepad, FaUsers, FaTrophy, FaCamera, FaNewspaper, FaUserFriends } from 'react-icons/fa';
import FeatureCard from './FeatureCard';

const features = [
    {
        icon: FaGamepad,
        title: "Game Library",
        description: "Track your games in progress, completed titles, and wishlist. Show off your collection to the community."
    },
    {
        icon: FaTrophy,
        title: "Achievement Showcase",
        description: "Pin your rarest trophies and highest ranks. Let everyone know you're a true champion."
    },
    {
        icon: FaUsers,
        title: "Find Your Squad",
        description: "LFG tools to connect with players for any game. Never play alone again."
    },
    {
        icon: FaCamera,
        title: "Screenshot Gallery",
        description: "Share your best gaming moments. Create albums, tag games, and go viral in the community."
    },
    {
        icon: FaNewspaper,
        title: "Gaming Blog",
        description: "Write guides, reviews, and patch note reactions. Build your reputation as an expert."
    },
    {
        icon: FaUserFriends,
        title: "Social Integration",
        description: "Connect your Twitch, YouTube, and Discord. One profile to rule them all."
    },
];

export default function FeaturesSection() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-card/30" />

            <div className="relative max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Features
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black mt-4 mb-6 font-gaming">
                        Everything You Need to <span className="gaming-text-gradient">Dominate</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Built by gamers, for gamers. Every feature designed to level up your gaming experience.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}