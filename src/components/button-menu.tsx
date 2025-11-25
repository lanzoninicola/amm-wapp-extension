import { useState } from "react"
import { cn } from "../lib/utils"

interface ButtonMenuProps {
  children: React.ReactNode,
  onClick: () => void,
  tooltipText: string,
  highlight?: boolean
}

export default function ButtonMenu({
  children,
  onClick,
  tooltipText,
  highlight = false
}: ButtonMenuProps) {

  const [hovered, setHovered] = useState(false)


  return (
    <button
      className={cn(
        'relative grid place-items-center w-7 h-7 rounded-full border border-transparent text-slate-900 cursor-pointer transition-all duration-150 bg-[#fdf9e3]',
        'hover:border-[#e3c95f] hover:bg-[#f7e58a] hover:scale-[1.05] active:translate-y-[1px]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3c95f]',
        highlight && 'ring-2 ring-[#e3c95f] ring-offset-1 ring-offset-white'
      )}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <div
        className={cn(
          'pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 z-10 rounded-md border border-[#e3c95f]/60 bg-white/95 px-1.5 py-0.5',
          'whitespace-nowrap text-[10px] font-semibold tracking-wide text-slate-900',
          hovered ? 'block animate-in' : 'hidden'
        )}
      >
        {tooltipText}
      </div>
    </button>
  )
}
