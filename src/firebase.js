// Import the functions you need from the SDKs you need
import bcrypt from "bcryptjs";
import { initializeApp } from "firebase/app";
import { collection, count, doc, getAggregateFromServer, getDocs, getFirestore, setDoc, sum } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
  appId: import.meta.env.APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function enviarAsistencia(asistencias){
    const id = Date.now() + crypto.randomUUID();
    const documento = doc(db, "asistencias", id);

    const docObj = {
        id: id,
        fecha: Date.now(),
        invitados: parseInt(asistencias)
    }

    await setDoc(documento, docObj);

    return docObj;
}

export async function obtenerListaAsistencias(){
    const coleccion = collection(db, "asistencias");

    const snapshot = await getDocs(coleccion);
    const asistencias = snapshot.docs.map(doc => doc.data());

    return asistencias;
}

export async function obtenerAsistencia(){
    const coleccion = collection(db, "asistencias");

    const snap = await getAggregateFromServer(coleccion, {
        totalInvitados: sum('invitados')
    });

    return snap.data().totalInvitados;
}

export async function obtenerEnviosAsistencia(){
    const coleccion = collection(db, "asistencias");

    const snap = await getAggregateFromServer(coleccion, {
        envios: count('invitados')
    });

    return snap.data().envios;
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

export async function verificarContrasena(contrasena){
    const coleccion = collection(db, "contrasenas");

    const snapshot = await getDocs(coleccion);
    const contrasenas = snapshot.docs.map(doc => doc.data());

    const documento = contrasenas.find(({ contrasena: contrasenaGuardada }) => {
        return bcrypt.compareSync(contrasena, contrasenaGuardada)
    })
    
    if(!documento) return { correcta: false, rol: null };

    return { correcta: true, rol: documento.rol };
}