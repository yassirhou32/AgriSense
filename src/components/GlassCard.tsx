"use client";

import { motion } from "framer-motion";

type GlassCardProps = {
  index: string;
  label: string;
  title: string;
  body: string;
  items: string[];
  className?: string;
};

/**
 * Carte glass — style capture : blur, index fantôme, label souligné, liste basse.
 */
export default function GlassCard({
  index,
  label,
  title,
  body,
  items,
  className = "",
}: GlassCardProps) {
  const firstWord = label.split(" ")[0] ?? label;
  const rest = label.slice(firstWord.length).trim();

  return (
    <motion.article
      className={`relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.75rem] border border-white/20 p-8 md:p-10 ${className}`}
      style={{
        background: "rgba(12, 16, 22, 0.45)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        borderColor: "rgba(240,193,75,0.45)",
        y: -4,
        transition: { duration: 0.25 },
      }}
    >
      {/* Index fantôme */}
      <span
        className="pointer-events-none absolute right-6 top-4 select-none display text-[5.5rem] leading-none text-white/[0.07] md:text-[7rem]"
        aria-hidden
      >
        {index}
      </span>

      {/* Label + trait sous 1er mot */}
      <div className="relative z-10">
        <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white/85">
          <span className="relative inline-block pb-2">
            {firstWord}
            <span className="absolute bottom-0 left-0 h-px w-full bg-white/70" />
          </span>
          {rest ? <span className="ml-2">{rest}</span> : null}
        </p>
      </div>

      <h3 className="relative z-10 mt-10 max-w-[18ch] text-[1.65rem] font-bold leading-[1.15] tracking-tight text-white md:text-[1.85rem]">
        {title}
      </h3>

      <p className="relative z-10 mt-5 max-w-prose flex-1 text-[14px] leading-relaxed text-white/70 md:text-[15px]">
        {body}
      </p>

      <ul className="relative z-10 mt-10 space-y-0">
        {items.map((item) => (
          <li
            key={item}
            className="border-t border-white/15 py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase text-white/80"
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
