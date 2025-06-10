import { CopyIcon, XIcon } from "lucide-react";
import { PizzaOrcamento } from "./Orcamento";
import { OrcamentoUtils } from "../../orcamento.utils.entity";
import { useState } from "react";


interface ResumoOrcamentoProps {
  pizzas: PizzaOrcamento[];
  onRemovePizza: (id: string) => void; // Função para remover pizza do orçamento
}

export function ResumoOrcamento({ pizzas, onRemovePizza }: ResumoOrcamentoProps) {
  const [messageCopied, setMessageCopied] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  if (pizzas.length === 0) {
    return <p className="text-muted text-xs mb-4">Nenhuma pizza adicionada ao orçamento.</p>;
  }

  const total = OrcamentoUtils.calcularTotalOrcamento(pizzas)

  const copiarMensagem = () => {
    const mensagem = OrcamentoUtils.generateWappMessage(pizzas);
    const texto = mensagem.replace(/\n/g, "\n");
    navigator.clipboard.writeText(texto);
    setMessageCopied(true)
  };

  return (
    <>
      <ul className="flex flex-col gap-0">
        {pizzas.map((pizza: PizzaOrcamento, idx: number) => {
          const pizzaSellingAmount = OrcamentoUtils.calcularPrecoPizza(pizza);

          return (
            <li key={idx} className="flex flex-row gap-2 p-1 items-start justify-between border-b ">
              <div className="text-sm flex items-start gap-2">
                <XIcon
                  width={14}
                  height={14}
                  className="hover:text-red-500 hover:font-semibold cursor-pointer"
                  onClick={() => onRemovePizza(pizza.id)}
                />
                <div className="flex flex-col">
                  <p className="font-semibold uppercase text-xs">
                    Pizza {pizza.size.name} ({pizza.sabores.length} sabores)
                  </p>
                  <p className="text-[12px]">{pizza.sabores.map((s) => s.name).join(", ")}</p>
                </div>
              </div>
              <p className="text-right text-xs text-muted">R$ {pizzaSellingAmount.toFixed(2)}</p>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col mt-4 ">
        <div className="flex gap-2 justify-end items-center mb-1">
          <span className="text-right font-semibold text-[0.95rem]">Total: R$ {total.toFixed(2)}</span>
          <button onClick={copiarMensagem}>
            <CopyIcon className="w-4 h-4 text-gray-500 hover:text-gray-800 transition-colors" />
          </button>
        </div>
        {messageCopied && <div className="flex items-center justify-between w-full bg-green-100 p-2 mb-2">
          <div className=" text-green-800 rounded text-xs">Mensagem copiada!</div>
          <XIcon className="w-4 h-4 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer" onClick={() => setMessageCopied(false)} />
        </div>}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted text-right cursor-pointer hover:underline"
            onClick={() => setShowMessage(!showMessage)}
          >
            {showMessage ? "Ocultar" : "Mostrar"} mensagem
          </p>
          {showMessage && (
            <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
              {OrcamentoUtils.generateWappMessage(pizzas)}
            </pre>
          )}
        </div>

      </div>

    </>
  );
}

