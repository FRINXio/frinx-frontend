# frinx-frontend

## Structure

This is a monorepo using yarn workspaces. This is how it looks like:

```
- @frinx/frontend-server
- @frinx/dashboard
  |- @frinx/api
  |- @frinx/workflow-ui
  |- @frinx/workflow-builder
  |- @frinx/inventory-client
  |- @frinx/uniresource-ui
```
`@frinx/dashboard` packages ties all the frontend packages together and renders the final UI + it's responsible for the high level routing (first level routes) - each package maintains its own internal/nested routes.

`@frinx/frontend-server` manages environment variables needed by the UI (see `packages/frinx-frontend-server/.env.example`) - it creates a global config object (`window.__CONFIG__`).
It also serves the built bundle in production, while it proxies requests to webpack-dev-server in development.
## Prerequisites
- node v16.14.2
- yarn v2+
- access to a running instance of Frinx Machine

You also need https://github.com/FRINXio/ui-dev-proxy running on your machine. This server serves as proxy to all the FM APIs (to bypass CORS errors) + it simulates KrakenD in development - you should always visit the UI through this server.

## Development

```bash
$ yarn install
$ cp ./packages/frinx-frontend-server/.env.example ./packages/frinx-frontend-server/.env
```
Everything should work with the default environment variables.

```bash
$ yarn dev
```

This will start the frontend-server and webpack-dev-server. You should however use ui-dev-proxy address in the browser to see FM UI (you will se an empty page if otherwise).

## Releases
We release FM UI every successful pull request to the `main` branch (`latest` tag on the DockerHUB). Versioned releases come from the tagged commit (`vX.Y.Z` format).