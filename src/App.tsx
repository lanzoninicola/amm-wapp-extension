import './App.css';
import { ScrollArea } from './components/ui/scroll-area';
import TemplateList from './domain/template-messages/components/template-list.component';

export default function App() {


  return (
    <ScrollArea className="h-screen w-full p-4">
      <h2 className="font-heading scroll-m-20 text-xl font-semibold tracking-tight">Assistente</h2>
      <TemplateList />
    </ScrollArea>
  );
}
