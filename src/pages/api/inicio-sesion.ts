import { verificarContrasena } from "@/firebase";
import { crearToken } from "@/lib/auth-token";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request, cookies, redirect }) => {
    const { contrasena } = await request.json() as any;

    if (!contrasena) {
        return new Response(JSON.stringify({ error: "Introduce la contraseña" }), {
            status: 400,
        });
    }

    const correcta = await verificarContrasena(contrasena);

    if(!correcta) {
        return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
            status: 401,
        });
    }

    const token = crearToken();

    cookies.set("auth-token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
        maxAge: 24 * 60 * 60, // 1 day
    });

    // Redirect to home
    return redirect("/respuestas");
}