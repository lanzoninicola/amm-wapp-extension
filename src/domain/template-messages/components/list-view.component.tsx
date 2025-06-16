import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";

import { TemplateGroup } from "../template-messages.types";
import ItemCard from "./item-card.component";
import { Input } from "../../../components/ui/input";

interface ListViewProps {
    templates: TemplateGroup[];

}

const ListView: React.FC<ListViewProps> = ({ templates }) => {
    const [templateGroupsFound, setTemplateGroupsFound] = useState<TemplateGroup[]>(templates);

    return (
        <>
            {/* <Input
                type="text"
                placeholder="Buscar..."
                onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();

                    if (!searchTerm) {
                        setTemplateGroupsFound(templates);
                        return;
                    }

                    const filteredTemplates = templates
                        .map(group => {
                            const filteredItems = group.items.filter(item =>
                                item.title.toLowerCase().includes(searchTerm) ||
                                item.content.toLowerCase().includes(searchTerm)
                            );

                            if (
                                group.group.toLowerCase().includes(searchTerm) ||
                                filteredItems.length > 0
                            ) {
                                return { ...group, items: filteredItems };
                            }

                            return null;
                        })
                        .filter((group): group is TemplateGroup => group !== null);

                    setTemplateGroupsFound(filteredTemplates);
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8 mb-4"
            /> */}
            {templateGroupsFound.map((group: TemplateGroup, groupIndex: number) => (
                <Accordion key={groupIndex} type="single" collapsible className="w-full"   >
                    <AccordionItem value={String(groupIndex)} >
                        <AccordionTrigger>
                            <span className="uppercase text-[11px] tracking-wider">{group.group}</span>
                        </AccordionTrigger>
                        <AccordionContent>

                            <ul className="flex flex-col h-[350px] overflow-y-scroll"

                            >
                                {group.items.map((item, itemIndex) => (

                                    <li key={itemIndex}>
                                        <ItemCard item={item} itemIndex={itemIndex} />
                                    </li>
                                ))}
                            </ul>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </>

    );
};

export default ListView;
