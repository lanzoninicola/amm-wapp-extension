import { Hand, HeartHandshake, PersonStanding, SquareMenu } from 'lucide-react';
import './App.css';
import { ScrollArea } from './components/ui/scroll-area';
import { Toaster } from './components/ui/toaster';
import TemplateList from './domain/template-messages/components/template-list.component';
import { Button } from './components/ui/button';
import { useState } from 'react';
import ButtonQuickAction from './domain/template-messages/components/button-quick-action';
import { linKCardapioText, pixText } from './db/mock.db';
import PixSvgIcon from './domain/template-messages/components/pix-svg-icon';

export default function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = (e: React.MouseEvent, fromEl: string = '') => {

    if (fromEl) {
      console.log({ fromEl })
    }

    e.stopPropagation();
    setShowSidebar(!showSidebar)
  };

  return (
    <>
      <div className='fixed right-4 top-4 z-10100'>
        <div className='flex flex-col gap-4 items-center'>
          <Button className='bg-yellow-500 rounded-full p-2 text-black hover:bg-yellow-200 h-12 w-12 '
            onClick={
              (e) => {
                toggleSidebar(e, 'button')
              }
            }
          >
            <PersonStanding />
          </Button>
          <ButtonQuickAction
            templateText={{
              title: 'Boa noite',
              content: 'Boa noite, como vai?'
            }}
            showToast={true}
          >
            <Hand size={18} />
          </ButtonQuickAction>
          <ButtonQuickAction
            templateText={linKCardapioText()}
            showToast={true}
          >
            <SquareMenu size={18} />
          </ButtonQuickAction>
          <ButtonQuickAction
            templateText={pixText()}
            showToast={true}
          >
            <PixSvgIcon width={18} height={18} />
          </ButtonQuickAction>
          <ButtonQuickAction
            templateText={{
              title: 'Obrigado pedido',
              content: 'Muito obrigado pelo pedido.'
            }}
            showToast={true}
          >
            <HeartHandshake size={18} />
          </ButtonQuickAction>

        </div>
      </div>
      {showSidebar && <Sidebar toggleSidebar={(e) => {
        toggleSidebar(e, 'sidebar-container')
      }} />}
    </>
  )

}






interface SidebarProps {
  toggleSidebar: (e: React.MouseEvent, fromEl: string) => void
}

function Sidebar({ toggleSidebar }: SidebarProps) {
  return (

    <SidebarContainer toggleSidebar={toggleSidebar}>

      <div className='col-span-2 h-screen bg-white border-l border-gray-200'
        data-element='sidebar'
      >
        <ScrollArea className="calc(h-screen_-_50px) w-full p-4 overflow-hidden">
          <h2 className="font-heading scroll-m-20 text-xl font-semibold tracking-tight">Assistente</h2>
          <TemplateList />
        </ScrollArea>
        <Toaster />

      </div>
    </SidebarContainer>
  );
}

interface SidebarContainerProps {
  children: React.ReactNode
  toggleSidebar: (e: React.MouseEvent, fromEl: string) => void
}


function SidebarContainer({ children, toggleSidebar }: SidebarContainerProps) {

  return (
    <div className='absolute inset-0 w-screen h-screen'
      data-element='sidebar-container'

    >
      <div className='grid grid-cols-12 w-full h-full relative z-10200'>
        <div
          className='col-span-10'
          onClick={
            (e) => {
              toggleSidebar(e, 'sidebar-container')
            }}>

        </div>
        {children}
      </div>
    </div>
  )

}

/**
interface SidebarCloseButtonProps {
  toggleSidebar: (e: React.MouseEvent, fromEl: string) => void
}


function SidebarCloseButton({ toggleSidebar }: SidebarCloseButtonProps) {

  return (
    <div className='h-[50px] fixed bottom-1 w-full px-4 backdrop-blur-md '>
      <div className='h-full flex items-center'>
        <Button variant='outline' className='items-center justify-center gap-2'
          onClick={
            (e: React.MouseEvent) => {
              toggleSidebar(e, 'sidebar')
            }
          }
        >
          <span className='text-xs uppercase font-semibold tracking-wide'>Fechar</span>
          <ArrowRight size={16} />
        </Button>
      </div>

    </div>
  )
} */