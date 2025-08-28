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
}

const MoneyGarden: React.FC<MoneyGardenProps> = ({
  plants,
  recentTransfers,
  monthlyIncome,
  monthlyExpenses,
  unnecessarySubscriptions,
  marketCondition
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Garden state
  const [bees, setBees] = useState<Bee[]>([]);
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const [weeds, setWeeds] = useState<Weed[]>([]);
  const [weather, setWeather] = useState<WeatherSystem>({
    season: 'spring',
    condition: 'sunny',
    intensity: 0.5,
    marketSentiment: 'neutral'
  });
  
  const [time, setTime] = useState(0);
  const [gardenHealth, setGardenHealth] = useState(0.8);

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

  // Rain effect for income
  useEffect(() => {
    if (weather.condition === 'rainy') {
      const interval = setInterval(() => {
        setRainDrops(prev => [
          ...prev.slice(-50), // Keep only last 50 drops
          {
            id: `rain-${Date.now()}`,
            x: Math.random() * 800,
            y: -10,
            speed: 3 + Math.random() * 4,
            opacity: 0.6 + Math.random() * 0.4,
            value: monthlyIncome / 1000
          }
        ]);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [weather.condition, monthlyIncome]);

  // Plant growth calculation
  const calculatePlantGrowth = useCallback((plant: Plant): number => {
    const progressRatio = plant.value / plant.target;
    const baseGrowth = Math.min(progressRatio, 1) * 100;
    const marketBonus = weather.marketSentiment === 'bullish' ? 10 : weather.marketSentiment === 'bearish' ? -5 : 0;
    const seasonBonus = weather.season === 'spring' ? 15 : weather.season === 'summer' ? 10 : weather.season === 'autumn' ? 5 : 0;
    const droughtPenalty = weather.condition === 'drought' ? -20 : 0;
    
    return Math.max(0, Math.min(100, baseGrowth + marketBonus + seasonBonus + droughtPenalty));
  }, [weather]);

  // Draw plant based on species and growth
  const drawPlant = useCallback((ctx: CanvasRenderingContext2D, plant: Plant) => {
    const growth = calculatePlantGrowth(plant);
    const baseHeight = 60 + (growth / 100) * 40;
    const x = plant.x;
    const y = plant.y;

    ctx.save();

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

  // Main animation loop
  const animate = useCallback((currentTime: number) => {
    setTime(currentTime);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with garden background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    // Sky color based on weather and season
    let skyColors = {
      top: '#87CEEB',
      bottom: '#98FB98'
    };
    
    if (weather.condition === 'rainy') {
      skyColors = { top: '#696969', bottom: '#87CEEB' };
    } else if (weather.condition === 'drought') {
      skyColors = { top: '#DEB887', bottom: '#F4A460' };
    } else if (weather.season === 'autumn') {
      skyColors = { top: '#FF8C00', bottom: '#FFE4B5' };
    } else if (weather.season === 'winter') {
      skyColors = { top: '#B0C4DE', bottom: '#F0F8FF' };
    }
    
    gradient.addColorStop(0, skyColors.top);
    gradient.addColorStop(1, skyColors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.8, 0, canvas.height);
    groundGradient.addColorStop(0, '#8B4513');
    groundGradient.addColorStop(1, '#A0522D');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);

    // Draw plants
    plants.forEach(plant => drawPlant(ctx, plant));

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

    // Update and draw rain
    setRainDrops(prev => prev
      .map(drop => ({
        ...drop,
        y: drop.y + drop.speed,
        opacity: drop.opacity - 0.002
      }))
      .filter(drop => drop.y < canvas.height && drop.opacity > 0)
    );
    
    rainDrops.forEach(drop => drawRainDrop(ctx, drop));

    // Draw weeds
    weeds.forEach(weed => drawWeed(ctx, weed));

    // Weather effects
    if (weather.condition === 'stormy') {
      // Lightning effect
      if (Math.random() < 0.01) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
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
  }, [plants, bees, rainDrops, weeds, weather, gardenHealth, drawPlant, drawBee, drawRainDrop, drawWeed]);

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
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Garden controls and info overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <h3 className="font-bold text-green-800 mb-2">🌱 Money Garden</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <div>Season: <span className="capitalize font-medium">{weather.season}</span></div>
          <div>Weather: <span className="capitalize font-medium">{weather.condition}</span></div>
          <div>Market: <span className="capitalize font-medium">{weather.marketSentiment}</span></div>
          <div>Active Bees: <span className="font-medium">{bees.length}</span></div>
          <div>Weeds: <span className="font-medium text-red-600">{weeds.length}</span></div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <h4 className="font-bold text-green-800 mb-2">Legend</h4>
        <div className="text-xs text-gray-700 space-y-1">
          <div>🌸 Plants = Your savings & investments</div>
          <div>🐝 Bees = Money transfers between accounts</div>
          <div>🌧️ Rain = Income flowing into your garden</div>
          <div>🥀 Weeds = Unnecessary subscriptions</div>
          <div>☀️ Weather = Current market conditions</div>
        </div>
      </div>
    </div>
  );
};

export default MoneyGarden;