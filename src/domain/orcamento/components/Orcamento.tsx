
import { useState } from "react";
import { useToast } from "../../../components/ui/use-toast";
import { PizzaOptionsBySize, PizzaSize, ToppingWithPrice } from "../../types";
import useOrcamentoApi from "../hooks/useOrcamentoApi";
import { PizzaBuilder } from "./PizzaBuilder";
import { ResumoOrcamento } from "./ResumoOrcamento";
import { CopyIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

export type PizzaOrcamento = {
  id: string;
  size: PizzaSize;
  sabores: ToppingWithPrice[];
  quantidade: number;
};

export function Orcamento() {
  const { data, error, loading } = useOrcamentoApi({ mockResponse: true });

  const { toast } = useToast();


  const [pizzas, setPizzas] = useState<PizzaOrcamento[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [showWhatsAppMessage, setShowWhatsAppMessage] = useState(false);
  const [showResumo, setShowResumo] = useState(false);

  const sizes = data?.payload?.sizes || [];
  const pizzaOptions = data?.payload?.options || {};

  if (loading) return <p>Carregando...</p>;
  if (error && error !== null) return <p className="text-red-500">Erro ao carregar os dados: {error}</p>;
  if (!data || Object.keys(data).length === 0) return <p>Nenhum dado disponível.</p>;


  const buscarPrecoBase = (size: string): number => {
    const options = pizzaOptions[size] || [];
    if (options.length === 0) return 0;
    return options[0].priceAmount ?? 0;
  };

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
  };



  const gerarMensagem = (): string => {
    if (pizzas.length === 0) return "Nenhuma pizza adicionada.";

    const partes = pizzas.map((pizza) => {
      const sabores = pizza.sabores.map(s => s.name).join(", ");
      return `${pizza.quantidade}x ${pizza.size.name.toUpperCase()} com ${pizza.sabores.length} sabores (${sabores})`;
    });

    const total = pizzas.reduce((acc, p) => acc + buscarPrecoBase(p.size.key) * p.quantidade, 0).toFixed(2);

    return `Pedido:\n${partes.map(p => "- " + p).join("\n")}\nTotal estimado: R$ ${total}`;
  };

  const copiarMensagem = () => {
    const texto = gerarMensagem().replace(/\n/g, "\n");
    navigator.clipboard.writeText(texto);
    toast({ title: "Mensagem copiada para a área de transferência!" });
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
    <div className="fixed top-4 left-4 p-3 bg-white rounded-xl shadow-lg " style={{ width: "500px", maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}>



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
          options={data.payload.options as PizzaOptionsBySize}
          onAddPizza={adicionarPizza}
          onRemovePizza={removerPizza}
        />
      )}



      {showWhatsAppMessage === true && (

        <div className="mt-6">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold mb-2">Mensagem final</h4>
            <button onClick={copiarMensagem} className="mt-2">
              <CopyIcon className="w-4 h-4 text-gray-500 hover:text-gray-800 transition-colors" />
            </button>
          </div>
          <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
            {gerarMensagem()}
          </pre>

        </div>
      )}
    </div>
  );
}
