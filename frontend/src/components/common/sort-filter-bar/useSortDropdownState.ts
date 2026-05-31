import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { SortFilterBarProps, SortGroup, SortSubOption } from "./sortFilterTypes";

export const useSortDropdownState = (
  currentSort: string,
  onChange: SortFilterBarProps["onChange"],
) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const handleGroupClick = (group: SortGroup) => selectSortGroup(group, openGroup, setOpenGroup, currentSort, onChange);
  const handleSubOption = (group: SortGroup, sub: SortSubOption) => { onChange(group.key, sub.order); setOpenGroup(null); };
  const setDropdownRef = (key: string) => (el: HTMLDivElement | null) => { dropdownRefs.current[key] = el; };
  useCloseOnOutsideClick(openGroup, dropdownRefs, setOpenGroup);
  return { openGroup, handleGroupClick, handleSubOption, setDropdownRef };
};

const selectSortGroup = (group: SortGroup, openGroup: string | null, setOpenGroup: (key: string | null) => void, currentSort: string, onChange: SortFilterBarProps["onChange"]) => {
  if (openGroup === group.key) return setOpenGroup(null);
  setOpenGroup(group.key);
  if (currentSort !== group.key) onChange(group.key, group.options[0].order);
};

const useCloseOnOutsideClick = (openGroup: string | null, refs: RefObject<Record<string, HTMLDivElement | null>>, setOpenGroup: (key: string | null) => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => closeOutsideDropdown(event, openGroup, refs, setOpenGroup);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openGroup, refs, setOpenGroup]);
};

const closeOutsideDropdown = (event: MouseEvent, openGroup: string | null, refs: RefObject<Record<string, HTMLDivElement | null>>, setOpenGroup: (key: string | null) => void) => {
  const ref = openGroup ? refs.current[openGroup] : null;
  if (ref && !ref.contains(event.target as Node)) setOpenGroup(null);
};
