/**
 * Text that decrypts into place: glyphs scramble, then lock in left to right.
 *
 * Re-runs whenever `text` changes, so a label swap reads like the OS
 * rewriting itself. Screen readers always get the final text.
 */

import { useEffect, useState } from "react";
import { FX } from "./config";
import { prefersReducedMotion, randomGlyph } from "./motion";

interface DecodeTextProps {
  text: string;
  /** ms to wait before decoding starts */
  delay?: number;
  /** ms from fully scrambled to fully settled */
  duration?: number;
  className?: string;
}

/**
 * Decoding label - use for headers and short status words, not paragraphs.
 */
export default function DecodeText(props: DecodeTextProps) {
  const { text, delay = 0, duration = FX.decodeMs, className } = props;
  const reduced = prefersReducedMotion();
  const [shown, setShown] = useState(() => scramble(text, 0));

  useEffect(() => {
    if (reduced) return;

    // drive the scramble off wall time so a slow frame never stretches it
    const start = performance.now() + delay;
    const id = window.setInterval(() => {
      const progress = (performance.now() - start) / duration;
      if (progress >= 1) {
        setShown(text);
        window.clearInterval(id);
        return;
      }
      setShown(scramble(text, Math.max(0, progress)));
    }, FX.scrambleFrameMs);

    return () => window.clearInterval(id);
  }, [text, delay, duration, reduced]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{reduced ? text : shown}</span>
    </span>
  );
}

function scramble(text: string, progress: number): string {
  const locked = Math.floor(progress * text.length);
  return Array.from(text, (char, i) =>
    i < locked || char === " " ? char : randomGlyph(),
  ).join("");
}
