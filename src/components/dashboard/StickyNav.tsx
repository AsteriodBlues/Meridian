'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, 
  TrendingUp, 
  CreditCard, 
  PieChart, 
  Settings, 
  Bell,
  Search,
  User,
  Menu,
  X,
  Receipt,
  Building2,
  Calculator,
  Globe,
  Shield,
  Users
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'transactions', label: 'Transactions', icon: Receipt, href: '/transactions' },
  { id: 'realestate', label: 'Real Estate', icon: Building2, href: '/realestate' },
  { id: 'investments', label: 'Investments', icon: TrendingUp, href: '/investments' },
  { id: 'budget', label: 'Budget', icon: Calculator, href: '/budget' },
  { id: 'currency', label: 'Currency', icon: Globe, href: '/currency' },
  { id: 'credit', label: 'Credit & Debt', icon: Shield, href: '/credit' },
  { id: 'family', label: 'Family & Social', icon: Users, href: '/family' },
  { id: 'cards', label: 'Cards', icon: CreditCard, href: '#cards' },
  { id: 'analytics', label: 'Analytics', icon: PieChart, href: '#analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '#settings' },
];

export default function StickyNav() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [8, 16]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
        style={{ 
          backdropFilter: `blur(${navBlur}px)`,
        }}
      >
        <motion.div
          className="border-b border-white/10 bg-black/40"
          style={{ opacity: navOpacity }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wisdom-500 to-trust-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-white font-semibold text-xl">Meridian</span>
              </motion.div>

              {/* Navigation Items */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  
                  return (
                    <Link key={item.id} href={item.href}>
                      <motion.button
                        onClick={() => setActiveItem(item.id)}
                        className={`
                          relative flex items-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 whitespace-nowrap
                          ${isActive 
                            ? 'text-white bg-white/10' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-xs">{item.label}</span>
                      {item.badge && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="text-white text-xs font-bold">{item.badge}</span>
                        </motion.div>
                      )}
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-1/2 w-1 h-1 bg-wisdom-400 rounded-full"
                          layoutId="activeIndicator"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        />
                      )}
                      </motion.button>
                    </Link>
                  );
                })}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <motion.button
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </motion.button>

                {/* Notifications */}
                <motion.button
                  className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>

                {/* Profile */}
                <motion.button
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wisdom-500 to-trust-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">John</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{ 
          backdropFilter: `blur(${navBlur}px)`,
        }}
      >
        <motion.div
          className="border-b border-white/10 bg-black/40"
          style={{ opacity: navOpacity }}
        >
          <div className="px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-wisdom-500 to-trust-500 flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-white font-semibold">Meridian</span>
              </div>

              {/* Menu toggle */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile menu */}
        <motion.div
          className={`
            absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10
            ${isMenuOpen ? 'block' : 'hidden'}
          `}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            y: isMenuOpen ? 0 : -20 
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <Link key={item.id} href={item.href}>
                  <motion.button
                    onClick={() => {
                      setActiveItem(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'text-white bg-white/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <div className="ml-auto w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{item.badge}</span>
                      </div>
                    )}
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </motion.nav>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-16" />
    </>
  );
}