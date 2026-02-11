import { useState } from "react";
import { toast } from "../../../components/ui/use-toast";
import { TemplateItem } from "../template-messages.types";
import ButtonMenu from "../../../components/button-menu";
import { composeMessage } from "../../../whatsapp/compose-message";
import { useActionDeduper } from "../../../hooks/use-action-deduper";

interface ButtonQuickActionProps {
    children: React.ReactNode,
    templateText: TemplateItem,
    showToast: boolean
}

export default function ButtonQuickAction({
    children,
    templateText,
    showToast
}: ButtonQuickActionProps) {

    const [copied, setCopied] = useState(false)
    const { runWithDedup } = useActionDeduper({
        windowMs: 600,
        releaseDelayMs: 250,
    });

    function showInsertedToast() {
        if (!showToast) return;
        toast({
            title: "Inserido!",
            description: "Conteúdo inserido na mensagem.",
        });
    }

    function showCopiedToast() {
        if (!showToast) return;
        toast({
            title: "Copiado!",
            description: "Conteúdo copiado para a área.",
        });
    }

    function showFailedToast() {
        if (!showToast) return;
        toast({
            title: "Não foi possível inserir",
            description: "Também não foi possível copiar automaticamente.",
            variant: "destructive",
        });
    }

    async function handleClick() {
        await runWithDedup(templateText.content.trim(), async () => {
            const result = await composeMessage(templateText.content);
            if (result === "failed") {
                showFailedToast();
                return;
            }

            if (result === "inserted") showInsertedToast();
            if (result === "copied") showCopiedToast();

            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 1000)
        });
    }
    return (
        <ButtonMenu
            onClick={handleClick}
            tooltipText={templateText.title}
            highlight={copied}
        >
            {children}

        </ButtonMenu>


    )
}
