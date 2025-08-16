'use client';

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  DollarSign, CreditCard, Receipt, Target, 
  Home, Car, ShoppingCart, Utensils, Heart,
  ArrowUpRight, ArrowDownRight, RotateCcw
} from 'lucide-react';

interface Envelope {
  id: string;
  name: string;
  allocated: number;
  remaining: number;
  color: string;
  icon: React.ElementType;
  transactions: Transaction[];
  isOpen?: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

interface EnvelopeSystemProps {
  envelopes: Envelope[];
  onEnvelopeClick?: (envelope: Envelope) => void;
  onMoneyTransfer?: (fromId: string, toId: string, amount: number) => void;
  className?: string;
}

export default function EnvelopeSystem({ 
  envelopes, 
  onEnvelopeClick, 
  onMoneyTransfer,
  className = '' 
}: EnvelopeSystemProps) {
  const [selectedEnvelope, setSelectedEnvelope] = useState<string | null>(null);
  const [draggedMoney, setDraggedMoney] = useState<number | null>(null);
  const [transferMode, setTransferMode] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Paper texture animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const handleEnvelopeClick = (envelope: Envelope) => {
    setSelectedEnvelope(selectedEnvelope === envelope.id ? null : envelope.id);
    onEnvelopeClick?.(envelope);
  };

  const getEnvelopeUsage = (envelope: Envelope) => {
    return ((envelope.allocated - envelope.remaining) / envelope.allocated) * 100;
  };

  const getEnvelopeStatus = (envelope: Envelope) => {
    const usage = getEnvelopeUsage(envelope);
    if (usage >= 90) return 'critical';
    if (usage >= 70) return 'warning';
    return 'good';
  };

  // Paper texture SVG pattern
  const PaperTexture = ({ id }: { id: string }) => (
    <defs>
      <pattern id={`paper-${id}`} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="#f8f6f0" />
        <circle cx="20" cy="20" r="1" fill="#f0ebe0" opacity="0.5" />
        <circle cx="60" cy="30" r="0.5" fill="#e8e0d0" opacity="0.7" />
        <circle cx="40" cy="60" r="1.5" fill="#f0ebe0" opacity="0.3" />
        <circle cx="80" cy="80" r="0.8" fill="#e8e0d0" opacity="0.6" />
        <path d="M10,10 L90,90 M20,90 L90,20" stroke="#f0ebe0" strokeWidth="0.2" opacity="0.3" />
        <rect x="30" y="15" width="40" height="0.5" fill="#e8e0d0" opacity="0.4" />
        <rect x="25" y="25" width="50" height="0.3" fill="#e8e0d0" opacity="0.3" />
      </pattern>
      
      <filter id={`paper-shadow-${id}`}>
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
        <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
      </filter>
      
      <filter id={`inner-shadow-${id}`}>
        <feOffset dx="0" dy="1" />
        <feGaussianBlur stdDeviation="1" result="offset-blur" />
        <feFlood floodColor="#d4af37" floodOpacity="0.1" />
        <feComposite in2="offset-blur" operator="in" />
      </filter>
    </defs>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Transfer mode toggle */}
      <motion.div
        className="absolute top-0 right-0 z-20 flex gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          className={`px-4 py-2 rounded-xl transition-all ${
            transferMode 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-white/10 text-gray-400 hover:text-white'
          }`}
          onClick={() => setTransferMode(!transferMode)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUpRight className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          className="px-4 py-2 rounded-xl bg-white/10 text-gray-400 hover:text-white transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Envelopes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {envelopes.map((envelope, index) => {
          const Icon = envelope.icon;
          const usage = getEnvelopeUsage(envelope);
          const status = getEnvelopeStatus(envelope);
          const isSelected = selectedEnvelope === envelope.id;
          const isOpen = envelope.isOpen || isSelected;

          // Envelope tilt based on remaining money
          const tilt = (envelope.remaining / envelope.allocated) * 5 - 2.5;

          return (
            <motion.div
              key={envelope.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotateX: isOpen ? 0 : -15,
                rotateY: tilt,
                scale: transferMode ? 0.95 : 1
              }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.6,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ 
                y: -10, 
                rotateX: 0,
                transition: { duration: 0.3 }
              }}
              onClick={() => handleEnvelopeClick(envelope)}
              style={{ perspective: 1000 }}
            >
              {/* Envelope shadow */}
              <motion.div
                className="absolute inset-0 bg-black/20 rounded-lg"
                style={{
                  filter: 'blur(10px)',
                  transform: 'translateY(8px) rotateX(90deg) scale(0.9)',
                }}
                animate={{
                  opacity: isOpen ? 0.1 : 0.3
                }}
              />

              {/* Main envelope */}
              <motion.div
                className="relative w-full h-48 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  borderColor: status === 'critical' ? '#ef4444' : 
                              status === 'warning' ? '#f59e0b' : '#10b981'
                }}
              >
                <svg className="absolute inset-0 w-full h-full">
                  <PaperTexture id={envelope.id} />
                  <rect 
                    width="100%" 
                    height="100%" 
                    fill={`url(#paper-${envelope.id})`}
                    filter={`url(#paper-shadow-${envelope.id})`}
                  />
                </svg>

                {/* Paper grain animation */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at ${20 + animationPhase * 30}% ${30 + animationPhase * 20}%, rgba(210, 180, 140, 0.1) 0%, transparent 50%)`
                  }}
                  animate={{
                    background: [
                      'radial-gradient(circle at 20% 30%, rgba(210, 180, 140, 0.1) 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 70%, rgba(210, 180, 140, 0.1) 0%, transparent 50%)',
                      'radial-gradient(circle at 50% 50%, rgba(210, 180, 140, 0.1) 0%, transparent 50%)',
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Envelope flap */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-200 to-amber-300"
                  style={{
                    clipPath: isOpen 
                      ? 'polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)'
                      : 'polygon(0 0, 100% 0, 90% 80%, 50% 100%, 10% 80%)',
                    transformOrigin: 'top center',
                  }}
                  animate={{
                    rotateX: isOpen ? 180 : 0,
                    z: isOpen ? 20 : 0
                  }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  {/* Flap texture */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                  
                  {/* Wax seal */}
                  <motion.div
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full"
                    style={{ backgroundColor: envelope.color }}
                    animate={{
                      scale: isOpen ? 0 : 1,
                      opacity: isOpen ? 0 : 1
                    }}
                  >
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                    <Icon className="absolute inset-0 m-auto w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>

                {/* Envelope content */}
                <div className="relative p-4 pt-20 h-full flex flex-col">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: envelope.color }}
                        animate={{
                          boxShadow: [
                            `0 0 0px ${envelope.color}`,
                            `0 0 20px ${envelope.color}40`,
                            `0 0 0px ${envelope.color}`
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </motion.div>
                      <h3 className="font-semibold text-amber-900">{envelope.name}</h3>
                    </div>
                    
                    {status === 'critical' && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, -5, 5, 0]
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <span className="text-red-500 text-xs font-bold">LOW!</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Money visualization */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="relative h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-lg overflow-hidden mb-3">
                      
                      {/* Money stack */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 to-green-400"
                        style={{
                          height: `${(envelope.remaining / envelope.allocated) * 100}%`,
                          background: `linear-gradient(to top, 
                            ${status === 'critical' ? '#dc2626' : status === 'warning' ? '#d97706' : '#059669'}, 
                            ${status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981'})`
                        }}
                        animate={{
                          height: `${(envelope.remaining / envelope.allocated) * 100}%`
                        }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      >
                        {/* Money shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      </motion.div>

                      {/* Money bills floating */}
                      <AnimatePresence>
                        {envelope.remaining > 0 && Array.from({ length: Math.min(3, Math.ceil(envelope.remaining / 100)) }).map((_, billIndex) => (
                          <motion.div
                            key={`bill-${billIndex}`}
                            className="absolute w-8 h-5 bg-green-500 rounded-sm"
                            style={{
                              left: `${10 + billIndex * 20}%`,
                              bottom: `${20 + billIndex * 15}%`,
                              background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            animate={{
                              y: [0, -2, 0],
                              rotateZ: [0, 1, -1, 0]
                            }}
                            transition={{
                              duration: 2 + billIndex * 0.5,
                              repeat: Infinity,
                              delay: billIndex * 0.2
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-sm" />
                            <DollarSign className="absolute inset-0 m-auto w-3 h-3 text-white opacity-80" />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Amount display */}
                    <div className="text-center">
                      <motion.div
                        className={`text-xl font-bold ${
                          status === 'critical' ? 'text-red-600' : 
                          status === 'warning' ? 'text-amber-600' : 'text-green-600'
                        }`}
                        animate={{
                          scale: status === 'critical' ? [1, 1.05, 1] : 1
                        }}
                        transition={{ duration: 1, repeat: status === 'critical' ? Infinity : 0 }}
                      >
                        ${envelope.remaining.toLocaleString()}
                      </motion.div>
                      <div className="text-xs text-amber-700">
                        of ${envelope.allocated.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Usage progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-amber-700 mb-1">
                      <span>Used</span>
                      <span>{usage.toFixed(0)}%</span>
                    </div>
                    <div className="h-1 bg-amber-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          status === 'critical' ? 'bg-red-500' : 
                          status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${usage}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Transferable money (drag handle) */}
                {transferMode && envelope.remaining > 0 && (
                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileDrag={{ scale: 1.2, z: 100 }}
                    style={{
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    <DollarSign className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Paper creases */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-16 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />
                  <div className="absolute top-20 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
                  <div className="absolute bottom-12 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />
                </div>
              </motion.div>

              {/* Recent transactions (when open) */}
              <AnimatePresence>
                {isSelected && envelope.transactions.length > 0 && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 z-10"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Transactions</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {envelope.transactions.slice(0, 3).map((transaction) => (
                        <motion.div
                          key={transaction.id}
                          className="flex items-center justify-between text-xs"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="flex items-center gap-2">
                            {transaction.type === 'income' ? (
                              <ArrowDownRight className="w-3 h-3 text-green-500" />
                            ) : (
                              <ArrowUpRight className="w-3 h-3 text-red-500" />
                            )}
                            <span className="text-gray-600">{transaction.description}</span>
                          </div>
                          <span className={`font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}