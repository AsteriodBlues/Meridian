'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import StickyNav from '@/components/dashboard/StickyNav';
import ScrollProgress from '@/components/dashboard/ScrollProgress';
import MagneticCursor from '@/components/ui/MagneticCursor';
import ScrollReveal from '@/components/ui/ScrollReveal';
import HeroMetrics from '@/components/dashboard/HeroMetrics';
import SpendingSpeedometer from '@/components/dashboard/SpendingSpeedometer';
import IncomeStreams from '@/components/dashboard/IncomeStreams';
import InvestmentPerformance from '@/components/dashboard/InvestmentPerformance';
import { BentoGrid, MetricCard, ChartCard, QuickActionCard } from '@/components/dashboard/BentoGrid';
import { CreditCard, Send, PiggyBank, TrendingUp, Wallet, Zap } from 'lucide-react';

// Enhanced Awwwards Components
import SplitTextAnimation, { SplitWordsAnimation, MaskTextReveal } from '@/components/typography/SplitTextAnimation';
import { GoldenContainer, GoldenGrid, GoldenSection, GoldenCard } from '@/components/layout/GoldenLayout';
import { ScrollReveal as AwwardsScrollReveal, Magnetic, ParallaxScroll, StaggerContainer, FloatingParticles, LiquidLoader } from '@/components/animations/AwwardsAnimations';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Remove the redirect useEffect to prevent redirect loop
  // The middleware already handles authentication redirects

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-luxury-950 flex items-center justify-center relative overflow-hidden">
        <FloatingParticles count={30} />
        <div className="relative z-10 text-center">
          <LiquidLoader size={80} color="#667eea" className="mb-4 mx-auto" />
          <SplitTextAnimation animation="fadeIn" staggerDelay={0.05}>
            Loading your financial universe...
          </SplitTextAnimation>
        </div>
      </div>
    );
  }

  // Let middleware handle authentication - no need to check session here

  return (
    <TimeBasedBackground>
      <MagneticCursor />
      <StickyNav />
      <ScrollProgress />
      <FloatingParticles count={20} className="opacity-30" />
      
      <GoldenContainer className="relative pb-12">
        {/* Hero Welcome Section */}
        <GoldenSection spacing="spacious" className="pt-8">
          <div className="text-center mb-16">
            <ParallaxScroll speed={-0.2}>
              <MaskTextReveal delay={0.5} duration={1.2}>
                <h1 className="text-display text-6xl aurora-text mb-6">
                  Welcome back, {session?.user?.name?.split(' ')[0] || 'Explorer'}
                </h1>
              </MaskTextReveal>
            </ParallaxScroll>
            
            <AwwardsScrollReveal animation="fadeUp" delay={1} threshold={0.1}>
              <SplitWordsAnimation 
                animation="slideUp" 
                delay={1.2} 
                staggerDelay={0.1}
                className="text-body text-xl text-gray-300 max-w-2xl mx-auto"
              >
                Your financial dashboard is evolving. Experience the future of money management.
              </SplitWordsAnimation>
            </AwwardsScrollReveal>
          </div>
          
          {/* Enhanced Hero Metrics */}
          <Magnetic strength={0.2}>
            <HeroMetrics />
          </Magnetic>
        </GoldenSection>

        {/* Main Dashboard Grid */}
        <GoldenSection spacing="comfortable">
          <AwwardsScrollReveal animation="fadeUp" delay={0.3}>
            <SplitTextAnimation 
              animation="slideUp" 
              delay={0.1} 
              className="text-headline text-3xl text-white mb-8 text-center"
            >
              Financial Command Center
            </SplitTextAnimation>
          </AwwardsScrollReveal>

          <StaggerContainer 
            staggerDelay={0.15}
            animation="scale"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max"
          >
            {/* Spending Speedometer - Enhanced */}
            <div className="md:col-span-2">
              <Magnetic strength={0.15}>
                <div className="glass-morphism rounded-2xl overflow-hidden magnetic-hover cursor-pointer glow-hover aurora-gradient-slow p-6 h-auto min-h-[240px]">
                  <div className="relative z-10">
                    <h3 className="text-headline text-lg text-white mb-4">Spending Velocity</h3>
                    <SpendingSpeedometer 
                      value={73} 
                      title="Current Pace" 
                      subtitle="Monthly budget utilization"
                    />
                  </div>
                </div>
              </Magnetic>
            </div>

            {/* Quick Actions - Enhanced */}
            <Magnetic strength={0.1}>
              <GoldenCard hover className="glass-morphism">
                <QuickActionCard
                  title="Send Money"
                  description="Transfer to contacts"
                  icon={Send}
                  size="small"
                />
              </GoldenCard>
            </Magnetic>

            <Magnetic strength={0.1}>
              <GoldenCard hover className="glass-morphism">
                <QuickActionCard
                  title="Pay Bills"
                  description="Manage payments"
                  icon={CreditCard}
                  size="small"
                />
              </GoldenCard>
            </Magnetic>

            {/* Account Balance - Enhanced */}
            <div className="md:col-span-2">
              <Magnetic strength={0.15}>
                <div className="glass-morphism rounded-2xl overflow-hidden magnetic-hover cursor-pointer glow-hover p-6 h-auto min-h-[180px] border border-white/10 backdrop-blur-xl">
                  <MetricCard
                    title="Checking Account"
                    value="$12,458"
                    subtitle="Available balance"
                    icon={Wallet}
                    trend="up"
                    trendValue="+$1,247"
                    size="medium"
                  />
                </div>
              </Magnetic>
            </div>

            <Magnetic strength={0.1}>
              <GoldenCard hover className="glass-morphism">
                <QuickActionCard
                  title="Savings Goal"
                  description="Track progress"
                  icon={PiggyBank}
                  size="small"
                />
              </GoldenCard>
            </Magnetic>

            {/* Credit Score - Enhanced */}
            <Magnetic strength={0.1}>
              <GoldenCard hover className="glass-morphism">
                <MetricCard
                  title="Credit Score"
                  value="784"
                  subtitle="Excellent"
                  icon={TrendingUp}
                  trend="up"
                  trendValue="+12 pts"
                  size="small"
                />
              </GoldenCard>
            </Magnetic>

            <Magnetic strength={0.1}>
              <GoldenCard hover className="glass-morphism">
                <QuickActionCard
                  title="Invest"
                  description="Grow your wealth"
                  icon={Zap}
                  size="small"
                />
              </GoldenCard>
            </Magnetic>
          </StaggerContainer>
        </GoldenSection>

        {/* Income & Investment Performance Section */}
        <GoldenSection spacing="spacious">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Income Streams - Enhanced */}
            <AwwardsScrollReveal animation="fadeLeft" delay={0.4}>
              <ParallaxScroll speed={0.1}>
                <div className="relative">
                  <SplitTextAnimation 
                    animation="slideUp" 
                    className="text-headline text-2xl text-white mb-6"
                  >
                    Income Streams
                  </SplitTextAnimation>
                  <Magnetic strength={0.1}>
                    <div className="glass-morphism rounded-2xl p-6">
                      <IncomeStreams />
                    </div>
                  </Magnetic>
                </div>
              </ParallaxScroll>
            </AwwardsScrollReveal>

            {/* Investment Performance - Enhanced */}
            <AwwardsScrollReveal animation="fadeRight" delay={0.5}>
              <ParallaxScroll speed={-0.1}>
                <div className="relative">
                  <SplitTextAnimation 
                    animation="slideUp" 
                    delay={0.2}
                    className="text-headline text-2xl text-white mb-6"
                  >
                    Investment Performance
                  </SplitTextAnimation>
                  <Magnetic strength={0.1}>
                    <div className="glass-morphism rounded-2xl p-6">
                      <InvestmentPerformance />
                    </div>
                  </Magnetic>
                </div>
              </ParallaxScroll>
            </AwwardsScrollReveal>
          </div>
        </GoldenSection>

        {/* Financial Health Overview */}
        <GoldenSection spacing="comfortable" background="glass">
          <AwwardsScrollReveal animation="fadeUp" delay={0.1}>
            <div className="text-center mb-12">
              <MaskTextReveal delay={0.2}>
                <h2 className="text-display text-4xl aurora-text mb-4">
                  Financial Health Matrix
                </h2>
              </MaskTextReveal>
              
              <SplitWordsAnimation 
                animation="fadeIn" 
                delay={0.8} 
                staggerDelay={0.08}
                className="text-body text-lg text-gray-300"
              >
                Real-time insights into your financial ecosystem
              </SplitWordsAnimation>
            </div>
          </AwwardsScrollReveal>

          <StaggerContainer 
            staggerDelay={0.1}
            animation="fadeUp"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <Magnetic strength={0.08}>
              <GoldenCard hover className="glass-morphism-dark">
                <MetricCard
                  title="Monthly Expenses"
                  value="$3,247"
                  subtitle="15% below budget"
                  trend="down"
                  trendValue="-$623"
                  size="small"
                />
              </GoldenCard>
            </Magnetic>

            <Magnetic strength={0.08}>
              <GoldenCard hover className="glass-morphism-dark">
                <MetricCard
                  title="Savings Rate"
                  value="32%"
                  subtitle="Of total income"
                  trend="up"
                  trendValue="+5%"
                  size="small"
                />
              </GoldenCard>
            </Magnetic>

            <div className="md:col-span-1 lg:col-span-1">
              <Magnetic strength={0.1}>
                <GoldenCard hover glow className="aurora-gradient-slow">
                  <div className="relative z-10">
                    <MetricCard
                      title="Net Worth Growth"
                      value="+$8,456"
                      subtitle="This quarter"
                      trend="up"
                      trendValue="+12.8%"
                      size="medium"
                    />
                  </div>
                </GoldenCard>
              </Magnetic>
            </div>

            <Magnetic strength={0.08}>
              <GoldenCard hover className="glass-morphism-dark">
                <MetricCard
                  title="Emergency Fund"
                  value="$18,500"
                  subtitle="6 months coverage"
                  trend="neutral"
                  trendValue="Fully funded"
                  size="small"
                />
              </GoldenCard>
            </Magnetic>

            <Magnetic strength={0.08}>
              <GoldenCard hover className="glass-morphism-dark">
                <MetricCard
                  title="Debt Payoff"
                  value="$4,231"
                  subtitle="Remaining balance"
                  trend="down"
                  trendValue="-$1,890"
                  size="small"
                />
              </GoldenCard>
            </Magnetic>

            <Magnetic strength={0.08}>
              <GoldenCard hover className="glass-morphism-dark">
                <MetricCard
                  title="Investment Return"
                  value="15.3%"
                  subtitle="YTD performance"
                  trend="up"
                  trendValue="+3.2%"
                  size="small"
                />
              </GoldenCard>
            </Magnetic>
          </StaggerContainer>
        </GoldenSection>

        {/* Closing Section */}
        <GoldenSection spacing="spacious">
          <AwwardsScrollReveal animation="fadeUp" delay={0.2}>
            <div className="text-center">
              <SplitTextAnimation 
                animation="wave" 
                staggerDelay={0.05}
                className="text-body text-lg text-gray-400"
              >
                Your financial future is evolving ✨
              </SplitTextAnimation>
            </div>
          </AwwardsScrollReveal>
        </GoldenSection>
      </GoldenContainer>
    </TimeBasedBackground>
  );
}