"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const doodles = [
  // Top-left area
  { shape: "rupee", x: "6%", y: "6%", size: 38, color: "rgba(99,102,241,0.14)", rotate: -15, delay: 0 },
  { shape: "card", x: "12%", y: "38%", size: 50, color: "rgba(168,85,247,0.1)", rotate: 12, delay: 1 },
  { shape: "coin", x: "4%", y: "68%", size: 32, color: "rgba(99,102,241,0.12)", rotate: 0, delay: 2 },
  { shape: "shield", x: "18%", y: "15%", size: 28, color: "rgba(99,102,241,0.08)", rotate: -10, delay: 1.5 },

  // Top-right area
  { shape: "shield", x: "90%", y: "7%", size: 36, color: "rgba(168,85,247,0.12)", rotate: 0, delay: 0.5 },
  { shape: "chart", x: "88%", y: "42%", size: 42, color: "rgba(99,102,241,0.1)", rotate: 0, delay: 1.5 },
  { shape: "wallet", x: "85%", y: "72%", size: 38, color: "rgba(168,85,247,0.12)", rotate: -10, delay: 2.5 },
  { shape: "rupee", x: "78%", y: "12%", size: 30, color: "rgba(168,85,247,0.07)", rotate: 15, delay: 0.2 },

  // Middle scattered
  { shape: "calendar", x: "48%", y: "12%", size: 28, color: "rgba(99,102,241,0.07)", rotate: 5, delay: 0.8 },
  { shape: "piggy", x: "72%", y: "22%", size: 34, color: "rgba(168,85,247,0.09)", rotate: -8, delay: 3 },
  { shape: "rupee", x: "22%", y: "82%", size: 30, color: "rgba(99,102,241,0.1)", rotate: 15, delay: 1.2 },
  { shape: "coin", x: "62%", y: "88%", size: 28, color: "rgba(168,85,247,0.08)", rotate: 0, delay: 2.2 },
  { shape: "wallet", x: "35%", y: "5%", size: 32, color: "rgba(99,102,241,0.06)", rotate: -5, delay: 1.1 },
  { shape: "chart", x: "15%", y: "90%", size: 35, color: "rgba(168,85,247,0.06)", rotate: 10, delay: 3.2 },

  // Extra depth
  { shape: "card", x: "52%", y: "55%", size: 40, color: "rgba(99,102,241,0.05)", rotate: -20, delay: 0 },
  { shape: "shield", x: "32%", y: "58%", size: 24, color: "rgba(168,85,247,0.07)", rotate: 10, delay: 1.8 },
  { shape: "piggy", x: "65%", y: "45%", size: 30, color: "rgba(99,102,241,0.04)", rotate: -15, delay: 2.4 },
  { shape: "calendar", x: "8%", y: "25%", size: 26, color: "rgba(168,85,247,0.05)", rotate: 12, delay: 0.6 },
  { shape: "rupee", x: "94%", y: "85%", size: 34, color: "rgba(99,102,241,0.08)", rotate: -20, delay: 1.7 },
  { shape: "coin", x: "42%", y: "92%", size: 24, color: "rgba(168,85,247,0.06)", rotate: 5, delay: 2.9 },
];

export function FloatingDoodles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {doodles.map((d, i) => (
        <Doodle key={i} {...d} />
      ))}
    </div>
  );
}

function Doodle({
  shape, x, y, size, color, rotate, delay,
}: {
  shape: string; x: string; y: string; size: number; color: string;
  rotate: number; delay: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, perspective: 600 }}
      animate={{
        y: [-8, 8, -8],
        rotateZ: [rotate - 4, rotate + 4, rotate - 4],
      }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {shape === "rupee" && <RupeeShape size={size} color={color} />}
      {shape === "card" && <CardShape size={size} color={color} />}
      {shape === "coin" && <CoinShape size={size} color={color} />}
      {shape === "shield" && <ShieldShape size={size} color={color} />}
      {shape === "chart" && <ChartShape size={size} color={color} />}
      {shape === "wallet" && <WalletShape size={size} color={color} />}
      {shape === "calendar" && <CalendarShape size={size} color={color} />}
      {shape === "piggy" && <PiggyShape size={size} color={color} />}
    </motion.div>
  );
}

/* ───── Banking / Finance Shape Primitives ───── */

function RupeeShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* ₹ symbol */}
      <circle cx="50" cy="50" r="45" fill={color.replace(/[\d.]+\)$/, '0.15)')} stroke={color} strokeWidth="2.5" />
      <path
        d="M35 28H68M35 42H68M50 42L38 78M50 42C58 42 64 36 64 28M50 42C58 42 62 48 58 55H35"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardShape({ size, color }: { size: number; color: string }) {
  const w = size * 1.5;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 150 100" fill="none">
      <rect x="5" y="5" width="140" height="90" rx="12"
        fill={color.replace(/[\d.]+\)$/, '0.15)')} stroke={color} strokeWidth="2.5" />
      {/* Magnetic strip */}
      <rect x="5" y="25" width="140" height="14" fill={color.replace(/[\d.]+\)$/, '0.3)')} />
      {/* Chip */}
      <rect x="20" y="48" width="22" height="16" rx="3"
        fill={color.replace(/[\d.]+\)$/, '0.25)')} stroke={color} strokeWidth="1.5" />
      {/* Card number dots */}
      <g fill={color}>
        {[0, 1, 2, 3].map(g => (
          <g key={g}>
            {[0, 1, 2, 3].map(d => (
              <circle key={d} cx={20 + g * 30 + d * 6} cy="78" r="2" />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

function CoinShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Outer coin ring */}
      <circle cx="50" cy="50" r="44" fill={color.replace(/[\d.]+\)$/, '0.12)')} stroke={color} strokeWidth="3" />
      {/* Inner ring */}
      <circle cx="50" cy="50" r="34" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
      {/* ₹ in center */}
      <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="bold" fill={color}>₹</text>
    </svg>
  );
}

function ShieldShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" fill="none">
      <path
        d="M50 8L12 28V55C12 80 30 100 50 108C70 100 88 80 88 55V28L50 8Z"
        fill={color.replace(/[\d.]+\)$/, '0.15)')}
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Checkmark */}
      <path
        d="M36 56L46 66L66 44"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Background box */}
      <rect x="8" y="8" width="84" height="84" rx="10"
        fill={color.replace(/[\d.]+\)$/, '0.1)')} stroke={color} strokeWidth="2" />
      {/* Bars */}
      <rect x="22" y="55" width="10" height="25" rx="3" fill={color.replace(/[\d.]+\)$/, '0.4)')} stroke={color} strokeWidth="1.5" />
      <rect x="38" y="38" width="10" height="42" rx="3" fill={color.replace(/[\d.]+\)$/, '0.5)')} stroke={color} strokeWidth="1.5" />
      <rect x="54" y="48" width="10" height="32" rx="3" fill={color.replace(/[\d.]+\)$/, '0.35)')} stroke={color} strokeWidth="1.5" />
      <rect x="70" y="28" width="10" height="52" rx="3" fill={color.replace(/[\d.]+\)$/, '0.6)')} stroke={color} strokeWidth="1.5" />
      {/* Trend line */}
      <path d="M27 50L43 34L59 44L75 24" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalletShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size * 1.2} height={size} viewBox="0 0 120 100" fill="none">
      {/* Wallet body */}
      <rect x="8" y="20" width="95" height="65" rx="10"
        fill={color.replace(/[\d.]+\)$/, '0.15)')} stroke={color} strokeWidth="2.5" />
      {/* Flap */}
      <path d="M8 35C8 28 14 22 21 22H90C97 22 103 16 103 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Clasp */}
      <rect x="80" y="43" width="28" height="20" rx="8"
        fill={color.replace(/[\d.]+\)$/, '0.3)')} stroke={color} strokeWidth="2" />
      <circle cx="94" cy="53" r="4" fill={color} />
    </svg>
  );
}

function CalendarShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Calendar body */}
      <rect x="10" y="18" width="80" height="72" rx="10"
        fill={color.replace(/[\d.]+\)$/, '0.12)')} stroke={color} strokeWidth="2.5" />
      {/* Header */}
      <rect x="10" y="18" width="80" height="22" rx="10"
        fill={color.replace(/[\d.]+\)$/, '0.3)')} />
      {/* Hooks */}
      <line x1="34" y1="10" x2="34" y2="26" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="66" y1="10" x2="66" y2="26" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Date grid */}
      {[0, 1, 2].map(r =>
        [0, 1, 2, 3].map(c => (
          <rect
            key={`${r}-${c}`}
            x={22 + c * 17} y={48 + r * 13}
            width="8" height="6" rx="1.5"
            fill={r === 1 && c === 2 ? color : color.replace(/[\d.]+\)$/, '0.2)')}
          />
        ))
      )}
    </svg>
  );
}

function PiggyShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size * 1.2} height={size} viewBox="0 0 120 100" fill="none">
      {/* Body */}
      <ellipse cx="58" cy="55" rx="40" ry="32"
        fill={color.replace(/[\d.]+\)$/, '0.15)')} stroke={color} strokeWidth="2.5" />
      {/* Ear */}
      <circle cx="35" cy="32" r="10" fill={color.replace(/[\d.]+\)$/, '0.25)')} stroke={color} strokeWidth="2" />
      {/* Snout */}
      <ellipse cx="90" cy="55" rx="12" ry="9" fill={color.replace(/[\d.]+\)$/, '0.25)')} stroke={color} strokeWidth="2" />
      <circle cx="87" cy="52" r="2" fill={color} />
      <circle cx="93" cy="52" r="2" fill={color} />
      {/* Coin slot */}
      <rect x="48" y="22" width="16" height="4" rx="2" fill={color} />
      {/* Legs */}
      <line x1="40" y1="82" x2="40" y2="95" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="84" x2="55" y2="95" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="65" y1="84" x2="65" y2="95" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="78" y1="82" x2="78" y2="95" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="42" cy="45" r="3" fill={color} />
      {/* Tail */}
      <path d="M18 48C10 45 8 55 14 58" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Stride: Professional Financial Connectivity
