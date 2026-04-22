export function createLoadingScreen(root) {
  const wrapper = document.createElement('div');
  wrapper.className = 'bundler-loading-root';

  wrapper.innerHTML = `
    <div id="__bundler_thumbnail">
      <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="800" fill="#0A0B0F"></rect>
        <g opacity="0.35">
          <path d="M0 120 H1200 M0 240 H1200 M0 360 H1200 M0 480 H1200 M0 600 H1200 M0 720 H1200" stroke="#1B2E5E" stroke-width="1"></path>
          <path d="M120 0 V800 M240 0 V800 M360 0 V800 M480 0 V800 M600 0 V800 M720 0 V800 M840 0 V800 M960 0 V800 M1080 0 V800" stroke="#1B2E5E" stroke-width="1"></path>
        </g>
        <circle cx="300" cy="300" r="6" fill="#C63C2F"></circle>
        <circle cx="900" cy="500" r="8" fill="#C9A45C"></circle>
        <circle cx="600" cy="200" r="5" fill="#3A6EA5"></circle>
        <text x="600" y="440" text-anchor="middle" font-family="Impact, 'Bebas Neue', sans-serif" font-size="180" fill="#E6DCC4" letter-spacing="8">BB.</text>
        <text x="600" y="520" text-anchor="middle" font-family="monospace" font-size="22" fill="#C9A45C" letter-spacing="8">LOADING PORTFOLIO</text>
      </svg>
    </div>
    <div id="__bundler_loading">Unpacking...</div>
  `;

  root.replaceChildren(wrapper);

  const loadingEl = wrapper.querySelector('#__bundler_loading');

  return {
    setStatus(message) {
      if (loadingEl) {
        loadingEl.textContent = message;
      }
    },
  };
}
