import { useState } from "react";
import { TemplateItem } from "../template-messages.types";
import { Copy, Expand } from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";
import { Button } from "../../../components/ui/button";

interface ItemCardProps {
    itemIndex: number;
    item: TemplateItem
    groupName?: string
    context?: "list" | "search"
}

export default function ItemCard({ itemIndex, item, groupName }: ItemCardProps) {

    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const { toast } = useToast();

    const truncateContent = (content: string) => {
        const limit = 50;
        return content.length > limit ? `${content.slice(0, limit)}...` : content;
    };


    const toggleItem = (index: number) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    async function copyContent() {

        if (!navigator) return

        navigator.clipboard.writeText(item.content).then(() => {
            toast({
                title: "Copiado!",
                description: "Conteúdo copiado para a área.",

            })
        });




    }

    return (
        <div className="flex flex-col items-start gap-2 rounded-lg p-3 text-left text-sm transition-all hover:bg-accent" style={{
            borderStyle: "groove",
        }}
        >

            <div className="flex gap-2 justify-between items-center w-full">
                <div className="flex flex-col gap-1">
                    <h2 className="font-heading scroll-m-20 text-sm font-semibold tracking-tight leading-none uppercase">
                        {item.title}
                    </h2>
                    <span className="text-xs text-muted-foreground uppercase tracking-tight">{groupName}</span>

                </div>

                <div className="flex gap-4">
                    <Button className="hover:bg-yellow-500 rounded-full p-1" variant={"ghost"}
                        onClick={() => toggleItem(itemIndex)}
                    >
                        <Expand className="h-4 w-4 text-muted-foreground cursor-pointer " />
                    </Button>
                    <Button className="hover:bg-yellow-500 rounded-full p-1" variant={"ghost"}
                        onClick={copyContent}
                    >
                        <Copy className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-yellow-500" />
                    </Button>


                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                {expandedItems.has(itemIndex) ? item.content : truncateContent(item.content)}
            </p>
        </div>
    )
}