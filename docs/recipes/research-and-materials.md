---
title: Borrow it with its licence
description: "Find pictures, footage, sound and music in free archives, fetch the original with its licence and the evidence for it, and keep the credits file right without writing it by hand."
---
# Borrow it with its licence

**You end with:** media in your episode or your channel that you did not make
and may use: each file with its source, licence and credit recorded beside
it, the archive's own answer kept as evidence, and an `ATTRIBUTIONS.md` that
is generated, not typed.

<RecipeFilm id="ambient-kowloon" />

The television in that room plays three archive films and the hour runs
under a Creative Commons track. Each is credited with its licence because
each was fetched with it.

## Ingredients

- A channel or an episode to fetch into.
- A subject, and what you may do with the result: publish, monetise, adapt.
- Optional keys for the archives that need one (Pexels, Pixabay, Unsplash,
  Freesound and others). Many need none.

**Costs:** the agent's model usage. Searching and fetching from free
archives makes no paid API calls.

## 1. Say what you may use

A channel's policy lists the licences it accepts. Tell the agent what the
films are for before it searches:

```text
This channel is monetised and its films are edited. Accept public domain,
CC0 and CC BY. Refuse non-commercial and no-derivatives licences.
Find period footage of Hong Kong at night for a television seen across a
room: three candidates, each with its licence and where it comes from.
Do not fetch anything yet.
```

## 2. Search, then fetch one thing at a time

| The agent uses | What it does |
|---|---|
| the `find-archive-media` skill | how to search, what to prefer, how to credit |
| `pva_search_media` | searches museums, Wikimedia Commons, NASA, the Internet Archive, Openverse, ccMixter and others; says for each result whether the channel's policy allows it, and why not |
| `pva_fetch_media` | downloads one original into `assets/`, writes `<name>.source.json` beside it, keeps the provider's response in `artifacts/provenance/`, and rebuilds `ATTRIBUTIONS.md` |
| `pva_search_local_media`, `pva_reuse_local_media` | reuse what the channel already licensed |
| `pva_derive_media` | a trim or a vertical version, still tied to its source |

A fetch is refused for a licence the channel does not allow, for an unknown
licence, and for a file too small to use.

## 3. Share it across episodes

Material several episodes need belongs to the channel, as a source
(`pva_create_source`). An episode pins the source it uses, so a later change
to the shared material does not silently change a finished film.

## 4. Check before you publish

```text
Check the provenance of this episode.
```

`pva_check_provenance` verifies that every archive file is still the one that
was fetched, that its record is valid, that its evidence is kept and that
`ATTRIBUTIONS.md` is current.

## What it cannot tell you

- **Whether a licence is true.** The record is what the archive said. A
  mislabelled upload on a free archive is still mislabelled.
- **Whether the licence fits your use.** Share-alike and non-commercial terms
  follow the work into your film. One CC BY-NC-SA track makes a film you may
  not sell. The policy filters by licence; the judgement stays yours.
- **Anything about people.** A public-domain photograph of a living person is
  not a release from that person.
- **Material you bring yourself.** Your own files have no archive record. Say
  where they come from in the source's notes.

## Where it goes wrong

- **Fetching first, checking later.** The search already says what the policy
  refuses. Read that before choosing.
- **Editing `ATTRIBUTIONS.md` by hand.** It is rebuilt at the next fetch.
  Correct the record beside the file instead.
- **A preview instead of the original.** Some archives serve a preview
  without a key. The record says which you have.

## Next

[A place to spend an hour](./ambient-world) is built largely from borrowed
sound. [Build a channel](./build-a-channel) first, if you have none.
