import { useEffect } from 'react';

export default function Modal({ title, children, onClose, onConfirm, confirmText = 'Confirm', danger = false }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-bg-card border border-bg-hover rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-display mb-3">{title}</h3>
        <div className="text-text-dim mb-6">{children}</div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-bg-hover text-text-dim hover:text-text transition-colors"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                danger
                  ? 'bg-incorrect text-white hover:bg-red-400'
                  : 'bg-gold text-bg hover:bg-gold-dim'
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
