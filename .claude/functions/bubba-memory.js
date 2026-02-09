/**
 * Bubba's Learning & Memory System
 * Stores orchestration history, learns patterns, tracks agent performance
 * Uses Claude Flow memory namespaces for persistence
 */

const fs = require('fs');
const path = require('path');

// In-memory cache (synced with Claude Flow)
const memoryCache = {
  orchestrationHistory: [],
  taskPatterns: new Map(),
  agentPerformance: new Map(),
  blockerLibrary: new Map()
};

/**
 * Load learning config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/learning-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// ============================================
// ORCHESTRATION HISTORY
// ============================================

/**
 * Record a completed orchestration
 * @param {object} orchestration - Orchestration details
 */
async function recordOrchestration(orchestration) {
  const config = loadConfig();
  const record = {
    id: orchestration.id || `orch_${Date.now()}`,
    taskName: orchestration.taskName,
    taskDescription: orchestration.taskDescription,
    category: categorizeTask(orchestration.taskDescription),
    client: orchestration.client || null,
    agents: orchestration.agents,
    phases: orchestration.phases,
    startTime: orchestration.startTime,
    endTime: orchestration.endTime || new Date().toISOString(),
    duration: orchestration.duration,
    status: orchestration.status, // 'completed', 'failed', 'partial'
    filesChanged: orchestration.filesChanged || [],
    blockers: orchestration.blockers || [],
    qualityGates: orchestration.qualityGates || [],
    outcome: orchestration.outcome || {}
  };

  memoryCache.orchestrationHistory.push(record);

  // Update patterns based on this orchestration
  await updateTaskPatterns(record);

  // Update agent performance
  await updateAgentPerformance(record);

  // Store to Claude Flow memory
  // mcp__claude-flow__memory_usage(action="store", namespace="bubba-learning", key=`orch_${record.id}`, value=record, ttl=config.memory.ttl.orchestrationHistory)

  return record;
}

/**
 * Get orchestration history
 * @param {object} filters - Optional filters (client, category, status)
 */
function getOrchestrationHistory(filters = {}) {
  let history = [...memoryCache.orchestrationHistory];

  if (filters.client) {
    history = history.filter(o => o.client === filters.client);
  }
  if (filters.category) {
    history = history.filter(o => o.category === filters.category);
  }
  if (filters.status) {
    history = history.filter(o => o.status === filters.status);
  }
  if (filters.limit) {
    history = history.slice(-filters.limit);
  }

  return history;
}

// ============================================
// TASK PATTERN RECOGNITION
// ============================================

/**
 * Categorize a task based on keywords
 */
function categorizeTask(taskDescription) {
  const config = loadConfig();
  const keywords = config.taskPatterns.keywords;
  const desc = taskDescription.toLowerCase();

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => desc.includes(word))) {
      return category;
    }
  }

  return 'general';
}

/**
 * Update task patterns based on completed orchestration
 */
async function updateTaskPatterns(orchestration) {
  const category = orchestration.category;
  const pattern = memoryCache.taskPatterns.get(category) || {
    category,
    count: 0,
    avgDuration: 0,
    successRate: 0,
    commonAgents: {},
    commonBlockers: [],
    recommendations: []
  };

  // Update counts
  pattern.count += 1;

  // Update average duration
  const durationMs = parseDuration(orchestration.duration);
  pattern.avgDuration = ((pattern.avgDuration * (pattern.count - 1)) + durationMs) / pattern.count;

  // Update success rate
  const isSuccess = orchestration.status === 'completed';
  pattern.successRate = ((pattern.successRate * (pattern.count - 1)) + (isSuccess ? 1 : 0)) / pattern.count;

  // Track common agents
  for (const agent of orchestration.agents) {
    pattern.commonAgents[agent] = (pattern.commonAgents[agent] || 0) + 1;
  }

  // Track common blockers
  if (orchestration.blockers.length > 0) {
    pattern.commonBlockers.push(...orchestration.blockers);
  }

  memoryCache.taskPatterns.set(category, pattern);
}

/**
 * Find similar past orchestrations
 */
function findSimilarOrchestrations(taskDescription, limit = 5) {
  const config = loadConfig();
  const category = categorizeTask(taskDescription);
  const threshold = config.learning.similarityThreshold;

  const similar = memoryCache.orchestrationHistory
    .filter(o => {
      // Same category
      if (o.category !== category) return false;
      // Simple keyword overlap for similarity
      const similarity = calculateSimilarity(taskDescription, o.taskDescription);
      return similarity >= threshold;
    })
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
    .slice(0, limit);

  return similar;
}

/**
 * Calculate simple text similarity (Jaccard)
 */
function calculateSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

// ============================================
// AGENT PERFORMANCE TRACKING
// ============================================

/**
 * Update agent performance metrics
 */
async function updateAgentPerformance(orchestration) {
  for (const agentName of orchestration.agents) {
    const perf = memoryCache.agentPerformance.get(agentName) || {
      agent: agentName,
      tasksCompleted: 0,
      tasksFailed: 0,
      avgCompletionTime: 0,
      blockerFrequency: 0,
      qualityGatePassRate: 1.0,
      taskHistory: []
    };

    // Update based on orchestration status
    if (orchestration.status === 'completed') {
      perf.tasksCompleted += 1;
    } else {
      perf.tasksFailed += 1;
    }

    // Track blockers for this agent
    const agentBlockers = orchestration.blockers.filter(b => b.agent === agentName);
    if (agentBlockers.length > 0) {
      perf.blockerFrequency = (perf.blockerFrequency * (perf.tasksCompleted + perf.tasksFailed - 1) + 1) /
        (perf.tasksCompleted + perf.tasksFailed);
    }

    // Add to task history (limited)
    perf.taskHistory.push({
      orchestrationId: orchestration.id,
      task: orchestration.taskName,
      status: orchestration.status,
      timestamp: orchestration.endTime
    });
    if (perf.taskHistory.length > 50) {
      perf.taskHistory.shift();
    }

    memoryCache.agentPerformance.set(agentName, perf);
  }
}

/**
 * Get agent performance metrics
 */
function getAgentPerformance(agentName = null) {
  if (agentName) {
    return memoryCache.agentPerformance.get(agentName);
  }
  return Object.fromEntries(memoryCache.agentPerformance);
}

/**
 * Get recommended agents for a task type
 */
function getRecommendedAgents(taskDescription, maxAgents = 5) {
  const category = categorizeTask(taskDescription);
  const pattern = memoryCache.taskPatterns.get(category);

  if (!pattern) {
    // No history, return default agents based on category
    return getDefaultAgentsForCategory(category);
  }

  // Sort agents by usage frequency for this category
  const sortedAgents = Object.entries(pattern.commonAgents)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxAgents)
    .map(([agent]) => agent);

  return sortedAgents;
}

/**
 * Default agents for each category
 */
function getDefaultAgentsForCategory(category) {
  const defaults = {
    'feature-implementation': ['Archie-Architect', 'Tyler-TypeScript', 'Tessa-Tester'],
    'bug-fix': ['Diana-Debugger', 'Tyler-TypeScript', 'Tessa-Tester'],
    'refactoring': ['Rex-Reviewer', 'Tyler-TypeScript', 'Archie-Architect'],
    'api-development': ['Adam-API', 'Tyler-TypeScript', 'Sage-Security'],
    'frontend-ui': ['Fiona-Frontend', 'Tyler-TypeScript', 'Rex-Reviewer'],
    'database-schema': ['Dana-Database', 'Archie-Architect', 'Tyler-TypeScript'],
    'testing': ['Tessa-Tester', 'Tyler-TypeScript', 'Rex-Reviewer'],
    'deployment': ['Petra-DevOps', 'Sage-Security', 'Otto-Observer'],
    'documentation': ['Gina-Guide', 'Rex-Reviewer'],
    'security-audit': ['Sage-Security', 'Rex-Reviewer', 'Archie-Architect'],
    'general': ['Tyler-TypeScript', 'Rex-Reviewer', 'Tessa-Tester']
  };

  return defaults[category] || defaults['general'];
}

// ============================================
// BLOCKER LIBRARY
// ============================================

/**
 * Record a blocker and its resolution
 */
async function recordBlocker(blocker) {
  const key = `${blocker.type}_${blocker.pattern}`;
  const existing = memoryCache.blockerLibrary.get(key) || {
    type: blocker.type,
    pattern: blocker.pattern,
    occurrences: 0,
    resolutions: []
  };

  existing.occurrences += 1;
  if (blocker.resolution) {
    existing.resolutions.push({
      resolution: blocker.resolution,
      successful: blocker.resolutionSuccessful,
      timestamp: new Date().toISOString()
    });
  }

  memoryCache.blockerLibrary.set(key, existing);
}

/**
 * Get known blockers and resolutions
 */
function getKnownBlockers(blockerType = null) {
  if (blockerType) {
    const results = [];
    for (const [key, blocker] of memoryCache.blockerLibrary) {
      if (blocker.type === blockerType) {
        results.push(blocker);
      }
    }
    return results;
  }
  return Object.fromEntries(memoryCache.blockerLibrary);
}

/**
 * Suggest resolution for a blocker
 */
function suggestBlockerResolution(blockerDescription) {
  const blockerType = categorizeBlocker(blockerDescription);
  const known = getKnownBlockers(blockerType);

  if (known.length === 0) return null;

  // Find successful resolutions
  const suggestions = known
    .flatMap(b => b.resolutions.filter(r => r.successful))
    .map(r => r.resolution);

  return suggestions.length > 0 ? suggestions[0] : null;
}

/**
 * Categorize a blocker
 */
function categorizeBlocker(description) {
  const config = loadConfig();
  const desc = description.toLowerCase();

  const categories = {
    'dependency-missing': ['module not found', 'cannot find', 'missing dependency'],
    'type-error': ['type', 'typescript', 'ts'],
    'test-failure': ['test failed', 'assertion', 'expect'],
    'build-error': ['build failed', 'compile', 'bundler'],
    'api-timeout': ['timeout', 'econnrefused', 'network'],
    'auth-issue': ['unauthorized', '401', '403', 'permission'],
    'config-missing': ['config', 'environment', 'env'],
    'resource-limit': ['memory', 'disk', 'limit exceeded']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => desc.includes(kw))) {
      return category;
    }
  }

  return 'unknown';
}

// ============================================
// OPTIMIZATION SUGGESTIONS
// ============================================

/**
 * Generate optimization suggestions for a task
 */
function generateSuggestions(taskDescription) {
  const config = loadConfig();
  if (!config.optimizations.autoSuggest) return [];

  const suggestions = [];
  const category = categorizeTask(taskDescription);
  const pattern = memoryCache.taskPatterns.get(category);

  if (!pattern || pattern.count < config.learning.minSamplesForPattern) {
    return suggestions;
  }

  // Suggest based on success rate
  if (pattern.successRate < 0.8) {
    suggestions.push({
      type: 'warning',
      message: `${category} tasks have ${Math.round(pattern.successRate * 100)}% success rate. Consider additional review.`
    });
  }

  // Suggest common blockers to check
  if (pattern.commonBlockers.length > 0) {
    const topBlocker = getMostCommon(pattern.commonBlockers);
    suggestions.push({
      type: 'precheck',
      message: `Common blocker: ${topBlocker}. Pre-checking recommended.`
    });
  }

  // Suggest agents based on performance
  const recommended = getRecommendedAgents(taskDescription);
  if (recommended.length > 0) {
    suggestions.push({
      type: 'agents',
      message: `Recommended agents: ${recommended.join(', ')}`
    });
  }

  return suggestions.slice(0, config.optimizations.maxSuggestions);
}

// ============================================
// UTILITIES
// ============================================

function parseDuration(durationStr) {
  if (typeof durationStr === 'number') return durationStr;
  // Parse "1h 30m" format
  const hours = (durationStr.match(/(\d+)h/) || [0, 0])[1];
  const minutes = (durationStr.match(/(\d+)m/) || [0, 0])[1];
  const seconds = (durationStr.match(/(\d+)s/) || [0, 0])[1];
  return (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
}

function getMostCommon(arr) {
  const counts = {};
  arr.forEach(item => {
    const key = typeof item === 'object' ? JSON.stringify(item) : item;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

module.exports = {
  // History
  recordOrchestration,
  getOrchestrationHistory,
  findSimilarOrchestrations,

  // Patterns
  categorizeTask,
  updateTaskPatterns,

  // Agent Performance
  updateAgentPerformance,
  getAgentPerformance,
  getRecommendedAgents,

  // Blockers
  recordBlocker,
  getKnownBlockers,
  suggestBlockerResolution,

  // Suggestions
  generateSuggestions,

  // Config
  loadConfig
};
