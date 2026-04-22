import './style.css';
import { createLoadingScreen } from './components/loading-screen';
import { renderBundledPortfolio } from './components/bundle-runtime';

window.addEventListener(
  'error',
  (event) => {
    const p = document.body || document.documentElement;
    const d =
      document.getElementById('__bundler_err') || p.appendChild(document.createElement('div'));
    d.id = '__bundler_err';
    d.style.cssText =
      'position:fixed;bottom:12px;left:12px;right:12px;font:12px/1.4 ui-monospace,monospace;background:#2a1215;color:#ff8a80;padding:10px 14px;border-radius:8px;border:1px solid #5c2b2e;z-index:99999;white-space:pre-wrap;max-height:40vh;overflow:auto';
    d.textContent =
      (d.textContent ? `${d.textContent}${String.fromCharCode(10)}` : '') +
      `[bundle] ${event.message || event.type}` +
      (event.filename ? ` (${event.filename.slice(0, 60)}:${event.lineno})` : '');
  },
  true
);

const root = document.querySelector('#app');
const { setStatus } = createLoadingScreen(root);
renderBundledPortfolio(setStatus);
