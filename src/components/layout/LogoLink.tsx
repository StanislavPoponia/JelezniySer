"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

// Клік по логотипу веде на головну й завжди прокручує сторінку на самий верх.
export function LogoLink({ children }: { children: ReactNode }) {
  return (
    <Link
      href="/"
      aria-label="JS Moto"
      className="shrink-0"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      {children}
    </Link>
  );
}
