> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Secrets live only in the environment; development auth is an explicit opt-in

## Status

Accepted.

## Decision

API keys are read from environment variables, never from files inside the workspace, the content library, or `/tmp` config scraps. The gateway token file exists once, at the repository root, with 0o600 permissions; no token is stored under `library/`. The well-known `dev-token` is accepted only when the gateway configuration explicitly sets `allowDevToken: true`, and it defaults to false, so the default end-to-end path exercises real authentication and the web studio must present the real token.
