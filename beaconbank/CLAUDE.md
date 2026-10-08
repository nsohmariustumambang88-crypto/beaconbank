# BeaconBank - Development Guide

## Project Overview
BeaconBank is a modern, trustworthy banking SaaS platform built with Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui components, and GSAP animations.

### Tech Stack
- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Animations**: GSAP (GreenSock Animation Platform)
- **Icons**: Lucide React
- **UI Components**: shadcn/ui (Button, Card, Form, etc.)

## Color System (BeaconBank Theme)
- **Primary**: #10b981 (Emerald Green - Trust & Security)
- **Secondary**: #059669 (Dark Green)
- **Accent**: Emerald tones for trust-focused messaging
- **Background**: Light/Dark mode support with CSS variables

## Project Structure
```
beaconbank/
├── app/                      # Next.js app router
│   ├── (auth)/              # Authentication group (login, register)
│   ├── dashboard/           # Protected dashboard routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Landing page (with GSAP animations)
│   └── globals.css         # Theme variables & global styles
├── components/
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── hooks/                  # Custom React hooks
│   └── useGsap.ts         # GSAP animation helpers
├── lib/
│   └── utils.ts           # Utility functions (cn, etc)
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind configuration
├── next.config.ts         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## Key Features Built
- ✅ Landing page with GSAP hero animations
- ✅ Sticky navigation with CTA
- ✅ Feature cards with hover animations
- ✅ Gradient backgrounds and smooth transitions
- ✅ Dark mode support (CSS variables)
- ✅ Mobile responsive design

## Development Commands
```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## GSAP Animations
Used throughout the site for:
- Hero section fade-in animations
- Feature card stagger entrance
- Floating accent elements
- Hover interactions on cards
- Smooth transitions

## Component System
- **Button**: Multiple variants (default, outline, ghost, destructive, secondary)
- **Card**: Flexible card layout with Header, Title, Description, Content, Footer
- All components use Tailwind CSS and support dark mode via CSS variables

## Next Steps
1. Create auth pages (login, register) with shadcn forms
2. Build dashboard with wallet overview
3. Add transaction history table
4. Create transfer flow with animations
5. Set up API routes for backend integration
6. Add testing (Jest, React Testing Library)

## Design Inspiration
Based on Finoza Finance Consulting theme:
- Professional, trust-focused messaging
- Green/teal color scheme
- Clean, modern design
- Emphasis on financial confidence

---
Generated: 2026-10-08
