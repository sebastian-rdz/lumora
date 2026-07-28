import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function ResponsiveFov({ baseFov = 60, targetHorizontalFov = 68, maxFov = 88 }) {
    const { camera, size } = useThree();

    useEffect(() => {
        const aspect = size.width / size.height;
        const hRad = THREE.MathUtils.degToRad(targetHorizontalFov);
        const vFovFromH = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hRad / 2) / aspect));
        camera.fov = Math.min(maxFov, Math.max(baseFov, vFovFromH));
        camera.updateProjectionMatrix();
    }, [size, camera, baseFov, targetHorizontalFov, maxFov]);

    return null;
}
