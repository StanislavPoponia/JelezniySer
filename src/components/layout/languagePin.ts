"use client";

import { useSyncExternalStore } from "react";

// Після вибору мови кнопка й хедер лишаються великими, поки клієнт не забере мишу або не натисне деінде.
// Зміна мови перемальовує весь layout, тому цей стан зберігається поза компонентами.
let pinned = false;
const listeners = new Set<() => void>();

export function setLanguagePin(value: boolean) {
  if (pinned === value) return;
  pinned = value;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useLanguagePin = () =>
  useSyncExternalStore(
    subscribe,
    () => pinned,
    () => false,
  );
