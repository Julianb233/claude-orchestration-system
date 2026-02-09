#!/usr/bin/env npx ts-node
/**
 * Gemini/Veo Video Generation Utility
 *
 * Usage: npx ts-node gemini-video-gen.ts "Your prompt here" [output_prefix]
 *
 * Example:
 *   npx ts-node gemini-video-gen.ts "A professional gym with people working out"
 *   npx ts-node gemini-video-gen.ts "Insurance protection shield animation" shield-animation
 *
 * Requirements:
 *   npm install @google/genai
 *   export GEMINI_API_KEY="your-api-key"
 */

import { GoogleGenAI, PersonGeneration } from '@google/genai';
import { writeFile } from 'fs/promises';
import fetch from 'node-fetch';

interface GeneratedVideo {
  video?: {
    uri?: string;
  };
}

interface VideoOperation {
  done?: boolean;
  name?: string;
  response?: {
    generatedVideos?: GeneratedVideo[];
  };
}

async function generateVideo(prompt: string, outputPrefix: string = 'video'): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY not set');
    console.error('Run: source /root/.claude/environment-keys.sh');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log(`Generating video for: ${prompt}`);
  console.log('This may take several minutes...');

  try {
    let operation: VideoOperation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        aspectRatio: '16:9',
        durationSeconds: 8,
        personGeneration: PersonGeneration.ALLOW_ALL,
      },
    });

    // Poll for completion
    while (!operation.done) {
      console.log(`Video ${operation.name} is being generated. Checking again in 10 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({
        operation: operation,
      });
    }

    const videoCount = operation.response?.generatedVideos?.length ?? 0;
    console.log(`Generated ${videoCount} video(s).`);

    // Download and save videos
    if (operation.response?.generatedVideos) {
      for (let i = 0; i < operation.response.generatedVideos.length; i++) {
        const generatedVideo = operation.response.generatedVideos[i];
        const videoUri = generatedVideo?.video?.uri;

        if (videoUri) {
          console.log(`Downloading video from: ${videoUri}`);
          const response = await fetch(`${videoUri}&key=${apiKey}`);
          const buffer = await response.arrayBuffer();
          const filename = `${outputPrefix}_${i}.mp4`;
          await writeFile(filename, Buffer.from(buffer));
          console.log(`Video saved to: ${filename}`);
        }
      }
    }

  } catch (error) {
    console.error('Error generating video:', error);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Gemini/Veo Video Generation Utility

Usage: npx ts-node gemini-video-gen.ts "Your prompt here" [output_prefix]

Example:
  npx ts-node gemini-video-gen.ts "A professional gym with people working out"
  npx ts-node gemini-video-gen.ts "Insurance protection shield animation" shield-animation

Requirements:
  npm install @google/genai
  export GEMINI_API_KEY="your-api-key"
`);
  process.exit(1);
}

const prompt = args[0];
const outputPrefix = args[1] || `video_${Date.now()}`;

generateVideo(prompt, outputPrefix);
