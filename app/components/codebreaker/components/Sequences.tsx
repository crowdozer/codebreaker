import { cn } from "@/app/components/ui";
import { useGame } from "../useCodebreaker";
import { useHover } from "../fx/hover";
import type { GameStatus, Sequence } from "../types";

export default function Sequences() {
  const { sequences, status } = useGame();
  const { hovered } = useHover();

  return (
    <table>
      <tbody>
        {sequences.map((seq, seqIndex) => (
          <tr key={seqIndex}>
            {seq.values.map((hex, hexIndex) => (
              <SequenceTile
                key={hexIndex}
                hex={hex}
                hexIndex={hexIndex}
                sequence={seq}
                status={status}
                hoveredValue={hovered?.value ?? null}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface SequenceTileProps {
  sequence: Sequence;
  status: GameStatus;
  hexIndex: number;
  hex: string;
  hoveredValue: string | null;
}

function SequenceTile(props: SequenceTileProps) {
  const { sequence, status, hexIndex, hex, hoveredValue } = props;

  // If the given tile is part of a partially solved sequence
  const isPartiallySolved =
    status === "working" && !sequence.solved && sequence.progress > hexIndex;

  // If the given tile is part of a fully solved sequence
  const isFullySolved = status === "working" && sequence.solved;

  // If it's game over
  const isGameOver = status === "victory" || status === "defeat";

  // The hovered matrix cell would advance this vector
  const isHinted =
    !isGameOver &&
    !sequence.solved &&
    hexIndex === sequence.progress &&
    hex === hoveredValue;

  return (
    <td key={hexIndex} className="p-0.5 text-center">
      <div
        className={cn(
          "border border-neutral-800 bg-neutral-900 px-4 py-0.5 md:py-2",
          // partial sequence solving status
          isPartiallySolved && "bg-yellow-300 text-neutral-950",
          // sequence is locked in
          isFullySolved && "cb-flash bg-green-400 text-neutral-950",
          // victory or defeat
          isGameOver && "cb-header-filled",
          // hover preview
          isHinted && "cb-hint",
        )}
      >
        {hex}
      </div>
    </td>
  );
}
