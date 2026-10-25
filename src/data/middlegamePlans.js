const middlegamePlans = [
  {
    "id": "iqp-attack",
    "title": "Isolated Queen Pawn — Attacking Plans",
    "structure": "IQP",
    "difficulty": "Intermediate",
    "description": "How to use an isolated d-pawn as a launching pad for attack.",
    "content": [
      {
        "type": "text",
        "content": "The Isolated Queen Pawn (IQP) on d4 is both a strength and a weakness. As the attacking side, your job is to use the IQP's dynamic energy before it becomes a static weakness in the endgame. The key is to act while pieces are still on the board."
      },
      {
        "type": "position",
        "fen": "r1bq1rk1/pp2bppp/2n1pn2/8/2BP4/5N2/PP2QPPP/RNB2RK1 b - - 0 8",
        "caption": "A typical IQP position. White's d4 pawn controls e5 and c5. The half-open e-file and the e5 outpost are key features for White.",
        "arrows": [
          [
            "d4",
            "e5"
          ],
          [
            "d4",
            "c5"
          ]
        ],
        "highlights": [
          "d4"
        ]
      },
      {
        "type": "text",
        "content": "Plan 1: The d4-d5 break. This is the most thematic idea. Push d5! at the right moment to open lines for your pieces. After exd5 Nxd5 (or Bxd5), your pieces flood the position. Timing is critical — you need enough pieces aimed at the kingside first."
      },
      {
        "type": "text",
        "content": "Plan 2: Knight to e5. A knight on e5 is incredibly powerful in IQP positions. It controls critical squares, supports a kingside attack, and can't easily be challenged. From e5, the knight eyes f7, d7, g4, and c6."
      },
      {
        "type": "text",
        "content": "Plan 3: Rook lift. Play Rd1-d3-h3 (or Rd3-g3) to bring a rook into the attack. Combined with the bishop pointing at h7 and the knight on e5, this creates devastating threats against the castled king."
      },
      {
        "type": "text",
        "content": "Plan 4: Piece activity over material. In IQP positions, never trade pieces unnecessarily. Every piece traded makes the d4 pawn weaker. Keep the board full of pieces to maximize your dynamic advantage."
      }
    ],
    "keyPlans": [
      "Push d4-d5 to open lines when pieces are ready",
      "Install a knight on e5",
      "Rook lift via Rd3-Rh3 for kingside attack",
      "Avoid piece trades — activity is everything",
      "Bishop on c4/d3 aims at the kingside"
    ]
  },
  {
    "id": "iqp-defend",
    "title": "Isolated Queen Pawn — Defending Against It",
    "structure": "IQP",
    "difficulty": "Intermediate",
    "description": "How to neutralize IQP attacking chances and target the weakness.",
    "content": [
      {
        "type": "text",
        "content": "When facing an IQP, your strategy is the opposite: trade pieces to reach an endgame where the isolated pawn is a permanent weakness. The d4 pawn can't advance without support, and in an endgame it's a sitting target."
      },
      {
        "type": "text",
        "content": "Plan 1: Blockade d5. Place a knight on d5 — this is the dream square. A knight on d5 can't be driven away by pawns and completely paralyzes White's position. The d4 pawn is frozen, and the knight dominates the board."
      },
      {
        "type": "position",
        "fen": "r1bq1rk1/pp2bppp/2n1pn2/8/3P4/2N1BN2/PP2BPPP/R2Q1RK1 b - - 0 9",
        "caption": "Black aims to put a knight on d5 (Nf6-d5) to blockade the isolated pawn on d4. Once blockaded, the pawn is a long-term weakness.",
        "highlights": [
          "d5",
          "d4"
        ],
        "arrows": [
          [
            "f6",
            "d5"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Plan 2: Exchange pieces systematically. Every trade favours the defender. Trade knights, trade bishops, trade queens. In a rook ending, the IQP is a clear target that requires constant defence."
      },
      {
        "type": "text",
        "content": "Plan 3: Control the files. Put your rooks on the d-file and the open c-file. Pressure the d4 pawn directly and force White to defend it passively."
      }
    ],
    "keyPlans": [
      "Blockade d5 with a knight",
      "Trade pieces to reach a favorable endgame",
      "Control the d-file with rooks",
      "Never allow d4-d5 to be played favorably",
      "Keep the position closed and static"
    ]
  },
  {
    "id": "french-pawn-breaks",
    "title": "French Structure — Pawn Breaks",
    "structure": "French Chain",
    "difficulty": "Intermediate",
    "description": "Understanding c5 and f6 breaks against the French pawn chain.",
    "content": [
      {
        "type": "text",
        "content": "In the French Advance (e5), White has a pawn chain on d4-e5 and Black has pawns on d5-e6. The key principle: attack the base of the pawn chain. For Black, that means c5 (attacking d4) and f6 (attacking e5)."
      },
      {
        "type": "position",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "caption": "The French Advance structure. Black will play c5 to attack the base of White's pawn chain at d4.",
        "arrows": [
          [
            "c7",
            "c5"
          ]
        ],
        "highlights": [
          "d4",
          "e5"
        ]
      },
      {
        "type": "text",
        "content": "The c5 break: this is Black's most common plan. ...c5 attacks d4, the base of White's chain. If White supports it with c3, Black can exchange ...cxd4 cxd4, opening the c-file for counterplay. If White captures dxc5, the e5 pawn loses its support and becomes a target."
      },
      {
        "type": "text",
        "content": "The f6 break: this attacks the head of the chain on e5. After ...f6 exf6, the f-file opens and Black gets active play. But ...f6 also loosens Black's king, so timing is critical: it is best played when the king is safe."
      },
      {
        "type": "text",
        "content": "White's plans: Attack on the kingside where you have more space. Use the f4-f5 push, bring pieces to the kingside via Qg4 or Bd3 aimed at h7. The space advantage on the kingside compensates for Black's queenside activity."
      }
    ],
    "keyPlans": [
      "Black: c5 to attack the base of the chain at d4",
      "Black: f6 to attack the head of the chain at e5",
      "White: kingside attack using the extra space",
      "White: f4 to support e5 and prepare f5",
      "The chain determines where each side plays"
    ]
  },
  {
    "id": "carlsbad-minority",
    "title": "Carlsbad Structure — Minority Attack",
    "structure": "Carlsbad",
    "difficulty": "Advanced",
    "description": "Using the queenside pawn minority to create structural weaknesses.",
    "content": [
      {
        "type": "text",
        "content": "The Carlsbad structure arises from the Queen's Gambit Exchange Variation. In the centre White has pawns on d4 and e3 against Black's d5 and c6. On the queenside White has a pawn minority (a2+b2 vs a7+b7+c6), but this minority is a strategic weapon."
      },
      {
        "type": "position",
        "fen": "r1bqrnk1/pp2bppp/2p2n2/3p2B1/3P4/2NBPN2/PPQ2PPP/R4RK1 w - - 8 11",
        "caption": "The Carlsbad structure. White will play b4-b5 (often with a4 too) to attack the c6 pawn and leave a weakness in Black's pawn structure.",
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
        "content": "The plan: advance b4-b5 (often supported by a4). If White captures bxc6 and Black recaptures ...bxc6, Black is left with a backward c-pawn on the half-open c-file, a permanent target. If Black captures ...cxb5 instead, the d5 pawn becomes isolated. White's rooks then attack the weakness along the c-file."
      },
      {
        "type": "text",
        "content": "Black's counterplay is on the kingside. While White is busy on the queenside, Black should prepare a kingside attack — perhaps with Ne4, Bd6, Qh4, and f5. It's a race between White's structural gains and Black's attacking chances."
      }
    ],
    "keyPlans": [
      "Advance b4-b5 (often with a4) to create structural weaknesses",
      "After bxc6 bxc6, target the backward c6 pawn",
      "Use rooks on the half-open c-file",
      "Be aware of Black's kingside counterplay",
      "This is a slow, strategic plan — patience is key"
    ]
  },
  {
    "id": "maroczy-bind",
    "title": "Maroczy Bind — Space Advantage",
    "structure": "Maroczy Bind",
    "difficulty": "Advanced",
    "description": "Using pawns on c4 and e4 to control the centre and restrict Black.",
    "content": [
      {
        "type": "text",
        "content": "The Maroczy Bind is a powerful pawn formation with pawns on c4 and e4. This controls the d5 square completely, restricting Black's knight and bishop activity. Black is cramped but solid — the challenge for White is to convert the space advantage."
      },
      {
        "type": "position",
        "fen": "r1bq1rk1/pp1pppbp/2n2np1/8/2PNP3/2N1B3/PP3PPP/R2QKB1R w KQ - 5 8",
        "caption": "The Maroczy Bind. White's pawns on c4 and e4 clamp down on d5, so Black has little space and no easy pawn breaks.",
        "highlights": [
          "c4",
          "e4",
          "d5"
        ]
      },
      {
        "type": "text",
        "content": "White's plans: 1) Maintain the bind — never allow d5 by Black. 2) Gradually improve piece placement. 3) If Black plays b5, capture and open the c-file for White's rooks. 4) In some lines, push f4-f5 to open the kingside."
      },
      {
        "type": "text",
        "content": "Black's counterplay: The typical break is b5 or d5. Black should prepare one of these breaks carefully, as premature breaks can backfire. The knight on c6 needs to reach d4 or b4 via creative routes."
      }
    ],
    "keyPlans": [
      "Maintain pawns on c4+e4 to control d5",
      "Never allow Black to play d5 comfortably",
      "Improve pieces gradually while Black is cramped",
      "If b5, capture and use the open c-file",
      "Consider f4-f5 kingside expansion"
    ]
  },
  {
    "id": "sicilian-kingside",
    "title": "Sicilian — Kingside Attack",
    "structure": "Open Sicilian",
    "difficulty": "Advanced",
    "description": "How to launch a kingside attack in typical Sicilian middlegames.",
    "content": [
      {
        "type": "text",
        "content": "In the Open Sicilian, White often has a central e4 pawn and active piece play, while Black has a queenside pawn majority. White's primary plan is a kingside attack, using the central control to support piece activity aimed at the Black king."
      },
      {
        "type": "position",
        "fen": "rnbqk2r/1p2bppp/p2ppn2/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 w kq - 2 8",
        "caption": "A Najdorf with ...e6 (a Scheveningen set-up). White has already castled and can build a kingside attack with Be3, f4, Qe1 and g4.",
        "arrows": [
          [
            "f2",
            "f4"
          ],
          [
            "g2",
            "g4"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Key attacking ideas: 1) f4-f5 to blast open the kingside. 2) g4-g5 to drive away the defending knight on f6. 3) Nd5 sacrifice to destroy Black's coordination. 4) Bg5 to pin the knight and create tactical threats."
      },
      {
        "type": "text",
        "content": "The battle is asymmetric: White attacks the king, Black attacks on the queenside with b5, Bb7, Rc8. Whoever gets there first usually wins. This creates incredibly dynamic, double-edged play."
      }
    ],
    "keyPlans": [
      "f4-f5 to open the kingside",
      "g4-g5 to kick the Nf6 defender",
      "Nd5 sacrifice to shatter the position",
      "Be3 + Qd2 battery on the a7-g1 diagonal",
      "Speed is everything — attack before Black's queenside play arrives"
    ]
  },
  {
    "id": "kid-pawn-storm",
    "title": "King's Indian — Kingside Pawn Storm",
    "structure": "King's Indian",
    "difficulty": "Advanced",
    "description": "The classic f5-g5-h5 kingside attack in the King's Indian.",
    "content": [
      {
        "type": "text",
        "content": "In the King's Indian Classical, after White plays d5, the centre is closed. This signals opposite-side play: White expands on the queenside with c5, Black attacks on the kingside with f5. The result is one of chess's most thrilling race positions."
      },
      {
        "type": "position",
        "fen": "r1bq1rk1/ppp2pbp/2np1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 2 8",
        "caption": "The Classical King's Indian. When White plays d5 (here it gains time by hitting the knight on c6), the centre locks and Black's plan becomes clear: ...f5 to blast open the kingside.",
        "arrows": [
          [
            "d4",
            "d5"
          ],
          [
            "f7",
            "f5"
          ]
        ]
      },
      {
        "type": "text",
        "content": "The f5 break: This is the signature King's Indian move. After f5 exf5 gxf5, the f-file opens and Black's bishop on g7 becomes a monster. The rook comes to f7 or f6, and the queen swings to h4 or g5."
      },
      {
        "type": "text",
        "content": "The g4-h4 advance: After f5, Black often continues with g4 (if White played f3) or f4 followed by g5 and h5. The pawns roll forward like a steamroller. The goal: open lines against White's king."
      },
      {
        "type": "text",
        "content": "Practical tip: Don't be afraid to sacrifice material for the attack. In the King's Indian, a piece sacrifice to open lines (Rxf3, Bxh3, Nxg3) is often sound because the attack is devastating."
      }
    ],
    "keyPlans": [
      "f5 to open the f-file and activate the Bg7",
      "Follow with g4 or f4-g5 to advance the pawn storm",
      "Rf7 or Rf6 to double on the f-file",
      "Queen to h4 or g5 for attacking chances",
      "Don't fear sacrifices — the attack justifies material"
    ]
  },
  {
    "id": "hedgehog-strike",
    "title": "Hedgehog — Waiting and Striking",
    "structure": "Hedgehog",
    "difficulty": "Advanced",
    "description": "How to play the Hedgehog setup and time the key breaks.",
    "content": [
      {
        "type": "text",
        "content": "The Hedgehog is a unique defensive set-up where Black places pawns on a6, b6, d6 and e6, all on Black's third rank. It looks passive, but it's a coiled spring. Black waits for White to overextend, then strikes with ...b5 or ...d5 at the critical moment."
      },
      {
        "type": "position",
        "fen": "rn1q1rk1/1b2bppp/pp1ppn2/8/2PNP3/2N1BP2/PP4PP/R2QKB1R w KQ - 0 9",
        "caption": "A typical Hedgehog structure. Black's pawns sit on a6, b6, d6 and e6 with the pieces flexible behind them. The breaks ...b5 and ...d5 are always in the air.",
        "highlights": [
          "a6",
          "b6",
          "d6",
          "e6"
        ]
      },
      {
        "type": "text",
        "content": "The b5 break: This is the most common Hedgehog strike. After b5 cxb5 axb5, the a- and b-files open and Black's rooks pour through. The timing must be precise — play b5 when White's pieces are committed elsewhere."
      },
      {
        "type": "text",
        "content": "The d5 break: Less common but equally powerful. After d5 exd5 exd5, the position opens completely and Black's pieces (especially the Bb7) come alive. This break is best when White's centre is stretched."
      },
      {
        "type": "text",
        "content": "For White: Use the extra space to manoeuvre pieces to optimal squares. But avoid overextending — if you push too many pawns forward, the position can collapse when Black strikes. Respect the spring."
      }
    ],
    "keyPlans": [
      "Black: Wait patiently and improve piece placement",
      "Black: Strike with b5 or d5 at the perfect moment",
      "Black: After the break, the position opens favorably",
      "White: Use extra space but don't overextend",
      "The Hedgehog is about timing and patience"
    ]
  }
];

export default middlegamePlans;
