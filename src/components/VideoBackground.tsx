"use client";

import { useEffect, useRef } from "react";

const SRC = "/26196-357512354.mp4";

/**
 * Fix anti-bug vidéo :
 * - JAMAIS de seek (currentTime += …) → cause principale des freezes
 * - un seul player, muted, loop
 * - reprise douce si paused, sans spam scroll
 */
export default function SiteVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let alive = true;
    let trying = false;

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.loop = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "true");

    const playSafe = () => {
      if (!alive || trying) return;
      if (document.visibilityState !== "visible") return;
      if (!el.paused && !el.ended) return;
      trying = true;
      const p = el.play();
      if (p) {
        p.catch(() => {}).finally(() => {
          trying = false;
        });
      } else {
        trying = false;
      }
    };

    const onVis = () => {
      if (document.visibilityState === "visible") playSafe();
    };

    el.addEventListener("canplay", playSafe);
    el.addEventListener("loadeddata", playSafe);
    // Si le navigateur met pause tout seul, on reprend UNE fois
    el.addEventListener("pause", () => {
      if (alive && document.visibilityState === "visible") {
        window.setTimeout(playSafe, 200);
      }
    });
    el.addEventListener("ended", playSafe);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", playSafe);

    // Watchdog SANS seek — uniquement play() si vraiment en pause
    const id = window.setInterval(() => {
      if (!alive) return;
      if (document.visibilityState !== "visible") return;
      if (el.paused || el.ended) playSafe();
    }, 2000);

    playSafe();

    return () => {
      alive = false;
      clearInterval(id);
      el.removeEventListener("canplay", playSafe);
      el.removeEventListener("loadeddata", playSafe);
      el.removeEventListener("ended", playSafe);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", playSafe);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050805]"
    >
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
    </div>
  );
}
