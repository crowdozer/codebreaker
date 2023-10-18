import { cn } from '../utils'

export interface CodeProps {
	content?: string

	/**
	 * Various classes to be applied
	 */
	classes?: {
		/**
		 * Applied to the wrapper element
		 */
		wrapper?: string
	}
}

export function Code(props: CodeProps) {
	const { content = '' } = props

	const wrapperClasses = props.classes?.wrapper || ''
	const lines = content.split('\n')

	return (
		<code
			role="log"
			className={cn(
				'resize-y overflow-auto whitespace-pre border border-neutral-700',
				wrapperClasses,
			)}
		>
			{lines.map((line, index) => (
				<div
					key={index}
					className="grid grid-cols-[minmax(32px,_max-content)_1fr] gap-2"
				>
					{/* Line numbers */}
					<span
						className={cn(
							'border-r border-r-neutral-800 bg-neutral-800/50 px-2 text-right',
							{
								'pt-4': index === 0,
								'pb-4': index === lines.length - 1,
							},
						)}
						// Do not expose the line numbers
						aria-hidden="true"
					>
						{index + 1}
					</span>

					{/* Line content */}
					<span
						className={cn({
							'pt-4': index === 0,
							'pb-4': index === lines.length - 1,
						})}
					>
						{line}
					</span>
				</div>
			))}
		</code>
	)
}
