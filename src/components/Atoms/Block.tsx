import { type CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge'

export type BlockProps = {
  id?: string
  borderStyle?: 'solid' | 'gradient'
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

/**
 * This Block component adds standard padding and rounded borders.
 */
export const Block: React.FC<React.PropsWithChildren<BlockProps>> = ({
  id = 'Block',
  className: className_ = '',
  borderStyle = 'solid',
  children,
  onClick,
}) => {
  const className = [classNames.base, 'rounded-md', classNames.borderStyle[borderStyle]].join(' ')

  return (
    <div
      id={id}
      // prettier-ignore
      style={{
        '--block-bg-content': 'linear-gradient(var(--block-bg-color), var(--block-bg-color))', // this needs to be linear gradient, because flat color gets overlapped for some reason
        '--block-bg-border': 'linear-gradient(93.06deg, #d796eb 5.07%, #3dceab 100%)',
      } as CSSProperties}
      className={twMerge(className, className_)}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

const classNames = {
  base: [
    'w-[600px] mx-auto',
    'p-6 md:p-8',
    'flex flex-col',
    'border border-stone-600 shadow-lg bg-stone-950',
    '[--block-bg-color:theme("colors.stone.950")]',
  ].join(' '),
  borderStyle: {
    solid: '',
    gradient: '!border-transparent [background:padding-box_var(--block-bg-content),border-box_var(--block-bg-border)]',
  },
  radius: {
    sm: 'rounded-sm',
    md: 'rounded-md',
  },
} as const
