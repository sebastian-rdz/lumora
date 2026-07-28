import CinemaRoom from './CinemaRoom.jsx';
import CinemaScreen from './CinemaScreen.jsx';
import Seats from './Seats.jsx';
import PovController from './PovController.jsx';
import screenVideoUrl from '../assets/screens/screen.mp4';
import ResponsiveFov from './ResponsiveFov.jsx';

export default function Experience({ layout, mode, selectedSeatId, selectedSeat, onSelectSeat, lightsOn }) {
    const { config } = layout;
    const bg = lightsOn ? '#2a2028' : '#020203';

    return (
        <>
            <color attach="background" args={[bg]} />
            <fog
                attach="fog"
                args={[bg, layout.roomDepth * (lightsOn ? 1.05 : 0.85), layout.roomDepth * (lightsOn ? 2.6 : 1.5)]}
            />

            <ambientLight intensity={lightsOn ? 1.15 : 0.05} />
            <hemisphereLight args={['#8a86a0', '#241c28', lightsOn ? 1.0 : 0.06]} />

            <CinemaRoom layout={layout} lightsOn={lightsOn} />
            <CinemaScreen
                width={config.screenWidth}
                height={config.screenHeight}
                bottom={config.screenBottom}
                videoUrl={screenVideoUrl}
            />
            <Seats seats={layout.seats} selectedSeatId={selectedSeatId} onSelect={onSelectSeat} />

            <PovController mode={mode} seat={selectedSeat} layout={layout} />
            <ResponsiveFov />
        </>
    );
}
