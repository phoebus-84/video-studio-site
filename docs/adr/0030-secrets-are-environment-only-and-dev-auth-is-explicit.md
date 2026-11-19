> Imported studio reference, based on [9aef661](https://github.com/phoebus-84/video-studio/tree/9aef661ac127f5234a4f4889e3215c0c8b4e1fb2). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Secrets live only in the environment; development auth is an explicit opt-in

## Status

Accepted.

## Decision

API keys are read from environment variables, never from files inside the workspace, the content library, or `/tmp` config scraps. The gateway token file exists once, at the repository root, with 0o600 permissions; no token is stored under `library/`. The well-known `dev-token` is accepted only when the gateway configuration explicitly sets `allowDevToken: true`, and it defaults to false, so the default end-to-end path exercises real authentication and the web studio must present the real token.
