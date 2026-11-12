// SleepVice intro film (1080p H.264 + AAC, ~2 min), shown above the
// portfolio-PDF slides. It has sound, so it waits for a tap instead of
// autoplaying, and only the poster loads up front. Its width follows the
// spreads below (SlideDeck's container and per-spread cap) so the two line up.
export function SleepviceVideo() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-14 md:px-6 md:pt-20">
      <div className="mx-auto w-full max-w-[calc((100svh-3rem)*1.413)]">
        <video
          src="/images/sleepvice/vid_intro.mp4"
          poster="/images/sleepvice/vid_intro_poster.webp"
          controls
          playsInline
          preload="none"
          aria-label="SleepVice introduction video"
          className="aspect-video h-auto w-full rounded border border-line bg-black"
        />
      </div>
    </section>
  );
}
