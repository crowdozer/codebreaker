/**
 * Small helpers shared by the FX components: reduced-motion check and random glyphs.
 */

const GLYPHS = '0123456789ABCDEF#$%&*+=<>/\\|?!'

/**
 * True when the user asked the OS for less motion. Safe to call during render
 * because the game only renders on the client (ssr: false).
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * A random glyph for scramble effects.
 */
export function randomGlyph(): string {
	return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

/**
 * A random two-digit hex byte, e.g. "4F".
 */
export function randomByte(): string {
	return Math.floor(Math.random() * 256)
		.toString(16)
		.toUpperCase()
		.padStart(2, '0')
}

/**
 * Random integer in [min, max].
 */
export function randomBetween(min: number, max: number): number {
	return Math.floor(min + Math.random() * (max - min + 1))
}

/**
 * Picks a random entry from a list.
 */
export function pick<T>(items: readonly T[]): T {
	return items[Math.floor(Math.random() * items.length)]
}
