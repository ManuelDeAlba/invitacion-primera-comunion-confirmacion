import { enviarMensaje } from "@/firebase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const { nombre, mensaje } = await request.json();

    const res = await enviarMensaje({
        nombre,
        mensaje,
    });

    return new Response(JSON.stringify(res));
}