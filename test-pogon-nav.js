/**
 * test-pogon-nav.js — Test navigation to Pogoń section
 * Run in console: testPogonNavigation()
 */

function testPogonNavigation() {
  console.log('🧪 Testing Pogoń Navigation...');
  
  const tests = [];
  
  // Test 1: Check section exists
  const section = document.getElementById('section-pogon');
  const t1 = !!section;
  tests.push(t1);
  console.log(`${t1 ? '✅' : '❌'} Section #section-pogon exists`);
  
  // Test 2: Check nav button exists
  const navBtn = document.querySelector('[data-section="pogon"]');
  const t2 = !!navBtn;
  tests.push(t2);
  console.log(`${t2 ? '✅' : '❌'} Navigation button exists`);
  
  // Test 3: Navigate to pogon
  if (typeof navigateTo === 'function') {
    try {
      navigateTo('pogon');
      const t3 = document.getElementById('section-pogon').classList.contains('active');
      tests.push(t3);
      console.log(`${t3 ? '✅' : '❌'} navigateTo('pogon') works`);
    } catch (e) {
      tests.push(false);
      console.log(`❌ navigateTo error: ${e.message}`);
    }
  } else {
    tests.push(false);
    console.log('❌ navigateTo function not available');
  }
  
  // Test 4: Check PogonFeature module
  const t4 = typeof window.PogonFeature !== 'undefined';
  tests.push(t4);
  console.log(`${t4 ? '✅' : '❌'} PogonFeature module loaded`);
  
  // Test 5: Check content rendering
  if (t3) {
    const content = section.querySelector('.section-content');
    const hasContent = content && content.children.length > 0;
    tests.push(hasContent);
    console.log(`${hasContent ? '✅' : '❌'} Content rendered (${content?.children.length || 0} children)`);
  } else {
    tests.push(false);
    console.log('⚠️ Section not active, skipping content check');
  }
  
  // Summary
  const passed = tests.filter(t => t).length;
  const total = tests.length;
  console.log(`\n📊 Result: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Pogoń feature is ready.');
  } else {
    console.log(`⚠️ ${total - passed} test(s) failed.`);
  }
  
  return passed === total;
}

// Run test
console.log('💡 Tip: Run testPogonNavigation() in console to test navigation');
