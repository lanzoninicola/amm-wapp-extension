
import { ActiveAppFeature, FEATURES } from "./App"
import ButtonMenu from "./components/button-menu"
import { Separator } from "./components/ui/separator"


interface AppMenuProps {
  onFeatureSelection: (option: ActiveAppFeature) => void
  children?: React.ReactNode
}


export default function AppMenu({ onFeatureSelection, children }: AppMenuProps) {

  return (
    <div
      className="fixed top-0 right-0 w-max px-3 py-1.5  rounded-bl-xl"
      data-element="amm-app-menu"
    >
      <div className="flex flex-row items-center gap-1">
        {FEATURES.map((f) => (
          // <button
          //   key={f.name}
          //   className="text-xs font-semibold uppercase tracking-wide"
          //   onClick={() => onFeatureSelection(f.name as ActiveAppFeature)}
          // >
          //   {f.label}
          // </button>
          <ButtonMenu
            key={f.name}
            tooltipText={f.label}
            onClick={() => onFeatureSelection(f.name as ActiveAppFeature)}
          >
            {f.icon}
          </ButtonMenu>
        ))}

        <Separator orientation="vertical" className="h-5 mx-2 bg-yellow-300/90" />
        {children}
      </div>
    </div>



  )
}
