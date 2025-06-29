import { cn } from "../../../lib/utils";
import { PizzaSize } from "../../types";


export function SizeSelector({
  sizes,
  currentSize,
  setCurrentSize
}: {
  sizes: PizzaSize[];
  currentSize: PizzaSize | null;
  setCurrentSize: (currentSize: PizzaSize) => void;
}) {

  // console.log("SizeSelector size:", sizes);

  return (
    <div className="mb-2" data-element="size-selector">
      {/* <p className="font-semibold mb-2 text-[11px] uppercase tracking-wider">Tamanho:</p> */}
      <div className="flex gap-2 w-full items-center">
        {sizes.map((s, idx: number) => {

          const parts = s?.name.split(" ");

          return (
            <button
              key={idx}
              onClick={() => setCurrentSize(s)}
              className={cn(
                "w-full text-center cursor-pointer rounded border-2 py-2 transition flex flex-col gap-0 items-center",
                "hover:bg-yellow-300",
                currentSize?.key === s.key ? "bg-blue-500 text-white" : "bg-white"
              )}
            >
              <span className="text-xs font-semibold text-center leading-3 brea" >
                {parts[0]}<br />{parts[1]}
              </span>
            </button>
          )
        })}
      </div>

    </div>
  );
}
