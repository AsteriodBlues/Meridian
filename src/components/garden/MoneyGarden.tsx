'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Types for our garden ecosystem
interface Plant {
  id: string;
  type: 'savings' | 'investment' | 'emergency' | 'retirement';
  name: string;
  value: number;
  target: number;
  x: number;
  y: number;
  growth: number; // 0-1
  health: number; // 0-1
  lastWatered: number;
  species: 'rose' | 'sunflower' | 'oak' | 'bamboo' | 'lily' | 'cactus';
}

interface Bee {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  size: number;
  angle: number;
  transferAmount: number;
}

interface RainDrop {
  id: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  value: number;
  trail: Array<{x: number; y: number; opacity: number}>;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'sparkle' | 'glow' | 'pollen' | 'magic';
}

interface LightRay {
  id: string;
  x: number;
  y: number;
  angle: number;
  length: number;
  opacity: number;
  color: string;
}

interface Weed {
  id: string;
  x: number;
  y: number;
  size: number;
  subscriptionName: string;
  monthlyCost: number;
  opacity: number;
}

interface WeatherSystem {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  condition: 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'drought';
  intensity: number; // 0-1
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
}

interface MoneyGardenProps {
  plants: Plant[];
  recentTransfers: Array<{from: string; to: string; amount: number}>;
  monthlyIncome: number;
  monthlyExpenses: number;
  unnecessarySubscriptions: Array<{name: string; cost: number}>;
  marketCondition: 'bull' | 'bear' | 'sideways';
  onPlantAdd?: (plant: Omit<Plant, 'id'>) => void;
  onPlantUpdate?: (id: string, updates: Partial<Plant>) => void;
  onPlantDelete?: (id: string) => void;
  onPlantMove?: (id: string, x: number, y: number) => void;
  onSubscriptionAdd?: (subscription: {name: string; cost: number}) => void;
  onSubscriptionRemove?: (name: string) => void;
  onTransferAdd?: (transfer: {from: string; to: string; amount: number}) => void;
  isEditable?: boolean;
}

const MoneyGarden: React.FC<MoneyGardenProps> = ({
  plants,
  recentTransfers,
  monthlyIncome,
  monthlyExpenses,
  unnecessarySubscriptions,
  marketCondition,
  onPlantAdd,
  onPlantUpdate,
  onPlantDelete,
  onPlantMove,
  onSubscriptionAdd,
  onSubscriptionRemove,
  onTransferAdd,
  isEditable = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const fpsRef = useRef(60);
  
  // Performance optimization: Object pools
  const particlePoolRef = useRef<Particle[]>([]);
  const rainPoolRef = useRef<RainDrop[]>([]);
  
  // Dirty rectangle tracking for optimized rendering
  const dirtyRectsRef = useRef<Array<{x: number; y: number; width: number; height: number}>>([]);
  
  // RAF throttling for smooth 60fps
  const targetFrameTime = 1000 / 60; // 60fps target
  
  // Garden state
  const [bees, setBees] = useState<Bee[]>([]);
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const [weeds, setWeeds] = useState<Weed[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lightRays, setLightRays] = useState<LightRay[]>([]);
  const [weather, setWeather] = useState<WeatherSystem>({
    season: 'spring',
    condition: 'sunny',
    intensity: 0.5,
    marketSentiment: 'neutral'
  });
  
  const [time, setTime] = useState(0);
  const [gardenHealth, setGardenHealth] = useState(0.8);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [cameraZoom, setCameraZoom] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredPlant, setHoveredPlant] = useState<string | null>(null);
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);
  const [addPlantPosition, setAddPlantPosition] = useState({ x: 0, y: 0 });

  // Initialize garden ecosystem
  useEffect(() => {
    // Create bees for transfers
    const newBees = recentTransfers.map((transfer, index) => ({
      id: `bee-${index}`,
      x: Math.random() * 800,
      y: Math.random() * 600,
      targetX: Math.random() * 800,
      targetY: Math.random() * 600,
      speed: 2 + Math.random() * 2,
      size: 8 + (transfer.amount / 1000) * 4,
      angle: 0,
      transferAmount: transfer.amount
    }));
    setBees(newBees);

    // Create weeds for subscriptions
    const newWeeds = unnecessarySubscriptions.map((sub, index) => ({
      id: `weed-${index}`,
      x: Math.random() * 800,
      y: Math.random() * 600,
      size: 20 + (sub.cost / 50) * 15,
      subscriptionName: sub.name,
      monthlyCost: sub.cost,
      opacity: 0.6 + (sub.cost / 100) * 0.4
    }));
    setWeeds(newWeeds);

    // Set weather based on market and financial health
    const spendingRatio = monthlyExpenses / monthlyIncome;
    setWeather({
      season: marketCondition === 'bull' ? 'spring' : marketCondition === 'bear' ? 'autumn' : 'summer',
      condition: spendingRatio > 1.2 ? 'drought' : monthlyIncome > monthlyExpenses * 1.5 ? 'rainy' : 'sunny',
      intensity: Math.abs(spendingRatio - 1),
      marketSentiment: marketCondition === 'bull' ? 'bullish' : marketCondition === 'bear' ? 'bearish' : 'neutral'
    });
  }, [recentTransfers, unnecessarySubscriptions, monthlyIncome, monthlyExpenses, marketCondition]);

  // Enhanced particle systems and effects
  useEffect(() => {
    const interval = setInterval(() => {
      // Enhanced rain with trails
      if (weather.condition === 'rainy') {
        setRainDrops(prev => [
          ...prev.slice(-50).map(drop => ({
            ...drop,
            trail: drop.trail.slice(-8).concat([{x: drop.x, y: drop.y, opacity: drop.opacity * 0.7}])
          })),
          {
            id: `rain-${Date.now()}`,
            x: Math.random() * 800,
            y: -10,
            speed: 3 + Math.random() * 4,
            opacity: 0.6 + Math.random() * 0.4,
            value: monthlyIncome / 1000,
            trail: []
          }
        ]);
      }

      // Magic particles for healthy plants
      if (gardenHealth > 0.7) {
        setParticles(prev => [
          ...prev.slice(-100),
          ...Array.from({length: 3}, () => ({
            id: `particle-${Date.now()}-${Math.random()}`,
            x: Math.random() * 800,
            y: 400 + Math.random() * 200,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            life: 60,
            maxLife: 60,
            size: 2 + Math.random() * 4,
            color: `hsl(${120 + Math.random() * 60}, 70%, ${60 + Math.random() * 30}%)`,
            type: Math.random() > 0.5 ? 'sparkle' : 'glow'
          }))
        ]);
      }

      // Volumetric light rays
      if (weather.condition === 'sunny' && Math.random() < 0.3) {
        setLightRays(prev => [
          ...prev.slice(-5),
          {
            id: `light-${Date.now()}`,
            x: Math.random() * 800,
            y: -50,
            angle: Math.PI / 2 + (Math.random() - 0.5) * 0.3,
            length: 200 + Math.random() * 300,
            opacity: 0.1 + Math.random() * 0.2,
            color: `hsl(${45 + Math.random() * 15}, 80%, 70%)`
          }
        ]);
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, [weather.condition, monthlyIncome, gardenHealth]);

  // Plant growth calculation
  const calculatePlantGrowth = useCallback((plant: Plant): number => {
    const progressRatio = plant.value / plant.target;
    const baseGrowth = Math.min(progressRatio, 1) * 100;
    const marketBonus = weather.marketSentiment === 'bullish' ? 10 : weather.marketSentiment === 'bearish' ? -5 : 0;
    const seasonBonus = weather.season === 'spring' ? 15 : weather.season === 'summer' ? 10 : weather.season === 'autumn' ? 5 : 0;
    const droughtPenalty = weather.condition === 'drought' ? -20 : 0;
    
    return Math.max(0, Math.min(100, baseGrowth + marketBonus + seasonBonus + droughtPenalty));
  }, [weather]);

  // Interactive mouse and touch handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCanvasPosition = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getCanvasPosition(e);
      setMousePos(pos);

      // Check for plant hover
      const hoveredPlant = plants.find(plant => {
        const distance = Math.sqrt((pos.x - plant.x) ** 2 + (pos.y - plant.y) ** 2);
        return distance < 50; // Hover radius
      });
      setHoveredPlant(hoveredPlant?.id || null);

      // Handle dragging
      if (isDragging && selectedPlant && onPlantMove && isEditable) {
        onPlantMove(selectedPlant, pos.x - dragOffset.x, pos.y - dragOffset.y);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!isEditable) return;
      const pos = getCanvasPosition(e);

      // Check if clicking on a plant
      const clickedPlant = plants.find(plant => {
        const distance = Math.sqrt((pos.x - plant.x) ** 2 + (pos.y - plant.y) ** 2);
        return distance < 50;
      });

      if (clickedPlant) {
        setSelectedPlant(clickedPlant.id);
        setIsDragging(true);
        setDragOffset({
          x: pos.x - clickedPlant.x,
          y: pos.y - clickedPlant.y
        });
      } else {
        // Click on empty space - show add plant option
        setAddPlantPosition(pos);
        setShowAddPlantModal(true);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleDoubleClick = (e: MouseEvent) => {
      if (!isEditable) return;
      const pos = getCanvasPosition(e);
      
      const clickedPlant = plants.find(plant => {
        const distance = Math.sqrt((pos.x - plant.x) ** 2 + (pos.y - plant.y) ** 2);
        return distance < 50;
      });

      if (clickedPlant && onPlantDelete) {
        onPlantDelete(clickedPlant.id);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('dblclick', handleDoubleClick);

    // Touch events
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMouseMove(e as any);
    });
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleMouseDown(e as any);
    });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleMouseUp();
    });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [plants, isDragging, selectedPlant, dragOffset, onPlantMove, onPlantDelete, isEditable]);

  // Enhanced plant drawing with modern effects
  const drawPlant = useCallback((ctx: CanvasRenderingContext2D, plant: Plant) => {
    const growth = calculatePlantGrowth(plant);
    const baseHeight = 60 + (growth / 100) * 40;
    const x = plant.x + Math.sin(time * 0.002 + plant.x * 0.01) * 2; // Wind sway
    const y = plant.y;

    // Interactive states
    const mouseDistance = Math.sqrt((mousePos.x - x) ** 2 + (mousePos.y - y) ** 2);
    const proximityEffect = Math.max(0, 1 - mouseDistance / 150);
    const isSelected = selectedPlant === plant.id;
    const isHovered = hoveredPlant === plant.id;
    const glowIntensity = proximityEffect * 0.5 + (isSelected ? 0.8 : 0) + (isHovered ? 0.4 : 0);

    ctx.save();

    // Selection ring
    if (isSelected && isEditable) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(x, y - baseHeight/2, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Hover ring
    if (isHovered && isEditable && !isSelected) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y - baseHeight/2, 55, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Enhanced glow effects
    if (glowIntensity > 0.1) {
      ctx.shadowColor = isSelected ? '#3b82f6' : isHovered ? '#ffffff' : `hsl(${120 + growth}, 70%, 50%)`;
      ctx.shadowBlur = 15 + glowIntensity * 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Dragging effect
    if (isDragging && isSelected) {
      ctx.globalAlpha = 0.8;
      ctx.scale(1.1, 1.1);
    }

    switch (plant.species) {
      case 'rose':
        // Stem
        ctx.strokeStyle = `hsl(120, 60%, ${30 + growth / 4}%)`;
        ctx.lineWidth = 3 + (growth / 100) * 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - baseHeight);
        ctx.stroke();

        // Flower
        const petalCount = Math.min(8, 3 + Math.floor(growth / 20));
        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2;
          const petalX = x + Math.cos(angle) * (8 + growth / 10);
          const petalY = y - baseHeight + Math.sin(angle) * (8 + growth / 10);
          
          ctx.fillStyle = `hsl(${350 + growth / 10}, 80%, ${60 + growth / 5}%)`;
          ctx.beginPath();
          ctx.arc(petalX, petalY, 6 + growth / 20, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center
        ctx.fillStyle = `hsl(45, 90%, ${70 + growth / 10}%)`;
        ctx.beginPath();
        ctx.arc(x, y - baseHeight, 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'sunflower':
        // Stem
        ctx.strokeStyle = `hsl(120, 50%, ${25 + growth / 5}%)`;
        ctx.lineWidth = 4 + (growth / 100) * 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - baseHeight);
        ctx.stroke();

        // Flower head
        const headRadius = 15 + (growth / 100) * 10;
        ctx.fillStyle = `hsl(45, 95%, ${65 + growth / 8}%)`;
        ctx.beginPath();
        ctx.arc(x, y - baseHeight, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Seeds pattern
        ctx.fillStyle = `hsl(25, 70%, ${40 + growth / 15}%)`;
        const seedPattern = Math.floor(growth / 10);
        for (let i = 0; i < seedPattern; i++) {
          const angle = i * 0.618 * Math.PI * 2; // Golden angle
          const radius = (i / seedPattern) * headRadius * 0.7;
          const seedX = x + Math.cos(angle) * radius;
          const seedY = y - baseHeight + Math.sin(angle) * radius;
          ctx.beginPath();
          ctx.arc(seedX, seedY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'oak':
        // Trunk
        ctx.fillStyle = `hsl(25, 40%, ${30 + growth / 8}%)`;
        const trunkWidth = 8 + (growth / 100) * 6;
        ctx.fillRect(x - trunkWidth / 2, y - baseHeight / 2, trunkWidth, baseHeight / 2);

        // Canopy
        const canopyRadius = 25 + (growth / 100) * 20;
        ctx.fillStyle = `hsl(120, ${40 + growth / 5}%, ${35 + growth / 4}%)`;
        ctx.beginPath();
        ctx.arc(x, y - baseHeight, canopyRadius, 0, Math.PI * 2);
        ctx.fill();

        // Leaves detail
        const leafCount = Math.floor(growth / 5);
        for (let i = 0; i < leafCount; i++) {
          const angle = (i / leafCount) * Math.PI * 2;
          const leafX = x + Math.cos(angle) * (canopyRadius * 0.8);
          const leafY = y - baseHeight + Math.sin(angle) * (canopyRadius * 0.8);
          
          ctx.fillStyle = `hsl(120, 70%, ${40 + growth / 3}%)`;
          ctx.beginPath();
          ctx.arc(leafX, leafY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'bamboo':
        // Multiple segments
        const segments = Math.min(8, Math.floor(growth / 15) + 1);
        const segmentHeight = baseHeight / segments;
        
        for (let i = 0; i < segments; i++) {
          const segmentY = y - (i * segmentHeight);
          
          // Segment body
          ctx.fillStyle = `hsl(120, 40%, ${50 + growth / 10}%)`;
          ctx.fillRect(x - 4, segmentY - segmentHeight, 8, segmentHeight);
          
          // Joint
          ctx.fillStyle = `hsl(120, 30%, ${45 + growth / 12}%)`;
          ctx.fillRect(x - 5, segmentY - 3, 10, 6);
          
          // Small leaves
          if (i > 0 && Math.random() > 0.7) {
            ctx.fillStyle = `hsl(120, 60%, ${45 + growth / 8}%)`;
            ctx.fillRect(x + 8, segmentY - 5, 12, 3);
          }
        }
        break;

      case 'lily':
        // Stem
        ctx.strokeStyle = `hsl(120, 55%, ${30 + growth / 6}%)`;
        ctx.lineWidth = 2 + (growth / 100) * 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - baseHeight);
        ctx.stroke();

        // Lily flower
        const petalLength = 12 + (growth / 100) * 8;
        const lilyPetals = Math.min(6, 3 + Math.floor(growth / 25));
        
        for (let i = 0; i < lilyPetals; i++) {
          const angle = (i / lilyPetals) * Math.PI * 2;
          
          ctx.save();
          ctx.translate(x, y - baseHeight);
          ctx.rotate(angle);
          
          ctx.fillStyle = `hsl(${300 + growth / 8}, 70%, ${75 + growth / 8}%)`;
          ctx.beginPath();
          ctx.ellipse(0, -petalLength / 2, 4, petalLength / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }

        // Center
        ctx.fillStyle = `hsl(50, 80%, 70%)`;
        ctx.beginPath();
        ctx.arc(x, y - baseHeight, 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'cactus':
        // Main body
        const cactusHeight = baseHeight;
        const cactusWidth = 12 + (growth / 100) * 8;
        
        ctx.fillStyle = `hsl(120, 40%, ${40 + growth / 8}%)`;
        ctx.fillRect(x - cactusWidth / 2, y - cactusHeight, cactusWidth, cactusHeight);
        
        // Segments
        const cactusSegments = Math.floor(growth / 20) + 1;
        for (let i = 0; i < cactusSegments; i++) {
          const segmentY = y - (i * cactusHeight / cactusSegments);
          ctx.strokeStyle = `hsl(120, 30%, ${35 + growth / 10}%)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - cactusWidth / 2, segmentY);
          ctx.lineTo(x + cactusWidth / 2, segmentY);
          ctx.stroke();
        }

        // Spines
        const spineCount = Math.floor(growth / 10);
        for (let i = 0; i < spineCount; i++) {
          const spineX = x + (Math.random() - 0.5) * cactusWidth;
          const spineY = y - Math.random() * cactusHeight;
          
          ctx.strokeStyle = `hsl(25, 60%, 60%)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(spineX, spineY);
          ctx.lineTo(spineX + (Math.random() - 0.5) * 6, spineY - 4);
          ctx.stroke();
        }

        // Flower on top (if mature enough)
        if (growth > 80) {
          ctx.fillStyle = `hsl(${Math.random() * 60 + 320}, 80%, 70%)`;
          ctx.beginPath();
          ctx.arc(x, y - cactusHeight - 5, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }

    // Plant label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(x - 40, y + 10, 80, 25);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.strokeRect(x - 40, y + 10, 80, 25);
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(plant.name, x, y + 22);
    
    ctx.font = '8px Inter';
    ctx.fillStyle = '#666';
    ctx.fillText(`$${(plant.value / 1000).toFixed(1)}k`, x, y + 32);

    ctx.restore();
  }, [calculatePlantGrowth]);

  // Draw bee with realistic movement
  const drawBee = useCallback((ctx: CanvasRenderingContext2D, bee: Bee, currentTime: number) => {
    const x = bee.x + Math.sin(currentTime * 0.01 + bee.id.charCodeAt(0)) * 3;
    const y = bee.y + Math.cos(currentTime * 0.008 + bee.id.charCodeAt(0)) * 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(bee.angle);

    // Bee body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 0, bee.size / 2, bee.size / 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bee stripes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-bee.size / 3, -bee.size / 6 + i * bee.size / 9);
      ctx.lineTo(bee.size / 3, -bee.size / 6 + i * bee.size / 9);
      ctx.stroke();
    }

    // Wings (animated)
    const wingFlap = Math.sin(currentTime * 0.5) * 0.3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    
    // Left wing
    ctx.beginPath();
    ctx.ellipse(-bee.size / 4, -bee.size / 4, bee.size / 3, bee.size / 6, wingFlap, 0, Math.PI * 2);
    ctx.stroke();
    
    // Right wing
    ctx.beginPath();
    ctx.ellipse(bee.size / 4, -bee.size / 4, bee.size / 3, bee.size / 6, -wingFlap, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    // Transfer amount label
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x - 25, y - bee.size - 15, 50, 12);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 8px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`$${bee.transferAmount}`, x, y - bee.size - 7);
  }, []);

  // Draw rain drop
  const drawRainDrop = useCallback((ctx: CanvasRenderingContext2D, drop: RainDrop) => {
    ctx.save();
    ctx.globalAlpha = drop.opacity;
    
    // Rain drop shape
    ctx.fillStyle = `hsl(200, 80%, 70%)`;
    ctx.beginPath();
    ctx.ellipse(drop.x, drop.y, 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Value sparkle
    if (drop.value > 0) {
      ctx.fillStyle = `hsl(50, 90%, 80%)`;
      ctx.beginPath();
      ctx.arc(drop.x, drop.y - 8, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }, []);

  // Draw weed
  const drawWeed = useCallback((ctx: CanvasRenderingContext2D, weed: Weed) => {
    ctx.save();
    ctx.globalAlpha = weed.opacity;
    
    // Weed stem (jagged)
    ctx.strokeStyle = `hsl(60, 30%, 25%)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(weed.x, weed.y);
    
    for (let i = 1; i <= 5; i++) {
      const segmentY = weed.y - (i * weed.size / 5);
      const jagger = (Math.random() - 0.5) * 6;
      ctx.lineTo(weed.x + jagger, segmentY);
    }
    ctx.stroke();

    // Weed leaves (messy)
    ctx.fillStyle = `hsl(60, 40%, 30%)`;
    for (let i = 0; i < 4; i++) {
      const leafY = weed.y - weed.size * 0.3 - (i * weed.size * 0.15);
      const leafX = weed.x + (Math.random() - 0.5) * 12;
      
      ctx.beginPath();
      ctx.ellipse(leafX, leafY, 4, 8, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Warning label
    ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
    ctx.fillRect(weed.x - 35, weed.y + 5, 70, 20);
    ctx.strokeStyle = '#ff6b6b';
    ctx.strokeRect(weed.x - 35, weed.y + 5, 70, 20);
    
    ctx.fillStyle = '#cc0000';
    ctx.font = 'bold 8px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(weed.subscriptionName, weed.x, weed.y + 15);
    ctx.font = '7px Inter';
    ctx.fillText(`-$${weed.monthlyCost}/mo`, weed.x, weed.y + 22);
    
    ctx.restore();
  }, []);

  // Draw particle effects
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    
    const lifeRatio = particle.life / particle.maxLife;
    ctx.globalAlpha = lifeRatio * 0.8;
    
    switch (particle.type) {
      case 'sparkle':
        // Sparkle effect
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        
        const spikes = 4;
        const outerRadius = particle.size;
        const innerRadius = particle.size * 0.4;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i * Math.PI) / spikes;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = particle.x + Math.cos(angle) * radius;
          const y = particle.y + Math.sin(angle) * radius;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'glow':
        // Soft glow orb
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color.replace(')', ', 0.5)').replace('hsl', 'hsla'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'pollen':
        // Floating pollen
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'magic':
        // Magic swirl
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 1.5;
        
        ctx.beginPath();
        for (let i = 0; i < Math.PI * 4; i += 0.1) {
          const radius = particle.size * (1 + Math.sin(i * 2) * 0.3);
          const x = particle.x + Math.cos(i + particle.life * 0.1) * radius * (i / (Math.PI * 4));
          const y = particle.y + Math.sin(i + particle.life * 0.1) * radius * (i / (Math.PI * 4));
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  }, []);

  // Draw volumetric light rays
  const drawLightRay = useCallback((ctx: CanvasRenderingContext2D, ray: LightRay) => {
    ctx.save();
    ctx.globalAlpha = ray.opacity;
    
    const gradient = ctx.createLinearGradient(
      ray.x, ray.y,
      ray.x + Math.cos(ray.angle) * ray.length,
      ray.y + Math.sin(ray.angle) * ray.length
    );
    
    gradient.addColorStop(0, ray.color);
    gradient.addColorStop(0.3, ray.color.replace(')', ', 0.3)').replace('hsl', 'hsla'));
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    
    // Draw ray as a tapered rectangle
    const width = 20;
    const endWidth = 5;
    const endX = ray.x + Math.cos(ray.angle) * ray.length;
    const endY = ray.y + Math.sin(ray.angle) * ray.length;
    
    ctx.beginPath();
    ctx.moveTo(ray.x - width/2, ray.y);
    ctx.lineTo(ray.x + width/2, ray.y);
    ctx.lineTo(endX + endWidth/2, endY);
    ctx.lineTo(endX - endWidth/2, endY);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }, []);

  // Enhanced rain drop with trail
  const drawEnhancedRainDrop = useCallback((ctx: CanvasRenderingContext2D, drop: RainDrop) => {
    ctx.save();
    
    // Draw trail
    drop.trail.forEach((point, index) => {
      const trailOpacity = point.opacity * (index / drop.trail.length);
      ctx.globalAlpha = trailOpacity;
      ctx.fillStyle = 'hsl(200, 80%, 70%)';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1 + (index / drop.trail.length), 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Main drop with glow
    ctx.globalAlpha = drop.opacity;
    ctx.shadowColor = 'hsl(200, 80%, 70%)';
    ctx.shadowBlur = 8;
    
    ctx.fillStyle = 'hsl(200, 80%, 80%)';
    ctx.beginPath();
    ctx.ellipse(drop.x, drop.y, 3, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Sparkle effect for value
    if (drop.value > 0) {
      ctx.globalAlpha = drop.opacity * 0.8;
      ctx.fillStyle = 'hsl(50, 100%, 90%)';
      ctx.shadowColor = 'hsl(50, 100%, 70%)';
      ctx.shadowBlur = 15;
      
      const sparkleSize = 2;
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const x = drop.x + Math.cos(angle) * 6;
        const y = drop.y - 12 + Math.sin(angle) * 6;
        
        ctx.beginPath();
        ctx.moveTo(x - sparkleSize, y);
        ctx.lineTo(x, y - sparkleSize);
        ctx.lineTo(x + sparkleSize, y);
        ctx.lineTo(x, y + sparkleSize);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    ctx.restore();
  }, []);

  // Performance monitoring
  const updateFPS = useCallback((currentTime: number) => {
    frameCountRef.current++;
    if (currentTime - lastFrameTimeRef.current >= 1000) {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
      lastFrameTimeRef.current = currentTime;
    }
  }, []);

  // Optimized object pool management
  const getParticleFromPool = useCallback((): Particle => {
    return particlePoolRef.current.pop() || {
      id: '',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      size: 0,
      color: '',
      type: 'glow'
    };
  }, []);

  const returnParticleToPool = useCallback((particle: Particle) => {
    if (particlePoolRef.current.length < 200) { // Max pool size
      particlePoolRef.current.push(particle);
    }
  }, []);

  // Main animation loop with performance optimizations
  const animate = useCallback((currentTime: number) => {
    // FPS throttling for consistent performance
    if (currentTime - lastFrameTimeRef.current < targetFrameTime) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    updateFPS(currentTime);
    setTime(currentTime);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable hardware acceleration
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Enhanced cinematic background with depth
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 3, 0,
      canvas.width / 2, canvas.height / 3, canvas.width * 0.8
    );
    
    // Dynamic sky colors with atmospheric perspective
    let skyColors = {
      center: '#87CEEB',
      edge: '#98FB98',
      atmosphere: '#E6F3FF'
    };
    
    if (weather.condition === 'rainy') {
      skyColors = { center: '#4A5568', edge: '#2D3748', atmosphere: '#718096' };
    } else if (weather.condition === 'drought') {
      skyColors = { center: '#FBD38D', edge: '#F6AD55', atmosphere: '#FED7AA' };
    } else if (weather.season === 'autumn') {
      skyColors = { center: '#FF8C00', edge: '#FFB347', atmosphere: '#FFE4B5' };
    } else if (weather.season === 'winter') {
      skyColors = { center: '#B0E0E6', edge: '#87CEEB', atmosphere: '#F0F8FF' };
    } else if (weather.season === 'spring') {
      skyColors = { center: '#98FB98', edge: '#90EE90', atmosphere: '#F0FFF0' };
    } else if (weather.season === 'summer') {
      skyColors = { center: '#87CEEB', edge: '#00BFFF', atmosphere: '#E0F6FF' };
    }
    
    gradient.addColorStop(0, skyColors.center);
    gradient.addColorStop(0.6, skyColors.edge);
    gradient.addColorStop(1, skyColors.atmosphere);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Volumetric atmosphere effect
    const atmosphereGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    atmosphereGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    atmosphereGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
    atmosphereGradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    ctx.fillStyle = atmosphereGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Enhanced layered ground with depth
    const groundHeight = canvas.height * 0.2;
    const groundY = canvas.height * 0.8;
    
    // Base soil layer with texture
    const groundGradient = ctx.createLinearGradient(0, groundY, 0, canvas.height);
    groundGradient.addColorStop(0, '#654321');
    groundGradient.addColorStop(0.3, '#8B4513');
    groundGradient.addColorStop(1, '#A0522D');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, groundY, canvas.width, groundHeight);
    
    // Grass layer with subtle parallax
    ctx.fillStyle = `hsl(120, ${40 + gardenHealth * 30}%, ${25 + gardenHealth * 15}%)`;
    for (let i = 0; i < canvas.width; i += 3) {
      const grassHeight = 8 + Math.sin(i * 0.1 + time * 0.001) * 3;
      const parallaxOffset = Math.sin(i * 0.05 + time * 0.0005) * 1;
      ctx.fillRect(i + parallaxOffset, groundY - grassHeight, 2, grassHeight);
    }

    // Draw volumetric light rays first (behind plants)
    lightRays.forEach(ray => drawLightRay(ctx, ray));

    // Draw plants with enhanced effects
    plants.forEach(plant => drawPlant(ctx, plant));

    // Update and draw particles
    setParticles(prev => prev
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.02, // gravity
        life: particle.life - 1
      }))
      .filter(particle => particle.life > 0)
    );
    
    particles.forEach(particle => drawParticle(ctx, particle));

    // Update and draw bees
    setBees(prev => prev.map(bee => {
      const dx = bee.targetX - bee.x;
      const dy = bee.targetY - bee.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 5) {
        // Choose new target
        return {
          ...bee,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height * 0.8,
          angle: Math.atan2(dy, dx)
        };
      }
      
      const moveX = (dx / distance) * bee.speed;
      const moveY = (dy / distance) * bee.speed;
      
      return {
        ...bee,
        x: bee.x + moveX,
        y: bee.y + moveY,
        angle: Math.atan2(moveY, moveX)
      };
    }));
    
    bees.forEach(bee => drawBee(ctx, bee, currentTime));

    // Update and draw enhanced rain with trails
    setRainDrops(prev => prev
      .map(drop => ({
        ...drop,
        y: drop.y + drop.speed,
        opacity: drop.opacity - 0.002,
        trail: drop.trail.slice(-8).concat([{x: drop.x, y: drop.y, opacity: drop.opacity * 0.7}])
      }))
      .filter(drop => drop.y < canvas.height && drop.opacity > 0)
    );
    
    rainDrops.forEach(drop => drawEnhancedRainDrop(ctx, drop));

    // Update and fade light rays
    setLightRays(prev => prev
      .map(ray => ({
        ...ray,
        opacity: ray.opacity - 0.001,
        length: ray.length + 1
      }))
      .filter(ray => ray.opacity > 0)
    );

    // Draw weeds
    weeds.forEach(weed => drawWeed(ctx, weed));

    // Enhanced weather effects
    if (weather.condition === 'stormy') {
      // Lightning effect with branching
      if (Math.random() < 0.02) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 20;
        
        // Main lightning bolt
        const startX = Math.random() * canvas.width;
        let currentX = startX;
        let currentY = 0;
        
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        
        while (currentY < canvas.height) {
          currentY += 20 + Math.random() * 30;
          currentX += (Math.random() - 0.5) * 60;
          ctx.lineTo(currentX, currentY);
          
          // Random branches
          if (Math.random() < 0.3) {
            ctx.moveTo(currentX, currentY);
            ctx.lineTo(currentX + (Math.random() - 0.5) * 100, currentY + Math.random() * 50);
            ctx.moveTo(currentX, currentY);
          }
        }
        ctx.stroke();
        
        // Flash effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }

    // Fog effect for mysterious atmosphere
    if (weather.condition === 'rainy' || weather.season === 'autumn') {
      ctx.save();
      const fogGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height * 0.9);
      fogGradient.addColorStop(0, 'rgba(200, 200, 200, 0)');
      fogGradient.addColorStop(1, 'rgba(200, 200, 200, 0.3)');
      ctx.fillStyle = fogGradient;
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.3);
      ctx.restore();
    }

    // Garden health indicator
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    const healthBarX = canvas.width - healthBarWidth - 20;
    const healthBarY = 20;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    const healthGradient = ctx.createLinearGradient(healthBarX, 0, healthBarX + healthBarWidth, 0);
    healthGradient.addColorStop(0, '#ff4757');
    healthGradient.addColorStop(0.5, '#ffa502');
    healthGradient.addColorStop(1, '#2ed573');
    
    ctx.fillStyle = healthGradient;
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth * gardenHealth, healthBarHeight);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`Garden Health: ${Math.round(gardenHealth * 100)}%`, healthBarX, healthBarY - 5);

    animationRef.current = requestAnimationFrame(animate);
  }, [plants, bees, rainDrops, weeds, particles, lightRays, weather, gardenHealth, time, mousePos, drawPlant, drawBee, drawEnhancedRainDrop, drawWeed, drawParticle, drawLightRay]);

  // Start animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Update garden health based on various factors
  useEffect(() => {
    const plantHealth = plants.reduce((sum, plant) => sum + calculatePlantGrowth(plant), 0) / plants.length / 100;
    const weedPenalty = weeds.length * 0.1;
    const weatherBonus = weather.condition === 'rainy' ? 0.1 : weather.condition === 'drought' ? -0.2 : 0;
    
    setGardenHealth(prev => {
      const newHealth = Math.max(0, Math.min(1, plantHealth - weedPenalty + weatherBonus));
      return prev + (newHealth - prev) * 0.02; // Smooth transition
    });
  }, [plants, weeds, weather, calculatePlantGrowth]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-sky-200 to-green-200">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Modern Garden Status Panel */}
      <motion.div 
        className="absolute top-6 left-6 glassmorphic border-white/20 rounded-2xl p-6 shadow-2xl backdrop-blur-2xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🌱
            </motion.div>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Money Garden</h3>
            {isEditable && <span className="text-xs text-blue-400 font-medium bg-blue-500/20 px-2 py-1 rounded-full">Interactive Mode</span>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className="text-white/80">Season:</span>
              <span className="capitalize font-semibold text-white">{weather.season}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
              <span className="text-white/80">Weather:</span>
              <span className="capitalize font-semibold text-white">{weather.condition}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              <span className="text-white/80">Market:</span>
              <span className="capitalize font-semibold text-white">{weather.marketSentiment}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
              <span className="text-white/80">Activity:</span>
              <span className="font-semibold text-white">{bees.length + weeds.length}</span>
            </div>
          </div>
        </div>
        
        {/* FPS Counter */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-xs text-white/60">
            FPS: <span className="font-mono font-bold text-green-400">{fpsRef.current}</span>
          </div>
        </div>
      </motion.div>

      {/* Modern Interactive Instructions */}
      {isEditable && (
        <motion.div 
          className="absolute top-6 right-6 glassmorphic border-blue-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.div>
            </div>
            <h4 className="font-bold text-white text-lg">Interactive Mode</h4>
          </div>
          
          <div className="space-y-3">
            {[
              { icon: "🌱", text: "Click empty space to plant", color: "green" },
              { icon: "🖱️", text: "Drag to relocate plants", color: "blue" },
              { icon: "👆", text: "Double-tap to remove", color: "red" },
              { icon: "👁️", text: "Hover for plant insights", color: "purple" }
            ].map((instruction, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <span className="text-lg">{instruction.icon}</span>
                <span className="text-sm text-white/90">{instruction.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Enhanced Plant Tooltip */}
      {hoveredPlant && (
        <motion.div 
          className="absolute pointer-events-none glassmorphic border-white/30 rounded-2xl p-4 text-white text-sm shadow-2xl z-10 backdrop-blur-2xl"
          style={{
            left: mousePos.x * (800 / canvasRef.current?.clientWidth || 1) + 15,
            top: mousePos.y * (600 / canvasRef.current?.clientHeight || 1) - 80
          }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {(() => {
            const plant = plants.find(p => p.id === hoveredPlant);
            if (!plant) return null;
            const progress = (plant.value / plant.target) * 100;
            return (
              <div className="min-w-48">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-lg">
                    {plant.species === 'rose' ? '🌹' : 
                     plant.species === 'sunflower' ? '🌻' :
                     plant.species === 'oak' ? '🌳' :
                     plant.species === 'bamboo' ? '🎋' :
                     plant.species === 'lily' ? '🌺' : '🌵'}
                  </div>
                  <div>
                    <div className="font-bold text-white">{plant.name}</div>
                    <div className="text-xs text-white/70 capitalize">{plant.species} • {plant.type}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80">Progress</span>
                    <span className="font-mono text-green-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">${plant.value.toLocaleString()}</span>
                    <span className="text-white/60">${plant.target.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Add Plant Modal */}
      {showAddPlantModal && isEditable && onPlantAdd && (
        <AddPlantModal
          position={addPlantPosition}
          onClose={() => setShowAddPlantModal(false)}
          onAdd={(plantData) => {
            onPlantAdd({
              ...plantData,
              x: addPlantPosition.x,
              y: addPlantPosition.y,
              health: 0.8,
              lastWatered: Date.now()
            });
            setShowAddPlantModal(false);
          }}
        />
      )}

      {/* Modern Legend */}
      <motion.div 
        className="absolute bottom-6 left-6 glassmorphic border-white/20 rounded-2xl p-6 shadow-2xl backdrop-blur-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-sm">
            📖
          </div>
          <h4 className="font-bold text-white text-lg">Garden Guide</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: "🌸", label: "Plants", description: "Your financial goals", color: "from-green-400 to-emerald-500" },
            { icon: "🐝", label: "Bees", description: "Money transfers", color: "from-yellow-400 to-orange-500" },
            { icon: "🌧️", label: "Rain", description: "Income flow", color: "from-blue-400 to-cyan-500" },
            { icon: "🥀", label: "Weeds", description: "Wasteful spending", color: "from-red-400 to-rose-500" },
            { icon: "☀️", label: "Weather", description: "Market conditions", color: "from-amber-400 to-yellow-500" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + index * 0.1 }}
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center text-sm`}>
                {item.icon}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{item.label}</div>
                <div className="text-white/60 text-xs">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Add Plant Modal Component
interface AddPlantModalProps {
  position: { x: number; y: number };
  onClose: () => void;
  onAdd: (plantData: {
    type: Plant['type'];
    name: string;
    value: number;
    target: number;
    growth: number;
    species: Plant['species'];
  }) => void;
}

const AddPlantModal: React.FC<AddPlantModalProps> = ({ position, onClose, onAdd }) => {
  const [plantData, setPlantData] = useState({
    type: 'savings' as Plant['type'],
    name: '',
    value: 0,
    target: 1000,
    species: 'rose' as Plant['species']
  });

  const plantTypes = [
    { value: 'savings', label: 'Savings Goal', color: 'blue' },
    { value: 'investment', label: 'Investment', color: 'purple' },
    { value: 'emergency', label: 'Emergency Fund', color: 'green' },
    { value: 'retirement', label: 'Retirement', color: 'orange' }
  ];

  const speciesOptions = [
    { value: 'rose', label: '🌹 Rose', description: 'Beautiful and classic' },
    { value: 'sunflower', label: '🌻 Sunflower', description: 'Bright and optimistic' },
    { value: 'oak', label: '🌳 Oak Tree', description: 'Strong and enduring' },
    { value: 'bamboo', label: '🎋 Bamboo', description: 'Fast growing' },
    { value: 'lily', label: '🌺 Lily', description: 'Elegant and pure' },
    { value: 'cactus', label: '🌵 Cactus', description: 'Resilient and hardy' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plantData.name.trim()) {
      onAdd({
        ...plantData,
        growth: (plantData.value / plantData.target) * 100
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="glassmorphic border-white/30 rounded-3xl p-8 shadow-2xl max-w-lg w-full mx-4 backdrop-blur-2xl"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-2xl">
            🌱
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Plant New Goal</h3>
            <p className="text-white/70 text-sm">Create a financial goal that will grow in your garden</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plant Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Plant Name</label>
            <input
              type="text"
              value={plantData.name}
              onChange={(e) => setPlantData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all"
              placeholder="e.g., Vacation Fund, New Car..."
              required
            />
          </div>

          {/* Plant Type */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Goal Type</label>
            <select
              value={plantData.type}
              onChange={(e) => setPlantData(prev => ({ ...prev, type: e.target.value as Plant['type'] }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all"
            >
              {plantTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Species */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plant Species</label>
            <select
              value={plantData.species}
              onChange={(e) => setPlantData(prev => ({ ...prev, species: e.target.value as Plant['species'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {speciesOptions.map(species => (
                <option key={species.value} value={species.value}>
                  {species.label} - {species.description}
                </option>
              ))}
            </select>
          </div>

          {/* Financial Values */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
              <input
                type="number"
                value={plantData.value}
                onChange={(e) => setPlantData(prev => ({ ...prev, value: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
              <input
                type="number"
                value={plantData.target}
                onChange={(e) => setPlantData(prev => ({ ...prev, target: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Progress Display */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Progress: {Math.round((plantData.value / plantData.target) * 100)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((plantData.value / plantData.target) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-white/80 bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              🌱 Plant Goal
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MoneyGarden;