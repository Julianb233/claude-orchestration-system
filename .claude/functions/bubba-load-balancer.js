/**
 * Bubba Load Balancer
 * Intelligently distributes tasks across agents based on
 * availability, performance, and current load.
 */

const fs = require('fs');
const path = require('path');

// In-memory agent state
const agentState = new Map();

/**
 * Load config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/learning-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

/**
 * Initialize or get agent state
 */
function getAgentState(agentName) {
  if (!agentState.has(agentName)) {
    agentState.set(agentName, {
      agent: agentName,
      currentLoad: 0,
      totalTasks: 0,
      avgResponseTime: 0,
      lastHealthCheck: Date.now(),
      healthy: true,
      weight: 1.0,
      reliability: 1.0,
      speed: 1.0
    });
  }
  return agentState.get(agentName);
}

/**
 * Calculate agent weight based on performance metrics
 */
function calculateWeight(agentName, metrics = {}) {
  const config = loadConfig().loadBalancer;
  const factors = config.weightFactors;

  const state = getAgentState(agentName);

  // Update metrics if provided
  if (metrics.reliability !== undefined) state.reliability = metrics.reliability;
  if (metrics.speed !== undefined) state.speed = metrics.speed;

  // Calculate availability (inverse of load)
  const maxConcurrent = loadConfig().agentMetrics.maxConcurrentPerAgent;
  const availability = 1 - (state.currentLoad / maxConcurrent);

  // Weighted score
  const weight = (
    state.reliability * factors.reliability +
    state.speed * factors.speed +
    availability * factors.availability
  );

  state.weight = Math.max(0.1, Math.min(1.0, weight));
  return state.weight;
}

/**
 * Select best agent for a task using weighted round-robin
 */
function selectAgent(taskType, candidateAgents, excludeAgents = []) {
  const config = loadConfig().loadBalancer;

  // Filter out excluded agents
  const available = candidateAgents.filter(a => !excludeAgents.includes(a));

  if (available.length === 0) {
    return { agent: null, reason: 'no-agents-available' };
  }

  if (available.length === 1) {
    return { agent: available[0], reason: 'only-option' };
  }

  // Calculate weights and select
  const weighted = available.map(agent => {
    const state = getAgentState(agent);
    const weight = calculateWeight(agent);
    return { agent, weight, load: state.currentLoad };
  });

  // Sort by weight (descending) then by load (ascending)
  weighted.sort((a, b) => {
    if (Math.abs(a.weight - b.weight) > 0.1) {
      return b.weight - a.weight;
    }
    return a.load - b.load;
  });

  const selected = weighted[0];
  return {
    agent: selected.agent,
    weight: selected.weight,
    load: selected.load,
    reason: 'weighted-selection',
    alternatives: weighted.slice(1, 3).map(w => w.agent)
  };
}

/**
 * Register task assignment to agent
 */
function assignTask(agentName, taskId) {
  const state = getAgentState(agentName);
  state.currentLoad += 1;
  state.totalTasks += 1;

  const maxConcurrent = loadConfig().agentMetrics.maxConcurrentPerAgent;
  const isOverloaded = state.currentLoad >= maxConcurrent;

  return {
    agent: agentName,
    taskId,
    currentLoad: state.currentLoad,
    overloaded: isOverloaded
  };
}

/**
 * Release task from agent
 */
function releaseTask(agentName, taskId, metrics = {}) {
  const state = getAgentState(agentName);
  state.currentLoad = Math.max(0, state.currentLoad - 1);

  // Update performance metrics
  if (metrics.responseTime) {
    state.avgResponseTime = (
      (state.avgResponseTime * (state.totalTasks - 1) + metrics.responseTime) /
      state.totalTasks
    );
  }
  if (metrics.success !== undefined) {
    const successWeight = metrics.success ? 1 : 0;
    state.reliability = state.reliability * 0.9 + successWeight * 0.1;
  }

  return {
    agent: agentName,
    currentLoad: state.currentLoad,
    reliability: state.reliability
  };
}

/**
 * Get current load distribution
 */
function getLoadDistribution() {
  const distribution = {};
  for (const [agent, state] of agentState) {
    distribution[agent] = {
      load: state.currentLoad,
      healthy: state.healthy,
      weight: state.weight,
      reliability: state.reliability
    };
  }
  return distribution;
}

/**
 * Check if system is overloaded
 */
function isSystemOverloaded() {
  const config = loadConfig();
  const threshold = config.loadBalancer.overloadThreshold;
  const maxConcurrent = config.agentMetrics.maxConcurrentPerAgent;

  let totalLoad = 0;
  let totalCapacity = 0;

  for (const [, state] of agentState) {
    if (state.healthy) {
      totalLoad += state.currentLoad;
      totalCapacity += maxConcurrent;
    }
  }

  const loadRatio = totalCapacity > 0 ? totalLoad / totalCapacity : 1;
  return {
    overloaded: loadRatio >= threshold,
    loadRatio,
    totalLoad,
    totalCapacity
  };
}

/**
 * Redistribute tasks from failed agent
 */
function redistributeTasks(failedAgent, tasks, availableAgents) {
  const config = loadConfig();
  if (!config.loadBalancer.redistributeOnFailure) {
    return { redistributed: false, reason: 'redistribution-disabled' };
  }

  const reassignments = [];

  for (const task of tasks) {
    const selection = selectAgent(task.type, availableAgents, [failedAgent]);
    if (selection.agent) {
      reassignments.push({
        taskId: task.id,
        from: failedAgent,
        to: selection.agent,
        reason: selection.reason
      });
    }
  }

  return {
    redistributed: true,
    reassignments,
    failedCount: tasks.length - reassignments.length
  };
}

/**
 * Health check for an agent
 */
function markAgentHealth(agentName, healthy, reason = null) {
  const state = getAgentState(agentName);
  state.healthy = healthy;
  state.lastHealthCheck = Date.now();
  state.lastHealthReason = reason;

  if (!healthy) {
    state.weight = 0;
  } else {
    calculateWeight(agentName);
  }

  return {
    agent: agentName,
    healthy,
    weight: state.weight
  };
}

/**
 * Get recommended parallelization for a set of tasks
 */
function getParallelizationPlan(tasks, availableAgents) {
  const config = loadConfig();
  const maxConcurrent = config.agentMetrics.maxConcurrentPerAgent;

  // Group tasks by independence (no dependencies)
  const independent = tasks.filter(t => !t.dependencies || t.dependencies.length === 0);
  const dependent = tasks.filter(t => t.dependencies && t.dependencies.length > 0);

  // Calculate optimal batch size
  const healthyAgents = availableAgents.filter(a => getAgentState(a).healthy);
  const totalCapacity = healthyAgents.length * maxConcurrent;
  const optimalBatchSize = Math.min(independent.length, totalCapacity);

  return {
    parallelTasks: independent.slice(0, optimalBatchSize),
    sequentialTasks: [...independent.slice(optimalBatchSize), ...dependent],
    batchSize: optimalBatchSize,
    estimatedWaves: Math.ceil(tasks.length / optimalBatchSize)
  };
}

/**
 * Get agent recommendation with reasoning
 */
function getAgentRecommendation(taskType, requirements = {}) {
  const config = loadConfig();
  const agentMatrix = {
    'feature-implementation': ['Archie-Architect', 'Tyler-TypeScript', 'Fiona-Frontend'],
    'bug-fix': ['Diana-Debugger', 'Tyler-TypeScript'],
    'api-development': ['Adam-API', 'Tyler-TypeScript'],
    'frontend-ui': ['Fiona-Frontend', 'Tyler-TypeScript'],
    'testing': ['Tessa-Tester', 'Tyler-TypeScript'],
    'deployment': ['Petra-DevOps', 'Kirk-Kubernetes'],
    'security-audit': ['Sage-Security', 'Rex-Reviewer'],
    'documentation': ['Gina-Guide', 'Rex-Reviewer'],
    'content-creation': ['Scarlett-Script', 'Morgan-Marketing'],
    'client-deliverable': ['Derek-Deliverables']
  };

  const candidates = agentMatrix[taskType] || ['Tyler-TypeScript'];
  const selection = selectAgent(taskType, candidates);

  return {
    primary: selection.agent,
    alternatives: selection.alternatives || [],
    reasoning: `Selected ${selection.agent} (${selection.reason}) - weight: ${selection.weight?.toFixed(2)}, load: ${selection.load}`,
    taskType
  };
}

module.exports = {
  selectAgent,
  assignTask,
  releaseTask,
  getLoadDistribution,
  isSystemOverloaded,
  redistributeTasks,
  markAgentHealth,
  getParallelizationPlan,
  getAgentRecommendation,
  calculateWeight,
  getAgentState
};
