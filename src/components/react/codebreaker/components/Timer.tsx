import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/components/react/ui'
import { useGame } from '../useCodebreaker'
import { formatMilliseconds } from '../utils'

export default function Timer() {
	const {
		initialTimeRemaining,
		startTime,
		status,
		classes: { borderClasses, textClasses },
	} = useGame()

	// Stores the output for the time remaining shown on the UI
	const [timeRemaining, setTimeRemaining] = useState<string>('00:00')
	const [percentRemaining, setPercentRemaining] = useState<number>(100)

	// Stores the interval used to update the UI
	const intervalRef = useRef<number | null>(null)

	/**
	 * Clears the interval used to update the UI
	 */
	function clear() {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = null
			// console.log('Timer >> cleared interval')
		}
	}

	/**
	 * Callback function used in the UI interval
	 */
	const updateTimer = useCallback(() => {
		// console.log('Timer >> updateTimer()')

		// sanity check
		if (!startTime || !initialTimeRemaining) return

		const currentMs = new Date().getTime()
		const elapsedMs = currentMs - startTime.getTime()
		const initialMs = initialTimeRemaining * 1000
		let remainingMs = initialMs - elapsedMs
		let percent = (remainingMs / initialMs) * 100

		// prevent it from going negative
		if (remainingMs < 0) {
			remainingMs = 0
			percent = 0
		}

		setTimeRemaining(formatMilliseconds(remainingMs))
		setPercentRemaining(Math.max(0, percent))
	}, [startTime, initialTimeRemaining])

	/**
	 * Listens to the game status and manages the UI interval
	 */
	useEffect(() => {
		// console.log('Timer >> useEffect()')

		switch (status) {
			case 'idle':
				// console.log('Timer >> "idle"')
				setTimeRemaining(formatMilliseconds(initialTimeRemaining * 1000))
				setPercentRemaining(100)
				break
			case 'working':
				// console.log('Timer >> "working"')
				intervalRef.current = setInterval(updateTimer, INTERVAL_LENGTH_MS)
				break
			case 'defeat': // fall through
			case 'victory': // fall through
				// console.log('Timer >> "victory/defeat"')
				clear()
				break
		}

		return () => clear()
	}, [status, updateTimer])

	return (
		<div className="space-y-2">
			<div className="flex flex-row justify-between">
				<h2 className={cn('self-center text-lg', textClasses)}>
					BREACH TIME <span className="hidden sm:inline-block">REMAINING</span>
				</h2>
				<div className="flex flex-col gap-2">
					<div
						className={cn(
							'min-w-[92px] self-center border p-2 text-center text-xl',
							borderClasses,
							textClasses,
						)}
					>
						{timeRemaining}
					</div>
				</div>
			</div>
			<div
				className={cn('border-b-4', borderClasses)}
				style={{ width: `${percentRemaining}%` }}
			></div>
		</div>
	)
}

// The exact interval doesn't matter as long as it's weird enough to look random
const INTERVAL_LENGTH_MS = 31
