# Fetch Credentials from Notion

When you need API keys, access tokens, client secrets, or any credentials for a project:

## Automatic Credential Lookup Workflow

1. **Search Notion for credentials** using the API-post-search tool with queries like:
   - "[service name] API key"
   - "[service name] credentials"
   - "[service name] access token"
   - "[project name] secrets"

2. **Common credential locations in Julian's Notion**:
   - Notes & References database (category: "Login info")
   - API Keys notebook
   - Project-specific pages

3. **After finding credentials**:
   - Extract the relevant keys/tokens from the Notion page properties (Quick Summary, AI summary, or page content)
   - Create or update `.env` / `.env.local` files in the project
   - Never commit credentials to git - ensure they're in `.gitignore`

4. **Test the integration**:
   - Run the project's test suite if available
   - Verify the API connection works

5. **Redeploy if needed**:
   - For Vercel projects: `vercel --prod` or push to main branch
   - For other platforms: follow project-specific deployment

## Example Search Queries
- GitHub: "GitHub credentials API" or "GitHub access key"
- Notion: "Notion API key"
- OpenAI: "OpenAI API key"
- Vercel: "Vercel api key"
- Any service: "[service] credentials" or "[service] API"

## Security Reminders
- Never expose credentials in logs or responses to users
- Always use environment variables
- Rotate credentials if accidentally exposed
