'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface GlassmorphicCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark'
  hover?: boolean
  glow?: boolean
}

export const GlassmorphicCard = forwardRef<HTMLDivElement, GlassmorphicCardProps>(
  ({ 
    children, 
    className, 
    blur = 'xl', 
    variant = 'dark',
    hover = true,
    glow = false,
    ...props 
  }, ref) => {
    const blurClass = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    }[blur]

    const variantClass = variant === 'light' 
      ? 'bg-white/10 border-white/20' 
      : 'bg-black/20 border-white/10'

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl p-6 shadow-glass',
          blurClass,
          variantClass,
          'border',
          hover && 'transition-all duration-300 hover:bg-white/[0.15] hover:border-white/20 hover:shadow-xl',
          glow && 'glow-border',
          className
        )}
        whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassmorphicCard.displayName = 'GlassmorphicCard'