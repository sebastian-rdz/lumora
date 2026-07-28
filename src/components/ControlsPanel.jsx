export default function ControlsPanel({ mode, lightsOn, onToggleLights, onBackToOverview, selectedSeatId }) {
    return (
        <div className="hud">
            <div className="hud__brand">Lumora · Sala estándar</div>

            <div className="hud__group">
                {mode === 'pov' ? (
                    <>
                        <span className="hud__seat">Asiento {selectedSeatId}</span>
                        <button className="btn-ghost" onClick={onBackToOverview}>
                            ← Vista general
                        </button>
                    </>
                ) : (
                    <span className="hud__hint">Arrastra para orbitar la sala</span>
                )}
            </div>

            <div className="hud__group">
                <button className="btn-ghost" onClick={onToggleLights}>
                    {lightsOn ? 'Apagar luces' : 'Encender luces'}
                </button>
            </div>
        </div>
    );
}
