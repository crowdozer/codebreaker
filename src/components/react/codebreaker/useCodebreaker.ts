import {
	useEffect,
	useReducer,
	createContext,
	useMemo,
	useContext,
} from 'react'
import { getInitialState, getStatus } from './utils'
import type { CodebreakerAPI } from './types'
import reducer from './reducer'

/**
 * Game context provider, so children can access the entire game state
 */
export const GameContext = createContext<CodebreakerAPI | null>(null)

/**
 * Hook to automatically acquire game context
 */
export function useGame(): CodebreakerAPI {
	return useContext(GameContext) as CodebreakerAPI
}

/**
 * Exposes all state and interactivity required for the codebreaker game
 */
export function useCodebreaker(): CodebreakerAPI {
	const [state, dispatch] = useReducer(reducer, getInitialState())

	/**
	 * Ran when the user clicks a tile. Ensures the move is valid,
	 * then if it is, adds it to the moves stack. The tiles and score
	 * conditions will be updated automatically.
	 *
	 * @param rowIndex
	 * @param colIndex
	 */
	function selectTile(rowIndex: number, colIndex: number) {
		// Ensure this is a clickable tile
		const tile = state.board[rowIndex][colIndex]
		if (!tile.clickable) return false

		dispatch({
			type: 'MOVE',
			data: { yCoord: tile.yCoord, xCoord: tile.xCoord },
		})
		dispatch({
			type: 'UPDATE_SELECTION_MODE',
		})
		dispatch({
			type: 'UPDATE_BOARD',
		})
		dispatch({ type: 'UPDATE_SEQUENCES' })
		dispatch({ type: 'UPDATE_REMAINING_MOVES' })
		dispatch({ type: 'CHECK_VICTORY_DEFEAT' })
	}

	/**
	 * setup/restart
	 */
	function initialize() {
		dispatch({ type: 'SETUP' })
		dispatch({ type: 'ENABLE_FIRST_ROW' })
	}

	/**
	 * Run setup on mount
	 */
	useEffect(() => {
		initialize()
	}, [])

	/**
	 * Finally, calculate the gamestatus string and the various color classes
	 * Memoize it, it doesn't have to happen every rerender
	 */
	const [status, bgClasses, textClasses, borderClasses] = useMemo(() => {
		const status = getStatus(state.victory, state.defeat, state.moves)
		const bgClasses = {
			'bg-yellow-300 text-neutral-950':
				status === 'working' || status === 'idle',
			'bg-red-500 text-neutral-950': status === 'defeat',
			'bg-green-400 text-neutral-950': status === 'victory',
		}
		const textClasses = {
			'text-yellow-300': status === 'working' || status === 'idle',
			'text-red-500': status === 'defeat',
			'text-green-400': status === 'victory',
		}
		const borderClasses = {
			'border-yellow-300': status === 'working' || status === 'idle',
			'border-red-500': status === 'defeat',
			'border-green-400': status === 'victory',
		}

		return [status, bgClasses, textClasses, borderClasses]
	}, [state.victory, state.defeat, state.moves])

	return {
		moves: state.moves,
		victory: state.victory,
		defeat: state.defeat,
		sequences: state.sequences,
		board: state.board,
		selectionMode: state.selectionMode,
		initialRemainingMoves: state.initialRemainingMoves,
		remainingMoves: state.remainingMoves,
		solution: state.solution,
		restart: () => initialize(),
		selectTile,
		status,
		classes: {
			bgClasses,
			borderClasses,
			textClasses,
		},
	} satisfies CodebreakerAPI
}
