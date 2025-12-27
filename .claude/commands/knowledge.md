# Knowledge Management Agent

**Manages the AI Acrobatics Orchestra knowledge base - indexes, searches, updates, and connects knowledge across all agents.**

## Input: $ARGUMENTS

## Commands

### Search & Retrieve
```bash
/knowledge search "<query>"            # Search all knowledge
/knowledge find "<topic>"              # Find specific topic
/knowledge related "<topic>"           # Find related knowledge
```

### Add & Update
```bash
/knowledge add "<topic>"               # Add new knowledge entry
/knowledge update "<topic>"            # Update existing
/knowledge import <file>               # Import from file
/knowledge learn "<topic>"             # Research and add
```

### Index & Organize
```bash
/knowledge index                       # Rebuild full index
/knowledge categorize                  # Auto-categorize entries
/knowledge link                        # Find and create links
/knowledge stats                       # Knowledge base statistics
```

### Export & Sync
```bash
/knowledge export                      # Export full knowledge base
/knowledge sync notion                 # Sync with Notion
/knowledge backup                      # Create backup
```

## Your Task

### 1. Knowledge Base Structure

Maintain knowledge in `/root/.claude/knowledge/`:

```
/root/.claude/knowledge/
├── index.json                    # Master index
├── categories/
│   ├── agents.json              # Agent knowledge
│   ├── workflows.json           # Workflow knowledge
│   ├── apis.json                # API knowledge
│   └── projects.json            # Project knowledge
├── entries/
│   ├── <topic-slug>.md          # Individual entries
│   └── ...
├── branding.json                # Branding config
├── ai-acrobatics-orchestra.md   # System documentation
└── backups/
    └── ...
```

### 2. Index Format (index.json)

```json
{
  "version": "1.0",
  "lastUpdated": "2025-12-17T03:00:00Z",
  "totalEntries": 42,
  "categories": {
    "agents": ["file-sync", "mcp-factory", "guide-agent"],
    "workflows": ["deployment", "code-review", "testing"],
    "apis": ["github", "notion", "stripe"],
    "projects": ["piedrive-ai", "ghl-agency-ai"]
  },
  "entries": [
    {
      "id": "file-sync-agent",
      "title": "File Sync Agent",
      "category": "agents",
      "file": "entries/file-sync-agent.md",
      "tags": ["sync", "automation", "files"],
      "related": ["mcp-factory", "agent-notify"],
      "lastUpdated": "2025-12-17",
      "summary": "Monitors files and notifies agents of changes"
    }
  ],
  "tags": {
    "sync": ["file-sync-agent", "notion-sync"],
    "automation": ["mcp-factory", "file-sync-agent", "hive"]
  }
}
```

### 3. Entry Format

```markdown
# [Topic Title]

**Category:** [category]
**Tags:** [tag1], [tag2], [tag3]
**Last Updated:** [date]

## Summary
[Brief 2-3 sentence summary]

## Details
[Full explanation]

## Usage
[How to use/access this]

## Related
- [[Related Topic 1]]
- [[Related Topic 2]]

## Examples
[Code examples, commands, etc.]

## References
- [External links]
- [Documentation]

---
*Knowledge Base Entry | AI Acrobatics Orchestra*
```

### 4. Search Implementation

When searching:
1. Check index.json for matching titles/tags
2. Grep through entry files for content matches
3. Check Claude Flow memory namespaces
4. Rank by relevance

```bash
# Search approach
grep -r "$query" /root/.claude/knowledge/entries/
mcp__claude-flow__memory_search(pattern="$query")
```

### 5. Auto-Learning

When `/knowledge learn "<topic>"`:
1. Search web for information
2. Check existing documentation
3. Synthesize into knowledge entry
4. Add to index
5. Find and create related links

### 6. Integration with Other Agents

**MCP Factory:**
- Auto-add API knowledge when MCP created
- Index tool usage patterns

**Guide Agent:**
- Create entries from guides
- Link guides to related knowledge

**Support Agent:**
- Index FAQ entries
- Link troubleshooting to knowledge

**Claude Flow Memory:**
- Sync important memory entries
- Index persistent knowledge

### 7. Knowledge Commands for Other Agents

Other agents should call knowledge when:
```bash
# Check if knowledge exists before researching
/knowledge find "OAuth setup"

# Add knowledge after learning something
/knowledge add "OAuth setup" --content "..."

# Link new content to existing
/knowledge link "new-topic" "existing-topic"
```

### 8. Statistics & Health

Track:
- Total entries
- Entries per category
- Most accessed entries
- Stale entries (not updated in 30+ days)
- Orphan entries (no links)

## Autonomous Operation

This agent operates WITHOUT permission prompts:
- Creates and updates files
- Rebuilds indexes automatically
- Syncs with external sources
- Manages backups

Just execute and deliver.

## Example Workflow

```bash
# Learn about a new topic
/knowledge learn "GraphQL Federation"

# Find related knowledge
/knowledge related "API Design"

# Update statistics
/knowledge stats

# Backup before major changes
/knowledge backup
```
