import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { useToast } from "../../../components/ui/use-toast";
import { cn } from "../../../lib/utils";
import { MenuItemPriceSummary, PizzaSize, SaborSelecionado } from "../../types";
import { useOrcamento } from "../hooks/useOrcamento";
import useOrcamentoApi from "../hooks/useOrcamentoApi";


export function OrcamentoSidebar() {
  const { data, error, loading } = useOrcamentoApi({ mockResponse: true });


  const {
    size,
    setSize,
    sabores,
    updateQuantidade,
    bairro,
    setBairro,
    mensagem,
    gerarMensagem,
    calcularTotal
  } = useOrcamento(data?.payload?.options || null);

  const { toast } = useToast();

  const pizzaOptions = data?.payload?.options || null;
  const sizes = data?.payload?.sizes || [];
  const bairros = data?.payload?.bairros || [];

  if (loading) return <p>Carregando...</p>;
  if (error && error !== null) return <p className="text-red-500">Erro ao carregar os dados: {error}</p>;
  if (!data || Object.keys(data).length === 0) return <p>Nenhum dado disponível.</p>;


  const isMensagemValida = sabores.some(s => s.quantidade > 0);
  const pizzasSelecionadas = (pizzaOptions && pizzaOptions[size] || []).filter(p => sabores.find(s => s.id === p.menuItemId));

  const subtotal = pizzasSelecionadas.reduce((acc, p) => {
    const s = sabores.find(s => s.id === p.menuItemId);
    return acc + p.priceAmount * (s?.quantidade || 0);
  }, 0);

  const taxaEntrega = bairro && bairro.toLowerCase() !== "centro" ? 8 : 0;


  return (
    <div className="fixed top-4 left-4 w-[400px] h-full bg-gray-100 p-4 shadow-lg z-50">
      <Button
        variant="outline"
        className="bg-white/90 mb-6"
      >
        Orçamento
      </Button>
      <div className=" max-w-md top-52 left-60">


        <SizeSelector
          sizes={sizes}
          size={size}
          setSize={setSize}
        />

        {size && (
          <ToppingSelector
            pizzaOptions={pizzaOptions}
            size={size}
            sabores={sabores}
            updateQuantidade={updateQuantidade}
          />
        )}

        {pizzasSelecionadas.length > 0 && (
          <div className="mt-4 text-sm">
            <h4 className="font-semibold mb-1">Resumo do pedido:</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              {pizzasSelecionadas.map((p) => {
                const s = sabores.find((s) => s.id === p.menuItemId);
                return (
                  <li key={p.menuItemId}>
                    {s?.quantidade}x {p.name} — R$ {(p.priceAmount * (s?.quantidade || 0)).toFixed(2).replace(".", ",")}
                  </li>
                );
              })}
            </ul>
            <div className="mt-2">
              <p className="text-muted-foreground">Subtotal: R$ {subtotal.toFixed(2).replace(".", ",")}</p>
              <p className="text-muted-foreground">Entrega: R$ {taxaEntrega.toFixed(2).replace(".", ",")}</p>
            </div>
          </div>
        )}

        <Input
          placeholder="Informe o bairro (opcional)"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          className="mt-4"
        />

        <div className="mt-2 text-right text-sm text-muted-foreground">
          Total estimado: R$ {calcularTotal().toFixed(2).replace(".", ",")}
        </div>

        <Button
          onClick={() => {
            gerarMensagem();
            toast({ title: "Mensagem copiada!", description: mensagem });
          }}
          className="mt-4 w-full"
          disabled={!isMensagemValida || !size}
        >
          Gerar e copiar mensagem
        </Button>

        {mensagem && (
          <p className="text-sm text-muted-foreground mt-2">{mensagem}</p>
        )}
        <div />
      </div>
    </div>
  );
}


function SizeSelector({ sizes, size, setSize }: { sizes: PizzaSize[], size: PizzaSize["name"], setSize: (size: string) => void }) {

  if (!sizes || sizes.length === 0) {
    return <p className="text-red-500">Nenhum tamanho de pizza disponível.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2">

      {sizes.sort(
        (a, b) => a.sortOrderIndex - b.sortOrderIndex
      ).map((s) => (
        <div
          key={s.id}
          className="grid place-items-center shadow-lg rounded-xl py-2 bg-white hover:bg-slate-50 cursor-pointer"
          onClick={() => setSize(s.id)}
        >

          <span className={
            cn(
              "font-neue tracking-wider font-semibold row-span-1",
              s.key === "pizza-small" && "text-[14px]",
              s.key === "pizza-medium" && "text-xl",
              s.key === "pizza-bigger" && "text-3xl"

            )
          }>
            {s.nameAbbreviated || s.name}
          </span>
        </div>
      ))}




    </div>
  )

}

interface ToppingSelectorProps {
  pizzaOptions: Record<string, MenuItemPriceSummary[]>;
  size: string;
  sabores: SaborSelecionado[];
  updateQuantidade: (id: string, quantidade: number) => void;
}

function ToppingSelector({
  pizzaOptions,
  size,
  sabores,
  updateQuantidade
}: ToppingSelectorProps) {

  const options = pizzaOptions[size] || [];

  if (options.length === 0) {
    return <p className="text-red-500">Nenhum sabor disponível para este tamanho.</p>;
  }

  return (
    <div className="h-[200px] overflow-y-auto bg-white p-4 mt-4 rounded-xl shadow-md">
      <div className="grid gap-2 mt-4">
        {pizzaOptions && pizzaOptions[size].map((p) => {
          const selected = sabores.find((s) => s.id === p.menuItemId);
          return (
            <div
              key={p.menuItemId}
              className="flex items-center justify-between gap-2 border-b pb-1"
            >
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={!!selected}
                  onCheckedChange={(checked) =>
                    updateQuantidade(p.menuItemId, checked ? 1 : 0)
                  }
                />
                {p.name}
              </label>
              {selected && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    R$ {(p.priceAmount * selected.quantidade).toFixed(2).replace(".", ",")}
                  </span>
                  <Input
                    type="number"
                    min={1}
                    className="w-16"
                    value={selected.quantidade}
                    onChange={(e) =>
                      updateQuantidade(p.menuItemId, parseInt(e.target.value) || 1)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}