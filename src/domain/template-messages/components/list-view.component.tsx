import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { TemplateGroup } from "../template-messages.types";
import ItemCard from "./item-card.component";

interface ListViewProps {
    templates: TemplateGroup[];

}

const ListView: React.FC<ListViewProps> = ({ templates }) => {
    return (
        <div>
            {templates.map((group: TemplateGroup, groupIndex: number) => (
                <Accordion key={groupIndex} type="single" collapsible className="w-full">
                    <AccordionItem value={String(groupIndex)}>
                        <AccordionTrigger>
                            {group.group}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="flex flex-col gap-2">
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

        </div>
    );
};

export default ListView;
