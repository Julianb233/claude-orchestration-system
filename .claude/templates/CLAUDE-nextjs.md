# Project: [PROJECT_NAME]

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: [Postgres/Supabase/etc]
- **Auth**: [NextAuth/Clerk/etc]
- **Deployment**: Vercel

## Key Directories
```
src/
├── app/           # App router pages
├── components/    # React components
├── lib/           # Utility functions
├── hooks/         # Custom React hooks
└── types/         # TypeScript types
```

## Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint
npm run test      # Run tests
```

## Deployment
```bash
vercel --prod     # Deploy to production
```

## Environment Variables
- Copy `.env.example` to `.env.local`
- Fetch API keys from Notion using `/fetch-credentials`

## Important Files
- `src/app/layout.tsx` - Root layout
- `src/app/page.tsx` - Home page
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind configuration

## Notes
[Add project-specific notes here]
