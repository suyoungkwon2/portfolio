"use client";

import { cn } from "@/lib/utils";

// The iOS light keyboard, drawn in container units so it scales with the
// phone. Sits inside an `@container` the width of the screen. `active` is the
// key being pressed right now (a letter, or " " for space).

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

const KEY = "flex items-center justify-center rounded-[1.4cqw] shadow-[0_0.3cqw_0_#898a8d]";
const LETTER = "h-[10.8cqw] w-[8.5cqw] bg-white text-[5.6cqw] text-black";
const SPECIAL = "h-[10.8cqw] bg-[#abb0bc] text-black";
const PRESSED = "bg-[#abb0bc]";

function Letter({ ch, active }: { ch: string; active?: string }) {
  return <span className={cn(KEY, LETTER, active === ch && PRESSED)}>{ch}</span>;
}

export function IosKeyboard({ active, className }: { active?: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex select-none flex-col gap-[2.9cqw] bg-[#d1d4db] px-[0.9cqw] pt-[2.2cqw] font-sans",
        className,
      )}
    >
      <div className="flex justify-center gap-[1.4cqw]">
        {[...ROWS[0]].map((c) => (
          <Letter key={c} ch={c} active={active} />
        ))}
      </div>
      <div className="flex justify-center gap-[1.4cqw]">
        {[...ROWS[1]].map((c) => (
          <Letter key={c} ch={c} active={active} />
        ))}
      </div>
      <div className="flex items-center justify-between gap-[1.4cqw]">
        <span className={cn(KEY, SPECIAL, "w-[11.2cqw]")}>
          <svg viewBox="0 0 24 24" className="size-[5.4cqw]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M12 4 4 12h4.5v7h7v-7H20z" />
          </svg>
        </span>
        <span className="flex gap-[1.4cqw]">
          {[...ROWS[2]].map((c) => (
            <Letter key={c} ch={c} active={active} />
          ))}
        </span>
        <span className={cn(KEY, SPECIAL, "w-[11.2cqw]")}>
          <svg viewBox="0 0 24 24" className="size-[5.4cqw]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M8.5 6H20v12H8.5L3 12z" />
            <path d="m11 9.5 5 5m0-5-5 5" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <div className="flex gap-[1.4cqw]">
        <span className={cn(KEY, SPECIAL, "w-[23cqw] text-[4.4cqw]")}>123</span>
        <span className={cn(KEY, LETTER, "flex-1 text-[4.4cqw]", active === " " && PRESSED)}>
          space
        </span>
        <span className={cn(KEY, "h-[10.8cqw] w-[23cqw] bg-[#007aff] text-[4.4cqw] text-white")}>
          search
        </span>
      </div>
      {/* Emoji and dictation, then the home indicator. */}
      <div className="flex items-center justify-between px-[5cqw] pt-[1cqw] text-[#50555c]">
        <svg viewBox="0 0 24 24" className="size-[7cqw]" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="10" r="0.8" fill="currentColor" />
          <circle cx="15" cy="10" r="0.8" fill="currentColor" />
          <path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 24 24" className="size-[7cqw]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M6 11a6 6 0 0 0 12 0M12 17v4" />
        </svg>
      </div>
      <div className="flex justify-center pb-[2cqw]">
        <span className="h-[1.3cqw] w-[34cqw] rounded-full bg-black" />
      </div>
    </div>
  );
}
