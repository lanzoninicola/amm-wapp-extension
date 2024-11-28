import { useState } from "react";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import tryit from "../../../utils/try-it.util";



export default function PizzaTaglioForm() {
    const [sabores, setSabores] = useState("")


    async function sendSabores() {
        const localEndpoint = import.meta.env?.VITE_REST_API_BASE_ENDPOINT_LOCAL
        const productionEndpoint = import.meta.env?.VITE_REST_API_BASE_ENDPOINT_PRODUCTION

        const endpoint = process.env.NODE_ENV === "development" ? localEndpoint : productionEndpoint

        // fetch post

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
            return
        }


        console.log(res)


    }


    return (
        <div className="w-full flex flex-col gap-4 p-2">
            <Textarea name="sabores" className="h-36" onChange={(e) => setSabores(e.target.value)} />

            <Button variant="default" className="w-full" onClick={sendSabores}>Salvar</Button>
        </div>
    );
}