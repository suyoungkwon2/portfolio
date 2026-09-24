// Tunable parameters for the landing hero background. Ported 1:1 from
// scripts/hero_video/landing_hero_draft.py so the code version started out
// identical to the Python draft. Tune these live at /dev/hero (dev only),
// then paste the copied values back here.

export type RGB = [number, number, number];

// One oscillating value: base ± amp · sin(2π·t·freq + phase).
// `freq` must stay an integer — that's what makes the last frame of a
// loop flow straight back into the first one.
export type Wave = { base: number; amp: number; freq: number; phase: number };

export type HeroBgParams = {
  loopSec: number; // one full loop, in seconds
  background: RGB;
  // Outer → inner rounded rectangles: color + size relative to the box.
  layers: { color: RGB; scale: number }[];
  center: RGB; // innermost ellipse
  centerSize: [number, number]; // ellipse (w, h) relative to the box
  boxW: Wave; // box width, fraction of canvas width
  boxH: Wave; // box height, fraction of canvas height
  // Corner radius as a fraction of the shorter side. In the draft it's
  // base + amp · (0.5 + 0.5·sin(...)), i.e. it only ever grows from base.
  radius: Wave;
  // Blur in px at a 1080px-tall frame; scaled with the real size so the
  // look doesn't change between screens.
  blur: number;
};

export const defaultHeroBgParams: HeroBgParams = {
  loopSec: 9.5,
  background: [255, 255, 255],
  layers: [
    { color: [204, 239, 245], scale: 1.18 },
    { color: [220, 214, 240], scale: 0.89 },
    { color: [251, 241, 230], scale: 0.63 },
  ],
  center: [172, 212, 251],
  centerSize: [0.48, 0.38],
  boxW: { base: 0.71, amp: 0, freq: 4, phase: 1.33 },
  boxH: { base: 0.51, amp: 0.23, freq: 2, phase: 0.31 },
  radius: { base: 0.11, amp: 0.25, freq: 4, phase: 4.92 },
  blur: 82,
};
