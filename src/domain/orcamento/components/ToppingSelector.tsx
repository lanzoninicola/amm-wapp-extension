
import { Separator } from "@radix-ui/react-select";
import { ToppingWithPrice } from "../../types";

interface ToppingSelectorProps {
  toppings: ToppingWithPrice[];
  selectedTopping: (id: string) => void;
}
export function ToppingSelector({
  toppings,
  selectedTopping,
}: ToppingSelectorProps) {

  console.log("ToppingSelector toppings:", toppings);

  return (


    <div className="mb-2">
      <p className="font-semibold mb-2 text-[11px] uppercase tracking-wider">Sabores:</p>
      <div className="h-250px overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          {toppings.map((s) => (
            <>
              <button
                key={s.menuItemId}
                onClick={() => selectedTopping(s.menuItemId)}
                className="flex justify-between items-center bg-white text-black
            hover:bg-gray-500 cursor-pointer rounded-md shadow-sm transition-colors"
              >
                <span className="text-sm">{s.name}</span>
                <span className="text-sm font-mono">{s.priceAmount.toFixed(2).replace(".", ",")}</span>
              </button>
              <Separator />
            </>
          ))}

        </div>
      </div>
    </div>
  );
}
