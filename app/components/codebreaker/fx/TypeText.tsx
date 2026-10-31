/**
 * Typewriter text with a block cursor, like a shell printing a line.
 *
 * Retypes from the start whenever `text` changes. The cursor stays solid
 * while typing and blinks once the line is done.
 */

import { useEffect, useState } from "react";
import { cn } from "@/app/components/ui";
import { FX } from "./config";
import { prefersReducedMotion } from "./motion";

interface TypeTextProps {
  text: string;
  /** ms to wait before the first character */
  delay?: number;
  msPerChar?: number;
  /** show the block cursor after the text */
  cursor?: boolean;
  className?: string;
}

/**
 * Typed line - the full text is exposed to screen readers immediately.
 */
export default function TypeText(props: TypeTextProps) {
  const {
    text,
    delay = 0,
    msPerChar = FX.typeMsPerChar,
    cursor = true,
    className,
  } = props;
  const reduced = prefersReducedMotion();

  // reset the count during render when the text changes, so the new text
  // never flashes at the old length for a frame
  const [count, setCount] = useState(0);
  const [typedText, setTypedText] = useState(text);
  if (typedText !== text) {
    setTypedText(text);
    setCount(0);
  }

  useEffect(() => {
    if (reduced) return;

    const start = performance.now() + delay;
    const id = window.setInterval(() => {
      const next = Math.floor((performance.now() - start) / msPerChar);
      setCount(Math.max(0, Math.min(next, text.length)));
      if (next >= text.length) window.clearInterval(id);
    }, Math.min(msPerChar, 30));

    return () => window.clearInterval(id);
  }, [text, delay, msPerChar, reduced]);

  const shown = reduced ? text.length : count;
  const done = shown >= text.length;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
      {cursor && (
        <span
          aria-hidden="true"
          className={cn("cb-cursor", done && "cb-cursor-blink")}
        >
          █
        </span>
      )}
    </span>
  );
}
