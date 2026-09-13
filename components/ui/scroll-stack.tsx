"use client";

import ScrollStackBase, { ScrollStackItem as ScrollStackItemBase } from "@/components/ScrollStack";
import type { ReactNode, ComponentType } from "react";

export type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
};

export type ScrollStackItemProps = {
  children: ReactNode;
  itemClassName?: string;
};

export const ScrollStack = ScrollStackBase as ComponentType<ScrollStackProps>;
export const ScrollStackItem = ScrollStackItemBase as ComponentType<ScrollStackItemProps>;
export default ScrollStack;
