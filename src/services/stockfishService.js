import { Chess } from 'chess.js';

const ELO_PRESETS = [
  { label: 'Beginner', elo: 400, depth: 1, skill: 0, moveTime: 50 },
  { label: 'Novice', elo: 600, depth: 2, skill: 1, moveTime: 50 },
  { label: 'Casual', elo: 800, depth: 2, skill: 3, moveTime: 100 },
  { label: 'Intermediate', elo: 1000, depth: 3, skill: 5, moveTime: 200 },
  { label: 'Club Player', elo: 1200, depth: 5, skill: 8, moveTime: 300 },
  { label: 'Tournament', elo: 1400, depth: 6, skill: 10, moveTime: 400 },
  { label: 'Strong Club', elo: 1600, depth: 8, skill: 13, moveTime: 500 },
  { label: 'Expert', elo: 1800, depth: 10, skill: 15, moveTime: 700 },
  { label: 'Candidate Master', elo: 2000, depth: 12, skill: 17, moveTime: 1000 },
  { label: 'Master', elo: 2200, depth: 14, skill: 18, moveTime: 1500 },
  { label: 'International Master', elo: 2400, depth: 16, skill: 19, moveTime: 2000 },
  { label: 'Grandmaster', elo: 2600, depth: 20, skill: 20, moveTime: 3000 },
];

class StockfishService {
  constructor() {
    this.worker = null;
    this.ready = false;
    this.onMove = null;
    this.onEval = null;
    this.currentPreset = ELO_PRESETS[4];
    this.personality = 'balanced';
  }

  init() {
    return new Promise((resolve) => {
      if (this.worker) {
        if (this.ready) resolve();
        return;
      }

      // Create a wrapper worker via Blob URL that loads stockfish.js via importScripts
      const sfUrl = new URL('/stockfish/stockfish.js', window.location.origin).href;
      const workerCode = `importScripts('${sfUrl}');`;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);

      try {
        this.worker = new Worker(url);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Failed to create Stockfish worker:', err);
        URL.revokeObjectURL(url);
        resolve(); // resolve anyway so the UI doesn't hang
        return;
      }

      this.worker.onerror = (err) => {
        console.error('Stockfish worker error:', err);
      };

      let initialized = false;

      this.worker.onmessage = (e) => {
        const msg = typeof e.data === 'string' ? e.data : '';
        if (!msg) return;

        if (msg.includes('uciok') && !initialized) {
          initialized = true;
          this.send('isready');
        }

        if (msg.includes('readyok') && !this.ready) {
          this.ready = true;
          this.applySettings();
          resolve();
        }

        if (msg.startsWith('bestmove')) {
          const move = msg.split(' ')[1];
          if (move && move !== '(none)' && this.onMove) {
            this.onMove(move);
          }
        }

        if (msg.includes('score cp') && this.onEval) {
          const cpMatch = msg.match(/score cp (-?\d+)/);
          if (cpMatch) {
            this.onEval(parseInt(cpMatch[1]) / 100);
          }
        }
        if (msg.includes('score mate') && this.onEval) {
          const mateMatch = msg.match(/score mate (-?\d+)/);
          if (mateMatch) {
            this.onEval(parseInt(mateMatch[1]) > 0 ? 100 : -100);
          }
        }
      };

      // Send UCI init - the engine queues this until postRun
      this.send('uci');

      // Timeout fallback
      setTimeout(() => {
        if (!this.ready) {
          console.warn('Stockfish init timeout');
          this.ready = true;
          resolve();
        }
      }, 15000);
    });
  }

  send(cmd) {
    if (this.worker) {
      this.worker.postMessage(cmd);
    }
  }

  setLevel(presetIndex) {
    this.currentPreset = ELO_PRESETS[presetIndex] || ELO_PRESETS[4];
    if (this.ready) {
      this.applySettings();
    }
  }

  applySettings() {
    this.send(`setoption name Skill Level value ${this.currentPreset.skill}`);
  }

  getBestMove(fen) {
    if (!this.ready || !this.worker) return;
    this.send('stop');
    this.send(`position fen ${fen}`);
    this.send(`go depth ${this.currentPreset.depth} movetime ${this.currentPreset.moveTime}`);
  }

  getQuickHint(fen) {
    if (!this.ready || !this.worker) return;
    this.send('stop');
    this.send(`position fen ${fen}`);
    this.send('go depth 14 movetime 1200'); // deep enough to be reliable; hints are teaching
  }

  // Bot "personality". Strength is still governed by the ELO preset (depth/movetime/skill);
  // personality only biases the choice *among near-best candidate moves*.
  setPersonality(style) {
    this.personality = style || 'balanced';
    // Contempt nudges draw-avoidance/sharpness. Harmless setoption if the build ignores it.
    const contempt = style === 'aggressive' ? 60 : style === 'defensive' ? -30 : 0;
    this.send(`setoption name Contempt value ${contempt}`);
  }

  // Ask for a move shaped by the current personality. For 'balanced' this is just getBestMove.
  // Otherwise we read the top few candidate lines and pick the one that best fits the style,
  // staying within a small centipawn window of the engine's best so strength is barely affected.
  getStyledMove(fen) {
    if (!this.ready || !this.worker) return;
    const style = this.personality || 'balanced';
    if (style === 'balanced') { this.getBestMove(fen); return; }

    const preset = this.currentPreset;
    const linesByPv = {};
    const prevOnMessage = this.worker.onmessage;

    this.worker.onmessage = (e) => {
      const msg = typeof e.data === 'string' ? e.data : '';
      if (!msg) return;
      if (msg.startsWith('info ') && msg.includes(' pv ')) {
        const pvIdxMatch = msg.match(/ multipv (\d+)/);
        const idx = pvIdxMatch ? parseInt(pvIdxMatch[1]) : 1;
        const cpMatch = msg.match(/ score cp (-?\d+)/);
        const mateMatch = msg.match(/ score mate (-?\d+)/);
        const lineMatch = msg.match(/ pv (.+)$/);
        if (lineMatch) {
          linesByPv[idx] = {
            scoreCp: cpMatch ? parseInt(cpMatch[1]) : null,
            mate: mateMatch ? parseInt(mateMatch[1]) : null,
            pv: lineMatch[1].trim().split(/\s+/),
          };
        }
      }
      if (msg.startsWith('bestmove')) {
        this.worker.onmessage = prevOnMessage;
        this.send('setoption name MultiPV value 1');
        const lines = Object.entries(linesByPv)
          .map(([k, v]) => ({ multipv: parseInt(k), ...v }))
          .sort((a, b) => a.multipv - b.multipv);
        const fallback = msg.split(' ')[1];
        const chosen = this._pickStyledMove(lines, style, fen)
          || (fallback && fallback !== '(none)' ? fallback : null);
        const top = lines[0];
        if (top && this.onEval) {
          if (top.mate != null) this.onEval(top.mate > 0 ? 100 : -100);
          else if (top.scoreCp != null) this.onEval(top.scoreCp / 100);
        }
        if (chosen && this.onMove) this.onMove(chosen);
      }
    };

    this.send('stop');
    this.send('setoption name MultiPV value 4');
    this.send(`position fen ${fen}`);
    this.send(`go depth ${preset.depth} movetime ${preset.moveTime}`);
  }

  _pickStyledMove(lines, style, fen) {
    if (!lines.length) return null;
    const PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    const cands = [];
    for (const ln of lines) {
      const uci = ln.pv?.[0];
      if (!uci) continue;
      let v = null;
      try {
        const g = new Chess(fen);
        v = g.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || undefined });
      } catch { /* skip illegal */ }
      if (!v) continue;
      const score = ln.mate != null
        ? (ln.mate > 0 ? 100000 - ln.mate : -100000 - ln.mate)
        : (ln.scoreCp ?? 0);
      cands.push({ uci, v, score });
    }
    if (!cands.length) return null;

    const best = cands[0].score;
    const WINDOW = 70; // cp — only re-rank among moves this close to best
    const pool = cands.filter(c => best - c.score <= WINDOW);
    const isCheck = v => v.san.includes('+') || v.san.includes('#');
    const isCapture = v => !!v.captured;
    const capVal = v => (v.captured ? PIECE_VALUE[v.captured] : 0);
    const isCastle = v => v.san === 'O-O' || v.san === 'O-O-O';
    const isMinorDev = v => v.piece === 'n' || v.piece === 'b';

    let scored;
    if (style === 'aggressive') {
      scored = pool.map(c => ({ c, k: (isCheck(c.v) ? 100 : 0) + (isCapture(c.v) ? 40 + capVal(c.v) * 3 : 0) + c.score * 0.01 }));
    } else if (style === 'materialist') {
      scored = pool.map(c => ({ c, k: capVal(c.v) * 100 + (isCapture(c.v) ? 20 : 0) + c.score * 0.01 }));
    } else if (style === 'defensive') {
      scored = pool.map(c => ({ c, k: (isCapture(c.v) ? -20 : 20) + (isCheck(c.v) ? -10 : 0) + (isCastle(c.v) ? 40 : 0) + c.score * 0.02 }));
    } else if (style === 'positional') {
      scored = pool.map(c => ({ c, k: (isCastle(c.v) ? 60 : 0) + (isMinorDev(c.v) ? 30 : 0) + (isCapture(c.v) ? -10 : 15) + c.score * 0.02 }));
    } else {
      return cands[0].uci;
    }
    scored.sort((a, b) => b.k - a.k);
    return scored[0].c.uci;
  }

  stop() {
    this.send('stop');
  }

  // Full-strength analysis with MultiPV. Returns a Promise that resolves with
  // { bestMove, scoreCp, mate, pv, lines } once the engine finishes the depth-N search.
  // lines is an array sorted by multipv index: [{ multipv, scoreCp, mate, pv, depth }].
  // Serialises against itself — caller should await sequentially.
  analyzePosition(fen, { depth = 14, multiPv = 1, movetime = null } = {}) {
    return new Promise((resolve) => {
      if (!this.ready || !this.worker) { resolve(null); return; }

      // Checkmate/stalemate: this Stockfish build never sends "bestmove" for a position with no
      // legal moves, so answer directly (mate 0 = side to move is mated).
      try {
        const g = new Chess(fen);
        if (g.isGameOver()) {
          const mate = g.isCheckmate() ? 0 : null;
          resolve({ bestMove: null, scoreCp: mate === null ? 0 : null, mate, pv: [], lines: [] });
          return;
        }
      } catch { /* let the engine try */ }

      const linesByPv = {};
      const prevOnMessage = this.worker.onmessage;

      this.worker.onmessage = (e) => {
        const msg = typeof e.data === 'string' ? e.data : '';
        if (!msg) return;

        if (msg.startsWith('info ') && msg.includes(' pv ')) {
          const pvIdxMatch = msg.match(/ multipv (\d+)/);
          const pvIdx = pvIdxMatch ? parseInt(pvIdxMatch[1]) : 1;
          const depthMatch = msg.match(/ depth (\d+)/);
          const cpMatch = msg.match(/ score cp (-?\d+)/);
          const mateMatch = msg.match(/ score mate (-?\d+)/);
          const lineMatch = msg.match(/ pv (.+)$/);
          if (lineMatch) {
            linesByPv[pvIdx] = {
              depth: depthMatch ? parseInt(depthMatch[1]) : 0,
              scoreCp: cpMatch ? parseInt(cpMatch[1]) : null,
              mate: mateMatch ? parseInt(mateMatch[1]) : null,
              pv: lineMatch[1].trim().split(/\s+/),
            };
          }
        }

        if (msg.startsWith('bestmove')) {
          clearTimeout(watchdog);
          const move = msg.split(' ')[1];
          const bestMove = (move && move !== '(none)') ? move : null;
          const primary = linesByPv[1] || {};
          const result = {
            bestMove,
            scoreCp: primary.scoreCp ?? null,
            mate: primary.mate ?? null,
            pv: primary.pv || [],
            lines: Object.entries(linesByPv)
              .map(([k, v]) => ({ multipv: parseInt(k), ...v }))
              .sort((a, b) => a.multipv - b.multipv),
          };
          this.worker.onmessage = prevOnMessage;
          resolve(result);
        }
      };

      // Safety net: if no answer arrives, stop the search so "bestmove" is forced out.
      const watchdog = setTimeout(() => this.send('stop'), movetime ? movetime + 5000 : 30000);

      // Full strength, configurable MultiPV
      this.send(`setoption name Skill Level value 20`);
      this.send(`setoption name MultiPV value ${multiPv}`);
      this.send(`position fen ${fen}`);
      if (movetime) this.send(`go depth ${depth} movetime ${movetime}`);
      else this.send(`go depth ${depth}`);
    });
  }

  destroy() {
    if (this.worker) {
      this.send('stop');
      this.send('quit');
      this.worker.terminate();
      this.worker = null;
      this.ready = false;
    }
  }
}

export { ELO_PRESETS };
export default StockfishService;
