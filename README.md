# CRIW 2026 — Conference Companion App

A fast, mobile-friendly companion web app for **Central Rift Innovation Week (CRIW) 2026**, hosted by Kabarak University — schedule, speakers, gallery, partners, announcements, and live feedback, all in one place.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white&style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## About

The Central Rift Innovation Week (CRIW) 2026 is a flagship platform organized by Kabarak University through the Directorate of Research, Innovation and Outreach, running **15th–19th September 2026** under the theme *"Transforming Ideas into Impact: Innovating for a Better Tomorrow."*

This app is the official attendee companion for the event.

## ✨ Features

| | |
|---|---|
| 🏠 **Home** | Event overview, countdown, and highlights |
| 🗓️ **Schedule** | Full conference agenda |
| 🎤 **Speakers** | Speaker bios and profiles |
| 🖼️ **Gallery** | Event photo gallery |
| 🤝 **Partners** | Sponsors and partner organizations |
| 📢 **Announcements** | Live event updates |
| 📝 **Feedback** | Attendee feedback with visual analytics |
| 👤 **Profile** | Attendee profile |

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives)
- **Routing:** React Router
- **Data:** TanStack Query
- **Forms & validation:** React Hook Form + Zod
- **Charts:** Recharts
- **Deployment:** Vercel (with a serverless API route for the gallery)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (or Node.js 18+) installed

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# Install dependencies
bun install
# or: npm install
```

### Development

```bash
bun run dev
# or: npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
bun run build
```

### Other scripts

| Command | Description |
|---|---|
| `dev` | Start the development server |
| `build` | Build for production |
| `build:dev` | Build in development mode |
| `preview` | Preview the production build locally |
| `lint` | Run ESLint |
| `format` | Format code with Prettier |

## 📁 Project Structure

```
├── api/            # Vercel serverless functions
├── scripts/        # Build & utility scripts
├── src/
│   ├── assets/      # Static assets
│   ├── components/  # Reusable UI components
│   ├── data/        # Static/local data (conference info, speakers, partners...)
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utilities & API clients
│   ├── pages/       # Route-level pages
│   └── public/       # Public images
├── vercel.json     # Vercel deployment config
└── vite.config.ts  # Vite configuration
```

## ☁️ Deployment

This project is configured for zero-config deployment on [Vercel](https://vercel.com):

```bash
vercel deploy
```

Build output goes to `dist/`, and `/api/gallery` is served as a serverless function.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request.

## 📄 License

All rights reserved. This code is proprietary — see [LICENSE](./LICENSE) for details. No copying, modification, or redistribution is permitted without written permission from the copyright holder.
