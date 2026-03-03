
"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera, TorusKnot, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({
    geometry,
    color,
    position,
    size,
    speed,
    distort = 0,
    wobble = 0
}: {
    geometry: "torus" | "icosahedron";
    color: string;
    position: [number, number, number];
    size: number;
    speed: number;
    distort?: number;
    wobble?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = t * (speed / 4);
        meshRef.current.rotation.y = t * (speed / 3);
        meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.4;
    });

    return (
        <Float speed={speed * 2} rotationIntensity={2} floatIntensity={1}>
            <mesh ref={meshRef} position={position}>
                {geometry === "torus" ? (
                    <torusKnotGeometry args={[size, size * 0.3, 128, 32]} />
                ) : (
                    <icosahedronGeometry args={[size, 1]} />
                )}

                {distort > 0 ? (
                    <MeshDistortMaterial
                        color={color}
                        speed={speed}
                        distort={distort}
                        transparent
                        opacity={0.8}
                        roughness={0.1}
                        metalness={0.8}
                    />
                ) : (
                    <MeshWobbleMaterial
                        color={color}
                        speed={speed}
                        factor={wobble}
                        transparent
                        opacity={0.8}
                        roughness={0.1}
                        metalness={0.8}
                    />
                )}
            </mesh>
        </Float>
    );
}

function GridOverlay() {
    const gridRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        gridRef.current.position.z = -15 + (Math.sin(t * 0.2) * 5); // slow movement
    });

    return (
        <group ref={gridRef} rotation={[Math.PI / 2.5, 0, 0]}>
            <gridHelper args={[100, 40, "#4F46E5", "#4F46E5"]} />
        </group>
    );
}

function Bubble({ position, size, speed, opacity }: { position: [number, number, number], size: number, speed: number, opacity: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const initialY = position[1];
    const initialX = position[0];

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Float upwards
        meshRef.current.position.y += speed;
        // Horizontal oscillation
        meshRef.current.position.x = initialX + Math.sin(t + initialY) * 0.5;

        // Reset to bottom if it goes too high
        if (meshRef.current.position.y > 15) {
            meshRef.current.position.y = -15;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshPhysicalMaterial
                color="#ffffff"
                transparent
                opacity={opacity}
                transmission={0.9}
                thickness={0.5}
                roughness={0}
                ior={1.2}
            />
        </mesh>
    );
}

function Bubbles() {
    const bubbleData = useMemo(() => {
        return Array.from({ length: 40 }, () => ({
            position: [
                (Math.random() - 0.5) * 30, // x
                (Math.random() - 0.5) * 30, // y
                (Math.random() - 0.5) * 10,  // z
            ] as [number, number, number],
            size: Math.random() * 0.15 + 0.05,
            speed: Math.random() * 0.02 + 0.01,
            opacity: Math.random() * 0.5 + 0.1,
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
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

            <GridOverlay />
            <Bubbles />

            {/* Indigo Torus Knot - Primary Brand Color */}
            <FloatingShape
                geometry="torus"
                color="#4F46E5"
                position={[-5, 3, -4]}
                size={1.2}
                speed={1.2}
                distort={0.4}
            />

            {/* Purple Icosahedron */}
            <FloatingShape
                geometry="icosahedron"
                color="#9333EA"
                position={[6, -3, -5]}
                size={1.5}
                speed={0.8}
                wobble={0.5}
            />

            {/* Light Blue Accent */}
            <FloatingShape
                geometry="torus"
                color="#3B82F6"
                position={[2, 4, -8]}
                size={0.8}
                speed={1.5}
                distort={0.3}
            />

            {/* Soft Indigo / Ghost Shape */}
            <FloatingShape
                geometry="icosahedron"
                color="#818CF8"
                position={[-6, -4, -6]}
                size={1.0}
                speed={1.1}
                wobble={0.3}
            />

            <fog attach="fog" args={["#F4F4F8", 10, 25]} />
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
