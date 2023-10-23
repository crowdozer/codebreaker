import { cn } from '@/components/react/ui'
import { useCodebreaker, GameContext } from './useCodebreaker'
import Sequences from './components/Sequences'
import Status from './components/Status'
import Buffer from './components/Buffer'
import FAQ from './components/FAQ'
import GameBoard from './components/GameBoard'

export default function Codebreaker() {
	const api = useCodebreaker()
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
					<div className="grid grid-cols-1 gap-8 pt-0 xl:grid-cols-[2fr_3fr] xl:pt-8">
						{/* TIMER */}
						<div className="space-y-2">
							<div className="flex flex-row justify-between">
								<h2 className={cn('self-center text-lg', textClasses)}>
									BREACH TIME{' '}
									<span className="hidden sm:inline-block">REMAINING</span>
								</h2>
								<div
									className={cn(
										'min-w-[92px] self-center border p-2 text-center text-xl',
										borderClasses,
										textClasses,
									)}
								>
									23.58
								</div>
							</div>
							<div className={cn('border-b-4', borderClasses)}></div>
						</div>

						{/* DETECTION */}
						<div className="relative mt-8 xl:mt-0">
							<h2 className={cn('t-0 l-0 absolute -mt-8 text-lg', textClasses)}>
								BUFFER
							</h2>
							<Buffer />
						</div>

						{/* CODE MATRIX */}
						<div className={cn('border', borderClasses)}>
							<div className={cn('px-4 py-2 text-neutral-950', bgClasses)}>
								<h1 className="text-2xl">CODE MATRIX</h1>
							</div>
							<GameBoard />
						</div>

						{/* OBJECTIVES */}
						<div className="mx-auto w-full max-w-none lg:mx-0 lg:max-w-none xl:w-auto xl:max-w-sm">
							<div className={cn('border', borderClasses)}>
								<div className={cn('border-b px-4 py-2', borderClasses)}>
									<h2 className={cn('text-lg', textClasses)}>
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
					<div className={cn('mt-8 border', borderClasses)}>
						<h1
							className={cn(
								'px-2 py-1 text-xl font-bold text-neutral-950',
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
