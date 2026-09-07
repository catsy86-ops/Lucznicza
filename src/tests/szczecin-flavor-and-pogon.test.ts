import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ExplorerBadgesService, BASE_BADGES } from '../services/explorer-badges';

describe('Szczecin Flavor, Pogoń Matchday & Niebuszewo QoL Tests', () => {
  const rootDir = path.resolve(__dirname, '../../');

  it('verifies explorer badges include Pogoń Matchday, Pasztecik Master and Szczecin Slang', () => {
    const service = new ExplorerBadgesService();
    const badges = service.getBadges();

    const matchdayBadge = badges.find(b => b.id === 'badge-matchday-pogon');
    expect(matchdayBadge).toBeDefined();
    expect(matchdayBadge?.category).toBe('pogon');
    expect(matchdayBadge?.icon).toBe('⚽');

    const pasztecikBadge = badges.find(b => b.id === 'badge-pasztecik-master');
    expect(pasztecikBadge).toBeDefined();
    expect(pasztecikBadge?.icon).toBe('🥟');

    const slangBadge = badges.find(b => b.id === 'badge-szczecin-slang');
    expect(slangBadge).toBeDefined();
    expect(slangBadge?.icon).toBe('🗣️');

    // Unlock new badges
    const res1 = service.unlockBadge('badge-matchday-pogon');
    expect(res1.success).toBe(true);
    expect(service.getTotalPoints()).toBe(150);

    const res2 = service.unlockBadge('badge-pasztecik-master');
    expect(res2.success).toBe(true);
    expect(service.getTotalPoints()).toBe(270);
  });

  it('integrates Pogoń Matchday Mode, chant audio & transit navigator in pogon-feature.js', () => {
    const pogonJs = fs.readFileSync(path.join(rootDir, 'pogon-feature.js'), 'utf-8');

    expect(pogonJs).toContain('toggleMatchdayMode');
    expect(pogonJs).toContain('playStadiumDrumBeat');
    expect(pogonJs).toContain('drawMatchdayRouteOnMap');
    expect(pogonJs).toContain('Grill Kibica pod Stadionem');
    expect(pogonJs).toContain('Stadion Miejski im. Floriana Krygiera');
    expect(pogonJs).toContain('badge-matchday-pogon');
    expect(pogonJs).toContain('Kamil Grosicki');
  });

  it('implements Pasztecik Radar, Slang Dictionary, Giedroyc Meter & Klatka 43 Notice Board in szczecin-local-flavor.js', () => {
    const flavorJs = fs.readFileSync(path.join(rootDir, 'szczecin-local-flavor.js'), 'utf-8');

    // Pasztecik & Frytburger
    expect(flavorJs).toContain('Bar „Pasztecik”');
    expect(flavorJs).toContain('1969');
    expect(flavorJs).toContain('Bar Rab — Ojczyzna Frytburgera');
    expect(flavorJs).toContain('playCrunchSound');
    expect(flavorJs).toContain('badge-pasztecik-master');

    // Dictionary & Dialect
    expect(flavorJs).toContain('Frytburger');
    expect(flavorJs).toContain('Bana');
    expect(flavorJs).toContain('Rondo Giedroycia');
    expect(flavorJs).toContain('Wyprawa na Głębokie');
    expect(flavorJs).toContain('toggleSzczecinDialect');
    expect(flavorJs).toContain('badge-szczecin-slang');

    // Rondo Giedroycia & SKM
    expect(flavorJs).toContain('KOCIOŁ GIEDROYCIA');
    expect(flavorJs).toContain('SKM Szczecin Niebuszewo');

    // Announcements
    expect(flavorJs).toContain('Zastawiona wózkownia');
    expect(flavorJs).toContain('Światło w piwnicy');
    expect(flavorJs).toContain('Pubie Klatka');
    expect(flavorJs).toContain('copyAnnouncementToClipboard');
  });

  it('registers new sections, nav links and scripts in index.html and app.js', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf-8');

    expect(indexHtml).toContain('id="section-pogon"');
    expect(indexHtml).toContain('id="section-szczecin"');
    expect(indexHtml).toContain('src="pogon-feature.js"');
    expect(indexHtml).toContain('src="szczecin-local-flavor.js"');
    expect(indexHtml).toContain('data-action="pasztecik"');
    expect(indexHtml).toContain('data-action="gwara"');
    expect(indexHtml).toContain('data-action="giedroyc"');
    expect(indexHtml).toContain('data-action="ogloszenia"');

    expect(appJs).toContain('pogon|szczecin');
    expect(appJs).toContain('case \'pasztecik\':');
    expect(appJs).toContain('case \'gwara\':');
    expect(appJs).toContain('case \'giedroyc\':');
    expect(appJs).toContain('case \'ogloszenia\':');
  });

  it('implements Pub Klatka under Łucznicza 43 with interactive sounds and debate generator', () => {
    const commUiJs = fs.readFileSync(path.join(rootDir, 'community-ui.js'), 'utf-8');
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf-8');

    // Section and hub
    expect(commUiJs).toContain('renderPubKlatkaHub');
    expect(commUiJs).toContain('comm-klatka');
    expect(commUiJs).toMatch(/Pub Klatka — Łucznicza (39|43)/);
    expect(commUiJs).toContain('playBeerOpenSound');
    expect(commUiJs).toContain('playGlassClinkSound');
    expect(commUiJs).toContain('playRadiatorKnockSound');
    expect(commUiJs).toContain('playDoorbellIntercom');
    expect(commUiJs).toContain('rollKlatkaDebate');
    expect(commUiJs).toContain('unlockKlatkaBadge');
    expect(commUiJs).toContain('story-klatka-');

    // Badge service
    const service = new ExplorerBadgesService();
    const klatkaBadge = service.getBadges().find(b => b.id === 'badge-klatka-regular');
    expect(klatkaBadge).toBeDefined();
    expect(klatkaBadge?.title).toMatch(/Bywalec Klatki pod (39|43)/);
    expect(klatkaBadge?.points).toBe(130);

    // CSS and Index Quick Action
    expect(styleCss).toContain('.klatka-hero-card');
    expect(styleCss).toContain('.khc-sound-btn');
    expect(styleCss).toContain('.khc-debate-box');
    expect(indexHtml).toContain('data-action="klatka"');
  });

  it('caches new scripts in service worker v8/v9/v10', () => {
    const swJs = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf-8');
    expect(swJs).toMatch(/const CACHE_VERSION = 'v(8|9|10)'/);
    expect(swJs).toContain("'/pogon-feature.js'");
    expect(swJs).toContain("'/szczecin-local-flavor.js'");
  });
});
