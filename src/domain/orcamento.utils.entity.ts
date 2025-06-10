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

  static generateWappMessage(pizzas: PizzaOrcamento[]): string {
    if (pizzas.length === 0) return "Nenhuma pizza adicionada.";

    const partes = pizzas.map((pizza) => {
      const sabores = pizza.sabores.map((s) => s.name).join(", ");
      return `${pizza.quantidade}x ${pizza.size.name.toUpperCase()} com ${
        pizza.sabores.length
      } sabores (${sabores}): R$ ${OrcamentoUtils.calcularPrecoPizza(
        pizza
      ).toFixed(2)}`;
    });

    const total = OrcamentoUtils.calcularTotalOrcamento(pizzas);

    return `Pedido:\n${partes
      .map((p) => "- " + p)
      .join("\n")}\nTotal estimado: R$ ${total.toFixed(2)}`;
  }
}
