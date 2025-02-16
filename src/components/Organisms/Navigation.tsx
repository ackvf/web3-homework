import React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import { ROUTE } from "@/routes"

import { ArrowIcon } from "../Atoms"

export const Navigation: React.FC = () => {
  const router = useRouter()

  // const navigation = {
  //   "Tokens": [
  //     { title: "Tokens", description: "View and Send owned ERC20 tokens", link: ROUTE.TOKENS },
  //     { title: "Send ETH", description: "Send native chain currency", link: ROUTE.SEND_ETH },
  //   ],
  //   "NFTs": [
  //     { title: "View NFTs", description: "View owned ERC721 & ERC1155 NFTs", link: ROUTE.NFTS },
  //     { title: "Send NFTs", description: "Send ERC721 & ERC1155 NFTs", link: ROUTE.SEND_NFTS },
  //   ],
  // }

  return (
    <nav
      id="Navigation"
      className="fixed top-0 h-28 w-full"
      style={{
        background: "rgba(0, 0, 0, 0.17)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="relative z-20 flex h-28 w-full items-center justify-between px-6">
        <Link id="Logo" className="group relative z-20 order-1 size-10 cursor-pointer" href="/">
          <Image
            className="absolute scale-125 transition-opacity duration-500 group-hover:opacity-0"
            src="/Q-0-t-2.png"
            alt="Logo"
            height={40}
            width={40}
          />
          <Image
            className="absolute scale-125 opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
            src="/Q-1-t-2.png"
            alt="Logo"
            height={40}
            width={40}
          />
        </Link>

        <ConnectButton.Custom>
          {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
            const ready = mounted && account && chain
            const connected = ready && account && chain

            const handles = !connected
              ? {
                  onClick: openConnectModal,
                  label: "Connect Wallet",
                }
              : chain?.unsupported
                ? {
                    onClick: openChainModal,
                    label: "Wrong network",
                  }
                : undefined

            return handles ? (
              <button
                id="ConnectButton"
                className="relative z-10 order-3 flex h-16 w-60 cursor-pointer items-center justify-between gap-6 rounded-md border border-stone-400 bg-transparent px-4 py-8 transition-colors duration-500 hover:bg-stone-700"
                onClick={handles.onClick}
              >
                <span className="text-base font-normal uppercase text-stone-300">{handles.label}</span>
                <span className="flex h-6 min-h-6 w-6 min-w-6 items-center justify-center">
                  <ArrowIcon />
                </span>
              </button>
            ) : (
              <div className="order-3 flex gap-3">
                <button onClick={openChainModal}>{chain!.name}</button>
                <button onClick={openAccountModal}>{account!.displayName}</button>
              </div>
            )
          }}
        </ConnectButton.Custom>

        <div id="NavMenu" className="relative order-2 flex items-center gap-[8px]">
          <MenuButton title="Send ETH" link={ROUTE.SEND_ETH} />
          <MenuButton title="Tokens" link={ROUTE.TOKENS} />
          <MenuButton title="NFTs" link={ROUTE.NFTS} />
          {
            // This menu supports sub-items, but I ended up using flat menu.
            // Object.entries(navigation).map(([title, options]) => (
            //   <SubMenuButton key={`${title}`} selected={options.some(({ link }) => link === router.pathname)} title={title} subMenuOptions={options} />
            // ))
          }
        </div>
      </div>
    </nav>
  )
}

interface MenuButtonProps {
  selected?: boolean
  title: string
  link: string
}

const MenuButton: React.FC<MenuButtonProps> = ({ selected: selected_, title, link }) => {
  const router = useRouter()
  const selected = selected_ ?? link === router.pathname
  return (
    <Link id="MenuButton" href={link} data-selected={selected} type="button">
      <div
        className="cursor-click flex h-[48px] w-[128px] items-center justify-center rounded-sm text-base font-extralight transition-colors duration-100 hover:!bg-stone-700 group-hover:bg-stone-900 selected:bg-stone-700"
        data-selected={selected}
      >
        {title}
      </div>
    </Link>
  )
}

interface SubMenuButtonProps extends Omit<MenuButtonProps, "link"> {
  subMenuOptions: ChildMenuProps[]
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({ selected, title, subMenuOptions }) => {
  const router = useRouter()

  return (
    <button id="MenuButton" className="group">
      <div
        className="flex h-[48px] w-[128px] cursor-pointer items-center justify-center rounded-sm text-base font-extralight transition-colors duration-500 hover:!bg-stone-700 group-hover:bg-stone-900 selected:bg-stone-700"
        data-selected={selected}
      >
        {title}
      </div>
      <div
        id="ChildMenuContainer"
        className="absolute left-0 hidden w-full min-w-80 pt-4 group-hover:block group-focus:block"
      >
        <div className="rounded-md border border-stone-700 bg-stone-900 shadow-lg">
          {subMenuOptions.map((props) => (
            <ChildMenu key={`${props.title}`} selected={props.link === router.pathname} {...props} />
          ))}
        </div>
      </div>
    </button>
  )
}

interface ChildMenuProps {
  selected?: boolean
  title: string
  description: string
  link: string
}

const ChildMenu: React.FC<ChildMenuProps> = ({ selected, title, description, link }) => (
  <Link
    id="ChildMenu"
    href={link}
    data-selected={selected}
    type="button"
    className="cursor-click flex w-full items-center gap-[8px] p-5 text-left hover:bg-stone-700 selected:bg-stone-700"
  >
    <div className="flex w-full flex-col gap-[4px]">
      <span className="!font-twk-lausanne tracking-label flex items-center gap-4 text-base font-medium text-slate-100">
        {title}
      </span>
      <span className="!font-twk-lausanne tracking-body font-sm font-extralight text-stone-400">{description}</span>
    </div>
  </Link>
)
