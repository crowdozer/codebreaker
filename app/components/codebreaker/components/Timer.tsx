import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/app/components/ui";
import { useGame } from "../useCodebreaker";
import { formatMilliseconds } from "../utils";

export default function Timer() {
  const { initialTimeRemaining, startTime, status } = useGame();

  // Stores the output for the time remaining shown on the UI
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");
  const [percentRemaining, setPercentRemaining] = useState<number>(100);

  // Stores the interval used to update the UI
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Clears the interval used to update the UI
   */
  function clear() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      // console.log('Timer >> cleared interval')
    }
  }

  /**
   * Callback function used in the UI interval
   */
  const updateTimer = useCallback(() => {
    // console.log('Timer >> updateTimer()')

    // sanity check
    if (!startTime || !initialTimeRemaining) return;

    const currentMs = new Date().getTime();
    const elapsedMs = currentMs - startTime.getTime();
    const initialMs = initialTimeRemaining * 1000;
    let remainingMs = initialMs - elapsedMs;
    let percent = (remainingMs / initialMs) * 100;

    // prevent it from going negative
    if (remainingMs < 0) {
      remainingMs = 0;
      percent = 0;
    }

    setTimeRemaining(formatMilliseconds(remainingMs));
    setPercentRemaining(Math.max(0, percent));
  }, [startTime, initialTimeRemaining]);

  /**
   * Listens to the game status and manages the UI interval
   */
  useEffect(() => {
    // console.log('Timer >> useEffect()')

    switch (status) {
      case "idle":
        // console.log('Timer >> "idle"')
        // Sync display when game returns to idle (restart / initial)
        setTimeRemaining(formatMilliseconds(initialTimeRemaining * 1000));
        setPercentRemaining(100);
        break;
      case "working":
        // console.log('Timer >> "working"')
        intervalRef.current = setInterval(updateTimer, INTERVAL_LENGTH_MS);
        break;
      case "defeat": // fall through
      case "victory": // fall through
        // console.log('Timer >> "victory/defeat"')
        clear();
        break;
    }

    return () => clear();
    // initialTimeRemaining is fixed per round; status drives reset
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startCountdown lifecycle
  }, [status, updateTimer]);

  return (
    <div className="flex items-center gap-4 p-3">
      <div className="cb-display cb-accent-text min-w-[5ch] text-2xl lg:text-3xl">
        {timeRemaining}
      </div>
      <div className="h-1.5 grow bg-neutral-800">
        <div
          className={cn(
            "cb-accent-bg h-full",
            // pulse once the breach window is nearly closed
            status === "working" &&
              percentRemaining < CRITICAL_PERCENT &&
              "cb-bar-critical",
          )}
          style={{ width: `${percentRemaining}%` }}
        ></div>
      </div>
    </div>
  );
}

// The exact interval doesn't matter as long as it's weird enough to look random
const INTERVAL_LENGTH_MS = 31;

// Below this share of time left, the timer bar starts pulsing
const CRITICAL_PERCENT = 25;
