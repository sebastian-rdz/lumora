import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Instances, Instance } from '@react-three/drei';
import { buildCinemaLayout } from './data/seatLayout';
import { buildSeatGeometry } from './utils/seatGeometry';
import { createCarpetTexture } from './utils/carpetTexture';
import { getOverviewPose } from './utils/cameraPose';
import CinemaScreen from './components/CinemaScreen';
import CinemaRoom from './components/CinemaRoom';
import Seats from './components/Seats';
import PovController from './components/PovController';
import './App.css';

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
    const [selectedSeatId, setSelectedSeatId] = useState(null);
    const [mode, setMode] = useState('overview');
    const layout = useMemo(() => buildCinemaLayout(), []);
    const overviewPose = useMemo(() => getOverviewPose(layout), [layout]);
    const selectedSeat = layout.seats.find((seat) => seat.id === selectedSeatId);

    return (
        <div className="app">
            <Canvas camera={{ position: [4, 5, 15], fov: 60 }}>
                <color attach="background" args={['#0d0a0f']} />
                <ambientLight intensity={0.45} />
                <directionalLight position={[3, 4, 2]} intensity={0.45} />
                {/* <Floor width={layout.roomWidth} depth={layout.roomDepth} /> */}
                <CinemaRoom layout={layout} />
                <Seats seats={layout.seats} selectedSeatId={selectedSeatId} onSelect={setSelectedSeatId} />
                <OrbitControls target={[0, 1, 10]} />
                <CinemaScreen
                    width={layout.config.screenWidth}
                    height={layout.config.screenHeight}
                    bottom={layout.config.screenBottom}
                />
                <PovController mode={mode} seat={selectedSeat} layout={layout} />
            </Canvas>
            <button
                style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
                disabled={!selectedSeatId}
                onClick={() => setMode((m) => (m === 'overview' ? 'pov' : 'overview'))}
            >
                {mode === 'overview' ? 'Ver desde el asiento seleccionado' : '← Vista general'}
            </button>
        </div>
    );
}
