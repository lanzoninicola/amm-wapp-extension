import { useEffect, useState } from "react";

type PizzaOption = {
  menuItemId: string;
  name: string;
  groupName: string;
  priceAmount: number;
};

type OrcamentoData = Record<string, PizzaOption[]>;

type SaborSelecionado = {
  id: string;
  quantidade: number;
};

export function useOrcamento() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<OrcamentoData>({});
  const [size, setSize] = useState<string>("");
  const [sabores, setSabores] = useState<SaborSelecionado[]>([]);
  const [bairro, setBairro] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");

  useEffect(() => {
    // fetch("http://localhost:3000/api/orcamento")
    //   .then((res) => res.json())
    //   .then((json) => setData(json));
    setData({
      "pizza-pequena": [
        {
          menuItemId: "1",
          name: "Margarita",
          groupName: "Tradicional",
          priceAmount: 25.0,
        },
        {
          menuItemId: "2",
          name: "Pepperoni",
          groupName: "Tradicional",
          priceAmount: 30.0,
        },
      ],
      "pizza-media": [
        {
          menuItemId: "1",
          name: "Margarita",
          groupName: "Tradicional",
          priceAmount: 35.0,
        },
        {
          menuItemId: "2",
          name: "Pepperoni",
          groupName: "Tradicional",
          priceAmount: 40.0,
        },
      ],
      "pizza-grande": [
        {
          menuItemId: "1",
          name: "Margarita",
          groupName: "Tradicional",
          priceAmount: 45.0,
        },
        {
          menuItemId: "2",
          name: "Pepperoni",
          groupName: "Tradicional",
          priceAmount: 50.0,
        },
      ],
    });
  }, []);

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
    const pizzas = data[size] || [];
    const total = sabores.reduce((acc, s) => {
      const pizza = pizzas.find((p) => p.menuItemId === s.id);
      return pizza ? acc + pizza.priceAmount * s.quantidade : acc;
    }, 0);
    const taxa = bairro.toLowerCase() === "centro" ? 0 : bairro ? 8 : 0;
    return total + taxa;
  };

  const gerarMensagem = () => {
    const pizzas = data[size] || [];
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
    open,
    setOpen,
    data,
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
