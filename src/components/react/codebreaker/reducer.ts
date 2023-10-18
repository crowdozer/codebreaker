import {
	countMatchingElements,
	getLastNClickedValues,
	getSelectionMode,
	isTileClickable,
	getInitialState,
	isVictorious,
	isDefeated,
} from './utils'
import type { CodebreakerAction, Tile, CodebreakerState } from './types'

/**
 * Allows all required state modifications for the codebreaker game
 */
export default function reducer(
	state: CodebreakerState,
	action: CodebreakerAction,
): CodebreakerState {
	switch (action.type) {
		case 'SETUP':
			return {
				...getInitialState(),
			}
		case 'RESTART':
			return {
				...getInitialState(),
			}
		case 'ENABLE_FIRST_ROW': {
			return {
				...state,
				/**
				 * Mark the selection mode as 'row' if it isn't already
				 */
				selectionMode: 'row',
				/**
				 * Mark the first row's tiles as clickable
				 */
				board: state.board.map((row, rowIndex) => {
					if (rowIndex !== 0) return row

					return row.map((tile) => ({
						...tile,
						clickable: true,
					}))
				}),
			}
		}
		case 'MOVE':
			return {
				...state,
				moves: state.moves.concat(
					`${action.data.yCoord}-${action.data.xCoord}`,
				),
			}
		case 'UPDATE_SELECTION_MODE':
			return {
				...state,
				selectionMode: getSelectionMode(state.moves),
			}
		case 'UPDATE_BOARD':
			return {
				...state,
				board: state.board.map((rowTiles) => {
					return rowTiles.map((tile) => {
						return {
							...tile,
							clickable: isTileClickable(
								tile,
								state.moves,
								state.selectionMode,
							),
							clicked: state.moves.includes(`${tile.yCoord}-${tile.xCoord}`),
						} satisfies Tile
					})
				}),
			}
		case 'UPDATE_SEQUENCES':
			return {
				...state,
				/**
				 * This could be optimized by storing the longest sequence length
				 * in state, then calling getLastNClickedValues() outside of the loop
				 *
				 * But this isn't a very performance intensive app, so its fine
				 */
				sequences: state.sequences.map((sequence) => {
					// Nothing needs to happen if it's already solved
					if (sequence.solved) return sequence

					const seqLength = sequence.values.length
					const relevantMoves = getLastNClickedValues(
						state.board,
						state.moves,
						seqLength,
					)

					const matches = countMatchingElements(relevantMoves, sequence.values)
					sequence.progress = matches

					if (matches === seqLength) {
						sequence.solved = true
					}

					return sequence
				}),
			}
		case 'UPDATE_REMAINING_MOVES': {
			return {
				...state,
				remainingMoves: state.initialRemainingMoves - state.moves.length,
			}
		}
		case 'CHECK_VICTORY_DEFEAT':
			/**
			 * Check for the victory condition first, because you can't fail if
			 * you complete it on the last move
			 */
			if (isVictorious(state.sequences)) {
				return {
					...state,
					victory: true,
				}
			}

			/**
			 * Derive how many moves the user has left, then use that
			 * to check for the defeat condition
			 */
			const remainingMoves = state.initialRemainingMoves - state.moves.length
			if (isDefeated(remainingMoves, state.initialRemainingMoves)) {
				return {
					...state,
					defeat: true,
				}
			}

			return state
		default:
			return {
				...state,
			}
	}
}
