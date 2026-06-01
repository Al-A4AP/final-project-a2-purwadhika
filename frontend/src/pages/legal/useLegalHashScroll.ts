import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useLegalHashScroll = () => {
  const location = useLocation();
  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (!id) return window.scrollTo({ top: 0 });
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [location.hash]);
};
