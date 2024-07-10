import { cn } from "../../../lib/utils";
import capitalize from "../../../utils/capitalize.util";

interface TabsProps {
    activeTab: string
    setActiveTab: (tab: string) => void
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }: TabsProps) => {

    return (
        <div className="mb-4 flex items-center [&>a:first-child]:text-primary">
            <TabItem label="list" setActiveTab={setActiveTab} isActive={activeTab === "list"} />
            <TabItem label="search" setActiveTab={setActiveTab} isActive={activeTab === "search"} />
        </div>
    );
};

export default Tabs;

interface TabItemProps {
    label: string
    setActiveTab: (tab: string) => void;
    isActive: boolean
}

function TabItem({ label, setActiveTab, isActive }: TabItemProps) {

    return (
        <span onClick={() => setActiveTab(label)} className={
            cn(
                "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary hover:cursor-pointer hover:underline",
                isActive === true && "bg-muted font-medium text-primary"
            )
        }>
            {capitalize(label)}
        </span>
    )
}
