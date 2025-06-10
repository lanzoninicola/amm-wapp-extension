import { useState } from "react";
import { OrcamentoUtils } from "../../orcamento.utils.entity";
import { PizzaOrcamento } from "./Orcamento";
import { CopyIcon } from "lucide-react";


interface OrcamentoTemplateMessageProps {
  pizzas: PizzaOrcamento[]
}


export default function OrcamentoTemplateMessage({ pizzas }: OrcamentoTemplateMessageProps) {

  const [messageCopied, setMessageCopied] = useState(false)

  const gerarMensagem = (): string => {
    if (pizzas.length === 0) return "Nenhuma pizza adicionada.";

    const partes = pizzas.map((pizza) => {
      const sabores = pizza.sabores.map(s => s.name).join(", ");
      return `${pizza.quantidade}x ${pizza.size.name.toUpperCase()} com ${pizza.sabores.length} sabores (${sabores})`;
    });

    const total = OrcamentoUtils.calcularTotalOrcamento(pizzas);

    return `Pedido:\n${partes.map(p => "- " + p).join("\n")}\nTotal estimado: R$ ${total.toFixed(2)}`;
  };

  const copiarMensagem = () => {
    const texto = gerarMensagem().replace(/\n/g, "\n");
    navigator.clipboard.writeText(texto);
    setMessageCopied(true)
  };

  return (
    <div className="mt-6">
      {messageCopied && <div className="bg-green-100 text-green-800 p-2 mb-2 rounded text-xs">Mensagem copiada!</div>}
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
  )

}