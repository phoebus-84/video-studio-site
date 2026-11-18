> Imported studio reference, based on [f43b0ee](https://github.com/phoebus-84/video-studio/tree/f43b0ee50bedc4f78721e4aaf24300243d5cac78). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Secrets live only in the environment; development auth is an explicit opt-in

## Status

Accepted.

## Decision

API keys are read from environment variables, never from files inside the workspace, the content library, or `/tmp` config scraps. The gateway token file exists once, at the repository root, with 0o600 permissions; no token is stored under `library/`. The well-known `dev-token` is accepted only when the gateway configuration explicitly sets `allowDevToken: true`, and it defaults to false, so the default end-to-end path exercises real authentication and the web studio must present the real token.
