"use client";

import { useEffect, useState } from "react";
import { useStill, useTypewriter } from "./motion";
import { SearchScreen } from "./ui";

// Types a query into the coded search screen, then shows No Result
// ("fail") or No Result for half a second followed by AI results
// ("recover"). Remount with a new key to replay it.
export function SearchSequence({
  query,
  emoji,
  recover = false,
}: {
  query: string;
  emoji: string;
  recover?: boolean;
}) {
  const still = useStill();
  const { typed, done } = useTypewriter(query, { instant: still });
  const [results, setResults] = useState(still && recover);

  useEffect(() => {
    if (!done || !recover || still) return;
    const timer = setTimeout(() => setResults(true), 500);
    return () => clearTimeout(timer);
  }, [done, recover, still]);

  return (
    <SearchScreen
      query={query}
      typed={typed}
      emoji={emoji}
      phase={results ? "results" : done ? "empty" : "typing"}
    />
  );
}

// The hero's loop: "cabage" fails, then recovers, every 6 seconds.
export function LoopingSearch({ query, emoji }: { query: string; emoji: string }) {
  const still = useStill();
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (still) return;
    const timer = setInterval(() => setCycle((c) => c + 1), 6000);
    return () => clearInterval(timer);
  }, [still]);
  return <SearchSequence key={cycle} query={query} emoji={emoji} recover />;
}
