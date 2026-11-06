"use client";

import { useCallback, useState } from "react";
import SiteVideo from "./VideoBackground";
import WaveIntro from "./WaveIntro";
import { SoundProvider, SoundDock } from "./Soundscape";

export default function IntroGate({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);

  return (
    <SoundProvider>
      <SiteVideo />
      {!done && <WaveIntro onDone={finish} />}
      {done && <SoundDock />}
      <div className={done ? "opacity-100" : "pointer-events-none opacity-0"}>
        {children}
      </div>
    </SoundProvider>
  );
}
