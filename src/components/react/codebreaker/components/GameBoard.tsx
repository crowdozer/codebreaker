import { Button, cn } from '@/components/react/ui'
import { useGame } from '../useCodebreaker'

export default function GameBoard() {
	const { status, board, victory, defeat, selectTile } = useGame()

	return (
		<div className="overflow-x-auto p-2">
			<table className="mx-auto">
				<tbody>
					{board.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{row.map((col, colIndex) => (
								<td className="p-0.5" key={colIndex}>
									<Button
										classes={{
											button: cn(
												'w-full p-2.5 text-sm sm:text-base sm:p-4 border border-transparent hover:bg-unset',
												// when the user is working, clicked cells should be yellow
												// and hoverable indicators should be present
												(status === 'working' || status === 'idle') && {
													'text-yellow-300': true,
													'bg-neutral-800/50': col.clickable,
													'hover:bg-neutral-800': col.clickable && !col.clicked,
													'bg-yellow-300 text-neutral-950': col.clicked,
												},
												// when the game is won, clicked cells should be green
												status === 'victory' && {
													'bg-green-500 text-neutral-950': col.clicked,
												},
												// when the game is lost, clicked cells should be red
												status === 'defeat' && {
													'bg-red-500 text-neutral-950': col.clicked,
												},
											),
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
	)
}
