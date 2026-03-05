"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { FlightOption, SearchPreferences, SearchRun, TripDetails } from "@/lib/types";

interface RedirectState {
  tripDetails: TripDetails | null;
  preferences: SearchPreferences;
  searchRun: SearchRun | null;
  flightOptions: FlightOption[];
  selectedOption: FlightOption | null;
  setTripDetails: (trip: TripDetails | null) => void;
  setPreferences: (prefs: SearchPreferences) => void;
  setSearchRun: (run: SearchRun | null) => void;
  setFlightOptions: (options: FlightOption[]) => void;
  setSelectedOption: (option: FlightOption | null) => void;
}

const RedirectContext = createContext<RedirectState | undefined>(undefined);

const defaultPreferences: SearchPreferences = {
  priorityMode: "balanced",
  maxStops: 1,
};

export function RedirectProvider({ children }: { children: ReactNode }) {
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [preferences, setPreferences] = useState<SearchPreferences>(defaultPreferences);
  const [searchRun, setSearchRun] = useState<SearchRun | null>(null);
  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<FlightOption | null>(null);

  return (
    <RedirectContext.Provider
      value={{
        tripDetails,
        preferences,
        searchRun,
        flightOptions,
        selectedOption,
        setTripDetails,
        setPreferences,
        setSearchRun,
        setFlightOptions,
        setSelectedOption,
      }}
    >
      {children}
    </RedirectContext.Provider>
  );
}

export function useRedirectState() {
  const ctx = useContext(RedirectContext);
  if (!ctx) {
    throw new Error("useRedirectState must be used within a RedirectProvider");
  }
  return ctx;
}

