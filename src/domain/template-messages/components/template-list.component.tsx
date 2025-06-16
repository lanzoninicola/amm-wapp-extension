import { useEffect, useState } from "react";
import templateMessagesEntity from "../template-messages.entity";
import { TemplateGroup } from "../template-messages.types";
import ListView from "./list-view.component";
import SearchView from "./search-view.component";
import { cn } from "../../../lib/utils";


export default function TemplateList() {
    const [currentActiveMenu, setCurrentActiveMenu] = useState<string | null>("list")
    const [templates, setTemplates] = useState<TemplateGroup[]>([]);

    useEffect(() => {
        templateMessagesEntity.getMessages().then(setTemplates);
    }, []);



    const MenuItem = ({ onClick, children, highlightCondition }: { onClick: () => void; children: React.ReactNode; highlightCondition: boolean }) => {
        return (
            <span onClick={onClick}
                className={
                    cn(
                        "cursor-pointer text-center text-[11px] uppercase tracking-wide hover:bg-gray-200 px-2 py-1 rounded transition-colors",
                        highlightCondition && "font-semibold underline "
                    )
                }>
                {children}
            </span>
        )
    }


    return (
        <div className="mt-4">
            <div className="grid grid-cols-2 w-full mb-4">
                <MenuItem onClick={() => setCurrentActiveMenu("list")}
                    highlightCondition={currentActiveMenu === "list"}>
                    Lista
                </MenuItem>
                <MenuItem onClick={() => setCurrentActiveMenu("search")}
                    highlightCondition={currentActiveMenu === "search"}>
                    Procurar
                </MenuItem>

            </div>
            {currentActiveMenu === "list" && (
                <ListView
                    templates={templates}

                />
            )}
            {currentActiveMenu === "search" && (
                <SearchView
                    templates={templates}

                />
            )}
        </div>
    );
}
