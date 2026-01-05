import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Separator } from "../../../components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Loader2, Settings, Upload, RefreshCcw, CheckCircle2, AlertCircle, Contact } from "lucide-react";
import { useWhatsappContactInfo } from "../../../hooks/use-whatsapp-contact-info";
import ButtonMenu from "../../../components/button-menu";
import { sendMessageToBackground } from "../../../utils/send-message-to-background";

type CrmConfig = {
  baseUrl: string;
  endpoint: string;
  apiKey: string;
  checkEndpoint: string;
};

const STORAGE_KEY = "crmConfig";
const defaultConfig: CrmConfig = {
  baseUrl: "",
  endpoint: "",
  apiKey: "",
  checkEndpoint: "/api/crm/customers"
};

type FlowState =
  | "idle"
  | "loading_contact"
  | "checking_existing"
  | "exists"
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
  const [form, setForm] = useState({ name: "", phone: "", gender: "unknown", ageProfile: "unknown" });
  const [flow, setFlow] = useState<FlowState>("idle");
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [showRawError, setShowRawError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { crmConfig?: CrmConfig };
        if (parsed.crmConfig) {
          setConfig({
            baseUrl: parsed.crmConfig.baseUrl ?? "",
            endpoint: parsed.crmConfig.endpoint ?? "",
            apiKey: parsed.crmConfig.apiKey ?? "",
            checkEndpoint: parsed.crmConfig.checkEndpoint ?? defaultConfig.checkEndpoint
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
      setRawError(null);
      setShowRawError(false);
    } else if (flow === "idle") {
      // ao abrir, já tenta capturar contato
      handleRetrieve();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isSendConfigured = useMemo(
    () => Boolean(config.baseUrl && config.endpoint),
    [config]
  );

  const isLookupConfigured = useMemo(
    () => Boolean(config.baseUrl && config.checkEndpoint),
    [config]
  );

  function saveConfig() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ crmConfig: config }));
    setFeedback("Configuração salva.");
    setTimeout(() => setFeedback(null), 2000);
  }

  const phoneDigits = useMemo(() => form.phone.replace(/\D/g, ""), [form.phone]);
  const phoneLastDigits = useMemo(() => phoneDigits.slice(-8) || phoneDigits, [phoneDigits]);

  async function checkExistingContact(phoneInput: string) {
    const digits = phoneInput.replace(/\D/g, "");
    const lastDigits = digits.slice(-8) || digits;

    if (!isLookupConfigured || !lastDigits) {
      return false;
    }

    setFlow("checking_existing");
    setProgress(75);
    setFeedback("Consultando CRM pelo telefone...");
    setRawError(null);
    setShowRawError(false);

    let rawErrorText = "";

    try {
      let exists = false;
      let payload: any = null;

      if (typeof chrome !== "undefined" && chrome.runtime?.id) {
        const response = await sendMessageToBackground<{
          exists?: boolean;
          payload?: any;
          status?: number;
        }>("CRM_CHECK_CONTACT", {
          baseUrl: config.baseUrl,
          checkEndpoint: config.checkEndpoint,
          phone: lastDigits,
          apiKey: config.apiKey
        });
        exists = Boolean(response?.exists);
        payload = response?.payload ?? null;
      } else {
        const url = new URL(config.checkEndpoint, config.baseUrl);
        url.searchParams.set("phone", lastDigits);

        const response = await fetch(url.toString(), {
          headers: {
            Accept: "application/json",
            ...(config.apiKey ? { "x-api-key": config.apiKey } : {})
          }
        });

        rawErrorText = response.ok ? "" : await response.text();

        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }

        try {
          payload = await response.json();
        } catch (err) {
          console.error("Resposta sem JSON da checagem de CRM", err);
        }

        exists =
          Array.isArray(payload)
            ? payload.length > 0
            : Boolean(
              payload &&
              (payload.exists ||
                payload.id ||
                payload.total > 0 ||
                payload.count > 0 ||
                (Array.isArray(payload.data) && payload.data.length > 0))
            );
      }

      if (exists) {
        setFlow("exists");
        setProgress(100);
        setFeedback("Este contato já está cadastrado no CRM.");
        return true;
      }

      setFlow("confirm");
      setProgress((prev) => Math.max(prev, 80));
      setFeedback(null);
      return false;
    } catch (err: any) {
      console.error(err);
      setFlow("error");
      setFeedback("Erro ao verificar contato. Verifique o endpoint e tente novamente.");
      setRawError(rawErrorText || err?.message || "Erro desconhecido");
      setProgress(50);
      return null;
    }
  }

  async function handleRetrieve() {
    setFlow("loading_contact");
    setProgress(25);
    setFeedback(null);
    setRawError(null);
    setShowRawError(false);

    await new Promise((resolve) => setTimeout(resolve, 120));

    if (!contact?.number && !contact?.name) {
      setFlow("error");
      setFeedback("Não encontrei o contato. Abra o painel direito e tente novamente.");
      setProgress(0);
      return;
    }

    const nextPhone = contact?.number ?? form.phone ?? "";

    setForm((prev) => ({
      ...prev,
      name: contact?.name ?? prev.name,
      phone: nextPhone
    }));

    setFlow("confirm");
    setProgress(60);

    if (nextPhone) {
      await checkExistingContact(nextPhone);
    }
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
    if (!isSendConfigured) {
      setFeedback("Configure Base URL e Endpoint antes de enviar.");
      setFlow("error");
      return;
    }

    if (isLookupConfigured) {
      const alreadyExists = await checkExistingContact(form.phone);
      if (alreadyExists || alreadyExists === null) {
        return;
      }
    }

    setFlow("sending");
    setProgress(90);
    setFeedback(null);
    setRawError(null);
    setShowRawError(false);

    let rawErrorText = "";

    try {
      if (typeof chrome !== "undefined" && chrome.runtime?.id) {
        await sendMessageToBackground("CRM_SEND_CONTACT", {
          baseUrl: config.baseUrl,
          endpoint: config.endpoint,
          apiKey: config.apiKey,
          body: {
            name: form.name,
            phone: form.phone,
            gender: form.gender,
            ageProfile: form.ageProfile,
            source: "whatsapp-web"
          }
        });

        setFlow("success");
        setProgress(100);
        setFeedback("Enviado com sucesso.");
        setRawError(null);
      } else {
        const response = await fetch(`${config.baseUrl}${config.endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(config.apiKey ? { "x-api-key": config.apiKey } : {})
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            gender: form.gender,
            ageProfile: form.ageProfile,
            source: "whatsapp-web"
          })
        });

        if (!response.ok) {
          rawErrorText = await response.text();
          throw new Error(`Erro ${response.status}`);
        }

        setFlow("success");
        setProgress(100);
        setFeedback("Enviado com sucesso.");
        setRawError(null);
      }
    } catch (err: any) {
      console.error(err);
      setFlow("error");
      setFeedback("Erro ao enviar. Verifique o endpoint e tente novamente.");
      setRawError(rawErrorText || err?.message || "Erro desconhecido");
      setProgress(50);
    }
  }

  const progressLabel = useMemo(() => {
    switch (flow) {
      case "loading_contact":
        return "Capturando contato";
      case "checking_existing":
        return "Consultando CRM";
      case "exists":
        return "Contato localizado";
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
        <ButtonMenu tooltipText="Enviar contato no CRM">
          <Contact size={16} />
        </ButtonMenu>


      </DialogTrigger>
      <DialogContent
        data-element="amm-dialog-crm"
        className="bg-white text-gray-900 shadow-2xl max-w-xl"
        style={{
          "--primary": "222.2 47.4% 11.2%",
          "--primary-foreground": "210 40% 98%",
          "--muted": "210 40% 96.1%",
          "--muted-foreground": "215.4 16.3% 46.9%",
          "--accent": "210 40% 96.1%",
          "--accent-foreground": "222.2 47.4% 11.2%",
          "--border": "214.3 31.8% 91.4%",
          "--input": "214.3 31.8% 91.4%",
        } as React.CSSProperties}
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-gray-900 text-xl">Enviar contato para CRM</DialogTitle>
          <DialogDescription >
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-black text-white hover:bg-black/90 rounded-lg"
                  onClick={handleRetrieve}
                  disabled={flow === "loading_contact" || flow === "sending"}
                >
                  {flow === "loading_contact" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <RefreshCcw size={16} />
                  )}

                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-gray-900 border-gray-300 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowSettings((v) => !v)}
                >
                  <Settings size={16} />
                </Button>

              </div>

              {/* Feedback inline removido; manteremos o bloco inferior */}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
            <div
              className="h-2 rounded bg-primary transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{progressLabel}</span>
        </div>



        {showSettings && (
          <div className="rounded-md border border-gray-200 p-3 space-y-2 bg-gray-50">
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
            <div className="flex gap-2 items-center">
              <div className="w-24 text-sm text-gray-600">Endpoint de consulta</div>
              <Input
                value={config.checkEndpoint}
                onChange={(e) => setConfig((prev) => ({ ...prev, checkEndpoint: e.target.value }))}
                placeholder="/api/crm/customers"
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-24 text-sm text-gray-600">API Key</div>
              <Input
                value={config.apiKey}
                onChange={(e) => setConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                placeholder="chave secreta"
              />
            </div>
            <Button size="sm" onClick={saveConfig} className="flex items-center gap-2 bg-black text-white hover:bg-black/90">
              <CheckCircle2 size={16} />
              Salvar configurações
            </Button>
          </div>
        )}

        <Separator className="bg-gray-200" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Nome</div>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do contato"
            />
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Telefone</div>
            <Input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Telefone do contato"
            />
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Gênero</div>
            <Select
              value={form.gender}
              onValueChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="unknown">Não sei</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Perfil de idade</div>
            <Select
              value={form.ageProfile}
              onValueChange={(value) => setForm((prev) => ({ ...prev, ageProfile: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o perfil de idade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="young">Jovem</SelectItem>
                <SelectItem value="adult">Adulto</SelectItem>
                <SelectItem value="unknown">Não sei</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          {flow === "checking_existing" && (
            <div className="flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 p-2 text-blue-800">
              <Loader2 size={16} className="animate-spin" /> Verificando se o contato já está no CRM...
            </div>
          )}

          {flow === "exists" && (
            <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
              <CheckCircle2 size={18} className="mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-semibold">Contato já existe no CRM</div>
                <div className="text-xs text-emerald-700">
                  Encontramos um cadastro para o telefone final {phoneLastDigits || "informado"}. Você pode fechar esta janela.
                </div>
              </div>
            </div>
          )}
        </div>

        {flow === "exists" ? (
          <DialogClose asChild>
            <Button className="w-full flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800">
              Fechar
            </Button>
          </DialogClose>
        ) : (
          <Button
            className="w-full flex items-center gap-2 bg-black text-white hover:bg-black/90"
            onClick={handleSend}
            disabled={flow === "sending" || flow === "checking_existing" || !isSendConfigured}
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
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} /> {feedback}
              {rawError ? (
                <button
                  type="button"
                  className="underline underline-offset-2 text-red-600 hover:text-red-700"
                  onClick={() => setShowRawError((v) => !v)}
                >
                  clicar aqui
                </button>
              ) : null}
            </div>
            {showRawError && rawError ? (
              <pre className="whitespace-pre-wrap break-words rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                {rawError}
              </pre>
            ) : null}
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
