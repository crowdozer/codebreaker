/**
 * In-game system log: narrates real moves, solved vectors, and status
 * changes, padded with ambient chatter so the machine feels busy.
 */

import { useEffect, useRef } from "react";
import { useGame } from "../useCodebreaker";
import type { GameStatus } from "../types";
import { FX } from "./config";
import { chatterLine, type LineSeed } from "./lines";
import { prefersReducedMotion } from "./motion";
import Terminal, { useTerminalLines } from "./Terminal";

/**
 * Terminal wired to game events. Size it from the outside.
 */
export default function SysLog({ className }: { className?: string }) {
  const { moves, board, sequences, status } = useGame();
  const [lines, push] = useTerminalLines(() => BOOT_LINES);
  const loggedStatus = useRef<GameStatus | null>(null);

  // describe the latest move here so the effect only depends on a string
  const lastMove = moves[moves.length - 1];
  const moveText = lastMove ? describeMove(lastMove, board) : null;
  const solvedCount = sequences.filter((sequence) => sequence.solved).length;

  // ambient chatter
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => push(chatterLine()), FX.syslogChatterMs);
    return () => window.clearInterval(id);
  }, [push]);

  useEffect(() => {
    if (moveText) push({ text: moveText, tone: "accent" });
  }, [moveText, push]);

  useEffect(() => {
    if (solvedCount) {
      push({ text: `vector ${String(solvedCount).padStart(2, "0")} uploaded`, tone: "ok" });
    }
  }, [solvedCount, push]);

  // the ref dedupes the dev-mode double effect run
  useEffect(() => {
    if (loggedStatus.current === status) return;
    loggedStatus.current = status;
    push(statusLine(status));
  }, [status, push]);

  return <Terminal title="sys.log" lines={lines} className={className} />;
}

const BOOT_LINES: LineSeed[] = [
  { text: "kernel 7.7.0-breach loaded", tone: "dim" },
  { text: "mounting /dev/matrix .. ok", tone: "dim" },
  { text: "ICE fingerprint cached", tone: "dim" },
  { text: "spoofing node id .. ok", tone: "dim" },
  { text: "opening uplink :7077", tone: "dim" },
  { text: "breach protocol loaded", tone: "dim" },
];

function describeMove(move: string, board: { value: string }[][]): string {
  const [y, x] = move.split("-").map(Number);
  return `> inject 0x${board[y][x].value} @ r${y + 1}:c${x + 1}`;
}

function statusLine(status: GameStatus): LineSeed {
  switch (status) {
    case "idle":
      return { text: "awaiting operator input", tone: "text" };
    case "working":
      return { text: "breach started - trace running", tone: "accent" };
    case "victory":
      return { text: "ACCESS GRANTED - daemons uploaded", tone: "ok" };
    case "defeat":
      return { text: "TRACE COMPLETE - connection burned", tone: "err" };
  }
}
