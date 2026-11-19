# Synapse — Final Year Project Presentation

An interactive HTML presentation for **Synapse: Multimodal AI Accessibility for Online STEM Education of Blind Learners**
COMSATS University Islamabad, Lahore Campus · Session 2023–2027

Team: Hafiz Abdullah Saim, Maha Khalid, Memoona Shahid · Supervisor: Mr. Amaid Zia

---

## The idea

The project exists because of one broken sentence. An instructor says *"as you can see **here**, **this** equals **that**"*,
and a blind learner hears words that point at nothing. Synapse finds what was pointed at, describes it, and speaks it.

The deck demonstrates that mechanism on every slide:

1. **Instructor** caption plays, with the vague word highlighted (here, this, that).
2. A **target frame** snaps onto the thing on the slide that the word refers to.
3. **Synapse says** the plain description, with a waveform.

---

## How to run

1. Keep the folder layout described below.
2. Open `present/index.html` in Chrome or Edge (double-click it).
3. Press `F` for fullscreen.

No installation, server or internet connection is needed.

### Controls

| Key | Action |
|---|---|
| `→` / `Space` / `Enter` / `PageDown` | Next step (if a step is still animating, the first press finishes it) |
| `←` / `PageUp` / `Backspace` | Previous step |
| `Home` / `End` | First / last slide |
| `P` | Auto-play the whole talk |
| `V` | Turn spoken audio on or off (browser text-to-speech, off by default) |
| `F` | Fullscreen |
| Click right / left side of the slide | Next / previous step |

To open a specific place directly, add `#slide.step` to the address, for example `index.html#6.3` (slide 6, step 3).

---

## Slides (11)

1. Title
2. Project team
3. Problem statement
4. Proposed solution
5. What is Synapse?
6. Complete system architecture (animated, 9 steps)
7. Core modules (12 cards, including Assessment: lecture Q&A and quiz)
8. Detailed pipeline architecture (animated, 10 steps)
9. What is done
10. Challenges
11. Future work and thank you

---

## Folder layout

```
Presentation_slides/
├── Assets/                  logos and icons (loaded by the deck)
│   ├── logos/
│   └── web/
├── docs/                    source material: architecture JSON and Markdown, project proposal
├── present/                 THE DECK (open present/index.html)
│   ├── index.html           slide content
│   ├── style.css            theme and layout
│   ├── deck.js              step engine (caption, target frame, voice) using GSAP
│   ├── diagrams.js          architecture diagram engine and data
│   ├── icons.js             bundled Lucide icons
│   ├── vendor/gsap.min.js   GSAP 3.15 (bundled)
│   └── fonts/               Gloock, Atkinson Hyperlegible (bundled)
├── lab/                     20 earlier design concepts (not needed to present)
├── concepts/                earlier concept prototypes (not needed to present)
├── skins/, index.html, ...  earlier version of the deck (not needed to present)
├── README.md
└── requirements.txt
```

To present on another computer, copy `present/` and `Assets/` side by side. Everything else is optional.

---

## Architecture diagrams

Both diagrams are drawn from `docs/system_architecture.json` and `docs/pipeline_architecture.json`.
Every connection shown matches an edge in those files.

- **System architecture:** 10 blocks grouping 23 of the 27 components, 16 arrows.
- **Pipeline architecture:** 30 of 34 modules, 34 of 69 connections. Gesture Detection is its own module.

Some detail is merged or left out so each diagram stays readable on one slide.

---

## Technology

HTML, CSS and vanilla JavaScript. Animation by GSAP. Icons from Lucide (ISC licence).
Fonts: Gloock and Atkinson Hyperlegible (SIL Open Font Licence). No build step.

## Known limits

- Tested in Edge. Chrome should match. Not tested in Firefox or Safari; older Safari does not draw the diagram arrowheads.
- Spoken audio (`V`) depends on voices installed in the operating system.
- The animated sequences cannot be exported to PowerPoint without losing animation (see the notes on converting).
- Captions and spoken descriptions are written for the presentation, based on what each slide shows.
