# Microservices: api-gateway, auth-service, non-auth-service

`api-gateway` is the only service with configuration worth centralizing (it
needs to know where the other two live). Its port and the two service URLs
are stored in Infisical and fetched at startup via the Infisical Node SDK
(`@infisical/sdk`, Universal Auth). `auth-service` and `non-auth-service`
listen on a fixed port each (`4001` / `4002`) in code — they have no
configuration of their own, so there's nothing to centralize.

## 1. Create the secrets in Infisical

In your Infisical project, under the environment you're deploying to (e.g.
`dev`), create these secrets:

| Secret key             | Used by      | Example value                  |
|-------------------------|--------------|----------------------------------|
| `API_GATEWAY_PORT`      | api-gateway  | `3000`                          |
| `AUTH_SERVICE_URL`      | api-gateway  | `http://auth-service:4001`      |
| `NON_AUTH_SERVICE_URL`  | api-gateway  | `http://non-auth-service:4002`  |

Keep the port number embedded in `AUTH_SERVICE_URL` / `NON_AUTH_SERVICE_URL`
matching the fixed `PORT` constant in `auth-service/index.js` /
`non-auth-service/index.js` — the gateway proxies to that URL, so a mismatch
breaks routing. If you change one, change the other.

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
`INFISICAL_ENVIRONMENT` (the environment **slug**, e.g. `dev` — not the
display name shown in the Infisical UI, e.g. not `Development`). `.env` is
gitignored — it never holds application secrets, only the credentials
needed to authenticate to Infisical.

No port values go in `.env` — `API_GATEWAY_PORT`, used for the host-published
port mapping, is read live from Infisical.

## 4. Install the Infisical CLI (one-time, host machine only)

```
npm install -g @infisical/cli
```

This is separate from the `@infisical/sdk` used inside the api-gateway
container: the SDK fetches secrets from *inside* a running Node process, but
Docker needs `API_GATEWAY_PORT` to publish the host port *before* any
container starts — there's no way to ask Infisical from inside
docker-compose.yml itself. The CLI is what bridges that gap without ever
writing the value to disk.

## 5. Run

```
./scripts/up.ps1
```

This authenticates to Infisical with your machine identity, then runs
`docker compose up --build` with `API_GATEWAY_PORT` injected straight into
the environment — nothing touches a file. api-gateway also independently
authenticates to Infisical via the SDK at startup and fails fast with a
clear error if a required secret is missing.

Running `docker compose up` directly (without the script) will fail with a
`variable is not set` warning for `API_GATEWAY_PORT`, since compose has no
credentials of its own to reach Infisical.
