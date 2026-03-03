
"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function Bubble({ position, size, speed, opacity }: { position: [number, number, number], size: number, speed: number, opacity: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const initialY = position[1];
    const initialX = position[0];

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Float upwards
        meshRef.current.position.y += speed;
        // Horizontal oscillation (organic sway)
        meshRef.current.position.x = initialX + Math.sin(t + initialY) * 0.5;

        // Reset to bottom if it goes too high
        if (meshRef.current.position.y > 15) {
            meshRef.current.position.y = -15;
            meshRef.current.position.x = (Math.random() - 0.5) * 30;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshPhysicalMaterial
                color="#ffffff"
                transparent
                opacity={opacity}
                transmission={0.9} // Glassy translucency
                thickness={0.5}
                roughness={0}
                ior={1.2}
            />
        </mesh>
    );
}

function Bubbles() {
    const bubbleData = useMemo(() => {
        return Array.from({ length: 100 }, () => ({
            position: [
                (Math.random() - 0.5) * 40, // x
                (Math.random() - 0.5) * 30, // y
                (Math.random() - 0.5) * 15, // z
            ] as [number, number, number],
            size: Math.random() * 0.15 + 0.05,
            speed: Math.random() * 0.02 + 0.015,
            opacity: Math.random() * 0.4 + 0.1,
        }));
    }, []);

    return (
        <group>
            {bubbleData.map((data, i) => (
                <Bubble key={i} {...data} />
            ))}
        </group>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <spotLight position={[-10, 10, 10]} angle={0.25} penumbra={1} intensity={1.5} />

            <Bubbles />

            <fog attach="fog" args={["#F4F4F8", 5, 25]} />
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
