/**
 * FX knobs for the fake-OS layer.
 *
 * Every timing and density the effects use lives here, so the feel can be
 * tuned in one place without touching components.
 */

export const FX = {
	/** ms per character for typed text (titles, status messages) */
	typeMsPerChar: 18,
	/** ms for a label to decode from scrambled glyphs to its final text */
	decodeMs: 480,
	/** ms between scramble frames while decoding */
	scrambleFrameMs: 40,
	/** ms between each panel booting in on first load */
	bootStaggerMs: 90,
	/** ms between each matrix cell in the active-line wave */
	lineWaveStepMs: 70,
	/** ms between ambient lines in the in-game system log */
	syslogChatterMs: 2400,
	/** [min, max] ms between lines in the background terminals */
	backgroundStreamMs: [500, 1600] as const,
	/** most lines any terminal keeps before trimming the oldest */
	terminalMaxLines: 40,
	/** bytes in the footer data stream (it loops, so this is its period) */
	dataStreamBytes: 96,
} as const
