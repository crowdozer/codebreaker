/**
 * Shares the matrix cell under the pointer with the buffer and vector panels,
 * so hovering a cell previews where it lands.
 *
 * Lives in its own provider so hover changes only re-render the panels that
 * read it, not the whole game.
 */

import { createContext, useContext, useState, type ReactNode } from "react";

export interface HoveredCell {
  y: number;
  x: number;
  value: string;
}

interface HoverAPI {
  hovered: HoveredCell | null;
  setHovered: (cell: HoveredCell | null) => void;
}

const HoverContext = createContext<HoverAPI>({
  hovered: null,
  setHovered: () => {},
});

/**
 * Wrap the game panels that need hover previews.
 */
export function HoverProvider({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<HoveredCell | null>(null);

  return (
    <HoverContext.Provider value={{ hovered, setHovered }}>
      {children}
    </HoverContext.Provider>
  );
}

/**
 * The hovered matrix cell (only clickable cells are reported) and its setter.
 */
export function useHover(): HoverAPI {
  return useContext(HoverContext);
}
