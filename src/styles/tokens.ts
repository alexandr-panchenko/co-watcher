/**
 * Co-Watcher Design System Tokens
 * Source of truth derived from DESIGN.md and Stitch specification.
 */

export const COLORS = {
  // Surface hierarchy
  surface: {
    canvas: '#0e0e11',
    base: '#131316',
    panel: '#1b1b1e',
    card: '#1f1f22',
    hover: '#2a2a2d',
    overlay: '#353438',
    bright: '#39393c',
  },
  // Text hierarchy
  text: {
    primary: '#e4e1e6',
    secondary: '#c2c6d6',
    muted: '#8c909f',
    inverse: '#002e6a',
  },
  // Outlines and borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    default: 'rgba(66, 71, 84, 0.4)',
    hover: 'rgba(66, 71, 84, 0.7)',
    focus: 'rgba(173, 198, 255, 0.6)',
  },
  // Gem tone roles
  gem: {
    sapphire: {
      primary: '#adc6ff',
      container: '#4d8eff',
      onPrimary: '#002e6a',
      bgMuted: 'rgba(77, 142, 255, 0.15)',
      border: 'rgba(173, 198, 255, 0.4)',
    },
    emerald: {
      primary: '#4edea3',
      container: '#00a572',
      onPrimary: '#003824',
      bgMuted: 'rgba(0, 165, 114, 0.15)',
      border: 'rgba(78, 222, 163, 0.4)',
    },
    amber: {
      primary: '#fbbf24',
      container: '#f59e0b',
      onPrimary: '#1f1f22',
      bgMuted: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.5)',
    },
    rose: {
      primary: '#ffb2b7',
      container: '#ff516a',
      onPrimary: '#67001b',
      bgMuted: 'rgba(255, 81, 106, 0.15)',
      border: 'rgba(255, 178, 183, 0.4)',
    },
    purple: {
      primary: '#c084fc',
      container: '#a855f7',
      onPrimary: '#3b0764',
      bgMuted: 'rgba(168, 85, 247, 0.15)',
      border: 'rgba(192, 132, 252, 0.4)',
    },
  },
} as const;

export const RADII = {
  sm: '4px',
  md: '6px',
  control: '8px',
  card: '12px',
  panel: '16px',
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
  md: '0 4px 16px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 32px rgba(0, 0, 0, 0.45)',
  glowSapphire: '0 0 20px rgba(77, 142, 255, 0.15)',
  glowAmber: '0 0 20px rgba(245, 158, 11, 0.2)',
  glowEmerald: '0 0 20px rgba(78, 222, 163, 0.2)',
  glowPinAmber: '0 0 12px rgba(245, 158, 11, 0.7)',
  glowPinSapphire: '0 0 12px rgba(173, 198, 255, 0.7)',
  gemEmerald: '0 0 8px rgba(78, 222, 163, 0.8)',
  gemSapphire: '0 0 8px rgba(173, 198, 255, 0.8)',
  gemTertiary: '0 0 8px rgba(255, 178, 183, 0.8)',
  headerBar: '0 1px 8px rgba(0, 0, 0, 0.3)',
  tabActive: '0 0 8px rgba(173, 198, 255, 0.6)',
} as const;

export const TYPOGRAPHY = {
  nano: { fontSize: '9px', lineHeight: '12px' },
  micro: { fontSize: '10px', lineHeight: '14px' },
  captionSm: { fontSize: '11px', lineHeight: '15px' },
  captionMd: { fontSize: '12px', lineHeight: '16px' },
  bodyCompact: { fontSize: '13.5px', lineHeight: '20px' },
  bodyMd: { fontSize: '14px', lineHeight: '21px' },
} as const;

export const LAYOUT = {
  stageSidebarOffset: '376px',
  stageMinHeight: '560px',
  dockWidth: '352px',
} as const;

export type GemVariant = 'sapphire' | 'emerald' | 'amber' | 'rose' | 'purple' | 'neutral';

