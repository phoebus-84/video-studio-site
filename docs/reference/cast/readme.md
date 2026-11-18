> Imported studio reference, based on [3f8895a](https://github.com/phoebus-84/video-studio/tree/3f8895af15f019d98afe93a6af8753128060a747). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# @studio/cast

Characters on disk, and a production's cast (ADR-0052).

A character is a record apart from how it appears. It lives in the
`characters/` folder of what owns it — a channel, one of its series, or a
film — and takes any number of *forms*: a rigged 3D model, a 2D puppet, a
sheet of sprites, a drawing made by code, reference pictures, a photograph,
a dot, a sound, a voice and nothing else.

```text
<owner>/characters/<id>/
  character.yaml          who it is, its voice, its forms and their releases
  character.md            who it is and what never changes about it
  backstory.md            where it comes from, what it wants
  performance.md          how it moves, speaks and plays a scene
  forms/<form>/<release>/ one way it appears, as released: never edited

<series or film>/cast.yaml   each role: a character, the form it wears, the release it pins
```

## What is here

| Module | |
|---|---|
| `owners` | where a character lives and which production casts it; a series looks in itself, then in its channel |
| `characters` | `createCharacter` (writes what is missing, overwrites nothing), `readCharacter`, `listCharacters`, `updateCharacter` held to the contract |
| `forms` | `releaseForm` records a folder with the hash of its tree and never the same release twice; `verifyRelease`; `checkCharacter` says everything wrong with a character as it is on disk |
| `casting` | `castRole` pins the form's current release; `resolveCast` says of each role whether what it pins is there and is what it was; `checkAsks` holds a script's requests to what the forms can do |

## What a role's state means

| State | |
|---|---|
| `ready` | what the role pins is on record and is what it was |
| `behind` | as ready; the character has a newer release than the one pinned |
| `on-paper` | the character has no form, or the form has nothing released |
| `unpinned` | a form with releases and none pinned: cast the role again |
| `broken` | the character, the form or the release is not there, or is not what was pinned |

The contract — the manifests' shape and what a form's `can` means — is
`@studio/contracts/src/character.mjs`. This module knows the disk; it does not
know how to play a form. Playing a `.blend`, a sprite sheet or an SVG component
is the job of the kit or the tool that knows the medium.

```bash
npm test --workspace @studio/cast
```
