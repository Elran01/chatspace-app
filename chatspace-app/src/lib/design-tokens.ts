/**
 * ChatSpace Design System Tokens
 *
 * This file contains all design system constants used throughout the ChatSpace application.
 * These tokens ensure consistency across components and provide a single source of truth
 * for design decisions.
 */

// Brand Color Palettes
export const colors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  // Secondary gray colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  // Accent colors
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },
  // Status colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
} as const;

// AI Model Configuration
export const aiModels = {
  gpt4: {
    name: 'GPT-4',
    color: '#10a37f',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    provider: 'OpenAI',
  },
  claude: {
    name: 'Claude',
    color: '#cc785c',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    provider: 'Anthropic',
  },
  gemini: {
    name: 'Gemini',
    color: '#4285f4',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    provider: 'Google',
  },
  deepseek: {
    name: 'DeepSeek',
    color: '#6366f1',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    provider: 'DeepSeek',
  },
} as const;

// Typography System
export const typography = {
  fonts: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing System (based on 4px grid)
export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
  40: '10rem', // 160px
  48: '12rem', // 192px
  56: '14rem', // 224px
  64: '16rem', // 256px
} as const;

// Border Radius System
export const borderRadius = {
  none: '0',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const;

// Shadow System
export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Transition System
export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',

  // Common easing functions
  easing: {
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Breakpoints (matching Tailwind defaults)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Z-Index Scale
export const zIndex = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  dropdown: 1000,
  modal: 1100,
  popover: 1200,
  tooltip: 1300,
  toast: 1400,
} as const;

// Layout Constants
export const layout = {
  sidebar: {
    width: '280px',
    collapsedWidth: '64px',
  },
  header: {
    height: '64px',
  },
  maxWidths: {
    chat: '800px',
    canvas: '1400px',
    prose: '65ch',
  },
} as const;

// Component Sizes
export const componentSizes = {
  xs: {
    height: '24px',
    padding: '4px 8px',
    fontSize: '12px',
  },
  sm: {
    height: '32px',
    padding: '6px 12px',
    fontSize: '14px',
  },
  md: {
    height: '40px',
    padding: '8px 16px',
    fontSize: '16px',
  },
  lg: {
    height: '48px',
    padding: '12px 20px',
    fontSize: '18px',
  },
  xl: {
    height: '56px',
    padding: '16px 24px',
    fontSize: '20px',
  },
} as const;

// Animation Presets
export const animations = {
  fadeIn: 'fade-in 150ms ease-in-out',
  fadeOut: 'fade-out 150ms ease-in-out',
  slideInRight: 'slide-in-right 250ms ease-out',
  slideOutRight: 'slide-out-right 250ms ease-in',
  pulseRing: 'pulse-ring 1.5s ease-out infinite',
} as const;

// Type Definitions
export type AIModelType = keyof typeof aiModels;
export type ColorPalette = keyof typeof colors;
export type TypographySize = keyof typeof typography.sizes;
export type SpacingValue = keyof typeof spacing;
export type BorderRadiusValue = keyof typeof borderRadius;
export type ShadowValue = keyof typeof shadows;
export type ComponentSize = keyof typeof componentSizes;

// Utility Functions
export const getAIModelConfig = (model: AIModelType) => aiModels[model];

export const getColorValue = (
  palette: ColorPalette,
  shade: keyof typeof colors.primary
) => {
  return colors[palette][shade];
};

export const getSpacingValue = (key: SpacingValue) => spacing[key];

export const getTransition = (
  property: string,
  duration: keyof typeof transitions = 'normal'
) => {
  return `${property} ${transitions[duration]}`;
};

// Export default design tokens object
export const designTokens = {
  colors,
  aiModels,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  layout,
  componentSizes,
  animations,
} as const;
