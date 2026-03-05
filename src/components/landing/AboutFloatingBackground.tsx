"use client";

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { CreditCard, BarChart3, IndianRupee, Wallet, Shield, Sparkles, LucideIcon } from "lucide-react";

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
    const xParallax = useTransform(dx, [-500, 500], [-50 * parallax, 50 * parallax]);
    const yParallax = useTransform(dy, [-500, 500], [-50 * parallax, 50 * parallax]);

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
                opacity: 0.25,
                scale: 1,
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
            }}
            transition={{
                opacity: { duration: 1 },
                scale: { duration: 1 },
                y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut", delay },
                rotate: { duration: 8 + index, repeat: Infinity, ease: "easeInOut" },
            }}
        >
            <Icon size={size} className="text-primary/40 dark:text-primary/60 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" strokeWidth={1.5} />
        </motion.div>
    );
}

const FLOATING_ICONS = [
    { Icon: CreditCard, size: 40, top: "10%", left: "5%", delay: 0, parallax: 0.1 },
    { Icon: BarChart3, size: 32, top: "15%", right: "8%", delay: 1, parallax: -0.15 },
    { Icon: IndianRupee, size: 48, bottom: "20%", left: "12%", delay: 2, parallax: 0.2 },
    { Icon: Wallet, size: 36, bottom: "15%", right: "15%", delay: 0.5, parallax: -0.1 },
    { Icon: Shield, size: 28, top: "45%", left: "8%", delay: 1.5, parallax: 0.25 },
    { Icon: Sparkles, size: 24, bottom: "40%", right: "10%", delay: 2.5, parallax: -0.2 },
];

export function AboutFloatingBackground() {
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
            {/* Primary Ethereal Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,rgba(168,85,247,0.05)_30%,transparent_70%)] opacity-70" />

            {/* Dynamic Ambient Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -40, 0],
                    y: [0, 60, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-500/10 rounded-full blur-[150px]"
            />

            {/* Scattered Tiny Bokeh Stars */}
            {mounted && [...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.1, 0.4, 0.1],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                />
            ))}

            {/* Floating Banking Icons */}
            {mounted && FLOATING_ICONS.map((item, idx) => (
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
