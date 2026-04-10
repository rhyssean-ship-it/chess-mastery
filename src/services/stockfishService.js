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
    this.currentPreset = ELO_PRESETS[4]; // default 1200
  }

  init() {
    return new Promise((resolve) => {
      if (this.worker) {
        resolve();
        return;
      }

      this.worker = new Worker('/stockfish/stockfish.js');

      this.worker.onmessage = (e) => {
        const msg = typeof e.data === 'string' ? e.data : '';

        if (msg === 'uciok') {
          this.send('isready');
        }

        if (msg === 'readyok') {
          this.ready = true;
          this.applySettings();
          resolve();
        }

        // Parse best move
        if (msg.startsWith('bestmove')) {
          const parts = msg.split(' ');
          const move = parts[1];
          if (move && this.onMove) {
            this.onMove(move);
          }
        }

        // Parse evaluation
        if (msg.includes('score cp') && this.onEval) {
          const cpMatch = msg.match(/score cp (-?\d+)/);
          if (cpMatch) {
            this.onEval(parseInt(cpMatch[1]) / 100);
          }
        }
        if (msg.includes('score mate') && this.onEval) {
          const mateMatch = msg.match(/score mate (-?\d+)/);
          if (mateMatch) {
            const mateIn = parseInt(mateMatch[1]);
            this.onEval(mateIn > 0 ? 100 : -100);
          }
        }
      };

      this.send('uci');
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
    if (!this.ready) return;
    this.send(`position fen ${fen}`);
    this.send(`go depth ${this.currentPreset.depth} movetime ${this.currentPreset.moveTime}`);
  }

  evaluate(fen) {
    if (!this.ready) return;
    this.send(`position fen ${fen}`);
    this.send('go depth 12 movetime 500');
  }

  stop() {
    this.send('stop');
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.ready = false;
    }
  }
}

export { ELO_PRESETS };
export default StockfishService;
