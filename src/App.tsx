import {
  ArrowRight
} from 'lucide-react';
import './App.css';
import { ScrollArea } from './components/ui/scroll-area';
import { Toaster } from './components/ui/toaster';
import TemplateList from './domain/template-messages/components/template-list.component';
import { Button } from './components/ui/button';
import { useState } from 'react';
import { Separator } from './components/ui/separator';
import PizzaTaglio from './components/pizza-taglio/pizza-taglio';

export default function App() {
  const [showSidebar, setShowSidebar] = useState(false);


  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      <div className='p-4'>
        <Button className='bg-yellow-500 text-black uppercase text-xs tracking-wide hover:bg-yellow-200'
          onClick={toggleSidebar}
        >Abrir assistente</Button>
      </div>
      {showSidebar && <Sidebar toggleSidebar={toggleSidebar} />}
    </>
  )

}

interface SidebarProps {
  toggleSidebar: () => void
}

function Sidebar({ toggleSidebar }: SidebarProps) {


  // const [menuItemChoosed, setMenuItemChoosed] = useState<number | null>(null);

  // const handleMenuItemClick = (index: number) => {
  //   setMenuItemChoosed(index);
  // };

  return (

    <div className='h-screen w-[350px] fixed right-0 top-0 bg-white shadow-md'>
      <ScrollArea className="calc(h-screen_-_50px) w-full p-4 overflow-hidden">
        <h2 className="font-heading scroll-m-20 text-xl font-semibold tracking-tight mb-6">Assistente</h2>
        <PizzaTaglio />
        <Separator className="my-6" />
        <TemplateList />
        {/* <MenuHomePage handleMenuItemClick={handleMenuItemClick} />
        <hr />
        {menuItemChoosed === 0 && <TemplateList />}
        {menuItemChoosed === 1 && <PizzaTaglioForm />} */}
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

// interface MenuItemProps {
//   handleMenuItemClick: (index: number) => void
// }


// function MenuHomePage({ handleMenuItemClick }: MenuItemProps) {
//   const menuItems = [
//     {
//       name: 'Modelos de mensagens',
//       icon: ArrowRight,
//     },
//     {
//       name: 'Sabores Pizza Al Taglio',
//       icon: ArrowRight,
//     }
//   ]

//   return (
//     <ul className='flex flex-col w-full gap-4 mb-6'>
//       {menuItems.map((item, index) => (
//         <li key={index}>
//           <Button variant='outline' className='items-center justify-center gap-2'
//             onClick={() => handleMenuItemClick(index)}
//           >
//             <span className='text-xs uppercase font-semibold tracking-wide'>{item.name}</span>
//             <ArrowRight size={16} />
//           </Button>
//         </li>
//       ))}
//     </ul>)
// }