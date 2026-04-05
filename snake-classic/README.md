# Snake

A tiny, dependency-free Snake game built for this repo.

## Run

Because this repo does not include an existing framework or dev server, the simplest way to run it is:

1. Open [index.html](C:\Users\Philemon Creates\Documents\OpenAI\Projects\Project1\index.html) in a browser.

If you prefer a local server, any static file server will work; navigate to the same `index.html`.

## Controls

- Arrow keys or `W`, `A`, `S`, `D` to move
- `Space` to pause or resume
- `Restart` button to reset the game
- On-screen arrow buttons for touch/mobile play

## Manual Verification Checklist

- Start: the snake begins moving on the first arrow-key or `WASD` input
- Controls: turns work with both keyboard and on-screen buttons
- Growth: eating food increases the score and length by exactly one segment
- Boundaries: hitting a wall ends the game
- Self collision: running into the snake body ends the game
- Pause/resume: `Space` and the pause button freeze and resume the game loop
- Restart: the restart button resets the score, snake, food, and status text
