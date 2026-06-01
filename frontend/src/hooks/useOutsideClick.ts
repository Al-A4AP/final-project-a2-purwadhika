import { useEffect, type RefObject } from "react";

export const useOutsideClick = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
  enabled = true,
) => {
  useEffect(() => {
    if (!enabled) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (isOutside(ref.current, event.target)) onOutside();
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [enabled, onOutside, ref]);
};

const isOutside = (element: HTMLElement | null, target: EventTarget | null) =>
  Boolean(element && target instanceof Node && !element.contains(target));
