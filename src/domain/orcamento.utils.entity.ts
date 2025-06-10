import { PizzaOrcamento } from "./orcamento/components/Orcamento";

export class OrcamentoUtils {
  static calcularTotalOrcamento(pizzas: PizzaOrcamento[]): number {
    return pizzas.reduce((acc, pizza) => {
      const pizzaSellingAmount = pizza.sabores.reduce(
        (max, s) => Math.max(max, s.priceAmount),
        0
      );
      return acc + pizzaSellingAmount;
    }, 0);
  }

  static calcularPrecoPizza(pizza: PizzaOrcamento): number {
    return pizza.sabores.reduce((max, s) => Math.max(max, s.priceAmount), 0);
  }
}
