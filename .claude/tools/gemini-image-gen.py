#!/usr/bin/env python3
"""
Gemini/Imagen Image Generation Utility
Usage: python gemini-image-gen.py "Your prompt here" [output_filename]

Example:
  python gemini-image-gen.py "A professional gym with modern equipment"
  python gemini-image-gen.py "Insurance shield icon in teal color" shield-icon
"""

import base64
import mimetypes
import os
import sys
from datetime import datetime
from google import genai
from google.genai import types


def save_binary_file(file_name, data):
    with open(file_name, "wb") as f:
        f.write(data)
    print(f"Image saved to: {file_name}")
    return file_name


def generate_image(prompt: str, output_name: str = None):
    """Generate an image using Imagen 3"""

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not set. Run: source /root/.claude/environment-keys.sh")
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    print(f"Generating image for: {prompt}")
    print("Please wait...")

    # Generate output filename
    if not output_name:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_name = f"gemini_image_{timestamp}"

    saved_files = []

    try:
        # Use Imagen 3 for image generation
        response = client.models.generate_images(
            model="imagen-3.0-generate-002",
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1",
                safety_filter_level="BLOCK_ONLY_HIGH",
            ),
        )

        # Save generated images
        for i, image in enumerate(response.generated_images):
            suffix = f"_{i}" if i > 0 else ""
            file_name = f"{output_name}{suffix}.png"
            image.image.save(file_name)
            print(f"Image saved to: {file_name}")
            saved_files.append(file_name)

    except Exception as e:
        error_msg = str(e)
        if "not found" in error_msg.lower() or "not supported" in error_msg.lower():
            print(f"Imagen 3 not available: {error_msg}")
            print("Trying Gemini 2.0 Flash experimental...")

            # Fallback to Gemini 2.0 Flash with image generation
            try:
                contents = [
                    types.Content(
                        role="user",
                        parts=[types.Part.from_text(text=prompt)],
                    ),
                ]

                config = types.GenerateContentConfig(
                    response_modalities=["IMAGE", "TEXT"],
                )

                for chunk in client.models.generate_content_stream(
                    model="gemini-2.0-flash-exp",
                    contents=contents,
                    config=config,
                ):
                    if (
                        chunk.candidates is None
                        or chunk.candidates[0].content is None
                        or chunk.candidates[0].content.parts is None
                    ):
                        continue

                    part = chunk.candidates[0].content.parts[0]

                    if part.inline_data and part.inline_data.data:
                        file_index = len(saved_files)
                        suffix = f"_{file_index}" if file_index > 0 else ""
                        file_extension = mimetypes.guess_extension(part.inline_data.mime_type) or ".png"
                        file_name = f"{output_name}{suffix}{file_extension}"
                        saved_file = save_binary_file(file_name, part.inline_data.data)
                        saved_files.append(saved_file)
                    elif hasattr(part, 'text') and part.text:
                        print(f"Response: {part.text}")

            except Exception as e2:
                print(f"Fallback also failed: {e2}")
        else:
            print(f"Error: {error_msg}")

    if saved_files:
        print(f"\nGenerated {len(saved_files)} image(s)")
        return saved_files
    else:
        print("No images were generated")
        return []


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    prompt = sys.argv[1]
    output_name = sys.argv[2] if len(sys.argv) > 2 else None

    generate_image(prompt, output_name)
