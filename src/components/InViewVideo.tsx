"use client";

import { useEffect, useRef } from "react";

// How far the page has to be scrolled before any of these clips play, so
// whatever peeks in below the hero on load stays still until the visitor
// starts scrolling.
const SCROLL_START_PX = 40;

// A muted, looping clip that plays only while it's on screen and the
// visitor has started scrolling: until then it shows its poster (or first
// frame). It pauses once it leaves the screen and picks up again when it
// comes back. Use this for any video below the hero instead of a bare
// <video autoPlay>.
export function InViewVideo({
  threshold = 0.3,
  ...props
}: Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "autoPlay" | "muted" | "loop" | "playsInline"> & {
  // Share of the video that has to be visible before it plays.
  threshold?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || typeof IntersectionObserver === "undefined") return;

    let inView = false;
    const sync = () => {
      // play() returns no promise in some older browsers (and jsdom).
      if (inView && window.scrollY > SCROLL_START_PX) video.play()?.catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold },
    );
    observer.observe(video);
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sync);
    };
  }, [threshold]);

  return <video ref={ref} muted loop playsInline preload="metadata" {...props} />;
}
