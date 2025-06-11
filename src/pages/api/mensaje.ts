import { enviarMensaje, borrarMensaje } from "@/firebase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const { userid, nombre, mensaje } = await request.json();

    const res = await enviarMensaje({
        userid,
        nombre,
        mensaje,
    });

    return new Response(JSON.stringify(res));
}

export const DELETE: APIRoute = async ({ request }) => {
    const { id } = await request.json();

    const res = await borrarMensaje(id);

    return new Response(JSON.stringify(res));
}