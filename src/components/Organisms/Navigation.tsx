import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { ArrowIcon } from '../Atoms'

const navigation = {
  Button: [
    { title: 'Option 1', description: 'Description 1.', link: '' },
    { title: 'Option 2', description: 'Description 2.', link: '' },
    { title: 'Option 3', description: 'Description 3.', link: '' },
  ],
  'Sign up': [{ title: 'Email', description: 'Sign up with email.', link: '/signup' }],
}

export const Navigation: React.FC = () => {
  const selected = false

  return (
    <nav
      id='Navigation'
      className='relative h-28'
      style={{
        background: 'rgba(0, 0, 0, 0.17)',
        backdropFilter: 'blur(5px)', // TODO calculate
      }}
    >
      <div className='relative z-20 flex h-28 w-full items-center justify-between px-6'>
        <Link id='Logo' className='group relative z-20 order-1 size-10 cursor-pointer' href='/'>
          <Image
            className='absolute scale-125 transition-opacity duration-500 group-hover:opacity-0'
            src='/Q-0-t-2.png'
            alt='Logo'
            height={40}
            width={40}
          />
          <Image
            className='absolute scale-125 opacity-0 transition-opacity duration-1000 group-hover:opacity-100'
            src='/Q-1-t-2.png'
            alt='Logo'
            height={40}
            width={40}
          />
        </Link>
        <div
          id='ConnectButton'
          className='relative z-10 order-3 flex h-16 w-60 cursor-pointer items-center justify-between gap-6 rounded-md border border-stone-400 bg-transparent px-4 py-8 transition-colors duration-500 hover:bg-stone-700'
        >
          <span className='text-base font-normal uppercase text-stone-300'>CONNECT WALLET</span>
          <span className='flex h-6 min-h-6 w-6 min-w-6 items-center justify-center'>
            <ArrowIcon />
          </span>
        </div>
        <div id='NavMenu' className='relative order-2 flex items-center gap-[8px]'>
          {Object.entries(navigation).map(([title, options]) => (
            <MenuButton key={`${title}`} selected={selected} title={title} subMenuOptions={options} />
          ))}
        </div>
      </div>
    </nav>
  )
}

interface MenuButtonProps {
  selected: boolean
  title: string
  subMenuOptions: SubMenuProps[]
}

export const MenuButton: React.FC<MenuButtonProps> = ({ selected, title, subMenuOptions }) => (
  <div className='group'>
    <div
      className='flex h-[48px] w-[128px] cursor-pointer items-center justify-center rounded-sm text-base font-extralight transition-colors duration-500 hover:!bg-stone-700 group-hover:bg-stone-900 selected:bg-stone-700'
      data-selected={selected}
    >
      {title}
    </div>
    <div className='absolute left-0 hidden w-full pt-4 group-hover:block'>
      <div className='rounded-md border border-stone-700 bg-stone-900 shadow-lg'>
        {subMenuOptions.map((props) => (
          <SubMenu key={`${props.title}`} selected={selected} {...props} />
        ))}
      </div>
    </div>
  </div>
)

interface SubMenuProps {
  selected?: boolean
  title: string
  description: string
  link: string
}

export const SubMenu: React.FC<SubMenuProps> = ({ selected, title, description, link }) => (
  <Link
    id='NavChildMenu'
    href={link}
    data-selected={selected}
    type='button'
    className='cursor-click flex w-full items-center gap-[8px] p-5 text-left hover:bg-stone-700 selected:bg-stone-700'
  >
    <div className='flex w-full flex-col gap-[4px]'>
      <span className='!font-twk-lausanne tracking-label flex items-center gap-4 text-base font-medium text-slate-100'>
        {title}
      </span>
      <span className='!font-twk-lausanne tracking-body font-sm font-extralight text-stone-400'>{description}</span>
    </div>
  </Link>
)
