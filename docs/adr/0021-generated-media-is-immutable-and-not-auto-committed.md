> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Generated media is immutable and not auto-committed

## Status

Accepted. Extended by [ADR-0045](./0045-a-channel-is-its-own-repository.md) (media named by hash) and [ADR-0049](./0049-channel-media-use-a-content-addressed-s3-remote.md) (a content-addressed remote).

## Decision

Every generated media result is an immutable Asset Attempt named by stable identity and content hash, while selection and current-deliverable pointers remain small textual records. Workspace text is Git-friendly, but large media is not committed automatically; manifests make missing blobs detectable and leave remote media storage and backup as an explicit later policy instead of silently bloating repositories.
