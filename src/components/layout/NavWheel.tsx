import { MotoWheel } from "@/components/ui/MotoWheel";

// Маленьке колесо збоку від пункту хедера. При наведенні плавно виростає з нуля,
// на відкритій сторінці лишається видимим. Крутиться зі швидкістю логотипа (2.8s).
// Батьківський елемент має мати класи "group/nav relative".
export function NavWheel() {
  return (
    <MotoWheel className="pointer-events-none absolute left-0.5 top-1/2 h-5.5 w-5.5 -translate-y-1/2 scale-0 animate-[spin_2.8s_linear_infinite] opacity-0 transition-[scale,opacity] duration-300 ease-out group-hover/nav:scale-100 group-hover/nav:opacity-100 group-focus-visible/nav:scale-100 group-focus-visible/nav:opacity-100 group-aria-[current=page]/nav:scale-100 group-aria-[current=page]/nav:opacity-100 motion-reduce:animate-none motion-reduce:transition-none" />
  );
}
