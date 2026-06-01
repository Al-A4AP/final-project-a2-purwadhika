import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(scrollToPageTop);
    return () => cancelAnimationFrame(frame);
  }, [pathname, search]);
  return null;
};

const scrollToPageTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.querySelectorAll<HTMLElement>('[data-scroll-root]').forEach(scrollRootToTop);
};

const scrollRootToTop = (root: HTMLElement) => {
  root.scrollTo({ top: 0, left: 0, behavior: 'auto' });
};
