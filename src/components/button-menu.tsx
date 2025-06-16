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
    <button className={
      cn(
        'relative grid place-items-center mr-3 bg-none rounded-full  text-black  h-6 w-6 cursor-pointer  ',
        "hover:border hover:bg-yellow-200",
      )
    }
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <div className={
        cn(
          "hidden",
          "w-[120px] h-[60px]",
          // "absolute w-[120px] right-[70px]",
          "absolute top-9 right-0",
          hovered && "block animate-in",
        )
      }>
        <p className="text-xs uppercase font-semibold tracking-wide text-right">
          {tooltipText}
        </p>

      </div>
    </button>


  )
}