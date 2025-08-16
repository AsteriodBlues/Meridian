'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, Users, DollarSign, Plus, MoreVertical,
  Receipt, Camera, Paperclip, Smile, Heart, ThumbsUp,
  Calendar, MapPin, Tag, Clock, Check, CheckCheck,
  Edit, Trash2, Reply, Star, AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'expense' | 'payment' | 'system';
  attachments?: {
    type: 'image' | 'receipt' | 'file';
    url: string;
    name: string;
  }[];
  reactions?: {
    emoji: string;
    userIds: string[];
  }[];
  isRead: boolean;
  expenseData?: {
    amount: number;
    description: string;
    category: string;
    splitWith: string[];
  };
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  role: 'admin' | 'member';
  totalSpent: number;
  totalOwed: number;
  lastSeen: string;
}

interface ExpenseGroup {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  totalExpenses: number;
  settledAmount: number;
  pendingAmount: number;
  createdAt: string;
  isActive: boolean;
  category: 'travel' | 'dinner' | 'household' | 'event' | 'other';
  coverImage?: string;
}

interface GroupExpensesProps {
  group: ExpenseGroup;
  messages: Message[];
  currentUserId: string;
  className?: string;
  onSendMessage?: (content: string, type: 'text' | 'expense') => void;
  onAddExpense?: (expense: any) => void;
  onReactToMessage?: (messageId: string, emoji: string) => void;
  onSettleExpense?: (expenseId: string) => void;
}

// Deterministic pseudo-random function for SSR compatibility
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 1000) / 1000;
};

export default function GroupExpenses({ 
  group,
  messages,
  currentUserId,
  className = '',
  onSendMessage,
  onAddExpense,
  onReactToMessage,
  onSettleExpense 
}: GroupExpensesProps) {
  const [mounted, setMounted] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data
  const defaultGroup: ExpenseGroup = {
    id: 'trip-group-1',
    name: 'Vegas Weekend Trip',
    description: 'Epic weekend getaway with the squad!',
    category: 'travel',
    totalExpenses: 2847.50,
    settledAmount: 1200.00,
    pendingAmount: 1647.50,
    createdAt: '2024-08-10',
    isActive: true,
    members: [
      {
        id: 'alice',
        name: 'Alice',
        avatar: '👩‍💼',
        color: '#ec4899',
        isOnline: true,
        role: 'admin',
        totalSpent: 850.25,
        totalOwed: 425.50,
        lastSeen: 'now'
      },
      {
        id: 'bob',
        name: 'Bob',
        avatar: '👨‍💻',
        color: '#3b82f6',
        isOnline: true,
        role: 'member',
        totalSpent: 625.75,
        totalOwed: 312.25,
        lastSeen: 'now'
      },
      {
        id: 'charlie',
        name: 'Charlie',
        avatar: '👨‍🎨',
        color: '#10b981',
        isOnline: false,
        role: 'member',
        totalSpent: 430.20,
        totalOwed: 456.80,
        lastSeen: '2h ago'
      },
      {
        id: 'diana',
        name: 'Diana',
        avatar: '👩‍🚀',
        color: '#8b5cf6',
        isOnline: true,
        role: 'member',
        totalSpent: 941.30,
        totalOwed: 452.95,
        lastSeen: 'now'
      }
    ]
  };

  const defaultMessages: Message[] = [
    {
      id: 'msg-1',
      senderId: 'alice',
      content: 'Hey everyone! Ready for Vegas? 🎰',
      timestamp: '10:30 AM',
      type: 'text',
      isRead: true,
      reactions: [
        { emoji: '🎉', userIds: ['bob', 'diana'] },
        { emoji: '💪', userIds: ['charlie'] }
      ]
    },
    {
      id: 'msg-2',
      senderId: 'bob',
      content: '',
      timestamp: '10:45 AM',
      type: 'expense',
      isRead: true,
      expenseData: {
        amount: 245.50,
        description: 'Uber to airport',
        category: 'transport',
        splitWith: ['alice', 'bob', 'charlie', 'diana']
      }
    },
    {
      id: 'msg-3',
      senderId: 'diana',
      content: 'Thanks for organizing this trip Alice! 🙌',
      timestamp: '11:20 AM',
      type: 'text',
      isRead: true,
      reactions: [
        { emoji: '❤️', userIds: ['alice', 'bob'] }
      ]
    },
    {
      id: 'msg-4',
      senderId: 'charlie',
      content: '',
      timestamp: '2:15 PM',
      type: 'expense',
      isRead: false,
      expenseData: {
        amount: 850.00,
        description: 'Hotel accommodation (2 nights)',
        category: 'accommodation',
        splitWith: ['alice', 'bob', 'charlie', 'diana']
      }
    }
  ];

  const currentGroup = group || defaultGroup;
  const chatMessages = messages.length > 0 ? messages : defaultMessages;

  // Get member by ID
  const getMemberById = (id: string) => {
    return currentGroup.members.find(member => member.id === id);
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage?.(messageInput, 'text');
      setMessageInput('');
    }
  };

  // Handle emoji reaction
  const handleReaction = (messageId: string, emoji: string) => {
    onReactToMessage?.(messageId, emoji);
    setShowEmojiPicker(null);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Common emojis
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '💰'];

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Group Expenses
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Chat, share expenses, and settle up with your group
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Group Info Sidebar */}
        <motion.div
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Group Header */}
          <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                ✈️
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">{currentGroup.name}</h4>
                <p className="text-gray-400 text-sm">{currentGroup.description}</p>
              </div>
            </div>

            {/* Group Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total', value: `$${currentGroup.totalExpenses.toFixed(2)}`, color: '#3b82f6' },
                { label: 'Settled', value: `$${currentGroup.settledAmount.toFixed(2)}`, color: '#10b981' },
                { label: 'Pending', value: `$${currentGroup.pendingAmount.toFixed(2)}`, color: '#f59e0b' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="p-3 bg-white/5 rounded-xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                  <div className="font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Members List */}
          <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <h5 className="text-white font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Members ({currentGroup.members.length})
            </h5>
            <div className="space-y-3">
              {currentGroup.members.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2"
                      style={{ 
                        backgroundColor: `${member.color}20`,
                        borderColor: member.color
                      }}
                    >
                      {member.avatar}
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">{member.name}</span>
                      {member.role === 'admin' && (
                        <Crown className="w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {member.isOnline ? 'Online' : `Last seen ${member.lastSeen}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-xs font-medium">
                      ${member.totalSpent.toFixed(0)}
                    </div>
                    <div className={`text-xs ${
                      member.totalOwed > 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {member.totalOwed > 0 ? `owes $${member.totalOwed.toFixed(0)}` : 'settled'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <motion.button
              className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-colors"
              onClick={() => setShowExpenseForm(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Expense
            </motion.button>
            <motion.button
              className="w-full p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Settle Up
            </motion.button>
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          className="lg:col-span-2 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Group Chat</span>
              <div className="flex -space-x-1">
                {currentGroup.members.filter(m => m.isOnline).map((member, index) => (
                  <div
                    key={member.id}
                    className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs"
                    style={{ backgroundColor: `${member.color}20` }}
                    title={member.name}
                  >
                    {member.avatar}
                  </div>
                ))}
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message, index) => {
              const sender = getMemberById(message.senderId);
              const isCurrentUser = message.senderId === currentUserId;
              
              return (
                <motion.div
                  key={message.id}
                  className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Avatar */}
                  {!isCurrentUser && (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2"
                      style={{ 
                        backgroundColor: `${sender?.color}20`,
                        borderColor: sender?.color
                      }}
                    >
                      {sender?.avatar}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={`flex-1 max-w-xs ${isCurrentUser ? 'text-right' : ''}`}>
                    {/* Sender Name & Time */}
                    {!isCurrentUser && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-medium">{sender?.name}</span>
                        <span className="text-gray-400 text-xs">{message.timestamp}</span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <motion.div
                      className={`relative p-3 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-blue-500 text-white ml-auto'
                          : message.type === 'expense'
                          ? 'bg-green-500/20 border border-green-500/30 text-white'
                          : 'bg-white/10 text-white'
                      } ${isCurrentUser ? 'rounded-br-none' : 'rounded-bl-none'}`}
                      whileHover={{ scale: 1.02 }}
                    >
                      {message.type === 'text' ? (
                        <p className="text-sm">{message.content}</p>
                      ) : message.type === 'expense' && message.expenseData ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4" />
                            <span className="font-medium">New Expense</span>
                          </div>
                          <div>
                            <div className="font-bold text-lg">${message.expenseData.amount.toFixed(2)}</div>
                            <div className="text-sm opacity-90">{message.expenseData.description}</div>
                            <div className="text-xs opacity-75 capitalize">{message.expenseData.category}</div>
                          </div>
                          <div className="text-xs opacity-75">
                            Split between {message.expenseData.splitWith.length} people
                          </div>
                        </div>
                      ) : null}

                      {/* Read Status */}
                      {isCurrentUser && (
                        <div className="absolute -bottom-1 -right-1">
                          {message.isRead ? (
                            <CheckCheck className="w-3 h-3 text-blue-300" />
                          ) : (
                            <Check className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      )}

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, reactionIndex) => (
                            <motion.button
                              key={reactionIndex}
                              className="flex items-center gap-1 px-2 py-1 bg-black/20 rounded-full text-xs"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.userIds.length}</span>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </motion.div>

                    {/* Message Actions */}
                    <div className="flex items-center gap-2 mt-1 opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                        onClick={() => setShowEmojiPicker(
                          showEmojiPicker === message.id ? null : message.id
                        )}
                      >
                        <Smile className="w-3 h-3" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                        <Reply className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Emoji Picker */}
                    <AnimatePresence>
                      {showEmojiPicker === message.id && (
                        <motion.div
                          className="flex gap-1 mt-2 p-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          {commonEmojis.map((emoji) => (
                            <motion.button
                              key={emoji}
                              className="w-8 h-8 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
                              onClick={() => handleReaction(message.id, emoji)}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Timestamp for current user */}
                    {isCurrentUser && (
                      <div className="text-gray-400 text-xs mt-1">{message.timestamp}</div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping.length > 0 && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                </div>
                <div className="p-3 bg-white/10 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                <Camera className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              
              <motion.button
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 12 }).map((_, i) => {
          const xSeed = `group-particle-x-${i}`;
          const ySeed = `group-particle-y-${i}`;
          const delaySeed = `group-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-purple-400/20 text-lg"
              style={{
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, seededRandom(xSeed) * 30 - 15, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 8 + seededRandom(`group-duration-${i}`) * 8,
                delay: seededRandom(delaySeed) * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['💬', '💰', '🧾', '👥', '✨'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}