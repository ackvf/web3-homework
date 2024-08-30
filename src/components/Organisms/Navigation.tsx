import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import { ROUTE } from '@/routes'

import { ArrowIcon } from '../Atoms'

export const Navigation: React.FC = () => {
  const { data: session } = useSession()

  const selected = false

  const navigation = {
    Plaid: [
      { title: 'Link', description: 'Link bank account with Plaid', link: ROUTE.PLAID_LINK },
      { title: 'Dashboard', description: 'View Balance', link: ROUTE.PLAID_DASHBOARD },
    ],
    ...((!session || !session.user) && {
      'Sign in / up': [
        { title: 'Sign in', description: 'Sign in with email.', link: ROUTE.SIGNIN },
        { title: 'Sign up', description: 'Create new account with email.', link: ROUTE.SIGNUP },
      ],
    }),
  }

  return (
    <nav
      id='Navigation'
      className='fixed h-28 w-full top-0'
      style={{
        background: 'rgba(0, 0, 0, 0.17)',
        backdropFilter: 'blur(5px)',
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
          {session && session.user && (
            <div id='MenuButton' onClick={() => signOut()}>
              <div
                className='cursor-click flex h-[48px] w-[128px] items-center justify-center rounded-sm text-base font-extralight transition-colors duration-500 hover:!bg-stone-700 group-hover:bg-stone-900 selected:bg-stone-700'
                data-selected={selected}
              >
                Sign Out
              </div>
            </div>
          )}
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
  <div id='MenuButton' className='group'>
    <div
      className='flex h-[48px] w-[128px] cursor-pointer items-center justify-center rounded-sm text-base font-extralight transition-colors duration-500 hover:!bg-stone-700 group-hover:bg-stone-900 selected:bg-stone-700'
      data-selected={selected}
    >
      {title}
    </div>
    <div id='ChildMenuContainer' className='absolute left-0 hidden w-full min-w-80 pt-4 group-hover:block'>
      <div className='rounded-md border border-stone-700 bg-stone-900 shadow-lg'>
        {subMenuOptions.map((props) => (
          <ChildMenu key={`${props.title}`} selected={selected} {...props} />
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

export const ChildMenu: React.FC<SubMenuProps> = ({ selected, title, description, link }) => (
  <Link
    id='ChildMenu'
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
