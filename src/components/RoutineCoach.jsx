import { useMemo, useState } from 'react';
import { lastMoveShift, opponentThreats, forcingMoves, isSharp, STEP_META } from '../services/spyScanSafe';

// Live Spy, Scan, Safe prompts for Practice Play. Findings stay hidden until the player taps a
// step, so the habit is "think first, then check". In `sharp` mode the panel only asks for the
// full routine when the position calls for it.
export default function RoutineCoach({ fen, prevFen, active, mode, onMarks, onPass, passText, compact = false }) {
  // Open step is remembered per position, so it resets itself when the position changes.
  const [openState, setOpenState] = useState({ fen: null, step: null });
  const open = openState.fen === fen ? openState.step : null;

  const data = useMemo(() => {
    if (!active) return null;
    const me = fen.split(' ')[1];
    const shift = prevFen ? lastMoveShift(prevFen, fen) : { notes: [], squares: [] };
    const threats = opponentThreats(fen, me);
    const mine = forcingMoves(fen, me);
    return { shift, threats, mine, sharp: isSharp(fen, shift.move) };
  }, [fen, prevFen, active]);

  if (!active || !data) return null;

  function show(step) {
    const next = open === step ? null : step;
    setOpenState({ fen, step: next });
    // Marks carry their fen so the board drops them once the position moves on.
    if (next === 'spy') {
      onMarks?.({
        fen,
        arrows: data.threats.slice(0, 3).map(t => [t.from, t.to, 'red']),
        highlights: data.shift.squares.map(s => ({ square: s, brush: 'yellow' })),
      });
    } else if (next === 'scan') {
      const good = [...data.mine.checks, ...data.mine.captures.filter(c => c.verdict !== 'loses'), ...data.mine.threats].slice(0, 5);
      onMarks?.({ fen, arrows: good.map(m => [m.from, m.to, 'green']), highlights: [] });
    } else {
      onMarks?.({ fen, arrows: [], highlights: [] });
    }
  }

  const quiet = mode === 'sharp' && !data.sharp;
  const text = compact ? 'text-[12px]' : 'text-sm';

  return (
    <div className={`card-base ${compact ? 'p-2.5' : 'p-3'}`}>
      <div className="flex items-center gap-1.5">
        {quiet ? (
          <span className={`${text} text-text-dim flex-1`}>Quiet position: play a useful move, then run Safe.</span>
        ) : (
          <>
            <span className={`${text} text-text-dim mr-1`}>Run the routine:</span>
            {['spy', 'scan', 'safe'].map(step => (
              <button key={step} onClick={() => show(step)}
                className={`px-2.5 py-1 rounded-md ${text} font-semibold transition-all ${open === step ? `${STEP_META[step].bg} ${STEP_META[step].color}` : 'bg-bg-hover/40 text-text-dim hover:text-text'}`}>
                {STEP_META[step].label}
              </button>
            ))}
          </>
        )}
      </div>

      {open === 'spy' && (
        <div className={`${text} mt-2 space-y-1 leading-snug`}>
          {data.shift.notes.map((n, i) => <p key={i}>{n.text}</p>)}
          {data.threats.length > 0
            ? <p><span className="text-amber font-semibold">Their threats:</span> {data.threats.slice(0, 3).map(t => t.text).join('; ')}. Deal with these first.</p>
            : <p className="text-text-dim">No real threat from them right now.</p>}
          <button onClick={onPass} className="text-gold text-[12px] hover:underline">What would they play if it were their move?</button>
          {passText && <p className="text-text-dim">{passText}</p>}
        </div>
      )}
      {open === 'scan' && (
        <div className={`${text} mt-2 space-y-1 leading-snug`}>
          <ScanLine label="Checks" items={data.mine.checks} />
          <ScanLine label="Captures" items={data.mine.captures} />
          <ScanLine label="Threats" items={data.mine.threats.slice(0, 4)} />
        </div>
      )}
      {open === 'safe' && (
        <div className={`${text} mt-2 leading-snug text-text-dim`}>
          Before you let go: is it defended where it lands? Does it leave anything hanging? Does it allow a check or capture? The coach will stop you if a move hangs material.
        </div>
      )}
    </div>
  );
}

function ScanLine({ label, items }) {
  return (
    <p>
      <span className="font-semibold">{label}:</span>{' '}
      {items.length === 0
        ? <span className="text-text-dim">none</span>
        : items.map((m, i) => (
          <span key={m.san}>{i > 0 && ', '}<span className="font-mono">{m.san}</span> <span className="text-text-dim">({m.note}{m.then ? `; then ${m.then.san}` : ''})</span></span>
        ))}
    </p>
  );
}
