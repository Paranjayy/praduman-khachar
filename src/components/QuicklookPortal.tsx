import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Share2, Maximize2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Link as LinkIcon } from 'lucide-react';

interface QuicklookProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemId?: string;
  image?: string;
  figures?: string[];
  description?: string;
}

export const QuicklookPortal: React.FC<QuicklookProps> = ({
  isOpen,
  onClose,
  title,
  itemId = "ARC.001",
  image,
  figures = [],
  description,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [activeFigure, setActiveFigure] = useState(image);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setActiveFigure(image);
      setZoom(1);
      setRotation(0);
      // Center the window initially
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, image]);

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!shouldRender) return null;

  return createPortal(
    <div 
      className={`quicklook-overlay ${isOpen ? 'open' : 'closing'}`}
      onAnimationEnd={handleAnimationEnd}
      onClick={onClose}
    >
      <div 
        className={`quicklook-window ${isDragging ? 'dragging' : ''}`} 
        onClick={(e) => e.stopPropagation()}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        {/* Window Header */}
        <div className="ql-header" onMouseDown={handleMouseDown}>
          <div className="ql-controls">
            <div className="ql-dot close" onClick={onClose} />
            <div className="ql-dot minimize" />
            <div className="ql-dot expand" />
          </div>
          
          <div className="ql-breadcrumbs">
            <span className="ql-bc-item">ARCHIVE</span>
            <span className="ql-bc-sep">/</span>
            <span className="ql-bc-item">COLLECTION</span>
            <span className="ql-bc-sep">/</span>
            <span className="ql-bc-item active">{itemId}</span>
          </div>

          <div className="ql-nav-group">
            <button className="ql-nav-btn"><ChevronLeft size={16} /></button>
            <button className="ql-nav-btn"><ChevronRight size={16} /></button>
          </div>

          <div className="ql-actions">
            <button className="ql-icon-btn"><Share2 size={14} /></button>
            <button className="ql-icon-btn"><Download size={14} /></button>
            <button className="ql-icon-btn"><Maximize2 size={14} /></button>
          </div>
        </div>

        <div className="ql-layout">
          {/* Main Content Area */}
          <div className="ql-main">
            <div className="ql-viewport">
              {activeFigure ? (
                <img 
                  src={activeFigure} 
                  alt={title} 
                  className="ql-hero-img" 
                  style={{ 
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} 
                />
              ) : (
                <div className="ql-no-preview">No Preview Available</div>
              )}
            </div>

            {/* Floating Zoom Controls */}
            <div className="ql-zoom-hud">
              <button onClick={() => handleZoom(0.2)}><ZoomIn size={14} /></button>
              <div className="ql-zoom-level">{Math.round(zoom * 100)}%</div>
              <button onClick={() => handleZoom(-0.2)}><ZoomOut size={14} /></button>
              <div className="ql-hud-sep" />
              <button onClick={handleRotate}><RotateCcw size={14} /></button>
            </div>
          </div>

          {/* Sidebar Gallery */}
          <div className="ql-sidebar">
            <div className="ql-sidebar-header">
              <span>FIGURES</span>
              <button className="ql-save-btn">SAVE IMG</button>
            </div>
            <div className="ql-gallery">
              {[image, ...figures].filter(Boolean).map((fig, idx) => (
                <div 
                  key={idx} 
                  className={`ql-thumb ${activeFigure === fig ? 'active' : ''}`}
                  onClick={() => setActiveFigure(fig)}
                >
                  <img src={fig} alt={`Figure ${idx + 1}`} />
                  <span className="ql-thumb-label">FIG {String(idx + 1).padStart(2, '0')}</span>
                </div>
              ))}
            </div>

            <div className="ql-info">
              <h3 className="ql-item-title">{title}</h3>
              <p className="ql-item-desc">{description}</p>
              
              <div className="ql-sidebar-header" style={{ marginTop: '10px', padding: '10px 0' }}>
                <span>RELATED DOCUMENTS</span>
              </div>
              <div className="ql-related">
                <div className="ql-related-item">
                  <LinkIcon size={12} />
                  <span>Kathi_History_Vol_01.pdf</span>
                </div>
                <div className="ql-related-item">
                  <LinkIcon size={12} />
                  <span>Saurashtra_Map_1997.jpg</span>
                </div>
              </div>

              <div className="ql-metadata">
                <div><span>FORMAT</span><span>JPEG</span></div>
                <div><span>SIZE</span><span>2.4 MB</span></div>
                <div><span>DATE</span><span>05/04/2026</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
