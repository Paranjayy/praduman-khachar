// Abhilekh Patal Classic Restorer Content Script

function init() {
  console.log("Abhilekh Patal Ext: Initializing classic UI...");
  
  // 1. Inline PDF Viewer
  // Look for any links or buttons that open the PDF/Document
  // In the new UI, there is a "Read more" or "Page on Demand" or a thumbnail link.
  // Find buttons or links that might open the viewer
  // Find item containers instead of individual links to avoid duplication
  const itemCards = document.querySelectorAll('.item-box, .col-md-12.ng-scope, .result-item, li[ng-repeat]');
  
  itemCards.forEach(card => {
    // Check if we already injected in this card
    if (card.hasAttribute('data-classic-injected')) return;
    
    // Find a link to the document within this card
    const targetLink = card.querySelector('a[href*="itemdetails"], a[href*="readcontent"]');
    if (!targetLink) return;
    
    const targetUrl = targetLink.href;
    card.setAttribute('data-classic-injected', 'true');
    
    const inlineBtn = document.createElement('button');
    inlineBtn.innerText = "📄 Quick View (Classic)";
    inlineBtn.className = "classic-inline-btn";
    
    const downloadBtn = document.createElement('a');
    downloadBtn.innerText = "⬇️ Open Document";
    downloadBtn.className = "classic-inline-btn classic-dl-btn";
    downloadBtn.style.backgroundColor = "#2d5a27";
    downloadBtn.href = targetUrl;
    downloadBtn.target = "_blank";
    
    inlineBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showInlineViewer(targetUrl, card);
    };
    
    const btnGroup = document.createElement('div');
    btnGroup.style.display = "block";
    btnGroup.style.marginTop = "10px";
    btnGroup.style.padding = "10px";
    btnGroup.style.background = "#f1f1f1";
    btnGroup.style.borderRadius = "4px";
    btnGroup.appendChild(inlineBtn);
    btnGroup.appendChild(downloadBtn);
    
    card.appendChild(btnGroup);
  });

  // 2. Disable infinite scroll and add pagination
  disableInfiniteScroll();
}

function disableInfiniteScroll() {
  if (window._classicPaginationApplied) return;
  
  // Abhilekh typically attaches scroll listeners to window or document
  // Override window scrolling and fetch interceptors
  const oldScroll = window.onscroll;
  window.addEventListener('scroll', (e) => {
    e.stopImmediatePropagation();
  }, true);
  
  // Find load more triggers
  const loaderEl = document.querySelector('.loader, .loading-spinner, #loadMore, [class*="infinite-scroll"]');
  if (loaderEl && !document.getElementById('classic-load-more')) {
    const manualLoadBtn = document.createElement('button');
    manualLoadBtn.id = "classic-load-more";
    manualLoadBtn.innerText = "Load Next Page (Classic Pagination)";
    manualLoadBtn.className = "classic-inline-btn";
    manualLoadBtn.style.display = "block";
    manualLoadBtn.style.margin = "20px auto";
    manualLoadBtn.style.padding = "10px 20px";
    
    manualLoadBtn.onclick = () => {
      // Trigger the original scroll behavior once or click the hidden loader
      if (oldScroll) oldScroll(new Event('scroll'));
      else if (loaderEl.click) loaderEl.click();
      window.scrollBy(0, 50);
    };
    
    loaderEl.parentNode.insertBefore(manualLoadBtn, loaderEl);
    window._classicPaginationApplied = true;
  }
}

function showInlineViewer(url, anchorNode) {
  // Check if viewer already exists here
  if (anchorNode.nextElementSibling && anchorNode.nextElementSibling.className === 'classic-viewer-container') {
    anchorNode.nextElementSibling.remove();
    return;
  }

  const container = document.createElement('div');
  container.className = 'classic-viewer-container';
  
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.className = 'classic-pdf-iframe';
  
  container.appendChild(iframe);
  anchorNode.parentNode.insertBefore(container, anchorNode.nextSibling);
}

// Run periodically to catch dynamic DOM changes
setInterval(init, 2000);
init();
