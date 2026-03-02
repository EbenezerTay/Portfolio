 "use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type OverlayContextValue = {
  isOverlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
};

const OverlayContext = createContext<OverlayContextValue | undefined>(undefined);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  return (
    <OverlayContext.Provider value={{ isOverlayOpen, setOverlayOpen }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
}
