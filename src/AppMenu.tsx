import { useEffect, useRef } from "react"
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

  useEffect(() => {
    const bar = menuRef.current
    if (!bar) return

    const GAP_BELOW_BAR = 0
    let targetApp: HTMLElement | null = null
    let resizeObserver: ResizeObserver | null = null
    let pollInterval: number | null = null

    const applyOffset = () => {
      if (!targetApp) return
      const barHeight = bar.getBoundingClientRect().height
      const offset = Math.ceil(barHeight + GAP_BELOW_BAR)
      targetApp.style.top = `${offset}px`
      targetApp.style.height = `calc(100% - ${offset}px)`
    }

    const attachToApp = () => {
      targetApp = document.getElementById("app") as HTMLElement | null
      if (!targetApp) return false

      resizeObserver = new ResizeObserver(applyOffset)
      resizeObserver.observe(bar)
      window.addEventListener("resize", applyOffset)
      applyOffset()
      return true
    }

    if (!attachToApp()) {
      pollInterval = window.setInterval(() => {
        if (attachToApp() && pollInterval !== null) {
          window.clearInterval(pollInterval)
          pollInterval = null
        }
      }, 300)
    }

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener("resize", applyOffset)
      if (pollInterval !== null) window.clearInterval(pollInterval)
      if (targetApp) {
        targetApp.style.top = ""
        targetApp.style.height = ""
      }
    }
  }, [])

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 right-0 flex justify-center z-[1000000] pointer-events-auto bg-[#f7e58a]/95"
      data-element="amm-app-menu"
    >
      <div className="w-full p-1 inline-flex flex-row items-center justify-end ">
        <div className="w-full flex items-center gap-x-2 justify-end">
          {FEATURES.map((f) => (
            <ButtonMenu
              key={f.name}
              tooltipText={f.label}
              onClick={() => onFeatureSelection(f.name as ActiveAppFeature)}
            >
              {f.icon}
            </ButtonMenu>
          ))}
        </div>

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
