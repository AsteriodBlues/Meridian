'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import { 
  MessageSquare, ArrowLeft, Play, Pause, RotateCcw, Send, 
  Bot, User, Award, Target, TrendingUp, Zap, Star,
  Crown, Shield, Swords, ChevronRight, Mic, Volume2,
  Brain, Lightbulb, CheckCircle, XCircle, AlertTriangle,
  BarChart3, Clock, Trophy, Flame, Users, Heart
} from 'lucide-react';

// Negotiation interfaces
interface NegotiationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  category: 'automotive' | 'salary' | 'business' | 'real_estate' | 'services';
  estimatedTime: number; // minutes
  aiPersonality: AIPersonality;
  objectives: string[];
  tips: string[];
  successMetrics: SuccessMetric[];
}

interface AIPersonality {
  name: string;
  type: 'aggressive' | 'friendly' | 'analytical' | 'stubborn' | 'flexible';
  traits: string[];
  negotiationStyle: string;
  weaknesses: string[];
  avatar: string;
  backgroundColor: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'coach';
  content: string;
  timestamp: Date;
  type: 'message' | 'offer' | 'counteroffer' | 'tip' | 'warning';
  metadata?: {
    offerValue?: number;
    confidence?: number;
    effectiveness?: number;
  };
}

interface SuccessMetric {
  name: string;
  target: number;
  current: number;
  unit: string;
  weight: number; // importance 0-1
}

interface NegotiationSession {
  scenarioId: string;
  messages: Message[];
  startTime: Date;
  currentScore: number;
  objectives: { [key: string]: boolean };
  aiMood: number; // -100 to 100
  userConfidence: number; // 0-100
  round: number;
  isComplete: boolean;
  outcome: 'win' | 'lose' | 'draw' | null;
}

// Mock scenarios database
const negotiationScenarios: NegotiationScenario[] = [
  {
    id: 'car-dealership',
    title: 'Car Dealership Showdown',
    description: 'Negotiate the best price for your dream car with a seasoned sales manager who knows every trick in the book.',
    difficulty: 'intermediate',
    category: 'automotive',
    estimatedTime: 15,
    aiPersonality: {
      name: 'Rick "The Closer" Martinez',
      type: 'aggressive',
      traits: ['Persistent', 'Experienced', 'Pressure tactics', 'Time-sensitive offers'],
      negotiationStyle: 'High-pressure with artificial urgency and emotional manipulation',
      weaknesses: ['Impatient with research', 'Vulnerable to walking away', 'Overconfident'],
      avatar: '🚗',
      backgroundColor: 'from-red-500/20 to-orange-500/20'
    },
    objectives: [
      'Get at least 15% below asking price',
      'Secure financing under 4% APR',
      'Include extended warranty for free',
      'Maintain composure under pressure'
    ],
    tips: [
      'Research market value beforehand',
      'Be prepared to walk away',
      'Focus on total cost, not monthly payments',
      'Negotiate each item separately'
    ],
    successMetrics: [
      { name: 'Price Reduction', target: 15, current: 0, unit: '%', weight: 0.4 },
      { name: 'Interest Rate', target: 4, current: 6.5, unit: '%', weight: 0.3 },
      { name: 'Extras Value', target: 2000, current: 0, unit: '$', weight: 0.2 },
      { name: 'Confidence Level', target: 80, current: 50, unit: '%', weight: 0.1 }
    ]
  },
  {
    id: 'salary-negotiation',
    title: 'Salary Negotiation Mastery',
    description: 'Secure the raise you deserve in a performance review with your analytical but budget-conscious manager.',
    difficulty: 'expert',
    category: 'salary',
    estimatedTime: 20,
    aiPersonality: {
      name: 'Dr. Sarah Chen',
      type: 'analytical',
      traits: ['Data-driven', 'Fair but cautious', 'Budget-conscious', 'Values performance'],
      negotiationStyle: 'Methodical approach with emphasis on metrics and company constraints',
      weaknesses: ['Slow to make decisions', 'Influenced by solid data', 'Values loyalty'],
      avatar: '💼',
      backgroundColor: 'from-blue-500/20 to-purple-500/20'
    },
    objectives: [
      'Achieve 15%+ salary increase',
      'Secure additional vacation days',
      'Get professional development budget',
      'Maintain positive relationship'
    ],
    tips: [
      'Document your achievements quantitatively',
      'Research market rates for your role',
      'Emphasize future value you bring',
      'Be patient with decision timeline'
    ],
    successMetrics: [
      { name: 'Salary Increase', target: 15, current: 0, unit: '%', weight: 0.5 },
      { name: 'Additional Benefits', target: 3, current: 0, unit: 'items', weight: 0.3 },
      { name: 'Relationship Score', target: 85, current: 75, unit: '%', weight: 0.2 }
    ]
  },
  {
    id: 'freelance-contract',
    title: 'Freelance Contract Negotiation',
    description: 'Lock in premium rates and favorable terms with a startup founder who is cost-sensitive but values quality.',
    difficulty: 'beginner',
    category: 'business',
    estimatedTime: 10,
    aiPersonality: {
      name: 'Alex "Bootstrap" Johnson',
      type: 'friendly',
      traits: ['Cost-conscious', 'Values relationships', 'Growth-minded', 'Time-pressed'],
      negotiationStyle: 'Collaborative approach with focus on mutual benefit and long-term partnership',
      weaknesses: ['Budget constraints', 'Inexperienced with contracts', 'Values expertise'],
      avatar: '🚀',
      backgroundColor: 'from-green-500/20 to-teal-500/20'
    },
    objectives: [
      'Secure $75+ per hour rate',
      'Get 50% upfront payment',
      'Limit revision rounds to 3',
      'Establish ongoing relationship'
    ],
    tips: [
      'Emphasize value over cost',
      'Offer package deals',
      'Be flexible on payment terms',
      'Show portfolio examples'
    ],
    successMetrics: [
      { name: 'Hourly Rate', target: 75, current: 50, unit: '$', weight: 0.4 },
      { name: 'Upfront Payment', target: 50, current: 0, unit: '%', weight: 0.3 },
      { name: 'Contract Terms', target: 80, current: 60, unit: '%', weight: 0.3 }
    ]
  }
];

// Negotiation Training Arena Component
const NegotiationArena = ({ 
  scenario, 
  session, 
  onSendMessage,
  onEndSession 
}: {
  scenario: NegotiationScenario;
  session: NegotiationSession;
  onSendMessage: (message: string) => void;
  onEndSession: () => void;
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [showCoachTips, setShowCoachTips] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  
  const aiPersonality = scenario.aiPersonality;
  const lastMessage = session.messages[session.messages.length - 1];
  
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [session.messages]);
  
  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      onSendMessage(currentMessage);
      setCurrentMessage('');
      setIsTyping(true);
      
      // Simulate AI typing delay
      setTimeout(() => setIsTyping(false), 2000);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const getMoodColor = (mood: number) => {
    if (mood > 50) return 'text-green-400';
    if (mood > 0) return 'text-yellow-400';
    if (mood > -50) return 'text-orange-400';
    return 'text-red-400';
  };
  
  const getMoodEmoji = (mood: number) => {
    if (mood > 50) return '😊';
    if (mood > 0) return '🙂';
    if (mood > -50) return '😐';
    if (mood > -80) return '😤';
    return '😠';
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
      {/* Chat Interface */}
      <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b border-white/10 bg-gradient-to-r ${aiPersonality.backgroundColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                {aiPersonality.avatar}
              </div>
              <div>
                <h3 className="text-white font-semibold">{aiPersonality.name}</h3>
                <p className="text-gray-300 text-sm capitalize">{aiPersonality.type} negotiator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-400">AI Mood</div>
                <div className={`text-lg ${getMoodColor(session.aiMood)}`}>
                  {getMoodEmoji(session.aiMood)} {session.aiMood > 0 ? '+' : ''}{session.aiMood}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-400">Round</div>
                <div className="text-lg font-bold text-white">{session.round}</div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-400">Score</div>
                <div className="text-lg font-bold text-blue-400">{Math.round(session.currentScore)}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div ref={messagesRef} className="flex-1 p-6 overflow-y-auto space-y-4">
          {session.messages.map((message, idx) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                message.sender === 'user' 
                  ? 'bg-blue-500/20 border border-blue-500/30' 
                  : message.sender === 'ai'
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-purple-500/20 border border-purple-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-blue-400" />
                    ) : message.sender === 'ai' ? (
                      <span className="text-sm">{aiPersonality.avatar}</span>
                    ) : (
                      <Brain className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-white text-sm leading-relaxed">{message.content}</div>
                    
                    {message.metadata && (
                      <div className="mt-2 flex gap-3 text-xs">
                        {message.metadata.offerValue && (
                          <span className="text-green-400">💰 ${message.metadata.offerValue.toLocaleString()}</span>
                        )}
                        {message.metadata.effectiveness && (
                          <span className="text-yellow-400">⚡ {message.metadata.effectiveness}% effective</span>
                        )}
                        {message.metadata.confidence && (
                          <span className="text-blue-400">🎯 {message.metadata.confidence}% confidence</span>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{aiPersonality.avatar}</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, delay: i * 0.2, duration: 1 }}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">typing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Input */}
        <div className="p-6 border-t border-white/10">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your negotiation message..."
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-400"
              />
              
              <div className="absolute bottom-2 right-2 flex gap-2">
                <motion.button
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mic className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
            
            <motion.button
              className="px-6 py-3 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all disabled:opacity-50"
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isTyping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              Pro tip: Use "I need to think about this" to buy time
            </div>
            
            <motion.button
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
              onClick={onEndSession}
              whileHover={{ scale: 1.05 }}
            >
              End Session
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Coaching Panel */}
      <div className="space-y-6">
        {/* Performance Metrics */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Performance
          </h3>
          
          <div className="space-y-4">
            {scenario.successMetrics.map((metric, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{metric.name}</span>
                  <span className="text-white">
                    {metric.current}{metric.unit} / {metric.target}{metric.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min(100, (metric.current / metric.target) * 100)}%` 
                    }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI Personality */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-orange-400" />
            Know Your Opponent
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400 mb-1">Personality Type</div>
              <div className="text-white capitalize">{aiPersonality.type}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Key Traits</div>
              <div className="flex flex-wrap gap-1">
                {aiPersonality.traits.map((trait, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Weaknesses</div>
              <div className="text-sm text-green-400">
                {aiPersonality.weaknesses.join(' • ')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Coach Tips */}
        <AnimatePresence>
          {showCoachTips && (
            <motion.div
              className="bg-purple-500/10 border border-purple-500/30 rounded-3xl p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Coach Tips
                </h3>
                <motion.button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowCoachTips(false)}
                  whileHover={{ scale: 1.1 }}
                >
                  <XCircle className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="space-y-2">
                {scenario.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    <div className="text-sm text-gray-300">{tip}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Scenario Selection Component
const ScenarioSelector = ({ 
  scenarios, 
  onSelectScenario 
}: {
  scenarios: NegotiationScenario[];
  onSelectScenario: (scenario: NegotiationScenario) => void;
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'expert': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'automotive': return '🚗';
      case 'salary': return '💼';
      case 'business': return '🚀';
      case 'real_estate': return '🏠';
      case 'services': return '⚡';
      default: return '💬';
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {scenarios.map((scenario, index) => (
        <motion.div
          key={scenario.id}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 cursor-pointer group hover:bg-white/10 transition-all overflow-hidden relative"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          onClick={() => onSelectScenario(scenario)}
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${scenario.aiPersonality.backgroundColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="text-4xl">{getCategoryIcon(scenario.category)}</div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                {scenario.difficulty}
              </div>
            </div>
            
            {/* Title & Description */}
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
              {scenario.title}
            </h3>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {scenario.description}
            </p>
            
            {/* AI Opponent */}
            <div className="p-4 bg-white/5 rounded-2xl mb-6 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{scenario.aiPersonality.avatar}</div>
                <div>
                  <div className="text-white font-medium text-sm">{scenario.aiPersonality.name}</div>
                  <div className="text-gray-400 text-xs capitalize">{scenario.aiPersonality.type} style</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">{scenario.aiPersonality.negotiationStyle}</div>
            </div>
            
            {/* Objectives */}
            <div className="mb-6">
              <div className="text-sm font-medium text-white mb-2">Your Objectives:</div>
              <div className="space-y-1">
                {scenario.objectives.slice(0, 2).map((objective, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <Target className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span>{objective}</span>
                  </div>
                ))}
                {scenario.objectives.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{scenario.objectives.length - 2} more objectives
                  </div>
                )}
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{scenario.estimatedTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span className="capitalize">{scenario.category}</span>
              </div>
            </div>
            
            {/* Action Button */}
            <motion.button
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all group-hover:bg-blue-500/20 group-hover:border-blue-500/40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                <span>Start Negotiation</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function NegotiationDojoPage() {
  const [selectedScenario, setSelectedScenario] = useState<NegotiationScenario | null>(null);
  const [currentSession, setCurrentSession] = useState<NegotiationSession | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Initialize session when scenario is selected
  useEffect(() => {
    if (selectedScenario && !currentSession) {
      const session: NegotiationSession = {
        scenarioId: selectedScenario.id,
        messages: [
          {
            id: 'welcome',
            sender: 'ai',
            content: `Welcome to the negotiation! I'm ${selectedScenario.aiPersonality.name}. ${getOpeningMessage(selectedScenario)}`,
            timestamp: new Date(),
            type: 'message',
            metadata: { confidence: 85 }
          }
        ],
        startTime: new Date(),
        currentScore: 50,
        objectives: {},
        aiMood: 0,
        userConfidence: 50,
        round: 1,
        isComplete: false,
        outcome: null
      };
      
      setCurrentSession(session);
    }
  }, [selectedScenario, currentSession]);

  const getOpeningMessage = (scenario: NegotiationScenario): string => {
    switch (scenario.id) {
      case 'car-dealership':
        return "So you're interested in this beauty? I've got three other customers looking at this exact model. What kind of numbers are we talking about today?";
      case 'salary-negotiation':
        return "Thank you for scheduling this performance review. I've reviewed your work this year. Let's discuss your compensation and growth opportunities.";
      case 'freelance-contract':
        return "Great to meet with you! We're excited about potentially working together. Let's talk about the project scope and how we can make this work for both of us.";
      default:
        return "Let's begin our negotiation. I'm ready to discuss terms.";
    }
  };

  const generateAIResponse = (userMessage: string, scenario: NegotiationScenario): Message => {
    // Simple AI response logic (in real app, this would be more sophisticated)
    const responses = {
      'car-dealership': [
        "Look, I can see you're serious about this car. The best I can do is knock off $500 from the asking price, but that's really pushing it.",
        "That's a pretty low offer. This car has premium features and barely any miles. How about we meet in the middle?",
        "I appreciate the negotiation, but I've got bills to pay too. Let me talk to my manager about your offer.",
      ],
      'salary-negotiation': [
        "I understand your perspective. Let me review our budget constraints and current market rates for your role.",
        "Your performance has been solid, but we need to consider the team equity and department budget.",
        "That's an interesting proposal. Can you help me understand the specific value you've delivered this quarter?",
      ],
      'freelance-contract': [
        "I like working with quality freelancers, but we're a startup with limited budget. Can we find a creative solution?",
        "Your portfolio looks great! What if we structured this as a longer-term partnership with different rate tiers?",
        "I'm interested in your expertise. How flexible are you on timeline and deliverables?",
      ]
    };

    const scenarioResponses = responses[scenario.id] || ["That's an interesting point. Let me consider that."];
    const randomResponse = scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];
    
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      content: randomResponse,
      timestamp: new Date(),
      type: 'message',
      metadata: {
        confidence: 70 + Math.random() * 20,
        effectiveness: 60 + Math.random() * 30
      }
    };
  };

  const handleSendMessage = (messageContent: string) => {
    if (!selectedScenario || !currentSession) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: messageContent,
      timestamp: new Date(),
      type: 'message',
      metadata: {
        confidence: 60 + Math.random() * 30
      }
    };

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageContent, selectedScenario);
      
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, userMessage, aiResponse],
          round: prev.round + 1,
          currentScore: Math.min(100, prev.currentScore + Math.random() * 10 - 5),
          aiMood: Math.max(-100, Math.min(100, prev.aiMood + (Math.random() * 20 - 10))),
          userConfidence: Math.min(100, prev.userConfidence + Math.random() * 5)
        };
      });
    }, 1500);

    // Add user message immediately
    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, userMessage]
      };
    });
  };

  const handleEndSession = () => {
    setShowResults(true);
  };

  const handleBackToScenarios = () => {
    setSelectedScenario(null);
    setCurrentSession(null);
    setShowResults(false);
  };

  return (
    <PageLayout>
      <TimeBasedBackground>
        <MagneticCursor />
        
        <div className="min-h-screen">
          {/* Header */}
          <motion.div
            className="max-w-7xl mx-auto px-6 py-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.button
                className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                onClick={selectedScenario ? handleBackToScenarios : () => window.history.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div>
                <h1 className="text-3xl font-bold text-white">Negotiation Theater</h1>
                <p className="text-gray-400">
                  {selectedScenario ? 'Master the art of negotiation' : 'Choose your training scenario'}
                </p>
              </div>
            </div>

            {/* Theater intro */}
            {!selectedScenario && (
              <motion.div
                className="bg-gradient-to-r from-red-500/10 via-orange-500/5 to-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/20 border border-red-500/40 mb-6"
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(239, 68, 68, 0.3)',
                        '0 0 30px rgba(239, 68, 68, 0.5)',
                        '0 0 20px rgba(239, 68, 68, 0.3)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Swords className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 font-semibold">AI Training Dojo</span>
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Train Against the Best
                  </h2>
                  <p className="text-gray-300 text-xl max-w-3xl mx-auto">
                    Face off against AI opponents with unique personalities and negotiation styles. 
                    Build confidence, learn tactics, and unlock your bargaining power through realistic scenarios.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bot className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="text-white font-semibold">AI Opponents</div>
                    <div className="text-gray-400 text-sm">Unique personalities</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="text-white font-semibold">Real-time Coaching</div>
                    <div className="text-gray-400 text-sm">Live feedback</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="text-white font-semibold">Performance Analytics</div>
                    <div className="text-gray-400 text-sm">Track improvement</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-white font-semibold">Skill Building</div>
                    <div className="text-gray-400 text-sm">Progressive difficulty</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {!selectedScenario ? (
              // Scenario Selection
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Choose Your Challenge</h2>
                  <p className="text-gray-400">
                    Each scenario features a unique AI opponent with different negotiation styles and weaknesses
                  </p>
                </div>
                
                <ScenarioSelector
                  scenarios={negotiationScenarios}
                  onSelectScenario={setSelectedScenario}
                />
              </motion.div>
            ) : currentSession && !showResults ? (
              // Active Negotiation
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <NegotiationArena
                  scenario={selectedScenario}
                  session={currentSession}
                  onSendMessage={handleSendMessage}
                  onEndSession={handleEndSession}
                />
              </motion.div>
            ) : showResults && currentSession ? (
              // Results Screen
              <motion.div
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Award className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Negotiation Complete!</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{Math.round(currentSession.currentScore)}</div>
                    <div className="text-gray-400">Final Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{currentSession.round}</div>
                    <div className="text-gray-400">Rounds Played</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{Math.round(currentSession.userConfidence)}%</div>
                    <div className="text-gray-400">Confidence Gained</div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <motion.button
                    className="px-6 py-3 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all"
                    onClick={() => setSelectedScenario(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Another Scenario
                  </motion.button>
                  
                  <motion.button
                    className="px-6 py-3 bg-green-500/20 border border-green-500/40 text-green-300 rounded-xl hover:bg-green-500/30 transition-all"
                    onClick={() => {
                      setCurrentSession(null);
                      setShowResults(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Retry This Scenario
                  </motion.button>
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}