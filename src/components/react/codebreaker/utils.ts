import type {
	CodebreakerBoard,
	CodebreakerState,
	GameStatus,
	GameStyleClasses,
	SelectionMode,
	Sequence,
	Tile,
} from './types'

/**
 * Generates the initial board state
 */
export function getInitialState(): CodebreakerState {
	/**
	 * Difficulty config
	 */

	const timeAllocated = 60
	const boardSize = 7
	const numSeq = 4
	const minSeqLen = 2
	const maxSeqLen = 4
	const numHexValues = boardSize

	/**
	 * Board generation
	 */

	const [sequences, initialBoard, solution] = generateBoard(
		boardSize,
		numSeq,
		minSeqLen,
		maxSeqLen,
		numHexValues,
	)
	const remainingMoves = getInitialRemainingMoves(sequences)

	return {
		moves: [],
		board: initialBoard,
		sequences,
		solution,
		initialRemainingMoves: remainingMoves,
		remainingMoves: remainingMoves,
		selectionMode: 'row',
		victory: false,
		defeat: false,
		status: 'idle',
		classes: getUIClasses('idle'),
		startTime: null,
		initialTimeRemaining: timeAllocated,
	} satisfies CodebreakerState
}

/**
 * Determines the number of moves the user should be allocated
 *
 * @param sequences
 */
export function getInitialRemainingMoves(sequences: Sequence[]): number {
	let count = 0

	sequences.forEach((sequence) => {
		count += sequence.values.length
	})

	// Afford them a 25% grace
	return Math.round(count * 1.25)
}

/**
 * Determines whether the given tile is clickable or not.
 *
 * @param tile the tile to be scanned
 * @param moves all moves made thus far
 * @param selectionMode the current selection constraint
 */
export function isTileClickable(
	tile: Tile,
	moves: string[],
	selectionMode: SelectionMode,
): boolean {
	if (tile.clicked) return false
	if (moves.includes(`${tile.yCoord}-${tile.xCoord}`)) return false

	/**
	 * Derive the last row index and last col index
	 * from the array of moves the user has made
	 */
	const [lastRowIndex, lastColIndex] = moves.length
		? moves[moves.length - 1].split('-').map(Number)
		: [0, 0]

	switch (selectionMode) {
		case 'col':
			return tile.xCoord === lastColIndex
		case 'row':
			return tile.yCoord === lastRowIndex
	}
}

/**
 * Returns the last n hex values that were clicked
 *
 * @param board the current board state
 * @param moves all moves made thus far
 * @param n number of values to return
 */
export function getLastNClickedValues(
	board: CodebreakerBoard,
	moves: string[],
	n: number,
): string[] {
	// slice for the trailing n entries
	// then map them to board tiles
	return moves.slice(n * -1).map((moveStr) => {
		// convert to numbers for use in indexes
		const [yCoord, xCoord] = moveStr.split('-').map(Number)

		// grab the board tiles and return
		return board[yCoord][xCoord].value
	})
}

/**
 * Generates the initial gameboard, randomly populated with no solution present
 *
 * @param size size of the board (it's square)
 * @param strings hex string source
 * @returns
 */
export function generateInitialBoard(
	size: number,
	strings: string[],
): string[][] {
	return (
		Array.from({ length: size })
			// map over each rows and establish the columns
			.map(() => {
				// populate every cell with a random hex string
				return Array.from({ length: size }).map(() => {
					return strings[Math.floor(Math.random() * strings.length)]
				})
			})
	)
}

/**
 * Generates the goal sequences the user must solve
 *
 * @param numSeq the number of sequences the user must solve
 * @param minSeqLen minimum sequence length
 * @param maxSeqLen maximum sequence length
 * @param strings hex string source
 * @returns
 */
export function generateTargetSequences(
	numSeq: number,
	minSeqLen: number,
	maxSeqLen: number,
	strings: string[],
): string[][] {
	return Array.from({ length: numSeq }).map(() => {
		const seqLen = getRandomInt(minSeqLen, maxSeqLen)

		const values = Array.from({ length: seqLen }).map(() => {
			return strings[Math.floor(Math.random() * strings.length)]
		})

		return values
	})
}

/**
 * 1. Determine how large the board is
 * 2. Generate all of the hex values that will display
 * 3. Generate the goal sequences
 * 4. Seed the board randomly
 * 5. Add an intended path
 *
 * @param size the board dimensions (square)
 * @param numSeq the number of sequences the user must solve
 * @param minSeqLen minimum sequence length
 * @param maxSeqLen maximum sequence length
 * @param numHexValues number of unique hex values that will show
 * @returns [sequences, board, solution]
 */
export function generateBoard(
	size: number,
	numSeq: number,
	minSeqLen: number,
	maxSeqLen: number,
	numHexValues: number,
): [Sequence[], CodebreakerBoard, [number, number][]] {
	// Generate the unqiue hex values
	const strings = generateNUniqueHexStrings(numHexValues)

	// Generate the initial gameboard
	const initialBoard = generateInitialBoard(size, strings)

	// Generate all of the target goal sequences
	const emptySequences = generateTargetSequences(
		numSeq,
		minSeqLen,
		maxSeqLen,
		strings,
	)

	// Generate, inject, and store the intended solution path
	const solution = injectSolution(emptySequences, initialBoard)

	// Now build the proper board/tile data structures
	const finalBoard: CodebreakerBoard = initialBoard.map((row, rowIndex) => {
		return row.map((colHex, colIndex) => {
			return {
				value: colHex,
				clickable: false,
				clicked: false,
				xCoord: colIndex,
				yCoord: rowIndex,
			} satisfies Tile
		})
	})

	// Now build the proper sequence data structures
	const sequences = emptySequences.map((seqValues) => {
		return {
			solved: false,
			progress: 0,
			values: seqValues,
		} satisfies Sequence
	})

	// We have everything we need, return it all
	return [sequences, finalBoard, solution]
}

/**
 * Shuffles an array in place
 *
 * @param array any array
 */
export function shuffleInPlace(array: any[]): void {
	array.sort(() => (Math.random() > 0.5 ? 1 : -1))
}

/**
 * Generates a solution path and injects it into the board
 *
 * @param emptySequences the desired solution sequences (i.e [[FF, 2B, 0A], [FF, AB]])
 * @param board the board, pre-seeded with random hex values
 * @returns the solution path
 */
export function injectSolution(
	emptySequences: string[][],
	board: string[][],
): [number, number][] {
	// We will first determine the intended order of the sequences,
	// shuffling it to ensure it is always unpredictable
	const clonedSequences = [...emptySequences.map((seq) => [...seq])]
	shuffleInPlace(clonedSequences)

	// Data structure to keep track of used [row,col] indexes
	const usedCells = new Set<string>()

	// Get a random row index
	function getRandomRowIndex(): number {
		return getRandomInt(0, board[colIndex].length - 1)
	}

	// Get a random column index
	function getRandomColIndex(): number {
		return getRandomInt(0, board.length - 1)
	}

	// Get a unique and random row index that hasn't been used yet
	function getUniqueRowIndex(): number {
		let rowIndex: number
		do {
			rowIndex = getRandomRowIndex()
		} while (usedCells.has(`${rowIndex}-${colIndex}`))
		return rowIndex
	}

	// Get a unique and random col index that hasn't been used yet
	function getUniqueColIndex(): number {
		let colIndex: number
		do {
			colIndex = getRandomColIndex()
		} while (usedCells.has(`${rowIndex}-${colIndex}`))
		return colIndex
	}

	// Start somewhere random on the first row
	let colIndex = getRandomColIndex()
	let rowIndex = 0

	// Allows the solution to switch between moving laterally and vertically
	let useRow = false

	// Keeps track of the generated solution
	const solution: [number, number][] = []

	// Now start injecting the solution
	clonedSequences.forEach((sequence) => {
		sequence.forEach((hex) => {
			if (useRow) {
				rowIndex = getUniqueRowIndex()
			} else {
				colIndex = getUniqueColIndex()
			}

			// inject it into the board
			board[rowIndex][colIndex] = hex

			// mark this cell as used
			usedCells.add(`${rowIndex}-${colIndex}`)

			// add this to the solution
			solution.push([rowIndex, colIndex])

			// Alternate between moving between rows and columns
			useRow = !useRow
		})
	})

	return solution
}

/**
 * Generates and returns a bunch of random but unique hex strings (i.e FF, 0A, BB)
 * @param n the number of unique strings to generate
 */
export function generateNUniqueHexStrings(n: number): string[] {
	// Create an array of numbers from 0 to 255
	const numbers = Array.from({ length: 256 }).map((_, i) => i)

	// Shuffle the numbers
	shuffleInPlace(numbers)

	// Take first n, convert them to hex, and return them
	return numbers
		.slice(0, n)
		.map((num) => num.toString(16).toUpperCase().padStart(2, '0'))
}

/**
 * Determines the selection mode based on the moves array
 * Initially it is row, then it flipflops between col/row
 */
export function getSelectionMode(moves: string[]): SelectionMode {
	if (!moves.length) return 'row'

	if (moves.length % 2 === 1) {
		return 'col'
	}

	return 'row'
}

/**
 * Returns how many uninterrupted correct matches the user has made.
 * Resets the count when an incorrect match is made.
 * Both arrays are guaranteed to be equal length.
 *
 * @param userSelection the last hex values selected by the user
 * @param goalSequence the target hex sequence
 * @returns the number of uninterrupted matches
 */
export function countMatchingElements(
	userSelection: string[],
	goalSequence: string[],
): number {
	if (!userSelection.length) return 0

	let score = 0

	for (let i = 0; i < userSelection.length; i++) {
		const wantedHex = goalSequence[score]
		// In the event of a double selection (i.e 6C 6C)
		// We need to compare to both the current & first value
		const firstHex = goalSequence[0]

		if (userSelection[i] === wantedHex) {
			score++
		} else if (userSelection[i] === firstHex) {
			score = 1
		} else {
			score = 0
		}
	}

	return score
}

/**
 * returns whether or not the user is victorious
 * @param sequences all of the victory sequences
 */
export function isVictorious(sequences: Sequence[]): boolean {
	const unsolved = sequences.some((seq) => !seq.solved)

	return !unsolved
}

/**
 * Checks if the two given dates are more than 60s apart
 */
export function hasTimeElapsed(
	latterDate: Date,
	formerDate: Date,
	seconds: number,
): boolean {
	// Get the time difference in milliseconds
	const differenceInMilliseconds = Math.abs(
		latterDate.getTime() - formerDate.getTime(),
	)

	// Convert to seconds and check if it's more than 60 seconds
	return differenceInMilliseconds / 1000 > seconds
}

/**
 * returns whether or not the user is defeated
 * @param remainingMoves how many moves the user has left
 * @param numMovesAllowed how many moves were allowed during the game
 * @param startTime when the game was started
 * @param initialTimeRemaining how much time the user was allocated
 * @returns
 */
export function isDefeated(
	remainingMoves: number,
	numMovesAllowed: number,
	startTime: null | Date,
	initialTimeRemaining: number,
): boolean {
	// If the user had moves but is out of moves
	if (numMovesAllowed && remainingMoves === 0) {
		return true
	}

	// If there is a timer that has expired
	if (startTime) {
		const currTime = new Date()
		if (hasTimeElapsed(currTime, startTime, initialTimeRemaining)) {
			return true
		}
	}

	return false
}

/**
 * returns the current game status
 * @param victory is it victory
 * @param defeat is it defeat
 * @param moves the moves array
 */
export function getStatus(
	victory: boolean,
	defeat: boolean,
	moves: any[],
): 'working' | 'victory' | 'defeat' | 'idle' {
	if (victory) return 'victory'
	if (defeat) return 'defeat'
	if (moves.length) return 'working'
	return 'idle'
}

/**
 * Returns the UI color classes based on game state
 *
 * @param status the game status
 * @returns
 */
export function getUIClasses(status: GameStatus): GameStyleClasses {
	const bgClasses = {
		'bg-neutral-800 text-neutral-200': status === 'idle',
		'bg-yellow-300 text-neutral-950': status === 'working',
		'bg-red-500 text-neutral-950': status === 'defeat',
		'bg-green-400 text-neutral-950': status === 'victory',
	}
	const textClasses = {
		'text-neutral-200': status === 'idle',
		'text-yellow-300': status === 'working',
		'text-red-500': status === 'defeat',
		'text-green-400': status === 'victory',
	}
	const borderClasses = {
		'border-neutral-600': status === 'idle',
		'border-yellow-300': status === 'working',
		'border-red-500': status === 'defeat',
		'border-green-400': status === 'victory',
	}

	return { bgClasses, textClasses, borderClasses }
}

/**
 * Formats a value in ms as "ss:ms"
 */
export function formatMilliseconds(milliseconds: number): string {
	// Convert milliseconds to total seconds
	const totalSeconds = milliseconds / 1000

	// Get whole seconds and remaining milliseconds
	const seconds = Math.floor(totalSeconds)
	// Divison by 10 to keep it two digits
	const remainingMilliseconds = Math.floor((milliseconds % 1000) / 10)

	// Pad with leading zeros
	const paddedSeconds = String(seconds).padStart(2, '0')
	const paddedMilliseconds = String(remainingMilliseconds).padStart(2, '0')

	// Format the string
	return `${paddedSeconds}:${paddedMilliseconds}`
}

/**
 * Generates a random int between min and max
 * @param min
 * @param max
 */
export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}
