
"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const THREAD_COUNT = 50;
const SEGMENTS = 120;

function Thread({ index }: { index: number }) {
    const lineRef = useRef<THREE.Line>(null!);

    // Each thread has its own unique path characteristics
    const config = useMemo(() => ({
        phaseOffset: index * (Math.PI * 2 / THREAD_COUNT),
        freq: 0.12 + (index * 0.002),
        amp: 1.8 + Math.sin(index * 0.4) * 0.8,
        speed: 0.15 + (index * 0.005),
        yOffset: (index - THREAD_COUNT / 2) * 0.12,
        // Alternate colors for a rich graphic aesthetic
        color: index % 4 === 0 ? "#4F46E5" : index % 4 === 1 ? "#9333EA" : index % 4 === 2 ? "#3B82F6" : "#6366F1",
        opacity: 0.1 + (Math.random() * 0.25)
    }), [index]);

    const xCoords = useMemo(() => {
        const coords = [];
        const width = 60; // Wide enough to cover the screen
        for (let i = 0; i <= SEGMENTS; i++) {
            coords.push((i / SEGMENTS) * width - width / 2);
        }
        return coords;
    }, []);

    const initialPositions = useMemo(() => new Float32Array((SEGMENTS + 1) * 3), []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const positions = lineRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i <= SEGMENTS; i++) {
            const x = xCoords[i];

            // Flowing wavy motion logic
            // Primary wave
            let y = Math.sin(x * config.freq + t * config.speed + config.phaseOffset) * config.amp;
            // Secondary harmonics for organic feel
            y += Math.cos(x * 0.08 - t * config.speed * 0.6 + config.phaseOffset * 1.5) * (config.amp * 0.4);

            // Subtle depth variation
            const z = Math.sin(x * 0.04 + t * 0.2 + config.phaseOffset) * 3;

            positions[i * 3 + 0] = x;
            positions[i * 3 + 1] = y + config.yOffset;
            positions[i * 3 + 2] = z - (index * 0.15); // Stack in depth
        }
        (lineRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    });

    return (
        <line ref={lineRef as any}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={SEGMENTS + 1}
                    args={[initialPositions, 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial color={config.color} transparent opacity={config.opacity} />
        </line>
    );
}

function Threads() {
    return (
        <group rotation={[0.15, -0.1, 0.05]} position={[0, -2, 0]}>
            {Array.from({ length: THREAD_COUNT }).map((_, i) => (
                <Thread key={i} index={i} />
            ))}
        </group>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={45} />
            <ambientLight intensity={1} />

            <Threads />

            <fog attach="fog" args={["#F4F4F8", 15, 45]} />
        </>
    );
}

export default function ThreeBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Canvas dpr={[1, 2]} gl={{ alpha: true }}>
                <color attach="background" args={["#F4F4F8"]} />
                <Scene />
            </Canvas>
        </div>
    );
}
