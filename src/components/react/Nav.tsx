import { type ClassValue } from 'clsx'
import { useState } from 'react'
import { Button } from '@/components/react/ui'
import { cn } from '@/components/react/ui'

export interface NavProps {
	classes?: ClassValue[]
}

export default function Nav(props: NavProps) {
	const { classes = '' } = props

	const [open, setOpen] = useState(false)

	function handleOpen() {
		setOpen(true)
	}

	function handleClose() {
		setOpen(false)
	}

	return (
		<div id="sitemap" className="relative">
			<div className="contents" onMouseEnter={handleOpen}>
				<Button
					classes={{
						button: cn(
							// restyle the button for the header
							'font-bold border-transparent select-none rounded p-2 px-4 hover:!bg-neutral-700',
							// conditional styles
							{
								'bg-neutral-800': open,
							},
							classes,
						),
					}}
					onClick={handleOpen}
				>
					sitemap
				</Button>
			</div>

			<div
				className={cn(
					// animation + position
					'fixed bottom-0 left-0 right-0 top-0 z-50 block animate-in fade-in-0 zoom-in-95 ',
					// responsiveness (fullscreen)
					'md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:h-auto',
					{
						hidden: !open,
					},
				)}
				onMouseLeave={handleClose}
			>
				<div className="h-full border-neutral-700 bg-neutral-900 p-6 md:mt-2 md:w-[500px] md:rounded md:border">
					<div className="pb-4 text-left md:hidden">
						<Button onClick={handleClose}>Go Back</Button>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-[.75fr_1fr]">
						<a
							href="/"
							className="flex flex-col gap-2 rounded bg-neutral-800 px-4 py-3 hover:bg-neutral-700 md:row-span-3"
						>
							<div className="grow"></div>
							<p className="mb-1 text-4xl">✨</p>
							<p className="font-bold">portfolio</p>
							<p className="text-sm">
								view my skills, projects, and work experience
							</p>
						</a>
						<a href="/tools" className="rounded px-4 py-3 hover:bg-neutral-700">
							<p className="font-bold">tools & utilities</p>
							<p className="text-xs">random stuff</p>
						</a>
						<a href="/games" className="rounded px-4 py-3 hover:bg-neutral-700">
							<p className="font-bold">arcade</p>
							<p className="text-xs">waste time responsibly</p>
						</a>
						<a
							href="/contact"
							className="rounded px-4 py-3 hover:bg-neutral-700"
						>
							<p className="font-bold">contact me</p>
							<p className="text-xs">get in touch</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
