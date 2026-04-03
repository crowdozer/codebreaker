import { useState, type ReactNode, type HTMLInputTypeAttribute } from 'react'
import { cn } from '../utils'

export interface InputProps {
	/**
	 * ID of the input (optional)
	 * If none is provided, one is generated
	 */
	id?: string
	/**
	 * Label shown above the input (optional)
	 */
	label?: string
	/**
	 * Name of the input
	 */
	name: string
	/**
	 * Placeholder value
	 */
	placeholder?: string
	/**
	 * Value for the input
	 */
	value: HTMLInputElement['value']
	/**
	 * HTML type for the input
	 */
	type?: HTMLInputElement['type']
	/**
	 * Executed on input change
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
		 * Applied to the input element
		 */
		input?: string

		/**
		 * Applied to the input label
		 */
		label?: string
	}

	/**
	 * Input HTML props to include, excluding ones already handled by standard props
	 */
	inputProps?: Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		| 'id'
		| 'value'
		| 'name'
		| 'type'
		| 'placeholder'
		| 'className'
		| 'disabled'
		| 'onChange'
		| 'list'
	>

	/**
	 * Label HTML props to include, excluding ones already handled by standard props
	 */
	labelProps?: Omit<
		React.HTMLAttributes<HTMLLabelElement>,
		'className' | 'htmlFor'
	>

	/**
	 * An optional datalist, like so:
	 * <>
	 * 	  <option>option 1</option>
	 * 	  <option>option 2</option>
	 * 	  <option>option 3</option>
	 * </>
	 */
	list?: ReactNode
}

export function Input(props: InputProps) {
	const {
		disabled = false,
		id = `input-${Math.random().toString(36)}`,
		label = undefined,
		list = undefined,
		name,
		onChange,
		placeholder = undefined,
		type = undefined,
		value: initialValue = '',
		width = 'max-w-full',
		inputProps = {},
		labelProps = {},
	} = props
	const inputClasses = props.classes?.input || ''
	const wrapperClasses = props.classes?.wrapper || ''
	const labelClasses = props.classes?.label || ''

	const [value, setValue] = useState<HTMLInputElement['value']>(initialValue)

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
				<input
					id={id}
					value={value}
					name={name}
					type={type}
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
						inputClasses,
					)}
					disabled={disabled}
					onChange={handleChange}
					list={list ? `${id}-datalist` : undefined}
					{...inputProps}
				/>
				{list && <datalist id={`${id}-datalist`}>{list}</datalist>}
			</div>
		</div>
	)
}
