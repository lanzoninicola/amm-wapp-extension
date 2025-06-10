

interface AppMenuProps {
  onFeatureSelection: (option: string) => void
}

const features = [
  {
    name: "orcamento",
    label: "Orçamento"
  }
]

export default function AppMenu({ onFeatureSelection }: AppMenuProps) {

  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[20px] bg-yellow-500 rounded-b-xl"
      data-element="amm-app-menu"
    >
      <div className="w-full grid place-items-center leading-none ">
        {features.map((f) => (
          <button
            key={f.name}
            className=" text-sm font-semibold uppercase tracking-wide"
            onClick={() => onFeatureSelection(f.name)}
          >
            {f.label}
          </button>
        ))}


      </div>
    </div>



  )
}