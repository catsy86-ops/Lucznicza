import type { WalkingRoute } from '../types';

export const ROUTES: WalkingRoute[] = [
  {
    "id": 1,
    "name": "Spacer po Łuczniczej",
    "emoji": "🚶",
    "type": "walk",
    "color": "#6c63ff",
    "distance": "1.4 km",
    "distanceNum": 1.4,
    "time": "18 min",
    "timeMin": 18,
    "difficulty": "Łatwa",
    "difficultyLevel": 1,
    "calories": 70,
    "terrain": "Chodnik",
    "bestTime": "Rano",
    "tags": [
      "poranny",
      "usługi",
      "spokojny",
      "Łucznicza"
    ],
    "desc": "Spacer wzdłuż ul. Łuczniczej — głównej arterii Niebuszewo. Mijasz aptekę, pocztę i park Kadziaka. Idealna trasa na poranny spacer.",
    "highlights": [
      "Apteka Fiołkowa",
      "Urząd Pocztowy",
      "Park Kadziaka"
    ],
    "stops": [
      {
        "name": "Start: Apteka Fiołkowa",
        "addr": "ul. Łucznicza",
        "emoji": "💊"
      },
      {
        "name": "Urząd Pocztowy Szczecin 41",
        "addr": "ul. Łucznicza",
        "emoji": "📮"
      },
      {
        "name": "Park Antoniego Kadziaka",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      },
      {
        "name": "Siłownia Plenerowa",
        "addr": "Park Kadziaka",
        "emoji": "💪"
      },
      {
        "name": "Meta: Boisko Sportowe",
        "addr": "ul. Łucznicza",
        "emoji": "⚽"
      }
    ],
    "coords": [
      [
        14.54773,
        53.45399
      ],
      [
        14.54794,
        53.45296
      ],
      [
        14.54365,
        53.451
      ],
      [
        14.544,
        53.4508
      ],
      [
        14.551,
        53.452
      ]
    ]
  },
  {
    "id": 2,
    "name": "Trasa Rodzinna Niebuszewo",
    "emoji": "👨‍👩‍👧",
    "type": "walk",
    "color": "#43e97b",
    "distance": "2.2 km",
    "distanceNum": 2.2,
    "time": "30 min",
    "timeMin": 30,
    "difficulty": "Łatwa",
    "difficultyLevel": 1,
    "calories": 110,
    "terrain": "Chodnik + park",
    "bestTime": "Popołudnie",
    "tags": [
      "rodzina",
      "dzieci",
      "park",
      "pętla"
    ],
    "desc": "Trasa idealna dla rodzin z dziećmi. Prowadzi przez Park Kadziaka, Park Bartoszewskiego i okolice szkół. Wiele ławek po drodze.",
    "highlights": [
      "Park Kadziaka",
      "Park Bartoszewskiego",
      "Przedszkole Przyjaciele"
    ],
    "stops": [
      {
        "name": "Start: Park Kadziaka",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      },
      {
        "name": "Przedszkole Przyjaciele",
        "addr": "ul. Ks. Warcisława I",
        "emoji": "🧒"
      },
      {
        "name": "Apteka Puls",
        "addr": "ul. Ks. Warcisława I 27a",
        "emoji": "💊"
      },
      {
        "name": "Park Bartoszewskiego",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      },
      {
        "name": "Meta: Park Kadziaka",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      }
    ],
    "coords": [
      [
        14.54365,
        53.451
      ],
      [
        14.55053,
        53.45077
      ],
      [
        14.54989,
        53.45367
      ],
      [
        14.56531,
        53.45059
      ],
      [
        14.54365,
        53.451
      ]
    ]
  },
  {
    "id": 3,
    "name": "Trasa Gastronomiczna",
    "emoji": "🍽️",
    "type": "walk",
    "color": "#ffd93d",
    "distance": "1.6 km",
    "distanceNum": 1.6,
    "time": "22 min",
    "timeMin": 22,
    "difficulty": "Łatwa",
    "difficultyLevel": 1,
    "calories": 80,
    "terrain": "Chodnik",
    "bestTime": "Południe",
    "tags": [
      "jedzenie",
      "smaki",
      "piekarnia",
      "pizza"
    ],
    "desc": "Trasa dla smakoszy — od piekarni przez kebab do pizzerii. Poznaj smaki Niebuszewo przy ul. Przyjaciół Żołnierza.",
    "highlights": [
      "Piekarnia Genial",
      "Bafra Kebab",
      "Pizza Hut"
    ],
    "stops": [
      {
        "name": "Start: Piekarnia Genial",
        "addr": "ul. Przyjaciół Żołnierza",
        "emoji": "🥖"
      },
      {
        "name": "Bafra Kebab",
        "addr": "ul. Przyjaciół Żołnierza",
        "emoji": "🥙"
      },
      {
        "name": "Pizza Hut",
        "addr": "ul. Przyjaciół Żołnierza 128a",
        "emoji": "🍕"
      },
      {
        "name": "Piekarnia Arion Polbak",
        "addr": "ul. Przyjaciół Żołnierza 128a",
        "emoji": "🥖"
      },
      {
        "name": "Meta: Bank Millennium",
        "addr": "ul. Przyjaciół Żołnierza 128a",
        "emoji": "🏦"
      }
    ],
    "coords": [
      [
        14.55135,
        53.45471
      ],
      [
        14.55156,
        53.45482
      ],
      [
        14.5519,
        53.45484
      ],
      [
        14.55198,
        53.4547
      ],
      [
        14.55185,
        53.45465
      ]
    ]
  },
  {
    "id": 4,
    "name": "Trasa Rowerowa Niebuszewo",
    "emoji": "🚴",
    "type": "bike",
    "color": "#ff6b6b",
    "distance": "4.8 km",
    "distanceNum": 4.8,
    "time": "22 min",
    "timeMin": 22,
    "difficulty": "Średnia",
    "difficultyLevel": 2,
    "calories": 144,
    "terrain": "Chodnik + ulica",
    "bestTime": "Wieczór",
    "tags": [
      "rower",
      "aktywny",
      "szybki",
      "obwód"
    ],
    "desc": "Dynamiczna trasa rowerowa okrążająca całe Niebuszewo. Przez parki, główne ulice i spokojne boczne drogi.",
    "highlights": [
      "Park Kadziaka",
      "ul. Przyjaciół Żołnierza",
      "Park Bartoszewskiego"
    ],
    "stops": [
      {
        "name": "Start: Park Kadziaka",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      },
      {
        "name": "Boisko Sportowe",
        "addr": "ul. Łucznicza",
        "emoji": "⚽"
      },
      {
        "name": "ul. Przyjaciół Żołnierza",
        "addr": "Niebuszewo",
        "emoji": "🚴"
      },
      {
        "name": "Park Bartoszewskiego",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      },
      {
        "name": "Kościół Miłosierdzia Bożego",
        "addr": "ul. Przyjaciół Żołnierza 45",
        "emoji": "⛪"
      },
      {
        "name": "Meta: Park Kadziaka",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      }
    ],
    "coords": [
      [
        14.54365,
        53.451
      ],
      [
        14.551,
        53.452
      ],
      [
        14.5519,
        53.45484
      ],
      [
        14.56531,
        53.45059
      ],
      [
        14.55687,
        53.4535
      ],
      [
        14.54365,
        53.451
      ]
    ]
  },
  {
    "id": 5,
    "name": "Trasa Biegowa Niebuszewo",
    "emoji": "🏃",
    "type": "run",
    "color": "#ff6584",
    "distance": "3.0 km",
    "distanceNum": 3,
    "time": "17 min",
    "timeMin": 17,
    "difficulty": "Średnia",
    "difficultyLevel": 2,
    "calories": 240,
    "terrain": "Chodnik + park",
    "bestTime": "Rano / Wieczór",
    "tags": [
      "bieg",
      "sport",
      "kondycja",
      "pętla"
    ],
    "desc": "Popularna trasa biegowa przez parki Niebuszewo. Płaska, bezpieczna pętla przez Park Kadziaka i okolice. Idealna do joggingu.",
    "highlights": [
      "Park Kadziaka",
      "Siłownia plenerowa",
      "Alejki parkowe"
    ],
    "stops": [
      {
        "name": "Start: Boisko Sportowe",
        "addr": "ul. Łucznicza",
        "emoji": "⚽"
      },
      {
        "name": "Siłownia Plenerowa",
        "addr": "Park Kadziaka",
        "emoji": "💪"
      },
      {
        "name": "Park Kadziaka",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      },
      {
        "name": "Park Bartoszewskiego",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      },
      {
        "name": "Meta: Boisko Sportowe",
        "addr": "ul. Łucznicza",
        "emoji": "⚽"
      }
    ],
    "coords": [
      [
        14.551,
        53.452
      ],
      [
        14.544,
        53.4508
      ],
      [
        14.54365,
        53.451
      ],
      [
        14.56531,
        53.45059
      ],
      [
        14.551,
        53.452
      ]
    ]
  },
  {
    "id": 6,
    "name": "Szlak Historyczny Niebuszewo",
    "emoji": "🏛️",
    "type": "walk",
    "color": "#a29bfe",
    "distance": "2.6 km",
    "distanceNum": 2.6,
    "time": "40 min",
    "timeMin": 40,
    "difficulty": "Łatwa",
    "difficultyLevel": 1,
    "calories": 130,
    "terrain": "Chodnik",
    "bestTime": "Dowolna pora",
    "tags": [
      "historia",
      "kultura",
      "kościoły",
      "architektura"
    ],
    "desc": "Spacer śladami historii Niebuszewo. Zabytkowe kościoły, przedwojenna architektura i miejsca pamięci dzielnicy.",
    "highlights": [
      "Kościół pw. Miłosierdzia Bożego",
      "Kościół pw. św. Mikołaja",
      "Zabytkowa zabudowa"
    ],
    "stops": [
      {
        "name": "Start: Kościół Miłosierdzia Bożego",
        "addr": "ul. Przyjaciół Żołnierza 45",
        "emoji": "⛪"
      },
      {
        "name": "Bank Pekao",
        "addr": "ul. Bpa Bandurskiego 98",
        "emoji": "🏦"
      },
      {
        "name": "Apteka Dbam o Zdrowie",
        "addr": "ul. Bpa Bandurskiego 98",
        "emoji": "💊"
      },
      {
        "name": "Kościół pw. św. Mikołaja",
        "addr": "ul. M. Golisza",
        "emoji": "⛪"
      },
      {
        "name": "SP nr 18 im. Józefa Bema",
        "addr": "ul. Komuny Paryskiej 20",
        "emoji": "🏫"
      },
      {
        "name": "Meta: Park Bartoszewskiego",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      }
    ],
    "coords": [
      [
        14.55687,
        53.4535
      ],
      [
        14.56339,
        53.45348
      ],
      [
        14.56355,
        53.45365
      ],
      [
        14.56807,
        53.45297
      ],
      [
        14.56575,
        53.45356
      ],
      [
        14.56531,
        53.45059
      ]
    ]
  },
  {
    "id": 7,
    "name": "Szlak Przemarszu Dzików",
    "emoji": "🐗",
    "type": "walk",
    "color": "#e67e22",
    "distance": "1.9 km",
    "distanceNum": 1.9,
    "time": "25 min",
    "timeMin": 25,
    "difficulty": "Średnia (uwaga na chrumkanie)",
    "difficultyLevel": 2,
    "calories": 110,
    "terrain": "Chodnik i parkowe alejki",
    "bestTime": "Zmierzch (19:00–22:00)",
    "tags": [
      "dziki",
      "przygoda",
      "humor",
      "park",
      "Niebuszewo",
      "legenda"
    ],
    "desc": "Kultowa trasa spacerowa omijająca nocne żerowiska niebuszewskich dzików. Przewodnik po krzakach, gdzie chrumkanie słychać głośniej niż dzwonki tramwajów, z bezpieczną metą przy Pubie Klatka.",
    "highlights": [
      "Strefa Żołędzi w Parku Kadziaka",
      "Krzaki przy ul. Tarczowej",
      "Ławeczka Filozofów",
      "Bezpieczna Przystań: Pub Klatka"
    ],
    "stops": [
      {
        "name": "Start: Park Antoniego Kadziaka",
        "addr": "ul. Łucznicza",
        "emoji": "🌳"
      },
      {
        "name": "Ławeczka Filozofów (narada strategiczna)",
        "addr": "Park Kadziaka",
        "emoji": "🧐"
      },
      {
        "name": "Skwer przy Tarczowej (strefa podsłuchu chrumkania)",
        "addr": "ul. Tarczowa",
        "emoji": "🐗"
      },
      {
        "name": "Meta: Pub Klatka (schronienie i zimne piwo)",
        "addr": "ul. Łucznicza 43",
        "emoji": "🍻"
      }
    ],
    "coords": [
      [
        14.54365,
        53.45100
      ],
      [
        14.54420,
        53.45140
      ],
      [
        14.54794,
        53.45296
      ],
      [
        14.55100,
        53.45200
      ],
      [
        14.54752,
        53.45405
      ]
    ]
  },
  {
    "id": 8,
    "name": "Klimaty i Legendy Niebuszewa",
    "emoji": "🍻",
    "type": "walk",
    "color": "#f39c12",
    "distance": "2.8 km",
    "distanceNum": 2.8,
    "time": "38 min",
    "timeMin": 38,
    "difficulty": "Łatwa / Degustacyjna",
    "difficultyLevel": 1,
    "calories": 145,
    "terrain": "Chodnik i parkowe alejki",
    "bestTime": "Popołudnie i wieczór (16:00–21:00)",
    "tags": [
      "klimat",
      "legendy",
      "piwo",
      "murek",
      "wytrzeźwiałka",
      "klatka",
      "humor",
      "spacer"
    ],
    "desc": "Niezapomniana osiedlowa eskapada szlakiem nieformalnych instytucji kultury towarzyskiej: od Murka przy sklepie Anka, przez Pub Klatka i parkowe ławki Kadziaka, aż po Przystań Pijacką „Wytrzeźwiałka” przy Lenartowicza 21.",
    "highlights": [
      "Osiedlowy Murek przy Ance",
      "Pub Klatka pod 39",
      "Ławeczki Parku Kadziaka",
      "Pasztecik Społem",
      "Przystań Pijacka Wytrzeźwiałka"
    ],
    "stops": [
      {
        "name": "Start: Osiedlowy Murek przy Sklepie Anka",
        "addr": "ul. Łucznicza",
        "emoji": "🧱"
      },
      {
        "name": "Pub Klatka (narada osiedlowa)",
        "addr": "ul. Łucznicza 39/43",
        "emoji": "🍻"
      },
      {
        "name": "Park Antoniego Kadziaka",
        "addr": "Niebuszewo",
        "emoji": "🌳"
      },
      {
        "name": "Pasztecik Społem Kołłątaja",
        "addr": "ul. Orzeszkowej 14",
        "emoji": "🥟"
      },
      {
        "name": "Meta: Przystań Pijacka „Wytrzeźwiałka”",
        "addr": "ul. Lenartowicza 21",
        "emoji": "🍺"
      }
    ],
    "coords": [
      [
        14.5500,
        53.4538
      ],
      [
        14.54752,
        53.45405
      ],
      [
        14.54365,
        53.45100
      ],
      [
        14.54820,
        53.44980
      ],
      [
        14.54205,
        53.44792
      ]
    ]
  },
  {
    "id": 9,
    "name": "Granatowo-Bordowy Szlak Dumy Pomorza",
    "emoji": "🛡️",
    "type": "walk",
    "color": "#002D62",
    "distance": "3.2 km",
    "distanceNum": 3.2,
    "time": "42 min",
    "timeMin": 42,
    "difficulty": "Średnia",
    "difficultyLevel": 2,
    "calories": 190,
    "terrain": "Chodnik",
    "bestTime": "Dzień meczowy / Przedpołudnie",
    "tags": [
      "pogoń",
      "sport",
      "mural",
      "dumapomorza",
      "piłka",
      "stadion",
      "szlak"
    ],
    "desc": "Trasa dla każdego fana Pogoni Szczecin na Niebuszewie. Łączy osiedlowy orlik z muralem MKS-u, punkty zbornego dopingu, Stację SKM Niebuszewo oraz pętlę Kołłątaja, skąd tramwaj zabiera kibiców prosto pod bramy stadionu im. Floriana Krygiera.",
    "highlights": [
      "Mural Pogoni na Orliku Łucznicza",
      "Stacja SKM Szczecin Niebuszewo",
      "Tradycyjny Pasztecik Niebuszewo",
      "Pętla Kołłątaja — Tramwaj na Stadion"
    ],
    "stops": [
      {
        "name": "Start: Orlik & Mural Pogoni Szczecin",
        "addr": "ul. Łucznicza",
        "emoji": "⚽"
      },
      {
        "name": "Stacja SKM Szczecin Niebuszewo",
        "addr": "ul. Orzeszkowej 28",
        "emoji": "🚉"
      },
      {
        "name": "Tradycyjny Pasztecik Niebuszewo",
        "addr": "ul. Orzeszkowej 14",
        "emoji": "🥟"
      },
      {
        "name": "Meta: Pętla Kołłątaja (przystanek na Stadion)",
        "addr": "al. Wyzwolenia",
        "emoji": "🚋"
      }
    ],
    "coords": [
      [
        14.54920,
        53.45180
      ],
      [
        14.55100,
        53.45200
      ],
      [
        14.55780,
        53.45420
      ],
      [
        14.54820,
        53.44980
      ],
      [
        14.54480,
        53.44720
      ]
    ]
  },
  {
    "id": 10,
    "name": "Królowie Torów i Rzemiosła — Szlak Niemierzyński",
    "emoji": "🚋",
    "type": "walk",
    "color": "#9E002B",
    "distance": "2.7 km",
    "distanceNum": 2.7,
    "time": "36 min",
    "timeMin": 36,
    "difficulty": "Łatwa",
    "difficultyLevel": 1,
    "calories": 160,
    "terrain": "Chodnik + alejki parkowe",
    "bestTime": "Przedpołudnie / Popołudnie (Wt–Ndz)",
    "tags": [
      "niemierzyn",
      "tramwaje",
      "muzeum",
      "park",
      "piekarnia",
      "architektura",
      "spacer"
    ],
    "desc": "Fascynująca wyprawa od Pętli Kołłątaja przez zielone alejki Parku Noakowskiego do historycznej Zajezdni Sztuki (Muzeum Techniki). W programie legendy szczecińskich tramwajów, motocykle Junak, zabytkowe kamienice i świeże wypieki rzemieślnicze.",
    "highlights": [
      "Węzeł Kołłątaja",
      "Park Noakowskiego & Skwer Pawłowskiego",
      "Muzeum Techniki i Komunikacji (Zajezdnia)",
      "Piekarnia Rzemieślnicza Niemierzyn",
      "Willa Karkutsch & Zabytkowe Kamienice"
    ],
    "stops": [
      {
        "name": "Start: Węzeł Kołłątaja",
        "addr": "al. Wyzwolenia / Kołłątaja",
        "emoji": "🚋"
      },
      {
        "name": "Park Noakowskiego",
        "addr": "ul. Noakowskiego",
        "emoji": "🌳"
      },
      {
        "name": "Muzeum Techniki i Komunikacji",
        "addr": "ul. Niemierzyńska 18A",
        "emoji": "🏛️"
      },
      {
        "name": "Piekarnia Rzemieślnicza Niemierzyn",
        "addr": "ul. Niemierzyńska 24",
        "emoji": "🥐"
      },
      {
        "name": "Meta: Willa Karkutsch & Kamienice",
        "addr": "ul. Niemierzyńska / Długosza",
        "emoji": "🏛️"
      }
    ],
    "coords": [
      [
        14.54480,
        53.44720
      ],
      [
        14.54120,
        53.44910
      ],
      [
        14.53750,
        53.45040
      ],
      [
        14.53980,
        53.45010
      ],
      [
        14.54280,
        53.44850
      ]
    ]
  }
];
