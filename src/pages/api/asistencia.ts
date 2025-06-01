import { enviarAsistencia } from "@/firebase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const { asistencia } = await request.json();

    const res = await enviarAsistencia(asistencia);

    return new Response(JSON.stringify(res));
}