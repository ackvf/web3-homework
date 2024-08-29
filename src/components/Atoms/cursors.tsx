/* Icons https://lucide.dev/icons/ */
/* Brand icons https://simpleicons.org/ */
/* SVGs https://thenounproject.com/ */

import React, { type RefObject } from 'react'
import { twMerge } from 'tailwind-merge'

interface CursorProps {
  id?: string
  className?: string
  forwardRef?: RefObject<SVGSVGElement>
}

const HandClick: React.FC<CursorProps> = ({ className, forwardRef, ...props }) => (
  <svg
    id='HandClick'
    className={twMerge('fill-white stroke-white', className)}
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    version='1.1'
    baseProfile='basic'
    x='0px'
    y='0px'
    viewBox='5 5 80 80'
    xmlSpace='preserve'
    strokeWidth={2}
    ref={forwardRef}
    {...props}
    data-attribution='Created by iconpacks from the Noun Project'
  >
    <g>
      <path d='M64.055,27.109c0.339-1.709-0.017-3.391-1.003-4.737c-0.985-1.346-2.481-2.193-4.213-2.386   c-1.705-0.191-3.425,0.279-4.849,1.322L24.995,42.542l0.143-7.516c0.032-1.679-0.607-3.234-1.798-4.377   c-1.234-1.184-2.889-1.777-4.674-1.669c-3.558,0.215-6.506,3.218-6.572,6.693l-0.517,27.22c-0.11,4.863,1.304,9.444,4.09,13.247   c4.266,5.825,11.029,8.862,18.097,8.861c5.227,0,10.621-1.66,15.293-5.082l12.135-8.887c2.972-2.178,3.744-6.198,1.72-8.961   c-0.985-1.345-2.481-2.193-4.213-2.386c-0.011-0.001-0.023-0.001-0.034-0.002l0.319-0.234c1.423-1.042,2.391-2.542,2.723-4.223   c0.339-1.709-0.017-3.392-1.003-4.737c-0.985-1.345-2.481-2.193-4.213-2.387c-0.312-0.035-0.624-0.041-0.935-0.032   c0.397-0.663,0.685-1.387,0.837-2.151c0.338-1.709-0.018-3.391-1.003-4.737c-1.026-1.401-2.577-2.212-4.244-2.39l10.185-7.459   C62.755,30.29,63.723,28.79,64.055,27.109z M60.282,29.899L46.329,40.117l-8.162,5.978c-0.396,0.29-0.482,0.846-0.192,1.242   c0.289,0.397,0.845,0.483,1.242,0.192l8.162-5.978c2.183-1.599,5.134-1.292,6.579,0.68c0.687,0.939,0.934,2.126,0.693,3.342   c-0.246,1.243-0.968,2.356-2.031,3.135l-8.162,5.978c-0.396,0.29-0.482,0.846-0.192,1.242c0.081,0.111,0.186,0.191,0.299,0.252   c0.034,0.018,0.07,0.025,0.106,0.038c0.084,0.032,0.168,0.055,0.258,0.06c0.019,0.001,0.036,0.013,0.055,0.013   c0.043,0,0.086-0.014,0.128-0.02c0.035-0.005,0.069-0.007,0.103-0.016c0.102-0.028,0.202-0.069,0.292-0.136l7.186-5.262   c1.062-0.778,2.341-1.135,3.602-0.989c1.231,0.137,2.288,0.73,2.976,1.67s0.935,2.126,0.694,3.341   c-0.246,1.243-0.968,2.356-2.031,3.135l-7.046,5.16c-0.396,0.29-0.482,0.846-0.192,1.242c0.174,0.238,0.443,0.364,0.718,0.364   c0.182,0,0.366-0.056,0.524-0.172l2.96-2.168c0.001,0,0.001,0,0.002-0.001c1.062-0.778,2.341-1.129,3.602-0.989   c1.232,0.137,2.288,0.731,2.976,1.67c1.445,1.973,0.845,4.878-1.337,6.477l-12.135,8.887c-10.2,7.469-24.065,5.947-30.906-3.395   c-2.552-3.485-3.847-7.689-3.747-12.161l0.518-27.222c0.049-2.57,2.248-4.792,4.902-4.953c1.287-0.077,2.464,0.342,3.336,1.178   c0.829,0.795,1.274,1.882,1.251,3.06l-0.177,9.311c-0.006,0.338,0.179,0.65,0.479,0.806c0.3,0.155,0.661,0.127,0.935-0.072   L55.04,22.742c1.062-0.778,2.34-1.132,3.602-0.989c1.231,0.137,2.288,0.73,2.976,1.67c0.688,0.939,0.935,2.126,0.694,3.341   C62.066,28.007,61.345,29.12,60.282,29.899z' />
      <path d='M52.15,18.252c-0.281,0-0.557-0.132-0.73-0.38l-5.713-8.188c-0.281-0.403-0.182-0.956,0.22-1.238   c0.405-0.281,0.957-0.182,1.238,0.22l5.713,8.188c0.28,0.403,0.182,0.956-0.22,1.238C52.503,18.201,52.326,18.252,52.15,18.252z' />
      <path d='M69.303,42.836c-0.281,0-0.557-0.132-0.73-0.38l-5.713-8.188c-0.28-0.403-0.182-0.956,0.22-1.238   c0.405-0.282,0.957-0.182,1.238,0.22l5.713,8.188c0.28,0.403,0.182,0.956-0.22,1.238C69.656,42.785,69.478,42.836,69.303,42.836z' />
      <path d='M67.593,20.16c-0.281,0-0.557-0.132-0.73-0.38c-0.28-0.403-0.182-0.956,0.22-1.238l8.188-5.713   c0.404-0.282,0.957-0.182,1.238,0.22c0.28,0.403,0.182,0.956-0.22,1.238L68.101,20C67.946,20.108,67.769,20.16,67.593,20.16z' />
      <path d='M77.541,29.953c-0.051,0-0.104-0.004-0.156-0.014l-9.83-1.75c-0.483-0.086-0.805-0.547-0.719-1.031   c0.086-0.483,0.549-0.81,1.03-0.719l9.83,1.75c0.483,0.086,0.805,0.547,0.719,1.031C78.339,29.65,77.964,29.953,77.541,29.953z' />
      <path d='M59.622,16.609c-0.051,0-0.104-0.004-0.157-0.014c-0.483-0.086-0.805-0.547-0.719-1.031l1.751-9.83   c0.085-0.483,0.538-0.811,1.031-0.719c0.483,0.086,0.805,0.548,0.719,1.031l-1.751,9.83C60.42,16.306,60.045,16.609,59.622,16.609z   ' />
    </g>
  </svg>
)

const Hand: React.FC<CursorProps> = ({ className, forwardRef, ...props }) => (
  <svg
    id='Hand'
    className={twMerge('fill-white stroke-white', className)}
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    version='1.1'
    baseProfile='basic'
    viewBox='4.3 -13.7 99 99'
    xmlSpace='preserve'
    strokeWidth={2}
    ref={forwardRef}
    {...props}
    data-attribution='Created by iconpacks from the Noun Project'
  >
    <path d='M70.12,54.09l0.854-0.626c3.582-2.623,4.515-7.461,2.081-10.785c-1.183-1.616-2.981-2.633-5.063-2.866  c-0.507-0.056-1.016-0.063-1.52-0.023c1.759-2.646,1.875-6.073,0.013-8.617c-1.347-1.84-3.449-2.832-5.664-2.909l13.055-9.56  c3.581-2.623,4.515-7.461,2.081-10.785c-2.434-3.323-7.327-3.894-10.91-1.27L28.856,33.151l0.185-9.717  c0.038-2.017-0.728-3.883-2.158-5.255c-1.483-1.423-3.481-2.137-5.62-2.006c-4.293,0.259-7.849,3.879-7.929,8.069l-0.639,33.654  c-0.135,5.966,1.6,11.584,5.016,16.249c4.402,6.011,11.11,9.799,18.889,10.667C37.725,84.938,38.85,85,39.974,85  c6.624-0.001,13.168-2.159,18.725-6.229l15.003-10.988c1.718-1.257,2.884-3.066,3.286-5.093c0.407-2.055-0.021-4.076-1.204-5.691  C74.437,55.16,72.335,54.168,70.12,54.09z M75.245,62.346c-0.315,1.588-1.235,3.01-2.593,4.004L57.649,77.338  c-6.14,4.496-13.546,6.522-20.852,5.708c-7.279-0.812-13.548-4.346-17.652-9.95c-3.183-4.347-4.799-9.589-4.673-15.163l0.64-33.657  c0.062-3.285,2.87-6.124,6.258-6.328c1.635-0.099,3.161,0.438,4.283,1.515c1.068,1.025,1.64,2.423,1.611,3.938l-0.219,11.512  c-0.006,0.338,0.179,0.65,0.479,0.806c0.299,0.154,0.661,0.127,0.935-0.072L66.097,8.082c2.79-2.045,6.57-1.646,8.426,0.887  c1.855,2.533,1.093,6.257-1.698,8.301L55.575,29.903l-10.092,7.39c-0.396,0.29-0.482,0.846-0.192,1.242  c0.29,0.396,0.847,0.481,1.242,0.192l10.092-7.39c2.79-2.043,6.571-1.646,8.426,0.887c1.855,2.533,1.093,6.257-1.699,8.301  l-10.091,7.39c-0.396,0.29-0.482,0.846-0.192,1.242c0.081,0.111,0.185,0.191,0.299,0.252c0.035,0.019,0.071,0.025,0.108,0.039  c0.083,0.031,0.166,0.054,0.255,0.06c0.019,0.001,0.037,0.013,0.056,0.013c0.044,0,0.087-0.014,0.13-0.02  c0.034-0.005,0.068-0.007,0.102-0.016c0.102-0.028,0.202-0.069,0.293-0.136l8.884-6.506c1.357-0.993,2.99-1.443,4.6-1.262  c1.581,0.176,2.94,0.94,3.826,2.149c1.855,2.534,1.093,6.257-1.698,8.301l-5.044,3.694c-0.002,0.001-0.004,0.002-0.006,0.004  c0,0-0.001,0.001-0.001,0.001l-3.661,2.681c-0.396,0.29-0.482,0.846-0.192,1.242c0.174,0.238,0.444,0.364,0.718,0.364  c0.182,0,0.366-0.056,0.524-0.172l3.668-2.686c2.789-2.039,6.566-1.641,8.42,0.891C75.236,59.258,75.554,60.784,75.245,62.346z' />
  </svg>
)

const Pointer: React.FC<CursorProps> = ({ className, forwardRef, ...props }) => (
  <svg
    id='BigArrow'
    className={twMerge('fill-white', className)}
    xmlns='http://www.w3.org/2000/svg'
    version='1.1'
    height={24}
    width={24}
    viewBox='45 32.7 10 34.6'
    ref={forwardRef}
    {...props}
    data-attribution='Created by creative_visionary from the Noun Project'
  >
    <path d='m40.371 62.078c0.39062 1.2305 1.4297 2.0898 2.7188 2.2383 1.2812 0.14844 2.5-0.44922 3.1602-1.5508 0.03125-0.050781 0.058594-0.10938 0.078125-0.17188l2.3398-5.6992 8.8594 8.8516c0.98828 0.98828 2.3086 1.5391 3.7109 1.5391 1.3984 0 2.7188-0.55078 3.7109-1.5391l0.78906-0.78906c0.98828-0.98828 1.5391-2.3086 1.5391-3.7109 0-1.3984-0.55078-2.7188-1.5391-3.7109l-8.8516-8.8594 5.6992-2.3398c0.058593-0.019532 0.10937-0.050782 0.17187-0.078126 1.1094-0.67187 1.7109-1.8789 1.5508-3.1602-0.14844-1.2891-1.0117-2.3281-2.2617-2.7305l-25.109-7.4883c-1.1602-0.37109-2.4219-0.058594-3.2812 0.80078-0.85938 0.85937-1.1719 2.1211-0.80859 3.2617zm-4.9297-26.637c0.10156-0.10156 0.37109-0.30859 0.78125-0.17969l25.109 7.4883c0.42188 0.12891 0.5 0.48047 0.51953 0.62891 0.019532 0.14062 0.019532 0.46094-0.30078 0.69141l-7.3281 3.0117c-0.39062 0.16016-0.67188 0.5-0.75 0.91016-0.078125 0.41016 0.050782 0.82812 0.33984 1.1289l10.168 10.18c0.51953 0.51953 0.80859 1.2109 0.80859 1.9414 0 0.73047-0.28906 1.4219-0.80859 1.9414l-0.78906 0.78906c-1.0391 1.0391-2.8516 1.0391-3.8906 0l-10.18-10.172c-0.23828-0.23828-0.55859-0.37109-0.87891-0.37109-0.078126 0-0.16016 0.011718-0.25 0.019531-0.41016 0.078125-0.75 0.35938-0.91016 0.75l-3.0117 7.3281c-0.23047 0.30859-0.55078 0.30859-0.69141 0.30078-0.14062-0.019531-0.5-0.10156-0.62109-0.5l-7.5117-25.148c-0.11719-0.37891 0.09375-0.64844 0.19531-0.73828z' />
  </svg>
)

export const cursor = {
  Hand: Hand,
  HandClick: HandClick,
  Pointer: Pointer,
}
