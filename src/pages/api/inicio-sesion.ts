import { crearToken, iniciarSesion } from "@/firebase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request, cookies, redirect }) => {
    const { contrasena } = await request.json() as any;

    if (!contrasena) {
        return new Response(JSON.stringify({ error: "Introduce la contraseña" }), {
            status: 400,
        });
    }

    const correcta = await iniciarSesion(contrasena);

    if(!correcta) {
        return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
            status: 401,
        });
    }

    const token = await crearToken();

    cookies.set("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/"
    });

    // Redirect to home
    return redirect("/respuestas");
}