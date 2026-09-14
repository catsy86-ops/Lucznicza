import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Tester Feedback Module', () => {
  let testerFeedbackContent: string;

  beforeEach(() => {
    const filePath = path.resolve(__dirname, '../../tester-feedback.js');
    testerFeedbackContent = fs.readFileSync(filePath, 'utf-8');
  });

  it('should define TesterFeedback namespace with required methods', () => {
    expect(testerFeedbackContent).toContain('window.TesterFeedback =');
    expect(testerFeedbackContent).toContain('open: openFeedbackModal');
    expect(testerFeedbackContent).toContain('close: closeFeedbackModal');
    expect(testerFeedbackContent).toContain('submit: submitFeedback');
    expect(testerFeedbackContent).toContain('copyToClipboard');
    expect(testerFeedbackContent).toContain('sendViaEmail');
    expect(testerFeedbackContent).toContain('getDiagnosticInfo');
  });

  it('should capture diagnostic metadata (screen, route, user agent, storage)', () => {
    expect(testerFeedbackContent).toContain('window.innerWidth');
    expect(testerFeedbackContent).toContain('window.location.href');
    expect(testerFeedbackContent).toContain('navigator.userAgent');
    expect(testerFeedbackContent).toContain('localStorage.getItem');
    expect(testerFeedbackContent).toContain('appVersion');
  });

  it('should support bug, idea, content, and ux feedback categories', () => {
    expect(testerFeedbackContent).toContain('bug');
    expect(testerFeedbackContent).toContain('idea');
    expect(testerFeedbackContent).toContain('content');
    expect(testerFeedbackContent).toContain('ux');
  });

  it('should be registered in Service Worker cache list', () => {
    const swPath = path.resolve(__dirname, '../../sw.js');
    const swContent = fs.readFileSync(swPath, 'utf-8');
    expect(swContent).toContain('/tester-feedback.js');
  });

  it('should be included in index.html script tags', () => {
    const htmlPath = path.resolve(__dirname, '../../index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    expect(htmlContent).toContain('src="tester-feedback.js"');
  });

  it('should be linked in app.js island action dispatcher', () => {
    const appPath = path.resolve(__dirname, '../../app.js');
    const appContent = fs.readFileSync(appPath, 'utf-8');
    expect(appContent).toContain("case 'feedback':");
    expect(appContent).toContain('TesterFeedback.open()');
  });
});
