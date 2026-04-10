import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';

export default function Settings() {
  const [theme, setTheme] = useTheme();
  const [settings, setSettings] = useLocalStorage('settings', {
    soundEnabled: false,
    showCoordinates: true,
    autoPromoteQueen: true,
    moveAnimation: true,
  });

  function update(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Settings</h1>
      <p className="text-text-dim text-base mb-10">Customise your learning experience.</p>

      {/* Appearance */}
      <section className="mb-10">
        <h2 className="text-xl font-display mb-4">Appearance</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTheme('dark')}
            className={`card-base p-5 text-center btn-press transition-all ${theme === 'dark' ? '!border-gold/50 bg-gold/5' : 'hover:border-gold/20'}`}
          >
            <div className="w-full aspect-[3/2] rounded-lg overflow-hidden mb-3 mx-auto max-w-[120px] bg-[#0f1117] border border-[#252a35] flex items-center justify-center">
              <div className="w-8 h-1 rounded bg-[#C9A84C]" />
            </div>
            <span className="text-base font-medium">Dark</span>
            {theme === 'dark' && <div className="text-gold text-xs mt-1">✓ Active</div>}
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`card-base p-5 text-center btn-press transition-all ${theme === 'light' ? '!border-gold/50 bg-gold/5' : 'hover:border-gold/20'}`}
          >
            <div className="w-full aspect-[3/2] rounded-lg overflow-hidden mb-3 mx-auto max-w-[120px] bg-[#f5f3f0] border border-[#eae7e2] flex items-center justify-center">
              <div className="w-8 h-1 rounded bg-[#9e7e2a]" />
            </div>
            <span className="text-base font-medium">Light</span>
            {theme === 'light' && <div className="text-gold text-xs mt-1">✓ Active</div>}
          </button>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Preferences */}
      <section className="mb-10">
        <h2 className="text-xl font-display mb-4">Preferences</h2>
        <div className="space-y-4">
          {[
            { key: 'showCoordinates', label: 'Show board coordinates', desc: 'Display a-h and 1-8 along the edges of the board.' },
            { key: 'moveAnimation', label: 'Animate piece movement', desc: 'Smooth animation when pieces move on the board.' },
            { key: 'autoPromoteQueen', label: 'Auto-promote to queen', desc: 'Automatically promote pawns to queen instead of asking.' },
            { key: 'soundEnabled', label: 'Sound effects', desc: 'Play sounds for moves, captures, and notifications. (Coming soon)' },
          ].map(pref => (
            <div key={pref.key} className="card-base p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-base">{pref.label}</p>
                <p className="text-sm text-text-dim mt-0.5">{pref.desc}</p>
              </div>
              <button
                onClick={() => update(pref.key, !settings[pref.key])}
                className={`w-12 h-7 rounded-full transition-all duration-200 relative shrink-0 ${settings[pref.key] ? 'bg-gold' : 'bg-bg-hover'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all duration-200 ${settings[pref.key] ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* Data */}
      <section className="mb-10">
        <h2 className="text-xl font-display mb-4">Data & Progress</h2>
        <div className="card-base p-5">
          <p className="text-base mb-1">All progress is stored locally in your browser.</p>
          <p className="text-sm text-text-dim mb-4">Clearing your browser data will reset all progress.</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const data = {};
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key.startsWith('chess-mastery:')) data[key] = localStorage.getItem(key);
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'enpassant-backup.json'; a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-gold text-bg px-5 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press"
            >
              Export Progress
            </button>
            <label className="bg-bg-hover text-text px-5 py-2.5 rounded-lg font-semibold hover:bg-bg-elevated transition-all btn-press cursor-pointer">
              Import Progress
              <input type="file" accept=".json" className="hidden" onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    const data = JSON.parse(ev.target.result);
                    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
                    window.location.reload();
                  } catch { alert('Invalid backup file.'); }
                };
                reader.readAsText(file);
              }} />
            </label>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* About */}
      <section>
        <h2 className="text-xl font-display mb-4">About</h2>
        <div className="card-base p-5">
          <p className="font-display text-gold text-lg font-bold mb-1">enPassant</p>
          <p className="text-sm text-text-dim">A comprehensive chess learning platform with interactive features covering openings, tactics, strategy, middlegame, endgames, and more.</p>
          <p className="text-xs text-text-dim mt-3">All content runs locally. No account required. No data leaves your browser.</p>
        </div>
      </section>
    </div>
  );
}
