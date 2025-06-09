import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useToast } from "../../../components/ui/use-toast";
import { useOrcamento } from "../hooks/useOrcamento";

export function OrcamentoSidebar() {
  const {
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
    calcularTotal
  } = useOrcamento();

  const { toast } = useToast();

  const isMensagemValida = sabores.some(s => s.quantidade > 0);
  const pizzasSelecionadas = (data[size] || []).filter(p => sabores.find(s => s.id === p.menuItemId));

  const subtotal = pizzasSelecionadas.reduce((acc, p) => {
    const s = sabores.find(s => s.id === p.menuItemId);
    return acc + p.priceAmount * (s?.quantidade || 0);
  }, 0);

  const taxaEntrega = bairro && bairro.toLowerCase() !== "centro" ? 8 : 0;

  console.log({ data })

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed top-4 left-4 z-50 bg-white/90"
        >
          Orçamento
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-md top-52 left-60" data-element="orcamentooooo-dialog-content" style={{ zIndex: 100 }}>
        <DialogHeader>
          <DialogTitle>Montar orçamento</DialogTitle>
        </DialogHeader>

        <Select onValueChange={setSize} value={size}>
          <SelectTrigger className={!size ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(data).map((key) => (
              <SelectItem key={key} value={key}>
                {key.replace("pizza-", "Pizza ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {size && (
          <div className="grid gap-2 mt-4">
            {data[size].map((p) => {
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
      </DialogContent>
    </Dialog>
  );
}
