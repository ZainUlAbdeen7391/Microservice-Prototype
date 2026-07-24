# Microservices: api-gateway, auth-service, non-auth-service

All runtime configuration (service URLs and ports) is stored in Infisical and
fetched by each service at startup via the Infisical Node SDK
(`@infisical/sdk`, Universal Auth). Nothing but bootstrap credentials for
reaching Infisical itself lives in code or docker-compose.yml.

## 1. Create the secrets in Infisical

In your Infisical project, under the environment you're deploying to (e.g.
`dev`), create these secrets:

| Secret key             | Used by            | Example value                    |
|-------------------------|---------------------|-----------------------------------|
| `API_GATEWAY_PORT`      | api-gateway         | `3000`                            |
| `AUTH_SERVICE_PORT`     | auth-service        | `4001`                            |
| `NON_AUTH_SERVICE_PORT` | non-auth-service    | `4002`                            |
| `AUTH_SERVICE_URL`      | api-gateway         | `http://auth-service:4001`        |
| `NON_AUTH_SERVICE_URL`  | api-gateway         | `http://non-auth-service:4002`    |

Keep the port number embedded in `AUTH_SERVICE_URL` / `NON_AUTH_SERVICE_URL`
in sync with `AUTH_SERVICE_PORT` / `NON_AUTH_SERVICE_PORT` — the gateway
proxies to that URL, so a mismatch breaks routing.

## 2. Create a machine identity

Create an Infisical machine identity with Universal Auth, grant it read
access to the project/environment above, and note its Client ID / Client
Secret.

## 3. Configure local bootstrap credentials

```
cp .env.example .env
```

Fill in `.env` with the machine identity's `INFISICAL_CLIENT_ID` /
`INFISICAL_CLIENT_SECRET`, your `INFISICAL_PROJECT_ID`, and
`INFISICAL_ENVIRONMENT`. `.env` is gitignored — it never holds application
secrets, only the credentials needed to authenticate to Infisical.

`API_GATEWAY_PORT`, `AUTH_SERVICE_PORT`, and `NON_AUTH_SERVICE_PORT` also need
to be present in `.env` purely so Docker can publish/expose the container
ports before the containers start (Docker needs this value pre-boot, it
can't ask Infisical first). Keep these equal to the same-named secrets in
Infisical — Infisical remains the source of truth; `.env` is just a local
mirror for Docker's benefit.

## 4. Run

```
docker compose up --build
```

Each service authenticates to Infisical independently at startup and fails
fast with a clear error if a required secret is missing.
