> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Channels and series are distinct

## Status

Accepted. Series live under the channel's `series/` folder (layout 2, [workspace contract](../workspace.md)).

## Decision

A channel owns publication identity, audience, brand, and platform defaults, while a series owns the conventions of one recurring format within that channel. Episodes belong to exactly one series, and configuration inherits from system defaults through channel and series to episode; initialization may create a default channel to keep single-series use simple.
