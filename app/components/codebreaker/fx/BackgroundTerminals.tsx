/**
 * Cosmetic terminal windows parked behind the game frame on wide screens.
 * The page stays still; only the terminal text streams.
 */

import { useCallback, useEffect, useRef } from "react";
import { useGame } from "../useCodebreaker";
import { hexDumpLine, netTraceLine, processLine } from "./lines";
import Terminal, { useLineStream } from "./Terminal";

/**
 * Fixed, non-interactive backdrop. Hidden below xl where there is no margin.
 */
export default function BackgroundTerminals() {
  const { board } = useGame();
  const boardRef = useRef(board);
  // Only the generator reads the latest board; retained lines hold coordinates.
  useEffect(() => { boardRef.current = board; }, [board]);
  const makeMemoryLine = useCallback(() => hexDumpLine(boardRef.current), []);
  const mem = useLineStream(makeMemoryLine, 16);
  const proc = useLineStream(processLine, 10);
  const net = useLineStream(netTraceLine, 12);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 hidden opacity-40 xl:block"
    >
      <Terminal title="mem.dump" lines={mem} board={board} className="absolute top-[12%] left-[2%] h-72 w-80" />
      <Terminal title="proc.top" lines={proc} className="absolute top-[48%] right-[2%] h-56 w-96" />
      <Terminal title="net.trace" lines={net} className="absolute bottom-[4%] left-[6%] h-48 w-72" />
    </div>
  );
}
