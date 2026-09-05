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
  }
];
