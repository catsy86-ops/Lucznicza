/**
 * app-health.js — Application health & diagnostics dashboard
 * Monitors API availability, data freshness, performance metrics
 */
'use strict';

const AppHealth = (() => {
  
  const status = {
    apis: {},
    performance: {},
    dataFreshness: {},
    errors: [],
    lastCheck: null
  };

  const healthThresholds = {
    apiResponseTime: 5000,      // ms
    mapLoadTime: 3000,          // ms
    dataAge: 3600000,           // ms (1 hour)
  };

  function init() {
    checkAPIHealth();
    monitorPerformance();
    setInterval(checkAPIHealth, 60000); // Check every minute
  }

  function checkAPIHealth() {
    // Check if APIs are responding
    const apis = [
      { name: 'ZDITM Departures', url: '/api/zditm-departures', timeout: 3000 },
      { name: 'GIOŚ Air Quality', url: '/api/gios-szczecin', timeout: 3000 },
      { name: 'IMGW Weather', url: '/api/imgw-szczecin', timeout: 3000 },
      { name: '3D Buildings', url: '/api/buildings', timeout: 3000 }
    ];

    apis.forEach(api => {
      const startTime = performance.now();
      fetch(api.url, { signal: AbortSignal.timeout(api.timeout) })
        .then(res => {
          const responseTime = performance.now() - startTime;
          status.apis[api.name] = {
            status: res.ok ? 'healthy' : 'error',
            responseTime: responseTime,
            lastCheck: new Date()
          };
        })
        .catch(err => {
          status.apis[api.name] = {
            status: 'unavailable',
            error: err.message,
            lastCheck: new Date()
          };
        });
    });

    status.lastCheck = new Date();
  }

  function monitorPerformance() {
    if (!window.performance) return;

    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
      status.performance = {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        navigationTime: perfData.responseEnd - perfData.fetchStart,
        timestamp: new Date()
      };
    }

    // Track Core Web Vitals if available
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          status.performance.lcp = Math.round(lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) { /* not supported */ }

      // FID (First Input Delay)
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length) {
            status.performance.fid = Math.round(entries[0].processingStart - entries[0].startTime);
          }
        }).observe({ type: 'first-input', buffered: true });
      } catch (e) { /* not supported */ }

      // CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          status.performance.cls = Math.round(clsValue * 1000) / 1000;
        }).observe({ type: 'layout-shift', buffered: true });
      } catch (e) { /* not supported */ }
    }
  }

  function getHealthStatus() {
    // Check data freshness
    const now = Date.now();
    status.dataFreshness = {
      places: APP_DATA && APP_DATA.places ? APP_DATA.places.length + ' loaded' : 'Not loaded',
      routes: APP_DATA && APP_DATA.routes ? APP_DATA.routes.length + ' loaded' : 'Not loaded',
      timestamp: new Date()
    };

    // Check for errors in localStorage
    try {
      const errors = JSON.parse(localStorage.getItem('lucznicza_errors') || '[]');
      status.errors = errors.slice(-5); // Last 5 errors
    } catch (e) {
      status.errors = [];
    }

    return {
      healthy: isHealthy(),
      apiStatus: getAPIStatus(),
      performanceStatus: getPerformanceStatus(),
      dataStatus: status.dataFreshness,
      lastCheck: status.lastCheck,
      errors: status.errors
    };
  }

  function isHealthy() {
    const apisHealthy = Object.values(status.apis).filter(a => a.status === 'healthy').length > 0;
    const perfOk = (status.performance.navigationTime || 0) < healthThresholds.mapLoadTime;
    return apisHealthy && perfOk && status.errors.length === 0;
  }

  function getAPIStatus() {
    const apiStatuses = {};
    for (const [name, info] of Object.entries(status.apis)) {
      apiStatuses[name] = {
        status: info.status || 'unknown',
        responseTime: info.responseTime || 'N/A',
        healthy: info.status === 'healthy' && (info.responseTime || Infinity) < healthThresholds.apiResponseTime
      };
    }
    return apiStatuses;
  }

  function getPerformanceStatus() {
    return {
      isGood: (status.performance.navigationTime || Infinity) < healthThresholds.mapLoadTime,
      metrics: status.performance
    };
  }

  function displayHealthDashboard() {
    const health = getHealthStatus();
    const html = `
      <div class="health-dashboard">
        <div class="hd-header">
          <span class="hd-title">🏥 Diagnostyka Aplikacji</span>
          <span class="hd-status ${health.healthy ? 'healthy' : 'unhealthy'}">
            ${health.healthy ? '✅ Wszystko OK' : '⚠️ Problemy'}
          </span>
        </div>

        <div class="hd-section">
          <h4>📡 API</h4>
          <div class="hd-apis">
            ${Object.entries(health.apiStatus).map(([name, info]) => `
              <div class="hd-api-item">
                <span class="hd-status-icon ${info.healthy ? 'ok' : 'error'}">
                  ${info.healthy ? '✓' : '✗'}
                </span>
                <span class="hd-name">${name}</span>
                <span class="hd-time">${info.responseTime !== 'N/A' ? Math.round(info.responseTime) + 'ms' : 'N/A'}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="hd-section">
          <h4>⚡ Wydajność</h4>
          <div class="hd-perf">
            ${health.performanceStatus.metrics.navigationTime ? `
              <div class="hd-perf-item">
                <span>Load Time</span>
                <span>${Math.round(health.performanceStatus.metrics.navigationTime)}ms</span>
              </div>
            ` : ''}
            ${health.performanceStatus.metrics.lcp ? `
              <div class="hd-perf-item">
                <span>LCP</span>
                <span>${Math.round(health.performanceStatus.metrics.lcp)}ms</span>
              </div>
            ` : ''}
            ${health.performanceStatus.metrics.fid ? `
              <div class="hd-perf-item">
                <span>FID</span>
                <span>${Math.round(health.performanceStatus.metrics.fid)}ms</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="hd-section">
          <h4>📊 Dane</h4>
          <div class="hd-data">
            <div class="hd-data-item">
              <span>📍 Miejsca</span>
              <span>${health.dataStatus.places}</span>
            </div>
            <div class="hd-data-item">
              <span>🚶 Trasy</span>
              <span>${health.dataStatus.routes}</span>
            </div>
          </div>
        </div>

        ${health.errors.length > 0 ? `
          <div class="hd-section hd-errors">
            <h4>⚠️ Ostatnie błędy (${health.errors.length})</h4>
            <div class="hd-error-list">
              ${health.errors.map(e => `
                <div class="hd-error-item">
                  <small>${e.message || 'Unknown error'}</small>
                  <tiny>${new Date(e.timestamp).toLocaleTimeString('pl')}</tiny>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="hd-footer">
          <small>Ostatnia weryfikacja: ${new Date(health.lastCheck).toLocaleTimeString('pl')}</small>
        </div>
      </div>
    `;

    // Show as modal or panel
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:500px">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        <div class="modal-content">${html}</div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // Public API
  return {
    init,
    getHealthStatus,
    displayHealthDashboard,
    checkAPIHealth,
    monitorPerformance
  };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    AppHealth.init();
  }, 2000);
});

// Expose to window
window.AppHealth = AppHealth;
