import confetti from 'canvas-confetti';

let miConfetti: confetti.CreateTypes | undefined;

function crearConfetti(){
    const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

    if(!canvas) return console.error("No se encontró el canvas con id 'canvas'");

    miConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true,
    });
}

export function lanzarConfetti(){
    // Si no existe la instancia del confetti, lo creamos
    if(!miConfetti) crearConfetti();
    // Si aún no se ha inicializa, ya no hacemos nada
    if(!miConfetti) return;

    miConfetti({
        particleCount: 150,
        startVelocity: 40,
        spread: 180,
        origin: {
            x: 0.5,
            y: 0.5
        },
        ticks: 500,
    });
}