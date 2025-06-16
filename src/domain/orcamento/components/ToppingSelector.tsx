import { useEffect, useRef, useState } from "react";
import { AlertCircleIcon, Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Input } from "../../../components/ui/input";
import { PizzaSize, ToppingWithPrice } from "../../types";

interface ToppingSelectorProps {
  toppings: ToppingWithPrice[];
  toppingsSelected: ToppingWithPrice[];
  sizeSelected: PizzaSize;
  onToppingSelection: (id: string) => void;
}

export function ToppingSelector({
  toppings,
  toppingsSelected,
  sizeSelected,
  onToppingSelection,
}: ToppingSelectorProps) {
  const [toppingFound, setToppingFound] = useState<ToppingWithPrice[]>(toppings);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [search, setSearch] = useState<string>("");

  const itemsRef = useRef<Record<string, HTMLButtonElement | null>>({});

  // 🔍 Filtragem dinâmica
  useEffect(() => {
    if (search.trim() === "") {
      setToppingFound(toppings);
      setHighlightedIndex(-1);
      return;
    }

    const found = toppings.filter((t) =>
      t.name.toLowerCase().includes(search.trim().toLowerCase())
    );

    setToppingFound(found);
    setHighlightedIndex(found.length > 0 ? 0 : -1);
  }, [search, toppings]);

  // 🎯 Scroll automático para o item destacado
  useEffect(() => {
    const topping = toppingFound[highlightedIndex];
    if (topping) {
      const el = itemsRef.current[topping.menuItemId];
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedIndex, toppingFound]);

  // ⌨️ Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, toppingFound.length - 1)
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const topping = toppingFound[highlightedIndex];
      if (topping) onToppingSelection(topping.menuItemId);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setSearch("");
    }
  };

  return (
    <div className="mb-2">
      {/* ⚠️ Aviso de limite */}
      {toppingsSelected.length === sizeSelected.maxToppingsAmount && (
        <div className="flex items-center gap-1 mb-2">
          <AlertCircleIcon size={16} className="text-red-500" />
          <p className="text-red-500 text-xs font-semibold">
            Você atingiu o limite de sabores para este tamanho.
          </p>
        </div>
      )}

      {/* 🔢 Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-[11px] uppercase tracking-wider">
          Sabores:
        </p>
        <span className="text-[11px] font-semibold">
          Selecionados {toppingsSelected.length} de{" "}
          {sizeSelected.maxToppingsAmount}
        </span>
      </div>

      {/* 🔍 Campo de busca */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar sabor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-7 mb-2"
        />
      </div>

      {/* 📜 Lista */}
      <div className="h-[150px] overflow-y-auto">
        <div className="flex flex-col">
          {toppingFound.map((s, index) => (
            <div key={s.menuItemId}>
              <button
                ref={(el) => (itemsRef.current[s.menuItemId] = el)}
                onClick={() => onToppingSelection(s.menuItemId)}
                className={cn(
                  "flex justify-between items-center py-1 px-2 rounded-md shadow-sm transition-colors border-b w-full",
                  highlightedIndex === index
                    ? "bg-blue-300 text-black"
                    : "bg-white text-black hover:bg-blue-100"
                )}
              >
                <div className="flex flex-col gap-0 items-start">
                  <p className="text-sm font-mono uppercase">{s.name}</p>
                  <p className="text-[12px] text-muted-foreground leading-none text-left">{s.ingredients}</p>
                </div>
                <span className="text-sm font-mono">
                  {s.priceAmount.toFixed(2).replace(".", ",")}
                </span>
              </button>
            </div>
          ))}
          {toppingFound.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-2">
              Nenhum sabor encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
