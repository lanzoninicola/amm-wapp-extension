import { useState } from "react";
import AppMenu from "./AppMenu";
import { Orcamento } from "./domain/orcamento/components/Orcamento";
import { MessageCircleCode, Receipt, XIcon } from "lucide-react";
import QuickActionBar from "./domain/quick-action-bar/components/quick-action-bar";
import TemplateList from "./domain/template-messages/components/template-list.component";

export const FEATURES = [
  {
    name: "orcamento",
    label: "Orçamento",
    icon: <Receipt size={16} />
  },
  {
    name: "message-templates",
    label: "Modelos de mensagens",
    icon: <MessageCircleCode size={16} />
  },
]


export type ActiveAppFeature = "orcamento" | "message-templates" | null

export default function App() {

  const [currentActiveFeature, setCurrentActiveFeature] = useState<ActiveAppFeature | null>(null)

  function selectFeature(feature: ActiveAppFeature) {
    setCurrentActiveFeature(feature)
  }

  return (
    <>
      <AppMenu onFeatureSelection={selectFeature} >

        <div className="flex items-center">
          <QuickActionBar />
        </div>

      </AppMenu>
      {currentActiveFeature !== null && (
        <ContainerFloatLeft setCurrentActiveFeature={setCurrentActiveFeature}>
          {currentActiveFeature === "orcamento" &&
            <Orcamento />
          }
          {currentActiveFeature === "message-templates" &&
            <TemplateList />
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
    <div className="fixed top-6 left-4 bg-white p-3 rounded-xl shadow-lg "
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