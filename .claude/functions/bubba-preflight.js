/**
 * Bubba Preflight Checker
 * Proactively detects potential blockers before spawning agents.
 * Runs checks based on task type and project configuration.
 */

const fs = require('fs');
const path = require('path');

/**
 * Load config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/learning-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8')).proactiveBlockerDetection;
}

/**
 * Run all preflight checks for a task
 */
async function runPreflightChecks(projectPath, taskDescription, options = {}) {
  const config = loadConfig();
  const results = {
    passed: true,
    checks: [],
    warnings: [],
    blockers: [],
    recommendations: []
  };

  for (const check of config.preflightChecks) {
    const checkResult = await runCheck(check, projectPath, taskDescription, options);
    results.checks.push(checkResult);

    if (checkResult.status === 'failed') {
      results.passed = false;
      results.blockers.push(checkResult);
    } else if (checkResult.status === 'warning') {
      results.warnings.push(checkResult);
    }

    if (checkResult.recommendation) {
      results.recommendations.push(checkResult.recommendation);
    }
  }

  return results;
}

/**
 * Run individual check
 */
async function runCheck(checkType, projectPath, taskDescription, options) {
  const checkFunctions = {
    dependencies: checkDependencies,
    environment: checkEnvironment,
    permissions: checkPermissions,
    diskSpace: checkDiskSpace,
    networkConnectivity: checkNetworkConnectivity,
    apiCredentials: checkApiCredentials
  };

  const checkFn = checkFunctions[checkType];
  if (!checkFn) {
    return { check: checkType, status: 'skipped', reason: 'unknown-check' };
  }

  try {
    return await checkFn(projectPath, taskDescription, options);
  } catch (error) {
    return {
      check: checkType,
      status: 'error',
      error: error.message
    };
  }
}

/**
 * Check dependencies
 */
async function checkDependencies(projectPath) {
  const result = {
    check: 'dependencies',
    status: 'passed',
    details: []
  };

  // Check for package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const nodeModulesPath = path.join(projectPath, 'node_modules');

    if (!fs.existsSync(nodeModulesPath)) {
      result.status = 'failed';
      result.details.push('node_modules not found');
      result.recommendation = {
        action: 'npm install',
        command: `cd ${projectPath} && npm install`,
        reason: 'Dependencies not installed'
      };
    } else {
      // Check for lock file freshness (simplified check)
      const lockPath = path.join(projectPath, 'package-lock.json');
      const pnpmLockPath = path.join(projectPath, 'pnpm-lock.yaml');

      if (!fs.existsSync(lockPath) && !fs.existsSync(pnpmLockPath)) {
        result.status = 'warning';
        result.details.push('No lock file found');
      }
    }
  }

  // Check for requirements.txt (Python)
  const requirementsPath = path.join(projectPath, 'requirements.txt');
  if (fs.existsSync(requirementsPath)) {
    const venvPath = path.join(projectPath, 'venv');
    if (!fs.existsSync(venvPath)) {
      result.status = 'warning';
      result.details.push('Python venv not found');
      result.recommendation = {
        action: 'create venv',
        command: `cd ${projectPath} && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`,
        reason: 'Python virtual environment not set up'
      };
    }
  }

  return result;
}

/**
 * Check environment variables
 */
async function checkEnvironment(projectPath) {
  const result = {
    check: 'environment',
    status: 'passed',
    details: []
  };

  // Check for .env file
  const envPath = path.join(projectPath, '.env');
  const envExamplePath = path.join(projectPath, '.env.example');

  if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
    result.status = 'failed';
    result.details.push('.env file missing but .env.example exists');
    result.recommendation = {
      action: 'create .env',
      command: `cp ${envExamplePath} ${envPath}`,
      reason: 'Environment configuration needed'
    };
  }

  if (fs.existsSync(envPath)) {
    // Check for common required vars
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = ['DATABASE_URL', 'API_KEY', 'SECRET'];
    const missingVars = [];

    for (const varName of requiredVars) {
      if (envContent.includes(`${varName}=`) && envContent.includes(`${varName}=""`)) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length > 0) {
      result.status = 'warning';
      result.details.push(`Possibly empty env vars: ${missingVars.join(', ')}`);
    }
  }

  return result;
}

/**
 * Check file permissions
 */
async function checkPermissions(projectPath) {
  const result = {
    check: 'permissions',
    status: 'passed',
    details: []
  };

  try {
    // Check if we can write to the project directory
    const testFile = path.join(projectPath, '.write-test-' + Date.now());
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
  } catch (error) {
    result.status = 'failed';
    result.details.push('Cannot write to project directory');
    result.recommendation = {
      action: 'fix permissions',
      command: `chmod -R u+w ${projectPath}`,
      reason: 'Write permissions needed'
    };
  }

  // Check for git
  const gitPath = path.join(projectPath, '.git');
  if (fs.existsSync(gitPath)) {
    try {
      const hooksPath = path.join(gitPath, 'hooks');
      if (fs.existsSync(hooksPath)) {
        // Check if hooks are executable
        const hooks = fs.readdirSync(hooksPath).filter(f => !f.includes('.sample'));
        for (const hook of hooks) {
          const hookPath = path.join(hooksPath, hook);
          try {
            fs.accessSync(hookPath, fs.constants.X_OK);
          } catch {
            result.status = 'warning';
            result.details.push(`Git hook not executable: ${hook}`);
          }
        }
      }
    } catch {
      // Git hooks check failed, non-critical
    }
  }

  return result;
}

/**
 * Check disk space
 */
async function checkDiskSpace(projectPath) {
  const result = {
    check: 'diskSpace',
    status: 'passed',
    details: []
  };

  // Simplified check - just verify we can write
  try {
    const testData = Buffer.alloc(1024 * 1024); // 1MB test
    const testFile = path.join(projectPath, '.space-test-' + Date.now());
    fs.writeFileSync(testFile, testData);
    fs.unlinkSync(testFile);
    result.details.push('Disk space check passed');
  } catch (error) {
    if (error.code === 'ENOSPC') {
      result.status = 'failed';
      result.details.push('Disk space low');
      result.recommendation = {
        action: 'free disk space',
        reason: 'Insufficient disk space for operations'
      };
    }
  }

  return result;
}

/**
 * Check network connectivity
 */
async function checkNetworkConnectivity(projectPath, taskDescription) {
  const result = {
    check: 'networkConnectivity',
    status: 'passed',
    details: []
  };

  // Check if task requires external APIs
  const networkTasks = ['deploy', 'push', 'publish', 'fetch', 'api', 'webhook'];
  const needsNetwork = networkTasks.some(t => taskDescription.toLowerCase().includes(t));

  if (needsNetwork) {
    // Simple connectivity check would go here
    // For now, just note that network is required
    result.details.push('Task requires network connectivity');
  }

  return result;
}

/**
 * Check API credentials
 */
async function checkApiCredentials(projectPath, taskDescription, options) {
  const result = {
    check: 'apiCredentials',
    status: 'passed',
    details: []
  };

  // Check for common credential requirements based on task
  const credentialPatterns = {
    'github': ['GITHUB_TOKEN', 'GH_TOKEN'],
    'vercel': ['VERCEL_TOKEN'],
    'notion': ['NOTION_API_KEY'],
    'mailgun': ['MAILGUN_API_KEY'],
    'openai': ['OPENAI_API_KEY'],
    'anthropic': ['ANTHROPIC_API_KEY']
  };

  const envPath = path.join(projectPath, '.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Also check environment
  const desc = taskDescription.toLowerCase();

  for (const [service, vars] of Object.entries(credentialPatterns)) {
    if (desc.includes(service)) {
      const hasCredential = vars.some(v =>
        envContent.includes(v) || process.env[v]
      );

      if (!hasCredential) {
        result.status = 'warning';
        result.details.push(`May need ${service} credentials`);
        result.recommendation = {
          action: 'add credentials',
          reason: `${service} API key may be required for this task`
        };
      }
    }
  }

  return result;
}

/**
 * Get preflight summary for display
 */
function getPreflightSummary(results) {
  const passed = results.checks.filter(c => c.status === 'passed').length;
  const failed = results.blockers.length;
  const warnings = results.warnings.length;

  let summary = `PREFLIGHT CHECK: `;

  if (results.passed) {
    summary += `PASSED (${passed}/${results.checks.length})`;
    if (warnings > 0) {
      summary += ` with ${warnings} warning(s)`;
    }
  } else {
    summary += `BLOCKED (${failed} blocker(s))`;
  }

  if (results.recommendations.length > 0) {
    summary += `\n\nRECOMMENDED ACTIONS:`;
    for (const rec of results.recommendations) {
      summary += `\n- ${rec.action}: ${rec.reason}`;
      if (rec.command) {
        summary += `\n  Command: ${rec.command}`;
      }
    }
  }

  return summary;
}

/**
 * Auto-fix common blockers
 */
async function autoFix(blocker, projectPath) {
  const config = loadConfig();
  const fixes = config.commonBlockers;

  const fixCommands = [];

  switch (blocker.check) {
    case 'dependencies':
      if (blocker.recommendation?.command) {
        fixCommands.push(blocker.recommendation.command);
      }
      break;

    case 'environment':
      if (blocker.recommendation?.command) {
        fixCommands.push(blocker.recommendation.command);
      }
      break;

    case 'permissions':
      if (blocker.recommendation?.command) {
        fixCommands.push(blocker.recommendation.command);
      }
      break;

    default:
      return { fixed: false, reason: 'no-auto-fix-available' };
  }

  return {
    fixed: fixCommands.length > 0,
    commands: fixCommands,
    blocker: blocker.check
  };
}

module.exports = {
  runPreflightChecks,
  runCheck,
  checkDependencies,
  checkEnvironment,
  checkPermissions,
  checkDiskSpace,
  checkNetworkConnectivity,
  checkApiCredentials,
  getPreflightSummary,
  autoFix
};
