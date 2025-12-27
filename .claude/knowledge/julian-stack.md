# Julian Stack - Technical Reference

> **Owner**: Julian (Julianb233 on GitHub)
> **Agency**: AI Acrobatics
> **Last Updated**: December 2024

---

## Overview

This document defines the standard technical patterns, conventions, and architecture used across all of Julian's applications. Any agent or assistant working on Julian's projects should reference this to maintain consistency.

---

## GitHub Profile

- **Username**: `Julianb233`
- **Total Repos**: 27+
- **Active Projects**: `/root/github-repos/active/`
- **Archived**: `/root/github-repos/archive/`
- **Agency Ops**: `/root/github-repos/agency-ops/`

---

## Web Application Stack ("Julian Stack")

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x - 19.x | UI Framework |
| TypeScript | 5.6+ | Type Safety |
| Vite | 5.x - 7.x | Build Tool |
| Tailwind CSS | 3.x - 4.x | Styling |
| Radix UI | Latest | Headless Components |
| shadcn/ui | Latest | Component Library |
| Wouter | 3.x | Lightweight Routing |
| React Query | 4.x - 5.x | Server State |
| Framer Motion | 11.x - 12.x | Animations |
| React Hook Form | 7.x | Form Handling |
| Zod | 3.x - 4.x | Schema Validation |
| Lucide React | Latest | Icons |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ / 22+ | Runtime |
| Express | 4.x | HTTP Server |
| tRPC | 11.x | Type-Safe API (preferred) |
| NestJS | Optional | Enterprise Framework |
| TypeScript | 5.6+ | Type Safety |

### Database

| Technology | Purpose |
|------------|---------|
| Drizzle ORM | Primary ORM (preferred) |
| Prisma | Alternative ORM |
| Neon PostgreSQL | Primary Database |
| MySQL/TiDB | Alternative (AWS RDS) |
| Redis/BullMQ | Job Queues |

### Authentication

| Technology | Purpose |
|------------|---------|
| Passport.js | Auth Middleware |
| passport-google-oauth20 | Google OAuth |
| passport-local | Username/Password |
| JWT (jose) | Token Management |
| express-session | Session Management |
| bcryptjs | Password Hashing |

### Payments

| Technology | Purpose |
|------------|---------|
| Stripe | Payment Processing |
| RevenueCat | Mobile Subscriptions |

### AI Integration

| Technology | Purpose |
|------------|---------|
| Google Gemini API | Primary AI (gemini-pro, gemini-1.5) |
| OpenAI GPT-4 | Alternative AI |
| Whisper API | Speech-to-Text |

### Voice & Communication

| Technology | Purpose |
|------------|---------|
| Twilio Voice | Outbound Calls |
| Twilio SMS | Text Messaging |
| Vapi | Voice AI Agents |
| Resend | Email Sending |

### Deployment & Infrastructure

| Technology | Purpose |
|------------|---------|
| Vercel | Primary Hosting |
| AWS S3 / Cloudflare R2 | File Storage |
| AWS RDS | Managed Database |
| AWS Lambda | Serverless Functions |
| Sentry | Error Tracking |
| n8n | Workflow Automation |

### Browser Automation

| Technology | Purpose |
|------------|---------|
| Browserbase | Cloud Browser Infrastructure |
| Stagehand | AI Browser Automation |
| Playwright | E2E Testing |

---

## Mobile Application Stack

### Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Expo | 54.x | React Native Framework |
| React Native | 0.81+ | Mobile Runtime |
| TypeScript | 5.x | Type Safety |

### Navigation

| Technology | Purpose |
|------------|---------|
| @react-navigation/native | Core Navigation |
| @react-navigation/native-stack | Stack Navigator |
| @react-navigation/bottom-tabs | Tab Navigator |

### UI & Styling

| Technology | Purpose |
|------------|---------|
| expo-linear-gradient | Gradients |
| expo-blur | Blur Effects |
| @expo/vector-icons | Icons |

### State & Storage

| Technology | Purpose |
|------------|---------|
| @react-native-async-storage | Local Storage |
| axios | HTTP Client |

### Build & Deploy

| Technology | Purpose |
|------------|---------|
| EAS Build | Cloud Builds |
| EAS Submit | App Store Submission |

---

## Project Structure Conventions

### Web App Structure

```
project-name/
├── client/                    # Frontend (if separate)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities (trpc client, utils)
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API service functions
│   │   └── App.tsx           # Root component
│   └── public/               # Static assets
│
├── server/                   # Backend
│   ├── _core/               # Framework code (optional)
│   ├── services/            # Business logic
│   ├── routers.ts           # tRPC routers
│   ├── db.ts                # Database queries
│   └── index.ts             # Express entry point
│
├── drizzle/                  # Database (Drizzle)
│   ├── schema.ts            # Table definitions
│   └── migrations/          # Migration files
│
├── prisma/                   # Database (Prisma alternative)
│   └── schema.prisma        # Schema definition
│
├── shared/                   # Shared code
│   └── const.ts             # Shared constants
│
├── scripts/                  # Utility scripts
├── docs/                     # Documentation
├── security/                 # Security policies
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── drizzle.config.ts
├── .env.example
└── vercel.json
```

### Mobile App Structure (Expo)

```
project-mobile/
├── src/
│   ├── components/          # Reusable components
│   ├── screens/             # Screen components
│   ├── navigation/          # Navigation setup
│   ├── services/            # API services
│   ├── hooks/               # Custom hooks
│   └── utils/               # Utilities
│
├── assets/                   # Images, fonts
├── App.tsx                   # Entry point
├── app.json                  # Expo config
├── eas.json                  # EAS Build config
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## Active Projects Reference

### Client Apps

| Project | Description | Stack |
|---------|-------------|-------|
| PieDrive-AI | Content repurposing platform | NestJS, React, Prisma, Gemini |
| Better-Together-App | Social/community app | Express, tRPC, Drizzle, React |
| ghl-agency-ai | GHL automation SaaS | tRPC, Browserbase, Gemini |
| Life-alert-ai | Senior healthcare platform | tRPC, Twilio, OpenAI |
| taxauctionaicom | Tax auction AI | Standard stack |
| Ian-Duffy-Vapi-Agent | Voice AI agent | Vapi integration |
| Your-best-shot-media | Media platform | Standard stack |
| Content-Analysis | Content analysis tool | Gemini |
| legalsecureai | Legal AI platform | Standard stack |
| Travis-Allen-App | Client content app | Standard stack |

### Agency

| Project | Description |
|---------|-------------|
| agency-ops | MAOS - Marketing Agency Autonomous Operations System |
| Ai-Acrobatics- | Agency website |

### Mobile

| Project | Description |
|---------|-------------|
| BetterTogetherMobile | Better Together iOS/Android |
| Life-alert-ai/mobile | Life Alert mobile companion |

---

## Code Patterns

### tRPC Router Pattern

```typescript
// server/routers.ts
import { router, publicProcedure, protectedProcedure } from './trpc';
import { z } from 'zod';

export const appRouter = router({
  feature: router({
    list: protectedProcedure.query(({ ctx }) => {
      return db.getItems(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(({ ctx, input }) => {
        return db.createItem(ctx.user.id, input);
      }),
  }),
});
```

### Drizzle Schema Pattern

```typescript
// drizzle/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### React Component Pattern

```typescript
// components/FeatureCard.tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
```

### Express + tRPC Setup

```typescript
// server/index.ts
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';

const app = express();

app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext: ({ req }) => ({ user: req.user }),
}));

app.listen(3000);
```

---

## Environment Variables Template

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
GEMINI_API_KEY=
OPENAI_API_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=

# Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Monitoring
SENTRY_DSN=

# Communication
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
RESEND_API_KEY=
```

---

## Deployment Checklist

### Vercel Deployment

1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `npm run build`
4. Set output directory: `dist` or `.next`
5. Configure custom domain
6. Enable automatic deployments

### Database Setup

1. Create Neon PostgreSQL database
2. Get connection string
3. Run migrations: `npm run db:push` or `npx prisma migrate deploy`
4. Verify connection

### Post-Deploy

1. Verify health endpoint
2. Test authentication flow
3. Test payment flow (use test keys first)
4. Configure Sentry
5. Set up monitoring alerts

---

## Web → Mobile Migration Path

When converting a web app to mobile:

1. **Share Types**: Extract shared TypeScript types to `shared/` directory
2. **API Client**: Use same tRPC client or axios patterns
3. **Auth**: Implement secure token storage with AsyncStorage
4. **UI**: Recreate components using React Native equivalents
5. **Navigation**: Map routes to React Navigation screens
6. **Build**: Configure EAS Build for iOS and Android

---

## AI Acrobatics - Agency Context

**Agency Name**: AI Acrobatics
**Focus**: AI-powered marketing automation and app development
**Repository**: `/root/github-repos/agency-ops/`

### Agency Structure

```
agency-ops/
├── clients/              # Client project files
├── knowledge-base/       # Best practices, case studies
│   ├── best-practices/
│   ├── case-studies/
│   ├── competitors/
│   └── industry/
├── templates/            # Reusable templates
├── operations/           # SOPs and workflows
├── logs/                 # Activity logs
└── state/               # Current state files
```

### Client Work Patterns

- Each client gets a subdirectory in `clients/`
- Projects follow the standard Julian Stack
- Documentation stored in project `docs/` folder
- Deployment via Vercel with client-specific env vars
