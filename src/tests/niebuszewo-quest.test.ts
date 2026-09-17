import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Niebuszewo Quest & City Game Tests (Krok 7)', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  const questJs = fs.readFileSync(path.join(rootDir, 'niebuszewo-quest.js'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
  const swJs = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');

  it('verifies NiebuszewoQuest object structure and questions database in niebuszewo-quest.js', () => {
    expect(questJs).toContain('const NiebuszewoQuest =');
    expect(questJs).toContain('QUEST_QUESTIONS');
    expect(questJs).toContain('quest_fabryka_stoewer');
    expect(questJs).toContain('quest_kadziak_park');
    expect(questJs).toContain('quest_stacja_niebuszewo');
    expect(questJs).toContain('quest_potok_osowka');
    expect(questJs).toContain('quest_murek_klatka');
    expect(questJs).toContain('window.NiebuszewoQuest = NiebuszewoQuest;');
  });

  it('verifies scoring, answer validation and badge unlocking logic', () => {
    expect(questJs).toContain('function answerQuestion(qId, selectedIdx)');
    expect(questJs).toContain('adept_niebuszewa');
    expect(questJs).toContain('znawca_ulic');
    expect(questJs).toContain('mistrz_niebuszewa');
    expect(questJs).toContain('prog.points += q.points;');
  });

  it('verifies integration in index.html, island menu trigger and app.js executeIslandAction', () => {
    expect(indexHtml).toContain('script src="niebuszewo-quest.js"');
    expect(indexHtml).toContain('data-action="quest"');
    expect(indexHtml).toContain('Gra Miejska: Odkrywca Niebuszewa');
    expect(appJs).toContain("case 'quest':");
    expect(appJs).toContain('window.NiebuszewoQuest.open()');
  });

  it('verifies expanded QUEST_QUESTIONS database including Sprint 13 heritage questions', () => {
    expect(questJs).toContain('quest_zajezdnia_niemierzyn');
    expect(questJs).toContain('quest_stary_browar');
    expect(questJs).toContain('quest_zegar_sloneczny');
    expect(questJs).toContain('quest_bar_turysta');
    expect(questJs).toContain('straznik_zabytkow');
  });

  it('verifies TypeScript NiebuszewoQuestService integration, questions count and GPS proximity', async () => {
    const { niebuszewoQuestService, QUEST_QUESTIONS } = await import('../services/niebuszewo-quest');
    expect(QUEST_QUESTIONS.length).toBe(9);

    niebuszewoQuestService.resetProgress();
    const initialProg = niebuszewoQuestService.getProgress();
    expect(initialProg.points).toBe(0);
    expect(initialProg.badges).toEqual([]);

    // Test Haversine distance
    // Coords near Zajezdnia Niemierzyn (53.4532, 14.5365)
    const dist = niebuszewoQuestService.calculateDistanceMeters(53.4532, 14.5365, 53.4532, 14.5365);
    expect(dist).toBe(0);

    // Test proximity check for POI 77
    const inProximity = niebuszewoQuestService.verifyProximity(77, 53.4532, 14.5365, 100);
    expect(inProximity).toBe(true);

    const farAway = niebuszewoQuestService.verifyProximity(77, 52.0, 21.0, 100);
    expect(farAway).toBe(false);

    // Answer with GPS bonus
    const answerRes = niebuszewoQuestService.answerQuestion('quest_zajezdnia_niemierzyn', 0, {
      lat: 53.4532,
      lon: 14.5365
    });

    expect(answerRes.success).toBe(true);
    expect(answerRes.correct).toBe(true);
    expect(answerRes.pointsAwarded).toBe(35); // 25 + 10 GPS bonus
    expect(answerRes.newBadges).toContain('adept_niebuszewa');

    const updatedProg = niebuszewoQuestService.getProgress();
    expect(updatedProg.points).toBe(35);
    expect(updatedProg.answered['quest_zajezdnia_niemierzyn']?.verifiedOnSite).toBe(true);
  });

  it('verifies quest modal styles and sw.js caching', () => {
    expect(styleCss).toContain('.quest-modal-card');
    expect(styleCss).toContain('.quest-stats-bar');
    expect(styleCss).toContain('.quest-card');
    expect(styleCss).toContain('.qc-opt-btn.opt-correct');
    expect(swJs).toContain('/niebuszewo-quest.js');
  });
});

