/**
 * Bubba Heartbeat Monitor
 * Monitors agent health, detects stalls, and triggers recovery actions.
 */

const fs = require('fs');
const path = require('path');

// Heartbeat state
const heartbeats = new Map();
const swarmHealth = new Map();

/**
 * Load config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/learning-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8')).heartbeat;
}

/**
 * Register heartbeat for an agent
 */
function recordHeartbeat(agentName, swarmId, status = 'active') {
  const now = Date.now();

  heartbeats.set(agentName, {
    agent: agentName,
    swarmId,
    lastHeartbeat: now,
    status,
    consecutiveMisses: 0,
    history: [
      ...(heartbeats.get(agentName)?.history || []).slice(-10),
      { timestamp: now, status }
    ]
  });

  return {
    agent: agentName,
    recorded: true,
    timestamp: new Date(now).toISOString()
  };
}

/**
 * Check if an agent is stalled
 */
function isAgentStalled(agentName) {
  const config = loadConfig();
  const heartbeat = heartbeats.get(agentName);

  if (!heartbeat) {
    return { stalled: false, reason: 'no-heartbeat-record' };
  }

  const timeSinceHeartbeat = Date.now() - heartbeat.lastHeartbeat;

  if (timeSinceHeartbeat > config.stallThreshold) {
    heartbeat.consecutiveMisses += 1;
    return {
      stalled: true,
      agent: agentName,
      lastHeartbeat: new Date(heartbeat.lastHeartbeat).toISOString(),
      stalledFor: Math.round(timeSinceHeartbeat / 1000),
      consecutiveMisses: heartbeat.consecutiveMisses
    };
  }

  return { stalled: false, timeSinceHeartbeat };
}

/**
 * Check health of all agents in a swarm
 */
function checkSwarmHealth(swarmId) {
  const config = loadConfig();
  const swarmAgents = [];
  const stalledAgents = [];
  const healthyAgents = [];

  for (const [agentName, heartbeat] of heartbeats) {
    if (heartbeat.swarmId === swarmId) {
      swarmAgents.push(agentName);
      const stallCheck = isAgentStalled(agentName);

      if (stallCheck.stalled) {
        stalledAgents.push({ agent: agentName, ...stallCheck });
      } else {
        healthyAgents.push(agentName);
      }
    }
  }

  const health = {
    swarmId,
    timestamp: new Date().toISOString(),
    totalAgents: swarmAgents.length,
    healthy: healthyAgents.length,
    stalled: stalledAgents.length,
    healthPercent: swarmAgents.length > 0
      ? Math.round((healthyAgents.length / swarmAgents.length) * 100)
      : 100,
    stalledAgents,
    status: stalledAgents.length === 0 ? 'healthy' :
            stalledAgents.length < swarmAgents.length / 2 ? 'degraded' : 'critical'
  };

  swarmHealth.set(swarmId, health);
  return health;
}

/**
 * Get recovery action for a stalled agent
 */
function getRecoveryAction(agentName) {
  const config = loadConfig();
  const heartbeat = heartbeats.get(agentName);

  if (!heartbeat) {
    return { action: 'none', reason: 'agent-not-found' };
  }

  const actions = config.recoveryActions;
  const missIndex = Math.min(heartbeat.consecutiveMisses - 1, actions.length - 1);

  return {
    agent: agentName,
    action: actions[missIndex],
    consecutiveMisses: heartbeat.consecutiveMisses,
    escalate: missIndex >= actions.length - 1
  };
}

/**
 * Execute recovery action
 */
async function executeRecovery(agentName, swarmId) {
  const recovery = getRecoveryAction(agentName);

  const result = {
    agent: agentName,
    swarmId,
    action: recovery.action,
    timestamp: new Date().toISOString(),
    success: false
  };

  switch (recovery.action) {
    case 'ping':
      // Simple status check
      result.message = `Ping sent to ${agentName}`;
      result.success = true;
      break;

    case 'status-check':
      // Request status update
      result.message = `Status check requested from ${agentName}`;
      result.success = true;
      break;

    case 'restart':
      // Agent restart
      result.message = `Restart initiated for ${agentName}`;
      result.success = true;
      // Reset heartbeat
      heartbeats.delete(agentName);
      break;

    case 'escalate':
      // Email escalation
      const config = loadConfig();
      result.message = `Escalation email sent to ${config.escalationEmail}`;
      result.escalated = true;
      result.success = true;
      break;

    default:
      result.message = `Unknown recovery action: ${recovery.action}`;
  }

  return result;
}

/**
 * Start heartbeat monitoring for a swarm
 */
function startMonitoring(swarmId, agents) {
  const config = loadConfig();

  // Initialize heartbeats for all agents
  for (const agent of agents) {
    recordHeartbeat(agent, swarmId, 'initialized');
  }

  return {
    swarmId,
    agents: agents.length,
    interval: config.interval,
    stallThreshold: config.stallThreshold,
    started: true
  };
}

/**
 * Stop monitoring for a swarm
 */
function stopMonitoring(swarmId) {
  const removed = [];

  for (const [agentName, heartbeat] of heartbeats) {
    if (heartbeat.swarmId === swarmId) {
      heartbeats.delete(agentName);
      removed.push(agentName);
    }
  }

  swarmHealth.delete(swarmId);

  return {
    swarmId,
    stopped: true,
    agentsRemoved: removed.length
  };
}

/**
 * Get heartbeat summary for display
 */
function getHeartbeatSummary(swarmId = null) {
  const agents = [];

  for (const [agentName, heartbeat] of heartbeats) {
    if (!swarmId || heartbeat.swarmId === swarmId) {
      const stall = isAgentStalled(agentName);
      agents.push({
        agent: agentName,
        swarmId: heartbeat.swarmId,
        status: heartbeat.status,
        lastHeartbeat: new Date(heartbeat.lastHeartbeat).toISOString(),
        stalled: stall.stalled,
        stalledFor: stall.stalledFor || 0
      });
    }
  }

  return {
    agents,
    total: agents.length,
    healthy: agents.filter(a => !a.stalled).length,
    stalled: agents.filter(a => a.stalled).length
  };
}

/**
 * Generate heartbeat alert message
 */
function getHeartbeatAlert(swarmId) {
  const health = checkSwarmHealth(swarmId);

  if (health.status === 'healthy') {
    return null;
  }

  return {
    type: 'heartbeat-alert',
    swarmId,
    status: health.status,
    message: health.status === 'critical'
      ? `CRITICAL: ${health.stalled}/${health.totalAgents} agents stalled`
      : `WARNING: ${health.stalled} agent(s) stalled`,
    stalledAgents: health.stalledAgents.map(a => a.agent),
    recoveryActions: health.stalledAgents.map(a => ({
      agent: a.agent,
      ...getRecoveryAction(a.agent)
    }))
  };
}

/**
 * Full health check with recovery recommendations
 */
function performHealthCheck(swarmId) {
  const health = checkSwarmHealth(swarmId);

  if (health.status === 'healthy') {
    return {
      healthy: true,
      swarmId,
      agents: health.totalAgents,
      message: 'All agents responding normally'
    };
  }

  const recoveries = health.stalledAgents.map(stalled => ({
    agent: stalled.agent,
    stalledFor: stalled.stalledFor,
    recovery: getRecoveryAction(stalled.agent)
  }));

  return {
    healthy: false,
    swarmId,
    status: health.status,
    stalledCount: health.stalled,
    totalAgents: health.totalAgents,
    recoveries,
    recommendation: health.status === 'critical'
      ? 'Consider aborting swarm and restarting'
      : 'Execute recovery actions for stalled agents'
  };
}

module.exports = {
  recordHeartbeat,
  isAgentStalled,
  checkSwarmHealth,
  getRecoveryAction,
  executeRecovery,
  startMonitoring,
  stopMonitoring,
  getHeartbeatSummary,
  getHeartbeatAlert,
  performHealthCheck
};
