import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Componente de icono flotante 3D
function FloatingIcon({ position, icon, color, scale = 1, rotationSpeed = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time * rotationSpeed) * 0.2;
    meshRef.current.rotation.y = Math.sin(time * rotationSpeed * 0.7) * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.3;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 0.2]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.2}
        />
        <Text
          position={[0, 0, 0.11]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
        >
          {icon}
        </Text>
      </mesh>
    </Float>
  );
}

// Componente principal del fondo 3D
function Background3D() {
  const lightRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    lightRef.current.position.x = Math.sin(time * 0.5) * 10;
    lightRef.current.position.z = Math.cos(time * 0.5) * 10;
  });

  const icons = useMemo(() => {
    const iconData = [
      { icon: '🎬', color: '#E50914', label: 'movies' },
      { icon: '📺', color: '#0066CC', label: 'tv' },
      { icon: '🎮', color: '#00FF88', label: 'games' },
      { icon: '🎭', color: '#FF6B6B', label: 'drama' },
      { icon: '🚀', color: '#4ECDC4', label: 'scifi' },
      { icon: '😂', color: '#FFE66D', label: 'comedy' },
      { icon: '👑', color: '#A8E6CF', label: 'premium' },
      { icon: '⭐', color: '#FFB74D', label: 'popular' },
      { icon: '🔥', color: '#FF8A65', label: 'trending' },
      { icon: '💎', color: '#CE93D8', label: 'exclusive' },
    ];

    return Array.from({ length: 30 }, (_, i) => {
      const iconInfo = iconData[i % iconData.length];
      return {
        id: i,
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10 - 5
        ],
        icon: iconInfo.icon,
        color: iconInfo.color,
        scale: 0.5 + Math.random() * 0.8,
        rotationSpeed: 0.5 + Math.random() * 1.5
      };
    });
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight ref={lightRef} position={[10, 10, 5]} intensity={1} color="#E50914" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0066CC" />
      
      {/* Floating Icons */}
      {icons.map((iconData) => (
        <FloatingIcon
          key={iconData.id}
          position={iconData.position}
          icon={iconData.icon}
          color={iconData.color}
          scale={iconData.scale}
          rotationSpeed={iconData.rotationSpeed}
        />
      ))}
    </>
  );
}

// Componente principal exportado
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 60,
        }}
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #1a0000 50%, #000000 100%)',
        }}
      >
        <Background3D />
      </Canvas>
      
      {/* Overlay gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}