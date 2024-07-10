import { useState } from "react";
import { TemplateItem } from "../template-messages.types";

interface ItemCardProps {
    itemIndex: number;
    item: TemplateItem
    groupName?: string
}

export default function ItemCard({ itemIndex, item, groupName }: ItemCardProps) {

    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());


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

    return (
        <div onClick={() => toggleItem(itemIndex)} className="flex flex-col items-start gap-2 rounded-lg
        border p-3 text-left text-sm transition-all hover:bg-accent bg-muted">

            <div className="flex flex-col gap-1">
                <h2 className="font-heading scroll-m-20 text-sm font-semibold tracking-tight leading-none uppercase">
                    {item.title}
                </h2>
                {groupName && <span className="text-xs text-muted-foreground uppercase tracking-tight">{groupName}</span>}
            </div>
            <p className="text-xs text-muted-foreground">
                {expandedItems.has(itemIndex) ? item.content : truncateContent(item.content)}
            </p>
        </div>
    )
}