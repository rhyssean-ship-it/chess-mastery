const criticalMoments = [
  // === BEGINNER (4) ===
  { id: 'cm-7', fen: 'r2q1rk1/ppp1bppp/2n1bn2/3p4/3P4/2N1PN2/PP1BBPPP/R2Q1RK1 w - - 0 8', question: 'This is a quiet QGD position. How should White improve?', theme: 'Piece Activity', difficulty: 'Beginner', options: [
    { text: 'Play a3 followed by b4 for queenside space', correct: true, explanation: 'Correct! A minority attack with a3-b4-b5 is the classic plan here. It will create structural weaknesses in Black\'s queenside pawn majority.' },
    { text: 'Play Ne5 to centralize the knight', correct: false, explanation: 'Ne5 is a fine move but Black can simply exchange it with Nxe5 dxe5, and White\'s pawn structure is slightly weakened.' },
    { text: 'Play f4 for a kingside attack', correct: false, explanation: 'f4 weakens the king position and doesn\'t fit the strategic requirements. The queenside is where White should be playing.' },
  ]},
  { id: 'cm-11', fen: 'r2q1rk1/1pp2ppp/p1n1pn2/3p4/1b1P4/2N1PN2/PP2BPPP/R1BQ1RK1 w - - 0 8', question: 'This is a Nimzo-Indian position. White should decide about the doubled pawns.', theme: 'Piece Activity', difficulty: 'Beginner', options: [
    { text: 'Play a3 to force Bxc3, accepting doubled pawns for the bishop pair', correct: true, explanation: 'Correct! a3 Bxc3 bxc3 gives White doubled pawns but the bishop pair. If the position opens, the bishops will dominate. The c-pawns also control d4 and d5.' },
    { text: 'Avoid a3 and develop with Bd2', correct: false, explanation: 'Bd2 is passive and doesn\'t resolve the tension. Black keeps the pin and White\'s development is awkward.' },
    { text: 'Play Qc2 to prevent doubled pawns', correct: false, explanation: 'Qc2 protects c3 but is passive. The queen belongs on more active squares. Embracing the doubled pawns is strategically sound.' },
  ]},
  { id: 'cm-13', fen: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQ - 0 5', question: 'Black has played a Pirc/KID setup. White has a big centre. What now?', theme: 'Attack vs Defence', difficulty: 'Beginner', options: [
    { text: 'Push f4 to build an even bigger centre', correct: false, explanation: 'f4 is aggressive but weakens the king. Better to develop first with Nf3 and Be2.' },
    { text: 'Develop with Nf3 and Be2, maintaining the centre', correct: true, explanation: 'Correct! Solid development first. Nf3 and Be2 prepare castling. The big centre is already an advantage — no need to overextend.' },
    { text: 'Push e5 immediately to grab maximum space', correct: false, explanation: 'e5 is premature without development. After dxe5 dxe5, Black gets counterplay and the d4 pawn may become a target.' },
  ]},
  { id: 'cm-14', fen: 'r1bqk2r/pp2bppp/2n1pn2/2pp4/3P4/2NBPN2/PP3PPP/R1BQK2R w KQkq - 0 6', question: 'Should White castle immediately or prepare with a3 first?', theme: 'King Safety', difficulty: 'Beginner', options: [
    { text: 'Castle immediately — king safety comes first', correct: true, explanation: 'Correct! Castling is almost always right. Getting the king safe and connecting the rooks should be a priority. a3 can wait.' },
    { text: 'Play a3 to prevent Bb4 and control the queenside', correct: false, explanation: 'a3 is a useful move but delays castling. With the king in the centre, tactical complications could arise.' },
    { text: 'Play Qe2 to prepare a central push', correct: false, explanation: 'Qe2 blocks the bishop and delays castling. King safety is more important than the central push right now.' },
  ]},

  // === INTERMEDIATE (7) ===
  { id: 'cm-1', fen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8', question: 'White has an IQP on d4. What is the best plan?', theme: 'Centre Control', difficulty: 'Intermediate', options: [
    { text: 'Push d4-d5 immediately to open the position', correct: false, explanation: 'Not yet — d5 is premature without enough pieces supporting the attack. Black would simply recapture and equalize.' },
    { text: 'Play Ne5 to occupy the strong outpost', correct: true, explanation: 'Correct! Ne5 is the best plan. The knight dominates the centre, supports a future d4-d5 break, and creates kingside pressure.' },
    { text: 'Trade queens with Qd2-Qa5', correct: false, explanation: 'Trading queens favours Black — the IQP becomes a weakness in the endgame. Keep pieces on for attacking chances.' },
  ]},
  { id: 'cm-2', fen: 'r1bq1rk1/ppp1bppp/2n1pn2/3p4/3PP3/2N1BN2/PPP2PPP/R2QKB1R w KQ - 0 6', question: 'Black has just played d5. How should White handle the centre?', theme: 'Pawn Breaks', difficulty: 'Intermediate', options: [
    { text: 'Play e5 to gain space and lock the centre', correct: true, explanation: 'Correct! e5 gains space, drives away the Nf6, and creates a French-like pawn chain. White will attack on the kingside.' },
    { text: 'Exchange with exd5 to simplify', correct: false, explanation: 'exd5 releases the tension and gives Black easy equality. It also opens the e-file which Black can use.' },
    { text: 'Ignore d5 and play Bd3 to develop', correct: false, explanation: 'While development is important, ignoring the central tension allows Black to play dxe4, gaining a tempo.' },
  ]},
  { id: 'cm-4', fen: 'r1bq1rk1/pp1n1ppp/4pn2/2ppP3/3P4/2PB1N2/PP1N1PPP/R1BQ1RK1 b - - 0 9', question: 'In this French Advance position, what should Black do?', theme: 'Pawn Breaks', difficulty: 'Intermediate', options: [
    { text: 'Play f6 to attack the e5 pawn head-on', correct: false, explanation: 'f6 weakens the king position and is premature here. Better to prepare it or use another break.' },
    { text: 'Play c4 to lock the queenside and prepare f6 later', correct: false, explanation: 'c4 closes the position but doesn\'t create real counterplay. It also takes away the c4 square from Black\'s pieces.' },
    { text: 'Play cxd4 followed by Qb6 to pressure d4 and b2', correct: true, explanation: 'Correct! Opening the c-file with cxd4 creates counterplay. Qb6 hits d4 and b2, forcing White to choose between defending and attacking.' },
  ]},
  { id: 'cm-6', fen: 'r1bq1rk1/1pp2ppp/p1np1n2/4p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2Q1RK1 w - - 0 8', question: 'White has the Ruy López setup. Black has pinned the Nf3. What\'s the best response?', theme: 'Attack vs Defence', difficulty: 'Intermediate', options: [
    { text: 'Break the pin with Be2 or h3', correct: false, explanation: 'Be2 loses the strong c4 bishop. h3 is playable but slow — it doesn\'t address the real issue.' },
    { text: 'Ignore the pin and play Nd5 — a thematic central strike', correct: true, explanation: 'Correct! Nd5 is powerful. After Nxd5 exd5 Bxd5, White has central control. The pin on f3 is less relevant when the knight has left.' },
    { text: 'Play Bxf6 to double Black\'s pawns', correct: false, explanation: 'Bxf6 gives up the bishop pair for doubled pawns, but Black\'s position remains solid. Nd5 is more ambitious.' },
  ]},
  { id: 'cm-8', fen: 'r1b2rk1/pp1nqppp/2n1p3/2ppP3/3P4/2PB1N2/PP2QPPP/RNB2RK1 w - - 0 10', question: 'The centre is locked. Where should White focus?', theme: 'King Safety', difficulty: 'Intermediate', options: [
    { text: 'Kingside — the space advantage points there', correct: true, explanation: 'Correct! In locked centre positions, you attack where you have more space. White\'s e5 pawn gives more room on the kingside. Plans include Qe3-Qh3, Bxh7+, or a pawn storm with f4-f5.' },
    { text: 'Queenside — play b4 to open lines', correct: false, explanation: 'The queenside is where Black has more space. b4 would play into Black\'s hands.' },
    { text: 'Centre — try to play f4 and f5 to break through', correct: false, explanation: 'f4-f5 is a kingside plan, not a central one. But the idea of f4 is correct as part of a kingside attack.' },
  ]},
  { id: 'cm-10', fen: 'r1bqr1k1/ppp2ppp/2n2n2/3pp1B1/1b1PP3/2N2N2/PPP2PPP/R2QKB1R w KQ - 0 7', question: 'Black has played an aggressive setup with e5 and d5. How should White react?', theme: 'When to Trade', difficulty: 'Intermediate', options: [
    { text: 'Capture dxe5 to open the position', correct: false, explanation: 'dxe5 gives Black\'s pieces active squares. The knight can come to d4 via e5.' },
    { text: 'Play exd5 to maintain central tension', correct: true, explanation: 'Correct! exd5 Nxd5 Bxe7 Nxe7 gives White an edge — the d4 pawn is strong and Black must regroup. The key is capturing the right pawn.' },
    { text: 'Play Bd3 to develop and wait', correct: false, explanation: 'Bd3 is too passive. The centre must be addressed now before Black consolidates.' },
  ]},
  { id: 'cm-15', fen: 'r2qr1k1/ppp2ppp/2nb1n2/3p4/3P1B2/2N1PN2/PP3PPP/R2QKB1R w KQ - 0 8', question: 'Black has a well-placed knight on d6 and bishop on c6. What\'s White\'s best approach?', theme: 'When to Trade', difficulty: 'Intermediate', options: [
    { text: 'Trade the bishop for the knight with Bxd6', correct: false, explanation: 'Giving up the active bishop for the knight is wrong. The bishop on f4 controls key squares and supports the centre.' },
    { text: 'Play Bd3 to complete development and prepare Ne5', correct: true, explanation: 'Correct! Bd3 develops naturally, and Ne5 is a strong follow-up. The knight on e5 will be very powerful, supporting both attack and defence.' },
    { text: 'Play h3 to prevent Bg4', correct: false, explanation: 'h3 is a prophylactic move but not urgent. Development is more important right now.' },
  ]},

  // === ADVANCED (4) ===
  { id: 'cm-3', fen: 'r2q1rk1/pp2bppp/2n1bn2/3pp3/8/1BN1PN2/PPP2PPP/R1BQ1RK1 w - - 0 9', question: 'Black has a strong centre. What is White\'s best strategy?', theme: 'Piece Activity', difficulty: 'Advanced', options: [
    { text: 'Undermine the centre with c4 and d3-d4', correct: true, explanation: 'Correct! White should challenge the strong centre. c4 attacks d5, and if Black pushes d4, the knight on c3 can redirect via e4.' },
    { text: 'Accept Black\'s central dominance and play on the flanks', correct: false, explanation: 'Allowing Black to keep a dominant centre long-term is dangerous. The centre must be challenged.' },
    { text: 'Push a4-a5 for queenside space', correct: false, explanation: 'a4-a5 doesn\'t address the central problem. Black\'s centre will only grow stronger if unchallenged.' },
  ]},
  { id: 'cm-5', fen: 'r2qr1k1/1b2bppp/ppn1pn2/2pp4/3P1B2/1QN1PN2/PP2BPPP/R4RK1 w - - 0 10', question: 'Both sides are fully developed. What should White prioritize?', theme: 'When to Trade', difficulty: 'Advanced', options: [
    { text: 'Trade dark-squared bishops with Bh2', correct: false, explanation: 'The bishop on f4 is actively placed. Trading it doesn\'t achieve much and removes an attacking piece.' },
    { text: 'Play dxc5 to open the position for the bishops', correct: true, explanation: 'Correct! With two bishops, White benefits from an open position. dxc5 bxc5 opens the b-file and diagonals for White\'s bishops.' },
    { text: 'Play Rfd1 to reinforce the centre', correct: false, explanation: 'Rfd1 is natural but passive. White should act while the position is still fluid.' },
  ]},
  { id: 'cm-9', fen: 'r1bq1rk1/pp2ppbp/2np1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQ - 0 7', question: 'This is a King\'s Indian setup. Black will likely play e5. What should White prepare?', theme: 'Centre Control', difficulty: 'Advanced', options: [
    { text: 'Play d5 to close the centre and fight on the wings', correct: true, explanation: 'Correct! After e5 d5, the centre is closed. White expands on the queenside (c5), Black attacks on the kingside (f5). This is the main line of the King\'s Indian.' },
    { text: 'Keep the centre fluid with Be2 and O-O', correct: false, explanation: 'Be2 and O-O are standard but don\'t answer the question of what to do when e5 comes. d5 is the critical decision.' },
    { text: 'Immediately push e5 to grab space', correct: false, explanation: 'e5 doesn\'t work well here — Black\'s knight goes to d7 and the e5 pawn becomes a target.' },
  ]},
  { id: 'cm-12', fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 6', question: 'Black has established a strong Hedgehog-like setup. What\'s White\'s priority?', theme: 'Centre Control', difficulty: 'Advanced', options: [
    { text: 'Play cxd5 to open the c-file', correct: false, explanation: 'cxd5 releases the tension and gives Black counterplay with exd5 and piece activity.' },
    { text: 'Play Bd3 and prepare e4 to build a strong centre', correct: true, explanation: 'Correct! Bd3 followed by e4 (after dxc4 Bxc4) builds a powerful central position. White aims for the Maroczy Bind setup.' },
    { text: 'Play b3 to fianchetto the bishop', correct: false, explanation: 'b3 is too slow and doesn\'t address the central battle. White needs to fight for e4.' },
  ]},
];

export default criticalMoments;
