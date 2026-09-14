// ===== DANE APLIKACJI =====
// Dzielnica: Niebuszewo, Szczecin
// Centrum: ~53.4530, 14.5520

const APP_DATA = {

  center: [14.5546, 53.4559],  // Centrum Niebuszewo, Szczecin

  // ===== MIEJSCA — PRAWDZIWE DANE OSM (Niebuszewo/Łucznicza, Szczecin) =====
  // Źródło: OpenStreetMap via Nominatim | Pobrano: 2026-05-30
  places: [
    // ===== APTEKI =====
    {
      id: 1, cat: 'service',
      name: 'Apteka Fiołkowa',
      addr: 'ul. Łucznicza, Szczecin',
      emoji: '💊',
      desc: 'Apteka ogólnodostępna na ul. Łuczniczej. Pełny asortyment leków, suplementów i artykułów higienicznych.',
      hours: 'Pon–Pt 8:00–20:00',
      phone: null, website: null,
      coords: [14.54773, 53.45399],
      rating: 4.2,
      tags: ['apteka', 'leki', 'zdrowie', 'Łucznicza']
    },
    {
      id: 2, cat: 'service',
      name: 'Apteka Puls',
      addr: 'ul. Ks. Warcisława I 27a, Szczecin',
      emoji: '💊',
      desc: 'Apteka Puls z szerokim asortymentem leków i suplementów. Czynna również w weekendy.',
      hours: 'Pon–Pt 8:00–20:00, Sob 8:00–18:00, Ndz 10:00–16:00',
      phone: null, website: null,
      coords: [14.54989, 53.45367],
      rating: 4.3,
      tags: ['apteka', 'leki', 'zdrowie', 'weekendy']
    },
    {
      id: 3, cat: 'service',
      name: 'Apteka Dbam o Zdrowie',
      addr: 'ul. Bpa Bandurskiego 98, Szczecin',
      emoji: '💊',
      desc: 'Sieciowa apteka Dbam o Zdrowie. Szeroki wybór leków, kosmetyków i artykułów zdrowotnych.',
      hours: 'Pon–Pt 8:00–21:00, Sob 8:00–20:00, Ndz 9:00–17:00',
      phone: null, website: 'dbamozdrowie.pl',
      coords: [14.56355, 53.45365],
      rating: 4.1,
      tags: ['apteka', 'leki', 'zdrowie', 'sieciowa']
    },
    {
      id: 4, cat: 'service',
      name: 'Apteka Cefarm',
      addr: 'ul. Bpa Naruszewicza 11, Szczecin',
      emoji: '💊',
      desc: 'Apteka Cefarm — lokalna sieć aptek zachodniopomorskich. Leki, suplementy, artykuły higieniczne.',
      hours: 'Pon–Pt 8:00–20:00, Sob 8:00–15:00',
      phone: null, website: null,
      coords: [14.54989, 53.44766],
      rating: 4.0,
      tags: ['apteka', 'leki', 'cefarm']
    },
    // ===== SKLEPY =====
    {
      id: 5, cat: 'shop',
      name: 'Sklep Spożywczo-Monopolowy',
      addr: 'ul. Bpa Bandurskiego 87a, Szczecin',
      emoji: '🛒',
      desc: 'Lokalny sklep spożywczo-monopolowy. Czynny codziennie od 6:00 do 23:00. Szeroki asortyment produktów.',
      hours: 'Codziennie 6:00–23:00',
      phone: null, website: null,
      coords: [14.55998, 53.45616],
      rating: 3.9,
      tags: ['sklep', 'spożywczy', 'monopolowy', 'całą dobę']
    },
    // ===== JEDZENIE =====
    {
      id: 6, cat: 'food',
      name: 'Bafra Kebab',
      addr: 'ul. Przyjaciół Żołnierza, Szczecin',
      emoji: '🥙',
      desc: 'Popularny kebab na Niebuszewie. Szybka obsługa, duże porcje, przystępne ceny. Ulubione miejsce mieszkańców.',
      hours: 'Codziennie 11:00–23:00',
      phone: null, website: null,
      coords: [14.55156, 53.45482],
      rating: 4.4,
      tags: ['kebab', 'fast food', 'tanie jedzenie', 'szybko']
    },
    {
      id: 7, cat: 'food',
      name: 'Pizza Hut',
      addr: 'ul. Przyjaciół Żołnierza 128a, Szczecin',
      emoji: '🍕',
      desc: 'Restauracja Pizza Hut na Niebuszewie. Pizza, makarony, sałatki. Dostawa i jedzenie na miejscu.',
      hours: 'Codziennie 11:00–23:00',
      phone: null, website: 'pizzahut.pl',
      coords: [14.55190, 53.45484],
      rating: 4.0,
      tags: ['pizza', 'restauracja', 'dostawa', 'Pizza Hut']
    },
    {
      id: 8, cat: 'food',
      name: 'Gastro Pizza Night',
      addr: 'ul. Przyjaciół Żołnierza, Szczecin',
      emoji: '🍕',
      desc: 'Lokalna pizzeria na Niebuszewie. Domowa pizza z pieca, dostawa w okolicy.',
      hours: 'Codziennie 12:00–23:00',
      phone: null, website: null,
      coords: [14.56277, 53.45301],
      rating: 4.2,
      tags: ['pizza', 'lokalna', 'dostawa']
    },
    {
      id: 9, cat: 'food',
      name: 'Genial Piekarnia',
      addr: 'ul. Przyjaciół Żołnierza, Szczecin',
      emoji: '🥖',
      desc: 'Piekarnia Genial — świeże pieczywo każdego ranka. Chleby, bułki, ciasta. Sklep partnerski.',
      hours: 'Pon–Pt 7:00–20:00, Sob 7:00–16:00',
      phone: null, website: null,
      coords: [14.55135, 53.45471],
      rating: 4.5,
      tags: ['piekarnia', 'pieczywo', 'świeże', 'chleb']
    },
    {
      id: 10, cat: 'food',
      name: 'Piekarnia Arion Polbak',
      addr: 'ul. Przyjaciół Żołnierza 128a, Szczecin',
      emoji: '🥖',
      desc: 'Piekarnia Arion Polbak — tradycyjne wypieki. Świeże pieczywo, ciasta i wyroby cukiernicze.',
      hours: 'Pon–Sob 6:00–18:00',
      phone: null, website: null,
      coords: [14.55198, 53.45470],
      rating: 4.3,
      tags: ['piekarnia', 'pieczywo', 'tradycja', 'ciasta']
    },
    // ===== EDUKACJA =====
    {
      id: 11, cat: 'edu',
      name: 'Szkoła Podstawowa nr 35 im. Jana Pawła II',
      addr: 'ul. Jana Kułakowskiego, Szczecin',
      emoji: '🏫',
      desc: 'Publiczna szkoła podstawowa na Niebuszewie. Nowoczesna baza dydaktyczna, sala gimnastyczna, boisko.',
      hours: 'Pon–Pt 7:00–17:00 (dni szkolne)',
      phone: null, website: null,
      coords: [14.55523, 53.45008],
      rating: 4.2,
      tags: ['szkoła', 'edukacja', 'dzieci', 'SP35']
    },
    {
      id: 12, cat: 'edu',
      name: 'Szkoła Podstawowa nr 18 im. Józefa Bema',
      addr: 'ul. Komuny Paryskiej 20, Szczecin',
      emoji: '🏫',
      desc: 'Szkoła Podstawowa nr 18 — jedna z większych szkół w dzielnicy. Bogata oferta zajęć pozalekcyjnych.',
      hours: 'Pon–Pt 7:00–17:00 (dni szkolne)',
      phone: null, website: null,
      coords: [14.56575, 53.45356],
      rating: 4.1,
      tags: ['szkoła', 'edukacja', 'dzieci', 'SP18']
    },
    {
      id: 13, cat: 'edu',
      name: 'Szkoła Podstawowa nr 69 im. mjr. H. Sucharskiego',
      addr: 'ul. Jana Zamoyskiego, Szczecin',
      emoji: '🏫',
      desc: 'Szkoła Podstawowa nr 69 na Niebuszewie. Aktywna społeczność szkolna, liczne koła zainteresowań.',
      hours: 'Pon–Pt 7:00–17:00 (dni szkolne)',
      phone: null, website: null,
      coords: [14.54317, 53.44885],
      rating: 4.0,
      tags: ['szkoła', 'edukacja', 'dzieci', 'SP69']
    },
    {
      id: 14, cat: 'edu',
      name: 'Przedszkole Publiczne nr 59',
      addr: 'ul. Księżnej Zofii, Szczecin',
      emoji: '🧒',
      desc: 'Publiczne przedszkole na Niebuszewie. Przyjazna atmosfera, wykwalifikowana kadra, plac zabaw.',
      hours: 'Pon–Pt 6:30–17:00',
      phone: null, website: null,
      coords: [14.55910, 53.45127],
      rating: 4.4,
      tags: ['przedszkole', 'dzieci', 'edukacja', 'publiczne']
    },
    {
      id: 15, cat: 'edu',
      name: 'Przedszkole Publiczne nr 5',
      addr: 'ul. Tomaszowska, Szczecin',
      emoji: '🧒',
      desc: 'Przedszkole Publiczne nr 5 — opieka nad dziećmi w wieku 3–6 lat. Ogród, plac zabaw, zajęcia artystyczne.',
      hours: 'Pon–Pt 6:30–17:00',
      phone: null, website: null,
      coords: [14.56673, 53.44839],
      rating: 4.3,
      tags: ['przedszkole', 'dzieci', 'edukacja']
    },
    {
      id: 16, cat: 'edu',
      name: 'Przedszkole Przyjaciele',
      addr: 'ul. Ks. Warcisława I, Szczecin',
      emoji: '🧒',
      desc: 'Niepubliczne przedszkole Przyjaciele. Mała liczebność grup, indywidualne podejście do dziecka.',
      hours: 'Pon–Pt 7:00–17:00',
      phone: null, website: null,
      coords: [14.55053, 53.45077],
      rating: 4.6,
      tags: ['przedszkole', 'niepubliczne', 'dzieci', 'mała grupa']
    },
    // ===== BANKI / USŁUGI =====
    {
      id: 17, cat: 'service',
      name: 'Bank Pekao SA',
      addr: 'ul. Bpa Bandurskiego 98, Szczecin',
      emoji: '🏦',
      desc: 'Oddział Banku Pekao SA na Niebuszewie. Pełna obsługa bankowa, kredyty, konta, bankomat.',
      hours: 'Pon–Pt 9:00–17:00',
      phone: null, website: 'pekao.com.pl',
      coords: [14.56339, 53.45348],
      rating: 3.8,
      tags: ['bank', 'Pekao', 'finanse', 'bankomat']
    },
    {
      id: 18, cat: 'service',
      name: 'Bank Millennium',
      addr: 'ul. Przyjaciół Żołnierza 128a, Szczecin',
      emoji: '🏦',
      desc: 'Oddział Banku Millennium. Obsługa klientów indywidualnych i firmowych, bankomat.',
      hours: 'Pon,Wt,Czw,Pt 9:00–16:00, Śr 10:00–17:00',
      phone: null, website: 'bankmillennium.pl',
      coords: [14.55185, 53.45465],
      rating: 3.9,
      tags: ['bank', 'Millennium', 'finanse']
    },
    {
      id: 19, cat: 'service',
      name: 'Santander Bank Polska',
      addr: 'ul. Ks. Warcisława I 25C, Szczecin',
      emoji: '🏦',
      desc: 'Oddział Santander Bank Polska. Konta osobiste, kredyty, lokaty, bankomat.',
      hours: 'Pon–Pt 9:00–17:00',
      phone: null, website: 'santander.pl',
      coords: [14.54989, 53.45326],
      rating: 3.7,
      tags: ['bank', 'Santander', 'finanse']
    },
    {
      id: 20, cat: 'service',
      name: 'Urząd Pocztowy Szczecin 41',
      addr: 'ul. Łucznicza, Szczecin',
      emoji: '📮',
      desc: 'Filia Urzędu Pocztowego Szczecin 41 na ul. Łuczniczej. Listy, paczki, przekazy, usługi bankowe.',
      hours: 'Pon 9:00–20:00, Wt–Pt 8:00–19:00',
      phone: '800 888 888', website: 'poczta-polska.pl',
      coords: [14.54794, 53.45296],
      rating: 3.8,
      tags: ['poczta', 'paczki', 'listy', 'Łucznicza']
    },
    // ===== PARKI =====
    {
      id: 21, cat: 'park',
      name: 'Park Antoniego Kadziaka',
      addr: 'Niebuszewo, Szczecin',
      emoji: '🌳',
      desc: 'Zielony park na Niebuszewie im. Antoniego Kadziaka. Alejki spacerowe, ławki, tereny rekreacyjne dla mieszkańców.',
      hours: 'Całą dobę',
      phone: null, website: null,
      coords: [14.54365, 53.45100],
      rating: 4.5,
      tags: ['park', 'spacer', 'zieleń', 'rekreacja']
    },
    {
      id: 22, cat: 'park',
      name: 'Park Władysława Bartoszewskiego',
      addr: 'Niebuszewo, Szczecin',
      emoji: '🌳',
      desc: 'Park im. Władysława Bartoszewskiego — spokojne miejsce do spacerów i odpoczynku na Niebuszewie.',
      hours: 'Całą dobę',
      phone: null, website: null,
      coords: [14.56531, 53.45059],
      rating: 4.4,
      tags: ['park', 'spacer', 'zieleń', 'odpoczynek']
    },
    // ===== KOŚCIOŁY =====
    {
      id: 23, cat: 'service',
      name: 'Kościół pw. Miłosierdzia Bożego',
      addr: 'ul. Przyjaciół Żołnierza 45, Szczecin',
      emoji: '⛪',
      desc: 'Kościół parafialny pw. Miłosierdzia Bożego na Niebuszewie. Msze święte, uroczystości parafialne.',
      hours: 'Msze: Pon–Sob 7:00, 18:00; Ndz 8:00, 10:00, 12:00, 18:00',
      phone: null, website: null,
      coords: [14.55687, 53.45350],
      rating: 4.6,
      tags: ['kościół', 'parafia', 'religia', 'Miłosierdzie Boże']
    },
    {
      id: 24, cat: 'service',
      name: 'Kościół pw. św. Mikołaja',
      addr: 'ul. M. Golisza, Szczecin',
      emoji: '⛪',
      desc: 'Kościół parafialny pw. św. Mikołaja na Niebuszewie. Zabytkowy kościół z bogatą historią.',
      hours: 'Msze: Pon–Sob 7:00, 18:00; Ndz 8:00, 10:00, 12:00',
      phone: null, website: null,
      coords: [14.56807, 53.45297],
      rating: 4.5,
      tags: ['kościół', 'parafia', 'zabytek', 'historia']
    },
    // ===== SPORT =====
    {
      id: 25, cat: 'sport',
      name: 'Boisko Sportowe Niebuszewo',
      addr: 'ul. Łucznicza, Szczecin',
      emoji: '⚽',
      desc: 'Ogólnodostępne boisko sportowe na Niebuszewie. Piłka nożna, koszykówka. Oświetlone wieczorami.',
      hours: 'Całą dobę',
      phone: null, website: null,
      coords: [14.55100, 53.45200],
      rating: 4.2,
      tags: ['boisko', 'sport', 'piłka nożna', 'bezpłatne']
    },
    {
      id: 26, cat: 'sport',
      name: 'Siłownia Plenerowa Niebuszewo',
      addr: 'Park Kadziaka, Szczecin',
      emoji: '💪',
      desc: 'Bezpłatna siłownia plenerowa w Parku Kadziaka. Urządzenia do ćwiczeń na świeżym powietrzu.',
      hours: 'Całą dobę',
      phone: null, website: null,
      coords: [14.54400, 53.45080],
      rating: 4.3,
      tags: ['siłownia', 'plener', 'bezpłatne', 'ćwiczenia']
    },
    // ===== SPOŁECZNOŚĆ =====
    {
      id: 27, cat: 'service',
      name: 'Społeczna Szkoła Podstawowa nr 1',
      addr: 'ul. Jaskółcza, Szczecin',
      emoji: '🏫',
      desc: 'Społeczna Szkoła Podstawowa nr 1 — szkoła niepubliczna z indywidualnym podejściem do ucznia.',
      hours: 'Pon–Pt 7:00–17:00',
      phone: null, website: null,
      coords: [14.56735, 53.44945],
      rating: 4.5,
      tags: ['szkoła', 'społeczna', 'niepubliczna', 'edukacja']
    },

    // ===== SUPERMARKETY / SKLEPY SIECIOWE =====
    {
      id: 28, cat: 'shop',
      name: 'Biedronka',
      addr: 'ul. Rostocka 1, Szczecin',
      emoji: '🛒',
      desc: 'Sklep Biedronka przy ul. Rostockiej. Szeroki asortyment produktów spożywczych i przemysłowych w niskich cenach.',
      hours: 'Pon–Sob 6:00–23:30',
      phone: null, website: 'biedronka.pl',
      coords: [14.55496, 53.46105],
      rating: 4.0,
      tags: ['biedronka', 'supermarket', 'tanie zakupy', 'sieciowy']
    },
    {
      id: 29, cat: 'shop',
      name: 'Biedronka',
      addr: 'ul. Bpa Bandurskiego 90, Szczecin',
      emoji: '🛒',
      desc: 'Sklep Biedronka przy ul. Bandurskiego. Produkty spożywcze, chemia gospodarcza, artykuły codziennego użytku.',
      hours: 'Pon–Sob 6:00–22:00',
      phone: null, website: 'biedronka.pl',
      coords: [14.55982, 53.45522],
      rating: 3.9,
      tags: ['biedronka', 'supermarket', 'tanie zakupy']
    },
    {
      id: 30, cat: 'shop',
      name: 'Biedronka',
      addr: 'ul. Przyjaciół Żołnierza 128a, Szczecin',
      emoji: '🛒',
      desc: 'Biedronka przy centrum handlowym Przyjaciół Żołnierza. Duży wybór produktów, długie godziny otwarcia.',
      hours: 'Pon–Sob 6:00–23:30',
      phone: null, website: 'biedronka.pl',
      coords: [14.55212, 53.45475],
      rating: 4.1,
      tags: ['biedronka', 'supermarket', 'centrum handlowe']
    },
    {
      id: 31, cat: 'shop',
      name: 'Lidl',
      addr: 'ul. Bpa Bandurskiego 97, Szczecin',
      emoji: '🛒',
      desc: 'Sklep Lidl przy ul. Bandurskiego. Produkty spożywcze, świeże pieczywo, artykuły przemysłowe i tygodniowe promocje.',
      hours: 'Pon–Sob 7:00–22:00',
      phone: null, website: 'lidl.pl',
      coords: [14.56176, 53.45465],
      rating: 4.2,
      tags: ['lidl', 'supermarket', 'promocje', 'pieczywo']
    },
    {
      id: 32, cat: 'shop',
      name: 'Lidl',
      addr: 'ul. Z. Krasińskiego 82, Szczecin',
      emoji: '🛒',
      desc: 'Sklep Lidl przy ul. Krasińskiego. Czynny również w niedzielę. Świeże produkty, własna piekarnia.',
      hours: 'Pon–Sob 7:00–21:00, Ndz 9:00–18:00',
      phone: null, website: 'lidl.pl',
      coords: [14.54326, 53.45014],
      rating: 4.3,
      tags: ['lidl', 'supermarket', 'niedziela', 'piekarnia']
    },
    {
      id: 33, cat: 'shop',
      name: 'Lidl',
      addr: 'ul. Z. Krasińskiego 50, Szczecin',
      emoji: '🛒',
      desc: 'Drugi sklep Lidl przy ul. Krasińskiego. Duży parking, szeroki asortyment, czynny w weekendy.',
      hours: 'Pon–Sob 6:00–22:00, Ndz 8:00–20:00',
      phone: null, website: 'lidl.pl',
      coords: [14.54565, 53.45531],
      rating: 4.1,
      tags: ['lidl', 'supermarket', 'parking', 'weekend']
    },

    // ===== ŻABKI =====
    {
      id: 34, cat: 'shop',
      name: 'Żabka',
      addr: 'ul. Bpa Bandurskiego 98, Szczecin',
      emoji: '🐸',
      desc: 'Sklep Żabka przy ul. Bandurskiego. Produkty spożywcze, napoje, przekąski. Czynna do 23:00.',
      hours: 'Pon–Sob 6:00–23:00, Ndz 9:00–21:00',
      phone: null, website: 'zabka.pl',
      coords: [14.56345, 53.45347],
      rating: 3.8,
      tags: ['żabka', 'convenience', 'szybkie zakupy', 'wieczór']
    },
    {
      id: 35, cat: 'shop',
      name: 'Żabka',
      addr: 'ul. Przyjaciół Żołnierza, Szczecin',
      emoji: '🐸',
      desc: 'Żabka przy ul. Przyjaciół Żołnierza. Czynna codziennie, idealna na szybkie zakupy.',
      hours: 'Codziennie 6:00–23:00',
      phone: null, website: 'zabka.pl',
      coords: [14.55444, 53.45387],
      rating: 3.7,
      tags: ['żabka', 'convenience', 'codziennie']
    },
    {
      id: 36, cat: 'shop',
      name: 'Żabka',
      addr: 'ul. Łucznicza, Szczecin',
      emoji: '🐸',
      desc: 'Żabka na ul. Łuczniczej. Blisko centrum dzielnicy, szybkie zakupy, kawa na wynos.',
      hours: 'Pon–Sob 6:00–23:00, Ndz 9:00–22:00',
      phone: null, website: 'zabka.pl',
      coords: [14.54909, 53.45305],
      rating: 3.9,
      tags: ['żabka', 'convenience', 'kawa', 'Łucznicza']
    },
    {
      id: 37, cat: 'shop',
      name: 'Żabka',
      addr: 'ul. Sosnowa 20, Szczecin',
      emoji: '🐸',
      desc: 'Żabka przy ul. Sosnowej. Wygodna lokalizacja dla mieszkańców okolicznych bloków.',
      hours: '6:00–23:00',
      phone: null, website: 'zabka.pl',
      coords: [14.54612, 53.45190],
      rating: 3.8,
      tags: ['żabka', 'convenience', 'osiedle']
    },

    // ===== RESTAURACJE / FAST FOOD =====
    {
      id: 38, cat: 'food',
      name: "McDonald's",
      addr: 'ul. Przyjaciół Żołnierza 6, Szczecin',
      emoji: '🍔',
      desc: "Restauracja McDonald's na Niebuszewie. Burgery, frytki, kawy McCafé. Drive-thru i sala restauracyjna.",
      hours: 'Codziennie 7:00–24:00',
      phone: null, website: 'mcdonalds.pl',
      coords: [14.56135, 53.45382],
      rating: 3.9,
      tags: ['mcdonalds', 'fast food', 'burgery', 'drive-thru']
    },

    // ===== USŁUGI =====
    {
      id: 39, cat: 'service',
      name: 'Gabinet Stomatologiczny',
      addr: 'ul. Łucznicza 76A, Szczecin',
      emoji: '🦷',
      desc: 'Gabinet stomatologiczny na ul. Łuczniczej. Leczenie, profilaktyka, wybielanie zębów. Rejestracja telefoniczna.',
      hours: 'Pon–Sob 9:00–19:00',
      phone: null, website: null,
      coords: [14.54984, 53.45311],
      rating: 4.4,
      tags: ['dentysta', 'stomatolog', 'zęby', 'Łucznicza']
    },

    // ===== SKLEPY SPECJALISTYCZNE =====
    {
      id: 40, cat: 'shop',
      name: 'Kwiaciarnia',
      addr: 'ul. Jarogniewa, Szczecin',
      emoji: '🌸',
      desc: 'Kwiaciarnia na Niebuszewie. Świeże kwiaty, bukiety, kompozycje na każdą okazję. Czynna w niedzielę.',
      hours: 'Pon–Pt 9:00–19:00, Sob 9:00–18:00, Ndz 10:00–15:00',
      phone: null, website: null,
      coords: [14.55831, 53.45287],
      rating: 4.6,
      tags: ['kwiaciarnia', 'kwiaty', 'bukiety', 'prezenty']
    },

    // ===== CUKIERNIE =====
    {
      id: 41, cat: 'food',
      name: 'Cukiernia Domowa',
      addr: 'ul. Księżnej Zofii, Szczecin',
      emoji: '🍰',
      desc: 'Cukiernia Domowa — torty, ciasta, wyroby cukiernicze na zamówienie. Domowe smaki, tradycyjne receptury.',
      hours: 'Wt–Pt 9:00–17:30, Sob 9:00–16:00, Ndz 9:00–15:00',
      phone: null, website: null,
      coords: [14.55866, 53.45198],
      rating: 4.7,
      tags: ['cukiernia', 'torty', 'ciasta', 'domowe']
    },
    {
      id: 42, cat: 'food',
      name: 'Cukiernia Malek',
      addr: 'ul. Przyjaciół Żołnierza, Szczecin',
      emoji: '🍰',
      desc: 'Cukiernia Malek — tradycyjna cukiernia z długą historią. Pyszne torty, praliny i wyroby czekoladowe.',
      hours: 'Wt–Pt 9:30–18:00, Sob 9:30–15:00, Ndz 10:00–14:00',
      phone: null, website: null,
      coords: [14.56287, 53.45356],
      rating: 4.8,
      tags: ['cukiernia', 'torty', 'czekolada', 'tradycja']
    },

    // ===== BIBLIOTEKA =====
    {
      id: 43, cat: 'edu',
      name: 'Biblioteka Publiczna — Filia nr 13',
      addr: 'ul. Księżnej Zofii, Szczecin',
      emoji: '📚',
      desc: 'Miejska Biblioteka Publiczna w Szczecinie — Filia nr 13 na Niebuszewie. Wypożyczalnia książek, czytelnia, dostęp do internetu.',
      hours: 'Pon–Pt 8:00–20:00',
      phone: null, website: 'ksiaznica.szczecin.pl',
      coords: [14.55860, 53.45174],
      rating: 4.5,
      tags: ['biblioteka', 'książki', 'czytelnia', 'internet', 'bezpłatne']
    },

    // ===== APTEKA DBAM O ZDROWIE (Thugutta) =====
    {
      id: 44, cat: 'service',
      name: 'Apteka Dbam o Zdrowie',
      addr: 'ul. S. Thugutta 2a, Szczecin',
      emoji: '💊',
      desc: 'Apteka Dbam o Zdrowie przy ul. Thugutta. Leki, suplementy, kosmetyki. Czynna w soboty.',
      hours: 'Pon–Pt 8:00–20:00, Sob 9:00–15:00',
      phone: null, website: 'dbamozdrowie.pl',
      coords: [14.55630, 53.46098],
      rating: 4.0,
      tags: ['apteka', 'leki', 'zdrowie', 'Thugutta']
    },

    // ===== ŻABKA RAPACKIEGO =====
    {
      id: 45, cat: 'shop',
      name: 'Żabka',
      addr: 'ul. M. Rapackiego, Szczecin',
      emoji: '🐸',
      desc: 'Żabka przy ul. Rapackiego. Czynna codziennie od 6:00. Produkty spożywcze, napoje, przekąski.',
      hours: 'Codziennie 6:00–23:00',
      phone: null, website: 'zabka.pl',
      coords: [14.54785, 53.45000],
      rating: 3.8,
      tags: ['żabka', 'convenience', 'Rapackiego']
    },

    // ===== PUB KLATKA — ŁUCZNICZA 39 =====
    {
      id: 46, cat: 'food',
      name: 'Pub Klatka',
      addr: 'ul. Łucznicza 39, Szczecin',
      emoji: '🍻',
      desc: 'Wpadaj tam na piwo! Legendarne osiedlowe centrum integracji na klatce schodowej pod 39. Oficjalny napój to zimny browar z pianką na dwa palce, a nieoficjalny sport narodowy to debaty o tym, kto znowu nie zgasił światła w piwnicy i dlaczego dziki na Niebuszewie mają lepszy GPS niż kurierzy z paczkami.',
      hours: 'Otwarte: 16:00–23:00 (lub dopóki sąsiad z góry nie zapuka w rurę od kaloryfera)',
      phone: '500-KLATKA', website: null,
      coords: [14.54752, 53.45405],
      rating: 5.0,
      tags: ['pub', 'piwo', 'Łucznicza 39', 'integracja', 'klatka', 'humor', 'lokalne', 'piwko']
    },

    // ===== ŁAWECZKA FILOZOFÓW — PARK KADZIAKA =====
    {
      id: 47, cat: 'park',
      name: 'Ławeczka Filozofów',
      addr: 'Park Antoniego Kadziaka, Niebuszewo',
      emoji: '🧐',
      desc: 'Kultowa ławka w cieniu starych dębów. Miejsce debat osiedlowych myślicieli o sensie życia, taktyce Pogoni Szczecin i przyczynach opóźnień linii 89. Podobno jeśli usiądziesz tu na 5 minut, rozwiążesz każdy problem.',
      hours: 'Czynne całą dobę (najgorętsze debaty: 14:00–21:00)',
      phone: null, website: null,
      coords: [14.54420, 53.45140],
      rating: 4.9,
      tags: ['park', 'filozofia', 'relaks', 'Park Kadziaka', 'debata', 'legenda', 'humor']
    },

    // ===== MUREK PRZY SKLEPIE ANKA =====
    {
      id: 48, cat: 'park',
      name: 'Osiedlowy Murek przy Sklepie Anka',
      addr: 'ul. Łucznicza / okolice sklepu Anka, Niebuszewo',
      emoji: '🧱',
      desc: 'Kultowy nieformalny klub dyskusyjny pod gołym niebem. Stali bywalcy zbierają się tu niezależnie od pogody, pory roku i stanu portfela. Tematyka debat: Pogoń Szczecin, drożyzna w Społem i czemu autobus 89 znowu się spóźnił. Wstęp wolny, klimat obowiązkowy.',
      hours: 'Całą dobę (szczyt aktywności: 10:00–20:00)',
      phone: null, website: null,
      coords: [14.5500, 53.4538],
      rating: 4.5,
      tags: ['murek', 'Anka', 'miejscowi', 'lokalny', 'spotkania', 'humor', 'Niebuszewo']
    },

    // ===== PRZYSTAŃ PIJACKA (WYTRZEŹWIAŁKA) — LENARTOWICZA 21 =====
    {
      id: 49, cat: 'food',
      name: 'Przystań Pijacka „Wytrzeźwiałka”',
      addr: 'ul. Teofila Lenartowicza 21, Szczecin',
      emoji: '🍺',
      desc: 'Legendarne osiedlowe miejsce spotkań i nieformalna „przystań wytrzeźwień”. Wszyscy lokalni koneserzy trunków i amatorzy głębokich nocnych rozmów zbiegają się właśnie tutaj, by wspólnie debatować o życiu, dzielić się kapslami i łapać równowagę.',
      hours: 'Czynne 24/7 (szczyt frekwencji o każdej pełnej godzinie)',
      phone: null, website: null,
      coords: [14.54205, 53.44792],
      rating: 5.0,
      tags: ['wytrzeźwiałka', 'przystań', 'piwo', 'Lenartowicza', 'Lenartowicza 21', 'spotkania', 'klimat', 'humor', 'lokalne']
    },

    // ===== DWORZEC SZCZECIN NIEBUSZEWO & WĘZEŁ SKM =====
    {
      id: 50, cat: 'service',
      name: 'Dworzec Szczecin Niebuszewo & Węzeł SKM',
      addr: 'ul. Elizy Orzeszkowej 28 / Kolejowa, Szczecin',
      emoji: '🚉',
      desc: 'Historyczny dworzec kolejowy (dawniej Stettin-Zabelsdorf) z 1898 roku, zrewitalizowany jako kluczowy węzeł Szczecińskiej Kolei Metropolitalnej (SKM). Klimatyczna architektura kolejowa i bezpośrednie połączenie z całym Szczecinem i Policami.',
      hours: 'Czynne 24/7 (kursy pociągów i perony)',
      phone: null, website: 'skm.szczecin.pl',
      coords: [14.55780, 53.45420],
      rating: 4.8,
      tags: ['dworzec', 'skm', 'kolej', 'pociąg', 'Niebuszewo', 'zabelsdorf', 'historia', 'komunikacja', 'transport']
    },

    // ===== ORLIK & MURAL KIBICÓW POGONI SZCZECIN =====
    {
      id: 51, cat: 'sport',
      name: 'Orlik & Mural Kibiców Pogoni Szczecin',
      addr: 'ul. Łucznicza / Komuny Paryskiej, Szczecin',
      emoji: '⚽',
      desc: 'Nowoczesny kompleks boisk ze sztuczną nawierzchnią oraz okazałym muralem w barwach Dumy Pomorza. Serce sportowego życia młodzieży z Łuczniczej i miejsce zbiórek kibiców MKS Pogoń Szczecin.',
      hours: 'Codziennie 08:00–21:30',
      phone: null, website: null,
      coords: [14.54920, 53.45180],
      rating: 4.9,
      tags: ['sport', 'orlik', 'boisko', 'pogoń', 'piłka', 'mural', 'Łucznicza', 'kibice', 'legenda']
    },

    // ===== TRADYCYJNY PASZTECIK SPOŁEM „NIEBUSZEWO” =====
    {
      id: 52, cat: 'food',
      name: 'Tradycyjny Pasztecik i Barszcz Społem „Niebuszewo”',
      addr: 'ul. Elizy Orzeszkowej 14 / Kołłątaja, Szczecin',
      emoji: '🥟',
      desc: 'Kultowy szczeciński przysmak wpisany na Listę Produktów Tradycyjnych Ministerstwa Rolnictwa. Chrupiące ciasto drożdżowe wypiekane na bieżąco, nadziewane aromatycznym farszem mięsnym lub pieczarkowym i podawane z gorącym barszczem czerwonym.',
      hours: 'Pon–Pt 09:00–18:00, Sob 09:00–14:00',
      phone: null, website: null,
      coords: [14.54820, 53.44980],
      rating: 4.9,
      tags: ['pasztecik', 'barszcz', 'jedzenie', 'tradycja', 'klasyk', 'społem', 'gastronomia', 'Szczecin', 'klimat']
    },

    // ===== PĘTLA KOŁŁĄTAJA / RONDO GIEDROYCIA =====
    {
      id: 53, cat: 'service',
      name: 'Pętla Tramwajowa i Węzeł Kołłątaja',
      addr: 'al. Wyzwolenia / ul. Hugona Kołłątaja, Szczecin',
      emoji: '🚋',
      desc: 'Główna arteria przesiadkowa u wrót Niebuszewa i Bolinka. Pętla tramwajowa linii 2, 3, 10, 12 oraz kluczowych autobusów dziennych (w tym linia 89) i nocnych. Stąd dojedziesz bezpośrednio pod Stadion Miejski im. Floriana Krygiera.',
      hours: 'Czynne 24/7 (kursy dzienne i nocne)',
      phone: null, website: 'zditm.szczecin.pl',
      coords: [14.54480, 53.44720],
      rating: 4.7,
      tags: ['tramwaj', 'autobus', 'kołłątaja', 'giedroyć', 'zditm', 'komunikacja', 'transport', 'przesiadka', 'skm']
    },
    {
      id: 54, cat: 'edu',
      name: 'Muzeum Techniki i Komunikacji — Zajezdnia Sztuki',
      addr: 'ul. Niemierzyńska 18A, Szczecin',
      emoji: '🚋',
      desc: 'Zabytkowa zajezdnia tramwajowa z 1912 roku przekształcona w jedno z największych muzeów techniki w Polsce. Kolekcja kultowych szczecińskich motocykli Junak, zabytkowych tramwajów, pojazdów Stoewer oraz prototypów polskiej motoryzacji.',
      hours: 'Wt–Ndz 10:00–18:00 (Czw bezpłatny)',
      phone: '91 45 99 200', website: 'muzeumtechniki.eu',
      coords: [14.53750, 53.45040],
      rating: 4.9,
      tags: ['muzeum', 'tramwaj', 'junak', 'technika', 'zabytki', 'Niemierzyńska', 'historia', 'kultura', 'edukacja']
    },
    {
      id: 55, cat: 'park',
      name: 'Park Noakowskiego & Skwer Pawłowskiego',
      addr: 'ul. Stanisława Noakowskiego, Szczecin',
      emoji: '🌳',
      desc: 'Urokliwy, zaciszny park i skwer im. Waleriana Pawłowskiego na styku Niebuszewa i Bolinka. Wiekowy drzewostan (platany, dęby), ogrodzony wybieg dla psów, strefa sensoryczna i nowoczesny plac zabaw.',
      hours: 'Czynne całą dobę',
      phone: null, website: null,
      coords: [14.54120, 53.44910],
      rating: 4.7,
      tags: ['park', 'zieleń', 'drzewa', 'pieski', 'plac zabaw', 'Noakowskiego', 'relaks', 'cień']
    },
    {
      id: 56, cat: 'food',
      name: 'Piekarnia & Cukiernia Rzemieślnicza „Niemierzyn”',
      addr: 'ul. Niemierzyńska 24, Szczecin',
      emoji: '🥐',
      desc: 'Klimatyczna piekarnia rzemieślnicza słynąca z tradycyjnego pieczywa na zakwasie orkiszowym i żytnim oraz świeżych drożdżówek ze szczecińskimi owocami. Do tego lokalnie palona kawa specialty.',
      hours: 'Pon–Pt 06:30–18:00, Sob 07:00–14:00',
      phone: null, website: null,
      coords: [14.53980, 53.45010],
      rating: 4.8,
      tags: ['piekarnia', 'kawiarnia', 'chleb', 'zakwas', 'drożdżówki', 'kawa', 'śniadanie', 'rzemiosło']
    },
    {
      id: 57, cat: 'edu',
      name: 'Willa Karkutsch & Przedwojenne Niebuszewo',
      addr: 'ul. Niemierzyńska / Długosza, Szczecin',
      emoji: '🏛️',
      desc: 'Zabytkowa rezydencja i zespół historycznych kamienic z przełomu XIX i XX wieku. Świadectwo industrialnego i mieszczańskiego rozwoju Niebuszewa, z zachowanymi detalami sztukatorskimi i kutymi bramami.',
      hours: 'Widok z zewnątrz całodobowo',
      phone: null, website: null,
      coords: [14.54280, 53.44850],
      rating: 4.6,
      tags: ['architektura', 'zabytki', 'kamienice', 'historia', 'willa', 'szczecin', 'spacer']
    },
    {
      id: 58, cat: 'edu',
      name: 'Dawny Ośrodek Kultury Żydowskiej & Dom Pereca',
      addr: 'ul. Juliana Ursyna Niemcewicza 2 / Długosza, Szczecin',
      emoji: '📜',
      desc: 'Kluczowe miejsce powojennej historii Niebuszewa (lata 1945–1950), gdy dzielnica stanowiła unikalne w skali Europy centrum osadnictwa żydowskiego. Działały tu szkoły, spółdzielnie pracy, teatr oraz dom kultury im. I. L. Pereca.',
      hours: 'Tablica pamiątkowa i widok całodobowo',
      phone: null, website: null,
      coords: [14.54910, 53.44880],
      rating: 4.8,
      tags: ['historia', 'perec', 'niemcewicza', 'kultura', 'dziedzictwo', 'zabytki', 'niebuszewo', 'pamięć']
    },
    {
      id: 59, cat: 'park',
      name: 'Zabytkowy Cmentarz Żydowski & Miejsce Pamięci',
      addr: 'ul. Ojca Beyzyma / ul. Wendeńska, Szczecin',
      emoji: '🌿',
      desc: 'Zabytkowa nekropolia założona w 1821 roku. Oaza ciszy i zieleni pośród zabytkowego starodrzewu dębów i buków, z zachowanymi macewami i lapidarium upamiętniającym dawnych mieszkańców Szczecina.',
      hours: 'Otwarte w ciągu dnia (wstęp wolny)',
      phone: null, website: null,
      coords: [14.53610, 53.44680],
      rating: 4.7,
      tags: ['cmentarz', 'lapidarium', 'historia', 'zabytki', 'pamięć', 'drzewa', 'cisza', 'spacer']
    },
    {
      id: 60, cat: 'edu',
      name: 'Zabytkowa Kamienica z Zegarem Słonecznym',
      addr: 'ul. Hugona Kołłątaja 31 / Kadłubka, Szczecin',
      emoji: '☀️',
      desc: 'Wspaniała secesyjna kamienica z 1904 roku z unikatowym zegarem słonecznym na elewacji frontowej oraz bogatą sztukaterią przedstawiającą motywy roślinne i alegoryczne. Perła architektury u wrót Niebuszewa.',
      hours: 'Widok z ulicy całodobowo',
      phone: null, website: null,
      coords: [14.54650, 53.44810],
      rating: 4.9,
      tags: ['kamienica', 'zegar', 'architektura', 'secesja', 'kołłątaja', 'sztuka', 'detal', 'zabytek']
    },
    {
      id: 61, cat: 'park',
      name: 'Dolina Potoku Osówka & Kładka Niemierzyńska',
      addr: 'Dolina Potoku Osówka / Park Kasprowicza, Szczecin',
      emoji: '🦆',
      desc: 'Malowniczy przełom potoku Osówka z drewnianymi pomostami i kładkami widokowymi. Bogata flora nadrzeczna, ostoja dzikiego ptactwa (kaczki krzyżówki, pliszki górskie) i wspaniałe miejsce na regenerujący spacer w otoczeniu szumu wody.',
      hours: 'Dostępne całodobowo',
      phone: null, website: null,
      coords: [14.53210, 53.45180],
      rating: 4.9,
      tags: ['potok', 'osówka', 'przyroda', 'woda', 'kładka', 'ptaki', 'spacer', 'relaks', 'park']
    },
    {
      id: 62, cat: 'park',
      name: 'Wzgórze Widokowe przy ul. Przyjaciół Żołnierza',
      addr: 'ul. Przyjaciół Żołnierza / ul. Obotrycka, Szczecin',
      emoji: '🌄',
      desc: 'Naturalne wzniesienie morenowe oferujące rozległą panoramę dachów Niebuszewa, wież kościołów i stoczniowych żurawi nad Odrą. Idealny punkt obserwacyjny o zachodzie słońca z ławkami widokowymi.',
      hours: 'Dostępne całodobowo',
      phone: null, website: null,
      coords: [14.56680, 53.45520],
      rating: 4.8,
      tags: ['punktwidokowy', 'panorama', 'wzgórze', 'zachódsłońca', 'przyjaciółżołnierza', 'foto', 'krajobraz']
    },
    {
      id: 63, cat: 'park',
      name: 'Ogród Społeczny & Sąsiedzki Zakątek Łucznicza',
      addr: 'ul. Łucznicza / ul. Tarczowa, Szczecin',
      emoji: '🌻',
      desc: 'Oddolna inicjatywa sąsiedzka mieszkańców Łuczniczej i Tarczowej. Skrzynie z ziołami i kwiatami miododajnymi, hotel dla owadów, budki lęgowe dla jerzyków oraz zacieniona pergola z ławkami do wymiany książek (bookcrossing).',
      hours: 'Dostępne całodobowo',
      phone: null, website: null,
      coords: [14.54890, 53.45330],
      rating: 4.9,
      tags: ['ogród', 'społeczny', 'łucznicza', 'tarczowa', 'zioła', 'bookcrossing', 'sąsiedzi', 'ekologia']
    }
  ],

  // ===== TRASY =====
  routes: [
    {
      id: 1,
      name: 'Spacer po Łuczniczej',
      emoji: '🚶',
      type: 'walk',
      color: '#6c63ff',
      distance: '1.4 km',
      distanceNum: 1.4,
      time: '18 min',
      timeMin: 18,
      difficulty: 'Łatwa',
      difficultyLevel: 1,
      calories: 70,
      terrain: 'Chodnik',
      bestTime: 'Rano',
      tags: ['poranny', 'usługi', 'spokojny', 'Łucznicza'],
      desc: 'Spacer wzdłuż ul. Łuczniczej — głównej arterii Niebuszewo. Mijasz aptekę, pocztę i park Kadziaka. Idealna trasa na poranny spacer.',
      highlights: ['Apteka Fiołkowa', 'Urząd Pocztowy', 'Park Kadziaka'],
      stops: [
        { name: 'Start: Apteka Fiołkowa', addr: 'ul. Łucznicza', emoji: '💊' },
        { name: 'Urząd Pocztowy Szczecin 41', addr: 'ul. Łucznicza', emoji: '📮' },
        { name: 'Park Antoniego Kadziaka', addr: 'Niebuszewo', emoji: '🌳' },
        { name: 'Siłownia Plenerowa', addr: 'Park Kadziaka', emoji: '💪' },
        { name: 'Meta: Boisko Sportowe', addr: 'ul. Łucznicza', emoji: '⚽' }
      ],
      coords: [
        [14.54773, 53.45399],
        [14.54794, 53.45296],
        [14.54365, 53.45100],
        [14.54400, 53.45080],
        [14.55100, 53.45200]
      ]
    },
    {
      id: 2,
      name: 'Trasa Rodzinna Niebuszewo',
      emoji: '👨‍👩‍👧',
      type: 'walk',
      color: '#43e97b',
      distance: '2.2 km',
      distanceNum: 2.2,
      time: '30 min',
      timeMin: 30,
      difficulty: 'Łatwa',
      difficultyLevel: 1,
      calories: 110,
      terrain: 'Chodnik + park',
      bestTime: 'Popołudnie',
      tags: ['rodzina', 'dzieci', 'park', 'pętla'],
      desc: 'Trasa idealna dla rodzin z dziećmi. Prowadzi przez Park Kadziaka, Park Bartoszewskiego i okolice szkół. Wiele ławek po drodze.',
      highlights: ['Park Kadziaka', 'Park Bartoszewskiego', 'Przedszkole Przyjaciele'],
      stops: [
        { name: 'Start: Park Kadziaka', addr: 'Niebuszewo', emoji: '🌳' },
        { name: 'Przedszkole Przyjaciele', addr: 'ul. Ks. Warcisława I', emoji: '🧒' },
        { name: 'Apteka Puls', addr: 'ul. Ks. Warcisława I 27a', emoji: '💊' },
        { name: 'Park Bartoszewskiego', addr: 'Niebuszewo', emoji: '🌳' },
        { name: 'Meta: Park Kadziaka', addr: 'Niebuszewo', emoji: '🌳' }
      ],
      coords: [
        [14.54365, 53.45100],
        [14.55053, 53.45077],
        [14.54989, 53.45367],
        [14.56531, 53.45059],
        [14.54365, 53.45100]
      ]
    },
    {
      id: 3,
      name: 'Trasa Gastronomiczna',
      emoji: '🍽️',
      type: 'walk',
      color: '#ffd93d',
      distance: '1.6 km',
      distanceNum: 1.6,
      time: '22 min',
      timeMin: 22,
      difficulty: 'Łatwa',
      difficultyLevel: 1,
      calories: 80,
      terrain: 'Chodnik',
      bestTime: 'Południe',
      tags: ['jedzenie', 'smaki', 'piekarnia', 'pizza'],
      desc: 'Trasa dla smakoszy — od piekarni przez kebab do pizzerii. Poznaj smaki Niebuszewo przy ul. Przyjaciół Żołnierza.',
      highlights: ['Piekarnia Genial', 'Bafra Kebab', 'Pizza Hut'],
      stops: [
        { name: 'Start: Piekarnia Genial', addr: 'ul. Przyjaciół Żołnierza', emoji: '🥖' },
        { name: 'Bafra Kebab', addr: 'ul. Przyjaciół Żołnierza', emoji: '🥙' },
        { name: 'Pizza Hut', addr: 'ul. Przyjaciół Żołnierza 128a', emoji: '🍕' },
        { name: 'Piekarnia Arion Polbak', addr: 'ul. Przyjaciół Żołnierza 128a', emoji: '🥖' },
        { name: 'Meta: Bank Millennium', addr: 'ul. Przyjaciół Żołnierza 128a', emoji: '🏦' }
      ],
      coords: [
        [14.55135, 53.45471],
        [14.55156, 53.45482],
        [14.55190, 53.45484],
        [14.55198, 53.45470],
        [14.55185, 53.45465]
      ]
    },
    {
      id: 4,
      name: 'Trasa Rowerowa Niebuszewo',
      emoji: '🚴',
      type: 'bike',
      color: '#ff6b6b',
      distance: '4.8 km',
      distanceNum: 4.8,
      time: '22 min',
      timeMin: 22,
      difficulty: 'Średnia',
      difficultyLevel: 2,
      calories: 144,
      terrain: 'Chodnik + ulica',
      bestTime: 'Wieczór',
      tags: ['rower', 'aktywny', 'szybki', 'obwód'],
      desc: 'Dynamiczna trasa rowerowa okrążająca całe Niebuszewo. Przez parki, główne ulice i spokojne boczne drogi.',
      highlights: ['Park Kadziaka', 'ul. Przyjaciół Żołnierza', 'Park Bartoszewskiego'],
      stops: [
        { name: 'Start: Park Kadziaka', addr: 'Niebuszewo', emoji: '🌳' },
        { name: 'Boisko Sportowe', addr: 'ul. Łucznicza', emoji: '⚽' },
        { name: 'ul. Przyjaciół Żołnierza', addr: 'Niebuszewo', emoji: '🚴' },
        { name: 'Park Bartoszewskiego', addr: 'Niebuszewo', emoji: '🌳' },
        { name: 'Kościół Miłosierdzia Bożego', addr: 'ul. Przyjaciół Żołnierza 45', emoji: '⛪' },
        { name: 'Meta: Park Kadziaka', addr: 'Niebuszewo', emoji: '🌳' }
      ],
      coords: [
        [14.54365, 53.45100],
        [14.55100, 53.45200],
        [14.55190, 53.45484],
        [14.56531, 53.45059],
        [14.55687, 53.45350],
        [14.54365, 53.45100]
      ]
    },
    {
      id: 5,
      name: 'Trasa Biegowa Niebuszewo',
      emoji: '🏃',
      type: 'run',
      color: '#ff6584',
      distance: '3.0 km',
      distanceNum: 3.0,
      time: '17 min',
      timeMin: 17,
      difficulty: 'Średnia',
      difficultyLevel: 2,
      calories: 240,
      terrain: 'Chodnik + park',
      bestTime: 'Rano / Wieczór',
      tags: ['bieg', 'sport', 'kondycja', 'pętla'],
      desc: 'Popularna trasa biegowa przez parki Niebuszewo. Płaska, bezpieczna pętla przez Park Kadziaka i okolice. Idealna do joggingu.',
      highlights: ['Park Kadziaka', 'Siłownia plenerowa', 'Alejki parkowe'],
      stops: [
        { name: 'Start: Boisko Sportowe', addr: 'ul. Łucznicza', emoji: '⚽' },
        { name: 'Siłownia Plenerowa', addr: 'Park Kadziaka', emoji: '💪' },
        { name: 'Park Kadziaka', addr: 'Niebuszewo', emoji: '🌳' },
        { name: 'Park Bartoszewskiego', addr: 'Niebuszewo', emoji: '🌳' },
        { name: 'Meta: Boisko Sportowe', addr: 'ul. Łucznicza', emoji: '⚽' }
      ],
      coords: [
        [14.55100, 53.45200],
        [14.54400, 53.45080],
        [14.54365, 53.45100],
        [14.56531, 53.45059],
        [14.55100, 53.45200]
      ]
    },
    {
      id: 6,
      name: 'Szlak Historyczny Niebuszewo',
      emoji: '🏛️',
      type: 'walk',
      color: '#a29bfe',
      distance: '2.6 km',
      distanceNum: 2.6,
      time: '40 min',
      timeMin: 40,
      difficulty: 'Łatwa',
      difficultyLevel: 1,
      calories: 130,
      terrain: 'Chodnik',
      bestTime: 'Dowolna pora',
      tags: ['historia', 'kultura', 'kościoły', 'architektura'],
      desc: 'Spacer śladami historii Niebuszewo. Zabytkowe kościoły, przedwojenna architektura i miejsca pamięci dzielnicy.',
      highlights: ['Kościół pw. Miłosierdzia Bożego', 'Kościół pw. św. Mikołaja', 'Zabytkowa zabudowa'],
      stops: [
        { name: 'Start: Kościół Miłosierdzia Bożego', addr: 'ul. Przyjaciół Żołnierza 45', emoji: '⛪' },
        { name: 'Bank Pekao', addr: 'ul. Bpa Bandurskiego 98', emoji: '🏦' },
        { name: 'Apteka Dbam o Zdrowie', addr: 'ul. Bpa Bandurskiego 98', emoji: '💊' },
        { name: 'Kościół pw. św. Mikołaja', addr: 'ul. M. Golisza', emoji: '⛪' },
        { name: 'SP nr 18 im. Józefa Bema', addr: 'ul. Komuny Paryskiej 20', emoji: '🏫' },
        { name: 'Meta: Park Bartoszewskiego', addr: 'Niebuszewo', emoji: '🌳' }
      ],
      coords: [
        [14.55687, 53.45350],
        [14.56339, 53.45348],
        [14.56355, 53.45365],
        [14.56807, 53.45297],
        [14.56575, 53.45356],
        [14.56531, 53.45059]
      ]
    },
    {
      id: 7,
      name: 'Szlak Przemarszu Dzików',
      emoji: '🐗',
      type: 'walk',
      color: '#e67e22',
      distance: '1.9 km',
      distanceNum: 1.9,
      time: '25 min',
      timeMin: 25,
      difficulty: 'Średnia (uwaga na chrumkanie)',
      difficultyLevel: 2,
      calories: 110,
      terrain: 'Chodnik i parkowe alejki',
      bestTime: 'Zmierzch (19:00–22:00)',
      tags: ['dziki', 'przygoda', 'humor', 'park', 'Niebuszewo', 'legenda'],
      desc: 'Kultowa trasa spacerowa omijająca nocne żerowiska niebuszewskich dzików. Przewodnik po krzakach, gdzie chrumkanie słychać głośniej niż dzwonki tramwajów, z bezpieczną metą przy Pubie Klatka.',
      highlights: ['Strefa Żołędzi w Parku Kadziaka', 'Krzaki przy ul. Tarczowej', 'Ławeczka Filozofów', 'Bezpieczna Przystań: Pub Klatka'],
      stops: [
        { name: 'Start: Park Antoniego Kadziaka', addr: 'ul. Łucznicza', emoji: '🌳' },
        { name: 'Ławeczka Filozofów (narada strategiczna)', addr: 'Park Kadziaka', emoji: '🧐' },
        { name: 'Skwer przy Tarczowej (strefa podsłuchu chrumkania)', addr: 'ul. Tarczowa', emoji: '🐗' },
        { name: 'Meta: Pub Klatka (schronienie i zimne piwo)', addr: 'ul. Łucznicza 39', emoji: '🍻' }
      ],
      coords: [
        [14.54365, 53.45100],
        [14.54420, 53.45140],
        [14.54794, 53.45296],
        [14.55100, 53.45200],
        [14.54752, 53.45405]
      ]
    },
    {
      id: 8,
      name: 'Klimaty i Legendy Niebuszewa',
      emoji: '🍻',
      type: 'walk',
      color: '#f39c12',
      distance: '2.8 km',
      distanceNum: 2.8,
      time: '38 min',
      timeMin: 38,
      difficulty: 'Łatwa / Degustacyjna',
      difficultyLevel: 1,
      calories: 145,
      terrain: 'Chodnik i parkowe alejki',
      bestTime: 'Popołudnie i wieczór (16:00–21:00)',
      tags: ['klimat', 'legendy', 'piwo', 'murek', 'wytrzeźwiałka', 'klatka', 'humor', 'spacer'],
      desc: 'Niezapomniana osiedlowa eskapada szlakiem nieformalnych instytucji kultury towarzyskiej: od Murka przy sklepie Anka, przez Pub Klatka i parkowe ławki Kadziaka, aż po Przystań Pijacką „Wytrzeźwiałka” przy Lenartowicza 21.',
      highlights: ['Osiedlowy Murek przy Ance', 'Pub Klatka pod 39', 'Ławeczki Parku Kadziaka', 'Pasztecik Społem', 'Przystań Pijacka Wytrzeźwiałka'],
      stops: [
        { name: 'Start: Osiedlowy Murek przy Sklepie Anka', addr: 'ul. Łucznicza', emoji: '🧱' },
        { name: 'Pub Klatka (narada osiedlowa)', addr: 'ul. Łucznicza 39/43', emoji: '🍻' },
        { name: 'Park Antoniego Kadziaka', addr: 'Niebuszewo', emoji: '🌳' },
        { name: 'Pasztecik Społem Kołłątaja', addr: 'ul. Orzeszkowej 14', emoji: '🥟' },
        { name: 'Meta: Przystań Pijacka „Wytrzeźwiałka”', addr: 'ul. Lenartowicza 21', emoji: '🍺' }
      ],
      coords: [
        [14.5500, 53.4538],
        [14.54752, 53.45405],
        [14.54365, 53.45100],
        [14.54820, 53.44980],
        [14.54205, 53.44792]
      ]
    },
    {
      id: 9,
      name: 'Granatowo-Bordowy Szlak Dumy Pomorza',
      emoji: '🛡️',
      type: 'walk',
      color: '#002D62',
      distance: '3.2 km',
      distanceNum: 3.2,
      time: '42 min',
      timeMin: 42,
      difficulty: 'Średnia',
      difficultyLevel: 2,
      calories: 190,
      terrain: 'Chodnik',
      bestTime: 'Dzień meczowy / Przedpołudnie',
      tags: ['pogoń', 'sport', 'mural', 'dumapomorza', 'piłka', 'stadion', 'szlak'],
      desc: 'Trasa dla każdego fana Pogoni Szczecin na Niebuszewie. Łączy osiedlowy orlik z muralem MKS-u, punkty zbornego dopingu, Stację SKM Niebuszewo oraz pętlę Kołłątaja, skąd tramwaj zabiera kibiców prosto pod bramy stadionu im. Floriana Krygiera.',
      highlights: ['Mural Pogoni na Orliku Łucznicza', 'Stacja SKM Szczecin Niebuszewo', 'Tradycyjny Pasztecik Niebuszewo', 'Pętla Kołłątaja — Tramwaj na Stadion'],
      stops: [
        { name: 'Start: Orlik & Mural Pogoni Szczecin', addr: 'ul. Łucznicza', emoji: '⚽' },
        { name: 'Stacja SKM Szczecin Niebuszewo', addr: 'ul. Orzeszkowej 28', emoji: '🚉' },
        { name: 'Tradycyjny Pasztecik Niebuszewo', addr: 'ul. Orzeszkowej 14', emoji: '🥟' },
        { name: 'Meta: Pętla Kołłątaja (przystanek na Stadion)', addr: 'al. Wyzwolenia', emoji: '🚋' }
      ],
      coords: [
        [14.54920, 53.45180],
        [14.55100, 53.45200],
        [14.55780, 53.45420],
        [14.54820, 53.44980],
        [14.54480, 53.44720]
      ]
    },
    {
      id: 10,
      name: 'Królowie Torów i Rzemiosła — Szlak Niemierzyński',
      emoji: '🚋',
      type: 'walk',
      color: '#9E002B',
      distance: '2.7 km',
      distanceNum: 2.7,
      time: '36 min',
      timeMin: 36,
      difficulty: 'Łatwa',
      difficultyLevel: 1,
      calories: 160,
      terrain: 'Chodnik + alejki parkowe',
      bestTime: 'Przedpołudnie / Popołudnie (Wt–Ndz)',
      tags: ['niemierzyn', 'tramwaje', 'muzeum', 'park', 'piekarnia', 'architektura', 'spacer'],
      desc: 'Fascynująca wyprawa od Pętli Kołłątaja przez zielone alejki Parku Noakowskiego do historycznej Zajezdni Sztuki (Muzeum Techniki). W programie legendy szczecińskich tramwajów, motocykle Junak, zabytkowe kamienice i świeże wypieki rzemieślnicze.',
      highlights: [
        'Węzeł Kołłątaja',
        'Park Noakowskiego & Skwer Pawłowskiego',
        'Muzeum Techniki i Komunikacji (Zajezdnia)',
        'Piekarnia Rzemieślnicza Niemierzyn',
        'Willa Karkutsch & Zabytkowe Kamienice'
      ],
      stops: [
        { name: 'Start: Węzeł Kołłątaja', addr: 'al. Wyzwolenia / Kołłątaja', emoji: '🚋' },
        { name: 'Park Noakowskiego', addr: 'ul. Noakowskiego', emoji: '🌳' },
        { name: 'Muzeum Techniki i Komunikacji', addr: 'ul. Niemierzyńska 18A', emoji: '🏛️' },
        { name: 'Piekarnia Rzemieślnicza Niemierzyn', addr: 'ul. Niemierzyńska 24', emoji: '🥐' },
        { name: 'Meta: Willa Karkutsch & Kamienice', addr: 'ul. Niemierzyńska / Długosza', emoji: '🏛️' }
      ],
      coords: [
        [14.54480, 53.44720],
        [14.54120, 53.44910],
        [14.53750, 53.45040],
        [14.53980, 53.45010],
        [14.54280, 53.44850]
      ]
    },
    {
      id: 11,
      name: 'Wielokulturowe Ślady Niebuszewa',
      emoji: '📜',
      type: 'walk',
      color: '#e67e22',
      distance: '2.8 km',
      distanceNum: 2.8,
      time: '40 min',
      timeMin: 40,
      difficulty: 'Łatwa',
      difficultyLevel: 1,
      calories: 175,
      terrain: 'Chodnik + alejki',
      bestTime: 'Popołudnie (14:00–18:00)',
      tags: ['historia', 'wielokulturowość', 'pamięć', 'kamienice', 'zegarsłoneczny', 'perec', 'szlak'],
      desc: 'Fascynująca podróż w głąb wielokulturowej historii dzielnicy z lat 1945–1950 oraz początków XX wieku. Szlak prowadzi od secesyjnej kamienicy z zegarem słonecznym przy Kołłątaja, przez dawny Dom Kultury im. Pereca przy Niemcewicza, aż po zabytkową nekropolię i lapidarium przy Beyzyma.',
      highlights: [
        'Kamienica z Zegarem Słonecznym (1904 r.)',
        'Dawny Ośrodek Kultury Żydowskiej & Dom Pereca',
        'Przedwojenne Kamienice przy ul. Długosza',
        'Zabytkowy Cmentarz Żydowski & Lapidarium'
      ],
      stops: [
        { name: 'Start: Kamienica z Zegarem Słonecznym', addr: 'ul. Kołłątaja 31', emoji: '☀️' },
        { name: 'Dom Pereca & Ośrodek Kultury', addr: 'ul. Niemcewicza 2', emoji: '📜' },
        { name: 'Willa Karkutsch & Kamienice', addr: 'ul. Niemierzyńska / Długosza', emoji: '🏛️' },
        { name: 'Meta: Zabytkowy Cmentarz & Lapidarium', addr: 'ul. Beyzyma / Wendeńska', emoji: '🌿' }
      ],
      coords: [
        [14.54650, 53.44810],
        [14.54910, 53.44880],
        [14.54280, 53.44850],
        [14.53610, 53.44680]
      ]
    },
    {
      id: 12,
      name: 'Bieg i Spacer wzdłuż Doliny Osówki',
      emoji: '🏃',
      type: 'run',
      color: '#2ecc71',
      distance: '4.2 km',
      distanceNum: 4.2,
      time: '28 min',
      timeMin: 28,
      difficulty: 'Średnia',
      difficultyLevel: 2,
      calories: 310,
      terrain: 'Ścieżki parkowe i szutrowe',
      bestTime: 'Poranek / Wczesny wieczór',
      tags: ['bieganie', 'osówka', 'dolina', 'przyroda', 'potok', 'parkkadziaka', 'trening'],
      desc: 'Świetna trasa biegowo-spacerowa łącząca osiedlowe alejki Parku Kadziaka z naturalną Doliną Potoku Osówka. Zmienna rzeźba terenu, czyste powietrze, zacienione ścieżki i szum strumienia sprawiają, że to ulubiony szlak biegaczy z Niebuszewa.',
      highlights: [
        'Start na Orliku przy Łuczniczej',
        'Park Antoniego Kadziaka',
        'Dolina Potoku Osówka & Kładka Niemierzyńska',
        'Sąsiedzki Ogród Społeczny Łucznicza'
      ],
      stops: [
        { name: 'Start: Orlik & Boiska Łucznicza', addr: 'ul. Łucznicza', emoji: '⚽' },
        { name: 'Park Antoniego Kadziaka', addr: 'Niebuszewo', emoji: '🌳' },
        { name: 'Dolina Potoku Osówka', addr: 'Park Kasprowicza / Osówka', emoji: '🦆' },
        { name: 'Meta: Ogród Społeczny Łucznicza', addr: 'ul. Łucznicza / Tarczowa', emoji: '🌻' }
      ],
      coords: [
        [14.54920, 53.45180],
        [14.54365, 53.45100],
        [14.53210, 53.45180],
        [14.54890, 53.45330]
      ]
    }
  ],

  // ===== INFO O DZIELNICY =====
  info: [
    {
      id: 'overview',
      icon: '🏘️',
      color: '#6c63ff',
      title: 'Charakterystyka dzielnicy',
      text: 'Obszar ulic Łuczniczej i Tarczowej to spokojna dzielnica mieszkaniowa w Szczecinie, charakteryzująca się zabudową wielorodzinną z lat 70. i 80. XX wieku. Dzielnica jest dobrze skomunikowana z centrum miasta i oferuje pełną infrastrukturę dla mieszkańców.',
      facts: [
        'Jedna z najspokojniejszych dzielnic Szczecina',
        'Zabudowa wielorodzinna z wielkiej płyty',
        'Pełna infrastruktura: szkoły, sklepy, przychodnie',
        'Doskonałe połączenia tramwajowe i autobusowe'
      ],
      stats: [
        { num: '~8 000', label: 'Mieszkańców', icon: '👥' },
        { num: '2,4 km²', label: 'Powierzchnia', icon: '📐' },
        { num: '1970s', label: 'Zabudowa', icon: '🏗️' }
      ]
    },
    {
      id: 'nature',
      icon: '🌿',
      color: '#43e97b',
      title: 'Zieleń i rekreacja',
      text: 'Dzielnica wyróżnia się dużą ilością terenów zielonych — skwery, parki osiedlowe i alejki spacerowe tworzą przyjazną przestrzeń dla mieszkańców. Siłownia plenerowa i boiska sportowe zachęcają do aktywności fizycznej na świeżym powietrzu.',
      facts: [
        'Ponad 30% powierzchni to tereny zielone',
        'Bezpłatna siłownia plenerowa czynna całą dobę',
        'Plac zabaw z nowoczesnym wyposażeniem',
        'Planowane nowe ścieżki rowerowe w 2026 r.'
      ],
      stats: [
        { num: '3', label: 'Parki/skwery', icon: '🌳' },
        { num: '2', label: 'Boiska', icon: '⚽' },
        { num: '1', label: 'Siłownia', icon: '💪' }
      ]
    },
    {
      id: 'infra',
      icon: '🏗️',
      color: '#ffd93d',
      title: 'Infrastruktura',
      text: 'Dzielnica posiada pełną infrastrukturę miejską: szkoły, przychodnie, apteki, sklepy i usługi. Trwają inwestycje w modernizację chodników i oświetlenia ulicznego. Planowana jest rozbudowa ścieżek rowerowych łączących dzielnicę z centrum.',
      facts: [
        'Szkoła podstawowa z salą gimnastyczną',
        'Przychodnia POZ z rejestracją online',
        'Apteka z dyżurami weekendowymi',
        'Modernizacja oświetlenia LED w 2025 r.'
      ],
      stats: [
        { num: '1', label: 'Szkoła', icon: '🏫' },
        { num: '1', label: 'Przychodnia', icon: '🏥' },
        { num: '12+', label: 'Usług', icon: '🔧' }
      ]
    },
    {
      id: 'history',
      icon: '📅',
      color: '#a29bfe',
      title: 'Historia',
      text: 'Ulice Łucznicza i Tarczowa swoją nazwę zawdzięczają tradycji łucznictwa — sport ten był popularny w tym rejonie Szczecina. Dzielnica rozwijała się dynamicznie w latach 70. XX wieku jako część planu rozbudowy Szczecina po wojnie. Dziś jest spokojną, zieloną enklawą w tkance miejskiej.',
      facts: [
        'Nazwa pochodzi od tradycji łucznictwa',
        'Budowa osiedla: lata 1968–1978',
        'Pierwsi mieszkańcy wprowadzili się w 1971 r.',
        'W 2020 r. rewitalizacja skweru przy Tarczowej'
      ],
      stats: [
        { num: '50+', label: 'Lat historii', icon: '📜' },
        { num: '1970', label: 'Rok budowy', icon: '🏗️' },
        { num: '🏹', label: 'Symbol', icon: '🏹' }
      ]
    },
    {
      id: 'transport',
      icon: '🚌',
      color: '#ff6b6b',
      title: 'Komunikacja',
      text: 'Dzielnica jest doskonale skomunikowana z centrum Szczecina. Liczne linie tramwajowe i autobusowe zapewniają szybki dojazd do każdej części miasta. Stacje Bike_S umożliwiają wygodne poruszanie się rowerem.',
      facts: [
        '3 linie tramwajowe w pobliżu',
        '4 linie autobusowe dzienne + 2 nocne',
        '2 stacje Bike_S w dzielnicy',
        'Dojazd do centrum: ok. 15 minut'
      ],
      stats: [
        { num: '7', label: 'Linii MPK', icon: '🚃' },
        { num: '15 min', label: 'Do centrum', icon: '⏱️' },
        { num: '2', label: 'Stacje Bike_S', icon: '🚲' }
      ]
    },
    {
      id: 'community',
      icon: '👥',
      color: '#fd79a8',
      title: 'Społeczność',
      text: 'Aktywna społeczność lokalna organizuje regularne spotkania, festyny i inicjatywy sąsiedzkie. Rada Osiedla reprezentuje interesy mieszkańców i współpracuje z władzami miasta przy planowaniu inwestycji.',
      facts: [
        'Coroczny Festyn Osiedlowy "Łucznicza Bawi"',
        'Aktywna Rada Osiedla Łucznicza-Tarczowa',
        'Grupy sąsiedzkie na portalach społecznościowych',
        'Wolontariat i inicjatywy ekologiczne'
      ],
      stats: [
        { num: '4 250', label: 'Mieszkańców', icon: '👥' },
        { num: '38 lat', label: 'Średni wiek', icon: '👤' },
        { num: '6+', label: 'Wydarzeń/rok', icon: '🎉' }
      ]
    }
  ],

  // ===== HISTORIA — TIMELINE =====
  timeline: [
    { year: '1945', icon: '🏚️', title: 'Odbudowa Szczecina', desc: 'Po II wojnie światowej Szczecin wraca do Polski. Rozpoczyna się odbudowa zniszczonego miasta.' },
    { year: '1968', icon: '📐', title: 'Projekt osiedla', desc: 'Architekci miejscy opracowują projekt nowego osiedla mieszkaniowego przy ul. Łuczniczej i Tarczowej.' },
    { year: '1971', icon: '🏠', title: 'Pierwsi mieszkańcy', desc: 'Pierwsze bloki gotowe. Rodziny wprowadzają się do nowych mieszkań. Dzielnica zaczyna tętnić życiem.' },
    { year: '1975', icon: '🏫', title: 'Szkoła Podstawowa nr 47', desc: 'Otwarto Szkołę Podstawową nr 47 przy ul. Tarczowej. Dzieci z dzielnicy mają szkołę w pobliżu domu.' },
    { year: '1978', icon: '🏗️', title: 'Koniec budowy', desc: 'Ostatnie bloki osiedla zostają oddane do użytku. Dzielnica osiąga docelową zabudowę.' },
    { year: '1990', icon: '🛒', title: 'Nowe sklepy i usługi', desc: 'Po transformacji ustrojowej w dzielnicy otwierają się prywatne sklepy, apteki i punkty usługowe.' },
    { year: '2010', icon: '💪', title: 'Siłownia plenerowa', desc: 'Miasto instaluje bezpłatną siłownię plenerową przy parku. Mieszkańcy ćwiczą na świeżym powietrzu.' },
    { year: '2018', icon: '🎠', title: 'Nowy plac zabaw', desc: 'Nowoczesny plac zabaw "Łucznik" z ścianką wspinaczkową i bezpieczną nawierzchnią.' },
    { year: '2020', icon: '🌳', title: 'Rewitalizacja skweru', desc: 'Rewitalizacja Skweru przy Tarczowej — nowe ławki, oświetlenie LED i nasadzenia drzew.' },
    { year: '2025', icon: '🚲', title: 'Ścieżki rowerowe', desc: 'Modernizacja infrastruktury rowerowej. Nowe stacje Bike_S i oznakowane trasy rowerowe.' },
    { year: '2026', icon: '🏹', title: 'Dziś', desc: 'Łucznicza i Tarczowa to tętniąca życiem, zielona dzielnica z aktywną społecznością i pełną infrastrukturą.' }
  ],

  // ===== CIEKAWOSTKI =====
  funFacts: [
    { emoji: '🏹', text: 'Nazwa "Łucznicza" pochodzi od łucznictwa — sportu popularnego w tym rejonie Szczecina w XIX wieku.' },
    { emoji: '🌳', text: 'Ponad 30% powierzchni dzielnicy to tereny zielone — jeden z najwyższych wskaźników w Szczecinie.' },
    { emoji: '🏗️', text: 'Bloki przy Łuczniczej zbudowano metodą wielkiej płyty — każdy blok powstawał w zaledwie kilka miesięcy.' },
    { emoji: '🚃', text: 'Tramwaj nr 3 kursuje przez dzielnicę od ponad 50 lat — to jedna z najstarszych linii w Szczecinie.' },
    { emoji: '🍽️', text: 'Bar Mleczny "Strzała" działa nieprzerwanie od lat 80. — to jeden z ostatnich prawdziwych barów mlecznych w mieście.' },
    { emoji: '👶', text: 'Średni wiek mieszkańców to 38 lat — dzielnica jest popularna wśród młodych rodzin z dziećmi.' }
  ],

  // ===== TRANSPORT =====
  transport: [
    {
      type: 'bus',
      icon: '🚌',
      title: 'Autobusy',
      subtitle: 'Linie kursujące przez przystanek Łucznicza',
      color: '#2980b9',
      lines: [
        { num: '69', color: 'line-bus' },
        { num: '89', color: 'line-bus' }
      ],
      stops: [
        { name: 'Łucznicza (kier. Kołłątaja)', dist: '~50 m' },
        { name: 'Łucznicza (kier. Świergotki/Rugiańska)', dist: '~50 m' }
      ]
    },
    {
      type: 'tram',
      icon: '🚃',
      title: 'Tramwaje',
      subtitle: 'Najbliższe linie tramwajowe (przesiadka)',
      color: '#e74c3c',
      lines: [
        { num: '1', color: 'line-tram' },
        { num: '3', color: 'line-tram' }
      ],
      stops: [
        { name: 'Plac Kościuszki (przesiadka)', dist: '~1,2 km' },
        { name: 'Wyzwolenia', dist: '~1,5 km' }
      ]
    },
    {
      type: 'night',
      icon: '🌙',
      title: 'Linie nocne',
      subtitle: 'Komunikacja nocna w rejonie',
      color: '#2c3e50',
      lines: [
        { num: 'N1', color: 'line-night' },
        { num: 'N2', color: 'line-night' }
      ],
      stops: [
        { name: 'Przystanki nocne w centrum', dist: '~1,2 km' }
      ]
    },
    {
      type: 'bike',
      icon: '🚲',
      title: 'Rowery miejskie',
      subtitle: 'Stacje Bike_S Szczecin',
      color: '#27ae60',
      lines: [],
      stops: [
        { name: 'Stacja w rejonie Łuczniczej', dist: '~300 m' }
      ]
    }
  ],

  // ===== WYDARZENIA =====
  events: [
    {
      day: '07', month: 'CZE',
      name: 'Festyn Osiedlowy "Łucznicza Bawi"',
      place: 'Boisko Sportowe Łucznicza',
      desc: 'Coroczny festyn dla mieszkańców dzielnicy. Koncerty, zabawy dla dzieci, stoiska z jedzeniem i lokalnymi wyrobami.',
      tag: 'Festyn'
    },
    {
      day: '15', month: 'CZE',
      name: 'Turniej Piłki Nożnej Dzielnicy',
      place: 'Boisko Sportowe Łucznicza',
      desc: 'Amatorski turniej piłkarski dla drużyn z dzielnicy. Zapisy do 10 czerwca. Nagrody dla zwycięzców.',
      tag: 'Sport'
    },
    {
      day: '22', month: 'CZE',
      name: 'Noc Świętojańska na Tarczowej',
      place: 'Skwer przy Tarczowej',
      desc: 'Tradycyjne świętowanie nocy świętojańskiej. Ognisko, wianki, muzyka na żywo i wspólna zabawa do późna.',
      tag: 'Tradycja'
    },
    {
      day: '05', month: 'LIP',
      name: 'Warsztaty Łucznictwa dla Dzieci',
      place: 'Szkoła Podstawowa nr 47',
      desc: 'Bezpłatne warsztaty łucznictwa nawiązujące do nazwy ulicy. Dla dzieci w wieku 7–14 lat. Zapisy w szkole.',
      tag: 'Edukacja'
    },
    {
      day: '19', month: 'LIP',
      name: 'Kino Letnie pod Gwiazdami',
      place: 'Skwer przy Tarczowej',
      desc: 'Bezpłatne seanse filmowe na świeżym powietrzu. Filmy familijne i polskie kino. Przynieś koc i dobry humor.',
      tag: 'Kultura'
    },
    {
      day: '02', month: 'SIE',
      name: 'Bieg Uliczny "Łucznicza Run"',
      place: 'Start: ul. Łucznicza',
      desc: 'Lokalny bieg uliczny na dystansie 5 km i 10 km. Trasa przez dzielnicę i okoliczne parki. Zapisy online.',
      tag: 'Sport'
    },
    {
      day: '05', month: 'WRZ',
      name: 'Piknik lotniczy Fly Day 2026',
      place: 'Lotnisko w Dąbiu',
      desc: 'Pokazy podniebne, stoiska modelarskie i rodzinna strefa rekreacyjna w Szczecinie.',
      tag: 'Festyn',
      source: 'wSzczecinie.pl'
    },
    {
      day: '05', month: 'WRZ',
      name: 'ZATRZYMANE W LOCIE | wernisaż',
      place: 'Muzeum Techniki i Komunikacji',
      desc: 'Wystawa i wernisaż w zabytkowej zajezdni przy ul. Niemierzyńskiej na Niebuszewie.',
      tag: 'Kultura',
      source: 'wSzczecinie.pl'
    },
    {
      day: '05', month: 'WRZ',
      name: 'Unia Obu Brzegów | Fukaj & Hubert.',
      place: 'Wyspa Grodzka',
      desc: 'Koncert plenerowy nad Odrą z widokiem na Wały Chrobrego.',
      tag: 'Koncert',
      source: 'wSzczecinie.pl'
    },
    {
      day: '05', month: 'WRZ',
      name: 'Bazar Szafa Piwnica Garaż',
      place: 'Przecław 150',
      desc: 'Sąsiedzki pchli targ i giełda rękodzieła oraz skarbów vintage.',
      tag: 'Festyn',
      source: 'wSzczecinie.pl'
    },
    {
      day: '05', month: 'WRZ',
      name: 'Joga w chmurach | Lato na Tarasach',
      place: 'Zamek Książąt Pomorskich w Szczecinie',
      desc: 'Poranna relaksacja i ćwiczenia jogi na tarasach renesansowego zamku.',
      tag: 'Sport',
      source: 'wSzczecinie.pl'
    },
    {
      day: '05', month: 'WRZ',
      name: 'Biegowe Bulwarowe 2026',
      place: 'Bulwary / Łasztownia',
      desc: 'Biegi rekreacyjne, strefa foodtrucków i leżaki nad Odrą.',
      tag: 'Sport',
      source: 'wSzczecinie.pl'
    }
  ]
};

if (typeof window !== 'undefined') {
  window.APP_DATA = APP_DATA;
}
