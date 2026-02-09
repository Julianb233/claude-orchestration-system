---
name: Podcast Episode Script
category: content
type: script
version: 1.0
variables:
  - episode_title
  - episode_number
  - intro
  - segments
  - guest_name
  - outro
---

# Podcast Episode Script

**Episode:** {{episode_number}} - {{episode_title}}
**Guest:** {{guest_name}}

---

## PRE-ROLL [0:00-0:30]

> Welcome back to [Podcast Name]! I'm [Host], and this is episode {{episode_number}}.
> Today we're diving into {{intro}}

---

## MAIN CONTENT

{{#each segments}}
### Segment {{@index}}: {{this.title}}

**Talking Points:**
{{this.content}}

**Transition:** {{this.transition}}
{{/each}}

---

## OUTRO

> {{outro}}
> Subscribe on [platforms] so you never miss an episode!

---

## Show Notes Template

**Episode {{episode_number}}: {{episode_title}}**

**In This Episode:**
- [Timestamp] Topic 1
- [Timestamp] Topic 2

**Resources Mentioned:**
- [Link 1]
- [Link 2]

**Connect With Us:**
- Website: [URL]
- Social: [@handle]
