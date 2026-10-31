import { cn } from "@/app/components/ui";
import { useGame } from "../useCodebreaker";
import { useHover } from "../fx/hover";

export default function Buffer() {
  const {
    initialRemainingMoves,
    remainingMoves,
    moves,
    board,
    status,
    victory,
    defeat,
  } = useGame();
  const { hovered } = useHover();

  /**
   * derive the highest detected index
   */
  const detectedIndex = initialRemainingMoves - remainingMoves;

  // hex values already pushed into the buffer, in order
  const values = moves.map((move) => {
    const [y, x] = move.split("-").map(Number);
    return board[y][x].value;
  });

  const live = status === "working" || status === "idle";

  return (
    <div className="flex flex-row flex-wrap gap-1 p-3">
      {Array.from({ length: initialRemainingMoves }, (_, index) => {
        const used = index < detectedIndex;
        // ghost of the hovered cell in the slot it would fill
        const ghost = live && !!hovered && index === detectedIndex;

        return (
          <div
            key={index}
            className={cn(
              "grid h-9 w-9 place-items-center border text-xs xl:w-10",
              {
                // Remaining move available
                "border-neutral-800 bg-neutral-900": !used && !ghost,
                // Move is not available
                "cb-slot-used border-yellow-300/50 bg-yellow-300/10 text-yellow-300":
                  used,
                // Victory
                "border-green-500/50 bg-green-500/15 text-green-400":
                  victory && used,
                // Defeat
                "border-red-500/50 bg-red-500/15 text-red-400": defeat && used,
                // Hover preview
                "cb-ghost border-dashed border-neutral-500 text-neutral-400":
                  ghost,
              },
            )}
          >
            {used ? values[index] : ghost ? hovered?.value : null}
          </div>
        );
      })}
    </div>
  );
}
