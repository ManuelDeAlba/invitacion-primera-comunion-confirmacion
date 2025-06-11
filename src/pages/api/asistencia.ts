import { borrarAsistencia, enviarAsistencia } from "@/firebase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const { userid, asistencia: asistencias } = await request.json();

    const res = await enviarAsistencia({
        userid,
        asistencias
    });

    return new Response(JSON.stringify(res));
}

export const DELETE: APIRoute = async ({ request }) => {
    const { id } = await request.json();

    const res = await borrarAsistencia(id);

    return new Response(JSON.stringify(res));
}