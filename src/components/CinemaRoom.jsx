import { useMemo } from 'react';
import { createCarpetTexture } from '../utils/carpetTexture.js';

function StadiumFloor({ rowsMeta, roomWidth, frontZ }) {
    const carpetTexture = useMemo(() => {
        const tex = createCarpetTexture();
        tex.repeat.set(roomWidth / 2, 4);
        return tex;
    }, [roomWidth]);

    const steps = useMemo(() => {
        const list = [];
        for (let i = 0; i < rowsMeta.length; i++) {
            const row = rowsMeta[i];
            const prevY = i === 0 ? 0 : rowsMeta[i - 1].y;
            const startZ = i === 0 ? frontZ : (rowsMeta[i - 1].z + row.z) / 2;
            const endZ = i === rowsMeta.length - 1 ? row.z + 1.3 : (row.z + rowsMeta[i + 1].z) / 2;
            list.push({ key: row.letter, y: row.y, prevY, startZ, endZ, depth: endZ - startZ });
        }
        return list;
    }, [rowsMeta, frontZ]);

    return (
        <group>
            {steps.map((step) => (
                <group key={step.key}>
                    <mesh position={[0, step.y - 0.12, (step.startZ + step.endZ) / 2]}>
                        <boxGeometry args={[roomWidth, 0.24, step.depth]} />
                        <meshStandardMaterial map={carpetTexture} roughness={0.95} />
                    </mesh>
                    {step.y > step.prevY + 0.001 && (
                        <mesh position={[0, (step.prevY + step.y) / 2, step.startZ]}>
                            <boxGeometry args={[roomWidth, step.y - step.prevY + 0.02, 0.06]} />
                            <meshStandardMaterial color="#151013" roughness={0.9} />
                        </mesh>
                    )}
                </group>
            ))}
        </group>
    );
}

function AisleLights({ rowsMeta, rowWidth }) {
    const xOffsets = [-rowWidth / 2 - 0.35, rowWidth / 2 + 0.35];
    return (
        <group>
            {rowsMeta.map((row) =>
                xOffsets.map((x, idx) => (
                    <mesh key={`${row.letter}-${idx}`} position={[x, row.y + 0.05, row.z]}>
                        <boxGeometry args={[0.08, 0.03, 0.5]} />
                        <meshStandardMaterial
                            color="#ffd27a"
                            emissive="#ffb347"
                            emissiveIntensity={2.2}
                            toneMapped={false}
                        />
                    </mesh>
                )),
            )}
        </group>
    );
}

function ExitSign({ position, rotationY = 0 }) {
    return (
        <group position={position} rotation={[0, rotationY, 0]}>
            <mesh>
                <boxGeometry args={[0.55, 0.28, 0.06]} />
                <meshStandardMaterial color="#0a3d1c" emissive="#12c95e" emissiveIntensity={1.4} toneMapped={false} />
            </mesh>
        </group>
    );
}

function CeilingLights({ roomWidth, roomDepth, ceilingHeight, frontZ }) {
    const count = 5;
    const positions = useMemo(() => {
        const arr = [];
        for (let i = 0; i < count; i++) {
            const z = frontZ + ((roomDepth - frontZ) / (count + 1)) * (i + 1);
            arr.push(z);
        }
        return arr;
    }, [count, frontZ, roomDepth]);

    return (
        <group>
            {positions.map((z) => (
                <mesh key={z} position={[0, ceilingHeight - 0.08, z]}>
                    <boxGeometry args={[roomWidth * 0.55, 0.06, 0.35]} />
                    <meshStandardMaterial
                        color="#4a4a55"
                        emissive="#6d6d85"
                        emissiveIntensity={0.4}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function CinemaRoom({ layout }) {
    const { rowsMeta, roomWidth, roomDepth, rowWidth, ceilingHeight, frontZ } = layout;
    const wallColor = '#1c1418';

    return (
        <group>
            <StadiumFloor rowsMeta={rowsMeta} roomWidth={roomWidth} frontZ={frontZ} />
            <AisleLights rowsMeta={rowsMeta} rowWidth={rowWidth} />

            <mesh position={[-roomWidth / 2, ceilingHeight / 2, roomDepth / 2]}>
                <boxGeometry args={[0.3, ceilingHeight, roomDepth]} />
                <meshStandardMaterial color={wallColor} emissive="#2a1c22" emissiveIntensity={0.2} roughness={0.85} />
            </mesh>
            <mesh position={[roomWidth / 2, ceilingHeight / 2, roomDepth / 2]}>
                <boxGeometry args={[0.3, ceilingHeight, roomDepth]} />
                <meshStandardMaterial color={wallColor} emissive="#2a1c22" emissiveIntensity={0.2} roughness={0.85} />
            </mesh>
            <mesh position={[0, ceilingHeight / 2, roomDepth]}>
                <boxGeometry args={[roomWidth, ceilingHeight, 0.3]} />
                <meshStandardMaterial color="#181014" roughness={0.9} />
            </mesh>

            <mesh position={[0, ceilingHeight * 0.65, roomDepth - 0.2]}>
                <boxGeometry args={[1.6, 0.7, 0.08]} />
                <meshStandardMaterial color="#050505" roughness={0.4} metalness={0.3} />
            </mesh>

            <mesh position={[0, ceilingHeight, roomDepth / 2]}>
                <boxGeometry args={[roomWidth, 0.2, roomDepth]} />
                <meshStandardMaterial color="#100c0e" roughness={1} />
            </mesh>
            <CeilingLights roomWidth={roomWidth} roomDepth={roomDepth} ceilingHeight={ceilingHeight} frontZ={frontZ} />

            <ExitSign position={[-roomWidth / 2 + 0.4, 2.4, frontZ + 0.6]} rotationY={Math.PI / 2} />
            <ExitSign position={[roomWidth / 2 - 0.4, 2.4, frontZ + 0.6]} rotationY={-Math.PI / 2} />
        </group>
    );
}
