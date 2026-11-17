# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Existing: plain static HTML, CSS and vanilla JavaScript (`index.html`, `style.css`, `diagrams.js`, `deck.js`), no build step, opened directly from disk in a browser.

## Users
The primary audience is the Final Year Project evaluation panel (supervisor and examiners) at COMSATS University Islamabad, Lahore Campus, watching a live presentation on a projector or large screen, followed by questions. The presenters are the three team members: Hafiz Abdullah Saim, Maha Khalid and Memoona Shahid. Supervisor: Mr. Amaid Zia.

## Product Purpose
This deck presents Synapse, a multimodal AI accessibility system that helps blind and low-vision learners follow online STEM video lectures. It must show evaluators what the system is, how it works end to end, what is built, what was hard, and where it goes next. Success: evaluators leave convinced the project is technically sound, socially meaningful, complete, and honestly scoped.

## Positioning
Synapse is not a screen reader or a captioning tool: it joins speech, on-screen visuals and instructor cues into one grounded, spoken explanation, which isolated assistive tools do not do.

## Operating Context
Presented live from a laptop in fullscreen, driven by keyboard (arrow keys, F for fullscreen). The two architecture slides step through animated phases. The machine may have no internet, so every core asset is local. The deck covers 11 slides: title, team, problem, solution, what is Synapse, system architecture, pipeline architecture, core modules, what is done, challenges, future work and thanks.

## Capabilities and Constraints
- Source of truth for the architecture is `docs/system_architecture.json` and `docs/pipeline_architecture.json`; each drawn connection must match a JSON edge's source and target.
- Gesture Detection is shown as a normal, distinct pipeline module. It is never labelled partial, optional or broken, and its internals are not detailed.
- The deck must work fully offline (local fonts in `fonts/`, assets in `Assets/`).
- Terminology: "structured visual evidence", "multimodal synchronization", "intervention moments", "three-stage preparation".

## Brand Commitments
Use the Synapse "Paper" theme from the web app: lavender background `#E2E6F8`, white cards, deep indigo `#362CAC`, deep teal `#064E4A`, dark indigo `#201C56`, navy text `#14172B`, indigo-to-teal gradient for title and closing slides. Fonts: Atkinson Hyperlegible Next for text, Atkinson Hyperlegible Mono for technical labels. Logos and icons come from `Assets/`.

## Evidence on Hand
- Architecture docs and JSON definitions in `docs/`; the FYP proposal `docs/Synapse_Proposal.docx` (team, problem statistics from WHO, objectives).
- Logos, app icon and web assets in `Assets/`.
- Absent, and not to be fabricated: application screenshots (the user chose to skip them), user-study results, accuracy or latency measurements, and any benchmark numbers.

## Product Principles
1. Accuracy over decoration: nothing on a slide contradicts the architecture docs or the proposal.
2. Show how it works, not just that it works: the diagrams demonstrate data actually moving through the system.
3. Balanced storytelling: problem, rigour, completeness and honest limits all get space, with the weaker material kept short and placed last.
4. Legible from the back of a room: one idea per slide, generous type, restrained density.
5. No invented evidence: illustrative examples are labelled, and claims stay within what the docs support.

## Accessibility & Inclusion
The project serves blind and low-vision learners, so the deck should model that care: high text contrast, the Atkinson Hyperlegible typefaces, full keyboard operation, and motion that explains rather than distracts.
