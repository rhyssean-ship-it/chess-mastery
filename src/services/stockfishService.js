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
  }

  init() {
    return new Promise((resolve, reject) => {
      if (this.worker) {
        if (this.ready) resolve();
        return;
      }

      try {
        this.worker = new Worker('/stockfish/stockfish.js');
      } catch (err) {
        console.error('Failed to create Stockfish worker:', err);
        reject(err);
        return;
      }

      this.worker.onerror = (err) => {
        console.error('Stockfish worker error:', err);
      };

      let initialized = false;

      this.worker.onmessage = (e) => {
        const msg = typeof e.data === 'string' ? e.data : (e.data?.data || '');
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

      this.send('uci');

      // Timeout fallback — if engine doesn't respond in 5s, resolve anyway
      setTimeout(() => {
        if (!this.ready) {
          console.warn('Stockfish init timeout — proceeding without engine');
          this.ready = true;
          resolve();
        }
      }, 5000);
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

  evaluate(fen) {
    if (!this.ready || !this.worker) return;
    this.send(`position fen ${fen}`);
    this.send('go depth 12 movetime 500');
  }

  stop() {
    this.send('stop');
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
