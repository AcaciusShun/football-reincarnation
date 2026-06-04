# Football Reincarnation — Design

## Concept

You're reincarnated as a footballer. A short run of **iconic-moment choices**
("the ball floats between you and the keeper…") decides, invisibly, what kind of
player you are — and which **real legend** you end up as. Pick the troll options
and you land a **meme ending** instead. The fun lives in homage (会心一笑) and
self-aware failure (气急败坏), kept affectionate and non-offensive.

## The choice anatomy (where the fun is)

Every choice menu still mixes three flavours — a heroic line, a homage that
re-creates a real moment, and a troll pick that feeds an extreme axis toward a
meme ending — but they are **not labelled** in the UI, so the "joke" option isn't
telegraphed and immersion holds.

Instead, a homage/jargon choice carries an opt-in `note` (a "💡 这是什么？" toggle)
that explains the move in plain language *and* names the homage on demand — legible
for newcomers, a wink for fans. The moments you recreated are then **recapped on the
result page** ("你重现的名场面") for the payoff.

## Axes (hidden)

Five trait axes plus a role. Choices nudge axes; legends are tagged on them.

| Axis | −1 ←→ +1 |
| --- | --- |
| `talent` | Grind ←→ Gift |
| `guile` | Honest ←→ Sly |
| `loyalty` | Nomad ←→ Loyal |
| `composure` | Fragile ←→ Ice |
| `flair` | Humble ←→ Showman |

`role` (GK/DF/MF/FW) is categorical, set early and used to filter the legend pool.

## Story model: chapters + conditional variants

A linear **spine** of chapters (ordered by `seq`); each chapter holds one or more
**variants**, and the engine shows the first whose `when` matches the current
state. That gives **light branching** — role-gated, flag-gated, or trait-gated
beats — without a combinatorial tree. Variants re-converge on the next chapter.

```
state = { vec, role, flags, step, history }
for each chapter (by seq): pick first variant whose `when` holds
  → render text + choices → applyChoice (add effects, set role/flag) → next
```

## Outcome

1. **Meme endings first** — the highest-`priority` ending whose `when` matches
   (extreme axis values or a flag). These are the troll-path payoffs.
2. Otherwise the **nearest legend** in your `role`, by cosine similarity on the
   five axes. The legend card doubles as a mini profile: 称号, 名场面, 梗台词,
   honours.

The same scoring core as a taste-quiz — choices → vector → nearest match — just
wrapped in narrative.

## Data layers (decoupled for a future UI overhaul)

```
data/chapters/*.json   the story: chapter → variants → choices (+ conditions)
data/legends/*.json    outcomes: real legends (role + axis vector + flavour)
data/endings/*.json    outcomes: meme endings (trigger condition + flavour)
engine/                run state, variant selection, outcome matching, share
```

Story content, outcome data and engine are independent — rewrite the UI or
restyle without touching the bank; grow the bank without touching code (files are
glob-loaded). All text is bilingual with a fallback.

## v1 scope

8 chapters (with role/flag/trait gates), 16 legends across all four roles, and 8
meme endings for the troll paths. Designed to expand by dropping in JSON — see the
README's scenario-bank table.

## Tone & safety

Affectionate teasing only. Homage to on-pitch moments and fan culture; **no**
real tragedies, no mean-spirited attacks on individuals or nations. The troll
endings mock the *player's own* choices, never a real person.
