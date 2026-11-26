> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Channels and series are distinct

## Status

Accepted. Series live under the channel's `series/` folder (layout 2, [workspace contract](../workspace.md)).

## Decision

A channel owns publication identity, audience, brand, and platform defaults, while a series owns the conventions of one recurring format within that channel. Episodes belong to exactly one series, and configuration inherits from system defaults through channel and series to episode; initialization may create a default channel to keep single-series use simple.
