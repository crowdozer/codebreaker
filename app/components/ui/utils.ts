import { useEffect, useRef, type RefObject, useState } from 'react'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type FocusableElement =
	| HTMLButtonElement
	| HTMLAnchorElement
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement

export const focusableElements = 'button, a, input, select, textarea'

/**
 * Effect that automatically focuses the first child of an element
 *
 * @param shouldFocus whether or not to enable autofocusing behavior
 * @param focusOnMount whether or not to focus on the initial mounting (this is undesirable in forms, as the focus is stolen from the first input)
 * @returns ref to attach to the root node
 */
export function useFocusFirstChild<T extends HTMLElement>(
	shouldFocus: boolean,
	focusOnMount: boolean = false,
) {
	const rootNodeRef = useRef<T>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		// Exit early if we don't need autofocus at the moment
		if (!shouldFocus) {
			return
		}

		// Exit early when first mounting, and focus-on-mount is not desired
		if (!mounted && !focusOnMount) {
			return
		}

		const child = getFirstFocusableChild(rootNodeRef)
		if (child) {
			child.focus()
		}
	}, [shouldFocus])

	return rootNodeRef
}

/**
 * Accepts a ref and finds the first child focusable within that ref,
 * or null if one is not found
 *
 * @param ref A html element ref
 */
function getFirstFocusableChild(
	ref: RefObject<HTMLElement>,
): FocusableElement | null {
	if (!ref.current) {
		return null
	}

	const focusableChild = ref.current.querySelector(
		focusableElements,
	) as FocusableElement

	return focusableChild || null
}

/**
 * Tailwind Class utility
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
