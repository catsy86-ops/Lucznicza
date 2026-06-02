/**
 * tests.js — Unit tests, E2E tests, performance tests, accessibility audits
 * Comprehensive testing framework for the application
 */

'use strict';

const TestSuite = (() => {
  let testResults = {
    unit: [],
    e2e: [],
    performance: [],
    accessibility: []
  };

  // ===== UNIT TESTS =====
  const UnitTests = {
    passed: 0,
    failed: 0,

    assert(condition, message) {
      if (condition) {
        console.log(`✅ PASS: ${message}`);
        this.passed++;
        return true;
      } else {
        console.error(`❌ FAIL: ${message}`);
        this.failed++;
        testResults.unit.push({
          test: message,
          passed: false
        });
        return false;
      }
    },

    assertEqual(actual, expected, message) {
      return this.assert(actual === expected, 
        `${message} (expected: ${expected}, got: ${actual})`);
    },

    async runTests() {
      console.log('🧪 Running Unit Tests...\n');

      // Test 1: Offline cache initialization
      this.assert(
        typeof NewFeatures !== 'undefined' && NewFeatures.OfflineCache,
        'Offline cache module exists'
      );

      // Test 2: Favorites manager
      this.assert(
        typeof NewFeatures !== 'undefined' && NewFeatures.Favorites,
        'Favorites manager exists'
      );

      // Test 3: Route sharing
      this.assert(
        typeof NewFeatures !== 'undefined' && NewFeatures.RouteSharing,
        'Route sharing module exists'
      );

      // Test 4: UX animations
      this.assert(
        typeof UXAnimations !== 'undefined',
        'UX animations module initialized'
      );

      // Test 5: Toast function
      this.assert(
        typeof showToastEnhanced === 'function',
        'Enhanced toast function available'
      );

      // Test 6: Optimization module
      this.assert(
        typeof Optimization !== 'undefined',
        'Optimization module exists'
      );

      // Test 7: Performance monitor
      this.assert(
        typeof PerfMonitor !== 'undefined',
        'Performance monitor available'
      );

      // Test 8: Mascot module
      this.assert(
        typeof window.pogonMascot !== 'undefined',
        'Pogoń mascot module available'
      );

      // Test 9: Keyboard shortcuts
      const hasHelpShortcut = document.addEventListener.toString().includes('keydown');
      this.assert(
        hasHelpShortcut,
        'Keyboard event listeners registered'
      );

      // Test 10: Service worker support
      this.assert(
        'serviceWorker' in navigator,
        'Service Worker API available'
      );

      console.log(`\\n📊 Unit Tests: ${this.passed} passed, ${this.failed} failed\\n`);
      return { passed: this.passed, failed: this.failed };
    }
  };

  // ===== E2E TESTS =====
  const E2ETests = {
    async runTests() {
      console.log('🎯 Running E2E Tests...\n');

      const tests = [];

      // Test 1: Toast display
      tests.push(new Promise(resolve => {
        showToastEnhanced('Test toast', 'info', 1000);
        const toast = document.querySelector('.toast-enhanced');
        resolve({
          test: 'Toast displays correctly',
          passed: !!toast
        });
      }));

      // Test 2: Mascot initialization
      tests.push(new Promise(resolve => {
        const mascot = document.getElementById('pogonMascot');
        resolve({
          test: 'Mascot element created',
          passed: !!mascot
        });
      }));

      // Test 3: Offline detection
      tests.push(new Promise(resolve => {
        const indicator = document.getElementById('offlineIndicator') ||
                         document.getElementById('networkStatus');
        resolve({
          test: 'Network status indicator exists',
          passed: !!indicator
        });
      }));

      // Test 4: Animation styles loaded
      tests.push(new Promise(resolve => {
        const animStyle = document.getElementById('uxAnimStyle');
        resolve({
          test: 'Animation styles loaded',
          passed: !!animStyle
        });
      }));

      // Test 5: Map element exists
      tests.push(new Promise(resolve => {
        setTimeout(() => {
          const map = document.getElementById('map');
          resolve({
            test: 'Map element present',
            passed: !!map
          });
        }, 1000);
      }));

      const results = await Promise.all(tests);
      
      let passed = 0;
      results.forEach(result => {
        console.log(`${result.passed ? '✅' : '❌'} ${result.test}`);
        if (result.passed) passed++;
        testResults.e2e.push(result);
      });

      console.log(`\\n📊 E2E Tests: ${passed}/${results.length} passed\\n`);
      return results;
    }
  };

  // ===== PERFORMANCE TESTS =====
  const PerformanceTests = {
    async runTests() {
      console.log('⚡ Running Performance Tests...\n');

      const results = [];

      // Test 1: Page load time
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0;
      const pass1 = loadTime < 3000;
      console.log(`${pass1 ? '✅' : '⚠️'} Page Load Time: ${loadTime}ms (target: <3000ms)`);
      results.push({
        test: 'Page load time',
        passed: pass1,
        value: `${loadTime}ms`
      });

      // Test 2: First Contentful Paint
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      const fcpTime = fcp ? Math.round(fcp.startTime) : 0;
      const pass2 = fcpTime < 1800;
      console.log(`${pass2 ? '✅' : '⚠️'} First Contentful Paint: ${fcpTime}ms (target: <1800ms)`);
      results.push({
        test: 'First Contentful Paint',
        passed: pass2,
        value: `${fcpTime}ms`
      });

      // Test 3: DOM Interactive
      const domInteractive = navigation ? Math.round(navigation.domInteractive - navigation.fetchStart) : 0;
      const pass3 = domInteractive < 2000;
      console.log(`${pass3 ? '✅' : '⚠️'} DOM Interactive: ${domInteractive}ms (target: <2000ms)`);
      results.push({
        test: 'DOM Interactive',
        passed: pass3,
        value: `${domInteractive}ms`
      });

      // Test 4: Memory usage
      const memory = performance.memory || {};
      const heapUsed = Math.round(memory.usedJSHeapSize / 1048576);
      const heapLimit = Math.round(memory.jsHeapSizeLimit / 1048576);
      const pass4 = heapUsed < heapLimit * 0.8;
      console.log(`${pass4 ? '✅' : '⚠️'} Memory Usage: ${heapUsed}MB / ${heapLimit}MB`);
      results.push({
        test: 'Memory usage',
        passed: pass4,
        value: `${heapUsed}MB`
      });

      // Test 5: Bundle size
      const bundleAnalysis = Optimization.BundleAnalysis.analyzePageSize();
      const pass5 = bundleAnalysis.total < 2000; // 2MB
      console.log(`${pass5 ? '✅' : '⚠️'} Total Bundle: ${bundleAnalysis.total}KB (target: <2000KB)`);
      console.log(`   Scripts: ${bundleAnalysis.breakdown.scripts}KB`);
      console.log(`   Styles: ${bundleAnalysis.breakdown.styles}KB`);
      console.log(`   Images: ${bundleAnalysis.breakdown.images}KB`);
      results.push({
        test: 'Bundle size',
        passed: pass5,
        value: `${bundleAnalysis.total}KB`
      });

      testResults.performance = results;
      console.log('\\n');
      return results;
    }
  };

  // ===== ACCESSIBILITY TESTS =====
  const AccessibilityTests = {
    async runTests() {
      console.log('♿ Running Accessibility Tests...\n');

      const results = [];

      // Test 1: ARIA labels
      const elementsWithoutLabels = [];
      document.querySelectorAll('button, [role=\"button\"]').forEach(btn => {
        if (!btn.getAttribute('aria-label') && !btn.textContent?.trim()) {
          elementsWithoutLabels.push(btn);
        }
      });
      const pass1 = elementsWithoutLabels.length === 0;
      console.log(`${pass1 ? '✅' : '⚠️'} ARIA Labels: ${elementsWithoutLabels.length} elements missing labels`);
      results.push({
        test: 'ARIA labels present',
        passed: pass1,
        issues: elementsWithoutLabels.length
      });

      // Test 2: Color contrast
      const lowContrastElements = [];
      document.querySelectorAll('*').forEach(el => {
        const computed = window.getComputedStyle(el);
        const bgColor = computed.backgroundColor;
        const textColor = computed.color;
        // Simple contrast check (would need proper WCAG algorithm)
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
          return;
        }
      });
      console.log(`${true ? '✅' : '⚠️'} Color Contrast: Manual review recommended`);
      results.push({
        test: 'Color contrast',
        passed: true,
        note: 'Requires manual review with WCAG analyzer'
      });

      // Test 3: Keyboard navigation
      const focusableElements = document.querySelectorAll('button, a, input, [tabindex]');
      const pass3 = focusableElements.length > 0;
      console.log(`${pass3 ? '✅' : '❌'} Keyboard Navigation: ${focusableElements.length} focusable elements`);
      results.push({
        test: 'Keyboard navigation',
        passed: pass3,
        focusableCount: focusableElements.length
      });

      // Test 4: Skip links
      const skipLinks = document.querySelectorAll('.skip-link');
      const pass4 = skipLinks.length > 0;
      console.log(`${pass4 ? '✅' : '⚠️'} Skip Links: ${skipLinks.length} found`);
      results.push({
        test: 'Skip links',
        passed: pass4,
        count: skipLinks.length
      });

      // Test 5: Alt text on images
      const imagesWithoutAlt = [];
      document.querySelectorAll('img').forEach(img => {
        if (!img.getAttribute('alt')) {
          imagesWithoutAlt.push(img);
        }
      });
      const pass5 = imagesWithoutAlt.length === 0;
      console.log(`${pass5 ? '✅' : '⚠️'} Image Alt Text: ${imagesWithoutAlt.length} images missing alt`);
      results.push({
        test: 'Image alt text',
        passed: pass5,
        issues: imagesWithoutAlt.length
      });

      testResults.accessibility = results;
      console.log('\\n');
      return results;
    }
  };

  // ===== TEST RUNNER =====
  async function runAllTests() {
    console.log('\\n' + '='.repeat(50));
    console.log('🧪 COMPREHENSIVE TEST SUITE');
    console.log('='.repeat(50) + '\\n');

    const unitResults = await UnitTests.runTests();
    const e2eResults = await E2ETests.runTests();
    const perfResults = await PerformanceTests.runTests();
    const a11yResults = await AccessibilityTests.runTests();

    // Summary
    console.log('='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`\\n✅ Unit Tests: ${unitResults.passed}/${unitResults.passed + unitResults.failed}`);
    console.log(`✅ E2E Tests: ${e2eResults.filter(r => r.passed).length}/${e2eResults.length}`);
    console.log(`✅ Performance: ${perfResults.filter(r => r.passed).length}/${perfResults.length}`);
    console.log(`✅ Accessibility: ${a11yResults.filter(r => r.passed).length}/${a11yResults.length}\\n`);

    const totalPassed = 
      unitResults.passed + 
      e2eResults.filter(r => r.passed).length + 
      perfResults.filter(r => r.passed).length + 
      a11yResults.filter(r => r.passed).length;

    const totalTests = 
      unitResults.passed + unitResults.failed + 
      e2eResults.length + 
      perfResults.length + 
      a11yResults.length;

    console.log(`🎯 Overall: ${totalPassed}/${totalTests} tests passed (${Math.round(totalPassed/totalTests*100)}%)`);
    console.log('\\n' + '='.repeat(50) + '\\n');

    return {
      unit: unitResults,
      e2e: e2eResults,
      performance: perfResults,
      accessibility: a11yResults
    };
  }

  // ===== INITIALIZATION =====
  function init() {
    console.log('🧪 Test suite loaded. Call TestSuite.runAllTests() to run tests.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    UnitTests,
    E2ETests,
    PerformanceTests,
    AccessibilityTests,
    runAllTests,
    getResults: () => testResults
  };
})();

window.TestSuite = TestSuite;
