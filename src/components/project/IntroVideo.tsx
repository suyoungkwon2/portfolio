// A project's intro film (1080p H.264 + AAC, a minute or two), shown above
// its portfolio-PDF slides. Files live at /images/<slug>/vid_intro.mp4 with
// a vid_intro_poster.webp beside it. The films have sound, so they wait for
// a tap instead of autoplaying, and only the poster loads up front. The
// width follows the spreads below (SlideDeck's container and per-spread cap)
// so the two line up.
export function IntroVideo({ slug, title }: { slug: string; title: string }) {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-14 md:px-6 md:pt-20">
      <div className="mx-auto w-full max-w-[calc((100svh-3rem)*1.413)]">
        <video
          src={`/images/${slug}/vid_intro.mp4`}
          poster={`/images/${slug}/vid_intro_poster.webp`}
          controls
          playsInline
          preload="none"
          aria-label={`${title}, introduction video`}
          className="aspect-video h-auto w-full rounded border border-line bg-black"
        />
      </div>
    </section>
  );
}
