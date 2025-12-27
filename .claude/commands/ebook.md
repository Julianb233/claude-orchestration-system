# eBook Agent

**Creates professional eBooks, technical manuals, and long-form documentation with branded PDF output.**

## Input: $ARGUMENTS

## Commands

### Create New eBook
```bash
/ebook create "<title>"
/ebook create "<title>" --chapters 5
/ebook create "<title>" --template [technical|business|guide|manual]
```

### Chapter Management
```bash
/ebook chapter add "<chapter-title>"
/ebook chapter "<topic>" --position 3
/ebook chapter list
/ebook chapter reorder
```

### Content Generation
```bash
/ebook generate "<topic>" --depth [shallow|medium|deep]
/ebook expand "<chapter>"              # Expand existing chapter
/ebook research "<topic>"              # Research and add content
```

### Export & Publishing
```bash
/ebook export pdf
/ebook export epub
/ebook export html
/ebook export all
/ebook publish notion                  # Publish to Notion
```

### Management
```bash
/ebook list                            # List all eBooks
/ebook status                          # Current eBook status
/ebook open "<title>"                  # Switch to eBook
```

## Your Task

### 1. Parse Command

Identify the action:
- `create` - Start new eBook
- `chapter` - Manage chapters
- `generate` - Auto-generate content
- `export` - Create output files
- `list/status/open` - Management

### 2. eBook Structure

Create/maintain structure in `/root/.claude/ebooks/<slug>/`:

```
/root/.claude/ebooks/my-ebook/
├── ebook.json           # Metadata and config
├── chapters/
│   ├── 01-introduction.md
│   ├── 02-getting-started.md
│   └── ...
├── assets/
│   ├── images/
│   └── diagrams/
├── output/
│   ├── my-ebook.pdf
│   ├── my-ebook.epub
│   └── my-ebook.html
└── styles/
    └── custom.css
```

### 3. Metadata Format (ebook.json)

```json
{
  "title": "My eBook Title",
  "subtitle": "Optional subtitle",
  "author": "Julian",
  "version": "1.0",
  "created": "2025-12-17",
  "updated": "2025-12-17",
  "template": "technical",
  "chapters": [
    {"id": 1, "title": "Introduction", "file": "01-introduction.md", "status": "draft"},
    {"id": 2, "title": "Getting Started", "file": "02-getting-started.md", "status": "complete"}
  ],
  "settings": {
    "tableOfContents": true,
    "chapterNumbers": true,
    "pageNumbers": true,
    "index": true
  },
  "branding": {
    "useGlobalBranding": true,
    "customColors": null
  }
}
```

### 4. Chapter Template

```markdown
# Chapter X: [Title]

## Overview
[Brief chapter overview]

## [Section 1]
[Content...]

## [Section 2]
[Content...]

## Key Takeaways
- [Point 1]
- [Point 2]

## Next Steps
[What comes next...]

---
*Chapter X of [Book Title]*
```

### 5. PDF Generation

Use pandoc or similar for PDF generation:

```bash
pandoc chapters/*.md \
  --from markdown \
  --to pdf \
  --output output/ebook.pdf \
  --toc \
  --toc-depth=3 \
  --pdf-engine=xelatex \
  --template=/root/.claude/templates/ebook.tex \
  --metadata-file=ebook.json
```

Or use markdown-pdf, puppeteer, or other tools available.

### 6. Branding Integration

Load from `/root/.claude/knowledge/branding.json`:
- Apply brand colors to headers
- Include logo on cover page
- Use brand fonts
- Add branded footer

### 7. Content Generation

When generating content:
1. Research the topic thoroughly
2. Structure with clear hierarchy
3. Include code examples (if technical)
4. Add diagrams using Mermaid
5. Write for target audience
6. Include practical examples

### 8. Integration with Other Agents

**How-To Guide Agent:**
- Import guides as chapters
- `/ebook import guide "<guide-name>"`

**Support Doc Agent:**
- Include troubleshooting appendix
- `/ebook appendix support "<topic>"`

**Knowledge Base:**
- Pull from existing knowledge
- `/ebook research --from-knowledge`

## Templates

### Technical eBook
- Code-heavy
- API references
- Architecture diagrams
- Implementation guides

### Business eBook
- Executive summaries
- Case studies
- ROI analysis
- Strategic recommendations

### Guide/Manual
- Step-by-step instructions
- Screenshots placeholders
- Troubleshooting sections
- Quick reference cards

## Autonomous Operation

This agent operates WITHOUT permission prompts:
- Creates directories and files
- Generates content
- Produces PDF/EPUB output
- Updates indexes

Just execute and deliver.

## Example Workflow

```bash
# Create new technical eBook
/ebook create "API Development Guide" --template technical

# Add chapters
/ebook chapter add "Introduction to REST APIs"
/ebook chapter add "Authentication Methods"
/ebook chapter add "Error Handling"
/ebook chapter add "Best Practices"

# Generate content for each
/ebook generate "Introduction to REST APIs" --depth deep

# Export
/ebook export pdf
```
