/**
 * Bubba Time/Cost Estimator
 * Provides intelligent estimates based on historical data,
 * task complexity, and agent performance.
 */

const fs = require('fs');
const path = require('path');

// Estimation cache
const estimationCache = new Map();

/**
 * Load config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/learning-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

/**
 * Categorize task for estimation
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
 * Calculate complexity score (1-5)
 */
function calculateComplexity(taskDescription, metadata = {}) {
  let score = 2; // Base complexity

  const complexityIndicators = {
    high: ['complex', 'multiple', 'integration', 'refactor entire', 'redesign', 'migrate'],
    medium: ['update', 'add', 'create', 'implement', 'fix'],
    low: ['simple', 'minor', 'small', 'quick', 'typo', 'comment']
  };

  const desc = taskDescription.toLowerCase();

  if (complexityIndicators.high.some(w => desc.includes(w))) score += 2;
  if (complexityIndicators.medium.some(w => desc.includes(w))) score += 1;
  if (complexityIndicators.low.some(w => desc.includes(w))) score -= 1;

  // Adjust for file count
  if (metadata.estimatedFiles) {
    if (metadata.estimatedFiles > 10) score += 2;
    else if (metadata.estimatedFiles > 5) score += 1;
  }

  // Adjust for dependencies
  if (metadata.hasDependencies) score += 1;
  if (metadata.requiresReview) score += 0.5;
  if (metadata.requiresTesting) score += 0.5;

  return Math.max(1, Math.min(5, Math.round(score)));
}

/**
 * Estimate time for a single task
 */
function estimateTaskTime(taskDescription, metadata = {}) {
  const config = loadConfig();
  const estimation = config.estimation;

  const category = categorizeTask(taskDescription);
  const baseTime = estimation.baseTimePerTask[category] || 1200; // seconds
  const complexity = calculateComplexity(taskDescription, metadata);
  const multiplier = config.taskPatterns.complexityMultipliers[category] || 1.0;

  // Calculate base estimate
  let estimate = baseTime * multiplier * (complexity / 3);

  // Apply agent speed multiplier if known
  if (metadata.agent && estimation.agentSpeedMultipliers[metadata.agent]) {
    estimate *= estimation.agentSpeedMultipliers[metadata.agent];
  }

  // Add buffer
  const buffer = estimate * (estimation.bufferPercentage / 100);
  estimate += buffer;

  // Round to reasonable increments
  estimate = Math.ceil(estimate / 60) * 60; // Round to minutes

  return {
    seconds: estimate,
    minutes: Math.round(estimate / 60),
    formatted: formatDuration(estimate),
    complexity,
    category,
    confidence: calculateConfidence(category, metadata)
  };
}

/**
 * Estimate time for a full orchestration (multiple phases)
 */
function estimateOrchestration(phases, metadata = {}) {
  const config = loadConfig();
  let totalSequential = 0;
  let longestParallel = 0;
  const phaseEstimates = [];

  for (const phase of phases) {
    const phaseTasks = phase.tasks || [phase];
    const taskEstimates = phaseTasks.map(task =>
      estimateTaskTime(task.description || task, { ...metadata, agent: task.agent })
    );

    // For parallel tasks, take the longest
    const phaseTime = phase.parallel
      ? Math.max(...taskEstimates.map(e => e.seconds))
      : taskEstimates.reduce((sum, e) => sum + e.seconds, 0);

    phaseEstimates.push({
      phase: phase.name || `Phase ${phases.indexOf(phase) + 1}`,
      parallel: phase.parallel || false,
      tasks: taskEstimates.length,
      seconds: phaseTime,
      formatted: formatDuration(phaseTime)
    });

    if (phase.parallel) {
      longestParallel = Math.max(longestParallel, phaseTime);
      totalSequential += phaseTime;
    } else {
      totalSequential += phaseTime;
    }
  }

  // Calculate parallelization savings
  const sequentialTotal = phaseEstimates.reduce((sum, p) => {
    const taskSum = p.tasks * (config.estimation.baseTimePerTask['general'] || 1200);
    return sum + taskSum;
  }, 0);

  const parallelSavings = Math.max(0, sequentialTotal - totalSequential);

  return {
    total: {
      seconds: totalSequential,
      minutes: Math.round(totalSequential / 60),
      formatted: formatDuration(totalSequential)
    },
    phases: phaseEstimates,
    parallelSavings: {
      seconds: parallelSavings,
      formatted: formatDuration(parallelSavings),
      percentage: Math.round((parallelSavings / sequentialTotal) * 100)
    },
    confidence: calculateOverallConfidence(phaseEstimates)
  };
}

/**
 * Calculate confidence score
 */
function calculateConfidence(category, metadata = {}) {
  const config = loadConfig();
  let confidence = 0.6; // Base confidence

  // More samples = higher confidence
  if (metadata.historicalSamples) {
    if (metadata.historicalSamples >= 10) confidence += 0.3;
    else if (metadata.historicalSamples >= 5) confidence += 0.2;
    else if (metadata.historicalSamples >= 3) confidence += 0.1;
  }

  // Known category = higher confidence
  if (config.taskPatterns.categories.includes(category)) {
    confidence += 0.1;
  }

  return Math.min(1.0, confidence);
}

/**
 * Calculate overall confidence for orchestration
 */
function calculateOverallConfidence(phaseEstimates) {
  // Average confidence with penalty for many unknowns
  const avgConfidence = 0.7; // Default
  const unknownPenalty = phaseEstimates.filter(p => p.confidence < 0.5).length * 0.05;
  return Math.max(0.3, avgConfidence - unknownPenalty);
}

/**
 * Format duration as human-readable string
 */
function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;

  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);

  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Update estimation model with actual results
 */
function recordActualTime(taskDescription, actualSeconds, metadata = {}) {
  const category = categorizeTask(taskDescription);
  const agent = metadata.agent;

  // Store for learning
  const key = `${category}_${agent || 'unknown'}`;
  const existing = estimationCache.get(key) || {
    samples: 0,
    totalActual: 0,
    totalEstimated: 0
  };

  existing.samples += 1;
  existing.totalActual += actualSeconds;
  if (metadata.estimatedSeconds) {
    existing.totalEstimated += metadata.estimatedSeconds;
  }

  estimationCache.set(key, existing);

  // Calculate accuracy
  const avgActual = existing.totalActual / existing.samples;
  const avgEstimated = existing.totalEstimated / existing.samples || avgActual;
  const accuracy = 1 - Math.abs(avgEstimated - avgActual) / avgActual;

  return {
    category,
    agent,
    samples: existing.samples,
    avgActual: formatDuration(avgActual),
    accuracy: Math.round(accuracy * 100)
  };
}

/**
 * Get estimation summary for display
 */
function getEstimationSummary(orchestration) {
  const estimate = estimateOrchestration(orchestration.phases || []);

  return `
ESTIMATION:
├─ Total: ${estimate.total.formatted}
├─ Phases: ${estimate.phases.length}
├─ Parallel savings: ${estimate.parallelSavings.formatted} (${estimate.parallelSavings.percentage}%)
└─ Confidence: ${Math.round(estimate.confidence * 100)}%
`.trim();
}

/**
 * Compare estimate vs actual for learning
 */
function compareEstimateVsActual(estimated, actual) {
  const variance = actual - estimated;
  const percentVariance = Math.round((variance / estimated) * 100);

  let accuracy;
  if (Math.abs(percentVariance) <= 10) accuracy = 'excellent';
  else if (Math.abs(percentVariance) <= 25) accuracy = 'good';
  else if (Math.abs(percentVariance) <= 50) accuracy = 'fair';
  else accuracy = 'poor';

  return {
    estimated: formatDuration(estimated),
    actual: formatDuration(actual),
    variance: formatDuration(Math.abs(variance)),
    percentVariance,
    faster: variance < 0,
    accuracy
  };
}

module.exports = {
  categorizeTask,
  calculateComplexity,
  estimateTaskTime,
  estimateOrchestration,
  recordActualTime,
  formatDuration,
  getEstimationSummary,
  compareEstimateVsActual,
  calculateConfidence
};
