import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { getOverviewPose } from '../utils/cameraPose.js';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Controles de "girar la cabeza" mientras se está sentado: arrastrar con el
// mouse (o el dedo) rota la cámara en su sitio, sin moverla de la butaca.
function LookAroundControls({ active }) {
    const { camera, gl } = useThree();
    const dragging = useRef(false);
    const last = useRef({ x: 0, y: 0 });
    const yawPitch = useRef({ yaw: 0, pitch: 0 });

    useEffect(() => {
        yawPitch.current = { yaw: 0, pitch: 0 };
    }, [active]);

    useEffect(() => {
        if (!active) return;
        const el = gl.domElement;
        const onPointerDown = (e) => {
            dragging.current = true;
            last.current = { x: e.clientX, y: e.clientY };
        };
        const onPointerUp = () => {
            dragging.current = false;
        };
        const onPointerMove = (e) => {
            if (!dragging.current) return;
            const dx = e.clientX - last.current.x;
            const dy = e.clientY - last.current.y;
            last.current = { x: e.clientX, y: e.clientY };
            yawPitch.current.yaw = clamp(yawPitch.current.yaw - dx * 0.0035, -2.0, 2.0);
            yawPitch.current.pitch = clamp(yawPitch.current.pitch - dy * 0.0035, -0.75, 0.85);
        };
        el.style.cursor = 'grab';
        el.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointermove', onPointerMove);
        return () => {
            el.style.cursor = 'auto';
            el.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointermove', onPointerMove);
        };
    }, [active, gl]);

    useFrame(() => {
        if (!active) return;
        camera.rotation.order = 'YXZ';
        camera.rotation.y = yawPitch.current.yaw;
        camera.rotation.x = yawPitch.current.pitch;
        camera.rotation.z = 0;
    });

    return null;
}

export default function PovController({ mode, seat, layout }) {
    const { camera } = useThree();
    const povTarget = useRef(new THREE.Vector3());

    useEffect(() => {
        if (mode === 'pov' && seat) {
            povTarget.current.set(seat.x, seat.y + seat.eyeHeight, seat.z + 0.12);
        }
    }, [mode, seat]);

    useEffect(() => {
        if (mode === 'overview') {
            const { position, target } = getOverviewPose(layout);
            camera.position.set(...position);
            camera.rotation.set(0, 0, 0);
            camera.lookAt(...target);
        }
    }, [mode, camera, layout]);

    useFrame(() => {
        if (mode === 'pov' && seat) {
            camera.position.lerp(povTarget.current, 0.14);
        }
    });

    if (mode === 'overview') {
        const { target } = getOverviewPose(layout);
        return (
            <OrbitControls
                makeDefault
                target={target}
                enablePan={false}
                minDistance={4}
                maxDistance={layout.roomDepth * 0.95}
                maxPolarAngle={Math.PI * 0.49}
                dampingFactor={0.08}
            />
        );
    }

    return <LookAroundControls active={mode === 'pov'} />;
}
