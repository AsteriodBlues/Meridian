'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Shield, Lock, Eye, EyeOff, CheckCircle, AlertTriangle,
  CreditCard, Building2, Smartphone, RefreshCw, Settings,
  Plus, Minus, Edit, Trash2, Download, Upload, Search,
  Filter, Calendar, DollarSign, TrendingUp, TrendingDown,
  Globe, Clock, Star, Award, Zap, Target, Info, Bell,
  Key, Fingerprint, ShieldCheck, UserCheck, Database
} from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  bankLogo: string;
  accountName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  accountNumber: string; // masked
  balance: number;
  availableBalance?: number;
  lastSync: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  institution: {
    id: string;
    name: string;
    logo: string;
    url: string;
    primaryColor: string;
    loginUrl: string;
  };
  credentials: {
    encrypted: boolean;
    lastUpdated: string;
    expiresAt?: string;
  };
  permissions: string[];
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'manual';
}

interface PlaidIntegrationProps {
  accounts?: BankAccount[];
  className?: string;
  onConnectAccount?: () => void;
  onDisconnectAccount?: (accountId: string) => void;
  onSyncAccount?: (accountId: string) => void;
  onUpdateCredentials?: (accountId: string) => void;
  onViewTransactions?: (accountId: string) => void;
  isLoading?: boolean;
  securityLevel?: 'basic' | 'enhanced' | 'enterprise';
}

export default function PlaidIntegration({ 
  accounts = [],
  className = '',
  onConnectAccount,
  onDisconnectAccount,
  onSyncAccount,
  onUpdateCredentials,
  onViewTransactions,
  isLoading = false,
  securityLevel = 'enhanced'
}: PlaidIntegrationProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'accounts' | 'security' | 'sync' | 'permissions'>('accounts');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [syncingAccounts, setSyncingAccounts] = useState<Set<string>>(new Set());
  const [securityCheck, setSecurityCheck] = useState({
    encryption: true,
    twoFactor: true,
    tokenRotation: true,
    accessAudit: true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bank logos (simplified SVG representations)
  const bankLogos = {
    'Chase': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" rx="10" fill="#0066b2" stroke="#fff" stroke-width="2"/>
      <circle cx="50" cy="40" r="15" fill="#fff"/>
      <rect x="35" y="55" width="30" height="8" fill="#fff"/>
    </svg>`,
    'Bank of America': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" rx="8" fill="#cc0000" stroke="#fff" stroke-width="2"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">BofA</text>
    </svg>`,
    'Wells Fargo': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" rx="8" fill="#ffcc02" stroke="#d4af37" stroke-width="2"/>
      <path d="M25 35 L50 25 L75 35 L75 65 L25 65 Z" fill="#cc0000"/>
    </svg>`,
    'Citi': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#1976d2" stroke="#fff" stroke-width="2"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">citi</text>
    </svg>`,
    'Capital One': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" rx="15" fill="#004977" stroke="#fff" stroke-width="2"/>
      <circle cx="35" cy="45" r="8" fill="#ff6900"/>
      <circle cx="65" cy="45" r="8" fill="#ff6900"/>
      <path d="M30 65 Q50 75 70 65" stroke="#ff6900" stroke-width="3" fill="none"/>
    </svg>`
  };

  // Default bank accounts
  const defaultAccounts: BankAccount[] = [
    {
      id: 'account-001',
      bankName: 'Chase',
      bankLogo: bankLogos['Chase'],
      accountName: 'Chase Total Checking',
      accountType: 'checking',
      accountNumber: '****1234',
      balance: 15420.50,
      availableBalance: 15420.50,
      lastSync: '2024-08-15T10:30:00Z',
      status: 'connected',
      institution: {
        id: 'ins_chase',
        name: 'JPMorgan Chase Bank',
        logo: bankLogos['Chase'],
        url: 'chase.com',
        primaryColor: '#0066b2',
        loginUrl: 'https://secure01a.chase.com'
      },
      credentials: {
        encrypted: true,
        lastUpdated: '2024-08-15T10:30:00Z',
        expiresAt: '2024-11-15T10:30:00Z'
      },
      permissions: ['read_balances', 'read_transactions', 'read_identity'],
      syncFrequency: 'hourly'
    },
    {
      id: 'account-002',
      bankName: 'Bank of America',
      bankLogo: bankLogos['Bank of America'],
      accountName: 'Advantage Plus Banking',
      accountType: 'savings',
      accountNumber: '****5678',
      balance: 38750.25,
      lastSync: '2024-08-15T09:45:00Z',
      status: 'connected',
      institution: {
        id: 'ins_bofa',
        name: 'Bank of America',
        logo: bankLogos['Bank of America'],
        url: 'bankofamerica.com',
        primaryColor: '#cc0000',
        loginUrl: 'https://secure.bankofamerica.com'
      },
      credentials: {
        encrypted: true,
        lastUpdated: '2024-08-10T14:20:00Z',
        expiresAt: '2024-11-10T14:20:00Z'
      },
      permissions: ['read_balances', 'read_transactions'],
      syncFrequency: 'daily'
    },
    {
      id: 'account-003',
      bankName: 'Capital One',
      bankLogo: bankLogos['Capital One'],
      accountName: 'Venture X Rewards',
      accountType: 'credit',
      accountNumber: '****9012',
      balance: -2450.75, // credit card balance (negative)
      availableBalance: 22549.25, // available credit
      lastSync: '2024-08-15T08:15:00Z',
      status: 'error',
      institution: {
        id: 'ins_capital_one',
        name: 'Capital One',
        logo: bankLogos['Capital One'],
        url: 'capitalone.com',
        primaryColor: '#004977',
        loginUrl: 'https://verified.capitalone.com'
      },
      credentials: {
        encrypted: true,
        lastUpdated: '2024-08-05T12:00:00Z',
        expiresAt: '2024-11-05T12:00:00Z'
      },
      permissions: ['read_balances', 'read_transactions', 'read_liabilities'],
      syncFrequency: 'realtime'
    },
    {
      id: 'account-004',
      bankName: 'Wells Fargo',
      bankLogo: bankLogos['Wells Fargo'],
      accountName: 'Premier Checking',
      accountType: 'checking',
      accountNumber: '****3456',
      balance: 8920.80,
      lastSync: '2024-08-14T16:30:00Z',
      status: 'pending',
      institution: {
        id: 'ins_wells_fargo',
        name: 'Wells Fargo Bank',
        logo: bankLogos['Wells Fargo'],
        url: 'wellsfargo.com',
        primaryColor: '#ffcc02',
        loginUrl: 'https://connect.secure.wellsfargo.com'
      },
      credentials: {
        encrypted: true,
        lastUpdated: '2024-08-14T16:30:00Z'
      },
      permissions: ['read_balances', 'read_transactions', 'read_identity'],
      syncFrequency: 'hourly'
    }
  ];

  const accountData = accounts.length > 0 ? accounts : defaultAccounts;

  // Calculate totals
  const totalBalance = accountData.reduce((sum, account) => {
    if (account.accountType === 'credit') {
      return sum; // Don't include credit card debt in total assets
    }
    return sum + (account.balance || 0);
  }, 0);

  const totalDebt = accountData.reduce((sum, account) => {
    if (account.accountType === 'credit' && account.balance < 0) {
      return sum + Math.abs(account.balance);
    }
    return sum;
  }, 0);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'disconnected': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Get account type icon
  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking': return Building2;
      case 'savings': return Target;
      case 'credit': return CreditCard;
      case 'investment': return TrendingUp;
      case 'loan': return DollarSign;
      default: return Building2;
    }
  };

  // Handle sync
  const handleSync = async (accountId: string) => {
    setSyncingAccounts(prev => new Set([...prev, accountId]));
    
    // Simulate sync process
    setTimeout(() => {
      setSyncingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(accountId);
        return newSet;
      });
      onSyncAccount?.(accountId);
    }, 2000);
  };

  // Mask sensitive data
  const maskData = (data: string, visible: boolean) => {
    if (visible || !data) return data;
    return data.replace(/./g, '•');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Banking Integration
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Securely connect and manage your bank accounts with enterprise-grade encryption
        </motion.p>
      </div>

      {/* Security Status */}
      <motion.div
        className="p-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-xl border border-green-500/20 rounded-2xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px rgba(16, 185, 129, 0.5)',
                '0 0 40px rgba(59, 130, 246, 0.7)',
                '0 0 20px rgba(16, 185, 129, 0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <h4 className="text-white font-bold text-lg mb-1">Bank-Level Security Active</h4>
            <p className="text-gray-400 text-sm mb-3">
              256-bit encryption • 2FA enabled • SOC 2 Type II certified
            </p>
            
            <div className="flex items-center gap-4">
              {Object.entries(securityCheck).map(([key, status]) => (
                <div key={key} className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </div>
              ))}
            </div>
          </div>
          
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSensitiveData ? 'Hide' : 'Show'} Details
          </motion.button>
        </div>
      </motion.div>

      {/* Account Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Building2 className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-gray-400 text-sm">Total Balance</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {showSensitiveData ? `$${totalBalance.toLocaleString()}` : maskData(`$${totalBalance.toLocaleString()}`, false)}
          </div>
          <div className="text-green-400 text-sm">
            {accountData.filter(a => a.accountType !== 'credit').length} accounts
          </div>
        </div>

        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-gray-400 text-sm">Total Debt</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {showSensitiveData ? `$${totalDebt.toLocaleString()}` : maskData(`$${totalDebt.toLocaleString()}`, false)}
          </div>
          <div className="text-red-400 text-sm">
            {accountData.filter(a => a.accountType === 'credit').length} credit accounts
          </div>
        </div>

        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <RefreshCw className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Connected Accounts</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {accountData.filter(a => a.status === 'connected').length}
          </div>
          <div className="text-blue-400 text-sm">
            of {accountData.length} total
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { key: 'accounts', label: 'Accounts', icon: Building2 },
          { key: 'security', label: 'Security', icon: Shield },
          { key: 'sync', label: 'Sync Settings', icon: RefreshCw },
          { key: 'permissions', label: 'Permissions', icon: Key }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'accounts' && (
          <motion.div
            key="accounts"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Add Account Button */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-all"
                onClick={onConnectAccount}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <motion.div
                  animate={{ rotate: isLoading ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
                <span>Connect New Bank Account</span>
                <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-bold">
                  SECURE
                </div>
              </motion.button>
            </motion.div>

            {/* Accounts List */}
            <div className="space-y-4">
              {accountData.map((account, index) => {
                const Icon = getAccountTypeIcon(account.accountType);
                const statusColor = getStatusColor(account.status);
                const isSelected = selectedAccount === account.id;
                const isSyncing = syncingAccounts.has(account.id);
                
                return (
                  <motion.div
                    key={account.id}
                    className={`p-6 bg-white/5 backdrop-blur-xl border rounded-2xl transition-all cursor-pointer ${
                      isSelected ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedAccount(isSelected ? null : account.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Bank Logo */}
                      <div className="relative">
                        <div 
                          className="w-12 h-12 bg-white rounded-xl p-2"
                          dangerouslySetInnerHTML={{ __html: account.bankLogo }}
                        />
                        {/* Status Indicator */}
                        <div 
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900"
                          style={{ backgroundColor: statusColor }}
                        />
                      </div>

                      {/* Account Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-bold">{account.accountName}</h4>
                          <div className="flex items-center gap-1">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400 text-sm capitalize">{account.accountType}</span>
                          </div>
                          <span className="text-gray-400 text-sm">
                            {showSensitiveData ? account.accountNumber : '••••••••'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{account.institution.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last sync: {new Date(account.lastSync).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          account.accountType === 'credit' && account.balance < 0 
                            ? 'text-red-400' 
                            : 'text-white'
                        }`}>
                          {showSensitiveData 
                            ? (account.accountType === 'credit' && account.balance < 0 
                                ? `-$${Math.abs(account.balance).toLocaleString()}` 
                                : `$${account.balance.toLocaleString()}`)
                            : maskData(`$${Math.abs(account.balance).toLocaleString()}`, false)
                          }
                        </div>
                        {account.availableBalance && account.accountType === 'credit' && (
                          <div className="text-gray-400 text-sm">
                            Available: {showSensitiveData 
                              ? `$${account.availableBalance.toLocaleString()}`
                              : maskData(`$${account.availableBalance.toLocaleString()}`, false)
                            }
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          className={`p-2 rounded-lg transition-colors ${
                            isSyncing 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSync(account.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isSyncing}
                        >
                          <motion.div
                            animate={{ rotate: isSyncing ? 360 : 0 }}
                            transition={{ duration: 1, repeat: isSyncing ? Infinity : 0 }}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </motion.div>
                        </motion.button>

                        <motion.button
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewTransactions?.(account.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Settings menu
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Settings className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="mt-6 pt-6 border-t border-white/10"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Security Status */}
                            <div>
                              <h5 className="text-white font-medium mb-3">Security Status</h5>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-400">Encryption:</span>
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                    <span className="text-green-400">AES-256</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-400">Last Updated:</span>
                                  <span className="text-white">
                                    {new Date(account.credentials.lastUpdated).toLocaleDateString()}
                                  </span>
                                </div>
                                {account.credentials.expiresAt && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Expires:</span>
                                    <span className="text-yellow-400">
                                      {new Date(account.credentials.expiresAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Permissions */}
                            <div>
                              <h5 className="text-white font-medium mb-3">Permissions</h5>
                              <div className="space-y-2">
                                {account.permissions.map((permission) => (
                                  <div key={permission} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                    <span className="text-gray-300 capitalize">
                                      {permission.replace('_', ' ')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div>
                              <h5 className="text-white font-medium mb-3">Actions</h5>
                              <div className="space-y-2">
                                <motion.button
                                  className="w-full flex items-center gap-2 p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-colors"
                                  onClick={() => onUpdateCredentials?.(account.id)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Key className="w-4 h-4" />
                                  Update Credentials
                                </motion.button>
                                <motion.button
                                  className="w-full flex items-center gap-2 p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-sm transition-colors"
                                  onClick={() => onViewTransactions?.(account.id)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Download className="w-4 h-4" />
                                  Export Data
                                </motion.button>
                                <motion.button
                                  className="w-full flex items-center gap-2 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-colors"
                                  onClick={() => onDisconnectAccount?.(account.id)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Disconnect
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'End-to-End Encryption',
                  description: 'All data is encrypted using AES-256 encryption both in transit and at rest',
                  icon: Lock,
                  status: 'active',
                  details: ['256-bit AES encryption', 'TLS 1.3 for data in transit', 'Encrypted database storage']
                },
                {
                  title: 'Two-Factor Authentication',
                  description: 'Additional layer of security requiring device verification',
                  icon: Smartphone,
                  status: 'active',
                  details: ['SMS verification', 'Authenticator app support', 'Biometric authentication']
                },
                {
                  title: 'Token Rotation',
                  description: 'Access tokens are automatically rotated every 90 days',
                  icon: RefreshCw,
                  status: 'active',
                  details: ['Automatic rotation', '90-day expiry', 'Immediate revocation capability']
                },
                {
                  title: 'Audit Logging',
                  description: 'Complete audit trail of all account access and modifications',
                  icon: Database,
                  status: 'active',
                  details: ['Real-time logging', 'Immutable records', 'Compliance reporting']
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                
                return (
                  <motion.div
                    key={feature.title}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <Icon className="w-6 h-6 text-green-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-bold">{feature.title}</h4>
                          <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-bold">
                            {feature.status.toUpperCase()}
                          </div>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                        
                        <div className="space-y-1">
                          {feature.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span className="text-gray-300">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/10 text-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.5, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
          >
            <Shield />
          </motion.div>
        ))}
      </div>
    </div>
  );
}