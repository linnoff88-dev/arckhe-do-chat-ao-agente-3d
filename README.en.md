# Do Chat ao Agente 3D

[![Do Chat ao Agente 3D](guia/assets/banner-en.jpg)](https://linnoff88-dev.github.io/

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

## What it is

This repository shows how the “Do chat ao agente” course (From chat to agent) became a 3D stone and wood house that loads in a browser. It is for people who create courses or pages and want to see a project like this from the inside. You can find the requests sent to the AIs, their answers, the tests, the reviews, the errors, and the measured figures. The course has 4 stations, 37 lessons, and 23 exercises. Each completed sequence lights up a step. Once you complete all 4, the yellow door opens to the terrace. There is also a version without 3D.

- **Enter the house:** https://eventos.ARCKHÉ AI/do-chat-ao-agente-3d/
- **How it was made, on the site:** https://eventos.ARCKHÉ AI/do-chat-ao-agente-3d/processo/

## 📖 Guide

Complete guide: **https://linnoff88-dev.github.io/

## Want to analyze your course or page?

Paste this request into an AI chat that can open links, along with a link to your course or a file. To have the AI change files, use Claude Code or Codex in the project folder.

```text
Read the "Do Chat ao Agente 3D" project at https://github.com/linnoff88-dev/do-chat-ao-agente-3d (start with the README and FALHAS.md, which is in Portuguese) and view the house at https://eventos.ARCKHÉ AI/do-chat-ao-agente-3d/.
Use this project only as a reference. Then look at my course or page (at the link or in the file I send; if you can access a folder, look there) and reply in simple English:
1. What here could become places or steps, with a clear sign that each is "done"?
2. What would the person see change as they move forward?
3. Is it worth making this in 3D, or would a regular page work?
4. How could I check the result in a real browser before approving it?
Do not change anything yet. Show me the plan and wait for me to say yes.
```

## How it was built

Nei, from ARCKHÉ, asked to start from an earlier 3D event, [Imersêo Jarvis 3D](https://github.com/linnoff88-dev/imersao-jarvis-3d), and recreate a stone and wood house from a set of photos, using the content of the “Do chat ao agente” course.

- **Codex with GPT-6.2 Astra**, at high effort and through the subscription, generated images, textures, text, and code in 9 rounds.
- **Claude Code** wrote the brief, requests, and tests, checked the result in a real browser, and reported what did not pass.
- **Independent reviewers** took the course as visitors.

### What was measured

| Measure | Value |
|---|---|
| Codex rounds | 9 |
| Total time for the rounds | 8,459 seconds, about 2 h 21 min, not including preparation and reviews. Some rounds ran at the same time |
| Equivalent API table cost, Codex only | US$ 26.32, for comparison only. This amount was not paid: actual use was through the subscription |
| Codex weekly limit measured | from 89% to 96% |
| Independent reviewers | score 6 (failed), score 7 (failed), and score 7.5 (passed with points to adjust, under less strict guidance than the first two) |

The rounds are numbered from 00 to 07, with one 00b. The last round was checked on the published site, with real mouse and keyboard input, without a new reviewer. Figures by round are in `processo/dados.json`. The scores come from project tracking, and the reviewers’ full reports have not been published: their findings appear in the requests for rounds 05, 06, and 07.

### What went wrong

The full list, with the fix for each item, is in [FALHAS.md](FALHAS.md) (in Portuguese). Here are some examples:

- The ceiling came out red and the floor came out burgundy.
- The stone looked like painted brick, then like a game block.
- A test image came out completely black because the screen was cleared right after it was drawn.
- The low wall blocked clicks in the doorway.
- The notification bar announced arrival at a station while the person was still on the way.

### Limits

- Smoothness was not measured on a real graphics card or physical phone. Tests used software rendering and emulation.
- Chairs, the armchair, and the close-up stone are still simple.
- No one measured whether the house helps people learn or complete more of the course.
- The course is free, but the exercises require a computer and a Claude or ChatGPT subscription. Some use the terminal.

---

## Technical installation

The site is static and has no build step. You need Python 3 to serve the files and a browser with WebGL for 3D mode. Without WebGL, the course loads in the version without 3D.

```bash
git clone https://github.com/linnoff88-dev/do-chat-ao-agente-3d.git
cd do-chat-ao-agente-3d
python3 -m http.server 8792
```

Then open `http://localhost:8792/`.

### Files

| Path | What it contains |
|---|---|
| `index.html`, `src/` | The site: interface, 3D house, controls, and progress |
| `conteudo/base.json` | Lessons, exercises, and videos, ready to use |
| `conteudo/curso.json`, `conteudo/roteiro.md` | House text and route |
| `assets/` | Textures, valley view, and fonts |
| `vendor/three/` | Three.js, without a CDN |
| `processo/` | Brief, requests, answers, measurements, and screenshots from rounds 2, 4, and 7 |
| `tools/` | Validator, browser capture, and round runner |
| `guia/`, `capa/` | This guide in Portuguese, English, and Spanish, and the cover |

### What this public copy changes

This repository was put together separately, with a new history. The `fonte/` folder, reference photos, raw execution records, and screenshots from the other rounds were left out. The photo names still appear in the requests.

The records in `processo/` were cleaned up: machine paths, links to the source page, and internal rules were replaced or removed. For this reason, some parts of the requests differ from the original text sent to Codex. The links to the source page, which the site does not use, were removed from `conteudo/base.json`.

`tools/gerar_base.py` depends on `fonte/` and remains as a record. The ready-to-use base is in `conteudo/base.json`.

### Tests

```bash
python3 tools/validar_conteudo.py
for f in src/*.js; do node --check "$f"; done
```

The validator accepts an optional list of forbidden terms in `tools/termos-fora.local.txt`, outside Git, with one regular expression per line.

`node tools/capturar.mjs <rotulo>` opens the site in Chromium and saves screenshots in `processo/revisoes/`. It expects Playwright in `~/.npm-global` (`npm install -g --prefix ~/.npm-global playwright`, then `npx playwright install chromium`).

### Cost

`tools/resumir_rodada.py` records each round’s time, tokens, and equivalent cost in `processo/dados.json`. It and `tools/vigia_cota.py` read Codex’s local records. Use `PASTA_CODEX` if they are not in `~/.codex`.

## The process, from start to finish

🧠 is Nei’s work with Claude Code. ⚙️ is a script. 🤖 is Codex or an independent reviewer.

| Step | What happens | Command | Who does it |
|---|---|---|---|
| 1 | Gather the course page, lessons, exercises, and photos without people | folder `fonte/`, outside this repository | 🧠 session with Nei |
| 2 | Write the brief, rules, and validator | `processo/BRIEFING.md`, `tools/validar_conteudo.py` | 🧠 session with Nei |
| 3 | Generate the course base | `python3 tools/gerar_base.py` (requires `fonte/`) | ⚙️ script |
| 4 | Generate images, textures, and the valley view | `tools/rodar_codex.sh processo/prompts/00-ambiente.md <fotos>` and `00b-vista.md` | 🤖 Codex |
| 5 | Write the course text | `tools/rodar_codex.sh processo/prompts/01-conteudo.md` | 🤖 Codex |
| 6 | Build the house and course | `tools/rodar_codex.sh processo/prompts/02-casa.md <fotos>` | 🤖 Codex |
| 7 | Check with screenshots in a real browser | `node tools/capturar.mjs <rotulo>` | 🧠 session with Nei |
| 8 | Match the photos more closely and polish, with a limit guard | `tools/vigia_cota.py 96`, `03-fidelidade.md`, `04-acabamento.md` | 🤖 Codex |
| 9 | Independent review: score 6, failed | new agent, without the author’s scores | 🤖 reviewer |
| 10 | Fix the review findings | `tools/rodar_codex.sh processo/prompts/05-revisao.md` | 🤖 Codex |
| 11 | Second review: score 7, failed | new agent | 🤖 reviewer |
| 12 | Fix the issues again | `tools/rodar_codex.sh processo/prompts/06-revisao2.md` | 🤖 Codex |
| 13 | Third review: score 7.5, passed | new agent, under less strict guidance | 🤖 reviewer |
| 14 | Finalize | `tools/rodar_codex.sh processo/prompts/07-fechamento.md` | 🤖 Codex |
| 15 | Check the last round with real mouse and keyboard input | browser + `node tools/capturar.mjs r7` | 🧠 session with Nei |
| 16 | Validate | `python3 tools/validar_conteudo.py` and `node --check` in `src/*.js` | ⚙️ script |
| 17 | Publish the site, with Nei’s OK | publishing script, outside this repository | 🧠 session with Nei |
| 18 | Create this cleaned-up public copy and write the guide | `publico` branch, `guia/`, `ARCKHÉ-traduz` | 🧠 session with Nei |