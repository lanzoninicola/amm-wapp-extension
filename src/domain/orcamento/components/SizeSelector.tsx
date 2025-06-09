import { cn } from "../../../lib/utils";
import { PizzaSize } from "../../types";


export function SizeSelector({
  sizes,
  size,
  setSize
}: {
  sizes: PizzaSize[];
  size: PizzaSize | null;
  setSize: (size: PizzaSize) => void;
}) {

  console.log("SizeSelector size:", size);

  return (
    <div className="mb-2" data-element="size-selector">
      <p className="font-semibold mb-2 text-[11px] uppercase tracking-wider">Tamanho:</p>
      <div className="flex gap-2 w-full items-center">
        {sizes.map((s, idx: number) => {
          return (
            <button
              key={idx}
              onClick={() => setSize(s)}
              className={cn(
                "w-full text-center cursor-pointer rounded border py-2 transition",
                size?.key === s.key ? "bg-blue-500" : "bg-white"
              )}
            >
              <p
                className={cn(
                  s.key === "pizza-small" && "text-xs",
                  s.key === "pizza-medium" && "text-sm",
                  s.key === "pizza-large" && "text-base"
                )}
              >
                {s.nameAbbreviated}
              </p>
            </button>
          )
        })}
      </div>

    </div>
  );
}
