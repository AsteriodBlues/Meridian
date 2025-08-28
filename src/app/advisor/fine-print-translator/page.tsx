'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import { 
  Search, ArrowLeft, Type, Zap, BookOpen, Languages, 
  Brain, Lightbulb, Eye, Sparkles, Target, Clock,
  Upload, Copy, Share, Download, RefreshCw, Volume2,
  AlertTriangle, CheckCircle, Info, Star, Award,
  Compass, Map, Route, Gem, Crown, Shield, Users,
  FileText, Scroll, Book, Library, Glasses, Wand2
} from 'lucide-react';

// Translation interfaces
interface LegalTerm {
  term: string;
  definition: string;
  plainEnglish: string;
  example: string;
  riskLevel: 'low' | 'medium' | 'high';
  category: 'contract' | 'financial' | 'legal' | 'insurance' | 'real_estate';
}

interface TranslationResult {
  originalText: string;
  translatedText: string;
  keyTerms: LegalTerm[];
  complexityScore: number; // 0-100
  readabilityLevel: string;
  warnings: Warning[];
  suggestions: string[];
  confidence: number; // 0-100
}

interface Warning {
  id: string;
  type: 'risk' | 'ambiguity' | 'complexity' | 'missing_info';
  message: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

// Comprehensive legal terms database
const legalTermsDatabase: LegalTerm[] = [
  {
    term: 'Force Majeure',
    definition: 'Unforeseeable circumstances that prevent a party from fulfilling a contract',
    plainEnglish: 'If something crazy happens (like a natural disaster or war) that makes it impossible to do what we agreed, neither party is in trouble for not doing it.',
    example: 'During COVID-19, many businesses invoked force majeure clauses to avoid penalties for delayed deliveries.',
    riskLevel: 'medium',
    category: 'contract'
  },
  {
    term: 'Indemnification',
    definition: 'Security or protection against a loss or other financial burden',
    plainEnglish: 'If someone sues us because of something you did, you have to pay for our legal costs and any damages.',
    example: 'The contractor agreed to indemnify the property owner against any workplace injury claims.',
    riskLevel: 'high',
    category: 'legal'
  },
  {
    term: 'Liquidated Damages',
    definition: 'A predetermined amount of money that must be paid if a contract is breached',
    plainEnglish: 'If you break the contract, you pay this specific dollar amount as punishment, no questions asked.',
    example: 'If the wedding venue cancels within 30 days, they owe $5,000 in liquidated damages.',
    riskLevel: 'high',
    category: 'financial'
  },
  {
    term: 'Arbitration Clause',
    definition: 'Agreement to resolve disputes through arbitration rather than court litigation',
    plainEnglish: 'Instead of going to court, we agree to let a private judge (arbitrator) decide our disputes.',
    example: 'The employment contract required all disputes to go through binding arbitration.',
    riskLevel: 'medium',
    category: 'legal'
  },
  {
    term: 'Severability',
    definition: 'If one part of a contract is invalid, the rest remains enforceable',
    plainEnglish: 'If a court says one piece of our agreement is illegal, the rest of the contract still counts.',
    example: 'Even though the non-compete clause was unenforceable, the severability clause kept the employment contract valid.',
    riskLevel: 'low',
    category: 'contract'
  },
  {
    term: 'Usufruct',
    definition: 'The right to use and derive income from property belonging to another',
    plainEnglish: 'You can use someone else\'s property and keep any money it makes, but you can\'t sell it.',
    example: 'The heir received usufruct rights to the family farm, allowing them to farm it but not sell it.',
    riskLevel: 'medium',
    category: 'real_estate'
  },
  {
    term: 'Subrogation',
    definition: 'The substitution of one creditor for another',
    plainEnglish: 'When your insurance pays for damage, they can then go after whoever caused it to get their money back.',
    example: 'After paying for car repairs, the insurance company used subrogation to recover costs from the at-fault driver.',
    riskLevel: 'low',
    category: 'insurance'
  }
];

// Mock translation function
const translateLegalText = (text: string): TranslationResult => {
  // Simulate processing time and analysis
  const foundTerms = legalTermsDatabase.filter(term => 
    text.toLowerCase().includes(term.term.toLowerCase())
  );
  
  // Generate translated text (simplified version)
  let translatedText = text;
  foundTerms.forEach(term => {
    const regex = new RegExp(term.term, 'gi');
    translatedText = translatedText.replace(regex, `${term.term} (${term.plainEnglish})`);
  });
  
  // Calculate complexity score
  const complexWords = [
    'heretofore', 'hereinafter', 'notwithstanding', 'whereas', 'forthwith',
    'aforementioned', 'thereof', 'herein', 'hereunder', 'pursuant'
  ];
  const complexWordCount = complexWords.reduce((count, word) => 
    count + (text.toLowerCase().split(word.toLowerCase()).length - 1), 0
  );
  const complexityScore = Math.min(100, (complexWordCount / text.split(' ').length) * 1000);
  
  // Generate warnings
  const warnings: Warning[] = [];
  if (foundTerms.some(term => term.riskLevel === 'high')) {
    warnings.push({
      id: 'high-risk-terms',
      type: 'risk',
      message: 'This document contains high-risk legal terms that could significantly impact your rights.',
      severity: 'high',
      suggestion: 'Consider consulting with a lawyer before signing.'
    });
  }
  
  if (complexityScore > 70) {
    warnings.push({
      id: 'high-complexity',
      type: 'complexity',
      message: 'This document is written in complex legal language.',
      severity: 'medium',
      suggestion: 'Request a plain English version or summary from the other party.'
    });
  }
  
  const readabilityLevel = complexityScore > 80 ? 'Law School' :
                          complexityScore > 60 ? 'College' :
                          complexityScore > 40 ? 'High School' :
                          complexityScore > 20 ? 'Middle School' : 'Elementary';
  
  return {
    originalText: text,
    translatedText,
    keyTerms: foundTerms,
    complexityScore,
    readabilityLevel,
    warnings,
    suggestions: [
      'Ask for definitions of any terms you don\'t understand',
      'Take time to review - never rush into signing',
      'Consider getting a second opinion from a professional',
      'Negotiate terms that seem unfair or unclear'
    ],
    confidence: 85 + Math.random() * 10
  };
};

// Decoder Ring Component
const DecoderRing = ({ 
  isTranslating, 
  result 
}: { 
  isTranslating: boolean;
  result: TranslationResult | null;
}) => {
  const ringRef = useRef<HTMLDivElement>(null);
  
  const complexityColor = result ? 
    result.complexityScore > 80 ? '#EF4444' :
    result.complexityScore > 60 ? '#F59E0B' :
    result.complexityScore > 40 ? '#EAB308' : '#10B981'
    : '#6366F1';
  
  return (
    <div className="relative w-full h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/20 via-indigo-800/10 to-pink-900/20 border border-white/10">
      <div 
        ref={ringRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        {/* Ancient pedestal */}
        <div className="absolute bottom-0 w-32 h-16 bg-gradient-to-t from-amber-700/40 to-amber-500/20 rounded-t-full" />
        
        {/* Main decoder ring */}
        <motion.div
          className="relative w-48 h-48 rounded-full border-4 border-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
          animate={isTranslating ? {
            rotate: 360,
            scale: [1, 1.05, 1],
          } : result ? {
            rotate: [0, 10, -10, 0],
            scale: [1, 1.02, 1]
          } : {}}
          transition={isTranslating ? {
            rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity }
          } : {
            rotate: { duration: 4, repeat: Infinity },
            scale: { duration: 3, repeat: Infinity }
          }}
          style={{
            background: `conic-gradient(from 0deg, ${complexityColor}20, ${complexityColor}40, ${complexityColor}20, transparent, ${complexityColor}20)`,
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Inner ring with symbols */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-900/40 via-purple-800/30 to-pink-900/40 border-2 border-white/20">
            {/* Center crystal/gem */}
            <motion.div
              className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/40 to-purple-600/30 flex items-center justify-center"
              animate={{
                boxShadow: isTranslating ? [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(147, 51, 234, 0.8)',
                  '0 0 20px rgba(59, 130, 246, 0.5)'
                ] : [
                  '0 0 10px rgba(99, 102, 241, 0.3)',
                  '0 0 20px rgba(99, 102, 241, 0.5)',
                  '0 0 10px rgba(99, 102, 241, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isTranslating ? (
                <Languages className="w-8 h-8 text-white" />
              ) : result ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <Wand2 className="w-8 h-8 text-purple-400" />
              )}
            </motion.div>
            
            {/* Rotating symbols around the ring */}
            {['⚖️', '📜', '🔍', '💡', '📖', '🎯'].map((symbol, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-8 flex items-center justify-center text-lg"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-60px) rotate(-${i * 60}deg)`
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, delay: i * 0.3 },
                  opacity: { duration: 3, repeat: Infinity, delay: i * 0.5 }
                }}
              >
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur">
                  <span className="text-xs">{symbol}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Mystical runes floating around */}
        <div className="absolute inset-0">
          {['§', '¶', '©', '®', '™', '℠'].map((rune, i) => (
            <motion.div
              key={i}
              className="absolute text-white/30 text-xl font-bold"
              style={{
                left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 30}%`
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              {rune}
            </motion.div>
          ))}
        </div>
        
        {/* Translation status */}
        <div className="absolute top-4 left-4 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
          <div className="flex items-center gap-2">
            {isTranslating ? (
              <>
                <motion.div
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-blue-300 text-sm font-medium">Decoding...</span>
              </>
            ) : result ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">Decoded!</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Ready</span>
              </>
            )}
          </div>
        </div>
        
        {/* Complexity indicator */}
        {result && (
          <div className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <div className="text-center">
              <div className={`text-lg font-bold mb-1`} style={{ color: complexityColor }}>
                {Math.round(result.complexityScore)}%
              </div>
              <div className="text-xs text-gray-300">Complexity</div>
              <div className="text-xs text-gray-400 mt-1">{result.readabilityLevel}</div>
            </div>
          </div>
        )}
        
        {/* Power emanation effects */}
        {(isTranslating || result) && (
          <div className="absolute inset-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
                style={{
                  left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 35}%`,
                  top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 35}%`
                }}
                animate={{
                  scale: [0, 2, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Text Input Component
const TextInput = ({ 
  onTranslate, 
  isTranslating 
}: {
  onTranslate: (text: string) => void;
  isTranslating: boolean;
}) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const sampleTexts = [
    {
      title: 'Employment Contract',
      text: 'The Employee hereby acknowledges and agrees to indemnify and hold harmless the Company from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys\' fees) arising out of or in connection with the Employee\'s performance of services hereunder, except to the extent such claims arise from the gross negligence or willful misconduct of the Company.'
    },
    {
      title: 'Lease Agreement',
      text: 'Tenant shall be liable for liquidated damages in the amount of two months\' rent for early termination of this lease, notwithstanding any force majeure events or circumstances beyond Tenant\'s reasonable control.'
    },
    {
      title: 'Service Contract',
      text: 'Any disputes arising hereunder shall be subject to binding arbitration pursuant to the rules of the American Arbitration Association. The parties hereby waive their respective rights to a jury trial and agree that the arbitrator\'s decision shall be final and non-appealable.'
    }
  ];
  
  const handleTranslate = () => {
    if (inputText.trim()) {
      onTranslate(inputText);
    }
  };
  
  const handleSampleSelect = (sampleText: string) => {
    setInputText(sampleText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Type className="w-6 h-6 text-purple-400" />
            Enter Legal Text
          </h3>
          <div className="text-sm text-gray-400">
            {inputText.length}/10000 characters
          </div>
        </div>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your legal document, contract clause, or terms of service here..."
            rows={8}
            maxLength={10000}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 transition-colors"
          />
          
          {inputText && (
            <motion.button
              className="absolute bottom-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setInputText('')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </motion.button>
          )}
        </div>
        
        <div className="flex gap-4 mt-6">
          <motion.button
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              inputText.trim() && !isTranslating
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30'
                : 'bg-gray-500/10 border border-gray-500/20 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            whileHover={inputText.trim() && !isTranslating ? { scale: 1.05 } : {}}
            whileTap={inputText.trim() && !isTranslating ? { scale: 0.95 } : {}}
          >
            <div className="flex items-center gap-2">
              {isTranslating ? (
                <motion.div
                  className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>{isTranslating ? 'Translating...' : 'Translate to Plain English'}</span>
            </div>
          </motion.button>
          
          <motion.button
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      {/* Sample Texts */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Try These Samples
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleTexts.map((sample, index) => (
            <motion.button
              key={index}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all"
              onClick={() => handleSampleSelect(sample.text)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-semibold text-white mb-2">{sample.title}</div>
              <div className="text-xs text-gray-400 line-clamp-3">
                {sample.text.substring(0, 120)}...
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function FinePrintTranslatorPage() {
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeSection, setActiveSection] = useState<'translation' | 'terms' | 'warnings'>('translation');

  const handleTranslate = useCallback((text: string) => {
    setIsTranslating(true);
    setTranslationResult(null);
    
    // Simulate translation processing time
    setTimeout(() => {
      const result = translateLegalText(text);
      setTranslationResult(result);
      setIsTranslating(false);
    }, 2500);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
      default: return 'text-green-400 bg-green-500/20 border-green-500/40';
    }
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
                onClick={() => window.history.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div>
                <h1 className="text-3xl font-bold text-white">Fine Print Translator</h1>
                <p className="text-gray-400">Ancient decoder ring meets modern AI translation</p>
              </div>
            </div>

            {/* Decoder Ring intro */}
            {!translationResult && !isTranslating && (
              <motion.div
                className="bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/20 border border-purple-500/40 mb-6"
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(147, 51, 234, 0.3)',
                        '0 0 30px rgba(147, 51, 234, 0.5)',
                        '0 0 20px rgba(147, 51, 234, 0.3)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Wand2 className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300 font-semibold">Jargon Decoder Ring</span>
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Transform Legal Gibberish
                  </h2>
                  <p className="text-gray-300 text-xl max-w-3xl mx-auto">
                    Paste any legal document and watch our mystical decoder ring translate 
                    complex jargon into plain English that actually makes sense.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Languages className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-white font-semibold">AI Translation</div>
                    <div className="text-gray-400 text-sm">Instant conversion</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-pink-400" />
                    </div>
                    <div className="text-white font-semibold">Legal Dictionary</div>
                    <div className="text-gray-400 text-sm">Term definitions</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="text-white font-semibold">Risk Warnings</div>
                    <div className="text-gray-400 text-sm">Danger alerts</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lightbulb className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-white font-semibold">Smart Suggestions</div>
                    <div className="text-gray-400 text-sm">Actionable advice</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {!translationResult && !isTranslating ? (
              // Input Interface
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <TextInput onTranslate={handleTranslate} isTranslating={false} />
              </motion.div>
            ) : (
              // Results or Processing
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Decoder Ring Visualization */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {isTranslating ? 'Decoding Legal Text...' : 'Translation Complete'}
                  </h2>
                  <p className="text-gray-400">
                    {isTranslating 
                      ? 'Our ancient decoder ring is working its magic'
                      : `Decoded with ${translationResult?.confidence.toFixed(1)}% confidence`
                    }
                  </p>
                </div>
                
                <DecoderRing isTranslating={isTranslating} result={translationResult} />
                
                {translationResult && (
                  <>
                    {/* Navigation Tabs */}
                    <div className="flex justify-center">
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                        {[
                          { id: 'translation', label: 'Translation', icon: Languages },
                          { id: 'terms', label: 'Key Terms', icon: BookOpen },
                          { id: 'warnings', label: 'Warnings', icon: AlertTriangle }
                        ].map(tab => (
                          <motion.button
                            key={tab.id}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${
                              activeSection === tab.id
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                            onClick={() => setActiveSection(tab.id as any)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="flex items-center gap-2">
                              <tab.icon className="w-4 h-4" />
                              <span>{tab.label}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                      {activeSection === 'translation' && (
                        <motion.div
                          key="translation"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                          {/* Original Text */}
                          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Scroll className="w-6 h-6 text-gray-400" />
                                Original Legal Text
                              </h3>
                              <motion.button
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Copy className="w-4 h-4 text-gray-400" />
                              </motion.button>
                            </div>
                            
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <div className="text-gray-300 text-sm leading-relaxed font-mono">
                                {translationResult.originalText}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                              <span>Complexity: {translationResult.complexityScore}%</span>
                              <span>Reading Level: {translationResult.readabilityLevel}</span>
                            </div>
                          </div>
                          
                          {/* Plain English Translation */}
                          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Lightbulb className="w-6 h-6 text-green-400" />
                                Plain English Translation
                              </h3>
                              <motion.button
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Volume2 className="w-4 h-4 text-gray-400" />
                              </motion.button>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl p-6 border border-green-500/20">
                              <div className="text-gray-200 text-sm leading-relaxed">
                                {translationResult.translatedText}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-xs text-green-400">
                                Translation confidence: {translationResult.confidence.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {activeSection === 'terms' && (
                        <motion.div
                          key="terms"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-4">
                              📚 Legal Terms Dictionary ({translationResult.keyTerms.length})
                            </h3>
                            <p className="text-gray-400">
                              Key legal terms found in your document with plain English explanations
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {translationResult.keyTerms.map((term, index) => (
                              <motion.div
                                key={term.term}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <h4 className="text-lg font-bold text-white">{term.term}</h4>
                                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(term.riskLevel)}`}>
                                    {term.riskLevel} risk
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <div className="text-sm font-semibold text-gray-300 mb-1">Legal Definition:</div>
                                    <div className="text-sm text-gray-400">{term.definition}</div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm font-semibold text-green-300 mb-1">Plain English:</div>
                                    <div className="text-sm text-gray-200">{term.plainEnglish}</div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm font-semibold text-blue-300 mb-1">Example:</div>
                                    <div className="text-sm text-gray-400 italic">{term.example}</div>
                                  </div>
                                  
                                  <div className="pt-3 border-t border-white/10">
                                    <span className={`text-xs px-2 py-1 rounded-lg ${
                                      term.category === 'contract' ? 'bg-blue-500/20 text-blue-400' :
                                      term.category === 'financial' ? 'bg-green-500/20 text-green-400' :
                                      term.category === 'legal' ? 'bg-red-500/20 text-red-400' :
                                      term.category === 'insurance' ? 'bg-purple-500/20 text-purple-400' :
                                      'bg-orange-500/20 text-orange-400'
                                    }`}>
                                      {term.category}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {activeSection === 'warnings' && (
                        <motion.div
                          key="warnings"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-4">
                              ⚠️ Warnings & Suggestions ({translationResult.warnings.length})
                            </h3>
                            <p className="text-gray-400">
                              Important alerts and recommendations for this document
                            </p>
                          </div>
                          
                          {/* Warnings */}
                          {translationResult.warnings.length > 0 && (
                            <div className="space-y-4 mb-8">
                              <h4 className="text-lg font-semibold text-white">🚨 Warnings</h4>
                              {translationResult.warnings.map((warning, index) => (
                                <motion.div
                                  key={warning.id}
                                  className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-6 ${getSeverityColor(warning.severity)}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                      <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-semibold text-white mb-2">{warning.message}</div>
                                      <div className="text-sm text-gray-300 mb-3">{warning.suggestion}</div>
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-lg ${getSeverityColor(warning.severity)}`}>
                                          {warning.severity} severity
                                        </span>
                                        <span className="text-xs text-gray-500 capitalize">{warning.type}</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          
                          {/* General Suggestions */}
                          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-yellow-400" />
                              General Recommendations
                            </h4>
                            
                            <div className="space-y-4">
                              {translationResult.suggestions.map((suggestion, index) => (
                                <motion.div
                                  key={index}
                                  className="flex items-start gap-3"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                                  <div className="text-gray-300">{suggestion}</div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 pt-8">
                      <motion.button
                        className="px-6 py-3 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all"
                        onClick={() => {
                          setTranslationResult(null);
                          setIsTranslating(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center gap-2">
                          <Type className="w-4 h-4" />
                          <span>Translate Another Document</span>
                        </div>
                      </motion.button>
                      
                      <motion.button
                        className="px-6 py-3 bg-green-500/20 border border-green-500/40 text-green-300 rounded-xl hover:bg-green-500/30 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          <span>Export Translation</span>
                        </div>
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}