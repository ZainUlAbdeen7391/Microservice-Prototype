async function fetchSpec(baseUrl) {
  const res = await fetch(`${baseUrl}/api-docs.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch swagger spec from ${baseUrl}: ${res.status}`);
  }
  return res.json();
}

function withPrefix(paths, prefix) {
  return Object.fromEntries(
    Object.entries(paths || {}).map(([path, definition]) => [`${prefix}${path}`, definition])
  );
}

async function buildSwaggerSpec({ authServiceUrl, nonAuthServiceUrl }) {
  const [authSpec, nonAuthSpec] = await Promise.all([
    fetchSpec(authServiceUrl),
    fetchSpec(nonAuthServiceUrl),
  ]);

  return {
    openapi: '3.0.0',
    info: {
      title: 'Microservices API',
      version: '1.0.0',
      description: 'Combined API documentation for every service, described exactly as it is reachable through the API Gateway.',
    },
    paths: {
      ...withPrefix(authSpec.paths, '/auth'),
      ...withPrefix(nonAuthSpec.paths, '/api'),
    },
    components: {
      ...(authSpec.components || {}),
      ...(nonAuthSpec.components || {}),
    },
    tags: [
      ...(authSpec.tags || []),
      ...(nonAuthSpec.tags || []),
    ],
  };
}

module.exports = { buildSwaggerSpec };
