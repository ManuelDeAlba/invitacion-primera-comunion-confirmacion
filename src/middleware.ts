import { defineMiddleware } from "astro:middleware";
import { verificarToken } from "@/lib/auth-token";

import type { APIContext } from "astro";

function validateAuth(context: APIContext){
    // Get the auth token from cookies
    const token = context.cookies.get("auth-token");

    if(!token) return {
        token: null,
        valido: false,
        rol: null,
    }

    // If the token exists, verify it with jwt and get the role
    let { auth: valido, rol } = verificarToken(token.value);
    // Store the role in locals for later use
    if(valido && rol) context.locals.rol = rol;

    return {
        valido,
        rol,
        token,
    }
}

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);

    // If the user is already authenticated, redirect to the dashboard (/respuestas)
    if(url.pathname == "/login"){
        const { token, valido } = validateAuth(context);

        if (token && valido) {
            return context.redirect("/respuestas");
        }

        return next();
    }

    if (url.pathname.startsWith("/respuestas")) {
        const { token, valido } = validateAuth(context);

        // If the token does not exist or the token is invalid, redirect to the login page
        if (!token || !valido) {
            return context.redirect("/login");
        }
    }

    // Continue to the next middleware or route handler
    return next();
})