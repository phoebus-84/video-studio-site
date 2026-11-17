> Imported studio reference, based on [e2796c5](https://github.com/phoebus-84/video-studio/tree/e2796c57f66a019df41574d69bba41eb358e4e65). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Sergio Gateway — Public API Contract

Version: 0.1.0 | OpenAPI: `GET /openapi.json`

## Overview

The Sergio Gateway is a trusted local backend that connects browser
clients, the Pi coding agent RPC, and filesystem production state.

- **Default**: loopback-only (`127.0.0.1`), ephemeral port
- **Auth**: Bearer token (auto-generated on first start, stored in `.gateway-token`)
- **Transport**: REST + WebSocket + SSE
- **Content-Type**: `application/json`

## Authentication

All endpoints except `/health` and `/openapi.json` require a Bearer token
in the `Authorization` header:

```
Authorization: Bearer <token>
```

The token is generated on first start and written to `.gateway-token` with
`0o600` permissions. Use the token from that file.

WebSocket connections pass the token as a query parameter:
```
ws://127.0.0.1:{port}/ws?token=<token>
```

## Endpoints

### `GET /health` — Health Check (public)

Reports independent readiness of four components:

```json
{
  "overall": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "gateway": {
    "status": "ready",
    "detail": "HTTP server accepting connections",
    "lastChecked": "2024-01-01T00:00:00.000Z"
  },
  "runtime": {
    "status": "unknown",
    "detail": "Runtime connection not yet wired",
    "lastChecked": "2024-01-01T00:00:00.000Z"
  },
  "pi": {
    "status": "unknown",
    "detail": "Pi RPC not yet wired",
    "lastChecked": "2024-01-01T00:00:00.000Z"
  },
  "adapter": {
    "status": "unknown",
    "detail": "Adapter bridge not yet wired",
    "lastChecked": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status values:** `ready` | `degraded` | `down` | `unknown`

**Overall:** `healthy` when no component is `down`, otherwise `unhealthy`.

### `GET /` — API Root (authenticated)

Returns service metadata and endpoint links.

### `GET /openapi.json` — OpenAPI Spec (public)

Returns the full OpenAPI 3.0.3 specification including all route schemas
and the bearer token security definition.

### `GET /ws` — WebSocket (authenticated via query param)

Real-time event stream. Messages are JSON-encoded, newline-delimited (JSONL).

Initial message after connection:
```json
{"type": "connected", "timestamp": "..."}
```

Client-initiated ping/pong:
```json
{"type": "ping"}
{"type": "pong"}
```

### `GET /events` — Server-Sent Events (authenticated via Bearer header)

SSE stream for simpler clients. Requires `Authorization: Bearer <token>`.

### Films (authenticated)

A film's units are addressed as `:film/units/:scene/:shot`, with `_` for the
level itself: `/api/films/tide/units/_/_` is the film, `…/units/010-shore/_`
a scene, `…/units/010-shore/020-close` a shot (ADR-0050). The library
listing (`/api/channels`) lists films beside channels with `kind: "film"`,
their scenes as series and their shots as episodes, and every episode route
works on a film's unit.

| Route | |
|---|---|
| `GET /api/films` · `POST /api/films` | The library's films · create one (never overwrites) |
| `GET /api/film-formats` · `GET /api/cut-effects` | The delivery formats a film can choose · the picture and sound effects a cut can use, with their parameters |
| `POST /api/films/:film/scenes` · `POST /api/films/:film/scenes/:scene/shots` | Create a scene · a shot |
| `GET /api/films/:film/tree` | The film in running order: every scene and shot with its manifest, its cut, where its renders stand, what to do next, and the render in progress |
| `GET` · `POST /api/films/:film/footage` · `PATCH /api/films/:film/footage/:clip` | The footage log · bring files on this machine in · change a clip's entry |
| `GET` · `PUT …/units/:scene/:shot/manifest` | A unit's manifest · `{ set, order? }`, written only when the result holds |
| `GET` · `PUT …/control` | The pipeline a unit runs and the ones it declares for the levels under it · `{ pipeline?, scenes?, shots? }` |
| `GET` · `PUT …/cut` | The cut with its problems and status · `{ cut \| ops, expectedRevision }`: refused with `409 revision-conflict` when the cut moved on since it was read |
| `GET …/cut/check` | What a render would refuse or warn about, files and effects included |
| `POST …/cut/assemble` | Make the cut from what is under the unit, or bring it in step |
| `POST …/cut/frame` | One composed frame as an image: `{ frame, width? }` |
| `POST …/cut/render` | Start a render: `{ quality, from?, to?, cascade?, force? }`. Answers `202` at once; one render runs per film |
| `DELETE /api/films/:film/render` | Stop the film's render in progress |

A render reports over the event stream as `render.started`,
`render.progress`, `render.completed` and `render.failed`; an edit as
`cut.changed`. A refusal carries `{ error, message, problems }`, each problem
with the path of what it is about in the cut.

## Error Responses

All errors follow a consistent envelope:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "correlationId": "uuid-v4",
  "details": {}
}
```

**Error codes:**

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid Bearer token |
| `NOT_FOUND` | 404 | Unknown route |
| `VALIDATION` | 400 | Request body/param validation failure |
| `BAD_REQUEST` | 400 | Invalid request (e.g. path outside library roots) |
| `GATEWAY_NOT_READY` | 503 | Server not fully initialized |
| `RUNTIME_UNREACHABLE` | 503 | Video pipeline runtime unavailable |
| `PI_DISCONNECTED` | 503 | Pi RPC process disconnected |
| `PI_RPC_ERROR` | 503 | Pi RPC returned an error |
| `PI_TIMEOUT` | 503 | Pi RPC timed out |
| `ADAPTER_UNREACHABLE` | 503 | Extension bridge disconnected |
| `INTERNAL` | 500 | Unexpected server error (details never leaked) |
| `CONFIG_ERROR` | 500 | Configuration error (at startup) |
| `TOKEN_ERROR` | 500 | Token file error (at startup) |

## Security Properties

- **Loopback-only by default.** Binding to `0.0.0.0`, `::`, or any
  non-loopback address requires `allowNonLoopback: true` AND a valid
  `tls` configuration (cert + key). Wildcard binds are rejected without
  both settings.
- **Cryptographically generated token.** `crypto.randomBytes(32)` as
  base64url, stored with `0o600` permissions.
- **Constant-time token comparison.** Prevents timing side-channel attacks
  on the Bearer token.
- **Log redaction.** Authorization headers, API keys, passwords, tokens,
  secrets, and provider credentials are replaced with `[REDACTED]` in
  all log output.
- **No credential exposure.** The browser never receives Pi credentials,
  provider secrets, or unrestricted filesystem access.
- **Library root confinement.** File access is restricted to configured
  library roots. Symlink traversal is resolved before comparison.
