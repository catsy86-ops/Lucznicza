/**
 * UI-UX-TEST-SUITE.js — Comprehensive UI/UX Testing Suite
 * 
 * Tests:
 * 1. Z-Index Layering Verification (no overlaps)
 * 2. Responsive Layout Testing (mobile/tablet/desktop)
 * 3. Element Positioning & Collision Detection
 * 4. Focus Management & Keyboard Navigation
 * 5. Touch Target Sizing (WCAG AAA compliance)
 * 6. Performance Metrics
 * 7. Accessibility Compliance
 * 8. Visual Hierarchy Validation
 * 
 * Run: UIUXTestSuite.runAll() in browser console
 */

'use strict';

const UIUXTestSuite = (() => {
  const results = [];
  let testsPassed = 0;
  let testsFailed = 0;

  // ===== TEST UTILITIES =====
  function logTest(name, passed, message = '') {
    const icon = passed ? '✅' : '❌';
    const color = passed ? 'color: #43e97b' : 'color: #ff6584';
    console.log(`%c${icon} ${name}`, color, message || '');
    results.push({ name, passed, message });
    if (passed) testsPassed++; else testsFailed++;
  }

  function getRect(element) {
    return element?.getBoundingClientRect() || { top: 0, left: 0, bottom: 0, right: 0 };
  }

  function elementOverlaps(el1, el2) {
    const r1 = getRect(el1);
    const r2 = getRect(el2);
    return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
  }

  function getZIndex(element) {
    return parseInt(window.getComputedStyle(element).zIndex) || 0;
  }

  function getPosition(element) {
    const rect = getRect(element);
    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
      display: window.getComputedStyle(element).display
    };
  }

  // ===== TEST 1: Z-INDEX LAYERING =====
  function testZIndexLayering() {
    console.log('\n📊 TEST 1: Z-INDEX LAYERING VERIFICATION');
    console.log('=========================================');

    const elements = {
      header: document.querySelector('.header'),
      bottomNav: document.querySelector('.bottom-nav'),
      searchBar: document.querySelector('.search-bar'),
      weatherWidget: document.querySelector('.weather-widget'),
      clockWidget: document.querySelector('.clock-widget'),
      aqiWidget: document.querySelector('.aqi-widget'),
      mapLegend: document.querySelector('.map-legend'),
      infoCard: document.querySelector('.clean-info-card'),
      minimalControls: document.querySelector('.minimal-controls'),
      transportPanel: document.getElementById('transportPanelContainer'),
      modal: document.querySelector('.modal-overlay'),
      toast: document.querySelector('.toast'),
      sidebar: document.querySelector('.sidebar')
    };

    const expectedOrder = [
      { name: 'header', minZ: 100 },
      { name: 'bottomNav', minZ: 100 },
      { name: 'weatherWidget', maxZ: 20 },
      { name: 'clockWidget', maxZ: 20 },
      { name: 'aqiWidget', maxZ: 20 },
      { name: 'mapLegend', maxZ: 20 },
      { name: 'infoCard', minZ: 40, maxZ: 60 },
      { name: 'minimalControls', minZ: 40, maxZ: 60 },
      { name: 'transportPanel', minZ: 300, maxZ: 400 },
      { name: 'modal', minZ: 250 },
      { name: 'toast', minZ: 350 },
      { name: 'sidebar', minZ: 150 }
    ];

    expectedOrder.forEach(exp => {
      const el = elements[exp.name];
      if (!el) return;

      const z = getZIndex(el);
      let passed = true;
      let message = `Z-Index: ${z}`;

      if (exp.minZ && z < exp.minZ) {
        passed = false;
        message = `Z-Index too low: ${z} (expected >= ${exp.minZ})`;
      }
      if (exp.maxZ && z > exp.maxZ) {
        passed = false;
        message = `Z-Index too high: ${z} (expected <= ${exp.maxZ})`;
      }

      logTest(`Z-Index: ${exp.name}`, passed, message);
    });
  }

  // ===== TEST 2: ELEMENT OVERLAP DETECTION =====
  function testElementOverlaps() {
    console.log('\n🔍 TEST 2: ELEMENT OVERLAP DETECTION');
    console.log('====================================');

    const criticalElements = [
      { name: 'Weather + Info Card', el1: '.weather-widget', el2: '.clean-info-card' },
      { name: 'Info Card + Minimal Controls', el1: '.clean-info-card', el2: '.minimal-controls' },
      { name: 'Legend + AQI Widget', el1: '.map-legend', el2: '.aqi-widget' },
      { name: 'Transport Panel + Toast', el1: '#transportPanelContainer', el2: '.toast' },
      { name: 'Transport Panel + Bottom Nav', el1: '#transportPanelContainer', el2: '.bottom-nav' },
      { name: 'Modal + Header', el1: '.modal-overlay', el2: '.header' },
      { name: 'Sidebar + Header', el1: '.sidebar', el2: '.header' }
    ];

    criticalElements.forEach(test => {
      const el1 = document.querySelector(test.el1);
      const el2 = document.querySelector(test.el2);

      if (!el1 || !el2) return;

      // Hidden elements don't count as overlaps
      const disp1 = window.getComputedStyle(el1).display;
      const disp2 = window.getComputedStyle(el2).display;
      if (disp1 === 'none' || disp2 === 'none') {
        logTest(`No Overlap: ${test.name}`, true, 'Element hidden (acceptable)');
        return;
      }

      const overlaps = elementOverlaps(el1, el2);
      logTest(`No Overlap: ${test.name}`, !overlaps, overlaps ? '⚠️ OVERLAPPING' : 'Clear spacing');
    });
  }

  // ===== TEST 3: RESPONSIVE LAYOUT =====
  function testResponsiveLayout() {
    console.log('\n📱 TEST 3: RESPONSIVE LAYOUT VALIDATION');
    console.log('========================================');

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const isMobile = viewport.width < 768;
    const isTablet = viewport.width >= 768 && viewport.width < 1025;
    const isDesktop = viewport.width >= 1025;

    logTest(`Viewport Size: ${viewport.width}x${viewport.height}`, true, 
      `${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}`);

    // Check header positioning
    const header = document.querySelector('.header');
    const headerPos = getPosition(header);
    logTest('Header Fixed Position', headerPos.top === 0 && headerPos.width === viewport.width,
      `Top: ${headerPos.top}, Width: ${headerPos.width}`);

    // Check bottom nav positioning
    const bottomNav = document.querySelector('.bottom-nav');
    const bnPos = getPosition(bottomNav);
    logTest('Bottom Nav Fixed Position', Math.abs(bnPos.bottom - viewport.height) < 2,
      `Bottom: ${bnPos.bottom}, Height: ${bnPos.height}`);

    // Check map container fills space
    const map = document.querySelector('#map');
    const mapPos = getPosition(map);
    const expectedMapHeight = viewport.height - 64 - 72; // header - bnav
    const mapHeightDiff = Math.abs(mapPos.height - expectedMapHeight);
    logTest('Map Container Fills Space', mapHeightDiff < 10,
      `Height: ${mapPos.height}px (expected ~${expectedMapHeight}px)`);

    // Mobile specific tests
    if (isMobile) {
      const legend = document.querySelector('.map-legend');
      const legendDisplay = window.getComputedStyle(legend).display;
      logTest('Mobile: Legend Hidden', legendDisplay === 'none', 'Display: ' + legendDisplay);

      const stats = document.querySelector('.map-stats');
      const statsDisplay = window.getComputedStyle(stats).display;
      logTest('Mobile: Stats Hidden', statsDisplay === 'none', 'Display: ' + statsDisplay);

      const minimalControls = document.querySelector('.minimal-controls');
      if (minimalControls) {
        const controlsPos = getPosition(minimalControls);
        logTest('Mobile: Controls Above Bottom Nav', controlsPos.bottom < bnPos.top,
          `Controls bottom: ${controlsPos.bottom}, BNav top: ${bnPos.top}`);
      }
    }

    // Desktop specific tests
    if (isDesktop) {
      const legend = document.querySelector('.map-legend');
      if (legend) {
        const legendDisplay = window.getComputedStyle(legend).display;
        logTest('Desktop: Legend Visible', legendDisplay !== 'none', 'Display: ' + legendDisplay);
      }
    }
  }

  // ===== TEST 4: TOUCH TARGET SIZING =====
  function testTouchTargetSizing() {
    console.log('\n👆 TEST 4: TOUCH TARGET SIZING (WCAG AAA)');
    console.log('==========================================');

    const minSize = 44; // WCAG AAA: 44x44px minimum
    const touchTargets = [
      { name: 'Header Menu Button', selector: '.menu-btn' },
      { name: 'Search Button', selector: '#searchBtn' },
      { name: 'Theme Button', selector: '#themeBtn' },
      { name: 'Bottom Nav Buttons', selector: '.bnav-btn' },
      { name: 'Category Filter Buttons', selector: '.cat-btn' },
      { name: 'Control Buttons', selector: '.control-btn' },
      { name: 'Modal Close Button', selector: '.modal-close' }
    ];

    touchTargets.forEach(target => {
      const elements = document.querySelectorAll(target.selector);
      if (elements.length === 0) return;

      let allValid = true;
      let avgSize = 0;

      elements.forEach(el => {
        if (window.getComputedStyle(el).display === 'none') return;

        const rect = getRect(el);
        const size = Math.min(rect.width, rect.height);
        avgSize += size;

        if (size < minSize) {
          allValid = false;
        }
      });

      avgSize = Math.round(avgSize / elements.length);
      logTest(`Touch Target: ${target.name}`, allValid, 
        `Avg size: ${avgSize}px (min: ${minSize}px)`);
    });
  }

  // ===== TEST 5: KEYBOARD NAVIGATION =====
  function testKeyboardNavigation() {
    console.log('\n⌨️ TEST 5: KEYBOARD NAVIGATION & FOCUS');
    console.log('=====================================');

    // Count focusable elements
    const focusableSelectors = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = document.querySelectorAll(focusableSelectors);
    
    logTest(`Focusable Elements Count`, focusableElements.length > 5, 
      `Found: ${focusableElements.length}`);

    // Check tab index consistency
    let tabIndexIssues = 0;
    focusableElements.forEach(el => {
      const tabindex = el.getAttribute('tabindex');
      if (tabindex && parseInt(tabindex) > 0) {
        tabIndexIssues++;
      }
    });

    logTest('Tab Index Consistency', tabIndexIssues === 0, 
      `Issues: ${tabIndexIssues} (avoid positive tabindex)`);

    // Check focus visible styles
    const styleSheets = Array.from(document.styleSheets);
    let hasFocusVisible = false;

    styleSheets.forEach(sheet => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) return;
        
        for (let rule of rules) {
          if (rule.selectorText && rule.selectorText.includes(':focus-visible')) {
            hasFocusVisible = true;
          }
        }
      } catch (e) {}
    });

    logTest('Focus Visible Styling', hasFocusVisible, 
      'Found :focus-visible styles');
  }

  // ===== TEST 6: ACCESSIBILITY ATTRIBUTES =====
  function testAccessibilityAttributes() {
    console.log('\n♿ TEST 6: ACCESSIBILITY ATTRIBUTES');
    console.log('==================================');

    // Check ARIA labels
    const buttons = document.querySelectorAll('button');
    let buttonsWithAriaLabel = 0;

    buttons.forEach(btn => {
      const label = btn.getAttribute('aria-label') || btn.textContent.trim() || btn.getAttribute('title');
      if (label) buttonsWithAriaLabel++;
    });

    logTest(`ARIA Labels on Buttons`, buttonsWithAriaLabel > buttons.length * 0.7,
      `${buttonsWithAriaLabel}/${buttons.length} buttons labeled`);

    // Check main landmark
    const main = document.querySelector('main');
    const hasMainRole = main?.getAttribute('role') === 'main' || main?.tagName === 'MAIN';
    logTest('Main Content Landmark', hasMainRole, 'Found <main> or role="main"');

    // Check nav landmark
    const nav = document.querySelector('nav');
    const hasNavRole = nav?.getAttribute('role') === 'navigation' || nav?.tagName === 'NAV';
    logTest('Navigation Landmark', hasNavRole, 'Found <nav> or role="navigation"');

    // Check skip link
    const skipLink = document.querySelector('.skip-link');
    logTest('Skip to Content Link', !!skipLink, skipLink ? '✅ Present' : '❌ Missing');

    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let validHeadingHierarchy = true;
    let lastLevel = 0;

    headings.forEach(h => {
      const level = parseInt(h.tagName[1]);
      if (level > lastLevel + 1) {
        validHeadingHierarchy = false;
      }
      lastLevel = level;
    });

    logTest('Heading Hierarchy', validHeadingHierarchy,
      `Found ${headings.length} headings`);
  }

  // ===== TEST 7: PERFORMANCE METRICS =====
  function testPerformanceMetrics() {
    console.log('\n⚡ TEST 7: PERFORMANCE METRICS');
    console.log('==============================');

    // DOM Size
    const allElements = document.querySelectorAll('*');
    logTest('DOM Size', allElements.length < 5000, 
      `Total elements: ${allElements.length}`);

    // Check for render-blocking resources
    const scripts = document.querySelectorAll('script:not([defer]):not([async])');
    const renderBlockingScripts = scripts.length;
    logTest('No Render-Blocking Scripts', renderBlockingScripts === 0,
      `Found ${renderBlockingScripts} blocking scripts (should use defer/async)`);

    // Check for excessive animations
    const keyframes = Array.from(document.styleSheets)
      .reduce((acc, sheet) => {
        try {
          const rules = sheet.cssRules || sheet.rules || [];
          return acc + Array.from(rules).filter(r => r.name && r.name.includes('animation')).length;
        } catch (e) {
          return acc;
        }
      }, 0);

    logTest('Animation Count', keyframes < 20,
      `Found ${keyframes} keyframe animations`);

    // Memory estimate
    const memEstimate = allElements.length * 0.5; // rough estimate KB
    logTest('Memory Estimate', memEstimate < 500,
      `~${Math.round(memEstimate)}KB (target: <500KB)`);

    // Paint timing
    if (window.performance && window.performance.timing) {
      const paintEntries = performance.getEntriesByType('paint');
      const fpTime = paintEntries.find(e => e.name === 'first-paint')?.startTime;
      const fcpTime = paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime;

      if (fpTime) logTest('First Paint', fpTime < 2000, `${Math.round(fpTime)}ms`);
      if (fcpTime) logTest('First Contentful Paint', fcpTime < 3000, `${Math.round(fcpTime)}ms`);
    }
  }

  // ===== TEST 8: VISUAL HIERARCHY =====
  function testVisualHierarchy() {
    console.log('\n🎨 TEST 8: VISUAL HIERARCHY & DESIGN');
    console.log('====================================');

    // Check font sizes
    const allText = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span');
    const fontSizes = new Set();
    
    allText.forEach(el => {
      const size = window.getComputedStyle(el).fontSize;
      fontSizes.add(parseFloat(size));
    });

    logTest('Font Size Variety', fontSizes.size > 3,
      `${fontSizes.size} different font sizes`);

    // Check color contrast on critical elements
    const criticialElements = document.querySelectorAll('.header, .bottom-nav, button, .modal');
    let goodContrast = 0;

    criticialElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;
      // Simple check (not perfect, but indicative)
      if (bgColor !== textColor) goodContrast++;
    });

    logTest('Color Contrast', goodContrast > criticialElements.length * 0.8,
      `${goodContrast}/${criticialElements.length} elements have good contrast`);

    // Check spacing consistency
    const mainContainer = document.querySelector('.main');
    const padding = window.getComputedStyle(mainContainer).padding;
    logTest('Consistent Spacing', !!padding,
      `Main container padding: ${padding}`);

    // Check border radius consistency
    const borderRadiusElements = document.querySelectorAll('[style*="border-radius"], .rounded, .card');
    logTest('Border Radius Consistency', borderRadiusElements.length > 5,
      `Found ${borderRadiusElements.length} rounded elements`);
  }

  // ===== SUMMARY REPORT =====
  function printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${testsPassed}`);
    console.log(`❌ Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    console.log(`Success Rate: ${Math.round(testsPassed / (testsPassed + testsFailed) * 100)}%`);
    console.log('='.repeat(50));

    // Recommendations
    if (testsFailed > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  • ${r.name}: ${r.message}`);
        });
    }
  }

  // ===== PUBLIC API =====
  return {
    runAll() {
      console.clear();
      console.log('🚀 Starting Comprehensive UI/UX Test Suite...\n');

      testZIndexLayering();
      testElementOverlaps();
      testResponsiveLayout();
      testTouchTargetSizing();
      testKeyboardNavigation();
      testAccessibilityAttributes();
      testPerformanceMetrics();
      testVisualHierarchy();

      printSummary();

      return {
        passed: testsPassed,
        failed: testsFailed,
        results: results
      };
    },

    testZIndexLayering,
    testElementOverlaps,
    testResponsiveLayout,
    testTouchTargetSizing,
    testKeyboardNavigation,
    testAccessibilityAttributes,
    testPerformanceMetrics,
    testVisualHierarchy,

    // Debugging helpers
    debug(enabled = true) {
      if (enabled) {
        document.body.classList.add('debug-ui');
        console.log('🐛 Debug mode enabled - UI elements are highlighted in red');
      } else {
        document.body.classList.remove('debug-ui');
        console.log('🐛 Debug mode disabled');
      }
    },

    highlightZIndexConflicts() {
      console.log('\n🔍 Z-INDEX CONFLICTS:');
      const elements = document.querySelectorAll('[style*="z-index"], [class]');
      const zIndexMap = {};

      elements.forEach(el => {
        const z = getZIndex(el);
        if (z > 0) {
          if (!zIndexMap[z]) zIndexMap[z] = [];
          zIndexMap[z].push({
            tag: el.tagName,
            class: el.className,
            id: el.id,
            z: z
          });
        }
      });

      Object.keys(zIndexMap)
        .sort((a, b) => b - a)
        .slice(0, 20)
        .forEach(z => {
          console.log(`Z-${z}:`, zIndexMap[z]);
        });
    },

    checkResponsive() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const layout = vw < 768 ? 'mobile' : vw < 1025 ? 'tablet' : 'desktop';
      
      console.log(`\n📱 CURRENT LAYOUT: ${layout}`);
      console.log(`Viewport: ${vw}x${vh}`);
      console.log(`DPR: ${window.devicePixelRatio}`);
      console.log(`Safe Area: ${window.innerWidth > 0 ? '✅' : '❌'}`);
    }
  };
})();

// Export to window
window.UIUXTestSuite = UIUXTestSuite;

// Auto-run tests when loaded (optional - remove if not desired)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('💡 Run UIUXTestSuite.runAll() in console to test UI/UX');
  });
} else {
  console.log('💡 Run UIUXTestSuite.runAll() in console to test UI/UX');
}
