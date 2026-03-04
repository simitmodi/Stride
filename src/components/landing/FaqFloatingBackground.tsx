"use client";

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { HelpCircle, MessageCircle, FileQuestion, FileText, Shield, Sparkles, LucideIcon } from "lucide-react";

interface FloatingIconProps {
    Icon: LucideIcon;
    size: number;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    delay: number;
    parallax: number;
    index: number;
    dx: MotionValue<number>;
    dy: MotionValue<number>;
}

function FloatingIcon({ Icon, size, top, left, right, bottom, delay, parallax, index, dx, dy }: FloatingIconProps) {
    const xParallax = useTransform(dx, [-500, 500], [-100 * parallax, 100 * parallax]);
    const yParallax = useTransform(dy, [-500, 500], [-100 * parallax, 100 * parallax]);

    return (
        <motion.div
            style={{
                position: "absolute",
                top,
                left,
                right,
                bottom,
                x: xParallax,
                y: yParallax,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: 0.2,
                scale: 1,
                y: [0, -25, 0],
                rotate: [0, 10, -10, 0],
            }}
            transition={{
                opacity: { duration: 1 },
                scale: { duration: 1 },
                y: { duration: 6 + index, repeat: Infinity, ease: "easeInOut", delay },
                rotate: { duration: 10 + index, repeat: Infinity, ease: "easeInOut" },
            }}
        >
            <Icon size={size} className="text-primary/60 dark:text-primary/80 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]" strokeWidth={1.2} />
        </motion.div>
    );
}

const FAQ_FLOATING_ICONS = [
    { Icon: HelpCircle, size: 44, top: "12%", left: "7%", delay: 0, parallax: 0.12 },
    { Icon: MessageCircle, size: 36, top: "18%", right: "10%", delay: 1.2, parallax: -0.18 },
    { Icon: FileQuestion, size: 52, bottom: "22%", left: "15%", delay: 2.4, parallax: 0.22 },
    { Icon: FileText, size: 40, bottom: "18%", right: "18%", delay: 0.6, parallax: -0.12 },
    { Icon: Shield, size: 32, top: "48%", left: "6%", delay: 1.8, parallax: 0.28 },
    { Icon: Sparkles, size: 28, bottom: "45%", right: "8%", delay: 3, parallax: -0.25 },
];

export function FaqFloatingBackground() {
    const [mounted, setMounted] = useState(false);

    // Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 50, stiffness: 200 };
    const dx = useSpring(mouseX, springConfig);
    const dy = useSpring(mouseY, springConfig);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Primary Ethereal Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12)_0%,rgba(168,85,247,0.08)_40%,transparent_80%)] opacity-80" />

            {/* Ambient Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 60, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px]"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -40, 0],
                    y: [0, 60, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[70%] h-[70%] bg-purple-500/10 rounded-full blur-[160px]"
            />

            {/* Subtle Bokeh Particles */}
            {mounted && [...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.1, 0.4, 0.1],
                        scale: [0.8, 1.2, 0.8],
                        y: [0, -20, 0]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                    className="absolute w-1.5 h-1.5 bg-primary/40 rounded-full blur-[1px]"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                />
            ))}

            {/* Floating Query Icons */}
            {mounted && FAQ_FLOATING_ICONS.map((item, idx) => (
                <FloatingIcon
                    key={idx}
                    {...item}
                    index={idx}
                    dx={dx}
                    dy={dy}
                />
            ))}
        </div>
    );
}
