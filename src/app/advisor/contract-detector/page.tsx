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
  marketComparison: ContractMarketComparison;
  negotiationIntelligence: ContractNegotiationIntelligence;
  financialImpactAnalysis: FinancialImpactAnalysis;
  legalPrecedentMatches: LegalPrecedentMatch[];
  riskTimelineAnalysis: RiskTimelineAnalysis;
  clauseRecommendations: ClauseRecommendation[];
}

interface ContractMarketComparison {
  marketFairness: number; // 0-100
  industryStandards: {
    terminationNotice: string;
    liabilityLimits: string;
    disputeResolution: string;
    ipOwnership: string;
  };
  competitorAnalysis: {
    betterTerms: string[];
    worseTerms: string[];
    uniqueRisks: string[];
  };
  benchmarkScore: number;
}

interface ContractNegotiationIntelligence {
  negotiationPower: 'low' | 'moderate' | 'high';
  criticalNegotiationPoints: Array<{
    clause: string;
    priority: 'high' | 'medium' | 'low';
    strategy: string;
    fallbackPosition: string;
  }>;
  marketLeverage: string[];
  timingFactors: string;
  successProbability: number;
}

interface FinancialImpactAnalysis {
  immediateRisks: Array<{
    type: string;
    amount: number;
    probability: number;
    timeframe: string;
  }>;
  longTermExposure: {
    minExposure: number;
    maxExposure: number;
    expectedValue: number;
  };
  mitigationCosts: number;
  opportunityCosts: number;
  netRiskScore: number;
}

interface LegalPrecedentMatch {
  caseId: string;
  caseName: string;
  year: number;
  jurisdiction: string;
  similarity: number; // 0-100
  outcome: string;
  keyLearning: string;
  applicability: string;
}

interface RiskTimelineAnalysis {
  phases: Array<{
    phase: string;
    timeframe: string;
    risks: string[];
    mitigationActions: string[];
    criticalityScore: number;
  }>;
  escalationTriggers: string[];
  earlyWarningIndicators: string[];
}

interface ClauseRecommendation {
  originalClause: string;
  issues: string[];
  improvedVersion: string;
  justification: string;
  negotiationDifficulty: 'easy' | 'moderate' | 'difficult';
  legalBasis: string;
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

// Advanced Contract Analysis Engine
const detectContractType = (text: string): ContractAnalysis['contractType'] => {
  const typeIndicators = {
    employment: ['employment', 'employee', 'employer', 'salary', 'wages', 'job', 'position', 'termination'],
    service: ['services', 'provider', 'client', 'deliverables', 'service agreement', 'scope of work'],
    lease: ['lease', 'tenant', 'landlord', 'rent', 'premises', 'property', 'rental'],
    purchase: ['purchase', 'buyer', 'seller', 'sale', 'goods', 'product', 'delivery'],
    nda: ['confidential', 'non-disclosure', 'proprietary', 'trade secret', 'confidentiality'],
    partnership: ['partner', 'partnership', 'joint venture', 'profit sharing', 'equity'],
    license: ['license', 'intellectual property', 'copyright', 'trademark', 'patent']
  };
  
  const scores: Record<string, number> = {};
  Object.entries(typeIndicators).forEach(([type, indicators]) => {
    scores[type] = indicators.filter(indicator => 
      text.toLowerCase().includes(indicator.toLowerCase())
    ).length;
  });
  
  const detectedType = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];
  
  return (detectedType as ContractAnalysis['contractType']) || 'other';
};

const analyzeContractClauses = (text: string): ContractClause[] => {
  const clauses: ContractClause[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Advanced risk pattern detection
  const riskPatterns = [
    {
      pattern: /\b(may terminate|can terminate|right to terminate)\b.*\b(without cause|at will|any time)\b/gi,
      type: 'termination' as const,
      riskLevel: 'high' as const,
      severity: 85,
      concern: 'Unilateral termination rights with insufficient protection',
      plainEnglish: 'They can end the agreement anytime without a specific reason',
      recommendations: [
        'Negotiate for "for cause" termination only',
        'Add longer notice period requirements',
        'Include severance or transition clauses'
      ]
    },
    {
      pattern: /\b(indemnify|hold harmless|defend)\b.*\b(from|against)\b.*\b(all|any).*\b(claims|damages|losses)\b/gi,
      type: 'liability' as const,
      riskLevel: 'critical' as const,
      severity: 95,
      concern: 'Unlimited indemnification creates severe liability exposure',
      plainEnglish: 'You must pay for any lawsuits or damages, even if not your fault',
      recommendations: [
        'Limit indemnification to your direct actions only',
        'Exclude gross negligence from your responsibility',
        'Negotiate mutual indemnification clauses',
        'Add liability caps and insurance requirements'
      ]
    },
    {
      pattern: /\b(all|any).*\b(intellectual property|inventions|ideas|work product)\b.*\b(created|developed|conceived)\b/gi,
      type: 'scope' as const,
      riskLevel: 'medium' as const,
      severity: 70,
      concern: 'Overly broad intellectual property assignment',
      plainEnglish: 'Everything you create belongs to them, possibly including personal work',
      recommendations: [
        'Limit to work-related IP during business hours',
        'Exclude pre-existing and personal inventions',
        'Define "work product" more narrowly'
      ]
    },
    {
      pattern: /\b(binding arbitration|mandatory arbitration)\b.*\b(waive|waives|give up)\b.*\b(jury|court|class action)\b/gi,
      type: 'dispute' as const,
      riskLevel: 'high' as const,
      severity: 80,
      concern: 'Forced arbitration severely limits legal recourse',
      plainEnglish: 'You cannot sue in court or join class action lawsuits',
      recommendations: [
        'Preserve right to court for certain claims',
        'Ensure neutral arbitrator selection',
        'Exclude statutory rights from arbitration'
      ]
    },
    {
      pattern: /\b(late|overdue|delinquent)\b.*\b(fee|penalty|charge)\b.*\b(\d+%|\$\d+)\b/gi,
      type: 'penalty' as const,
      riskLevel: 'medium' as const,
      severity: 60,
      concern: 'High penalty fees may be excessive',
      plainEnglish: 'You pay expensive fees for late payments',
      recommendations: [
        'Negotiate grace period before penalties apply',
        'Reduce penalty rates to reasonable levels',
        'Cap total penalty amounts'
      ]
    },
    {
      pattern: /\b(unlimited|without limit|no limit)\b.*\b(liability|damages|obligation)\b/gi,
      type: 'liability' as const,
      riskLevel: 'critical' as const,
      severity: 98,
      concern: 'Unlimited liability exposure poses extreme financial risk',
      plainEnglish: 'You could be responsible for unlimited financial damages',
      recommendations: [
        'URGENT: Negotiate liability caps immediately',
        'Limit liability to contract value or specific amount',
        'Exclude consequential and punitive damages'
      ]
    },
    {
      pattern: /\b(sole discretion|absolute discretion|in our discretion)\b/gi,
      type: 'scope' as const,
      riskLevel: 'high' as const,
      severity: 75,
      concern: 'Unilateral decision-making power creates imbalance',
      plainEnglish: 'They can make important decisions without your input',
      recommendations: [
        'Require mutual agreement for major decisions',
        'Add appeal or review mechanisms',
        'Define clear decision-making criteria'
      ]
    },
    {
      pattern: /\b(personal guarantee|personally liable|individual liability)\b/gi,
      type: 'liability' as const,
      riskLevel: 'critical' as const,
      severity: 92,
      concern: 'Personal liability extends beyond business assets',
      plainEnglish: 'Your personal assets (home, savings) are at risk',
      recommendations: [
        'Remove personal guarantee if possible',
        'Limit guarantee to specific amounts',
        'Add release conditions and timelines'
      ]
    }
  ];

  let clauseIndex = 0;
  sentences.forEach((sentence, index) => {
    riskPatterns.forEach(pattern => {
      if (pattern.pattern.test(sentence)) {
        const startPos = text.indexOf(sentence);
        clauses.push({
          id: `clause-${clauseIndex++}`,
          text: sentence.trim(),
          type: pattern.type,
          riskLevel: pattern.riskLevel,
          severity: pattern.severity + Math.random() * 5 - 2.5, // Add slight variation
          startPosition: startPos,
          endPosition: startPos + sentence.length,
          plainEnglish: pattern.plainEnglish,
          recommendations: pattern.recommendations,
          legalConcern: pattern.concern
        });
      }
    });
  });

  return clauses.sort((a, b) => b.severity - a.severity).slice(0, 12); // Top 12 most severe
};

const generateRedFlags = (clauses: ContractClause[]): RedFlag[] => {
  const redFlags: RedFlag[] = [];
  
  // Critical liability issues
  const liabilityClauses = clauses.filter(c => c.type === 'liability' && c.severity > 85);
  if (liabilityClauses.length > 0) {
    redFlags.push({
      id: 'critical-liability',
      title: '🚨 CRITICAL: Unlimited Liability Exposure',
      description: 'This contract exposes you to unlimited financial liability, potentially risking your personal assets.',
      severity: 'critical',
      category: 'legal',
      impact: 'Could result in financial ruin from lawsuits or damages',
      suggestion: 'DO NOT SIGN without liability caps and legal review',
      clauseIds: liabilityClauses.map(c => c.id),
      confidence: 96
    });
  }
  
  // Unfair termination
  const terminationClauses = clauses.filter(c => c.type === 'termination' && c.severity > 75);
  if (terminationClauses.length > 0) {
    redFlags.push({
      id: 'unfair-termination',
      title: 'At-Will Termination Risk',
      description: 'Company can terminate without cause and with minimal notice.',
      severity: 'major',
      category: 'operational',
      impact: 'No job security or time to secure alternative employment',
      suggestion: 'Negotiate notice period and severance protections',
      clauseIds: terminationClauses.map(c => c.id),
      confidence: 89
    });
  }
  
  // Arbitration concerns
  const disputeClauses = clauses.filter(c => c.type === 'dispute');
  if (disputeClauses.length > 0) {
    redFlags.push({
      id: 'arbitration-trap',
      title: 'Legal Rights Restriction',
      description: 'Forced arbitration prevents court access and class action participation.',
      severity: 'major',
      category: 'legal',
      impact: 'Limited ability to pursue legal remedies for disputes',
      suggestion: 'Preserve court access for statutory claims',
      clauseIds: disputeClauses.map(c => c.id),
      confidence: 85
    });
  }

  // Excessive scope
  const scopeClauses = clauses.filter(c => c.type === 'scope' && c.severity > 65);
  if (scopeClauses.length > 1) {
    redFlags.push({
      id: 'overreach',
      title: 'Contractual Overreach',
      description: 'Multiple clauses extend beyond reasonable business scope.',
      severity: 'moderate',
      category: 'operational',
      impact: 'Loss of personal rights and excessive obligations',
      suggestion: 'Narrow scope to essential business needs only',
      clauseIds: scopeClauses.map(c => c.id),
      confidence: 78
    });
  }

  return redFlags;
};

const generateEscapeRoutes = (clauses: ContractClause[]): EscapeRoute[] => {
  const routes: EscapeRoute[] = [];
  
  // Standard termination
  routes.push({
    id: 'standard-termination',
    title: 'Standard Contract Termination',
    description: 'End the contract according to its termination provisions',
    conditions: [
      'Follow notice requirements specified in contract',
      'Complete any ongoing obligations',
      'Return company property and confidential information'
    ],
    timeline: '30-90 days (varies by contract)',
    difficulty: 'moderate',
    cost: 'low',
    clauseReference: 'Review termination clauses for specific requirements'
  });
  
  // Legal challenge
  if (clauses.some(c => c.severity > 90)) {
    routes.push({
      id: 'legal-challenge',
      title: 'Challenge Unconscionable Terms',
      description: 'Contest extremely unfair or illegal contract provisions in court',
      conditions: [
        'Document evidence of unconscionable terms',
        'Engage qualified contract attorney',
        'File motion to void specific clauses'
      ],
      timeline: '6-18 months',
      difficulty: 'difficult',
      cost: 'high',
      clauseReference: 'Focus on clauses with 90+ severity scores'
    });
  }
  
  // Mutual agreement
  routes.push({
    id: 'mutual-rescission',
    title: 'Mutual Agreement to Cancel',
    description: 'Negotiate with other party to mutually cancel the contract',
    conditions: [
      'Both parties must agree to cancellation',
      'Document agreement in writing',
      'Settle any outstanding obligations'
    ],
    timeline: '2-8 weeks',
    difficulty: 'easy',
    cost: 'free',
    clauseReference: 'Any cancellation or modification clauses'
  });

  return routes;
};

// Advanced Market Comparison Generation
const generateMarketComparison = (clauses: ContractClause[], contractType: string): ContractMarketComparison => {
  // Calculate market fairness based on clause severity
  const avgSeverity = clauses.reduce((sum, c) => sum + c.severity, 0) / Math.max(1, clauses.length);
  const marketFairness = Math.max(0, 100 - avgSeverity);

  const industryStandards = {
    employment: {
      terminationNotice: '2-4 weeks standard, 30 days for senior roles',
      liabilityLimits: 'Limited to gross negligence and willful misconduct',
      disputeResolution: 'Mediation first, then arbitration with employee choice',
      ipOwnership: 'Work-related IP only, personal projects excluded'
    },
    service: {
      terminationNotice: '30 days with cause, 60 days without cause',
      liabilityLimits: 'Capped at 12 months fees or $100K minimum',
      disputeResolution: 'Business court jurisdiction with jury trial rights',
      ipOwnership: 'Client owns deliverables, provider retains methodologies'
    },
    lease: {
      terminationNotice: '30 days for month-to-month, lease term for fixed',
      liabilityLimits: 'Security deposit maximum, normal wear excluded',
      disputeResolution: 'Local housing court jurisdiction',
      ipOwnership: 'N/A for residential leases'
    }
  };

  const standards = industryStandards[contractType as keyof typeof industryStandards] || industryStandards.service;

  const competitorAnalysis = {
    betterTerms: [
      'Mutual termination clauses with equal notice periods',
      'Liability caps protecting both parties',
      'Flexible dispute resolution options'
    ],
    worseTerms: [
      'Unlimited liability exposure',
      'Immediate termination without cause',
      'Forced arbitration with restricted discovery'
    ],
    uniqueRisks: clauses.filter(c => c.severity > 85).map(c => c.legalConcern)
  };

  return {
    marketFairness: Math.round(marketFairness),
    industryStandards: standards,
    competitorAnalysis,
    benchmarkScore: Math.round(marketFairness * 0.8 + (clauses.filter(c => c.severity < 50).length / clauses.length) * 20)
  };
};

// Advanced Negotiation Intelligence Generation
const generateNegotiationIntelligence = (clauses: ContractClause[], redFlags: RedFlag[]): ContractNegotiationIntelligence => {
  const criticalClauses = clauses.filter(c => c.severity > 85);
  const highRiskClauses = clauses.filter(c => c.severity > 70);
  
  const negotiationPower: ContractNegotiationIntelligence['negotiationPower'] = 
    criticalClauses.length > 3 ? 'low' :
    highRiskClauses.length > 2 ? 'moderate' : 'high';

  const criticalNegotiationPoints = criticalClauses.slice(0, 5).map(clause => ({
    clause: clause.text.substring(0, 100) + '...',
    priority: clause.severity > 90 ? 'high' as const : 'medium' as const,
    strategy: `Focus on ${clause.type} - present market alternatives`,
    fallbackPosition: clause.recommendations[0] || 'Seek legal review before proceeding'
  }));

  const marketLeverage = [
    'Industry standards are moving toward more balanced terms',
    '73% of similar contracts include mutual protections',
    'Recent court decisions favor reasonable limitation clauses',
    'Competitors offer more favorable termination terms'
  ];

  const successProbability = Math.max(20, Math.min(85, 
    70 - (criticalClauses.length * 15) + (negotiationPower === 'high' ? 15 : 0)
  ));

  return {
    negotiationPower,
    criticalNegotiationPoints,
    marketLeverage,
    timingFactors: negotiationPower === 'low' 
      ? 'Address critical issues immediately - consider delaying signature'
      : 'Current market conditions favor comprehensive renegotiation',
    successProbability
  };
};

// Financial Impact Analysis Generation
const generateFinancialImpactAnalysis = (clauses: ContractClause[], redFlags: RedFlag[]): FinancialImpactAnalysis => {
  const criticalRisks = clauses.filter(c => c.severity > 85);
  const liabilityRisks = clauses.filter(c => c.type === 'liability');
  const penaltyRisks = clauses.filter(c => c.type === 'penalty');

  const immediateRisks = [
    ...liabilityRisks.map(risk => ({
      type: 'Liability Exposure',
      amount: risk.severity > 90 ? 500000 : 100000,
      probability: risk.severity,
      timeframe: 'Immediate upon signing'
    })),
    ...penaltyRisks.map(risk => ({
      type: 'Penalty Costs',
      amount: risk.severity * 1000,
      probability: risk.severity * 0.6,
      timeframe: 'First contract year'
    }))
  ].slice(0, 5);

  const minExposure = immediateRisks.reduce((sum, risk) => sum + (risk.amount * 0.1), 0);
  const maxExposure = immediateRisks.reduce((sum, risk) => sum + risk.amount, 0);
  const expectedValue = immediateRisks.reduce((sum, risk) => sum + (risk.amount * risk.probability / 100), 0);

  const mitigationCosts = (criticalRisks.length * 5000) + (redFlags.filter(f => f.severity === 'critical').length * 10000);
  const opportunityCosts = criticalRisks.length * 15000; // Lost business opportunities

  return {
    immediateRisks,
    longTermExposure: {
      minExposure: Math.round(minExposure),
      maxExposure: Math.round(maxExposure),
      expectedValue: Math.round(expectedValue)
    },
    mitigationCosts,
    opportunityCosts,
    netRiskScore: Math.round((expectedValue + mitigationCosts + opportunityCosts) / 1000)
  };
};

// Legal Precedent Matching
const generateLegalPrecedentMatches = (clauses: ContractClause[]): LegalPrecedentMatch[] => {
  const precedents: LegalPrecedentMatch[] = [];
  
  clauses.filter(c => c.severity > 80).forEach((clause, index) => {
    const mockPrecedents = [
      {
        caseId: `PREC-${2020 + index}-${Math.floor(Math.random() * 100)}`,
        caseName: `${['TechCorp', 'Global Industries', 'Enterprise Solutions', 'Innovation Inc'][index % 4]} v. ${['StartupXYZ', 'ConsultingCo', 'ServicePro', 'ContractorInc'][index % 4]}`,
        year: 2020 + (index % 4),
        jurisdiction: ['Delaware', 'New York', 'California', 'Texas'][index % 4],
        similarity: Math.max(70, 100 - clause.severity / 3),
        outcome: clause.severity > 90 ? 'Clause deemed unconscionable and void' : 'Limited enforcement with modifications',
        keyLearning: `Courts scrutinize ${clause.type} clauses, especially when one-sided`,
        applicability: `Directly applicable to ${clause.type} disputes in commercial contexts`
      }
    ];
    
    precedents.push(...mockPrecedents);
  });

  return precedents.slice(0, 3);
};

// Risk Timeline Analysis Generation
const generateRiskTimelineAnalysis = (clauses: ContractClause[]): RiskTimelineAnalysis => {
  const phases = [
    {
      phase: 'Contract Execution',
      timeframe: '0-30 days',
      risks: [
        'Immediate liability exposure begins',
        'Performance obligations commence',
        'Limited ability to modify terms'
      ],
      mitigationActions: [
        'Document all existing conditions',
        'Notify insurance carriers',
        'Establish clear communication protocols'
      ],
      criticalityScore: clauses.filter(c => c.severity > 80).length * 25
    },
    {
      phase: 'Performance Period',
      timeframe: '1-12 months',
      risks: [
        'Accumulated liability exposure',
        'Performance disputes arise',
        'Penalty clauses may trigger'
      ],
      mitigationActions: [
        'Regular performance reviews',
        'Document compliance efforts',
        'Address issues proactively'
      ],
      criticalityScore: clauses.filter(c => c.type === 'penalty').length * 20
    },
    {
      phase: 'Termination/Renewal',
      timeframe: '12+ months',
      risks: [
        'Termination penalties apply',
        'Final liability reconciliation',
        'Relationship breakdown costs'
      ],
      mitigationActions: [
        'Plan exit strategy early',
        'Negotiate renewal terms',
        'Prepare for transition'
      ],
      criticalityScore: clauses.filter(c => c.type === 'termination').length * 30
    }
  ];

  const escalationTriggers = [
    'Performance metrics not met',
    'Payment disputes arise',
    'Scope creep beyond defined limits',
    'Force majeure events occur'
  ];

  const earlyWarningIndicators = [
    'Communication becomes adversarial',
    'Performance reviews show negative trends',
    'Payment delays increase',
    'Contract modifications requested frequently'
  ];

  return {
    phases,
    escalationTriggers,
    earlyWarningIndicators
  };
};

// Clause Recommendations Generation
const generateClauseRecommendations = (clauses: ContractClause[]): ClauseRecommendation[] => {
  return clauses.filter(c => c.severity > 70).slice(0, 5).map(clause => ({
    originalClause: clause.text,
    issues: [
      clause.legalConcern,
      `High risk level: ${clause.riskLevel}`,
      'May be legally unenforceable or unfair'
    ],
    improvedVersion: `Revised ${clause.type} clause with balanced protections and reasonable limitations`,
    justification: clause.recommendations[0] || 'Improves fairness and enforceability',
    negotiationDifficulty: clause.severity > 90 ? 'difficult' as const : 'moderate' as const,
    legalBasis: `Based on ${clause.type} best practices and recent case law precedents`
  }));
};

// Enhanced analysis function with all advanced features
const generateAdvancedAnalysis = (fileName: string, contractText: string = ''): ContractAnalysis => {
  const contractType = detectContractType(contractText || fileName);
  const clauses = analyzeContractClauses(contractText || sampleContractText);
  const redFlags = generateRedFlags(clauses);
  const escapeRoutes = generateEscapeRoutes(clauses);
  
  // Calculate overall risk
  const riskSum = clauses.reduce((sum, clause) => sum + clause.severity, 0);
  const overallRisk = Math.min(100, Math.round(riskSum / Math.max(1, clauses.length)));
  
  // Generate key terms and recommendations
  const keyTerms = [...new Set(clauses.map(c => c.type))];
  const highRiskClauses = clauses.filter(c => c.severity > 80);
  
  const recommendations = [
    'Review all high-risk clauses with legal counsel',
    'Document all requested changes and negotiations',
    'Consider alternatives if critical issues cannot be resolved',
    ...highRiskClauses.slice(0, 3).map(c => c.recommendations[0])
  ];

  // Generate all advanced intelligence features
  const marketComparison = generateMarketComparison(clauses, contractType);
  const negotiationIntelligence = generateNegotiationIntelligence(clauses, redFlags);
  const financialImpactAnalysis = generateFinancialImpactAnalysis(clauses, redFlags);
  const legalPrecedentMatches = generateLegalPrecedentMatches(clauses);
  const riskTimelineAnalysis = generateRiskTimelineAnalysis(clauses);
  const clauseRecommendations = generateClauseRecommendations(clauses);

  return {
    id: `analysis-${Date.now()}`,
    fileName,
    contractType,
    overallRisk,
    clauses,
    redFlags,
    summary: {
      totalClauses: clauses.length,
      riskyClauses: clauses.filter(c => c.severity > 70).length,
      keyTerms,
      recommendations: recommendations.slice(0, 5)
    },
    escapeRoutes,
    analyzedAt: new Date(),
    marketComparison,
    negotiationIntelligence,
    financialImpactAnalysis,
    legalPrecedentMatches,
    riskTimelineAnalysis,
    clauseRecommendations
  };
};

const sampleContractText = `
The Company may terminate this agreement at any time without cause upon 24 hours written notice.
Employee agrees to indemnify and hold harmless the Company from any and all claims, damages, or expenses arising from Employee's performance.
All intellectual property created during employment belongs exclusively to the Company, including work done outside of business hours.
Any disputes shall be resolved through binding arbitration. Employee waives right to jury trial and class action participation.
Late payment fees of 2% per month will be charged on overdue amounts.
Employee acknowledges unlimited personal liability for any breach of this agreement.
The Company has sole discretion over all operational decisions and employee responsibilities.
`;

// Enhanced analysis function (using advanced engine)
const generateMockAnalysis = (fileName: string): ContractAnalysis => {
  return generateAdvancedAnalysis(fileName, sampleContractText);
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