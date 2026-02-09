/**
 * Bubba's Email Notification Service
 * Uses Mailgun API to send status updates to julian@aiacrobatics.com
 *
 * Usage:
 *   const { sendBubbaEmail } = require('./send-email');
 *   await sendBubbaEmail('swarm_started', { task_name: 'Build dashboard', ... });
 */

const fs = require('fs');
const path = require('path');

// Load email configuration
function loadConfig() {
  const configPath = path.join(__dirname, '../config/email-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Interpolate template variables
function interpolate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];
    if (Array.isArray(value)) {
      return value.map(item => `  - ${item}`).join('\n');
    }
    return value || match;
  });
}

// Get Mailgun API key from environment or Notion
async function getMailgunApiKey() {
  // First check environment
  if (process.env.MAILGUN_API_KEY) {
    return process.env.MAILGUN_API_KEY;
  }

  // Fallback: retrieve from Notion (done by caller via MCP)
  throw new Error('MAILGUN_API_KEY not set. Search Notion for "Mailgun API key"');
}

/**
 * Send email via Mailgun
 * @param {string} template - Template name (swarm_started, swarm_completed, critical_error, blocker, progress_update)
 * @param {object} data - Data to interpolate into template
 * @returns {Promise<object>} - Mailgun API response
 */
async function sendBubbaEmail(template, data) {
  const config = loadConfig();
  const apiKey = await getMailgunApiKey();
  const domain = config.domain || 'aiacrobatics.com';

  const templateConfig = config.templates[template];
  if (!templateConfig) {
    throw new Error(`Unknown email template: ${template}`);
  }

  const subject = interpolate(templateConfig.subject, data);
  const body = interpolate(templateConfig.body, data);

  // Build form data for Mailgun API
  const formData = new URLSearchParams();
  formData.append('from', `${config.senderName} <${config.sender}>`);
  formData.append('to', config.defaultRecipient);
  formData.append('subject', subject);
  formData.append('text', body);

  // Send via Mailgun API
  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mailgun API error: ${response.status} - ${error}`);
  }

  return await response.json();
}

/**
 * Send swarm started notification
 */
async function notifySwarmStarted(taskName, planSummary, agents, phases) {
  return sendBubbaEmail('swarm_started', {
    task_name: taskName,
    plan_summary: planSummary,
    agents: agents,
    phases: phases
  });
}

/**
 * Send swarm completed notification
 */
async function notifySwarmCompleted(taskName, summary, duration, files, agents) {
  return sendBubbaEmail('swarm_completed', {
    task_name: taskName,
    summary: summary,
    duration: duration,
    files: files,
    agents: agents
  });
}

/**
 * Send critical error notification
 */
async function notifyCriticalError(errorType, errorMessage, agent, context, recoveryOptions) {
  return sendBubbaEmail('critical_error', {
    error_type: errorType,
    error_message: errorMessage,
    agent: agent,
    context: context,
    recovery_options: recoveryOptions
  });
}

/**
 * Send blocker notification
 */
async function notifyBlocker(taskName, blockerDescription, dependency, affectedAgents) {
  return sendBubbaEmail('blocker', {
    task_name: taskName,
    blocker_description: blockerDescription,
    dependency: dependency,
    affected_agents: affectedAgents
  });
}

/**
 * Send progress update notification
 */
async function notifyProgress(taskName, completed, inProgress, nextUp) {
  return sendBubbaEmail('progress_update', {
    task_name: taskName,
    completed: completed,
    in_progress: inProgress,
    next_up: nextUp
  });
}

module.exports = {
  sendBubbaEmail,
  notifySwarmStarted,
  notifySwarmCompleted,
  notifyCriticalError,
  notifyBlocker,
  notifyProgress,
  loadConfig,
  interpolate
};
