import { CopyIcon, XIcon } from "lucide-react";
import { PizzaOrcamento } from "./Orcamento";
import { OrcamentoUtils } from "../../orcamento.utils.entity";
import { useState } from "react";
import { BairroWithFeeAndDistance } from "../../types";
import { BairroSelector } from "./bairro-selector";


interface ResumoOrcamentoProps {
  pizzas: PizzaOrcamento[];
  bairros: BairroWithFeeAndDistance[]
  currentBairro: BairroWithFeeAndDistance | null
  setCurrentBairro: (bairro: BairroWithFeeAndDistance | null) => void;
  onRemovePizza: (id: string) => void; // Função para remover pizza do orçamento
}

export function ResumoOrcamento({ pizzas, bairros, currentBairro, setCurrentBairro, onRemovePizza }: ResumoOrcamentoProps) {
  const [messageCopied, setMessageCopied] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showBairroSelection, setShowBairroSelection] = useState(false)



  if (pizzas.length === 0) {
    return <p className="text-muted text-xs mb-4">Nenhuma pizza adicionada ao orçamento.</p>;
  }

  const total = OrcamentoUtils.calcularTotalOrcamento(pizzas, currentBairro)

  const copiarMensagem = () => {
    const mensagem = OrcamentoUtils.generateWappMessage(pizzas);
    const texto = mensagem.replace(/\n/g, "\n");
    navigator.clipboard.writeText(texto);
    setMessageCopied(true)
  };

  return (
    <>
      <ul className="flex flex-col gap-0 mb-4">
        {pizzas.map((pizza: PizzaOrcamento, idx: number) => {
          const pizzaSellingAmount = OrcamentoUtils.calcularPrecoPizza(pizza);

          return (
            <li key={idx} className="flex flex-row gap-2 p-1 items-start justify-between border-b ">
              <div className="text-sm flex items-start gap-2">
                <button onClick={() => onRemovePizza(pizza.id)}>
                  <XIcon
                    width={14}
                    height={14}
                    className="text-red-500 hover:font-semibold hover:text-red-400"
                  />
                </button>
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

      <section>
        <p
          className="text-xs text-muted text-right cursor-pointer hover:underline mb-2"
          onClick={() => {
            setShowBairroSelection(!showBairroSelection)
            setShowMessage(false)
          }}
        >
          {showBairroSelection ? "Ocultar lista bairros" : "Entrega bairro:"}
        </p>

        {showBairroSelection && (
          <BairroSelector bairros={bairros} onBairroSelection={setCurrentBairro} />
        )}

        {currentBairro && (
          <div className="text-sm flex items-start gap-2 mt-4 p-1">
            <button onClick={() => setCurrentBairro(null)}>
              <XIcon
                width={14}
                height={14}
                className="text-red-500 hover:font-semibold cursor-pointer hover:text-red-400"
              />
            </button>
            <div className="flex justify-between w-full items-start">
              <div className="flex flex-col">
                <p className="text-[11px] leading-none">Entrega bairro:</p>
                <p className="text-left font-semibold uppercase text-xs">
                  {currentBairro?.name}
                </p>
              </div>
              <p className="text-right text-xs text-muted">
                R$ {currentBairro?.deliveryFee.amount.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </section>


      <section className="flex flex-col mt-4 border-t pt-2 ">

        <div className="flex gap-2 justify-end items-center mb-1">
          <span className="text-right font-semibold text-[0.95rem]">Total: R$ {total.toFixed(2)}</span>
          <button onClick={copiarMensagem}>
            <CopyIcon className="w-4 h-4 text-gray-500 hover:text-gray-800 transition-colors" />
          </button>
        </div>
        {messageCopied && <div className="flex items-center justify-between w-full bg-green-100 p-2 mb-2">
          <div className=" text-green-800 rounded text-xs">Mensagem copiada!</div>
          <button
            onClick={() => setMessageCopied(false)}
          >
            <XIcon className="w-4 h-4 text-gray-500 hover:text-gray-800 transition-colors" />

          </button>
        </div>}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted text-right cursor-pointer hover:underline"
            onClick={() => {
              setShowMessage(!showMessage)
              setShowBairroSelection(false)
            }}
          >
            {showMessage ? "Ocultar" : "Mostrar"} mensagem
          </p>
          {showMessage && (
            <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
              {OrcamentoUtils.generateWappMessage(pizzas, currentBairro)}
            </pre>
          )}
        </div>

      </section>

    </>
  );
}

