// Set by PullToNavigate right before it navigates, so the next page knows
// which way to slide in (from below when pulled forward, from above when
// pulled back). A timestamp rather than a consumed flag, so reading it
// stays pure (React may render twice).
export type PullDirection = "next" | "prev";

let pulled: { at: number; direction: PullDirection } | null = null;

export const markPullNavigation = (direction: PullDirection) => {
  pulled = { at: performance.now(), direction };
};

export const arrivedByPull = (): PullDirection | null =>
  pulled && performance.now() - pulled.at < 2000 ? pulled.direction : null;
