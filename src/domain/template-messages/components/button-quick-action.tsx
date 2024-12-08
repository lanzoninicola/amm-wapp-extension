import { useState } from "react";
import { toast } from "../../../components/ui/use-toast";
import { TemplateItem } from "../template-messages.types";
import { cn } from "../../../lib/utils";

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
    const [hovered, setHovered] = useState(false)
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

        <div className={
            cn(
                'relative grid place-items-center  bg-none rounded-full  text-black  h-10 w-10 cursor-pointer',
                "hover:border hover:bg-yellow-200",
                copied && 'bg-yellow-200'
            )
        }
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
            <div className={
                cn(
                    "hidden",
                    "absolute right-[50px] top-1/2 transform -translate-y-1/2 text-right min-w-6",
                    hovered && "block animate-in",
                )
            }>
                <p className="text-xs uppercase font-semibold tracking-wide">
                    {templateText.title}
                </p>

            </div>
        </div>

    )
}