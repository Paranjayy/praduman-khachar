// ═══════════════════════════════════════════════════════
//  Abhilekh Patal Classic Restorer v2.0
//  - Quick View inline iframe
//  - Brute-force PDF download (fetches blob, saves file)
//  - Works on search results AND item detail pages
//  - Replaces infinite scroll with pagination button
// ═══════════════════════════════════════════════════════

const AP_STYLE = `
  .ap-btn-group { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
  .ap-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 4px; font-size: 13px;
    font-weight: 600; cursor: pointer; border: none;
    transition: opacity .2s, transform .1s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .ap-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .ap-btn-view { background: #8b1a1a; color: #fff; }
  .ap-btn-dl { background: #1a5c28; color: #fff; }
  .ap-btn-dl.loading { background: #555; }
  .ap-iframe-wrap {
    margin-top: 12px; border: 2px solid #8b1a1a;
    border-radius: 4px; overflow: hidden;
    animation: apSlideIn .25s ease;
  }
  @keyframes apSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .ap-iframe-wrap iframe { width: 100%; height: 600px; border: none; display: block; }
  .ap-toast {
    position: fixed; bottom: 24px; right: 24px;
    background: #222; color: #fff; padding: 10px 18px;
    border-radius: 6px; font-size: 13px; z-index: 99999;
    animation: apToastIn .2s ease;
  }
  @keyframes apToastIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform:translateY(0); } }
`;

// Inject styles once
function injectStyles() {
  if (document.getElementById('ap-classic-style')) return;
  const s = document.createElement('style');
  s.id = 'ap-classic-style';
  s.textContent = AP_STYLE;
  document.head.appendChild(s);
}

function showToast(msg, duration = 3000) {
  const t = document.createElement('div');
  t.className = 'ap-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ── Brute-force PDF download ──────────────────────────────────────────────────
// Strategy: navigate to the readcontent URL and grab the PDF src from the iframe
async function bruteForceDownload(viewerUrl, title) {
  showToast('⏳ Preparing download…', 5000);
  
  try {
    // The viewer URL pattern: /category/itemdetails/readcontent?itemId=...
    // The PDF is served inline inside the Angular viewer app
    // We can try fetching the page and parsing out the PDF URL
    const res = await fetch(viewerUrl, { credentials: 'include' });
    const html = await res.text();
    
    // Look for PDF src in the HTML
    const pdfMatch = html.match(/src=["']([^"']*\.pdf[^"']*)['"]/i) ||
                     html.match(/file=["']([^"']*)['"]/i) ||
                     html.match(/"pdfUrl":"([^"]+)"/i) ||
                     html.match(/"fileUrl":"([^"]+)"/i);
    
    if (pdfMatch && pdfMatch[1]) {
      const pdfUrl = pdfMatch[1].startsWith('http') ? pdfMatch[1] : `https://abhilekh-patal.in${pdfMatch[1]}`;
      await downloadBlob(pdfUrl, title);
      return;
    }

    // Fallback: try common PDF URL patterns based on item ID
    const itemIdMatch = viewerUrl.match(/itemId=([^&]+)/i) || viewerUrl.match(/itemtend=([^&]+)/i);
    if (itemIdMatch) {
      const itemId = itemIdMatch[1];
      const candidates = [
        `https://abhilekh-patal.in/api/item/${itemId}/download`,
        `https://abhilekh-patal.in/category/item/${itemId}.pdf`,
        `https://abhilekh-patal.in/download/${itemId}`,
      ];
      for (const url of candidates) {
        try {
          const r = await fetch(url, { method: 'HEAD', credentials: 'include' });
          if (r.ok && r.headers.get('content-type')?.includes('pdf')) {
            await downloadBlob(url, title);
            return;
          }
        } catch (_) {}
      }
    }

    // Last resort: open the viewer page directly
    showToast('⚠️ Could not locate PDF file. Opening viewer instead…');
    window.open(viewerUrl, '_blank');
    
  } catch (err) {
    showToast('❌ Download failed. Opening viewer…');
    window.open(viewerUrl, '_blank');
  }
}

async function downloadBlob(url, title) {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('fetch failed');
  const blob = await res.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${title || 'Abhilekh_Document'}.pdf`.replace(/[/\\?%*:|"<>]/g, '-');
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  showToast('✅ Download started!');
}

// ── Inline viewer ─────────────────────────────────────────────────────────────
function toggleInlineViewer(url, btnGroup) {
  const existing = btnGroup.querySelector('.ap-iframe-wrap');
  if (existing) { existing.remove(); return; }
  
  const wrap = document.createElement('div');
  wrap.className = 'ap-iframe-wrap';
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.allowFullscreen = true;
  wrap.appendChild(iframe);
  btnGroup.appendChild(wrap);
}

// ── Inject buttons on a card ──────────────────────────────────────────────────
function processCard(card) {
  if (card.hasAttribute('data-ap-done')) return;
  
  const link = card.querySelector('a[href*="itemdetails"], a[href*="readcontent"]');
  if (!link) return;
  
  card.setAttribute('data-ap-done', '1');
  
  // Get the title for the download filename
  const titleEl = card.querySelector('h2, h3, h4, .title, [class*="title"]');
  const title = titleEl?.textContent?.trim() || 'Abhilekh_Document';
  const viewUrl = link.href;

  const group = document.createElement('div');
  group.className = 'ap-btn-group';

  const viewBtn = document.createElement('button');
  viewBtn.className = 'ap-btn ap-btn-view';
  viewBtn.innerHTML = '📄 Quick View';
  viewBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); toggleInlineViewer(viewUrl, group); };

  const dlBtn = document.createElement('button');
  dlBtn.className = 'ap-btn ap-btn-dl';
  dlBtn.innerHTML = '⬇️ Download PDF';
  dlBtn.onclick = async (e) => {
    e.preventDefault(); e.stopPropagation();
    dlBtn.textContent = '⏳ Finding PDF…';
    dlBtn.classList.add('loading');
    dlBtn.disabled = true;
    await bruteForceDownload(viewUrl, title);
    dlBtn.innerHTML = '⬇️ Download PDF';
    dlBtn.classList.remove('loading');
    dlBtn.disabled = false;
  };

  group.appendChild(viewBtn);
  group.appendChild(dlBtn);
  
  // Try to find a good insertion point
  const readMoreBtn = card.querySelector('[class*="read"], button:not(.ap-btn)');
  if (readMoreBtn) {
    readMoreBtn.parentNode.insertBefore(group, readMoreBtn.nextSibling);
  } else {
    card.appendChild(group);
  }
}

// ── Item detail page ──────────────────────────────────────────────────────────
function processDetailPage() {
  // On the item detail page, inject at the "Read more" button
  const readMoreBtn = document.querySelector('[class*="read-more"], .btn-read-more, button[ng-click*="read"]');
  if (readMoreBtn && !document.getElementById('ap-detail-btns')) {
    const title = document.querySelector('h1, h2, .item-title')?.textContent?.trim() || 'Document';
    const currentUrl = window.location.href;
    // Construct the readcontent URL from the current itemdetails URL
    const viewUrl = currentUrl.replace('itemdetails/itemdetails', 'itemdetails/readcontent')
                              .replace('itemdetails?', 'itemdetails/readcontent?');
    
    const group = document.createElement('div');
    group.id = 'ap-detail-btns';
    group.className = 'ap-btn-group';
    group.style.marginTop = '16px';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'ap-btn ap-btn-view';
    viewBtn.innerHTML = '📄 Quick View (Classic)';
    viewBtn.onclick = () => toggleInlineViewer(viewUrl, group);
    
    const dlBtn = document.createElement('button');
    dlBtn.className = 'ap-btn ap-btn-dl';
    dlBtn.innerHTML = '⬇️ Download PDF';
    dlBtn.onclick = async () => {
      dlBtn.textContent = '⏳ Finding PDF…';
      dlBtn.disabled = true;
      await bruteForceDownload(viewUrl, title);
      dlBtn.innerHTML = '⬇️ Download PDF';
      dlBtn.disabled = false;
    };
    
    group.appendChild(viewBtn);
    group.appendChild(dlBtn);
    readMoreBtn.parentNode.insertBefore(group, readMoreBtn.nextSibling);
  }
}

// ── Also inject on itemdetails page directly (from your screenshot) ────────────
function processDirectItemPage() {
  if (document.getElementById('ap-direct-btns')) return;
  // If URL contains itemdetails, inject buttons near the "Read more" button
  if (!window.location.href.includes('itemdetails')) return;
  
  const readBtn = document.querySelector('a[href*="readcontent"], button[ng-click*="readcontent"]');
  if (!readBtn) return;
  
  const title = document.querySelector('h1, h2, h3')?.textContent?.trim() || 'Document';
  const viewUrl = readBtn.href || window.location.href.replace('itemdetails', 'itemdetails/readcontent');
  
  if (document.getElementById('ap-direct-btns')) return;
  
  const group = document.createElement('div');
  group.id = 'ap-direct-btns';
  group.className = 'ap-btn-group';
  group.style.margin = '12px 0';
  
  const viewBtn = document.createElement('button');
  viewBtn.className = 'ap-btn ap-btn-view';
  viewBtn.innerHTML = '📄 Classic Viewer';
  viewBtn.onclick = () => toggleInlineViewer(viewUrl, group);
  
  const dlBtn = document.createElement('button');
  dlBtn.className = 'ap-btn ap-btn-dl';
  dlBtn.innerHTML = '⬇️ Download PDF';
  dlBtn.onclick = async () => {
    dlBtn.textContent = '⏳ Finding PDF…';
    dlBtn.disabled = true;
    await bruteForceDownload(viewUrl, title);
    dlBtn.innerHTML = '⬇️ Download PDF';
    dlBtn.disabled = false;
  };
  
  group.appendChild(viewBtn);
  group.appendChild(dlBtn);
  readBtn.parentNode.insertBefore(group, readBtn.nextSibling);
}

// ── Pagination override ───────────────────────────────────────────────────────
function setupPagination() {
  if (window._apPagination) return;
  
  const loaderEl = document.querySelector('.loader, .loading-spinner, [class*="infinite"]');
  if (!loaderEl || document.getElementById('ap-load-more')) return;
  
  window._apPagination = true;
  
  const btn = document.createElement('button');
  btn.id = 'ap-load-more';
  btn.className = 'ap-btn ap-btn-view';
  btn.style.cssText = 'display:block;margin:20px auto;padding:10px 24px;font-size:14px;';
  btn.innerHTML = '📚 Load More Results';
  btn.onclick = () => {
    loaderEl.click?.();
    window.scrollBy({ top: 50, behavior: 'smooth' });
  };
  
  loaderEl.parentNode.insertBefore(btn, loaderEl);
}

// ── Main init ─────────────────────────────────────────────────────────────────
function init() {
  injectStyles();
  
  // Search results page
  document.querySelectorAll('.item-box, .col-md-12.ng-scope, .result-item, li[ng-repeat], .search-result-item, [class*="item-row"]')
    .forEach(processCard);
  
  // Item detail page
  processDetailPage();
  processDirectItemPage();
  
  // Pagination
  setupPagination();
}

// Run on load and on Angular route changes
init();
setInterval(init, 2500);

// Also hook into Angular's location change for SPA navigation
window.addEventListener('popstate', () => setTimeout(init, 500));
document.addEventListener('click', () => setTimeout(init, 800));
