"use client";

import { useEffect, useRef, useState } from "react";

// Copies the address instead of opening a mail client, which many visitors
// don't have set up. Falls back to a hidden textarea + execCommand where
// the async Clipboard API is unavailable or blocked.
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}

export function CopyEmailLink({ email, className }: { email: string; className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleClick() {
    setStatus((await copyText(email)) ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <span className="relative inline-flex justify-center">
      <button type="button" onClick={handleClick} className={className}>
        Email
      </button>
      <span
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute top-full mt-1 whitespace-nowrap text-xs text-ink-muted transition-opacity duration-200 ${
          status === "idle" ? "opacity-0" : "opacity-100"
        }`}
      >
        {status === "copied" ? "Copied to clipboard" : status === "failed" ? email : ""}
      </span>
    </span>
  );
}
