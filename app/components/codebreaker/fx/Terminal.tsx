/**
 * Cosmetic terminal window: a crisp title bar over a tail of log lines.
 *
 * Purely decorative - hidden from assistive tech. Lines come from
 * useTerminalLines / useLineStream so the window itself stays dumb.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/app/components/ui";
import { FX } from "./config";
import type { LineSeed, LineTone } from "./lines";
import { prefersReducedMotion, randomBetween } from "./motion";

export interface TermLine extends LineSeed {
  id: number;
}

interface TerminalProps {
  title: string;
  lines: TermLine[];
  className?: string;
}

const TONES: Record<LineTone, string> = {
  dim: "text-neutral-500",
  text: "text-neutral-300",
  accent: "cb-accent-text",
  ok: "text-green-400",
  err: "text-red-400",
};

/**
 * Terminal window frame. Size it from the outside; the body clips to the
 * newest lines at the bottom.
 */
export default function Terminal(props: TerminalProps) {
  const { title, lines, className } = props;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex flex-col border border-neutral-700 bg-neutral-950/90 font-mono",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-700 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-neutral-500">
        <span>{title}</span>
        <span className="tracking-normal">[ _ ][ x ]</span>
      </div>
      <div className="flex min-h-0 grow flex-col justify-end overflow-hidden px-2 py-1 text-[11px] leading-snug">
        {lines.map((line) => (
          <p
            key={line.id}
            className={cn(
              "cb-line-in whitespace-pre",
              TONES[line.tone ?? "text"],
            )}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * Line buffer with a stable push(). Trims to FX.terminalMaxLines.
 * `initial` pre-fills the window (negative ids keep them clear of push ids).
 */
export function useTerminalLines(initial?: () => LineSeed[]) {
  const [lines, setLines] = useState<TermLine[]>(() =>
    (initial?.() ?? []).map((seed, i) => ({ ...seed, id: -(i + 1) })).reverse(),
  );
  const nextId = useRef(0);

  const push = useCallback((seed: LineSeed) => {
    const id = nextId.current++;
    setLines((prev) =>
      [...prev, { ...seed, id }].slice(-FX.terminalMaxLines),
    );
  }, []);

  return [lines, push] as const;
}

/**
 * Streams generated lines into a terminal at a jittered pace. `make` must
 * be stable (a module-level generator). Pre-fills `seed` lines so windows
 * never start empty.
 */
export function useLineStream(
  make: () => LineSeed,
  seed: number = 12,
): TermLine[] {
  const [lines, push] = useTerminalLines(() =>
    Array.from({ length: seed }, make),
  );

  useEffect(() => {
    // reduced motion: keep the pre-filled window, skip the live stream
    if (prefersReducedMotion()) return;

    const [min, max] = FX.backgroundStreamMs;
    let timer = 0;
    const tick = () => {
      push(make());
      timer = window.setTimeout(tick, randomBetween(min, max));
    };
    timer = window.setTimeout(tick, randomBetween(min, max));

    return () => window.clearTimeout(timer);
  }, [make, push]);

  return lines;
}
