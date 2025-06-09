
import { useState } from "react";
import { PizzaOptionsBySize, PizzaSize, ToppingWithPrice } from "../../types";
import { Button } from "../../../components/ui/button";
import { SizeSelector } from "./SizeSelector";
import { ToppingSelector } from "./ToppingSelector";
import { PizzaOrcamento } from "./OrcamentoSidebar";
import { PizzaResumo } from "./PizzaResumo";

interface PizzaBuilderProps {
  pizzas: PizzaOrcamento[];
  setPizzas: (pizzas: PizzaOrcamento[]) => void;
  buscarPrecoBase: (size: string) => number;
  sizes: PizzaSize[];
  options: PizzaOptionsBySize;
  onAddPizza: (pizza: {
    size: PizzaSize;
    sabores: ToppingWithPrice[];
  }) => void;
}

export function PizzaBuilder({
  setPizzas,
  sizes,
  options,
  onAddPizza
}: PizzaBuilderProps) {
  const [size, setSize] = useState<PizzaSize | null>(null);
  const [saboresSelecionados, setSaboresSelecionados] = useState<ToppingWithPrice[]>([]);

  const toggleSabor = (sabor: ToppingWithPrice) => {
    setSaboresSelecionados(prev =>
      prev.find(s => s.menuItemId === sabor.menuItemId)
        ? prev.filter(s => s.menuItemId !== sabor.menuItemId)
        : [...prev, sabor]
    );
  };

  const removerPizza = (id: string) => {
    setPizzas(prev => prev.filter(p => p.id !== id));
  };



  return (
    <>
      <div className="flex flex-col gap-4 bg-white">
        <SizeSelector
          sizes={sizes}
          size={size}
          setSize={setSize}
        />

        {size && (
          <ToppingSelector
            toppings={options[size.key] || []}
            selectedTopping={(id: string) => {
              const sabor = options[size.key].find(option => option.menuItemId === id);
              if (sabor) {
                toggleSabor(sabor);
              }

            }}

          />
        )}

        <div className="flex flex-col">

          <PizzaResumo
            size={size}
            toppings={saboresSelecionados}
          />
          {/* <Button
  variant="destructive"
  className="absolute top-2 right-2"
  onClick={() => removerPizza(pizza.id)}
>
  Remover
</Button> */}
        </div>


        <Button

          onClick={() => {
            if (size && saboresSelecionados.length > 0) {
              onAddPizza({ size, sabores: saboresSelecionados });
              setSize(null);
              setSaboresSelecionados([]);
            }
          }}
          className="mt-2 bg-slate-100"
        >
          OK
        </Button>
      </div>
    </>
  );
}
