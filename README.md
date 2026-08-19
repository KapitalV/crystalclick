# Neon Crystal

Developed by Vishal Sahu.

Neon Crystal is a small interactive front-end experiment built with HTML, CSS, and JavaScript. The project combines a clean landing screen with a canvas-based crystal burst effect that reacts to pointer movement and clicks.

The idea is simple: the visitor first sees a neon-style introduction page with the **Neon Crystal** title and a button to enter the experience. After entering, the canvas becomes the main focus. Moving the pointer creates a light trail, while clicking produces animated crystal shards, sparks, rings, and glow effects.

## Features

- Full-screen neon landing page
- Smooth transition into the interactive canvas
- Mouse and pointer movement tracking
- Crystal burst animation on click
- Multiple crystal color palettes
- Animated sparks, shards, glow, and expanding rings
- Burst counter
- Keyboard support using the Space key
- Responsive canvas that adjusts when the browser window is resized

## Project Structure

```text
neon-crystal-project/
├── index.html
├── style.css
└── script.js
```

`index.html` contains the page structure and loads the stylesheet and JavaScript files.

`style.css` handles the dark neon appearance, landing page layout, text styling, controls, and screen transitions.

`script.js` contains the canvas animation system. It tracks pointer speed and direction, creates crystal particles, controls their movement and lifetime, changes color palettes, and redraws the scene using `requestAnimationFrame()`.

## How to Run

No installation or build process is required.

1. Download or clone the project.
2. Keep all three files in the same folder.
3. Open `index.html` in a modern browser.

The project can also be hosted directly on services such as GitHub Pages or Netlify.

## Controls

- **Move the mouse:** creates a light trail and changes the direction of the next burst.
- **Click:** creates a crystal burst at the pointer position.
- **Space:** creates a burst at the current pointer position.

## Purpose

This project was created as a visual JavaScript experiment to explore canvas animation, particle movement, color, glow effects, and pointer interaction without using external libraries.

The code is intentionally kept in separate HTML, CSS, and JavaScript files so it is easy to understand, modify, and use as a base for further visual experiments.
