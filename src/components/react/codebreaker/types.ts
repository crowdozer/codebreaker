export interface Sequence {
	// The hex values in the sequence
	values: string[]
	// If the sequence is solved or not
	solved: boolean
	// How far the user is into solving the sequence
	progress: number
}

export interface Tile {
	value: string
	xCoord: number
	yCoord: number
	clicked: boolean
	clickable: boolean
}

export type SelectionMode = 'row' | 'col'

export type CodebreakerBoard = Tile[][]

export type CodebreakerAction =
	| {
			type: 'MOVE'
			data: { yCoord: number; xCoord: number }
	  }
	| { type: 'RESTART' }
	| { type: 'SETUP' }
	| { type: 'CHECK_VICTORY_DEFEAT' }
	| { type: 'UPDATE_SELECTION_MODE' }
	| { type: 'UPDATE_BOARD' }
	| { type: 'UPDATE_SEQUENCES' }
	| { type: 'ENABLE_FIRST_ROW' }
	| { type: 'UPDATE_REMAINING_MOVES' }

/**
 * Internal application state
 */
export interface CodebreakerState {
	/**
	 * Keeps track of all moves that have been made thus far
	 * ["xcoord1-ycoord1", "xcoord2-ycoord2", etc]
	 */
	moves: string[]

	/**
	 * Contains all of the board tiles and their states
	 */
	board: Tile[][]

	/**
	 * Contains all of the goal sequences the user must click
	 */
	sequences: Sequence[]

	/**
	 * Contains the solution path generated
	 */
	solution: [number, number][]

	/**
	 * How many moves the user is allowed
	 */
	initialRemainingMoves: number

	/**
	 * How many remaining moves the user currently has
	 */
	remainingMoves: number

	/**
	 * Whether or not the user has won
	 */
	victory: boolean

	/**
	 * Whether or not the user has lost
	 */
	defeat: boolean

	/**
	 * Whether the user can select along the current row or col
	 */
	selectionMode: SelectionMode
}

/**
 * Exposed application state, for the component
 */
export interface CodebreakerAPI {
	victory: boolean
	defeat: boolean
	// The moves that have been made so far
	moves: string[]
	// The "goal" sequences the user must solve for
	sequences: Sequence[]
	// The solution that was generated: [row,col][]
	solution: [number, number][]
	// The grid the user must solve within
	board: CodebreakerBoard
	// Whether the user must select along the current row, or col, or anywhere
	selectionMode: SelectionMode
	// How many moves the user has left
	remainingMoves: number
	// How many moves the user was allocated
	initialRemainingMoves: number
	// Allows the user to restart
	restart: () => void
	// Select a given tile
	selectTile: (row: number, col: number) => void
}
