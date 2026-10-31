/**
 * Terminal log content, including live board-cell references for mem.dump.
 */

import type { CodebreakerBoard } from '../types'
import { pick, randomBetween } from './motion'

export type LineTone = 'dim' | 'text' | 'accent' | 'ok' | 'err'

export interface LineSeed {
	text: string
	tone?: LineTone
	cells?: { y: number; x: number }[]
}

const DAEMONS = ['icebreakd', 'netwatchd', 'memsweep', 'kproxy', 'ghostlink', 'cronjack', 'daemon.sys']
const VERBS = ['handshake', 'probe', 'sync', 'rotate keys', 'flush cache', 'trace route', 'heartbeat']
const RESULTS: [string, LineTone][] = [
	['ok', 'ok'],
	['ok', 'ok'],
	['ok', 'ok'],
	['retry', 'dim'],
	['timeout', 'err'],
]
const CHATTER = [
	'scanning subnet 10.7.0.0/16',
	'ICE layer 2 stable',
	'buffer integrity nominal',
	'masking trace signature',
	'spoofing node id',
	'listening on :7077',
	'packet loss 0.0%',
	'watchdog idle',
]

/**
 * A hex dump row: "0x00A0  4F 2B 9C ..."
 */
export function hexDumpLine(board: CodebreakerBoard): LineSeed {
	const addr = randomBetween(0, 0xffff).toString(16).toUpperCase().padStart(4, '0')
	const tiles = board.flat()
	const cells = Array.from({ length: 8 }, () => {
		const tile = pick(tiles)
		return { y: tile.yCoord, x: tile.xCoord }
	})
	return { text: `0x${addr}  `, tone: 'dim', cells }
}

/**
 * A process line: "pid 4121 icebreakd   handshake .. ok"
 */
export function processLine(): LineSeed {
	const [result, tone] = pick(RESULTS)
	const pid = String(randomBetween(1000, 9999))
	return { text: `${pid} ${pick(DAEMONS).padEnd(10)} ${pick(VERBS)} .. ${result}`, tone }
}

/**
 * A network trace line: "-> 172.16.4.12:443  rtt 38ms"
 */
export function netTraceLine(): LineSeed {
	const ip = `${randomBetween(10, 192)}.${randomBetween(0, 255)}.${randomBetween(0, 255)}.${randomBetween(1, 254)}`
	const port = pick(['22', '80', '443', '7077', '8080'])
	const dir = Math.random() > 0.5 ? '->' : '<-'
	return { text: `${dir} ${ip}:${port}  rtt ${randomBetween(4, 180)}ms`, tone: 'text' }
}

/**
 * Ambient system chatter for the in-game log.
 */
export function chatterLine(): LineSeed {
	return { text: pick(CHATTER), tone: 'dim' }
}
