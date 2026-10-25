const openings = [
  {
    "id": "italian-game",
    "name": "Italian Game",
    "eco": "C50",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "description": "A classical opening aiming to control the centre and develop quickly.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White occupies the centre with a pawn, opening lines for the bishop and queen. This is the most popular first move in chess.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black mirrors White's strategy, claiming equal space in the centre. This leads to open, tactical games.",
        "highlights": [
          "e5"
        ]
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "The knight develops to its most natural square, attacking the e5 pawn and preparing to castle kingside.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "Black defends the e5 pawn with the knight while developing a piece. The most natural response.",
        "arrows": [
          [
            "c6",
            "e5"
          ]
        ]
      },
      {
        "move": "Bc4",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        "explanation": "The Italian move! The bishop targets the f7 pawn, the weakest point in Black's position. White prepares to castle and builds pressure on the centre.",
        "arrows": [
          [
            "c4",
            "f7"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Rapid development of minor pieces toward the centre",
      "Pressure on the f7 square through Bc4",
      "Prepare kingside castling for king safety",
      "Control of the d5 square",
      "Plans include d3 followed by c3 and d4 to build a strong centre"
    ]
  },
  {
    "id": "london-system",
    "name": "London System",
    "eco": "D02",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "description": "A solid, easy-to-learn system that works against almost any Black setup.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White starts with a queen pawn opening, controlling the centre and opening the diagonal for the dark-squared bishop."
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black mirrors the pawn move, creating a symmetrical centre."
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "White develops the knight naturally before committing the bishop, keeping options flexible."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "Black develops symmetrically."
      },
      {
        "move": "Bf4",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3",
        "explanation": "The London move! The bishop goes to f4 before playing e3, ensuring it stays active outside the pawn chain. This is the hallmark of the London System.",
        "highlights": [
          "f4"
        ]
      }
    ],
    "keyIdeas": [
      "Develop the dark-squared bishop to f4 before playing e3",
      "Build a solid pawn triangle: d4-e3-c3",
      "The setup is flexible and works against many different Black responses",
      "Castle kingside and gradually improve piece placement",
      "Very popular at all levels due to its simplicity and reliability"
    ]
  },
  {
    "id": "scotch-game",
    "name": "Scotch Game",
    "eco": "C45",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "description": "An aggressive alternative to the Italian and Ruy López, immediately challenging the centre.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White occupies the centre."
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black mirrors with a central pawn."
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "Developing the knight and attacking e5.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "Defending e5 with the knight."
      },
      {
        "move": "d4",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
        "explanation": "The Scotch! White immediately strikes in the centre rather than developing the bishop first. This leads to open, tactical positions where both sides must play actively.",
        "arrows": [
          [
            "d4",
            "e5"
          ]
        ],
        "highlights": [
          "d4"
        ]
      }
    ],
    "keyIdeas": [
      "Immediate central confrontation — no slow manoeuvring",
      "After exd4 Nxd4, White has a strong centralised knight",
      "Leads to open games with active piece play for both sides",
      "Kasparov used this opening to great effect in his world championship matches",
      "White aims for quick development and initiative"
    ]
  },
  {
    "id": "scandinavian",
    "name": "Scandinavian Defence",
    "eco": "B01",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "description": "A direct approach — Black immediately challenges e4 with the queen pawn.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White claims the centre."
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black immediately challenges the e4 pawn. The most direct approach possible.",
        "arrows": [
          [
            "d5",
            "e4"
          ]
        ]
      },
      {
        "move": "exd5",
        "fen": "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White captures. Now Black must decide: recapture with the queen (main line) or play Nf6 (Modern Scandinavian)."
      },
      {
        "move": "Qxd5",
        "fen": "rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "The classic Scandinavian. The queen recaptures but will be kicked by Nc3. Black must spend a tempo moving the queen again, but gets a clear, simple position with no bad pieces.",
        "highlights": [
          "d5"
        ]
      }
    ],
    "keyIdeas": [
      "Black gets easy development and no bad bishop",
      "The queen will typically go to a5 or d6 after Nc3",
      "Simple to learn — very few theoretical lines to memorize",
      "Black's position is solid but slightly passive due to the tempo loss",
      "A practical weapon at all levels, especially in rapid and blitz"
    ]
  },
  {
    "id": "ruy-lopez",
    "name": "Ruy López",
    "eco": "C60",
    "difficulty": "Intermediate",
    "eloBand": "1200-1600",
    "description": "One of the oldest and most respected openings, applying pressure on Black's centre.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White claims the centre and opens lines for development."
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black establishes a symmetrical pawn centre."
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "Develops the knight with tempo by attacking e5.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "Defends e5 and develops a piece toward the centre."
      },
      {
        "move": "Bb5",
        "fen": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        "explanation": "The Ruy López! The bishop attacks the knight that defends e5, creating long-term strategic pressure. White doesn't win a pawn immediately (after Bxc6 dxc6 Nxe5, Black can win the pawn back with ...Qd4), but builds lasting tension.",
        "arrows": [
          [
            "b5",
            "c6"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Indirect pressure on the e5 pawn by attacking its defender, the knight on c6",
      "White maintains flexibility — can exchange on c6 or retreat to a4",
      "Long-term strategic plans with d3, c3, and eventual d4",
      "The Morphy Defence (a6) is Black's most common response",
      "One of the richest openings in chess theory"
    ]
  },
  {
    "id": "french-defence",
    "name": "French Defence",
    "eco": "C00",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "description": "A solid, strategic defence that creates a strong pawn chain.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White claims the centre."
      },
      {
        "move": "e6",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The French Defence. Black prepares to challenge the centre with d5 on the next move, building a solid pawn chain. The downside is that the light-squared bishop is blocked behind the pawn chain."
      },
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White builds a classical pawn centre with pawns on e4 and d4."
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black challenges the centre immediately. This creates tension — White must decide how to handle the d5 pawn. The main lines are e5 (Advance), exd5 (Exchange), and Nc3/Nd2 (Classical/Tarrasch).",
        "arrows": [
          [
            "d5",
            "e4"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Black builds a solid pawn chain on e6-d5",
      "The \"French bishop\" on c8 is often a problem piece — Black seeks to activate it",
      "Black often attacks White's pawn chain base with c5",
      "In the Advance variation (e5), play revolves around White's space vs Black's counterplay",
      "A favourite of strategic players like Botvinnik and Petrosian"
    ]
  },
  {
    "id": "queens-gambit",
    "name": "Queen's Gambit",
    "eco": "D06",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "description": "A classical opening offering a pawn to gain central control.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White opens with the queen pawn, controlling the centre."
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black stakes a claim in the centre, creating a symmetrical pawn structure."
      },
      {
        "move": "c4",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "The Queen's Gambit! White offers the c4 pawn to lure Black's d5 pawn away from the centre. It's not a true gambit — White can always regain the pawn. Black can accept (dxc4) or decline (e6 or c6).",
        "arrows": [
          [
            "c4",
            "d5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "White aims for a strong central pawn on d4 without a Black pawn on d5",
      "Not a true gambit — White can recapture the pawn easily",
      "Queen's Gambit Declined (e6) leads to solid, strategic positions",
      "Queen's Gambit Accepted (dxc4) gives White a central majority but Black develops freely",
      "The Slav Defence (c6) is a solid alternative for Black"
    ]
  },
  {
    "id": "caro-kann",
    "name": "Caro-Kann Defence",
    "eco": "B10",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "description": "A solid, reliable defence that avoids the bad bishop problem of the French.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White claims the centre."
      },
      {
        "move": "c6",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The Caro-Kann! Black prepares d5 while keeping the c8 bishop's diagonal open — solving the main problem of the French Defence.",
        "arrows": [
          [
            "c6",
            "d5"
          ]
        ]
      },
      {
        "move": "d4",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White builds the ideal pawn centre."
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black challenges the centre. Unlike the French, the light-squared bishop is not blocked and can develop to f5 or g4. This is the key advantage of the Caro-Kann.",
        "arrows": [
          [
            "c8",
            "f5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Black gets a solid pawn structure with easy piece development",
      "The light-squared bishop can develop actively to f5 or g4",
      "Black's position is solid but slightly passive compared to the Sicilian",
      "Main lines are the Classical (Nc3), Advance (e5), and Exchange (exd5)",
      "A favourite of Karpov and other positional players"
    ]
  },
  {
    "id": "petroff-defence",
    "name": "Petroff Defence",
    "eco": "C42",
    "difficulty": "Intermediate",
    "eloBand": "1200-1600",
    "description": "A solid, symmetrical defence that aims for equality and a drawish middlegame.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White claims the centre."
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Symmetrical centre."
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "White attacks e5.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "The Petroff! Instead of defending e5, Black counterattacks e4. This symmetrical approach leads to solid, equal positions. A favourite of top-level players seeking a safe draw with Black.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ],
        "highlights": [
          "f6"
        ]
      }
    ],
    "keyIdeas": [
      "Black counterattacks instead of defending — symmetry is the theme",
      "After Nxe5, Black should NOT play Nxe4 immediately but first d6 to drive the knight back",
      "Extremely solid — one of the hardest openings for White to get an advantage against",
      "Popular at the highest level, used extensively by Caruana and Kramnik",
      "Drawish reputation, but sharp lines exist in the Stafford Gambit sidelines"
    ]
  },
  {
    "id": "pirc-defence",
    "name": "Pirc Defence",
    "eco": "B07",
    "difficulty": "Intermediate",
    "eloBand": "1200-1600",
    "description": "A hypermodern defence allowing White a big centre, then counterattacking.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White claims the centre."
      },
      {
        "move": "d6",
        "fen": "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black plays modestly, preparing to develop the knight to f6 and fianchetto the bishop to g7. This is the hypermodern approach — let White build a centre, then attack it."
      },
      {
        "move": "d4",
        "fen": "rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White builds the ideal pawn centre."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3",
        "explanation": "The knight attacks e4, putting immediate pressure on the centre."
      },
      {
        "move": "Nc3",
        "fen": "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        "explanation": "White defends e4. Black will now typically play g6 and Bg7, fianchettoing the bishop to target the centre from afar.",
        "arrows": [
          [
            "c3",
            "e4"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Black concedes space to develop flexibly behind the pawn structure",
      "The fianchettoed bishop on g7 targets the long diagonal",
      "Black often counterattacks with e5 or c5 at the right moment",
      "Can transpose to the King's Indian or Modern Defence",
      "Requires understanding of when to strike against White's centre"
    ]
  },
  {
    "id": "english-opening",
    "name": "English Opening",
    "eco": "A20",
    "difficulty": "Intermediate",
    "eloBand": "1200-1600",
    "description": "A flexible flank opening that controls d5 without committing to a central pawn structure.",
    "moves": [
      {
        "move": "c4",
        "fen": "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "The English! White controls d5 from the flank rather than occupying the centre immediately. This is a flexible, positional approach.",
        "highlights": [
          "c4"
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black occupies the centre. This is the Reversed Sicilian setup — White plays a Sicilian Defence with an extra tempo."
      },
      {
        "move": "Nc3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq - 1 2",
        "explanation": "White develops the knight toward the centre."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR w KQkq - 2 3",
        "explanation": "Black develops naturally."
      },
      {
        "move": "g3",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2P5/2N3P1/PP1PPP1P/R1BQKBNR b KQkq - 0 3",
        "explanation": "White prepares to fianchetto the bishop to g2, creating pressure on the long diagonal.",
        "arrows": [
          [
            "f1",
            "g2"
          ],
          [
            "g2",
            "b7"
          ]
        ]
      },
      {
        "move": "d5",
        "fen": "rnbqkb1r/ppp2ppp/5n2/3pp3/2P5/2N3P1/PP1PPP1P/R1BQKBNR w KQkq - 0 4",
        "explanation": "Black strikes in the centre. After cxd5 Nxd5, Black has active piece play. The position is rich and strategic."
      }
    ],
    "keyIdeas": [
      "Flexible — can transpose into many different structures",
      "The fianchettoed bishop on g2 is a long-term asset",
      "White avoids early central commitments, keeping options open",
      "Often leads to strategic, manoeuvring positions",
      "A favourite of Botvinnik, Karpov, and many modern GMs"
    ]
  },
  {
    "id": "dutch-defence",
    "name": "Dutch Defence",
    "eco": "A80",
    "difficulty": "Intermediate",
    "eloBand": "1200-1600",
    "description": "An aggressive defence aiming for kingside attacking chances from the start.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White opens with the queen pawn."
      },
      {
        "move": "f5",
        "fen": "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The Dutch Defence! Black immediately stakes a claim on the e4 square and signals aggressive kingside intentions. It's risky but creates unbalanced, fighting positions.",
        "highlights": [
          "f5"
        ],
        "arrows": [
          [
            "f5",
            "e4"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Black controls e4 and prepares a kingside attack",
      "Three main systems: Stonewall (d5+e6+f5), Leningrad (g6+Bg7), and Classical (e6+Be7)",
      "The Stonewall gives Black a solid wall of pawns but leaves the light-squared bishop on c8 passive",
      "The Leningrad Dutch combines the fianchetto with f5 for dynamic play",
      "Risky — the weakened kingside can be exploited if Black is not careful"
    ]
  },
  {
    "id": "slav-defence",
    "name": "Slav Defence",
    "eco": "D10",
    "difficulty": "Intermediate",
    "eloBand": "1200-1600",
    "description": "A solid reply to the Queen's Gambit that keeps the light-squared bishop active.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White opens with the queen pawn."
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black claims the centre."
      },
      {
        "move": "c4",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "The Queen's Gambit."
      },
      {
        "move": "c6",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "The Slav! Black supports d5 with c6 instead of e6. The crucial difference: the light-squared bishop is NOT blocked and can develop actively to f5 or g4. This solves the main problem of the QGD.",
        "arrows": [
          [
            "c8",
            "f5"
          ]
        ],
        "highlights": [
          "c6"
        ]
      }
    ],
    "keyIdeas": [
      "The light-squared bishop stays active — can go to f5 or g4",
      "Solid pawn structure: d5+c6 is very hard to break down",
      "Black can accept the gambit with dxc4 (Slav Accepted) or decline with e6",
      "The Semi-Slav (c6+e6) is a hybrid that leads to very sharp play",
      "A staple defence for world champions including Euwe and Anand"
    ]
  },
  {
    "id": "vienna-game",
    "name": "Vienna Game",
    "eco": "C25",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "description": "A romantic-era opening preparing f4 to build a strong centre.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White claims the centre."
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Symmetrical centre."
      },
      {
        "move": "Nc3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
        "explanation": "The Vienna! Instead of Nf3, White develops the knight to c3 first, preparing f4 on the next move. This is a \"delayed King's Gambit\" approach.",
        "highlights": [
          "c3"
        ]
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3",
        "explanation": "Black develops and attacks e4."
      },
      {
        "move": "f4",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq - 0 3",
        "explanation": "The Vienna Gambit! White offers the f-pawn to blast open the centre. If Black takes with ...exf4, White plays e5 to kick the knight and gain space; the main reply is the central counter ...d5. Very aggressive.",
        "arrows": [
          [
            "f4",
            "e5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "A \"prepared\" King's Gambit — Nc3 supports e4 before playing f4",
      "Leads to sharp, tactical positions with attacking chances for White",
      "If Black declines with d5, the position becomes more strategic",
      "White aims for quick development and kingside attack",
      "Less theoretically explored than mainline openings — a practical surprise weapon"
    ]
  },
  {
    "id": "sicilian-najdorf",
    "name": "Sicilian Defence — Najdorf",
    "eco": "B90",
    "difficulty": "Advanced",
    "eloBand": "1600+",
    "description": "The sharpest and most popular defence to 1.e4, favoured by world champions.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White occupies the centre."
      },
      {
        "move": "c5",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The Sicilian Defence! Black fights for the d4 square asymmetrically, avoiding a symmetrical pawn structure. This leads to unbalanced, fighting games."
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "White develops naturally, preparing d4."
      },
      {
        "move": "d6",
        "fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        "explanation": "Black controls the e5 square and opens the diagonal for the c8 bishop, preparing ...Nf6 without the knight being kicked by e5."
      },
      {
        "move": "d4",
        "fen": "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
        "explanation": "White strikes in the centre, challenging Black's c5 pawn. This creates an open position."
      },
      {
        "move": "cxd4",
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
        "explanation": "Black captures, opening the c-file which will become a key asset for Black's counterplay."
      },
      {
        "move": "Nxd4",
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
        "explanation": "White recaptures with the knight, which sits powerfully in the centre."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5",
        "explanation": "Black attacks the e4 pawn and develops a piece. This is the most natural square for the knight."
      },
      {
        "move": "Nc3",
        "fen": "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5",
        "explanation": "White defends e4 and develops the knight to its ideal square."
      },
      {
        "move": "a6",
        "fen": "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        "explanation": "The Najdorf move! This modest pawn move is incredibly flexible — it prevents Nb5, prepares b5 expansion, and keeps all options open. Bobby Fischer's weapon of choice.",
        "highlights": [
          "a6"
        ]
      }
    ],
    "keyIdeas": [
      "Black gets an asymmetric pawn structure with chances on the queenside",
      "The c-file becomes a crucial avenue for Black's rooks",
      "a6 prepares queenside expansion with b5 and Bb7",
      "Extremely rich in theory with many sharp variations (Be2, Bg5, Bc4, f3)",
      "Black accepts a slightly cramped position for long-term dynamic chances"
    ]
  },
  {
    "id": "kings-indian",
    "name": "King's Indian Defence",
    "eco": "E60",
    "difficulty": "Advanced",
    "eloBand": "1600+",
    "description": "A hypermodern defence where Black lets White build a centre then attacks it.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White opens with the queen pawn."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "explanation": "Black develops the knight and delays committing to a pawn structure, a hypermodern approach."
      },
      {
        "move": "c4",
        "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White grabs more space in the centre, establishing the classical d4+c4 pawn duo."
      },
      {
        "move": "g6",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black prepares to fianchetto the bishop to g7, from where it will exert enormous pressure on the long diagonal."
      },
      {
        "move": "Nc3",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
        "explanation": "White develops naturally, defending the centre."
      },
      {
        "move": "Bg7",
        "fen": "rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
        "explanation": "The fianchettoed bishop is the pride of the King's Indian. Once the f6 knight moves, it will aim along the long diagonal at the centre and the queenside.",
        "highlights": [
          "g7"
        ]
      },
      {
        "move": "e4",
        "fen": "rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4",
        "explanation": "White builds a massive pawn centre. This looks imposing, but Black has plans to undermine it."
      },
      {
        "move": "d6",
        "fen": "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 5",
        "explanation": "Black completes the King's Indian setup. The plan is to castle, then counterattack with e5 or c5.",
        "arrows": [
          [
            "e7",
            "e5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Black concedes the centre initially, then counterattacks with e5 or c5",
      "The Bg7 is a powerful piece on the long diagonal",
      "After e5, if White plays d5, Black attacks on the kingside with f5",
      "If the centre stays open, Black gets dynamic piece play",
      "Kasparov and Fischer used this opening at the highest level"
    ]
  },
  {
    "id": "grunfeld-defence",
    "name": "Grunfeld Defence",
    "eco": "D80",
    "difficulty": "Advanced",
    "eloBand": "1600+",
    "description": "A dynamic defence that invites White to build a centre and then destroys it.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White opens with the queen pawn."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "explanation": "Black develops flexibly."
      },
      {
        "move": "c4",
        "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White expands in the centre."
      },
      {
        "move": "g6",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black prepares the fianchetto — similar to the King's Indian."
      },
      {
        "move": "Nc3",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
        "explanation": "White develops toward the centre."
      },
      {
        "move": "d5",
        "fen": "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4",
        "explanation": "The Grunfeld! Instead of the King's Indian's d6, Black immediately challenges the centre. After cxd5 Nxd5, White gets a big centre but Black will systematically attack it with c5, Bg7, Nc6, and other moves.",
        "arrows": [
          [
            "d5",
            "c4"
          ],
          [
            "d5",
            "e4"
          ]
        ],
        "highlights": [
          "d5"
        ]
      }
    ],
    "keyIdeas": [
      "Black sacrifices central space to create dynamic counterplay against White's centre",
      "The Bg7 becomes a monster piece targeting d4 and the queenside",
      "Black's plan: c5 to undermine d4, Nc6 to pressure d4, and e5 at the right moment",
      "White must defend the centre carefully — if it collapses, Black gets a huge advantage",
      "Kasparov's favourite defence — incredibly rich in theory and ideas"
    ]
  },
  {
    "id": "nimzo-indian",
    "name": "Nimzo-Indian Defence",
    "eco": "E20",
    "difficulty": "Advanced",
    "eloBand": "1600+",
    "description": "One of the most respected defences in chess — controlling e4 by pinning the knight.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White opens with the queen pawn."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "explanation": "Black develops and prevents e4."
      },
      {
        "move": "c4",
        "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White expands."
      },
      {
        "move": "e6",
        "fen": "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black solidifies the centre and opens the diagonal for the dark-squared bishop."
      },
      {
        "move": "Nc3",
        "fen": "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
        "explanation": "White develops the knight."
      },
      {
        "move": "Bb4",
        "fen": "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
        "explanation": "The Nimzo-Indian! Black pins the knight on c3, preventing e4. This is one of the most strategically rich openings in chess. Black is willing to give up the bishop pair in exchange for doubling White's c-pawns and controlling the centre.",
        "arrows": [
          [
            "b4",
            "c3"
          ]
        ],
        "highlights": [
          "b4",
          "c3"
        ]
      }
    ],
    "keyIdeas": [
      "The pin on Nc3 prevents e4, controlling the centre indirectly",
      "If White plays a3 Bxc3+ bxc3, White gets the bishop pair but doubled c-pawns",
      "The doubled c-pawns can be both a strength (central control) and weakness (structural)",
      "One of the deepest openings in chess — every world champion has faced it",
      "Black gets flexible development and often plays d5 or c5 to challenge the centre"
    ]
  },
  {
    "id": "modern-benoni",
    "name": "Modern Benoni",
    "eco": "A60",
    "difficulty": "Advanced",
    "eloBand": "1600+",
    "description": "A sharp, unbalanced defence creating asymmetric pawn structures.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White opens with the queen pawn."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "explanation": "Black develops."
      },
      {
        "move": "c4",
        "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White expands."
      },
      {
        "move": "c5",
        "fen": "rnbqkb1r/pp1ppppp/5n2/2p5/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black challenges d4 immediately with c5."
      },
      {
        "move": "d5",
        "fen": "rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3",
        "explanation": "White advances, creating asymmetry. The pawn on d5 gives White space but also creates a target."
      },
      {
        "move": "e6",
        "fen": "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq - 0 4",
        "explanation": "Black undermines the d5 pawn."
      },
      {
        "move": "Nc3",
        "fen": "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 4",
        "explanation": "White develops."
      },
      {
        "move": "exd5",
        "fen": "rnbqkb1r/pp1p1ppp/5n2/2pp4/2P5/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 5",
        "explanation": "Black captures, opening the e-file."
      },
      {
        "move": "cxd5",
        "fen": "rnbqkb1r/pp1p1ppp/5n2/2pP4/8/2N5/PP2PPPP/R1BQKBNR b KQkq - 0 5",
        "explanation": "White recaptures, maintaining the space advantage."
      },
      {
        "move": "d6",
        "fen": "rnbqkb1r/pp3ppp/3p1n2/2pP4/8/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 6",
        "explanation": "The Benoni structure is established. Black has a queenside pawn majority and will play b5 expansion, while White has a central space advantage and kingside chances.",
        "arrows": [
          [
            "b7",
            "b5"
          ]
        ],
        "highlights": [
          "c5",
          "d6"
        ]
      }
    ],
    "keyIdeas": [
      "Asymmetric pawn structure — Black's queenside majority vs White's central space",
      "Black plays for b5 expansion and activity on the queenside",
      "White aims for e4-e5 to open the centre and attack",
      "The d6 pawn can become a weakness but also supports e5",
      "Dynamic, double-edged play — beloved by Tal and other attacking players"
    ]
  },
  {
    "id": "alekhine-defence",
    "name": "Alekhine's Defence",
    "eco": "B02",
    "difficulty": "Advanced",
    "eloBand": "1200-1600",
    "description": "A provocative defence that invites White to overextend the centre pawns.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White claims the centre."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2",
        "explanation": "Alekhine's Defence! Black immediately attacks e4 with the knight, provoking White to advance. The idea is to make White overextend.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ],
        "highlights": [
          "f6"
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkb1r/pppppppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White advances, attacking the knight and gaining space. But the pawn has left its ideal e4 square and may become a target later."
      },
      {
        "move": "Nd5",
        "fen": "rnbqkb1r/pppppppp/8/3nP3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 1 3",
        "explanation": "The knight retreats to d5, a strong central square. Black will continue provoking White's pawns with d6 and c5."
      },
      {
        "move": "d4",
        "fen": "rnbqkb1r/pppppppp/8/3nP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "explanation": "White builds a massive centre — but it's a target. Black's entire strategy revolves around undermining these pawns."
      },
      {
        "move": "d6",
        "fen": "rnbqkb1r/ppp1pppp/3p4/3nP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4",
        "explanation": "Black strikes at the e5 pawn. If White plays exd6, the big centre is reduced. If White keeps the pawn on e5 (for example with Nf3 or c4), Black keeps attacking it with pieces and pawns.",
        "arrows": [
          [
            "d6",
            "e5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Black deliberately provokes White's pawns to overextend",
      "White's big centre looks imposing but can become a liability",
      "Black attacks the centre with d6, c5, and piece pressure",
      "Named after world champion Alexander Alekhine",
      "Requires precise understanding of when the centre collapses"
    ]
  },
  {
    "id": "giuoco-piano",
    "name": "Giuoco Piano (c3 and d4 plan)",
    "eco": "C54",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "side": "white",
    "description": "The Italian Game with a clear plan: c3 and d4 to build a big pawn centre and gain space.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes a share of the centre and opens lines for the queen and the light-squared bishop.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black claims an equal share of the centre.",
        "highlights": [
          "e5"
        ]
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "The knight develops with a threat: it attacks the e5 pawn.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "Black defends e5 with a developing move.",
        "arrows": [
          [
            "c6",
            "e5"
          ]
        ]
      },
      {
        "move": "Bc4",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        "explanation": "The bishop goes to its most active diagonal, aiming at f7 — the square next to Black's king that only the king defends.",
        "arrows": [
          [
            "c4",
            "f7"
          ]
        ]
      },
      {
        "move": "Bc5",
        "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        "explanation": "Black copies the idea: the bishop aims at f2. This is the Giuoco Piano, Italian for \"quiet game\".",
        "arrows": [
          [
            "c5",
            "f2"
          ]
        ]
      },
      {
        "move": "c3",
        "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4",
        "explanation": "The key move of this plan. c3 prepares d4, so White can put two pawns side by side in the centre. When d4 comes it will also attack the bishop on c5.",
        "arrows": [
          [
            "c3",
            "d4"
          ]
        ]
      },
      {
        "move": "Nf6",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5",
        "explanation": "Black develops and counter-attacks the e4 pawn, which is now a little loose.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ]
      },
      {
        "move": "d4",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq - 0 5",
        "explanation": "White strikes in the centre. The d4 pawn attacks both e5 and the bishop on c5, so Black must react straight away.",
        "arrows": [
          [
            "d4",
            "c5"
          ],
          [
            "d4",
            "e5"
          ]
        ]
      },
      {
        "move": "exd4",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2R w KQkq - 0 6",
        "explanation": "Black takes. Letting White play dxe5 would kick the f6 knight and leave Black cramped."
      },
      {
        "move": "cxd4",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6",
        "explanation": "Recapturing with the c-pawn is the whole point of c3: White now has the ideal centre with pawns on e4 and d4.",
        "highlights": [
          "d4",
          "e4"
        ]
      },
      {
        "move": "Bb4+",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP3PPP/RNBQK2R w KQkq - 1 7",
        "explanation": "The bishop is attacked, so Black retreats with check. A common mistake at club level is a passive retreat like ...Bb6, which lets White push d5 or e5 and gain lots of space for free.",
        "arrows": [
          [
            "b4",
            "e1"
          ]
        ]
      },
      {
        "move": "Bd2",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP1B1PPP/RN1QK2R b KQkq - 2 7",
        "explanation": "The simplest way to block the check. If Black trades with ...Bxd2+, White recaptures with the b1 knight and the centre stays strong. Black's best freeing move then is ...d5, hitting the centre straight back — so don't let your guard down.",
        "arrows": [
          [
            "d2",
            "b4"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "c3 prepares d4 to build a two-pawn centre on e4 and d4",
      "When d4 arrives it hits the c5 bishop, so Black has to spend time on it",
      "Recapture on d4 with the c-pawn to keep the big centre",
      "If Black is passive, push d5 or e5 to gain space",
      "Black's best antidote is a quick ...d5 strike — be ready for it"
    ]
  },
  {
    "id": "four-knights",
    "name": "Four Knights Game",
    "eco": "C48",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "side": "white",
    "description": "Both sides develop knights first, then castle quickly. Solid, logical and easy to learn.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre and frees the bishop and queen.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black matches White in the centre.",
        "highlights": [
          "e5"
        ]
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "Develops and attacks the e5 pawn.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "Defends e5 while developing.",
        "arrows": [
          [
            "c6",
            "e5"
          ]
        ]
      },
      {
        "move": "Nc3",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 3 3",
        "explanation": "White calmly develops another knight and defends e4 in advance. \"Knights before bishops\" is a good rule of thumb, because you usually know where knights belong before you know where bishops do.",
        "arrows": [
          [
            "c3",
            "e4"
          ]
        ]
      },
      {
        "move": "Nf6",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4",
        "explanation": "Black does the same. All four knights are out — hence the name."
      },
      {
        "move": "Bb5",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 4",
        "explanation": "The Spanish Four Knights. The bishop puts pressure on the c6 knight, which is the piece defending e5.",
        "arrows": [
          [
            "b5",
            "c6"
          ]
        ]
      },
      {
        "move": "Bb4",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/1B2p3/1b2P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5",
        "explanation": "Black mirrors White, pressuring the c3 knight that defends e4.",
        "arrows": [
          [
            "b4",
            "c3"
          ]
        ]
      },
      {
        "move": "O-O",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/1B2p3/1b2P3/2N2N2/PPPP1PPP/R1BQ1RK1 b kq - 7 5",
        "explanation": "White gets the king safe before anything else. Castling early is one of the most useful habits at this level."
      },
      {
        "move": "O-O",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/1B2p3/1b2P3/2N2N2/PPPP1PPP/R1BQ1RK1 w - - 8 6",
        "explanation": "Black castles too. The position is balanced and both kings are tucked away."
      },
      {
        "move": "d3",
        "fen": "r1bq1rk1/pppp1ppp/2n2n2/1B2p3/1b2P3/2NP1N2/PPP2PPP/R1BQ1RK1 b - - 0 6",
        "explanation": "White firmly supports e4 and opens a path for the c1 bishop, which can come to g5 to pin the f6 knight.",
        "arrows": [
          [
            "d3",
            "e4"
          ]
        ]
      },
      {
        "move": "d6",
        "fen": "r1bq1rk1/ppp2ppp/2np1n2/1B2p3/1b2P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7",
        "explanation": "Black does the same, supporting e5 and freeing the c8 bishop. A typical mistake for either side is to keep copying for too long — sooner or later one player must find a plan of their own, such as Bg5 and Nd5 for White.",
        "arrows": [
          [
            "d6",
            "e5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Develop knights first, then bishops, then castle",
      "Bb5 pressures the knight that guards e5",
      "Castle early — symmetrical positions punish the side whose king is stuck",
      "d3 supports e4 and frees the c1 bishop for Bg5",
      "Don't copy your opponent forever; look for Bg5 and Nd5 ideas"
    ]
  },
  {
    "id": "bishops-opening",
    "name": "Bishop's Opening",
    "eco": "C24",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "side": "white",
    "description": "White develops the bishop first, aiming at f7, and keeps the f-pawn and knight flexible.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes a central square.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black answers symmetrically.",
        "highlights": [
          "e5"
        ]
      },
      {
        "move": "Bc4",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 1 2",
        "explanation": "The bishop comes out first and immediately aims at f7. This is the same diagonal used for Scholar's Mate — but here we use it for proper development, not a cheap queen attack.",
        "arrows": [
          [
            "c4",
            "f7"
          ]
        ]
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
        "explanation": "The best reply: Black develops and attacks the e4 pawn.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ]
      },
      {
        "move": "d3",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR b KQkq - 0 3",
        "explanation": "A calm, solid way to defend e4. It also opens the diagonal for the c1 bishop.",
        "arrows": [
          [
            "d3",
            "e4"
          ]
        ]
      },
      {
        "move": "Bc5",
        "fen": "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/3P4/PPP2PPP/RNBQK1NR w KQkq - 1 4",
        "explanation": "Black develops actively, aiming at f2.",
        "arrows": [
          [
            "c5",
            "f2"
          ]
        ]
      },
      {
        "move": "Nf3",
        "fen": "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 2 4",
        "explanation": "Develops towards the centre, attacks e5 and prepares to castle.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "d6",
        "fen": "rnbqk2r/ppp2ppp/3p1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "explanation": "Black defends e5 with a pawn and frees the c8 bishop.",
        "arrows": [
          [
            "d6",
            "e5"
          ]
        ]
      },
      {
        "move": "c3",
        "fen": "rnbqk2r/ppp2ppp/3p1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R b KQkq - 0 5",
        "explanation": "White prepares d4 later on. It also lets the bishop drop back to b3 and then c2 if Black ever chases it with ...d5 or ...b5, so it stays on a useful diagonal."
      },
      {
        "move": "O-O",
        "fen": "rnbq1rk1/ppp2ppp/3p1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQ - 1 6",
        "explanation": "Black puts the king safe."
      },
      {
        "move": "O-O",
        "fen": "rnbq1rk1/ppp2ppp/3p1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 b - - 2 6",
        "explanation": "White does the same. This is a solid, quiet position where White slowly builds up. A common mistake is to rush with Qh5 or Ng5 attacks before your pieces are ready — a well-defended f7 will not fall."
      }
    ],
    "keyIdeas": [
      "The bishop on c4 eyes f7 from move two",
      "d3 is a solid way to defend e4 after ...Nf6",
      "c3 gives the bishop a retreat and prepares d4",
      "Castle before starting any attack",
      "Avoid Scholar's Mate tricks — they fail against sensible defence and lose time"
    ]
  },
  {
    "id": "philidor-defence",
    "name": "Philidor Defence",
    "eco": "C41",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "side": "black",
    "description": "A solid set-up for Black: hold the e5 pawn firmly with ...d6, develop quietly and castle.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White occupies the centre.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black takes a share of the centre.",
        "highlights": [
          "e5"
        ]
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "White attacks the e5 pawn.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "d6",
        "fen": "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        "explanation": "The Philidor. Instead of ...Nc6, Black defends e5 with a pawn. It is solid but a little passive — the f8 bishop will develop to e7.",
        "arrows": [
          [
            "d6",
            "e5"
          ]
        ]
      },
      {
        "move": "d4",
        "fen": "rnbqkbnr/ppp2ppp/3p4/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
        "explanation": "White challenges e5 at once. Watch out for an early ...Bg4 pin here: 3...Bg4?! 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 attacks b7 and lines up with the bishop against f7, and Black loses material.",
        "arrows": [
          [
            "d4",
            "e5"
          ]
        ]
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/ppp2ppp/3p1n2/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 1 4",
        "explanation": "Black develops and attacks e4, so White must look after that pawn.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ]
      },
      {
        "move": "Nc3",
        "fen": "rnbqkb1r/ppp2ppp/3p1n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 2 4",
        "explanation": "White defends e4 with a developing move.",
        "arrows": [
          [
            "c3",
            "e4"
          ]
        ]
      },
      {
        "move": "Nbd7",
        "fen": "r1bqkb1r/pppn1ppp/3p1n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 3 5",
        "explanation": "The Hanham set-up. The knight adds a second defender to e5, so Black can keep the pawn there instead of giving up the centre.",
        "arrows": [
          [
            "d7",
            "e5"
          ]
        ]
      },
      {
        "move": "Bc4",
        "fen": "r1bqkb1r/pppn1ppp/3p1n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R b KQkq - 4 5",
        "explanation": "The bishop aims at f7, Black's sore spot.",
        "arrows": [
          [
            "c4",
            "f7"
          ]
        ]
      },
      {
        "move": "Be7",
        "fen": "r1bqk2r/pppnbppp/3p1n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R w KQkq - 5 6",
        "explanation": "Black develops the bishop and gets ready to castle. Getting the king out of the centre quickly is the main task."
      },
      {
        "move": "O-O",
        "fen": "r1bqk2r/pppnbppp/3p1n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQ1RK1 b kq - 6 6",
        "explanation": "White castles."
      },
      {
        "move": "O-O",
        "fen": "r1bq1rk1/pppnbppp/3p1n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQ1RK1 w - - 7 7",
        "explanation": "Black castles too. Black has a compact position; typical plans are ...c6, ...b5 to push the bishop back, and ...exd4 at a good moment. Don't panic about being a bit cramped — the position is hard to break down."
      }
    ],
    "keyIdeas": [
      "...d6 supports e5 with a pawn instead of a knight",
      "Hanham set-up: ...Nf6, ...Nbd7, ...Be7 and castle",
      "Avoid the early ...Bg4 pin — after dxe5, Bc4 and Qb3, f7 and b7 are both hanging",
      "Keep e5 defended twice so White cannot win it",
      "Later, ...c6 and ...b5 gain space on the queenside"
    ]
  },
  {
    "id": "colle-system",
    "name": "Colle System",
    "eco": "D05",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "side": "white",
    "description": "A simple set-up for White against ...d5: develop behind a solid pawn chain, castle, then break with e4.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre with the queen's pawn.",
        "highlights": [
          "d4"
        ]
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black takes an equal share.",
        "highlights": [
          "d5"
        ]
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "A flexible developing move that controls e5.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "Black develops symmetrically and controls e4.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ]
      },
      {
        "move": "e3",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
        "explanation": "The Colle move. White builds a solid pawn chain and opens the diagonal for the f1 bishop. The c1 bishop stays inside the chain for now — that's the price of this solid set-up."
      },
      {
        "move": "e6",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
        "explanation": "Black does the same, building a solid structure."
      },
      {
        "move": "Bd3",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/3BPN2/PPP2PPP/RNBQK2R b KQkq - 1 4",
        "explanation": "The bishop goes to its best square, pointing at h7 next to where Black will castle.",
        "arrows": [
          [
            "d3",
            "h7"
          ]
        ]
      },
      {
        "move": "c5",
        "fen": "rnbqkb1r/pp3ppp/4pn2/2pp4/3P4/3BPN2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "explanation": "Black challenges White's centre from the side — the most active plan.",
        "arrows": [
          [
            "c5",
            "d4"
          ]
        ]
      },
      {
        "move": "c3",
        "fen": "rnbqkb1r/pp3ppp/4pn2/2pp4/3P4/2PBPN2/PP3PPP/RNBQK2R b KQkq - 0 5",
        "explanation": "White backs up d4 so the centre stays rock solid.",
        "arrows": [
          [
            "c3",
            "d4"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P4/2PBPN2/PP3PPP/RNBQK2R w KQkq - 1 6",
        "explanation": "Black develops and adds more pressure to d4.",
        "arrows": [
          [
            "c6",
            "d4"
          ]
        ]
      },
      {
        "move": "Nbd2",
        "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P4/2PBPN2/PP1N1PPP/R1BQK2R b KQkq - 2 6",
        "explanation": "The knight goes to d2, not c3, because it supports the key break e3-e4 and doesn't block the c-pawn.",
        "arrows": [
          [
            "d2",
            "e4"
          ]
        ]
      },
      {
        "move": "Bd6",
        "fen": "r1bqk2r/pp3ppp/2nbpn2/2pp4/3P4/2PBPN2/PP1N1PPP/R1BQK2R w KQkq - 3 7",
        "explanation": "Black develops and is ready to castle. White's plan is O-O, then Re1 or Qe2 and e4, opening the centre while the d3 bishop aims at h7. A common mistake is pushing e4 before castling and finishing development."
      }
    ],
    "keyIdeas": [
      "The same set-up works against almost anything: d4, Nf3, e3, Bd3, c3, Nbd2, O-O",
      "The Nbd2 knight supports the e4 break",
      "After castling, play e4 to open the position",
      "The d3 bishop points at h7 — watch for attacking chances once the centre opens",
      "The c1 bishop is passive; it often comes out after e4 or via b3 and Bb2"
    ]
  },
  {
    "id": "stonewall-attack",
    "name": "Stonewall Attack",
    "eco": "D00",
    "difficulty": "Beginner",
    "eloBand": "400-800",
    "side": "white",
    "description": "White builds a \"stone wall\" of pawns on c3, d4, e3 and f4, then plants a knight on e5 and attacks on the kingside.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White starts with the queen's pawn.",
        "highlights": [
          "d4"
        ]
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black takes an equal share of the centre.",
        "highlights": [
          "d5"
        ]
      },
      {
        "move": "e3",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/4P3/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White supports d4 and opens a path for the f1 bishop."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/4P3/PPP2PPP/RNBQKBNR w KQkq - 1 3",
        "explanation": "Black develops and controls e4."
      },
      {
        "move": "Bd3",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/3BP3/PPP2PPP/RNBQK1NR b KQkq - 2 3",
        "explanation": "The bishop goes to d3, aiming at the h7 pawn — a key target once Black castles.",
        "arrows": [
          [
            "d3",
            "h7"
          ]
        ]
      },
      {
        "move": "e6",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/3BP3/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "explanation": "Black opens the f8 bishop and keeps a solid centre."
      },
      {
        "move": "f4",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/3P1P2/3BP3/PPP3PP/RNBQK1NR b KQkq - 0 4",
        "explanation": "The Stonewall move. With f4 White grabs the e5 square for a knight. The cost: e4 becomes a hole, and the c1 bishop is shut in.",
        "arrows": [
          [
            "f4",
            "e5"
          ]
        ]
      },
      {
        "move": "c5",
        "fen": "rnbqkb1r/pp3ppp/4pn2/2pp4/3P1P2/3BP3/PPP3PP/RNBQK1NR w KQkq - 0 5",
        "explanation": "Black hits back in the centre from the side, the most natural plan against the Stonewall.",
        "arrows": [
          [
            "c5",
            "d4"
          ]
        ]
      },
      {
        "move": "c3",
        "fen": "rnbqkb1r/pp3ppp/4pn2/2pp4/3P1P2/2PBP3/PP4PP/RNBQK1NR b KQkq - 0 5",
        "explanation": "White completes the wall: pawns on c3, d4, e3 and f4. d4 is now very hard to attack.",
        "highlights": [
          "c3",
          "d4",
          "e3",
          "f4"
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1P2/2PBP3/PP4PP/RNBQK1NR w KQkq - 1 6",
        "explanation": "Black develops and keeps pressing on d4.",
        "arrows": [
          [
            "c6",
            "d4"
          ]
        ]
      },
      {
        "move": "Nf3",
        "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1P2/2PBPN2/PP4PP/RNBQK2R b KQkq - 2 6",
        "explanation": "White develops, eyeing e5. After castling, Ne5 will follow, then White can bring the queen and rook over to the kingside.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Bd6",
        "fen": "r1bqk2r/pp3ppp/2nbpn2/2pp4/3P1P2/2PBPN2/PP4PP/RNBQK2R w KQkq - 3 7",
        "explanation": "Black develops and covers e5 with the bishop. The plan for White is O-O, Nbd2, Ne5 and a kingside attack. Against a well-prepared opponent who trades off your d3 bishop (for example with an early ...Bf5), the Stonewall loses much of its punch.",
        "arrows": [
          [
            "d6",
            "e5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Pawns on c3, d4, e3 and f4 form a solid wall",
      "Put a knight on e5, supported by the d4 and f4 pawns",
      "The Bd3 + queen + rook attack on the kingside is the main plan",
      "Weaknesses: the e4 hole and the trapped c1 bishop",
      "Keep the d3 bishop — it is your best attacking piece"
    ]
  },
  {
    "id": "two-knights-defence",
    "name": "Two Knights Defence",
    "eco": "C58",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "side": "black",
    "description": "An active answer to the Italian. Black counter-attacks e4 straight away, and needs to know how to meet Ng5.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black takes an equal share.",
        "highlights": [
          "e5"
        ]
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "Attacks the e5 pawn.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "Defends e5 while developing."
      },
      {
        "move": "Bc4",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        "explanation": "The Italian bishop, aiming at f7.",
        "arrows": [
          [
            "c4",
            "f7"
          ]
        ]
      },
      {
        "move": "Nf6",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        "explanation": "The Two Knights Defence. Instead of ...Bc5, Black develops the second knight and attacks e4 at once.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ]
      },
      {
        "move": "Ng5",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4",
        "explanation": "The sharpest reply. Knight and bishop now both attack f7, and f7 is defended only by the king.",
        "arrows": [
          [
            "g5",
            "f7"
          ],
          [
            "c4",
            "f7"
          ]
        ]
      },
      {
        "move": "d5",
        "fen": "r1bqkb1r/ppp2ppp/2n2n2/3pp1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 5",
        "explanation": "The correct defence: Black blocks the bishop's diagonal to f7 by putting a pawn in the way.",
        "arrows": [
          [
            "d5",
            "c4"
          ]
        ]
      },
      {
        "move": "exd5",
        "fen": "r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5",
        "explanation": "White takes. The obvious recapture is a trap, so this is the moment Black has to think carefully."
      },
      {
        "move": "Na5",
        "fen": "r1bqkb1r/ppp2ppp/5n2/n2Pp1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 1 6",
        "explanation": "This is the key move to remember. The tempting 5...Nxd5? lets White play 6.Nxf7! Kxf7 7.Qf3+ — the Fried Liver Attack — with Black's king dragged into the open. Instead ...Na5 attacks the c4 bishop and gives up a pawn for fast development.",
        "arrows": [
          [
            "a5",
            "c4"
          ]
        ]
      },
      {
        "move": "Bb5+",
        "fen": "r1bqkb1r/ppp2ppp/5n2/nB1Pp1N1/8/8/PPPP1PPP/RNBQK2R b KQkq - 2 6",
        "explanation": "The bishop escapes with check — the main line.",
        "arrows": [
          [
            "b5",
            "e8"
          ]
        ]
      },
      {
        "move": "c6",
        "fen": "r1bqkb1r/pp3ppp/2p2n2/nB1Pp1N1/8/8/PPPP1PPP/RNBQK2R w KQkq - 0 7",
        "explanation": "Black blocks the check and attacks d5 and the bishop. After 7.dxc6 bxc6 8.Be2 h6 9.Nf3 e4, Black is a pawn down but has a lead in development and chases White's pieces around. That is full compensation in practice.",
        "arrows": [
          [
            "c6",
            "b5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "...Nf6 counter-attacks e4 instead of copying with ...Bc5",
      "Against Ng5, play ...d5 to block the bishop's path to f7",
      "After exd5, avoid ...Nxd5? — it allows the Fried Liver (Nxf7!)",
      "...Na5 hits the bishop; Black gives a pawn for quick development",
      "Use your lead in development to chase White's pieces with ...h6 and ...e4"
    ]
  },
  {
    "id": "caro-kann-advance",
    "name": "Caro-Kann Defence — Advance Variation",
    "eco": "B12",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "side": "black",
    "description": "How Black handles 3.e5 in the Caro-Kann: develop the light bishop first, then hit the pawn chain with ...c5.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "c6",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The Caro-Kann. Black prepares ...d5 so that a pawn can recapture on d5."
      },
      {
        "move": "d4",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White builds the classic two-pawn centre.",
        "highlights": [
          "d4",
          "e4"
        ]
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black challenges e4 straight away.",
        "arrows": [
          [
            "d5",
            "e4"
          ]
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "explanation": "The Advance Variation. White grabs space and cramps Black's kingside — the e5 pawn covers f6, so Black's knight can't use its best square.",
        "arrows": [
          [
            "e5",
            "f6"
          ]
        ]
      },
      {
        "move": "Bf5",
        "fen": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4",
        "explanation": "The big point of the Caro-Kann: the light-squared bishop comes out before ...e6 locks it in. One thing to remember: the bishop has left c8, so b7 is less protected — White sometimes plays Qb3 to attack it."
      },
      {
        "move": "Nf3",
        "fen": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 4",
        "explanation": "White develops calmly. This is the Short Variation, simple and popular at every level."
      },
      {
        "move": "e6",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5",
        "explanation": "Black opens the f8 bishop and supports d5. Now Black's pawn chain points the other way to White's."
      },
      {
        "move": "Be2",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQK2R b KQkq - 1 5",
        "explanation": "White develops and prepares to castle."
      },
      {
        "move": "c5",
        "fen": "rn1qkbnr/pp3ppp/4p3/2ppPb2/3P4/5N2/PPP1BPPP/RNBQK2R w KQkq - 0 6",
        "explanation": "Black strikes at the base of White's chain. Remember the rule: attack a pawn chain at its base, here d4.",
        "arrows": [
          [
            "c5",
            "d4"
          ]
        ]
      },
      {
        "move": "O-O",
        "fen": "rn1qkbnr/pp3ppp/4p3/2ppPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 b kq - 1 6",
        "explanation": "White castles."
      },
      {
        "move": "Nc6",
        "fen": "r2qkbnr/pp3ppp/2n1p3/2ppPb2/3P4/5N2/PPP1BPPP/RNBQ1RK1 w kq - 2 7",
        "explanation": "Black develops and adds pressure to d4. Typical plans include ...Qb6 and ...cxd4 to keep hitting d4, and ...Nge7 heading for f5 or g6.",
        "arrows": [
          [
            "c6",
            "d4"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Develop the light bishop to f5 before playing ...e6",
      "Then ...e6 and ...c5 to attack the base of White's chain (d4)",
      "Pile up on d4 with ...Nc6 and ...Qb6",
      "Watch the b7 pawn once the bishop has left c8",
      "The g8 knight often goes to e7 and then f5 or g6"
    ]
  },
  {
    "id": "french-advance",
    "name": "French Defence — Advance Variation",
    "eco": "C02",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "side": "black",
    "description": "How Black meets 3.e5 in the French: hit d4 with ...c5, ...Nc6 and ...Qb6.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "e6",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The French. Black prepares ...d5."
      },
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White builds a two-pawn centre.",
        "highlights": [
          "d4",
          "e4"
        ]
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black challenges e4.",
        "arrows": [
          [
            "d5",
            "e4"
          ]
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "explanation": "The Advance. White locks the centre and gains space on the kingside."
      },
      {
        "move": "c5",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4",
        "explanation": "The standard reaction: attack the base of the chain, d4. This is the main idea of the whole French.",
        "arrows": [
          [
            "c5",
            "d4"
          ]
        ]
      },
      {
        "move": "c3",
        "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "explanation": "White supports d4 with another pawn.",
        "arrows": [
          [
            "c3",
            "d4"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR w KQkq - 1 5",
        "explanation": "Black adds a second attacker to d4.",
        "arrows": [
          [
            "c6",
            "d4"
          ]
        ]
      },
      {
        "move": "Nf3",
        "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 2 5",
        "explanation": "White defends d4 again with the knight.",
        "arrows": [
          [
            "f3",
            "d4"
          ]
        ]
      },
      {
        "move": "Qb6",
        "fen": "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 3 6",
        "explanation": "A third attacker on d4, and the queen also eyes b2, making it harder for White to develop the c1 bishop. A trap worth knowing: if White plays 6.Bd3, don't grab with 6...cxd4 7.cxd4 Nxd4?? 8.Nxd4 Qxd4, because 9.Bb5+ uncovers an attack on your queen from d1.",
        "arrows": [
          [
            "b6",
            "d4"
          ],
          [
            "b6",
            "b2"
          ]
        ]
      },
      {
        "move": "a3",
        "fen": "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/P1P2N2/1P3PPP/RNBQKB1R b KQkq - 0 6",
        "explanation": "White prepares b4, which would gain space and take the pressure off d4."
      },
      {
        "move": "c4",
        "fen": "r1b1kbnr/pp3ppp/1qn1p3/3pP3/2pP4/P1P2N2/1P3PPP/RNBQKB1R w KQkq - 0 7",
        "explanation": "Black stops b4 for good (it could be met by ...cxb3 en passant) and takes the d3 square away from White's light bishop. Black follows up with ...Bd7, ...Na5 and ...Ne7 to attack the b3 square.",
        "arrows": [
          [
            "c4",
            "d3"
          ],
          [
            "c4",
            "b3"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Attack the base of the pawn chain (d4) with ...c5",
      "Pile up on d4: ...Nc6, ...Qb6, and later ...Nge7–f5",
      "...Qb6 also hits b2, holding back White's c1 bishop",
      "After a3, ...c4 gains queenside space and takes d3 from White's bishop",
      "Beware the Bb5+ trick if you win the d4 pawn too greedily"
    ]
  },
  {
    "id": "queens-gambit-declined",
    "name": "Queen's Gambit Declined",
    "eco": "D53",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "side": "black",
    "description": "The classical, rock-solid answer to the Queen's Gambit: hold d5 with ...e6, develop and castle.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "d4"
        ]
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black takes an equal share.",
        "highlights": [
          "d5"
        ]
      },
      {
        "move": "c4",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "The Queen's Gambit. White offers a pawn to pull Black's d-pawn away from the centre.",
        "arrows": [
          [
            "c4",
            "d5"
          ]
        ]
      },
      {
        "move": "e6",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Declined: Black supports d5 with a pawn instead of taking. The downside is that the c8 bishop is shut in for now.",
        "arrows": [
          [
            "e6",
            "d5"
          ]
        ]
      },
      {
        "move": "Nc3",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
        "explanation": "White adds pressure to d5.",
        "arrows": [
          [
            "c3",
            "d5"
          ]
        ]
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
        "explanation": "Black defends d5 again and develops.",
        "arrows": [
          [
            "f6",
            "d5"
          ]
        ]
      },
      {
        "move": "Bg5",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4",
        "explanation": "White pins the f6 knight to the queen, which reduces its grip on d5.",
        "arrows": [
          [
            "g5",
            "d8"
          ]
        ]
      },
      {
        "move": "Be7",
        "fen": "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq - 4 5",
        "explanation": "Black breaks the pin and prepares to castle. Simple and safe."
      },
      {
        "move": "e3",
        "fen": "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR b KQkq - 0 5",
        "explanation": "White opens the f1 bishop and supports d4."
      },
      {
        "move": "O-O",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR w KQ - 1 6",
        "explanation": "Black gets the king to safety."
      },
      {
        "move": "Nf3",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R b KQ - 2 6",
        "explanation": "White develops and prepares to castle too."
      },
      {
        "move": "Nbd7",
        "fen": "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 3 7",
        "explanation": "Black develops the last knight, supporting ...c5 or ...e5 later. Black's long-term problem piece is the c8 bishop; freeing moves such as ...c5, ...e5 or ...dxc4 followed by ...b6 and ...Bb7 help it come to life."
      }
    ],
    "keyIdeas": [
      "...e6 keeps a pawn on d5, the solid way to meet the gambit",
      "Break the Bg5 pin with ...Be7, then castle",
      "Develop with ...Nbd7 to support ...c5 or ...e5",
      "The c8 bishop is Black's problem piece — plan how to free it",
      "Patience: the QGD is about solidity first, counter-play later"
    ]
  },
  {
    "id": "sicilian-alapin",
    "name": "Sicilian Defence — Alapin (2.c3)",
    "eco": "B22",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "side": "white",
    "description": "A practical anti-Sicilian for White: prepare d4 with c3 so you can recapture with a pawn and keep a big centre.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "c5",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The Sicilian. Black fights for d4 from the side.",
        "arrows": [
          [
            "c5",
            "d4"
          ]
        ]
      },
      {
        "move": "c3",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "The Alapin. White prepares d4, so that if Black takes, White can recapture with a pawn and keep two pawns in the centre. It also avoids the huge amount of theory in the Open Sicilian.",
        "arrows": [
          [
            "c3",
            "d4"
          ]
        ]
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pp1ppppp/5n2/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR w KQkq - 1 3",
        "explanation": "One of Black's two main replies. The knight attacks e4, which can no longer be defended by Nc3 because the c3 square is taken.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkb1r/pp1ppppp/5n2/2p1P3/8/2P5/PP1P1PPP/RNBQKBNR b KQkq - 0 3",
        "explanation": "White pushes the pawn forward with gain of time, chasing the knight.",
        "arrows": [
          [
            "e5",
            "f6"
          ]
        ]
      },
      {
        "move": "Nd5",
        "fen": "rnbqkb1r/pp1ppppp/8/2pnP3/8/2P5/PP1P1PPP/RNBQKBNR w KQkq - 1 4",
        "explanation": "The knight finds a fine central square. White could chase it with c4, but that would undo the point of c3, which was to support d4."
      },
      {
        "move": "d4",
        "fen": "rnbqkb1r/pp1ppppp/8/2pnP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
        "explanation": "White builds the centre as planned.",
        "highlights": [
          "d4",
          "e5"
        ]
      },
      {
        "move": "cxd4",
        "fen": "rnbqkb1r/pp1ppppp/8/3nP3/3p4/2P5/PP3PPP/RNBQKBNR w KQkq - 0 5",
        "explanation": "Black exchanges a wing pawn for a centre pawn."
      },
      {
        "move": "Nf3",
        "fen": "rnbqkb1r/pp1ppppp/8/3nP3/3p4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 1 5",
        "explanation": "White develops first and recaptures on d4 next. Taking straight away with cxd4 is also fine."
      },
      {
        "move": "Nc6",
        "fen": "r1bqkb1r/pp1ppppp/2n5/3nP3/3p4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 2 6",
        "explanation": "Black develops and adds pressure to d4.",
        "arrows": [
          [
            "c6",
            "d4"
          ]
        ]
      },
      {
        "move": "cxd4",
        "fen": "r1bqkb1r/pp1ppppp/2n5/3nP3/3P4/5N2/PP3PPP/RNBQKB1R b KQkq - 0 6",
        "explanation": "White recaptures with the pawn, keeping a strong centre on d4 and e5 — the point of 2.c3.",
        "highlights": [
          "d4",
          "e5"
        ]
      },
      {
        "move": "d6",
        "fen": "r1bqkb1r/pp2pppp/2np4/3nP3/3P4/5N2/PP3PPP/RNBQKB1R w KQkq - 0 7",
        "explanation": "Black attacks the e5 pawn to break up White's centre. Typical play goes 7.Bc4 Nb6 8.Bb3, with the bishop aiming at f7. White must be careful not to let the e5 pawn become a target.",
        "arrows": [
          [
            "d6",
            "e5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "c3 prepares d4 so White can recapture with a pawn",
      "Against ...Nf6, push e5 to chase the knight",
      "Aim for a pawn centre on d4 and e5",
      "Bc4 and Bb3 put the bishop on the strong diagonal towards f7",
      "Look after e5 — it is Black's main target"
    ]
  },
  {
    "id": "smith-morra-gambit",
    "name": "Smith-Morra Gambit",
    "eco": "B21",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "side": "white",
    "description": "White gives a pawn against the Sicilian for fast development and open lines. Great practical value at club level.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "c5",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The Sicilian."
      },
      {
        "move": "d4",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White strikes in the centre immediately.",
        "arrows": [
          [
            "d4",
            "c5"
          ]
        ]
      },
      {
        "move": "cxd4",
        "fen": "rnbqkbnr/pp1ppppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black takes, as expected."
      },
      {
        "move": "c3",
        "fen": "rnbqkbnr/pp1ppppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq - 0 3",
        "explanation": "The gambit. White offers a second pawn to open lines quickly.",
        "arrows": [
          [
            "c3",
            "d4"
          ]
        ]
      },
      {
        "move": "dxc3",
        "fen": "rnbqkbnr/pp1ppppp/8/8/4P3/2p5/PP3PPP/RNBQKBNR w KQkq - 0 4",
        "explanation": "Black accepts. Declining is possible, but accepting is the main test."
      },
      {
        "move": "Nxc3",
        "fen": "rnbqkbnr/pp1ppppp/8/8/4P3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4",
        "explanation": "White is a pawn down, but has a knight out, open c- and d-files for the rooks and quick development. That's the compensation.",
        "arrows": [
          [
            "c3",
            "d5"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pp1ppppp/2n5/8/4P3/2N5/PP3PPP/R1BQKBNR w KQkq - 1 5",
        "explanation": "Black develops sensibly."
      },
      {
        "move": "Nf3",
        "fen": "r1bqkbnr/pp1ppppp/2n5/8/4P3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 2 5",
        "explanation": "Another piece comes into play."
      },
      {
        "move": "d6",
        "fen": "r1bqkbnr/pp2pppp/2np4/8/4P3/2N2N2/PP3PPP/R1BQKB1R w KQkq - 0 6",
        "explanation": "Black controls e5 and opens the c8 bishop. Be careful here as Black: after 6.Bc4, the natural 6...Nf6?! runs into 7.e5!, and after 7...dxe5?! 8.Qxd8+ Nxd8? 9.Nb5! White threatens Nc7+, forking king and rook.",
        "arrows": [
          [
            "d6",
            "e5"
          ]
        ]
      },
      {
        "move": "Bc4",
        "fen": "r1bqkbnr/pp2pppp/2np4/8/2B1P3/2N2N2/PP3PPP/R1BQK2R b KQkq - 1 6",
        "explanation": "The bishop aims at f7 and e6, the weak points in Black's camp.",
        "arrows": [
          [
            "c4",
            "f7"
          ]
        ]
      },
      {
        "move": "e6",
        "fen": "r1bqkbnr/pp3ppp/2npp3/8/2B1P3/2N2N2/PP3PPP/R1BQK2R w KQkq - 0 7",
        "explanation": "Black blunts the bishop. This is the safest set-up."
      },
      {
        "move": "O-O",
        "fen": "r1bqkbnr/pp3ppp/2npp3/8/2B1P3/2N2N2/PP3PPP/R1BQ1RK1 b kq - 1 7",
        "explanation": "White castles and will continue with Qe2 and Rd1, putting pressure down the half-open d-file towards d6. Black's d6 pawn is a target."
      }
    ],
    "keyIdeas": [
      "White gives a pawn for quick development and open files",
      "Typical set-up: Nc3, Nf3, Bc4, O-O, Qe2, Rd1",
      "The d6 pawn is a target on the open d-file",
      "Tactics with e5 and Nb5 (eyeing c7 and d6) are common",
      "If Black survives the opening, the extra pawn can count later — keep the pressure on"
    ]
  },
  {
    "id": "kings-indian-attack",
    "name": "King's Indian Attack",
    "eco": "A07",
    "difficulty": "Intermediate",
    "eloBand": "800-1200",
    "side": "white",
    "description": "A flexible system for White: fianchetto the bishop, castle, then break with e4. Works against almost any Black set-up.",
    "moves": [
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1",
        "explanation": "White starts flexibly, controlling e5 and d4 without committing a pawn.",
        "arrows": [
          [
            "f3",
            "e5"
          ],
          [
            "f3",
            "d4"
          ]
        ]
      },
      {
        "move": "d5",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2",
        "explanation": "Black takes the centre.",
        "highlights": [
          "d5"
        ]
      },
      {
        "move": "g3",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2",
        "explanation": "White prepares to fianchetto the f1 bishop on g2."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/5NP1/PPPPPP1P/RNBQKB1R w KQkq - 1 3",
        "explanation": "Black develops."
      },
      {
        "move": "Bg2",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/8/5NP1/PPPPPPBP/RNBQK2R b KQkq - 2 3",
        "explanation": "The fianchettoed bishop will help guard the king after castling. For now it sits behind the f3 knight, but once the knight moves or the centre opens it will rake down the long diagonal."
      },
      {
        "move": "e6",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/8/5NP1/PPPPPPBP/RNBQK2R w KQkq - 0 4",
        "explanation": "Black builds a solid centre."
      },
      {
        "move": "O-O",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/8/5NP1/PPPPPPBP/RNBQ1RK1 b kq - 1 4",
        "explanation": "White castles early — a key feature of this system."
      },
      {
        "move": "Be7",
        "fen": "rnbqk2r/ppp1bppp/4pn2/3p4/8/5NP1/PPPPPPBP/RNBQ1RK1 w kq - 2 5",
        "explanation": "Black develops and prepares to castle."
      },
      {
        "move": "d3",
        "fen": "rnbqk2r/ppp1bppp/4pn2/3p4/8/3P1NP1/PPP1PPBP/RNBQ1RK1 b kq - 0 5",
        "explanation": "White prepares the e4 break.",
        "arrows": [
          [
            "d3",
            "e4"
          ]
        ]
      },
      {
        "move": "O-O",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/3p4/8/3P1NP1/PPP1PPBP/RNBQ1RK1 w - - 1 6",
        "explanation": "Black castles."
      },
      {
        "move": "Nbd2",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/3p4/8/3P1NP1/PPPNPPBP/R1BQ1RK1 b - - 2 6",
        "explanation": "The knight goes to d2 to support e4.",
        "arrows": [
          [
            "d2",
            "e4"
          ]
        ]
      },
      {
        "move": "c5",
        "fen": "rnbq1rk1/pp2bppp/4pn2/2pp4/8/3P1NP1/PPPNPPBP/R1BQ1RK1 w - - 0 7",
        "explanation": "Black gains space on the queenside, which is Black's usual plan in these positions."
      },
      {
        "move": "e4",
        "fen": "rnbq1rk1/pp2bppp/4pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQ1RK1 b - - 0 7",
        "explanation": "White strikes in the centre. Later White often pushes e5 and attacks on the kingside with Re1, Nf1, h4 and Bf4, while Black attacks on the queenside. The common mistake is to play the moves automatically without noticing what Black is doing.",
        "arrows": [
          [
            "e4",
            "d5"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "Set-up: Nf3, g3, Bg2, O-O, d3, Nbd2, e4",
      "The g2 bishop pressures the long diagonal",
      "After e4–e5, attack on the kingside",
      "Black usually counters on the queenside with ...c5 and ...b5",
      "Works against the French, Caro-Kann and Sicilian set-ups too"
    ]
  },
  {
    "id": "evans-gambit",
    "name": "Evans Gambit",
    "eco": "C52",
    "difficulty": "Intermediate",
    "eloBand": "1200-1600",
    "side": "white",
    "description": "An aggressive Italian gambit: give the b-pawn to gain time for c3 and d4.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "e5",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "Black answers symmetrically."
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "Attacks e5.",
        "arrows": [
          [
            "f3",
            "e5"
          ]
        ]
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "explanation": "Defends e5."
      },
      {
        "move": "Bc4",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        "explanation": "The Italian bishop aims at f7.",
        "arrows": [
          [
            "c4",
            "f7"
          ]
        ]
      },
      {
        "move": "Bc5",
        "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        "explanation": "The Giuoco Piano."
      },
      {
        "move": "b4",
        "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4",
        "explanation": "The Evans Gambit. White offers a pawn to deflect the c5 bishop.",
        "arrows": [
          [
            "b4",
            "c5"
          ]
        ]
      },
      {
        "move": "Bxb4",
        "fen": "r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/5N2/P1PP1PPP/RNBQK2R w KQkq - 0 5",
        "explanation": "Black accepts — the main line."
      },
      {
        "move": "c3",
        "fen": "r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/2P2N2/P2P1PPP/RNBQK2R b KQkq - 0 5",
        "explanation": "White attacks the bishop with gain of time and prepares d4.",
        "arrows": [
          [
            "c3",
            "b4"
          ]
        ]
      },
      {
        "move": "Ba5",
        "fen": "r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/P2P1PPP/RNBQK2R w KQkq - 1 6",
        "explanation": "The bishop retreats but keeps an eye on c3.",
        "arrows": [
          [
            "a5",
            "c3"
          ]
        ]
      },
      {
        "move": "d4",
        "fen": "r1bqk1nr/pppp1ppp/2n5/b3p3/2BPP3/2P2N2/P4PPP/RNBQK2R b KQkq - 0 6",
        "explanation": "White strikes in the centre. Compared with the normal Giuoco Piano, White has won time for c3 and d4.",
        "arrows": [
          [
            "d4",
            "e5"
          ]
        ]
      },
      {
        "move": "exd4",
        "fen": "r1bqk1nr/pppp1ppp/2n5/b7/2BpP3/2P2N2/P4PPP/RNBQK2R w KQkq - 0 7",
        "explanation": "Black takes."
      },
      {
        "move": "O-O",
        "fen": "r1bqk1nr/pppp1ppp/2n5/b7/2BpP3/2P2N2/P4PPP/RNBQ1RK1 b kq - 1 7",
        "explanation": "White castles and will play cxd4 or Qb3 next. A pawn down, White has a lead in development and pressure on f7. Black must defend precisely; the main defences are 7...Nge7 and 7...dxc3. White's typical ideas are Qb3 against f7 and Ba3 to make it hard for Black to castle."
      }
    ],
    "keyIdeas": [
      "b4 gives a pawn to gain time against the c5 bishop",
      "c3 and d4 build a centre with tempo",
      "Qb3 is a common attacking idea against f7",
      "Ba3 aims at f8 to make kingside castling harder",
      "White plays for development and attack, not material"
    ]
  },
  {
    "id": "queens-indian",
    "name": "Queen's Indian Defence",
    "eco": "E15",
    "difficulty": "Intermediate",
    "eloBand": "1200-1600",
    "side": "black",
    "description": "A solid, flexible defence: Black fights for the e4 square with pieces instead of pawns.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "d4"
        ]
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "explanation": "Black stops e4 for now and keeps options open.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ]
      },
      {
        "move": "c4",
        "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White gains queenside space."
      },
      {
        "move": "e6",
        "fen": "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black prepares ...d5 or ...Bb4 and opens the f8 bishop."
      },
      {
        "move": "Nf3",
        "fen": "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 1 3",
        "explanation": "White avoids the Nimzo-Indian pin (which comes after Nc3 Bb4)."
      },
      {
        "move": "b6",
        "fen": "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
        "explanation": "The Queen's Indian. Black prepares to fianchetto the c8 bishop to control e4."
      },
      {
        "move": "g3",
        "fen": "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5NP1/PP2PP1P/RNBQKB1R b KQkq - 0 4",
        "explanation": "White fianchettoes too, contesting the long diagonal."
      },
      {
        "move": "Ba6",
        "fen": "rn1qkb1r/p1pp1ppp/bp2pn2/8/2PP4/5NP1/PP2PP1P/RNBQKB1R w KQkq - 1 5",
        "explanation": "A clever modern move. The bishop attacks the c4 pawn, forcing White to spend a move defending it.",
        "arrows": [
          [
            "a6",
            "c4"
          ]
        ]
      },
      {
        "move": "b3",
        "fen": "rn1qkb1r/p1pp1ppp/bp2pn2/8/2PP4/1P3NP1/P3PP1P/RNBQKB1R b KQkq - 0 5",
        "explanation": "White defends c4 with a pawn.",
        "arrows": [
          [
            "b3",
            "c4"
          ]
        ]
      },
      {
        "move": "Bb4+",
        "fen": "rn1qk2r/p1pp1ppp/bp2pn2/8/1bPP4/1P3NP1/P3PP1P/RNBQKB1R w KQkq - 1 6",
        "explanation": "The point: with b3 played, the dark squares on White's queenside are a bit weaker. Black checks to disrupt White's development.",
        "arrows": [
          [
            "b4",
            "e1"
          ]
        ]
      },
      {
        "move": "Bd2",
        "fen": "rn1qk2r/p1pp1ppp/bp2pn2/8/1bPP4/1P3NP1/P2BPP1P/RN1QKB1R b KQkq - 2 6",
        "explanation": "White blocks the check."
      },
      {
        "move": "Be7",
        "fen": "rn1qk2r/p1ppbppp/bp2pn2/8/2PP4/1P3NP1/P2BPP1P/RN1QKB1R w KQkq - 3 7",
        "explanation": "Black retreats, happy that White's bishop is on d2 rather than its ideal b2 square, where it would aim down the long diagonal. It also takes d2 away from the b1 knight. Black continues with ...O-O, ...d5 or ...c6, and ...Bb7 when the timing is right."
      }
    ],
    "keyIdeas": [
      "Black controls e4 with pieces: ...Nf6, ...b6 and ...Bb7",
      "...Ba6 provokes b3, which weakens White's dark squares",
      "...Bb4+ disrupts White's development",
      "Solid structure with ...d5 or ...c5 breaks later",
      "Avoids the sharpest lines while staying active"
    ]
  },
  {
    "id": "closed-sicilian",
    "name": "Closed Sicilian",
    "eco": "B25",
    "difficulty": "Intermediate",
    "eloBand": "1200-1600",
    "side": "white",
    "description": "A slow, positional way for White to meet the Sicilian: fianchetto, then f4 and a kingside attack.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "c5",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The Sicilian."
      },
      {
        "move": "Nc3",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
        "explanation": "White develops and keeps the centre closed, avoiding the Open Sicilian theory."
      },
      {
        "move": "Nc6",
        "fen": "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3",
        "explanation": "Black develops naturally."
      },
      {
        "move": "g3",
        "fen": "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/2N3P1/PPPP1P1P/R1BQKBNR b KQkq - 0 3",
        "explanation": "White prepares to fianchetto the bishop."
      },
      {
        "move": "g6",
        "fen": "r1bqkbnr/pp1ppp1p/2n3p1/2p5/4P3/2N3P1/PPPP1P1P/R1BQKBNR w KQkq - 0 4",
        "explanation": "Black does the same."
      },
      {
        "move": "Bg2",
        "fen": "r1bqkbnr/pp1ppp1p/2n3p1/2p5/4P3/2N3P1/PPPP1PBP/R1BQK1NR b KQkq - 1 4",
        "explanation": "The bishop goes to the long diagonal, supporting e4. If the centre ever opens it will also bear down on Black's queenside.",
        "arrows": [
          [
            "g2",
            "e4"
          ]
        ]
      },
      {
        "move": "Bg7",
        "fen": "r1bqk1nr/pp1pppbp/2n3p1/2p5/4P3/2N3P1/PPPP1PBP/R1BQK1NR w KQkq - 2 5",
        "explanation": "Black's bishop is strong on the long diagonal, aiming at the c3 knight and, behind it, b2.",
        "arrows": [
          [
            "g7",
            "c3"
          ]
        ]
      },
      {
        "move": "d3",
        "fen": "r1bqk1nr/pp1pppbp/2n3p1/2p5/4P3/2NP2P1/PPP2PBP/R1BQK1NR b KQkq - 0 5",
        "explanation": "White solidifies e4. The centre stays closed."
      },
      {
        "move": "d6",
        "fen": "r1bqk1nr/pp2ppbp/2np2p1/2p5/4P3/2NP2P1/PPP2PBP/R1BQK1NR w KQkq - 0 6",
        "explanation": "Black does the same."
      },
      {
        "move": "f4",
        "fen": "r1bqk1nr/pp2ppbp/2np2p1/2p5/4PP2/2NP2P1/PPP3BP/R1BQK1NR b KQkq - 0 6",
        "explanation": "The key plan: White prepares f5 and a kingside attack.",
        "arrows": [
          [
            "f4",
            "f5"
          ]
        ]
      },
      {
        "move": "e6",
        "fen": "r1bqk1nr/pp3pbp/2npp1p1/2p5/4PP2/2NP2P1/PPP3BP/R1BQK1NR w KQkq - 0 7",
        "explanation": "Black makes f5 harder and prepares ...Nge7."
      },
      {
        "move": "Nf3",
        "fen": "r1bqk1nr/pp3pbp/2npp1p1/2p5/4PP2/2NP1NP1/PPP3BP/R1BQK2R b KQkq - 1 7",
        "explanation": "White develops and will castle next, then aim for g4 and f5. Black usually counters on the queenside with ...Rb8 and ...b5."
      }
    ],
    "keyIdeas": [
      "Keep the centre closed with Nc3, g3, Bg2 and d3",
      "f4 and f5 is the main attacking plan",
      "Black usually plays on the queenside with ...Rb8 and ...b5",
      "Be patient — this is a slow positional system",
      "Watch the g7 bishop's pressure on the long diagonal"
    ]
  },
  {
    "id": "catalan",
    "name": "Catalan Opening",
    "eco": "E05",
    "difficulty": "Advanced",
    "eloBand": "1600+",
    "side": "white",
    "description": "A Queen's Gambit with a kingside fianchetto. White often gives up the c4 pawn for long-term pressure on the queenside.",
    "moves": [
      {
        "move": "d4",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "d4"
        ]
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "explanation": "Black develops flexibly."
      },
      {
        "move": "c4",
        "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "explanation": "White gains queenside space."
      },
      {
        "move": "e6",
        "fen": "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "explanation": "Black prepares ...d5."
      },
      {
        "move": "g3",
        "fen": "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3",
        "explanation": "The Catalan. The bishop will go to g2 to pressure the long diagonal."
      },
      {
        "move": "d5",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/6P1/PP2PP1P/RNBQKBNR w KQkq - 0 4",
        "explanation": "Black builds a QGD-style centre."
      },
      {
        "move": "Bg2",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/6P1/PP2PPBP/RNBQK1NR b KQkq - 1 4",
        "explanation": "The Catalan bishop aims at d5 and, behind it, the b7 pawn.",
        "arrows": [
          [
            "g2",
            "d5"
          ]
        ]
      },
      {
        "move": "Be7",
        "fen": "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/6P1/PP2PPBP/RNBQK1NR w KQkq - 2 5",
        "explanation": "Black develops and prepares to castle."
      },
      {
        "move": "Nf3",
        "fen": "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/5NP1/PP2PPBP/RNBQK2R b KQkq - 3 5",
        "explanation": "White develops."
      },
      {
        "move": "O-O",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/3p4/2PP4/5NP1/PP2PPBP/RNBQK2R w KQ - 4 6",
        "explanation": "Black castles."
      },
      {
        "move": "O-O",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/3p4/2PP4/5NP1/PP2PPBP/RNBQ1RK1 b - - 5 6",
        "explanation": "White castles too."
      },
      {
        "move": "dxc4",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/8/2pP4/5NP1/PP2PPBP/RNBQ1RK1 w - - 0 7",
        "explanation": "The Open Catalan. Black grabs the pawn, accepting a little pressure."
      },
      {
        "move": "Qc2",
        "fen": "rnbq1rk1/ppp1bppp/4pn2/8/2pP4/5NP1/PPQ1PPBP/RNB2RK1 b - - 1 7",
        "explanation": "White will usually regain the pawn with Qxc4, even if Black first plays ...a6 and ...b5 to make it awkward. The g2 bishop is very strong, and Black's queenside development (especially the c8 bishop) is difficult.",
        "arrows": [
          [
            "c2",
            "c4"
          ]
        ]
      }
    ],
    "keyIdeas": [
      "The g2 bishop is the key piece, pressing on the long diagonal",
      "In the Open Catalan White usually wins back c4 with Qc2 and Qxc4",
      "Black's main problem is developing the c8 bishop",
      "Long-term queenside pressure rather than a direct attack",
      "Both sides need to understand the structures, not just the moves"
    ]
  },
  {
    "id": "sicilian-dragon",
    "name": "Sicilian Defence — Dragon",
    "eco": "B76",
    "difficulty": "Advanced",
    "eloBand": "1600+",
    "side": "black",
    "description": "Black fianchettoes on g7 for a powerful bishop. Against the Yugoslav Attack, the game becomes a race of opposite-side attacks.",
    "moves": [
      {
        "move": "e4",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "explanation": "White takes the centre.",
        "highlights": [
          "e4"
        ]
      },
      {
        "move": "c5",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "explanation": "The Sicilian."
      },
      {
        "move": "Nf3",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "explanation": "White develops, preparing d4."
      },
      {
        "move": "d6",
        "fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        "explanation": "Black controls e5 and prepares ...Nf6."
      },
      {
        "move": "d4",
        "fen": "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
        "explanation": "White opens the centre.",
        "arrows": [
          [
            "d4",
            "c5"
          ]
        ]
      },
      {
        "move": "cxd4",
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
        "explanation": "Black exchanges a wing pawn for a centre pawn."
      },
      {
        "move": "Nxd4",
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
        "explanation": "White recaptures with a well-centralised knight."
      },
      {
        "move": "Nf6",
        "fen": "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5",
        "explanation": "Black develops and attacks e4.",
        "arrows": [
          [
            "f6",
            "e4"
          ]
        ]
      },
      {
        "move": "Nc3",
        "fen": "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5",
        "explanation": "White defends e4."
      },
      {
        "move": "g6",
        "fen": "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        "explanation": "The Dragon. Black prepares ...Bg7, the bishop that gives the opening its power."
      },
      {
        "move": "Be3",
        "fen": "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6",
        "explanation": "White develops, preparing f3, Qd2 and O-O-O — the Yugoslav Attack."
      },
      {
        "move": "Bg7",
        "fen": "rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7",
        "explanation": "The Dragon bishop. Right now the f6 knight is in its way, but as soon as that knight moves the bishop bears down the long diagonal on d4, c3 and b2."
      },
      {
        "move": "f3",
        "fen": "rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 0 7",
        "explanation": "An important move. It stops ...Ng4, which would hit the e3 bishop, and prepares g4 and h4 for a pawn storm."
      },
      {
        "move": "O-O",
        "fen": "rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R w KQ - 1 8",
        "explanation": "Black castles. Play continues 8.Qd2 Nc6, with White castling queenside and storming with h4–h5, and Black counter-attacking on the c-file with ...Rc8, ...Ne5–c4 and sometimes a ...Rxc3 exchange sacrifice. Speed matters more than material."
      }
    ],
    "keyIdeas": [
      "The g7 bishop is Black's most important piece — don't give it up cheaply",
      "Yugoslav Attack: Be3, f3, Qd2, O-O-O, h4–h5",
      "Black counter-attacks on the c-file: ...Rc8, ...Ne5–c4",
      "The ...Rxc3 exchange sacrifice is a typical idea",
      "Opposite-side castling races — speed beats material"
    ]
  }
];

export default openings;
