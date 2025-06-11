import { useState } from "react";
import AppMenu from "./AppMenu";
import AppSidebar from "./AppSidebar";
import { Orcamento } from "./domain/orcamento/components/Orcamento";




export default function App() {

  const [currentActiveFeature, setCurrentActiveFeature] = useState<string | null>(null)

  function selectFeature(feature: string) {
    setCurrentActiveFeature(feature)
  }

  return (
    <>
      <AppMenu onFeatureSelection={selectFeature} />
      {currentActiveFeature === "orcamento" &&
        <Orcamento setCurrentActiveFeature={setCurrentActiveFeature} />
      }
      <AppSidebar />
      {/*<AppAssistenteEscolha /> */}
    </>
  )
}