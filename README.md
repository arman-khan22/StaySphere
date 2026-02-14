# StaySphere

>A clean, minimal property-listing app for short-term stays — built with Node.js, Express and MongoDB.

---

## ✨ Overview

StaySphere is a lightweight web application for creating, browsing, and reviewing short-term rental listings. It provides user authentication, listing management (create/edit/delete), image uploads, and a review system—delivered with a modern, accessible UI.

## 🎯 Key Features

- User accounts: sign up, log in, and manage sessions
- Create and manage listings with images and location data
- Leave and manage reviews for listings
- Server-side validation and centralized error handling
- Clean, responsive UI with map integration and rating visuals

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- EJS templates for server-rendered views
- Multer for file uploads
- Mapbox (client-side) for interactive maps

## 🚀 Quick Start

Prerequisites: Node.js (16+), npm, MongoDB (local or Atlas)

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file (example variables)

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/staysphere
SESSION_SECRET=your_secret_here
MAPBOX_TOKEN=your_mapbox_token
```

3. Start the app (development)

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure (high level)

- `app.js` — application entry and middleware
- `routes/` — route definitions for listings, reviews, users
- `controllers/` — request handlers and business logic
- `models/` — Mongoose schemas (`listing`, `review`, `user`)
- `views/` — EJS templates (layouts, listings, users)
- `public/` — static assets (CSS, JS, images)

For a full file map see the repository root.

## Environment & Deployment Notes

- Sanitize secrets: never commit `.env` to source control.
- For production, use a managed MongoDB (Atlas) and set `NODE_ENV=production`.
- Configure cloud storage (S3 or similar) if you expect large volumes of uploads.

## Contributing

Contributions are welcome—please open issues or submit pull requests for bug fixes and enhancements. Keep changes small, describe intent clearly, and include tests where practical.

## License & Contact

This project is provided as-is. For questions or collaboration, open an issue or contact the maintainer via the repository.

---

Edited for clarity and concise developer onboarding.