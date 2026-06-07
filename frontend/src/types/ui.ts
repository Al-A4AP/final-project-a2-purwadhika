import type { ReactNode } from "react";

// ----------------------------------------------------------------------------
// Core UI Types (atoms)
// ----------------------------------------------------------------------------

export type ButtonVariant = "danger" | "ghost" | "outline" | "primary" | "secondary";
export type ButtonSize = "icon" | "md" | "sm";

export type BadgeTone = "green" | "neutral" | "red" | "yellow";

// ----------------------------------------------------------------------------
// Common Component Boundaries (molecules & organisms)
// ----------------------------------------------------------------------------

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}
