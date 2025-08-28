'use client';

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Home, 
  TrendingUp, 
  CreditCard, 
  PieChart, 
  Settings, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X,
  ChevronDown,
  Sparkles,
  Zap,
  Target,
  Shield,
  ArrowRight,
  Sprout,
  Brain
} from 'lucide-react';

// Auth Components
import LogoutButton from '@/components/auth/LogoutButton';

// Enhanced Desktop Navigation
const DesktopNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const shouldBeScrolled = currentScrollY > 50;
        if (shouldBeScrolled !== isScrolled) {
          setIsScrolled(shouldBeScrolled);
        }
      }, 10); // Debounce scroll events
    };
    
    // Set initial state
    setIsScrolled(window.scrollY > 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isScrolled]);

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home
    },
    { 
      name: 'Wealth', 
      icon: TrendingUp,
      dropdown: [
        { name: 'Investments', href: '/investments', icon: TrendingUp, description: 'Portfolio & market analysis' },
        { name: 'Cash Flow Forecasting', href: '/cashflow', icon: Brain, description: 'AI-powered predictions & scenarios' },
        { name: 'Real Estate', href: '/realestate', icon: Target, description: 'Property investments' },
        { name: 'Assets & Integration', href: '/assets-integration', icon: Zap, description: 'Connected accounts' },
        { name: 'Money Garden', href: '/garden', icon: Sprout, description: 'Visualize your financial growth' }
      ]
    },
    { 
      name: 'Banking', 
      icon: CreditCard,
      dropdown: [
        { name: 'Transactions', href: '/transactions', icon: CreditCard, description: 'Transaction history' },
        { name: 'Budget', href: '/budget', icon: PieChart, description: 'Budget management' },
        { name: 'Credit', href: '/credit', icon: Shield, description: 'Credit monitoring' },
        { name: 'Currency', href: '/currency', icon: Sparkles, description: 'Exchange rates' }
      ]
    },
    { 
      name: 'Planning', 
      icon: Settings,
      dropdown: [
        { name: 'Tax & Reports', href: '/tax-reports', icon: Settings, description: 'Tax planning & reports' },
        { name: 'Family', href: '/family', icon: User, description: 'Family finances' }
      ]
    }
  ];

  // Function to get breathing colors for each navigation section
  const getBreathingColors = (itemName: string, href?: string) => {
    // Dashboard keeps the original blue-purple
    if (itemName === 'Dashboard' || href === '/dashboard') {
      return 'from-blue-500/40 via-purple-500/35 to-blue-500/40';
    }
    // Wealth section - emerald/teal (growth theme)
    if (itemName === 'Wealth' || href?.includes('/investments') || href?.includes('/realestate') || href?.includes('/assets-integration') || href?.includes('/garden') || href?.includes('/cashflow')) {
      return 'from-emerald-500/40 via-teal-500/35 to-emerald-500/40';
    }
    // Banking section - cyan/sky (trust/security theme)
    if (itemName === 'Banking' || href?.includes('/transactions') || href?.includes('/budget') || href?.includes('/credit') || href?.includes('/currency')) {
      return 'from-cyan-500/40 via-sky-500/35 to-cyan-500/40';
    }
    // Planning section - amber/orange (wisdom theme)
    if (itemName === 'Planning' || href?.includes('/tax-reports') || href?.includes('/family')) {
      return 'from-amber-500/40 via-orange-500/35 to-amber-500/40';
    }
    // Default fallback
    return 'from-blue-500/40 via-purple-500/35 to-blue-500/40';
  };

  const mockSearchResults = [
    { name: 'Dashboard Overview', type: 'page', href: '/dashboard' },
    { name: 'Investment Portfolio', type: 'page', href: '/investments' },
    { name: 'Cash Flow Forecasting', type: 'page', href: '/cashflow' },
    { name: 'Money Garden', type: 'page', href: '/garden' },
    { name: 'Transaction History', type: 'page', href: '/transactions' },
    { name: 'Budget Management', type: 'page', href: '/budget' },
    { name: 'Credit Monitoring', type: 'page', href: '/credit' },
    { name: 'Real Estate', type: 'page', href: '/realestate' },
    { name: 'Tax & Reports', type: 'page', href: '/tax-reports' },
    { name: 'Family Finance', type: 'page', href: '/family' },
    { name: 'Currency Exchange', type: 'page', href: '/currency' },
    { name: 'Assets & Integration', type: 'page', href: '/assets-integration' }
  ];

  useEffect(() => {
    if (searchQuery) {
      const filtered = mockSearchResults.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const NavLink = ({ item, index }: { item: any; index: number }) => {
    let closeTimeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
      clearTimeout(closeTimeout);
      if (item.dropdown) {
        setActiveDropdown(item.name);
      }
    };

    const handleMouseLeave = () => {
      if (item.dropdown) {
        closeTimeout = setTimeout(() => {
          setActiveDropdown(null);
        }, 150);
      }
    };

    return (
      <motion.div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        data-dropdown={item.name}
      >
      <motion.a
        href={item.href}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          pathname === item.href
            ? 'text-white bg-white/10 shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-white/5'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <item.icon className="w-4 h-4" />
        <span>{item.name}</span>
        
        {/* Active state breathing glow */}
        {(pathname === item.href || (item.dropdown && item.dropdown.some(drop => pathname === drop.href))) && (
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getBreathingColors(item.name, pathname)} animate-pulse -z-10 blur-sm`} />
        )}
        
        {/* Hover breathing glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-blue-500/5 to-white/5 animate-pulse -z-10 blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover underline */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {item.dropdown && <ChevronDown className="w-3 h-3 ml-1" />}
      </motion.a>

      {/* Award-worthy Mega Menu Dropdown */}
      <AnimatePresence>
        {activeDropdown === item.name && item.dropdown && (
          <>
            {/* Invisible bridge to prevent gaps */}
            <div 
              className="absolute top-full left-0 w-80 h-2 z-40"
              data-dropdown={item.name}
            />
            
            <motion.div
              className="absolute top-full left-0 mt-2 w-80 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl z-50"
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              data-dropdown={item.name}
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setTimeout(() => setActiveDropdown(null), 100)}
            >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${getBreathingColors(item.name).replace('/40', '/30').replace('/35', '/25')}`}>
                <item.icon className={`w-5 h-5 ${
                  item.name === 'Wealth' ? 'text-emerald-400' :
                  item.name === 'Banking' ? 'text-cyan-400' :
                  item.name === 'Planning' ? 'text-amber-400' :
                  'text-blue-400'
                }`} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm">
                  {item.name === 'Wealth' && 'Grow and manage your wealth'}
                  {item.name === 'Banking' && 'Everyday financial management'}
                  {item.name === 'Planning' && 'Long-term financial planning'}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {item.dropdown.map((dropItem: any, idx: number) => (
                <motion.a
                  key={dropItem.name}
                  href={dropItem.href}
                  className="relative flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/10 overflow-hidden"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ x: 8 }}
                >
                  {/* Breathing glow effect on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getBreathingColors(item.name, dropItem.href).replace('/40', '/20').replace('/35', '/15')} animate-pulse -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getBreathingColors(item.name, dropItem.href).replace('/40', '/20').replace('/35', '/20')} transition-all duration-300`}>
                    <dropItem.icon className={`w-5 h-5 transition-colors ${
                      item.name === 'Wealth' ? 'text-emerald-400 group-hover:text-emerald-300' :
                      item.name === 'Banking' ? 'text-cyan-400 group-hover:text-cyan-300' :
                      item.name === 'Planning' ? 'text-amber-400 group-hover:text-amber-300' :
                      'text-blue-400 group-hover:text-blue-300'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-semibold">{dropItem.name}</span>
                      <ArrowRight className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">{dropItem.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-inset-top ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}
      style={{ 
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Meridian</span>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => (
              <NavLink key={item.name} item={item} index={index} />
            ))}
          </div>

          {/* Search & User Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <motion.button
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors overflow-hidden"
                onClick={() => setShowSearch(!showSearch)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-500/15 via-white/10 to-gray-500/15 animate-pulse -z-10 blur-sm" />
                <Search className="w-5 h-5 text-gray-300 relative z-10" />
              </motion.button>

              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-80 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    <input
                      type="text"
                      placeholder="Search anything..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      autoFocus
                    />
                    
                    {searchResults.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {searchResults.map((result, idx) => (
                          <motion.a
                            key={result.name}
                            href={result.href}
                            className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors overflow-hidden group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/10 via-white/5 to-blue-500/10 animate-pulse -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center relative z-10">
                              <Search className="w-3 h-3 text-blue-400" />
                            </div>
                            <div className="relative z-10">
                              <div className="text-white text-sm font-medium">{result.name}</div>
                              <div className="text-gray-400 text-xs">{result.type}</div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <motion.button
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/15 via-orange-500/10 to-red-500/15 animate-pulse -z-10 blur-sm" />
              <Bell className="w-5 h-5 text-gray-300 relative z-10" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full z-20" />
            </motion.button>

            {/* User Menu */}
            {session ? (
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/15 via-blue-500/10 to-green-500/15 animate-pulse -z-10 blur-sm" />
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-300" />
                  )}
                  <span className="text-sm text-gray-300 relative z-10">
                    {session.user?.name || 'User'}
                  </span>
                </motion.div>
                
                <LogoutButton variant="icon" />
              </div>
            ) : (
              <motion.button
                className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
              >
                <User className="w-5 h-5 text-gray-300" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Mobile Bottom Tab Navigation
const MobileNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { name: 'Home', href: '/dashboard', icon: Home, index: 0 },
    { name: 'Wealth', href: '/investments', icon: TrendingUp, index: 1 },
    { name: 'Bank', href: '/transactions', icon: CreditCard, index: 2 },
    { name: 'Budget', href: '/budget', icon: PieChart, index: 3 },
    { name: 'More', href: '/tax-reports', icon: Settings, index: 4 }
  ];

  useEffect(() => {
    const currentTab = tabs.find(tab => pathname.startsWith(tab.href));
    if (currentTab) {
      setActiveTab(currentTab.index);
    }
  }, [pathname]);

  const handleTabPress = (tab: any) => {
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setActiveTab(tab.index);
    router.push(tab.href);
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', damping: 25 }}
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.index;
          
          return (
            <motion.button
              key={tab.name}
              className="relative flex flex-col items-center gap-1 p-3 rounded-xl"
              onClick={() => handleTabPress(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}
            >
              <motion.div
                className="relative"
                animate={{
                  scale: isActive ? 1.1 : 1,
                  rotateY: isActive ? 360 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <tab.icon 
                  className={`w-5 h-5 ${
                    isActive ? 'text-blue-400' : 'text-gray-400'
                  }`} 
                />
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -inset-2 rounded-full bg-blue-400/20 blur-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
              
              <span className={`text-xs font-medium ${
                isActive ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {tab.name}
              </span>
              
              {/* Active dot */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-blue-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Home indicator for iOS-like feel */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
    </motion.div>
  );
};

// Hamburger Menu for Mobile
const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Investments', href: '/investments', icon: TrendingUp },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Budget', href: '/budget', icon: PieChart },
    { name: 'Credit', href: '/credit', icon: Shield },
    { name: 'Real Estate', href: '/realestate', icon: Target },
    { name: 'Tax & Reports', href: '/tax-reports', icon: Settings }
  ];

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 p-8">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 text-2xl font-semibold transition-colors ${
                    pathname === item.href ? 'text-blue-400' : 'text-white hover:text-blue-400'
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Main Enhanced Navigation Component
export default function EnhancedNavigation() {
  return (
    <>
      <DesktopNavigation />
      <MobileNavigation />
    </>
  );
}