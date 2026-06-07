import { BellRing, Bike, Hand, Heart, HeartHandshake, Proportions, Scissors, Siren, SquareMenu, Watch } from 'lucide-react';
import ButtonQuickAction from '../../template-messages/components/button-quick-action';
import { cortarPizza, filaWhatsApp, linKCardapioText, pixText, pizzaSize } from '../../../db/message-templates';
import PixSvgIcon from '../../template-messages/components/pix-svg-icon';
import { Separator } from '../../../components/ui/separator';

import { CrmDialog } from '../../crm/components/crm-dialog';

export default function QuickActionBar() {


  return (
    <div className="flex items-center gap-1" data-componente="amm-quick-action-bar">
      <ButtonQuickAction
        templateText={{
          title: 'Boa noite',
          content: 'Boa noite, como vai?'
        }}
        showToast={true}
      >
        <Hand size={14} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={linKCardapioText()}
        showToast={true}
      >
        <SquareMenu size={14} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={{
          title: 'Voltamos ao atendimento',
          content: 'Olá! Voltamos ao atendimento! 😊\nTodos os *preços, tamanhos e sabores* estão no nosso cardápio aqui 👇\nhttps://amodomio.com.br/cardapio'
        }}
        showToast={true}
      >
        <BellRing size={14} />
      </ButtonQuickAction>

      <ButtonQuickAction
        templateText={{
          title: 'Combo Dia dos Namorados',
          content: '*COMBO ESPECIAL DIA DOS NAMORADOS*\nGaranta sua reserva antecipada e aproveite o melhor valor.\n\n🍕 Inclui:\n* 1 Pizza Valentino (Média)\n* 1 Pizza Mon Cherry (Pequena - doce)\n\n💰 Valores\n* Reserva antecipada: *R$ 159,90*\n* No Dia dos Namorados: *R$ 179,90*\n\n🏷 Economia\n* Reservando antecipadamente, você *economiza R$ 30,00*\n\n⚠️ Devido à alta procura na data, as reservas são limitadas e sujeitas à disponibilidade.\n\n* Combo com composição fixa.\n* Não é possível realizar alterações ou substituições.\n\n🍕 Todo o cardápio também estará disponível para pedidos individuais.\n\n🚨 Não deixe para a última hora! *As vagas para reserva são limitadas* e costumam se esgotar rapidamente. Garanta agora seu combo pelo valor promocional, economize R$ 30,00 e assegure uma experiência inesquecível!'
        }}
        showToast={true}
      >
        <Heart size={14} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={pizzaSize()}
        showToast={true}
      >
        <Proportions width={14} height={14} />
      </ButtonQuickAction>
      <Separator orientation="vertical" className="h-5 bg-[#e3c95f]/80" />
      <ButtonQuickAction
        templateText={filaWhatsApp()}
        showToast={true}
      >
        <Siren size={14} />
      </ButtonQuickAction>

      <ButtonQuickAction
        templateText={{
          title: 'Agendamento entrega',
          content: 'Quer que a gente entregue em um horário específico?'
        }}
        showToast={true}
      >
        <Watch size={14} />
      </ButtonQuickAction>

      <ButtonQuickAction
        templateText={pixText()}
        showToast={true}
      >
        <PixSvgIcon width={14} height={14} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={{
          title: 'Saindo para entrega',
          content: 'Seu pedido está a caminho! Obrigado por escolher A Modo Mio!\n\nAmou a pizza? Deixe sua opinião no Google, sua avaliação em 2 min faz toda a diferença! 🙌\n\n👉 https://g.page/r/CceZSxdctFZHEAE/review'
        }}
        showToast={true}
      >
        <Bike size={14} />
      </ButtonQuickAction>
      <Separator orientation="vertical" className="h-5 bg-[#e3c95f]/80" />
      <ButtonQuickAction
        templateText={cortarPizza()}
        showToast={true}
      >
        <Scissors size={14} />
      </ButtonQuickAction>

      <ButtonQuickAction
        templateText={{
          title: 'Agredecimento pedido',
          content: 'Muito obrigado pelo pedido!\n\nAmou a pizza? Deixe sua opinião no Google, sua avaliação em 2 min faz toda a diferença! 🙌\n\n👉 https://g.page/r/CceZSxdctFZHEAE/review'
        }}
        showToast={true}
      >
        <HeartHandshake size={14} />
      </ButtonQuickAction>
      <Separator orientation="vertical" className="h-5 bg-[#e3c95f]/80" />

      <CrmDialog />
    </div>
  )
}
