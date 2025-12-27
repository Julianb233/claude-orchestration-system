# Agent Creation Planning Workflow

**Trigger:** User requests to "spin up an agent", "create an agent", or "build an agent"

---

## Mandatory Planning Mode

When the user asks to create or spin up a new agent, ALWAYS enter planning mode first.

### Planning Steps

1. **Understand the Request**
   - What problem is the agent solving?
   - What domain expertise is needed?
   - What tools/capabilities should it have?

2. **Identify Gaps**
   - What did the user NOT mention that's critical?
   - What edge cases need handling?
   - What integrations are needed with existing agents?

3. **Research Phase**
   - What's the current state of the art?
   - What similar agents exist in the registry?
   - What tools/libraries/APIs are needed?

4. **Propose Improvements**
   - What would make this agent exceptional vs. basic?
   - What capabilities would future-proof it?
   - What automation opportunities exist?

5. **Implementation Plan**
   - File structure and location
   - Core capabilities breakdown
   - Integration points with other agents
   - Testing approach

---

## Planning Template

When entering planning mode for agent creation, use this structure:

```markdown
## Agent Creation Plan: [Agent Name]

### 1. Core Purpose
What problem does this agent solve?

### 2. User's Requirements (Stated)
- Requirement 1
- Requirement 2
- ...

### 3. Identified Gaps (Unstated but Critical)
- Gap 1: [Why it matters]
- Gap 2: [Why it matters]
- ...

### 4. Proposed Capabilities
| Capability | Priority | Complexity |
|------------|----------|------------|
| ... | High/Med/Low | Simple/Medium/Complex |

### 5. Tech Stack
- Libraries needed
- APIs to integrate
- Tools to use

### 6. Integration Points
- Works with Agent X for...
- Hands off to Agent Y when...
- Receives input from Agent Z...

### 7. Implementation Steps
1. Step one
2. Step two
3. ...

### 8. Success Criteria
- How do we know the agent works?
- What does "done" look like?

### 9. Questions for User (if any)
- Clarification needed on...
```

---

## After Planning

Once the plan is approved:

1. Create agent file in `/root/.claude/agents/`
2. Update `_registry.md` with new agent
3. Create any supporting prompts in `/root/.claude/prompts/`
4. Test the agent invocation
5. Document usage examples

---

## Quick Reference

| User Says | Action |
|-----------|--------|
| "Spin up an agent for X" | Enter planning mode |
| "Create an agent that does Y" | Enter planning mode |
| "Build me an agent" | Enter planning mode |
| "I need an agent for Z" | Enter planning mode |

**Never skip planning for agent creation.**
