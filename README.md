# Nova AI Hackathon Project

Flight disruption recovery MVP built with Next.js + a Python Nova Act search service.

## MVP Promise

Enter origin/destination + constraints, run flight search automation, return top options, and continue booking.

## Architecture

1. Next.js app (this repo root)
- UI flow: `/` -> `/run` -> `/results` -> `/results/[id]`
- API routes:
  - `POST /api/search-runs`
  - `GET /api/search-runs/:id`
- Polls run status and renders ranked options.

2. Python Nova Act service (`services/nova_act_service`)
- Endpoint: `POST /search`
- Executes Nova Act browser automation.
- Returns normalized `FlightOption[]` payload used by the Next.js app.

## Search Contract (Current)

Primary trip fields:
- `origin` (string)
- `destination` (string)
- `date` (yyyy-mm-dd)
- `passengers` (1-9)

Advanced preferences:
- `maxPrice?` (number, USD)
- `airlinePreference?` (string)
- `priorityMode` (`time | cost | balanced`, default `balanced`)
- `maxStops?` (`0 | 1 | 2`, unset means default behavior)
- `cabinClass?` (`any | economy | premium-economy | business | first`, default `any`)

Notes:
- API route sanitizes preferences and forwards only the supported keys.
- Unsupported/empty advanced values are normalized to defaults or omitted.

## Prerequisites

- Node.js 20+
- Python 3.10+
- Nova Act API key

## Setup

### 1) Start the Python service

```bash
cd "/Users/jasonschacher/AWS Cloud Club/Nova-AI-Hackathon/services/nova_act_service"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `services/nova_act_service/.env`:

```bash
NOVA_ACT_API_KEY=your_key_here
# optional tuning:
# NOVA_ACT_STARTING_PAGE=https://www.google.com/travel/flights
# NOVA_ACT_MAX_STEPS=80
# NOVA_ACT_TIMEOUT_SECONDS=420
```

Run service:

```bash
set -a && source .env && set +a
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

### 2) Start the Next.js app

In project root create `.env.local`:

```bash
NOVA_ACT_SEARCH_ENDPOINT=http://localhost:8000/search
```

Run app:

```bash
cd "/Users/jasonschacher/AWS Cloud Club/Nova-AI-Hackathon"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quick Verification

1. Python health:

```bash
curl -s http://localhost:8000/health
```

2. Python search:

```bash
curl -i -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"trip":{"origin":"SFO","destination":"JFK","date":"2026-03-20","passengers":1},"preferences":{"priorityMode":"balanced","maxStops":1}}'
```

3. App flow:
- submit search on `/`
- wait on `/run`
- confirm redirect to `/results`

## Notes

- `deepLink` may be `null` when the source site does not expose a direct booking link in visible results.
- Search run state is currently in-memory for MVP development.
