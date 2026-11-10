---
name: Video Studio website
description: An editorial screening programme for a local creative production system.
colors:
  signal: "#b63d28"
  paper: "#f7f5ef"
  ink: "#242b27"
  muted: "#62665d"
  line: "#d7d8cd"
  wash: "#eeeee6"
  dark: "#202e29"
  screen-accent: "#e5eebe"
typography:
  display:
    fontFamily: "'Studio Serif', Georgia, serif"
    fontSize: "clamp(54px, 6.7vw, 96px)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Studio Serif', Georgia, serif"
    fontSize: "clamp(36px, 3.7vw, 54px)"
    fontWeight: 400
    lineHeight: 1.06
  body:
    fontFamily: "'Studio Sans', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  action:
    fontFamily: "'Studio Sans', sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  control: "3px"
  field: "2px"
spacing:
  small: "12px"
  medium: "24px"
  large: "48px"
  section: "76px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
  filter-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.field}"
    padding: "10px 17px"
---

# Design System: Video Studio website

## Overview

**Creative North Star: "The independent cinema programme"**

This documents the implemented website in `docs/`, not the separate browser studio in the application's `studio/web/`. This website is independently versioned and built. It is a proposed marketing identity grounded in the work: a quiet paper field, expressive editorial titles and an actual screening area. Films provide the imagery; interface decoration does not impersonate film production.

**Key Characteristics:**
- Real media, with honest descriptions and source context.
- Serif headlines; compact, practical sans-serif navigation and instructions.
- Dark screening areas against a light reading surface.
- Flat, ruled lists rather than repeated feature-card grids.

## Colors

### Primary

Signal vermilion marks the primary action, text links and italic headline emphasis. Dark-screen emphasis uses the pale screen accent instead, preserving contrast.

### Neutral

Paper is the reading ground. Ink carries main text, muted ink carries supporting copy, and the line colour separates related content without enclosing every item. Dark green is the screening and workflow ground; wash is used in documentation and controls.

**The Evidence Rule.** Colour supports the actual project imagery; it does not imply an approval, measured success or provider availability.

## Typography

Studio Serif is self-hosted **Fraunces**, regular and italic. Studio Sans is self-hosted **Inter**, regular and semibold. Font files and redistribution licences are in `docs/public/fonts/`. Monospace is reserved for commands and code.

Headlines are regular-weight, not faux bold. Marketing body copy is usually 13–17 px according to hierarchy; long documentation uses VitePress’s reading rhythm. Text measures stay around 65–75 characters.

On phones the display is 48 px; documentation H1 is 36 px. Recipe and project titles are subordinate to page titles. Italics add a second editorial voice without gradients or decoration.

## Layout

Marketing pages use a maximum width of 1328 px and 56 px desktop margins, reducing to 32 px and then 20 px. The screening area combines a wide frame with a narrow programme; it stacks below 800 px. Project features combine media and context, and stack at the same breakpoint.

Recipe lists align category, title, description and direction; narrow screens move supporting information beneath the title. Documentation retains its familiar sidebar and outline.

Major passages use roughly 60–110 px vertical separation. Related information is closer. The breakpoints in the implementation are 1600, 1100, 800 and 480 px.

## Elevation & Depth

The system is flat and tonal. The only distinctive floating treatment is the play control over a film: a soft offset shadow (`0 6px 24px #0003`) keeps it readable against unpredictable imagery. No glass panels or faux paper textures.

## Shapes

Media frames are rectangular. Controls have restrained 2–3 px corners. Rules are single-pixel. The small identity mark has rounded corners, but that does not make every content block a rounded card.

## Components

### Navigation

Use VitePress’s accessible navigation and local search, recoloured to the site tokens. Retain the skip link, mobile menu, search keyboard access and document wayfinding. Marketing pages explicitly disable documentation sidebars.

### Buttons and fields

Primary actions use solid vermilion with light text; hover darkens the background. Fields have a visible stroke and a real label. Focus is a 3 px signal outline with 5 px offset. Filter selection uses both a dark fill and `aria-pressed`.

### Screening programme

The selected project has a pale accent and an “On screen” state. Changing the selection resets playback. Video never autoplays; user-initiated playback exposes native controls and pauses another preview. Silent excerpts carry a visual description; sound-enabled previews say “Watch & listen” and “sound on” before the action. Narrated excerpts include English captions and a readable transcript. A missing or failed asset has a useful text fallback and a recipe link; failed loading offers retry.

### Copyable command

A dark command block with a labelled copy button, selectable code, horizontal overflow within the block and a live success/failure message. Failure never hides the command.

### Lists and disclosures

Recipe collections use ruled rows, not nested cards. Search has a count and an explicit empty state with reset. FAQ and credits use native `details` / `summary`.

### Motion

State changes are brief, about 200 ms. Direction arrows may move a few pixels on hover. Content starts visible. Reduced-motion preferences disable transitions and smooth scrolling. Playback remains an explicit viewer decision.

## Do's and Don'ts

- **Do** lead with real work and preserve its original aspect ratio in the gallery.
- **Do** keep instructions honest about hardware, accounts and optional providers.
- **Do** retain keyboard focus, readable code and useful missing-media states.
- **Don't** invent testimonials, metrics, approvals or publication permissions.
- **Don't** put production source files or generated preview media in git.
- **Don't** introduce autoplay, remote fonts or third-party video embeds by default.
- **Don't** apply this website’s visual system to the operational browser studio without a separate brief.
