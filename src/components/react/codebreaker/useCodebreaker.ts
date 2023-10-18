import { useEffect, useReducer } from 'react'
import { getInitialState } from './utils'
import type { CodebreakerAPI } from './types'
import reducer from './reducer'

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
	} satisfies CodebreakerAPI
}
