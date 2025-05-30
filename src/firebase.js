// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, doc, getAggregateFromServer, getFirestore, setDoc, sum } from "firebase/firestore";

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

    await setDoc(documento, {
        invitados: parseInt(asistencias)
    })
}

export async function obtenerAsistencia(){
    const coleccion = collection(db, "asistencias");

    const snap = await getAggregateFromServer(coleccion, {
        totalInvitados: sum('invitados')
    });

    return snap.data().totalInvitados;
}