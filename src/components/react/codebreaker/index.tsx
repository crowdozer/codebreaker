import { Accordion, Button, cn } from '@/components/react/ui'
import { useCodebreaker } from './useCodebreaker'
import { getDefeatMessage, getIdleMessage, getVictoryMessage } from './utils'
import IntrusionDetection from './components/IntrusionDetection'
import FAQ from './components/FAQ'

export default function Codebreaker() {
	const api = useCodebreaker()

	const {
		sequences,
		board,
		solution,
		remainingMoves,
		initialRemainingMoves,
		selectTile,
		moves,
		victory,
		defeat,
		restart,
	} = api

	return (
		<div className="space-y-1 lg:space-y-8">
			{/* HEADER, FAQ, SOLUTION */}
			<div className="space-y-1">
				<h1 className="bg-red-500 px-2 py-2 text-2xl text-white">
					Codebreaker
				</h1>
			</div>

			{/* DETECTION */}
			<IntrusionDetection
				victory={victory}
				defeat={defeat}
				initialRemainingMoves={initialRemainingMoves}
				remainingMoves={remainingMoves}
			/>

			{/* GAMEBOARD + GOALS */}
			<div className="mx-auto flex flex-col-reverse gap-1 lg:flex-row lg:gap-8">
				{/* GAMEBOARD */}
				<div className="space-y-1">
					<p className="bg-red-500/25 px-2 py-1 text-xl font-bold text-white ">
						SYSTEM MEMORY
					</p>
					<div className="mx-auto max-w-sm lg:mx-0 lg:max-w-none">
						<table>
							<tbody>
								{board.map((row, rowIndex) => (
									<tr key={rowIndex}>
										{row.map((col, colIndex) => (
											<td className="p-0.5" key={colIndex}>
												<Button
													classes={{
														button: cn('w-full border p-2 sm:p-3 md:p-4', {
															// First move classes
															'border-neutral-800/50 bg-neutral-800/25':
																!moves.length,
															// Clickable classes
															'border-red-800/50 bg-red-800/25 hover:bg-red-800/75 hover:border-red-800/50':
																// 'border-red-800/25 bg-red-800/10 hover:bg-red-800/25 hover:border-red-800/50':
																col.clickable,
															// Unclickable classes
															'border-red-800/50 bg-red-900/25': !col.clickable,
															// Already clicked classes
															'border-green-800/50 bg-green-900/25':
																col.clicked,
															// Victory
															'border-green-500/50 bg-green-500/25': victory,
															// Defeat
															'border-red-500/50 bg-red-500/25': defeat,
														}),
													}}
													onClick={() => selectTile(col.yCoord, col.xCoord)}
													disabled={!col.clickable || victory || defeat}
												>
													{col.value}
												</Button>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* VECTORS */}
				<div className="space-y-1">
					<p className="bg-red-500/25 px-2 py-1 text-xl font-bold text-white ">
						INJECTION VECTORS
					</p>
					<div className="mx-auto max-w-sm lg:mx-0 lg:max-w-none">
						<table>
							<tbody>
								{sequences.map((seq, seqIndex) => (
									<tr key={seqIndex}>
										{seq.values.map((hex, hexIndex) => (
											<td key={hexIndex} className="p-0.5 text-center">
												<div
													className={cn('border p-2 px-4', {
														'border-red-800/50 bg-red-800/25': !seq.solved,
														// Defeat squares
														'border-red-500/50 bg-red-500/25': defeat,
														// Solved sequences override defeat squares
														'border-green-800/50 bg-green-800/25':
															seq.solved || seq.progress > hexIndex,
														// Victory squares
														'border-green-500/50 bg-green-500/25': victory,
													})}
												>
													{hex}
												</div>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* STATUS */}
			<div>
				<p className="bg-red-500/25 px-2 py-1 text-xl font-bold text-white ">
					STATUS
				</p>
				<div className="p-4">
					{/* Defeat Msg */}
					{defeat && (
						<div>
							<p className="mb-2 text-red-500">{getDefeatMessage()}</p>
							<Button onClick={restart}>try again</Button>
						</div>
					)}
					{/* Victory Msg */}
					{victory && (
						<div>
							<p className="mb-2 text-green-500">{getVictoryMessage()}</p>
							<Button onClick={restart}>play again</Button>
						</div>
					)}
					{/* Idle Msg */}
					{!defeat && !victory && !moves.length && (
						<div>
							<p>{getIdleMessage()}</p>
						</div>
					)}
					{/* Working Msg */}
					{!defeat && !victory && moves.length > 0 && (
						<div>
							<p className="mb-2 text-yellow-500">hacking...</p>
							<Button onClick={restart}>pull the plug</Button>
						</div>
					)}
				</div>
			</div>

			<FAQ solution={solution} />
		</div>
	)
}
