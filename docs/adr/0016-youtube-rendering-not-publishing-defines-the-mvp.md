> Imported studio reference, based on [7f73c14](https://github.com/phoebus-84/video-studio/tree/7f73c14cedca6c53bd96e135865f619e70c2af69). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# YouTube rendering, not publishing, defines the MVP

## Status

Accepted. Output profiles now include `vertical-1080x1920`; nothing publishes.

## Decision

The MVP produces validated 1920x1080, 16:9 YouTube-ready MP4 deliverables with narration and captions but does not upload, schedule, or manage platform credentials. Platform settings are expressed as output profiles so YouTube Shorts and other social targets can be added later without coupling the production core to publishing APIs during the first vertical slice.
