import { cn } from '@/components/react/ui'
import { useMemo } from 'react'

export interface IntrusionDetectionProps {
	initialRemainingMoves: number
	remainingMoves: number
	victory: boolean
	defeat: boolean
}

export default function IntrusionDetection(props: IntrusionDetectionProps) {
	const { initialRemainingMoves, remainingMoves, victory, defeat } = props

	/**
	 * quickly derive the intrusion detection %
	 */
	const detectionPercent = useMemo(() => {
		const hasMoved = initialRemainingMoves !== remainingMoves
		if (!hasMoved) return 0

		const percentRemaining = (remainingMoves / initialRemainingMoves) * 100
		return Math.round(100 - percentRemaining)
	}, [initialRemainingMoves, remainingMoves])

	/**
	 * derive the highest detected index
	 */
	const detectedIndex = initialRemainingMoves - remainingMoves

	return (
		<div className="space-y-1">
			<p className="bg-red-500/25 px-2 py-1 text-xl font-bold text-white ">
				INTRUSION DETECTION - {detectionPercent}%
			</p>
			<div className="mx-auto max-w-sm lg:mx-0 lg:max-w-none">
				<div className="flex flex-row flex-wrap  gap-1 ">
					{Array.from({ length: initialRemainingMoves }, (_, index) => (
						<div
							key={index}
							className={cn('border px-6 py-4 lg:py-6', {
								// Remaining move available
								'border-neutral-800/50 bg-neutral-800/25':
									index >= detectedIndex,
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
		</div>
	)
}
