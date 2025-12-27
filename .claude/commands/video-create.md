# /video-create - AI Video Director & Generation

## Purpose
Intelligent video creation that understands context, crafts detailed motion descriptions, generates with Veo 2.0, and provides integration guidance.

## Trigger
When user requests video creation for a project.

## Workflow

### Phase 1: Context Analysis
Same as /image-create - gather project, brand, client, and purpose context.

### Phase 2: Motion Description (Video Direction)
Create a detailed storyboard-style description:

**Template:**
```
## Video Concept: [Name]

### Opening Shot (0-2s)
[What appears first, how it enters frame]

### Main Sequence (2-6s)
[The core action or motion, what happens]

### Closing Shot (6-8s)
[How it concludes, final frame]

### Motion & Pacing
- **Camera Movement**: [Static, pan, zoom, tracking]
- **Subject Motion**: [What moves and how]
- **Tempo**: [Fast/energetic, slow/contemplative, steady]
- **Transitions**: [Cuts, fades, morphs]

### Audio Direction (if applicable)
- **Music Mood**: [Upbeat, ambient, corporate, etc.]
- **Sound Effects**: [Swooshes, clicks, ambient sounds]

### Color & Lighting
- Same as image creation but note any changes over time

### Technical Specifications
- **Duration**: [4, 6, or 8 seconds]
- **Aspect Ratio**: [16:9, 9:16, 1:1]
- **Resolution**: [1080p standard]
- **Format**: [MP4]
```

### Phase 3: Generation
```bash
source /root/.claude/environment-keys.sh
npx ts-node /root/.claude/tools/gemini-video-gen.ts "[prompt]" [output-prefix]
```

Note: Video generation takes 2-5 minutes. Poll for completion.

### Phase 4: Integration
Videos typically go to:
- `/public/videos/` for web
- External CDN for large files
- YouTube/Vimeo for streaming

## Example

**User**: "Create a promo video for the insurance hero section"

**Video Description**:
```
## Video Concept: Protection in Motion

### Opening Shot (0-2s)
A teal shield icon fades in from particles, assembling from small dots into a solid shape. The background is pure white with subtle animated gradients.

### Main Sequence (2-6s)
The shield pulses with a protective glow. Small icons representing gyms, climbing walls, and rental equipment orbit around it gently. A subtle checkmark appears inside the shield.

### Closing Shot (6-8s)
The orbiting icons settle, the shield glows one final time, and the scene holds on the complete protection visualization. Text could overlay: "Instant Protection"

### Motion & Pacing
- **Camera Movement**: Static, centered
- **Subject Motion**: Smooth, floating, gentle orbits
- **Tempo**: Calm, reassuring, professional
- **Transitions**: Smooth fades and morphs
```

**Prompt**:
```
A teal shield icon (#14B8A6) assembling from particles on white background, smooth professional animation, icons of gym equipment and climbing gear orbiting gently around the shield, subtle protective glow effect, modern motion graphics style, 8 seconds, corporate professional tone
```
