import { Accordion } from '@/components/react/ui'

export interface FAQProps {
	solution: [number, number][]
}

export default function FAQ(props: FAQProps) {
	const { solution } = props

	return (
		<div className="space-y-1">
			<Accordion label="INSTRUCTIONS">
				<div className="space-y-4 bg-neutral-800/25 p-4 font-mono text-sm">
					<p>
						You need to solve for the injection vectors by clicking memory
						addresses in the correct order. You can complete them in any order
						you like.
					</p>
					<p>
						When you complete a vector, it is locked into a success state. If
						you make an incorrect guess, any partially solved vectors are reset.
					</p>
					<p>
						The game alternates between moving laterally and moving vertically.
						Your first move can be anywhere on the top row, the second one must
						be in the same column, then the same row, then column, and so forth.
					</p>
					<p>If you run out of moves, you're detected and it's game over.</p>
					<p>Currently, the breach timer is not implemented.</p>
					<p>Inspired by the Cyberpunk 2077 hacking minigame.</p>
				</div>
			</Accordion>
			<Accordion label="SOLUTION">
				<div className="flex flex-row flex-wrap gap-1 font-mono text-sm">
					{solution.map(([row, col], index) => {
						return (
							<div
								key={index}
								className="border border-neutral-800/50 bg-neutral-800/25 px-2 py-3"
							>
								(r{row + 1}, c{col + 1})
							</div>
						)
					})}
				</div>
			</Accordion>
		</div>
	)
}
