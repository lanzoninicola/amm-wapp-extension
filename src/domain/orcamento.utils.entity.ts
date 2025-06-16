import { PizzaOrcamento } from "./orcamento/components/Orcamento";
import { BairroWithFeeAndDistance } from "./types";

export class OrcamentoUtils {
  static calcularTotalOrcamento(
    pizzas: PizzaOrcamento[],
    bairro: BairroWithFeeAndDistance | null = null
  ): number {
    return pizzas.reduce((acc, pizza) => {
      const pizzaSellingAmount = pizza.sabores.reduce(
        (max, s) => Math.max(max, s.priceAmount),
        0
      );
      return acc + pizzaSellingAmount + (bairro?.deliveryFee.amount ?? 0);
    }, 0);
  }

  static calcularPrecoPizza(pizza: PizzaOrcamento): number {
    return pizza.sabores.reduce((max, s) => Math.max(max, s.priceAmount), 0);
  }

  static generateWappMessage(
    pizzas: PizzaOrcamento[],
    bairro: BairroWithFeeAndDistance | null = null
  ): string {
    if (pizzas.length === 0) return "Nenhuma pizza adicionada.";

    const partes = pizzas.map((pizza) => {
      const sabores = pizza.sabores.map((s) => s.name).join(", ");
      return `${pizza.quantidade}x ${pizza.size.name.toUpperCase()} com ${
        pizza.sabores.length
      } sabores (${sabores}): R$ ${OrcamentoUtils.calcularPrecoPizza(
        pizza
      ).toFixed(2)}`;
    });

    const total = OrcamentoUtils.calcularTotalOrcamento(pizzas, bairro);

    let resumoText = "Pedido:\n";

    resumoText += `${partes.map((p) => "- " + p).join("\n")}\n\n`;

    if (bairro) {
      resumoText += `Entrega bairro: ${
        bairro.name
      } - R$ ${bairro.deliveryFee.amount.toFixed(2)}\n`;
    }

    resumoText += `----------------------------------------\n`;
    resumoText += `Total estimado: *R$ ${total.toFixed(2)}*`;

    return resumoText;
  }
}
