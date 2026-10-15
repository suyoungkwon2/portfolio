"use client";

import { useEffect, useState } from "react";
import { useStill, useTypewriter } from "./motion";
import { SearchScreen } from "./ui";

// Types a query into the coded search screen, then shows No Result
// ("fail") or No Result for `recoverDelay` ms followed by AI results
// ("recover"; 0 goes straight to results). Remount with a new key to replay it.
export function SearchSequence({
  query,
  emoji,
  recover = false,
  recoverDelay = 500,
}: {
  query: string;
  emoji: string;
  recover?: boolean;
  recoverDelay?: number;
}) {
  const still = useStill();
  const { typed, done } = useTypewriter(query, { instant: still });
  const [results, setResults] = useState(still && recover);

  useEffect(() => {
    if (!done || !recover || still || recoverDelay === 0) return;
    const timer = setTimeout(() => setResults(true), recoverDelay);
    return () => clearTimeout(timer);
  }, [done, recover, still, recoverDelay]);
  const showResults = results || (recover && done && recoverDelay === 0);

  return (
    <SearchScreen
      query={query}
      typed={typed}
      emoji={emoji}
      phase={showResults ? "results" : done ? "empty" : "typing"}
    />
  );
}
