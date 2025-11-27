
import { GripHorizontal } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { ActiveAppFeature, FEATURES } from "./App"
import ButtonMenu from "./components/button-menu"
import { Separator } from "./components/ui/separator"


interface AppMenuProps {
  onFeatureSelection: (option: ActiveAppFeature) => void
  children?: React.ReactNode
}


export default function AppMenu({ onFeatureSelection, children }: AppMenuProps) {
  const hasExtras = Boolean(children)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const dragState = useRef<{ startX: number; startLeft: number }>({ startX: 0, startLeft: 0 })
  const [positionX, setPositionX] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const clamp = useCallback(
    (value: number, min: number, max: number) => Math.min(max, Math.max(min, value)),
    []
  )

  const updateBounds = () => {
    const el = menuRef.current
    if (!el) return
    const margin = 12
    const width = el.getBoundingClientRect().width
    const maxX = Math.max(margin, window.innerWidth - width - margin)
    setPositionX((current) => {
      if (current === null) return maxX
      return clamp(current, margin, maxX)
    })
  }

  useEffect(() => {
    updateBounds()
    window.addEventListener("resize", updateBounds)
    return () => window.removeEventListener("resize", updateBounds)
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || positionX === null) return
      const el = menuRef.current
      if (!el) return
      const deltaX = e.clientX - dragState.current.startX
      const margin = 12
      const width = el.getBoundingClientRect().width
      const maxX = Math.max(margin, window.innerWidth - width - margin)
      const next = clamp(dragState.current.startLeft + deltaX, margin, maxX)
      setPositionX(next)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [clamp, isDragging, positionX])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!menuRef.current) return
    e.preventDefault()
    dragState.current = {
      startX: e.clientX,
      startLeft: positionX ?? menuRef.current.getBoundingClientRect().left,
    }
    setIsDragging(true)
  }

  return (
    <div
      ref={menuRef}
      className="fixed top-0 w-max px-2 py-1.5 bg-[#f7e58a]/95 border border-[#e3c95f]/70 rounded-bl-xl backdrop-blur select-none"
      style={{
        left: positionX ?? undefined,
        right: positionX === null ? 0 : "auto",
      }}
      data-element="amm-app-menu"
    >
      <div className="flex flex-row items-center gap-1">
        <DragHandle onPointerDown={handlePointerDown} isDragging={isDragging} />

        {FEATURES.map((f) => (
          <ButtonMenu
            key={f.name}
            tooltipText={f.label}
            onClick={() => onFeatureSelection(f.name as ActiveAppFeature)}
          >
            {f.icon}
          </ButtonMenu>
        ))}

        {hasExtras && (
          <>
            <Separator orientation="vertical" className="h-5 mx-2 bg-[#e3c95f]/80" />
            {children}
          </>
        )}
      </div>
    </div>



  )
}

interface DragHandleProps {
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
  isDragging: boolean
}

function DragHandle({ onPointerDown, isDragging }: DragHandleProps) {
  return (
    <div
      role="button"
      tabIndex={-1}
      className="h-8 w-6 flex items-center justify-center text-amber-800/80 hover:text-amber-900 cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      aria-label="Arrastar barra"
    >
      <GripHorizontal size={16} strokeWidth={2.25} className={isDragging ? "opacity-80" : "opacity-100"} />
    </div>
  )
}
