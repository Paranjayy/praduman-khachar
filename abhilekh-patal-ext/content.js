// ═══════════════════════════════════════════════════════════════
//  Abhilekh Patal Classic Restorer v3.0
//  Strategy:
//    1. On itemdetails page: scan DOM for an embedded <iframe> or
//       <embed> pointing to the real PDF — then fetch as blob.
//    2. On search results: add Quick View (inline iframe) + smart download.
//    3. Smart download v3: watches the inline iframe's src, then extracts
//       the real PDF URL from the Angular app's network requests via
//       chrome.webRequest (background) OR from the iframe's DOM directly.
//    4. Fallback: open a print-friendly page in a new tab with instructions.
//    5. Pagination: replaces infinite scroll with Load More button.
// ═══════════════════════════════════════════════════════════════

const AP_STYLE = `
  .ap-btn-group { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; align-items: center; }
  .ap-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 4px; font-size: 13px;
    font-weight: 600; cursor: pointer; border: none;
    transition: opacity .2s, transform .1s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .ap-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .ap-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .ap-btn-view { background: #8b1a1a; color: #fff; }
  .ap-btn-dl { background: #1a5c28; color: #fff; }
  .ap-btn-print { background: #444; color: #fff; }
  .ap-btn-dl.loading { background: #666; }
  .ap-iframe-wrap {
    margin-top: 12px; border: 2px solid #8b1a1a;
    overflow: hidden; animation: apSlideIn .25s ease;
    width: 100%; position: relative;
  }
  @keyframes apSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .ap-iframe-wrap iframe { width: 100%; height: 640px; border: none; display: block; }
  .ap-iframe-hint {
    background: #f0f0f0; border-top: 1px solid #ddd;
    padding: 8px 12px; font-size: 12px; color: #555;
    display: flex; align-items: center; gap: 8px;
  }
  .ap-toast {
    position: fixed; bottom: 24px; right: 24px;
    background: #1a1a2e; color: #fff; padding: 12px 20px;
    border-radius: 6px; font-size: 13px; z-index: 99999;
    animation: apToastIn .2s ease; max-width: 340px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    border-left: 4px solid #8b1a1a;
  }
  @keyframes apToastIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .ap-dl-progress {
    position: fixed; bottom: 80px; right: 24px;
    background: #fff; border: 2px solid #1a5c28; color: #1a5c28;
    padding: 10px 16px; border-radius: 6px; font-size: 12px;
    font-weight: 600; z-index: 99999;
    animation: apToastIn .2s ease;
  }
  .ap-detail-banner {
    background: linear-gradient(135deg, #8b1a1a08, #1a5c2808);
    border: 1.5px solid #8b1a1a33; border-radius: 6px;
    padding: 12px 16px; margin: 12px 0;
    display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  }
  .ap-detail-banner-title { font-weight: 700; font-size: 14px; color: #222; flex: 1; }
  .ap-detail-banner-sub { font-size: 12px; color: #666; width: 100%; margin-top: 2px; }
`;

let _styleInjected = false;
function injectStyles() {
  if (_styleInjected) return;
  _styleInjected = true;
  const s = document.createElement('style');
  s.id = 'ap-classic-style';
  s.textContent = AP_STYLE;
  document.head.appendChild(s);
}

function showToast(msg, duration = 3500) {
  const t = document.createElement('div');
  t.className = 'ap-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ── Extract real PDF URL from various page structures ─────────────────────────
function extractPdfUrlFromHtml(html) {
  // Try many patterns: Angular environment, PDF.js viewer, API URLs, etc.
  const patterns = [
    /["']([^"']+\.pdf[^"'?#]*)["'?#]/gi,
    /fileUrl['":\s]+["']([^"']+)["']/gi,
    /pdfUrl['":\s]+["']([^"']+)["']/gi,
    /downloadUrl['":\s]+["']([^"']+)["']/gi,
    /src=["']([^"']+readcontent[^"']+)["']/gi,
    /embed[^>]+src=["']([^"']+)["']/gi,
    /["'](https?:\/\/[^"']+\/api\/[^"']+)["']/gi,
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m && m[1]) return m[1];
  }
  return null;
}

// ── Try to get the PDF blob from a URL ────────────────────────────────────────
async function tryFetchPdf(url, title) {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Accept': 'application/pdf,*/*' }
    });
    if (!res.ok) return false;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('pdf') && !ct.includes('octet')) return false;
    
    const blob = await res.blob();
    if (blob.size < 500) return false; // Too small to be real
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(title || 'Abhilekh_Document').replace(/[/\\?%*:|"<>]/g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
    showToast('✅ Download started!');
    return true;
  } catch { return false; }
}

// ── Main download strategy ────────────────────────────────────────────────────
async function smartDownload(viewerUrl, title, openedIframe) {
  showToast('🔍 Locating PDF file…');
  
  // Strategy 1: If we have an open iframe — try to read its contentWindow location
  // (only works if same-origin, but worth trying)
  if (openedIframe) {
    try {
      const iframeSrc = openedIframe.src || openedIframe.getAttribute('src') || '';
      if (iframeSrc && iframeSrc !== viewerUrl) {
        // The iframe was navigated to the actual viewer — check its current URL
        const actualUrl = openedIframe.contentWindow?.location?.href;
        if (actualUrl && actualUrl.includes('pdf')) {
          if (await tryFetchPdf(actualUrl, title)) return;
        }
      }
    } catch { /* cross-origin, expected */ }
  }

  // Strategy 2: Fetch the viewer page HTML and parse for PDF URLs
  try {
    const res = await fetch(viewerUrl, { credentials: 'include' });
    const html = await res.text();
    const pdfUrl = extractPdfUrlFromHtml(html);
    if (pdfUrl) {
      const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `https://www.abhilekh-patal.in${pdfUrl}`;
      if (await tryFetchPdf(fullUrl, title)) return;
    }
    
    // Strategy 3: Extract item ID and try known API endpoints
    const idPatterns = [
      /itemId=([^&]+)/i, /itemtend=([^&]+)/i, /\/item\/([^/?&]+)/i,
      /itemId=([^&"' ]+)/i, /itemID=([^&"' ]+)/i
    ];
    let itemId = null;
    for (const p of idPatterns) {
      const m = viewerUrl.match(p) || html.match(p);
      if (m) { itemId = m[1]; break; }
    }
    
    if (itemId) {
      const endpoints = [
        `https://www.abhilekh-patal.in/api/v1/items/${itemId}/download`,
        `https://www.abhilekh-patal.in/api/item/download?id=${itemId}`,
        `https://www.abhilekh-patal.in/category/item/download/${itemId}`,
        `https://www.abhilekh-patal.in/downloadItem?itemId=${itemId}`,
        `https://www.abhilekh-patal.in/api/download/${itemId}`,
        `https://www.abhilekh-patal.in/item/${itemId}.pdf`,
      ];
      for (const ep of endpoints) {
        if (await tryFetchPdf(ep, title)) return;
      }
    }
  } catch { /* network error */ }

  // Strategy 4: Open the viewer in a new tab with a helper overlay
  showToast('⚠️ Direct PDF blocked by server security. Opening document viewer…', 5000);
  const newTab = window.open(viewerUrl, '_blank');
  if (newTab) {
    // Inject helper overlay after load
    newTab.addEventListener?.('load', () => {
      try {
        const overlay = newTab.document.createElement('div');
        overlay.style.cssText = `
          position: fixed; bottom: 20px; right: 20px; z-index: 99999;
          background: #1a1a2e; color: white; padding: 16px 20px;
          border-radius: 8px; font-size: 14px; max-width: 300px;
          border-left: 4px solid #c0392b; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          font-family: sans-serif;
        `;
        overlay.innerHTML = `<strong>💡 To save this PDF:</strong><br>Press <kbd style="background:#333;padding:2px 6px;border-radius:3px">Ctrl+P</kbd> (Win) or <kbd style="background:#333;padding:2px 6px;border-radius:3px">⌘+P</kbd> (Mac) → Save as PDF. <button onclick="this.parentNode.remove()" style="position:absolute;top:6px;right:8px;background:none;border:none;color:white;cursor:pointer;font-size:16px">✕</button>`;
        newTab.document.body?.appendChild(overlay);
      } catch { /* cross-origin */ }
    });
  }
}

// ── Inline viewer toggle ──────────────────────────────────────────────────────
let _activeIframe = null;
function toggleInlineViewer(url, btnGroup) {
  const existing = btnGroup.querySelector('.ap-iframe-wrap');
  if (existing) { existing.remove(); _activeIframe = null; return; }
  
  const wrap = document.createElement('div');
  wrap.className = 'ap-iframe-wrap';
  
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.allowFullscreen = true;
  _activeIframe = iframe;
  
  const hint = document.createElement('div');
  hint.className = 'ap-iframe-hint';
  hint.innerHTML = `
    📌 <strong>Tip:</strong> Document loaded in viewer.
    Press <kbd style="background:#ddd;padding:1px 5px;border-radius:2px">⌘+P</kbd> or
    <kbd style="background:#ddd;padding:1px 5px;border-radius:2px">Ctrl+P</kbd>
    in the new tab to save as PDF.
    <a href="${url}" target="_blank" style="margin-left:auto;color:#8b1a1a;font-weight:600;text-decoration:none;font-size:12px">Open in new tab ↗</a>
  `;
  
  wrap.appendChild(iframe);
  wrap.appendChild(hint);
  btnGroup.appendChild(wrap);
}

// ── Build button group for a card ────────────────────────────────────────────
function buildButtonGroup(viewUrl, title) {
  const group = document.createElement('div');
  group.className = 'ap-btn-group';

  const viewBtn = document.createElement('button');
  viewBtn.className = 'ap-btn ap-btn-view';
  viewBtn.innerHTML = '📄 Quick View';
  viewBtn.onclick = (e) => {
    e.preventDefault(); e.stopPropagation();
    toggleInlineViewer(viewUrl, group);
  };

  const dlBtn = document.createElement('button');
  dlBtn.className = 'ap-btn ap-btn-dl';
  dlBtn.innerHTML = '⬇️ Save PDF';
  dlBtn.onclick = async (e) => {
    e.preventDefault(); e.stopPropagation();
    dlBtn.innerHTML = '⏳ Locating…';
    dlBtn.classList.add('loading');
    dlBtn.disabled = true;
    await smartDownload(viewUrl, title, _activeIframe);
    dlBtn.innerHTML = '⬇️ Save PDF';
    dlBtn.classList.remove('loading');
    dlBtn.disabled = false;
  };

  const printBtn = document.createElement('button');
  printBtn.className = 'ap-btn ap-btn-print';
  printBtn.innerHTML = '🖨️ Print/PDF';
  printBtn.title = 'Opens the document in a new tab — use Ctrl+P / ⌘+P to Save as PDF';
  printBtn.onclick = (e) => {
    e.preventDefault(); e.stopPropagation();
    window.open(viewUrl, '_blank');
    showToast('📄 Opened in new tab — use ⌘+P (Mac) or Ctrl+P (Win) → "Save as PDF"', 6000);
  };

  group.appendChild(viewBtn);
  group.appendChild(dlBtn);
  group.appendChild(printBtn);
  return group;
}

// ── Process a search result card ──────────────────────────────────────────────
function processCard(card) {
  if (card.hasAttribute('data-ap-done')) return;
  
  const link = card.querySelector('a[href*="itemdetails"], a[href*="readcontent"]');
  if (!link) return;
  
  card.setAttribute('data-ap-done', '1');
  
  const titleEl = card.querySelector('h2, h3, h4, .item-title, [class*="title"]');
  const title = titleEl?.textContent?.trim() || 'Abhilekh_Document';
  const viewUrl = link.href;

  const group = buildButtonGroup(viewUrl, title);
  
  const readMoreBtn = card.querySelector('[class*="read"], button:not(.ap-btn)');
  if (readMoreBtn) {
    readMoreBtn.parentNode.insertBefore(group, readMoreBtn.nextSibling);
  } else {
    card.appendChild(group);
  }
}

// ── Process itemdetails page ───────────────────────────────────────────────────
function processDetailPage() {
  if (document.getElementById('ap-detail-done')) return;
  
  // Look for the actual embedded PDF viewer or iframe
  const existingIframe = document.querySelector('iframe[src*="pdf"], iframe[src*="readcontent"], embed[src*="pdf"], object[data*="pdf"]');
  
  // Find a good place to inject our banner
  const targets = [
    document.querySelector('.item-detail-title, .record-title, h1, h2'),
    document.querySelector('main, .content-area, [class*="detail"], [class*="record"]'),
    document.querySelector('body'),
  ].filter(Boolean);
  
  const insertTarget = targets[0];
  if (!insertTarget) return;
  
  const titleEl = document.querySelector('h1, h2, .item-title, .record-title');
  const title = titleEl?.textContent?.trim() || document.title.replace(' | Abhilekh Patal', '').trim();
  
  const viewUrl = window.location.href;
  
  const banner = document.createElement('div');
  banner.className = 'ap-detail-banner';
  banner.id = 'ap-detail-done';
  
  const titleSpan = document.createElement('span');
  titleSpan.className = 'ap-detail-banner-title';
  titleSpan.textContent = '📚 Abhilekh Patal — Quick Actions';
  
  const sub = document.createElement('span');
  sub.className = 'ap-detail-banner-sub';
  
  if (existingIframe) {
    sub.textContent = `PDF viewer detected. Use Save PDF to download, or use ⌘+P / Ctrl+P on the page.`;
  } else {
    sub.textContent = `Click Quick View to read inline, or Save PDF to download. Use ⌘+P as fallback.`;
  }
  
  const group = buildButtonGroup(viewUrl, title);
  
  // If there's already an embedded PDF iframe, also try to directly download from its src
  if (existingIframe) {
    const pdfSrc = existingIframe.src || existingIframe.getAttribute('data') || '';
    if (pdfSrc && pdfSrc !== viewUrl) {
      const directBtn = document.createElement('button');
      directBtn.className = 'ap-btn ap-btn-dl';
      directBtn.innerHTML = '⬇️ Direct Download';
      directBtn.onclick = async (e) => {
        e.preventDefault();
        directBtn.innerHTML = '⏳ Downloading…';
        directBtn.disabled = true;
        const ok = await tryFetchPdf(pdfSrc, title);
        if (!ok) showToast('⚠️ Direct download blocked. Try Save PDF above.', 4000);
        directBtn.innerHTML = '⬇️ Direct Download';
        directBtn.disabled = false;
      };
      group.insertBefore(directBtn, group.firstChild);
    }
  }
  
  banner.appendChild(titleSpan);
  banner.appendChild(sub);
  banner.appendChild(group);
  
  // Insert before the content, or at top of main
  insertTarget.parentNode?.insertBefore(banner, insertTarget);
}

// ── Pagination (replaces infinite scroll) ────────────────────────────────────
let _paginationSetup = false;
function setupPagination() {
  if (_paginationSetup) return;
  _paginationSetup = true;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const sentinel = e.target;
        // Find Angular's infinite scroll trigger and click it
        const trigger = document.querySelector(
          '[infinitescroll], [infinite-scroll], .cdk-virtual-scroll-viewport, [class*="load-more"]'
        );
        if (trigger) {
          trigger.dispatchEvent(new Event('scroll', { bubbles: true }));
        }
      }
    });
  }, { threshold: 0.5 });
  
  const sentinel = document.createElement('div');
  sentinel.id = 'ap-scroll-sentinel';
  sentinel.style.height = '1px';
  document.body.appendChild(sentinel);
  observer.observe(sentinel);
}

// ── Main processor ────────────────────────────────────────────────────────────
function processPage() {
  injectStyles();
  
  const path = window.location.pathname;
  const isDetailPage = path.includes('itemdetails') || path.includes('readcontent') || path.includes('item-detail');
  
  if (isDetailPage) {
    processDetailPage();
  } else {
    // Search / Explore pages
    const cards = document.querySelectorAll(
      '.item-card, [class*="item-card"], [class*="result-card"], [class*="record-card"], ' +
      '[class*="search-result"], mat-card, .card:has(a[href*="itemdetails"])'
    );
    cards.forEach(processCard);
    setupPagination();
  }
}

// ── SPA navigation detection ──────────────────────────────────────────────────
let _lastUrl = '';
function onUrlChange() {
  if (location.href === _lastUrl) return;
  _lastUrl = location.href;
  _paginationSetup = false;
  setTimeout(processPage, 800); // Wait for Angular to render
}

// Listen for Angular router events
window.addEventListener('popstate', onUrlChange);
window.addEventListener('hashchange', onUrlChange);

// Override pushState / replaceState for SPA navigation
const _origPush = history.pushState.bind(history);
const _origReplace = history.replaceState.bind(history);
history.pushState = (...args) => { _origPush(...args); onUrlChange(); };
history.replaceState = (...args) => { _origReplace(...args); onUrlChange(); };

// Also watch DOM mutations for dynamically added cards
let _mutationTimer = null;
const mutationObserver = new MutationObserver(() => {
  clearTimeout(_mutationTimer);
  _mutationTimer = setTimeout(() => {
    const path = window.location.pathname;
    const isDetailPage = path.includes('itemdetails') || path.includes('readcontent');
    if (!isDetailPage) {
      document.querySelectorAll(
        '.item-card:not([data-ap-done]), [class*="item-card"]:not([data-ap-done]), ' +
        'mat-card:not([data-ap-done])'
      ).forEach(processCard);
    }
  }, 600);
});
mutationObserver.observe(document.body, { childList: true, subtree: true });

// Initial run
setTimeout(processPage, 1200);
