import { ActiveAppFeature } from "./App"
import { Separator } from "./components/ui/separator"


interface AppMenuProps {
  onFeatureSelection: (option: ActiveAppFeature) => void
  children?: React.ReactNode
}

const features = [
  {
    name: "orcamento",
    label: "Orçamento"
  }
]

export default function AppMenu({ onFeatureSelection, children }: AppMenuProps) {

  return (
    <div
      className="fixed top-0 right-0 w-max px-8 h-[25px] bg-yellow-500 rounded-bl-xl"
      data-element="amm-app-menu"
    >
      <div className="flex items-center">
        <div className="w-full h-full grid place-items-center leading-none ">
          {features.map((f) => (
            <button
              key={f.name}
              className="text-xs font-semibold uppercase tracking-wide"
              onClick={() => onFeatureSelection(f.name as ActiveAppFeature)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Separator orientation="vertical" className="h-4 mx-2 bg-yellow-300" />
        {children}
      </div>
    </div>



  )
}