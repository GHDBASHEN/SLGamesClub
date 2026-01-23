"use client";

import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

interface FeatureCardProps {
    icon: IconType;
    title: string;
    description: string;
    delay?: number;
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-2xl group cursor-pointer"
        >
            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Icon className="text-2xl text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:gaming-text-gradient transition-all duration-300">
                {title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}