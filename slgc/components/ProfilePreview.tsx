"use client";

import { motion } from 'framer-motion';
import { FaTwitch, FaYoutube, FaDiscord, FaGamepad, FaTrophy, FaCamera } from 'react-icons/fa';

const mockProfile = {
    name: "NightHawk_SL",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NightHawk",
    status: "Currently Playing Valorant",
    level: 42,
    games: ["Valorant", "Apex Legends", "Minecraft"],
    stats: {
        screenshots: 234,
        achievements: 89,
        followers: 1.2,
    },
    achievements: [
        { name: "Diamond Rank", game: "Valorant", icon: "💎" },
        { name: "Predator", game: "Apex Legends", icon: "🏆" },
        { name: "Speedrunner", game: "Minecraft", icon: "⚡" },
    ]
};

export default function ProfilePreview() {
    return (
        <section className="relative py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                            Your Gaming Identity
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black mt-4 mb-6 font-gaming">
                            Build Your <span className="gaming-text-gradient">Ultimate Profile</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Showcase your gaming journey with a profile that speaks for itself.
                            Track games, display achievements, share screenshots, and connect all your social platforms in one place.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: FaGamepad, text: "Track your entire game library" },
                                { icon: FaTrophy, text: "Pin your proudest achievements" },
                                { icon: FaCamera, text: "Create stunning screenshot galleries" },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <item.icon />
                                    </div>
                                    <span className="text-foreground font-medium">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Profile Card Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20" />

                        {/* Card */}
                        <div className="relative glass-card rounded-3xl p-8 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-start gap-5 mb-6">
                                <div className="relative">
                                    <img
                                        src={mockProfile.avatar}
                                        alt={mockProfile.name}
                                        className="w-20 h-20 rounded-2xl bg-muted"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-online rounded-full border-4 border-card" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold">{mockProfile.name}</h3>
                                    <p className="text-primary text-sm font-medium">{mockProfile.status}</p>
                                    <div className="flex gap-3 mt-3">
                                        <FaTwitch className="text-muted-foreground hover:text-[#9146FF] cursor-pointer transition-colors" />
                                        <FaYoutube className="text-muted-foreground hover:text-[#FF0000] cursor-pointer transition-colors" />
                                        <FaDiscord className="text-muted-foreground hover:text-[#5865F2] cursor-pointer transition-colors" />
                                    </div>
                                </div>
                                <div className="bg-gradient-primary px-4 py-2 rounded-full">
                                    <span className="text-sm font-bold text-primary-foreground">LVL {mockProfile.level}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {[
                                    { label: 'Screenshots', value: mockProfile.stats.screenshots },
                                    { label: 'Achievements', value: mockProfile.stats.achievements },
                                    { label: 'Followers', value: `${mockProfile.stats.followers}K` },
                                ].map((stat, index) => (
                                    <div key={index} className="text-center p-3 rounded-xl bg-muted/50">
                                        <div className="text-xl font-bold text-foreground">{stat.value}</div>
                                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Games */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Currently Playing</h4>
                                <div className="flex flex-wrap gap-2">
                                    {mockProfile.games.map((game, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium"
                                        >
                                            {game}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Achievements */}
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Top Achievements</h4>
                                <div className="space-y-2">
                                    {mockProfile.achievements.map((achievement, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                        >
                                            <span className="text-2xl">{achievement.icon}</span>
                                            <div>
                                                <div className="font-semibold text-sm">{achievement.name}</div>
                                                <div className="text-xs text-muted-foreground">{achievement.game}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}