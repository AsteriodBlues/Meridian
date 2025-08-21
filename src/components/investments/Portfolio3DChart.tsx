'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Vector3, Color } from 'three';
import { BarChart3, TrendingUp, TrendingDown, Maximize2, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface PortfolioItem {
  id: string;
  name: string;
  value: number;
  percentage: number;
  change: number;
  color: string;
  category: string;
  volatility?: number;
}

interface Portfolio3DChartProps {
  data: PortfolioItem[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  animated?: boolean;
  className?: string;
}

// 3D Bar Component
function Bar3D({ 
  position, 
  height, 
  color, 
  item, 
  isHovered, 
  onHover, 
  onClick,
  animationPhase 
}: {
  position: Vector3;
  height: number;
  color: string;
  item: PortfolioItem;
  isHovered: boolean;
  onHover: (item: PortfolioItem | null) => void;
  onClick: (item: PortfolioItem) => void;
  animationPhase: number;
}) {
  const meshRef = useRef<any>();
  const [currentHeight, setCurrentHeight] = useState(0);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Animate height growth
      if (currentHeight < height) {
        setCurrentHeight(prev => Math.min(prev + height * 0.02, height));
      }
      
      // Hover animation
      if (isHovered) {
        meshRef.current.scale.x = 1.1;
        meshRef.current.scale.z = 1.1;
        meshRef.current.position.y = position.y + 0.2;
      } else {
        meshRef.current.scale.x = 1;
        meshRef.current.scale.z = 1;
        meshRef.current.position.y = position.y;
      }
      
      // Breathing animation for high-value items
      if (item.value > 10000) {
        const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.05;
        meshRef.current.scale.y = 1 + breathe;
      }
      
      // Volatility animation
      if (item.volatility && item.volatility > 0.1) {
        const wobble = Math.sin(state.clock.elapsedTime * 4) * (item.volatility * 0.1);
        meshRef.current.rotation.z = wobble;
      }
    }
  });

  return (
    <group>
      {/* Base Platform */}
      <mesh position={[position.x, -0.3, position.z]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 8]} />
        <meshPhongMaterial
          color={new Color(color)}
          emissive={new Color(color).multiplyScalar(0.2)}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Main bar with crystal-like materials */}
      <mesh
        ref={meshRef}
        position={[position.x, position.y, position.z]}
        onPointerEnter={() => onHover(item)}
        onPointerLeave={() => onHover(null)}
        onClick={() => onClick(item)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.8, currentHeight, 0.8]} />
        <meshPhongMaterial
          color={new Color(color)}
          transparent
          opacity={0.85}
          emissive={new Color(color).multiplyScalar(isHovered ? 0.5 : 0.25)}
          shininess={150}
          specular={new Color('#ffffff').multiplyScalar(0.8)}
          reflectivity={0.3}
        />
      </mesh>

      {/* Prismatic Glass Top Cap */}
      <mesh position={[position.x, position.y + currentHeight / 2 + 0.1, position.z]}>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshPhongMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          emissive={new Color(color).multiplyScalar(0.3)}
          emissiveIntensity={0.2}
          shininess={200}
          specular="#ffffff"
          reflectivity={0.5}
        />
      </mesh>
      
      {/* Holographic edge highlights */}
      {[0, 1, 2, 3].map(edge => (
        <mesh 
          key={edge}
          position={[
            position.x + Math.cos(edge * Math.PI / 2) * 0.42,
            position.y,
            position.z + Math.sin(edge * Math.PI / 2) * 0.42
          ]}
        >
          <boxGeometry args={[0.04, currentHeight, 0.04]} />
          <meshPhongMaterial
            color={new Color(color)}
            transparent
            opacity={0.6}
            emissive={new Color(color).multiplyScalar(0.8)}
            emissiveIntensity={isHovered ? 0.5 : 0.3}
          />
        </mesh>
      ))}

      {/* Enhanced Multi-layer Glow effect when hovered */}
      {isHovered && (
        <>
          {/* Inner glow */}
          <mesh position={[position.x, position.y, position.z]}>
            <boxGeometry args={[1.1, currentHeight + 0.3, 1.1]} />
            <meshPhongMaterial
              color={new Color(color)}
              transparent
              opacity={0.3}
              emissive={new Color(color).multiplyScalar(0.6)}
            />
          </mesh>
          
          {/* Middle glow ring */}
          <mesh position={[position.x, position.y, position.z]}>
            <boxGeometry args={[1.4, currentHeight + 0.6, 1.4]} />
            <meshPhongMaterial
              color={new Color(color)}
              transparent
              opacity={0.15}
              emissive={new Color(color).multiplyScalar(0.4)}
            />
          </mesh>
          
          {/* Outer ethereal glow */}
          <mesh position={[position.x, position.y, position.z]}>
            <boxGeometry args={[1.8, currentHeight + 1.0, 1.8]} />
            <meshPhongMaterial
              color={new Color(color)}
              transparent
              opacity={0.08}
              emissive={new Color(color).multiplyScalar(0.2)}
            />
          </mesh>
        </>
      )}

      {/* Enhanced Value particles for high performers */}
      {item.change > 5 && (
        <ParticleEffect
          position={[position.x, position.y + currentHeight / 2, position.z]}
          color={color}
          count={Math.min(8, Math.floor(item.change / 2))}
          intensity={Math.min(1, item.change / 20)}
        />
      )}
      
      {/* Volatility indicator rings */}
      {item.volatility && item.volatility > 0.15 && (
        <VolatilityRings
          position={[position.x, position.y + currentHeight / 2, position.z]}
          color={color}
          volatility={item.volatility}
        />
      )}
    </group>
  );
}

// Enhanced Particle Effect Component
function ParticleEffect({ 
  position, 
  color, 
  count, 
  intensity = 1 
}: { 
  position: number[]; 
  color: string; 
  count: number; 
  intensity?: number; 
}) {
  const groupRef = useRef<any>();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.03 * intensity;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: count }).map((_, i) => (
        <Particle key={i} color={color} index={i} intensity={intensity} />
      ))}
    </group>
  );
}

// Volatility Rings Component
function VolatilityRings({ 
  position, 
  color, 
  volatility 
}: { 
  position: number[]; 
  color: string; 
  volatility: number; 
}) {
  const ringRefs = useRef<any[]>([]);
  
  useFrame((state) => {
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        const time = state.clock.elapsedTime + i * 0.5;
        ring.rotation.z = time * (0.5 + volatility);
        ring.scale.setScalar(1 + Math.sin(time * 3) * 0.2 * volatility);
      }
    });
  });

  return (
    <group position={position}>
      {[0.8, 1.2, 1.6].map((radius, i) => (
        <mesh 
          key={i}
          ref={el => ringRefs.current[i] = el}
        >
          <ringGeometry args={[radius, radius + 0.05, 16]} />
          <meshPhongMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5 * volatility}
            transparent
            opacity={0.6 - i * 0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

// Enhanced Individual Particle
function Particle({ 
  color, 
  index, 
  intensity = 1 
}: { 
  color: string; 
  index: number; 
  intensity?: number; 
}) {
  const meshRef = useRef<any>();
  const trailRef = useRef<any>();
  
  const [position] = useState(() => [
    (Math.random() - 0.5) * 3,
    (Math.random() - 0.5) * 3,
    (Math.random() - 0.5) * 3
  ]);
  
  const [velocity] = useState(() => [
    (Math.random() - 0.5) * 0.02,
    Math.random() * 0.02 + 0.01,
    (Math.random() - 0.5) * 0.02
  ]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + index;
      const amplitude = 0.5 * intensity;
      
      meshRef.current.position.y = position[1] + Math.sin(time * 2) * amplitude + velocity[1] * time;
      meshRef.current.position.x = position[0] + Math.cos(time * 1.5) * 0.3 + velocity[0] * time;
      meshRef.current.position.z = position[2] + Math.sin(time * 1.8) * 0.3 + velocity[2] * time;
      
      const scale = (0.3 + Math.sin(time * 3) * 0.2) * intensity;
      meshRef.current.scale.setScalar(scale);
      
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.y += 0.03;
    }
    
    if (trailRef.current) {
      trailRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }
  });

  return (
    <group>
      {/* Main particle */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshPhongMaterial 
          color={new Color(color)} 
          emissive={new Color(color).multiplyScalar(0.9)} 
          transparent
          opacity={0.9}
          shininess={150}
        />
      </mesh>
      
      {/* Particle trail/glow */}
      <mesh ref={trailRef} position={position}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshPhongMaterial 
          color={new Color(color)} 
          emissive={new Color(color).multiplyScalar(0.5)} 
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

// Enhanced Floating Orb Component for Atmospheric Beauty
function FloatingOrb({ index }: { index: number }) {
  const meshRef = useRef<any>();
  const trailRef = useRef<any>();
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316', '#84cc16'];
  const color = colors[index % colors.length];
  
  const [position] = useState(() => [
    (Math.random() - 0.5) * 25,
    Math.random() * 12 + 8,
    (Math.random() - 0.5) * 25
  ]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * 0.3 + index;
      const amplitude = 4 + index * 0.5;
      
      meshRef.current.position.x = position[0] + Math.sin(time) * amplitude;
      meshRef.current.position.y = position[1] + Math.cos(time * 0.7) * 2.5;
      meshRef.current.position.z = position[2] + Math.sin(time * 0.3) * amplitude;
      
      const pulseScale = 0.4 + Math.sin(time * 3) * 0.2;
      meshRef.current.scale.setScalar(pulseScale);
      
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.003;
    }
  });

  return (
    <group>
      {/* Main orb */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshPhongMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
          shininess={100}
        />
      </mesh>
      
      {/* Inner core */}
      <mesh ref={trailRef} position={position}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshPhongMaterial 
          color="#ffffff"
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh position={position}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshPhongMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// Energy Stream Component for Connecting High-Value Assets
function EnergyStream({ 
  start, 
  end, 
  color, 
  intensity = 1 
}: { 
  start: number[]; 
  end: number[]; 
  color: string; 
  intensity?: number; 
}) {
  const meshRef = useRef<any>();
  const particlesRef = useRef<any>();
  
  const midpoint = [
    (start[0] + end[0]) / 2,
    Math.max(start[1], end[1]) + 2,
    (start[2] + end[2]) / 2
  ];
  
  const distance = Math.sqrt(
    (end[0] - start[0]) ** 2 + 
    (end[1] - start[1]) ** 2 + 
    (end[2] - start[2]) ** 2
  );

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 4) * 0.2 * intensity;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group>
      {/* Energy beam */}
      <mesh 
        ref={meshRef}
        position={midpoint}
        lookAt={end}
      >
        <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3 * intensity}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Traveling particles */}
      <group ref={particlesRef}>
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              start[0] + (end[0] - start[0]) * (i / 3),
              start[1] + (end[1] - start[1]) * (i / 3) + 1,
              start[2] + (end[2] - start[2]) * (i / 3)
            ]}
          >
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshPhongMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 3D Scene Component
function Scene({ 
  data, 
  onHover, 
  onClick, 
  hoveredItem, 
  animationPhase,
  showLabels 
}: {
  data: PortfolioItem[];
  onHover: (item: PortfolioItem | null) => void;
  onClick: (item: PortfolioItem) => void;
  hoveredItem: PortfolioItem | null;
  animationPhase: number;
  showLabels: boolean;
}) {
  const { camera } = useThree();
  
  // Calculate grid layout
  const gridSize = Math.ceil(Math.sqrt(data.length));
  const maxValue = Math.max(...data.map(item => item.value));
  
  const bars = data.map((item, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const x = (col - gridSize / 2) * 2;
    const z = (row - gridSize / 2) * 2;
    const height = (item.value / maxValue) * 5; // Scale height
    const position = new Vector3(x, height / 2, z);
    
    return (
      <Bar3D
        key={item.id}
        position={position}
        height={height}
        color={item.color}
        item={item}
        isHovered={hoveredItem?.id === item.id}
        onHover={onHover}
        onClick={onClick}
        animationPhase={animationPhase}
      />
    );
  });

  const labels = []; // Temporarily disable labels to debug

  return (
    <>
      {/* Cinematic Lighting Setup */}
      <ambientLight intensity={0.2} />
      
      {/* Main directional light with shadows */}
      <directionalLight 
        position={[12, 15, 8]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Colored accent lights */}
      <pointLight position={[15, 12, 15]} intensity={1.0} color="#60a5fa" distance={30} />
      <pointLight position={[-15, 8, -15]} intensity={0.8} color="#a855f7" distance={25} />
      <pointLight position={[0, 25, 0]} intensity={0.6} color="#fbbf24" distance={35} />
      <pointLight position={[20, 5, 0]} intensity={0.7} color="#10b981" distance={20} />
      <pointLight position={[-20, 5, 0]} intensity={0.7} color="#ef4444" distance={20} />
      
      {/* Atmospheric rim lighting */}
      <spotLight 
        position={[0, 35, 0]} 
        angle={0.4} 
        intensity={0.8} 
        penumbra={0.8} 
        color="#06b6d4"
        castShadow
        distance={40}
        decay={2}
      />
      
      {/* Side rim lights for depth */}
      <spotLight 
        position={[25, 20, 25]} 
        angle={0.6} 
        intensity={0.5} 
        penumbra={1} 
        color="#8b5cf6"
        target-position={[0, 0, 0]}
      />
      <spotLight 
        position={[-25, 20, -25]} 
        angle={0.6} 
        intensity={0.5} 
        penumbra={1} 
        color="#f59e0b"
        target-position={[0, 0, 0]}
      />
      
      {/* Holographic Grid Floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshPhongMaterial 
          color="#0f172a" 
          transparent 
          opacity={0.9}
          emissive="#1e293b"
          emissiveIntensity={0.15}
          shininess={50}
        />
      </mesh>
      
      {/* Radial glow rings on floor */}
      {[5, 10, 15].map(radius => (
        <mesh key={radius} position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.1, radius + 0.1, 32]} />
          <meshPhongMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.2 - radius * 0.01}
            emissive="#3b82f6"
            emissiveIntensity={0.3 - radius * 0.015}
          />
        </mesh>
      ))}
      
      {/* Enhanced Grid Lines with Pulse Effect */}
      {Array.from({ length: 13 }).map((_, i) => {
        const distance = Math.abs(i - 6);
        const opacity = Math.max(0.1, 0.4 - distance * 0.05);
        const emissiveIntensity = Math.max(0.05, 0.15 - distance * 0.02);
        
        return (
          <group key={`grid-${i}`}>
            {/* Vertical lines with fade */}
            <mesh position={[(i - 6) * 2.2, -0.49, 0]}>
              <boxGeometry args={[0.03, 0.01, 28]} />
              <meshPhongMaterial 
                color="#60a5fa" 
                transparent 
                opacity={opacity}
                emissive="#60a5fa"
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Horizontal lines with fade */}
            <mesh position={[0, -0.49, (i - 6) * 2.2]}>
              <boxGeometry args={[28, 0.01, 0.03]} />
              <meshPhongMaterial 
                color="#60a5fa" 
                transparent 
                opacity={opacity}
                emissive="#60a5fa"
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Floating Orbs and Energy Streams */}
      {Array.from({ length: 8 }).map((_, i) => (
        <FloatingOrb key={`orb-${i}`} index={i} />
      ))}
      
      {/* Energy streams connecting high-value assets */}
      {data.filter(item => item.value > 10000).map((item, i, highValueItems) => {
        if (i === highValueItems.length - 1) return null;
        const nextItem = highValueItems[i + 1];
        const itemIndex = data.findIndex(d => d.id === item.id);
        const nextIndex = data.findIndex(d => d.id === nextItem.id);
        
        const row1 = Math.floor(itemIndex / gridSize);
        const col1 = itemIndex % gridSize;
        const x1 = (col1 - gridSize / 2) * 2;
        const z1 = (row1 - gridSize / 2) * 2;
        
        const row2 = Math.floor(nextIndex / gridSize);
        const col2 = nextIndex % gridSize;
        const x2 = (col2 - gridSize / 2) * 2;
        const z2 = (row2 - gridSize / 2) * 2;
        
        const midX = (x1 + x2) / 2;
        const midZ = (z1 + z2) / 2;
        const distance = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
        
        return (
          <EnergyStream
            key={`stream-${i}`}
            start={[x1, 2, z1]}
            end={[x2, 2, z2]}
            color={item.color}
            intensity={item.value / 50000}
          />
        );
      }).filter(Boolean)}
      
      {/* Bars */}
      {bars}
      
      {/* Labels */}
      {labels}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={25}
      />
    </>
  );
}

// Loading component
function Loading() {
  return (
    <Html center>
      <div className="flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-lg">
        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
        <span className="text-sm">Loading 3D Portfolio...</span>
      </div>
    </Html>
  );
}

export default function Portfolio3DChart({
  data,
  width = 800,
  height = 600,
  showLabels = true,
  animated = true,
  className = ''
}: Portfolio3DChartProps) {
  const [hoveredItem, setHoveredItem] = useState<PortfolioItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'fly'>('orbit');
  const [showUI, setShowUI] = useState(true);

  // Animation phases
  useEffect(() => {
    if (!animated) return;
    
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [animated]);

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const topPerformer = data.reduce((max, item) => item.change > max.change ? item : max, data[0]);
  const bottomPerformer = data.reduce((min, item) => item.change < min.change ? item : min, data[0]);

  return (
    <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">3D Portfolio Visualization</h3>
              <p className="text-gray-400 text-sm">Interactive three-dimensional asset analysis</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {showLabels ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
              </motion.div>
            </button>
            <button
              onClick={() => setShowUI(!showUI)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Maximize2 className="w-4 h-4 text-white" />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 3D Canvas */}
      <motion.div
        className="relative rounded-xl overflow-hidden"
        style={{ 
          width, 
          height,
          background: `
            radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 85% 15%, rgba(139, 92, 246, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 85% 85%, rgba(245, 158, 11, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 60%),
            linear-gradient(135deg, 
              rgba(15, 23, 42, 0.98) 0%,
              rgba(30, 41, 59, 0.95) 20%,
              rgba(15, 23, 42, 0.98) 40%,
              rgba(30, 41, 59, 0.95) 60%,
              rgba(15, 23, 42, 0.98) 80%,
              rgba(30, 41, 59, 0.95) 100%
            )
          `,
          boxShadow: `
            inset 0 0 50px rgba(59, 130, 246, 0.1),
            inset 0 0 100px rgba(139, 92, 246, 0.05),
            0 0 50px rgba(0, 0, 0, 0.3)
          `
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Canvas
          camera={{ position: [8, 8, 8], fov: 60 }}
          gl={{ alpha: true, antialias: true }}
          onError={(error) => console.error('Canvas error:', error)}
        >
          <Scene
            data={data}
            onHover={setHoveredItem}
            onClick={handleItemClick}
            hoveredItem={hoveredItem}
            animationPhase={animationPhase}
            showLabels={showLabels}
          />
        </Canvas>

        {/* Floating tooltip */}
        <AnimatePresence>
          {hoveredItem && (
            <motion.div
              className="absolute top-4 right-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 pointer-events-none z-10"
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: hoveredItem.color }}
                  />
                  <h4 className="text-white font-bold text-sm">{hoveredItem.name}</h4>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Value:</span>
                    <span className="text-white font-semibold">${hoveredItem.value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Percentage:</span>
                    <span className="text-blue-400 font-semibold">{hoveredItem.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Change:</span>
                    <span className={`font-semibold flex items-center gap-1 ${
                      hoveredItem.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {hoveredItem.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {hoveredItem.change >= 0 ? '+' : ''}{hoveredItem.change.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white capitalize">{hoveredItem.category}</span>
                  </div>
                  {hoveredItem.volatility && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volatility:</span>
                      <span className="text-orange-400 font-semibold">
                        {(hoveredItem.volatility * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls overlay */}
        {showUI && (
          <motion.div
            className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-xl border border-white/20 rounded-xl p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-xs text-gray-400 space-y-1">
              <div>🖱️ Click & Drag to rotate</div>
              <div>🎯 Mouse wheel to zoom</div>
              <div>📦 Click bars for details</div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Statistics Panel */}
      <motion.div
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-lg font-bold text-cyan-400">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total Value</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-lg font-bold text-green-400">
            +{topPerformer.change.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">Top Performer</div>
          <div className="text-xs text-white mt-1">{topPerformer.name}</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-lg font-bold text-red-400">
            {bottomPerformer.change.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">Lowest Performer</div>
          <div className="text-xs text-white mt-1">{bottomPerformer.name}</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-lg font-bold text-purple-400">
            {data.length}
          </div>
          <div className="text-xs text-gray-400">Assets</div>
        </div>
      </motion.div>

      {/* Performance Legend */}
      <motion.div
        className="mt-4 flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {Array.from(new Set(data.map(item => item.category))).map((category, index) => {
          const categoryItems = data.filter(item => item.category === category);
          const avgChange = categoryItems.reduce((sum, item) => sum + item.change, 0) / categoryItems.length;
          
          return (
            <motion.div
              key={category}
              className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: categoryItems[0]?.color || '#3b82f6' }}
              />
              <span className="text-white capitalize">{category}</span>
              <span className={`font-semibold ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}