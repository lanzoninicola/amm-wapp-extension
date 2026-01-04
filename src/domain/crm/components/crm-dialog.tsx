import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Separator } from "../../../components/ui/separator";
import { Loader2, Settings, Upload, RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { useWhatsappContactInfo } from "../../../hooks/use-whatsapp-contact-info";

type CrmConfig = {
  baseUrl: string;
  endpoint: string;
};

const STORAGE_KEY = "crmConfig";
const defaultConfig: CrmConfig = { baseUrl: "", endpoint: "" };

type FlowState =
  | "idle"
  | "loading_contact"
  | "confirm"
  | "editing"
  | "ready_to_send"
  | "sending"
  | "success"
  | "error";

export function CrmDialog() {
  const contact = useWhatsappContactInfo();

  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<CrmConfig>(defaultConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [flow, setFlow] = useState<FlowState>("idle");
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { crmConfig?: CrmConfig };
        if (parsed.crmConfig) {
          setConfig({
            baseUrl: parsed.crmConfig.baseUrl ?? "",
            endpoint: parsed.crmConfig.endpoint ?? ""
          });
        }
      } catch (err) {
        console.error("Erro ao ler crmConfig do localStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setFlow("idle");
      setProgress(0);
      setFeedback(null);
      setShowSettings(false);
    }
  }, [open]);

  const isConfigComplete = useMemo(
    () => Boolean(config.baseUrl && config.endpoint),
    [config]
  );

  function saveConfig() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ crmConfig: config }));
    setFeedback("Configuração salva.");
    setTimeout(() => setFeedback(null), 2000);
  }

  function handleRetrieve() {
    setFlow("loading_contact");
    setProgress(25);
    setFeedback(null);

    setTimeout(() => {
      if (!contact?.number && !contact?.name) {
        setFlow("error");
        setFeedback("Não encontrei o contato. Abra o painel direito e tente novamente.");
        setProgress(0);
        return;
      }

      setForm({
        name: contact.name ?? "",
        phone: contact.number ?? ""
      });
      setFlow("confirm");
      setProgress(60);
    }, 100);
  }

  function handleConfirmData(correct: boolean) {
    if (correct) {
      setFlow("ready_to_send");
      setProgress(80);
    } else {
      setFlow("editing");
      setProgress(60);
    }
  }

  async function handleSend() {
    if (!isConfigComplete) {
      setFeedback("Configure Base URL e Endpoint antes de enviar.");
      setFlow("error");
      return;
    }

    setFlow("sending");
    setProgress(90);
    setFeedback(null);

    try {
      const response = await fetch(`${config.baseUrl}${config.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone })
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      setFlow("success");
      setProgress(100);
      setFeedback("Enviado com sucesso.");
    } catch (err: any) {
      console.error(err);
      setFlow("error");
      setFeedback("Erro ao enviar. Verifique o endpoint e tente novamente.");
      setProgress(50);
    }
  }

  const progressLabel = useMemo(() => {
    switch (flow) {
      case "loading_contact":
        return "Capturando contato";
      case "confirm":
      case "editing":
      case "ready_to_send":
        return "Dados prontos";
      case "sending":
        return "Enviando ao CRM";
      case "success":
        return "Concluído";
      case "error":
        return "Ação necessária";
      default:
        return "Aguardando";
    }
  }, [flow]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="flex items-center gap-1">
          <Upload size={16} />
          CRM
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-gray-900 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Enviar contato para CRM</DialogTitle>
          <DialogDescription className="text-gray-600">
            Capture os dados do contato, revise e envie em uma requisição POST.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded bg-gray-200">
            <div
              className="h-2 rounded bg-primary transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{progressLabel}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleRetrieve}
              disabled={flow === "loading_contact" || flow === "sending"}
            >
              {flow === "loading_contact" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCcw size={16} />
              )}
              <span className="ml-2">Recuperar dados</span>
            </Button>

            {flow === "confirm" || flow === "ready_to_send" || flow === "editing" || flow === "error" || flow === "success" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSettings((v) => !v)}
              >
                <Settings size={16} />
              <span className="ml-2">Configurações</span>
            </Button>
          ) : null}
        </div>

          {(flow === "success" || flow === "error") && (
            <div className="flex items-center gap-1 text-sm">
              {flow === "success" ? (
                <CheckCircle2 className="text-green-600" size={16} />
              ) : (
                <AlertCircle className="text-red-600" size={16} />
              )}
              <span className="text-gray-700">{feedback}</span>
            </div>
          )}
        </div>

        {showSettings && (
          <div className="rounded-md border p-3 space-y-2">
            <div className="flex gap-2 items-center">
              <div className="w-24 text-sm text-gray-600">Base URL</div>
              <Input
                value={config.baseUrl}
                onChange={(e) => setConfig((prev) => ({ ...prev, baseUrl: e.target.value }))}
                placeholder="https://dev.amodomio.com.br"
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-24 text-sm text-gray-600">Endpoint</div>
              <Input
                value={config.endpoint}
                onChange={(e) => setConfig((prev) => ({ ...prev, endpoint: e.target.value }))}
                placeholder="/api/crm/contato"
              />
            </div>
            <Button size="sm" onClick={saveConfig} className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              Salvar configurações
            </Button>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-600">Nome</div>
            <div className="rounded-md border px-3 py-2 text-sm bg-gray-100">
              {form.name || "—"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-600">Telefone</div>
            <div className="rounded-md border px-3 py-2 text-sm bg-gray-100">
              {form.phone || "—"}
            </div>
          </div>
        </div>

        {(flow === "confirm" || flow === "ready_to_send") && (
          <div className="flex gap-2">
            <Button variant="default" className="flex-1" onClick={() => handleConfirmData(true)}>
              Dados corretos
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => handleConfirmData(false)}>
              Corrigir
            </Button>
          </div>
        )}

        {flow === "editing" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm text-gray-600">Nome</div>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">Telefone</div>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            <div className="flex gap-2">
              <Button variant="default" className="flex-1" onClick={() => setFlow("ready_to_send")}>
                Confirmar dados
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => handleRetrieve()}>
                Recarregar
              </Button>
            </div>
          </div>
        )}

        {flow === "ready_to_send" && (
          <Button
            className="w-full flex items-center gap-2"
            onClick={handleSend}
            disabled={flow === "sending" || !isConfigComplete}
          >
            {flow === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Enviar
          </Button>
        )}

        {flow === "sending" && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="animate-spin" size={16} /> Enviando...
          </div>
        )}

        {flow === "error" && feedback && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} /> {feedback}
          </div>
        )}

        {flow === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 size={16} /> Enviado com sucesso.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
