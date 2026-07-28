import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function useScreenCanvas() {
    const canvas = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = 1024;
        c.height = 440;
        return c;
    }, []);
    const ctx = useMemo(() => canvas.getContext('2d'), [canvas]);
    const texture = useMemo(() => {
        const t = new THREE.CanvasTexture(canvas);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }, [canvas]);
    const blobs = useMemo(
        () =>
            Array.from({ length: 6 }).map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 110 + Math.random() * 150,
                vx: (Math.random() - 0.5) * 60,
                vy: (Math.random() - 0.5) * 40,
                hue: Math.random() * 360,
            })),
        [canvas],
    );

    useFrame((_, delta) => {
        const dt = Math.min(delta, 0.05);
        const w = canvas.width;
        const h = canvas.height;
        ctx.fillStyle = '#06060c';
        ctx.fillRect(0, 0, w, h);
        blobs.forEach((b) => {
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            if (b.x < -b.r || b.x > w + b.r) b.vx *= -1;
            if (b.y < -b.r || b.y > h + b.r) b.vy *= -1;
            b.hue = (b.hue + dt * 10) % 360;
            const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            grad.addColorStop(0, `hsla(${b.hue}, 75%, 58%, 0.5)`);
            grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });
        const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.15, w / 2, h / 2, h * 0.95);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
        texture.needsUpdate = true;
    });

    return texture;
}

function AnimatedSurface({ width, height, y, z }) {
    const texture = useScreenCanvas();
    return (
        <mesh position={[0, y, z]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    );
}

function useVideoTexture(url) {
    const [video] = useState(() => {
        const v = document.createElement('video');
        v.loop = true;
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        return v;
    });

    const texture = useMemo(() => {
        const t = new THREE.VideoTexture(video);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }, [video]);

    useEffect(() => {
        video.src = url;
        const tryPlay = () => video.play().catch(() => {});
        tryPlay();
        video.addEventListener('canplay', tryPlay);
        document.addEventListener('visibilitychange', tryPlay);
        return () => {
            video.removeEventListener('canplay', tryPlay);
            document.removeEventListener('visibilitychange', tryPlay);
            video.pause();
        };
    }, [video, texture, url]);

    return texture;
}

function VideoSurface({ url, width, height, y, z }) {
    const texture = useVideoTexture(url);
    const [dims, setDims] = useState({ w: width, h: height });

    useEffect(() => {
        const video = texture.image;
        const applyContain = () => {
            const screenAspect = width / height;
            const videoAspect = video.videoWidth / video.videoHeight;
            if (!videoAspect) return;
            if (videoAspect > screenAspect) {
                setDims({ w: width, h: width / videoAspect });
            } else {
                setDims({ w: height * videoAspect, h: height });
            }
        };
        if (video.readyState >= 1) applyContain();
        else video.addEventListener('loadedmetadata', applyContain, { once: true });
        return () => video.removeEventListener('loadedmetadata', applyContain);
    }, [texture, width, height]);

    return (
        <mesh position={[0, y, z]}>
            <planeGeometry args={[dims.w, dims.h]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    );
}

export default function CinemaScreen({ width, height, bottom, videoUrl }) {
    const lightRef = useRef();
    const centerZ = -0.55;
    const screenY = height / 2 + bottom;
    const screenZ = centerZ + 0.09;

    useFrame(({ clock }) => {
        if (!lightRef.current) return;
        const t = clock.getElapsedTime();
        lightRef.current.intensity = 3.2 + Math.sin(t * 2.3) * 0.6 + Math.sin(t * 7.1) * 0.15;
    });

    return (
        <group>
            <mesh position={[0, screenY, centerZ - 0.15]}>
                <boxGeometry args={[width + 1.6, height + 1.4, 0.3]} />
                <meshStandardMaterial color="#050505" roughness={0.95} />
            </mesh>
            <mesh position={[-width / 2 - 1.05, screenY - 0.3, centerZ - 0.05]}>
                <boxGeometry args={[1.5, height + 1.2, 0.35]} />
                <meshStandardMaterial color="#3b0d14" roughness={0.85} />
            </mesh>
            <mesh position={[width / 2 + 1.05, screenY - 0.3, centerZ - 0.05]}>
                <boxGeometry args={[1.5, height + 1.2, 0.35]} />
                <meshStandardMaterial color="#3b0d14" roughness={0.85} />
            </mesh>
            <mesh position={[0, screenY, centerZ + 0.02]}>
                <boxGeometry args={[width + 0.5, height + 0.5, 0.12]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.1} />
            </mesh>

            {videoUrl ? (
                <VideoSurface key={videoUrl} url={videoUrl} width={width} height={height} y={screenY} z={screenZ} />
            ) : (
                <AnimatedSurface width={width} height={height} y={screenY} z={screenZ} />
            )}

            <pointLight
                ref={lightRef}
                position={[0, screenY, centerZ + 1.2]}
                color="#9fc1ff"
                intensity={3.2}
                distance={26}
                decay={2}
            />
        </group>
    );
}
