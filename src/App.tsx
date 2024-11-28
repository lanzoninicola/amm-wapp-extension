import { ArrowRight, PersonStanding } from 'lucide-react';
import './App.css';
import { ScrollArea } from './components/ui/scroll-area';
import { Toaster } from './components/ui/toaster';
import TemplateList from './domain/template-messages/components/template-list.component';
import { Button } from './components/ui/button';
import { useState } from 'react';
import { AppSidebar } from './components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';

export default function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main>

        <SidebarTrigger
          className='bg-yellow-500 rounded-full text-black hover:bg-yellow-200 h-10 w-10 mt-4 mr-4'
        >
          <PersonStanding />
        </SidebarTrigger>
      </main >
    </SidebarProvider >
  )

}

interface SidebarProps {
  toggleSidebar: () => void
}

function Sidebar({ toggleSidebar }: SidebarProps) {
  return (

    <div className='h-screen w-[350px] fixed right-0 top-0 bg-white'>
      <ScrollArea className="calc(h-screen_-_50px) w-full p-4 overflow-hidden">
        <h2 className="font-heading scroll-m-20 text-xl font-semibold tracking-tight">Assistente</h2>
        <TemplateList />
      </ScrollArea>
      <Toaster />
      <div className='h-[50px] fixed bottom-1 w-full px-4 backdrop-blur-md '>
        <div className='h-full flex items-center'>
          <Button variant='outline' className='items-center justify-center gap-2'
            onClick={toggleSidebar}
          >
            <span className='text-xs uppercase font-semibold tracking-wide'>Fechar</span>
            <ArrowRight size={16} />
          </Button>
        </div>

      </div>
    </div>
  );
}
