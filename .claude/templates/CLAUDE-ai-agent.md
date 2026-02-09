# Project: [PROJECT_NAME]

## Tech Stack
- **Framework**: [LangChain/LlamaIndex/Custom]
- **LLM Provider**: [OpenAI/Anthropic/etc]
- **Vector DB**: [Pinecone/Chroma/Weaviate]
- **Language**: Python/TypeScript

## Agent Architecture
[Describe the agent's purpose and workflow]

## Key Components
```
├── agents/        # Agent definitions
├── tools/         # Custom tools
├── prompts/       # System prompts
├── memory/        # Memory/context management
└── chains/        # LangChain chains (if applicable)
```

## Commands
```bash
# Run agent
python -m agents.main

# Test
pytest tests/

# Interactive mode
python -m agents.interactive
```

## Environment Variables
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `PINECONE_API_KEY` - Pinecone API key (if using)
- Fetch from Notion using `/fetch-credentials`

## Prompts
Key prompts located in `prompts/`:
- `system.txt` - Main system prompt
- `tools.txt` - Tool descriptions

## Testing the Agent
[Add specific test scenarios]

## Cost Considerations
- Track token usage
- Use caching where possible
- Consider model selection based on task complexity

## Notes
[Add project-specific notes here]
