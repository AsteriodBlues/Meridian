'use client'

import { useRef, useState, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
}

export function MagneticButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return
    
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    const x = (clientX - centerX) / 5
    const y = (clientY - centerY) / 5
    
    setPosition({ x, y })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }[size]

  const variantClasses = {
    primary: 'bg-gradient-to-r from-wisdom-500 to-wisdom-600 text-white hover:from-wisdom-600 hover:to-wisdom-700 shadow-lg hover:shadow-wisdom-500/25',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    ghost: 'text-white hover:bg-white/10',
  }[variant]

  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative rounded-xl font-medium transition-all duration-300',
        'backdrop-blur-md',
        sizeClasses,
        variantClasses,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <>
          {/* Magnetic hover glow */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-wisdom-400 to-wisdom-600 opacity-0 blur-xl"
            animate={{ opacity: position.x || position.y ? 0.3 : 0 }}
            transition={{ duration: 0.2 }}
          />
          {/* Breathing glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-wisdom-500/30 via-trust-500/30 to-growth-500/30 animate-pulse -z-10 blur-sm" />
        </>
      )}
      {variant === 'secondary' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse -z-10 blur-sm opacity-50" />
      )}
      {variant === 'ghost' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 animate-pulse -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.button>
  )
}