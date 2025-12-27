# Claude Flow Memory Namespace

Manage memory namespaces for data isolation.

## Usage
```
/cf-memory-namespace [namespace] [action]
```

## Instructions

Use the `mcp__claude-flow__memory_namespace` tool:

1. **Required Parameters:**
   - `namespace`: Name of the namespace
   - `action`: Operation to perform (list, create, delete)

## Actions

- `list` - List all entries in a namespace
- `create` - Create a new namespace
- `delete` - Remove a namespace and all its data

## Example

```
Create a new project namespace:
- namespace: "project-beta"
- action: "create"
```

Execute: `mcp__claude-flow__memory_namespace` with namespace="project-beta", action="create"
