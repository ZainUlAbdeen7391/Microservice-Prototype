const { InfisicalSDK } = require('@infisical/sdk');

async function loadSecrets(requiredKeys) {
  const {
    INFISICAL_CLIENT_ID,
    INFISICAL_CLIENT_SECRET,
    INFISICAL_PROJECT_ID,
    INFISICAL_ENVIRONMENT,
    INFISICAL_SITE_URL,
  } = process.env;

  if (!INFISICAL_CLIENT_ID || !INFISICAL_CLIENT_SECRET || !INFISICAL_PROJECT_ID || !INFISICAL_ENVIRONMENT) {
    throw new Error(
      'Missing Infisical bootstrap credentials: INFISICAL_CLIENT_ID, INFISICAL_CLIENT_SECRET, ' +
      'INFISICAL_PROJECT_ID and INFISICAL_ENVIRONMENT must all be set.'
    );
  }

  const client = new InfisicalSDK({
    siteUrl: INFISICAL_SITE_URL || 'https://app.infisical.com',
  });

  await client.auth().universalAuth.login({
    clientId: INFISICAL_CLIENT_ID,
    clientSecret: INFISICAL_CLIENT_SECRET,
  });

  const { secrets } = await client.secrets().listSecrets({
    environment: INFISICAL_ENVIRONMENT,
    projectId: INFISICAL_PROJECT_ID,
  });

  const values = Object.fromEntries(secrets.map((secret) => [secret.secretKey, secret.secretValue]));

  const missing = requiredKeys.filter((key) => values[key] === undefined);
  if (missing.length > 0) {
    throw new Error(`Missing required secrets in Infisical (${INFISICAL_ENVIRONMENT}): ${missing.join(', ')}`);
  }

  return values;
}

module.exports = { loadSecrets };


