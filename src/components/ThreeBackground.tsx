
"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, MeshDistortMaterial, Stars, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

function LiquidBlob({
    color,
    position,
    size,
    speed,
    distort,
    radius = 1
}: {
    color: string,
    position: [number, number, number],
    size: number,
    speed: number,
    distort: number,
    radius?: number
}) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.position.y = position[1] + Math.sin(t * (speed / 2)) * radius;
        meshRef.current.position.x = position[0] + Math.cos(t * (speed / 3)) * radius;
    });

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <sphereGeometry args={[size, 64, 64]} />
                <MeshDistortMaterial
                    color={color}
                    speed={speed}
                    distort={distort}
                    transparent
                    opacity={0.65}
                    metalness={0.8}
                    roughness={0.1}
                />
            </mesh>
        </Float>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />

            {/* Ambient and Dynamic Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <spotLight position={[-20, 20, 10]} angle={0.2} penumbra={1} intensity={2} color="#4F46E5" />

            {/* Background Depth: Stars & Cosmic Dust */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={200} scale={25} size={6} speed={0.4} opacity={0.3} color="#ffffff" />

            {/* Liquid Blobs - Organic Aura */}
            <LiquidBlob
                color="#4F46E5"
                position={[-6, 4, -4]}
                size={3.5}
                speed={1.0}
                distort={0.5}
                radius={2}
            />

            <LiquidBlob
                color="#9333EA"
                position={[8, -3, -6]}
                size={4.5}
                speed={0.8}
                distort={0.4}
                radius={2.5}
            />

            <LiquidBlob
                color="#FF0080"
                position={[-2, -5, -8]}
                size={3.0}
                speed={1.2}
                distort={0.6}
                radius={1.5}
            />

            <LiquidBlob
                color="#00DFD8"
                position={[4, 6, -10]}
                size={2.8}
                speed={0.7}
                distort={0.5}
                radius={3}
            />

            <fog attach="fog" args={["#F4F4F8", 15, 35]} />
        </>
    );
}

export default function ThreeBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Canvas dpr={[1, 2]}>
                <color attach="background" args={["#F4F4F8"]} />
                <Scene />
            </Canvas>
        </div>
    );
}
