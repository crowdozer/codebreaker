/**
 * Footer data stream: an endless, slow ribbon of hex bytes.
 */

import { useState } from "react";
import { FX } from "./config";
import { randomByte } from "./motion";

/**
 * Decorative marquee. The byte string is drawn twice so the loop is seamless.
 */
export default function DataStream({ className }: { className?: string }) {
  const [bytes] = useState(() =>
    Array.from({ length: FX.dataStreamBytes }, randomByte).join(" "),
  );

  return (
    <div aria-hidden="true" className={className}>
      <div className="cb-stream flex w-max whitespace-pre">
        <span>{bytes} </span>
        <span>{bytes} </span>
      </div>
    </div>
  );
}
