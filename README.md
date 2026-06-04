# ⚽️ Football Reincarnation · 足坛投胎模拟器

> **▶︎ 在线试玩 · Play it → https://acaciusshun.github.io/football-reincarnation/**

![足坛投胎模拟器](public/og.png)

**Travel through football's iconic moments and find out who you'd become.**

A short, branching what-if: each choice nudges hidden trait axes (and your role),
then you're matched to a **real legend** — or, if you trolled your way through, a
tongue-in-cheek **meme ending**. Bilingual (中文 default / English), all in good
fun (褒义调侃，无恶意).

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

Stack: **React + Vite + TypeScript + Tailwind CSS v4** (borrowed from
[MatchDay](https://github.com/AcaciusShun/matchday)).

## How it works

- **5 hidden axes** — talent, guile, loyalty, composure, flair — plus a **role**
  (GK/DF/MF/FW).
- Each **choice** adds to axes, and may set your role or a flag.
- **Chapters** play in `seq` order; each shows the first **variant** whose `when`
  condition matches the current state → cheap **light branching** (role-gated,
  flag-gated, trait-gated) without a branching tree.
- **Outcome**: a meme ending fires if an extreme/troll `when` matches; otherwise
  you get the nearest **legend** in your role (cosine similarity on the axes).

## Growing the scenario bank (drop-in) 🧩

Everything is auto-loaded with `import.meta.glob` — **no registry to edit**, just
add a file:

| Add a… | File | Shape |
| --- | --- | --- |
| Chapter | `src/data/chapters/NN-id.json` | `{ id, seq, variants: [{ when?, text, choices: [{ id, label, effect?, setRole?, setFlag?, note?, background?, flop? }] }] }` |
| Legend | `src/data/legends/id.json` | `{ id, name, role, vec, title, moment, quote, nicknames?, honors? }` |
| Meme ending | `src/data/endings/id.json` | `{ id, title, blurb, quote, when, priority? }` |

A **`when`** condition supports `role`, `flag`, `notFlag`, `axisMin`, `axisMax`
(see `src/engine/types.ts`). Put a variant with **no** `when` last as the default.
All user-facing text is `{ "zh": "…", "en": "…" }`; a fallback renders the other
language if one is missing.

Run `npm run build` before a PR to confirm it still type-checks.

## Deploy

Pushing to `main` auto-builds and deploys to **GitHub Pages** via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The Vite `base` is
`/football-reincarnation/`, and `public/og.png` is the social preview image.

## License

[MIT](LICENSE). Player facts are public record; the scenarios and memes are
original and affectionate. See [DESIGN.md](DESIGN.md) for the full design.
