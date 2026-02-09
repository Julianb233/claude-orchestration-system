# Cloudflare Deployment Guide

## Julian's Cloudflare Credentials

**Account ID:** `910579b4a71059380baf6f36a6db75e7`
**Email:** `Julianb233@gmail.com`

### API Tokens

| Token | Permission | Status | Notes |
|-------|------------|--------|-------|
| `osRagzDRfJLeKA_rBW0AZq2P6aL52qzQpOtuf_BK` | **Pages Edit** | Active | USE THIS FOR CLOUDFLARE PAGES |
| `6zWSvh_TiXzzZWRaucFs8yOTeLMt6NSvHvhIzueq` | Workers AI | IP Restricted | Only works from whitelisted IPs |
| `BcsUmATCf3xH8o82-xiEVY-Yv7QUMb9IegWyPhbm` | Unknown | **Expired/Invalid** | Do not use |

---

## Deployment Methods

### 1. Static Sites (Recommended for Pages-only token)

For sites that can be statically exported:

```bash
# next.config.ts
export default {
  output: 'export',
  images: { unoptimized: true }
}

# Build and deploy
pnpm build
CLOUDFLARE_API_TOKEN=osRagzDRfJLeKA_rBW0AZq2P6aL52qzQpOtuf_BK \
CLOUDFLARE_ACCOUNT_ID=910579b4a71059380baf6f36a6db75e7 \
wrangler pages deploy out --project-name=PROJECT_NAME
```

### 2. OpenNext (Requires Workers Permission)

For Next.js apps with SSR/ISR:

```bash
# Build
npx @opennextjs/cloudflare build

# Deploy (requires Workers Scripts: Edit permission)
CLOUDFLARE_API_TOKEN=TOKEN_WITH_WORKERS_PERMISSION \
CLOUDFLARE_ACCOUNT_ID=910579b4a71059380baf6f36a6db75e7 \
npx opennextjs-cloudflare deploy
```

**Note:** The Pages-only token CANNOT deploy OpenNext apps because OpenNext uses Cloudflare Workers, not Pages.

---

## Common Issues

### 1. "Authentication error [code: 10000]"
- Token doesn't have required permissions
- For Workers: Need "Workers Scripts: Edit"
- For Pages: Need "Cloudflare Pages: Edit"

### 2. "Cannot use the access token from location" [code: 9109]
- Token has IP restrictions enabled
- Only works from whitelisted IP addresses

### 3. Static assets returning 404 after OpenNext deploy to Pages
- OpenNext is designed for Workers, not Pages
- Either: Get a token with Workers permission, OR use static export

### 4. "It looks like you've run a Workers-specific command in a Pages project"
- wrangler.toml has `pages_build_output_dir` set
- Remove it to use Workers mode

---

## Token Permission Requirements

| Deployment Type | Required Permissions |
|-----------------|---------------------|
| Cloudflare Pages (static) | Cloudflare Pages: Edit |
| Cloudflare Workers | Workers Scripts: Edit |
| OpenNext (Next.js SSR) | Workers Scripts: Edit |
| Workers AI | Workers AI: Run |

---

## wrangler.toml Examples

### For Static Pages
```toml
name = "project-name"
compatibility_date = "2024-12-30"
pages_build_output_dir = "out"
```

### For Workers (OpenNext)
```toml
name = "project-name"
main = ".open-next/worker.js"
compatibility_date = "2024-12-30"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
```

---

## Quick Commands

```bash
# Check token permissions
wrangler whoami

# List Pages projects
wrangler pages project list

# Deploy to Pages
wrangler pages deploy DIRECTORY --project-name=NAME

# Deploy to Workers
wrangler deploy
```

---

## Getting a New Token with Full Permissions

1. Go to: https://dash.cloudflare.com/910579b4a71059380baf6f36a6db75e7/api-tokens
2. Create Token → Custom Token
3. Add permissions:
   - Account: Workers Scripts - Edit
   - Account: Cloudflare Pages - Edit
4. Save and copy the new token
