import { useState } from "react";
import AppMenu from "./AppMenu";
import { Orcamento } from "./domain/orcamento/components/Orcamento";
import { Receipt, XIcon } from "lucide-react";
import QuickActionBar from "./domain/quick-action-bar/components/quick-action-bar";

export const FEATURES = [
  {
    name: "orcamento",
    label: "Orçamento",
    icon: <Receipt size={16} />
  }
]


export type ActiveAppFeature = "orcamento" | null

export default function App() {

  const [currentActiveFeature, setCurrentActiveFeature] = useState<ActiveAppFeature | null>(null)

  function selectFeature(feature: ActiveAppFeature) {
    setCurrentActiveFeature(feature)
  }

  return (
    <>
      <AppMenu onFeatureSelection={selectFeature} >

        <div className="flex items-center gap-3">
          <QuickActionBar />
        </div>

      </AppMenu>
      {currentActiveFeature !== null && (
        <ContainerFloatLeft setCurrentActiveFeature={setCurrentActiveFeature}>
          {currentActiveFeature === "orcamento" &&
            <Orcamento />
          }
        </ContainerFloatLeft>
      )}
      {/* <AppSidebar /> */}
      {/*<AppAssistenteEscolha /> */}
    </>
  )
}

interface ContainerFloatLeftProps {
  setCurrentActiveFeature: (feature: ActiveAppFeature) => void
  children: React.ReactNode
}

function ContainerFloatLeft({
  children,
  setCurrentActiveFeature
}: ContainerFloatLeftProps) {
  return (
    <div className="fixed top-6 left-4 p-3 bg-white rounded-xl shadow-lg "
      style={{ width: "500px", maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}
      data-element="amm-app-ContainerFloatLeft"
    >
      {/* Fechar a janela */}
      <button className="h-4 w-full flex justify-end" onClick={() => {
        setCurrentActiveFeature(null)
      }}>
        <XIcon
          className="w-4 h-4 text-gray-700 hover:text-gray-800 transition-colors cursor-pointer" />
      </button>
      {children}
    </div>
  )
}