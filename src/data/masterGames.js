// Annotated game library: every move explained (plan + tactics) for the Master Games viewer.
// Generated from engine fact sheets (Stockfish depth 14) and hand-checked commentary.
// moves: SAN string · evals: White's view after each ply (±20 = mate) · notes[i] belongs to ply i+1
// alternatives: the engine's choice where it differs from the game, accepted in Guess the move.
const masterGames = [
 {
  "id": "legal-1750",
  "title": "Légal's mate",
  "white": "Kermur de Légal",
  "black": "Saint Brie",
  "event": "Paris",
  "year": 1750,
  "result": "1-0",
  "level": "Beginner",
  "opening": "Philidor Defence",
  "themes": [
   "pin",
   "queen sacrifice",
   "development",
   "checkmate pattern"
  ],
  "summary": "The oldest famous trap in chess, over in seven moves. Black pins a knight to White's queen and assumes it cannot move, but White moves it anyway, gives up the queen and mates with three small pieces. It teaches you that a pin to the queen is not a pin to the king.",
  "lessons": [
   "A piece pinned to the queen can still move. Before you rely on a pin, ask what happens if your opponent ignores it.",
   "When your opponent offers a big piece for free, scan for checks first: a free queen is often bait.",
   "f7 is Black's weak spot early in the game because only the king guards it.",
   "Developed pieces win games. White mated with knights and a bishop while most of Black's army never moved."
  ],
  "moves": "e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6 Nxe5 Bxd1 Bxf7+ Ke7 Nd5#",
  "evals": [
   0.03,
   0.78,
   0.37,
   0.95,
   0.17,
   1.06,
   0.27,
   2.16,
   1.99,
   20,
   20,
   20,
   20
  ],
  "notes": [
   {
    "kind": "opening",
    "text": "Takes a share of the centre and opens lines for the queen and the light-squared bishop on f1.",
    "arrows": [
     [
      "f1",
      "c4",
      "blue"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Black matches White in the centre. The pawn on e5 also controls d4 and f4, two squares White would like to use.",
    "alternatives": [
     "e6"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops a piece with a threat: the knight now attacks the pawn on e5, so Black has to deal with it straight away.",
    "arrows": [
     [
      "f3",
      "e5",
      "green"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Defends e5 with a pawn. This is the Philidor Defence. It is solid, but it shuts in the bishop on f8, so Black's kingside pieces will be slow to come out.",
    "alternatives": [
     "Nf6"
    ]
   },
   {
    "kind": "opening",
    "text": "The bishop aims at f7, the weakest square in Black's camp, because only the king protects it.",
    "arrows": [
     [
      "c4",
      "f7",
      "yellow"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "A pin: the knight on f3 stands in front of the queen on d1, so if the knight moves, the bishop can take the queen. Black thinks the knight is now frozen.",
    "arrows": [
     [
      "g4",
      "d1",
      "blue"
     ]
    ],
    "alternatives": [
     "Nf6"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops another piece. The knight on c3 guards e4 and, importantly, can jump to d5 later.",
    "arrows": [
     [
      "c3",
      "d5",
      "green"
     ]
    ],
    "alternatives": [
     "d4"
    ]
   },
   {
    "kind": "mistake",
    "text": "A slow move that does nothing to help Black's development. Spy: the bishop on g4 has no defender, so if the f3 knight moves, the queen attacks it. White now has a trick.",
    "better": "4...Nf6 develops a piece and keeps the game roughly level (about +0.3 instead of +2).",
    "alternatives": [
     "Nf6"
    ]
   },
   {
    "kind": "key",
    "text": "Ignores the pin. The knight grabs a pawn and uncovers the queen's attack on the bishop. If Black declines the queen with 5...dxe5, then 6.Qxg4 wins the bishop back and White is a pawn up.",
    "arrows": [
     [
      "d1",
      "g4",
      "green"
     ],
     [
      "e5",
      "f7",
      "yellow"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "Taking the queen feels natural, but it walks into checkmate in two. Scan White's checks: Bxf7+ and then a knight jump to d5.",
    "better": "5...dxe5 6.Qxg4 only loses a pawn (about +2). The queen was poisoned.",
    "alternatives": [
     "dxe5"
    ]
   },
   {
    "kind": "tactic",
    "text": "Check. The knight on e5 protects the bishop, so the king cannot take it, and the knight also covers d7. The king has only one square left.",
    "arrows": [
     [
      "e5",
      "f7",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: e7 is the only legal square for the king."
   },
   {
    "kind": "key",
    "text": "Checkmate. The knight on d5 checks the king; d7 is covered by the other knight, e6 and e8 by the bishop, f6 by the d5 knight, and Black's own pieces block the rest. This pattern is called Légal's mate.",
    "arrows": [
     [
      "d5",
      "e7",
      "green"
     ]
    ]
   }
  ]
 },
 {
  "id": "reti-tartakower-1910",
  "title": "Réti's queen sacrifice",
  "white": "Richard Réti",
  "black": "Savielly Tartakower",
  "event": "Vienna",
  "year": 1910,
  "result": "1-0",
  "level": "Beginner",
  "opening": "Caro-Kann Defence",
  "themes": [
   "king in the centre",
   "open files",
   "queen sacrifice",
   "double check"
  ],
  "summary": "A short, sharp game where Black's king stays in the middle of the board one move too long. White castles queenside to put a rook on the open d-file, then sacrifices the queen and mates with a double check. It shows why an uncastled king next to an open file is in danger.",
  "lessons": [
   "Castle early. A king left on its starting square next to an open file can be mated quickly.",
   "When a piece is offered for free, use Spy: ask what your opponent gains if you take it.",
   "Double check is the strongest check: you cannot block it or capture both checkers, so the king must move.",
   "Rooks love open files. Castling queenside can bring a rook to the centre in one move."
  ],
  "moves": "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Qd3 e5 dxe5 Qa5+ Bd2 Qxe5 O-O-O Nxe4 Qd8+ Kxd8 Bg5+ Kc7 Bd8#",
  "evals": [
   0.03,
   1.12,
   0.4,
   0.72,
   0.14,
   0.9,
   0.58,
   1.31,
   0,
   0.77,
   0.61,
   1.7,
   1.28,
   1.6,
   1.12,
   20,
   20,
   20,
   20,
   20,
   20
  ],
  "notes": [
   {
    "kind": "opening",
    "text": "Takes a share of the centre and opens lines for the queen and the bishop on f1."
   },
   {
    "kind": "opening",
    "text": "The Caro-Kann Defence. The pawn on c6 prepares ...d5, so that if White ever takes on d5, Black can recapture with a pawn.",
    "arrows": [
     [
      "d7",
      "d5",
      "green"
     ]
    ],
    "alternatives": [
     "e6"
    ]
   },
   {
    "kind": "opening",
    "text": "Builds a big centre with two pawns side by side on d4 and e4.",
    "alternatives": [
     "Nf3"
    ]
   },
   {
    "kind": "opening",
    "text": "Challenges the centre at once: the pawn on d5 attacks e4, so White must defend, advance or swap.",
    "arrows": [
     [
      "d5",
      "e4",
      "red"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Defends the e4 pawn and develops a piece at the same time.",
    "alternatives": [
     "Nd2"
    ]
   },
   {
    "kind": "opening",
    "text": "Black gives up the centre for a moment by trading pawns. This opens lines for Black's pieces, especially the bishop on c8."
   },
   {
    "kind": "opening",
    "text": "Recaptures, and now the knight sits on a strong central square on e4."
   },
   {
    "kind": "opening",
    "text": "Develops and challenges the strong knight on e4, offering a trade.",
    "arrows": [
     [
      "f6",
      "e4",
      "red"
     ]
    ],
    "alternatives": [
     "Bf5"
    ]
   },
   {
    "kind": "plan",
    "text": "An unusual way to defend the knight: the queen guards e4 and takes over the d-file. The engine prefers swapping with 5.Nxf6+, which also damages Black's pawns, but this keeps more pieces on and leads to sharper play.",
    "alternatives": [
     "Nxf6+"
    ]
   },
   {
    "kind": "plan",
    "text": "A pawn offer that frees Black's position: it attacks d4 and opens the diagonal from d8 to a5 for the queen. It is sharp, and it means Black's king will need some care.",
    "better": "5...Nxe4 6.Qxe4 Qd5 was calmer, offering to trade queens (about +0.3).",
    "alternatives": [
     "Qd5"
    ]
   },
   {
    "kind": "tactic",
    "text": "Takes the pawn, and the new pawn on e5 now attacks the knight on f6.",
    "arrows": [
     [
      "e5",
      "f6",
      "green"
     ]
    ],
    "alternatives": [
     "Nxf6+"
    ]
   },
   {
    "kind": "tactic",
    "text": "Check, and the queen also attacks the pawn on e5 along the fifth rank. Black plans to win the pawn back while White deals with the check.",
    "better": "6...Qxd3 7.Bxd3 Nxe4 8.Bxe4 trades queens and leaves Black with no worries about the king (about +0.4).",
    "arrows": [
     [
      "a5",
      "e5",
      "yellow"
     ]
    ],
    "alternatives": [
     "Qxd3"
    ]
   },
   {
    "kind": "defence",
    "text": "Blocks the check with a developing move, and the bishop now attacks the queen on a5. The f6 knight is still under attack too, so Black has to choose what to save.",
    "arrows": [
     [
      "d2",
      "a5",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen escapes and takes the e5 pawn. Now the knight on e4 is attacked twice, by the queen and the f6 knight, and defended only once by White's queen.",
    "arrows": [
     [
      "e5",
      "e4",
      "yellow"
     ]
    ]
   },
   {
    "kind": "key",
    "text": "Instead of defending the knight, White castles and puts a rook on d1, right behind the queen on the d-file. The knight is bait: if Black takes it, the queen and rook strike at d8, next to Black's king.",
    "arrows": [
     [
      "d1",
      "d8",
      "blue"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "Takes the bait. Spy: White's queen and rook are lined up on the open d-file pointing at d8, and Black's king has not castled.",
    "better": "8...Be7 develops and prepares castling, keeping White's edge small (about +1).",
    "alternatives": [
     "Be7"
    ]
   },
   {
    "kind": "key",
    "text": "A queen sacrifice with check. The rook on d1 protects the queen, so the king must take it: it is the only legal move.",
    "arrows": [
     [
      "d1",
      "d8",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: capturing the queen is the only legal move."
   },
   {
    "kind": "tactic",
    "text": "Double check: the bishop checks from g5 and moving it uncovers the rook's check along the d-file. Black cannot block or capture both, so the king must move.",
    "arrows": [
     [
      "g5",
      "d8",
      "blue"
     ],
     [
      "d1",
      "d8",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "One of only two king moves. The other, 10...Ke8, loses to 11.Rd8#, with the rook protected by the bishop."
   },
   {
    "kind": "key",
    "text": "Checkmate. The bishop checks from d8 and the rook guards it, so the king cannot take it. The rook covers d7 and d6, the bishop's line covers b6, and Black's own pieces block b8, c8, b7 and c6.",
    "arrows": [
     [
      "d8",
      "c7",
      "green"
     ],
     [
      "d1",
      "d7",
      "blue"
     ]
    ]
   }
  ]
 },
 {
  "id": "morphy-opera-1858",
  "title": "The Opera Game",
  "white": "Paul Morphy",
  "black": "Duke of Brunswick & Count Isouard",
  "event": "Paris Opera",
  "year": 1858,
  "result": "1-0",
  "level": "Beginner",
  "opening": "Philidor Defence",
  "themes": [
   "development",
   "pins",
   "open lines",
   "sacrifice",
   "back rank mate"
  ],
  "summary": "Played in a box at the Paris opera, this is the most famous lesson in development ever recorded. Morphy brings every piece into play quickly, opens lines towards Black's uncastled king and finishes with a queen sacrifice and mate. Every move has a clear purpose you can copy.",
  "lessons": [
   "Develop quickly and castle. Morphy's pieces were all active while Black's bishop on f8 and rook on h8 never moved.",
   "Pins are powerful: a pinned piece cannot defend properly, so pile up more attackers on it.",
   "Sacrificing material to open lines towards an uncastled king is often worth it.",
   "Count attackers and defenders on key squares like f7 and d7 before every move."
  ],
  "moves": "e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#",
  "evals": [
   0.03,
   0.78,
   0.37,
   0.95,
   0.29,
   1.43,
   0.7,
   1.9,
   1.25,
   2.11,
   1.48,
   2.02,
   1.37,
   2.47,
   1.15,
   1.92,
   1.47,
   2.93,
   2.33,
   7.38,
   6.2,
   6.98,
   6.46,
   7.32,
   6.85,
   7.3,
   8.67,
   13.58,
   13.76,
   20,
   20,
   20,
   20
  ],
  "notes": [
   {
    "kind": "opening",
    "text": "Takes a share of the centre and opens lines for the queen and the bishop on f1."
   },
   {
    "kind": "opening",
    "text": "Black matches in the centre. The pawn on e5 controls d4 and f4.",
    "alternatives": [
     "e6"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops with a threat: the knight attacks the e5 pawn.",
    "arrows": [
     [
      "f3",
      "e5",
      "green"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "The Philidor Defence. The pawn guards e5 but blocks the bishop on f8, which will cause Black problems all game.",
    "alternatives": [
     "Nf6"
    ]
   },
   {
    "kind": "opening",
    "text": "Strikes at the centre straight away. Now e5 is attacked twice, by the knight and the d4 pawn.",
    "arrows": [
     [
      "d4",
      "e5",
      "green"
     ]
    ],
    "alternatives": [
     "Bc4"
    ]
   },
   {
    "kind": "plan",
    "text": "Pins the knight on f3 to the queen on d1: if the knight moves, the bishop takes the queen. Black hopes this stops the knight from taking on e5.",
    "arrows": [
     [
      "g4",
      "d1",
      "blue"
     ]
    ],
    "alternatives": [
     "exd4"
    ]
   },
   {
    "kind": "plan",
    "text": "Captures with the pawn and sets a problem. If 4...dxe5, then 5.Qxd8+ Kxd8 6.Nxe5 wins a pawn, because the queen trade removes the pin.",
    "arrows": [
     [
      "d1",
      "d8",
      "blue"
     ]
    ],
    "alternatives": [
     "c3"
    ]
   },
   {
    "kind": "plan",
    "text": "Gives up the bishop for the knight to avoid losing a pawn. It works, but it brings White's queen into the game and Black falls further behind in development.",
    "alternatives": [
     "Nd7"
    ]
   },
   {
    "kind": "opening",
    "text": "Recaptures with the queen, which now looks straight down the f-file at f7.",
    "arrows": [
     [
      "f3",
      "f7",
      "yellow"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Recaptures the pawn, so material is level. But Black has only moved pawns and given up a bishop, while White has the queen out."
   },
   {
    "kind": "tactic",
    "text": "Develops with a threat: queen and bishop both aim at f7, threatening Qxf7 checkmate. Spy for Black: what is White threatening?",
    "arrows": [
     [
      "c4",
      "f7",
      "green"
     ],
     [
      "f3",
      "f7",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Blocks the f-file so the queen no longer sees f7, and develops a piece. A good way to defend: stop the threat and bring out a piece in one move."
   },
   {
    "kind": "tactic",
    "text": "A double attack. The queen now hits the b7 pawn and also lines up behind the bishop against f7, threatening Bxf7+.",
    "arrows": [
     [
      "b3",
      "b7",
      "yellow"
     ],
     [
      "c4",
      "f7",
      "yellow"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Guards f7 a second time. If White grabs 8.Qxb7, then 8...Qb4+ forces a queen trade. The downside: the queen now blocks the bishop on f8 even more."
   },
   {
    "kind": "plan",
    "text": "Morphy prefers development to pawn-grabbing: he wants every piece in play before Black can catch up. The knight can also jump to d5 to attack the queen.",
    "better": "The engine prefers 8.Bxf7+ Qxf7 9.Qxb7, winning pawns and hitting the rook on a8 (about +3.2 compared with +1.8), but Morphy's move is also strong.",
    "arrows": [
     [
      "c3",
      "d5",
      "green"
     ]
    ],
    "alternatives": [
     "Bxf7+"
    ]
   },
   {
    "kind": "defence",
    "text": "Covers d5 and b5 so White's knight cannot jump in to attack the queen. Spy: the knight was eyeing d5."
   },
   {
    "kind": "plan",
    "text": "Develops the last minor piece with a pin: the knight on f6 cannot move without exposing the queen on e7 to the bishop.",
    "arrows": [
     [
      "g5",
      "e7",
      "blue"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "Attacks the bishop on c4, but it loosens the pawns in front of Black's king. Safe check: White can take on b5, and recapturing opens lines towards e8.",
    "better": "9...Na6 develops a piece and keeps Black's position together (about +1.4 instead of +2.8).",
    "alternatives": [
     "Na6"
    ]
   },
   {
    "kind": "key",
    "text": "A sacrifice: a knight for pawns. Taking on b5 removes the pawn attacking the bishop and tears open the queenside, where Black's king has no cover."
   },
   {
    "kind": "mistake",
    "text": "Accepting the knight lets White's bishop give check on b5 and opens lines to the king.",
    "better": "10...Qb4+ forces a queen trade first, which takes the sting out of White's attack (about +2.4 instead of +7).",
    "alternatives": [
     "Qb4+"
    ]
   },
   {
    "kind": "tactic",
    "text": "Check from b5. White now has two pawns for the knight and the attack, while Black's king is stuck in the centre.",
    "arrows": [
     [
      "b5",
      "e8",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Blocks the check, but the knight on d7 is now pinned to the king: it cannot move, because the bishop would then attack the king. The knight on f6 is pinned to the queen too."
   },
   {
    "kind": "key",
    "text": "Castles and brings a rook straight to the d-file in one move. The pinned knight on d7 is now attacked by both the bishop and the rook.",
    "arrows": [
     [
      "d1",
      "d7",
      "green"
     ],
     [
      "b5",
      "d7",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Adds another defender to d7. Black is in serious trouble whatever he plays (about +6).",
    "alternatives": [
     "Rb8"
    ]
   },
   {
    "kind": "tactic",
    "text": "Gives up a rook for the knight to remove a defender of d7. After the recapture, another white piece will attack d7 again, and the pin stays.",
    "arrows": [
     [
      "d1",
      "d7",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Recaptures, but the new rook on d7 is pinned to the king by the bishop on b5, just like the knight was.",
    "arrows": [
     [
      "b5",
      "e8",
      "blue"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "Brings the last rook to the d-file. The pinned rook on d7 is attacked by the bishop and the rook, and it cannot run away.",
    "arrows": [
     [
      "d1",
      "d7",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Defends d7 again and offers a queen trade, since the queen on e6 attacks White's queen on b3. Black is still lost, though.",
    "arrows": [
     [
      "e6",
      "b3",
      "red"
     ]
    ],
    "alternatives": [
     "Qb4"
    ]
   },
   {
    "kind": "tactic",
    "text": "Takes the rook with check, so Black has no time to trade queens. Black must deal with the check first."
   },
   {
    "kind": "mistake",
    "text": "Recapturing with the knight puts it back on d7, where it is the only piece blocking the d-file between White's rook and d8. If it can be lured away, the rook gets in.",
    "better": "15...Qxd7 avoids instant mate, although White is still completely winning (about +13).",
    "alternatives": [
     "Qxd7"
    ]
   },
   {
    "kind": "key",
    "text": "A queen sacrifice with check. It is a deflection: the knight on d7 is forced to take the queen, which opens the d-file for the rook.",
    "arrows": [
     [
      "d7",
      "b8",
      "yellow"
     ],
     [
      "d1",
      "d8",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: capturing the queen is the only legal move."
   },
   {
    "kind": "key",
    "text": "Checkmate. The rook checks from d8 and is protected by the bishop on g5, which also covers e7. Black's own bishop and pawn block f8 and f7, so the king has nowhere to go.",
    "arrows": [
     [
      "g5",
      "d8",
      "blue"
     ]
    ]
   }
  ]
 },
 {
  "id": "lasker-thomas-1912",
  "title": "The great king hunt",
  "white": "Edward Lasker",
  "black": "George Thomas",
  "event": "London",
  "year": 1912,
  "result": "1-0",
  "level": "Beginner",
  "opening": "Dutch Defence",
  "themes": [
   "queen sacrifice",
   "double check",
   "king hunt",
   "discovered check"
  ],
  "summary": "One of the most spectacular king walks ever played. White sacrifices the queen on h7 and then chases Black's king with check after check, from g8 all the way to g1, where it is mated. It shows how a few missed defensive moves near your king can be punished instantly.",
  "lessons": [
   "When your opponent's queen and bishop aim at the same square next to your king, like h7, stop and use Spy before every move.",
   "Double check forces the king to move, and a king dragged into the open is usually lost.",
   "Removing an attacking piece is often the best defence: one capture can break a whole attack.",
   "In a king hunt, keep giving checks. Each check gives your opponent no time to organise a defence."
  ],
  "moves": "d4 e6 Nf3 f5 Nc3 Nf6 Bg5 Be7 Bxf6 Bxf6 e4 fxe4 Nxe4 b6 Ne5 O-O Bd3 Bb7 Qh5 Qe7 Qxh7+ Kxh7 Nxf6+ Kh6 Neg4+ Kg5 h4+ Kf4 g3+ Kf3 Be2+ Kg2 Rh2+ Kg1 Kd2#",
  "evals": [
   -0.08,
   0.76,
   -0.11,
   1.12,
   -0.15,
   0.66,
   -0.18,
   0.77,
   0.09,
   0.49,
   0.09,
   1.33,
   0.62,
   1.29,
   -0.45,
   0.49,
   -1.93,
   0.83,
   -0.8,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20
  ],
  "notes": [
   {
    "kind": "opening",
    "text": "Takes a share of the centre. The pawn on d4 controls e5 and c5, and it opens a diagonal for the bishop on c1.",
    "alternatives": [
     "e4"
    ]
   },
   {
    "kind": "opening",
    "text": "A flexible move that opens a path for the bishop on f8 and keeps options open for the other central pawns.",
    "alternatives": [
     "d5"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops a piece towards the centre and adds control of e5.",
    "arrows": [
     [
      "f3",
      "e5",
      "green"
     ]
    ],
    "alternatives": [
     "e4"
    ]
   },
   {
    "kind": "opening",
    "text": "A Dutch Defence set-up: the f-pawn fights for e4. The cost is that Black's kingside is a little looser, because the f-pawn no longer shelters the king.",
    "alternatives": [
     "Nf6"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops and gets ready to play e4, challenging Black's f5 pawn.",
    "arrows": [
     [
      "c3",
      "e4",
      "green"
     ]
    ],
    "alternatives": [
     "e3"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops and adds more control over e4."
   },
   {
    "kind": "opening",
    "text": "Pins the knight on f6 to the queen on d8: if the knight moves, the bishop can take the queen.",
    "arrows": [
     [
      "g5",
      "d8",
      "blue"
     ]
    ],
    "alternatives": [
     "g3"
    ]
   },
   {
    "kind": "opening",
    "text": "Breaks the pin by putting the bishop between the knight and the queen, and prepares to castle."
   },
   {
    "kind": "plan",
    "text": "Swaps bishop for knight to remove a defender of e4. With the f6 knight gone, White can push e4 more easily."
   },
   {
    "kind": "opening",
    "text": "Recaptures with the bishop, keeping the kingside pawns healthy. Taking with the g-pawn would leave holes around Black's king."
   },
   {
    "kind": "plan",
    "text": "Strikes in the centre and attacks the f5 pawn. White wants to open lines while Black's king is still in the middle.",
    "arrows": [
     [
      "e4",
      "f5",
      "green"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "Captures, but this gives White's knight a lovely central square on e4. Holding the centre with ...d5 or castling first was a little more accurate.",
    "alternatives": [
     "d5"
    ]
   },
   {
    "kind": "opening",
    "text": "Recaptures, and the knight lands on e4, where it eyes f6, d6 and g5.",
    "arrows": [
     [
      "e4",
      "f6",
      "yellow"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "Prepares ...Bb7 to put the bishop on the long diagonal aimed at the knight on e4 and White's g2 pawn. Black still has not castled.",
    "alternatives": [
     "O-O"
    ]
   },
   {
    "kind": "plan",
    "text": "The second knight jumps to a strong central square. From e5 it can later go to g4 or attack f7.",
    "arrows": [
     [
      "e5",
      "g4",
      "green"
     ]
    ],
    "alternatives": [
     "c3"
    ]
   },
   {
    "kind": "plan",
    "text": "Castles the king to safety. Note that the h7 pawn is now protected only by the king, which will matter soon."
   },
   {
    "kind": "mistake",
    "text": "Develops the bishop onto the diagonal aimed at h7, but it leaves the knight on e5 without enough support.",
    "better": "9.g3 or 9.Qg4 kept an edge (about +0.5 to +0.8); after 9.Bd3 the engine shows 9...Bxe5 10.dxe5 Nc6, attacking the loose e5 pawn, with Black better (about -1.1).",
    "arrows": [
     [
      "d3",
      "h7",
      "blue"
     ]
    ],
    "alternatives": [
     "Qg4"
    ]
   },
   {
    "kind": "mistake",
    "text": "Develops the bishop to the long diagonal, aiming at the knight on e4, but misses the chance to remove the knight on e5.",
    "better": "9...Bxe5 10.dxe5 Nc6 would have won the e5 pawn (about -1.1 instead of +0.7).",
    "arrows": [
     [
      "b7",
      "e4",
      "yellow"
     ]
    ],
    "alternatives": [
     "Bxe5"
    ]
   },
   {
    "kind": "key",
    "text": "The queen joins the bishop on d3 in aiming at h7. The threat is a queen sacrifice on h7 followed by a double check. Spy for Black: what does White want to do?",
    "arrows": [
     [
      "h5",
      "h7",
      "red"
     ],
     [
      "d3",
      "h7",
      "blue"
     ]
    ],
    "alternatives": [
     "O-O"
    ]
   },
   {
    "kind": "mistake",
    "text": "A natural developing move, but it does nothing against the threat on h7. Black needed to break up the attack now.",
    "better": "10...Bxe5 removes the knight that later chases the king, and the game stays level (about 0.0).",
    "alternatives": [
     "Bxe5"
    ]
   },
   {
    "kind": "key",
    "text": "A queen sacrifice. The point is not the h7 pawn, but to drag Black's king out to h7, where White's knights and bishop can hunt it.",
    "arrows": [
     [
      "h5",
      "h7",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: taking the queen is the only legal move."
   },
   {
    "kind": "tactic",
    "text": "Double check. The knight checks from f6, and moving it uncovers the bishop on d3 checking along the diagonal. Black cannot capture both checkers, so the king must move.",
    "arrows": [
     [
      "f6",
      "h7",
      "blue"
     ],
     [
      "d3",
      "h7",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The king steps forward because 12...Kh8 loses at once to 13.Ng6#. Every move from here is forced."
   },
   {
    "kind": "tactic",
    "text": "The other knight jumps in with check, driving the king further up the board. The only legal reply is Kg5.",
    "arrows": [
     [
      "g4",
      "h6",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: g5 is the only square left for the king."
   },
   {
    "kind": "tactic",
    "text": "A pawn check, protected by the rook on h1. Again the king has only one square.",
    "arrows": [
     [
      "h1",
      "h4",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: the king's only legal move."
   },
   {
    "kind": "tactic",
    "text": "Another pawn check pushes the king to f3, deep in White's half of the board."
   },
   {
    "kind": "defence",
    "text": "Forced: f3 is the only legal square."
   },
   {
    "kind": "tactic",
    "text": "Check with the bishop. It still wins quickly, though the engine shows 16.O-O or 16.Kf1 would have mated one move sooner.",
    "arrows": [
     [
      "e2",
      "f3",
      "green"
     ]
    ],
    "alternatives": [
     "O-O"
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: the king's only legal move."
   },
   {
    "kind": "tactic",
    "text": "The rook checks along the second rank and is protected by the knight on g4. The king is pushed to its final square.",
    "arrows": [
     [
      "g4",
      "h2",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: g1 is the only legal square. Black's king has walked from g8 all the way to g1."
   },
   {
    "kind": "key",
    "text": "Discovered checkmate: the king steps aside and uncovers the rook on a1 along the first rank. The bishop covers f1, and the rook on h2 covers g2, h1 and f2, with the knight on g4 protecting it. 18.O-O-O would also have been mate.",
    "arrows": [
     [
      "a1",
      "g1",
      "blue"
     ]
    ]
   }
  ]
 },
 {
  "id": "anderssen-dufresne-1852",
  "title": "The Evergreen Game",
  "white": "Adolf Anderssen",
  "black": "Jean Dufresne",
  "event": "Berlin (Evergreen Game)",
  "year": 1852,
  "result": "1-0",
  "level": "Intermediate",
  "opening": "Evans Gambit",
  "themes": [
   "gambit",
   "king in the centre",
   "open files",
   "double check",
   "queen sacrifice"
  ],
  "summary": "Anderssen gives up a pawn for fast development, and Black's king never finds safety in the centre. The finish, a rook sacrifice, a queen sacrifice and a double check, is one of the most famous mating attacks ever played. The engine shows the attack was not always the soundest choice, but the patterns it uses (open files, deflection, double check) appear in club games every day.",
  "lessons": [
   "Castle early. Black's king stayed on e8 all game, and every open file and diagonal eventually pointed at it.",
   "When the opponent threatens mate, check whether you have a faster forcing sequence. Checks come first: White's checks arrived before Black's mate on g2.",
   "A double check (two pieces giving check at once) can only be answered by a king move, so it is often the key to a mating net.",
   "Deflection: a sacrifice can lure a defender off a key square. 20.Rxe7+ pulled the c6 knight away and opened the queen's path to d7."
  ],
  "moves": "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O d3 Qb3 Qf6 e5 Qg6 Re1 Nge7 Ba3 b5 Qxb5 Rb8 Qa4 Bb6 Nbd2 Bb7 Ne4 Qf5 Bxd3 Qh5 Nf6+ gxf6 exf6 Rg8 Rad1 Qxf3 Rxe7+ Nxe7 Qxd7+ Kxd7 Bf5+ Ke8 Bd7+ Kf8 Bxe7#",
  "evals": [
   0.03,
   0.78,
   0.37,
   0.74,
   0.26,
   0.86,
   -0.97,
   -0.11,
   -0.85,
   0.17,
   -1.03,
   -0.3,
   -0.94,
   0.33,
   -0.22,
   0.65,
   0.1,
   0.88,
   -0.25,
   0.13,
   -1.4,
   1.42,
   0.29,
   0.89,
   0.49,
   1.27,
   0,
   2.3,
   1.09,
   5.7,
   4.27,
   6.51,
   -3.99,
   -0.03,
   -0.47,
   0.24,
   -1.12,
   2.5,
   2.03,
   20,
   20,
   20,
   20,
   20,
   20,
   20,
   20
  ],
  "notes": [
   {
    "kind": "opening",
    "text": "A classic first move: the pawn claims the centre and opens lines for the queen and the light-squared bishop.",
    "arrows": [
     [
      "e2",
      "e4",
      "green"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Black mirrors White, staking an equal claim to the centre and freeing the dark-squared bishop and queen.",
    "alternatives": [
     "e6"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops a piece with a threat: the knight attacks the e5 pawn, which nothing defends yet.",
    "arrows": [
     [
      "f3",
      "e5",
      "red"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Spy first: the e5 pawn was attacked. The knight defends it while developing towards the centre.",
    "alternatives": [
     "Nf6"
    ]
   },
   {
    "kind": "opening",
    "text": "The bishop takes the long diagonal towards f7, the weakest square in Black's camp because only the king guards it.",
    "arrows": [
     [
      "c4",
      "f7",
      "blue"
     ]
    ],
    "alternatives": [
     "Nc3"
    ]
   },
   {
    "kind": "opening",
    "text": "Black copies the idea: the bishop on c5 aims at f2, White's own weak point. This is the Italian Game.",
    "arrows": [
     [
      "c5",
      "f2",
      "blue"
     ]
    ],
    "alternatives": [
     "Nf6"
    ]
   },
   {
    "kind": "opening",
    "text": "The Evans Gambit: White offers a pawn to gain time. If Black takes, White plays c3 and d4 with tempo, building a big centre quickly.",
    "arrows": [
     [
      "b4",
      "c5",
      "red"
     ]
    ],
    "alternatives": [
     "c3"
    ]
   },
   {
    "kind": "opening",
    "text": "Black accepts the pawn. Romantic-era players usually did, and the gambit pawn now has to be repaid with fast development."
   },
   {
    "kind": "opening",
    "text": "Attacks the bishop on b4 and prepares d4. The bishop must move again, giving White another free tempo.",
    "arrows": [
     [
      "c3",
      "b4",
      "red"
     ],
     [
      "d2",
      "d4",
      "green"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "The bishop retreats but stays on the a5-e1 diagonal, keeping an eye on c3 and staying out of reach of further pawn attacks."
   },
   {
    "kind": "opening",
    "text": "The point of the gambit: White strikes in the centre, attacking e5 and opening lines for the bishops.",
    "arrows": [
     [
      "d4",
      "e5",
      "red"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Black captures, keeping the extra pawn for now. The new pawn on d4 attacks c3."
   },
   {
    "kind": "opening",
    "text": "King safety first. White ignores the attacked c3 pawn and gets the king out of the centre, trusting development to make up for the pawns.",
    "alternatives": [
     "Qb3"
    ]
   },
   {
    "kind": "mistake",
    "text": "The pawn runs forward to d3 to avoid being exchanged, but it is cut off there and White will win it back later. Black spends a tempo instead of developing.",
    "better": "7...Nf6 or 7...dxc3 kept Black slightly better by developing or grabbing material (about -0.6).",
    "alternatives": [
     "Nf6"
    ]
   },
   {
    "kind": "plan",
    "text": "The queen lines up behind the bishop on the b3-f7 diagonal, forming a battery (two pieces on one line) against f7.",
    "arrows": [
     [
      "b3",
      "f7",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Spy: f7 was under double pressure. The queen defends it, though it can be harassed on f6."
   },
   {
    "kind": "tactic",
    "text": "Gains time by attacking the queen with a pawn. The e5 pawn also takes the f6 and d6 squares from Black's knights.",
    "arrows": [
     [
      "e5",
      "f6",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen steps away to g6, where it still guards f7 and eyes White's kingside."
   },
   {
    "kind": "plan",
    "text": "The rook supports the advanced e5 pawn and takes up the e-file, which will matter when Black's king stays on e8.",
    "arrows": [
     [
      "e1",
      "e5",
      "blue"
     ]
    ],
    "alternatives": [
     "Rd1"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops the last kingside piece so Black can think about castling."
   },
   {
    "kind": "plan",
    "text": "The bishop aims down the a3-f8 diagonal. If the e7 knight ever moves, the bishop will cover f8 and Black will no longer be able to castle short.",
    "arrows": [
     [
      "a3",
      "f8",
      "blue"
     ]
    ],
    "alternatives": [
     "Re3"
    ]
   },
   {
    "kind": "mistake",
    "text": "Black returns a pawn to try to gain time against the bishop on c4, but White simply captures and keeps the initiative.",
    "better": "11...d5 hits the bishop and frees the c8 bishop, leaving Black about a pawn better (about -1.0).",
    "alternatives": [
     "d5"
    ]
   },
   {
    "kind": "tactic",
    "text": "Takes the pawn with the queen, keeping the c4 bishop safe. Black is still a pawn up thanks to the d3 pawn, but White is clearly better developed."
   },
   {
    "kind": "tactic",
    "text": "Gains a tempo by attacking the queen and puts the rook on the half-open b-file.",
    "arrows": [
     [
      "b8",
      "b5",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen escapes to a4, where it attacks the bishop on a5. The knight on c6 defends it, so Black must keep that knight in place.",
    "arrows": [
     [
      "a4",
      "a5",
      "yellow"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "The bishop leaves the queen's attack and settles on b6, aiming at f2.",
    "arrows": [
     [
      "b6",
      "f2",
      "blue"
     ]
    ],
    "alternatives": [
     "d2"
    ]
   },
   {
    "kind": "plan",
    "text": "Develops the last minor piece. The knight on d2 blocks the d3 pawn and is heading for e4, close to Black's king.",
    "alternatives": [
     "Qd1"
    ]
   },
   {
    "kind": "mistake",
    "text": "A natural developing move, but the king stays in the centre one move too long. White's knight is about to reach e4 with ideas of Nf6+ and Nd6+.",
    "better": "14...O-O got the king to safety while it was still allowed, keeping the game roughly level (about +0.3).",
    "alternatives": [
     "O-O"
    ]
   },
   {
    "kind": "plan",
    "text": "The knight jumps towards Black's king. From e4 it eyes the d6 and f6 squares, both of which give check.",
    "arrows": [
     [
      "e4",
      "f6",
      "green"
     ],
     [
      "e4",
      "d6",
      "green"
     ]
    ],
    "alternatives": [
     "Re4"
    ]
   },
   {
    "kind": "mistake",
    "text": "The queen attacks the knight on e4 and the e5 pawn, but f5 is a dangerous square: it sits on the same diagonal as d3, and Nd6+ would already fork king and queen.",
    "better": "15...d2, pushing the pawn on to tie White down, kept the damage small (about +1.9).",
    "alternatives": [
     "d2"
    ]
   },
   {
    "kind": "tactic",
    "text": "Wins back the pawn and sets up a discovered attack: the bishop is now behind the e4 knight, aimed at the queen on f5. Any knight move uncovers an attack on the queen.",
    "arrows": [
     [
      "d3",
      "f5",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen steps off the dangerous diagonal. 16...Qe6 was a little better, but White's advantage is already large.",
    "alternatives": [
     "Qe6"
    ]
   },
   {
    "kind": "mistake",
    "text": "The famous sacrifice: check, a hit on the queen, and the knight offered to open the e- and g-files around Black's king. It is spectacular, but the engine shows it gives away most of White's advantage.",
    "better": "17.Ng3 simply chases the queen and keeps a crushing grip on the uncastled king (about +6.5); after the sacrifice it is roughly level.",
    "arrows": [
     [
      "f6",
      "h5",
      "red"
     ],
     [
      "f6",
      "e8",
      "red"
     ]
    ],
    "alternatives": [
     "Ng3"
    ]
   },
   {
    "kind": "defence",
    "text": "Practically forced: moving the king instead allows Nxh5, losing the queen."
   },
   {
    "kind": "tactic",
    "text": "Opens the e-file. The e7 knight is now pinned (it can't move without exposing the king to the e1 rook) and attacked by the f6 pawn, the a3 bishop and the rook.",
    "arrows": [
     [
      "e1",
      "e8",
      "blue"
     ],
     [
      "f6",
      "e7",
      "yellow"
     ]
    ]
   },
   {
    "kind": "key",
    "text": "Black counterattacks instead of defending. The rook on the open g-file joins the queen against g2, threatening ideas like ...Qh3 and ...Qxg2 mate. Grabbing the knight with 19.fxe7 or 19.Bxe7 now loses to that attack.",
    "arrows": [
     [
      "g8",
      "g2",
      "red"
     ]
    ]
   },
   {
    "kind": "key",
    "text": "The quiet move at the heart of the game. White brings the last piece to the d-file, preparing Rxe7+ and Qxd7+. With perfect defence Black can hold, so it is a trap rather than a forced win.",
    "arrows": [
     [
      "d1",
      "d7",
      "blue"
     ]
    ],
    "alternatives": [
     "Qf4"
    ]
   },
   {
    "kind": "mistake",
    "text": "Spy failed: Black sees only their own threat of ...Qxg2 mate and misses that White's checks come first.",
    "better": "19...Bd4 blocks the d-file so the rook can't reach d7, holding the balance (about 0.0); 19...Rxg2+ fails to 20.Kxg2 (about +2.6).",
    "alternatives": [
     "Rxg2+"
    ]
   },
   {
    "kind": "tactic",
    "text": "Deflection with check. The rook is offered to drag the c6 knight away, which opens the queen's diagonal from a4 to d7.",
    "arrows": [
     [
      "a4",
      "d7",
      "blue"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "Capturing with the knight unblocks the a4-d7 diagonal and allows a forced mate. After the alternatives Black is still losing, but there is no immediate mate.",
    "better": "20...Kd8 avoids the mate, although 21.Rxd7+ keeps White winning (about +3).",
    "alternatives": [
     "Kd8"
    ]
   },
   {
    "kind": "key",
    "text": "The queen sacrifice. It drags Black’s king to d7, in line with the rook on d1. Only the d3 bishop stands between them, so any bishop move will give discovered check.",
    "arrows": [
     [
      "d1",
      "d7",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Black has only two legal moves, and 21...Kf8 allows mate at once on e7. Taking the queen is the only try."
   },
   {
    "kind": "key",
    "text": "Double check: the bishop gives check from f5, and moving it uncovers the rook on d1. No piece can block both, so the king must move.",
    "arrows": [
     [
      "f5",
      "d7",
      "red"
     ],
     [
      "d1",
      "d7",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "One of only two legal moves; the other, 22...Kc6, is mated at once by 23.Bd7."
   },
   {
    "kind": "tactic",
    "text": "Another bishop check, this time from d7, against the king on e8. The king must step to f8 or d8."
   },
   {
    "kind": "defence",
    "text": "Both king moves lose to mate next move; there is no escape left."
   },
   {
    "kind": "key",
    "text": "Checkmate. The bishop on e7 checks f8 and is guarded by the f6 pawn, which also covers g7. The d7 bishop covers e8, and Black's own rook blocks g8.",
    "arrows": [
     [
      "e7",
      "f8",
      "red"
     ],
     [
      "f6",
      "g7",
      "blue"
     ]
    ]
   }
  ]
 },
 {
  "id": "anderssen-kieseritzky-1851",
  "title": "The Immortal Game",
  "white": "Adolf Anderssen",
  "black": "Lionel Kieseritzky",
  "event": "London (Immortal Game)",
  "year": 1851,
  "result": "1-0",
  "level": "Intermediate",
  "opening": "King's Gambit Accepted, Bishop's Gambit (Bryan Countergambit)",
  "themes": [
   "gambit",
   "development",
   "king hunt",
   "sacrifice",
   "minor-piece mate"
  ],
  "summary": "Anderssen gives away a bishop, both rooks and finally his queen, then mates with three minor pieces while Black's army sits at home. The engine finds plenty of errors on both sides, including the famous 18.Bd6, but the game is a perfect lesson in what happens when one side develops and the other grabs material.",
  "lessons": [
   "Development beats material. Black won two rooks and a bishop, but most of Black's pieces never moved, so they couldn't defend the king.",
   "Every queen move in the opening costs time. Black's queen moved again and again while White brought out new pieces with tempo.",
   "Before grabbing material, ask what your opponent threatens (Spy). Taking the g1 rook let White shut Black's queen away from the kingside.",
   "Minor pieces can mate on their own when the enemy king has no defenders and its escape squares are covered."
  ],
  "moves": "e4 e5 f4 exf4 Bc4 Qh4+ Kf1 b5 Bxb5 Nf6 Nf3 Qh6 d3 Nh5 Nh4 Qg5 Nf5 c6 g4 Nf6 Rg1 cxb5 h4 Qg6 h5 Qg5 Qf3 Ng8 Bxf4 Qf6 Nc3 Bc5 Nd5 Qxb2 Bd6 Bxg1 e5 Qxa1+ Ke2 Na6 Nxg7+ Kd8 Qf6+ Nxf6 Be7#",
  "evals": [
   0.03,
   0.78,
   -1.17,
   -0.21,
   -1,
   0,
   -1.44,
   0.76,
   -0.39,
   0.42,
   -0.14,
   0.78,
   -0.66,
   0.75,
   -1.25,
   -1.31,
   -1.48,
   0.5,
   -1.4,
   -0.21,
   -0.5,
   2.24,
   1.43,
   1.79,
   0.56,
   2.12,
   1.65,
   2.97,
   2.68,
   3.29,
   3.12,
   5.12,
   3.56,
   4.77,
   -7.9,
   2.23,
   -9.02,
   -9.24,
   -3.69,
   20,
   20,
   20,
   20,
   20,
   20
  ],
  "notes": [
   {
    "kind": "opening",
    "text": "The pawn claims the centre and opens lines for the queen and the light-squared bishop.",
    "arrows": [
     [
      "e2",
      "e4",
      "green"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Black stakes an equal share of the centre and frees the dark-squared bishop and queen.",
    "alternatives": [
     "e6"
    ]
   },
   {
    "kind": "opening",
    "text": "The King's Gambit. White offers a pawn to deflect Black's e-pawn from the centre and open the f-file for an attack.",
    "arrows": [
     [
      "f4",
      "e5",
      "red"
     ]
    ],
    "alternatives": [
     "Nf3"
    ]
   },
   {
    "kind": "opening",
    "text": "Black accepts the gambit pawn. The f4 pawn also takes away the e3 and g3 squares from White's pieces."
   },
   {
    "kind": "opening",
    "text": "The Bishop's Gambit. Instead of the usual Nf3, White develops the bishop to aim at f7, Black's weakest point.",
    "arrows": [
     [
      "c4",
      "f7",
      "blue"
     ]
    ],
    "alternatives": [
     "Nf3"
    ]
   },
   {
    "kind": "tactic",
    "text": "Because White has not played Nf3, the queen can check on h4. White must move the king or play g3, which the f4 pawn could capture.",
    "arrows": [
     [
      "h4",
      "e1",
      "red"
     ]
    ],
    "alternatives": [
     "c6"
    ]
   },
   {
    "kind": "defence",
    "text": "The standard reply. White's king loses the right to castle, but the queen on h4 will soon be chased with gain of time."
   },
   {
    "kind": "mistake",
    "text": "The Bryan Countergambit: Black returns a pawn to pull the bishop off the a2-g8 diagonal. It was popular then, but it costs time.",
    "better": "4...Nf6 or 4...d5 develop and fight for the centre, keeping Black slightly better (about -1.0).",
    "arrows": [
     [
      "b5",
      "c4",
      "red"
     ]
    ],
    "alternatives": [
     "d5"
    ]
   },
   {
    "kind": "opening",
    "text": "Takes the free pawn. The bishop on b5 is a little offside, but material is now level."
   },
   {
    "kind": "opening",
    "text": "Develops with a threat: the knight attacks the e4 pawn, which nothing defends.",
    "arrows": [
     [
      "f6",
      "e4",
      "red"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Develops with tempo by attacking the queen on h4. White trusts that Black is too busy to take on e4.",
    "arrows": [
     [
      "f3",
      "h4",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen escapes to h6, where it still guards the f4 pawn along the h6-c1 diagonal."
   },
   {
    "kind": "plan",
    "text": "Solid: the pawn defends e4 and opens a path for the c1 bishop. But it is slow, and the engine prefers developing a piece.",
    "better": "7.Nc3 defends e4 with a piece and keeps White a little better (about +0.7).",
    "alternatives": [
     "Nc3"
    ]
   },
   {
    "kind": "plan",
    "text": "The knight guards f4 and eyes g3, where ...Ng3+ would fork the king on f1 and the rook on h1. But the knight on the rim is out of play.",
    "better": "7...c6 attacks the bishop on b5 and gains time (about -0.9).",
    "arrows": [
     [
      "h5",
      "g3",
      "red"
     ]
    ],
    "alternatives": [
     "c6"
    ]
   },
   {
    "kind": "plan",
    "text": "The knight plugs the h-file and heads for f5, where it will hit the queen on h6. It also walks into a double attack.",
    "better": "8.Rg1 steps the rook off h1 so ...Ng3+ forks nothing, and keeps the balance (about +0.3).",
    "alternatives": [
     "Nc3"
    ]
   },
   {
    "kind": "tactic",
    "text": "A double attack: the queen hits the knight on h4 and, along the fifth rank, the bishop on b5. Both are undefended.",
    "arrows": [
     [
      "g5",
      "h4",
      "yellow"
     ],
     [
      "g5",
      "b5",
      "yellow"
     ]
    ],
    "alternatives": [
     "g6"
    ]
   },
   {
    "kind": "defence",
    "text": "One move solves both problems. The knight escapes and blocks the fifth rank, shielding the b5 bishop, and the e4 pawn defends it on f5.",
    "arrows": [
     [
      "f5",
      "g7",
      "blue"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "Black attacks the bishop on b5 again, but this is yet another non-developing move.",
    "better": "9...g6 chases the strong knight on f5 first (about -0.7).",
    "alternatives": [
     "g6"
    ]
   },
   {
    "kind": "mistake",
    "text": "Anderssen ignores the threat to his bishop and attacks the h5 knight instead, gaining space on the kingside. It's bold, but the engine says it gives up too much.",
    "better": "10.Ba4 simply saves the bishop and keeps a small edge (about +0.8).",
    "arrows": [
     [
      "g4",
      "h5",
      "red"
     ]
    ],
    "alternatives": [
     "Ba4"
    ]
   },
   {
    "kind": "mistake",
    "text": "The knight retreats and now attacks the g4 pawn. Black misses a chance to hit back at the f5 knight.",
    "better": "10...g6 attacks the knight on f5, and White's pieces start to come apart (about -1.8)."
   },
   {
    "kind": "plan",
    "text": "The rook defends the g4 pawn and leaves h1, where it could have been forked. The bishop on b5 is now openly sacrificed.",
    "arrows": [
     [
      "g1",
      "g4",
      "blue"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "Black wins a whole bishop, but White now gains time with pawn moves against the queen, which is short of squares.",
    "better": "11...h5 first, hitting the g4 pawn, kept Black better (about -0.9).",
    "alternatives": [
     "h5"
    ]
   },
   {
    "kind": "tactic",
    "text": "The pawn attacks the queen on g5. White's kingside pawns are now used as attacking pieces to gain tempi.",
    "arrows": [
     [
      "h4",
      "g5",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen steps back to g6, her only safe square. Taking on h4, g4 or f5 would give up the queen for much less."
   },
   {
    "kind": "tactic",
    "text": "Another tempo: the pawn attacks the queen again and the queen keeps being pushed around.",
    "arrows": [
     [
      "h5",
      "g6",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen returns to g5, attacking the h5 pawn. Her moves have gained Black nothing while White's pawns have advanced."
   },
   {
    "kind": "plan",
    "text": "The queen joins the attack on f4, so the c1 bishop can capture there with a hit on Black's queen.",
    "arrows": [
     [
      "f3",
      "f4",
      "yellow"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "The knight goes back home to avoid e4-e5 and to free f6 for the queen. Black is now almost completely undeveloped.",
    "better": "14...Bb7 develops and attacks the e4 pawn (about +1.0).",
    "alternatives": [
     "Bb7"
    ]
   },
   {
    "kind": "tactic",
    "text": "Wins the pawn back and develops with tempo, attacking the queen on g5.",
    "arrows": [
     [
      "f4",
      "g5",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen escapes to f6, from where she eyes the b2 pawn along the long diagonal.",
    "arrows": [
     [
      "f6",
      "b2",
      "red"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "Development matters more than the b2 pawn. The knight attacks b5 and heads for d5, hitting the queen.",
    "arrows": [
     [
      "c3",
      "d5",
      "green"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "The bishop develops with a threat on the g1 rook, but it lets White's pieces flood in with gain of time.",
    "better": "16...Qc6 moves the queen off f6, where Nd5 would hit it, and limits the damage (about +2.3).",
    "alternatives": [
     "Qc6"
    ]
   },
   {
    "kind": "key",
    "text": "Instead of saving the rook, White attacks the queen. Each tempo is used to bring pieces nearer the king. The engine slightly prefers 17.d4, but this keeps a big advantage.",
    "arrows": [
     [
      "d5",
      "f6",
      "red"
     ]
    ],
    "alternatives": [
     "d4"
    ]
   },
   {
    "kind": "tactic",
    "text": "Black grabs a pawn and now attacks both rooks: ...Qxa1+ and ...Bxg1 are both on offer.",
    "arrows": [
     [
      "b2",
      "a1",
      "red"
     ],
     [
      "c5",
      "g1",
      "red"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "The legendary offer of both rooks. The bishop covers c7 and e7 around Black's king and attacks the c5 bishop. But the engine shows it should lose.",
    "better": "18.Re1 saves the rook and keeps a winning attack (about +5.4); after 18.Bd6, 18...Qxa1+ wins for Black (about -5.3).",
    "alternatives": [
     "Re1"
    ]
   },
   {
    "kind": "mistake",
    "text": "Spy failed: Black takes a rook without asking what White threatens next. The queen stays on b2, where a single pawn move can cut her off.",
    "better": "18...Qxa1+ 19.Ke2 Qb2 takes the rook with check and brings the queen back to guard g7 (about -5.3).",
    "alternatives": [
     "Qxa1+"
    ]
   },
   {
    "kind": "key",
    "text": "The quiet killer. The pawn blocks the b2-g7 diagonal, so the g7 pawn loses its only defender, and Nxg7+ is coming.",
    "better": "The engine prefers 19.Re1 (about +5.0), but White stays clearly better after this too (about +1.5).",
    "arrows": [
     [
      "e5",
      "b2",
      "blue"
     ],
     [
      "f5",
      "g7",
      "yellow"
     ]
    ],
    "alternatives": [
     "Re1"
    ]
   },
   {
    "kind": "tactic",
    "text": "Takes the second rook with check. Black is now two rooks and a bishop ahead, but almost none of those pieces can reach the king."
   },
   {
    "kind": "defence",
    "text": "The king steps up to e2. The only other legal moves are 20.Kg2 and blocking with the queen on d1, and the engine rates this best.",
    "alternatives": [
     "Kg2"
    ]
   },
   {
    "kind": "mistake",
    "text": "The knight guards c7 against Nc7+, which would fork the king and the a8 rook. But it does nothing about the threat on g7, and mate follows.",
    "better": "20...Ba6 avoids the mate, though White is still better (about +1.5).",
    "alternatives": [
     "Ba6"
    ]
   },
   {
    "kind": "tactic",
    "text": "The knight takes g7 with check. The king has only one square to go to."
   },
   {
    "kind": "defence",
    "text": "Forced: d8 is the only legal square for the king."
   },
   {
    "kind": "key",
    "text": "The final sacrifice. The queen gives check and deflects the g8 knight, the only piece guarding e7.",
    "arrows": [
     [
      "f6",
      "d8",
      "red"
     ],
     [
      "g8",
      "e7",
      "yellow"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "There is no escape. The other legal move, 22...Ne7, allows Qxe7 mate.",
    "alternatives": [
     "Ne7"
    ]
   },
   {
    "kind": "key",
    "text": "Checkmate with three minor pieces. The bishop checks d8 and is guarded by the d5 knight, which also covers c7, and the g7 knight covers e8.",
    "arrows": [
     [
      "d5",
      "c7",
      "blue"
     ],
     [
      "g7",
      "e8",
      "blue"
     ]
    ]
   }
  ]
 },
 {
  "id": "byrne-fischer-1956",
  "aliases": [
   "fischer-byrne-1956"
  ],
  "title": "The Game of the Century",
  "white": "Donald Byrne",
  "black": "Bobby Fischer",
  "event": "New York (Game of the Century)",
  "year": 1956,
  "result": "0-1",
  "level": "Intermediate",
  "opening": "Grünfeld Defence (by transposition)",
  "themes": [
   "king in the centre",
   "queen sacrifice",
   "windmill",
   "discovered check",
   "piece coordination",
   "mating net"
  ],
  "summary": "Thirteen-year-old Bobby Fischer punishes White for leaving his king in the centre. After a knight offer on a4 and the famous queen sacrifice 17...Be6, a windmill of discovered checks wins back far more than the queen, and Black's rooks, bishops and knight then hunt the white king into a mating net.",
  "lessons": [
   "Castle and finish your development before chasing ideas: White's king never left the centre, and every Black tactic used that.",
   "Count material at the end of the combination, not at the start. Giving up the queen is fine if you win back more.",
   "A bishop lined up on the enemy king turns every knight move into a possible discovered check.",
   "When you are ahead in material, use all your pieces together: Fischer's mate needed rook, bishop and knight working as a team."
  ],
  "moves": "Nf3 Nf6 c4 g6 Nc3 Bg7 d4 O-O Bf4 d5 Qb3 dxc4 Qxc4 c6 e4 Nbd7 Rd1 Nb6 Qc5 Bg4 Bg5 Na4 Qa3 Nxc3 bxc3 Nxe4 Bxe7 Qb6 Bc4 Nxc3 Bc5 Rfe8+ Kf1 Be6 Bxb6 Bxc4+ Kg1 Ne2+ Kf1 Nxd4+ Kg1 Ne2+ Kf1 Nc3+ Kg1 axb6 Qb4 Ra4 Qxb6 Nxd1 h3 Rxa2 Kh2 Nxf2 Re1 Rxe1 Qd8+ Bf8 Nxe1 Bd5 Nf3 Ne4 Qb8 b5 h4 h5 Ne5 Kg7 Kg1 Bc5+ Kf1 Ng3+ Ke1 Bb4+ Kd1 Bb3+ Kc1 Ne2+ Kb1 Nc3+ Kc1 Rc2#",
  "evals": [
   -0.05,
   0.48,
   -0.04,
   0.76,
   0.52,
   1.31,
   0.59,
   1.18,
   0,
   0.69,
   -0.49,
   0.16,
   -0.18,
   0.87,
   0.22,
   0.99,
   0.31,
   1.21,
   0.04,
   0.95,
   -2.09,
   -0.84,
   -2.17,
   -1.17,
   -1.99,
   -1.86,
   -2,
   -0.17,
   -1.86,
   -1.88,
   -2.32,
   0.24,
   -2.06,
   -1.87,
   -5.65,
   -6.49,
   -6.98,
   -6.01,
   -6.62,
   -6.45,
   -6.8,
   -6.32,
   -6.86,
   -6.45,
   -6.83,
   -6.4,
   -7.19,
   -7.06,
   -7.87,
   -7.26,
   -7.71,
   -8.11,
   -8.47,
   -8.17,
   -9.58,
   -9.02,
   -9.36,
   -9.27,
   -9.64,
   -9.42,
   -11.13,
   -10.36,
   -10.59,
   -9.93,
   -11.16,
   -10.79,
   -11.49,
   -11.34,
   -19.56,
   -16.76,
   -20,
   -20,
   -20,
   -20,
   -20,
   -20,
   -20,
   -20,
   -20,
   -20,
   -20,
   -20
  ],
  "notes": [
   {
    "kind": "opening",
    "text": "A flexible first move: the knight develops towards the centre, controls e5 and d4, and keeps options open for c4 or d4 later.",
    "alternatives": [
     "e4"
    ]
   },
   {
    "kind": "opening",
    "text": "Black mirrors the idea, developing the knight to its best square and keeping an eye on e4 and d5.",
    "alternatives": [
     "d5"
    ]
   },
   {
    "kind": "opening",
    "text": "The c-pawn claims space on the queenside and controls d5, a typical English Opening set-up.",
    "alternatives": [
     "d4"
    ]
   },
   {
    "kind": "opening",
    "text": "Black prepares to fianchetto the bishop, which means placing it on g7 where it will look down the long diagonal towards the centre and White's queenside.",
    "alternatives": [
     "e6"
    ]
   },
   {
    "kind": "opening",
    "text": "Another developing move: the knight adds control of d5 and e4.",
    "alternatives": [
     "d4"
    ]
   },
   {
    "kind": "opening",
    "text": "The fianchetto is complete. The bishop on g7 is one of Black's key pieces in this opening: once the knight on f6 moves, it looks straight down the long diagonal at d4 and b2.",
    "alternatives": [
     "c5"
    ]
   },
   {
    "kind": "opening",
    "text": "White takes a big share of the centre with pawns on c4 and d4."
   },
   {
    "kind": "opening",
    "text": "Black castles early, getting the king safe before the fighting starts. Compare this with White, who never castles in this game.",
    "alternatives": [
     "d5"
    ]
   },
   {
    "kind": "opening",
    "text": "The bishop develops actively, eyeing c7 and the e5 square.",
    "alternatives": [
     "e4"
    ]
   },
   {
    "kind": "opening",
    "text": "Black strikes at the centre straight away, Grünfeld style. The d5 pawn challenges c4, which is now attacked and not defended.",
    "arrows": [
     [
      "d5",
      "c4",
      "green"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "The queen defends c4 and keeps pressure on d5. It also eyes the b7 pawn, but moving the queen this early, before the kingside is developed, is a little ambitious.",
    "arrows": [
     [
      "b3",
      "b7",
      "blue"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Black captures on c4, swapping the central d-pawn for White's c-pawn and gaining time: the pawn on c4 attacks the queen, so White must move it again.",
    "arrows": [
     [
      "c4",
      "b3",
      "red"
     ]
    ],
    "alternatives": [
     "c5"
    ]
   },
   {
    "kind": "opening",
    "text": "The queen recaptures the pawn. From c4 it now lines up with the bishop on f4 against the c7 pawn."
   },
   {
    "kind": "defence",
    "text": "Spy: White was threatening Qxc7, winning a pawn, since c7 was attacked twice and defended once. Moving the pawn to c6 solves that and also covers b5 and d5.",
    "alternatives": [
     "Be6"
    ]
   },
   {
    "kind": "plan",
    "text": "White builds a large pawn centre on d4 and e4. The next idea is e5, kicking the knight from f6."
   },
   {
    "kind": "plan",
    "text": "The knight develops and heads for b6, where it will hit the white queen and gain time. The engine slightly preferred 7...b5, but the plan is sound.",
    "alternatives": [
     "b5"
    ]
   },
   {
    "kind": "plan",
    "text": "The rook supports the d-pawn, but White is still not castled and the f1 bishop has not moved. That delay in development is the theme of the whole game.",
    "alternatives": [
     "Be2"
    ]
   },
   {
    "kind": "tactic",
    "text": "The knight attacks the queen on c4, forcing it to move again. Each queen move is a free tempo for Black's development.",
    "arrows": [
     [
      "b6",
      "c4",
      "red"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "The queen goes to c5, an exposed square in front of Black's pieces. The engine preferred 9.Qb4 or 9.Qb3, keeping White a little better.",
    "alternatives": [
     "Qb4"
    ]
   },
   {
    "kind": "plan",
    "text": "The bishop develops with a purpose: it pins the knight on f3 against the rook on d1 (the line runs g4, f3, e2, d1), so the knight cannot move without the rook being exposed.",
    "arrows": [
     [
      "g4",
      "d1",
      "blue"
     ]
    ],
    "alternatives": [
     "h6"
    ]
   },
   {
    "kind": "mistake",
    "text": "Another move by an already developed piece while the king sits in the centre. The bishop pressures f6, but it walks into a stunning reply.",
    "better": "11.Be2 develops the last minor piece, breaks the pin and prepares castling (about level).",
    "arrows": [
     [
      "g5",
      "f6",
      "blue"
     ]
    ],
    "alternatives": [
     "Be2"
    ]
   },
   {
    "kind": "key",
    "text": "A brilliant knight offer. It attacks the knight on c3, which is the only defender of the e4 pawn. If 12.Nxa4, then 12...Nxe4 attacks both the queen on c5 and the bishop on g5, and Black wins material back with interest (engine about -2.7).",
    "arrows": [
     [
      "a4",
      "c3",
      "green"
     ],
     [
      "c3",
      "e4",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen steps out of the coming attacks and now attacks the knight on a4. It is White's best reply, but Black is already better.",
    "arrows": [
     [
      "a3",
      "a4",
      "yellow"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "Black trades knights on c3 rather than retreating. The knight now attacks the rook on d1, so White must recapture at once.",
    "arrows": [
     [
      "c3",
      "d1",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The safest recapture. Taking with the queen was worse: 13.Qxc3 Nxe4 hits the queen and the bishop on g5 (engine about -4)."
   },
   {
    "kind": "tactic",
    "text": "Now the e4 pawn falls because its defender on c3 has gone. The knight in the centre attacks the bishop on g5 and the pawn on c3, and Black leaves the e7 pawn as bait.",
    "arrows": [
     [
      "e4",
      "g5",
      "green"
     ],
     [
      "g5",
      "e7",
      "red"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "White grabs the pawn with a fork: the bishop on e7 attacks the queen on d8 and the rook on f8. Black cannot take back, because 14...Qxe7 15.Qxe7 loses the queen.",
    "arrows": [
     [
      "e7",
      "d8",
      "green"
     ],
     [
      "e7",
      "f8",
      "green"
     ]
    ],
    "alternatives": [
     "Bf4"
    ]
   },
   {
    "kind": "key",
    "text": "The queen escapes and Fischer simply leaves the rook on f8 hanging. Speed matters more: White's king is stuck in the centre and the f1 bishop is still at home. If 15.Bxf8 Bxf8, the bishop hits the queen on a3 and Black keeps the initiative (engine about -2).",
    "arrows": [
     [
      "e7",
      "f8",
      "red"
     ]
    ],
    "alternatives": [
     "Qd5"
    ]
   },
   {
    "kind": "plan",
    "text": "Byrne sensibly declines the rook and finally develops the bishop, so he can castle next move. The engine agrees this is White's best try.",
    "alternatives": [
     "h3"
    ]
   },
   {
    "kind": "tactic",
    "text": "The knight takes the c3 pawn and attacks the rook on d1. If 16.Qxc3, then 16...Rae8 attacks the bishop on e7 and Black wins it back.",
    "arrows": [
     [
      "c3",
      "d1",
      "green"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "The bishop retreats with a double attack: it hits the queen on b6 and, along the c5 to f8 diagonal, the rook on f8.",
    "alternatives": [
     "Qxc3"
    ]
   },
   {
    "kind": "tactic",
    "text": "The rook escapes with check on the open e-file. White's king cannot castle out of check, so it has to move or be blocked.",
    "arrows": [
     [
      "e8",
      "e1",
      "green"
     ]
    ],
    "alternatives": [
     "Nb5"
    ]
   },
   {
    "kind": "defence",
    "text": "The king steps to f1, giving up castling for good. It was the best move: blocking with 17.Ne5 or running with 17.Kd2 loses more quickly (engine about -4)."
   },
   {
    "kind": "key",
    "text": "The famous queen sacrifice. Instead of saving the queen from the bishop on c5, Fischer attacks the undefended bishop on c4. If 18.Bxe6, then 18...Qb5+ checks along the b5 to f1 diagonal and Black has a forced mate (the engine finds mate in six). If 18.Bxb6, the windmill begins.",
    "arrows": [
     [
      "e6",
      "c4",
      "green"
     ],
     [
      "c5",
      "b6",
      "red"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "Byrne takes the queen, which is very natural, but it lets Black's bishop and knight start a series of checks. The engine shows this was not White's best defence.",
    "better": "18.Qxc3 Qxc5 19.dxc5 Bxc3 20.Bxe6 Rxe6 was the best damage control: White is lost but only a pawn down (about -1.8).",
    "arrows": [
     [
      "e6",
      "c4",
      "red"
     ]
    ],
    "alternatives": [
     "Qxc3"
    ]
   },
   {
    "kind": "tactic",
    "text": "The windmill starts. The bishop takes on c4 with check along the c4 to f1 diagonal. From now on, whenever the king is on f1 and the knight steps off e2, the bishop gives a discovered check.",
    "arrows": [
     [
      "c4",
      "f1",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The king steps out of check. Blocking with 19.Rd3 would just lose the rook, so the king move is White's best."
   },
   {
    "kind": "tactic",
    "text": "A direct knight check on g1. The king must go back to f1, where only the knight on e2 stands between it and the bishop on c4."
   },
   {
    "kind": "defence",
    "text": "Forced: this is White's only legal move."
   },
   {
    "kind": "tactic",
    "text": "Discovered check: the knight jumps away, so the bishop on c4 checks the king, and on the way the knight collects the d4 pawn for free.",
    "arrows": [
     [
      "c4",
      "f1",
      "blue"
     ]
    ],
    "alternatives": [
     "Nc3+"
    ]
   },
   {
    "kind": "defence",
    "text": "The king goes back to g1. Blocking with the queen on d3 would only give the queen up for a bishop."
   },
   {
    "kind": "tactic",
    "text": "The knight checks again from e2, sending the king back to f1. Fischer is choosing the best square for his final knight jump."
   },
   {
    "kind": "defence",
    "text": "Forced: again the only legal move."
   },
   {
    "kind": "tactic",
    "text": "Another discovered check, and this time the knight lands on c3, where it attacks the rook on d1 and the pawn on a2.",
    "arrows": [
     [
      "c3",
      "d1",
      "green"
     ],
     [
      "c4",
      "f1",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The king steps out of check. Blocking with 23.Rd3 would lose material even faster."
   },
   {
    "kind": "key",
    "text": "The windmill ends. Black recaptures the bishop that took the queen, and the open a-file lets the rook on a8 attack the queen on a3. With the knight also hitting the rook on d1, White cannot save both. Counting everything, Black already has two bishops and two extra pawns against the queen, and more is coming.",
    "arrows": [
     [
      "a8",
      "a3",
      "green"
     ],
     [
      "c3",
      "d1",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The queen escapes and counter-attacks the bishop on c4 and the pawn on b6, trying to win something back."
   },
   {
    "kind": "tactic",
    "text": "A neat reply: the rook attacks the queen and is guarded by the knight on c3. Once the queen moves away, the rook also defends the bishop on c4 along the fourth rank.",
    "arrows": [
     [
      "a4",
      "b4",
      "green"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "The queen takes a pawn and now eyes b7, but the rook on d1 is lost. The engine slightly preferred 25.Qxa4 Nxa4, giving the queen back, though White is lost either way.",
    "alternatives": [
     "Qxa4"
    ]
   },
   {
    "kind": "tactic",
    "text": "The knight takes the rook. Black now has two rooks, two bishops and a knight against queen, rook and knight: a winning material lead.",
    "alternatives": [
     "Ne2+"
    ]
   },
   {
    "kind": "plan",
    "text": "White makes room for the king on h2 so the rook on h1 can finally come into play."
   },
   {
    "kind": "plan",
    "text": "Black grabs the a2 pawn and puts the rook on White's second rank, where it can attack pawns and the king."
   },
   {
    "kind": "plan",
    "text": "The king steps aside and the rook on h1 is free. It now attacks the knight on d1.",
    "arrows": [
     [
      "h1",
      "d1",
      "green"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "The knight escapes by taking the f2 pawn, which is protected by the rook on a2. From f2 it attacks the rook on h1.",
    "arrows": [
     [
      "f2",
      "h1",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The rook moves to safety and attacks the undefended rook on e8.",
    "alternatives": [
     "Rg1"
    ]
   },
   {
    "kind": "plan",
    "text": "Black trades rooks. When you are far ahead in material, swapping pieces makes the win simpler."
   },
   {
    "kind": "tactic",
    "text": "An in-between check before recapturing on e1: the queen checks along the eighth rank.",
    "arrows": [
     [
      "d8",
      "g8",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The bishop blocks the check. Note that it is now pinned: it cannot move without exposing the king on g8 to the queen."
   },
   {
    "kind": "plan",
    "text": "White takes back the rook. White has a queen and knight against Black's rook, two bishops and knight, with five Black pawns against two."
   },
   {
    "kind": "plan",
    "text": "The bishop moves to the long diagonal and aims at the g2 pawn in front of White's king. Black is starting to bring every piece towards that king.",
    "arrows": [
     [
      "d5",
      "g2",
      "green"
     ]
    ],
    "alternatives": [
     "b5"
    ]
   },
   {
    "kind": "defence",
    "text": "The knight returns to f3, blocking the bishop's diagonal towards g2 and guarding the e5 and g5 squares."
   },
   {
    "kind": "plan",
    "text": "The knight centralises. By leaving f2 it also opens the second rank, so the rook on a2 now attacks the g2 pawn.",
    "arrows": [
     [
      "a2",
      "g2",
      "green"
     ]
    ],
    "alternatives": [
     "Kg7"
    ]
   },
   {
    "kind": "plan",
    "text": "The queen attacks the b7 pawn while keeping the pin on the bishop on f8.",
    "arrows": [
     [
      "b8",
      "b7",
      "yellow"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The pawn steps forward to b5, where the c6 pawn protects it.",
    "alternatives": [
     "Kg7"
    ]
   },
   {
    "kind": "plan",
    "text": "White pushes the h-pawn, hoping to loosen Black's kingside pawns. There is little else to do in a lost position.",
    "alternatives": [
     "Nd4"
    ]
   },
   {
    "kind": "defence",
    "text": "Black stops h4-h5 and keeps the kingside pawns solid."
   },
   {
    "kind": "plan",
    "text": "The knight jumps to e5, eyeing f7 and c6 in search of counterplay against Black's king."
   },
   {
    "kind": "key",
    "text": "A quiet but important move. The king guards f7 and steps off the eighth rank, so the bishop on f8 is no longer pinned and can join the attack.",
    "arrows": [
     [
      "f8",
      "c5",
      "green"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "The king steps onto the g1 to a7 diagonal, letting the newly freed bishop arrive with check. White was lost anyway, but this speeds up the end.",
    "better": "35.Nxf7 at least kept some activity, though Black still wins easily (about -11).",
    "alternatives": [
     "Nxf7"
    ]
   },
   {
    "kind": "tactic",
    "text": "The bishop checks along the c5 to g1 diagonal. All of Black's pieces are now active and closing in on the white king.",
    "arrows": [
     [
      "c5",
      "g1",
      "blue"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "The king heads towards the centre and Black's pieces, and now Black has a forced mate.",
    "better": "36.Kh2 avoided an immediate mate, though Black was still completely winning.",
    "alternatives": [
     "Kh2"
    ]
   },
   {
    "kind": "tactic",
    "text": "The knight checks from g3. The rook on a2 guards the second rank and the bishop covers g1, so the king can only go to e1. 36...Rf2+ would have mated one move sooner.",
    "alternatives": [
     "Rf2+"
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: the only legal move."
   },
   {
    "kind": "tactic",
    "text": "The second bishop joins with check on the e1 to a5 diagonal, pushing the king further towards the corner.",
    "alternatives": [
     "Re2+"
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: the only legal move."
   },
   {
    "kind": "tactic",
    "text": "The light-squared bishop checks on the b3 to d1 diagonal. Notice how the rook on a2 still takes away the whole second rank."
   },
   {
    "kind": "defence",
    "text": "Forced: the only legal move."
   },
   {
    "kind": "tactic",
    "text": "The knight checks from e2, driving the king to b1."
   },
   {
    "kind": "defence",
    "text": "Forced: the only legal move."
   },
   {
    "kind": "tactic",
    "text": "The knight comes back to c3 with check. From c3 it covers b1 and d1, the squares the king needs."
   },
   {
    "kind": "defence",
    "text": "Forced: the only legal move, and the king is trapped on c1."
   },
   {
    "kind": "key",
    "text": "Checkmate by teamwork. The rook checks from c2 and covers b2 and d2, the bishop on b3 protects the rook, and the knight on c3 covers b1 and d1. 41...Ba3# was also mate.",
    "arrows": [
     [
      "b3",
      "c2",
      "blue"
     ],
     [
      "c3",
      "b1",
      "blue"
     ]
    ],
    "alternatives": [
     "Ba3#"
    ]
   }
  ]
 },
 {
  "id": "fischer-spassky-1972-g6",
  "title": "Fischer's Queen's Gambit masterpiece",
  "white": "Bobby Fischer",
  "black": "Boris Spassky",
  "event": "World Championship, game 6",
  "year": 1972,
  "result": "1-0",
  "level": "Advanced",
  "opening": "Queen's Gambit Declined, Tartakower Variation (via the English Opening)",
  "themes": [
   "hanging pawns",
   "pawn breaks",
   "good vs bad pieces",
   "open files",
   "kingside attack",
   "exchange sacrifice"
  ],
  "summary": "There is no early trap or flashy combination here. Fischer slowly squeezes the world champion: he trades off Black's best bishop, pushes his e- and f-pawns to cramp Black, opens the f-file and only then strikes on the kingside. It is one of the clearest lessons in how strong players make a plan and follow it.",
  "lessons": [
   "Trade off the opponent's best defender: Fischer swapped his knight for the bishop that guarded Black's light squares, and Black's position never recovered.",
   "Pawns are your plan: the moves e4, f4, e5 and f5 gained space, took squares from Black's pieces and opened the f-file for the rooks.",
   "Before an attack, put every piece on its best square. Fischer doubled rooks, centralised his queen and re-routed his bishop before the final blow.",
   "When the opponent can only shuffle, you don't need to hurry. Improve your pieces until a tactic appears."
  ],
  "moves": "c4 e6 Nf3 d5 d4 Nf6 Nc3 Be7 Bg5 O-O e3 h6 Bh4 b6 cxd5 Nxd5 Bxe7 Qxe7 Nxd5 exd5 Rc1 Be6 Qa4 c5 Qa3 Rc8 Bb5 a6 dxc5 bxc5 O-O Ra7 Be2 Nd7 Nd4 Qf8 Nxe6 fxe6 e4 d4 f4 Qe7 e5 Rb8 Bc4 Kh8 Qh3 Nf8 b3 a5 f5 exf5 Rxf5 Nh7 Rcf1 Qd8 Qg3 Re7 h4 Rbb7 e6 Rbc7 Qe5 Qe8 a4 Qd8 R1f2 Qe8 R2f3 Qd8 Bd3 Qe8 Qe4 Nf6 Rxf6 gxf6 Rxf6 Kg8 Bc4 Kh8 Qf4",
  "evals": [
   -0.58,
   0.78,
   0,
   0.54,
   0.12,
   0.72,
   0.1,
   0.65,
   -0.09,
   0.53,
   -0.02,
   0.37,
   -0.24,
   0.51,
   -0.26,
   0.38,
   -0.09,
   0.49,
   -0.07,
   0.39,
   -0.3,
   0.31,
   -0.63,
   -0.07,
   -0.35,
   0,
   -0.37,
   0.06,
   -0.18,
   -0.01,
   -0.06,
   0.36,
   0,
   0.57,
   0.25,
   0.73,
   0.25,
   0.91,
   0.35,
   1.42,
   1.13,
   1.41,
   0.57,
   1.38,
   1.34,
   1.92,
   1.49,
   2.2,
   2.12,
   2.23,
   1.37,
   3.26,
   2.17,
   2.91,
   2.32,
   3.13,
   2.15,
   3.91,
   3.14,
   3.89,
   3.28,
   3.72,
   3.28,
   4.74,
   3.77,
   3.74,
   3.62,
   4.67,
   4.33,
   4.25,
   3.63,
   8.04,
   7.12,
   7.63,
   7.02,
   8.51,
   7.82,
   9.99,
   9.85,
   11.94,
   10.64
  ],
  "notes": [
   {
    "kind": "opening",
    "text": "A surprise: Fischer nearly always opened with the king's pawn. The c-pawn controls d5 and keeps the game quiet and strategic.",
    "arrows": [
     [
      "c4",
      "d5",
      "green"
     ]
    ],
    "alternatives": [
     "e4"
    ]
   },
   {
    "kind": "opening",
    "text": "A flexible reply that prepares ...d5 and opens a path for the dark-squared bishop.",
    "alternatives": [
     "e5"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops a knight towards the centre, covering d4 and e5 and keeping options open."
   },
   {
    "kind": "opening",
    "text": "Black claims the centre and challenges the c4 pawn directly.",
    "alternatives": [
     "Nf6"
    ]
   },
   {
    "kind": "opening",
    "text": "White builds a strong centre. With pawns on c4 and d4 against e6 and d5, the game has become a Queen's Gambit Declined.",
    "arrows": [
     [
      "d4",
      "e5",
      "green"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Develops the knight and adds a second guard to the d5 pawn.",
    "alternatives": [
     "c5"
    ]
   },
   {
    "kind": "opening",
    "text": "Another developing move that piles more pressure on d5."
   },
   {
    "kind": "opening",
    "text": "Black calmly develops and gets ready to castle. The bishop also shields the queen from a future Bg5.",
    "alternatives": [
     "c5"
    ]
   },
   {
    "kind": "opening",
    "text": "The bishop pressures the knight on f6, one of the guards of d5.",
    "arrows": [
     [
      "g5",
      "f6",
      "yellow"
     ]
    ],
    "alternatives": [
     "Bf4"
    ]
   },
   {
    "kind": "opening",
    "text": "Black tucks the king away first, a sensible priority in any opening.",
    "alternatives": [
     "h6"
    ]
   },
   {
    "kind": "opening",
    "text": "A solid move: it supports d4 and opens a path for the light-squared bishop.",
    "alternatives": [
     "cxd5"
    ]
   },
   {
    "kind": "opening",
    "text": "Black asks the bishop to decide: take the knight or retreat. The pawn on h6 also gives the king a little breathing space later.",
    "arrows": [
     [
      "h6",
      "g5",
      "red"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Fischer keeps the bishop and its pressure on f6 rather than exchanging it."
   },
   {
    "kind": "opening",
    "text": "The Tartakower Variation: Black prepares to develop the queen's bishop and to free the position with ...c5 later."
   },
   {
    "kind": "plan",
    "text": "White releases the tension in the centre to fix Black's pawn structure before Black is fully developed."
   },
   {
    "kind": "opening",
    "text": "Black recaptures with the knight, aiming to trade pieces and ease the slightly cramped position."
   },
   {
    "kind": "opening",
    "text": "White trades bishops. Black's dark-squared bishop was a good defender, so removing it is useful.",
    "alternatives": [
     "Nxd5"
    ]
   },
   {
    "kind": "opening",
    "text": "The natural recapture, bringing the queen to an active square."
   },
   {
    "kind": "opening",
    "text": "Another trade, which also attacks the queen on e7, so Black must recapture.",
    "arrows": [
     [
      "d5",
      "e7",
      "red"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Practically forced, as the knight was attacking the queen. Black now has a pawn on d5, which blocks the long diagonal for a bishop on b7."
   },
   {
    "kind": "plan",
    "text": "The rook takes the half-open c-file (no White pawn on it) and eyes the pawn on c7.",
    "arrows": [
     [
      "c1",
      "c7",
      "blue"
     ]
    ],
    "alternatives": [
     "Be2"
    ]
   },
   {
    "kind": "plan",
    "text": "A bishop on b7 would just stare at its own pawn on d5, so it goes to e6 instead, where it guards d5 and the light squares."
   },
   {
    "kind": "plan",
    "text": "The queen eyes a7 and the queenside. The deeper idea is to swing to a3, lining up with Black's queen on e7.",
    "alternatives": [
     "Bd3"
    ]
   },
   {
    "kind": "plan",
    "text": "Black frees the queenside and challenges d4. It creates a pawn pair on c5 and d5 that controls important central squares.",
    "alternatives": [
     "Rc8"
    ]
   },
   {
    "kind": "plan",
    "text": "A pin: the c5 pawn cannot capture on d4 because Qxe7 would win Black's undefended queen. The c5 pawn is also attacked by the d4 pawn, the queen and the rook.",
    "arrows": [
     [
      "a3",
      "e7",
      "blue"
     ]
    ],
    "alternatives": [
     "dxc5"
    ]
   },
   {
    "kind": "defence",
    "text": "The rook adds another defender to c5 and contests the c-file."
   },
   {
    "kind": "plan",
    "text": "The bishop covers d7 and c6, making it awkward for the knight on b8 to develop.",
    "alternatives": [
     "Be2"
    ]
   },
   {
    "kind": "defence",
    "text": "Black kicks the bishop away from its annoying post.",
    "arrows": [
     [
      "a6",
      "b5",
      "red"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "White trades on c5 to give Black hanging pawns. The bishop on b5 can't simply be taken, as we'll see next move.",
    "alternatives": [
     "Be2"
    ]
   },
   {
    "kind": "plan",
    "text": "Black now has hanging pawns on c5 and d5: side by side with no pawns on the b- or e-files to support them. They control the centre but can become targets."
   },
   {
    "kind": "plan",
    "text": "Castling looks careless, but the bishop on b5 is safe: if ...axb5, the a-file opens and Qxa8 wins the rook, because the knight on b8 blocks the c8 rook's defence."
   },
   {
    "kind": "defence",
    "text": "The rook steps off a8 so the trick no longer works. Now ...axb5 is a real threat, and the rook can defend along the seventh rank.",
    "arrows": [
     [
      "a6",
      "b5",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The bishop retreats to safety."
   },
   {
    "kind": "plan",
    "text": "The knight finally develops, heading towards f6 or b6. The engine slightly preferred ...a5 to gain queenside space first.",
    "alternatives": [
     "a5"
    ]
   },
   {
    "kind": "plan",
    "text": "A key idea: the knight heads for e6 to trade off Black's good bishop. It is safe on d4 because ...cxd4 is still pinned by Qxe7.",
    "arrows": [
     [
      "d4",
      "e6",
      "green"
     ],
     [
      "a3",
      "e7",
      "blue"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "The queen leaves e7, ending the pin, so ...cxd4 is now a real threat. But it allows White to swap the knight for the bishop.",
    "alternatives": [
     "Rcc7"
    ]
   },
   {
    "kind": "plan",
    "text": "White removes the bishop that guarded d5 and the light squares. The knight also attacks the queen on f8, so Black must recapture.",
    "arrows": [
     [
      "e6",
      "f8",
      "red"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "Recapturing towards the centre. The e6 pawn supports d5, but it can become a target, and Black's light squares are now harder to guard."
   },
   {
    "kind": "key",
    "text": "The turning point. White strikes at d5 and asks the hanging pawns a hard question: hold, advance or exchange.",
    "arrows": [
     [
      "e4",
      "d5",
      "yellow"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "This creates a protected passed pawn, but it gives up control of e5 and the light squares. White's e- and f-pawns can now roll forward freely.",
    "better": "20...Qd6 kept the pawns in place and the game close to level (≈ +0.2); after ...d4 the engine gives White about +1.5.",
    "alternatives": [
     "dxe4"
    ]
   },
   {
    "kind": "plan",
    "text": "The plan begins: e5 to cramp Black's knight, then f5 to open the f-file towards Black's king.",
    "arrows": [
     [
      "f4",
      "f5",
      "green"
     ],
     [
      "e4",
      "e5",
      "green"
     ]
    ],
    "alternatives": [
     "Qg3"
    ]
   },
   {
    "kind": "defence",
    "text": "The queen guards e6 and stays central. The engine preferred ...Nb6, heading for d5.",
    "alternatives": [
     "Nb6"
    ]
   },
   {
    "kind": "plan",
    "text": "The pawn grabs space and takes f6 and d6 away from Black's knight. Black's pieces are getting squeezed.",
    "arrows": [
     [
      "e5",
      "f6",
      "green"
     ],
     [
      "e5",
      "d6",
      "green"
     ]
    ],
    "alternatives": [
     "Qg3"
    ]
   },
   {
    "kind": "plan",
    "text": "Black looks for counterplay on the open b-file, attacking b2. For now the queen on a3 defends it.",
    "arrows": [
     [
      "b8",
      "b2",
      "red"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "The bishop finds its best diagonal and pins the e6 pawn to Black's king on g8. Black's weak e6 pawn is now the main target.",
    "arrows": [
     [
      "c4",
      "g8",
      "blue"
     ]
    ],
    "alternatives": [
     "Rc2"
    ]
   },
   {
    "kind": "defence",
    "text": "The king steps out of the pin so the e6 pawn is no longer tied to it."
   },
   {
    "kind": "plan",
    "text": "The queen joins the attack on e6, which is now hit twice. It leaves b2 undefended, but Rxb2 can be met by Bxe6.",
    "arrows": [
     [
      "h3",
      "e6",
      "yellow"
     ]
    ],
    "alternatives": [
     "Rf2"
    ]
   },
   {
    "kind": "defence",
    "text": "The knight comes back to defend e6, but it becomes very passive.",
    "better": "24...Rxb2 grabbing counterplay was better (≈ +1.4); after the passive knight retreat White is about +2.5.",
    "alternatives": [
     "Rxb2"
    ]
   },
   {
    "kind": "defence",
    "text": "The pawn steps off the attacked square and now guards c4. On b3 it is protected by the a-pawn."
   },
   {
    "kind": "plan",
    "text": "Black plans ...a4 to break up White's queenside pawns and undermine the bishop's support."
   },
   {
    "kind": "key",
    "text": "The thematic break. The pawn attacks e6 and opens the f-file for White's rooks, right towards Black's king.",
    "arrows": [
     [
      "f5",
      "e6",
      "yellow"
     ]
    ],
    "alternatives": [
     "Rce1"
    ]
   },
   {
    "kind": "plan",
    "text": "Black takes, but this opens the f-file and makes White's e5 pawn a passed pawn. The engine preferred ...Qg5 (≈ +1.7 instead of +2.3).",
    "alternatives": [
     "Qg5"
    ]
   },
   {
    "kind": "plan",
    "text": "The rook takes over the open f-file. White's e5 pawn is now a passed pawn: no Black pawn can block or capture it on its way forward.",
    "arrows": [
     [
      "f5",
      "f8",
      "blue"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "The knight heads for g5, where it would attack the queen on h3 and become active again.",
    "arrows": [
     [
      "h7",
      "g5",
      "green"
     ]
    ],
    "alternatives": [
     "Nd7"
    ]
   },
   {
    "kind": "plan",
    "text": "Doubling rooks: two rooks on the open file are much stronger than one. Both now aim at f7 and f8."
   },
   {
    "kind": "defence",
    "text": "The queen steps away from the f-file pressure and keeps an eye on g5, the knight's target square."
   },
   {
    "kind": "plan",
    "text": "The queen moves to the g-file, aiming at g7 next to Black's king.",
    "arrows": [
     [
      "g3",
      "g7",
      "blue"
     ]
    ],
    "alternatives": [
     "R5f2"
    ]
   },
   {
    "kind": "defence",
    "text": "The rook guards the seventh rank and blocks the e-pawn. The engine preferred ...a4 (≈ +2.8 instead of +3.6).",
    "alternatives": [
     "a4"
    ]
   },
   {
    "kind": "plan",
    "text": "A quiet but strong move: the pawn takes g5 away from the knight on h7, which now has almost no good squares.",
    "arrows": [
     [
      "h4",
      "g5",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Black doubles rooks on the seventh rank to defend the kingside."
   },
   {
    "kind": "plan",
    "text": "The passed pawn advances and frees e5 for the queen. It also opens d5 for a rook and creates threats such as Rxc5.",
    "arrows": [
     [
      "g3",
      "e5",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The rook defends the c5 pawn while staying on the seventh rank. The engine slightly preferred ...Qb8.",
    "alternatives": [
     "Qb8"
    ]
   },
   {
    "kind": "plan",
    "text": "The queen takes the central e5 square, protects the e6 pawn and aims down the long diagonal at g7.",
    "arrows": [
     [
      "e5",
      "g7",
      "blue"
     ]
    ],
    "alternatives": [
     "Bd3"
    ]
   },
   {
    "kind": "defence",
    "text": "The queen guards the back rank and the light squares around the king. Black can only wait.",
    "alternatives": [
     "d3"
    ]
   },
   {
    "kind": "plan",
    "text": "Stops ...a4, which would have undermined the b3 pawn that supports the bishop. Before attacking, Fischer takes away Black's last counterplay.",
    "alternatives": [
     "R5f3"
    ]
   },
   {
    "kind": "defence",
    "text": "The queen shuffles back. Black has no active plan.",
    "alternatives": [
     "d3"
    ]
   },
   {
    "kind": "plan",
    "text": "Fischer rearranges his rooks without hurry. He keeps full control of the f-file while Black can only wait.",
    "alternatives": [
     "R5f3"
    ]
   },
   {
    "kind": "defence",
    "text": "Back again. Black is passive, but has no clear way to improve."
   },
   {
    "kind": "plan",
    "text": "Another rook shuffle. From f3 the rook can later swing to the kingside or back up the f5 rook.",
    "alternatives": [
     "R5f4"
    ]
   },
   {
    "kind": "defence",
    "text": "The queen returns to d8, still guarding the back rank."
   },
   {
    "kind": "plan",
    "text": "The bishop moves to the b1-h7 diagonal, aiming behind the f5 rook at the knight on h7 next to Black's king. The final piece is in place.",
    "arrows": [
     [
      "d3",
      "h7",
      "blue"
     ]
    ],
    "alternatives": [
     "R5f4"
    ]
   },
   {
    "kind": "mistake",
    "text": "This allows a decisive attack on h7. The queen on e8 no longer helps defend the king.",
    "better": "36...Qg8 was more stubborn, guarding h7 directly (≈ +4.2 instead of about +8).",
    "alternatives": [
     "Qg8"
    ]
   },
   {
    "kind": "tactic",
    "text": "Queen and bishop line up behind the f5 rook. The threat is Rf8+ Nxf8 Rxf8+ Qxf8 Qh7#. The engine found 37.Rf7 even stronger, but both win.",
    "arrows": [
     [
      "e4",
      "h7",
      "blue"
     ],
     [
      "f5",
      "f8",
      "green"
     ]
    ],
    "alternatives": [
     "Rf7"
    ]
   },
   {
    "kind": "defence",
    "text": "The best try: the knight attacks the queen and blocks the f-file."
   },
   {
    "kind": "key",
    "text": "An exchange sacrifice: a rook for the knight. It removes the key defender and clears f5, so Qh7# is now threatened.",
    "arrows": [
     [
      "e4",
      "h7",
      "green"
     ]
    ],
    "alternatives": [
     "Qe5"
    ]
   },
   {
    "kind": "defence",
    "text": "Black must take: the engine shows that alternatives such as ...g6 or ...Qg8 allow mate within a few moves."
   },
   {
    "kind": "tactic",
    "text": "White wins back a pawn and leaves Black's king almost bare. Rxh6+ is the next threat.",
    "arrows": [
     [
      "f6",
      "h6",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The king steps away from the h-file. Black is lost whatever he plays.",
    "alternatives": [
     "c4"
    ]
   },
   {
    "kind": "tactic",
    "text": "The bishop moves to the a2-g8 diagonal, supporting the e6 pawn and aiming through it at the king on g8.",
    "arrows": [
     [
      "c4",
      "g8",
      "blue"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The king hides in the corner again, but White's pieces are everywhere.",
    "alternatives": [
     "d3"
    ]
   },
   {
    "kind": "key",
    "text": "Rxh6+ and Qxh6+ are both coming, and every defence loses more material or gets mated. Black resigned.",
    "arrows": [
     [
      "f4",
      "h6",
      "green"
     ],
     [
      "f6",
      "h6",
      "green"
     ]
    ],
    "alternatives": [
     "Qe5"
    ]
   }
  ]
 },
 {
  "id": "kasparov-topalov-1999",
  "title": "Kasparov's Immortal",
  "white": "Garry Kasparov",
  "black": "Veselin Topalov",
  "event": "Wijk aan Zee",
  "year": 1999,
  "result": "1-0",
  "level": "Advanced",
  "opening": "Pirc Defence",
  "themes": [
   "king hunt",
   "rook sacrifice",
   "queenside castling",
   "deflection",
   "pin"
  ],
  "summary": "Kasparov sacrifices a rook and chases Black's king from a7 all the way to d1, on White's first rank, before collecting the queen. Modern engines show the sacrifice was not a forced win, but Black had to find a string of only-moves, and one natural slip let Kasparov finish with a series of brilliant blows.",
  "lessons": [
   "A king with few pawns in front of it is a target. Black castled queenside after advancing the a-, b- and c-pawns, and the shelter was thin.",
   "When chasing a king, ask which squares each check takes away. Forcing moves only work if every escape square is covered.",
   "Quiet moves can be the strongest in an attack. 28.Qc3 and 36.Bf1 gave no check but carried unstoppable threats.",
   "Defending under pressure is hard. Black held for many moves, then one natural pawn grab (31...Kxa3) let the king be hunted down."
  ],
  "moves": "e4 d6 d4 Nf6 Nc3 g6 Be3 Bg7 Qd2 c6 f3 b5 Nge2 Nbd7 Bh6 Bxh6 Qxh6 Bb7 a3 e5 O-O-O Qe7 Kb1 a6 Nc1 O-O-O Nb3 exd4 Rxd4 c5 Rd1 Nb6 g3 Kb8 Na5 Ba8 Bh3 d5 Qf4+ Ka7 Rhe1 d4 Nd5 Nbxd5 exd5 Qd6 Rxd4 cxd4 Re7+ Kb6 Qxd4+ Kxa5 b4+ Ka4 Qc3 Qxd5 Ra7 Bb7 Rxb7 Qc4 Qxf6 Kxa3 Qxa6+ Kxb4 c3+ Kxc3 Qa1+ Kd2 Qb2+ Kd1 Bf1 Rd2 Rd7 Rxd7 Bxc4 bxc4 Qxh8 Rd3 Qa8 c3 Qa4+ Ke1 f4 f5 Kc1 Rd2 Qa7",
  "evals": [
   0.03,
   1.02,
   0.4,
   0.9,
   0.43,
   1.11,
   0.69,
   0.83,
   0.19,
   0.99,
   0.04,
   1.06,
   -0.29,
   0.51,
   -0.53,
   0.32,
   -0.23,
   1.01,
   -0.17,
   0.91,
   0.11,
   1.06,
   0.12,
   1.51,
   0.83,
   1.27,
   0.75,
   1.23,
   0.74,
   1.48,
   0.68,
   1.06,
   0.51,
   1.01,
   -0.3,
   0.7,
   0.1,
   0.35,
   -0.21,
   0,
   -0.48,
   0.32,
   -0.73,
   -0.59,
   -0.7,
   -0.48,
   -2.83,
   -3.24,
   -5.66,
   -4.16,
   0,
   -1.58,
   -8.44,
   -6.45,
   0,
   0,
   0,
   0,
   -0.27,
   0.54,
   -0.51,
   1.18,
   0.87,
   0.87,
   -4.31,
   3.45,
   0.12,
   0.71,
   0.31,
   4.37,
   4.06,
   4.58,
   4.27,
   4.25,
   4.09,
   4.51,
   4.8,
   5.02,
   4.67,
   5.37,
   5,
   5.12,
   4.63,
   6.76,
   6.16,
   6.5,
   6.29
  ],
  "notes": [
   {
    "kind": "opening",
    "text": "Claims the centre and opens lines for the queen and the light-squared bishop. Kasparov wants a big pawn centre and fast development.",
    "arrows": [
     [
      "e2",
      "e4",
      "green"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "The Pirc set-up: a modest pawn on d6 keeps e5 under control and prepares ...Nf6 and ...g6, letting White build a centre so Black can attack it later.",
    "alternatives": [
     "e6"
    ]
   },
   {
    "kind": "opening",
    "text": "With two pawns side by side on e4 and d4, White controls the key central squares c5, d5, e5 and f5."
   },
   {
    "kind": "opening",
    "text": "Develops with a threat: the knight attacks the pawn on e4, so White must spend a move defending it.",
    "arrows": [
     [
      "f6",
      "e4",
      "red"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "Defends e4 with a developing move. The knight on c3 also watches d5 and b5."
   },
   {
    "kind": "opening",
    "text": "Prepares to fianchetto the bishop on g7, where it will aim down the long diagonal at White's centre and also shield Black's king.",
    "alternatives": [
     "Nbd7"
    ]
   },
   {
    "kind": "opening",
    "text": "Starts a well-known attacking scheme: bishop on e3, queen on d2, then Bh6 to swap off Black's fianchetto bishop, the best defender of the dark squares.",
    "alternatives": [
     "f4"
    ]
   },
   {
    "kind": "opening",
    "text": "The bishop takes up its post on the long diagonal. For now the f6 knight stands in front of it, but once the knight moves the bishop will aim at d4 and the queenside.",
    "alternatives": [
     "Nbd7"
    ]
   },
   {
    "kind": "opening",
    "text": "The queen joins the bishop on the c1-h6 diagonal. Next comes Bh6 to trade bishops, and the queen also connects the rooks for queenside castling.",
    "arrows": [
     [
      "e3",
      "h6",
      "green"
     ]
    ],
    "alternatives": [
     "Nf3"
    ]
   },
   {
    "kind": "opening",
    "text": "A flexible move that prepares ...b5 to grab space on the queenside, where Black hopes to start counterplay.",
    "alternatives": [
     "a6"
    ]
   },
   {
    "kind": "opening",
    "text": "Supports e4 a second time and takes the g4 square from Black's knight, so ...Ng4 can no longer harass the bishop on e3.",
    "alternatives": [
     "a3"
    ]
   },
   {
    "kind": "opening",
    "text": "Gains queenside space and threatens ...b4, kicking the knight away from c3. The pawn is protected by c6.",
    "arrows": [
     [
      "b5",
      "b4",
      "red"
     ]
    ],
    "alternatives": [
     "O-O"
    ]
   },
   {
    "kind": "opening",
    "text": "The king's knight cannot go to f3 because the pawn is there, so it develops to e2. Later it will travel to c1 and b3.",
    "alternatives": [
     "a4"
    ]
   },
   {
    "kind": "opening",
    "text": "Develops the last minor piece and supports a future ...e5 or ...c5 break in the centre."
   },
   {
    "kind": "plan",
    "text": "Offers to swap dark-squared bishops. Without that bishop, the dark squares around Black's king (f6, g7, h6) become weaker.",
    "arrows": [
     [
      "h6",
      "g7",
      "green"
     ]
    ],
    "alternatives": [
     "Nf4"
    ]
   },
   {
    "kind": "opening",
    "text": "Topalov accepts the trade. Castling first was an equally good alternative.",
    "alternatives": [
     "O-O"
    ]
   },
   {
    "kind": "opening",
    "text": "Recaptures, and the queen on h6 now controls f8. Castling kingside is illegal while f8 is attacked, so Black's king will have to look elsewhere.",
    "arrows": [
     [
      "h6",
      "f8",
      "blue"
     ]
    ]
   },
   {
    "kind": "opening",
    "text": "The bishop goes to the long diagonal. For now the c6 pawn blocks it, but once ...c5 or ...d5 opens the diagonal it will bear down on e4."
   },
   {
    "kind": "plan",
    "text": "Stops ...b4 from kicking the c3 knight: if Black pushes, White can capture with the a-pawn. Safety first for the pieces near White's future king.",
    "alternatives": [
     "O-O-O"
    ]
   },
   {
    "kind": "plan",
    "text": "A central break. Black challenges d4 so the centre does not stay solid, and clears e7 for the queen.",
    "arrows": [
     [
      "e5",
      "d4",
      "yellow"
     ]
    ],
    "alternatives": [
     "a5"
    ]
   },
   {
    "kind": "plan",
    "text": "White castles queenside, which also puts the rook on d1 behind the d4 pawn. White's queen is already on the kingside, ready to harass Black.",
    "alternatives": [
     "dxe5"
    ]
   },
   {
    "kind": "opening",
    "text": "Clears d8 for a rook and prepares Black's own queenside castling. The queen also protects e5.",
    "alternatives": [
     "a5"
    ]
   },
   {
    "kind": "plan",
    "text": "Tucks the king into the corner and frees c1, so the knight on e2 can reroute via c1 to b3.",
    "alternatives": [
     "dxe5"
    ]
   },
   {
    "kind": "plan",
    "text": "Gives the b5 pawn a second defender alongside c6, so the queenside pawns stay solid.",
    "alternatives": [
     "a5"
    ]
   },
   {
    "kind": "plan",
    "text": "The knight heads for b3, where it will defend d4 and eye the a5 and c5 squares. It also clears e2, opening the f1 bishop's diagonal.",
    "arrows": [
     [
      "c1",
      "b3",
      "green"
     ]
    ],
    "alternatives": [
     "dxe5"
    ]
   },
   {
    "kind": "plan",
    "text": "Kingside castling was ruled out by the queen on h6, so the king goes queenside. It is a little draughty there: Black's a-, b- and c-pawns have already advanced, so there is less pawn cover.",
    "alternatives": [
     "exd4"
    ]
   },
   {
    "kind": "plan",
    "text": "The knight reaches b3, protecting d4 and preparing to jump to a5 or c5 near Black's king.",
    "arrows": [
     [
      "b3",
      "a5",
      "green"
     ]
    ],
    "alternatives": [
     "Qe3"
    ]
   },
   {
    "kind": "plan",
    "text": "Black releases the central tension. Now the pawn on d4 attacks the knight on c3, so White must recapture at once.",
    "arrows": [
     [
      "d4",
      "c3",
      "red"
     ]
    ],
    "alternatives": [
     "Kb8"
    ]
   },
   {
    "kind": "plan",
    "text": "Recaptures with the rook, which becomes active on the d-file. The engine slightly preferred the knight recapture, but both are fine.",
    "alternatives": [
     "Nxd4"
    ]
   },
   {
    "kind": "tactic",
    "text": "Gains a tempo by attacking the rook on d4. With the c6 pawn gone, the bishop on b7 now looks down the long diagonal at e4.",
    "arrows": [
     [
      "c5",
      "d4",
      "red"
     ],
     [
      "b7",
      "e4",
      "blue"
     ]
    ],
    "alternatives": [
     "Ne5"
    ]
   },
   {
    "kind": "plan",
    "text": "The rook steps back to d1, still controlling the d-file. The e4 pawn stays protected by the knight on c3 and the f3 pawn.",
    "alternatives": [
     "Rd2"
    ]
   },
   {
    "kind": "plan",
    "text": "The knight reroutes to b6, covering d5 and c4. It also clears d7, so the rook on d8 supports the d6 pawn and the ...d5 break.",
    "alternatives": [
     "Kb8"
    ]
   },
   {
    "kind": "plan",
    "text": "Frees g2 so the bishop can reach h3, and the g3 pawn supports the f4 square for White's queen.",
    "alternatives": [
     "Qf4"
    ]
   },
   {
    "kind": "plan",
    "text": "Spy: after Bh3, the bishop would aim straight at c8 through the empty d7 square. Black sidesteps in advance."
   },
   {
    "kind": "plan",
    "text": "The knight lands on a5, right next to Black's king. It attacks the bishop on b7 and eyes the c6 and b7 squares.",
    "arrows": [
     [
      "a5",
      "b7",
      "yellow"
     ]
    ],
    "alternatives": [
     "g4"
    ]
   },
   {
    "kind": "plan",
    "text": "Keeps the bishop on the long diagonal rather than allowing a trade on b7. The engine liked the immediate ...d5 a touch more, but the difference is small.",
    "alternatives": [
     "d5"
    ]
   },
   {
    "kind": "plan",
    "text": "The bishop takes over the c8-h3 diagonal, controlling d7 and c8 so Black's rooks and king have fewer safe squares.",
    "arrows": [
     [
      "h3",
      "c8",
      "blue"
     ]
    ],
    "alternatives": [
     "Qf4"
    ]
   },
   {
    "kind": "plan",
    "text": "The engine's choice: Black strikes in the centre, challenging e4 and threatening ...d4 to hit the knight on c3.",
    "arrows": [
     [
      "d5",
      "e4",
      "yellow"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "Check along the b8-h2 diagonal, now open because the d-pawn has left d6. The engine thought taking on d5 first was a shade better.",
    "arrows": [
     [
      "f4",
      "b8",
      "red"
     ]
    ],
    "alternatives": [
     "exd5"
    ]
   },
   {
    "kind": "defence",
    "text": "The best way out of check. Blocking with the queen on d6 was clearly worse (about +2.4 for White)."
   },
   {
    "kind": "plan",
    "text": "The last rook comes to the centre. If the e-file opens, the rook on e1 will face Black's queen on e7.",
    "arrows": [
     [
      "e1",
      "e7",
      "blue"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "The engine's choice. The pawn attacks the knight on c3 and will gain space if the knight retreats.",
    "arrows": [
     [
      "d4",
      "c3",
      "red"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "Instead of retreating, the knight jumps forward and attacks the queen on e7. The engine preferred a quiet retreat like Ne2 (about level), so this already leaves White slightly worse, but it keeps the game sharp.",
    "arrows": [
     [
      "d5",
      "e7",
      "red"
     ]
    ],
    "alternatives": [
     "Na2"
    ]
   },
   {
    "kind": "defence",
    "text": "Spy: the queen is attacked. Black removes the attacker, and taking with the b6 knight keeps the f6 knight guarding the kingside."
   },
   {
    "kind": "tactic",
    "text": "Recaptures and opens the e-file. Now the rook on e1 attacks the queen on e7.",
    "arrows": [
     [
      "e1",
      "e7",
      "red"
     ]
    ],
    "alternatives": [
     "Nc6+"
    ]
   },
   {
    "kind": "defence",
    "text": "The queen escapes the e-file and offers a queen trade. The d5 pawn is attacked three times (queen, knight, bishop), so White is drifting into a slightly worse position.",
    "arrows": [
     [
      "d6",
      "d5",
      "yellow"
     ]
    ]
   },
   {
    "kind": "key",
    "text": "A stunning rook sacrifice. If Black takes, the e7 square opens for Re7+ and d4 for the queen, and the king on a7 is dragged into the open. Honest note: engines show it is not a forced win, and the engine itself would play 24.Qxd6 or 24.Nc6+ (about −1 for White). Kasparov chose huge practical chances over a quiet, slightly worse position.",
    "arrows": [
     [
      "e1",
      "e7",
      "green"
     ],
     [
      "f4",
      "d4",
      "green"
     ]
    ],
    "alternatives": [
     "Nc6+"
    ]
   },
   {
    "kind": "defence",
    "text": "Takes the rook, and the engine agrees it is a sound choice. Engines are divided on the exact verdict: the calmer 24...Kb6 also kept Black at least slightly better."
   },
   {
    "kind": "tactic",
    "text": "Check along the seventh rank, before Black can consolidate. The rook and the knight on a5 both cover b7, so the king must choose between b8 and b6.",
    "arrows": [
     [
      "e7",
      "a7",
      "red"
     ]
    ],
    "alternatives": [
     "Qxd4+"
    ]
   },
   {
    "kind": "defence",
    "text": "Scan the escape squares: b7 is covered by the rook and the a5 knight, a8 and a6 hold Black's own pieces. Kb8 loses to Qxd4 (about +5), so the king must step forward."
   },
   {
    "kind": "tactic",
    "text": "The queen wins back a pawn with check on the diagonal from d4 to b6. Every other move leaves White losing (about −8).",
    "arrows": [
     [
      "d4",
      "b6",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Denied squares: a7 (rook and queen), b7 (rook and knight), c7 (rook), c6 (knight and d5 pawn), c5 (queen). Blocking with ...Qc5 loses (about +4), so the king grabs the knight."
   },
   {
    "kind": "tactic",
    "text": "A pawn check, and the only move that keeps the balance. b6 is covered by the queen, and b4 cannot be taken because the queen and a3 pawn protect it.",
    "arrows": [
     [
      "b4",
      "a5",
      "red"
     ]
    ],
    "alternatives": [
     "Qc3+"
    ]
   },
   {
    "kind": "defence",
    "text": "Forced: the only other legal move is to give up the queen on b4. The king now stands on a4, deep inside White's half, and White has several quiet queen moves that set up mate."
   },
   {
    "kind": "tactic",
    "text": "A quiet move with a deadly threat: Qb3 would be mate, since the b4 pawn covers a5 and the queen guards a3 and b4. Black must stop it at once.",
    "arrows": [
     [
      "c3",
      "b3",
      "red"
     ]
    ],
    "alternatives": [
     "Ra7"
    ]
   },
   {
    "kind": "defence",
    "text": "The best defence: the queen takes a pawn and now guards b3 along the diagonal. Taking with the bishop instead allows Kb2 and a quick forced mate.",
    "arrows": [
     [
      "d5",
      "b3",
      "blue"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "The rook swings across to threaten Rxa6, which would be mate because a5, b3 and a3 are all covered. It also attacks the bishop on a8.",
    "arrows": [
     [
      "a7",
      "a6",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The only good defence: the bishop now guards a6. Other moves, such as ...Rd6, allow a forced mate.",
    "arrows": [
     [
      "b7",
      "a6",
      "blue"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "Removes the bishop that guarded a6, renewing mating threats like Rb6 and Qc7. The engine sees Rxa6+ and Qc7 as equally good: this whole sequence is balanced on a knife edge.",
    "alternatives": [
     "Rxa6+"
    ]
   },
   {
    "kind": "defence",
    "text": "Counterattacks the queen on c3 and offers a trade. After Qxc4 bxc4 Black would be winning (about −7). The engine slightly preferred ...Rhe8, but this is a reasonable choice.",
    "arrows": [
     [
      "c4",
      "c3",
      "red"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "Safe: the queen sidesteps the trade by grabbing the knight. Now Qxa6 would be mate, so Black has no time to take on c3.",
    "arrows": [
     [
      "f6",
      "a6",
      "red"
     ]
    ]
   },
   {
    "kind": "mistake",
    "text": "The decisive error. The king takes a pawn to escape the mate on a6, but walks even deeper into White's position. After 32.Qxa6+ Kxb4 33.c3+ it gets hunted across the board.",
    "better": "31...Rd1+ 32.Kb2 Ra8 was the way: the rook check gains time and Black holds (about +0.7, instead of about +4.4 after the game move).",
    "alternatives": [
     "Rd1+"
    ]
   },
   {
    "kind": "tactic",
    "text": "Check, and the king has only one square. The queen on a6 also controls the whole a-file.",
    "arrows": [
     [
      "a6",
      "a3",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The only legal move. a2 is covered by the queen and White's king, a4 by the queen, b2 by the king on b1, and b3 by the c2 pawn."
   },
   {
    "kind": "key",
    "text": "A brilliant pawn sacrifice and the only winning move (about +5.6; the next best is only about +1). It lures the king to c3, where the queen can check from a1 along the long diagonal.",
    "arrows": [
     [
      "c3",
      "b4",
      "red"
     ]
    ],
    "alternatives": [
     "Bd7"
    ]
   },
   {
    "kind": "defence",
    "text": "The best try. a3, a4 and a5 are covered by the queen, and b5 is Black's own pawn. ...Kb3 runs into a forced mate and ...Kc5 loses even more heavily."
   },
   {
    "kind": "tactic",
    "text": "Check along the long diagonal. The queen now covers b2 and d4, and White's king on b1 covers c2.",
    "arrows": [
     [
      "a1",
      "c3",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Denied: b2 (queen and king), c2 (king), d4 (queen). ...Kb3 loses to Qb2+ Ka4 Ra7 mate, and ...Kb4 or ...Kd3 lose more heavily. The king heads for the centre."
   },
   {
    "kind": "tactic",
    "text": "Check along the second rank, pushing the king back towards White's first rank.",
    "arrows": [
     [
      "b2",
      "d2",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Denied: c1 and c2 (queen and White's king), c3 (queen), e2 (queen along the second rank). ...Kd3 and ...Ke3 allow forced mates, ...Ke1 loses too. The king has been dragged from a7 all the way to d1."
   },
   {
    "kind": "key",
    "text": "The bishop comes back to f1 to attack the queen on c4. It cannot be taken: 36...Qxf1 37.Qc2+ Ke1 38.Re7+ Qe2 39.Qxe2 is mate.",
    "arrows": [
     [
      "f1",
      "c4",
      "red"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "The best defence: a counterattack on the queen on b2, with the rook protected by the king. If 37.Bxc4 Rxb2+ 38.Kxb2 bxc4, the position would be roughly level.",
    "arrows": [
     [
      "d2",
      "b2",
      "red"
     ]
    ]
   },
   {
    "kind": "key",
    "text": "The point of the combination. The rook pins Black's rook to the king along the d-file, so ...Rxb2 is now illegal. It also threatens Qxd2 mate. The engine confirms this is the only winning move (about +6; 37.Bxc4 gives only about level).",
    "arrows": [
     [
      "d7",
      "d1",
      "blue"
     ],
     [
      "b2",
      "d2",
      "green"
     ]
    ]
   },
   {
    "kind": "defence",
    "text": "Forced in practice: other moves such as ...Ke1 or ...Rd5 allow a forced mate. Black takes the rook, but the queen on c4 is still attacked."
   },
   {
    "kind": "tactic",
    "text": "The bishop finally collects the queen."
   },
   {
    "kind": "defence",
    "text": "Recaptures the bishop. Black has two rooks, but the h8 rook is loose on the long diagonal.",
    "arrows": [
     [
      "b2",
      "h8",
      "red"
     ]
    ]
   },
   {
    "kind": "tactic",
    "text": "The queen picks up the h8 rook along the long diagonal. White now has queen and three pawns against rook and four pawns, a winning endgame."
   },
   {
    "kind": "plan",
    "text": "The rook gets active and attacks the f3 pawn.",
    "arrows": [
     [
      "d3",
      "f3",
      "red"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "The queen defends f3 along the long diagonal from a8 and gets ready to check from a4. The engine slightly preferred f4, but White is winning either way.",
    "arrows": [
     [
      "a8",
      "f3",
      "blue"
     ]
    ],
    "alternatives": [
     "f4"
    ]
   },
   {
    "kind": "plan",
    "text": "Black pushes the passed c-pawn, the only real source of counterplay, aiming for c2.",
    "alternatives": [
     "Rb3+"
    ]
   },
   {
    "kind": "tactic",
    "text": "Check on the a4-d1 diagonal, driving the king away from the c-pawn.",
    "arrows": [
     [
      "a4",
      "d1",
      "red"
     ]
    ],
    "alternatives": [
     "Qc6"
    ]
   },
   {
    "kind": "defence",
    "text": "The king steps to e1. ...Kd2 was about as good, but Black is lost in any case."
   },
   {
    "kind": "plan",
    "text": "Safe: the pawn steps off f3, where the rook attacked it.",
    "alternatives": [
     "Qe4+"
    ]
   },
   {
    "kind": "plan",
    "text": "Blocks White's f-pawn so it cannot advance and become dangerous.",
    "alternatives": [
     "Rd2"
    ]
   },
   {
    "kind": "plan",
    "text": "White's king steps up to c1 to help stop the c-pawn, guarding c2 and d2."
   },
   {
    "kind": "plan",
    "text": "The rook takes the second rank, attacking the h2 pawn.",
    "arrows": [
     [
      "d2",
      "h2",
      "red"
     ]
    ]
   },
   {
    "kind": "plan",
    "text": "The queen heads towards g1 and b6 for checks, while White's king holds back the c-pawn. With no counterplay left, Black resigned."
   }
  ]
 }
];

export default masterGames;
