
import { useState } from "react";
import { PizzaOptionsBySize, PizzaSize, ToppingWithPrice } from "../../types";
import { Button } from "../../../components/ui/button";
import { SizeSelector } from "./SizeSelector";
import { ToppingSelector } from "./ToppingSelector";
import { PizzaResumo } from "./PizzaResumo";
import { PizzaOrcamento } from "./Orcamento";

interface PizzaBuilderProps {
  sizes: PizzaSize[];
  options: PizzaOptionsBySize;
  onAddPizza: (pizza: PizzaOrcamento) => void;
  onRemovePizza: (id: string) => void;
}

export function PizzaBuilder({
  sizes,
  options,
  onAddPizza,
  onRemovePizza
}: PizzaBuilderProps) {
  const [currentPizza, setCurrentPizza] = useState<PizzaOrcamento | null>(null)
  const [size, setSize] = useState<PizzaSize | null>(null);
  const [saboresSelecionados, setSaboresSelecionados] = useState<ToppingWithPrice[]>([]);

  const toggleSabor = (sabor: ToppingWithPrice) => {

    const ss = [...saboresSelecionados]
    const nextSaboresSelecionados = ss.find(s => s.menuItemId === sabor.menuItemId)
      ? ss.filter(s => s.menuItemId !== sabor.menuItemId)
      : [...ss, sabor]

    if (nextSaboresSelecionados.length > (size?.maxToppingsAmount ?? 0)) {
      return
    }

    setSaboresSelecionados(nextSaboresSelecionados);
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
            sizeSelected={size}
            toppingsSelected={saboresSelecionados}
            onToppingSelection={(id: string) => {

              // se nenhum sabor foi selecionado crio já um objeto pizza com ID
              if (saboresSelecionados.length === 0) {
                setCurrentPizza({
                  id: crypto.randomUUID(),
                  size,
                  sabores: [],
                  quantidade: 1
                })
              }


              const sabor = options[size.key].find(option => option.menuItemId === id);

              if (sabor) {
                toggleSabor(sabor);
              }
            }}

          />
        )}

        <PizzaResumo
          size={size}
          toppings={saboresSelecionados}
        />

        <div className="flex gap-2 items-start w-full">
          <Button
            variant="outline"
            onClick={() => {
              if (currentPizza) {
                onRemovePizza(currentPizza.id);
                setSize(null);
                setSaboresSelecionados([]);
                setCurrentPizza(null);
              }
            }}
            className="w-full bg-red-50 border-red-100"
            disabled={!currentPizza}
          >
            ANULAR
          </Button>

          <Button
            onClick={() => {
              if (size && saboresSelecionados.length > 0) {
                onAddPizza({
                  ...currentPizza,
                  size,
                  sabores: saboresSelecionados
                } as PizzaOrcamento);
                setSize(null);
                setSaboresSelecionados([]);
                setCurrentPizza(null);
              }
            }}
            className="w-full bg-slate-100 uppercase"
            disabled={!size || saboresSelecionados.length === 0}
          >
            Adicionar pizza
          </Button>
        </div>



      </div>
    </>
  );
}
