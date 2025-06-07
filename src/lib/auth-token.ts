import jwt from "jsonwebtoken";

interface Payload {
    auth: boolean;
    rol: string | null;
}

export function crearToken(rol: string): string{
    const token = jwt.sign({ auth: true, rol }, import.meta.env.JWT_SECRET, {
        expiresIn: "1d"
    })
    return token;
}

export function verificarToken(token: string): Payload{
    try {
        const decoded = jwt.verify(token, import.meta.env.JWT_SECRET) as Payload;
        // Se puede implementar lógica para verificar si el token está en la lista negra (suponiendo que existe una propiedad id en el payload)
        return { auth: decoded.auth, rol: decoded.rol };
    } catch (error) {
        console.error("Token verification failed:", error);
        return { auth: false, rol: null };
    }
}
