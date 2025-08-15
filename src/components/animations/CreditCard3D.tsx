'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CreditCard3DProps {
  className?: string
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
}

export function CreditCard3D({
  className,
  cardNumber = '•••• •••• •••• 8642',
  cardHolder = 'JOHN DOE',
  expiryDate = '12/25'
}: CreditCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div className={cn('perspective-1000', className)}>
      <motion.div
        ref={cardRef}
        className="relative w-[400px] h-[250px] cursor-pointer preserve-3d"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-wisdom-600 via-wisdom-500 to-trust-500" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30" />
          
          <div className="relative h-full p-8 flex flex-col justify-between text-white">
            {/* Card Logo */}
            <div className="flex justify-between items-start">
              <div className="text-2xl font-bold">MERIDIAN</div>
              <motion.div
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <span className="text-xs font-bold">M</span>
              </motion.div>
            </div>

            {/* Chip */}
            <div className="absolute left-8 top-24">
              <div className="w-12 h-10 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 shadow-lg">
                <div className="w-full h-full rounded-md border-2 border-yellow-300/50" />
              </div>
            </div>

            {/* Card Number */}
            <div className="mt-auto space-y-4">
              <div className="text-2xl font-mono tracking-widest">
                {cardNumber}
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-70">CARD HOLDER</div>
                  <div className="text-sm font-medium">{cardHolder}</div>
                </div>
                <div>
                  <div className="text-xs opacity-70">EXPIRES</div>
                  <div className="text-sm font-medium">{expiryDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Holographic effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)',
              backgroundSize: '150% 150%',
            }}
            animate={{
              backgroundPosition: ['200% 200%', '-100% -100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-800 to-luxury-900" />
          
          <div className="relative h-full">
            {/* Magnetic stripe */}
            <div className="w-full h-12 bg-black mt-8" />
            
            {/* Signature strip */}
            <div className="mx-8 mt-6">
              <div className="bg-white/90 h-10 rounded flex items-center px-3">
                <div className="text-black/50 text-sm italic">Authorized Signature</div>
              </div>
            </div>

            {/* CVV */}
            <div className="mx-8 mt-4 flex justify-end">
              <div className="bg-white rounded px-3 py-1">
                <span className="text-black font-mono">842</span>
              </div>
            </div>

            {/* Info text */}
            <div className="mx-8 mt-6 text-xs text-white/70 space-y-1">
              <p>This card is property of Meridian Financial Services.</p>
              <p>For support: support@meridian.finance</p>
              <p>24/7 Support: 1-800-MERIDIAN</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}