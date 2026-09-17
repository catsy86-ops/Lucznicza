/**
 * qol-v2-features.test.ts — Test suite for v2.0.0 Quality of Life (QoL) Improvements:
 * 1. Web Share API & Clipboard Fallback (navigator.share, shareContent, deep link aliases)
 * 2. PWA Install Prompt & iOS Safari Home Screen Guide (beforeinstallprompt, installPWA)
 * 3. Community Place Submission & Feedback Outbox Queue (OfflineSyncService.queueAction)
 * 4. Gryfus Mini-Onboarding Guide (3-step contextual onboarding, localStorage persistence)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { OfflineSyncService } from '../services/offline-sync';

describe('Quality of Life (QoL) Sprint v2.0.0', () => {
  const rootDir = path.resolve(__dirname, '../..');

  // ──────────────────────────────────────────────────────────
  // 1. Web Share API & Deep Link Verification
  // ──────────────────────────────────────────────────────────
  describe('QoL 1: Web Share API & Deep Links', () => {
    let appJsContent: string;
    let pogonFeatureContent: string;

    beforeEach(() => {
      appJsContent = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf-8');
      pogonFeatureContent = fs.readFileSync(path.join(rootDir, 'pogon-feature.js'), 'utf-8');
    });

    it('defines global shareContent helper with fallback clipboard and prompt mechanisms', () => {
      expect(appJsContent).toContain('function shareContent(options)');
      expect(appJsContent).toContain('window.shareContent = shareContent;');
      expect(appJsContent).toContain('navigator.share');
      expect(appJsContent).toContain('navigator.clipboard.writeText');
      expect(appJsContent).toContain("err.name === 'AbortError'");
    });

    it('exposes sharePlace and shareRoute connected to shareContent', () => {
      expect(appJsContent).toContain('function sharePlace(id)');
      expect(appJsContent).toContain('window.sharePlace = sharePlace;');
      expect(appJsContent).toContain('function shareRoute(id)');
      expect(appJsContent).toContain('window.shareRoute = shareRoute;');
    });

    it('renders quick share buttons directly on place cards and route card heroes', () => {
      expect(appJsContent).toContain('card-share-btn');
      expect(appJsContent).toContain('rc2-share');
    });

    it('provides shareHub functionality in PogonFeature module', () => {
      expect(pogonFeatureContent).toContain('shareHub');
      expect(pogonFeatureContent).toContain('pogonShareBtn');
      expect(pogonFeatureContent).toContain('PogonFeature.shareHub()');
    });

    it('handles deep links with both Polish and English aliases (#miejsce/#place, #trasa/#route)', () => {
      expect(appJsContent).toContain('/#(?:miejsce|place)-(\\d+)/');
      expect(appJsContent).toContain('/#(?:trasa|route)-(\\d+)/');
    });
  });

  // ──────────────────────────────────────────────────────────
  // 2. PWA Install Prompt & iOS Safari Guide
  // ──────────────────────────────────────────────────────────
  describe('QoL 2: PWA Install Prompt & iOS Safari Detection', () => {
    let pwaJsContent: string;

    beforeEach(() => {
      pwaJsContent = fs.readFileSync(path.join(rootDir, 'pwa.js'), 'utf-8');
    });

    it('captures beforeinstallprompt and exports window.deferredInstallPrompt', () => {
      expect(pwaJsContent).toContain("window.addEventListener('beforeinstallprompt'");
      expect(pwaJsContent).toContain('window.deferredInstallPrompt = e;');
    });

    it('detects iOS Safari users without standalone mode', () => {
      expect(pwaJsContent).toContain('function isIosSafari()');
      expect(pwaJsContent).toContain('/iphone|ipad|ipod/.test(ua)');
      expect(pwaJsContent).toContain('navigator.standalone');
      expect(pwaJsContent).toContain('window.isIosSafari = isIosSafari;');
    });

    it('provides showIosInstallGuide modal with 3 step home-screen instructions', () => {
      expect(pwaJsContent).toContain('function showIosInstallGuide()');
      expect(pwaJsContent).toContain('iosInstallModal');
      expect(pwaJsContent).toContain('Do ekranu początkowego');
      expect(pwaJsContent).toContain('window.showIosInstallGuide = showIosInstallGuide;');
    });

    it('implements installPWA() with time-decayed dismissal (pwaDismissedUntil)', () => {
      expect(pwaJsContent).toContain('async function installPWA()');
      expect(pwaJsContent).toContain('window.installPWA = installPWA;');
      expect(pwaJsContent).toContain('pwaDismissedUntil');
    });
  });

  // ──────────────────────────────────────────────────────────
  // 3. Community Feedback & Place Submission with Offline Outbox
  // ──────────────────────────────────────────────────────────
  describe('QoL 3: Community Place Submission & OfflineSyncService Outbox', () => {
    let feedbackJsContent: string;
    let appJsContent: string;

    beforeEach(() => {
      feedbackJsContent = fs.readFileSync(path.join(rootDir, 'tester-feedback.js'), 'utf-8');
      appJsContent = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf-8');
    });

    it('supports new place POI submission category alongside bug/idea/ux', () => {
      expect(feedbackJsContent).toContain('data-type="place"');
      expect(feedbackJsContent).toContain('tfPlaceName');
      expect(feedbackJsContent).toContain('tfPlaceCat');
      expect(feedbackJsContent).toContain('tfPlaceAddr');
    });

    it('enqueues feedback reports into OfflineSyncService outbox', () => {
      expect(feedbackJsContent).toContain("queueAction('feedback'");
      expect(feedbackJsContent).toContain('OfflineSyncService');
    });

    it('exposes global helpers window.openFeedbackModal and window.openPlaceSubmissionModal', () => {
      expect(feedbackJsContent).toContain('window.openFeedbackModal =');
      expect(feedbackJsContent).toContain('window.openPlaceSubmissionModal =');
    });

    it('renders community place submission CTA card in places list', () => {
      expect(appJsContent).toContain('appendPlaceSubmissionCta');
      expect(appJsContent).toContain('placesSubmissionCta');
      expect(appJsContent).toContain('Nie widzisz swojego ulubionego miejsca?');
    });

    it('OfflineSyncService processes feedback action items in outbox queue', () => {
      const sync = OfflineSyncService.getInstance();
      const testReport = {
        id: Date.now(),
        type: 'place',
        placeName: 'Kawiarnia Gryf',
        placeCat: 'food',
        placeAddr: 'ul. Łucznicza 10',
        comment: 'Super kawa i ciastka'
      };

      const queuedItem = sync.queueAction('feedback', testReport);
      expect(queuedItem.id).toBeDefined();
      expect(queuedItem.type).toBe('feedback');
      expect(queuedItem.payload.placeName).toBe('Kawiarnia Gryf');
      expect(['pending', 'syncing', 'synced']).toContain(queuedItem.status);
    });
  });

  // ──────────────────────────────────────────────────────────
  // 4. Gryfus Mini-Onboarding Guide
  // ──────────────────────────────────────────────────────────
  describe('QoL 4: Gryfus Mini-Onboarding Guide', () => {
    let onboardingJsContent: string;
    let indexHtmlContent: string;
    let styleCssContent: string;

    beforeEach(() => {
      onboardingJsContent = fs.readFileSync(path.join(rootDir, 'gryfus-onboarding.js'), 'utf-8');
      indexHtmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
      styleCssContent = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf-8');
    });

    it('defines 3 sequential onboarding steps highlighting Ambient HUD, Places/GPX, and Pogon Fan Hub', () => {
      expect(onboardingJsContent).toContain('const TOTAL_STEPS = 3;');
      expect(onboardingJsContent).toContain('Ambient Status HUD');
      expect(onboardingJsContent).toContain('82 Miejsca i Trasy Rekreacyjne');
      expect(onboardingJsContent).toContain('Fan Hub Pogoni & Gra Miejska');
      expect(onboardingJsContent).toContain('#ambientStatusCapsule');
    });

    it('stores completion status in localStorage (niebuszewo_onboarding_done)', () => {
      expect(onboardingJsContent).toContain("STORAGE_KEY = 'niebuszewo_onboarding_done'");
      expect(onboardingJsContent).toContain('isDone');
      expect(onboardingJsContent).toContain('markDone');
    });

    it('exposes navigation controls (start, next, prev, skip, finish)', () => {
      expect(onboardingJsContent).toContain('window.GryfusOnboarding = GryfusOnboarding;');
      expect(onboardingJsContent).toContain('next,');
      expect(onboardingJsContent).toContain('prev,');
      expect(onboardingJsContent).toContain('skip,');
      expect(onboardingJsContent).toContain('finish,');
    });

    it('is registered in index.html script tags and sidebar navigation', () => {
      expect(indexHtmlContent).toContain('src="gryfus-onboarding.js"');
      expect(indexHtmlContent).toContain('id="sidebarOnboardingBtn"');
      expect(indexHtmlContent).toContain('id="idmOnboardingBtn"');
    });

    it('includes responsive styling in style.css for card and glowing pulse animation', () => {
      expect(styleCssContent).toContain('.gryfus-onboarding-card');
      expect(styleCssContent).toContain('.onboarding-highlight-pulse');
      expect(styleCssContent).toContain('@keyframes onboardingGlow');
    });
  });
});
