/**
 * Szczecin Real Events Scraper
 * Fetches real upcoming events & news from wSzczecinie.pl,
 * parses titles, dates, venues, categories and formats them for the app.
 */
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseMonth(monthStr) {
  const m = monthStr.toLowerCase();
  if (m.includes('sty')) return 'STY';
  if (m.includes('lut')) return 'LUT';
  if (m.includes('mar')) return 'MAR';
  if (m.includes('kwi')) return 'KWI';
  if (m.includes('maj')) return 'MAJ';
  if (m.includes('cze')) return 'CZE';
  if (m.includes('lip')) return 'LIP';
  if (m.includes('sie')) return 'SIE';
  if (m.includes('wrz')) return 'WRZ';
  if (m.includes('paź')) return 'PAŹ';
  if (m.includes('lis')) return 'LIS';
  if (m.includes('gru')) return 'GRU';
  return 'WRZ';
}

export async function scrapeWszczecinieEvents() {
  try {
    const html = await fetchUrl('https://wszczecinie.pl/wydarzenia');
    const events = [];

    // Match card blocks
    const cardRegex = /<div class="card article-card[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;
    const cards = html.match(cardRegex) || [];

    for (const card of cards) {
      // Title
      const titleMatch = card.match(/<h6 class="card-title">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
      if (!titleMatch) continue;
      let rawTitle = titleMatch[1].replace(/<i[^>]*><\/i>/gi, '').trim();

      // Date
      const dateMatch = card.match(/<div class="card-text text-muted small[^>]*>([\s\S]*?)<\/div>/i);
      let dateText = dateMatch ? dateMatch[1].trim() : '';
      const dayMatch = dateText.match(/(\d{1,2})\s+([a-ząćęłńóśźż]+)/i);
      let day = '05';
      let month = 'WRZ';
      if (dayMatch) {
        day = dayMatch[1].padStart(2, '0');
        month = parseMonth(dayMatch[2]);
      }

      // Venue
      const venueMatch = card.match(/<div class="text-primary small[^>]*>([\s\S]*?)<\/div>/i);
      let venue = venueMatch ? venueMatch[1].trim() : 'Szczecin';

      // Badge category
      const catMatch = card.match(/<a href="https:\/\/wszczecinie\.pl\/wydarzenia\/[^"]*" class="badge[^>]*>([\s\S]*?)<\/a>/i);
      let category = catMatch ? catMatch[1].trim() : 'Kultura';

      // Description synthesis
      let desc = `Prawdziwe wydarzenie ze Szczecina (${venue}). Szczegóły i relacje w serwisie wSzczecinie.pl.`;
      if (category.toLowerCase().includes('festyn') || category.toLowerCase().includes('jarmark')) {
        desc = `Lokalne spotkanie sąsiedzkie i plenerowe: ${rawTitle}. Wstęp wolny dla mieszkańców!`;
      } else if (category.toLowerCase().includes('wystaw') || category.toLowerCase().includes('wernisaż')) {
        desc = `Wystawa kulturalna w Szczecinie (${venue}). Sztuka współczesna i inspirujące wernisaże.`;
      } else if (category.toLowerCase().includes('sport')) {
        desc = `Aktywność sportowo-rekreacyjna: ${rawTitle}. Zadbaj o formę w sercu Szczecina!`;
      }

      events.push({
        day,
        month,
        name: rawTitle,
        place: venue,
        desc,
        tag: category,
        source: 'wSzczecinie.pl'
      });
    }

    return events;
  } catch (err) {
    console.error('Error scraping wSzczecinie:', err.message);
    return [];
  }
}

// If run directly
if (process.argv[1] && process.argv[1].endsWith('scrape-szczecin.js')) {
  console.log('Rozpoczynam pobieranie prawdziwych wydarzeń ze Szczecina (wSzczecinie.pl)...');
  scrapeWszczecinieEvents().then(events => {
    console.log(`Pobrano pomyślnie ${events.length} wydarzeń!`);
    const outPath = path.resolve(__dirname, '../scraped-szczecin-events.json');
    fs.writeFileSync(outPath, JSON.stringify(events, null, 2), 'utf-8');
    console.log(`Zapisano do ${outPath}`);
  });
}
