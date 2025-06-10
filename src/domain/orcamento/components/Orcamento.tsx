
import { useState } from "react";
import { useToast } from "../../../components/ui/use-toast";
import { PizzaOptionsBySize, PizzaSize, ToppingWithPrice } from "../../types";
import useOrcamentoApi from "../hooks/useOrcamentoApi";
import { PizzaBuilder } from "./pizza-builder";
import { ResumoOrcamento } from "./ResumoOrcamento";
import { AlertCircleIcon, Loader2, XIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import OrcamentoTemplateMessage from "./orcamento-template-message";

export type PizzaOrcamento = {
  id: string;
  size: PizzaSize;
  sabores: ToppingWithPrice[];
  quantidade: number;
};

interface OrcamentoProps {
  setCurrentActiveFeature?: (feature: string | null) => void;
}

export function Orcamento({ setCurrentActiveFeature }: OrcamentoProps) {
  const { data, error, loading } = useOrcamentoApi({ mockResponse: true });

  const { toast } = useToast();


  const [pizzas, setPizzas] = useState<PizzaOrcamento[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [showWhatsAppMessage, setShowWhatsAppMessage] = useState(false);
  const [showResumo, setShowResumo] = useState(false);

  const sizes = data?.payload?.sizes || [];
  const pizzaOptions = data?.payload?.options || {};

  if (loading) return (
    <div className="fixed top-6 left-4 p-3 bg-white rounded-xl shadow-lg h-[200px]">
      <div className="grid place-items-center  w-full h-full">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <Loader2 className="animate-spin" />
          <p>Carregando os dados...</p>
        </div>
      </div>

    </div>
  );
  if (error && error !== null) return (
    <div className="fixed top-6 left-4 p-3 bg-white rounded-xl shadow-lg h-[200px]">
      <div className="grid place-items-center w-full h-full">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <AlertCircleIcon color="red" size={48} />
          <p className="text-red-500 text-sm">Erro ao carregar os dados: {error}</p>
        </div>
      </div>

    </div>
  );

  if (!data || Object.keys(data).length === 0) return <p>Nenhum dado disponível.</p>;



  const adicionarPizza = (pizza: PizzaOrcamento) => {
    if (!pizza.size || pizza.sabores.length === 0) {
      toast({ title: "Preencha todos os campos antes de adicionar." });
      return;
    }

    setPizzas(prev => [
      ...prev,
      pizza
    ]);
    setMostrarFormulario(false);
    setShowResumo(true);
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

  function selectMenuOption(option: string) {
    switch (option) {
      case "adicionar-pizzas":
        setMostrarFormulario(true);
        setShowResumo(false);
        setShowWhatsAppMessage(false);
        break;
      case "resumo":
        setMostrarFormulario(false);
        setShowResumo(true);
        setShowWhatsAppMessage(false);
        break;
      case "mensagem":
        setMostrarFormulario(false);
        setShowResumo(false);
        setShowWhatsAppMessage(true);
        break;
      default:
        setMostrarFormulario(false);
        setShowResumo(false);
        setShowWhatsAppMessage(false);
        break;
    }
  }

  const removerPizza = (id: string) => {
    setPizzas(prev => prev.filter(pizza => pizza.id !== id));
    toast({ title: "Pizza removida do orçamento." });
  };

  return (
    <div className="fixed top-6 left-4 p-3 bg-white rounded-xl shadow-lg " style={{ width: "500px", maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}>

      <div className="h-4 w-full flex justify-end">
        <XIcon className="w-4 h-4 text-gray-700 hover:text-gray-800 transition-colors cursor-pointer"
          onClick={() => setCurrentActiveFeature && setCurrentActiveFeature(null)} />
      </div>


      <div className="flex flex-col">

        <div className="grid grid-cols-3 w-full  mb-4">
          <MenuItem onClick={() => selectMenuOption("adicionar-pizzas")} highlightCondition={mostrarFormulario}>
            Adicionar Pizzas
          </MenuItem>
          <MenuItem onClick={() => selectMenuOption("resumo")} highlightCondition={showResumo}>
            {`Resumo (${pizzas.length}) `}
          </MenuItem>
          <MenuItem onClick={() => selectMenuOption("mensagem")} highlightCondition={showWhatsAppMessage}>
            Mensagem
          </MenuItem>

        </div>

        {
          showResumo && (
            <ResumoOrcamento pizzas={pizzas} onRemovePizza={removerPizza} />
          )
        }
      </div>

      {mostrarFormulario && (
        <PizzaBuilder
          sizes={sizes}
          options={pizzaOptions as PizzaOptionsBySize}
          onAddPizza={adicionarPizza}
          onRemovePizza={removerPizza}
        />
      )}



      {showWhatsAppMessage === true && (
        <OrcamentoTemplateMessage pizzas={pizzas} />
      )}
    </div>
  );
}
