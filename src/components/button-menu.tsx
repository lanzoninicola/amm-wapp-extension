import { useState } from "react"
import { cn } from "../lib/utils"

interface ButtonMenuProps {
  children: React.ReactNode,
  onClick: () => void,
  tooltipText: string
}

export default function ButtonMenu({
  children,
  onClick,
  tooltipText
}: ButtonMenuProps) {

  const [hovered, setHovered] = useState(false)


  return (
    <button
      className={cn(
        'relative grid place-items-center w-7 h-7 rounded-full border border-transparent bg-white/70 text-slate-900 cursor-pointer transition-all duration-150',
        'hover:border-yellow-300 hover:bg-yellow-200/70 active:translate-y-[1px]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600'
      )}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <div
        className={cn(
          'pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 z-10 rounded-md border border-yellow-200 bg-white px-1.5 py-0.5 shadow-lg',
          'whitespace-nowrap text-[10px] uppercase font-semibold tracking-wide text-slate-900',
          hovered ? 'block animate-in' : 'hidden'
        )}
      >
        {tooltipText}
      </div>
    </button>
  )
}
