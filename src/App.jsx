import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Instances, Instance } from '@react-three/drei';
import { buildCinemaLayout } from './data/seatLayout';
import { buildSeatGeometry } from './utils/seatGeometry';
import { createCarpetTexture } from './utils/carpetTexture';
import CinemaScreen from './components/CinemaScreen';
import CinemaRoom from './components/CinemaRoom';
import './App.css';

function Seat({ seats }) {
    const geometry = useMemo(() => buildSeatGeometry(), []);
    return (
        <Instances geometry={geometry} limit={seats.length}>
            <meshStandardMaterial color="#7a1620" roughness={0.65} />
            {seats.map((seat) => (
                <Instance key={seat.id} position={[seat.x, seat.y, seat.z]} />
            ))}
        </Instances>
    );
}

function Floor({ width, depth }) {
    const texture = useMemo(() => {
        const tex = createCarpetTexture();
        tex.repeat.set(width / 2, depth / 2);
        return tex;
    }, [width, depth]);

    return (
        <mesh rotation={[0, -0.02, depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width, depth]} />
            <meshStandardMaterial map={texture} roughness={0.95} />
        </mesh>
    );
}

export default function App() {
    const layout = useMemo(() => buildCinemaLayout(), []);

    return (
        <div className="app">
            <Canvas camera={{ position: [4, 5, 15], fov: 55 }}>
                <color attach="background" args={['#0d0a0f']} />
                <ambientLight intensity={0.45} />
                <directionalLight position={[3, 4, 2]} intensity={0.45} />
                {/* <Floor width={layout.roomWidth} depth={layout.roomDepth} /> */}
                <CinemaRoom layout={layout} />
                <Seat seats={layout.seats} />
                <OrbitControls target={[0, 1, 10]} />
                <CinemaScreen
                    width={layout.config.screenWidth}
                    height={layout.config.screenHeight}
                    bottom={layout.config.screenBottom}
                />
            </Canvas>
        </div>
    );
}
