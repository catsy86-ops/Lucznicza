/**
 * ui-polish-enhancements.js — Advanced UI polishing for better UX
 * Adds: tooltips, smooth transitions, focus states, accessibility improvements
 */
'use strict';

const UIPolishEnhancements = (() => {
  const config = {
    enableTooltips: true,
    enableFocusIndicators: true,
    enableSmoothScroll: true,
    tooltipDelay: 300,
  };

  /**
   * Initialize all UI polish enhancements
   */
  function init() {
    console.log('✨ UI Polish enhancements initializing...');
    
    setupSmartTooltips();
    enhanceFocusIndicators();
    setupSmoothScroll();
    improveTransitions();
    enhanceButtonStates();
    setupKeyboardSupport();
    
    console.log('✨ UI Polish enhancements ready');
  }

  /**
   * Create smart tooltips with automatic positioning
   */
  function setupSmartTooltips() {
    if (!config.enableTooltips) return;

    const tooltipStyle = document.createElement('style');
    tooltipStyle.setAttribute('data-ui-tooltips', 'true');
    tooltipStyle.textContent = `
      /* Tooltip container */
      .ui-tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
        transition: opacity 150ms, transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .ui-tooltip.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      /* Tooltip arrow */
      .ui-tooltip::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background: rgba(0, 0, 0, 0.9);
        transform: rotate(45deg);
        bottom: -3px;
        left: 50%;
        margin-left: -3px;
      }

      /* Tooltip variants */
      .ui-tooltip.success {
        background: rgba(107, 203, 119, 0.9);
      }

      .ui-tooltip.error {
        background: rgba(255, 107, 107, 0.9);
      }

      .ui-tooltip.warning {
        background: rgba(255, 217, 61, 0.9);
      }

      .ui-tooltip.info {
        background: rgba(162, 155, 254, 0.9);
      }

      /* Element with tooltip */
      [data-tooltip] {
        position: relative;
      }
    `;
    document.head.appendChild(tooltipStyle);

    // Setup tooltip triggers
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
      el.addEventListener('mouseenter', () => showTooltip(el));
      el.addEventListener('mouseleave', () => hideTooltip(el));
      el.addEventListener('focus', () => showTooltip(el));
      el.addEventListener('blur', () => hideTooltip(el));
    });

    console.log('🎯 Smart tooltips enabled');
  }

  /**
   * Show tooltip for an element
   */
  function showTooltip(el) {
    const tooltipText = el.getAttribute('data-tooltip');
    if (!tooltipText) return;

    let tooltip = el.querySelector('.ui-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'ui-tooltip';
      tooltip.textContent = tooltipText;
      
      const variant = el.getAttribute('data-tooltip-variant') || 'default';
      if (variant !== 'default') {
        tooltip.classList.add(variant);
      }

      el.appendChild(tooltip);
    }

    setTimeout(() => {
      tooltip.classList.add('visible');
    }, config.tooltipDelay);
  }

  /**
   * Hide tooltip for an element
   */
  function hideTooltip(el) {
    const tooltip = el.querySelector('.ui-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
    }
  }

  /**
   * Enhance focus indicators for keyboard navigation
   */
  function enhanceFocusIndicators() {
    if (!config.enableFocusIndicators) return;

    const focusStyle = document.createElement('style');
    focusStyle.setAttribute('data-ui-focus', 'true');
    focusStyle.textContent = `
      /* Focus ring for keyboard navigation */
      *:focus-visible {
        outline: 2px solid #6c63ff;
        outline-offset: 2px;
        border-radius: 4px;
      }

      button:focus-visible,
      a:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible {
        outline: 3px solid #6c63ff;
        outline-offset: 3px;
      }

      /* Focus state for buttons */
      .bnav-btn:focus-visible {
        outline: 3px solid #6bcb77;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(107, 203, 119, 0.1);
      }

      /* Focus state for interactive elements */
      .map-popup button:focus-visible {
        box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.3);
      }

      /* Reduce outline on mouse focus (only keyboard) */
      :focus:not(:focus-visible) {
        outline: none;
      }
    `;
    document.head.appendChild(focusStyle);

    console.log('⌨️ Enhanced focus indicators enabled');
  }

  /**
   * Setup smooth scroll behavior
   */
  function setupSmoothScroll() {
    if (!config.enableSmoothScroll) return;

    const smoothScrollStyle = document.createElement('style');
    smoothScrollStyle.setAttribute('data-smooth-scroll', 'true');
    smoothScrollStyle.textContent = `
      html {
        scroll-behavior: smooth;
      }

      /* Smooth scroll for sections */
      .places-grid,
      .routes-list,
      .info-cards,
      .events-grid {
        scroll-behavior: smooth;
      }

      /* Instant scroll for performance on low-end devices */
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
      }
    `;
    document.head.appendChild(smoothScrollStyle);

    console.log('🌊 Smooth scroll enabled');
  }

  /**
   * Improve element transitions
   */
  function improveTransitions() {
    const transitionStyle = document.createElement('style');
    transitionStyle.setAttribute('data-ui-transitions', 'true');
    transitionStyle.textContent = `
      /* Default smooth transitions */
      button,
      a,
      input,
      select,
      textarea {
        transition: background-color 150ms, color 150ms, border-color 150ms, 
                    box-shadow 150ms, transform 100ms cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* Hover and active states */
      button:hover {
        transform: translateY(-2px);
      }

      button:active {
        transform: translateY(0);
      }

      /* Disable transitions during click */
      button.clicking {
        transition-duration: 0s;
      }

      /* Card transitions */
      .place-card,
      .route-card,
      .info-card,
      .event-card {
        transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
                    box-shadow 200ms, background 200ms;
      }

      .place-card:hover,
      .route-card:hover,
      .info-card:hover,
      .event-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }

      /* Modal transitions */
      .modal {
        transition: opacity 200ms, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* Sidebar transitions */
      .sidebar {
        transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
                    opacity 300ms;
      }

      /* Bottom nav transitions */
      .bottom-nav {
        transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1),
                    box-shadow 250ms;
      }

      /* Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        * {
          transition-duration: 0s !important;
          animation-duration: 0s !important;
        }
      }
    `;
    document.head.appendChild(transitionStyle);

    console.log('🎬 Improved transitions applied');
  }

  /**
   * Enhance button interactive states
   */
  function enhanceButtonStates() {
    const buttonStyle = document.createElement('style');
    buttonStyle.setAttribute('data-button-states', 'true');
    buttonStyle.textContent = `
      /* Base button styles */
      button {
        position: relative;
        overflow: hidden;
      }

      /* Ripple effect on click */
      button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
        pointer-events: none;
      }

      button:active::before {
        width: 300px;
        height: 300px;
      }

      /* Disabled state */
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
      }

      button:disabled:hover {
        transform: none;
      }

      /* Loading state */
      button.loading {
        pointer-events: none;
        opacity: 0.7;
      }

      button.loading::after {
        content: '';
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-left: 8px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Success state */
      button.success {
        background-color: #6bcb77 !important;
        color: white;
      }

      /* Error state */
      button.error {
        background-color: #ff6b6b !important;
        color: white;
      }
    `;
    document.head.appendChild(buttonStyle);

    console.log('🔘 Enhanced button states applied');
  }

  /**
   * Setup improved keyboard support
   */
  function setupKeyboardSupport() {
    // Tab key navigation enhancement
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav-active');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav-active');
    });

    // Escape key support for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal:not(.hidden)');
        if (modal && typeof closeModal === 'function') {
          closeModal();
        }
      }
    });

    console.log('⌨️ Keyboard support enhanced');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init,
    showTooltip,
    hideTooltip,
  };
})();

window.UIPolishEnhancements = UIPolishEnhancements;
