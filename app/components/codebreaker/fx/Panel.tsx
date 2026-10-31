/**
 * Crisp OS window used for every game panel: numbered header bar
 * ("03 // CODE MATRIX") over a bordered body.
 *
 * "filled" headers take the status color (the original game's bars);
 * "plain" headers are a hairline bar with the label in the status color.
 */

import type { ReactNode } from "react";
import { cn } from "@/app/components/ui";
import { FX } from "./config";
import DecodeText from "./DecodeText";

interface PanelProps {
  /** two-digit panel number shown before the label */
  index: string;
  label: string;
  variant?: "plain" | "filled";
  /** boot-in order; each step adds FX.bootStaggerMs of delay */
  order?: number;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

/**
 * Game panel frame. Boots in once on mount, then stays still.
 */
export default function Panel(props: PanelProps) {
  const {
    index,
    label,
    variant = "plain",
    order = 0,
    className,
    bodyClassName,
    children,
  } = props;
  const delay = order * FX.bootStaggerMs;

  return (
    <section
      className={cn("cb-boot flex flex-col border border-neutral-700 bg-neutral-950", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <header
        className={cn(
          "flex items-center gap-4 border-b px-3 py-1.5 text-xs uppercase tracking-[0.12em] lg:text-sm",
          variant === "filled"
            ? "cb-header-filled border-transparent font-bold"
            : "border-neutral-700",
        )}
      >
        <h2 className="cb-label">
          <span className={variant === "filled" ? "opacity-60" : "text-neutral-500"}>
            {`${index} // `}
          </span>
          <DecodeText
            text={label}
            delay={delay}
            className={variant === "plain" ? "cb-accent-text" : undefined}
          />
        </h2>
      </header>
      <div className={cn("grow", bodyClassName)}>{children}</div>
    </section>
  );
}
