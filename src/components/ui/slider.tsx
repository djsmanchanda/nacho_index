"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SliderProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> & {
  value?: number[];
  onValueChange?: (value: number[]) => void;
};

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 10, step = 1, ...props }, ref) => {
    const current = value[0] ?? Number(min);
    const minValue = Number(min);
    const maxValue = Number(max);
    const percent =
      maxValue > minValue ? ((current - minValue) / (maxValue - minValue)) * 100 : 0;

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => onValueChange?.([event.currentTarget.valueAsNumber])}
        className={cn(
          "nacho-range h-5 w-full cursor-pointer appearance-none rounded-full accent-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70",
          className,
        )}
        style={{
          background: `linear-gradient(to right, #f97316 0%, #fbbf24 ${percent}%, rgba(255,255,255,0.1) ${percent}%, rgba(255,255,255,0.1) 100%)`,
        }}
        {...props}
      />
    );
  },
);
Slider.displayName = "Slider";

export { Slider };
