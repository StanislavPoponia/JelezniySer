"use client";

import { useState } from "react";

// На сенсорних екранах немає наведення, тому колесо логотипа вмикається й зупиняється дотиком.
export function useTouchSpin() {
  const [spinning, setSpinning] = useState(false);
  const toggle = () => {
    if (window.matchMedia("(hover: none)").matches) setSpinning((v) => !v);
  };
  return { spinning, toggle };
}
