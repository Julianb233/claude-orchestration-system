# Deploy

Deploy to production.

1. Detect platform:
   - If `vercel.json` exists → `vercel --prod`
   - If `netlify.toml` exists → `netlify deploy --prod`
   - If `fly.toml` exists → `fly deploy`
   - Otherwise → ask which platform

2. Run deploy command

3. Show deployed URL and suggest health check
