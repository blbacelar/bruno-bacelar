import manifest from '../standalone-data/manifest.json';
import extResources from '../standalone-data/ext-resources.json';
import template from '../standalone-data/template.html?raw';

async function decodeManifestEntry(entry) {
  const binaryStr = atob(entry.data);
  const bytes = new Uint8Array(binaryStr.length);

  for (let i = 0; i < binaryStr.length; i += 1) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  if (!entry.compressed) {
    return bytes;
  }

  if (typeof DecompressionStream === 'undefined') {
    console.warn('DecompressionStream is not available, compressed assets may fail.');
    return bytes;
  }

  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  const reader = ds.readable.getReader();

  await writer.write(bytes);
  await writer.close();

  const chunks = [];
  let totalLen = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    totalLen += value.length;
  }

  const finalBytes = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    finalBytes.set(chunk, offset);
    offset += chunk.length;
  }

  return finalBytes;
}

function writeError(err) {
  const p = document.body || document.documentElement;
  const d = document.getElementById('__bundler_err') || p.appendChild(document.createElement('div'));
  d.id = '__bundler_err';
  d.style.cssText = 'position:fixed;bottom:12px;left:12px;right:12px;font:12px/1.4 ui-monospace,monospace;background:#2a1215;color:#ff8a80;padding:10px 14px;border-radius:8px;border:1px solid #5c2b2e;z-index:99999;white-space:pre-wrap;max-height:40vh;overflow:auto';
  d.textContent = (d.textContent ? `${d.textContent}\n` : '') + err;
}

export async function renderBundledPortfolio(setStatus) {
  try {
    const uuids = Object.keys(manifest);
    setStatus(`Unpacking ${uuids.length} assets...`);

    const blobUrls = {};

    await Promise.all(
      uuids.map(async (uuid) => {
        const entry = manifest[uuid];
        try {
          const finalBytes = await decodeManifestEntry(entry);
          blobUrls[uuid] = URL.createObjectURL(new Blob([finalBytes], { type: entry.mime }));
        } catch (error) {
          console.error('Failed to decode asset', uuid, error);
          blobUrls[uuid] = URL.createObjectURL(new Blob([], { type: entry.mime }));
        }
      })
    );

    const resourceMap = {};
    for (const entry of extResources) {
      if (blobUrls[entry.uuid]) {
        resourceMap[entry.id] = blobUrls[entry.uuid];
      }
    }

    setStatus('Rendering...');

    let hydratedTemplate = template;
    for (const uuid of uuids) {
      hydratedTemplate = hydratedTemplate.split(uuid).join(blobUrls[uuid]);
    }

    hydratedTemplate = hydratedTemplate
      .replace(/\s+integrity="[^"]*"/gi, '')
      .replace(/\s+crossorigin="[^"]*"/gi, '');

    const resourceScript = '<script>window.__resources = ' +
      JSON.stringify(resourceMap).split('</' + 'script>').join('<\\/' + 'script>') +
      ';</' + 'script>';

    const headOpen = hydratedTemplate.match(/<head[^>]*>/i);
    if (headOpen) {
      const index = headOpen.index + headOpen[0].length;
      hydratedTemplate =
        hydratedTemplate.slice(0, index) + resourceScript + hydratedTemplate.slice(index);
    }

    const doc = new DOMParser().parseFromString(hydratedTemplate, 'text/html');
    document.documentElement.replaceWith(doc.documentElement);

    const scripts = Array.from(document.scripts);
    for (const oldScript of scripts) {
      const script = document.createElement('script');
      for (const attr of oldScript.attributes) {
        script.setAttribute(attr.name, attr.value);
      }
      script.textContent = oldScript.textContent;

      if ((script.type === 'text/babel' || script.type === 'text/jsx') && script.src) {
        const response = await fetch(script.src);
        script.textContent = await response.text();
        script.removeAttribute('src');
      }

      const waitForLoad = script.src
        ? new Promise((resolve) => {
            script.onload = resolve;
            script.onerror = resolve;
          })
        : null;

      oldScript.replaceWith(script);

      if (waitForLoad) {
        await waitForLoad;
      }
    }

    if (window.Babel && typeof window.Babel.transformScriptTags === 'function') {
      window.Babel.transformScriptTags();
    }
  } catch (error) {
    setStatus(`Error unpacking: ${error.message}`);
    console.error('Bundle unpack error:', error);
    writeError(`[bundle] ${error.message}`);
  }
}
