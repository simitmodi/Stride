"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Code, Terminal, Cpu, Globe, Coffee, GitBranch } from "lucide-react";

interface FloatingIconProps {
    Icon: any;
    size: number;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    delay: number;
    parallax: number;
    index: number;
    dx: any;
    dy: any;
}

function FloatingIcon({ Icon, size, top, left, right, bottom, delay, parallax, index, dx, dy }: FloatingIconProps) {
    const xParallax = useTransform(dx, [-500, 500], [-100 * parallax, 100 * parallax]);
    const yParallax = useTransform(dy, [-500, 500], [-100 * parallax, 100 * parallax]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 1, ease: "easeOut" }}
            style={{
                position: "absolute",
                top,
                left,
                right,
                bottom,
                x: xParallax,
                y: yParallax,
            }}
            className="hidden md:block"
        >
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [-10, 10, -10],
                }}
                transition={{
                    duration: 5 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                }}
            >
                <Icon size={size} className="text-primary/60 dark:text-primary/80 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]" strokeWidth={1.2} />
            </motion.div>
        </motion.div>
    );
}

const DEV_FLOATING_ICONS = [
    { Icon: Code, size: 48, top: "15%", left: "10%", delay: 0.2, parallax: 0.8 },
    { Icon: Terminal, size: 40, top: "25%", right: "15%", delay: 0.4, parallax: 0.6 },
    { Icon: Cpu, size: 56, bottom: "20%", left: "15%", delay: 0.6, parallax: 1.2 },
    { Icon: Globe, size: 36, bottom: "30%", right: "20%", delay: 0.8, parallax: 0.5 },
    { Icon: Coffee, size: 44, top: "45%", left: "5%", delay: 1.0, parallax: 0.9 },
    { Icon: GitBranch, size: 52, top: "60%", right: "8%", delay: 1.2, parallax: 1.1 },
];

export function DevelopersFloatingBackground() {
    const [mounted, setMounted] = useState(false);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX - window.innerWidth / 2);
            setMouseY(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const dx = useSpring(mouseX, { stiffness: 50, damping: 30 });
    const dy = useSpring(mouseY, { stiffness: 50, damping: 30 });

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

            {/* Floating Dev Icons */}
            {mounted && DEV_FLOATING_ICONS.map((item, idx) => (
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
