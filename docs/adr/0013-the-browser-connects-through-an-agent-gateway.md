> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# The browser connects through an Agent Gateway

The web GUI connects to a trusted Agent Gateway rather than directly owning Pi subprocesses, JSONL streams, filesystem access, or credentials. The gateway associates persistent Pi RPC sessions with episodes, translates anchored comments into prompt, steer, or follow-up messages, bridges extension UI requests, survives browser refreshes and process restarts, and multiplexes production events to authenticated clients.
