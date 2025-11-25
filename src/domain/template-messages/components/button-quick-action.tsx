import { useState } from "react";
import { toast } from "../../../components/ui/use-toast";
import { TemplateItem } from "../template-messages.types";
import ButtonMenu from "../../../components/button-menu";

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

    async function handleClick() {

        await copyContent().then(() => {
            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 1000)
        })

    }

    async function copyContent() {
        if (!navigator) return

        navigator.clipboard.writeText(templateText.content).then(() => {
            if (showToast) {
                toast({
                    title: "Copiado!",
                    description: "Conteúdo copiado para a área.",
                })
            }
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
