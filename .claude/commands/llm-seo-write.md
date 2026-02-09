# LLM SEO Content Writer - Generate Optimized Content

**Argument:** $ARGUMENTS (topic, keyword, or content brief)

## AUTONOMOUS EXECUTION - NO PERMISSIONS NEEDED

Generate LLM-optimized content immediately.

---

## CONTENT TARGET: $ARGUMENTS

### Step 1: Research (Auto-Execute)

Before writing, automatically:

1. **Search current LLM responses** for the topic
   - What are ChatGPT/Perplexity currently recommending?
   - What sources are being cited?
   - What's missing from current answers?

2. **Find statistics and data**
   - Search for recent studies, surveys, data
   - Identify 10+ citable statistics
   - Note authoritative sources

3. **Identify expert voices**
   - Who are recognized experts in this space?
   - Find 2-3 quotable insights

---

### Step 2: Select Tone

Choose the best tone for the topic and audience:

**TONE 1: "The Trusted Expert"** 🎯
- Best for: Professional services, B2B, technical topics
- Voice: Confident authority with warmth

**TONE 2: "The Irreverent Insider"** 🔥
- Best for: Marketing, startups, younger audiences
- Voice: Punchy, calls out BS, entertaining

**TONE 3: "The Helpful Strategist"** 📊
- Best for: How-to guides, comparisons, decision content
- Voice: Actionable, data-driven, consultative

**TONE 4: "The Storytelling Disruptor"** 🚀
- Best for: Thought leadership, brand content, emotional topics
- Voice: Narrative hooks, memorable examples

---

### Step 3: Content Structure (MANDATORY)

```markdown
# [Primary Keyword as Question or Statement]

[ANSWER PARAGRAPH - 2 sentences that directly answer the query]
[Supporting context - 2-3 more sentences]

## [Question H2 - addresses search intent]

[Direct answer - 30-80 words]
[Statistics: "According to [Source], X% of [finding]"]
[Expert insight: "[Quote]" - [Expert Name], [Title] at [Company]]

### [Specific Detail H3]

[Actionable information]
- Bullet point 1
- Bullet point 2
- Bullet point 3

### [Another Detail H3]

[More specifics with data]

| Comparison | Option A | Option B |
|------------|----------|----------|
| Factor 1   | Detail   | Detail   |
| Factor 2   | Detail   | Detail   |

## [Next Major Section H2]

[Continue pattern...]

## Frequently Asked Questions

### [Question 1]?
[Concise answer - 2-3 sentences]

### [Question 2]?
[Concise answer - 2-3 sentences]

### [Question 3]?
[Concise answer - 2-3 sentences]

### [Question 4]?
[Concise answer - 2-3 sentences]

### [Question 5]?
[Concise answer - 2-3 sentences]

## Key Takeaways

- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]

---

**About the Author:** [Name] is a [credentials]. [1-2 sentences of expertise relevant to topic].

*Last Updated: [Date]*
```

---

### Step 4: Quality Checklist

Before delivering, verify:

- [ ] Answer appears in first 2 lines
- [ ] 10+ statistics with sources
- [ ] 2-3 expert quotes with credentials
- [ ] Clear H1→H2→H3 hierarchy
- [ ] 5+ FAQ questions
- [ ] Comparison tables where relevant
- [ ] Bullet points for scannability
- [ ] 1,500-3,000 words of substance
- [ ] No fluff or filler content
- [ ] Tone is captivating and engaging

---

### Step 5: Schema Markup

Include ready-to-implement schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Title]",
  "description": "[Meta description]",
  "author": {
    "@type": "Person",
    "name": "[Author]",
    "jobTitle": "[Title]"
  },
  "datePublished": "[Date]",
  "dateModified": "[Date]",
  "publisher": {
    "@type": "Organization",
    "name": "[Company]"
  }
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 1]"
      }
    }
  ]
}
```

---

## OUTPUT FORMAT

Deliver:

1. **The Content** - Full article ready to publish
2. **Meta Information** - Title tag, meta description, URL slug
3. **Schema Markup** - JSON-LD code blocks
4. **Internal Linking Suggestions** - Related topics to link
5. **External Authority Links** - Sources to cite

---

## EXECUTE NOW

Research the topic and generate comprehensive, LLM-optimized content immediately.
