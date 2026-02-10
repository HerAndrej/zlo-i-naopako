"use client";

import React, { useRef, useLayoutEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BottleProps {
    activeColor: string;
}

export function Bottle({ activeColor }: BottleProps) {
    const { scene } = useGLTF('/bottle_textured.gltf');
    const group = useRef<THREE.Group>(null);
    const liquidRef = useRef<THREE.Mesh>(null);

    // Custom Scroll State
    const scrollRef = useRef(0);

    // Find liquid mesh on load
    useLayoutEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh;
                if (!m.name.toLowerCase().includes('label')) {
                    liquidRef.current = m;
                    m.material = (m.material as THREE.Material).clone();
                }
            }
        });
    }, [scene]);

    // Listen to native window scroll
    React.useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
            scrollRef.current = progress;
        };

        window.addEventListener('scroll', handleScroll);
        // Call once to set initial state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state, delta) => {
        if (!group.current) return;

        const t = state.clock.getElapsedTime();

        // Float
        group.current.position.y = -0.5 + Math.sin(t * 0.5) * 0.1;
        group.current.rotation.y += 0.005;

        // SCROLL ANIMATION LOGIC
        const rawProgress = scrollRef.current;

        // Map 0.0 (Top) -> 0.0 (Center X)
        // Map 0.15 (Sauces start) -> 1.5 (Right X) to reveal cards

        // We want a quick transition so it moves out of the way as soon as user scrolls down to Sauces
        const transitionProgress = THREE.MathUtils.clamp(rawProgress * 5, 0, 1);

        // Target X: 0 (Center) -> 1.6 (Right side)
        const targetX = THREE.MathUtils.lerp(0, 1.6, transitionProgress);

        // Target Scale: 1.1 (Hero) -> 0.9 (Sauces - slightly smaller to fit side)
        const targetScale = THREE.MathUtils.lerp(1.1, 0.9, transitionProgress);

        // Smoothly move and scale
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, delta * 3);
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, delta * 3));

        // Tilt
        group.current.rotation.z = THREE.MathUtils.lerp(0, -0.1, transitionProgress);

        // Color
        if (liquidRef.current) {
            const material = liquidRef.current.material as THREE.MeshStandardMaterial;
            const targetColor = new THREE.Color(activeColor);
            material.color.lerp(targetColor, delta * 5);
            material.roughness = 0.1;
            material.metalness = 0.1;
        }
    });

    return (
        <group ref={group} dispose={null} scale={1.1}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload('/bottle_textured.gltf');
