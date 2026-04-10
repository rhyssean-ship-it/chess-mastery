import { useEffect, useRef } from 'react';

export default function Modal({ title, children, onClose, onConfirm, confirmText = 'Confirm', danger = false }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    confirmRef.current?.focus();
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div
        className="bg-bg-card border border-bg-hover rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalIn 200ms ease-out' }}
      >
        <h3 id="modal-title" className="text-xl mb-3">{title}</h3>
        <div className="text-text-dim text-base leading-relaxed mb-6">{children}</div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-bg-hover text-text-dim hover:text-text transition-all btn-press"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              ref={confirmRef}
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg font-semibold transition-all btn-press ${
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
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
