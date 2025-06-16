
import { useState } from "react";
import { PizzaOptionsBySize, PizzaSize, ToppingWithPrice } from "../../types";
import { Button } from "../../../components/ui/button";
import { SizeSelector } from "./SizeSelector";
import { ToppingSelector } from "./ToppingSelector";
import { PizzaResumo } from "./PizzaResumo";
import { PizzaOrcamento } from "./Orcamento";

interface PizzaBuilderProps {
  sizes: PizzaSize[];
  currentSize: PizzaSize | null
  setCurrentSize: (size: PizzaSize | null) => void
  options: PizzaOptionsBySize;
  onAddPizza: (pizza: PizzaOrcamento) => void;
  onRemovePizza: (id: string) => void;
}

export function PizzaBuilder({
  sizes,
  currentSize,
  setCurrentSize,
  options,
  onAddPizza,
  onRemovePizza
}: PizzaBuilderProps) {
  const [currentPizza, setCurrentPizza] = useState<PizzaOrcamento | null>(null)
  const [currentToppingsOptions, setCurrentToppingsOptions] = useState<ToppingWithPrice[] | null>(null)
  const [saboresSelecionados, setSaboresSelecionados] = useState<ToppingWithPrice[]>([]);


  const onSizeSelection = (currentSize: PizzaSize) => {
    setCurrentSize(currentSize)
    setCurrentToppingsOptions(options[currentSize.key])
  }

  const toggleSabor = (sabor: ToppingWithPrice) => {
    const ss = [...saboresSelecionados]
    const nextSaboresSelecionados = ss.find(s => s.menuItemId === sabor.menuItemId)
      ? ss.filter(s => s.menuItemId !== sabor.menuItemId)
      : [...ss, sabor]

    if (nextSaboresSelecionados.length > (currentSize?.maxToppingsAmount ?? 0)) {
      return
    }

    setSaboresSelecionados(nextSaboresSelecionados);
  };

  console.log({ currentToppingsOptions })



  return (
    <>
      <div className="flex flex-col gap-4 bg-white">
        <SizeSelector
          sizes={sizes}
          currentSize={currentSize}
          setCurrentSize={onSizeSelection}
        />

        {currentSize && (
          <ToppingSelector
            toppings={currentToppingsOptions || []}

            sizeSelected={currentSize}
            toppingsSelected={saboresSelecionados}
            onToppingSelection={(id: string) => {
              // se nenhum sabor foi selecionado crio já um objeto pizza com ID
              if (saboresSelecionados.length === 0) {
                setCurrentPizza({
                  id: crypto.randomUUID(),
                  size: currentSize,
                  sabores: [],
                  quantidade: 1
                })
              }
              const sabor = options[currentSize.key].find(option => option.menuItemId === id);

              if (sabor) {
                toggleSabor(sabor);
              }
            }}

          />
        )}

        <PizzaResumo
          currentSize={currentSize}
          toppings={saboresSelecionados}
        />

        <div className="flex gap-2 items-start w-full">
          <Button
            variant="outline"
            onClick={() => {
              if (currentPizza) {
                onRemovePizza(currentPizza.id);
                setCurrentSize(null);
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
              if (currentSize && saboresSelecionados.length > 0) {
                onAddPizza({
                  ...currentPizza,
                  size: currentSize,
                  sabores: saboresSelecionados
                } as PizzaOrcamento);
                setCurrentSize(null);
                setSaboresSelecionados([]);
                setCurrentPizza(null);
              }
            }}
            className="w-full bg-slate-100 uppercase"
            disabled={!currentSize || saboresSelecionados.length === 0}
          >
            Adicionar pizza
          </Button>
        </div>



      </div>
    </>
  );
}
