"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useRedirectState } from "@/app/providers/redirect-provider";
import { AirportInput } from "@/components/airport-input";
import { DatePicker } from "@/components/date-picker";
import { PassengerSelector } from "@/components/passenger-selector";
import { Button } from "@/components/ui/button";

export function SearchForm() {
  const router = useRouter();
  const { tripDetails, setTripDetails, setFlightOptions, setSelectedOption } =
    useRedirectState();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTrip = useMemo(
    () =>
      tripDetails ?? {
        origin: "",
        destination: "",
        date: "",
        passengers: 1,
      },
    [tripDetails],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentTrip.origin || !currentTrip.destination || !currentTrip.date) {
      setError("Origin, destination, and date are required.");
      return;
    }

    setSubmitting(true);
    setTripDetails(currentTrip);
    // Clear any previous results
    setFlightOptions([]);
    setSelectedOption(null);

    router.push("/run");
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-sm font-semibold tracking-tight">
        Trip details
      </h2>
      <div className="grid grid-cols-1 gap-3">
        <AirportInput
          label="From"
          value={currentTrip.origin}
          onChange={(value) =>
            setTripDetails({ ...currentTrip, origin: value.toUpperCase() })
          }
          placeholder="e.g. SFO"
        />
        <AirportInput
          label="To"
          value={currentTrip.destination}
          onChange={(value) =>
            setTripDetails({ ...currentTrip, destination: value.toUpperCase() })
          }
          placeholder="e.g. JFK"
        />
        <DatePicker
          label="Departure date"
          value={currentTrip.date}
          onChange={(value) =>
            setTripDetails({ ...currentTrip, date: value })
          }
          min={today}
        />
        <PassengerSelector
          value={currentTrip.passengers}
          onChange={(value) => setTripDetails({ ...currentTrip, passengers: value })}
        />
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button
        type="submit"
        className="mt-1 w-full"
        disabled={submitting}
      >
        {submitting ? "Preparing options…" : "Search alternate flights"}
      </Button>
    </form>
  );
}

