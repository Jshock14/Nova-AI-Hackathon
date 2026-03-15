from __future__ import annotations

import os
import re
from datetime import datetime, timedelta
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

try:
    from nova_act import NovaAct
except ImportError:  # pragma: no cover - depends on local environment
    NovaAct = None  # type: ignore[assignment]


class TripDetails(BaseModel):
    origin: str
    destination: str
    date: str  # yyyy-mm-dd
    passengers: int = Field(ge=1, le=9)


class SearchPreferences(BaseModel):
    maxPrice: int | None = None
    airlinePreference: str | None = None
    maxStops: int | None = Field(default=None, ge=0, le=2)
    cabinClass: Literal["any", "economy", "premium-economy", "business", "first"] = "any"
    priorityMode: Literal["time", "cost", "balanced"] = "balanced"


class SearchRequest(BaseModel):
    trip: TripDetails
    preferences: SearchPreferences


class FlightOption(BaseModel):
    id: str
    airline: str
    airlineCode: str
    departureTime: str
    arrivalTime: str
    departureAirport: str
    arrivalAirport: str
    durationMinutes: int
    stops: int
    priceCents: int
    badges: list[Literal["best-price", "fastest-arrival", "balanced-choice", "alternative-hub"]]
    layovers: list[dict] | None = None
    aircraftType: str | None = None
    bookingSource: Literal["airline", "ota"]
    deepLink: str | None = None


class SearchResponse(BaseModel):
    options: list[FlightOption]


class ExtractedFlight(BaseModel):
    airline: str
    flight_number: str | None = None
    departure_time: str
    arrival_time: str
    departure_airport: str
    arrival_airport: str
    duration_minutes: int
    stops: int = 0
    price_usd: float | None = None
    price_text: str | None = None
    booking_source: str | None = None
    deep_link: str | None = None
    aircraft_type: str | None = None
    layovers: list[dict] | None = None


class ExtractedFlights(BaseModel):
    flights: list[ExtractedFlight]


app = FastAPI(title="Nova Act Search Service", version="0.1.0")


def parse_price_cents(price_usd: float | None, price_text: str | None) -> int:
    if isinstance(price_usd, (int, float)):
        return max(0, int(round(price_usd * 100)))
    if not price_text:
        return 0
    numeric = re.sub(r"[^0-9.]", "", price_text)
    if not numeric:
        return 0
    return int(round(float(numeric) * 100))


def parse_datetime_like(value: str, fallback_date: str) -> datetime:
    raw = value.strip()
    day_offset = 0

    # Handle model outputs like "12:16AM+1" or "12:16 AM +1".
    day_match = re.search(r"\+\s*(\d+)\s*$", raw)
    if day_match:
        day_offset = int(day_match.group(1))
        raw = raw[: day_match.start()].strip()

    # Normalize compact meridiem formats like "6:20PM" -> "6:20 PM".
    raw = re.sub(r"(?i)(\d)(am|pm)$", r"\1 \2", raw)
    raw = raw.upper()

    if "T" in raw:
        try:
            parsed_iso = datetime.fromisoformat(raw.replace("Z", "+00:00"))
            return parsed_iso + timedelta(days=day_offset)
        except ValueError:
            pass
    for fmt in ("%I:%M %p", "%H:%M", "%I %p"):
        try:
            parsed = datetime.strptime(raw, fmt)
            combined = datetime.strptime(
                f"{fallback_date} {parsed.strftime('%H:%M')}",
                "%Y-%m-%d %H:%M",
            )
            return combined + timedelta(days=day_offset)
        except ValueError:
            continue
    # Keep response robust even when source format is inconsistent.
    fallback = datetime.strptime(f"{fallback_date} 00:00", "%Y-%m-%d %H:%M")
    return fallback + timedelta(days=day_offset)


def score_option(option: FlightOption, priority_mode: str) -> float:
    if priority_mode == "time":
        return float(option.durationMinutes)
    if priority_mode == "cost":
        return float(option.priceCents)
    return float(option.durationMinutes) + float(option.priceCents) / 100.0


def apply_badges(options: list[FlightOption], priority_mode: str) -> list[FlightOption]:
    if not options:
        return options

    cheapest = min(options, key=lambda o: o.priceCents)
    earliest = min(options, key=lambda o: o.arrivalTime)
    balanced = min(options, key=lambda o: score_option(o, "balanced"))

    for option in options:
        if option.id == cheapest.id:
            option.badges = ["best-price"]
        elif option.id == earliest.id:
            option.badges = ["fastest-arrival"]
        elif option.id == balanced.id:
            option.badges = ["balanced-choice"]
        elif option.stops > 0:
            option.badges = ["alternative-hub"]
        else:
            # Keep one deterministic category even for edge cases.
            option.badges = ["balanced-choice"]

    return options


def normalize_booking_source(raw_source: str | None) -> Literal["airline", "ota"]:
    if not raw_source:
        return "ota"
    lowered = raw_source.strip().lower()
    if lowered in {"airline", "carrier", "direct"}:
        return "airline"
    if lowered in {"ota", "agency", "online travel agency"}:
        return "ota"
    # Nova often returns a specific airline name here (e.g., "Frontier").
    return "airline"


def build_prompt(trip: TripDetails, prefs: SearchPreferences) -> str:
    constraints: list[str] = [
        f"origin airport code: {trip.origin}",
        f"destination airport code: {trip.destination}",
        f"travel date: {trip.date}",
        f"passengers: {trip.passengers}",
    ]
    if prefs.maxStops is not None:
        constraints.append(f"max stops: {prefs.maxStops}")
    if prefs.maxPrice is not None:
        constraints.append(f"max total price in USD: {prefs.maxPrice}")
    if prefs.airlinePreference:
        constraints.append(f"prefer airline: {prefs.airlinePreference}")
    if prefs.cabinClass != "any":
        constraints.append(f"cabin class: {prefs.cabinClass}")

    constraints_text = ", ".join(constraints)
    return (
        "Search flights and extract the best 3-5 options. "
        "Return accurate structured data only. "
        "Prioritize completing quickly: use only data visible in current results list when possible. "
        "Do not open share dialogs or deep navigation flows just to get links. "
        "If a field is not visible, set it to null or best available value and continue. "
        "Use these constraints: "
        f"{constraints_text}. "
        "For each flight include airline, flight number if visible, departure/arrival times "
        "(ISO if possible), departure/arrival airport IATA codes, duration in minutes, stops, "
        "price_usd (number) or price_text, booking source (airline or ota), deep link URL if available, "
        "aircraft type, and layovers."
    )


def run_nova_search(trip: TripDetails, prefs: SearchPreferences) -> list[FlightOption]:
    if NovaAct is None:
        raise HTTPException(
            status_code=500,
            detail="nova_act is not installed in this Python environment.",
        )

    starting_page = os.getenv("NOVA_ACT_STARTING_PAGE", "https://www.google.com/travel/flights")
    max_steps = int(os.getenv("NOVA_ACT_MAX_STEPS", "80"))
    timeout_seconds = int(os.getenv("NOVA_ACT_TIMEOUT_SECONDS", "420"))
    prompt = build_prompt(trip, prefs)

    prompt_retry = (
        prompt
        + " IMPORTANT: Output must be a JSON object with top-level key "
        + "\"flights\" (e.g., {\"flights\":[...]}). Never return a raw array."
    )

    with NovaAct(starting_page=starting_page) as nova:
        extracted: ExtractedFlights | None = None
        last_error: Exception | None = None

        for candidate_prompt in (prompt, prompt_retry):
            try:
                result = nova.act_get(
                    candidate_prompt,
                    schema=ExtractedFlights.model_json_schema(),
                    max_steps=max_steps,
                    timeout=timeout_seconds,
                )
                extracted = ExtractedFlights.model_validate(result.parsed_response)
                break
            except Exception as exc:  # pragma: no cover - depends on provider behavior
                last_error = exc
                extracted = None

        if extracted is None:
            detail = (
                "Nova Act could not produce schema-valid results. "
                "This can happen when the model returns a raw array instead of "
                "the required {\"flights\": [...]} object."
            )
            if last_error is not None:
                detail = f"{detail} Last error: {last_error}"
            raise HTTPException(status_code=502, detail=detail)

    mapped: list[FlightOption] = []
    for idx, item in enumerate(extracted.flights, start=1):
        price_cents = parse_price_cents(item.price_usd, item.price_text)
        if prefs.maxPrice is not None and price_cents > prefs.maxPrice * 100:
            continue
        if prefs.maxStops is not None and item.stops > prefs.maxStops:
            continue

        airline_code = (item.flight_number or item.airline[:3]).upper()[:6]
        departure_dt = parse_datetime_like(item.departure_time, trip.date)
        arrival_dt = parse_datetime_like(item.arrival_time, trip.date)
        if arrival_dt <= departure_dt:
            arrival_dt = arrival_dt + timedelta(days=1)
        mapped.append(
            FlightOption(
                id=f"nova-{idx}",
                airline=item.airline,
                airlineCode=airline_code,
                departureTime=departure_dt.isoformat(),
                arrivalTime=arrival_dt.isoformat(),
                departureAirport=item.departure_airport.upper(),
                arrivalAirport=item.arrival_airport.upper(),
                durationMinutes=max(1, item.duration_minutes),
                stops=max(0, item.stops),
                priceCents=price_cents,
                badges=[],
                layovers=item.layovers,
                aircraftType=item.aircraft_type,
                bookingSource=normalize_booking_source(item.booking_source),
                deepLink=item.deep_link,
            )
        )

    if not mapped:
        raise HTTPException(
            status_code=502,
            detail="Nova Act returned no flights that matched constraints.",
        )

    sorted_options = sorted(mapped, key=lambda o: score_option(o, prefs.priorityMode))[:5]
    return apply_badges(sorted_options, prefs.priorityMode)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/search", response_model=SearchResponse)
def search(payload: SearchRequest) -> SearchResponse:
    options = run_nova_search(payload.trip, payload.preferences)
    return SearchResponse(options=options)
