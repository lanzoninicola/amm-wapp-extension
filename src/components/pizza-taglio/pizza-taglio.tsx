import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Copy, LoaderIcon, Pen } from "lucide-react";
import tryit from "../../utils/try-it.util";

// https://javascript.plainenglish.io/fetch-data-in-chrome-extension-v3-2b73719ffc0e

interface SaboresHttpResponse {
    status: number
    payload: {
        sabores: string
    }
}

export default function PizzaTaglio() {

    const [loadingSabores, setLoadingSabores] = useState(false)
    const [sabores, setSabores] = useState("")
    const [edit, setEdit] = useState(false)
    const [submissionState, setSubmissionState] = useState('idle')

    function getSabores() {
        const localEndpoint = import.meta.env?.VITE_REST_API_BASE_ENDPOINT_LOCAL
        const productionEndpoint = import.meta.env?.VITE_REST_API_BASE_ENDPOINT_PRODUCTION

        const endpoint = process.env.NODE_ENV === "development" ? localEndpoint : productionEndpoint


        console.log({ localEndpoint, productionEndpoint, endpoint })

        fetch(`${endpoint}/api/settings?context=cardapio-pizza-taglio`)
            .then(res => res.json())
            .then((res: SaboresHttpResponse) => {

                if (res.status === 200) {
                    setSabores(res.payload.sabores)
                }

                setLoadingSabores(false)

            })
            .finally(() => setLoadingSabores(false))
    }

    useEffect(() => {
        setLoadingSabores(true)
        getSabores()
    }, [])

    async function copyContent() {
        if (!navigator) return

        navigator.clipboard.writeText(sabores).then(() => {
            toast({
                title: "Copiado!",
                description: "Conteúdo copiado para a área.",

            })
        });
    }

    async function sendSabores() {
        const localEndpoint = import.meta.env?.VITE_REST_API_BASE_ENDPOINT_LOCAL
        const productionEndpoint = import.meta.env?.VITE_REST_API_BASE_ENDPOINT_PRODUCTION

        const endpoint = process.env.NODE_ENV === "development" ? localEndpoint : productionEndpoint

        // fetch post

        setSubmissionState('loading')

        const [err, res] = await tryit(
            fetch(`${endpoint}/api/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    action: "cardapio-pizza-taglio-upsert",
                    value: sabores,
                    secret: import.meta.env?.VITE_REST_API_SECRET_KEY
                })
            })
        )


        if (err) {
            console.error(err)

            toast({
                title: "Erro!",
                description: "Erro no atualização.",

            })

            return
        }

        if (res?.status === 200) {
            setEdit(false)

            toast({
                title: "Enviado!",
                description: "Sabores atualizados.",

            })
        } else {
            setSubmissionState('error')
        }
    }


    return (
        <div className="flex flex-col p-2">
            <div className="flex items-center justify-between">
                <h2 className="font-heading scroll-m-20 text-xs font-semibold tracking-tight leading-none uppercase">
                    Sabores Pizza Al Taglio
                </h2>
                <div className="flex gap-4 items-center">

                    <Button className="hover:bg-yellow-500 rounded-full p-1" variant={"ghost"}
                        onClick={() => setEdit(!edit)}
                    >
                        <Pen className="h-4 w-4 text-muted-foreground cursor-pointer " />
                    </Button>

                    <Button className="hover:bg-yellow-500 rounded-full p-1" variant={"ghost"}
                        onClick={copyContent}
                    >
                        <Copy className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-yellow-500" />
                    </Button>
                </div>
            </div>
            <div className="w-full flex flex-col gap-4">
                {
                    loadingSabores ?
                        <span className="flex gap-2 text-sm items-center"><LoaderIcon className="w-6 h-6 animate-spin" />Carregando...</span>
                        : edit === false ?
                            <span className="w-full text-sm text-muted-foreground">{sabores}</span> : <textarea
                                className="w-full h-20 p-4 rounded-md border border-slate-300 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                                value={sabores}
                                onChange={(e) => setSabores(e.target.value)}
                            />
                }
                {edit === true && <button className="w-full rounded-md bg-black text-white uppercase tracking-wide font-semibold text-sm py-1
                hover:opacity-70
                " onClick={sendSabores}>
                    {submissionState === 'loading' ? 'Salvando...' : 'Salvar'}
                </button>}
            </div>
        </div>
    )
}