export function SearchIntro() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
      <p className="max-w-md text-base text-foreground">
        When your flight is disrupted, Redirect scans airline and OTA sites to
        find the best recovery options for you.
      </p>
      <p className="max-w-md">
        Start on the left by entering your route, date, and preferences. We’ll
        show progress and your top options here, and keep detailed flight info
        on the right.
      </p>
    </div>
  );
}

