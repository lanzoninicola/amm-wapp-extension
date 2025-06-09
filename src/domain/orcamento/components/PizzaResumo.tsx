import { PizzaSize, ToppingWithPrice } from "../../types";

interface PizzaResumoProps {
  size: PizzaSize | null;
  toppings: ToppingWithPrice[];
}

export function PizzaResumo({ size, toppings }: PizzaResumoProps) {

  if (!size) {
    return <p className="text-muted text-xs mb-4">Selecione um tamanho para a pizza.</p>;
  }

  if (toppings.length === 0) {
    return
  }


  return (
    <div className="border-b py-2 text-xs mb-4">
      <p className="font-semibold">Pizza {size.name}</p>
      <p>{1}x {size.name.toUpperCase()} com {toppings.length} sabores</p>
      <p>Sabores: {toppings.map((s: ToppingWithPrice) => s.name).join(", ")}</p>
      {/* <p className="text-right">Subtotal: R$ {toppings.toFixed(2)}</p> */}
    </div>
  );
}
