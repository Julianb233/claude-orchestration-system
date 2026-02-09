/**
 * Bubba's Quality Gates System
 * Automatic checkpoints, validation gates, and rollback capability
 */

const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

/**
 * Load gates config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/gates-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// ============================================
// CHECKPOINTS
// ============================================

/**
 * Create a git checkpoint before a phase
 * @param {string} swarmId - Swarm identifier
 * @param {string} phaseName - Phase name
 * @param {string} projectPath - Project directory path
 */
async function createCheckpoint(swarmId, phaseName, projectPath) {
  const config = loadConfig();
  if (!config.checkpoints.enabled) return null;

  const checkpointName = `${config.checkpoints.prefix}-${swarmId}-${phaseName}-${Date.now()}`;

  try {
    // Stash any uncommitted changes
    execSync('git stash --include-untracked', {
      cwd: projectPath,
      stdio: 'pipe'
    });

    // Create a checkpoint tag
    execSync(`git tag ${checkpointName}`, {
      cwd: projectPath,
      stdio: 'pipe'
    });

    // Pop the stash
    try {
      execSync('git stash pop', { cwd: projectPath, stdio: 'pipe' });
    } catch (e) {
      // No stash to pop, that's fine
    }

    return {
      success: true,
      checkpointName,
      timestamp: new Date().toISOString(),
      swarmId,
      phaseName
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List available checkpoints
 */
function listCheckpoints(swarmId, projectPath) {
  const config = loadConfig();

  try {
    const tags = execSync(`git tag -l "${config.checkpoints.prefix}-${swarmId}*"`, {
      cwd: projectPath,
      encoding: 'utf8'
    });

    return tags.trim().split('\n').filter(Boolean).map(tag => ({
      name: tag,
      swarmId,
      phase: tag.split('-')[3],
      timestamp: parseInt(tag.split('-')[4])
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Rollback to a checkpoint
 */
async function rollbackToCheckpoint(checkpointName, projectPath, options = {}) {
  const config = loadConfig();

  if (!config.rollback.enabled) {
    return { success: false, error: 'Rollback is disabled' };
  }

  try {
    // Preserve logs if configured
    if (config.rollback.preserveLogs) {
      const logsDir = path.join(projectPath, '.bubba-logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      // Save current state info
      const stateInfo = {
        timestamp: new Date().toISOString(),
        rollbackTo: checkpointName,
        reason: options.reason || 'Manual rollback'
      };
      fs.writeFileSync(
        path.join(logsDir, `rollback-${Date.now()}.json`),
        JSON.stringify(stateInfo, null, 2)
      );
    }

    // Hard reset to checkpoint
    execSync(`git reset --hard ${checkpointName}`, {
      cwd: projectPath,
      stdio: 'pipe'
    });

    return {
      success: true,
      rolledBackTo: checkpointName,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Cleanup old checkpoints
 */
async function cleanupCheckpoints(swarmId, projectPath) {
  const config = loadConfig();
  if (!config.checkpoints.autoCleanup) return;

  const checkpoints = listCheckpoints(swarmId, projectPath);
  const cutoff = Date.now() - config.checkpoints.cleanupAfter;

  for (const cp of checkpoints) {
    if (cp.timestamp < cutoff) {
      try {
        execSync(`git tag -d ${cp.name}`, { cwd: projectPath, stdio: 'pipe' });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}

// ============================================
// QUALITY GATES
// ============================================

/**
 * Run a specific quality gate
 * @param {string} gateName - Gate identifier
 * @param {string} projectPath - Project directory path
 */
async function runGate(gateName, projectPath) {
  const config = loadConfig();
  const gate = config.gates[gateName];

  if (!gate) {
    return { success: false, error: `Unknown gate: ${gateName}` };
  }

  if (!gate.enabled) {
    return { success: true, skipped: true, reason: 'Gate disabled' };
  }

  const results = {
    gate: gateName,
    name: gate.name,
    checks: [],
    passed: true,
    timestamp: new Date().toISOString()
  };

  // Run each check
  for (const checkName of gate.checks) {
    const checkResult = await runCheck(checkName, projectPath);
    results.checks.push(checkResult);

    if (!checkResult.passed && !checkResult.optional) {
      results.passed = false;

      // Handle failure based on gate config
      if (gate.onFailure === 'abort') {
        results.action = 'abort';
        break;
      }
    }
  }

  return results;
}

/**
 * Run a specific check
 */
async function runCheck(checkName, projectPath) {
  const config = loadConfig();
  const check = config.checks[checkName];

  if (!check) {
    return {
      check: checkName,
      passed: false,
      error: `Unknown check: ${checkName}`
    };
  }

  // Handle manual checks
  if (check.manual) {
    return {
      check: checkName,
      description: check.description,
      manual: true,
      passed: null, // Requires manual verification
      message: 'Requires manual verification'
    };
  }

  const timeout = check.timeout || config.thresholds.gateTimeout;
  const retries = config.thresholds.checkRetries;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const output = execSync(check.command, {
        cwd: projectPath,
        timeout,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      // Check expected output if specified
      if (check.expected !== undefined) {
        const trimmedOutput = output.trim();
        if (trimmedOutput !== check.expected) {
          return {
            check: checkName,
            description: check.description,
            passed: false,
            expected: check.expected,
            actual: trimmedOutput,
            optional: check.optional || false
          };
        }
      }

      return {
        check: checkName,
        description: check.description,
        passed: true,
        output: output.substring(0, 500), // Truncate long output
        optional: check.optional || false
      };
    } catch (error) {
      if (attempt < retries) {
        // Wait before retry
        await new Promise(r => setTimeout(r, config.thresholds.retryDelay));
        continue;
      }

      return {
        check: checkName,
        description: check.description,
        passed: false,
        error: error.message,
        stderr: error.stderr?.substring(0, 500),
        optional: check.optional || false
      };
    }
  }
}

/**
 * Run pre-flight checks
 */
async function runPreflightChecks(projectPath) {
  return runGate('preflight', projectPath);
}

/**
 * Run all gates for a phase
 */
async function runPhaseGates(phase, projectPath) {
  const gateMapping = {
    'api': 'post_api',
    'frontend': 'post_frontend',
    'review': 'pre_review',
    'deploy': 'pre_deploy'
  };

  const gateName = gateMapping[phase];
  if (!gateName) {
    return { success: true, message: `No gates configured for phase: ${phase}` };
  }

  return runGate(gateName, projectPath);
}

// ============================================
// GATE ORCHESTRATION
// ============================================

/**
 * Full gate check with checkpoint and rollback support
 */
async function runGateWithCheckpoint(gateName, swarmId, projectPath, options = {}) {
  // Create checkpoint before gate
  const checkpoint = await createCheckpoint(swarmId, `pre-${gateName}`, projectPath);

  // Run the gate
  const gateResult = await runGate(gateName, projectPath);

  if (!gateResult.passed) {
    // Gate failed
    if (options.autoRollback && checkpoint.success) {
      const rollback = await rollbackToCheckpoint(checkpoint.checkpointName, projectPath, {
        reason: `Gate ${gateName} failed`
      });
      gateResult.rolledBack = rollback.success;
      gateResult.rollbackCheckpoint = checkpoint.checkpointName;
    }
  }

  return gateResult;
}

/**
 * Get gate status summary
 */
function getGateStatus(gateResults) {
  const summary = {
    total: gateResults.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    manual: 0
  };

  for (const result of gateResults) {
    if (result.skipped) {
      summary.skipped++;
    } else if (result.passed === null) {
      summary.manual++;
    } else if (result.passed) {
      summary.passed++;
    } else {
      summary.failed++;
    }
  }

  summary.allPassed = summary.failed === 0 && summary.manual === 0;
  return summary;
}

module.exports = {
  // Checkpoints
  createCheckpoint,
  listCheckpoints,
  rollbackToCheckpoint,
  cleanupCheckpoints,

  // Gates
  runGate,
  runCheck,
  runPreflightChecks,
  runPhaseGates,
  runGateWithCheckpoint,
  getGateStatus,

  // Config
  loadConfig
};
