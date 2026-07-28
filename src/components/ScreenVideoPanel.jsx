import { screenVideos } from '../utils/screenVideos.js';

export default function ScreenVideoPanel({ open, selectedUrl, onSelect, onClose }) {
    if (!open) return null;

    return (
        <div className="screen-panel">
            <div className="screen-panel__header">
                <h2>Video de pantalla</h2>
                <button className="btn-ghost" onClick={onClose}>
                    Cerrar
                </button>
            </div>

            <div className="screen-panel__grid">
                <button
                    className={`screen-thumb ${!selectedUrl ? 'screen-thumb--selected' : ''}`}
                    onClick={() => onSelect(null)}
                >
                    <span className="screen-thumb__icon">▶</span>
                    <span>Animación</span>
                </button>

                {screenVideos.map((clip) => (
                    <button
                        key={clip.id}
                        className={`screen-thumb ${selectedUrl === clip.url ? 'screen-thumb--selected' : ''}`}
                        onClick={() => onSelect(clip.url)}
                    >
                        <span className="screen-thumb__icon">🎬</span>
                        <span>{clip.name}</span>
                    </button>
                ))}
            </div>

            {screenVideos.length === 0 && (
                <p className="screen-panel__hint">
                    Coloca videos sin audio (mp4, webm) en <code>src/assets/screens/</code> para que aparezcan aquí. Se
                    reproducen en loop y siempre silenciados.
                </p>
            )}
        </div>
    );
}
