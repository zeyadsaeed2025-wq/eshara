'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { SignElement } from '@/lib/api';

interface Avatar3DProps {
  signs: SignElement[];
  currentIndex: number;
  isPlaying: boolean;
  className?: string;
}

// Robot Avatar Component
function RobotAvatar({ targetRotation, targetPosition }: { 
  targetRotation: THREE.Euler; 
  targetPosition: THREE.Vector3;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Smooth interpolation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.x,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.y,
        0.1
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotation.z,
        0.1
      );
    }
    
    // Animate arms based on sign
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.z,
        targetPosition.x,
        0.15
      );
      rightArmRef.current.position.y = THREE.MathUtils.lerp(
        rightArmRef.current.position.y,
        targetPosition.y,
        0.15
      );
    }
    
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.z,
        -targetPosition.x,
        0.15
      );
    }
  });
  
  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.6]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Chest Screen */}
      <mesh position={[0, 0.1, 0.31]}>
        <planeGeometry args={[0.8, 0.5]} />
        <meshStandardMaterial color="#0f172a" emissive="#3b82f6" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Head */}
      <group position={[0, 1.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.8, 0.6]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.6} roughness={0.3} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.15, 0.1, 0.31]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.15, 0.1, 0.31]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
        </mesh>
        
        {/* Mouth */}
        <mesh position={[0, -0.15, 0.31]}>
          <boxGeometry args={[0.3, 0.08, 0.02]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Antenna */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.68, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.7, 0.3, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.6, 16]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.7, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.5, 16]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Fingers */}
        {[-0.04, 0, 0.04].map((x, i) => (
          <mesh key={i} position={[x, -1.12, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 0.1, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.7, 0.3, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.6, 16]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.7, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.5, 16]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Base */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 1, 0.3, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.82, 0]}>
        <torusGeometry args={[0.85, 0.05, 16, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Animation pose definitions
const signPoses: Record<string, { rotation: [number, number, number]; position: [number, number, number] }> = {
  // Letter poses (simplified examples)
  'alif': { rotation: [0, 0, 0.5], position: [0.3, 0, 0] },
  'ba': { rotation: [0, 0, 1.2], position: [0.2, -0.2, 0.1] },
  'ta': { rotation: [0, 0, 1.0], position: [0.2, -0.15, 0.1] },
  'jeem': { rotation: [0, 0.3, 1.4], position: [0.25, 0, 0.15] },
  'ha': { rotation: [0, 0, 0.2], position: [0.3, 0.1, 0.1] },
  'dal': { rotation: [0, 0, 1.8], position: [0.2, -0.2, 0.1] },
  'ain': { rotation: [0, 0, 1.0], position: [0.2, 0, 0.1] },
  'fa': { rotation: [0, 0, 0.7], position: [0.2, -0.1, 0.1] },
  'lam': { rotation: [0, 0, 0.3], position: [0.3, 0.2, 0.1] },
  'meem': { rotation: [0, 0, 0.2], position: [0.2, -0.15, 0.1] },
  'noon': { rotation: [0, 0, 0.5], position: [0.2, -0.1, 0.1] },
  'waw': { rotation: [0, 0.4, 0.4], position: [0.15, -0.1, 0.15] },
  'ya': { rotation: [0, 0, 1.0], position: [0.2, -0.05, 0.1] },
  // Word poses
  'greeting': { rotation: [0, 0, 0.3], position: [0.3, 0.2, 0.15] },
  'default': { rotation: [0, 0, 0.3], position: [0.2, 0, 0] },
};

function getPoseForSign(sign: SignElement): { rotation: [number, number, number]; position: [number, number, number] } {
  const value = sign.value.toLowerCase();
  
  // Check for specific poses
  if (signPoses[value]) {
    return signPoses[value];
  }
  
  // Check for word patterns
  if (sign.type === 'word') {
    return signPoses['greeting'];
  }
  
  // Default for letters
  return signPoses['default'];
}

function Scene({ signs, currentIndex, isPlaying }: Avatar3DProps) {
  const [targetRotation, setTargetRotation] = useState<THREE.Euler>(new THREE.Euler(0, 0, 0.3));
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3>(new THREE.Vector3(0.2, 0, 0));
  
  useEffect(() => {
    if (signs.length > 0 && currentIndex < signs.length) {
      const currentSign = signs[currentIndex];
      const pose = getPoseForSign(currentSign);
      
      setTargetRotation(new THREE.Euler(...pose.rotation));
      setTargetPosition(new THREE.Vector3(...pose.position));
    }
  }, [currentIndex, signs]);
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={50} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#4488ff" />
      <pointLight position={[0, -1, 2]} intensity={0.3} color="#00ccff" />
      
      {/* Avatar */}
      <RobotAvatar 
        targetRotation={targetRotation}
        targetPosition={targetPosition}
      />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0f172a" 
          transparent 
          opacity={0.8}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Orbit Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">جارِ تحميل الشخصية...</p>
      </div>
    </div>
  );
}

export default function Avatar3D({ signs, currentIndex, isPlaying, className = '' }: Avatar3DProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-900 rounded-2xl" />
      
      <Suspense fallback={<LoadingFallback />}>
        <Canvas shadows className="rounded-2xl" dpr={[1, 2]}>
          <Scene signs={signs} currentIndex={currentIndex} isPlaying={isPlaying} />
        </Canvas>
      </Suspense>
      
      {/* Sign Label Overlay */}
      {signs.length > 0 && currentIndex < signs.length && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 px-4 py-2 rounded-xl">
          <p className="text-white text-lg font-medium text-center">
            {signs[currentIndex]?.display_name || signs[currentIndex]?.value}
          </p>
        </div>
      )}
      
      {/* Controls hint */}
      <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-xs text-white">
        اسحب للتدوير
      </div>
    </div>
  );
}
