
import { useState } from "react";
import { BairroWithFeeAndDistance, PizzaOptionsBySize, PizzaSize, ToppingWithPrice } from "../../types";
import useOrcamentoApi from "../hooks/useOrcamentoApi";
import { PizzaBuilder } from "./pizza-builder";
import { ResumoOrcamento } from "./ResumoOrcamento";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { cn } from "../../../lib/utils";

export type PizzaOrcamento = {
  id: string;
  size: PizzaSize;
  sabores: ToppingWithPrice[];
  quantidade: number;
};

export type OrcamentoMenuItem = "sabores-selector" | "resumo"

export function Orcamento() {
  const { data, error, loading } = useOrcamentoApi();

  const sizes = data?.payload?.sizes || [];
  const pizzaOptions = data?.payload?.options || {};
  const bairros = data?.payload?.bairros || [];


  const [currentActiveMenu, setCurrentActiveMenu] = useState<OrcamentoMenuItem | null>(null)

  const [currentSize, setCurrentSize] = useState<PizzaSize | null>(null);

  const [currentBairro, setCurrentBairro] = useState<BairroWithFeeAndDistance | null>(null)
  const [pizzas, setPizzas] = useState<PizzaOrcamento[]>([]);


  const adicionarPizza = (pizza: PizzaOrcamento) => {
    if (!pizza.size || pizza.sabores.length === 0) {
      return;
    }

    setPizzas(prev => [
      ...prev,
      pizza
    ]);
    setCurrentActiveMenu("resumo")
  };

  const MenuItem = ({ onClick, children, highlightCondition }: { onClick: () => void; children: React.ReactNode; highlightCondition: boolean }) => {
    return (
      <span onClick={onClick}
        className={
          cn(
            "cursor-pointer text-center text-[11px] uppercase tracking-wide hover:bg-gray-200 px-2 py-1 rounded transition-colors",
            highlightCondition && "font-semibold underline "
          )
        }>
        {children}
      </span>
    )
  }

  const removerPizza = (id: string) => {
    setPizzas(prev => prev.filter(pizza => pizza.id !== id));

  };

  const onSelectMenuItem = (item: OrcamentoMenuItem) => {
    if (loading || error) {
      setCurrentActiveMenu(null)
      return
    }
    setCurrentActiveMenu(item);
  }


  return (


    <>
      <div className="grid grid-cols-2 w-full mb-4">
        <MenuItem onClick={() => onSelectMenuItem("sabores-selector")}
          highlightCondition={currentActiveMenu === "sabores-selector"}>
          Selecionar Sabores
        </MenuItem>
        <MenuItem onClick={() => onSelectMenuItem("resumo")}
          highlightCondition={currentActiveMenu === "resumo"}>
          {`Resumo (${pizzas.length}) `}
        </MenuItem>
        {/* <MenuItem onClick={() => selectMenuOption("mensagem")} highlightCondition={showWhatsAppMessage}>
            Mensagem
          </MenuItem> */}

      </div>


      {data && !currentActiveMenu && (
        <div className="h-[100px] grid place-items-center">
          <span className="text-sm text-muted-foreground">Pode iniciar selecionado os sabores...</span>
        </div>
      )
      }

      {loading && <LoadingContent />}

      {error && <ErrorContent error={error} />}

      {!loading && !error && (
        <div className="flex flex-col">

          {currentActiveMenu === "sabores-selector" && (
            <PizzaBuilder
              sizes={sizes}
              currentSize={currentSize}
              setCurrentSize={setCurrentSize}
              options={pizzaOptions as PizzaOptionsBySize}
              onAddPizza={adicionarPizza}
              onRemovePizza={removerPizza}
            />
          )}

          {
            pizzas.length > 0 && currentActiveMenu === "resumo" && (
              <ResumoOrcamento
                pizzas={pizzas}
                onRemovePizza={removerPizza}
                bairros={bairros}
                currentBairro={currentBairro}
                setCurrentBairro={setCurrentBairro}
              />
            )
          }

          {/* {showWhatsAppMessage === true && (
          <OrcamentoTemplateMessage pizzas={pizzas} />
        )} */}

        </div>
      )}
    </>


  );
}


function LoadingContent() {
  return (
    <div className="grid place-items-center  w-full h-full">
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        <Loader2 className="animate-spin" />
        <p className="text-muted-foreground text-sm font-semibold">Carregando os dados...</p>
      </div>
    </div>
  )
}

function ErrorContent({ error }: { error: string | null }) {
  return (
    <div className="grid place-items-center w-full h-full">
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        <AlertCircleIcon color="red" size={48} />
        <p className="text-red-500 text-sm">Erro ao carregar os dados: {error}</p>
      </div>
    </div>

  );
}