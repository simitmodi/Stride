
"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

function ColorfulShape({
    geometry,
    color,
    position,
    size,
    speed,
    rotationSpeed = 1,
    distort = 0,
    wobble = 0
}: {
    geometry: "torus" | "octahedron" | "tetrahedron" | "ring";
    color: string;
    position: [number, number, number];
    size: number;
    speed: number;
    rotationSpeed?: number;
    distort?: number;
    wobble?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = t * (rotationSpeed / 3);
        meshRef.current.rotation.y = t * (rotationSpeed / 2);
        meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.6;
    });

    return (
        <Float speed={speed * 2} rotationIntensity={1.5} floatIntensity={1}>
            <mesh ref={meshRef} position={position}>
                {geometry === "torus" && <torusKnotGeometry args={[size, size * 0.3, 128, 32]} />}
                {geometry === "octahedron" && <octahedronGeometry args={[size, 0]} />}
                {geometry === "tetrahedron" && <tetrahedronGeometry args={[size, 0]} />}
                {geometry === "ring" && <torusGeometry args={[size, size * 0.05, 16, 100]} />}

                {distort > 0 ? (
                    <MeshDistortMaterial
                        color={color}
                        speed={speed}
                        distort={distort}
                        transparent
                        opacity={0.7}
                        metalness={0.9}
                        roughness={0.1}
                    />
                ) : (
                    <MeshWobbleMaterial
                        color={color}
                        speed={speed}
                        factor={wobble || 0.5}
                        transparent
                        opacity={0.7}
                        metalness={0.9}
                        roughness={0.1}
                    />
                )}
            </mesh>
        </Float>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={2.5} />
            <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={2} />

            {/* Pink Torus Knot */}
            <ColorfulShape
                geometry="torus"
                color="#FF0080"
                position={[-8, 6, -10]}
                size={1.5}
                speed={1.0}
                distort={0.4}
            />

            {/* Purple Octahedron */}
            <ColorfulShape
                geometry="octahedron"
                color="#7928CA"
                position={[9, -5, -8]}
                size={2.2}
                speed={0.7}
                wobble={0.6}
            />

            {/* Blue Ring */}
            <ColorfulShape
                geometry="ring"
                color="#0070F3"
                position={[4, 7, -12]}
                size={3.0}
                speed={1.2}
                rotationSpeed={0.5}
            />

            {/* Cyan Tetrahedron */}
            <ColorfulShape
                geometry="tetrahedron"
                color="#00DFD8"
                position={[-10, -7, -10]}
                size={1.8}
                speed={0.9}
                wobble={0.4}
            />

            {/* Indigo Accent Ring - Massive background element */}
            <ColorfulShape
                geometry="ring"
                color="#4F46E5"
                position={[-3, -4, -15]}
                size={6.0}
                speed={0.3}
                rotationSpeed={0.2}
            />

            {/* Additional Amber Accent */}
            <ColorfulShape
                geometry="octahedron"
                color="#F59E0B"
                position={[12, 10, -20]}
                size={1.2}
                speed={1.5}
                wobble={0.8}
            />

            {/* Additional Lime Accent */}
            <ColorfulShape
                geometry="tetrahedron"
                color="#84CC16"
                position={[-15, 0, -18]}
                size={2.0}
                speed={0.6}
                distort={0.5}
            />

            <fog attach="fog" args={["#F4F4F8", 10, 30]} />
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
