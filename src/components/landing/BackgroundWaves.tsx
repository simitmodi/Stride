"use client";

import { motion } from "framer-motion";

export function BackgroundWaves() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] opacity-40 dark:opacity-20">
            <svg
                className="absolute w-full h-full"
                viewBox="0 0 1440 800"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                        <stop offset="50%" stopColor="rgba(99, 102, 241, 0.45)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                    </linearGradient>
                    <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
                        <stop offset="50%" stopColor="rgba(168, 85, 247, 0.35)" />
                        <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                    </linearGradient>
                </defs>

                {/* Wave 1 - Main Primary */}
                <motion.path
                    d="M-200 600 Q 300 400 720 500 T 1640 400"
                    stroke="url(#wave-gradient-1)"
                    strokeWidth="4"
                    fill="transparent"
                />

                {/* Wave 2 - Purple Accent */}
                <motion.path
                    d="M-200 400 Q 400 600 720 400 T 1640 600"
                    stroke="url(#wave-gradient-2)"
                    strokeWidth="3"
                    fill="transparent"
                />

                {/* Wave 3 - High Subtle */}
                <motion.path
                    d="M-200 200 Q 500 100 720 300 T 1640 100"
                    stroke="url(#wave-gradient-1)"
                    strokeWidth="2.5"
                    opacity="0.8"
                    fill="transparent"
                />

                {/* Wave 4 - Deep Low */}
                <motion.path
                    d="M-200 750 Q 400 650 720 700 T 1640 650"
                    stroke="url(#wave-gradient-1)"
                    strokeWidth="5"
                    opacity="0.6"
                    fill="transparent"
                />
            </svg>
        </div>
    );
}

// Stride: Professional Financial Connectivity
