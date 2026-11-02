# Ginga

**How the world dances.** A dashboard about danceability across 114 music genres, built on 114,000 Spotify tracks.

🔗 **Live:** [NETLIFY_LINK](https://ginga-music.netlify.app/)

## Why I built it

I'm a MSCS student and I built this to study **ECharts** and **Ant Design**. I wanted a real project, end to end: from a raw CSV to a database, an API and a responsive interface.

## The data

[Spotify Tracks Dataset](https://huggingface.co/datasets/maharshipandya/spotify-tracks-dataset) by Maharshi Pandya, also on Kaggle.

- 114,000 rows, 114 genres, about 1,000 tracks per genre
- Audio features computed by Spotify: danceability, energy, valence, acousticness, tempo and more
- After cleaning: **89,740 unique tracks** and **29,858 artists**

I focused on **danceability**: which genres move the most, and what "danceable" really means.

## What you can do

- **Overview:** key numbers, most danceable genres, a mood map (energy × happiness), tempo distribution, a sound profile radar to compare any two genres, and the most danceable tracks.
- **Explore:** search and filter tracks by genre, danceability and explicit content. Sortable table with pagination. Click a track to see its profile and open it on Spotify.
- **Genres:** top 20 genres by danceability, energy, happiness or popularity, with a profile for each genre.
- **About the data:** where the data comes from and how to read it.

It also works on mobile, with a bottom tab bar and slide-up panels.

## Stack

| Part | Tech | Hosted on |
|---|---|---|
| Frontend | React, TypeScript, Vite, Ant Design, ECharts | Netlify |
| API | Node, Express, TypeScript, pg | Render |
| Database | PostgreSQL | Neon |

```
Browser ──► Netlify (React app) ──/api/*──► Render (Express API) ──► Neon (Postgres)
```

- **Neon** hosts the Postgres database.
- **Render** runs the Express API. It's on the free plan, so it sleeps after 15 minutes without visits. The first load can take about 30 seconds.
- **Netlify** hosts the React app and forwards every `/api/*` request to Render. To the browser it's one single site, so there's no CORS to deal with.

## How I built it

One card at a time. For each piece of the screen: first the SQL query (tested in Neon), then the API endpoint, then the React component.

### Database

The CSV repeats a track once per genre, and keeps all artists in one string (`"A;B"`). I normalized it into 5 tables: `tracks`, `genres`, `artists`, and two join tables.

A TypeScript seed script reads the CSV once, removes duplicates in memory with `Map` and `Set`, and inserts everything in batches inside a single transaction.

### API

Express, split into routes, controllers and services. The data work happens in SQL:

- averages and counts per genre (`GROUP BY`)
- a tempo histogram (binning with `FLOOR`)
- a balanced sample per genre group (`ROW_NUMBER() OVER (PARTITION BY ...)`)
- filters that don't duplicate rows (`EXISTS`)
- server-side sorting and pagination

All user input goes in as query parameters. Column names (sort, metric) are checked against a fixed list.

### Frontend

- Colors, radius and fonts set once as **Ant Design theme tokens**, instead of overriding CSS.
- A small `useApi` hook for fetching, loading and errors, which cancels old requests.
- Every chart built option by option in **ECharts**: bar, scatter, histogram and radar.
- Animations respect `prefers-reduced-motion`.
- Reusable pieces: one card for charts, one for stats, one profile card shared by tracks and genres.
- Mobile layout with Ant Design breakpoints and responsive table columns.

## What I learned

- Joining two many-to-many tables multiplies rows.
- Ant Design uses theme tokens, which are simpler than CSS overrides.
- In ECharts everything is one `option` object, and the data drives the chart.
- A static site and a long-running API need different kinds of hosting.

## Credits

Dataset by [Maharshi Pandya](https://huggingface.co/datasets/maharshipandya/spotify-tracks-dataset). Fonts: Bricolage Grotesque and Figtree.
Not affiliated with Spotify.
