> Imported studio reference, based on [9fd61f7](https://github.com/phoebus-84/video-studio/tree/9fd61f7611eb4e9557c057547aa7de3c3e71f02e). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Generated media is immutable and not auto-committed

## Status

Accepted. Extended by [ADR-0045](./0045-a-channel-is-its-own-repository.md) (media named by hash) and [ADR-0049](./0049-channel-media-use-a-content-addressed-s3-remote.md) (a content-addressed remote).

## Decision

Every generated media result is an immutable Asset Attempt named by stable identity and content hash, while selection and current-deliverable pointers remain small textual records. Workspace text is Git-friendly, but large media is not committed automatically; manifests make missing blobs detectable and leave remote media storage and backup as an explicit later policy instead of silently bloating repositories.
