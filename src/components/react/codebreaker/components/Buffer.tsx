import { cn } from '@/components/react/ui'
import { useGame } from '../useCodebreaker'

export default function Buffer() {
	const {
		initialRemainingMoves,
		remainingMoves,
		victory,
		defeat,
		classes: { borderClasses },
	} = useGame()

	/**
	 * derive the highest detected index
	 */
	const detectedIndex = initialRemainingMoves - remainingMoves

	return (
		<div className="flex h-full flex-row">
			<div
				className={cn(
					'flex w-full flex-col justify-center border bg-neutral-900 p-2 xl:w-auto',
					borderClasses,
				)}
			>
				<div className="flex flex-row flex-wrap justify-start gap-1 xl:justify-center">
					{Array.from({ length: initialRemainingMoves }, (_, index) => (
						<div
							key={index}
							className={cn('border px-4 py-4', {
								// Remaining move available
								'border-neutral-800 bg-neutral-800/25': index >= detectedIndex,
								// Move is not available
								'border-yellow-800/50 bg-yellow-800/25': index < detectedIndex,
								// Victory
								'border-green-500/50 bg-green-500/25': victory,
								// Defeat
								'border-red-500/50 bg-red-500/25': defeat,
							})}
						/>
					))}
				</div>
			</div>
			<div className="grow"></div>
		</div>
	)
}
