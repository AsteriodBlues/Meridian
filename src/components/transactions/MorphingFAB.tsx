'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Plus, X, Mic, Camera, Sparkles } from 'lucide-react';
import { createPortal } from 'react-dom';

interface MorphingFABProps {
  onAddTransaction: (data: any) => void;
}

export default function MorphingFAB({ onAddTransaction }: MorphingFABProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState<'options' | 'voice' | 'camera' | 'manual'>('options');
  const [isRecording, setIsRecording] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const fabRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!fabRef.current) return;
    
    const rect = fabRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const openModal = () => {
    setIsExpanded(true);
    setCurrentStep('options');
  };

  const closeModal = () => {
    setIsExpanded(false);
    setCurrentStep('options');
    setIsRecording(false);
  };

  const handleOptionSelect = (option: 'voice' | 'camera' | 'manual') => {
    setCurrentStep(option);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Confetti particles
  const ConfettiParticle = ({ delay }: { delay: number }) => (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        backgroundColor: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 5)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      initial={{ scale: 0, opacity: 1, y: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [1, 1, 0],
        y: [0, -100 - Math.random() * 100],
        x: [0, (Math.random() - 0.5) * 200],
        rotate: [0, Math.random() * 360],
      }}
      transition={{
        duration: 2,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );

  const modalContent = isExpanded && mounted ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      />
      
      {/* Modal content */}
      <motion.div
        className="relative bg-luxury-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
        style={{ 
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto'
        }}
      >
        {/* Close button */}
        <motion.button
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          onClick={closeModal}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4 text-white" />
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-6 mt-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-white mb-2">Add Transaction</h2>
          <p className="text-gray-400 text-sm">Choose how you'd like to add it</p>
        </motion.div>

        {/* Content based on current step */}
        <AnimatePresence mode="wait">
          {currentStep === 'options' && (
            <motion.div
              key="options"
              className="space-y-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {/* Voice input option */}
              <motion.button
                className="w-full p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center gap-4 hover:from-purple-500/30 hover:to-purple-600/30 transition-all"
                onClick={() => handleOptionSelect('voice')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold">Voice Input</h3>
                  <p className="text-gray-400 text-sm">Say your transaction details</p>
                </div>
                <Sparkles className="w-5 h-5 text-purple-400" />
              </motion.button>

              {/* Camera scanner option */}
              <motion.button
                className="w-full p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center gap-4 hover:from-blue-500/30 hover:to-blue-600/30 transition-all"
                onClick={() => handleOptionSelect('camera')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold">Scan Receipt</h3>
                  <p className="text-gray-400 text-sm">Capture receipt details automatically</p>
                </div>
                <Sparkles className="w-5 h-5 text-blue-400" />
              </motion.button>

              {/* Manual entry option */}
              <motion.button
                className="w-full p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl flex items-center gap-4 hover:from-green-500/30 hover:to-green-600/30 transition-all"
                onClick={() => handleOptionSelect('manual')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold">Manual Entry</h3>
                  <p className="text-gray-400 text-sm">Type transaction details</p>
                </div>
              </motion.button>
            </motion.div>
          )}

          {currentStep === 'voice' && (
            <VoiceInput
              onBack={() => setCurrentStep('options')}
              onComplete={(data) => {
                onAddTransaction(data);
                triggerConfetti();
                closeModal();
              }}
            />
          )}

          {currentStep === 'camera' && (
            <CameraScanner
              onBack={() => setCurrentStep('options')}
              onComplete={(data) => {
                onAddTransaction(data);
                triggerConfetti();
                closeModal();
              }}
            />
          )}

          {currentStep === 'manual' && (
            <ManualEntry
              onBack={() => setCurrentStep('options')}
              onComplete={(data) => {
                onAddTransaction(data);
                triggerConfetti();
                closeModal();
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  ) : null;

  const confettiContent = showConfetti && mounted ? (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {Array.from({ length: 50 }).map((_, i) => (
        <ConfettiParticle key={`confetti-${i}`} delay={i * 0.05} />
      ))}
    </motion.div>
  ) : null;

  return (
    <>

      {/* Confetti rendered via portal */}
      {mounted && confettiContent && createPortal(
        <AnimatePresence>
          {confettiContent}
        </AnimatePresence>,
        document.body
      )}

      {/* Modal rendered via portal */}
      {mounted && modalContent && createPortal(
        <AnimatePresence>
          {modalContent}
        </AnimatePresence>,
        document.body
      )}

      {/* FAB */}
      <motion.div
        ref={fabRef}
        className="fixed bottom-8 right-8 z-40"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1000,
        }}
      >
        <AnimatePresence mode="wait">
          {!isExpanded && (
            // Collapsed FAB
            <motion.button
              key="fab"
              className="relative w-16 h-16 bg-gradient-to-r from-wisdom-500 to-trust-500 rounded-full shadow-lg flex items-center justify-center group overflow-hidden"
              onClick={openModal}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-wisdom-600 to-trust-600 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 0.6, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-wisdom-400 to-trust-400 rounded-full blur-lg opacity-0 group-hover:opacity-60"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Plus icon */}
              <motion.div
                className="relative z-10"
                animate={{
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Plus className="w-8 h-8 text-white" />
              </motion.div>
              
              {/* Sparkle effects */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`fab-sparkle-${i}`}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${20 + i * 15}%`,
                    right: `${10 + i * 10}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

// Voice Input Component
const VoiceInput = ({ onBack, onComplete }: { onBack: () => void; onComplete: (data: any) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recognition
      setTimeout(() => {
        setTranscript('Bought coffee at Starbucks for $4.50');
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={onBack}
        className="text-gray-400 hover:text-white transition-colors"
      >
        ← Back
      </button>

      <div className="text-center">
        <motion.button
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            isRecording 
              ? 'bg-red-500 shadow-lg shadow-red-500/50' 
              : 'bg-purple-500 hover:bg-purple-600'
          }`}
          onClick={toggleRecording}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
        >
          <Mic className="w-10 h-10 text-white" />
        </motion.button>
        
        <p className="text-white mt-4">
          {isRecording ? 'Listening...' : 'Tap to start recording'}
        </p>
        
        {transcript && (
          <motion.div
            className="mt-4 p-4 bg-white/10 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-green-400">{transcript}</p>
            <button
              onClick={() => onComplete({ transcript })}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Transaction
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Camera Scanner Component
const CameraScanner = ({ onBack, onComplete }: { onBack: () => void; onComplete: (data: any) => void }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);

  const startScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setScannedData({
        merchant: 'Target',
        amount: 42.99,
        items: ['Groceries', 'Household items']
      });
      setIsScanning(false);
    }, 3000);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={onBack}
        className="text-gray-400 hover:text-white transition-colors"
      >
        ← Back
      </button>

      <div className="text-center">
        {!isScanning && !scannedData && (
          <motion.button
            className="w-full h-48 border-2 border-dashed border-blue-400 rounded-2xl flex flex-col items-center justify-center hover:border-blue-300 transition-colors"
            onClick={startScan}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Camera className="w-12 h-12 text-blue-400 mb-4" />
            <p className="text-white">Tap to scan receipt</p>
          </motion.button>
        )}

        {isScanning && (
          <motion.div
            className="w-full h-48 bg-blue-500/20 rounded-2xl flex items-center justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="text-center">
              <Camera className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <p className="text-white">Scanning receipt...</p>
            </div>
          </motion.div>
        )}

        {scannedData && (
          <motion.div
            className="p-4 bg-white/10 rounded-xl text-left"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-white font-semibold mb-2">Scanned Receipt</h3>
            <p className="text-gray-300">Merchant: {scannedData.merchant}</p>
            <p className="text-gray-300">Amount: ${scannedData.amount}</p>
            <button
              onClick={() => onComplete(scannedData)}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Transaction
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Manual Entry Component
const ManualEntry = ({ onBack, onComplete }: { onBack: () => void; onComplete: (data: any) => void }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (amount && description) {
      onComplete({ amount: parseFloat(amount), description });
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={onBack}
        className="text-gray-400 hover:text-white transition-colors"
      >
        ← Back
      </button>

      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors"
            placeholder="Coffee at Starbucks"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!amount || !description}
          className="w-full px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Add Transaction
        </button>
      </div>
    </motion.div>
  );
};