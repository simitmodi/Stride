"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import {
    Mail,
    Phone,
    MessageSquare,
    Headset,
    Send,
    MapPin,
    Clock,
    ShieldCheck
} from "lucide-react";

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
                    y: [0, -25, 0],
                    rotate: [-15, 15, -15],
                }}
                transition={{
                    duration: 6 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3,
                }}
            >
                <Icon size={size} className="text-primary/60 dark:text-primary/80 drop-shadow-[0_0_25px_rgba(99,102,241,0.35)]" strokeWidth={1.2} />
            </motion.div>
        </motion.div>
    );
}

const CONTACT_FLOATING_ICONS = [
    { Icon: Mail, size: 52, top: "10%", left: "12%", delay: 0.1, parallax: 0.9 },
    { Icon: Phone, size: 44, top: "20%", right: "18%", delay: 0.3, parallax: 0.7 },
    { Icon: MessageSquare, size: 60, bottom: "15%", left: "10%", delay: 0.5, parallax: 1.1 },
    { Icon: Headset, size: 48, bottom: "25%", right: "12%", delay: 0.7, parallax: 0.8 },
    { Icon: Send, size: 40, top: "50%", left: "5%", delay: 0.9, parallax: 1.2 },
    { Icon: MapPin, size: 56, top: "65%", right: "5%", delay: 1.1, parallax: 1.0 },
];

export function ContactFloatingBackground() {
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,rgba(168,85,247,0.1)_40%,transparent_80%)] opacity-80" />

            {/* Ambient Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.35, 0.55, 0.35],
                    x: [0, 80, 0],
                    y: [0, -40, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[65%] h-[65%] bg-indigo-500/12 rounded-full blur-[150px]"
            />
            <motion.div
                animate={{
                    scale: [1.3, 1, 1.3],
                    opacity: [0.25, 0.45, 0.25],
                    x: [0, -60, 0],
                    y: [0, 80, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[75%] h-[75%] bg-purple-500/12 rounded-full blur-[170px]"
            />

            {/* Subtle Bokeh Particles */}
            {mounted && [...Array(60)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.15, 0.45, 0.15],
                        scale: [0.7, 1.3, 0.7],
                        y: [0, -30, 0]
                    }}
                    transition={{
                        duration: 4 + Math.random() * 6,
                        repeat: Infinity,
                        delay: Math.random() * 6,
                    }}
                    className="absolute w-2 h-2 bg-primary/45 rounded-full blur-[1.5px]"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                />
            ))}

            {/* Floating Contact Icons */}
            {mounted && CONTACT_FLOATING_ICONS.map((item, idx) => (
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
