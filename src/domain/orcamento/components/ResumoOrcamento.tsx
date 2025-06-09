import { XIcon } from "lucide-react";
import { ToppingWithPrice } from "../../types";
import { PizzaOrcamento } from "./OrcamentoSidebar";


interface ResumoOrcamentoProps {
  pizzas: PizzaOrcamento[];
  onRemovePizza: (id: string) => void; // Função para remover pizza do orçamento
}

export function ResumoOrcamento({ pizzas, onRemovePizza }: ResumoOrcamentoProps) {
  const total = pizzas.reduce(
    (acc: number, p: PizzaOrcamento) => acc + p.sabores.reduce((sAcc: number, s: ToppingWithPrice) => sAcc + s.priceAmount, 0),
    0
  );

  if (pizzas.length === 0) {
    return <p className="text-muted text-xs mb-4">Nenhuma pizza adicionada ao orçamento.</p>;
  }

  return (
    <>
      <ul className="flex flex-col gap-0">
        {pizzas.map((pizza: PizzaOrcamento, idx: number) => {

          const total = pizza.sabores.reduce((acc: number, s: ToppingWithPrice) => acc + s.priceAmount, 0);

          return (
            <li key={idx} className="flex flex-row gap-2 p-1 items-start justify-between border-b ">
              <div className="text-sm flex items-start gap-2">
                <XIcon width={14} height={14} className="hover:text-red-500 hover:font-semibold cursor-pointer"

                  onClick={() => {
                    // Implementar lógica para remover a pizza do orçamento
                    onRemovePizza(pizza.id);
                  }}

                />
                <div className="flex flex-col">
                  <p className="font-semibold uppercase text-xs">Pizza {pizza.size.name} ({pizza.sabores.length} sabores)</p>
                  <p className="text-[12px]">{pizza.sabores.map((s: ToppingWithPrice) => s.name).join(", ")}</p>
                </div>
              </div>
              <p className="text-right text-xs text-muted">R$ {total.toFixed(2)}</p>
            </li>
          )
        })}
      </ul>
      <p className="text-right font-semibold mt-4 text-[0.95rem]">Total: R$ {total.toFixed(2)}</p>
    </>
  );
}
