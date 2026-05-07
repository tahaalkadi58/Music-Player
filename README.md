# TOK Tube - Local Music Player

A web-based local music player built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**.

## Features

- Import and play local audio files (MP3, WAV, FLAC, M4A, AAC, OGG, OPUS, WMA)
- Read embedded ID3 metadata (title, artist, album, composer, year, genre, cover art)
- Organize music into playlists, favorites, and listening history
- Sort songs by name, date, duration, album, or composer
- Search songs by title, artist, or album
- Edit song metadata (title, artist, album) and delete songs
- Re-order the play queue via drag-and-drop
- Three playback modes: Repeat All, Repeat One, Shuffle
- Two player UI modes: mini player (bottom bar) and full-screen now-playing view
- Auto-save favorites, history, and playlists to browser localStorage

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | ^15.2.4 | Framework with App Router |
| React | ^19.0.0 | UI library |
| TypeScript | ^5.8.2 | Type safety |
| Tailwind CSS | ^3.4.17 | Utility-first CSS |
| jsmediatags | ^3.9.7 | ID3 metadata reader |
| Font Awesome | 7.0.1 | Icons |
| pnpm | 9.15.9 | Package manager |

## Prerequisites

- **Node.js** (modern version)
- **pnpm** (v9.15.9 or later)

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm dev

# 3. Build for production
pnpm build

# 4. Start the production server
pnpm start

# 5. Lint the codebase
pnpm lint
```

Open **http://localhost:3000** in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── [category]/         # Category pages (playlists, albums, artists)
│   ├── albums/             # Album detail pages
│   ├── artists/            # Artist detail pages
│   ├── favorites/          # Favorites page
│   ├── history/            # History page
│   └── playlists/          # Custom playlist pages
├── components/             # UI components
│   ├── home/               # Home page components
│   └── player/             # Player components (mini, full-screen, controls)
├── context/                # React Context (state management)
├── data/                   # Static data
├── hooks/                  # Custom hooks (useAudio, usePlayer)
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions
```

## Usage

1. Open the app in your browser
2. Click **"Scan Music Folder"** to import local audio files from your device
3. Browse imported songs in the playlist view
4. Click any song to play — the full-screen player opens
5. Use the mini-player (bottom bar) for quick controls
6. Favorite songs, create custom playlists, and browse listening history

## License

This project is for educational and personal use.
