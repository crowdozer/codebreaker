import { useEffect, useReducer, createContext, useContext, useRef } from 'react'
import { getInitialState } from './utils'
import type { CodebreakerAPI } from './types'
import reducer from './reducer'

/**
 * Exposes all state and interactivity required for the codebreaker game
 */
export function useCodebreaker(): CodebreakerAPI {
	const [state, dispatch] = useReducer(reducer, getInitialState())
	const timerIntervalRef = useRef<number | null>(null)

	/**
	 * Performs all required sideeffects when the user clicks a tile
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
	 * Clears the timer interval
	 */
	function clear(): void {
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current)
			timerIntervalRef.current = null
			// console.log('useCodebreaker >> cleared interval')
		}
	}

	/**
	 * Starts the countdown timer
	 */
	function startCountdown() {
		dispatch({ type: 'START_TIMER' })

		// set the gameover time in ms
		const intervalLength = (state.initialTimeRemaining + 0.1) * 1000

		// start a timeout interval
		const interval = setTimeout(() => {
			// console.log('dispatching defeat')
			dispatch({ type: 'CHECK_VICTORY_DEFEAT' })
		}, intervalLength)

		timerIntervalRef.current = interval
	}

	/**
	 * setup/restart the game
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
	 * Listens to the game status and manages the countdown interval
	 */
	useEffect(() => {
		switch (state.status) {
			case 'idle':
				break
			case 'working':
				// console.log('useCodebreaker >> startCountdown()')
				startCountdown()
				break
			case 'defeat': // fall through
			case 'victory': // fall through
				// console.log('useCodebreaker >> clear()')
				clear()
				break
		}
	}, [state.status])

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
		status: state.status,
		classes: state.classes,
		startTime: state.startTime,
		initialTimeRemaining: state.initialTimeRemaining,
	} satisfies CodebreakerAPI
}

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
