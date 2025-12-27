/**
 * Bubba's SMS Notification Service
 * Sends critical alerts via Twilio SMS
 * Only used for high-priority events (blockers, errors)
 */

const fs = require('fs');
const path = require('path');

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
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value !== undefined ? value : match;
  });
}

/**
 * Get Twilio credentials
 */
function getTwilioCredentials() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.JULIAN_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    throw new Error(
      'Twilio credentials not set. Search Notion for:\n' +
      '- "Twilio Account SID"\n' +
      '- "Twilio Auth Token"\n' +
      '- "Twilio Phone Number"\n' +
      '- "Julian Phone Number"'
    );
  }

  return { accountSid, authToken, fromNumber, toNumber };
}

/**
 * Send SMS via Twilio
 * @param {string} eventType - Event type (blocker_hit, critical_error, etc.)
 * @param {object} data - Data to interpolate into template
 * @returns {Promise<object>} - Twilio API response
 */
async function sendSmsNotification(eventType, data) {
  const config = loadConfig();
  const smsConfig = config.channels.sms;

  if (!smsConfig.enabled) {
    console.log('SMS notifications disabled');
    return null;
  }

  const routing = config.routing[eventType];
  if (!routing || !routing.sms) {
    console.log(`SMS not configured for event: ${eventType}`);
    return null;
  }

  const template = config.templates[eventType]?.sms;
  if (!template) {
    console.log(`No SMS template for event: ${eventType}`);
    return null;
  }

  const { accountSid, authToken, fromNumber, toNumber } = getTwilioCredentials();

  // Build message body (SMS is short, so template should be concise)
  const messageBody = interpolate(template, data);

  // Truncate if too long (SMS limit is 160 chars for single segment)
  const truncatedBody = messageBody.length > 160
    ? messageBody.substring(0, 157) + '...'
    : messageBody;

  // Twilio API endpoint
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  // Build form data
  const formData = new URLSearchParams();
  formData.append('To', toNumber);
  formData.append('From', fromNumber);
  formData.append('Body', truncatedBody);

  // Send via Twilio API
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  return {
    success: true,
    sid: result.sid,
    status: result.status,
    eventType
  };
}

/**
 * Send blocker SMS alert
 */
async function smsBlocker(blockerDescription) {
  return sendSmsNotification('blocker_hit', {
    blocker_description: blockerDescription
  });
}

/**
 * Send critical error SMS alert
 */
async function smsCriticalError(errorType, errorMessage) {
  return sendSmsNotification('critical_error', {
    error_type: errorType,
    error_message: errorMessage
  });
}

/**
 * Send quality gate failed SMS alert
 */
async function smsGateFailed(gateName) {
  return sendSmsNotification('quality_gate_failed', {
    gate_name: gateName
  });
}

/**
 * Send swarm completed SMS (only if explicitly enabled)
 */
async function smsSwarmCompleted(taskName, duration) {
  return sendSmsNotification('swarm_completed', {
    task_name: taskName,
    duration: duration
  });
}

/**
 * Check if SMS should be sent for this event
 * (respects quiet hours if configured)
 */
function shouldSendSms(eventType) {
  const config = loadConfig();
  const quietHours = config.quietHours;

  if (!quietHours?.enabled) {
    return true;
  }

  // Get current time in configured timezone
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: quietHours.timezone
  });
  const currentHour = parseInt(timeString.split(':')[0]);
  const startHour = parseInt(quietHours.start.split(':')[0]);
  const endHour = parseInt(quietHours.end.split(':')[0]);

  const isQuietTime = currentHour >= startHour || currentHour < endHour;

  if (isQuietTime) {
    // During quiet hours, only send critical alerts if allowed
    if (quietHours.allowCritical) {
      const routing = config.routing[eventType];
      return routing?.priority === 'critical';
    }
    return false;
  }

  return true;
}

module.exports = {
  sendSmsNotification,
  smsBlocker,
  smsCriticalError,
  smsGateFailed,
  smsSwarmCompleted,
  shouldSendSms,
  loadConfig
};
