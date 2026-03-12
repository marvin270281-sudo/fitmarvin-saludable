<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/115DyFtMS-d1FE3NvOok1AOOfC7GmPeTm

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Real-time presence

A small WebSocket server tracks how many clients are connected. To enable the online‑user counter:

1. Install `ws` if not already (`npm install ws`).
2. Run `node presence-server.js` in a separate terminal (it listens on port 4000 by default).
3. The React app will connect automatically and display a badge in the top header showing
   the current number of users online.

All clients see updates live each time someone connects or disconnects.

The server is extremely lightweight and runs locally; to deploy you can host it on any
Node-capable environment alongside the frontend.
