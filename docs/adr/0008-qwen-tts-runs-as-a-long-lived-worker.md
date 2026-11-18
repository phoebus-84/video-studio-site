> Imported studio reference, based on [3f8895a](https://github.com/phoebus-84/video-studio/tree/3f8895af15f019d98afe93a6af8753128060a747). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Qwen3-TTS runs as a long-lived worker

## Status

Accepted. The worker also aligns takes ([ADR-0038](./0038-word-timing-comes-from-forced-alignment.md)) and transcribes them for verification.

## Decision

Local speech synthesis runs through a persistent worker that loads MLX models once, queues segment-level jobs, reports progress, supports cancellation, and returns canonical WAV assets with metadata. Pi talks to this worker through production tools rather than spawning a Python script per request, avoiding repeated multi-gigabyte model loads while keeping the service contract open to future local TTS backends.
