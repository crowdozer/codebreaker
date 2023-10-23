import { cn } from '@/components/react/ui'
import { useGame } from '../useCodebreaker'

export default function Timer() {
	const {
		classes: { borderClasses, textClasses },
	} = useGame()

	return (
		<div
			className={cn(
				'min-w-[92px] self-center border p-2 text-center text-xl',
				borderClasses,
				textClasses,
			)}
		>
			23.58
		</div>
	)
}
