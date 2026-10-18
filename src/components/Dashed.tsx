import { cn } from "@/lib/utils";

// Dashed lines drawn in SVG, so every dash ends round. CSS dashed borders and
// outlines can't do that. Both fill their nearest positioned ancestor and take
// their color from `currentColor` (a text-* class), or from `color`.

// A dashed outline around the box. `offset` pushes it outside, like
// outline-offset; `radius` is the outline's own corner radius.
export function DashedBorder({
  radius = 0,
  width = 1,
  dash = "3 4",
  offset = 0,
  color,
  className,
}: {
  radius?: number;
  width?: number;
  dash?: string;
  offset?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute overflow-visible", className)}
      style={{
        left: -offset,
        top: -offset,
        width: `calc(100% + ${offset * 2}px)`,
        height: `calc(100% + ${offset * 2}px)`,
        color,
      }}
    >
      <rect
        width="100%"
        height="100%"
        rx={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={width}
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    </svg>
  );
}

// A dashed rule along the bottom edge of the box.
export function DashedRule({
  width = 1,
  dash = "3 4",
  className,
}: {
  width?: number;
  dash?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 bottom-0 overflow-visible", className)}
      style={{ width: "100%", height: width }}
    >
      <line
        x1="0"
        x2="100%"
        y1={width / 2}
        y2={width / 2}
        stroke="currentColor"
        strokeWidth={width}
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    </svg>
  );
}
