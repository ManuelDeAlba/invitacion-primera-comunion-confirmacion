import { defineMiddleware } from "astro:middleware";
import { verificarToken } from "@/lib/auth-token";

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);
    
    // Variables to store the authentication status and role
    let valido, rol;

    // Get the auth token from cookies
    const token = context.cookies.get("auth-token");
    // If the token exists, verify in the database
    if(token) ({ auth: valido, rol } = verificarToken(token.value));
    // Store the role in locals for later use
    if(valido && rol) context.locals.rol = rol;

    // If the user is already authenticated, redirect to the dashboard (/respuestas)
    if(url.pathname == "/login"){
        if (token && valido) {
            return context.redirect("/respuestas");
        }

        return next();
    }

    if (url.pathname.startsWith("/respuestas")) {
        // If the token does not exist or the token is invalid, redirect to the login page
        if (!token || !valido) {
            return context.redirect("/login");
        }
    }

    // Continue to the next middleware or route handler
    return next();
})