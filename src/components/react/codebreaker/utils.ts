import { getRandomInt } from '@/lib/random-int'
import type {
	CodebreakerBoard,
	CodebreakerState,
	SelectionMode,
	Sequence,
	Tile,
} from './types'

/**
 * Generates the initial board state
 */
export function getInitialState(): CodebreakerState {
	const [sequences, initialBoard, solution] = generateBoard()
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
	return moves.slice(n * -1).map((moveStr) => {
		const [yCoord, xCoord] = moveStr.split('-').map(Number)

		return board[yCoord][xCoord].value
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
	size: number = 7,
	numSeq: number = 3,
	minSeqLen: number = 2,
	maxSeqLen: number = 4,
	numHexValues: number = 9,
): [Sequence[], CodebreakerBoard, [number, number][]] {
	// Construct the empty board
	const emptyBoard = [...new Array(size)].map((row) => [...new Array(size)])

	// Generate the unqiue hex values
	const strings = generateNUniqueHexStrings(numHexValues)

	// Generate all of the target goal sequences
	const emptySequences: string[][] = [...new Array(numSeq)].map(() => {
		const seqLen = getRandomInt(minSeqLen, maxSeqLen)

		const values = [...new Array(seqLen)].map(() => {
			return strings[Math.floor(Math.random() * strings.length)]
		})

		return values
	})

	// Populate the board with random entries from the strings array
	for (let i = 0; i < emptyBoard.length; i++) {
		const row = emptyBoard[i]
		for (let j = 0; j < row.length; j++) {
			emptyBoard[i][j] = strings[Math.floor(Math.random() * strings.length)]
		}
	}

	// Now pre-generate an intended solution (i.e row1col2, row5col2)
	// that covers all of the sequences with no extra steps
	const solution = injectSolution(emptySequences, emptyBoard)

	// Now build the proper board/tile structures
	const finalBoard: CodebreakerBoard = emptyBoard.map((row, rowIndex) => {
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

	// Now build the proper sequence structures
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
	const shuffledSequences = [...emptySequences.map((seq) => [...seq])].sort(
		() => (Math.random() > 0.5 ? 1 : -1),
	)

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
	shuffledSequences.forEach((sequence) => {
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
	const numbers = Array.from({ length: 256 }, (_, i) => i)

	// Shuffle the array
	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
	}

	// Take first 'n' numbers, convert them to hexadecimal strings, and return them
	return numbers
		.slice(0, n)
		.map((num) => num.toString(16).toUpperCase().padStart(2, '0'))
}

/**
 * Determines the selection mode based on the moves array
 *
 * Initially it is null, then it flipflops between col/row, starting with col
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
 * returns whether or not the user is defeated
 * @param remainingMoves how many moves the user has left
 * @param numMovesAllowed how many moves were allowed during the game
 * @returns
 */
export function isDefeated(
	remainingMoves: number,
	numMovesAllowed: number,
): boolean {
	// if numMovesAllowed = 0, the game has not started
	return numMovesAllowed && remainingMoves === 0 ? true : false
}

const victoryMessages = [
	"Firewall? More like fire-fall! We're in!",
	"I've got root access, and suddenly, I'm in the mood for a root beer!",
	"Ah, encryption. The digital chastity belt. But guess what? I've got the key!",
	"Password? You mean 'pass-sword,' because we just cut right through it!",
	'Mainframe, meet my alter ego: Mainfreak!',
	"Looks like we've just RSVP'd to the Admin Party, and we didn't even bring a gift!",
	"The only thing more secure than this system is my grandma's cookie jar—and I cracked that when I was five!",
	'Ah, the sound of bypassing security. Music to my ears!',
	"They should really update their Terms of Service to include 'No Hackers Allowed.' Too late now!",
	'System security just asked me for a dance, and I led the whole way!',
]

const defeatMessages = [
	'Oops, looks like we just got the VIP backstage pass to the Firewall Concert!',
	"Ah, we've been caught! Someone call the Internet police!",
	'Red alert! Red alert! Abandon ship! Or, you know, just close the browser.',
	"Well, well, well, if it isn't Captain Obvious saying we've been detected!",
	'Busted? Time for Operation Ghost Protocol: minimize window and act natural.',
	"Ah, they've detected us! Time to switch from hacking to snacking.",
	'Intrusion detected? More like invitation declined!',
	"We've got company, and I don't think they're here to deliver pizza.",
	"It's not a bug, it's a feature! A feature that tells them we're here, unfortunately.",
	'Whoa, we tripped the alarm! Do we get a prize?',
]

const idleMessages = [
	"Tick-tock! The keyboard's not going to type itself, you know!",
	'So... are we window shopping, or are we going to break the glass?',
	"Hey, we're not here for the screensaver! Let's get cracking!",
	"The firewall's not going to take a coffee break, but we will if you don't get moving!",
	"What are you waiting for? An invitation from the server? Let's go!",
	'If you wait any longer, even the antivirus will get bored!',
	"Don't make me put up an 'Under Construction' GIF — start the hack!",
	"You do know that 'idle hands are the devil's playground,' right? Get to work!",
	"In the time it's taking you to start, I could've solved a CAPTCHA! Twice!",
	"Do you need a 'Ready, Set, Hack!' countdown, or what?",
]

export function getVictoryMessage(): string {
	return victoryMessages[getRandomInt(0, victoryMessages.length - 1)]
}

export function getDefeatMessage(): string {
	return defeatMessages[getRandomInt(0, defeatMessages.length - 1)]
}

export function getIdleMessage(): string {
	return idleMessages[getRandomInt(0, idleMessages.length - 1)]
}
