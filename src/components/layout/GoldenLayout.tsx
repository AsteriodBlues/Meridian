'use client';

import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

// Golden Ratio: 1.618
const GOLDEN_RATIO = 1.618;

// Spacing scale based on golden ratio
export const spacing = {
  xs: '0.382rem',    // base / φ²
  sm: '0.618rem',    // base / φ
  md: '1rem',        // base
  lg: '1.618rem',    // base × φ
  xl: '2.618rem',    // base × φ²
  xxl: '4.236rem',   // base × φ³
  xxxl: '6.854rem',  // base × φ⁴
};

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: keyof typeof spacing;
  animate?: boolean;
}

// Golden ratio container with perfect proportions
export const GoldenContainer = forwardRef<HTMLDivElement, ContainerProps>(({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'lg',
  animate = true
}, ref) => {
  const maxWidths = {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%'
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  const Container = animate ? motion.div : 'div';

  return (
    <Container
      ref={ref}
      className={`mx-auto ${className}`}
      style={{
        maxWidth: maxWidths[maxWidth],
        padding: spacing[padding]
      }}
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
    >
      {children}
    </Container>
  );
});

GoldenContainer.displayName = 'GoldenContainer';

// Grid system based on golden ratio
interface GridProps {
  children: ReactNode;
  columns?: number;
  gap?: keyof typeof spacing;
  className?: string;
  stagger?: boolean;
}

export function GoldenGrid({ 
  children, 
  columns = 3, 
  gap = 'lg', 
  className = '',
  stagger = true 
}: GridProps) {
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger ? 0.1 : 0,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: spacing[gap]
      }}
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        )) :
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      }
    </motion.div>
  );
}

// Section with golden ratio spacing
interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'comfortable' | 'cozy' | 'spacious';
  background?: 'none' | 'subtle' | 'glass';
}

export function GoldenSection({ 
  children, 
  className = '',
  spacing: spacingType = 'comfortable',
  background = 'none'
}: SectionProps) {
  const spacingMap = {
    cozy: { py: spacing.lg, my: spacing.md },
    comfortable: { py: spacing.xl, my: spacing.lg },
    spacious: { py: spacing.xxl, my: spacing.xl }
  };

  const backgroundMap = {
    none: '',
    subtle: 'bg-white/2',
    glass: 'glass-morphism'
  };

  const sectionSpacing = spacingMap[spacingType];

  return (
    <motion.section
      className={`${backgroundMap[background]} ${className}`}
      style={{
        paddingTop: sectionSpacing.py,
        paddingBottom: sectionSpacing.py,
        marginTop: sectionSpacing.my,
        marginBottom: sectionSpacing.my
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.section>
  );
}

// Card with perfect proportions
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  aspect?: 'square' | 'golden' | 'wide' | 'tall';
}

export function GoldenCard({ 
  children, 
  className = '',
  hover = true,
  glow = false,
  aspect = 'golden'
}: CardProps) {
  const aspects = {
    square: '1 / 1',
    golden: `1 / ${GOLDEN_RATIO}`,
    wide: `${GOLDEN_RATIO} / 1`,
    tall: `1 / ${GOLDEN_RATIO * GOLDEN_RATIO}`
  };

  return (
    <motion.div
      className={`
        glass-morphism rounded-xl overflow-hidden
        ${hover ? 'magnetic-hover cursor-pointer' : ''}
        ${glow ? 'glow-hover' : ''}
        ${className}
      `}
      style={{
        aspectRatio: aspects[aspect],
        padding: spacing.lg
      }}
      whileHover={hover ? { 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
      } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}

// Sidebar layout with golden proportions
interface SidebarLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  sidebarPosition?: 'left' | 'right';
  className?: string;
}

export function GoldenSidebarLayout({
  sidebar,
  main,
  sidebarPosition = 'left',
  className = ''
}: SidebarLayoutProps) {
  // Golden ratio for sidebar vs main content
  const sidebarWidth = `${100 / GOLDEN_RATIO}%`;
  const mainWidth = `${100 - (100 / GOLDEN_RATIO)}%`;

  return (
    <div className={`flex gap-8 ${className}`}>
      {sidebarPosition === 'left' && (
        <motion.aside
          className="flex-shrink-0"
          style={{ width: sidebarWidth }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {sidebar}
        </motion.aside>
      )}
      
      <motion.main
        className="flex-1"
        style={{ width: mainWidth }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {main}
      </motion.main>
      
      {sidebarPosition === 'right' && (
        <motion.aside
          className="flex-shrink-0"
          style={{ width: sidebarWidth }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {sidebar}
        </motion.aside>
      )}
    </div>
  );
}

// Stack with golden spacing
interface StackProps {
  children: ReactNode;
  space?: keyof typeof spacing;
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

export function GoldenStack({ 
  children, 
  space = 'lg',
  align = 'stretch',
  className = ''
}: StackProps) {
  const alignments = {
    start: 'items-start',
    center: 'items-center', 
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div 
      className={`flex flex-col ${alignments[align]} ${className}`}
      style={{ gap: spacing[space] }}
    >
      {children}
    </div>
  );
}

// Inline stack (horizontal)
export function GoldenInlineStack({ 
  children, 
  space = 'md',
  align = 'center',
  className = ''
}: StackProps) {
  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end', 
    stretch: 'items-stretch'
  };

  return (
    <div 
      className={`flex ${alignments[align]} ${className}`}
      style={{ gap: spacing[space] }}
    >
      {children}
    </div>
  );
}