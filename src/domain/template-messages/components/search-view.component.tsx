import { useState, useEffect } from "react";
import { TemplateGroup } from "../template-messages.types";
import ItemCard from "./item-card.component";
import { Input } from "../../../components/ui/input";
import { Search } from "lucide-react";

interface SearchViewProps {
    templates: TemplateGroup[];
}

const SearchView: React.FC<SearchViewProps> = ({ templates }) => {
    const [templateGroupsFound, setTemplateGroupsFound] = useState<TemplateGroup[]>(templates);

    useEffect(() => {
        setTemplateGroupsFound(templates);
    }, [templates]);

    return (
        <div className="px-1">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search..."
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
                />
            </div>
            {templateGroupsFound.map((group, groupIndex) => (
                <div key={groupIndex}>
                    <h3 className="font-semibold border-b">{group.group}</h3>
                    <ul className="flex flex-col gap-2">
                        {group.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                                <ItemCard item={item} itemIndex={itemIndex} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default SearchView;
