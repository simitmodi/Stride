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
                        <stop offset="50%" stopColor="rgba(99, 102, 241, 0.15)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                    </linearGradient>
                    <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
                        <stop offset="50%" stopColor="rgba(168, 85, 247, 0.1)" />
                        <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                    </linearGradient>
                </defs>

                {/* Wave 1 */}
                <motion.path
                    d="M-200 600 Q 300 400 720 500 T 1640 400"
                    stroke="url(#wave-gradient-1)"
                    strokeWidth="2"
                    fill="transparent"
                    animate={{
                        d: [
                            "M-200 600 Q 300 400 720 500 T 1640 400",
                            "M-200 550 Q 400 600 720 450 T 1640 550",
                            "M-200 600 Q 300 400 720 500 T 1640 400",
                        ],
                        x: [-50, 50, -50],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Wave 2 */}
                <motion.path
                    d="M-200 400 Q 400 600 720 400 T 1640 600"
                    stroke="url(#wave-gradient-2)"
                    strokeWidth="1.5"
                    fill="transparent"
                    animate={{
                        d: [
                            "M-200 400 Q 400 600 720 400 T 1640 600",
                            "M-200 450 Q 300 300 720 550 T 1640 350",
                            "M-200 400 Q 400 600 720 400 T 1640 600",
                        ],
                        x: [50, -50, 50],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Wave 3 - Faster Drifting */}
                <motion.path
                    d="M-200 300 Q 500 200 720 450 T 1640 200"
                    stroke="url(#wave-gradient-1)"
                    strokeWidth="1"
                    opacity="0.5"
                    fill="transparent"
                    animate={{
                        d: [
                            "M-200 300 Q 500 200 720 450 T 1640 200",
                            "M-200 350 Q 600 500 720 300 T 1640 450",
                            "M-200 300 Q 500 200 720 450 T 1640 200",
                        ],
                        x: [-100, 100, -100],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </svg>
        </div>
    );
}
