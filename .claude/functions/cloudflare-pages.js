/**
 * Cloudflare Pages Management
 * Deploy static sites and manage Pages projects
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Load Cloudflare config
 */
function loadConfig() {
  const configPath = path.join(__dirname, '../config/cloudflare-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

/**
 * Get API headers
 */
function getHeaders(apiToken) {
  return {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
  };
}

// ============================================
// PAGES PROJECT MANAGEMENT
// ============================================

/**
 * Create a new Pages project
 * @param {string} projectName - Unique project name
 * @param {object} options - Project options
 */
async function createPagesProject(projectName, options = {}) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || config.pages.accountId;

  const projectConfig = {
    name: projectName,
    production_branch: options.branch || config.pages.defaultBranch,
    build_config: options.buildConfig || {
      build_command: config.pages.buildSettings.buildCommand,
      destination_dir: config.pages.buildSettings.outputDirectory
    }
  };

  // Add GitHub source if provided
  if (options.repoOwner && options.repoName) {
    projectConfig.source = {
      type: 'github',
      config: {
        owner: options.repoOwner,
        repo_name: options.repoName,
        production_branch: options.branch || 'main',
        pr_comments_enabled: true,
        deployments_enabled: true
      }
    };
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
      {
        method: 'POST',
        headers: getHeaders(apiToken),
        body: JSON.stringify(projectConfig)
      }
    );

    const data = await response.json();

    if (!data.success) {
      return { success: false, errors: data.errors };
    }

    return {
      success: true,
      project: data.result,
      url: `https://${projectName}.pages.dev`,
      deployHook: data.result.deployment_configs?.production?.deploy_hook_url
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * List all Pages projects
 */
async function listPagesProjects() {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || config.pages.accountId;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
      {
        method: 'GET',
        headers: getHeaders(apiToken)
      }
    );

    const data = await response.json();

    if (!data.success) {
      return { success: false, errors: data.errors };
    }

    return {
      success: true,
      projects: data.result.map(p => ({
        name: p.name,
        url: `https://${p.subdomain}.pages.dev`,
        productionBranch: p.production_branch,
        createdAt: p.created_on,
        latestDeployment: p.latest_deployment
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get Pages project details
 */
async function getPagesProject(projectName) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || config.pages.accountId;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      {
        method: 'GET',
        headers: getHeaders(apiToken)
      }
    );

    const data = await response.json();

    if (!data.success) {
      return { success: false, errors: data.errors };
    }

    return {
      success: true,
      project: data.result
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a Pages project
 */
async function deletePagesProject(projectName) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || config.pages.accountId;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      {
        method: 'DELETE',
        headers: getHeaders(apiToken)
      }
    );

    const data = await response.json();

    if (!data.success) {
      return { success: false, errors: data.errors };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// DEPLOYMENT
// ============================================

/**
 * Deploy to Pages using Wrangler CLI
 * @param {string} projectName - Pages project name
 * @param {string} directory - Directory to deploy
 * @param {object} options - Deployment options
 */
async function deployToPages(projectName, directory, options = {}) {
  const branch = options.branch || 'main';
  const commitMessage = options.message || `Deploy from Claude at ${new Date().toISOString()}`;

  try {
    // Build command
    const wranglerCmd = [
      'npx wrangler pages deploy',
      `"${directory}"`,
      `--project-name="${projectName}"`,
      `--branch="${branch}"`,
      `--commit-message="${commitMessage}"`
    ];

    if (options.commitHash) {
      wranglerCmd.push(`--commit-hash="${options.commitHash}"`);
    }

    const output = execSync(wranglerCmd.join(' '), {
      encoding: 'utf8',
      stdio: 'pipe',
      env: {
        ...process.env,
        CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN
      }
    });

    // Parse deployment URL from output
    const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.pages\.dev/);
    const deploymentUrl = urlMatch ? urlMatch[0] : `https://${projectName}.pages.dev`;

    return {
      success: true,
      url: deploymentUrl,
      branch,
      output: output.substring(0, 1000)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stderr: error.stderr?.substring(0, 500)
    };
  }
}

/**
 * Create deployment via direct upload
 * For cases where Wrangler isn't available
 */
async function createDirectDeployment(projectName, files) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || config.pages.accountId;

  // This would use the Pages Direct Upload API
  // For now, fall back to Wrangler
  return {
    success: false,
    error: 'Direct upload not implemented. Use deployToPages with Wrangler.'
  };
}

// ============================================
// CUSTOM DOMAINS
// ============================================

/**
 * Add custom domain to Pages project
 */
async function addCustomDomain(projectName, domain) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || config.pages.accountId;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains`,
      {
        method: 'POST',
        headers: getHeaders(apiToken),
        body: JSON.stringify({ name: domain })
      }
    );

    const data = await response.json();

    if (!data.success) {
      return { success: false, errors: data.errors };
    }

    return {
      success: true,
      domain: data.result
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * List custom domains for a project
 */
async function listCustomDomains(projectName) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || config.pages.accountId;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains`,
      {
        method: 'GET',
        headers: getHeaders(apiToken)
      }
    );

    const data = await response.json();

    if (!data.success) {
      return { success: false, errors: data.errors };
    }

    return {
      success: true,
      domains: data.result
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Full workflow: Create project, deploy, and add custom domain
 */
async function deployNewSite(siteName, buildDir, customDomain, options = {}) {
  // 1. Create project
  const projectResult = await createPagesProject(siteName, options);
  if (!projectResult.success) {
    return projectResult;
  }

  // 2. Deploy
  const deployResult = await deployToPages(siteName, buildDir, options);
  if (!deployResult.success) {
    return deployResult;
  }

  // 3. Add custom domain if provided
  let domainResult = null;
  if (customDomain) {
    domainResult = await addCustomDomain(siteName, customDomain);
  }

  return {
    success: true,
    project: projectResult.project,
    deploymentUrl: deployResult.url,
    customDomain: domainResult?.domain,
    pagesUrl: `https://${siteName}.pages.dev`
  };
}

/**
 * Deploy client site with subdomain
 */
async function deployClientSite(clientSlug, buildDir, domain = 'blueprintplan.com') {
  const { createClientSubdomain } = require('./cloudflare-dns.js');

  const projectName = `client-${clientSlug}`;
  const subdomain = `client-${clientSlug}`;

  // Deploy to Pages
  const deployResult = await deployNewSite(projectName, buildDir, {});

  if (!deployResult.success) {
    return deployResult;
  }

  // Create subdomain pointing to Pages
  const dnsResult = await createClientSubdomain(clientSlug, domain);

  return {
    success: true,
    pagesUrl: deployResult.pagesUrl,
    customUrl: dnsResult.success ? `https://${subdomain}.${domain}` : null,
    dnsStatus: dnsResult.success ? 'created' : dnsResult.error
  };
}

module.exports = {
  // Project management
  createPagesProject,
  listPagesProjects,
  getPagesProject,
  deletePagesProject,

  // Deployment
  deployToPages,
  createDirectDeployment,

  // Custom domains
  addCustomDomain,
  listCustomDomains,

  // Convenience
  deployNewSite,
  deployClientSite,

  // Config
  loadConfig
};
