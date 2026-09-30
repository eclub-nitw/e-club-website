"use client";
import { useState } from "react";
import Image from "next/image";

/** Lite YouTube facade on youtube-nocookie.com: no player code or cookies until the visitor presses play. */
export function VideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (!/^[\w-]{11}$/.test(videoId)) return null;

  return (
    <div className="relative aspect-video overflow-hidden rounded-[2px] bg-surface">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block w-full">
          {/* unoptimized: YouTube's CDN thumbnail is already sized; avoids widening the remote-image allowlist */}
          <Image src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" fill unoptimized sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
          <span className="absolute inset-0 bg-club-ink/35 transition-colors group-hover:bg-club-ink/20" />
          <span aria-hidden className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-fg transition-transform duration-200 group-hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}
