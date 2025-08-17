'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  Users,
  FileText,
  ChevronDown,
  Zap,
  Plus,
  Command
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  category: 'core' | 'finance' | 'tools';
  isNew?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: Home, href: '/dashboard', category: 'core' },
  { id: 'transactions', label: 'Transactions', icon: Receipt, href: '/transactions', category: 'core' },
  { id: 'investments', label: 'Investments', icon: TrendingUp, href: '/investments', category: 'finance' },
  { id: 'budget', label: 'Budget', icon: Calculator, href: '/budget', category: 'finance' },
  { id: 'realestate', label: 'Real Estate', icon: Building2, href: '/realestate', category: 'finance' },
  { id: 'currency', label: 'Currency', icon: Globe, href: '/currency', category: 'tools' },
  { id: 'credit', label: 'Credit & Debt', icon: Shield, href: '/credit', category: 'finance' },
  { id: 'family', label: 'Family & Social', icon: Users, href: '/family', category: 'tools' },
  { id: 'tax-reports', label: 'Tax & Reports', icon: FileText, href: '/tax-reports', category: 'tools', isNew: true },
  { id: 'cards', label: 'Cards', icon: CreditCard, href: '#cards', category: 'finance' },
  { id: 'analytics', label: 'Analytics', icon: PieChart, href: '#analytics', category: 'tools' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '#settings', category: 'core' },
];

const coreItems = navItems.filter(item => item.category === 'core');
const financeItems = navItems.filter(item => item.category === 'finance');
const toolsItems = navItems.filter(item => item.category === 'tools');

export default function StickyNav() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [12, 20]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Primary navigation items (always visible)
  const primaryItems = [
    navItems.find(item => item.id === 'dashboard')!,
    navItems.find(item => item.id === 'transactions')!,
    navItems.find(item => item.id === 'investments')!,
    navItems.find(item => item.id === 'budget')!,
    navItems.find(item => item.id === 'tax-reports')!,
  ];

  const secondaryItems = navItems.filter(item => !primaryItems.includes(item));

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 hidden lg:block"
        style={{ 
          backdropFilter: `blur(${navBlur}px)`,
        }}
      >
        <motion.div
          className="border-b border-white/10 bg-black/30"
          style={{ opacity: navOpacity }}
        >
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <motion.div
                className="flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                  whileHover={{ 
                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                    rotate: [0, -2, 2, 0]
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-white font-bold text-xl">M</span>
                </motion.div>
                <div>
                  <div className="text-white font-bold text-xl">Meridian</div>
                  <div className="text-gray-400 text-xs">Financial Platform</div>
                </div>
              </motion.div>

              {/* Primary Navigation */}
              <div className="flex items-center gap-2">
                {primaryItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  
                  return (
                    <Link key={item.id} href={item.href}>
                      <motion.button
                        onClick={() => setActiveItem(item.id)}
                        className={`
                          relative flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all duration-300 group
                          ${isActive 
                            ? 'text-white bg-white/15 shadow-lg' 
                            : 'text-gray-400 hover:text-white hover:bg-white/8'
                          }
                        `}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="relative">
                          <Icon className="w-5 h-5" />
                          {item.isNew && (
                            <motion.div
                              className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </div>
                        <span className="font-medium text-xs">{item.shortLabel || item.label}</span>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-blue-400/30"
                            layoutId="activeIndicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          />
                        )}
                        
                        {item.badge && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <span className="text-white text-xs font-bold">{item.badge}</span>
                          </motion.div>
                        )}
                      </motion.button>
                    </Link>
                  );
                })}

                {/* More Menu */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`
                      flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all duration-300
                      ${showMoreMenu 
                        ? 'text-white bg-white/15' 
                        : 'text-gray-400 hover:text-white hover:bg-white/8'
                      }
                    `}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      <ChevronDown className={`w-3 h-3 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
                    </div>
                    <span className="font-medium text-xs">More</span>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showMoreMenu && (
                      <motion.div
                        className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="p-6">
                          {/* Finance Section */}
                          <div className="mb-6">
                            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              Finance
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              {financeItems.slice(1).map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link key={item.id} href={item.href}>
                                    <motion.button
                                      onClick={() => {
                                        setActiveItem(item.id);
                                        setShowMoreMenu(false);
                                      }}
                                      className="flex items-center gap-3 w-full p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-left"
                                      whileHover={{ x: 2 }}
                                    >
                                      <Icon className="w-4 h-4" />
                                      <span className="text-sm font-medium">{item.label}</span>
                                    </motion.button>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>

                          {/* Tools Section */}
                          <div>
                            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-blue-400" />
                              Tools
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              {toolsItems.filter(item => item.id !== 'tax-reports').map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link key={item.id} href={item.href}>
                                    <motion.button
                                      onClick={() => {
                                        setActiveItem(item.id);
                                        setShowMoreMenu(false);
                                      }}
                                      className="flex items-center gap-3 w-full p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-left"
                                      whileHover={{ x: 2 }}
                                    >
                                      <Icon className="w-4 h-4" />
                                      <span className="text-sm font-medium">{item.label}</span>
                                    </motion.button>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <motion.button
                  className="relative p-3 rounded-2xl bg-white/8 hover:bg-white/12 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Quick Actions */}
                <motion.button
                  className="relative p-3 rounded-2xl bg-white/8 hover:bg-white/12 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Command className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Notifications */}
                <motion.button
                  className="relative p-3 rounded-2xl bg-white/8 hover:bg-white/12 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <motion.div 
                    className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Profile */}
                <motion.button
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/8 hover:bg-white/12 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center relative overflow-hidden">
                    <User className="w-5 h-5 text-white relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">John Doe</div>
                    <div className="text-gray-400 text-xs">Premium User</div>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 lg:hidden"
        style={{ 
          backdropFilter: `blur(${navBlur}px)`,
        }}
      >
        <motion.div
          className="border-b border-white/10 bg-black/30"
          style={{ opacity: navOpacity }}
        >
          <div className="px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <div className="text-white font-bold">Meridian</div>
                  <div className="text-gray-400 text-xs">Financial Platform</div>
                </div>
              </motion.div>

              {/* Menu Toggle */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 rounded-xl bg-white/8 hover:bg-white/12 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map((item, index) => {
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
                            w-full flex flex-col items-center gap-2 p-4 rounded-2xl transition-all
                            ${isActive 
                              ? 'text-white bg-white/15 border border-white/20' 
                              : 'text-gray-400 hover:text-white hover:bg-white/8'
                            }
                          `}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="relative">
                            <Icon className="w-6 h-6" />
                            {item.isNew && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full" />
                            )}
                          </div>
                          <span className="font-medium text-sm text-center">{item.label}</span>
                          {item.badge && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{item.badge}</span>
                            </div>
                          )}
                        </motion.button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-20 lg:h-20" />
    </>
  );
}