import { useState } from "react";
import { PizzaOptionsBySize, SaborSelecionado } from "../../types";

export function useOrcamento(pizzaOptions: PizzaOptionsBySize | null) {
  const [size, setSize] = useState<string>("");
  const [sabores, setSabores] = useState<SaborSelecionado[]>([]);
  const [bairro, setBairro] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");

  const updateQuantidade = (id: string, quantidade: number) => {
    setSabores((prev) => {
      const existente = prev.find((s) => s.id === id);
      if (existente) {
        return prev.map((s) => (s.id === id ? { ...s, quantidade } : s));
      } else {
        return [...prev, { id, quantidade }];
      }
    });
  };

  const calcularTotal = () => {
    const pizzas = (pizzaOptions && pizzaOptions[size]) || [];
    const total = sabores.reduce((acc, s) => {
      const pizza = pizzas.find((p) => p.menuItemId === s.id);
      return pizza ? acc + pizza.priceAmount * s.quantidade : acc;
    }, 0);
    const taxa = bairro.toLowerCase() === "centro" ? 0 : bairro ? 8 : 0;
    return total + taxa;
  };

  const gerarMensagem = () => {
    const pizzas = (pizzaOptions && pizzaOptions[size]) || [];
    const detalhes = sabores
      .map((s) => {
        const pizza = pizzas.find((p) => p.menuItemId === s.id);
        return pizza ? `${s.quantidade}x ${pizza.name}` : null;
      })
      .filter(Boolean)
      .join(" + ");
    const total = calcularTotal();
    const msg = `Pizza ${size.replace(
      "pizza-",
      ""
    )} de ${detalhes} sai R$ ${total.toFixed(2).replace(".", ",")} ${
      bairro ? `(com entrega para ${bairro})` : ""
    }`;
    setMensagem(msg);
    navigator.clipboard.writeText(msg);
  };

  return {
    pizzaOptions,
    size,
    setSize,
    sabores,
    updateQuantidade,
    bairro,
    setBairro,
    mensagem,
    gerarMensagem,
    calcularTotal,
  };
}
