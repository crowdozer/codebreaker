import { type AriaRole, type ReactNode } from 'react'
import { cn } from '../utils'

/**
 * All valid chip variants
 */
export type ChipKind = 'success' | 'error' | 'warning' | 'info' | 'neutral'

export default interface ChipProps {
	/**
	 * Color to show on the chip
	 */
	kind: ChipKind
	/**
	 * A11Y label for the chip, defaults to 'status'
	 * Pass a blank string '' to omit from the element
	 */
	role?: AriaRole | ''
	/**
	 * Chip content
	 */
	children: ReactNode
}

export function Chip(props: ChipProps) {
	const { kind = 'neutral', role = undefined, children } = props

	return (
		<div
			role={getAriaRole(kind, role)}
			className={cn('self-center rounded-full px-3 py-0.5 text-sm font-thin', {
				'bg-neutral-500/25': kind === 'neutral',
				'bg-yellow-500/25': kind === 'warning',
				'bg-green-500/25': kind === 'success',
				'bg-red-500/25': kind === 'error',
				'bg-blue-500/25': kind === 'info',
			})}
		>
			{children}
		</div>
	)
}

/**
 * determines the aria role to show based on the chip type,
 * see chip interface for explanation
 *
 * @param kind the chip kind
 * @param role the user specified role, from chip props
 * @returns an aria role or undefined
 */
function getAriaRole(
	kind: ChipKind,
	role?: AriaRole | '',
): AriaRole | undefined {
	if (role === '') return undefined
	if (role) return role

	switch (kind) {
		case 'success':
			return 'status'
		case 'error':
			return 'status'
		case 'warning':
			return 'status'
		case 'info':
			return 'status'
		default:
			return 'status'
	}
}
