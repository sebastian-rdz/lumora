function FullscreenIcon({ active }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {active ? (
                <path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M21 16h-3a2 2 0 0 0-2 2v3M8 21v-3a2 2 0 0 0-2-2H3" />
            ) : (
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
            )}
        </svg>
    );
}

export default function ControlsPanel({
    mode,
    lightsOn,
    onToggleLights,
    onBackToOverview,
    selectedSeatId,
    onToggleScreenPanel,
    isFullscreen,
    onToggleFullscreen,
}) {
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
                <button className="btn-ghost" onClick={onToggleScreenPanel}>
                    Video de pantalla
                </button>
                <button className="btn-ghost" onClick={onToggleLights}>
                    {lightsOn ? 'Apagar luces' : 'Encender luces'}
                </button>
                <button
                    className="btn-icon fullscreen-btn"
                    onClick={onToggleFullscreen}
                    title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                >
                    <FullscreenIcon active={isFullscreen} />
                </button>
            </div>
        </div>
    );
}
