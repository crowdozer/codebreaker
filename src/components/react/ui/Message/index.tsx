import { type AriaRole, type ReactNode } from 'react'
import { cn } from '../utils'

/**
 * All valid message variants
 */
export type MessageKind = 'success' | 'error' | 'warning' | 'info'

export default interface MessageProps
	extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * What kind of message to show
	 */
	kind: MessageKind
	/**
	 * The role for the message, if not included it will be autoassigned
	 * To remove a role, pass an empty string ''
	 */
	role?: AriaRole | ''

	/**
	 * Message content
	 */
	children: ReactNode
}

export function Message(props: MessageProps) {
	const { kind = 'info', role = undefined, children, ...rest } = props

	return (
		<div
			role={getAriaRole(kind, role)}
			className={cn(
				'border border-transparent  bg-neutral-800 p-4 text-sm font-thin',
				{
					'border-l-yellow-500': kind === 'warning',
					'border-l-green-500': kind === 'success',
					'border-l-red-500': kind === 'error',
					'border-l-blue-500': kind === 'info',
				},
			)}
			{...rest}
		>
			{children}
		</div>
	)
}

/**
 * determines the aria role to show based on the message type,
 * see message interface for explanation
 *
 * @param kind the message kind
 * @param role the user specified role, from message props
 * @returns an aria role or undefined
 */
function getAriaRole(
	kind: MessageKind,
	role?: AriaRole | '',
): AriaRole | undefined {
	if (role === '') return undefined
	if (role) return role

	switch (kind) {
		case 'success':
			return 'note'
		case 'error':
			return 'note'
		case 'warning':
			return 'note'
		case 'info':
			return 'note'
		default:
			return 'note'
	}
}
