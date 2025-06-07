type ToastTypes = 'success' | 'error' | 'info' | 'warning';

interface ShowToastProps {
    elemento?: HTMLElement | null;
    mensaje: string;
    duracion?: number;
    tipo?: ToastTypes;
}

export function showToast({ elemento, mensaje, duracion = 3000, tipo="success"}: ShowToastProps): HTMLElement | null {
    const toaster = document.querySelector(".toaster") as HTMLDivElement;

    if(!toaster){
        console.error("No se encontró el elemento con la clase 'toaster'. Asegúrate de que exista en el DOM.");
        return null;
    }

    let toastItem;
    if(elemento){
        toastItem = elemento;
    } else {
        toastItem = document.createElement("div");
    }
    toastItem.className = `toast-item text-lg rounded-md px-8 py-2`;
    toastItem.classList.add(`toast-${tipo}`);
    toastItem.textContent = mensaje;
    if(!elemento) toaster.appendChild(toastItem);

    // Cerrar el toast después de la duración especificada
    setTimeout(() => {
        toastItem.classList.add("cerrado");
        toastItem.addEventListener("transitionend", () => {
            toastItem.remove();
        });
    }, duracion);

    return toastItem;
}