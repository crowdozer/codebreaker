import { useState, type ReactNode } from 'react'
import { cn, useFocusFirstChild } from '../utils'

interface AccordionProps {
	/**
	 * Label visible in the accordion header, automatically added as aria-label
	 */
	label: string
	/**
	 * Symbol indicating the accordion is open
	 */
	openIndicator?: ReactNode
	/**
	 * Symbol indicating the accordion is NOT open
	 */
	closedIndicator?: ReactNode
	/**
	 * Whether or not to default open
	 */
	defaultOpen?: boolean
	/**
	 * What to display in the accordion
	 */
	children: ReactNode

	/**
	 * Wrapper div HTML props to include, excluding ones already handled by standard props
	 */
	wrapperProps?: Omit<
		React.HTMLAttributes<HTMLDivElement>,
		| 'className'
		| 'onClick'
		| 'onKeyDown'
		| 'tabIndex'
		| 'role'
		| 'aria-expanded'
		| 'aria-label'
	>
}

export function Accordion(props: AccordionProps) {
	const {
		label,
		openIndicator = 'v',
		closedIndicator = '>',
		children,
		defaultOpen = false,
		wrapperProps = {},
	} = props

	const [open, setOpen] = useState(defaultOpen)

	const handleKeyDown = (event: any) => {
		if (['Enter', 'Spacebar', ' '].includes(event.key)) {
			setOpen(!open)
		}
	}

	const accordionRef = useFocusFirstChild<HTMLDivElement>(open)

	return (
		<div className="flex flex-col gap-1" ref={accordionRef}>
			<div
				className={cn(
					// base styling
					'flex cursor-pointer flex-row border border-transparent bg-neutral-800 p-2 py-1',
					// hover states
					'hover:bg-neutral-800',
					// a11y
					'focus:border-blue-500 focus:outline-none',
				)}
				onClick={() => setOpen(!open)}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				role="button"
				aria-expanded={open}
				aria-label={label}
				{...wrapperProps}
			>
				<p className="font-bold">{label}</p>
				<div className="grow"></div>
				<p>{open ? openIndicator : closedIndicator}</p>
			</div>

			{open && <div className="flex flex-col gap-1">{children}</div>}
		</div>
	)
}
