'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { signIn } from 'next-auth/react'
import { X, Mail, Lock, Fingerprint, Smartphone, ArrowRight, Github, Chrome } from 'lucide-react'
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard'
import { MagneticButton } from '@/components/ui/MagneticButton'
import TwoFactorInput from '@/components/TwoFactorInput'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [step, setStep] = useState<'credentials' | '2fa' | 'success'>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isBiometric, setIsBiometric] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        console.error('Auth error:', result.error)
        setIsLoading(false)
        return
      }
      
      // If 2FA is enabled, go to 2FA step
      if (is2FAEnabled) {
        setStep('2fa')
      } else {
        setStep('success')
        setTimeout(() => onOpenChange(false), 2000)
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: 'github' | 'google') => {
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Social auth error:', error)
    }
  }

  const handle2FAComplete = async (code: string) => {
    setIsLoading(true)
    
    try {
      // Simulate 2FA verification with the provided code
      console.log('Verifying 2FA code:', code)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep('success')
      setTimeout(() => onOpenChange(false), 2000)
    } catch (error) {
      console.error('2FA error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <GlassmorphicCard className="relative">
                  {/* Close Button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10 transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>

                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-wisdom-500 to-trust-500 mb-4"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className="text-2xl font-bold text-white">M</div>
                    </motion.div>
                    <Dialog.Title className="text-2xl font-display font-bold text-white">
                      {step === 'credentials' 
                        ? (mode === 'signin' ? 'Welcome Back' : 'Create Account')
                        : step === '2fa'
                        ? 'Verify Identity'
                        : 'Welcome to Meridian'
                      }
                    </Dialog.Title>
                    <p className="text-gray-400 mt-2">
                      {step === 'credentials' 
                        ? (mode === 'signin' 
                          ? 'Sign in to access your financial dashboard'
                          : 'Start your journey to financial freedom')
                        : step === '2fa'
                        ? 'Complete two-factor authentication'
                        : 'Authentication successful'
                      }
                    </p>
                  </div>

                  {/* Auth Mode Toggle - Only show on credentials step */}
                  {step === 'credentials' && (
                    <div className="flex rounded-xl bg-white/5 p-1 mb-6">
                      {['signin', 'signup'].map((authMode) => (
                        <button
                          key={authMode}
                          onClick={() => setMode(authMode as 'signin' | 'signup')}
                          className={cn(
                            'flex-1 rounded-lg py-2 px-4 text-sm font-medium transition-all',
                            mode === authMode
                              ? 'bg-white/10 text-white'
                              : 'text-gray-400 hover:text-white'
                          )}
                        >
                          {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Main Content */}
                  {step === 'credentials' && (
                    <>
                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-wisdom-500 transition-colors"
                              placeholder="you@example.com"
                              required
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        {/* Password Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:border-wisdom-500 transition-colors"
                              placeholder="••••••••"
                              required
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                              disabled={isLoading}
                            >
                              {showPassword ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </div>

                        {/* 2FA Option */}
                        <motion.div
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <Smartphone className={cn(
                              "h-5 w-5 transition-colors",
                              is2FAEnabled ? "text-growth-500" : "text-gray-500"
                            )} />
                            <span className="text-sm text-gray-300">Enable Two-Factor Auth</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                            className={cn(
                              "relative w-12 h-6 rounded-full transition-colors",
                              is2FAEnabled ? "bg-growth-500" : "bg-white/10"
                            )}
                            disabled={isLoading}
                          >
                            <motion.div
                              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                              animate={{ x: is2FAEnabled ? 24 : 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            />
                          </button>
                        </motion.div>

                        {/* Biometric Option */}
                        <motion.div
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <Fingerprint className={cn(
                              "h-5 w-5 transition-colors",
                              isBiometric ? "text-growth-500" : "text-gray-500"
                            )} />
                            <span className="text-sm text-gray-300">Enable Biometric Login</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsBiometric(!isBiometric)}
                            className={cn(
                              "relative w-12 h-6 rounded-full transition-colors",
                              isBiometric ? "bg-growth-500" : "bg-white/10"
                            )}
                            disabled={isLoading}
                          >
                            <motion.div
                              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                              animate={{ x: isBiometric ? 24 : 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            />
                          </button>
                        </motion.div>

                        {/* Submit Button */}
                        <MagneticButton className="w-full" size="lg" disabled={isLoading}>
                          <span className="flex items-center justify-center gap-2">
                            {isLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Signing In...
                              </>
                            ) : (
                              <>
                                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                                <ArrowRight className="h-4 w-4" />
                              </>
                            )}
                          </span>
                        </MagneticButton>
                      </form>
                    </>
                  )}

                  {step === '2fa' && (
                    <motion.div
                      key="2fa"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="py-4"
                    >
                      <TwoFactorInput onComplete={handle2FAComplete} isLoading={isLoading} />
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-growth-500/20 mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-10 h-10 bg-growth-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-2 border-l-2 border-b-2 border-white transform rotate-45 -translate-y-0.5" />
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Welcome to Meridian!
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Redirecting to your dashboard...
                      </p>
                    </motion.div>
                  )}

                  {/* Divider and Social Login - Only show on credentials step */}
                  {step === 'credentials' && (
                    <>
                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-luxury-900 px-2 text-gray-500">Or continue with</span>
                        </div>
                      </div>

                      {/* Social Login */}
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleSocialSignIn('google')}
                          className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 hover:bg-white/10 transition-colors"
                          disabled={isLoading}
                        >
                          <Chrome className="h-4 w-4" />
                          <span className="text-sm">Google</span>
                        </button>
                        <button 
                          onClick={() => handleSocialSignIn('github')}
                          className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 hover:bg-white/10 transition-colors"
                          disabled={isLoading}
                        >
                          <Github className="h-4 w-4" />
                          <span className="text-sm">GitHub</span>
                        </button>
                      </div>

                      {/* Footer */}
                      <p className="text-center text-xs text-gray-500 mt-6">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </>
                  )}
                </GlassmorphicCard>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}