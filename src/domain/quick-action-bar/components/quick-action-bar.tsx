import { Bike, Hand, HeartHandshake, Proportions, Scissors, SquareMenu } from 'lucide-react';


import ButtonQuickAction from '../../template-messages/components/button-quick-action';
import { cortarPizza, linKCardapioText, pixText, pizzaSize } from '../../../db/mock.db';
import PixSvgIcon from '../../template-messages/components/pix-svg-icon';



export default function QuickActionBar() {
  return (
    <>
      <ButtonQuickAction
        templateText={{
          title: 'Boa noite',
          content: 'Boa noite, como vai?'
        }}
        showToast={true}
      >
        <Hand size={16} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={linKCardapioText()}
        showToast={true}
      >
        <SquareMenu size={16} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={pizzaSize()}
        showToast={true}
      >
        <Proportions width={16} height={16} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={pixText()}
        showToast={true}
      >
        <PixSvgIcon width={16} height={16} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={{
          title: 'Saindo para entrega',
          content: 'Seu pedido está a caminho! Obrigado por escolher A Modo Mio!\n\nAmou a pizza? Deixe sua opinião no Google, sua avaliação em 2 min faz toda a diferença! 🙌\n\n👉 https://g.page/r/CceZSxdctFZHEAE/review'
        }}
        showToast={true}
      >
        <Bike size={16} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={cortarPizza()}
        showToast={true}
      >
        <Scissors size={16} />
      </ButtonQuickAction>
      <ButtonQuickAction
        templateText={{
          title: 'Agredecimento pedido',
          content: 'Muito obrigado pelo pedido!\n\nAmou a pizza? Deixe sua opinião no Google, sua avaliação em 2 min faz toda a diferença! 🙌\n\n👉 https://g.page/r/CceZSxdctFZHEAE/review'
        }}
        showToast={true}
      >
        <HeartHandshake size={16} />
      </ButtonQuickAction>
    </>
  )
}