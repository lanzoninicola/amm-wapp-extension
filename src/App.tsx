import { useState } from "react";
import AppMenu from "./AppMenu";
import AppSidebar from "./AppSidebar";
import { Orcamento } from "./domain/orcamento/components/Orcamento";

export type ActiveAppFeature = "orcamento" | null


export default function App() {

  const [currentActiveFeature, setCurrentActiveFeature] = useState<ActiveAppFeature | null>(null)

  function selectFeature(feature: ActiveAppFeature) {
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