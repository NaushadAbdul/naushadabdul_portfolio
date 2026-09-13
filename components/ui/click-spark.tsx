"use client";

import ClickSparkBase from "@/components/ClickSpark";
import type { CSSProperties, ComponentType, ReactNode } from "react";

export type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const ClickSpark = ClickSparkBase as ComponentType<ClickSparkProps>;
export default ClickSpark;
