/**
 * Bubba Circuit Breaker System
 * Prevents cascading failures by tracking agent reliability
 * and automatically failing fast when agents are unreliable.
 */

const fs = require('fs');
const path = require('path');

// Circuit states
const STATES = {
  CLOSED: 'closed',      // Normal operation
  OPEN: 'open',          // Failing fast, not calling agent
  HALF_OPEN: 'half-open' // Testing if agent recovered
};

// In-memory circuit state (synced with Claude Flow)
const circuits = new Map();

/**
 * Load config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/learning-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8')).circuitBreaker;
}

/**
 * Get or create circuit for an agent
 */
function getCircuit(agentName) {
  if (!circuits.has(agentName)) {
    circuits.set(agentName, {
      agent: agentName,
      state: STATES.CLOSED,
      failures: 0,
      successes: 0,
      lastFailure: null,
      lastSuccess: null,
      openedAt: null,
      halfOpenAt: null
    });
  }
  return circuits.get(agentName);
}

/**
 * Check if agent can be called
 * @returns {object} { allowed: boolean, reason: string }
 */
function canCallAgent(agentName) {
  const config = loadConfig();
  const circuit = getCircuit(agentName);

  switch (circuit.state) {
    case STATES.CLOSED:
      return { allowed: true, reason: 'circuit-closed' };

    case STATES.OPEN:
      // Check if timeout has passed
      const timeSinceOpen = Date.now() - circuit.openedAt;
      if (timeSinceOpen >= config.timeout) {
        // Transition to half-open
        circuit.state = STATES.HALF_OPEN;
        circuit.halfOpenAt = Date.now();
        return { allowed: true, reason: 'circuit-half-open-testing' };
      }
      return {
        allowed: false,
        reason: `circuit-open (${Math.round((config.timeout - timeSinceOpen) / 1000)}s until retry)`
      };

    case STATES.HALF_OPEN:
      // Only allow limited requests in half-open state
      const recentSuccesses = circuit.successes;
      if (recentSuccesses < config.halfOpenRequests) {
        return { allowed: true, reason: 'circuit-half-open-limited' };
      }
      return { allowed: false, reason: 'circuit-half-open-limit-reached' };

    default:
      return { allowed: true, reason: 'unknown-state' };
  }
}

/**
 * Record successful call
 */
function recordSuccess(agentName) {
  const config = loadConfig();
  const circuit = getCircuit(agentName);

  circuit.successes += 1;
  circuit.lastSuccess = Date.now();

  if (circuit.state === STATES.HALF_OPEN) {
    if (circuit.successes >= config.successThreshold) {
      // Fully recovered, close circuit
      circuit.state = STATES.CLOSED;
      circuit.failures = 0;
      circuit.openedAt = null;
      circuit.halfOpenAt = null;
      return { recovered: true, newState: STATES.CLOSED };
    }
  }

  return { recovered: false, newState: circuit.state };
}

/**
 * Record failed call
 */
function recordFailure(agentName, error = null) {
  const config = loadConfig();
  const circuit = getCircuit(agentName);

  circuit.failures += 1;
  circuit.lastFailure = Date.now();
  circuit.lastError = error;

  if (circuit.state === STATES.HALF_OPEN) {
    // Immediate trip back to open
    circuit.state = STATES.OPEN;
    circuit.openedAt = Date.now();
    circuit.successes = 0;
    return { tripped: true, newState: STATES.OPEN };
  }

  if (circuit.state === STATES.CLOSED && circuit.failures >= config.failureThreshold) {
    // Trip the circuit
    circuit.state = STATES.OPEN;
    circuit.openedAt = Date.now();
    return { tripped: true, newState: STATES.OPEN };
  }

  return { tripped: false, newState: circuit.state };
}

/**
 * Force reset a circuit (manual recovery)
 */
function resetCircuit(agentName) {
  const circuit = getCircuit(agentName);
  circuit.state = STATES.CLOSED;
  circuit.failures = 0;
  circuit.successes = 0;
  circuit.openedAt = null;
  circuit.halfOpenAt = null;
  return { reset: true, agent: agentName };
}

/**
 * Get all circuit states
 */
function getAllCircuitStates() {
  const states = {};
  for (const [agent, circuit] of circuits) {
    states[agent] = {
      state: circuit.state,
      failures: circuit.failures,
      lastFailure: circuit.lastFailure,
      lastSuccess: circuit.lastSuccess
    };
  }
  return states;
}

/**
 * Get agents that are currently available (not open)
 */
function getAvailableAgents(agentList) {
  return agentList.filter(agent => {
    const result = canCallAgent(agent);
    return result.allowed;
  });
}

/**
 * Calculate retry delay with exponential backoff
 */
function getRetryDelay(agentName, attempt) {
  const config = loadConfig();
  const baseDelay = config.baseDelay || 1000;
  return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30s
}

/**
 * Execute with circuit breaker protection
 * @param {string} agentName - Agent to call
 * @param {function} operation - Async function to execute
 * @param {object} options - Optional retry settings
 */
async function executeWithCircuitBreaker(agentName, operation, options = {}) {
  const config = loadConfig();
  const maxRetries = options.maxRetries || config.maxRetries;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const canCall = canCallAgent(agentName);

    if (!canCall.allowed) {
      throw new Error(`Circuit breaker open for ${agentName}: ${canCall.reason}`);
    }

    try {
      const result = await operation();
      recordSuccess(agentName);
      return result;
    } catch (error) {
      const failResult = recordFailure(agentName, error.message);

      if (failResult.tripped) {
        throw new Error(`Circuit breaker tripped for ${agentName}: ${error.message}`);
      }

      if (attempt < maxRetries) {
        const delay = getRetryDelay(agentName, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

/**
 * Get fallback agent if primary is unavailable
 */
function getFallbackAgent(primaryAgent, fallbackList) {
  const canCall = canCallAgent(primaryAgent);

  if (canCall.allowed) {
    return { agent: primaryAgent, isFallback: false };
  }

  for (const fallback of fallbackList) {
    const fallbackCanCall = canCallAgent(fallback);
    if (fallbackCanCall.allowed) {
      return { agent: fallback, isFallback: true, reason: canCall.reason };
    }
  }

  return { agent: null, isFallback: false, reason: 'all-agents-unavailable' };
}

module.exports = {
  STATES,
  canCallAgent,
  recordSuccess,
  recordFailure,
  resetCircuit,
  getAllCircuitStates,
  getAvailableAgents,
  getRetryDelay,
  executeWithCircuitBreaker,
  getFallbackAgent,
  getCircuit
};
