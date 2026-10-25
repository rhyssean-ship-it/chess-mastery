// Runs the browser asm.js Stockfish build (public/stockfish/stockfish.js) inside a Node worker thread,
// exposing a tiny promise API for UCI evaluation. Used by validate-openings.mjs --engine.
import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const SF_PATH = path.resolve(here, '../public/stockfish/stockfish.js');

const workerSrc = `
const { parentPort, workerData } = require('node:worker_threads');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(workerData.sfPath, 'utf8');
const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval, performance,
  TextDecoder, TextEncoder, WebAssembly, Math, Date,
  postMessage: (m) => parentPort.postMessage(m),
  close: () => process.exit(0),
  importScripts: () => {},
  location: { href: workerData.sfPath },
};
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'stockfish.js' });
parentPort.on('message', (d) => sandbox.onmessage({ data: d }));
`;

export function createEngine() {
  const worker = new Worker(workerSrc, { eval: true, workerData: { sfPath: SF_PATH } });
  let listeners = [];
  worker.on('message', (line) => {
    for (const l of [...listeners]) l(String(line));
  });
  worker.on('error', (e) => { console.error('Stockfish worker error', e); });
  const send = (cmd) => worker.postMessage(cmd);
  const waitFor = (pred, ms, label) => new Promise((resolve, reject) => {
    const t = setTimeout(() => { listeners = listeners.filter(x => x !== fn); reject(new Error('timeout: ' + label)); }, ms);
    const fn = (line) => { if (pred(line)) { clearTimeout(t); listeners = listeners.filter(x => x !== fn); resolve(line); } };
    listeners.push(fn);
  });

  async function init() {
    const p = waitFor(l => l === 'uciok', 30000, 'uciok');
    send('uci');
    await p;
    const r = waitFor(l => l === 'readyok', 30000, 'readyok');
    send('isready');
    await r;
  }

  // Returns { cp, mate, bestmove } from the side-to-move's perspective.
  async function evaluate(fen, { depth = 12, moves = null, timeoutMs = 20000 } = {}) {
    let last = null;
    const collect = (line) => {
      if (line.startsWith('info') && line.includes(' score ') && !line.includes('lowerbound') && !line.includes('upperbound')) {
        const m = line.match(/score (cp|mate) (-?\d+)/);
        if (m) last = { type: m[1], val: Number(m[2]) };
      }
    };
    listeners.push(collect);
    const done = waitFor(l => l.startsWith('bestmove'), timeoutMs, 'bestmove ' + fen);
    send('position fen ' + fen + (moves ? ' moves ' + moves.join(' ') : ''));
    send('go depth ' + depth);
    let line;
    try { line = await done; }
    catch (e) {
      send('stop');
      try { line = await waitFor(l => l.startsWith('bestmove'), 5000, 'bestmove-after-stop'); } catch { line = 'bestmove (none)'; }
    } finally {
      listeners = listeners.filter(x => x !== collect);
    }
    const best = line.split(' ')[1];
    if (!last) return { cp: null, mate: null, bestmove: best };
    return last.type === 'cp' ? { cp: last.val, mate: null, bestmove: best } : { cp: null, mate: last.val, bestmove: best };
  }

  async function newGame() {
    send('ucinewgame');
    const r = waitFor(l => l === 'readyok', 10000, 'readyok');
    send('isready');
    await r;
  }

  return { init, evaluate, newGame, quit: () => worker.terminate() };
}
