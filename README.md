# DSA Visualizer & Practice Lab

An educational web app to learn Data Structures and Algorithms through interactive visualizations, clean C code side‑by‑side, stepper execution, and practice exercises. Runs entirely in your browser (no backend).

## What’s inside (Tech + Architecture)
- HTML: `index.html` (dashboard), `experiment.html` (runner), `about.html` (profile)
- CSS: `css/styles.css` with a CSS‑variables theme system and dark/light mode via `body[data-theme="dark"]`
- JavaScript:
  - `js/experiments.js`: Experiment metadata (ids, titles, inputs, algorithm mapping)
  - `js/app.js`: Page init, theme toggle, explanation/practice/progress, copy/export, input helpers
  - `js/stepper.js`: Async stepper controlling run/step/auto, pause/resume, speed, and metrics
  - `js/visualizers/`: Visual components for arrays, linked lists, and pattern matching (with LPS row)
  - `js/algorithms/js_impl/`: Algorithm implementations (arrays, search, sort, pattern, linked lists)
  - `js/algorithms/c_snippets.js`: Clean C code for each experiment (rendered with safe syntax highlighting)

## Features
- Interactive visualizations with color-coded highlights (active, comparing, swapped, sorted)
- Clean C code viewer with Toggle Highlight and Copy Code
- Stepper controls: Run, Step, Auto, Prev, Reset, Pause/Resume, speed slider + 0.5x/1x/2x presets
- Practice mode with predefined tests and inline results
- Progress tracking with localStorage + Export/Import JSON
- Input helpers: Randomize Array, Sort Array (for Binary Search), Reset Inputs
- Presets for best/average/worst cases (sorting, search)
- KMP extras: visual LPS table, updated when built
- Copy utilities: Copy JS Algorithm source and Copy Current State (inputs + visualizer data)
- Dark/Light mode toggle (persisted)
- Mobile polish for small screens

## Getting started
Requirements: A modern browser (Chrome/Edge/Firefox/Safari). No server or build tools needed.

1) Download/clone the repo
2) Open `index.html` directly in your browser
3) Click an experiment to open `experiment.html?id=...`

Tip: If your browser blocks local file URLs for clipboard or downloads, run a simple static server:
```bash
# Python 3
python -m http.server 8000
# Node (http-server)
npx http-server -p 8000
```
Then visit `http://localhost:8000/`.

## Using the app
- Dashboard: See all experiments and your overall stats
- Experiment page:
  - Left: C code panel (Toggle Highlight, Copy Code)
  - Middle: Controls + Visualizer + Output Log + Metrics
  - Right: Tabs for Theory, Practice, and Progress

Workflow:
1) Enter inputs (or use Presets/Randomize/Sort helpers)
2) Run or Step through; Auto supports speed presets; Pause/Resume when needed
3) Watch Metrics (steps/comparisons/swaps)
4) Practice with test cases; results save to Progress (export/import supported)
5) Copy JS Algorithm or Current State for sharing

## Project layout
```
├── index.html
├── experiment.html
├── about.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── experiments.js
│   ├── stepper.js
│   ├── visualizers/
│   │   ├── arrayViz.js
│   │   ├── linkedListViz.js
│   │   └── patternViz.js
│   └── algorithms/
│       ├── c_snippets.js
│       └── js_impl/
│           ├── array.js
│           ├── search.js
│           ├── sort.js
│           ├── pattern.js
│           └── linkedlist.js
└── README.md
```

## Algorithms included
- Arrays: Largest element & index, Sum & Average, Insert, Delete
- Search: Linear, Binary
- Sort: Bubble Sort (full visual)
- Pattern Matching: Naive, KMP with LPS visualization
- Linked Lists: Singly (Traverse, Insert Front, Delete Last), Doubly (Insert Front/End, Delete Last, Delete Before), Circular (Insert End/Before, Delete First/After)

## Styling and theming
- Theming via CSS custom properties defined on `:root`
- Dark mode overrides via `body[data-theme="dark"]`
- Toggle persists using `localStorage` (`dsa-theme`)

## Implementation details
- Stepper is async and yields between steps; Pause halts all visual actions; speed adjusts mid-run
- Safe C syntax highlighting protects strings/comments, then highlights whole-word keywords so identifiers (e.g., `printf`) are never corrupted
- Visualizers expose `render`, `update`, `highlight`, `clear`; stepper updates them through a `stepContext`

## Extend the app
Add a new experiment:
1) Define metadata in `js/experiments.js` (id, title, inputs, algorithm name, type)
2) Add C code in `js/algorithms/c_snippets.js` under the same id
3) Implement the algorithm in `js/algorithms/js_impl/...` exporting `async function(inputs, stepContext)`
4) Map the algorithm in `getAlgorithmFunction` (`js/app.js`)
5) Add Theory/Practice entries in `getExplanation` and `getPracticeTests` (`js/app.js`)

## Troubleshooting
- Nothing happens on Run: verify inputs are filled and formatted
- Binary Search warning: ensure array is sorted (use Sort Array)
- Copy/Export blocked: serve via localhost or allow clipboard permissions
- UI off or unreadable: try Dark/Light toggle; clear cache/hard reload

## License & Contributions
Open source for educational use. Contributions to add algorithms or improve UX are welcome.

Enjoy learning! 🚀

## Copyright

© 2025 Vinayak Asole. All rights reserved.

This project’s source code, assets, and documentation are protected by copyright. See the `COPYRIGHT` file for details. If you intend to reuse or redistribute beyond educational/personal purposes, please obtain written permission from the author.

