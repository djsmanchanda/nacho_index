import React from "react";

export interface NachoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * A clean tortilla chip icon with cheese dripping down the top.
 * Designed to work at small sizes in the header badge (20-24px).
 * Uses currentColor for theming.
 */
export function NachoIcon({ size = 24, className, ...props }: NachoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Chip body — bold filled triangle */}
      <path
        d="M12 3L3.5 19.5C3.2 20.1 3.6 21 4.5 21H19.5C20.4 21 20.8 20.1 20.5 19.5Z"
        fill="currentColor"
      />
      {/* Cheese layer — lighter overlay on the top portion with drips */}
      <path
        d="M12 3C9.5 5.5 8 8.5 7.8 11.5C7.6 12.8 8.5 13.5 9 12.8C9.8 11.8 10.5 13.5 10.5 14.5C10.5 15 11 14 12 13.5C13 14 13.5 15 13.5 14.5C13.5 13.5 14.2 11.8 15 12.8C15.5 13.5 16.4 12.8 16.2 11.5C16 8.5 14.5 5.5 12 3Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}
