import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// create seat (cushion + backrest + armrests)
export function buildSeatGeometry() {
    const parts = [];

    const bake = (geometry, x, y, z, rx = 0, ry = 0, rz = 0) => {
        const g = geometry.clone();
        const m = new THREE.Matrix4();
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz));
        m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1));
        g.applyMatrix4(m);
        parts.push(g);
    };

    const seatW = 0.46;
    const seatD = 0.46;
    const seatH = 0.09;

    bake(new THREE.BoxGeometry(0.1, 0.42, 0.28), 0, 0.21, 0.05);
    bake(new THREE.BoxGeometry(seatW, seatH, seatD), 0, 0.46, 0);
    bake(new THREE.BoxGeometry(seatW, 0.62, 0.1), 0, 0.8, 0.19, 0.12, 0, 0);
    bake(new THREE.BoxGeometry(seatW * 0.9, 0.16, 0.09), 0, 1.14, 0.26, 0.12, 0, 0);
    bake(new THREE.BoxGeometry(0.06, 0.12, 0.4), -seatW / 2 - 0.03, 0.55, 0.02);
    bake(new THREE.BoxGeometry(0.06, 0.12, 0.4), seatW / 2 + 0.03, 0.55, 0.02);
    bake(new THREE.BoxGeometry(0.05, 0.35, 0.05), -seatW / 2 - 0.03, 0.35, -0.14);
    bake(new THREE.BoxGeometry(0.05, 0.35, 0.05), seatW / 2 + 0.03, 0.35, -0.14);

    const merged = mergeGeometries(parts, false);
    merged.computeVertexNormals();
    return merged;
}
