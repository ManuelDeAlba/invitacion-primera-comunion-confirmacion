import { defineMiddleware } from "astro:middleware";
import { verificarToken } from "@/lib/auth-token";

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);

    // If the user is already authenticated, redirect to the dashboard (/respuestas)
    if(url.pathname == "/login"){
        const token = context.cookies.get("auth-token");

        if (token) {
            const valido = verificarToken(token.value);
            if (valido) {
                return context.redirect("/respuestas");
            }
        }

        return next();
    }

    if (url.pathname.startsWith("/respuestas")) {
        const token = context.cookies.get("auth-token");

        // Verify if there's a token in the cookies
        if (!token) {
            // If the token does not exist, redirect to the login page
            return context.redirect("/login");
        }

        // If the token exists, verify in the database
        const valido = verificarToken(token.value);
        
        if (!valido) {
            // If the token is invalid, redirect to the login page
            return context.redirect("/login");
        }
    }

    // Continue to the next middleware or route handler
    return next();
})