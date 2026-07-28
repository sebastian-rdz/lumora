import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience.jsx';
import SeatMapPanel from './components/SeatMapPanel.jsx';
import ControlsPanel from './components/ControlsPanel.jsx';
import ScreenVideoPanel from './components/ScreenVideoPanel.jsx';
import { buildCinemaLayout } from './data/seatLayout.js';
import { getOverviewPose } from './utils/cameraPose.js';
import { useFullscreen } from './hooks/useFullscreen.js';
import './App.css';

function pickDefaultSeat(layout) {
    const midRow = Math.floor(layout.rowsMeta.length / 2);
    const candidates = layout.seats.filter((s) => s.rowIndex === midRow);
    return candidates.reduce((best, s) => (Math.abs(s.x) < Math.abs(best.x) ? s : best), candidates[0]);
}

export default function App() {
    const layout = useMemo(() => buildCinemaLayout(), []);
    const defaultSeat = useMemo(() => pickDefaultSeat(layout), [layout]);
    const overviewPose = useMemo(() => getOverviewPose(layout), [layout]);

    const [selectedSeatId, setSelectedSeatId] = useState(defaultSeat.id);
    const [mode, setMode] = useState('overview');
    const [panelCollapsed, setPanelCollapsed] = useState(false);
    const [lightsOn, setLightsOn] = useState(true);
    const [screenVideoUrl, setScreenVideoUrl] = useState(null);
    const [screenPanelOpen, setScreenPanelOpen] = useState(false);

    const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

    const selectedSeat = layout.seats.find((s) => s.id === selectedSeatId) ?? null;

    const handleConfirm = () => {
        if (!selectedSeatId) return;
        setMode('pov');
        setLightsOn(false);
        setPanelCollapsed(true);
    };

    const handleBackToOverview = () => {
        setMode('overview');
        setLightsOn(true);
        setPanelCollapsed(false);
    };

    return (
        <div className="app">
            <Canvas
                camera={{
                    fov: 60,
                    near: 0.1,
                    far: 200,
                    position: overviewPose.position,
                }}
            >
                <Experience
                    layout={layout}
                    mode={mode}
                    selectedSeatId={selectedSeatId}
                    selectedSeat={selectedSeat}
                    onSelectSeat={setSelectedSeatId}
                    lightsOn={lightsOn}
                    screenVideoUrl={screenVideoUrl}
                />
            </Canvas>

            <ControlsPanel
                mode={mode}
                lightsOn={lightsOn}
                onToggleLights={() => setLightsOn((v) => !v)}
                onBackToOverview={handleBackToOverview}
                selectedSeatId={selectedSeatId}
                onToggleScreenPanel={() => setScreenPanelOpen((v) => !v)}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
            />

            <ScreenVideoPanel
                open={screenPanelOpen}
                selectedUrl={screenVideoUrl}
                onSelect={(url) => {
                    setScreenVideoUrl(url);
                    setScreenPanelOpen(false);
                }}
                onClose={() => setScreenPanelOpen(false)}
            />

            <SeatMapPanel
                seats={layout.seats}
                selectedSeatId={selectedSeatId}
                onSelect={setSelectedSeatId}
                onConfirm={handleConfirm}
                collapsed={panelCollapsed}
                onToggleCollapse={() => setPanelCollapsed((v) => !v)}
            />

            {mode === 'pov' && (
                <div className="drag-hint">Arrastra para mirar alrededor, como si giraras la cabeza</div>
            )}
        </div>
    );
}
