
import { useState } from "react";
import { PizzaOptionsBySize, PizzaSize, ToppingWithPrice } from "../../types";
import { Button } from "../../../components/ui/button";
import { SizeSelector } from "./SizeSelector";
import { ToppingSelector } from "./ToppingSelector";
import { PizzaResumo } from "./PizzaResumo";

interface PizzaBuilderProps {
  sizes: PizzaSize[];
  options: PizzaOptionsBySize;
  onAddPizza: (pizza: {
    size: PizzaSize;
    sabores: ToppingWithPrice[];
  }) => void;
  onRemovePizza: (id: string) => void;
}

export function PizzaBuilder({
  sizes,
  options,
  onAddPizza,
  onRemovePizza
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

        <div className="flex items-start">
          <Button
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={() => onRemovePizza(pizza.id)}
          >
            Remover
          </Button>
          <PizzaResumo
            size={size}
            toppings={saboresSelecionados}
          />

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
