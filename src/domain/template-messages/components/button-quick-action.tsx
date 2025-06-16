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
        <button className={
            cn(
                'relative grid place-items-center  bg-none rounded-full  text-black  h-6 w-6 cursor-pointer  ',
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
                    "w-[120px] h-[60px]",
                    // "absolute w-[120px] right-[70px]",
                    "absolute top-9 right-0",
                    hovered && "block animate-in",
                )
            }>
                <p className="text-xs uppercase font-semibold tracking-wide text-right">
                    {templateText.title}
                </p>

            </div>
        </button>


    )
}