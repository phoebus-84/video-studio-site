> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Generated media is immutable and not auto-committed

Every generated media result is an immutable Asset Attempt named by stable identity and content hash, while selection and current-deliverable pointers remain small textual records. Workspace text is Git-friendly, but large media is not committed automatically; manifests make missing blobs detectable and leave remote media storage and backup as an explicit later policy instead of silently bloating repositories.
