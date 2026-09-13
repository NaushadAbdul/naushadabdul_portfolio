"use client";

import CursorGridBase from "@/components/CursorGrid";
import type { ComponentType } from "react";

export type CursorGridProps = {
  cellSize?: number;
  color?: string;
  radius?: number;
  falloff?: "linear" | "smooth" | "sharp";
  holdTime?: number;
  fadeDuration?: number;
  lineWidth?: number;
  maxOpacity?: number;
  fillOpacity?: number;
  gridOpacity?: number;
  cellRadius?: number;
  clickPulse?: boolean;
  pulseSpeed?: number;
  className?: string;
};

export const CursorGrid = CursorGridBase as ComponentType<CursorGridProps>;
export default CursorGrid;
