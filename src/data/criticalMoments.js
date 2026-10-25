const criticalMoments = [
  // === BEGINNER (4) ===
  { id: 'cm-7', fen: 'r2q1rk1/ppp1bppp/2n1bn2/3p4/3P4/2N1PN2/PP1BBPPP/R2Q1RK1 w - - 0 8', question: 'White to move. This is a quiet Queen\'s Gambit structure: Black has three queenside pawns (a7, b7, c7) against White\'s two (a2, b2). How should White improve?', theme: 'Piece Activity', difficulty: 'Beginner', options: [
    { text: 'Play a3 followed by b4 for queenside space', correct: true, explanation: 'Correct! This is the minority attack: White pushes the a- and b-pawns (a3, b4, b5) against Black\'s three queenside pawns to create a weakness there. a3 is one of the engine\'s top moves.' },
    { text: 'Play Ne5 to centralise the knight', correct: false, explanation: 'Ne5 is playable, but Black can simply swap it off with ...Nxe5 dxe5, and after the knight on f6 moves the e5 pawn can become a target. It does not improve White\'s position as much as a3.' },
    { text: 'Play g4 for a kingside attack', correct: false, explanation: 'g4 just loses a pawn to ...Nxg4 or ...Bxg4 and loosens White\'s own king. There is no attack to justify it.' },
  ]},
  { id: 'cm-11', fen: 'r1bq1rk1/pp3ppp/2n1pn2/2p5/1bBP4/2N1PN2/PP3PPP/R1BQ1RK1 w - - 1 9', question: 'White to move. This is a Nimzo-Indian: Black\'s bishop on b4 pins the knight on c3, and the c5 pawn and c6 knight press on d4. What should White do about the pin?', theme: 'Piece Activity', difficulty: 'Beginner', options: [
    { text: 'Play a3 to ask the bishop a question', correct: true, explanation: 'Correct! a3 is the main line and one of the engine\'s top moves. If ...Bxc3 bxc3, White gets the bishop pair and the new pawn on c3 supports d4. If ...Ba5, the bishop has been pushed back and White can continue with Bd3 and Re1.' },
    { text: 'Play Bd2 to break the pin quietly', correct: false, explanation: 'Bd2 is too passive, and it blocks the d1 queen\'s defence of d4. After ...cxd4 exd4 ...Nxd4, Black wins a pawn.' },
    { text: 'Play e4 to grab the centre at once', correct: false, explanation: 'e4? runs into ...cxd4, attacking the knight on c3, which cannot move because of the pin. White loses material.' },
  ]},
  { id: 'cm-13', fen: 'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 5', question: 'White to move. Black has chosen a King\'s Indian set-up and White has a big pawn centre on c4, d4 and e4. What now?', theme: 'Attack vs Defence', difficulty: 'Beginner', options: [
    { text: 'Push f4 to build an even bigger centre', correct: false, explanation: 'f4 (the Four Pawns Attack) is playable, but it is risky: it weakens White\'s king and the pawns can become targets. Developing first is simpler and the engine prefers it.' },
    { text: 'Develop with Nf3 and Be2, keeping the centre', correct: true, explanation: 'Correct! Solid development first. Nf3 and Be2 prepare castling, and the big centre is already an advantage, so there is no need to overextend.' },
    { text: 'Push e5 immediately to grab maximum space', correct: false, explanation: 'e5 is premature. After ...dxe5 dxe5 Qxd1+ Nxd1 the queens are off, and the e5 pawn is weak and can be attacked by Black\'s pieces.' },
  ]},
  { id: 'cm-14', fen: 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 6', question: 'White to move. In this quiet Italian Game, White has played c3 and d3. Should White castle now or try something more active first?', theme: 'King Safety', difficulty: 'Beginner', options: [
    { text: 'Castle immediately: king safety comes first', correct: true, explanation: 'Correct! O-O is the engine\'s top move. The king is safe, the rooks are connected, and White can carry on with Nbd2, h3 and Re1 afterwards.' },
    { text: 'Play Ng5 to attack f7 first', correct: false, explanation: 'Ng5 is a beginner\'s trap for yourself: after ...O-O, f7 is guarded by the rook on f8 and the king, and the knight has achieved nothing. White has just lost time while the king is still on e1.' },
    { text: 'Play Qb3 to hit f7 and b7', correct: false, explanation: 'Qb3 is met by ...O-O, after which neither f7 nor b7 is really in danger, and ...Na5 can attack both the queen and the c4 bishop. White loses time instead of castling.' },
  ]},

  // === INTERMEDIATE (7) ===
  { id: 'cm-1', fen: 'r1bq1rk1/pp2bppp/2n1pn2/8/2BP4/2N2N2/PP3PPP/R1BQ1RK1 w - - 3 10', question: 'White to move. White has an isolated queen\'s pawn (IQP) on d4: there are no White pawns on the c- or e-files to support it. What is the best plan?', theme: 'Centre Control', difficulty: 'Intermediate', options: [
    { text: 'Push d4-d5 immediately to open the position', correct: false, explanation: 'Not yet. After d5 Black plays ...Na5, hitting the bishop on c4, and after ...exd5 the pawn is simply exchanged. Black gets a comfortable game.' },
    { text: 'Build up with moves like a3, Re1 and Be3, keeping pieces on the board', correct: true, explanation: 'Correct! With an IQP, White wants active pieces and attacking chances. a3 (stopping ...Nb4 and ...Bb4) and Re1 are the engine\'s top choices; the d4-d5 break can come later once White is fully ready.' },
    { text: 'Play Ne5 to occupy the outpost at once', correct: false, explanation: 'Ne5 drops the d4 pawn: the knight on f3 was one of its defenders, so ...Nxd4 wins it (d4 is attacked by the c6 knight and the d8 queen and defended only by the d1 queen).' },
  ]},
  { id: 'cm-2', fen: 'r1bqk2r/ppp1bppp/2n1pn2/3p4/3PP3/2N1BN2/PPP2PPP/R2QKB1R w KQkq - 2 6', question: 'White to move. Black has just played ...d5, attacking White\'s pawn on e4. How should White handle the centre?', theme: 'Pawn Breaks', difficulty: 'Intermediate', options: [
    { text: 'Play e5 to gain space and lock the centre', correct: true, explanation: 'Correct! e5 gains space, drives the knight away from f6 and creates a French-style pawn chain (d4 and e5). White will then attack on the kingside. The engine rates it clearly best.' },
    { text: 'Exchange with exd5 to simplify', correct: false, explanation: 'exd5 exd5 releases the tension and gives Black an easy game with open lines for the pieces. White\'s advantage shrinks.' },
    { text: 'Ignore it and play Bd3 to develop', correct: false, explanation: 'Bd3 is playable, but it lets Black choose: ...Nb4 hits the bishop, or ...dxe4 releases the tension on Black\'s terms. e5 is stronger because it grabs space and gains time on the f6 knight.' },
  ]},
  { id: 'cm-4', fen: 'r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5', question: 'Black to move. This is the French Defence, Advance Variation. White\'s pawn chain c3-d4-e5 is strong. What should Black do?', theme: 'Pawn Breaks', difficulty: 'Intermediate', options: [
    { text: 'Play ...f6 at once to attack the e5 pawn head-on', correct: false, explanation: '...f6 is premature here: Black has not developed the kingside, and after Bb5 or Bd3 the weakened e6 pawn and the king on e8 become targets. The engine rates it clearly worse.' },
    { text: 'Play ...c4 to lock the queenside', correct: false, explanation: '...c4 releases the pressure on d4 and gives White a free hand: after b3 the c4 pawn is attacked and White\'s centre is no longer under any pressure.' },
    { text: 'Play ...Qb6 to pressure d4 and b2', correct: true, explanation: 'Correct! ...Qb6 is the main line: the queen joins the c5 pawn and the c6 knight in attacking d4, and also eyes b2. This is how Black fights the base of White\'s pawn chain.' },
  ]},
  { id: 'cm-6', fen: 'r2q1rk1/ppp1bppp/2np1n2/4p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2Q1RK1 w - - 4 8', question: 'White to move. In this Italian Game, Black\'s bishop on g4 pins the knight on f3 to the queen on d1. What\'s the best response?', theme: 'Attack vs Defence', difficulty: 'Intermediate', options: [
    { text: 'Play h3 to put the question to the bishop', correct: true, explanation: 'Correct! h3 is the engine\'s top move. If ...Bxf3 Qxf3, White gets the bishop pair and the queen is active on f3; if the bishop retreats to h5, White can later break the pin with g4.' },
    { text: 'Play Nd5 for a central strike', correct: false, explanation: 'Nd5? loses material. After ...Nxd5, if exd5 then ...Nd4! threatens ...Nxf3+ and ...Bxg5, and if Bxe7 then ...Nxe7 and White has lost a piece. Always check what the opponent\'s recapture does.' },
    { text: 'Play Qd2 to connect the rooks', correct: false, explanation: 'Qd2 ignores the pin: ...Bxf3 gxf3 ...Nd4 wrecks White\'s kingside pawns and leaves the king exposed.' },
  ]},
  { id: 'cm-8', fen: 'r1b2rk1/ppqn1ppp/2n1p3/2ppP3/3P4/2PB1N2/PP3PPP/RN1Q1RK1 w - - 0 10', question: 'White to move. White\'s e5 pawn has kept Black\'s knights away from f6, and nothing guards h7 except the king. Where should White strike?', theme: 'King Safety', difficulty: 'Intermediate', options: [
    { text: 'Kingside, right now: Bxh7+ (the Greek Gift)', correct: true, explanation: 'Correct! Bxh7+ Kxh7 Ng5+ wins. If ...Kg8, Qh5 threatens Qh7# and Black is mated soon; if ...Kh8, Qh5+ Kg8 Qh7# is mate; if ...Kg6, Qd3+ keeps the attack going. Declining with ...Kh8 at once leaves White a pawn up with an attack.' },
    { text: 'Queenside: play b4 to open lines', correct: false, explanation: 'b4 is far too slow, and it allows ...cxb4 cxb4 when White\'s d4 pawn is weaker. It ignores the tactic on h7.' },
    { text: 'Quietly: bring the knight round with Na3-c2', correct: false, explanation: 'Na3 is a solid developing move, but it misses the chance. The Greek Gift on h7 is much stronger right now, and Black may defend the kingside next move.' },
  ]},
  { id: 'cm-10', fen: 'r1bqkb1r/ppp2ppp/2n5/3pp3/2B1N3/5N2/PPPP1PPP/R1BQK2R w KQkq - 0 6', question: 'White to move. Black has played the "fork trick" (...Nxe4 followed by ...d5), forking White\'s bishop on c4 and knight on e4. How should White react?', theme: 'When to Trade', difficulty: 'Intermediate', options: [
    { text: 'Play Bxd5 to trade the bishop for the pawn and queen', correct: false, explanation: 'Bxd5 Qxd5 hands Black the bishop pair, and the queen on d5 is very active in the centre, attacking the knight on e4. Black gets a comfortable game.' },
    { text: 'Play Bd3, keeping the bishop', correct: true, explanation: 'Correct! Bd3 saves the bishop; after ...dxe4 Bxe4 material is level, White has a well-placed bishop on e4 and is slightly better according to the engine.' },
    { text: 'Play Bb5 to pin the knight on c6', correct: false, explanation: 'Bb5 leaves the knight on e4 hanging: ...dxe4 and Black is a piece up for now. White gets some play with Nxe5, but Black is better.' },
  ]},
  { id: 'cm-15', fen: 'r2qr1k1/ppp2ppp/2nb1n2/3p4/3P1Bb1/2N1PN2/PP3PPP/R2QKB1R w KQ - 0 8', question: 'White to move. Black\'s bishop on d6 challenges White\'s bishop on f4, the bishop on g4 pins the knight on f3, and the rook on e8 faces White\'s king. What\'s White\'s best approach?', theme: 'When to Trade', difficulty: 'Intermediate', options: [
    { text: 'Trade bishops with Bxd6', correct: true, explanation: 'Correct! Black was threatening ...Bxf4, and White could not recapture with exf4 because the rook on e8 pins the e3 pawn to White\'s king. Trading on d6 solves the problem; the engine gives roughly equal chances.' },
    { text: 'Play Bd3 to complete development', correct: false, explanation: 'Bd3? loses a piece: ...Bxf4, and exf4 is illegal because the e3 pawn is pinned by the rook on e8.' },
    { text: 'Play h3 to question the g4 bishop', correct: false, explanation: 'h3? runs into ...Bxf3 Qxf3 ...Nxd4!, winning a pawn: exd4 is illegal because the e3 pawn is pinned by the rook on e8, and the f4 bishop is still under attack.' },
  ]},

  // === ADVANCED (4) ===
  { id: 'cm-3', fen: 'rnbqk2r/ppp1ppbp/6p1/8/3PP3/2P2N2/P4PPP/R1BQKB1R b KQkq - 2 7', question: 'Black to move. In this Grünfeld Defence, White has a big pawn centre on d4 and e4. What is Black\'s best strategy?', theme: 'Piece Activity', difficulty: 'Advanced', options: [
    { text: 'Undermine the centre with ...c5, then pressure d4 with ...Nc6 and ...Bg4', correct: true, explanation: 'Correct! The Grünfeld idea is to let White build a centre and then attack it. ...c5 hits d4, and the bishop on g7 already aims at d4 along the long diagonal. ...c5 and ...O-O are the engine\'s top choices.' },
    { text: 'Play ...e6 and keep a solid position', correct: false, explanation: '...e6 is passive and weakens the dark squares around the king (f6, d6). White can play Bd3 and later e5 with a big space advantage.' },
    { text: 'Push ...a5 for queenside space', correct: false, explanation: '...a5 does nothing against the centre and allows Bb5+, disturbing Black\'s development. Black\'s centre problem only gets worse if it is not challenged.' },
  ]},
  { id: 'cm-5', fen: 'r2qr1k1/1b2bppp/ppn1pn2/2pp4/2PP1B2/1QN1PN2/PP2BPPP/R4RK1 w - - 0 10', question: 'White to move. Both sides are fully developed and the centre is tense (c4, d4 against c5, d5). Note White\'s queen on b3 eyeing b6 and b7. What should White do?', theme: 'When to Trade', difficulty: 'Advanced', options: [
    { text: 'Play Rad1 to reinforce the centre', correct: false, explanation: 'Rad1 is natural but slow. Black resolves the tension with ...dxc4 Qxc4 ...b5, gaining space and time on the queen. The engine rates it clearly worse.' },
    { text: 'Play dxc5 to resolve the tension on White\'s terms', correct: true, explanation: 'Correct! dxc5 is the engine\'s top move. Black cannot recapture with ...bxc5 because Qxb7 wins the bishop, so ...Bxc5 is forced; then cxd5 opens the centre while White is better developed.' },
    { text: 'Play a3, a useful waiting move', correct: false, explanation: 'a3 wastes time: ...Na5 hits the queen, and Black takes over on the queenside with ...dxc4 and ...b5.' },
  ]},
  { id: 'cm-9', fen: 'r1bq1rk1/ppp2pbp/2np1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 2 8', question: 'White to move. This is the King\'s Indian Defence: Black has played ...e5 and ...Nc6, adding pressure to d4. What should White do?', theme: 'Centre Control', difficulty: 'Advanced', options: [
    { text: 'Play d5 to close the centre and fight on the wings', correct: true, explanation: 'Correct! d5 gains space with tempo on the c6 knight. With the centre closed, White expands on the queenside (b4, c5) and Black attacks on the kingside (...f5). This is the main line and the engine\'s top move.' },
    { text: 'Play dxe5 dxe5 and trade queens', correct: false, explanation: 'dxe5 releases the tension. After the queens come off, Black\'s position is very solid and White keeps only a small edge. d5 is more ambitious.' },
    { text: 'Play h3, a useful waiting move', correct: false, explanation: 'h3? allows a trick: ...exd4 Nxd4 ...Nxe4! Nxe4 ...Nxd4, and Black has won a pawn thanks to the g7 bishop on the long diagonal.' },
  ]},
  { id: 'cm-12', fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 6', question: 'White to move. In this Nimzo-Indian, White\'s king is still on e1 and the centre is tense. What\'s White\'s priority?', theme: 'Centre Control', difficulty: 'Advanced', options: [
    { text: 'Play b3 to support the c4 pawn', correct: false, explanation: 'b3? loses a piece: after ...cxd4 exd4 ...Bxc3+, the b-pawn can no longer recapture on c3, and if Bd2 then ...Bxd2+ leaves Black a piece up.' },
    { text: 'Develop with Be2 and castle', correct: true, explanation: 'Correct! Be2 is the engine\'s top move. White finishes development and gets the king out of the centre before the position opens.' },
    { text: 'Play Bd2 to break the pin', correct: false, explanation: 'Bd2 is too slow. After ...cxd4 exd4 ...dxc4 Bxc4 ...Nxd4, Black wins the d4 pawn while White\'s king is still in the centre.' },
  ]},
];

export default criticalMoments;
