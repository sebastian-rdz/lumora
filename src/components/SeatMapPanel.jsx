import { groupSeatsByRow } from '../data/seatLayout.js';

export default function SeatMapPanel({ seats, selectedSeatId, onSelect, onConfirm, collapsed, onToggleCollapse }) {
    const rows = groupSeatsByRow(seats);

    return (
        <div className={`seat-panel ${collapsed ? 'seat-panel--collapsed' : ''}`}>
            <div className="seat-panel__header">
                <h2>Elige tu asiento</h2>
                <button className="btn-ghost" onClick={onToggleCollapse}>
                    {collapsed ? 'Mostrar mapa' : 'Ocultar'}
                </button>
            </div>

            {!collapsed && (
                <>
                    <div className="seat-panel__screen-label">PANTALLA</div>
                    <div className="seat-panel__rows">
                        {rows.map(({ row, seats: rowSeats }) => (
                            <div className="seat-row" key={row}>
                                <span className="seat-row__label">{row}</span>
                                <div className="seat-row__seats">
                                    {rowSeats.map((seat) => (
                                        <button
                                            key={seat.id}
                                            className={`seat-btn ${seat.id === selectedSeatId ? 'seat-btn--selected' : ''}`}
                                            onClick={() => onSelect(seat.id)}
                                            title={seat.id}
                                        >
                                            {seat.number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="seat-panel__footer">
                        <span>
                            {selectedSeatId ? `Asiento seleccionado: ${selectedSeatId}` : 'Selecciona un asiento'}
                        </span>
                        <button className="btn-primary" disabled={!selectedSeatId} onClick={onConfirm}>
                            Ver desde este asiento
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
