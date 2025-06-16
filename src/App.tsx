import { useState } from "react";
import AppMenu from "./AppMenu";
import AppSidebar from "./AppSidebar";
import { Orcamento } from "./domain/orcamento/components/Orcamento";
import { XIcon } from "lucide-react";
import QuickActionBar from "./domain/quick-action-bar/components/quick-action-bar";

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
        <Container setCurrentActiveFeature={setCurrentActiveFeature}>
          {currentActiveFeature === "orcamento" &&
            <Orcamento />
          }
        </Container>
      )}
      {/* <AppSidebar /> */}
      {/*<AppAssistenteEscolha /> */}
    </>
  )
}

interface ContainerProps {
  setCurrentActiveFeature: (feature: ActiveAppFeature) => void
  children: React.ReactNode
}

function Container({
  children,
  setCurrentActiveFeature
}: ContainerProps) {
  return (
    <div className="fixed top-6 left-4 p-3 bg-white rounded-xl shadow-lg "
      style={{ width: "500px", maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}
      data-element="amm-app-container"
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