# Gemini Media Generation Guide

## Quick Reference

### API Key Location
```bash
source /root/.claude/environment-keys.sh
# Provides: GEMINI_API_KEY
```

### Tool Locations
- **Image Generation (Python)**: `/root/.claude/tools/gemini-image-gen.py`
- **Video Generation (Node.js)**: `/root/.claude/tools/gemini-video-gen.ts`
- **Image Generation (Bash)**: `/root/.claude/tools/gemini-image-gen.sh`

---

## Image Generation

### Python Tool (Recommended)

```bash
# Load API key
source /root/.claude/environment-keys.sh

# Generate image
python3 /root/.claude/tools/gemini-image-gen.py "Your prompt here" [output_name]

# Examples
python3 /root/.claude/tools/gemini-image-gen.py "A professional gym with modern equipment"
python3 /root/.claude/tools/gemini-image-gen.py "Insurance shield icon in teal color" shield-icon
```

### Models Used
1. **Primary**: `imagen-3.0-generate-002` (Imagen 3 - best quality)
2. **Fallback**: `gemini-2.0-flash-exp` (Gemini with image modality)

### Python SDK Installation
```bash
pip install google-genai --break-system-packages
```

### Direct Python Usage
```python
from google import genai
from google.genai import types
import os

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Imagen 3 method
response = client.models.generate_images(
    model="imagen-3.0-generate-002",
    prompt="Your prompt here",
    config=types.GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio="1:1",  # or "16:9", "9:16", "4:3", "3:4"
        safety_filter_level="BLOCK_ONLY_HIGH",
    ),
)

for image in response.generated_images:
    image.image.save("output.png")
```

---

## Video Generation (Veo 2.0)

### Node.js Tool

```bash
# Install dependencies
npm install @google/genai

# Load API key
source /root/.claude/environment-keys.sh

# Generate video
npx ts-node /root/.claude/tools/gemini-video-gen.ts "Your prompt here" [output_prefix]

# Example
npx ts-node /root/.claude/tools/gemini-video-gen.ts "A professional gym with people working out" gym-video
```

### Video Configuration Options
- **numberOfVideos**: 1-4 videos per request
- **aspectRatio**: "16:9", "9:16" (vertical), "1:1"
- **durationSeconds**: 4, 6, 8 seconds
- **personGeneration**: PersonGeneration.ALLOW_ALL or PersonGeneration.DONT_ALLOW

### Direct Node.js Usage
```typescript
import { GoogleGenAI, PersonGeneration } from '@google/genai';
import { writeFile } from 'fs/promises';
import fetch from 'node-fetch';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let operation = await ai.models.generateVideos({
  model: 'veo-2.0-generate-001',
  prompt: 'Your prompt here',
  config: {
    numberOfVideos: 1,
    aspectRatio: '16:9',
    durationSeconds: 8,
    personGeneration: PersonGeneration.ALLOW_ALL,
  },
});

// Poll for completion (videos take several minutes)
while (!operation.done) {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  operation = await ai.operations.getVideosOperation({ operation });
}

// Download videos
for (const video of operation.response?.generatedVideos || []) {
  const response = await fetch(`${video.video.uri}&key=${process.env.GEMINI_API_KEY}`);
  await writeFile('output.mp4', Buffer.from(await response.arrayBuffer()));
}
```

---

## API Key Setup

### Environment File
Location: `/root/.claude/environment-keys.sh`

```bash
# Google AI Studio API Key
export GOOGLE_AI_STUDIO_KEY="AIzaSyBUbnANaybrtDpT0IdiC2ask0JddeyklC4"

# Gemini API Key (alias for Google AI Studio)
export GEMINI_API_KEY="AIzaSyBUbnANaybrtDpT0IdiC2ask0JddeyklC4"
```

### Auto-load in .bashrc
Already configured at `/root/.bashrc`:
```bash
[ -f /root/.claude/environment-keys.sh ] && source /root/.claude/environment-keys.sh
```

### Per-Project .env.local
Add to project's `.env.local`:
```
GEMINI_API_KEY=AIzaSyBUbnANaybrtDpT0IdiC2ask0JddeyklC4
```

---

## Common Use Cases

### For Daily Event Insurance Project
```bash
cd /root/github-repos/daily-event-insurance

# Hero shield icon
python3 /root/.claude/tools/gemini-image-gen.py "Professional teal insurance shield icon, modern flat design, clean minimal style on white background" public/images/hero-shield

# Partner type icons
python3 /root/.claude/tools/gemini-image-gen.py "Modern gym interior with fitness equipment, professional photography" public/images/gym-partner
python3 /root/.claude/tools/gemini-image-gen.py "Indoor rock climbing wall with climbers, safety equipment visible" public/images/climbing-partner
python3 /root/.claude/tools/gemini-image-gen.py "Kayak and bike rental shop, outdoor adventure equipment" public/images/rental-partner
python3 /root/.claude/tools/gemini-image-gen.py "Adventure sports zipline course through trees" public/images/adventure-partner
```

### For Marketing Content
```bash
# Social media images
python3 /root/.claude/tools/gemini-image-gen.py "Happy business owner at gym reception desk, insurance policy visible, professional setting" social-post

# Promotional video
npx ts-node /root/.claude/tools/gemini-video-gen.ts "Animated insurance shield protecting fitness facility, teal and white color scheme, professional motion graphics" promo-video
```

---

## Troubleshooting

### Model Not Found Error
Models change frequently. Current working models (Dec 2024):
- Image: `imagen-3.0-generate-002`, `gemini-2.0-flash-exp`
- Video: `veo-2.0-generate-001`

### API Key Issues
1. Check key is exported: `echo $GEMINI_API_KEY`
2. Re-source: `source /root/.claude/environment-keys.sh`
3. Verify key at: https://aistudio.google.com/app/apikey

### Rate Limits
- Imagen: ~10 requests/minute
- Veo: ~5 videos/minute (each takes 2-5 min to generate)

---

## Related Files
- API keys JSON: `/root/.claude/api-keys.json`
- Environment keys: `/root/.claude/environment-keys.sh`
- Project .env: `/root/github-repos/daily-event-insurance/.env.local`
