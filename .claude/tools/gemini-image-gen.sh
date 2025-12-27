#!/bin/bash
#
# Gemini Image Generation Utility (Bash Version)
# Usage: ./gemini-image-gen.sh "Your prompt here" [output_filename]
#
# Example:
#   ./gemini-image-gen.sh "A professional gym with modern equipment"
#   ./gemini-image-gen.sh "Insurance shield icon in teal color" shield-icon
#

set -e -E

# Load API key from environment or file
if [ -z "$GEMINI_API_KEY" ]; then
    if [ -f /root/.claude/environment-keys.sh ]; then
        source /root/.claude/environment-keys.sh
    fi
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo "Error: GEMINI_API_KEY not set"
    echo "Run: source /root/.claude/environment-keys.sh"
    exit 1
fi

# Configuration
MODEL_ID="gemini-2.0-flash-preview-image-generation"
GENERATE_CONTENT_API="streamGenerateContent"

# Get prompt from argument
PROMPT="${1:-}"
if [ -z "$PROMPT" ]; then
    echo "Usage: $0 \"Your prompt here\" [output_filename]"
    echo ""
    echo "Example:"
    echo "  $0 \"A professional gym with modern equipment\""
    echo "  $0 \"Insurance shield icon in teal color\" shield-icon"
    exit 1
fi

# Output filename
OUTPUT_NAME="${2:-gemini_image_$(date +%Y%m%d_%H%M%S)}"

echo "Generating image for: $PROMPT"
echo "Please wait..."

# Create temp file for response
TEMP_RESPONSE=$(mktemp)

# Make API request
curl -s "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?alt=sse&key=${GEMINI_API_KEY}" \
    -H 'Content-Type: application/json' \
    -X POST \
    -d '{
        "contents": [{
            "parts": [
                {"text": "'"${PROMPT}"'"}
            ]
        }],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {
                "imageSize": "1K"
            }
        }
    }' > "$TEMP_RESPONSE"

# Check for errors
if grep -q '"error"' "$TEMP_RESPONSE"; then
    echo "Error from API:"
    cat "$TEMP_RESPONSE" | grep -o '"message":"[^"]*"' | head -1
    rm -f "$TEMP_RESPONSE"
    exit 1
fi

# Extract base64 image data from SSE response
# The response comes as Server-Sent Events with data: prefixes
IMAGE_DATA=$(grep -o '"data":"[^"]*"' "$TEMP_RESPONSE" | grep -v '"data":""' | head -1 | sed 's/"data":"//;s/"$//')

if [ -n "$IMAGE_DATA" ]; then
    # Decode and save image
    OUTPUT_FILE="${OUTPUT_NAME}.png"
    echo "$IMAGE_DATA" | base64 -d > "$OUTPUT_FILE"
    echo "Image saved to: $OUTPUT_FILE"
    echo ""
    echo "Generated 1 image"
else
    # Check for text response
    TEXT_RESPONSE=$(grep -o '"text":"[^"]*"' "$TEMP_RESPONSE" | head -1 | sed 's/"text":"//;s/"$//')
    if [ -n "$TEXT_RESPONSE" ]; then
        echo "Response: $TEXT_RESPONSE"
    fi
    echo "No image was generated"
fi

# Cleanup
rm -f "$TEMP_RESPONSE"
