import { cn } from '@/components/react/ui'
import { useGame } from '../useCodebreaker'
import type { GameStatus, Sequence } from '../types'

export default function Sequences() {
	const {
		sequences,
		status,
		classes: { bgClasses },
	} = useGame()

	return (
		<table>
			<tbody>
				{sequences.map((seq, seqIndex) => (
					<tr key={seqIndex}>
						{seq.values.map((hex, hexIndex) => (
							<SequenceTile
								key={hexIndex}
								bgClasses={bgClasses}
								hex={hex}
								hexIndex={hexIndex}
								sequence={seq}
								status={status}
							/>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

interface SequenceTileProps {
	sequence: Sequence
	status: GameStatus
	hexIndex: number
	hex: string
	bgClasses: any
}

function SequenceTile(props: SequenceTileProps) {
	const { sequence, status, hexIndex, hex, bgClasses } = props

	// If the given tile is part of a partially solved sequence
	const isPartiallySolved =
		status === 'working' && !sequence.solved && sequence.progress > hexIndex

	// If the given tile is part of a fully solved sequence
	const isFullySolved = status === 'working' && sequence.solved

	// If it's game over
	const isGameOver = status === 'victory' || status === 'defeat'

	return (
		<td key={hexIndex} className="p-0.5 text-center">
			<div
				className={cn(
					'border border-neutral-800 bg-neutral-800/50 p-2 px-4',
					// partial sequence solving status
					isPartiallySolved && 'bg-yellow-300 text-neutral-950',
					// sequence is locked in
					isFullySolved && 'bg-green-400 text-neutral-950',
					// victory or defeat
					isGameOver && bgClasses,
				)}
			>
				{hex}
			</div>
		</td>
	)
}
