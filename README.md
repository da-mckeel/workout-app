# LiftLog

A mobile-first PWA workout tracker built with plain HTML, CSS, and Alpine.js, backed by PocketBase.

## Features

- Log workout sessions with exercises and sets
- Set types: Weighted (reps + lbs), Body Weight (reps), Isometric (reps + duration)
- Session history with recent sessions auto-expanded
- Copy a previous session as a template for a new workout
- Read-only view for completed sessions with edit mode
- Last session summary shown while logging
- Exercise library organized by muscle group with search
- Add, edit, and retire exercises
- PWA — installable on iOS and Android via Add to Home Screen

## Tech Stack

- [Alpine.js](https://alpinejs.dev/) — reactivity
- [PocketBase](https://pocketbase.io/) — backend, auth, and database
- Vanilla HTML/CSS — no build step required

## Setup

### 1. PocketBase

1. Install and run PocketBase on your server
2. In the PocketBase admin UI, go to **Settings → Import collections**
3. Import `pb_schema.json` from this repo — this creates the `exercises`, `sessions`, `session_exercises`, and `sets` collections with the correct fields
4. Set API rules for each collection to `@request.auth.id != ""` for List, View, Create, Update, and Delete

### 2. Config

1. Copy `config.example.js` to `config.js`
2. Edit `config.js` and set your PocketBase URL:

```js
const CONFIG = {
  API: 'http://YOUR_SERVER_IP:8090/api',
};
```

### 3. Deploy

Copy these files to your PocketBase `pb_public` folder:

```
index.html
manifest.json
config.js
icon-192.png
icon-512.png
```

PocketBase serves the `pb_public` folder as a static site, so the app will be available at `http://YOUR_SERVER_IP:8090`.

## Local Development

Since there is no build step, you can serve the files with any static file server. For example with Node.js:

```
npx serve .
```

Then visit `http://localhost:3000`. Make sure your `config.js` points to your PocketBase instance.
