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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-luxury-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <TimeBasedBackground>
      <MagneticCursor />
      <StickyNav />
      <ScrollProgress />
      
      <div className="relative">
        {/* Hero Metrics Section */}
        <ScrollReveal direction="up">
          <section id="dashboard" className="pt-8">
            <HeroMetrics />
          </section>
        </ScrollReveal>

        {/* Main Dashboard Grid */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-6">
              <BentoGrid className="stagger-children">
              {/* Spending Speedometer */}
              <ChartCard title="Spending Velocity" size="medium">
                <SpendingSpeedometer 
                  value={73} 
                  title="Current Pace" 
                  subtitle="Monthly budget utilization"
                />
              </ChartCard>

              {/* Quick Actions */}
              <QuickActionCard
                title="Send Money"
                description="Transfer to contacts"
                icon={Send}
                size="small"
              />

              <QuickActionCard
                title="Pay Bills"
                description="Manage payments"
                icon={CreditCard}
                size="small"
              />

              {/* Account Balance */}
              <MetricCard
                title="Checking Account"
                value="$12,458"
                subtitle="Available balance"
                icon={Wallet}
                trend="up"
                trendValue="+$1,247"
                size="medium"
              />

              <QuickActionCard
                title="Savings Goal"
                description="Track progress"
                icon={PiggyBank}
                size="small"
              />

              {/* Credit Score */}
              <MetricCard
                title="Credit Score"
                value="784"
                subtitle="Excellent"
                icon={TrendingUp}
                trend="up"
                trendValue="+12 pts"
                size="small"
              />

              <QuickActionCard
                title="Invest"
                description="Grow your wealth"
                icon={Zap}
                size="small"
              />
              </BentoGrid>
            </div>
          </section>
        </ScrollReveal>

        {/* Income Streams Section */}
        <ScrollReveal direction="left" delay={0.3}>
          <section id="income" className="py-12">
            <div className="max-w-7xl mx-auto px-6">
              <IncomeStreams />
            </div>
          </section>
        </ScrollReveal>

        {/* Investment Performance Section */}
        <ScrollReveal direction="right" delay={0.4}>
          <section id="investments" className="py-12">
            <div className="max-w-7xl mx-auto px-6">
              <InvestmentPerformance />
            </div>
          </section>
        </ScrollReveal>

        {/* Additional Metrics Grid */}
        <ScrollReveal direction="up" delay={0.5}>
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-6">
              <BentoGrid className="stagger-children">
              <MetricCard
                title="Monthly Expenses"
                value="$3,247"
                subtitle="15% below budget"
                trend="down"
                trendValue="-$623"
                size="small"
              />

              <MetricCard
                title="Savings Rate"
                value="32%"
                subtitle="Of total income"
                trend="up"
                trendValue="+5%"
                size="small"
              />

              <MetricCard
                title="Net Worth Growth"
                value="+$8,456"
                subtitle="This quarter"
                trend="up"
                trendValue="+12.8%"
                size="medium"
              />

              <MetricCard
                title="Emergency Fund"
                value="$18,500"
                subtitle="6 months coverage"
                trend="neutral"
                trendValue="Fully funded"
                size="small"
              />

              <MetricCard
                title="Debt Payoff"
                value="$4,231"
                subtitle="Remaining balance"
                trend="down"
                trendValue="-$1,890"
                size="small"
              />

              <MetricCard
                title="Investment Return"
                value="15.3%"
                subtitle="YTD performance"
                trend="up"
                trendValue="+3.2%"
                size="small"
              />
              </BentoGrid>
            </div>
          </section>
        </ScrollReveal>

        {/* Footer spacer */}
        <div className="h-20" />
      </div>
    </TimeBasedBackground>
  );
}