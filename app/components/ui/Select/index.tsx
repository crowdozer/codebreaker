import { useState, type ReactNode } from 'react'
import { cn } from '../utils'

export interface SelectProps {
	/**
	 * ID of the select (optional)
	 * If none is provided, one is generated
	 */
	id?: string
	/**
	 * Label shown above the select (optional)
	 */
	label?: string
	/**
	 * Name of the select
	 */
	name: string
	/**
	 * Placeholder value
	 */
	placeholder?: string
	/**
	 * Value for the select
	 */
	value: HTMLSelectElement['value']
	/**
	 * Executed on select change
	 *
	 * @param value Value from the event
	 * @param event The event
	 */
	onChange: (value: any, event: any) => void

	disabled?: boolean

	/**
	 * Class specifying width (i.e w-full, max-w-6xl, etc)
	 */
	width?: string

	/**
	 * Various classes to be applied
	 */
	classes?: {
		/**
		 * Applied to the wrapper
		 */
		wrapper?: string

		/**
		 * Applied to the select element
		 */
		select?: string

		/**
		 * Applied to the input label
		 */
		label?: string
	}

	/**
	 * Select HTML props to include, excluding ones already handled by standard props
	 */
	selectProps?: Omit<
		React.SelectHTMLAttributes<HTMLSelectElement>,
		| 'id'
		| 'name'
		| 'onChange'
		| 'value'
		| 'disabled'
		| 'placeholder'
		| 'className'
	>

	/**
	 * Label HTML props to include, excluding ones already handled by standard props
	 */
	labelProps?: Omit<
		React.HTMLAttributes<HTMLLabelElement>,
		'className' | 'htmlFor'
	>

	/**
	 * The select options, like so:
	 * <>
	 * 	  <option>option 1</option>
	 * 	  <option>option 2</option>
	 * 	  <option>option 3</option>
	 * </>
	 */
	children: ReactNode
}

export function Select(props: SelectProps) {
	const {
		children,
		disabled = false,
		id = `select-${Math.random().toString(36)}`,
		label = undefined,
		name,
		onChange,
		placeholder = undefined,
		value: initialValue = '',
		width = 'max-w-full',
		selectProps = {},
		labelProps = {},
	} = props

	const selectClasses = props.classes?.select || ''
	const wrapperClasses = props.classes?.wrapper || ''
	const labelClasses = props.classes?.label || ''

	const [value, setValue] = useState<HTMLSelectElement['value']>(initialValue)

	function handleChange(event: any) {
		let value = event.target.value
		setValue(value)
		onChange(value, event)
	}

	return (
		<div className={width}>
			<div className={cn('flex flex-col gap-1', wrapperClasses)}>
				{label && (
					<label
						htmlFor={id}
						className={cn('ml-1 text-sm font-bold', labelClasses)}
						{...labelProps}
					>
						{label}
					</label>
				)}
				<select
					id={id}
					value={value}
					name={name}
					placeholder={placeholder}
					className={cn(
						// base styles
						'border border-neutral-700 bg-transparent px-2 py-1',
						// a11y
						'focus:border-blue-500 focus:outline-none',
						// conditional styles
						{
							'cursor-not-allowed opacity-50': disabled,
						},
						// user styles
						selectClasses,
					)}
					onChange={handleChange}
					disabled={disabled}
					{...selectProps}
				>
					{children}
				</select>
			</div>
		</div>
	)
}
