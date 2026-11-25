"use client";

import type { ReactNode } from "react";
import { useTouchSpin } from "./useTouchSpin";

// Обгортка для логотипа без посилання (футер): дотик крутить колесо, повторний — зупиняє.
export function LogoSpin({ children }: { children: ReactNode }) {
  const { spinning, toggle } = useTouchSpin();

  return (
    <div data-spin={spinning} onClick={toggle} className="shrink-0">
      {children}
    </div>
  );
}
