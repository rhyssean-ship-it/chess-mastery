// Guided game walkthroughs for the Spy, Scan, Safe routine.
//
// Each game starts from `startMoves` and pauses at `moments`. At a moment the player sees the
// position, can reveal the Spy / Scan / Safe narration one step at a time (with board marks),
// and plays their move. `answers` grades specific moves (SAN); anything else is checked live with
// spyScanSafe.safetyCheck. Then the game continues with `gameMove` + `continuation`.
//
// Every engine claim below was checked with Stockfish (depth 15–16); evals are from the side to
// move at that moment.
//
// marks: arrows [from, to, brush] and highlights { square, brush } — brushes: red (their threat),
// green (a good idea for you), yellow (a target), blue (a line to notice).

const games = [
  {
    id: 'greedy-knight',
    title: 'The greedy knight',
    subtitle: 'Italian Game, Blackburne Shilling trap · you play White',
    orientation: 'white',
    intro: 'A trap that catches thousands of players every day. Each pause is a moment where one of the three steps decides the game.',
    startMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4'],
    moments: [
      {
        prompt: 'Black has just played 3…Nd4, leaving the e5 pawn behind. What do you play?',
        spy: {
          text: 'Shift: the knight left c6, so it no longer defends e5, and it now attacks your knight on f3. Your f3 knight is defended twice (queen and g-pawn), so that’s a trade offer, not a threat. Pass: if it were their move again, they’d swap knights with Nxf3+. You recapture, and nothing is lost. Targets: none of your pieces are loose. There’s no real threat, so you’re free to look for your own chances.',
          arrows: [['d4', 'f3', 'red']],
          highlights: [{ square: 'e5', brush: 'yellow' }],
        },
        scan: {
          text: 'Theirs first: two checks. After Nxf3+ you recapture, and after Nxc2+ your queen takes the knight. Neither works. Yours. Checks: Bxf7+. And then what? Kxf7, and you’ve given a bishop for a pawn. Captures: Nxe5 takes the loose pawn. And then what? Look one reply deeper: their queen can jump to g5 and hit your knight on e5 and the g2 pawn at the same time. Nxd4 swaps off their most active piece. Threats: none.',
          arrows: [['f3', 'e5', 'yellow'], ['f3', 'd4', 'green']],
        },
        safe: {
          text: 'Nxe5: the knight lands on e5 with no defender, and loose pieces drop off. Nxd4: after exd4 everything of yours is defended and their best piece is gone. Castling passes too: your king is safe and a rook joins the game. Engine: Nxd4 is best (+1.4), with O-O close behind (+1.2).',
          arrows: [['f3', 'd4', 'green']],
        },
        answers: {
          Nxd4: { grade: 'best', text: 'Best move. You swap off the active knight and nothing of yours is loose.' },
          'O-O': { grade: 'good', text: 'Good: king safe, rook in play. Nxd4 was slightly cleaner.' },
          Nc3: { grade: 'ok', text: 'Develops, but it lets their knight stay on d4.' },
          Nxe5: { grade: 'risky', text: 'It wins a pawn, but “and then what?” Qg5! hits the knight and g2 at once. It’s playable if you find the answer next move. This is what happened in the game.' },
        },
        gameMove: 'Nxe5',
        continuation: ['Qg5'],
        afterText: 'In the game White grabbed the pawn with 4.Nxe5, and Black sprang 4…Qg5!, the double attack Scan warned about.',
      },
      {
        prompt: 'Black’s queen has landed on g5. What now?',
        spy: {
          text: 'Shift: the queen now attacks your knight on e5 (undefended) and your g2 pawn (undefended), with your rook on h1 sitting behind it. Pass: they’d play Qxg2 and then Qxh1. Two real threats at once. The rule: deal with them first.',
          arrows: [['g5', 'e5', 'red'], ['g5', 'g2', 'red']],
          highlights: [{ square: 'h1', brush: 'red' }],
        },
        scan: {
          text: 'Theirs: Qxe5 and Qxg2 both win material. Yours. Checks: Bxf7+! And then what? Your knight on e5 guards f7, so the king can’t take the bishop. It has to walk to d8 or e7 and can never castle. Captures: Nxf7 forks the queen and the rook. Tempting, but and then what? Qxg2! hits your rook, and their queen is inside your position. Threats: you have nothing bigger than their threats.',
          arrows: [['c4', 'f7', 'green'], ['e5', 'f7', 'yellow']],
        },
        safe: {
          text: 'Nxf7 leaves g2 and the h1 rook hanging. It ignores the threat Spy found. Bxf7+ comes with check, so Black has no time for Qxg2, and next move you castle and g2 is covered. Castling at once (O-O) also guards g2, giving back the e5 knight for a strong attack. Engine: Bxf7+ ≈ +0.8, O-O ≈ +0.6, Nxf7 ≈ −7.6.',
          arrows: [['c4', 'f7', 'green']],
        },
        answers: {
          'Bxf7+': { grade: 'best', text: 'Best move. It’s a check, so their threats have to wait, and the king loses its castling rights.' },
          'O-O': { grade: 'good', text: 'Good: the king now guards g2. You may give up the e5 knight, but White gets a strong attack.' },
          Nxf7: { grade: 'blunder', text: 'The fork is real, but Qxg2 comes first and your rook falls with a mating attack. This is the move played in the game.' },
        },
        fallback: 'This leaves Black clearly better: the engine rates every move except Bxf7+ and O-O at −1.8 or worse.',
        gameMove: 'Nxf7',
        continuation: ['Qxg2', 'Rf1', 'Qxe4+'],
        afterText: 'White took the fork: 5.Nxf7?? Qxg2 6.Rf1 Qxe4+. Now you’re in check.',
      },
      {
        prompt: 'You’re in check. Only two moves are legal, and one of them loses on the spot.',
        spy: {
          text: 'Shift: Qxe4 is check, so you must answer it. Pass doesn’t apply here because you have no free move. You can block on e2 with the bishop or with the queen.',
          arrows: [['e4', 'e1', 'red']],
        },
        scan: {
          text: 'This is the moment for “even the silly checks.” After each block, what are their checks? After Be2: Nf3+. Your bishop can’t take the knight because it’s pinned to your king, and the king has no square: d1 (your queen), d2 and f2 (your pawns), e2 and f1 (your bishop and rook). That’s checkmate. After Qe2: Nf3+ is still check, but d1 is now empty, so Kd1 escapes.',
          arrows: [['d4', 'f3', 'red']],
          highlights: [{ square: 'd1', brush: 'yellow' }],
        },
        safe: {
          text: 'Be2 allows Nf3#: a check you haven’t looked at. Qe2 is the only move that survives. You’re still losing (engine ≈ −9) because of the Spy miss on move 5, but the game goes on.',
        },
        answers: {
          Qe2: { grade: 'best', text: 'The only move that doesn’t get mated. You checked their checks.' },
          Be2: { grade: 'blunder', text: 'Nf3# is checkmate. This is how the game ended.' },
        },
        gameMove: 'Be2',
        continuation: ['Nf3#'],
        afterText: 'White blocked with 7.Be2?? and Black played 7…Nf3#. One missed Spy on move 5 and one missed Scan on move 7.',
      },
    ],
    outro: 'Three pauses, three steps. Move 4: Scan’s “and then what?” finds Qg5. Move 5: Spy says deal with the threat first. Move 7: Safe means checking their checks before you block.',
  },
  {
    id: 'early-queen',
    title: 'Surviving the early queen',
    subtitle: 'Scholar’s mate attempt · you play Black',
    orientation: 'black',
    intro: 'White brings the queen out early and aims at f7. Spy keeps you alive; Scan turns the tables.',
    startMoves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5'],
    moments: [
      {
        prompt: 'White’s queen has jumped to h5. What do you play?',
        spy: {
          text: 'Shift: the queen attacks your e5 pawn and f7. Pass: Qxf7 would be checkmate. Queen and bishop both hit f7, and only your king defends it. Targets: f7, the classic weak square. A real threat: deal with it first.',
          arrows: [['h5', 'f7', 'red'], ['c4', 'f7', 'red']],
          highlights: [{ square: 'e5', brush: 'yellow' }],
        },
        scan: {
          text: 'Theirs: Qxf7# is the one that matters. Qxe5+ is a check too, but your knight guards e5, so it just loses their queen. Yours: no checks or captures. Threats: g6 attacks the queen while blocking her path to f7.',
          arrows: [['g7', 'g6', 'green']],
        },
        safe: {
          text: 'Nf6 looks natural (it hits the queen) but it doesn’t guard f7: Qxf7#. g6: the pawn is defended by f7 and h7, and it gains time. Qe7 guards f7 and e5 at once (the engine’s favourite, ≈ +0.5 for Black). Qf6 also guards f7.',
          highlights: [{ square: 'f7', brush: 'red' }],
        },
        answers: {
          Qe7: { grade: 'best', text: 'Best move. It guards f7 and e5 together.' },
          g6: { grade: 'good', text: 'Good: it blocks the diagonal and kicks the queen. This is what you play in the game.' },
          Qf6: { grade: 'good', text: 'Good: f7 is covered, though the queen takes f6 from your knight.' },
          Nh6: { grade: 'ok', text: 'It guards f7, but the knight is awkward on the rim.' },
          Nf6: { grade: 'blunder', text: 'Qxf7# is checkmate. The knight attacks the queen but doesn’t defend f7.' },
        },
        gameMove: 'g6',
        continuation: ['Qf3'],
        afterText: 'You play 3…g6. The queen retreats with 4.Qf3, and look where it’s pointing.',
      },
      {
        prompt: 'The queen has swung round to f3. Your move.',
        spy: {
          text: 'Shift: the queen has moved to f3 and again lines up with the bishop on f7. Pass: Qxf7#, again. Same threat, new route: deal with it first.',
          arrows: [['f3', 'f7', 'red'], ['c4', 'f7', 'red']],
        },
        scan: {
          text: 'Theirs: Qxf7# is the only one that matters. Yours: nothing forcing. So the question is which defence also does something useful.',
        },
        safe: {
          text: 'Nf6 blocks the f-file and develops a piece, and your queen on d8 defends the knight. That’s the best move. Qf6 or Qe7 also guard f7 but put the queen in front of your pieces.',
          arrows: [['g8', 'f6', 'green']],
        },
        answers: {
          Nf6: { grade: 'best', text: 'Best move. It blocks the threat and develops at the same time.' },
          Qf6: { grade: 'good', text: 'Good: f7 is covered. The knight would have been happier on f6.' },
          Qe7: { grade: 'good', text: 'Good: it guards f7, but it blocks your f8 bishop.' },
          f5: { grade: 'ok', text: 'It blocks the f-file, but loosens your king.' },
        },
        gameMove: 'Nf6',
        continuation: ['g4'],
        afterText: 'You play 4…Nf6. White pushes 5.g4?, planning g5 to drive your knight away from f7.',
      },
      {
        prompt: 'White has pushed 5.g4. What do you play?',
        spy: {
          text: 'Shift: the pawn threatens g5, chasing your knight off f6. Then Qxf7# is back. Pass: g5. A real threat, but it’s one move slow.',
          arrows: [['g4', 'g5', 'red'], ['f3', 'f7', 'red']],
        },
        scan: {
          text: 'Theirs: after g5, Qxf7#. Yours. Captures: Nxg4 grabs a pawn. And then what? Your knight has left f6 and the f-file is open: Qxf7#. Threats: Nd4! attacks the queen and the c2 pawn, with Nxc2+ forking king and rook to follow.',
          arrows: [['c6', 'd4', 'green'], ['d4', 'c2', 'yellow']],
        },
        safe: {
          text: 'Nxg4 allows Qxf7#. Nd4 lands safely: the queen can’t take it, nothing is left hanging, and their queen has to move, so g5 never happens. Black is winning (engine ≈ +5).',
          arrows: [['c6', 'd4', 'green']],
        },
        answers: {
          Nd4: { grade: 'best', text: 'Best move. It hits the queen and c2, and White has no time for g5.' },
          d5: { grade: 'good', text: 'Strong too: it opens lines and hits the bishop. Nd4 was even stronger.' },
          Nxg4: { grade: 'blunder', text: 'Qxf7# is checkmate. “And then what?” would have caught it.' },
        },
        fallback: 'Not bad, but Nd4! was there. Scan for threats as well as captures.',
        gameMove: 'Nd4',
        continuation: [],
        afterText: 'You play 5…Nd4!, and White’s attack is over.',
      },
    ],
    outro: 'Spy found the same mate threat twice, by two different routes. Scan’s “and then what?” stopped the greedy Nxg4 and found Nd4!',
  },
];

export default games;
