---
name: video-short
category: content
type: script
version: 1.0
author: Scarlett-Script
description: Short-form video script for TikTok, Reels, Shorts (15-60s)
variables:
  - name: hook
    type: string
    required: true
    description: Attention-grabbing opening (first 3 seconds)
  - name: problem
    type: string
    required: true
    description: Pain point viewer faces
  - name: solution
    type: string
    required: true
    description: Your solution or main message
  - name: proof
    type: string
    required: false
    description: Quick stat or credibility element
  - name: cta
    type: string
    required: true
    description: Call-to-action
  - name: duration
    type: string
    required: true
    description: Target duration (30s, 60s)
---

# Short-Form Video Script

**Duration:** {{duration}}
**Platform:** TikTok / Instagram Reels / YouTube Shorts

---

## [0:00-0:03] HOOK
**Visual:** Face to camera / B-roll
**Audio:** Upbeat music (low volume)

> {{hook}}

**On-screen text:** [Key phrase from hook]

---

## [0:03-0:15] PROBLEM
**Visual:** Show the pain point / relatable scenario

> {{problem}}

**On-screen text:** [Problem visual reinforcement]

---

## [0:15-0:45] SOLUTION
**Visual:** Demonstrate solution / show results

> {{solution}}

{{#if proof}}
**Proof Point:**
> {{proof}}
{{/if}}

---

## [0:45-{{duration}}] CTA
**Visual:** Face to camera / end card

> {{cta}}

**On-screen text:** [CTA reinforced visually]

---

## Production Notes

### Visual Cues
- Keep face in frame for first 3 seconds
- Use captions (80% watch without sound)
- Add motion every 2-3 seconds
- End on freeze frame with CTA

### Editing Checklist
- [ ] Vertical format (9:16)
- [ ] Captions synced and readable
- [ ] Brand colors in text
- [ ] Logo/watermark in corner
- [ ] 3-5 relevant hashtags

### Platform Adjustments

**TikTok:** Use trending sounds, duet-friendly endings
**Instagram Reels:** Tag location, use native music
**YouTube Shorts:** Include searchable title
