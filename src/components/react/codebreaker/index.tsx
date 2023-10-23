import { cn } from '@/components/react/ui'
import { useCodebreaker, GameContext } from './useCodebreaker'
import Sequences from './components/Sequences'
import Status from './components/Status'
import Buffer from './components/Buffer'
import FAQ from './components/FAQ'
import GameBoard from './components/GameBoard'
import Timer from './components/Timer'

export default function Codebreaker() {
	const api = useCodebreaker()

	/**
	 * It should already be ready, but if it isn't, do this to be safe
	 */
	if (!api) {
		return (
			<div className="px-1 py-32 text-center xl:px-0">
				<h1 className="text-yellow-300">Establishing connection...</h1>
			</div>
		)
	}

	const { bgClasses, borderClasses, textClasses } = api.classes

	return (
		<GameContext.Provider value={api}>
			<div className={cn('px-4 py-2', bgClasses)}>
				<div className="mx-auto xl:w-[80%]">
					<h1 className="text-xl md:text-4xl">CODEBREAKER</h1>
				</div>
			</div>
			<div className="mx-auto px-1 pt-1 xl:my-8 xl:w-[80%] xl:px-0 xl:pt-0">
				{/* UI AREA */}
				<div className={cn('relative w-full border p-4', borderClasses)}>
					<div className="grid grid-cols-1 gap-4 pt-0 xl:grid-cols-[2fr_3fr] xl:gap-8 xl:pt-8">
						{/* TIMER */}
						<Timer />

						{/* DETECTION */}
						<div className="relative mt-8 xl:mt-0">
							<h2
								className={cn(
									't-0 l-0 absolute -mt-8 text-sm lg:text-lg',
									textClasses,
								)}
							>
								BUFFER
							</h2>
							<Buffer />
						</div>

						{/* CODE MATRIX */}
						<div className={cn('border', borderClasses)}>
							<div
								className={cn('px-4 py-1 text-neutral-950 lg:py-2', bgClasses)}
							>
								<h1 className="text-base lg:text-2xl">CODE MATRIX</h1>
							</div>
							<GameBoard />
						</div>

						{/* OBJECTIVES */}
						<div className="mx-auto w-full max-w-none lg:mx-0 lg:max-w-none xl:w-auto xl:max-w-sm">
							<div className={cn('border', borderClasses)}>
								<div className={cn('border-b px-4 py-2', borderClasses)}>
									<h2 className={cn('text-sm lg:text-lg', textClasses)}>
										INJECTION VECTORS
									</h2>
								</div>
								<div className="p-4">
									<Sequences />
								</div>
							</div>
						</div>
					</div>

					{/* GAME STATUS */}
					<div className={cn('mt-4 border xl:mt-8', borderClasses)}>
						<h1
							className={cn(
								'px-2 py-1 text-sm font-bold text-neutral-950 lg:text-xl',
								bgClasses,
							)}
						>
							STATUS
						</h1>
						<Status />
					</div>
				</div>
				<div className="mx-auto my-2 max-w-4xl xl:my-8">
					<FAQ solution={api.solution} />
				</div>
			</div>
		</GameContext.Provider>
	)
}
