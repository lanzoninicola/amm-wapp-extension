
import { BairroWithFeeAndDistance } from "../../types";
import { Input } from "../../../components/ui/input";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";

interface BairroSelectorProps {
  bairros: BairroWithFeeAndDistance[]
  onBairroSelection: (bairro: BairroWithFeeAndDistance) => void;
}

export function BairroSelector({
  bairros,
  onBairroSelection,
}: BairroSelectorProps) {
  const [bairroFound, setBairroFound] = useState<BairroWithFeeAndDistance[]>(bairros);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, bairroFound.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const bairro = bairroFound[highlightedIndex];
      onBairroSelection(bairro);
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
      <p className="font-semibold mb-2 text-[11px] uppercase tracking-wider">Bairros:</p>
      <Input
        placeholder="Buscar bairro..."
        className="mb-2"
        onChange={(e) => {
          const searchTerm = e.target.value.toLowerCase();

          if (searchTerm === "") {
            setBairroFound(bairros);
            setHighlightedIndex(-1);
            return;
          }

          const found = bairros.filter((t) =>
            t.name.toLowerCase().includes(searchTerm)
          );

          setBairroFound(found);
          setHighlightedIndex(0);
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="h-[150px] overflow-y-auto">
        <div className="flex flex-col">
          {bairroFound.map((b, index) => (
            <div key={b.id}>
              <button
                ref={(el) => (itemsRef.current[index] = el)}
                onClick={() => onBairroSelection(b)}

                className={
                  cn(
                    "flex justify-between items-center py-1 px-2 rounded-md shadow-sm transition-colors border-b w-full",
                    highlightedIndex === index
                      ? "bg-blue-300 text-black"
                      : "bg-white text-black hover:bg-blue-100"
                  )
                }
              >
                <span className="text-sm font-mono uppercase">{b.name}</span>
                <span className="text-sm font-mono">
                  {b.deliveryFee.amount.toFixed(2).replace(".", ",")}
                </span>
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

