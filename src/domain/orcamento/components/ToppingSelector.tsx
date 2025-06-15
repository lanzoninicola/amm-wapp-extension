
import { PizzaSize, ToppingWithPrice } from "../../types";
import { Input } from "../../../components/ui/input";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";

interface ToppingSelectorProps {
  toppings: ToppingWithPrice[];
  toppingsSelected: ToppingWithPrice[];
  sizeSelected: PizzaSize
  onToppingSelection: (id: string) => void;
}

export function ToppingSelector({
  toppings,
  toppingsSelected,
  sizeSelected,
  onToppingSelection,
}: ToppingSelectorProps) {
  const [toppingFound, setToppingFound] = useState<ToppingWithPrice[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, toppingFound.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const topping = toppingFound[highlightedIndex];
      onToppingSelection(topping.menuItemId);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && itemsRef.current[highlightedIndex]) {
      itemsRef.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-[11px] uppercase tracking-wider">Sabores:</p>
        <span className="text-[11px] font-semibold">Selecionados {toppingsSelected.length} de {sizeSelected.maxToppingsAmount}</span>
      </div>
      <Input
        placeholder="Buscar sabor..."
        className="mb-2"
        onChange={(e) => {
          const searchTerm = e.target.value.toLowerCase();

          if (searchTerm === "") {
            setToppingFound(toppings);
            setHighlightedIndex(-1);
            return;
          }

          const found = toppings.filter((t) =>
            t.name.toLowerCase().includes(searchTerm)
          );

          setToppingFound(found);
          setHighlightedIndex(0);
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="h-[150px] overflow-y-auto">
        <div className="flex flex-col">
          {toppings.map((s, index) => (
            <div key={s.menuItemId}>
              <button
                ref={(el) => (itemsRef.current[index] = el)}
                onClick={() => onToppingSelection(s.menuItemId)}

                className={
                  cn(
                    "flex justify-between items-center py-1 px-2 rounded-md shadow-sm transition-colors border-b w-full",
                    highlightedIndex === index
                      ? "bg-blue-300 text-black"
                      : "bg-white text-black hover:bg-blue-100"
                  )
                }
              >
                <span className="text-sm font-mono uppercase">{s.name}</span>
                <span className="text-sm font-mono">
                  {s.priceAmount.toFixed(2).replace(".", ",")}
                </span>
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

