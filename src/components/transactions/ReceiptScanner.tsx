'use client';

import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Camera, Square, Check, X, Zap, Scan, RefreshCw } from 'lucide-react';

interface ScannedData {
  merchant: string;
  amount: number;
  date: string;
  items: string[];
  confidence: number;
}

interface ReceiptScannerProps {
  onScanComplete: (data: ScannedData) => void;
  onCancel: () => void;
  className?: string;
}

export default function ReceiptScanner({ onScanComplete, onCancel, className = '' }: ReceiptScannerProps) {
  const [scanningState, setScanningState] = useState<'idle' | 'scanning' | 'processing' | 'complete' | 'error'>('idle');
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [cornerDetection, setCornerDetection] = useState(false);
  const [edgePoints, setEdgePoints] = useState<{ x: number; y: number }[]>([]);
  
  const scannerRef = useRef<HTMLDivElement>(null);
  const scanLineControls = useAnimation();
  const pulseControls = useAnimation();

  useEffect(() => {
    if (scanningState === 'scanning') {
      // Animate scan line
      scanLineControls.start({
        y: [0, 200, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      });

      // Simulate edge detection
      setTimeout(() => {
        setCornerDetection(true);
        setEdgePoints([
          { x: 20, y: 20 },
          { x: 180, y: 25 },
          { x: 175, y: 155 },
          { x: 25, y: 150 }
        ]);
      }, 1500);

      // Move to processing
      setTimeout(() => {
        setScanningState('processing');
        scanLineControls.stop();
      }, 3000);
    }

    if (scanningState === 'processing') {
      pulseControls.start({
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      });

      // Simulate OCR processing
      setTimeout(() => {
        const mockData: ScannedData = {
          merchant: 'Target Store #1234',
          amount: 47.89,
          date: new Date().toLocaleDateString(),
          items: [
            'Organic Bananas',
            'Greek Yogurt',
            'Whole Grain Bread',
            'Household Items'
          ],
          confidence: 0.94
        };
        setScannedData(mockData);
        setScanningState('complete');
        pulseControls.stop();
      }, 2500);
    }
  }, [scanningState, scanLineControls, pulseControls]);

  const startScanning = () => {
    setScanningState('scanning');
    setCornerDetection(false);
    setEdgePoints([]);
  };

  const retryScanning = () => {
    setScanningState('idle');
    setScannedData(null);
    setCornerDetection(false);
    setEdgePoints([]);
  };

  const confirmScan = () => {
    if (scannedData) {
      onScanComplete(scannedData);
    }
  };

  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Receipt Scanner</h2>
          <p className="text-gray-400 text-sm">Position receipt in the frame</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Scanner Area */}
      <motion.div
        ref={scannerRef}
        className="relative bg-black/50 rounded-2xl overflow-hidden mb-6"
        style={{ aspectRatio: '4/3' }}
        animate={scanningState === 'processing' ? pulseControls : {}}
      >
        {/* Camera preview simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 opacity-30" />
        
        {/* Mock receipt image */}
        <motion.div
          className="absolute inset-4 bg-white/90 rounded-lg shadow-lg p-4 text-black text-xs"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: scanningState !== 'idle' ? 1 : 0.3, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center font-bold mb-2">TARGET</div>
          <div className="text-center text-xs mb-3">Store #1234 • 123 Main St</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Organic Bananas</span>
              <span>$3.99</span>
            </div>
            <div className="flex justify-between">
              <span>Greek Yogurt</span>
              <span>$4.99</span>
            </div>
            <div className="flex justify-between">
              <span>Whole Grain Bread</span>
              <span>$2.49</span>
            </div>
            <div className="flex justify-between">
              <span>Household Items</span>
              <span>$36.42</span>
            </div>
            <div className="border-t pt-1 mt-2 font-bold flex justify-between">
              <span>TOTAL</span>
              <span>$47.89</span>
            </div>
          </div>
        </motion.div>

        {/* Corner detection overlay */}
        <AnimatePresence>
          {cornerDetection && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {edgePoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="absolute w-4 h-4 border-2 border-green-400"
                  style={{
                    left: point.x,
                    top: point.y,
                    borderRadius: index % 2 === 0 ? '4px 0 0 0' : '0 4px 0 0'
                  }}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    boxShadow: ['0 0 0px #10B981', '0 0 20px #10B981', '0 0 10px #10B981']
                  }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                />
              ))}
              
              {/* Connect corners with lines */}
              <svg className="absolute inset-0 w-full h-full">
                <motion.polygon
                  points={edgePoints.map(p => `${p.x + 8},${p.y + 8}`).join(' ')}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning overlay */}
        {scanningState === 'scanning' && (
          <motion.div
            className="absolute inset-0 bg-blue-500/20 border-2 border-blue-400 rounded-2xl"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              animate={scanLineControls}
            />
            
            {/* Corner brackets */}
            {[
              { top: 4, left: 4, rotate: 0 },
              { top: 4, right: 4, rotate: 90 },
              { bottom: 4, right: 4, rotate: 180 },
              { bottom: 4, left: 4, rotate: 270 },
            ].map((pos, index) => (
              <motion.div
                key={index}
                className="absolute w-6 h-6 border-l-2 border-t-2 border-blue-400"
                style={{ ...pos, transform: `rotate(${pos.rotate}deg)` }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              />
            ))}
          </motion.div>
        )}

        {/* Processing overlay */}
        {scanningState === 'processing' && (
          <motion.div
            className="absolute inset-0 bg-purple-500/20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 border-4 border-purple-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-white font-medium">Processing Receipt...</p>
              <p className="text-purple-400 text-sm mt-1">OCR Analysis in progress</p>
            </div>
          </motion.div>
        )}

        {/* Success overlay */}
        {scanningState === 'complete' && (
          <motion.div
            className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="text-center"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-white font-medium">Scan Complete!</p>
              <p className="text-green-400 text-sm">Receipt data extracted</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Controls */}
      <div className="space-y-4">
        {scanningState === 'idle' && (
          <motion.button
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white font-semibold flex items-center justify-center gap-3 hover:from-blue-600 hover:to-blue-700 transition-all"
            onClick={startScanning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Scan className="w-5 h-5" />
            Start Scanning
          </motion.button>
        )}

        {scanningState === 'scanning' && (
          <div className="text-center">
            <p className="text-blue-400 font-medium">Detecting receipt edges...</p>
            <p className="text-gray-400 text-sm mt-1">Hold steady for best results</p>
          </div>
        )}

        {scanningState === 'processing' && (
          <div className="text-center">
            <p className="text-purple-400 font-medium">Extracting text data...</p>
            <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
          </div>
        )}

        {scanningState === 'complete' && scannedData && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Scanned data preview */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Extracted Data</h3>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    {Math.round(scannedData.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Merchant:</span>
                  <span className="text-white">{scannedData.merchant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-semibold">${scannedData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{scannedData.date}</span>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <span className="text-gray-400 text-xs">Items:</span>
                  <div className="mt-1 space-y-1">
                    {scannedData.items.map((item, index) => (
                      <motion.div
                        key={index}
                        className="text-white text-xs"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        • {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <motion.button
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                onClick={confirmScan}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Use This Data
              </motion.button>
              <motion.button
                className="px-4 py-3 bg-white/10 rounded-xl text-gray-400 hover:bg-white/20 hover:text-white transition-all"
                onClick={retryScanning}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}