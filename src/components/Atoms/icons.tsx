/* Icons https://lucide.dev/icons/ */
/* Brand icons https://simpleicons.org/ */
/* SVGs https://thenounproject.com/ */

import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface IconProps {
  id?: string
  className?: string
  onClick?: () => void
}

export const ArrowIcon: React.FC<IconProps> = ({ className, onClick, ...props }) => (
  <svg
    id='ArrowIcon'
    className={twMerge('h-5 w-5 -rotate-90 fill-stone-300', className)}
    onClick={onClick}
    width={16}
    height={16}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M8.00026 13.0503C7.91137 13.0503 7.82804 13.0363 7.75026 13.0083C7.67248 12.9808 7.60026 12.9337 7.53359 12.867L3.13359 8.46699C3.00026 8.33366 2.93359 8.17521 2.93359 7.99166C2.93359 7.80855 3.00026 7.65032 3.13359 7.51699C3.26693 7.38366 3.42248 7.31699 3.60026 7.31699C3.77804 7.31699 3.93359 7.38366 4.06693 7.51699L7.33359 10.7837V3.31699C7.33359 3.1281 7.39759 2.97255 7.52559 2.85033C7.65315 2.7281 7.81137 2.66699 8.00026 2.66699C8.18915 2.66699 8.34759 2.73077 8.47559 2.85833C8.60315 2.98633 8.66693 3.14477 8.66693 3.33366V10.7837L11.9336 7.51699C12.0669 7.38366 12.2225 7.31699 12.4003 7.31699C12.578 7.31699 12.7336 7.38366 12.8669 7.51699C13.0003 7.65032 13.0669 7.80855 13.0669 7.99166C13.0669 8.17521 13.0003 8.33366 12.8669 8.46699L8.46693 12.867C8.40026 12.9337 8.32804 12.9808 8.25026 13.0083C8.17248 13.0363 8.08915 13.0503 8.00026 13.0503Z' />
  </svg>
)
