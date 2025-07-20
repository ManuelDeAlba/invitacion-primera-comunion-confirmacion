// Import the functions you need from the SDKs you need
import bcrypt from "bcryptjs";
import { initializeApp } from "firebase/app";
import { collection, count, deleteDoc, doc, getAggregateFromServer, getDocs, getFirestore, query, setDoc, sum, where } from "firebase/firestore";
import { APP_NAME } from "./config";

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

export async function enviarAsistencia({ userid, asistencias }){
    const id = Date.now() + crypto.randomUUID();
    const documento = doc(db, "asistencias", id);

    const docObj = {
        appName: APP_NAME,
        id: id,
        userid,
        fecha: Date.now(),
        invitados: parseInt(asistencias)
    }

    await setDoc(documento, docObj);

    return docObj;
}

export async function obtenerListaAsistencias(){
    const q = query(collection(db, "asistencias"), where("appName", "==", APP_NAME));
    
    const snapshot = await getDocs(q);
    const asistencias = snapshot.docs.map(doc => doc.data());

    return asistencias;
}

export async function obtenerAsistencia(){
    const q = query(collection(db, "asistencias"), where("appName", "==", APP_NAME));

    const snap = await getAggregateFromServer(q, {
        totalInvitados: sum('invitados')
    });

    return snap.data().totalInvitados;
}

export async function obtenerEnviosAsistencia(){
    const q = query(collection(db, "asistencias"), where("appName", "==", APP_NAME));

    const snap = await getAggregateFromServer(q, {
        envios: count('invitados')
    });

    return snap.data().envios;
}

export async function borrarAsistencia(id){
    const documento = doc(db, "asistencias", id);

    await deleteDoc(documento);
}

export async function enviarMensaje({ userid, nombre, mensaje }){
    const id = Date.now() + crypto.randomUUID();
    const documento = doc(db, "mensajes", id);

    const docObj = {
        appName: APP_NAME,
        id: id,
        userid,
        fecha: Date.now(),
        nombre: nombre,
        mensaje: mensaje
    }

    await setDoc(documento, docObj);

    return docObj;
}

export async function obtenerMensajes(){
    const q = query(collection(db, "mensajes"), where("appName", "==", APP_NAME));

    const snapshot = await getDocs(q);
    const mensajes = snapshot.docs.map(doc => doc.data());

    return mensajes;
}

export async function borrarMensaje(id){
    const documento = doc(db, "mensajes", id);

    await deleteDoc(documento);
}

export async function verificarContrasena(contrasena){
    const q = query(collection(db, "contrasenas"), where("appName", "==", APP_NAME));

    const snapshot = await getDocs(q);
    const contrasenas = snapshot.docs.map(doc => doc.data());

    const documento = contrasenas.find(({ contrasena: contrasenaGuardada }) => {
        return bcrypt.compareSync(contrasena, contrasenaGuardada)
    })
    
    if(!documento) return { correcta: false, rol: null };

    return { correcta: true, rol: documento.rol };
}