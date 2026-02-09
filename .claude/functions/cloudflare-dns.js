/**
 * Cloudflare DNS Management
 * Create, update, and manage DNS records for subdomains
 */

const fs = require('fs');
const path = require('path');

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
// DNS RECORD MANAGEMENT
// ============================================

/**
 * Create a DNS record (subdomain)
 * @param {string} domain - Base domain (e.g., blueprintplan.com)
 * @param {string} subdomain - Subdomain to create (e.g., dashboard)
 * @param {object} options - Record options
 */
async function createSubdomain(domain, subdomain, options = {}) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const domainConfig = config.domains[domain];

  if (!domainConfig) {
    return { success: false, error: `Domain ${domain} not configured` };
  }

  // Check if subdomain is allowed
  const isAllowed = domainConfig.subdomains.allowed.some(pattern => {
    if (pattern === '*') return true;
    if (pattern.endsWith('*')) {
      return subdomain.startsWith(pattern.slice(0, -1));
    }
    return pattern === subdomain;
  });

  if (!isAllowed) {
    return { success: false, error: `Subdomain ${subdomain} not in allowed list` };
  }

  if (domainConfig.subdomains.reserved.includes(subdomain)) {
    return { success: false, error: `Subdomain ${subdomain} is reserved` };
  }

  const template = options.template || 'subdomain';
  const recordTemplate = config.templates[template];

  const record = {
    type: options.type || recordTemplate.type,
    name: `${subdomain}.${domain}`,
    content: options.target || recordTemplate.content.replace('{project}', options.project || subdomain),
    proxied: options.proxied !== undefined ? options.proxied : recordTemplate.proxied,
    ttl: options.ttl || recordTemplate.ttl
  };

  try {
    const response = await fetch(
      `${config.api.baseUrl}/zones/${domainConfig.zoneId}/dns_records`,
      {
        method: 'POST',
        headers: getHeaders(apiToken),
        body: JSON.stringify(record)
      }
    );

    const data = await response.json();

    if (!data.success) {
      return { success: false, errors: data.errors };
    }

    return {
      success: true,
      record: data.result,
      url: `https://${subdomain}.${domain}`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * List DNS records for a domain
 */
async function listDnsRecords(domain, filter = {}) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const domainConfig = config.domains[domain];

  if (!domainConfig) {
    return { success: false, error: `Domain ${domain} not configured` };
  }

  const params = new URLSearchParams();
  if (filter.type) params.append('type', filter.type);
  if (filter.name) params.append('name', filter.name);
  params.append('per_page', '100');

  try {
    const response = await fetch(
      `${config.api.baseUrl}/zones/${domainConfig.zoneId}/dns_records?${params}`,
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
      records: data.result.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        content: r.content,
        proxied: r.proxied,
        ttl: r.ttl
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a DNS record
 */
async function deleteDnsRecord(domain, recordId) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const domainConfig = config.domains[domain];

  if (!domainConfig) {
    return { success: false, error: `Domain ${domain} not configured` };
  }

  try {
    const response = await fetch(
      `${config.api.baseUrl}/zones/${domainConfig.zoneId}/dns_records/${recordId}`,
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

/**
 * Update a DNS record
 */
async function updateDnsRecord(domain, recordId, updates) {
  const config = loadConfig();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const domainConfig = config.domains[domain];

  if (!domainConfig) {
    return { success: false, error: `Domain ${domain} not configured` };
  }

  try {
    const response = await fetch(
      `${config.api.baseUrl}/zones/${domainConfig.zoneId}/dns_records/${recordId}`,
      {
        method: 'PATCH',
        headers: getHeaders(apiToken),
        body: JSON.stringify(updates)
      }
    );

    const data = await response.json();

    if (!data.success) {
      return { success: false, errors: data.errors };
    }

    return {
      success: true,
      record: data.result
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if subdomain exists
 */
async function subdomainExists(domain, subdomain) {
  const records = await listDnsRecords(domain, { name: `${subdomain}.${domain}` });
  return records.success && records.records.length > 0;
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Create a subdomain pointing to Cloudflare Pages
 */
async function createPagesSubdomain(domain, subdomain, pagesProject) {
  return createSubdomain(domain, subdomain, {
    template: 'subdomain',
    project: pagesProject,
    target: `${pagesProject}.pages.dev`
  });
}

/**
 * Create a subdomain for API (Workers)
 */
async function createApiSubdomain(domain, subdomain, workerRoute) {
  return createSubdomain(domain, subdomain, {
    type: 'CNAME',
    target: workerRoute,
    proxied: true
  });
}

/**
 * Create client subdomain
 */
async function createClientSubdomain(clientSlug, domain = 'blueprintplan.com') {
  return createSubdomain(domain, `client-${clientSlug}`, {
    template: 'subdomain',
    project: `client-${clientSlug}`
  });
}

module.exports = {
  // Core
  createSubdomain,
  listDnsRecords,
  deleteDnsRecord,
  updateDnsRecord,
  subdomainExists,

  // Convenience
  createPagesSubdomain,
  createApiSubdomain,
  createClientSubdomain,

  // Config
  loadConfig
};
