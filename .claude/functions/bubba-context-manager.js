/**
 * Bubba Context Manager
 * Monitors context usage, triggers compaction, and handles
 * graceful handoffs to prevent context overflow.
 */

const fs = require('fs');
const path = require('path');

// Context state tracking
let contextState = {
  currentTokens: 0,
  maxTokens: 180000,
  checkpoints: [],
  compactionCount: 0,
  lastCheckpoint: null
};

/**
 * Load config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/learning-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8')).contextManagement;
}

/**
 * Update context token count
 */
function updateContextUsage(tokenCount) {
  const config = loadConfig();
  contextState.currentTokens = tokenCount;

  const usage = tokenCount / config.maxContextTokens;

  return {
    tokens: tokenCount,
    maxTokens: config.maxContextTokens,
    usagePercent: Math.round(usage * 100),
    status: getContextStatus(usage),
    recommendation: getRecommendation(usage)
  };
}

/**
 * Get context status based on usage
 */
function getContextStatus(usage) {
  const config = loadConfig();

  if (usage >= config.criticalThreshold) return 'critical';
  if (usage >= config.autoCompactionTrigger) return 'high';
  if (usage >= config.warningThreshold) return 'warning';
  return 'healthy';
}

/**
 * Get recommendation based on usage
 */
function getRecommendation(usage) {
  const config = loadConfig();

  if (usage >= config.criticalThreshold) {
    return {
      action: 'immediate-handoff',
      message: 'Context critical. Initiate handoff to fresh agent immediately.',
      priority: 'critical'
    };
  }

  if (usage >= config.autoCompactionTrigger) {
    return {
      action: 'compact-or-handoff',
      message: 'Context high. Trigger compaction or prepare handoff.',
      priority: 'high'
    };
  }

  if (usage >= config.warningThreshold) {
    return {
      action: 'checkpoint',
      message: 'Context approaching limit. Create checkpoint.',
      priority: 'medium'
    };
  }

  return {
    action: 'none',
    message: 'Context healthy.',
    priority: 'low'
  };
}

/**
 * Create a checkpoint for recovery/handoff
 */
function createCheckpoint(swarmId, data) {
  const config = loadConfig();
  const checkpoint = {
    id: `checkpoint_${Date.now()}`,
    swarmId,
    timestamp: new Date().toISOString(),
    contextTokens: contextState.currentTokens,
    data: {
      // Preserve only essential keys
      ...Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          config.preserveKeys.includes(key)
        )
      )
    }
  };

  contextState.checkpoints.push(checkpoint);
  contextState.lastCheckpoint = checkpoint.id;

  // Keep only last 5 checkpoints
  if (contextState.checkpoints.length > 5) {
    contextState.checkpoints.shift();
  }

  return checkpoint;
}

/**
 * Get latest checkpoint
 */
function getLatestCheckpoint(swarmId = null) {
  const checkpoints = swarmId
    ? contextState.checkpoints.filter(c => c.swarmId === swarmId)
    : contextState.checkpoints;

  return checkpoints[checkpoints.length - 1] || null;
}

/**
 * Prepare handoff data for fresh agent
 */
function prepareHandoff(swarmId, currentProgress) {
  const checkpoint = createCheckpoint(swarmId, currentProgress);

  return {
    type: 'graceful-handoff',
    checkpoint,
    resumeInstructions: generateResumeInstructions(checkpoint),
    memoryKeys: getMemoryKeysToPreserve(swarmId),
    estimatedTokensSaved: Math.round(contextState.currentTokens * 0.7)
  };
}

/**
 * Generate resume instructions for new agent
 */
function generateResumeInstructions(checkpoint) {
  const data = checkpoint.data;

  let instructions = `RESUME FROM CHECKPOINT ${checkpoint.id}\n\n`;

  if (data.activeTask) {
    instructions += `ACTIVE TASK: ${data.activeTask}\n`;
  }

  if (data.progress) {
    instructions += `PROGRESS: ${JSON.stringify(data.progress, null, 2)}\n`;
  }

  if (data.phases) {
    const completed = data.phases.filter(p => p.status === 'completed').length;
    const total = data.phases.length;
    instructions += `PHASES: ${completed}/${total} completed\n`;
  }

  if (data.agents) {
    instructions += `ACTIVE AGENTS: ${data.agents.join(', ')}\n`;
  }

  if (data.blockers && data.blockers.length > 0) {
    instructions += `BLOCKERS: ${data.blockers.join(', ')}\n`;
  }

  instructions += `\nRetrieve full state from memory namespace 'recovery' key '${checkpoint.id}'`;

  return instructions;
}

/**
 * Get memory keys to preserve during handoff
 */
function getMemoryKeysToPreserve(swarmId) {
  return [
    { namespace: 'swarms', key: swarmId },
    { namespace: 'agents', pattern: `${swarmId}-*` },
    { namespace: 'recovery', key: contextState.lastCheckpoint }
  ];
}

/**
 * Check if compaction is needed
 */
function shouldCompact() {
  const config = loadConfig();
  const usage = contextState.currentTokens / config.maxContextTokens;
  return usage >= config.autoCompactionTrigger;
}

/**
 * Track compaction event
 */
function recordCompaction(beforeTokens, afterTokens) {
  contextState.compactionCount += 1;
  contextState.currentTokens = afterTokens;

  return {
    compactionNumber: contextState.compactionCount,
    tokensSaved: beforeTokens - afterTokens,
    newUsage: Math.round((afterTokens / loadConfig().maxContextTokens) * 100)
  };
}

/**
 * Get context health summary
 */
function getContextSummary() {
  const config = loadConfig();
  const usage = contextState.currentTokens / config.maxContextTokens;

  return {
    current: contextState.currentTokens,
    max: config.maxContextTokens,
    usagePercent: Math.round(usage * 100),
    status: getContextStatus(usage),
    compactions: contextState.compactionCount,
    checkpoints: contextState.checkpoints.length,
    lastCheckpoint: contextState.lastCheckpoint
  };
}

/**
 * Generate context warning message for display
 */
function getContextWarning() {
  const summary = getContextSummary();

  if (summary.status === 'healthy') return null;

  const warnings = {
    warning: `Context at ${summary.usagePercent}% - checkpoint recommended`,
    high: `Context at ${summary.usagePercent}% - compaction triggered`,
    critical: `CRITICAL: Context at ${summary.usagePercent}% - handoff required immediately`
  };

  return {
    level: summary.status,
    message: warnings[summary.status],
    action: getRecommendation(summary.usagePercent / 100).action
  };
}

/**
 * Reset context state (for new session)
 */
function resetContextState() {
  contextState = {
    currentTokens: 0,
    maxTokens: loadConfig().maxContextTokens,
    checkpoints: [],
    compactionCount: 0,
    lastCheckpoint: null
  };
  return { reset: true };
}

module.exports = {
  updateContextUsage,
  getContextStatus,
  createCheckpoint,
  getLatestCheckpoint,
  prepareHandoff,
  shouldCompact,
  recordCompaction,
  getContextSummary,
  getContextWarning,
  resetContextState,
  getRecommendation
};
