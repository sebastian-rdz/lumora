import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { buildCinemaLayout } from './data/seatLayout';
import './App.css';

function Seat({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#7a1620" />
            </mesh>
            <mesh position={[0, 0.55, 0.2]} rotation={[-0.15, 0, 0]}>
                <boxGeometry args={[0.5, 0.6, 0.1]} />
                <meshStandardMaterial color="#7a1620" />
            </mesh>
        </group>
    );
}

export default function App() {
    const layout = useMemo(() => buildCinemaLayout(), []);

    return (
        <div className="app">
            <Canvas camera={{ position: [1.5, 1.5, 2.5], fov: 55 }}>
                <color attach="background" args={['#0d0a0f']} />
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 4, 2]} intensity={1.2} />
                {layout.seats.map((seat) => (
                    <Seat key={seat.id} position={[seat.x, seat.y, seat.z]} />
                ))}
                <OrbitControls target={[0, 1, 10]} />
            </Canvas>
        </div>
    );
}
