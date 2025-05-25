type ToastTypes = 'success' | 'error' | 'info' | 'warning';

interface ShowToastProps {
    selector: string;
    mensaje: string;
    duracion?: number;
    tipo?: ToastTypes;
}

let intervalos: any = {};
let contadorZIndex = 100;

export function showToast({ selector, mensaje, duracion = 3000, tipo="success"}: ShowToastProps) {
    if(intervalos[selector]) return;

    const toast = document.querySelector(selector) as HTMLDivElement;

    if(toast){
        toast.innerHTML = mensaje;
        toast.classList.remove('cerrado');
        toast.classList.add(`toast-${tipo}`);
        toast.style.zIndex = `${contadorZIndex++}`;
    
        intervalos[selector] = setTimeout(() => {
            toast.classList.add('cerrado');
            toast.classList.remove(`toast-${tipo}`);
            intervalos[selector] = null;
        }, duracion);
    }
}