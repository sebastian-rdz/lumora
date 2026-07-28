import CinemaRoom from './CinemaRoom.jsx';
import CinemaScreen from './CinemaScreen.jsx';
import Seats from './Seats.jsx';
import PovController from './PovController.jsx';

export default function Experience({ layout, mode, selectedSeatId, selectedSeat, onSelectSeat }) {
    const { config } = layout;

    return (
        <>
            <color attach="background" args={['#020203']} />
            <fog attach="fog" args={['#020203', 16, layout.roomDepth * 1.5]} />

            <ambientLight intensity={0.45} />
            <hemisphereLight args={['#4a4560', '#0c0810', 0.4]} />

            <CinemaRoom layout={layout} />
            <CinemaScreen width={config.screenWidth} height={config.screenHeight} bottom={config.screenBottom} />
            <Seats seats={layout.seats} selectedSeatId={selectedSeatId} onSelect={onSelectSeat} />

            <PovController mode={mode} seat={selectedSeat} layout={layout} />
        </>
    );
}
