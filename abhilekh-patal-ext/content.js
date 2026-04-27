// Abhilekh Patal Classic Restorer Content Script

function init() {
  console.log("Abhilekh Patal Ext: Initializing classic UI...");
  
  // 1. Inline PDF Viewer
  // Look for any links or buttons that open the PDF/Document
  // In the new UI, there is a "Read more" or "Page on Demand" or a thumbnail link.
  const previewButtons = document.querySelectorAll('a[href*="readcontent"], button[class*="preview"], a[onclick*="openViewer"]');
  
  previewButtons.forEach(btn => {
    // If it's not already modified
    if (!btn.hasAttribute('data-inline-viewer-added')) {
      btn.setAttribute('data-inline-viewer-added', 'true');
      
      const inlineBtn = document.createElement('button');
      inlineBtn.innerText = "📄 Quick View (Classic)";
      inlineBtn.className = "classic-inline-btn";
      
      const downloadBtn = document.createElement('a');
      downloadBtn.innerText = "⬇️ Download PDF";
      downloadBtn.className = "classic-inline-btn classic-dl-btn";
      downloadBtn.style.backgroundColor = "#2d5a27"; // scholarly green
      
      let targetUrl = btn.href || btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      
      if (targetUrl) {
        downloadBtn.href = targetUrl;
        downloadBtn.download = "Abhilekh_Document.pdf";
        downloadBtn.target = "_blank";
        
        inlineBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          showInlineViewer(targetUrl, btn);
        };
        
        // Wrap buttons in a container
        const btnGroup = document.createElement('div');
        btnGroup.style.display = "inline-flex";
        btnGroup.style.gap = "8px";
        btnGroup.appendChild(inlineBtn);
        btnGroup.appendChild(downloadBtn);
        
        btn.parentNode.insertBefore(btnGroup, btn.nextSibling);
      }
    }
  });

  // 2. Disable infinite scroll and add pagination
  disableInfiniteScroll();
}

function disableInfiniteScroll() {
  if (window._classicPaginationApplied) return;
  
  // Abhilekh typically attaches scroll listeners to window or document
  // Overriding scroll behavior naive approach:
  const oldScroll = window.onscroll;
  window.onscroll = null;
  
  // Add a "Load More" manual button at the bottom instead of auto-loading
  const loaderEl = document.querySelector('.loader, .loading-spinner, #loadMore');
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
