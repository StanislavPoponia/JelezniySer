"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { NavWheel } from "./NavWheel";
import { navLabelClass } from "./navLabel";

type NavLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

// Посилання хедера з колесом. aria-current позначає відкриту сторінку.
export function NavLink({ href, className = "", children }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`group/nav relative ${className}`}>
      <NavWheel />
      <span className={navLabelClass}>{children}</span>
    </Link>
  );
}
