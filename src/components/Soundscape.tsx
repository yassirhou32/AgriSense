"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type SoundApi = {
  unlocked: boolean;
  muted: boolean;
  unlock: () => Promise<void>;
  toggleMute: () => void;
  whoosh: () => void;
  chime: () => void;
  tick: () => void;
  /** Signature sonore par zone carte */
  zoneTone: (zoneId: string) => void;
  /** Voix IA : lit le texte de la zone à voix haute */
  speakZone: (text: string) => void;
};

const Ctx = createContext<SoundApi | null>(null);

export function useSound() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      unlocked: false,
      muted: true,
      unlock: async () => {},
      toggleMute: () => {},
      whoosh: () => {},
      chime: () => {},
      tick: () => {},
      zoneTone: () => {},
      speakZone: () => {},
    } as SoundApi;
  }
  return ctx;
}

/** Audio procédural — pas de fichiers, débloque au premier geste */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const ambientRef = useRef<{ stop: () => void } | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    mutedRef.current = muted;
    if (masterRef.current) {
      masterRef.current.gain.setTargetAtTime(muted ? 0 : 0.35, ctxRef.current?.currentTime ?? 0, 0.08);
    }
    if (muted && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [muted]);

  const ensure = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AC();
      const master = ctxRef.current.createGain();
      master.gain.value = mutedRef.current ? 0 : 0.35;
      master.connect(ctxRef.current.destination);
      masterRef.current = master;
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType = "sine", gain = 0.08, attack = 0.04) => {
      const ctx = ensure();
      const master = masterRef.current;
      if (!ctx || !master || mutedRef.current) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = Math.min(4200, freq * 6);
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = 0.0001;
      osc.connect(filter);
      filter.connect(g);
      g.connect(master);
      const t = ctx.currentTime;
      g.gain.exponentialRampToValueAtTime(Math.max(0.001, gain), t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    },
    [ensure]
  );

  const startAmbient = useCallback(() => {
    const ctx = ensure();
    const master = masterRef.current;
    if (!ctx || !master) return;
    ambientRef.current?.stop();

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    oscA.type = "sine";
    oscB.type = "triangle";
    oscA.frequency.value = 55;
    oscB.frequency.value = 82.5;
    filter.type = "lowpass";
    filter.frequency.value = 280;
    g.gain.value = 0.045;
    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(g);
    g.connect(master);
    oscA.start();
    oscB.start();

    // LFO léger
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoG.gain.value = 40;
    lfo.connect(lfoG);
    lfoG.connect(filter.frequency);
    lfo.start();

    ambientRef.current = {
      stop: () => {
        try {
          oscA.stop();
          oscB.stop();
          lfo.stop();
        } catch {
          /* */
        }
      },
    };
  }, [ensure]);

  const unlock = useCallback((): Promise<void> => {
    const ctx = ensure();
    if (!ctx) return Promise.resolve();
    return ctx.resume().then(() => {
      setUnlocked(true);
      startAmbient();
    });
  }, [ensure, startAmbient]);

  const whoosh = useCallback(() => {
    const ctx = ensure();
    const master = masterRef.current;
    if (!ctx || !master || mutedRef.current) return;
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    filter.type = "bandpass";
    filter.frequency.value = 600;
    g.gain.value = 0.07;
    src.buffer = buffer;
    src.connect(filter);
    filter.connect(g);
    g.connect(master);
    const t = ctx.currentTime;
    filter.frequency.linearRampToValueAtTime(1800, t + 0.2);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    src.start();
  }, [ensure]);

  const chime = useCallback(() => {
    // Passage — doux, long attack, pas agressif
    tone(392.0, 0.55, "sine", 0.032, 0.14);
    setTimeout(() => tone(523.25, 0.7, "sine", 0.028, 0.16), 110);
    setTimeout(() => tone(659.25, 0.85, "sine", 0.022, 0.18), 240);
  }, [tone]);

  const tick = useCallback(() => {
    tone(880, 0.06, "square", 0.025);
  }, [tone]);

  const zoneTone = useCallback(
    (zoneId: string) => {
      const motifs: Record<string, number[]> = {
        paris: [261.63, 329.63, 392.0],
        lyon: [220.0, 277.18, 349.23],
        marseille: [196.0, 246.94, 311.13],
        bordeaux: [293.66, 369.99, 440.0],
        psl: [261.63, 329.63, 392.0],
        larzac: [174.61, 220.0, 261.63],
        costieres: [293.66, 369.99, 440.0],
        herault: [220.0, 277.18, 349.23],
      };
      const notes = motifs[zoneId] ?? [262, 330, 392];

      const play = () => {
        setUnlocked(true);
        startAmbient();
        notes.forEach((f, i) => {
          setTimeout(() => tone(f, 0.9, "sine", 0.07, 0.08), i * 110);
        });
      };

      const ctx = ensure();
      if (!ctx || mutedRef.current) return;
      if (ctx.state === "suspended") {
        void ctx.resume().then(play);
      } else {
        play();
      }
    },
    [ensure, startAmbient, tone]
  );

  const speakZone = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || mutedRef.current) return;
      const synth = window.speechSynthesis;
      if (!synth) return;

      // Débloque aussi le Web Audio (geste utilisateur)
      void unlock();

      synth.cancel();
      // Chrome bug : parfois need resume après cancel
      try {
        synth.resume();
      } catch {
        /* */
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "fr-FR";
      utter.rate = 0.92;
      utter.pitch = 1;
      utter.volume = 1;

      const pickVoice = () => {
        const voices = synth.getVoices();
        const fr =
          voices.find((v) => /fr[-_]?FR/i.test(v.lang) && /Google|Microsoft|Hortense|Denise|Julie|Paul/i.test(v.name)) ||
          voices.find((v) => /^fr/i.test(v.lang)) ||
          voices.find((v) => /french|français/i.test(v.name));
        if (fr) utter.voice = fr;
        synth.speak(utter);
      };

      // Voices souvent chargées en async
      if (synth.getVoices().length === 0) {
        synth.onvoiceschanged = () => {
          synth.onvoiceschanged = null;
          pickVoice();
        };
        // Fallback si event ne fire pas
        setTimeout(pickVoice, 180);
      } else {
        pickVoice();
      }
    },
    [unlock]
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (!m && typeof window !== "undefined") window.speechSynthesis?.cancel();
      return !m;
    });
  }, []);

  const api: SoundApi = {
    unlocked,
    muted,
    unlock,
    toggleMute,
    whoosh,
    chime,
    tick,
    zoneTone,
    speakZone,
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function SoundDock() {
  const sound = useSound();

  if (!sound.unlocked) {
    return (
      <button
        type="button"
        onClick={sound.unlock}
        className="fixed bottom-5 left-5 z-[60] border border-[var(--gold)]/50 bg-black/70 px-4 py-2.5 text-[10px] font-semibold tracking-[0.28em] uppercase text-[var(--gold)] backdrop-blur-md hover:bg-[var(--gold)] hover:text-black"
      >
        Activer le son ▶
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={sound.toggleMute}
      className="fixed bottom-5 left-5 z-[60] border border-white/20 bg-black/70 px-4 py-2.5 text-[10px] font-semibold tracking-[0.28em] uppercase text-white/80 backdrop-blur-md hover:border-[var(--gold)] hover:text-[var(--gold)]"
    >
      {sound.muted ? "Son off" : "Son on"}
    </button>
  );
}
