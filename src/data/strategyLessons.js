const strategyLessons = [
  {
    "id": "pawn-structure",
    "title": "Pawn Structure Fundamentals",
    "description": "Understanding doubled pawns, isolated pawns, passed pawns, and pawn chains.",
    "difficulty": "Beginner",
    "readTime": "8 min",
    "content": [
      {
        "type": "text",
        "content": "Pawns are the soul of chess, as Philidor said. The pawn structure dictates the character of the position — which pieces are good, where to attack, and what endgame to aim for. Understanding pawn structures is the foundation of strategic chess."
      },
      {
        "type": "text",
        "content": "A doubled pawn occurs when two pawns of the same colour are on the same file. Doubled pawns are generally a weakness because they cannot protect each other and they reduce your control of key squares. However, they also open a file for your rooks, which can be useful."
      },
      {
        "type": "position",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        "caption": "After 3.Nc3 in the Caro-Kann. If Black plays ...dxe4 and White recaptures Nxe4, White's pawns stay healthy. But if Black's bishop ever captures the knight on c3 and White recaptures with the b-pawn (bxc3), White gets doubled c-pawns on c2 and c3.",
        "arrows": [],
        "highlights": []
      },
      {
        "type": "text",
        "content": "An isolated pawn has no friendly pawns on adjacent files. The isolated queen pawn (IQP) on d4 is the most famous example. It can be a strength (controlling e5 and c5, supporting piece activity) or a weakness (it needs piece protection and can become a target in endgames)."
      },
      {
        "type": "position",
        "fen": "rnbqk2r/pp2bppp/4pn2/3p4/2PP4/2N2N2/PP3PPP/R1BQKB1R w KQkq - 2 7",
        "caption": "The Panov Attack against the Caro-Kann. White has no e-pawn, so after cxd5 Nxd5 White is left with an isolated d-pawn on d4 (no white pawns on the c- or e-files) but very active pieces.",
        "arrows": [
          [
            "c4",
            "d5"
          ]
        ],
        "highlights": [
          "d4"
        ]
      },
      {
        "type": "text",
        "content": "A passed pawn is one that has no enemy pawns blocking or guarding its path to promotion. Passed pawns are powerful because they must be blockaded by pieces, tying down the opponent's forces. In endgames, a passed pawn can be decisive."
      },
      {
        "type": "text",
        "content": "A pawn chain is a diagonal line of pawns protecting each other (e.g. c3-d4-e5). The base of the chain is the weakest point, and the opponent should try to attack it. For example, in the French Defence with White pawns on d4 and e5, Black attacks the base (d4) with ...c5."
      }
    ]
  },
  {
    "id": "centre-control",
    "title": "The Importance of the Centre",
    "description": "Why controlling e4, d4, e5, and d5 is the key to good chess.",
    "difficulty": "Beginner",
    "readTime": "7 min",
    "content": [
      {
        "type": "text",
        "content": "The centre of the board — the squares e4, d4, e5, and d5 — is the most important area in chess. Pieces placed in the centre control more squares, can reach any part of the board quickly, and restrict the opponent's options."
      },
      {
        "type": "text",
        "content": "A classical approach is to occupy the centre with pawns (e4 and d4). This gives you space and mobility. A hypermodern approach, seen in openings like the King's Indian, is to let the opponent occupy the centre and then undermine it with pieces and flank pawns."
      },
      {
        "type": "position",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "caption": "The most basic central struggle: both sides have claimed one central square. White and Black fight over d4 and d5.",
        "highlights": [
          "e4",
          "e5",
          "d4",
          "d5"
        ]
      },
      {
        "type": "text",
        "content": "An open centre (no fixed pawns in the middle) favours the side with better-developed pieces. A closed centre (locked pawn chains) shifts the battle to the wings — you attack on the side where you have more space."
      },
      {
        "type": "position",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "caption": "French Defence Advance: the centre is closed with e5-d4 vs e6-d5. White has more space on the kingside; Black will counter on the queenside with c5.",
        "arrows": [
          [
            "c7",
            "c5"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Always ask: do I control the centre? If your opponent has a strong centre, look for ways to undermine it. If you control the centre, use it as a base for operations on the flanks."
      }
    ]
  },
  {
    "id": "piece-activity",
    "title": "Piece Activity and Outposts",
    "description": "What makes a piece \"good\" or \"bad\" and how to use outposts.",
    "difficulty": "Intermediate",
    "readTime": "9 min",
    "content": [
      {
        "type": "text",
        "content": "A piece is \"good\" when it has scope — many squares to move to and active roles in the position. A piece is \"bad\" when it is blocked by its own pawns or stuck defending passively. The goal is to maximise your pieces' activity while restricting your opponent's."
      },
      {
        "type": "text",
        "content": "An outpost is a square, usually on the 4th or 5th rank, that cannot be attacked by enemy pawns. Knights are especially powerful on outposts because they cannot be driven away by pawns and control many important squares."
      },
      {
        "type": "position",
        "fen": "rnb2rk1/pp2q1pp/2pbpn2/3pNp2/2PP4/1P4P1/P3PPBP/RNBQ1RK1 w - - 3 9",
        "caption": "A Dutch Stonewall. Black's pawns on d5, e6 and f5 have all moved past the e5 square, so no black pawn can ever attack it. White's knight on e5 sits on a secure outpost in the middle of Black's position.",
        "highlights": [
          "e5"
        ],
        "arrows": []
      },
      {
        "type": "text",
        "content": "A \"bad bishop\" is one blocked by its own pawns. In the French Defence, Black's light-squared bishop is often bad because the e6-d5 pawn chain restricts it. The cure: exchange it, or rearrange pawns so they sit on the opposite colour."
      },
      {
        "type": "text",
        "content": "Activity matters more than material in many positions. A centralized knight is worth more than a passive bishop stuck behind pawns. Always look for ways to activate your worst piece — it's often the most productive plan available."
      },
      {
        "type": "position",
        "fen": "rnbq1rk1/1p2bppp/p2p1n2/4p3/4P3/1NN1BP2/PPP3PP/R2QKB1R w KQ - 1 9",
        "caption": "A Najdorf Sicilian. Black has no c-pawn and has pushed the e-pawn to e5, so no black pawn can ever attack d5: it is a perfect outpost, and the knight on c3 is eyeing it. Black's dark-squared bishop on e7 is restricted by its own pawns on the dark squares d6 and e5.",
        "arrows": [
          [
            "c3",
            "d5"
          ]
        ],
        "highlights": [
          "d5"
        ]
      }
    ]
  },
  {
    "id": "king-safety",
    "title": "King Safety",
    "description": "Castling timing, pawn shields, and when to attack a castled king.",
    "difficulty": "Intermediate",
    "readTime": "8 min",
    "content": [
      {
        "type": "text",
        "content": "King safety is paramount. A king stuck in the centre is vulnerable because files can open quickly, and coordinated pieces can deliver devastating attacks. Castle early and maintain a solid pawn shield in front of your king."
      },
      {
        "type": "text",
        "content": "The ideal pawn shield is pawns on f2/g2/h2 (for White after kingside castling). Moving these pawns weakens the king. Particularly dangerous is h3 (creates a hook for g4-g5) and f3 (weakens the a7-g1 diagonal and e3 square)."
      },
      {
        "type": "position",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w - - 8 6",
        "caption": "Both sides have castled kingside. The pawn shields (f2g2h2 and f7g7h7) are intact, providing good king safety.",
        "highlights": [
          "f2",
          "g2",
          "h2",
          "f7",
          "g7",
          "h7"
        ]
      },
      {
        "type": "text",
        "content": "Opposite-side castling is a signal for a pawn storm. When kings are on opposite sides, both players should push pawns toward the enemy king as fast as possible. Speed is everything — material sacrifices to open lines are common."
      },
      {
        "type": "text",
        "content": "Signs that an attack on the king is possible: the opponent's pawn shield is weakened; you can open a file near the king; you have more pieces aimed at the king's area than the defender has protecting it. Look for these signals before committing to an attack."
      }
    ]
  },
  {
    "id": "open-files-rooks",
    "title": "Open Files and the Rook",
    "description": "Placing rooks on open and semi-open files, doubling rooks, and the 7th rank.",
    "difficulty": "Intermediate",
    "readTime": "7 min",
    "content": [
      {
        "type": "text",
        "content": "Rooks need open files to be effective. An open file is one with no pawns; a semi-open file has only enemy pawns. Place your rooks on these files to penetrate into the opponent's position."
      },
      {
        "type": "text",
        "content": "Doubling rooks on an open file (one behind the other) creates tremendous pressure. The front rook can penetrate while the second one supports it. Tripling (queen + two rooks) on a file is even more powerful."
      },
      {
        "type": "position",
        "fen": "r4rk1/ppp2ppp/2n1bn2/3p4/8/2N1PN2/PPP1BPPP/R4RK1 w - - 0 12",
        "caption": "White's d-pawn has been exchanged, so the d-file is semi-open for White: the only pawn on it is Black's d5 pawn. Rd1 puts a rook on that file and starts pressing against d5.",
        "arrows": [
          [
            "a1",
            "d1"
          ]
        ],
        "highlights": [
          "d1"
        ]
      },
      {
        "type": "text",
        "content": "A rook on the 7th rank (2nd rank for Black) is a monster. It attacks pawns from behind, traps the king on the back rank, and creates threats everywhere. Two rooks on the 7th rank is often decisive — sometimes called \"pigs on the 7th\"."
      },
      {
        "type": "position",
        "fen": "6k1/1R3ppp/8/8/8/8/5PPP/6K1 w - - 0 1",
        "caption": "A rook on the 7th rank attacks Black's pawns from the side (here the f7 pawn) and, together with Black's own pawns, keeps the king shut in on the back rank.",
        "arrows": [
          [
            "b7",
            "f7"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Principle: trade pieces but not rooks when you control an open file. Your rooks are your most valuable pieces in the middlegame when files are open. Keep them on the board to exploit your advantage."
      }
    ]
  },
  {
    "id": "weak-squares",
    "title": "Weak Squares",
    "description": "Identifying colour weaknesses and exploiting them with pieces.",
    "difficulty": "Intermediate",
    "readTime": "7 min",
    "content": [
      {
        "type": "text",
        "content": "A weak square is one that cannot be defended by a pawn. These squares become permanent outposts for your opponent's pieces — especially knights, which are hardest to dislodge from outposts. Avoid creating weak squares in your position unless you get significant compensation."
      },
      {
        "type": "text",
        "content": "A colour complex weakness occurs when several squares of one colour are weak. This usually happens when a bishop of that colour has been traded. For example, if Black trades the dark-squared bishop, the dark squares f6, e7, d6 become vulnerable."
      },
      {
        "type": "position",
        "fen": "r1bq1rk1/pp3ppp/2n1pn2/2pp4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 6",
        "caption": "A Nimzo-Indian position. If Black plays ...Bxc3+ and White recaptures bxc3, White gets doubled c-pawns. In return White gains the bishop pair, and Black, having given up the dark-squared bishop, may later find dark squares such as d6 and e5 hard to defend. A classic strategic trade-off.",
        "highlights": [
          "c3",
          "d6",
          "e5"
        ],
        "arrows": [
          [
            "b4",
            "c3"
          ]
        ]
      },
      {
        "type": "text",
        "content": "To exploit weak squares: 1) Identify the weaknesses, 2) Manoeuvre a knight or bishop to occupy them, 3) Use the outpost as a base for deeper operations. A knight on a secure outpost on the 5th rank is worth as much as a rook, according to some masters."
      },
      {
        "type": "text",
        "content": "Be especially careful about the squares around your king. Weaknesses like f3/f6, g3/g6, or h3/h6 near a castled king can be fatal if the opponent can exploit them with pieces and sacrifices."
      }
    ]
  },
  {
    "id": "bishop-pair",
    "title": "The Bishop Pair",
    "description": "When having two bishops is an advantage and how to exploit it.",
    "difficulty": "Advanced",
    "readTime": "8 min",
    "content": [
      {
        "type": "text",
        "content": "The bishop pair (having both bishops when your opponent has traded one) is a long-term advantage, especially in open positions. Two bishops can control diagonals of both colours, creating a web of influence across the board."
      },
      {
        "type": "text",
        "content": "The bishop pair is strongest when: the position is open (few pawns in the centre), the bishops have long diagonals, and there are no strong outposts for the opponent's knights. It's weakest in closed positions where pawns block the diagonals."
      },
      {
        "type": "position",
        "fen": "r2q1rk1/p3bppp/1pn1pn2/2pp4/3P4/1P1BPN2/P1P2PPP/R1BQ1RK1 w - - 0 9",
        "caption": "Black has given up the light-squared bishop for a knight, so White has the bishop pair. Opening the position (for example with dxc5) gives the bishops more scope: the bishop on d3 already aims at h7, and the bishop on c1 can come to b2 or a3.",
        "arrows": [
          [
            "d3",
            "h7"
          ],
          [
            "c1",
            "a3"
          ]
        ]
      },
      {
        "type": "text",
        "content": "To exploit the bishop pair: open the position by exchanging pawns, avoid trading a bishop for a knight, place your pawns on the opposite colour of your remaining bishop if you only have one."
      },
      {
        "type": "text",
        "content": "Against the bishop pair: keep the position closed, find outposts for your knights, exchange one of the bishops. Knights excel in closed positions with fixed pawn structures — they can jump over pawns while bishops are blocked."
      }
    ]
  },
  {
    "id": "minority-attack",
    "title": "Minority Attack",
    "description": "Using fewer pawns to create structural weaknesses in the opponent's pawn majority.",
    "difficulty": "Advanced",
    "readTime": "8 min",
    "content": [
      {
        "type": "text",
        "content": "A minority attack is a strategic concept where you advance pawns on a side where you have fewer pawns (the minority) against the opponent's pawn majority. The goal is to exchange a pawn and leave the opponent with a structural weakness — usually an isolated or backward pawn."
      },
      {
        "type": "text",
        "content": "The classic example is the Carlsbad structure from the Queen's Gambit Declined, Exchange Variation: on the queenside White has pawns on a2 and b2 against Black's pawns on a7, b7 and c6. White plays b4-b5 (often with a4 as well). If White then captures bxc6 and Black recaptures ...bxc6, Black is left with a backward c-pawn on a half-open file; if Black captures ...cxb5 instead, the d5 pawn becomes isolated."
      },
      {
        "type": "position",
        "fen": "r1bqrnk1/pp2bppp/2p2n2/3p2B1/3P4/2NBPN2/PPQ2PPP/R4RK1 w - - 8 11",
        "caption": "The Carlsbad structure. White has two queenside pawns (a2, b2) against Black's three (a7, b7, c6). White can play b4-b5 (often with a4) to execute the minority attack, targeting the c6 pawn.",
        "arrows": [
          [
            "a2",
            "a4"
          ],
          [
            "b2",
            "b4"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Steps for a minority attack: 1) Identify the side where you have fewer pawns, 2) Advance them toward the enemy pawns, 3) Force an exchange that creates a weakness, 4) Target the weakness with your pieces, especially rooks on the semi-open file created."
      },
      {
        "type": "text",
        "content": "The minority attack is a patient strategy — it takes time to advance the pawns and set up pressure. But the resulting weakness is permanent and often decides the game, especially in endgames where structural flaws are magnified."
      }
    ]
  },
  {
    "id": "endgame-transition",
    "title": "Transition to the Endgame",
    "description": "When to trade pieces, simplify, and convert an advantage into a winning endgame.",
    "difficulty": "Advanced",
    "readTime": "9 min",
    "content": [
      {
        "type": "text",
        "content": "Knowing when to transition from middlegame to endgame is a crucial skill. Generally, you should trade pieces when: you are ahead in material, you have a structural advantage (like a passed pawn), or when simplifying neutralizes your opponent's attacking chances."
      },
      {
        "type": "text",
        "content": "Conversely, avoid trades when: you are behind in material (you need complications to survive), you have an attack going (pieces are needed for the attack), or your opponent has a better endgame due to pawn structure."
      },
      {
        "type": "position",
        "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/4P3/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 7",
        "caption": "In this equal position, premature trades would simplify to a dull draw. Keep pieces on when the position is dynamically balanced.",
        "highlights": []
      },
      {
        "type": "text",
        "content": "The \"principle of two weaknesses\": to win against a stubborn defence, you often need to create two weaknesses. The defender can guard one weakness but not two at the same time. Create a second front by advancing pawns on the opposite side of the board."
      },
      {
        "type": "text",
        "content": "When converting an advantage: trade queens to reduce counterplay, keep rooks on if you have an open file, and activate your king. In the endgame, the king becomes a fighting piece — centralise it as quickly as possible."
      }
    ]
  },
  {
    "id": "prophylaxis",
    "title": "Prophylaxis",
    "description": "Anticipating opponent threats and preventing them before they happen.",
    "difficulty": "Advanced",
    "readTime": "8 min",
    "content": [
      {
        "type": "text",
        "content": "Prophylaxis, or prophylactic thinking, is the art of asking: \"What does my opponent want to do?\" before deciding your own move. Instead of just pursuing your own plans, you consider the opponent's threats and ideas, then take measures to prevent them."
      },
      {
        "type": "text",
        "content": "Petrosian was the greatest master of prophylaxis. He would make quiet, seemingly mysterious moves that prevented his opponent's plans. The result was that his opponents were left without active ideas, gradually drifting into passive positions."
      },
      {
        "type": "position",
        "fen": "r1bq1rk1/pp1nbppp/2n1p3/3pP3/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 10",
        "caption": "A French Advance structure. Black would like to play ...f6 to challenge the e5 pawn. A prophylactic approach is to prepare for it in advance, for example with Re1 and Bd3: once the bishop leaves e2, the rook on e1 adds a defender to e5, so ...f6 does far less damage.",
        "arrows": [
          [
            "f7",
            "f6"
          ]
        ],
        "highlights": [
          "e5"
        ]
      },
      {
        "type": "text",
        "content": "Common prophylactic moves: preventing a break (stopping c5 or f5 before it happens), controlling a square your opponent's knight aims for, adding a defender to a key piece before it is attacked. The key is to see one move into the future and act preemptively."
      },
      {
        "type": "text",
        "content": "Prophylaxis is the mark of a strong player. When you have no obvious active plan, ask yourself: \"What would my opponent do if it were their turn?\" Then stop it. This approach is especially valuable in closed positions where direct attacks are not available."
      }
    ]
  }
];

export default strategyLessons;
