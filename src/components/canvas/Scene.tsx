"use client";

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Bottle } from './Bottle';
import { Suspense } from 'react';

interface SceneProps {
    activeColor: string;
}

export default function Scene({ activeColor }: SceneProps) {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 30 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                <Suspense fallback={null}>
                    <Bottle activeColor={activeColor} />
                </Suspense>
            </Canvas>
        </div>
    );
}
