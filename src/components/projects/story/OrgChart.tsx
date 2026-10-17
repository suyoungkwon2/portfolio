"use client";

import { motion } from "framer-motion";
import { Reveal, StickyScene } from "./motion";
import { Chapter, SectionHeader, wrap } from "./ui";

// Who I worked between: the C-level above, the project team around me, and
// the business teams below. Drawn in a 500 × 440 box that scales with its
// column. Both groups keep the same 24px padding on every side of their chips.

// What each role lights up in the chart while it's the newest one.
export type RoleCue = "me" | "team" | "links" | "request";

type OrgNode = { label: string; cx: number; cy: number; w: number; me?: boolean; team?: boolean };
const NODE_H = 52;
const GROUP_PAD = 24;
const GROUP_H = NODE_H + GROUP_PAD * 2;
const TEAM_Y = 200;
const BELOW_Y = 380;
const ROW_X = 30;
const CHIP_GAP = 12;
const TOP_NODES: OrgNode[] = [
  { label: "C-Level", cx: 110, cy: 46, w: 160 },
  { label: "AI PM (Me)", cx: 110, cy: TEAM_Y, w: 160, me: true, team: true },
  { label: "ML Engineer", cx: 270, cy: TEAM_Y, w: 136, team: true },
  { label: "BE Engineer", cx: 410, cy: TEAM_Y, w: 120, team: true },
];
// Two-way links, each a pair of dashed arrows (down, up) either side of AI PM.
const ORG_LINKS = [
  { y1: 46 + NODE_H / 2, y2: TEAM_Y - NODE_H / 2 },
  { y1: TEAM_Y + NODE_H / 2, y2: BELOW_Y - GROUP_H / 2 },
];
const LINK_X = [86, 134];
const DASH = 8;

const BLINK = { opacity: [1, 0.3, 1, 0.3, 1] };

export type OrgTeam = { label: string; w: number };

export function OrgChart({
  below,
  cue,
  beat,
  label,
}: {
  // The teams in the bottom row, left to right, with their chip widths.
  below: readonly OrgTeam[];
  cue?: RoleCue;
  beat: number;
  label: string;
}) {
  // Bottom chips sit side by side from the row's left edge.
  const belowNodes = below.reduce<OrgNode[]>((nodes, t) => {
    const prev = nodes[nodes.length - 1];
    const left = prev ? prev.cx + prev.w / 2 + CHIP_GAP : ROW_X;
    return [...nodes, { label: t.label, cx: left + t.w / 2, cy: BELOW_Y, w: t.w }];
  }, []);
  const last = belowNodes[belowNodes.length - 1];
  // Groups around a row of chips: x from the first chip's left to the last's right.
  const groups = [
    { x1: ROW_X, x2: 470, cy: TEAM_Y, filled: true },
    { x1: ROW_X, x2: last.cx + last.w / 2, cy: BELOW_Y, filled: false },
  ];
  const nodes = [...TOP_NODES, ...belowNodes];
  const blinks = (n: OrgNode) => (cue === "me" && n.me) || (cue === "team" && n.team);
  return (
    <svg
      viewBox="0 0 500 440"
      role="img"
      aria-label={label}
      className="font-display w-full text-ink"
    >
      <defs>
        <marker
          id="org-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M1 1 9 5 1 9" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1" />
        </marker>
        <marker
          id="org-arrow-accent"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M1 1 9 5 1 9" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
        </marker>
      </defs>

      {groups.map(({ x1, x2, cy, filled }) => (
        <motion.rect
          key={`${beat}-${cy}`}
          initial={{ opacity: 1 }}
          animate={cue === "team" && filled ? BLINK : { opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          x={x1 - GROUP_PAD}
          y={cy - GROUP_H / 2}
          width={x2 - x1 + GROUP_PAD * 2}
          height={GROUP_H}
          rx={GROUP_H / 2}
          fill={filled ? "var(--color-paper-2)" : "none"}
          stroke={filled ? "none" : "var(--color-line)"}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Alignment: the dashes run the way each arrow points, briefly. A
          request from below (`request`) draws its up arrow bold in the accent. */}
      {ORG_LINKS.map(({ y1, y2 }, link) =>
        [
          [LINK_X[0], y1 + 4, y2 - 4],
          [LINK_X[1], y2 - 4, y1 + 4],
        ].map(([x, from, to]) => {
          const asked = cue === "request" && link === 1 && x === LINK_X[1];
          return (
            <motion.line
              key={`${beat}-${x}-${y1}`}
              x1={x}
              y1={from}
              x2={x}
              y2={to}
              stroke={asked ? "var(--color-accent)" : "var(--color-ink-muted)"}
              strokeWidth={asked ? 2.5 : 1}
              vectorEffect="non-scaling-stroke"
              strokeDasharray={`${DASH / 2} ${DASH / 2}`}
              markerEnd={asked ? "url(#org-arrow-accent)" : "url(#org-arrow)"}
              initial={{ strokeDashoffset: 0 }}
              animate={
                cue === "links" || asked ? { strokeDashoffset: -DASH * 6 } : { strokeDashoffset: 0 }
              }
              transition={{ duration: 2, ease: "linear" }}
              className="transition-[stroke] duration-300"
            />
          );
        }),
      )}

      {nodes.map((n) => (
        <motion.g
          key={`${beat}-${n.label}`}
          initial={{ opacity: 1 }}
          animate={blinks(n) ? BLINK : { opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <rect
            x={n.cx - n.w / 2}
            y={n.cy - NODE_H / 2}
            width={n.w}
            height={NODE_H}
            rx={NODE_H / 2}
            fill={n.me ? "var(--color-accent)" : "var(--color-paper)"}
            stroke={n.me ? "none" : "var(--color-ink)"}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={n.cx}
            y={n.cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="15"
            fontWeight="500"
            fill={n.me ? "var(--color-paper)" : "currentColor"}
          >
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

export type Role = { title: string; cue: RoleCue; body: React.ReactNode };

// 03 Role and Responsibility: arrives on the header and chart alone, then
// one role per scroll, plus a spare step so a quick scroll can't skip the
// last. The newest role cues the chart.
export function RolesChapter({
  headline,
  roles,
  below,
  orgLabel,
}: {
  headline: string;
  roles: readonly Role[];
  below: readonly OrgTeam[];
  orgLabel: string;
}) {
  return (
    <Chapter id="roles" label="03 Role and Responsibility" className="border-t border-line">
      <StickyScene steps={roles.length + 2} label="My roles, one at a time">
        {({ step, live }) => {
          // Step 0 is the empty arrival; step n shows roles 1…n. The spare
          // last step cues nothing new.
          const revealed = live ? step : roles.length;
          const current = live && step >= 1 && step <= roles.length ? step - 1 : -1;
          return (
            <div className={wrap}>
              <SectionHeader label="03 ROLE AND RESPONSIBILITY" headline={headline} />
              <div className="mt-12 grid items-center gap-12 md:grid-cols-[1fr_1.05fr] md:gap-16">
                <ol className="flex flex-col gap-7">
                  {roles.map((role, i) => {
                    const shown = i < revealed;
                    return (
                      <motion.li
                        key={role.title}
                        aria-hidden={!shown || undefined}
                        initial={false}
                        animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="flex flex-col gap-1.5"
                      >
                        <h3 className="font-display text-lg font-medium text-ink md:text-xl">
                          {role.title}
                        </h3>
                        <p className="text-base leading-relaxed text-ink-muted md:text-lg">
                          {role.body}
                        </p>
                      </motion.li>
                    );
                  })}
                </ol>
                <Reveal>
                  <OrgChart
                    below={below}
                    cue={roles[current]?.cue}
                    beat={current}
                    label={orgLabel}
                  />
                </Reveal>
              </div>
            </div>
          );
        }}
      </StickyScene>
    </Chapter>
  );
}
