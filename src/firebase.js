// Import the functions you need from the SDKs you need
import bcrypt from "bcryptjs";
import { initializeApp } from "firebase/app";
import { collection, doc, getAggregateFromServer, getDocs, getFirestore, setDoc, sum } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_API_KEY,
  authDomain: import.meta.env.PUBLIC_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function enviarAsistencia(asistencias){
    const id = Date.now() + crypto.randomUUID();
    const documento = doc(db, "asistencias", id);

    const docObj = {
        id: id,
        invitados: parseInt(asistencias)
    }

    await setDoc(documento, docObj);

    return docObj;
}

export async function obtenerAsistencia(){
    const coleccion = collection(db, "asistencias");

    const snap = await getAggregateFromServer(coleccion, {
        totalInvitados: sum('invitados')
    });

    return snap.data().totalInvitados;
}

export async function enviarMensaje({ nombre, mensaje }){
    const id = Date.now() + crypto.randomUUID();
    const documento = doc(db, "mensajes", id);

    const docObj = {
        id: id,
        fecha: Date.now(),
        nombre: nombre,
        mensaje: mensaje
    }

    await setDoc(documento, docObj);

    return docObj;
}

export async function obtenerMensajes(){
    const coleccion = collection(db, "mensajes");

    const snapshot = await getDocs(coleccion);
    const mensajes = snapshot.docs.map(doc => doc.data());

    return mensajes;
}

export async function iniciarSesion(contrasena){
    const coleccion = collection(db, "contrasenas");

    const snapshot = await getDocs(coleccion);
    const contrasenas = snapshot.docs.map(doc => doc.data());

    const correcta = contrasenas.some(({ contrasena: contrasenaGuardada }) => {
        return bcrypt.compareSync(contrasena, contrasenaGuardada);
    })

    return correcta;
}

export async function crearToken(){
    const token = crypto.randomUUID();
    const documento = doc(db, "tokens", token);

    const docObj = {
        token: token,
        fecha: Date.now()
    }

    await setDoc(documento, docObj);

    return token;
}

export async function verificarToken(token){
    const coleccion = collection(db, "tokens");

    const snapshot = await getDocs(coleccion);
    const tokens = snapshot.docs.map(doc => doc.data());

    const tokensValidos = tokens.filter(tokenGuardado => {
        return tokenGuardado.token == token;
    })
    console.log({tokensValidos});

    const valido = tokens.some(({ token: tokenGuardado }) => {
        return tokenGuardado === token;
    });

    return valido;
}