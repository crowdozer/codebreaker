import type { KeyboardEventHandler, ReactNode } from 'react'
import { cn } from '../utils'

export interface ButtonProps {
	/**
	 * Button content
	 */
	children: ReactNode
	/**
	 * OnClick handler
	 *
	 * @param event Click event
	 */
	onClick?: (event: any) => void

	type?: HTMLButtonElement['type']

	disabled?: boolean

	/**
	 * Various classes to be applied
	 */
	classes?: {
		/**
		 * Applied to the button element
		 */
		button?: string
	}

	/**
	 * Button HTML props to include, excluding ones already handled by standard props
	 */
	buttonProps?: Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		| 'className'
		| 'onClick'
		| 'onKeyDown'
		| 'disabled'
		| 'role'
		| 'type'
		| 'aria-disabled'
	>
}

export function Button(props: ButtonProps) {
	const {
		onClick = undefined,
		disabled = false,
		type = 'button',
		children,
		buttonProps = {},
	} = props
	const buttonClasses = props.classes?.button || ''

	const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
		if (!onClick) return

		if (['Enter', 'Spacebar', ' '].includes(event.key)) {
			event.preventDefault()
			onClick(event as any)
		}
	}

	return (
		<button
			className={cn(
				// base styling
				'border border-neutral-700 px-3 py-1',
				// hover states
				'hover:bg-neutral-800',
				// a11y
				'focus:border-blue-500 focus:outline-none',
				// conditional states
				{
					'cursor-not-allowed opacity-50': disabled,
				},
				// user specified classes
				buttonClasses,
			)}
			type={type}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			disabled={disabled}
			role="button"
			aria-disabled={disabled}
			{...buttonProps}
		>
			{children}
		</button>
	)
}
