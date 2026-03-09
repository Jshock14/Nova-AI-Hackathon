# Nova Act Search Service

This service exposes `POST /search` for the Next.js app.

## 1) Create and activate a virtualenv

```bash
cd "/Users/jasonschacher/AWS Cloud Club/Nova-AI-Hackathon/services/nova_act_service"
python3 -m venv .venv
source .venv/bin/activate
```

## 2) Install dependencies

```bash
pip install -r requirements.txt
```

## 3) Configure environment

Create a local `.env` file in this folder:

```bash
NOVA_ACT_API_KEY=your_key_here
# optional:
# NOVA_ACT_STARTING_PAGE=https://www.google.com/travel/flights
# NOVA_ACT_MAX_STEPS=80
# NOVA_ACT_TIMEOUT_SECONDS=420
```

## 4) Run the service

```bash
set -a && source .env && set +a
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

## 5) Test the service directly

```bash
curl -i -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"trip":{"origin":"SFO","destination":"JFK","date":"2026-03-20","passengers":1},"preferences":{"priorityMode":"balanced","maxStops":1}}'
```

Expected response shape:

```json
{ "options": [ { "...": "FlightOption fields" } ] }
```

## 6) Connect from Next.js

In `/Users/jasonschacher/AWS Cloud Club/Nova-AI-Hackathon/.env.local`:

```bash
NOVA_ACT_SEARCH_ENDPOINT=http://localhost:8000/search
```

Then restart Next dev server.
