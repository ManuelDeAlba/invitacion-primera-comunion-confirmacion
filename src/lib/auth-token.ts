import jwt from "jsonwebtoken";

interface Payload {
    auth: boolean;
}

export function crearToken(): string{
    const token = jwt.sign({ auth: true }, import.meta.env.JWT_SECRET, {
        expiresIn: "1d"
    })
    return token;
}

export function verificarToken(token: string): boolean{
    try {
        const decoded = jwt.verify(token, import.meta.env.JWT_SECRET) as Payload;
        // Se puede implementar lógica para verificar si el token está en la lista negra (suponiendo que existe una propiedad id en el payload)
        return decoded.auth;
    } catch (error) {
        console.error("Token verification failed:", error);
        return false;
    }
}
