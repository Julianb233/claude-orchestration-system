# LLM SEO Content Revision - Optimize Existing Content

**Argument:** $ARGUMENTS (URL to revise, or paste content directly)

## AUTONOMOUS EXECUTION - NO PERMISSIONS NEEDED

Analyze and optimize the content immediately.

---

## CONTENT TO REVISE: $ARGUMENTS

### Phase 1: Current State Analysis

**Fetch and evaluate the content:**

| Factor | Current State | Target | Gap |
|--------|---------------|--------|-----|
| Answer in first 2 lines | | Yes | |
| Statistics count | | 10+ | |
| Expert quotes | | 2-3 | |
| Heading hierarchy | | H1→H2→H3 | |
| Q&A sections | | 5+ questions | |
| Content length | | 1,500-3,000 | |
| Author attribution | | Named + bio | |
| Publication date | | Visible | |
| Schema markup | | Article + FAQ | |

---

### Phase 2: Quick Wins (Implement First)

**1. Front-Load the Answer**

BEFORE:
> [First paragraph that doesn't answer the query]

AFTER:
> [Direct answer in first 2 sentences] + [Supporting context]

**2. Add Statistics**

Find and add 10+ statistics:
- [Stat 1 with source]
- [Stat 2 with source]
- [Stat 3 with source]
...

**3. Add Expert Quotes**

Research and add 2-3 expert validations:
> "[Quote]" - [Expert Name], [Title] at [Company]

**4. Fix Heading Hierarchy**

Current structure:
```
[Map current headings]
```

Optimized structure:
```
H1: [Main topic as question/statement]
  H2: [Key section as question]
    H3: [Specific detail]
    H3: [Specific detail]
  H2: [Next key section]
    H3: [Detail]
```

---

### Phase 3: Structure Optimization

**Convert to Q&A Format**

Transform section headers from:
- "Our Services" → "What Services Do We Offer?"
- "Benefits" → "What Are the Benefits of [X]?"
- "Process" → "How Does [X] Work?"

**Add Comparison Tables**

If comparing anything, add:
| Factor | Option A | Option B | Option C |
|--------|----------|----------|----------|
| | | | |

**Break Up Long Paragraphs**

- Maximum 3 sentences per paragraph
- Add bullet points for lists
- Use numbered steps for processes

---

### Phase 4: Authority Signals

**Add/Improve Author Attribution**

```markdown
---
**About the Author:** [Full Name] is a [credential/title] with [X years] experience in [relevant field]. [1-2 sentences of relevant expertise]. [Optional: link to author page]
```

**Add Publication Date**

```markdown
*Originally published: [Date] | Last updated: [Current Date]*
```

**Improve External Citations**

Link to authoritative sources:
- Government sites (.gov)
- Educational institutions (.edu)
- Major industry publications
- Research studies

---

### Phase 5: FAQ Section

If missing, add comprehensive FAQ:

```markdown
## Frequently Asked Questions

### [Question 1 - most common query]?
[Direct answer in 2-3 sentences]

### [Question 2]?
[Direct answer]

### [Question 3]?
[Direct answer]

### [Question 4]?
[Direct answer]

### [Question 5]?
[Direct answer]
```

---

### Phase 6: Schema Markup

Generate ready-to-implement JSON-LD:

**Article Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Optimized Title]",
  "description": "[Meta description]",
  "author": {
    "@type": "Person",
    "name": "[Author]"
  },
  "datePublished": "[Original Date]",
  "dateModified": "[Today]"
}
```

**FAQ Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Q1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[A1]"
      }
    }
  ]
}
```

---

## OUTPUT FORMAT

Deliver revision as:

```markdown
# Content Revision Report: [Page Title]

## Optimization Score
- Before: X/100
- After (projected): X/100

## Changes Summary
| Change Type | Count |
|-------------|-------|
| Statistics added | X |
| Expert quotes added | X |
| Headings restructured | X |
| FAQ questions added | X |
| Paragraphs shortened | X |

## Revised Content

[FULL REVISED CONTENT - ready to copy/paste and publish]

## Schema Markup

[JSON-LD code blocks]

## Meta Information
- **Title Tag:** [Optimized - under 60 chars]
- **Meta Description:** [Optimized - under 155 chars]
- **URL Slug:** [If change recommended]

## Additional Recommendations
1. [Recommendation]
2. [Recommendation]
3. [Recommendation]
```

---

## EXECUTE NOW

Fetch the content (if URL provided), analyze, and deliver comprehensive revision immediately.
