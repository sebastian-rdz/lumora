import { useMemo, useState } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { buildSeatGeometry } from '../utils/seatGeometry.js';

const COLOR_DEFAULT = '#7a1620';
const COLOR_HOVER = '#d8593f';
const COLOR_SELECTED = '#f4b942';

export default function Seats({ seats, selectedSeatId, onSelect }) {
    const geometry = useMemo(() => buildSeatGeometry(), []);
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <Instances geometry={geometry} limit={seats.length}>
            <meshStandardMaterial roughness={0.65} metalness={0.05} />
            {seats.map((seat) => {
                const isSelected = seat.id === selectedSeatId;
                const isHovered = seat.id === hoveredId;
                const color = isSelected ? COLOR_SELECTED : isHovered ? COLOR_HOVER : COLOR_DEFAULT;
                return (
                    <Instance
                        key={seat.id}
                        position={[seat.x, seat.y, seat.z]}
                        color={color}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            setHoveredId(seat.id);
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            setHoveredId((h) => (h === seat.id ? null : h));
                            document.body.style.cursor = 'auto';
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(seat.id);
                        }}
                    />
                );
            })}
        </Instances>
    );
}
