import { defineMiddleware } from "astro:middleware";
import { verificarToken } from "./firebase";

export const onRequest = defineMiddleware(async (context, next) => {
    const url = new URL(context.request.url);

    if (url.pathname.startsWith("/respuestas")) {
        const token = context.cookies.get("token");

        // Verify if there's a token in the cookies
        if (!token) {
            // If the token does not exist, redirect to the login page
            return context.redirect("/login");
        }

        // If the token exists, verify in the database
        const valido = await verificarToken(token.value);
        
        if (!valido) {
            // If the token is invalid, redirect to the login page
            return context.redirect("/login");
        }
    }

    // Continue to the next middleware or route handler
    return next();
})