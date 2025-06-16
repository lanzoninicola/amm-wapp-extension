
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
      className="fixed top-0 right-0 w-max px-8 h-[25px] bg-yellow-500 rounded-bl-xl"
      data-element="amm-app-menu"
    >
      <div className="flex items-center">
        <div className="w-full h-full grid place-items-center leading-none ">
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
        </div>
        <Separator orientation="vertical" className="h-4 mx-4 bg-yellow-300" />
        {children}
      </div>
    </div>



  )
}