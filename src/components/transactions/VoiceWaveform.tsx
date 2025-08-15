'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface VoiceWaveformProps {
  isRecording: boolean;
  amplitude?: number;
  className?: string;
}

export default function VoiceWaveform({ isRecording, amplitude = 0.5, className = '' }: VoiceWaveformProps) {
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0));
  const controls = useAnimation();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRecording) {
      // Simulate audio input with random levels
      intervalRef.current = setInterval(() => {
        setAudioLevels(prev => 
          prev.map((_, index) => {
            // Create a wave-like pattern with some randomness
            const wave = Math.sin((Date.now() / 200) + (index * 0.5)) * 0.5 + 0.5;
            const random = Math.random() * 0.3;
            return Math.min(1, (wave + random) * amplitude);
          })
        );
      }, 50);

      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      });
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setAudioLevels(Array(20).fill(0));
      controls.stop();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, amplitude, controls]);

  return (
    <motion.div 
      className={`flex items-center justify-center gap-1 h-16 ${className}`}
      animate={controls}
    >
      {audioLevels.map((level, index) => (
        <motion.div
          key={`audio-level-${index}-${Date.now()}`}
          className="w-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full"
          animate={{
            height: `${Math.max(4, level * 60)}px`,
            opacity: isRecording ? [0.4, 1, 0.4] : 0.2,
          }}
          transition={{
            duration: 0.1,
            opacity: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
          }}
          style={{
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </motion.div>
  );
}