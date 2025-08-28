'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import { 
  FileText, ArrowLeft, Upload, Scan, AlertTriangle, CheckCircle, 
  XCircle, Eye, Search, Lightbulb, Shield, Target, Zap,
  Download, Share, BookOpen, Scale, Gavel, Lock, Unlock,
  Clock, DollarSign, Users, Building, Smartphone, Wifi,
  Star, Award, Brain, Compass, Map, Route, Flag, Bell
} from 'lucide-react';

// Contract analysis interfaces
interface ContractClause {
  id: string;
  text: string;
  type: 'penalty' | 'termination' | 'liability' | 'payment' | 'scope' | 'warranty' | 'dispute' | 'other';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  severity: number; // 0-100
  startPosition: number;
  endPosition: number;
  plainEnglish: string;
  recommendations: string[];
  precedent?: string;
  legalConcern: string;
}

interface RedFlag {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  category: 'financial' | 'legal' | 'operational' | 'compliance';
  impact: string;
  suggestion: string;
  clauseIds: string[];
  confidence: number; // 0-100
}

interface ContractAnalysis {
  id: string;
  fileName: string;
  contractType: 'employment' | 'service' | 'lease' | 'purchase' | 'nda' | 'partnership' | 'license' | 'other';
  overallRisk: number; // 0-100
  clauses: ContractClause[];
  redFlags: RedFlag[];
  summary: {
    totalClauses: number;
    riskyClauses: number;
    keyTerms: string[];
    recommendations: string[];
  };
  escapeRoutes: EscapeRoute[];
  analyzedAt: Date;
}

interface EscapeRoute {
  id: string;
  title: string;
  description: string;
  conditions: string[];
  timeline: string;
  difficulty: 'easy' | 'moderate' | 'difficult';
  cost: 'free' | 'low' | 'medium' | 'high';
  clauseReference: string;
}

// Mock contract analysis data
const generateMockAnalysis = (fileName: string): ContractAnalysis => {
  const contractTypes = ['employment', 'service', 'lease', 'purchase', 'nda'] as const;
  const contractType = contractTypes[Math.floor(Math.random() * contractTypes.length)];
  
  const mockClauses: ContractClause[] = [
    {
      id: 'clause-1',
      text: 'The Company may terminate this agreement at any time without cause upon 24 hours written notice.',
      type: 'termination',
      riskLevel: 'high',
      severity: 85,
      startPosition: 1247,
      endPosition: 1352,
      plainEnglish: 'They can fire you with just one day notice for any reason.',
      recommendations: [
        'Negotiate for longer notice period (30+ days)',
        'Request severance clause',
        'Add "for cause" requirement'
      ],
      legalConcern: 'Extremely short notice period provides minimal job security'
    },
    {
      id: 'clause-2',
      text: 'Employee agrees to indemnify and hold harmless the Company from any and all claims, damages, or expenses arising from Employee\'s performance.',
      type: 'liability',
      riskLevel: 'critical',
      severity: 95,
      startPosition: 2156,
      endPosition: 2298,
      plainEnglish: 'You\'re personally responsible for any lawsuit or damage, even if it\'s not your fault.',
      recommendations: [
        'Remove personal liability clause entirely',
        'Limit liability to gross negligence only',
        'Request company insurance coverage'
      ],
      legalConcern: 'Unlimited personal liability exposure'
    },
    {
      id: 'clause-3',
      text: 'All intellectual property created during employment belongs exclusively to the Company, including work done outside of business hours.',
      type: 'scope',
      riskLevel: 'medium',
      severity: 70,
      startPosition: 3421,
      endPosition: 3567,
      plainEnglish: 'Anything you create, even your weekend projects, belongs to them.',
      recommendations: [
        'Limit to work-related IP only',
        'Exclude personal projects',
        'Add prior inventions disclosure'
      ],
      legalConcern: 'Overly broad IP assignment affecting personal work'
    },
    {
      id: 'clause-4',
      text: 'Any disputes shall be resolved through binding arbitration. Employee waives right to jury trial and class action participation.',
      type: 'dispute',
      riskLevel: 'high',
      severity: 80,
      startPosition: 4892,
      endPosition: 5034,
      plainEnglish: 'You can\'t sue them in court or join with other employees in a lawsuit.',
      recommendations: [
        'Negotiate for court option for certain claims',
        'Ensure arbitrator selection is fair',
        'Exclude statutory claims from arbitration'
      ],
      legalConcern: 'Severely limits legal recourse options'
    },
    {
      id: 'clause-5',
      text: 'Late payment fees of 2% per month will be charged on overdue amounts.',
      type: 'penalty',
      riskLevel: 'medium',
      severity: 60,
      startPosition: 6123,
      endPosition: 6201,
      plainEnglish: 'They charge 24% per year (2% monthly) for late payments.',
      recommendations: [
        'Negotiate grace period before fees',
        'Reduce penalty rate',
        'Cap total penalty amount'
      ],
      legalConcern: 'High interest rate may be considered usurious'
    }
  ];

  const mockRedFlags: RedFlag[] = [
    {
      id: 'flag-1',
      title: 'Unlimited Personal Liability',
      description: 'The contract makes you personally responsible for any claims against the company.',
      severity: 'critical',
      category: 'legal',
      impact: 'Could result in personal financial ruin from lawsuits',
      suggestion: 'Demand liability limitation or company insurance coverage',
      clauseIds: ['clause-2'],
      confidence: 95
    },
    {
      id: 'flag-2',
      title: 'At-Will Termination with Minimal Notice',
      description: 'Company can terminate without cause with only 24 hours notice.',
      severity: 'major',
      category: 'operational',
      impact: 'Provides no job security or time to find new employment',
      suggestion: 'Negotiate 30+ day notice period and severance package',
      clauseIds: ['clause-1'],
      confidence: 88
    },
    {
      id: 'flag-3',
      title: 'Overly Broad IP Assignment',
      description: 'Company claims ownership of all your creative work, even personal projects.',
      severity: 'moderate',
      category: 'legal',
      impact: 'Loss of rights to personal innovations and side projects',
      suggestion: 'Limit IP assignment to work-related inventions only',
      clauseIds: ['clause-3'],
      confidence: 82
    },
    {
      id: 'flag-4',
      title: 'Mandatory Arbitration with Jury Waiver',
      description: 'Forced arbitration prevents access to courts and class action participation.',
      severity: 'major',
      category: 'legal',
      impact: 'Severely limits legal remedies for disputes',
      suggestion: 'Carve out exceptions for statutory claims and ensure fair arbitrator selection',
      clauseIds: ['clause-4'],
      confidence: 91
    }
  ];

  const mockEscapeRoutes: EscapeRoute[] = [
    {
      id: 'escape-1',
      title: 'Standard Termination Notice',
      description: 'Terminate the agreement with proper written notice.',
      conditions: [
        'Provide 30 days written notice',
        'Complete all pending deliverables',
        'Return company property'
      ],
      timeline: '30 days',
      difficulty: 'easy',
      cost: 'free',
      clauseReference: 'Section 12.1'
    },
    {
      id: 'escape-2',
      title: 'Material Breach Termination',
      description: 'Terminate immediately if the other party breaches material terms.',
      conditions: [
        'Document the material breach',
        'Provide written notice of breach',
        'Allow 15-day cure period if specified'
      ],
      timeline: '15-30 days',
      difficulty: 'moderate',
      cost: 'low',
      clauseReference: 'Section 12.2'
    },
    {
      id: 'escape-3',
      title: 'Mutual Agreement',
      description: 'Both parties agree to terminate the contract early.',
      conditions: [
        'Negotiate terms with other party',
        'Document agreement in writing',
        'Address any outstanding obligations'
      ],
      timeline: 'Variable',
      difficulty: 'moderate',
      cost: 'medium',
      clauseReference: 'Section 12.3'
    }
  ];

  return {
    id: `analysis-${Date.now()}`,
    fileName,
    contractType,
    overallRisk: Math.round(mockRedFlags.reduce((sum, flag) => {
      const severityScore = { minor: 25, moderate: 50, major: 75, critical: 100 }[flag.severity];
      return sum + severityScore;
    }, 0) / mockRedFlags.length),
    clauses: mockClauses,
    redFlags: mockRedFlags,
    summary: {
      totalClauses: mockClauses.length,
      riskyClauses: mockClauses.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length,
      keyTerms: ['Termination Rights', 'Liability', 'Intellectual Property', 'Dispute Resolution'],
      recommendations: [
        'Negotiate longer termination notice period',
        'Limit personal liability exposure',
        'Clarify IP ownership boundaries',
        'Review arbitration requirements'
      ]
    },
    escapeRoutes: mockEscapeRoutes,
    analyzedAt: new Date()
  };
};

// Legal Lighthouse Component
const LegalLighthouse = ({ 
  analysis, 
  isScanning 
}: { 
  analysis: ContractAnalysis | null;
  isScanning: boolean;
}) => {
  const lighthouseRef = useRef<HTMLDivElement>(null);
  
  const riskLevel = analysis ? analysis.overallRisk : 0;
  const beamColor = riskLevel > 80 ? '#EF4444' : riskLevel > 60 ? '#F59E0B' : riskLevel > 40 ? '#EAB308' : '#10B981';
  const beamIntensity = Math.min(1, riskLevel / 100);
  
  return (
    <div className="relative w-full h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/20 via-blue-800/10 to-purple-900/20 border border-white/10">
      <div 
        ref={lighthouseRef}
        className="absolute inset-0"
        style={{ perspective: '1000px' }}
      >
        {/* Ocean base */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900/40 to-blue-700/20">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>
        
        {/* Lighthouse structure */}
        <motion.div
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-20 h-32"
          animate={isScanning ? {
            rotateY: [0, 5, -5, 0],
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Tower */}
          <div className="relative w-full h-full bg-gradient-to-t from-gray-700 via-gray-600 to-white rounded-t-lg">
            {/* Stripes */}
            <div className="absolute top-8 left-0 right-0 h-3 bg-red-500/80" />
            <div className="absolute top-16 left-0 right-0 h-3 bg-red-500/80" />
            
            {/* Light room */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-yellow-200 rounded-t-lg border-2 border-yellow-400">
              {/* Rotating beacon */}
              <motion.div
                className="absolute inset-1 rounded bg-yellow-400"
                animate={isScanning ? {
                  rotate: 360,
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                <div className="absolute inset-0 rounded bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Light beam */}
        <AnimatePresence>
          {(isScanning || analysis) && (
            <motion.div
              className="absolute bottom-32 left-1/2 transform -translate-x-1/2 origin-bottom"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ 
                opacity: beamIntensity,
                scaleY: 1,
                rotate: isScanning ? [0, 60, -60, 0] : 0
              }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{
                opacity: { duration: 0.5 },
                scaleY: { duration: 1 },
                rotate: isScanning ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : {}
              }}
              style={{
                width: '200px',
                height: '300px',
                background: `conic-gradient(from 0deg, transparent 0%, ${beamColor}40 45%, ${beamColor}60 50%, ${beamColor}40 55%, transparent 100%)`,
                clipPath: 'polygon(40% 100%, 60% 100%, 80% 0%, 20% 0%)'
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Warning indicators */}
        {analysis && analysis.redFlags.map((flag, i) => (
          <motion.div
            key={flag.id}
            className={`absolute w-4 h-4 rounded-full ${
              flag.severity === 'critical' ? 'bg-red-500' :
              flag.severity === 'major' ? 'bg-orange-500' :
              flag.severity === 'moderate' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + Math.sin(i) * 20}%`
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}
        
        {/* Risk level indicator */}
        <div className="absolute top-4 right-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              riskLevel > 80 ? 'text-red-400' :
              riskLevel > 60 ? 'text-orange-400' :
              riskLevel > 40 ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {riskLevel}%
            </div>
            <div className="text-xs text-gray-300">Risk Level</div>
            <div className="text-xs text-gray-400 mt-1">
              {riskLevel > 80 ? 'Critical' :
               riskLevel > 60 ? 'High' :
               riskLevel > 40 ? 'Medium' : 'Low'}
            </div>
          </div>
        </div>
        
        {/* Scanning status */}
        {isScanning && (
          <div className="absolute top-4 left-4 p-3 bg-blue-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/40">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-blue-300 text-sm font-medium">Scanning...</span>
            </div>
          </div>
        )}
        
        {/* Floating legal symbols */}
        <div className="absolute inset-0 pointer-events-none">
          {['⚖️', '📋', '🔍', '⚠️', '🛡️'].map((symbol, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// File Upload Component
const DocumentUploader = ({ 
  onFileSelect, 
  isAnalyzing 
}: {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'application/pdf' || file.type.startsWith('text/') || file.name.endsWith('.docx'))) {
      onFileSelect(file);
    }
  }, [onFileSelect]);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);
  
  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
        isDragging 
          ? 'border-blue-500/60 bg-blue-500/10' 
          : 'border-white/20 hover:border-white/40 bg-white/5'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
      animate={isAnalyzing ? {
        borderColor: ['rgba(59, 130, 246, 0.4)', 'rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.4)'],
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="space-y-6">
        <motion.div
          className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-full flex items-center justify-center"
          animate={isAnalyzing ? {
            rotate: 360,
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.5, repeat: Infinity }
          }}
        >
          {isAnalyzing ? (
            <Scan className="w-12 h-12 text-blue-400" />
          ) : (
            <Upload className="w-12 h-12 text-indigo-400" />
          )}
        </motion.div>
        
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {isAnalyzing ? 'Analyzing Contract...' : 'Upload Your Contract'}
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {isAnalyzing 
              ? 'Our AI is scanning for red flags and risky clauses'
              : 'Drag and drop your contract here, or click to browse. Supports PDF, Word, and text files.'
            }
          </p>
        </div>
        
        {!isAnalyzing && (
          <div className="flex gap-4 justify-center">
            <motion.button
              className="px-6 py-3 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded-xl hover:bg-indigo-500/30 transition-all"
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Choose File</span>
              </div>
            </motion.button>
            
            <motion.button
              className="px-6 py-3 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all"
              onClick={() => onFileSelect(new File([''], 'sample-contract.pdf'))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Try Sample</span>
              </div>
            </motion.button>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          Maximum file size: 10MB • Supported formats: PDF, DOC, DOCX, TXT
        </div>
      </div>
    </motion.div>
  );
};

export default function ContractDetectorPage() {
  const [currentAnalysis, setCurrentAnalysis] = useState<ContractAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedClause, setSelectedClause] = useState<ContractClause | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'redflags' | 'clauses' | 'escape'>('overview');

  const handleFileSelect = useCallback((file: File) => {
    setIsAnalyzing(true);
    setCurrentAnalysis(null);
    
    // Simulate analysis time
    setTimeout(() => {
      const analysis = generateMockAnalysis(file.name);
      setCurrentAnalysis(analysis);
      setIsAnalyzing(false);
    }, 3000);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'major': case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
      case 'moderate': case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
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
                <h1 className="text-3xl font-bold text-white">Contract Red Flag Detector</h1>
                <p className="text-gray-400">AI-powered legal lighthouse scanning for hidden dangers</p>
              </div>
            </div>

            {/* Legal Lighthouse intro */}
            {!currentAnalysis && !isAnalyzing && (
              <motion.div
                className="bg-gradient-to-r from-indigo-500/10 via-blue-500/5 to-purple-500/10 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-500/20 border border-indigo-500/40 mb-6"
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(99, 102, 241, 0.3)',
                        '0 0 30px rgba(99, 102, 241, 0.5)',
                        '0 0 20px rgba(99, 102, 241, 0.3)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Lighthouse className="w-5 h-5 text-indigo-400" />
                    <span className="text-indigo-300 font-semibold">Legal Lighthouse</span>
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold text-white mb-4">
                    X-Ray Vision for Contracts
                  </h2>
                  <p className="text-gray-300 text-xl max-w-3xl mx-auto">
                    Upload any contract and our AI lighthouse will scan every clause, highlight red flags, 
                    and show you escape routes you didn't know existed.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Scan className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="text-white font-semibold">AI Scanning</div>
                    <div className="text-gray-400 text-sm">Deep clause analysis</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Flag className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="text-white font-semibold">Red Flag Detection</div>
                    <div className="text-gray-400 text-sm">Risk identification</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Route className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-white font-semibold">Escape Routes</div>
                    <div className="text-gray-400 text-sm">Exit strategies</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-white font-semibold">Plain English</div>
                    <div className="text-gray-400 text-sm">Clear explanations</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {!currentAnalysis && !isAnalyzing ? (
              // Upload Interface
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <DocumentUploader onFileSelect={handleFileSelect} isAnalyzing={false} />
              </motion.div>
            ) : isAnalyzing ? (
              // Analyzing State
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Legal Lighthouse Scanning</h2>
                  <p className="text-gray-400">
                    Our AI is performing a comprehensive analysis of your contract
                  </p>
                </div>
                
                <LegalLighthouse analysis={null} isScanning={true} />
                
                <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="text-lg text-white font-semibold">Analyzing Contract...</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      'Scanning clauses',
                      'Identifying risks',
                      'Finding escape routes',
                      'Generating report'
                    ].map((step, i) => (
                      <motion.div
                        key={step}
                        className="p-4 bg-white/5 rounded-xl border border-white/10"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      >
                        <div className="text-white text-sm">{step}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : currentAnalysis ? (
              // Analysis Results
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Legal Lighthouse with Results */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Analysis Complete</h2>
                  <p className="text-gray-400">
                    Found {currentAnalysis.redFlags.length} red flags in your {currentAnalysis.contractType} contract
                  </p>
                </div>
                
                <LegalLighthouse analysis={currentAnalysis} isScanning={false} />
                
                {/* Navigation Tabs */}
                <div className="flex justify-center">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                    {[
                      { id: 'overview', label: 'Overview', icon: Eye },
                      { id: 'redflags', label: 'Red Flags', icon: Flag },
                      { id: 'clauses', label: 'Clauses', icon: FileText },
                      { id: 'escape', label: 'Escape Routes', icon: Route }
                    ].map(tab => (
                      <motion.button
                        key={tab.id}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                          activeTab === tab.id
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setActiveTab(tab.id as any)}
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
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                      {/* Summary Stats */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                          <h3 className="text-xl font-bold text-white mb-6">Contract Summary</h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-400 mb-1">{currentAnalysis.summary.totalClauses}</div>
                              <div className="text-sm text-gray-400">Total Clauses</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-400 mb-1">{currentAnalysis.summary.riskyClauses}</div>
                              <div className="text-sm text-gray-400">Risky Clauses</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-400 mb-1">{currentAnalysis.redFlags.length}</div>
                              <div className="text-sm text-gray-400">Red Flags</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-400 mb-1">{currentAnalysis.escapeRoutes.length}</div>
                              <div className="text-sm text-gray-400">Escape Routes</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Key Recommendations</h4>
                            <div className="space-y-3">
                              {currentAnalysis.summary.recommendations.map((rec, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-300">{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Risk Meter */}
                      <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                          <h3 className="text-xl font-bold text-white mb-6">Risk Assessment</h3>
                          
                          <div className="text-center mb-6">
                            <div className={`text-4xl font-bold mb-2 ${
                              currentAnalysis.overallRisk > 80 ? 'text-red-400' :
                              currentAnalysis.overallRisk > 60 ? 'text-orange-400' :
                              currentAnalysis.overallRisk > 40 ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>
                              {currentAnalysis.overallRisk}%
                            </div>
                            <div className="text-gray-400">Overall Risk Score</div>
                          </div>
                          
                          <div className="space-y-4">
                            {['Critical', 'Major', 'Moderate', 'Minor'].map(severity => {
                              const count = currentAnalysis.redFlags.filter(flag => 
                                (severity === 'Critical' && flag.severity === 'critical') ||
                                (severity === 'Major' && flag.severity === 'major') ||
                                (severity === 'Moderate' && flag.severity === 'moderate') ||
                                (severity === 'Minor' && flag.severity === 'minor')
                              ).length;
                              
                              return (
                                <div key={severity} className="flex justify-between items-center">
                                  <span className="text-gray-300">{severity} Issues</span>
                                  <span className={`px-2 py-1 rounded-lg text-sm font-medium ${getSeverityColor(severity.toLowerCase())}`}>
                                    {count}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {activeTab === 'redflags' && (
                    <motion.div
                      key="redflags"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-white text-center mb-8">
                        🚩 Red Flags Detected ({currentAnalysis.redFlags.length})
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {currentAnalysis.redFlags.map((flag, index) => (
                          <motion.div
                            key={flag.id}
                            className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-6 ${getSeverityColor(flag.severity)}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="text-lg font-bold text-white">{flag.title}</h4>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                                {flag.severity}
                              </div>
                            </div>
                            
                            <p className="text-gray-300 mb-4">{flag.description}</p>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm font-semibold text-red-300 mb-1">Impact:</div>
                                <div className="text-sm text-gray-400">{flag.impact}</div>
                              </div>
                              
                              <div>
                                <div className="text-sm font-semibold text-green-300 mb-1">Suggestion:</div>
                                <div className="text-sm text-gray-400">{flag.suggestion}</div>
                              </div>
                              
                              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                <div className="text-xs text-gray-500 capitalize">{flag.category} Risk</div>
                                <div className="text-xs text-blue-400">{flag.confidence}% confidence</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {activeTab === 'escape' && (
                    <motion.div
                      key="escape"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-white text-center mb-8">
                        🚪 Escape Routes ({currentAnalysis.escapeRoutes.length})
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {currentAnalysis.escapeRoutes.map((route, index) => (
                          <motion.div
                            key={route.id}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-bold text-white">{route.title}</h4>
                                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                  route.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                  route.difficulty === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {route.difficulty}
                                </div>
                              </div>
                              <p className="text-gray-400 text-sm">{route.description}</p>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm font-semibold text-white mb-2">Conditions:</div>
                                <div className="space-y-1">
                                  {route.conditions.map((condition, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                      <span className="text-xs text-gray-400">{condition}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Timeline</div>
                                  <div className="text-sm text-white">{route.timeline}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Cost</div>
                                  <div className="text-sm text-white capitalize">{route.cost}</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-8">
                  <motion.button
                    className="px-6 py-3 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all"
                    onClick={() => {
                      setCurrentAnalysis(null);
                      setIsAnalyzing(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>Analyze Another Contract</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    className="px-6 py-3 bg-green-500/20 border border-green-500/40 text-green-300 rounded-xl hover:bg-green-500/30 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Export Report</span>
                    </div>
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

// Custom Lighthouse component since it doesn't exist in Lucide
const Lighthouse = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l2 4h-4l2-4z" fill="currentColor" />
    <rect x="10" y="6" width="4" height="12" fill="currentColor" />
    <path d="M8 18h8l-1 2H9l-1-2z" fill="currentColor" />
    <path d="M12 6l-6 12h12L12 6z" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
  </svg>
);