import type { CSSProperties } from "react";
import { Button, cn } from "@/app/components/ui";
import { useGame } from "../useCodebreaker";
import { FX } from "../fx/config";
import { useHover } from "../fx/hover";

export default function GameBoard() {
  const { status, board, victory, defeat, selectTile, selectionMode } =
    useGame();
  const { hovered, setHovered } = useHover();

  const live = status === "working" || status === "idle";

  // Picking along a row locks the next move to that cell's column (and vice
  // versa), so hovering previews the line the player would be locked to
  const preview =
    live && hovered
      ? selectionMode === "row"
        ? { axis: "col", index: hovered.x }
        : { axis: "row", index: hovered.y }
      : null;

  return (
    <div className="overflow-x-auto p-2">
      <table className="mx-auto" onMouseLeave={() => setHovered(null)}>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((col, colIndex) => {
                const active = live && col.clickable;
                const inPreview =
                  !!preview &&
                  !col.clicked &&
                  (preview.axis === "col"
                    ? col.xCoord === preview.index
                    : col.yCoord === preview.index);
                const cell = { y: col.yCoord, x: col.xCoord, value: col.value };
                // position along the active line, for the traveling wave
                const linePos = selectionMode === "row" ? col.xCoord : col.yCoord;

                return (
                  <td
                    className="p-0.5"
                    key={colIndex}
                    onMouseEnter={() => setHovered(active ? cell : null)}
                  >
                    <Button
                      classes={{
                        button: cn(
                          "cb-cell w-full p-2.5 text-sm sm:text-base sm:p-4 border border-transparent hover:bg-unset",
                          live && {
                            "text-yellow-300": !col.clicked,
                            "cb-active": active,
                            "cb-preview": inPreview && !active,
                          },
                          col.clicked && {
                            "cb-hit text-neutral-950": true,
                            "bg-yellow-300": col.strand === "pending",
                            "bg-green-500": col.strand === "complete",
                            "bg-red-500": col.strand === "broken",
                          },
                        ),
                      }}
                      buttonProps={{
                        style: {
                          "--wave-delay": `${linePos * FX.lineWaveStepMs}ms`,
                        } as CSSProperties,
                        onFocus: () => setHovered(active ? cell : null),
                        onBlur: () => setHovered(null),
                      }}
                      onClick={() => {
                        setHovered(null);
                        selectTile(col.yCoord, col.xCoord);
                      }}
                      disabled={!col.clickable || victory || defeat}
                    >
                      {col.value}
                    </Button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
