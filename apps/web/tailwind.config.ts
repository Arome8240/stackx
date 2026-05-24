import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      colors: {
        background:           'hsl(var(--background))',
        foreground:           'hsl(var(--foreground))',
        card:                 { DEFAULT: 'hsl(var(--card))',       foreground: 'hsl(var(--card-foreground))' },
        popover:              { DEFAULT: 'hsl(var(--popover))',    foreground: 'hsl(var(--popover-foreground))' },
        primary:              { DEFAULT: 'hsl(var(--primary))',    foreground: 'hsl(var(--primary-foreground))' },
        secondary:            { DEFAULT: 'hsl(var(--secondary))',  foreground: 'hsl(var(--secondary-foreground))' },
        muted:                { DEFAULT: 'hsl(var(--muted))',      foreground: 'hsl(var(--muted-foreground))' },
        accent:               { DEFAULT: 'hsl(var(--accent))',     foreground: 'hsl(var(--accent-foreground))' },
        destructive:          { DEFAULT: 'hsl(var(--destructive))',foreground: 'hsl(var(--destructive-foreground))' },
        success:              { DEFAULT: 'hsl(var(--success))',    foreground: 'hsl(var(--success-foreground))' },
        warning:              { DEFAULT: 'hsl(var(--warning))',    foreground: 'hsl(var(--warning-foreground))' },
        border:               'hsl(var(--border))',
        input:                'hsl(var(--input))',
        ring:                 'hsl(var(--ring))',
      },
      borderRadius: {
        '2xl': '1rem',
        xl:    '0.75rem',
        lg:    'var(--radius)',
        md:    'calc(var(--radius) - 2px)',
        sm:    'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'glow-sm':  '0 0 8px hsl(var(--primary) / 0.25)',
        'glow':     '0 0 20px hsl(var(--primary) / 0.25), 0 0 40px hsl(var(--primary) / 0.10)',
        'glow-lg':  '0 0 40px hsl(var(--primary) / 0.35), 0 0 80px hsl(var(--primary) / 0.15)',
        'card':     '0 1px 3px hsl(0 0% 0% / 0.12), 0 1px 2px hsl(0 0% 0% / 0.08)',
        'card-lg':  '0 4px 16px hsl(0 0% 0% / 0.20)',
        'modal':    '0 25px 50px hsl(0 0% 0% / 0.50)',
      },
      animation: {
        'fade-in':        'fadeIn 0.2s ease',
        'fade-in-up':     'fadeInUp 0.3s ease',
        'scale-in':       'scaleIn 0.2s ease',
        'slide-in-right': 'slideInRight 0.25s ease',
        'slide-in-down':  'slideInDown 0.2s ease',
        'shimmer':        'shimmer 1.5s infinite',
        'heartbeat':      'heartbeat 0.4s ease',
        'spin-slow':      'spin-slow 3s linear infinite',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:        { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeInUp:      { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:       { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideInRight:  { from: { opacity: '0', transform: 'translateX(16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideInDown:   { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:       { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        heartbeat:     { '0%': { transform: 'scale(1)' }, '25%': { transform: 'scale(1.3)' }, '50%': { transform: 'scale(1)' }, '75%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)' } },
        'spin-slow':   { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        'pulse-glow':  { '0%, 100%': { boxShadow: '0 0 8px hsl(263 70% 65% / 0.3)' }, '50%': { boxShadow: '0 0 20px hsl(263 70% 65% / 0.6)' } },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      screens: {
        xs: '480px',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--foreground))',
            '--tw-prose-headings': 'hsl(var(--foreground))',
            '--tw-prose-links': 'hsl(var(--primary))',
            '--tw-prose-code': 'hsl(var(--foreground))',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
