import { useEffect, useRef } from 'react'

import { Cursor, HandCursor, HandClickCursor } from '@/components'

/**
 * Move a container with svgs to current mouse position to simulate custom cursors.
 *
 * Note: Cursors must have correct size and be aligned to the tip of the actual cursor, including correct rotation.
 * To enable default cursor see globals.css `cursor: none`.
 *
 * TODO: disable on mobile
 */

export function useCursor() {
  const cursorsContainer = useRef<HTMLDivElement>(null)

  /* Position the container on "mousemove" event. */

  useEffect(() => {
    let activeCursor: 0 | 1 | 2 = 0

    const listener = (event: MouseEvent) => {
      const { x, y } = { x: event.clientX, y: event.clientY }

      const path = event.composedPath?.() ?? (event as MouseEvent & { path: Node[] }).path

      if (path.some((item) => (item as HTMLElement).classList?.contains('cursor-pointer'))) activeCursor = 1
      else if (path.some((item) => (item as HTMLElement).classList?.contains('cursor-click'))) activeCursor = 2
      else activeCursor = 0

      if (cursorsContainer.current) {
        cursorsContainer.current.style.transform = `translate(${x}px, ${y}px)`
        cursorsContainer.current.dataset.cursor = activeCursor.toString()
      }
    }

    window.addEventListener('mousemove', listener)
    return () => void window.removeEventListener('mousemove', listener)
  }, [])

  /* Hide the cursors when leaving the page with "mouseleave" event. */

  useEffect(() => {
    const listener = function (event: MouseEvent) {
      if (
       /**/event.clientY <= 0
        || event.clientX <= 0
        || event.clientX >= window.innerWidth
        || event.clientY >= window.innerHeight
      )
        if (cursorsContainer.current) cursorsContainer.current.dataset.cursor = ''
    }

    document.addEventListener('mouseleave', listener)
    return () => void document.removeEventListener('mouseleave', listener)
  }, [])

  return (
    <div id='cursors' ref={cursorsContainer} data-cursor='' className='group pointer-events-none fixed'>
      <Cursor id='cursorArrow' className='pointer-events-none absolute hidden size-5 group-data-[cursor=0]:block' />
      <HandCursor id='cursorHand' className='pointer-events-none absolute -left-1.5 -top-2 hidden size-7 -rotate-90 group-data-[cursor=1]:block' />
      <HandClickCursor id='cursorHandClick' className='pointer-events-none absolute -left-1.5 -top-2 hidden size-7 -rotate-90 group-data-[cursor=2]:block' />
    </div>
  )
}
