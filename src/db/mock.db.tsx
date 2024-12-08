

export const linKCardapioText = () => {
    return {
        title: "Link Cardápio",
        content: "Olá!\nVocê pode conferir todas as nossas deliciosas opções de pizzas no link abaixo:\n\nhttps://amodomio.com.br/cardapio\n\nSe tiver alguma dúvida ou precisar de uma recomendação, estou aqui para ajudar! \n\nBuon appetito! 🍕"
    }
}

export const pixText = () => {
    return {
        title: "Pix",
        content: "Chave PIX\n\n*CNPJ* 49850105000129\n*Nome* Gustavo Bergamaschi\n\nObrigado!"
    }
}

export const mockDatabase = [
    {
        group: "pre vendas",
        items: [
            linKCardapioText(),

            {
                title: "Como funciona",
                content: "Somos uma pizzaria delivery que oferece uma pizza do estilo romano de Roma, é totalmente diferente das pizzas tradicionais da cidade.\n\nO formato da nossa pizza é retangular, com massa de farinha especial e molho de tomate importado da Itália.\n\nO processo de preparo é italiano, como da tradição, o nosso pizzaiolo è Italiano, nascido e criado em Verona, apaixonado por pizzas.\n\nOs tamanhos disponíveis são:\n\n- *MÉDIO* (40x20cm): serve até 2 pessoas, com no máximo dois sabores.\n- *FAMÍLIA* (60x40cm): serve até 6 pessoas, com no máximo quatro sabores.\n\nOferecemos também a pizza *Al Taglio*, disponível apenas no balcão. São fatias de pizza de 10x20cm, ideais para uma pessoa. Esse último segue um cardápio que muda semanalmente.\n\nNosso hórario de atendimento é *de quarta a domingo, das 18h as 22h*. \n\nSe tiver alguma dúvida ou precisar de uma recomendação, estou aqui para ajudar! \n\nAcesse nosso perfil no Instagram https://www.instagram.com/amodomiopb/ para nos seguir. Você também encontrará fotos das nossas pizzas.\n\nBuon appetito! 🍕"
            },
            {
                title: "Hórario de atendimento",
                content: "Nosso hórario de atendimento é de quarta a domingo, das 18h as 22h."
            },
            {
                title: "Para fazer um pedido",
                content: ""
            }
        ]
    },
    {
        group: "status de pedidos",
        items: [
            {
                title: "No forno",
                content: "Olá, a sua pizza está no forno."
            },
            {
                title: "Saindo para entrega",
                content: "Olá, a sua pizza está saindo para entrega."
            }
        ]
    },
    {
        group: "post vendas",
        items: [

            {
                title: "Feedback WhatsApp",
                content: "Agradecemos por ter pedido nossa pizza! Por gentileza, nos envie um feedback aqui pelo WhatsApp sobre como foi a sua experiência."
            },
            {
                title: "Feedback Google",
                content: "Se você gostou da nossa pizza e quer apoiar nosso crescimento, por que não deixar um comentário no Google pelo link https://g.page/r/CceZSxdctFZHEAE/review? São 2 minutos que, para nós, faz toda a diferença."
            },
            pixText()
        ]
    },
    {
        group: "RH",
        items: [
            {
                title: "Assistente Cozinha - Vaga aberta",
                content: "Olá! Asgradecemos pelo interesse na vaga de Assistente de Cozinha na pizzaria A Modo Mio.\n\nVocê pode obter mais informações e se candidatar através da página\n\nhttps://www.amodomio.com.br/vagas/auxiliar-cozinha. \n\nAgradecemos novamente pelo interesse e esperamos contar com você em breve.\n\nEquipe A Modo Mio"
            },
            {
                title: "Assistente Cozinha - Vaga fechada",
                content: "Olá! Agradecemos pelo interesse na vaga de Assistente de Cozinha na pizzaria A Modo Mio. Informamos que, no momento, a vaga está fechada.\n\nConvidamos você a se candidatar através da página https://www.amodomio.com.br/vagas/auxiliar-cozinha em qualquer caso.\n\nSuas informações serão mantidas caso abrirmos novamente a mesma ou novas vagas.\n\nAgradecemos novamente pelo interesse e esperamos contar com você em breve.\n\n"
            }
        ]
    }
]