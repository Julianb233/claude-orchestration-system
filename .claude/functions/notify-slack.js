/**
 * Bubba's Slack Notification Service
 * Sends real-time updates to Slack with threading support
 */

const fs = require('fs');
const path = require('path');

// Thread tracking for swarm conversations
const swarmThreads = new Map();

/**
 * Load notifications config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/notifications-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

/**
 * Interpolate template variables
 */
function interpolate(template, data) {
  if (typeof template === 'string') {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = data[key];
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return value !== undefined ? value : match;
    });
  }
  if (typeof template === 'object' && template !== null) {
    if (Array.isArray(template)) {
      return template.map(item => interpolate(item, data));
    }
    const result = {};
    for (const [key, value] of Object.entries(template)) {
      result[key] = interpolate(value, data);
    }
    return result;
  }
  return template;
}

/**
 * Get Slack webhook URL
 */
function getSlackWebhookUrl() {
  if (process.env.SLACK_WEBHOOK_URL) {
    return process.env.SLACK_WEBHOOK_URL;
  }
  throw new Error('SLACK_WEBHOOK_URL not set. Search Notion for "Slack webhook URL"');
}

/**
 * Send message to Slack
 * @param {string} eventType - Event type (swarm_started, phase_complete, etc.)
 * @param {object} data - Data to interpolate into template
 * @param {string} swarmId - Swarm ID for thread tracking
 * @returns {Promise<object>} - Slack API response
 */
async function sendSlackNotification(eventType, data, swarmId = null) {
  const config = loadConfig();
  const slackConfig = config.channels.slack;

  if (!slackConfig.enabled) {
    console.log('Slack notifications disabled');
    return null;
  }

  const routing = config.routing[eventType];
  if (!routing || !routing.slack) {
    console.log(`Slack not configured for event: ${eventType}`);
    return null;
  }

  const template = config.templates[eventType]?.slack;
  if (!template) {
    console.log(`No Slack template for event: ${eventType}`);
    return null;
  }

  const webhookUrl = getSlackWebhookUrl();

  // Add dashboard URL to data
  data.dashboard_url = data.dashboard_url || config.channels.dashboard?.url || 'https://bubba.aiacrobatics.com';

  // Handle threading
  if (swarmId && swarmThreads.has(swarmId)) {
    data.swarm_thread_ts = swarmThreads.get(swarmId);
  }

  // Build message payload
  let payload = {
    channel: slackConfig.channel,
    username: slackConfig.username,
    icon_emoji: slackConfig.iconEmoji
  };

  // If template has blocks, use blocks
  if (template.blocks) {
    payload.blocks = interpolate(template.blocks, data);
    payload.text = interpolate(template.text, data); // Fallback text
  } else {
    payload.text = interpolate(template.text, data);
  }

  // Add thread_ts if threading
  if (routing.slack === 'thread' && data.swarm_thread_ts) {
    payload.thread_ts = data.swarm_thread_ts;
  }

  // Send to Slack
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Slack API error: ${response.status} - ${error}`);
  }

  // For new swarm messages, try to get thread_ts from response
  // Note: Incoming webhooks don't return thread_ts, so we track by swarmId
  if (eventType === 'swarm_started' && swarmId) {
    // Store a placeholder - in practice, you'd use the Slack API to get the ts
    swarmThreads.set(swarmId, Date.now().toString());
  }

  return { success: true, eventType, swarmId };
}

/**
 * Send swarm started notification
 */
async function notifySwarmStarted(swarmId, taskName, planSummary, agents, phases) {
  return sendSlackNotification('swarm_started', {
    task_name: taskName,
    plan_summary: planSummary,
    agents: agents,
    agent_count: Array.isArray(agents) ? agents.length : agents,
    phases: phases,
    phase_count: Array.isArray(phases) ? phases.length : phases
  }, swarmId);
}

/**
 * Send phase complete notification (threaded)
 */
async function notifyPhaseComplete(swarmId, phaseNumber, phaseName) {
  return sendSlackNotification('phase_complete', {
    phase_number: phaseNumber,
    phase_name: phaseName
  }, swarmId);
}

/**
 * Send agent progress notification (threaded)
 */
async function notifyAgentProgress(swarmId, agentName, status, task) {
  return sendSlackNotification('agent_progress', {
    agent_name: agentName,
    status: status,
    task: task
  }, swarmId);
}

/**
 * Send blocker notification
 */
async function notifyBlocker(swarmId, taskName, blockerDescription, agentName, dependency) {
  return sendSlackNotification('blocker_hit', {
    task_name: taskName,
    blocker_description: blockerDescription,
    agent_name: agentName,
    dependency: dependency
  }, swarmId);
}

/**
 * Send critical error notification
 */
async function notifyCriticalError(swarmId, errorType, errorMessage, agentName, context) {
  return sendSlackNotification('critical_error', {
    error_type: errorType,
    error_message: errorMessage,
    agent_name: agentName,
    context: context
  }, swarmId);
}

/**
 * Send swarm completed notification
 */
async function notifySwarmCompleted(swarmId, taskName, summary, duration, filesCount, agents) {
  // Clean up thread tracking
  swarmThreads.delete(swarmId);

  return sendSlackNotification('swarm_completed', {
    task_name: taskName,
    summary: summary,
    duration: duration,
    files_count: filesCount,
    agents: agents
  }, swarmId);
}

/**
 * Send quality gate notification
 */
async function notifyQualityGate(swarmId, gateName, passed, failureReason = null) {
  const eventType = passed ? 'quality_gate_passed' : 'quality_gate_failed';
  return sendSlackNotification(eventType, {
    gate_name: gateName,
    failure_reason: failureReason
  }, swarmId);
}

module.exports = {
  sendSlackNotification,
  notifySwarmStarted,
  notifyPhaseComplete,
  notifyAgentProgress,
  notifyBlocker,
  notifyCriticalError,
  notifySwarmCompleted,
  notifyQualityGate,
  loadConfig,
  interpolate
};
