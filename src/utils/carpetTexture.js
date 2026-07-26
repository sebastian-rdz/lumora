import * as THREE from 'three';

// Genera de forma procedural una textura tipo "alfombra de cine"
// (patrón de rombos oscuros) sin depender de ningún archivo externo.
export function createCarpetTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#241014';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#3a1b22';
    ctx.lineWidth = 3;
    const step = 32;
    for (let y = -size; y < size * 2; y += step) {
        ctx.beginPath();
        ctx.moveTo(-size, y);
        ctx.lineTo(size * 2, y - size * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size, y);
        ctx.lineTo(size * 2, y + size * 2);
        ctx.stroke();
    }

    ctx.fillStyle = 'rgba(90, 30, 40, 0.25)';
    for (let i = 0; i < 40; i++) {
        const rx = Math.random() * size;
        const ry = Math.random() * size;
        ctx.beginPath();
        ctx.arc(rx, ry, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}
