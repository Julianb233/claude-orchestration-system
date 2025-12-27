# Support-Doc - Support Documentation Generator

Generate FAQs, troubleshooting guides, and knowledge base articles.

## Usage

`/support-doc [topic|feature] [options]`

## Examples

```bash
/support-doc "Payment integration"
/support-doc "Authentication errors" --type troubleshoot
/support-doc "App features" --type faq
/support-doc "Claude Flow" --type kb
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--type` | faq, troubleshoot, kb, all | all |
| `--format` | Output: pdf, html, md, notion | html |
| `--client` | Apply client branding | None |
| `--scan-errors` | Scan codebase for errors | true |

## Content Types

### FAQ Generation (`--type faq`)

Generates categorized frequently asked questions:
- Getting Started
- Common Issues
- Features
- Billing/Account
- Advanced Usage

### Troubleshooting (`--type troubleshoot`)

Creates systematic problem-resolution guides:
- Symptom description
- Possible causes (ranked by likelihood)
- Step-by-step resolution
- Decision trees
- Escalation paths

### Knowledge Base (`--type kb`)

Produces searchable, detailed articles:
- In-depth explanations
- Related articles linking
- Search tags
- Category organization

## Workflow

### 1. Analyze Source

```javascript
// Scan for errors in codebase
Grep({ pattern: "throw new Error|console.error", type: "ts" })

// Find user-facing messages
Grep({ pattern: "toast\\.|alert\\(|showError", type: "tsx" })

// Check existing support content
Glob({ pattern: "**/docs/support/**" })
```

### 2. Categorize Issues

Group by:
- Error type (auth, network, validation, etc.)
- User journey stage (setup, usage, advanced)
- Severity (blocker, major, minor)

### 3. Generate Content

For each category:
- Write clear Q&A pairs
- Create resolution steps
- Add code examples where helpful
- Include screenshots placeholders

### 4. Format Output

```javascript
// Load template
Read({ file_path: "/root/.claude/templates/support-template.html" })

// Apply branding
mcp__claude-flow__memory_usage({
  action: "retrieve",
  namespace: "branding",
  key: "client-{clientName}"
})

// Generate HTML
Write({ file_path: "/tmp/support-{topic}-{timestamp}.html" })
```

### 5. Store

```javascript
mcp__claude-flow__memory_usage({
  action: "store",
  namespace: "support",
  key: "support-{topic}",
  value: { faqs, troubleshooting, kbArticles, createdAt }
})
```

## Error Scanning

When `--scan-errors` is enabled:

```javascript
// Find all error patterns
Grep({ pattern: "Error:|ERROR|error:", output_mode: "content" })

// Extract error messages
Grep({ pattern: "message:\\s*['\"]([^'\"]+)['\"]", type: "ts" })

// Find error handlers
Grep({ pattern: "catch\\s*\\(|.catch\\(", type: "ts" })
```

## Integration

Works with:
- **how-to-guide-agent** - Link to related guides
- **branding-agent** - Apply client styling
- **error-detective** - Deep error analysis

## Memory

Stored in `support` namespace:
- `faq-{feature}` - Feature FAQs
- `troubleshooting-{feature}` - Resolution guides
- `kb-article-{topic}` - KB articles
- `error-catalog-{app}` - Error message catalog
