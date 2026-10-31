/**
 * Match every suffix prefix so overlaps and repeated values keep their identity.
 */
import type { Sequence } from './types'

/** Replay the buffer, preserving earned completions and current pending strands. */
export function strandProgress(values: string[], targets: Sequence[]) {
	const sequences = targets.map((target) => ({ ...target, solved: false, progress: 0 }))
	const completed = new Set<number>()
	let pending = new Set<number>()
	for (let end = 1; end <= values.length; end++) {
		pending = new Set<number>()
		for (const sequence of sequences) {
			if (sequence.solved) continue
			const lengths: number[] = []
			for (let length = 1; length <= Math.min(end, sequence.values.length); length++) {
				if (sequence.values.slice(0, length).every((value, i) => value === values[end - length + i])) {
					lengths.push(length)
				}
			}
			sequence.progress = lengths.at(-1) ?? 0
			if (sequence.progress === sequence.values.length) {
				sequence.solved = true
				for (let i = end - sequence.progress; i < end; i++) completed.add(i)
			}
		}
		// Completion may remove one target while another still owns a suffix.
		for (const sequence of sequences.filter((sequence) => !sequence.solved)) {
			for (let length = 1; length <= Math.min(end, sequence.values.length - 1); length++) {
				if (sequence.values.slice(0, length).every((value, i) => value === values[end - length + i])) {
					for (let i = end - length; i < end; i++) pending.add(i)
				}
			}
		}
		if (!pending.size && !completed.has(end - 1)) pending.add(end - 1)
	}
	return {
		sequences,
		states: values.map((_, i) => pending.has(i) ? 'pending' as const : completed.has(i) ? 'complete' as const : 'broken' as const),
	}
}
