import { useEffect, type RefObject } from 'react';

export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside();
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onOutside, ref]);
};
