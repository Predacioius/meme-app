import { EMOJI_CATEGORIES, EMOJI_KEYWORDS } from './emojis.js';

function applyGlobalScale() {
    let scale = Math.min(window.innerWidth / 1350, window.innerHeight / 800);
    if (scale > 1) scale = 1;
    const invScale = (100 / scale);
    
    const mainBox = document.querySelector('.mc-box');
    if (mainBox) {
        if (mainBox.classList.contains('timeline-mode')) {
            mainBox.style.setProperty('transform', 'none', 'important');
            mainBox.style.setProperty('width', '100vw', 'important');
            mainBox.style.setProperty('height', '100vh', 'important');
        } else {
            mainBox.style.setProperty('transform', `scale(${scale})`, 'important');
            mainBox.style.setProperty('transform-origin', 'top left', 'important');
            mainBox.style.setProperty('width', `${invScale}vw`, 'important');
            mainBox.style.setProperty('height', `${invScale}vh`, 'important');
            mainBox.style.setProperty('max-width', 'none', 'important');
            mainBox.style.setProperty('max-height', 'none', 'important');
        }
    }
    
    const popups = document.querySelectorAll('.gallery-content, .meme-paint-modal, .creator-profile-box');
    popups.forEach(p => {
        p.style.setProperty('transform', `scale(${scale})`, 'important');
    });
}
window.addEventListener('resize', applyGlobalScale);
new MutationObserver(applyGlobalScale).observe(document.body, { childList: true, subtree: true });


document.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        let currentZoom = parseFloat(document.body.style.zoom || 1);        currentZoom += e.deltaY > 0 ? -0.1 : 0.1;
        document.body.style.zoom = Math.max(0.5, Math.min(currentZoom, 3));
    }
}, { passive: false });

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        let currentZoom = parseFloat(document.body.style.zoom || 1);
        let changed = false;
        
        if (e.key === '=' || e.key === '+') { currentZoom += 0.1; changed = true; }
        else if (e.key === '-') { currentZoom -= 0.1; changed = true; }
        else if (e.key === '0') { currentZoom = 1; changed = true; }
        
        if (changed) {
            e.preventDefault();
            document.body.style.zoom = Math.max(0.5, Math.min(currentZoom, 3));
        }
    }
});

const MEME_HTML = `
  <div class="meme-choice-overlay mc-overlay is-hidden" data-action="backdropCloseChoice">

  <div class="custom-dialog-box choice-dialog">
    <h3>Upload Type</h3>
    <div class="dialog-actions choice-actions">
      <button type="button" class="choice-creator btn-public choice-btn-creator">Open Meme Creator</button>
    </div>
    <button type="button" data-action="closeChoiceOverlay" class="choice-cancel-btn">Cancel</button>
  </div>
  </div>
</div>

<div class="meme-creator-overlay mc-overlay is-hidden">
    <div class="meme-creator-box custom-dialog-box mc-box">       
      <div class="meme-creator-topbar mc-topbar" style="position: relative; z-index: 100;">
  <div class="meme-creator-brand" aria-label="Meme Creator">
        <div class="meme-creator-mark">🎨</div>
        <div class="meme-creator-wordmark">
          <div class="meme-creator-title">The Meme Creator</div>
          <div class="meme-creator-sub">Pro-Tools</div>
          <div class="timeline-slider-control is-hidden">
                <span class="timeline-slider-label">Size:</span>
                <input type="range" class="timeline-zoom-slider timeline-zoom-slider-small" min="250" max="800" step="10" value="350" title="Post Size" style="accent-color: #2196f3;">
          </div>
        </div>
      </div>
          <div style="position:relative; display:inline-block; margin-left:10px;">
            <button type="button" id="mainSettingsMenuBtn" class="btn-public" title="Options" style="background:#e0e0e0; color:#333; padding:4px 8px; font-size:16px; box-shadow:none;">≡</button>
            <div id="mainSettingsDropdown" style="display:none; position:absolute; top:100%; left:0; background:#fff; border:1px solid #ccc; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.15); z-index:10000; min-width:140px; margin-top:4px;">
              <button type="button" id="btnUpgradePro" style="display:block; width:100%; text-align:left; background:none; border:none; padding:8px 12px; font-size:12px; cursor:pointer; color:#2e7d32; font-weight:bold; border-bottom:1px solid #eee;">Upgrade to Pro-Tools</button>
              <button type="button" id="btnCheckUpdate" style="display:block; width:100%; text-align:left; background:none; border:none; padding:8px 12px; font-size:12px; cursor:pointer; color:#333; border-bottom:1px solid #eee;">Check for update</button>
              <button type="button" id="btnToggleCursor" style="display:block; width:100%; text-align:left; background:none; border:none; padding:8px 12px; font-size:12px; cursor:pointer; color:#333;">Cursor: Hand</button>
            </div>
          </div>
    <div class="mc-topbar-left">
          <button type="button" class="meme-undo-btn" title="Undo">↶ Undo</button>
<button type="button" class="meme-redo-btn" title="Redo">↷ Redo</button>
<button type="button" class="meme-clear-btn" title="Clear Canvas">× Clear Canvas</button>
          <button type="button" class="meme-size-h-btn meme-toggle-btn active meme-size-btn meme-size-btn-left is-hidden" title="Landscape (1920x1080)">16:9</button>
          <button type="button" class="meme-size-v-btn meme-toggle-btn meme-size-btn is-hidden" title="Vertical (1080x1920)">9:16</button>
          <button type="button" class="meme-size-port-btn meme-toggle-btn meme-size-btn is-hidden" title="Portrait (1080x1350)">4:5</button>
          <button type="button" class="meme-size-sq-btn meme-toggle-btn meme-size-btn is-hidden" title="Square (1080x1080)">1:1</button>
         <select class="meme-size-book-select meme-toggle-btn meme-size-btn is-hidden" title="More Sizes" style="outline:none; width:118px;">
            <option value="" disabled selected hidden>More Sizes</option>
            <optgroup label="Book Covers">
              <option value="5:8" data-short="E-Book" data-full="E-Book 5:8">E-Book 5:8</option>
              <option value="2:3" data-short="Standard Print" data-full="Standard Print 2:3">Standard Print 2:3</option>
              <option value="1:1.62" data-short="Mass Market" data-full="Mass Market 1:1.62">Mass Market 1:1.62</option>
              <option value="1:1" data-short="Audiobook" data-full="Audiobook 1:1">Audiobook 1:1</option>
              <option value="2:1" data-short="Dust Jacket" data-full="Dust Jacket 2:1">Dust Jacket 2:1</option>
            </optgroup>
            <optgroup label="Web & Social">
              <option value="1.91:1" data-short="Link Preview" data-full="Link Preview 1.91:1">Link Preview 1.91:1</option>
              <option value="3:1" data-short="X/Twitter Header" data-full="X/Twitter Header 3:1">X/Twitter Header 3:1</option>
              <option value="4:1" data-short="LinkedIn Banner" data-full="LinkedIn Banner 4:1">LinkedIn Banner 4:1</option>
            </optgroup>
            <optgroup label="Print & Screens">
              <option value="8.5:11" data-short="US Letter" data-full="US Letter 8.5:11">US Letter 8.5:11</option>
              <option value="1:1.414" data-short="A4 Print" data-full="A4 Print 1:1.414">A4 Print 1:1.414</option>
              <option value="5:7" data-short="Photo Print" data-full="Photo Print 5:7">Photo Print 5:7</option>
              <option value="4:3" data-short="Retro Screen" data-full="Retro Screen 4:3">Retro Screen 4:3</option>
            </optgroup>
          </select>
      </div>
      <div class="meme-creator-hint is-hidden"></div>
      <div class="meme-advanced-row">
          <span class="meme-advanced-label">Advanced Mode:</span>
          <button type="button" class="meme-creator-advanced meme-toggle-btn" style="font-size: 12px; width: 40px; height: 28px;">OFF</button>
      </div>
      <button type="button" class="meme-creator-close" title="Log Out" aria-label="Log Out">×</button>

    </div>

    <div class="meme-timeline-view" style="display:none;"></div>

    <div class="nsfw-confirm-overlay" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.55); align-items:center; justify-content:center; z-index:7000;">
        <div class="custom-dialog-box" style="max-width:420px; text-align:center;">
            <h3 style="margin-top:0; background:transparent; color:#1c1e21; border:none; padding:0;">Turn NSFW on:</h3>
            <div class="dialog-actions" style="justify-content:space-between; gap:10px; margin-top:10px;">
                <button type="button" class="nsfw-always btn-public" style="flex:1; background-color:#9e9e9e; box-shadow:none;">always</button>
                <button type="button" class="nsfw-until-logout btn-public" style="flex:1; background-color:#d7d59d; color:#000000; box-shadow:none;">Until I log out</button>
            </div>
            <button type="button" class="nsfw-cancel" style="margin-top:10px; background:none; border:none; color:#666; cursor:pointer;">Cancel</button>
        </div>
    </div>

    <div class="meme-creator-split-view" style="display:flex; flex:1; min-height:0; gap:20px; width:100%;">

          
          <div class="meme-creator-stage" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f0f2f5; border-radius:8px; padding:10px; overflow:hidden; position:relative;">
              <div class="meme-creator-viewport">
                <div class="meme-creator-canvas-wrap">
                  <canvas class="meme-creator-canvas"></canvas>
                  <div class="meme-text-layer"></div>
                </div>
              </div>
          </div>

          <div class="meme-creator-controls" style="width:280px; flex-shrink:0; display:flex; flex-direction:column; gap:8px; overflow-y:scroll; padding-right:4px;">
              
             <div style="display:flex; flex-direction:column; gap:8px; width:100%;">
                 <div style="display:flex; gap:8px; width:100%;">
                     <button type="button" class="meme-creator-add-photo btn-public" style="flex:1;">Add Photo</button>
                     <button type="button" class="meme-creator-add-text btn-public" style="flex:1;">Add Text</button>
                 </div>

<div style="display:flex; gap:8px; width:100%;">
    <button type="button" class="meme-binder-btn btn-public" style="flex:1; background-color:#d1c4e9; color:#4e342e; transition: background-color 0.2s; font-size: 12px;">Meme Binder</button>
    <button type="button" class="meme-template-btn btn-public" style="flex:1; background-color:#b2dfdb; color:#4e342e; font-size: 12px;">Template Binder</button>
</div>


<div class="meme-bg-tools-row" style="display:none; gap:8px; width:100%;">
    <button type="button" class="meme-remove-bg-btn btn-public" style="flex:1; background-color:#cb6c6c; padding:6px 2px; font-size:13px;">🪄 Remove BG</button>
    <button type="button" class="meme-lasso-keep-btn btn-public" style="flex:1; background-color:#bc629f; padding:6px 2px; font-size:13px;">➰ Lasso Keep</button>
</div>

<div class="meme-crop-row" style="display:none; gap:8px; width:100%;">
    <button type="button" class="meme-crop-btn btn-public" style="flex:1; background-color:#2196f3;">📐 Crop</button>
    <button type="button" class="meme-cut-btn btn-public" style="flex:1; background-color:#bdbf5a;">✂️ Cut</button>
</div>

                  <div class="meme-opacity-control group-context" style="display:none; gap:6px; align-items:center; justify-content:space-between; width:100%;">                      <span style="font-size:12px; color:#606770; font-weight:600;">Opacity:</span>
                      <input type="range" class="meme-creator-opacity" min="0" max="1" step="0.05" value="1" style="flex:1; cursor:pointer; accent-color: #2196f3;">
                  </div>

                  <div class="meme-object-tools-row group-context" style="display:none; flex-direction:column; gap:0; width:100%; margin-top:0;">
                      
                      <div class="meme-layer-controls" style="display:flex; gap:2px; align-items:center; justify-content:space-between; background:#f0f2f5; padding:4px; border-radius:4px 4px 0 0; border:1px solid #000; border-bottom:1px solid #ddd;">
                          <div style="display:flex; align-items:center; gap:4px; font-size:12px; color:#606770; padding-left:2px;">
                              <span>🔒</span> <span style="font-weight:600;">Lock Object</span>
                          </div>
                          <div style="display:flex; gap:2px;">
                              <button type="button" class="meme-visibility-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer;" title="Toggle Visibility">Visibility</button>
                              <button type="button" class="meme-lock-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer;" title="Full Lock">Lock</button>
                              <button type="button" class="meme-pos-lock-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer;" title="Lock Position Only">Anchor</button>
                          </div>
                      </div>

                      <div class="meme-layer-controls" style="display:flex; gap:2px; align-items:center; justify-content:space-between; background:#f0f2f5; padding:4px; border-radius:0; border-left:1px solid #000; border-right:1px solid #000; border-top:none; border-bottom:1px solid #ddd;">
                          <div style="display:flex; align-items:center; gap:4px; font-size:12px; color:#606770; padding-left:2px;">
                              <span>🖇️</span> <span style="font-weight:600;">Combine</span>
                          </div>
                          <div style="display:flex; gap:2px;">
                              <button type="button" class="meme-multiselect-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer;" title="Multi-Select (or hold Shift)">Multi</button>
                              <button type="button" class="meme-group-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:default; opacity:0.5;" title="Link Objects">Link</button>
                              <button type="button" class="meme-mold-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:default; opacity:0.5;" title="Merge Selected">Mold</button>
                              <button type="button" class="meme-clone-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:default; opacity:0.5;" title="Duplicate Selected">Clone</button>
                          </div>
                      </div>

                      <div class="meme-layer-controls" style="display:flex; gap:2px; align-items:center; justify-content:space-between; background:#f0f2f5; padding:4px; border-radius:0 0 4px 4px; border:1px solid #000; border-top:none;">
                          <div style="display:flex; align-items:center; gap:4px; font-size:12px; color:#606770; padding-left:2px;">
                              <span>📏</span> <span style="font-weight:600;">Layout</span>
                          </div>
                          <div style="display:flex; gap:2px;">
                              <button type="button" class="meme-snap-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer;" title="Toggle Snap">Snap</button>
                              <button type="button" class="meme-center-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer;" title="Center Alignment Lines">Center</button>
                              <button type="button" class="meme-grid-btn" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer;" title="Toggle Grid Overlay">Grid</button>
                              <div style="display:flex; gap:0;">
                                  <button type="button" class="meme-grid-up-btn active" style="padding:2px 6px; font-size:12px; background:#f3e5f5; color:#7b1fa2; border:1px solid #7b1fa2; border-radius:4px 0 0 4px; cursor:pointer; opacity:0.5; pointer-events:none;" title="Grid Above Objects">⬆</button>
                                  <button type="button" class="meme-grid-down-btn" style="padding:2px 6px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-left:none; border-radius:0 4px 4px 0; cursor:pointer; opacity:0.5; pointer-events:none;" title="Grid Below Objects">⬇</button>
                              </div>
                          </div>
                      </div>

                  </div>

                  <div class="meme-advanced-row group-context" style="display:none; gap:8px; width:100%; align-items:stretch; margin-top:4px;">
                      <div class="meme-layer-controls" style="flex:1; display:flex; gap:2px; align-items:center; justify-content:space-between; background:#f0f2f5; padding:4px; border-radius:4px; border:1px solid #ddd;">
                          <button type="button" class="meme-layer-panel-btn" style="display:flex; align-items:center; gap:4px; font-size:12px; color:#606770; padding:2px 6px; background:none; border:none; cursor:pointer; font-weight:600; border-radius:4px; transition:background-color 0.15s;" title="Open Layers Panel">
                              <span>📚</span> <span>Layer</span>
                          </button>
                          <div style="display:flex; gap:2px;">
                              <button type="button" class="meme-layer-down" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer; transition: background-color 0.2s;" title="Move Down">↓</button>
                              <button type="button" class="meme-layer-up" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer; transition: background-color 0.2s;" title="Move Up">↑</button>
                          </div>
                      </div>
                      <button type="button" class="meme-shapes-btn" style="flex:1; background-color:#e67e22; color:white; border:none; border-radius:4px; font-size:13px; font-weight:600; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.2); transition: background-color 0.2s;">△▢ Shapes</button>
                  </div>

                  <button type="button" class="meme-creator-whitespace btn-public" style="width:100%;">White Space: Off</button>

              </div>

              <div style="display:flex; flex-direction:column; gap:2px; width:100%; margin-top: -14px;">
                  <button type="button" class="meme-creator-zoom btn-public" style="width:100%; margin-top: 20px;">Zoom: Fit</button>

                  <div class="meme-shapes-picker" style="display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:#fff; border:1px solid #ccc; box-shadow:0 10px 25px rgba(0,0,0,0.3); z-index:15000; padding:15px; border-radius:8px; width:340px;">
                      <div style="display:flex; border-bottom:1px solid #ddd; margin-bottom:10px;">
                          <button type="button" id="tabShapes" style="flex:1; padding:8px; background:none; border:none; border-bottom:3px solid #e67e22; font-weight:bold; color:#000; cursor:pointer;">Shapes</button>
                          <button type="button" id="tabEmotes" style="flex:1; padding:8px; background:none; border:none; border-bottom:3px solid transparent; color:#999; cursor:pointer;">Emoticons</button>
                      </div>

                                            <div id="viewShapes" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; max-height: 400px; overflow-y:auto;">
                          <button type="button" data-shape="line" title="Line" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M2 12h20"/></svg></button>
                          <button type="button" data-shape="square" title="Square" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><rect x="4" y="4" width="16" height="16"/></svg></button>
                          <button type="button" data-shape="rect" title="Rectangle" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><rect x="2" y="7" width="20" height="10"/></svg></button>
                          <button type="button" data-shape="circle" title="Circle" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><circle cx="12" cy="12" r="9"/></svg></button>
                          <button type="button" data-shape="triangle" title="Triangle" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M12 3l10 18H2z"/></svg></button>
                          
                          <button type="button" data-shape="octagon" title="Octagon" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M7.8 2h8.4l5.8 5.8v8.4L16.2 22H7.8L2 16.2V7.8z"/></svg></button>
                          <button type="button" data-shape="star" title="Star" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/></svg></button>
                          <button type="button" data-shape="heart" title="Heart" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></button>
                          <button type="button" data-shape="arrow" title="Arrow" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M4 12h16M13 5l7 7-7 7"/></svg></button>
                          <button type="button" disabled style="border:none; background:transparent;"></button>

                          <button type="button" data-shape="bubble_oval" title="Thought Oval" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><ellipse cx="12" cy="10" rx="10" ry="8"/><path d="M8 17l-4 5"/></svg></button>
                          <button type="button" data-shape="bubble_cloud" title="Thought Cloud" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M4 12a4 4 0 0 1 4-4 4 4 0 0 1 8 0 4 4 0 0 1 4 4 3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/><circle cx="6" cy="19" r="1"/><circle cx="9" cy="21" r="2"/></svg></button>
                          <button type="button" data-shape="bubble_square" title="Speech Box" style="height:40px; border:1px solid #ddd; background:#fff; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M3 3h18v14H8l-5 5V3z"/></svg></button>
                          <button type="button" disabled style="border:none; background:transparent;"></button>
                          <button type="button" disabled style="border:none; background:transparent;"></button>

                          <button type="button" data-shape="3d_square" title="3D Box" style="height:40px; border:1px solid #ddd; background:#e3f2fd; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M3 7h12v12H3zM8 2h12v12l-5 5M15 7l5-5"/></svg></button>
                          <button type="button" data-shape="3d_circle" title="3D Wheel" style="height:40px; border:1px solid #ddd; background:#e3f2fd; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><ellipse cx="6" cy="12" rx="3" ry="8"/><path d="M6 4h12c1.66 0 3 3.58 3 8s-1.34 8-3 8H6"/></svg></button>
                          <button type="button" data-shape="3d_cylinder" title="3D Cylinder" style="height:40px; border:1px solid #ddd; background:#e3f2fd; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/></svg></button>
                          <button type="button" data-shape="3d_triangle" title="3D Pyramid" style="height:40px; border:1px solid #ddd; background:#e3f2fd; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M12 2l-8 18h16z"/><path d="M12 2l8 18 3-5-11-13z"/></svg></button>
                          <button type="button" data-shape="3d_star" title="3D Star" style="height:40px; border:1px solid #ddd; background:#e3f2fd; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M12 2l2 7h7l-5 4 2 7-6-5-6 5 2-7-5-4h7z"/><path d="M12 2l4 2 4 10-3 3-5-15z" stroke-width="1"/></svg></button>
                          <button type="button" data-shape="3d_heart" title="3D Heart" style="height:40px; border:1px solid #ddd; background:#e3f2fd; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M12 21l-1-1C5 15 2 12 2 8c0-3 2-5 5-5 2 0 3 1 5 2 2-1 3-2 5-2 3 0 5 2 5 5 0 4-3 7-9 12z"/><path d="M17 3l3 3 0 5-3 3" stroke-width="1"/></svg></button>
                          <button type="button" data-shape="3d_arrow" title="3D Arrow" style="height:40px; border:1px solid #ddd; background:#e3f2fd; cursor:pointer; padding:2px;"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:none;stroke:#000;stroke-width:2;"><path d="M2 12h14M13 5l7 7-7 7"/><path d="M13 5l4-2 7 7-4 2" stroke-width="1"/></svg></button>
                      </div>


                                            <div id="viewEmotes" style="display:none; grid-template-columns:repeat(5, 1fr); gap:6px; max-height: 400px; overflow-y:auto;">
                          <button type="button" data-text="😀" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">😀</button>
                          <button type="button" data-text="😂" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">😂</button>
                          <button type="button" data-text="😍" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">😍</button>
                          <button type="button" data-text="🥰" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">🥰</button>
                          <button type="button" data-text="😎" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">😎</button>
                          <button type="button" data-text="😭" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">😭</button>
                          <button type="button" data-text="😡" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">😡</button>
                          <button type="button" data-text="👍" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">👍</button>
                          <button type="button" data-text="👎" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">👎</button>
                          <button type="button" data-text="🔥" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">🔥</button>
                          <button type="button" data-text="🎉" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">🎉</button>
                          <button type="button" data-text="💩" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">💩</button>
                          <button type="button" data-text="👻" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">👻</button>
                          <button type="button" data-text="👽" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">👽</button>
                          <button type="button" data-text="💯" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">💯</button>

                          <button type="button" data-text="💬" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">💬</button>
                          <button type="button" data-text="💭" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">💭</button>
                          <button type="button" data-text="🗨️" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">🗨️</button>
                          <button type="button" data-text="📦" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">📦</button>
                          <button type="button" data-text="🛢️" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">🛢️</button>
                          <button type="button" data-text="⛺" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">⛺</button>
                          <button type="button" data-text="🌟" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">🌟</button>
                          <button type="button" data-text="💖" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">💖</button>
                          <button type="button" data-text="🔜" style="height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;">🔜</button>
                          <button type="button" id="btnMoreEmotes" style="height:40px; font-size:12px; font-weight:bold; border:1px solid #ddd; background:#e3f2fd; color:#1976d2; cursor:pointer; grid-column: span 2;">More...</button>
                      </div>

                      <div id="viewMoreEmotes" style="display:none; flex-direction:column; gap:8px;">
                          <input type="text" id="searchMoreEmotes" placeholder="Search emojis..." style="width:100%; box-sizing:border-box; padding:6px; font-size:12px; border:1px solid #ccc; border-radius:4px;">
                          <div id="gridMoreEmotes" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; max-height: 360px; overflow-y:auto; align-content:start;"></div>
                      </div>

                      <button type="button" class="meme-shapes-close" style="margin-top:10px; width:100%; padding:6px; background:#c0392b; color:#fff; font-weight:600; border:none; cursor:pointer;">Cancel</button>
                  </div>

                  <div class="meme-creator-layout green-toggle-context" style="display:flex; gap:6px; align-items:center; justify-content:space-between;">
                    <span style="font-size:12px; color:#606770;">Layout:</span>
                    <div class="discussion-toggle-container">
                        <button type="button" class="meme-creator-layout-vert discussion-toggle-btn active">Vertical</button>
                        <button type="button" class="meme-creator-layout-horz discussion-toggle-btn">Horizontal</button>
                    </div>
                  </div>

                  <div class="meme-transform-row group-context" style="display:none; gap:4px; width:100%;">
                      <button type="button" class="meme-flip-btn" style="width:70px; background:#fff; border:1px solid #ddd; border-radius:4px; cursor:pointer; padding:0; display:flex; align-items:center; justify-content:center; gap:4px; color:#000; transition: background-color 0.2s;" title="Mirror">
                        <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:none;stroke:#000;stroke-width:2;"><path d="M12 2v20M5 7l-3 3 3 3M19 7l3 3-3 3"/></svg> Flip
                      </button>
                      <button type="button" class="meme-rotate-btn" style="width:70px; background:#fff; border:1px solid #ddd; border-radius:4px; cursor:pointer; padding:0; display:flex; align-items:center; justify-content:center; gap:4px; color:#000; transition: background-color 0.2s;" title="Rotate 45°">
                        <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:none;stroke:#000;stroke-width:2;"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 12V6M21 12h-6"/></svg> Rotate
                      </button>
                  </div>

                  <div class="meme-canvas-options-row group-context" style="display:none; align-items:center; gap:4px; width:100%; margin-top:0;">
                      <span style="font-size:11px; color:#606770; font-weight:600;">Canvas:</span>
                      <input type="color" class="meme-creator-canvas-color" value="#ffffff" style="height:26px; width:30px; border:none; padding:0; cursor:pointer;" title="Base Color">
                      <input type="text" class="meme-creator-canvas-hex" value="#ffffff" spellcheck="false" style="height:26px; width:56px; font-size:10px; border:1px solid #ccc; border-radius:4px; padding:0 4px; font-family:monospace;" title="Hex Code">
                      <select class="meme-creator-canvas-effect" style="height:26px; font-size:11px; border:1px solid #ccc; border-radius:4px; flex:1; min-width:0; cursor:pointer;">
                          <option value="none">No Effect</option>
                          <option value="sunburst">Sunburst</option>
                          <option value="grid">Retro Grid</option>
                          <option value="linear">Linear</option>
                          <option value="radial">Radial</option>
                          <option value="noise">Noise</option>
                          <option value="halftone">Halftone</option>
                          <option value="scanlines">CRT Scanlines</option>
                          <option value="speedlines">Speed Lines</option>
                          <option value="spiral">Thick Spiral</option>
                          <option value="spiral_thin">Thin Spiral</option>
                          <option value="confetti">Confetti</option>
                          <option value="checkerboard">Checkerboard</option>
                          <option value="matrix">Matrix Rain (Up)</option>
                          <option value="matrix_down">Matrix Rain (Down)</option>
                          <option value="chromatic">Chromatic Aberration</option>
                          <option value="vaporwave">Vaporwave Sun</option>
                          <option value="tvsnow">TV Snow</option>
                          <option value="actionfocus">Action Focus</option>
                          <option value="polkadots">Pop Art Dots</option>
                          <option value="explosion">Pow Burst</option>
                          <option value="bokeh">Bokeh Leaks</option>
                          <option value="lowpoly">Low Poly</option>
                          <option value="galaxy">Galaxy</option>
                          <option value="chevron">Chevron</option>
                          <option value="brickwall">Brick Wall</option>
                          <option value="bulletjournal">Bullet Journal</option>
                          <option value="camo">Camouflage</option>
                          <option value="topographic">Topographic</option>
                          <option value="honeycomb">Honeycomb</option>
                          <option value="caution">Caution Tape</option>
                          <option value="tartan">Tartan / Plaid</option>
                          <option value="diamondplate">Diamond Plate</option>
                          <option value="zebra">Zebra Print</option>
                          <option value="synthwave">Synthwave Horizon</option>
                          <option value="memphis">90s Memphis</option>
                          <option value="hyperdrive">Hyperdrive</option>
                          <option value="glitch">Glitch Shift</option>
                          <option value="psychedelic">Psychedelic</option>
                          <option value="concentric">Concentric Ripples</option>
                          <option value="dottedgrad">Dotted Gradient</option>
                          <option value="rainstorm">Rainstorm</option>
                          <option value="blizzard">Blizzard</option>
                          </select>
                      </div>
                  </div>

                  <div class="meme-text-controls-row" style="display:flex; flex-direction:column; gap:10px; width:100%; box-sizing:border-box; background:#f7f7f7; padding:8px; border-radius:6px; border:1px solid #000;">
                        <div style="font-size:11px; color:#606770; display:flex; align-items:center; gap: 8px;">
                            <b>Color:</b>
                            <input type="color" class="meme-creator-color" value="#ffffff" title="Text color" style="height:28px; width:40px; border:none; padding:0; cursor:pointer;">
                        <input type="text" class="meme-creator-color-hex" value="#ffffff" spellcheck="false" style="height:28px; width:56px; font-size:10px; border:1px solid #ccc; border-radius:4px; padding:0 4px; font-family:monospace;" title="Hex Code">
                        <b style="margin-left:4px;">Size:</b>
                        <input type="number" class="meme-creator-fontsize" min="1" max="1400" value="48" style="height:28px; width:56px; font-size:11px; border:1px solid #ccc; border-radius:4px; padding:0 4px;" title="Text Size">
                    </div>
                    <div class="meme-font-row" style="display:flex; align-items:center; gap: 8px;">
                        <span style="font-size:11px; color:#606770;"><b>Font:</b></span>
                        <div style="display:flex; gap:2px;">
                           <select class="meme-creator-font-weight" style="height:26px; font-size:11px; width:60px;">
                                <option value="900">Thick</option>
                                <option value="400">Thin</option>
                            </select>

                            <div class="meme-custom-font-wrapper" style="position:relative; width:100px;">
                                <button type="button" class="meme-creator-font-trigger" style="height:26px; font-size:11px; width:100%; text-align:left; border:1px solid #767676; border-radius:2px; background:#fff; color:#1c1e21; padding:0 4px; white-space:nowrap; overflow:hidden; cursor:pointer;">Anton</button>

                                <div class="meme-creator-font-menu" style="display:none; position:absolute; top:100%; right:0; left:auto; width:160px; max-height:300px; overflow-y:auto; background:#fff; border:1px solid #ccc; z-index:2000; box-shadow:0 4px 15px rgba(0,0,0,0.3);">
                                    <input type="text" class="meme-font-search" placeholder="Search fonts..." style="width:100%; box-sizing:border-box; padding:6px; font-size:12px; border:none; border-bottom:1px solid #eee; position:sticky; top:0; background:#f9f9f9; outline:none; color:#333;">
                                    <div class="meme-font-list"></div>
                                </div>
                            </div>
                            <select class="meme-creator-font-style" style="height:26px; font-size:11px; width:46px;">
                                <option value="normal">Reg</option>
                                <option value="italic">Ital</option>
                            </select>
                        </div>
                    </div>

                    <div class="meme-shape-size-row" style="display:none; align-items:center; justify-content:space-between;">
                        <span style="font-size:11px; color:#606770;">Size:</span>
                        <div style="display:flex; align-items:center; gap:4px;">
                            <input type="text" inputmode="numeric" class="meme-shape-size-input" style="height:26px; width:50px; font-size:11px; border:1px solid #ddd; border-radius:4px; padding-left:4px;">
                            <div style="display:flex; gap:2px;">
                                <button type="button" class="meme-shape-size-down" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer;">↓</button>
                                <button type="button" class="meme-shape-size-up" style="padding:2px 8px; font-size:12px; background:#e3f2fd; color:#1976d2; border:1px solid #1976d2; border-radius:4px; cursor:pointer;">↑</button>
                            </div>
                        </div>
                    </div>
                   <div style="display:flex; flex-direction:column; gap:6px;">
                        <div style="display:flex; gap:4px; justify-content:space-between;">
                            <div style="display:flex; align-items:center;">
                                <button type="button" class="meme-toggle-btn meme-creator-bg-toggle active" style="width: 34px; min-width: 34px; padding: 0;">ON</button>
                                <label style="font-size:11px; color:#606770; display:flex; align-items:center; gap:2px;">
                                   <span style="width: 36px; display: inline-block;">Outline:</span> <input type="color" class="meme-creator-shadow-color" value="#000000" style="height:26px; width:30px; border:none; background:none; cursor:pointer;">
                                    <input type="text" class="meme-creator-shadow-color-hex" value="#000000" spellcheck="false" style="height:26px; width:46px; font-size:10px; border:1px solid #ccc; border-radius:4px; padding:0 4px; font-family:monospace;" title="Hex Code">
                                </label>
                            </div>
                            <label style="font-size:11px; color:#606770; display:flex; align-items:center; gap:4px;">
                                Depth:
                                <select class="meme-creator-shadow-depth" style="height:26px; width:40px; font-size:11px;">
                                    <option value="1">1</option>
                                    <option value="2" selected>2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </label>
                        </div>

                        <div style="display:flex; gap:4px; justify-content:space-between;">
                            <div style="display:flex; align-items:center;">
                                <button type="button" class="meme-toggle-btn meme-creator-ts-toggle" style="width: 34px; min-width: 34px; padding: 0;">OFF</button>
                                <label style="font-size:11px; color:#606770; display:flex; align-items:center; gap:2px;">
                                    <span style="width: 36px; display: inline-block;">Shadow:</span> <input type="color" class="meme-creator-textshadow-color" value="#000000" style="height:26px; width:30px; border:none; background:none; cursor:pointer;">
                                    <input type="text" class="meme-creator-textshadow-color-hex" value="#000000" spellcheck="false" style="height:26px; width:46px; font-size:10px; border:1px solid #ccc; border-radius:4px; padding:0 4px; font-family:monospace;" title="Hex Code">
                                </label>
                            </div>
                            <label style="font-size:11px; color:#606770; display:flex; align-items:center; gap:4px;">
                                Depth:
                                <select class="meme-creator-textshadow-depth" style="height:26px; width:40px; font-size:11px;">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3" selected>3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </label>
                        </div>
                    </div>

              </div>

              <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
    <div style="display:flex; gap:8px; width:100%;">
        <button type="button" class="meme-creator-save btn-public" 
                style="flex:1; background-color:#d1c4e9; color:#4e342e; border:none; transition: background-color 0.2s;">Save Meme</button>

        <button type="button" class="meme-creator-save-template btn-public" style="flex:1; background-color:#b2dfdb; color:#4e342e;">Save Template</button>
    </div>
        <div style="display:flex; gap:8px; width:100%;">
        <button type="button" class="meme-creator-save-progress btn-public"
                style="flex:1; background-color:#fec87c; color:#4e342e; border:none; transition: background-color 0.2s;">Save/Load</button>
        <button type="button" class="meme-creator-open-progress btn-public"
                style="flex:1; background-color:#fec87c; color:#4e342e; border:none; transition: background-color 0.2s;">In Progress</button>
      </div>
    <div style="display:flex; gap:8px; width:100%;">
        <button type="button" class="meme-creator-download btn-public" 
                style="flex:1; background-color:#8e44ad; transition: background-color 0.2s;">Download</button>
        <select id="memeDownloadFormat" style="width: 70px; font-size: 12px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; outline: none;">
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
            <option value="webp">WEBP</option>
        </select>
    </div>

</div>

          </div> 
          
          <div class="mc-layer-panel">
            <div class="mc-layer-header">
                <span>Layers</span>
                <button type="button" class="mc-layer-close" style="background:none; border:none; font-size:16px; cursor:pointer; line-height:1; padding:0 4px;">&times;</button>
            </div>
            <div class="mc-layer-list"></div>
          </div>

          </div> </div> </div>
`;

function showToast(msg) {
    const d = document.createElement('div');
    d.textContent = msg;
    d.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#333; color:#fff; padding:10px 20px; border-radius:4px; z-index:20000;";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2000);
}

const postLogoutToast = sessionStorage.getItem("postLogoutToast");
if (postLogoutToast) {
    sessionStorage.removeItem("postLogoutToast");

    const d = document.createElement('div');
    d.textContent = postLogoutToast;
    d.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(30, 30, 30, 0.95); color:#fff; padding:18px 36px; border-radius:30px; z-index:10000; font-size:16px; font-weight:600; box-shadow:0 10px 30px rgba(0,0,0,0.3); text-align:center;";
    document.body.appendChild(d);

    setTimeout(() => {
        d.style.transition = "opacity 0.5s ease";
        d.style.opacity = "0";
        setTimeout(() => d.remove(), 500);
    }, 3000);
}


const memeContainer = document.getElementById('memeContainer');
memeContainer.innerHTML = MEME_HTML;

if (!memeContainer._sidebarDelegated) {
    memeContainer._sidebarDelegated = true;
    memeContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-sidebar-link[data-action]');
        if (!btn || !memeContainer.contains(btn)) return;

        const action = btn.getAttribute('data-action');

        if (action === 'sidebarOpenBinder') { window.openMemeBinderOverlay(); return; }
        if (action === 'sidebarOpenTemplates') { window.openTemplateOverlay(); return; }
        if (action === 'sidebarOpenProgress') { window.openProgressOverlay(); return; }
        if (action === 'sidebarOpenSettings') { window.openSettingsDialog(); return; }
       });
}

if (!memeContainer._inlineDelegated) {
    memeContainer._inlineDelegated = true;

    memeContainer.addEventListener('click', (e) => {
        const el = e.target.closest('[data-action]');
        if (!el || !memeContainer.contains(el)) return;

        const action = el.getAttribute('data-action');

        if (action === 'backdropCloseChoice') {
            if (e.target === el) el.style.display = 'none';
            return;
        }

        if (action === 'closeChoiceOverlay') {
            const o = el.closest('.meme-choice-overlay');
            if (o) o.style.display = 'none';
            return;
        }

        if (action === 'toggleFiltersDropdown') {
            const root = el.closest('div') ? el.closest('div').parentElement : null;
            if (!root) return;

            const p = root.querySelector('.cat-dropdown');
            const btn = root.querySelector('.cat-ban-btn');
            const a = el.querySelector('.cat-arrow');
            const closed = !p || p.style.display === 'none';

            if (p) p.style.display = closed ? 'flex' : 'none';
            if (btn) btn.style.display = closed ? 'block' : 'none';
            if (a) a.style.transform = closed ? 'rotate(90deg)' : 'rotate(0deg)';
            return;
        }

        if (action === 'toggleBanView' && window._toggleBanView) { window._toggleBanView(el); return; }
        if (action === 'toggleFollowingList' && window._toggleFollowingList) { window._toggleFollowingList(el); return; }
        if (action === 'toggleBanList' && window._toggleBanList) { window._toggleBanList(el); return; }
        if (action === 'toggleMyInfo' && window._toggleMyInfo) { window._toggleMyInfo(el); return; }

        if (action === 'setTimelineSort' && window.setTimelineSort) {
            window.setTimelineSort(el, el.getAttribute('data-sort'));
            return;
        }
    });

    memeContainer.addEventListener('input', (e) => {
        const inp = e.target;
        if (!(inp instanceof HTMLInputElement)) return;
        if (!inp.classList.contains('timeline-tag-filter-input')) return;
        if (window.filterTimelineTag) window.filterTimelineTag(inp.value);
    });
}


function __ensureGlobalOverlayDelegation() {
    if (document._globalOverlayDelegated) return;
    document._globalOverlayDelegated = true;

    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-action]');
        if (!el) return;

        const action = el.getAttribute('data-action');

        if (action === 'dlgClose') {
            const o = el.closest('.custom-dialog-overlay');
            if (o) o.remove();
            return;
        }

        if (action === 'dlgCloseById') {
            const id = el.getAttribute('data-target-id') || '';
            if (id) {
                const node = document.getElementById(id);
                if (node) node.remove();
            }
            return;
        }

        if (action === 'tplClose') {
            const node = document.getElementById('memeTemplateOverlay');
            if (node) node.remove();
            return;
        }

        if (action === 'tplDownload') {
            if (window.confirmDownloadCollection) window.confirmDownloadCollection('templates');
            return;
        }

        if (action === 'tplUpload') {
            if (window.openGalleryUploadDialog) window.openGalleryUploadDialog('templates');
            return;
        }

        if (action === 'tplToggleEdit') {
            if (window._toggleTemplateEditMode) window._toggleTemplateEditMode();
            return;
        }

        if (action === 'tplOpenMemes') {
            const node = document.getElementById('memeTemplateOverlay');
            if (node) node.remove();
            if (window.openMemeBinderOverlay) window.openMemeBinderOverlay(window._lastBinderCallback);
            return;
        }

        if (action === 'tplOpenProgress') {
            const node = document.getElementById('memeTemplateOverlay');
            if (node) node.remove();
            if (window.openProgressOverlay) window.openProgressOverlay();
            return;
        }

        if (action === 'tplSetCat') {
            const cat = el.getAttribute('data-cat');
            if (!cat) return;
            if (cat === 'all' || cat === 'unsorted') window._setTemplateCat(cat);
            else window._setTemplateCat(parseInt(cat, 10));
            return;
        }

        if (action === 'tplDeleteFolder') {
            const id = parseInt(el.getAttribute('data-folder-id') || '0', 10);
            if (id && window._deleteTemplateFolder) window._deleteTemplateFolder(id);
            return;
        }

        if (action === 'downloadZip') {
            const type = String(el.getAttribute('data-type') || '').trim();
            if (!type) return;
            window.location.href = `/api/memes/${encodeURIComponent(type)}/download-zip`;
            const o = el.closest('.custom-dialog-overlay');
            if (o) o.remove();
            return;
        }

        if (action === 'globalOpenImage') {
            const src = __safeImageSrc(el.getAttribute('data-src') || '');
            if (src && window.openImageModal) window.openImageModal(src);
            return;
        }

        if (action === 'clearTimelineAuthor') {
            if (window.filterTimelineAuthor) window.filterTimelineAuthor(null);
            return;
        }

        if (action === 'closeAndOpenProfile') {
            const uid = parseInt(el.getAttribute('data-user-id') || '0', 10);
            const o = el.closest('.custom-dialog-overlay');
            if (o) o.remove();
            if (uid && window.openCreatorProfile) window.openCreatorProfile(uid);
            return;
        }
    }, true);
}

__ensureGlobalOverlayDelegation();


const input = document.getElementById('standaloneInput');


const form = document.body; 
// Mocking the 'wrapper' object needed by the function since it a standalone outside of Shoebox
const wrapper = { _selectedFiles: [], _uploadMode: 'creator' }; 

function showGuestDialog(onClose) {
    const d = document.createElement('div');
    d.className = 'custom-dialog-overlay open';
    d.style.zIndex = '20000';
    d.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 300px; text-align: center;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">License Required</h3>
            <p>Log in with a licensed account to use Advanced Mode, save content, and remove watermarks.</p>
            <div class="dialog-actions" style="display:flex; justify-content:space-between; gap:10px; margin-top:15px;">
                <button type="button" class="btn-cancel" id="guestDialogOk" style="width:45%;">OK</button>
                <button type="button" class="btn-public" id="guestDialogUpgrade" style="width:45%;">Upgrade</button>
            </div>
        </div>`;
    document.body.appendChild(d);
    
    d.querySelector('#guestDialogOk').onclick = () => {
        d.remove();
        if (onClose) onClose();
    };
    
    d.querySelector('#guestDialogUpgrade').onclick = () => {
        d.remove();
        if (onClose) onClose();
        const upgradeBtn = document.getElementById('btnUpgradePro');
        if (upgradeBtn) upgradeBtn.click();
    };
}

document.getElementById('launchBtn').onclick = async (e) => {
    window._isGuestMode = true;
    if (window.api && window.api.isLicensed) {
        const licensed = await window.api.isLicensed();
        window._isGuestMode = !licensed;
    }
    const app = document.getElementById('app-wrapper');
    if (app) app.style.display = "none";
    openMemeCreatorDialog(wrapper, form, input, null, [], false);
};

function openMemeCreatorDialog(wrapper, form, input, isMemeInput, sourceFiles, reopenExisting) {
    const overlay = form.querySelector(".meme-creator-overlay");
    if (!overlay) return;

    const box = overlay.querySelector(".meme-creator-box");
    const canvas = overlay.querySelector(".meme-creator-canvas");
    const layer = overlay.querySelector(".meme-text-layer");
    const stage = overlay.querySelector(".meme-creator-stage");

    const btnClose = overlay.querySelector(".meme-creator-close");
    const btnCancel = overlay.querySelector(".meme-creator-cancel");
    const btnPublish = overlay.querySelector(".meme-creator-publish");
    const btnUndo = overlay.querySelector(".meme-undo-btn");
    const btnRedo = overlay.querySelector(".meme-redo-btn");
    const btnClear = overlay.querySelector(".meme-clear-btn");
    const menuBtn = overlay.querySelector("#mainSettingsMenuBtn");
    const menuDrop = overlay.querySelector("#mainSettingsDropdown");
    const btnUpgradePro = overlay.querySelector("#btnUpgradePro");
    const btnCheckUpdate = overlay.querySelector("#btnCheckUpdate");
    const btnToggleCursor = overlay.querySelector("#btnToggleCursor");
    const btnSizeAuto = overlay.querySelector(".meme-size-auto-btn");
    const btnSizeV = overlay.querySelector(".meme-size-v-btn");
    const btnSizeH = overlay.querySelector(".meme-size-h-btn");
    const btnSizeSq = overlay.querySelector(".meme-size-sq-btn");
    const btnSizePort = overlay.querySelector(".meme-size-port-btn");
    const selectBookSize = overlay.querySelector(".meme-size-book-select");
        const btnSave = overlay.querySelector(".meme-creator-save");
    const btnSaveTemplate = overlay.querySelector(".meme-creator-save-template");
    const btnSaveProgress = overlay.querySelector(".meme-creator-save-progress");
    const btnOpenProgress = overlay.querySelector(".meme-creator-open-progress");
    const btnDownload = overlay.querySelector(".meme-creator-download");

    const btnTimeline = overlay.querySelector(".meme-timeline-toggle");
    const timelineView = overlay.querySelector(".meme-timeline-view");
    const splitView = overlay.querySelector(".meme-creator-split-view");
const btnBinder = overlay.querySelector(".meme-binder-btn");
const btnAddText = overlay.querySelector(".meme-creator-add-text");
const btnAdvanced = overlay.querySelector(".meme-creator-advanced");
const btnAddPhoto = overlay.querySelector(".meme-creator-add-photo");
const btnTemplate = overlay.querySelector(".meme-template-btn");
const btnWhitespace = overlay.querySelector(".meme-creator-whitespace");
const btnZoom = overlay.querySelector(".meme-creator-zoom");
const btnRemoveBg = overlay.querySelector(".meme-remove-bg-btn");
const btnLassoKeep = overlay.querySelector(".meme-lasso-keep-btn");
const bgToolsRow = overlay.querySelector(".meme-bg-tools-row");

const cropRow = overlay.querySelector(".meme-crop-row");
const btnCrop = overlay.querySelector(".meme-crop-btn");
const btnCut = overlay.querySelector(".meme-cut-btn");
const objectToolsRows = overlay.querySelectorAll(".meme-object-tools-row");

const layerControls = overlay.querySelector(".meme-advanced-row.group-context");
const btnShapes = overlay.querySelector(".meme-shapes-btn");
const shapePicker = overlay.querySelector(".meme-shapes-picker");
const shapePickerClose = overlay.querySelector(".meme-shapes-close");
const shapeButtons = overlay.querySelectorAll(".meme-shapes-picker button[data-shape]");
const opacityControl = overlay.querySelector(".meme-opacity-control");
const opacityInput = overlay.querySelector(".meme-creator-opacity");
const btnLayerUp = overlay.querySelector(".meme-layer-up");
const btnLayerDown = overlay.querySelector(".meme-layer-down");

const layerPanel = overlay.querySelector(".mc-layer-panel");
const btnLayerPanel = overlay.querySelector(".meme-layer-panel-btn");
const panelHeader = overlay.querySelector(".mc-layer-header");
const panelClose = overlay.querySelector(".mc-layer-close");

const viewport = overlay.querySelector(".meme-creator-viewport");
if (viewport && !viewport._scrollLockBound) {
    viewport._scrollLockBound = true;
    viewport.addEventListener("scroll", () => {
        if (typeof state !== 'undefined' && !state.zoomMode) {
            viewport.scrollTop = 0;
            viewport.scrollLeft = 0;
        }
    });
}
const btnVert = overlay.querySelector(".meme-creator-layout-vert");
const btnHorz = overlay.querySelector(".meme-creator-layout-horz");
const transformRow = overlay.querySelector(".meme-transform-row");
const canvasOptionsRow = overlay.querySelector(".meme-canvas-options-row");
    const btnFlip = overlay.querySelector(".meme-flip-btn");
    const btnRotate = overlay.querySelector(".meme-rotate-btn");

    const btnPaint = (() => {
        if (!transformRow) return null;
        let b = transformRow.querySelector(".meme-paint-btn");
        if (b) return b;

        b = document.createElement("button");
        b.type = "button";
        b.className = "meme-paint-btn meme-toggle-btn";
        b.title = "Paint an Object"; 
        b.textContent = "🎨";
        b.style.cssText = "width:42px; padding:0; font-size:20px; border-bottom-color: #2e7d32; box-shadow: none;";
        transformRow.appendChild(b);
        return b;
    })();

    const btnPaintCanvas = (() => {
        if (!transformRow) return null;
        let b = transformRow.querySelector(".meme-paint-canvas-btn");
        if (b) return b;

       b = document.createElement("button");
        b.type = "button";
        b.className = "meme-paint-canvas-btn meme-toggle-btn";
        b.title = "Paint on Canvas";
        b.textContent = "🖌️";
        b.style.cssText = "width:42px; padding:0; font-size:20px; border-bottom-color: #2e7d32; box-shadow: none;";
        transformRow.appendChild(b);
        return b;
    })();

    const paintToolbar = (() => {
        if (!transformRow || !transformRow.parentNode) return null;
        
        let t = transformRow.parentNode.querySelector(".meme-inline-paint-toolbar");
        if (t) return t;

        t = document.createElement("div");
        t.className = "meme-inline-paint-toolbar";
        t.innerHTML = `
            <div class="meme-inline-paint-row" style="gap:4px;">
                <button type="button" class="meme-paint-toolbtn active" data-tool="brush" title="Brush">🖌️</button>
                
                <select class="meme-paint-style" style="height:28px; border:1px solid #ccc; border-radius:4px; font-size:11px; max-width:80px;">
                    <option value="regular" selected>Regular</option>
                    <option value="airbrush">Airbrush</option>
                    <option value="oil">Oil</option>
                    <option value="crayon">Crayon</option>
                    <option value="marker">Marker</option>
                    <option value="pencil">Pencil</option>
                    <option value="calligraphy_pen">Cal. Pen</option>
                    <option value="calligraphy_brush">Cal. Brush</option>
                    <option value="watercolor">Water</option>
                    <option value="chalk">Chalk</option>
                </select>

                <select class="meme-paint-size" style="height:28px; border:1px solid #ccc; border-radius:4px; font-size:11px;">
                    <option value="2">2px</option>
                    <option value="5" selected>5px</option>
                    <option value="10">10px</option>
                    <option value="20">20px</option>
                    <option value="40">40px</option>
                </select>

                <select class="meme-paint-shape" style="height:28px; border:1px solid #ccc; border-radius:4px; font-size:11px;">
                    <option value="round" selected>●</option>
                    <option value="square">■</option>
                </select>

                <div style="width:1px; height:20px; background:#ddd; margin:0 2px;"></div>

                <button type="button" class="meme-paint-toolbtn" data-tool="fill" title="Fill">🪣</button>
                <button type="button" class="meme-paint-toolbtn" data-tool="eraser" title="Eraser">🧽</button>
                
                <input type="color" class="meme-paint-color" value="#ff0000" style="width:24px; height:28px; cursor:pointer; border:1px solid #ccc; border-radius:4px; padding:0;">
            </div>
            <div class="meme-inline-paint-row" style="justify-content: space-between; margin-top:4px;">
                 <span style="font-size:10px; color:#666;">Painting creates a new layer</span>
                 <button type="button" class="meme-paint-done-btn btn-public" style="padding:2px 8px; font-size:11px;">Done</button>
            </div>
        `;
        
        transformRow.parentNode.insertBefore(t, transformRow.nextSibling);
        return t;
    })();

    const btnStageCrop = (() => {
        if (!btnSizeSq || !btnSizeSq.parentNode) return null;
        const parent = btnSizeSq.parentNode;
        
        let b = parent.querySelector(".meme-stage-crop-btn");
        if (b) return b;

        b = document.createElement("button");
        b.type = "button";
                b.className = "meme-stage-crop-btn meme-toggle-btn meme-size-btn meme-size-btn-left is-hidden";
        b.title = "Crop Canvas - Manual Canvas Size";
        b.textContent = "✂️ Resize Canvas";

        parent.appendChild(b);
        return b;
    })();

    const inputCustomRatio = (() => {
        if (!btnSizeSq || !btnSizeSq.parentNode) return null;
        const parent = btnSizeSq.parentNode;
        
        let oldInput = parent.querySelector(".meme-custom-ratio-input");
        if (oldInput && oldInput.parentNode !== parent) oldInput.parentNode.remove();
        else if (oldInput) oldInput.remove();

        let wrapper = document.createElement("div");
        wrapper.className = "meme-custom-ratio-wrapper is-hidden";
        wrapper.style.cssText = "display: inline-flex; align-items: center; margin-left: 8px; gap: 4px;";
        
        let toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.textContent = "Aspect Ratio";
        toggleBtn.style.cssText = "font-size: 11px; height: 26px; padding: 0 8px; background: #e4e6eb; color: #1c1e21; border: 1px solid #ccd0d5; border-radius: 4px; cursor: pointer; font-weight: 600;";
        
        let i = document.createElement("input");
        i.type = "text";
        i.className = "meme-custom-ratio-input";
        i.title = "Custom Size";
        i.value = "16:9";
        i.dataset.mode = "ratio";
        i.style.cssText = "width: 55px; height: 26px; border: 1px solid #ccd0d5; border-radius: 4px; padding: 0 4px; font-size: 11px; text-align: center; outline: none;";
        
        toggleBtn.onclick = () => {
            if (i.dataset.mode === "ratio") {
                i.dataset.mode = "pixel";
                toggleBtn.textContent = "Pixel Count";
                if (state.fixedSize) i.value = `${state.fixedSize.w}x${state.fixedSize.h}`;
            } else {
                i.dataset.mode = "ratio";
                toggleBtn.textContent = "Aspect Ratio";
                if (state.customRatioString) {
                    i.value = state.customRatioString;
                } else if (state.fixedSize) {
                    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
                    const divisor = gcd(state.fixedSize.w, state.fixedSize.h);
                    let wRat = state.fixedSize.w / divisor;
                    let hRat = state.fixedSize.h / divisor;
                    if (wRat > 99 || hRat > 99) {
                        i.value = wRat >= hRat ? `${+(wRat/hRat).toFixed(2)}:1` : `1:${+(hRat/wRat).toFixed(2)}`;
                    } else {
                        i.value = `${wRat}:${hRat}`;
                    }
                }
            }
        };
        
        wrapper.appendChild(toggleBtn);
        wrapper.appendChild(i);
        parent.appendChild(wrapper);

        Object.defineProperty(wrapper, 'value', {
            get: () => i.value,
            set: (val) => { 
                if (i.dataset.mode === "pixel" && state.fixedSize) {
                    i.value = `${state.fixedSize.w}x${state.fixedSize.h}`;
                } else {
                    i.value = val; 
                }
            }
        });

        wrapper.originalAddEventListener = wrapper.addEventListener;
        wrapper.addEventListener = (type, listener, options) => {
            i.addEventListener(type, listener, options);
        };

        i.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;
            if (i.dataset.mode === "pixel") {
                if (!/[0-9xX]/.test(e.key)) e.preventDefault();
            } else {
                if (!/[0-9;:.]/.test(e.key)) e.preventDefault();
            }
        });

        i.addEventListener("input", function(e) {
            let pos = this.selectionStart;
            
            if (this.dataset.mode === "pixel") {
                let raw = this.value.toLowerCase().replace(/[^0-9x]/g, '');
                let parts = raw.split('x');
                let left = (parts[0] || "").substring(0, 4);
                let right = parts.slice(1).join('').substring(0, 4);
                
                this.value = left + 'x' + right;
                this.setSelectionRange(pos, pos);
                return;
            }

            let raw = this.value.replace(/;/g, ':').replace(/[^0-9:.]/g, '');
            let parts = raw.split(':');
            let leftRaw = parts[0] || "";
            let rightRaw = parts.slice(1).join(''); 

            const formatSide = (str) => {
                let hasDot = false, whole = 0, dec = 0, res = "";
                for (let c of str) {
                    if (c === '.') {
                        if (!hasDot) { hasDot = true; res += c; }
                    } else {
                        if (!hasDot) { if (whole < 2) { res += c; whole++; } }
                        else { if (dec < 2) { res += c; dec++; } }
                    }
                }
                return res;
            };

            let left = formatSide(leftRaw);
            let right = formatSide(rightRaw);

            this.value = left + ':' + right;
            this.setSelectionRange(pos, pos);
        });

        i.addEventListener("change", (e) => {
            if (e.target.dataset.mode === "pixel") {
                let parts = e.target.value.toLowerCase().split('x');
                let w = parseInt(parts[0], 10);
                let h = parseInt(parts[1], 10);
                if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
                    w = Math.max(100, Math.min(4000, w));
                    h = Math.max(100, Math.min(4000, h));
                    e.target.value = `${w}x${h}`;
                    state.fixedSize = { w, h };
                    state.customRatioString = null; 
                    [btnSizeV, btnSizeH, btnSizeSq, btnSizePort, selectBookSize].forEach(b => {
                        if (b) b.classList.remove('active');
                    });
                    drawPreview();
                }
                return;
            }

            let parts = e.target.value.split(':');
            let rw = parseFloat(parts[0]);
            let rh = parseFloat(parts[1]);

            if (!isNaN(rw) && !isNaN(rh) && rw > 0 && rh > 0) {
                let base = 1080;
                let w, h;
                if (rw >= rh) {
                    w = Math.round(base * (rw/rh));
                    h = base;
                    if (w > 4000) {
                        w = 4000;
                        h = Math.round(w * (rh/rw));
                    }
                } else {
                    w = base;
                    h = Math.round(base * (rh/rw));
                    if (h > 4000) {
                        h = 4000;
                        w = Math.round(h * (rw/rh));
                    }
                }
                state.fixedSize = { w, h };
                state.customRatioString = e.target.value;
                [btnSizeV, btnSizeH, btnSizeSq, btnSizePort, selectBookSize].forEach(b => {
                    if (b) b.classList.remove('active');
                });
                drawPreview();
            }
        });

        return wrapper;
    })();

    const fontInput = overlay.querySelector(".meme-creator-fontsize");

    const fontRow = overlay.querySelector(".meme-font-row");

    const fontWrapper = overlay.querySelector(".meme-custom-font-wrapper");
    const fontTrigger = overlay.querySelector(".meme-creator-font-trigger");
    const fontMenu = overlay.querySelector(".meme-creator-font-menu");
    const fontSearch = overlay.querySelector(".meme-font-search");
    const fontListEl = overlay.querySelector(".meme-font-list");

    const fontSelect = { value: "Anton" }; 

    const allFonts = ['Abril Fatface', 'Alice', 'Almendra', 'Anton', 'Arial', 'Arial Black', 'Archivo Black', 'Bangers', 'Bebas Neue', 'Berkshire Swash', 'Black Ops One', 'Caveat', 'Cinzel', 'Comic Sans MS', 'Cormorant Garamond', 'Courier New', 'Eagle Lake', 'Fjalla One', 'Georgia', 'Helvetica', 'Henny Penny', 'IM Fell English', 'Impact', 'Indie Flower', 'Lato', 'Lobster', 'Luckiest Guy', 'Macondo', 'Meddon', 'Merriweather', 'Montserrat', 'Nunito', 'Oswald', 'Pacifico', 'Patrick Hand', 'Permanent Marker', 'Playfair Display', 'Poppins', 'Press Start 2P', 'PT Sans', 'Raleway', 'Roboto Slab', 'Rubik', 'Russo One', 'Special Elite', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Uncial Antiqua', 'Verdana'];
    
    const renderFontList = (filter = "") => {
        if(!fontListEl) return;
        const currentVal = fontSelect.value;
        
        fontListEl.replaceChildren();

allFonts
    .filter(f => f.toLowerCase().includes(filter.toLowerCase()))
    .forEach((f) => {
        const isSelected = (f === currentVal);
        const bg = isSelected ? "#e8f5e9" : "transparent";
        const color = isSelected ? "#2e7d32" : "#1c1e21";
        const weight = isSelected ? "700" : "400";

        const opt = document.createElement("div");
        opt.className = "meme-font-option";
        opt.dataset.val = f;

        opt.style.padding = "6px 10px";
        opt.style.cursor = "pointer";
        opt.style.fontSize = "12px";
        opt.style.fontFamily = "'" + f + "', sans-serif";
        opt.style.color = color;
        opt.style.backgroundColor = bg;
        opt.style.fontWeight = weight;
        opt.style.display = "flex";
        opt.style.justifyContent = "space-between";
        opt.style.alignItems = "center";

        const left = document.createElement("span");
        left.textContent = f;
        opt.appendChild(left);

        if (isSelected) {
            const check = document.createElement("span");
            check.textContent = "✓";
            opt.appendChild(check);
        }

        fontListEl.appendChild(opt);
    });

    };
    renderFontList();

    if (fontWrapper && !fontWrapper._bound) {
        fontWrapper._bound = true;
        
        fontTrigger.onclick = (e) => {
            e.stopPropagation();
            const isOpen = fontMenu.style.display === 'block';
            document.querySelectorAll('.meme-creator-font-menu').forEach(el => el.style.display = 'none'); 
            
            if (!isOpen) {
                renderFontList();
                fontMenu.style.display = 'block';
                setTimeout(() => fontSearch.focus(), 50);
            } else {
                fontMenu.style.display = 'none';
            }
        };

        fontSearch.oninput = (e) => renderFontList(e.target.value);
        
        fontListEl.onclick = (e) => {
            const opt = e.target.closest('.meme-font-option');
            if(!opt) return;
            const val = opt.getAttribute('data-val');
            
            fontSelect.value = val;
            fontTrigger.textContent = val;
            fontMenu.style.display = 'none';
            const t = state.texts.find(x => x.id === state.selectedTextId);
            if (t) {
                t.fontFamily = val;
            } else {
                state.baseFontFamily = val;
            }

            if (document.fonts && val) {
                const famQuoted = val.includes(" ") ? `"${val}"` : val;
                document.fonts.load(`900 48px ${famQuoted}`).then(() => drawPreview()).catch(() => drawPreview());
            } else {
                drawPreview();
            }
            syncTextLayer();
        };

        window.addEventListener('click', (e) => {
            if(!fontWrapper.contains(e.target)) fontMenu.style.display = 'none';
        });
    }

    const weightSelect = overlay.querySelector(".meme-creator-font-weight");
    const styleSelect = overlay.querySelector(".meme-creator-font-style");
    const shapeSizeRow = overlay.querySelector(".meme-shape-size-row");
    const shapeSizeInput = overlay.querySelector(".meme-shape-size-input");
    const btnShapeSizeUp = overlay.querySelector(".meme-shape-size-up");
    const btnShapeSizeDown = overlay.querySelector(".meme-shape-size-down");

    let colorSelect = overlay.querySelector(".meme-creator-color");
    const canvasColorInput = overlay.querySelector(".meme-creator-canvas-color");
    const canvasEffectSelect = overlay.querySelector(".meme-creator-canvas-effect");
    const shadowColorInput = overlay.querySelector(".meme-creator-shadow-color");

    const __normalizeMemeTextColor = (v) => {
        const s = String(v || "").trim().toLowerCase();
        if (s === "white") return "#ffffff";
        if (s === "black") return "#000000";
        if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;
        return "#ffffff";
    };

    const __isDarkMemeColor = (v) => {
        const hex = __normalizeMemeTextColor(v).replace("#", "");
        const full = hex.length === 3 ? (hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]) : hex;
        const r = parseInt(full.slice(0, 2), 16) || 0;
        const g = parseInt(full.slice(2, 4), 16) || 0;
        const b = parseInt(full.slice(4, 6), 16) || 0;
        const luma = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
        return luma < 128;
    };

    const __contrastMemeColor = (v) => (__isDarkMemeColor(v) ? "#ffffff" : "#000000");

    if (colorSelect && colorSelect.tagName === "SELECT") {
        const picker = document.createElement("input");
        picker.type = "color";
        picker.className = colorSelect.className;
        picker.value = __normalizeMemeTextColor(colorSelect.value);
        picker.title = "Text color";
        colorSelect.replaceWith(picker);
        colorSelect = picker;
    } else if (colorSelect && colorSelect.type === "color") {
        colorSelect.value = __normalizeMemeTextColor(colorSelect.value);
    }

    const shadowDepthSelect = overlay.querySelector(".meme-creator-shadow-depth");
    const textShadowColorInput = overlay.querySelector(".meme-creator-textshadow-color");
    const textShadowDepthSelect = overlay.querySelector(".meme-creator-textshadow-depth");
    const btnBgToggle = overlay.querySelector(".meme-creator-bg-toggle");
    const btnTsToggle = overlay.querySelector(".meme-creator-ts-toggle");
    
    const colorHexInput = overlay.querySelector(".meme-creator-color-hex");
    const shadowColorHexInput = overlay.querySelector(".meme-creator-shadow-color-hex");
    const textShadowColorHexInput = overlay.querySelector(".meme-creator-textshadow-color-hex");





        if (!canvas || !layer) return;

    const savedMode = localStorage.getItem("mc_viewMode");
    const sliderControl = overlay.querySelector(".timeline-slider-control");
    if (savedMode === "timeline") {
    box.classList.add("timeline-mode");

    if (timelineView) {
        timelineView.classList.remove("is-hidden");
        timelineView.classList.add("is-flex");
    }
    if (splitView) splitView.classList.add("is-hidden");

    if (btnTimeline) {
        btnTimeline.textContent = "✏️ Editor";
        btnTimeline.classList.remove("btn-timeline");
        btnTimeline.classList.add("btn-editor");
    }

    if (sliderControl) sliderControl.classList.remove("is-hidden");
} else {
    box.classList.remove("timeline-mode");

    if (timelineView) {
        timelineView.classList.add("is-hidden");
        timelineView.classList.remove("is-flex");
    }
    if (splitView) splitView.classList.remove("is-hidden");

    if (btnTimeline) {
        btnTimeline.textContent = "🌎 Timeline";
        btnTimeline.classList.remove("btn-editor");
        btnTimeline.classList.add("btn-timeline");
    }

    if (sliderControl) sliderControl.classList.add("is-hidden");
}

overlay.classList.remove("is-hidden");

    document.body.classList.add('no-scroll');


    const existing = reopenExisting && wrapper._memeCreatorState ? wrapper._memeCreatorState : null;
    if (existing && !existing.nextZIndex) existing.nextZIndex = 100;

    let state = existing || {
            generated: false,
            sourceFiles: sourceFiles,
            images: [],
            layout: "vertical",
            whiteSpacePos: "none",
            whiteSpaceTopScope: "all",
            whiteSpaceSize: 0.15,
            whiteSpaceLines: true,
            zoomMode: false,
            showCenterLines: true,
            showGrid: false,
            gridAbove: true,
            snapEnabled: false,
                    texts: [],
            selectedTextId: null,
            draggingTextId: null,
       baseFontSize: 48,
        baseFontFamily: "Anton",
        baseFontWeight: "900",
        baseFontStyle: "normal",
        canvasColor: "#ffffff",
        canvasEffect: "none",
        baseColor: __normalizeMemeTextColor(colorSelect && colorSelect.value ? colorSelect.value : "#ffffff"),
        baseShadowColor: "#000000",
        baseShadowDepth: 2,
        baseShadowEnabled: true,
        baseTextShadowColor: "#000000",
        baseTextShadowDepth: 3,
        baseTextShadowEnabled: false,
                     advancedMode: false,
                     selectedImageIdx: null,
        shapes: [],
        selectedShapeId: null,

        cropMode: false,
        cropTargetIdx: null,
        cropDraft: null,
        cropBackup: null,
        
        cutMode: false,
        cutPath: [],
        fixedSize: null,
        
        stageCropMode: false,
        stageCropRect: null,

        nextZIndex: 1,
        history: [],
        historyStep: -1,
        lastFingerprint: ""
        };

    window._currentMemeState = state;

    if (existing && existing._fromProgressLoad) {
state.history = [];
state.historyStep = -1;
state.lastFingerprint = "";
delete state._fromProgressLoad;
setTimeout(saveHistory, 0);
}

window.__mcLoadHydratedState = function(hydrated) {
try {
for (const k of Object.keys(state)) delete state[k];
Object.assign(state, hydrated || {});
wrapper._memeCreatorState = state;

state.history = [];
state.historyStep = -1;
state.lastFingerprint = "";

localStorage.setItem("mc_viewMode", "editor");
box.classList.remove("timeline-mode");
if (timelineView) timelineView.style.display = "none";
if (splitView) splitView.style.display = "flex";
if (btnTimeline) {
    btnTimeline.textContent = "🌎 Timeline";
    btnTimeline.style.backgroundColor = "#2196f3";
    }
    const sliderControl = overlay.querySelector(".timeline-slider-control");
    if (sliderControl) sliderControl.style.display = "none";

    if (state.advancedMode && !state.fixedSize) {
        if (state.images && state.images.length > 0) {
            let fw = state.images[0].w || (state.images[0].img ? (state.images[0].img.naturalWidth || state.images[0].img.width) : 1080);
            let fh = state.images[0].h || (state.images[0].img ? (state.images[0].img.naturalHeight || state.images[0].img.height) : 1080);
            state.fixedSize = { w: Math.round(fw), h: Math.round(fh) };
        } else {
            state.fixedSize = { w: 1920, h: 1080 };
        }
    }

    const adv = !!state.advancedMode;

    if (btnAdvanced) {
    btnAdvanced.textContent = adv ? "ON" : "OFF";
    btnAdvanced.classList.toggle("active", adv);
    }

if (btnVert && btnVert.parentElement && btnVert.parentElement.parentElement) {
btnVert.parentElement.parentElement.style.display = adv ? "none" : "flex";
}
if (btnWhitespace) btnWhitespace.style.display = adv ? "none" : "block";
if (btnZoom) btnZoom.style.display = adv ? "none" : "block";

const sizeBtns = [btnSizeAuto, btnSizeV, btnSizeH, btnSizeSq, btnSizePort, selectBookSize];
sizeBtns.forEach(b => {
if (!b) return;
b.classList.toggle("is-hidden", !adv);
b.style.display = adv ? "inline-flex" : "none";
if (!adv) b.classList.remove("active");
});

if (btnStageCrop) {
    btnStageCrop.classList.toggle("is-hidden", !adv);
    btnStageCrop.style.display = adv ? "inline-flex" : "none";
    if (state.stageCropMode) {
        btnStageCrop.classList.add('active');
        btnStageCrop.style.setProperty("background-color", "#fff9c4", "important");
        btnStageCrop.style.setProperty("color", "#333", "important");
        btnStageCrop.style.setProperty("border-color", "#fbc02d", "important");
    } else {
        btnStageCrop.classList.remove('active');
        btnStageCrop.style.setProperty("background-color", "#f7f8e8", "important");
        btnStageCrop.style.setProperty("color", "#e67e22", "important");
        btnStageCrop.style.setProperty("border-color", "#e67e22", "important");
    }
}
if (inputCustomRatio) {
    inputCustomRatio.classList.toggle("is-hidden", !adv);
    inputCustomRatio.style.display = adv ? "inline-flex" : "none";
}

[layerControls, transformRow, opacityControl, cropRow, canvasOptionsRow].forEach(el => {
if (el) el.style.display = adv ? "flex" : "none";
});
objectToolsRows.forEach(el => {
        if (el) el.style.display = adv ? "flex" : "none";
    });

    if (btnSaveTemplate) btnSaveTemplate.style.display = "inline-flex";

    const hint = overlay.querySelector(".meme-creator-hint");
    if (hint) hint.classList.toggle("is-hidden", adv);

if (adv) {
state.whiteSpacePos = "none";
if (typeof updateWhitespaceBtnLabel === "function") updateWhitespaceBtnLabel();

if (state.fixedSize) {
sizeBtns.forEach(b => b && b.classList.remove("active"));
const w = state.fixedSize.w;
const h = state.fixedSize.h;

const isAuto = state._layoutInfo && w === state._layoutInfo.outW && h === state._layoutInfo.outH;
if (isAuto && btnSizeAuto) { btnSizeAuto.classList.add("active"); if (inputCustomRatio) { const gcd = (a, b) => b === 0 ? a : gcd(b, a % b); const divisor = gcd(w, h); inputCustomRatio.value = `${w/divisor}:${h/divisor}`; } }
else if (w === 1080 && h === 1920 && btnSizeV) { btnSizeV.classList.add("active"); if (inputCustomRatio) inputCustomRatio.value = "9:16"; }else if (w === 1920 && h === 1080 && btnSizeH) { btnSizeH.classList.add("active"); if (inputCustomRatio) inputCustomRatio.value = "16:9"; }
else if (w === 1080 && h === 1080 && btnSizeSq) { btnSizeSq.classList.add("active"); if (inputCustomRatio) inputCustomRatio.value = "1:1"; }
else if (w === 1080 && h === 1350 && btnSizePort) { btnSizePort.classList.add("active"); if (inputCustomRatio) inputCustomRatio.value = "4:5"; }
else {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(w, h);
    const wRat = w / divisor;
    const hRat = h / divisor;
    if (inputCustomRatio) {
        if (wRat > 99 || hRat > 99) {
            inputCustomRatio.value = wRat >= hRat ? `${+(wRat/hRat).toFixed(2)}:1` : `1:${+(hRat/wRat).toFixed(2)}`;
        } else {
            inputCustomRatio.value = `${wRat}:${hRat}`;
        }
    }
}
}} else {
if (typeof updateWhitespaceBtnLabel === "function") updateWhitespaceBtnLabel();
if (typeof updateZoomBtnLabel === "function") updateZoomBtnLabel();
}

drawPreview();
requestAnimationFrame(() => drawPreview());

setTimeout(saveHistory, 0);
return true;
} catch (e) {
console.error(e);
return false;
}
};



    if (btnTemplate) btnTemplate.style.display = 'block';

    if (btnSaveTemplate) btnSaveTemplate.style.display = 'inline-flex';

    if (state.whiteSpaceTopScope !== "top" && state.whiteSpaceTopScope !== "all") {
        state.whiteSpaceTopScope = "all";
    }


        function updateWhitespaceBtnLabel() {

        if (!btnWhitespace) return;
        if (state.whiteSpacePos === "none") btnWhitespace.textContent = "White Space: Off";
        else if (state.whiteSpacePos === "top") btnWhitespace.textContent = "White Space: Top";
        else if (state.whiteSpacePos === "right") btnWhitespace.textContent = "White Space: Right";
    }

function updateZoomBtnLabel() {
    if (!btnZoom) return;
    btnZoom.textContent = state.zoomMode ? "Zoom: Full" : "Zoom: Fit";
}


    function updateCropUi() {
    if (!btnCrop || !btnCut) return;

    const hasSelectedImage = (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined) || 
                              state.selectedTextId || state.selectedShapeId;

    if (cropRow) cropRow.style.display = state.advancedMode ? "flex" : "none";

    const isActive = state.advancedMode && (hasSelectedImage || state.cropMode || state.cutMode);


    btnCrop.disabled = !isActive;
    btnCrop.style.opacity = isActive ? "1" : "0.5";
    btnCrop.style.cursor = isActive ? "pointer" : "not-allowed";

    btnCut.disabled = !isActive;
    btnCut.style.opacity = isActive ? "1" : "0.5";
    btnCut.style.cursor = isActive ? "pointer" : "not-allowed";

    btnCrop.textContent = state.cropMode ? "💾 Save Crop" : "📐 Crop";
    
    if (state.cutMode) {
        btnCut.textContent = "✖ Stop Cutting";
        btnCut.classList.add("meme-crop-cancel");
        if(layer) layer.style.cursor = "crosshair";
    } else {
        btnCut.textContent = state.cropMode ? "Cancel" : "✂️ Cut";
        btnCut.classList.toggle("meme-crop-cancel", !!state.cropMode);
        if(layer) layer.style.cursor = "default";
    }
}

function startCropMode() {
    if (state.selectedImageIdx === null || state.selectedImageIdx === undefined) return;
    const imgObj = state.images[state.selectedImageIdx];
    if (!imgObj) return;

    state.cropMode = true;
    state.cropTargetIdx = state.selectedImageIdx;
    
    state.cropBackup = {
        crop: imgObj.crop ? { ...imgObj.crop } : null,
        w: imgObj.w,
        h: imgObj.h
    };
    
    state.cropDraft = imgObj.crop ? { ...imgObj.crop } : { x: 0, y: 0, w: 1, h: 1 };

    delete imgObj.crop;
    
    const natW = imgObj.img.naturalWidth || imgObj.img.width;
    const natH = imgObj.img.naturalHeight || imgObj.img.height;
    const aspect = natW / natH;
    imgObj.h = imgObj.w / aspect;

    updateCropUi();
    drawPreview();
}

function finishCropMode(apply) {
    if (!state.cropMode) return;

    const idx = (state.cropTargetIdx !== null && state.cropTargetIdx !== undefined)
            ? state.cropTargetIdx
            : state.selectedImageIdx;

    const imgObj = (idx !== null && idx !== undefined) ? state.images[idx] : null;

    if (imgObj) {
        if (apply && state.cropDraft) {
            const c = { ...state.cropDraft };

           if (
                c.x <= 0.0001 &&
                c.y <= 0.0001 &&
                c.w >= 0.9999 &&
                c.h >= 0.9999
            ) {
                delete imgObj.crop;
            } else {
                imgObj.crop = c;
                const natW = imgObj.img.naturalWidth || imgObj.img.width;
                const natH = imgObj.img.naturalHeight || imgObj.img.height;
                const cropRatio = (natW * c.w) / (natH * c.h);
                imgObj.h = imgObj.w / cropRatio;
            }
        } else {
            if (state.cropBackup) {
                if (state.cropBackup.crop) imgObj.crop = state.cropBackup.crop;
                else delete imgObj.crop;

                imgObj.w = state.cropBackup.w;
                imgObj.h = state.cropBackup.h;
            }
        }
    }

    state.cropMode = false;
    state.cropTargetIdx = null;
    state.cropDraft = null;
    state.cropBackup = null;

    updateCropUi();
    drawPreview();
}


let whiteSpaceLinesWrap = null;
let whiteSpaceTopScopeWrap = null;

function ensureWhiteSpaceStack() {
    if (!btnWhitespace) return null;

    const parent = btnWhitespace.parentNode;
    if (parent && parent.classList && parent.classList.contains("meme-whitespace-stack")) {
        let tc = parent.querySelector('.meme-whitespace-toggles');
        return tc || parent;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "meme-whitespace-stack";
    wrapper.style.cssText = "position: relative; width: 100%; display: block;";

    btnWhitespace.parentNode.insertBefore(wrapper, btnWhitespace);
    wrapper.appendChild(btnWhitespace);

        const tc = document.createElement("div");
        tc.className = "meme-whitespace-toggles";
        tc.style.cssText = "margin-top: 4px; display: flex; gap: 8px; z-index: 50; width: max-content;";
        wrapper.appendChild(tc);

        return tc;
}

function ensureWhiteSpaceLinesToggle() {
    if (whiteSpaceLinesWrap) return whiteSpaceLinesWrap;

    const wrapper = ensureWhiteSpaceStack();
    if (!wrapper) return null;

    whiteSpaceLinesWrap = document.createElement("div");
    whiteSpaceLinesWrap.className = "green-toggle-context";

    whiteSpaceLinesWrap.innerHTML = `
        <div class="discussion-toggle-container">
            <button type="button" class="discussion-toggle-btn" data-mode="off">no lines</button>
            <button type="button" class="discussion-toggle-btn" data-mode="on">lines</button>
        </div>
    `;

    wrapper.appendChild(whiteSpaceLinesWrap);

    const offBtn = whiteSpaceLinesWrap.querySelector('[data-mode="off"]');
    const onBtn = whiteSpaceLinesWrap.querySelector('[data-mode="on"]');

    const setMode = (isOn) => {
        state.whiteSpaceLines = !!isOn;
        updateWhiteSpaceLinesToggle();
        drawPreview();
    };

    if (offBtn) offBtn.addEventListener("click", (e) => { e.preventDefault(); setMode(false); });
    if (onBtn) onBtn.addEventListener("click", (e) => { e.preventDefault(); setMode(true); });

    return whiteSpaceLinesWrap;
}


function updateWhiteSpaceLinesToggle() {
    const wrap = ensureWhiteSpaceLinesToggle();
    if (!wrap) return;

    if (state.advancedMode) {
        wrap.style.display = "none";
        return;
    }

    const shouldShow =
        state.whiteSpacePos === "right" &&
        state.layout === "vertical" &&
        state.images.length > 1;

    wrap.style.display = "block";
    wrap.style.opacity = shouldShow ? "1" : "0.5";
    wrap.style.pointerEvents = shouldShow ? "auto" : "none";

    const offBtn = wrap.querySelector('[data-mode="off"]');
    const onBtn = wrap.querySelector('[data-mode="on"]');

    if (offBtn) offBtn.classList.toggle("active", !state.whiteSpaceLines);
    if (onBtn) onBtn.classList.toggle("active", !!state.whiteSpaceLines);
}

function ensureWhiteSpaceTopScopeToggle() {
    if (whiteSpaceTopScopeWrap) return whiteSpaceTopScopeWrap;

    const wrapper = ensureWhiteSpaceStack();
    if (!wrapper) return null;

    whiteSpaceTopScopeWrap = document.createElement("div");
    whiteSpaceTopScopeWrap.className = "green-toggle-context";

    whiteSpaceTopScopeWrap.innerHTML = `
        <div class="discussion-toggle-container">
            <button type="button" class="discussion-toggle-btn" data-mode="top">Top Image</button>
            <button type="button" class="discussion-toggle-btn" data-mode="all">All Images</button>
        </div>
    `;

    wrapper.insertBefore(whiteSpaceTopScopeWrap, wrapper.firstChild);

    const topBtn = whiteSpaceTopScopeWrap.querySelector('[data-mode="top"]');
    const allBtn = whiteSpaceTopScopeWrap.querySelector('[data-mode="all"]');

    const setMode = (mode) => {
        state.whiteSpaceTopScope = mode;
        updateWhiteSpaceTopScopeToggle();
        drawPreview();
    };

    if (topBtn) topBtn.addEventListener("click", (e) => { e.preventDefault(); setMode("top"); });
    if (allBtn) allBtn.addEventListener("click", (e) => { e.preventDefault(); setMode("all"); });

    return whiteSpaceTopScopeWrap;
}


function updateWhiteSpaceTopScopeToggle() {
    const wrap = ensureWhiteSpaceTopScopeToggle();
    if (!wrap) return;

    if (state.advancedMode) {
        wrap.style.display = "none";
        return;
    }

    const shouldShow =
        state.whiteSpacePos === "top" &&
        state.layout === "vertical" &&
        state.images.length > 1;

    wrap.style.display = "block";
    wrap.style.opacity = shouldShow ? "1" : "0.5";
    wrap.style.pointerEvents = shouldShow ? "auto" : "none";

    const topBtn = wrap.querySelector('[data-mode="top"]');
    const allBtn = wrap.querySelector('[data-mode="all"]');

    if (topBtn) topBtn.classList.toggle("active", state.whiteSpaceTopScope === "top");
    if (allBtn) allBtn.classList.toggle("active", state.whiteSpaceTopScope !== "top");
}




        function setSelected(id, showFrame = true) { 
        state.selectedTextId = id;

        if (id) {
            state.selectedImageIdx = null;
            state.selectedShapeId = null;
            const frame = layer.querySelector('.meme-image-frame');
            if (frame) frame.remove();
        }

        state.frameVisible = showFrame; 

        const selectedText = state.texts.find(t => t.id === id);
        const selectedShape = !selectedText && state.selectedShapeId ? state.shapes.find(s => s.id === state.selectedShapeId) : null;
        
        const hasText = !!selectedText;
        const hasShape = !!selectedShape;
        const isEmoji = hasShape && selectedShape.type === 'emoji';
        const hasAny = hasText || hasShape;
        
        let isLocked = false;
        if (selectedText) isLocked = !!selectedText.locked;
        else if (selectedShape) isLocked = !!selectedShape.locked;

        const setInputState = (enabled, ...els) => {
            els.forEach(el => {
                if (!el) return;
                el.disabled = !enabled;
                el.style.opacity = enabled ? "1" : "0.4";
                el.style.cursor = enabled ? ((el.type === 'text' || el.type === 'number') ? 'text' : 'pointer') : "not-allowed";
                el.style.pointerEvents = enabled ? "auto" : "none";
            });
        };

        const colorControlsEnabled = (hasText || (hasShape && !isEmoji)) && !isLocked;
        setInputState(colorControlsEnabled, colorSelect, colorHexInput, btnBgToggle, btnTsToggle);

        if (selectedShape && !isEmoji) {

            if(fontRow) fontRow.style.display = 'none';
            if(shapeSizeRow) shapeSizeRow.style.display = 'flex';

            if(shapeSizeInput) shapeSizeInput.value = selectedShape.strokeWidth || 5;
        } else {
            if(fontRow) fontRow.style.display = 'flex';
            if(shapeSizeRow) shapeSizeRow.style.display = 'none';

            setInputState(hasText && !isLocked, fontWrapper, fontInput, weightSelect, styleSelect);
        }

        if (opacityControl && opacityInput) {
            const anySel = hasAny || (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined);
            opacityControl.style.opacity = anySel ? "1" : "0.5";
            opacityControl.style.pointerEvents = anySel ? "auto" : "none";
            opacityInput.disabled = !anySel;

           const objTools = overlay.querySelector(".meme-object-tools-row");
                  if (objTools) {
                      const controls = objTools.querySelectorAll(".meme-layer-controls");
                      if (controls[0]) { controls[0].style.opacity = anySel ? "1" : "0.5"; controls[0].style.pointerEvents = "auto"; }
                      if (controls[1]) { controls[1].style.opacity = anySel ? "1" : "0.5"; controls[1].style.pointerEvents = "auto"; }
                      
                      const hoverBtns = objTools.querySelectorAll(".meme-visibility-btn, .meme-lock-btn, .meme-pos-lock-btn, .meme-multiselect-btn");
                      hoverBtns.forEach(b => b.style.cursor = anySel ? "pointer" : "default");
                  }
            
            let activeItem = null;
            if (selectedText) activeItem = selectedText;
            else if (selectedShape) activeItem = selectedShape;
            else if (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined) activeItem = state.images[state.selectedImageIdx];

            const btnVis = overlay.querySelector(".meme-visibility-btn");
            const btnLock = overlay.querySelector(".meme-lock-btn");
            const btnPos = overlay.querySelector(".meme-pos-lock-btn");

           if (activeItem) {
                if (btnVis) btnVis.classList.toggle("active", activeItem.hidden === true);
                if (btnLock) btnLock.classList.toggle("active", activeItem.locked === true);
                if (btnPos) btnPos.classList.toggle("active", activeItem.posLocked === true);
            } else {
                if (btnVis) btnVis.classList.remove("active");
                if (btnLock) btnLock.classList.remove("active");
                if (btnPos) btnPos.classList.remove("active");
            }
            
            const cloneBtnUI = overlay.querySelector(".meme-clone-btn");
            if (cloneBtnUI) {
                cloneBtnUI.style.opacity = activeItem ? "1" : "0.5";
                cloneBtnUI.style.pointerEvents = "auto";
                cloneBtnUI.style.cursor = activeItem ? "pointer" : "default";
            }
        }

        if (selectedText) {
            if (fontInput) fontInput.value = String(selectedText.fontSize || state.baseFontSize);
            if (fontSelect) {
    const chosen = selectedText.fontFamily || state.baseFontFamily || "Anton";
    fontSelect.value = chosen;

    if (fontTrigger) {
        fontTrigger.textContent = chosen;
        fontTrigger.style.color = "#1c1e21";
        fontTrigger.style.fontFamily = `'${chosen}', sans-serif`;
    }
}

           if (weightSelect) {
    const rawW = Number(selectedText.fontWeight || state.baseFontWeight || "900");
    const tierW = (rawW >= 600) ? "900" : "400";
    weightSelect.value = tierW;
}
            if (styleSelect) {
                styleSelect.value = selectedText.fontStyle || state.baseFontStyle || "normal";
            }

            if (colorSelect) colorSelect.value = __normalizeMemeTextColor(selectedText.color || state.baseColor || "#ffffff");
            if (colorHexInput && colorSelect) colorHexInput.value = colorSelect.value;
            if (opacityInput) opacityInput.value = (selectedText.opacity !== undefined) ? selectedText.opacity : 1;
        }

        if (btnBgToggle) {
            let isOn = false;
            let val = "#000000";

            if (selectedText) {
                isOn = (selectedText.shadowEnabled !== false);
                val = selectedText.shadowColor || state.baseShadowColor || "#000000";
            } else if (selectedShape) {
                isOn = (selectedShape.fillEnabled === true);
                val = selectedShape.fillColor || "#ffffff";
            }

           btnBgToggle.textContent = isOn ? "ON" : "OFF";
            btnBgToggle.classList.toggle("active", isOn);
            
            setInputState((colorControlsEnabled && isOn), shadowColorInput, shadowColorHexInput, shadowDepthSelect);
            if (colorControlsEnabled && shadowColorInput) {
                shadowColorInput.value = __normalizeMemeTextColor(val);
                if (shadowColorHexInput) shadowColorHexInput.value = shadowColorInput.value;
            }
        }

        if (btnTsToggle) {
            let isOn = false;
            let val = "#000000";
            let depth = "3";

            if (selectedText) {
                isOn = (selectedText.textShadowEnabled === true);
                val = selectedText.textShadowColor || state.baseTextShadowColor || "#000000";
                depth = selectedText.textShadowDepth || state.baseTextShadowDepth || 3;
            } else if (selectedShape) {
                isOn = (selectedShape.shadowEnabled === true);
                val = selectedShape.shadowColor || "#000000";
                depth = selectedShape.shadowBlur || 10;
            }

            btnTsToggle.textContent = isOn ? "ON" : "OFF";
            btnTsToggle.classList.toggle("active", isOn);
            
            setInputState((colorControlsEnabled && isOn), textShadowColorInput, textShadowColorHexInput, textShadowDepthSelect);
            if (colorControlsEnabled && textShadowColorInput) {
                textShadowColorInput.value = __normalizeMemeTextColor(val);
                if (textShadowColorHexInput) textShadowColorHexInput.value = textShadowColorInput.value;
            }
            if (colorControlsEnabled && textShadowDepthSelect) textShadowDepthSelect.value = String(depth);
        }

        Array.from(layer.querySelectorAll(".meme-text-item")).forEach(el => {
            el.classList.toggle("selected", el.dataset.id === id && showFrame);
        });

        updateCropUi();
        if (typeof syncLayerPanel === 'function') syncLayerPanel();
    }

    function closeEditor(force = false) {
        const hasContent = state.images.length > 0 || state.texts.length > 0 || (state.shapes && state.shapes.length > 0);

        if (hasContent && !force) {
            const d = document.createElement('div');
            d.className = 'custom-dialog-overlay open';
            d.style.zIndex = '10000';
            d.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 320px; text-align: center; position: relative;">
                    <button type="button" class="unsaved-close-x" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #c0392b; font-size: 20px; line-height: 1; font-weight: bold; cursor: pointer;">&times;</button>
                    <h3>Unsaved Changes</h3>
                    <p>Are you sure you want to close without saving?</p>
                    <div class="dialog-actions" style="flex-direction: column; gap: 8px;">
                        <button type="button" class="btn-public" id="unsavedSaveBtn" style="width: 100%;">Save As Meme Before Closing</button>
                        
                        <button type="button" class="btn-public" id="unsavedTemplateBtn" 
                                style="width: 100%; background-color: #009688; transition: background-color 0.2s;">Save As Template Before Closing</button>

                        
                        <button type="button" class="btn-cancel" id="unsavedCloseBtn" 
                                style="width: 100%; color: #fff; background-color: #c0392b; border: 1px solid #c0392b; transition: background-color 0.2s;">Close (Discard)</button>

                    </div>
                </div>`;
            document.body.appendChild(d);

            d.querySelector('.unsaved-close-x').onclick = () => { d.remove(); };

            d.querySelector('#unsavedSaveBtn').onclick = () => { 
                d.remove(); 
                overlay.dataset.closeOnSave = 'true';
                if(btnSave) btnSave.click(); 
            };
            d.querySelector('#unsavedTemplateBtn').onclick = () => { 
                d.remove(); 
                overlay.dataset.closeOnSave = 'true';
                if(btnSaveTemplate) btnSaveTemplate.click(); 
            };
            d.querySelector('#unsavedCloseBtn').onclick = () => { d.remove(); closeEditor(true); };
            return;
        }

                overlay.style.display = "none";
        document.body.classList.remove('no-scroll');
        const app = document.getElementById('app-wrapper');
        if (app) app.style.display = "";


        const preserveMainSelection = !!(wrapper && wrapper._preserveSelectedFilesOnClose);

        if (wrapper) {
            wrapper._memeCreatorState = null;

            if (!preserveMainSelection) {
                wrapper._selectedFiles = [];
                const clearBtn = wrapper.querySelector('.clear-images-btn');
                if (clearBtn) clearBtn.click();
            }

            delete wrapper._preserveSelectedFilesOnClose;
        }

        if (input && !preserveMainSelection) input.value = "";

        if (typeof state !== 'undefined') {
            state.images = [];
            state.texts = [];
            state.shapes = [];
            state.history = [];
            state.sourceFiles = [];
            state.selectedImageIdx = null;
            state.selectedTextId = null;
            state.selectedShapeId = null;

            state.advancedMode = false;
            state.cropMode = false;
            state.cutMode = false;
            state.stageCropMode = false;
            state.stageCropRect = null;    
            state.canvasColor = "#ffffff"; 
            state.canvasEffect = "none"; 
           state.fixedSize = null;
            state.zoomMode = false;
            state.layout = "vertical";
            state.whiteSpacePos = "none";
            state.whiteSpaceSize = 0.15;
            state.showCenterLines = true;
            state.showGrid = false;
            state.gridAbove = true;
            state.snapEnabled = false;
        }
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (layer) layer.innerHTML = "";
        if (btnAdvanced) {
            btnAdvanced.textContent = "OFF";
            btnAdvanced.classList.remove('active');
        }

        [layerControls, transformRow, opacityControl, cropRow, canvasOptionsRow, btnSaveTemplate, btnSizeV, btnSizeH, btnSizeSq, btnSizePort, selectBookSize, btnStageCrop, inputCustomRatio].forEach(el => {
             if (el) el.style.display = 'none';
        });
        objectToolsRows.forEach(el => {
             if (el) el.style.display = 'none';
        });
        
        [btnSizeV, btnSizeH, btnSizeSq, btnSizePort, selectBookSize].forEach(b => { if(b) b.classList.remove('active'); });
        if (selectBookSize) selectBookSize.value = "";

        if (btnStageCrop) {
            btnStageCrop.classList.remove('active');
            btnStageCrop.style.removeProperty("background-color");
            btnStageCrop.style.removeProperty("color");
            btnStageCrop.style.removeProperty("border-color");
            btnStageCrop.style.backgroundColor = "#ffffff";
            btnStageCrop.style.color = "#e67e22";
            btnStageCrop.style.borderColor = "#e67e22";
        }

        if (canvasColorInput) canvasColorInput.value = "#ffffff";
        const cHex = overlay.querySelector(".meme-creator-canvas-hex");
        if (cHex) cHex.value = "#ffffff";

        if (canvasEffectSelect) canvasEffectSelect.value = "none";

        if (btnWhitespace) btnWhitespace.style.display = 'block';
        if (btnZoom) btnZoom.style.display = 'block';
        if (btnVert && btnVert.parentElement && btnVert.parentElement.parentElement) {
            btnVert.parentElement.parentElement.style.display = 'flex';
        }

                const hint = overlay.querySelector(".meme-creator-hint");
        if (hint) hint.style.display = 'none';

        const shouldLogout = (overlay.dataset.logoutAfterClose === "true");
        if (shouldLogout) {
            delete overlay.dataset.logoutAfterClose;
            doLogout();
        }
    }



    function getDiff(a, b) {
        if (a === b) return undefined;
        if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return b;
        if (b instanceof Element || b instanceof File || b instanceof Blob) return b;
        if (Array.isArray(b)) {
            const arr = [], max = Math.max(a.length, b.length);
            let ch = false;
            for (let i = 0; i < max; i++) {
                if (i >= a.length) { arr[i] = b[i]; ch = true; }
                else if (i >= b.length) { arr[i] = { __del: true }; ch = true; }
                else { const d = getDiff(a[i], b[i]); arr[i] = d; if (d !== undefined) ch = true; }
            }
            return ch ? arr : undefined;
        }
        const res = {}; let ch = false;
        for (let k in b) { const d = getDiff(a[k], b[k]); if (d !== undefined) { res[k] = d; ch = true; } }
        for (let k in a) if (!(k in b)) { res[k] = { __del: true }; ch = true; }
        return ch ? res : undefined;
    }

    function applyPatch(a, p) {
        if (p === undefined) return a;
        if (p == null || typeof p !== 'object' || p instanceof Element || p instanceof File || p instanceof Blob) return p;
        if (p.__del) return undefined;
        if (Array.isArray(a) && Array.isArray(p)) {
            const arr = [...a];
            p.forEach((v, i) => arr[i] = applyPatch(arr[i], v));
            return arr.filter(x => x !== undefined && !(x && x.__del));
        }
        const res = { ...a };
        for (let k in p) {
            const val = applyPatch(res[k], p[k]);
            if (val === undefined || (val && val.__del)) delete res[k]; else res[k] = val;
        }
        return res;
    }

    function buildState(step) {
        let cur = state.history[0];
        for (let i = 1; i <= step; i++) cur = applyPatch(cur, state.history[i]);
        return cur;
    }

    function saveHistory() {
        const fingerprint = JSON.stringify({
            imgs: state.images.map(i => ({ x: i.x, y: i.y, w: i.w, h: i.h, r: i.rotation, f: i.flip, o: i.opacity, z: i.zIndex, v: i._version || 0 })),
            txts: state.texts.map(t => ({ x: t.x, y: t.y, w: t.w, h: t.h, txt: t.text, sz: t.fontSize, c: t.color, r: t.rotation, z: t.zIndex, fam: t.fontFamily, wght: t.fontWeight, sc: t.shadowColor, sd: t.shadowDepth, se: t.shadowEnabled, tsc: t.textShadowColor, tsd: t.textShadowDepth, tse: t.textShadowEnabled, o: t.opacity })),
            shps: (state.shapes || []).map(s => ({ x: s.x, y: s.y, w: s.w, h: s.h, c: s.color, sw: s.strokeWidth, r: s.rotation, f: s.flip, z: s.zIndex, fc: s.fillColor, fe: s.fillEnabled, sc: s.shadowColor, sb: s.shadowBlur, se: s.shadowEnabled, o: s.opacity })),
            bg: { l: state.layout, wp: state.whiteSpacePos, ws: state.whiteSpaceSize, cc: state.canvasColor, ce: state.canvasEffect }
        });

        if (state.lastFingerprint === fingerprint) return;
        state.lastFingerprint = fingerprint;

        const cloneImage = (img) => ({ ...img, crop: img.crop ? { ...img.crop } : null });
        const cloneText = (t) => ({ ...t });
        const cloneShape = (s) => ({ ...s });

        const snapshot = {
            images: state.images.map(cloneImage),
            texts: state.texts.map(cloneText),
            shapes: (state.shapes || []).map(cloneShape),
            layout: state.layout,
            whiteSpacePos: state.whiteSpacePos,
            whiteSpaceSize: state.whiteSpaceSize,
            canvasColor: state.canvasColor,
            canvasEffect: state.canvasEffect,
            nextZIndex: state.nextZIndex
        };

        if (state.historyStep < state.history.length - 1) {
            state.history = state.history.slice(0, state.historyStep + 1);
        }

        if (state.history.length === 0) {
            state.history.push(snapshot);
        } else {
            const lastState = buildState(state.historyStep);
            state.history.push(getDiff(lastState, snapshot));
        }

        state.historyStep++;

        if (state.history.length > 50) {
            state.history[1] = applyPatch(state.history[0], state.history[1]);
            state.history.shift();
            state.historyStep--;
        }
    }

    function restoreHistory(step) {
        const snap = buildState(step);
        if (!snap) return;

        state.images = snap.images.map(i => ({ ...i, crop: i.crop ? { ...i.crop } : null }));
        state.texts = snap.texts.map(t => ({ ...t }));
        state.shapes = snap.shapes.map(s => ({ ...s }));
        state.layout = snap.layout;
        state.whiteSpacePos = snap.whiteSpacePos;
        state.whiteSpaceSize = snap.whiteSpaceSize;
        state.canvasColor = snap.canvasColor;
        state.canvasEffect = snap.canvasEffect;
        state.nextZIndex = snap.nextZIndex;

        const cInp = document.querySelector(".meme-creator-canvas-color");
        if (cInp) cInp.value = state.canvasColor || "#ffffff";
        const cHex = document.querySelector(".meme-creator-canvas-hex");
        if (cHex) cHex.value = state.canvasColor || "#ffffff";
        const cEff = document.querySelector(".meme-creator-canvas-effect");
        if (cEff) cEff.value = state.canvasEffect || "none";

        state.selectedImageIdx = null;
        state.selectedTextId = null;
        state.selectedShapeId = null;
        state.lastFingerprint = JSON.stringify({
            imgs: state.images.map(i => ({ x: i.x, y: i.y, w: i.w, h: i.h, r: i.rotation, f: i.flip, o: i.opacity, z: i.zIndex, v: i._version || 0 })),
            txts: state.texts.map(t => ({ x: t.x, y: t.y, w: t.w, h: t.h, txt: t.text, sz: t.fontSize, c: t.color, r: t.rotation, z: t.zIndex, fam: t.fontFamily, wght: t.fontWeight, sc: t.shadowColor, sd: t.shadowDepth, se: t.shadowEnabled, tsc: t.textShadowColor, tsd: t.textShadowDepth, tse: t.textShadowEnabled, o: t.opacity })),
            shps: (state.shapes || []).map(s => ({ x: s.x, y: s.y, w: s.w, h: s.h, c: s.color, sw: s.strokeWidth, r: s.rotation, f: s.flip, z: s.zIndex, fc: s.fillColor, fe: s.fillEnabled, sc: s.shadowColor, sb: s.shadowBlur, se: s.shadowEnabled, o: s.opacity })),
            bg: { l: state.layout, wp: state.whiteSpacePos, ws: state.whiteSpaceSize, cc: state.canvasColor, ce: state.canvasEffect }
        });

        syncTextLayer();
        drawPreview();
    }

    function setupGlobalHistory() {
        if (overlay._historyWired) return;
        overlay._historyWired = true;
        const autoSave = (e) => {
             if (overlay.style.display === 'none') return;
             if (e && e.target && (e.target.closest('.meme-undo-btn') || e.target.closest('.meme-redo-btn')))                     return;
             setTimeout(saveHistory, 50);
        };
        
        overlay.addEventListener('mouseup', autoSave);
        overlay.addEventListener('click', autoSave);
        overlay.addEventListener('keyup', autoSave);
        overlay.addEventListener('change', autoSave);

        window.addEventListener('keydown', (e) => {
            if (overlay.style.display === 'none') return;

            const paintOv = overlay.querySelector(".meme-paint-overlay");
            if (paintOv && paintOv.style.display !== 'none') {
                if (paintOv._handleKey) paintOv._handleKey(e);
                return;
            }

            const active = document.activeElement;
            const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !isTyping) {
                e.preventDefault();
                const moveAmountPx = e.shiftKey ? 10 : 1;
                const info = state._layoutInfo;

                let item = null;
                let type = '';

                if (state.selectedTextId) {
                    item = state.texts.find(t => t.id === state.selectedTextId);
                    type = 'text';
                } else if (state.selectedShapeId) {
                    item = state.shapes.find(s => s.id === state.selectedShapeId);
                    type = 'shape';
                } else if (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined) {
                    item = state.images[state.selectedImageIdx];
                    type = 'image';
                }

                if (item && info) {
                    const dx = e.key === 'ArrowLeft' ? -moveAmountPx : (e.key === 'ArrowRight' ? moveAmountPx : 0);
                    const dy = e.key === 'ArrowUp' ? -moveAmountPx : (e.key === 'ArrowDown' ? moveAmountPx : 0);

                    if (type === 'text' || type === 'shape') {
                        item.x += dx / info.outW;
                        item.y += dy / info.outH;
                    } else if (type === 'image') {
                        item.x += dx;
                        item.y += dy;
                    }
                    
                    window._checkSnapToCenter(item, type, info);
                    state._showSnapLines = true;
                    clearTimeout(state._snapTimer);
                    state._snapTimer = setTimeout(() => { state._showSnapLines = false; drawPreview(); }, 1000);
                    
                    drawPreview();
                    syncTextLayer();
                    return;
                }
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey && !isTyping) {
                e.preventDefault();
                if (state.historyStep > 0) {
                    state.historyStep--;
                    restoreHistory(state.historyStep);
                }
            }
            else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey)) && !isTyping) {
                e.preventDefault();
                if (state.historyStep < state.history.length - 1) {
                    state.historyStep++;
                    restoreHistory(state.historyStep);
                }
            }
            else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && !isTyping) {
                if (state.selectedTextId) {
                    const t = state.texts.find(x => x.id === state.selectedTextId);
                    if (t) state.clipboard = { type: 'text', data: JSON.parse(JSON.stringify(t)) };
                } else if (state.selectedShapeId) {
                    const s = state.shapes.find(x => x.id === state.selectedShapeId);
                    if (s) state.clipboard = { type: 'shape', data: JSON.parse(JSON.stringify(s)) };
                } else if (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined) {
                    const i = state.images[state.selectedImageIdx];
                    if (i) state.clipboard = { type: 'image', data: { ...i, crop: i.crop ? { ...i.crop } : null } };
                }
            }
            else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v' && !isTyping) {
                if (state.clipboard) {
                    e.preventDefault();
                    if (state.clipboard.type === 'text') {
                        const newT = JSON.parse(JSON.stringify(state.clipboard.data));
                        newT.id = "t_" + Math.random().toString(16).slice(2) + "_" + Date.now();
                        newT.x = (newT.x || 0) + 0.05;
                        newT.y = (newT.y || 0) + 0.05;
                        newT.zIndex = state.nextZIndex++;
                        state.texts.push(newT);
                        setSelected(newT.id);
                    } else if (state.clipboard.type === 'shape') {
                        const newS = JSON.parse(JSON.stringify(state.clipboard.data));
                        newS.id = (newS.type === 'emoji' ? "emoji_" : "shape_") + Date.now();
                        newS.x = (newS.x || 0) + 0.05;
                        newS.y = (newS.y || 0) + 0.05;
                        newS.zIndex = state.nextZIndex++;
                        state.shapes.push(newS);
                        state.selectedShapeId = newS.id;
                        state.selectedTextId = null;
                        state.selectedImageIdx = null;
                    } else if (state.clipboard.type === 'image') {
                        const newI = { ...state.clipboard.data, crop: state.clipboard.data.crop ? { ...state.clipboard.data.crop } : null };
                        if (newI.x !== undefined) newI.x += 20;
                        if (newI.y !== undefined) newI.y += 20;
                        newI.zIndex = state.nextZIndex++;
                        state.images.push(newI);
                        state.selectedImageIdx = state.images.length - 1;
                        state.selectedShapeId = null;
                        state.selectedTextId = null;
                    }
                    syncTextLayer();
                    drawPreview();
                    saveHistory();
                }
            }

            else if (e.key === 'Delete' && !isTyping) {
                let changed = false;
                if (state.selectedTextId) {
                    state.texts = state.texts.filter(t => t.id !== state.selectedTextId);
                    state.selectedTextId = null;
                    changed = true;
                } else if (state.selectedShapeId) {
                    state.shapes = state.shapes.filter(s => s.id !== state.selectedShapeId);
                    state.selectedShapeId = null;
                    changed = true;
                } else if (state.selectedImageIdx !== null) {
                    state.images.splice(state.selectedImageIdx, 1);
                    if (state.sourceFiles) state.sourceFiles.splice(state.selectedImageIdx, 1);
                    state.selectedImageIdx = null;
                    changed = true;
                }

                if (changed) {
                    e.preventDefault();
                    syncTextLayer();
                    drawPreview();
                    saveHistory();
                }
            }
        });
    }

    function makeId() {
        return "t_" + Math.random().toString(16).slice(2) + "_" + Date.now();
    }

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.decoding = "async";
        img.onload = async () => {
            try {
                if (img.decode) await img.decode();
            } catch (e) {
            }
            URL.revokeObjectURL(url);
            resolve(img);
        };

        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
        };

        img.src = url;
    });
}

async function bakeSelectedToImage(actionName) {
        if (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined) return true;
        if (!state.selectedTextId && !state.selectedShapeId) return false;

        const confirmed = await new Promise(resolve => {
             const d = document.createElement('div');
             d.className = 'custom-dialog-overlay open';
             d.style.zIndex = '10000';
             d.innerHTML = `
               <div class="custom-dialog-box" style="max-width:320px; text-align:center;">
                 <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Convert to Image?</h3>
                 <p>To ${actionName} this item, it must be converted to a permanent image layer.<br>It will no longer be editable as text/shape.</p>
                 <div class="dialog-actions" style="display:flex; width:100%; justify-content:space-between; gap:10px; margin-top:15px;">
                   <button type="button" class="btn-cancel btn-cancel-action" style="width:45%;">Cancel</button>
                   <button type="button" class="btn-cancel btn-continue-action" style="width:45%;">Convert & ${actionName}</button>
                 </div>
               </div>`;
             d.querySelector('.btn-cancel-action').onclick = () => { d.remove(); resolve(false); };
             d.querySelector('.btn-continue-action').onclick = () => { d.remove(); resolve(true); };
             document.body.appendChild(d);
        });

        if (!confirmed) return false;

        let target, type;
        if (state.selectedTextId) {
             target = state.texts.find(t => t.id === state.selectedTextId);
             type = 'text';
        } else {
             target = state.shapes.find(s => s.id === state.selectedShapeId);
             type = 'shape';
        }

        if (!target) return false;

        const stash = [];
        state.images.forEach(i => { stash.push({o:i, v:i.opacity}); i.opacity=0; });
        state.texts.forEach(t => { stash.push({o:t, v:t.opacity}); t.opacity=0; });
        if(state.shapes) state.shapes.forEach(s => { stash.push({o:s, v:s.opacity}); s.opacity=0; });

        target.opacity = 1;
        const oldRot = target.rotation; target.rotation = 0;
        const oldFlip = target.flip; target.flip = false;
        
        drawPreview();

        const pad = 30; 
        const cx = (target.x * canvas.width) - pad;
        const cy = (target.y * canvas.height) - pad;
        const cw = Math.max(1, (target.w * canvas.width) + (pad * 2));
        const ch = Math.max(1, (target.h * canvas.height) + (pad * 2));
        
        const dpr = window.devicePixelRatio || 1;
        const tempC = document.createElement('canvas');
        tempC.width = cw * dpr;
        tempC.height = ch * dpr;
        const tCtx = tempC.getContext('2d');
        tCtx.scale(dpr, dpr);
        tCtx.translate(-cx, -cy);

        if (type === 'text') {
             const info = state._layoutInfo;
             const t = target;
             const x = Math.round(t.x * info.outW);
             const y = Math.round(t.y * info.outH);
             const w = Math.round(t.w * info.outW);
             const dispH = state._displayH || Math.round(info.outH * (state._displayScale || 1));
             const outPerDispY = info.outH / Math.max(1, dispH);
             const outPerDispX = info.outW / Math.max(1, (state._displayW || 1));
             const fontSize = Math.max(10, Math.round(t.fontSize || state.baseFontSize));
             const fam = t.fontFamily || state.baseFontFamily || "Anton";
             const rawWeight = t.fontWeight || state.baseFontWeight || "900";
             const fStyle = t.fontStyle || state.baseFontStyle || "normal";
             const weight = fStyle === "bold" ? "bold" : rawWeight;
             const famForCanvas = fam.includes(" ") ? `"${fam}"` : fam;
             const font = `${fStyle === "italic" ? "italic " : ""}${weight} ${fontSize}px ${famForCanvas}, Impact, Arial Black, sans-serif`;
             const color = __normalizeMemeTextColor(t.color || state.baseColor);

                const bgEnabled = (t.shadowEnabled !== undefined) ? t.shadowEnabled : state.baseShadowEnabled;
                let stroke = "transparent";
                let strokeWidth = 0;
                if (bgEnabled) {
                const shadowColor = __normalizeMemeTextColor(t.shadowColor || state.baseShadowColor || __contrastMemeColor(color));
                const depthRaw = (t.shadowDepth || state.baseShadowDepth || 2);
                const depth = Math.max(1, Math.min(7, parseInt(depthRaw, 10) || 2));
                stroke = shadowColor;
                     strokeWidth = Math.max(2, Math.round(depth * 2 * outPerDispX));
                 }

             const padY = Math.round(6 * outPerDispY);
             const padX = Math.round(8 * outPerDispX);
             const textCx = x + Math.round(w / 2);

             const tsEnabled = (t.textShadowEnabled !== undefined) ? t.textShadowEnabled : state.baseTextShadowEnabled;
             let tsColor = "transparent", tsOff = 0, tsBlur = 0;
             if (tsEnabled) {
                 tsColor = (t.textShadowColor || state.baseTextShadowColor || "#000000");
                 const tsDepth = Math.max(1, Math.min(7, parseInt(t.textShadowDepth||state.baseTextShadowDepth, 10) || 3));
                 tsOff = Math.max(1, Math.round(tsDepth * outPerDispX));
                 tsBlur = Math.round(tsOff * 1.2);
             }

             tCtx.save();
             tCtx.textAlign = "center"; tCtx.textBaseline = "top";
             wrapAndDrawText(tCtx, t.text || "", textCx, y + padY, Math.max(10, w - padX * 2), font, fontSize, color, stroke, strokeWidth, tsColor, tsOff, tsOff, tsBlur);
             tCtx.restore();

        } else if (type === 'shape' && target.type === 'emoji') {
             const t = target;
             const info = state._layoutInfo;
             const sw = t.w * info.outW; const sh = t.h * info.outH;
             const size = Math.min(sw, sh);
             const ecx = (t.x * info.outW) + sw/2; const ecy = (t.y * info.outH) + sh/2;
             tCtx.save();
             tCtx.translate(ecx, ecy);
             tCtx.fillStyle = "black"; tCtx.font = `${size}px serif`;
             tCtx.textAlign = 'center'; tCtx.textBaseline = 'middle';
             tCtx.fillText(t.text, 0, size * 0.15);
             tCtx.restore();
        } else {
             tCtx.drawImage(canvas, 0, 0); 
        }

        stash.forEach(i => i.o.opacity = i.v);
        target.rotation = oldRot;
        target.flip = oldFlip;

        const blob = await new Promise(r => tempC.toBlob(r));
        const newImg = await loadImageFromFile(blob);

        state.images.push({
             img: newImg,
             file: new File([blob], type + "_baked.png", { type: "image/png" }),
             x: cx, y: cy, w: cw, h: ch,
             rotation: target.rotation, flip: target.flip,
             zIndex: state.nextZIndex++
        });

        if (type === 'text') {
             state.texts = state.texts.filter(t => t.id !== target.id);
             state.selectedTextId = null;
        } else {
             state.shapes = state.shapes.filter(s => s.id !== target.id);
             state.selectedShapeId = null;
        }

        state.selectedImageIdx = state.images.length - 1;
        drawPreview();
        syncTextLayer();
        return true;
    }

async function openPaintEditor() {
    if (state.selectedTextId || state.selectedShapeId) {
         const confirmed = await new Promise(resolve => {
             const d = document.createElement('div');
             d.className = 'custom-dialog-overlay open';
             d.style.zIndex = '10000';
             d.innerHTML = `
               <div class="custom-dialog-box" style="max-width:320px; text-align:center;">
                 <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Convert Item?</h3>
                 <p>Painting this item will convert it to a permanent image layer.<br>Tip: Edit in a larger size and scale down afterward to avoid image blur.</p>
                 <div class="dialog-actions" style="display:flex; width:100%; justify-content:space-between; gap:10px; margin-top:15px;">
                   <button type="button" class="btn-cancel btn-cancel-action" style="width:45%;">Cancel</button>
                   <button type="button" class="btn-cancel btn-continue-action" style="width:45%;">Continue</button>
                 </div>
               </div>`;
             d.querySelector('.btn-cancel-action').onclick = () => { d.remove(); resolve(false); };
             d.querySelector('.btn-continue-action').onclick = () => { d.remove(); resolve(true); };
             document.body.appendChild(d);
         });

         if (!confirmed) return;
         
         let target, type;
         if (state.selectedTextId) {
             target = state.texts.find(t => t.id === state.selectedTextId);
             type = 'text';
         } else {
             target = state.shapes.find(s => s.id === state.selectedShapeId);
             type = 'shape';
         }
         
         if (target) {
             const stash = [];
             state.images.forEach(i => { stash.push({o:i, v:i.opacity}); i.opacity=0; });
             state.texts.forEach(t => { stash.push({o:t, v:t.opacity}); t.opacity=0; });
             if(state.shapes) state.shapes.forEach(s => { stash.push({o:s, v:s.opacity}); s.opacity=0; });
             
             target.opacity = 1;
             const oldRot = target.rotation; target.rotation = 0;
             const oldFlip = target.flip; target.flip = false;
             
             drawPreview();

             const pad = 30; 
             const cx = (target.x * canvas.width) - pad;
             const cy = (target.y * canvas.height) - pad;
             const cw = Math.max(1, (target.w * canvas.width) + (pad * 2));
             const ch = Math.max(1, (target.h * canvas.height) + (pad * 2));

             const dpr = window.devicePixelRatio || 1;
             const tempC = document.createElement('canvas');
             tempC.width = cw * dpr;
             tempC.height = ch * dpr;
             
             const tCtx = tempC.getContext('2d');
             tCtx.scale(dpr, dpr);
             tCtx.translate(-cx, -cy);

             if (type !== 'text') {
                 tCtx.drawImage(canvas, 0, 0); 
             }

             const info = state._layoutInfo;

             if (type === 'text') {
                 const t = target;
                 const x = Math.round(t.x * info.outW);
                 const y = Math.round(t.y * info.outH);
                 const w = Math.round(t.w * info.outW);

                 const dispH = state._displayH || Math.round(info.outH * (state._displayScale || 1));
                 const outPerDispY = info.outH / Math.max(1, dispH);
                 const outPerDispX = info.outW / Math.max(1, (state._displayW || 1));

                 const rawFontSize = t.fontSize || state.baseFontSize;
                 const fontSize = Math.max(10, Math.round(rawFontSize));

                 const fam = t.fontFamily || state.baseFontFamily || "Anton";
                 const rawWeight = t.fontWeight || state.baseFontWeight || "900";
                 const fStyle = t.fontStyle || state.baseFontStyle || "normal";
                 const weight = fStyle === "bold" ? "bold" : rawWeight;
                 const famForCanvas = fam.includes(" ") ? `"${fam}"` : fam;
                 const font = `${fStyle === "italic" ? "italic " : ""}${weight} ${fontSize}px ${famForCanvas}, Impact, Arial Black, sans-serif`;

                 const color = __normalizeMemeTextColor(t.color || state.baseColor);
                 
                 const bgEnabled = (t.shadowEnabled !== undefined) ? t.shadowEnabled : state.baseShadowEnabled;
                 let stroke = "transparent";
                 let strokeWidth = 0;

                 if (bgEnabled) {
                    const shadowColor = __normalizeMemeTextColor(t.shadowColor || state.baseShadowColor || __contrastMemeColor(color));
                    const depthRaw = (t.shadowDepth || state.baseShadowDepth || 2);
                    const depth = Math.max(1, Math.min(7, parseInt(depthRaw, 10) || 2));
                    stroke = shadowColor;
                    strokeWidth = Math.max(2, Math.round(depth * 2 * outPerDispX));
                }

                 const padY = Math.round(6 * outPerDispY);
                 const padX = Math.round(8 * outPerDispX);
                 const textCx = x + Math.round(w / 2);

                 const tsEnabled = (t.textShadowEnabled !== undefined) ? t.textShadowEnabled : state.baseTextShadowEnabled;
                 let tsColor = "transparent";
                 let tsOff = 0;
                 let tsBlur = 0;

                 if (tsEnabled) {
                     tsColor = (t.textShadowColor || state.baseTextShadowColor || "#000000");
                     const tsDepthRaw = (t.textShadowDepth ?? state.baseTextShadowDepth ?? 3);
                     const tsDepth = Math.max(1, Math.min(7, parseInt(tsDepthRaw, 10) || 3));
                     tsOff = Math.max(1, Math.round(tsDepth * outPerDispX));
                     tsBlur = Math.round(tsOff * 1.2);
                 }

                 tCtx.save();
                 tCtx.textAlign = "center";
                 tCtx.textBaseline = "top";
                 if (t.opacity !== undefined) tCtx.globalAlpha = t.opacity;

                 wrapAndDrawText(
                    tCtx, t.text || "", textCx, y + padY, 
                    Math.max(10, w - padX * 2), font, fontSize, 
                    color, stroke, strokeWidth, tsColor, tsOff, tsOff, tsBlur
                 );
                 tCtx.restore();
             } 
             else if (type === 'shape' && target.type === 'emoji') {
                 const t = target;
                 const sw = t.w * info.outW;
                 const sh = t.h * info.outH;
                 const size = Math.min(sw, sh);
                 const ecx = (t.x * info.outW) + sw/2;
                 const ecy = (t.y * info.outH) + sh/2;

                 tCtx.save();
                 tCtx.translate(ecx, ecy);
                 if (t.rotation) tCtx.rotate(t.rotation * Math.PI / 180);
                 if (t.opacity !== undefined) tCtx.globalAlpha = t.opacity;
                 
                 tCtx.fillStyle = "black";
                 tCtx.font = `${size}px serif`;
                 tCtx.textAlign = 'center';
                 tCtx.textBaseline = 'middle';
                 tCtx.fillText(t.text, 0, size * 0.15);
                 tCtx.restore();
             }
             

             stash.forEach(i => i.o.opacity = i.v);
             target.rotation = oldRot;
             target.flip = oldFlip;

             const blob = await new Promise(r => tempC.toBlob(r));
             const newImg = await loadImageFromFile(blob);

             if (!state.advancedMode) {
                 const info = state._layoutInfo;
                 if (info && info.rects) {
                     state.images.forEach((img, idx) => {
                         const r = info.rects[idx];
                         if (r) {
                             img.x = r.x;
                             img.y = r.y;
                             img.w = r.w;
                             img.h = r.h;
                         }
                     });
                 }
                 state.advancedMode = true;
                 
                 state.whiteSpacePos = "none";
                 
                 if (btnAdvanced) {
                     btnAdvanced.textContent = "ON";
                     btnAdvanced.classList.add('active');
                     if (btnVert) btnVert.parentElement.parentElement.style.display = 'none';
                     if (btnWhitespace) {
                         btnWhitespace.style.display = 'none';
                         updateWhitespaceBtnLabel(); // Ensure label resets
                     }
                     if (btnZoom) btnZoom.style.display = 'none';
                     if (layerControls) layerControls.style.display = 'flex';
                     if (transformRow) transformRow.style.display = 'flex';
                     if (opacityControl) opacityControl.style.display = 'flex';
                     const hint = overlay.querySelector(".meme-creator-hint");
                     if (hint) hint.style.display = 'none';
                 }
             }

             state.images.push({
                 img: newImg,
                 file: new File([blob], type + "_layer.png", { type: "image/png" }),
                 x: cx, y: cy, w: cw, h: ch,
                 rotation: target.rotation, flip: target.flip,
                 zIndex: state.nextZIndex++
             });

             if (type === 'text') {
                 state.texts = state.texts.filter(t => t.id !== target.id);
                 state.selectedTextId = null;
             } else {
                 state.shapes = state.shapes.filter(s => s.id !== target.id);
                 state.selectedShapeId = null;
             }

             state.selectedImageIdx = state.images.length - 1;
             drawPreview();
             syncTextLayer();
         }
    }

    if (state.selectedImageIdx === null || state.selectedImageIdx === undefined) {
        showToast("Select an item to paint");
        return;
    }

    const imgObj = state.images[state.selectedImageIdx];
    if (!imgObj || !imgObj.img) {
        showToast("Select an item to paint");
        return;
    }

    let paintOverlay = overlay.querySelector(".meme-paint-overlay");
    if (!paintOverlay) {
        paintOverlay = document.createElement("div");
        paintOverlay.className = "meme-paint-overlay";
                paintOverlay.innerHTML = `
            <div class="meme-paint-modal" role="dialog" aria-modal="true">

                <div class="meme-paint-modal" role="dialog" aria-modal="true">

                <div class="meme-paint-header">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div class="meme-paint-title">Mini Paint</div>
                        <button type="button" class="meme-paint-undo" title="Undo">↶</button>
                        <button type="button" class="meme-paint-redo" title="Redo">↷</button>
                    </div>
                    <button type="button" class="meme-paint-close">✕</button>
                </div>

                <div class="meme-paint-toolbar meme-paint-toolbar-col">
                    <div class="meme-inline-paint-row">
                        <button type="button" class="meme-toggle-btn meme-paint-toolbtn active" data-tool="brush">🖌️ Brush</button>

                        <select class="meme-paint-select meme-paint-style" title="Brush Style">
                            <option value="regular" selected>Regular</option>
                            <option value="airbrush">Airbrush</option>
                            <option value="oil">Oil Brush</option>
                            <option value="crayon">Crayon</option>
                            <option value="marker">Marker</option>
                            <option value="pencil">Pencil</option>
                            <option value="calligraphy_pen">Calligraphy Pen</option>
                            <option value="calligraphy_brush">Calligraphy Brush</option>
                            <option value="watercolor">Watercolor</option>
                            <option value="chalk">Chalk</option>
                        </select>

                        <select class="meme-paint-select meme-paint-size" title="Brush size">
                            <option value="2">2</option>
                            <option value="4" selected>4</option>
                            <option value="6">6</option>
                            <option value="8">8</option>
                            <option value="12">12</option>
                            <option value="16">16</option>
                            <option value="24">24</option>
                            <option value="32">32</option>
                        </select>

                        <select class="meme-paint-select meme-paint-shape" title="Brush shape">
                            <option value="round" selected>Round</option>
                            <option value="square">Square</option>
                        </select>

                        <button type="button" class="meme-toggle-btn meme-paint-toolbtn" data-tool="fill">🪣 Fill</button>
                        <button type="button" class="meme-toggle-btn meme-paint-toolbtn" data-tool="eraser">🧽 Eraser</button>
                    </div>

                    <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:flex-start; gap:6px;">
                        <div class="meme-paint-current" style="width:30px; height:30px; border:1px solid #ccc; background:#ff0000; border-radius:50%;" title="Current Color"></div>

                        <div class="meme-paint-swatches" aria-label="Common colors" style="display:flex; gap:2px;">
                            <button type="button" class="meme-paint-swatch" data-color="#000000" style="background:#000000"></button>
                            <button type="button" class="meme-paint-swatch" data-color="#ffffff" style="background:#ffffff"></button>
                            <button type="button" class="meme-paint-swatch" data-color="#ff0000" style="background:#ff0000"></button>
                            <button type="button" class="meme-paint-swatch" data-color="#ffa500" style="background:#ffa500"></button>
                            <button type="button" class="meme-paint-swatch" data-color="#ffff00" style="background:#ffff00"></button>
                            <button type="button" class="meme-paint-swatch" data-color="#00ff00" style="background:#00ff00"></button>
                            <button type="button" class="meme-paint-swatch" data-color="#00ffff" style="background:#00ffff"></button>
                            <button type="button" class="meme-paint-swatch" data-color="#0000ff" style="background:#0000ff"></button>
                            <button type="button" class="meme-paint-swatch" data-color="#ff00ff" style="background:#ff00ff"></button>
                        </div>

                        <label style="width:30px; height:30px; border-radius:50%; background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); cursor:pointer; border:1px solid #ddd; position:relative; overflow:hidden; box-shadow:0 1px 2px rgba(0,0,0,0.2);" title="Custom Color">
                            <input class="meme-paint-color" type="color" value="#ff0000" style="opacity:0; position:absolute; top:-10px; left:-10px; width:50px; height:50px; cursor:pointer;">
                        </label>
                    </div>
                </div>

                <div class="meme-paint-body">
                    <div class="meme-paint-canvaswrap">
                        <canvas class="meme-paint-canvas" style="display: block; background: #fff; box-shadow: 0 0 0 1px #ccc;"></canvas>
                    </div>
                </div>

                <div class="meme-paint-footer">
                    <button type="button" class="meme-paint-action meme-paint-cancel">Cancel</button>
                    <button type="button" class="meme-paint-action meme-paint-apply">Apply</button>
                </div>
            </div>
        `;
        overlay.appendChild(paintOverlay);

        const modal = paintOverlay.querySelector(".meme-paint-modal");
        const btnX = paintOverlay.querySelector(".meme-paint-close");
        const btnUndo = paintOverlay.querySelector(".meme-paint-undo");
        const btnRedo = paintOverlay.querySelector(".meme-paint-redo");
        const btnCancel = paintOverlay.querySelector(".meme-paint-cancel");
        const btnApply = paintOverlay.querySelector(".meme-paint-apply");
        const canvasEl = paintOverlay.querySelector(".meme-paint-canvas");
        const toolBtns = Array.from(paintOverlay.querySelectorAll("button[data-tool]"));
        const sizeSel = paintOverlay.querySelector(".meme-paint-size");
        const shapeSel = paintOverlay.querySelector(".meme-paint-shape");
        const styleSel = paintOverlay.querySelector(".meme-paint-style");
        const colorWheel = paintOverlay.querySelector(".meme-paint-color");
        const colorDisp = paintOverlay.querySelector(".meme-paint-current");
        const swatches = Array.from(paintOverlay.querySelectorAll(".meme-paint-swatch"));

        const st = {
            tool: "brush",
            size: 4,
            shape: "round",
            brushStyle: "regular",
            color: "#ff0000",
            drawing: false,
            lastX: 0,
            lastY: 0,
            targetIdx: null,
            ctx: null,
            canvas: canvasEl,
            history: [],
            historyStep: -1,
            save: null
        };

        const savePaintState = () => {
            if (!st.ctx || !st.canvas) return;
            const data = st.ctx.getImageData(0, 0, st.canvas.width, st.canvas.height);
            if (st.historyStep < st.history.length - 1) {
                st.history = st.history.slice(0, st.historyStep + 1);
            }
            st.history.push(data);
            st.historyStep++;
            if (st.history.length > 999) {
                st.history.shift();
                st.historyStep--;
            }
        };
        st.save = savePaintState;

        paintOverlay._paint = st;

        if (btnUndo) btnUndo.addEventListener("click", (e) => {
            e.preventDefault();
            if (st.historyStep > 0) {
                st.historyStep--;
                st.ctx.putImageData(st.history[st.historyStep], 0, 0);
            }
        });

        if (btnRedo) btnRedo.addEventListener("click", (e) => {
            e.preventDefault();
            if (st.historyStep < st.history.length - 1) {
                st.historyStep++;
                st.ctx.putImageData(st.history[st.historyStep], 0, 0);
            }
        });

        paintOverlay._handleKey = (e) => {

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                if (st.historyStep > 0) {
                    st.historyStep--;
                    st.ctx.putImageData(st.history[st.historyStep], 0, 0);
                }
            }
            else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
                e.preventDefault();
                e.stopPropagation();
                if (st.historyStep < st.history.length - 1) {
                    st.historyStep++;
                    st.ctx.putImageData(st.history[st.historyStep], 0, 0);
                }
            }
        };

        const hide = () => { paintOverlay.style.display = "none"; };

        btnX.addEventListener("click", (e) => { e.preventDefault(); hide(); });
        btnCancel.addEventListener("click", (e) => { e.preventDefault(); hide(); });

        const setTool = (t) => {
            st.tool = t;
            toolBtns.forEach(b => b.classList.toggle("active", b.dataset.tool === t));
            if (t === "eraser") canvasEl.style.cursor = "cell";
            else if (t === "fill") canvasEl.style.cursor = "crosshair";
            else canvasEl.style.cursor = "crosshair";
        };

        toolBtns.forEach(b => {
            b.addEventListener("click", (e) => {
                e.preventDefault();
                setTool(b.dataset.tool);
            });
        });

        sizeSel.addEventListener("change", () => {
            const v = parseInt(sizeSel.value, 10);
            if (Number.isFinite(v)) st.size = v;
        });

        shapeSel.addEventListener("change", () => {
            st.shape = shapeSel.value === "square" ? "square" : "round";
        });

        if (styleSel) {
            styleSel.addEventListener("change", () => {
                st.brushStyle = styleSel.value;
            });
        }

        colorWheel.addEventListener("input", () => {
            st.color = colorWheel.value;
            if(colorDisp) colorDisp.style.backgroundColor = st.color;
        });

        swatches.forEach(s => {
            s.addEventListener("click", (e) => {
                e.preventDefault();
                const c = s.dataset.color;
                if (!c) return;
                st.color = c;
                colorWheel.value = c;
                if(colorDisp) colorDisp.style.backgroundColor = c;
            });
        });

        const getPos = (evt) => {
            const r = canvasEl.getBoundingClientRect();
            const x = (evt.clientX - r.left) * (canvasEl.width / r.width);
            const y = (evt.clientY - r.top) * (canvasEl.height / r.height);
            return { x, y };
        };

        const hexToRgba = (hex) => {
            const h = String(hex || "").replace("#", "");
            const full = h.length === 3 ? (h[0]+h[0]+h[1]+h[1]+h[2]+h[2]) : h;
            const r = parseInt(full.slice(0,2), 16) || 0;
            const g = parseInt(full.slice(2,4), 16) || 0;
            const b = parseInt(full.slice(4,6), 16) || 0;
            return { r, g, b, a: 255 };
        };

        const colorsMatch = (d, i, c, tol) => {
            const dr = d[i] - c.r;
            const dg = d[i+1] - c.g;
            const db = d[i+2] - c.b;
            const da = d[i+3] - c.a;
            return (Math.abs(dr) <= tol &&
                    Math.abs(dg) <= tol &&
                    Math.abs(db) <= tol &&
                    Math.abs(da) <= tol);
        };

        const floodFill = (x0, y0, fillHex) => {
            const ctx = st.ctx;
            if (!ctx) return;

            const w = canvasEl.width;
            const h = canvasEl.height;
            const img = ctx.getImageData(0, 0, w, h);
            const d = img.data;

            const x = Math.max(0, Math.min(w - 1, Math.floor(x0)));
            const y = Math.max(0, Math.min(h - 1, Math.floor(y0)));
            const idx0 = (y * w + x) * 4;

            const target = { r: d[idx0], g: d[idx0+1], b: d[idx0+2], a: d[idx0+3] };
            const fill = hexToRgba(fillHex);

            if (target.r === fill.r && target.g === fill.g && target.b === fill.b && target.a === fill.a) return;

            const tol = 18;
            const stack = [[x, y]];

            while (stack.length) {
                const p = stack.pop();
                const px = p[0];
                const py = p[1];
                let i = (py * w + px) * 4;

                if (!colorsMatch(d, i, target, tol)) continue;

                d[i] = fill.r; d[i+1] = fill.g; d[i+2] = fill.b; d[i+3] = 255;

                if (px > 0) stack.push([px - 1, py]);
                if (px < w - 1) stack.push([px + 1, py]);
                if (py > 0) stack.push([px, py - 1]);
                if (py < h - 1) stack.push([px, py + 1]);
            }

            ctx.putImageData(img, 0, 0);
        };

        const pickColor = (x0, y0) => {
            const ctx = st.ctx;
            if (!ctx) return;

            const x = Math.max(0, Math.min(canvasEl.width - 1, Math.floor(x0)));
            const y = Math.max(0, Math.min(canvasEl.height - 1, Math.floor(y0)));
            const px = ctx.getImageData(x, y, 1, 1).data;
            const toHex = (n) => n.toString(16).padStart(2, "0");
            const hex = "#" + toHex(px[0]) + toHex(px[1]) + toHex(px[2]);
            st.color = hex;
            colorWheel.value = hex;
            if(colorDisp) colorDisp.style.backgroundColor = hex;
        };

        const strokeLine = (x1, y1, x2, y2) => {
            const ctx = st.ctx;
            if (!ctx) return;

            ctx.save();

            if (st.tool === "eraser") {
                ctx.globalCompositeOperation = "destination-out";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = st.size * 2;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.restore();
                return;
            }

            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = st.color;
            ctx.fillStyle = st.color;
            ctx.lineWidth = st.size;
            ctx.lineCap = st.shape === "square" ? "butt" : "round";
            ctx.lineJoin = "round";

            let style = st.brushStyle;
            if (st.tool === 'pencil') style = 'pencil';
            if (style === 'airbrush') {
                ctx.globalAlpha = 0.1; 
                ctx.shadowBlur = st.size;
                ctx.shadowColor = st.color;
                const dist = Math.hypot(x2 - x1, y2 - y1);
                const steps = Math.ceil(dist / (st.size / 4)); 
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const x = x1 + (x2 - x1) * t;
                    const y = y1 + (y2 - y1) * t;
                    ctx.beginPath();
                    ctx.arc(x, y, st.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

            } else if (style === 'oil') {
                ctx.globalAlpha = 0.8;
                ctx.lineWidth = st.size;
                ctx.shadowBlur = 1;
                ctx.shadowColor = st.color;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.globalAlpha = 0.4;
                ctx.lineWidth = st.size * 0.5;
                ctx.strokeStyle = '#ffffff'; 
                ctx.globalCompositeOperation = 'overlay'; 
                ctx.stroke();

            } else if (style === 'crayon' || style === 'chalk') {
                ctx.globalAlpha = (style === 'chalk') ? 0.6 : 0.8;
                const dist = Math.hypot(x2 - x1, y2 - y1);
                const density = (style === 'chalk') ? 0.5 : 0.8;
                const steps = Math.ceil(dist); 
                
                for (let i = 0; i < steps; i++) {
                    if (Math.random() > density) continue;
                    const t = i / steps;
                    const jitter = (Math.random() - 0.5) * (st.size * 0.6);
                    const x = x1 + (x2 - x1) * t + jitter;
                    const y = y1 + (y2 - y1) * t + jitter;
                    const radius = (Math.random() * st.size / 2) + 1;
                    
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }

            } else if (style === 'marker') {
                ctx.globalAlpha = 0.5; // Transparent ink
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

            } else if (style === 'pencil') {
                ctx.globalAlpha = 0.9;
                ctx.lineWidth = Math.max(1, st.size * 0.5); // Thinner than brush
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

            } else if (style === 'watercolor') {
                ctx.globalAlpha = 0.15; // Very transparent
                const dist = Math.hypot(x2 - x1, y2 - y1);
                const steps = Math.ceil(dist / (st.size / 2)); 
                
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const spread = (Math.random() - 0.5) * (st.size * 0.5);
                    const x = x1 + (x2 - x1) * t + spread;
                    const y = y1 + (y2 - y1) * t + spread;
                    const rad = st.size * (0.8 + Math.random() * 0.4);
                    
                    ctx.beginPath();
                    ctx.arc(x, y, rad, 0, Math.PI * 2);
                    ctx.fill();
                }

            } else if (style === 'calligraphy_pen') {
                ctx.globalAlpha = 1;
                const angle = -45 * (Math.PI / 180); 
                const dist = Math.hypot(x2 - x1, y2 - y1);
                const steps = Math.ceil(dist);
                
                const nibSize = st.size;
                const dx = Math.cos(angle) * nibSize;
                const dy = Math.sin(angle) * nibSize;

                ctx.lineWidth = 1; 
                ctx.beginPath();
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const x = x1 + (x2 - x1) * t;
                    const y = y1 + (y2 - y1) * t;
                    ctx.moveTo(x - dx/2, y - dy/2);
                    ctx.lineTo(x + dx/2, y + dy/2);
                }
                ctx.stroke();

            } else if (style === 'calligraphy_brush') {
                ctx.globalAlpha = 1;
                const dist = Math.hypot(x2 - x1, y2 - y1);
                const steps = Math.ceil(dist / (st.size / 6)); 
                
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const x = x1 + (x2 - x1) * t;
                    const y = y1 + (y2 - y1) * t;
                    ctx.beginPath();
                    ctx.ellipse(x, y, st.size, st.size * 0.3, -45 * Math.PI/180, 0, Math.PI * 2);
                    ctx.fill();
                }

            } else {
                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            ctx.restore();
        };

        const onDown = (evt) => {
            evt.preventDefault();
            const pos = getPos(evt);

            if (st.tool === "fill") {
                floodFill(pos.x, pos.y, st.color);
                if (st.save) st.save();
                return;
            }

            st.drawing = true;
            st.lastX = pos.x;
            st.lastY = pos.y;
            strokeLine(pos.x, pos.y, pos.x + 0.01, pos.y + 0.01);
        };

        const onMove = (evt) => {
            if (!st.drawing) return;
            evt.preventDefault();
            const pos = getPos(evt);
            strokeLine(st.lastX, st.lastY, pos.x, pos.y);
            st.lastX = pos.x;
            st.lastY = pos.y;
        };

        const onUp = (evt) => {
            if (!st.drawing) return;
            evt.preventDefault();
            st.drawing = false;
            if (st.save) st.save();
        };

        canvasEl.addEventListener("mousedown", onDown);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);

        btnApply.addEventListener("click", async (e) => {
            e.preventDefault();
            const idx = st.targetIdx;
            if (idx === null || idx === undefined) return;

            const targetObj = state.images[idx];
            if (!targetObj) return;

            const blob = await new Promise(r => canvasEl.toBlob(r, "image/png"));
            if (!blob) return;

            try {
                const img = await loadImageFromFile(blob);
                targetObj.img = img;
                targetObj.file = new File([blob], "paint.png", { type: "image/png" });
                drawPreview();
                hide();
            } catch (err) {
                console.error(err);
                showToast("Paint apply failed");
            }
        });

        modal.addEventListener("mousedown", (e) => { e.stopPropagation(); });
        setTool("brush");
    }

    const st = paintOverlay._paint;
    st.targetIdx = state.selectedImageIdx;

    const cnv = st.canvas;
    const ctx = cnv.getContext("2d", { willReadFrequently: true });

    const baseImg = imgObj.img;
    const w = baseImg.naturalWidth || baseImg.width;
    const h = baseImg.naturalHeight || baseImg.height;

    cnv.width = Math.max(1, w);
    cnv.height = Math.max(1, h);

    st.ctx = ctx;
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.drawImage(baseImg, 0, 0, cnv.width, cnv.height);

    // Reset history for this new session
    st.history = [];
    st.historyStep = -1;
    if (st.save) st.save();

    paintOverlay.style.display = "flex";
}


    function computeComposite(images, layout, wsPos, wsSize, wsTopScope) {
        wsTopScope = (wsTopScope === "top" || wsTopScope === "all") ? wsTopScope : "all";

        const maxDim = 1600;

        const dims = images.map(img => ({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height }));

        let baseW = 800;
        let baseH = 600;

        if (dims.length === 1) {
            baseW = dims[0].w;
            baseH = dims[0].h;
        } else {
            if (layout === "horizontal") {
                const h = Math.max(...dims.map(d => d.h));
                baseH = h;
                baseW = dims.reduce((sum, d) => sum + Math.round(d.w * (h / d.h)), 0);
            } else {
                const w = Math.max(...dims.map(d => d.w));
                baseW = w;
                baseH = dims.reduce((sum, d) => sum + Math.round(d.h * (w / d.w)), 0);
            }
        }

        let limitDim = (layout === "horizontal") ? baseH : baseW;
        const scale = Math.min(1, maxDim / limitDim);

        const imgBlockW = Math.max(1, Math.round(baseW * scale));
        const imgBlockH = Math.max(1, Math.round(baseH * scale));

        let outW = imgBlockW;
        let outH = imgBlockH;
        let gapPx = 0;
        if (wsPos === 'top') {

            gapPx = Math.round(imgBlockH * wsSize);

            if (dims.length > 1 && layout === 'vertical') {
                const gapCount = (wsTopScope === "all") ? dims.length : 1;
                outH = imgBlockH + (gapPx * gapCount);
            } else {
                outH = imgBlockH + gapPx;
            }
        } else if (wsPos === 'right') {

            gapPx = Math.round(imgBlockW * wsSize);
            outW = imgBlockW + gapPx;
        }

        const rects = [];
        
        if (dims.length === 1) {
            const y = (wsPos === 'top') ? gapPx : 0;
            rects.push({ x: 0, y: y, w: imgBlockW, h: imgBlockH });
        } else if (layout === "horizontal") {
            const startY = (wsPos === 'top') ? gapPx : 0;
            let x = 0;
            for (let i = 0; i < dims.length; i++) {
                const dw = Math.round((dims[i].w * (imgBlockH / dims[i].h)));
                rects.push({ x, y: startY, w: dw, h: imgBlockH });
                x += dw;
            }
        } else {
            let y = 0;
            for (let i = 0; i < dims.length; i++) {
                const dh = Math.max(1, Math.round(dims[i].h * (imgBlockW / dims[i].w)));
                                // If top whitespace, add gap before EACH image ("all") or only before the first ("top")
                if (wsPos === 'top' && (wsTopScope === "all" || i === 0)) y += gapPx;

                
                rects.push({ x: 0, y, w: imgBlockW, h: dh });
                y += dh;
            }
        }

        return { outW, outH, gapPx, rects, wsPos };
    }



async function performLassoKeep() {
    if (!state.cutPath || state.cutPath.length < 3) return;
    const idx = state.selectedImageIdx;
    const imgObj = state.images[idx];
    if (!imgObj) return;

    const naturalW = imgObj.img.naturalWidth || imgObj.img.width;
    const naturalH = imgObj.img.naturalHeight || imgObj.img.height;
 
    const c = document.createElement("canvas");
    c.width = naturalW;
    c.height = naturalH;
    const ctx = c.getContext("2d");
    ctx.drawImage(imgObj.img, 0, 0);
    const info = state._layoutInfo;
    const rect = info.rects[idx]; 

    ctx.globalCompositeOperation = 'destination-in'; 
    ctx.beginPath();
    state.cutPath.forEach((pt, i) => {
        const mainPxX = pt.x * info.outW;
        const mainPxY = pt.y * info.outH;
        const relX = mainPxX - rect.x;
        const relY = mainPxY - rect.y;
        const natX = relX * (naturalW / rect.w);
        const natY = relY * (naturalH / rect.h);
        
        if (i === 0) ctx.moveTo(natX, natY);
        else ctx.lineTo(natX, natY);
    });
    ctx.closePath();
    ctx.fill();

    const blob = await new Promise(r => c.toBlob(r));

    try {
        showToast("Removing background...");
        const fd = new FormData();
        fd.append('image', blob, "lasso_cut.png");
        
        const res = await fetch('/api/utils/remove-bg', {
            method: 'POST',
            body: fd
        });
        
        if (!res.ok) throw new Error('Background removal failed');
        
        const finalBlob = await res.blob();
        const newImg = await loadImageFromFile(finalBlob);
        
        imgObj.img = newImg;
        imgObj.file = new File([finalBlob], "lasso_bg_removed.png", { type: "image/png" });
        imgObj._version = (imgObj._version || 0) + 1;

    } catch (err) {
        console.error("Lasso BG Removal Error:", err);
        showToast("Background removal failed, keeping crop.");

        const newImg = await loadImageFromFile(blob);
        imgObj.img = newImg;
        imgObj.file = new File([blob], "lasso_keep.png", { type: "image/png" });
        imgObj._version = (imgObj._version || 0) + 1;
    }
    
    state.lassoMode = false;
    state.cutPath = [];
}



async function performFreehandCut() {
        if (!state.cutPath || state.cutPath.length < 3) return;
        const idx = state.selectedImageIdx;
        const imgObj = state.images[idx];
        if (!imgObj) return;

        const naturalW = imgObj.img.naturalWidth || imgObj.img.width;
        const naturalH = imgObj.img.naturalHeight || imgObj.img.height;

        const cCut = document.createElement("canvas");
        cCut.width = naturalW;
        cCut.height = naturalH;
        const ctxCut = cCut.getContext("2d");

        const cRem = document.createElement("canvas");
        cRem.width = naturalW;
        cRem.height = naturalH;
        const ctxRem = cRem.getContext("2d");
        const info = state._layoutInfo;
        const rect = info.rects[idx]; // {x, y, w, h} on main canvas

        const definePath = (ctx) => {
            ctx.beginPath();
            state.cutPath.forEach((pt, i) => {
                const mainPxX = pt.x * info.outW;
                const mainPxY = pt.y * info.outH;

                const relX = mainPxX - rect.x;
                const relY = mainPxY - rect.y;

                const natX = relX * (naturalW / rect.w);
                const natY = relY * (naturalH / rect.h);
                
                if (i === 0) ctx.moveTo(natX, natY);
                else ctx.lineTo(natX, natY);
            });
            ctx.closePath();
        };

        ctxCut.drawImage(imgObj.img, 0, 0);
        ctxCut.globalCompositeOperation = 'destination-in';
        definePath(ctxCut);
        ctxCut.fill();

        ctxRem.drawImage(imgObj.img, 0, 0);
        ctxRem.globalCompositeOperation = 'destination-out';
        definePath(ctxRem);
        ctxRem.fill(); // Erases the selection

        const pixels = ctxCut.getImageData(0, 0, naturalW, naturalH).data;
        let minX = naturalW, minY = naturalH, maxX = 0, maxY = 0;
        let found = false;

        for (let y = 0; y < naturalH; y++) {
            for (let x = 0; x < naturalW; x++) {
                const alpha = pixels[(y * naturalW + x) * 4 + 3];
                if (alpha > 0) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                    found = true;
                }
            }
        }

        if (!found) { minX = 0; minY = 0; maxX = naturalW; maxY = naturalH; }
        
        const cutW = (maxX - minX) + 1;
        const cutH = (maxY - minY) + 1;

        const cTrim = document.createElement("canvas");
        cTrim.width = cutW;
        cTrim.height = cutH;
        cTrim.getContext("2d").drawImage(cCut, minX, minY, cutW, cutH, 0, 0, cutW, cutH);

        const blobCut = await new Promise(r => cTrim.toBlob(r));
        const blobRem = await new Promise(r => cRem.toBlob(r));
        
        const imgTrim = await loadImageFromFile(blobCut);
        const imgRem = await loadImageFromFile(blobRem);
        imgObj.img = imgRem; 
        imgObj.file = new File([blobRem], "cut_rem.png", { type: "image/png" });
        imgObj._version = (imgObj._version || 0) + 1;
        const scaleX = imgObj.w / naturalW;
        const scaleY = imgObj.h / naturalH;

        state.images.push({
            img: imgTrim,
            file: new File([blobCut], "cut_piece.png", { type: "image/png" }),
            x: imgObj.x + (minX * scaleX),
            y: imgObj.y + (minY * scaleY),
            w: cutW * scaleX,
            h: cutH * scaleY
        });

        state.selectedImageIdx = state.images.length - 1;
        state.cutPath = [];
    }


    function drawBackgroundEffect(ctx, w, h, color, effect) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);

        if (!effect || effect === 'none') return;

        ctx.save();
        
        if (effect === 'sunburst') {
            const cx = w / 2, cy = h / 2;
            const radius = Math.max(w, h) * 1.5;
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.beginPath();
            for (let i = 0; i < 12; i++) {
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, radius, (i * 30) * Math.PI / 180, (i * 30 + 15) * Math.PI / 180);
                ctx.lineTo(cx, cy);
            }
            ctx.fill();
        } 
        else if (effect === 'grid') {
            ctx.strokeStyle = "rgba(0,0,0,0.15)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            const horizon = h * 0.4;
            for (let y = horizon; y < h; y += (h - y) * 0.15 + 2) {
                ctx.moveTo(0, y); ctx.lineTo(w, y);
            }
            for (let x = -w; x < w * 2; x += w * 0.1) {
                ctx.moveTo(x, h); ctx.lineTo(w/2, horizon);
            }
            ctx.stroke();
        }
        else if (effect === 'linear') {
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, color);
            grad.addColorStop(1, "#000000");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }
        else if (effect === 'radial') {
            const cx = w/2, cy = h/2;
            const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h)/1.2);
            grad.addColorStop(0, color);
            grad.addColorStop(1, "#000000");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }
        else if (effect === 'noise') {
            const idata = ctx.getImageData(0,0,w,h);
            const d = idata.data;
            for(let i=0; i<d.length; i+=4) {
                const n = (Math.random() - 0.5) * 30;
                d[i] = clamp(d[i]+n, 0, 255);
                d[i+1] = clamp(d[i+1]+n, 0, 255);
                d[i+2] = clamp(d[i+2]+n, 0, 255);
            }
            ctx.putImageData(idata, 0, 0);
        }
        else if (effect === 'halftone') {
            ctx.fillStyle = "rgba(0,0,0,0.1)";
            const size = 8;
            for(let y=0; y<h; y+=size) {
                for(let x=0; x<w; x+=size) {
                    if ((x/size + y/size) % 2 === 0) {
                        ctx.beginPath();
                        ctx.arc(x, y, size*0.3, 0, Math.PI*2);
                        ctx.fill();
                    }
                }
            }
        }
        else if (effect === 'scanlines') {
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            for (let y = 0; y < h; y += 4) {
                ctx.fillRect(0, y, w, 2);
            }
        }
        else if (effect === 'speedlines') {
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 40; i++) {
                const y = Math.random() * h;
                const len = w * (0.3 + Math.random() * 0.7);
                const x = (Math.random() > 0.5) ? 0 : w - len;
                ctx.moveTo(x, y);
                ctx.lineTo(x + len, y);
            }
            ctx.stroke();
        }
        else if (effect === 'spiral') {
            const cx = w / 2, cy = h / 2;
            const maxDist = Math.sqrt(cx * cx + cy * cy);
            
            ctx.strokeStyle = "rgba(0,0,0,0.15)";
            ctx.lineWidth = 40;
            ctx.beginPath();
            
            const growth = 15; 
            const step = 0.1;
            
            for (let angle = 0; ; angle += step) {
                const r = growth * angle;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                
                if (angle === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                
                if (r > maxDist) break;
            }
            ctx.stroke();
        }
        else if (effect === 'spiral_thin') {
            const cx = w / 2, cy = h / 2;
            const maxDist = Math.sqrt(cx * cx + cy * cy);
            
            ctx.strokeStyle = "rgba(0,0,0,0.15)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const growth = 10;
            const step = 0.1;
            
            for (let angle = 0; ; angle += step) {
                const r = growth * angle;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                
                if (angle === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                
                if (r > maxDist) break;
            }
            ctx.stroke();
        }
        else if (effect === 'confetti') {
            const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'];
            for (let i = 0; i < 100; i++) {
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.beginPath();
                const x = Math.random() * w;
                const y = Math.random() * h;
                if (Math.random() > 0.5) {
                    ctx.arc(x, y, Math.random() * 6 + 2, 0, Math.PI * 2);
                } else {
                    ctx.rect(x, y, Math.random() * 8 + 4, Math.random() * 8 + 4);
                }
                ctx.fill();
            }
        }
        else if (effect === 'checkerboard') {
            const size = 40;
            ctx.fillStyle = "rgba(0,0,0,0.1)";
            for (let y = 0; y < h; y += size) {
                for (let x = 0; x < w; x += size) {
                    if (((x / size) + (y / size)) % 2 === 0) {
                        ctx.fillRect(x, y, size, size);
                    }
                }
            }
        }
        else if (effect === 'matrix') {
            ctx.fillStyle = "#0F0";
            ctx.font = "16px monospace";
            const cols = Math.floor(w / 16);
            for (let i = 0; i < cols; i++) {
                const len = Math.floor(Math.random() * 20) + 5;
                const x = i * 16;
                const startY = Math.random() * h;
                for (let j = 0; j < len; j++) {
                    const char = String.fromCharCode(0x30A0 + Math.random() * 96);
                    ctx.globalAlpha = 1 - (j / len);
                    ctx.fillText(char, x, startY + (j * 16));
                }
            }
        }
        else if (effect === 'matrix_down') {
            ctx.fillStyle = "#0F0";
            ctx.font = "16px monospace";
            const cols = Math.floor(w / 16);
            for (let i = 0; i < cols; i++) {
                const len = Math.floor(Math.random() * 20) + 5;
                const x = i * 16;
                const startY = Math.random() * h;
                for (let j = 0; j < len; j++) {
                    const char = String.fromCharCode(0x30A0 + Math.random() * 96);
                    ctx.globalAlpha = j / len;
                    ctx.fillText(char, x, startY + (j * 16));
                }
            }
        }
        else if (effect === 'chromatic') {
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(-4, 0, w, h);
            ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
            ctx.fillRect(4, 0, w, h);
        }
        else if (effect === 'vaporwave') {
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, "#2b1055");
            grad.addColorStop(1, "#7597de");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            
            const cx = w/2, cy = h/2, r = Math.min(w, h) * 0.3;
            const sunGrad = ctx.createLinearGradient(0, cy - r, 0, cy + r);
            sunGrad.addColorStop(0, "#ffeb3b");
            sunGrad.addColorStop(1, "#e91e63");
            ctx.fillStyle = sunGrad;
            
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalCompositeOperation = 'destination-out';
            for(let i = 0; i < 10; i++) {
                const lineY = cy + (r * 0.1) + (i * r * 0.15);
                const lineHeight = 2 + (i * 1.5);
                ctx.fillRect(cx - r, lineY, r * 2, lineHeight);
            }
            ctx.globalCompositeOperation = 'source-over';
            
            ctx.strokeStyle = "#e91e63";
            ctx.lineWidth = 2;
            for(let i = cy + r; i < h; i += Math.max(5, (i - cy) * 0.2)) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
            }
        }
        else if (effect === 'tvsnow') {
            const idata = ctx.createImageData(w, h);
            const d = idata.data;
            for(let i = 0; i < d.length; i += 4) {
                const val = Math.random() * 255;
                d[i] = val; d[i+1] = val; d[i+2] = val; d[i+3] = 255;
            }
            ctx.putImageData(idata, 0, 0);
        }
        else if (effect === 'actionfocus') {
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.beginPath();
            const cx = w/2, cy = h/2, maxR = Math.hypot(cx, cy);
            for (let i = 0; i < 360; i += 3) {
                if (Math.random() > 0.4) continue;
                const angle = i * Math.PI / 180;
                const inner = maxR * (0.3 + Math.random() * 0.4);
                ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
                ctx.lineTo(cx + Math.cos(angle - 0.02) * maxR, cy + Math.sin(angle - 0.02) * maxR);
                ctx.lineTo(cx + Math.cos(angle + 0.02) * maxR, cy + Math.sin(angle + 0.02) * maxR);
            }
            ctx.fill();
        }
        else if (effect === 'polkadots') {
            const size = 30;
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            for(let y = 0; y < h + size; y += size) {
                for(let x = 0; x < w + size; x += size) {
                    const offX = (y / size) % 2 === 0 ? 0 : size / 2;
                    ctx.beginPath();
                    ctx.arc(x + offX, y, size * 0.35, 0, Math.PI*2);
                    ctx.fill();
                }
            }
        }
        else if (effect === 'explosion') {
            const cx = w/2, cy = h/2, maxR = Math.max(w, h) * 0.8;
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.beginPath();
            for (let i = 0; i < 360; i += 15) {
                const angle = i * Math.PI / 180;
                const radius = maxR * (0.4 + Math.random() * 0.6);
                if (i === 0) ctx.moveTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
                else ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
            }
            ctx.closePath();
            ctx.fill();
        }
        else if (effect === 'bokeh') {
            ctx.globalCompositeOperation = 'screen';
            for (let i = 0; i < 40; i++) {
                const x = Math.random() * w, y = Math.random() * h;
                const r = 20 + Math.random() * 80;
                const grad = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
                const c = ['#ff9999', '#99ff99', '#9999ff', '#ffff99'][Math.floor(Math.random()*4)];
                grad.addColorStop(0, c + 'aa');
                grad.addColorStop(1, c + '00');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
            }
        }
        else if (effect === 'lowpoly') {
            const pts = [];
            for (let i = 0; i < 50; i++) pts.push({x: Math.random() * w, y: Math.random() * h});
            pts.push({x: 0, y: 0}, {x: w, y: 0}, {x: 0, y: h}, {x: w, y: h});
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.lineWidth = 1;
            for (let i = 0; i < pts.length - 2; i++) {
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[i+1].x, pts[i+1].y);
                ctx.lineTo(pts[i+2].x, pts[i+2].y);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
            }
        }
        else if (effect === 'galaxy') {
            ctx.fillStyle = "#0b0c10"; ctx.fillRect(0, 0, w, h);
            for(let i = 0; i < 200; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? "#fff" : "#ffeb3b";
                ctx.globalAlpha = Math.random();
                ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, Math.random()*1.5, 0, Math.PI*2); ctx.fill();
            }
            ctx.globalCompositeOperation = 'screen';
            for(let i=0; i<3; i++) {
                const x = Math.random()*w, y = Math.random()*h, r = 100 + Math.random()*200;
                const grad = ctx.createRadialGradient(x,y,0, x,y,r);
                grad.addColorStop(0, ['#3f51b544', '#9c27b044', '#00bcd444'][i]);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0,0,w,h);
            }
        }
        else if (effect === 'chevron') {
            const size = 40;
            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            ctx.lineWidth = 10;
            ctx.lineJoin = 'miter';
            ctx.beginPath();
            for(let y = -size; y < h + size; y += size) {
                for(let x = 0; x < w + size; x += size) {
                    ctx.moveTo(x, y + ((x/size)%2 === 0 ? 0 : size/2));
                    ctx.lineTo(x + size, y + (((x+size)/size)%2 === 0 ? 0 : size/2));
                }
            }
            ctx.stroke();
        }
        else if (effect === 'brickwall') {
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            const bw = 60, bh = 20, gap = 4;
            for(let y = 0; y < h; y += bh + gap) {
                const offset = (Math.floor(y / (bh + gap)) % 2 === 0) ? 0 : bw / 2;
                for(let x = -bw; x < w; x += bw + gap) {
                    ctx.fillRect(x + offset, y, bw, bh);
                }
            }
        }
        else if (effect === 'bulletjournal') {
            const space = 25;
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            for(let y = space; y < h; y += space) {
                for(let x = space; x < w; x += space) {
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
                }
            }
        }
        else if (effect === 'camo') {
            ctx.globalAlpha = 0.4;
            const colors = ['#4b5320', '#556b2f', '#8f9779'];
            for(let i=0; i<40; i++) {
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.beginPath();
                const cx = Math.random() * w, cy = Math.random() * h;
                ctx.moveTo(cx, cy);
                for(let a=0; a<Math.PI*2; a+=0.5) {
                    ctx.lineTo(cx + Math.cos(a)*(30+Math.random()*80), cy + Math.sin(a)*(30+Math.random()*80));
                }
                ctx.fill();
            }
        }
        else if (effect === 'topographic') {
            ctx.strokeStyle = "rgba(0,0,0,0.15)";
            ctx.lineWidth = 1;
            for (let r = 20; r < Math.max(w, h); r += 20) {
                ctx.beginPath();
                for (let a = 0; a <= Math.PI * 2; a += 0.1) {
                    const noise = Math.sin(a * 4) * 10 + Math.cos(a * 7) * 5;
                    const x = w/2 + Math.cos(a) * (r + noise);
                    const y = h/2 + Math.sin(a) * (r + noise);
                   if (a === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
        else if (effect === 'honeycomb') {
            ctx.strokeStyle = "rgba(0,0,0,0.15)";
            ctx.lineWidth = 2;
            const r = 20;
            const hx = r * Math.sqrt(3);
            const hy = r * 1.5;
            for (let y = 0; y < h + hy; y += hy) {
                for (let x = 0; x < w + hx; x += hx) {
                    const cx = x + ((Math.round(y / hy) % 2) * (hx / 2));
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const a = (Math.PI / 180) * (60 * i + 30);
                        ctx.lineTo(cx + r * Math.cos(a), y + r * Math.sin(a));
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
        else if (effect === 'caution') {
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            const stripW = 40;
            for (let i = -h; i < w + h; i += stripW * 2) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + stripW, 0);
                ctx.lineTo(i - h + stripW, h);
                ctx.lineTo(i - h, h);
                ctx.fill();
            }
        }
        else if (effect === 'tartan') {
            ctx.fillStyle = "rgba(0,0,0,0.1)";
            for (let x = 0; x < w; x += 60) ctx.fillRect(x, 0, 20, h);
            for (let y = 0; y < h; y += 60) ctx.fillRect(0, y, w, 20);
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            for (let x = 30; x < w; x += 60) ctx.fillRect(x, 0, 5, h);
            for (let y = 30; y < h; y += 60) ctx.fillRect(0, y, w, 5);
        }
        else if (effect === 'diamondplate') {
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            const s = 30;
            for (let y = 0; y < h + s; y += s/2) {
                for (let x = 0; x < w + s; x += s) {
                    const ox = (Math.round(y/(s/2)) % 2 === 0) ? 0 : s/2;
                    const isEven = (Math.round(x/s) + Math.round(y/(s/2))) % 2 === 0;
                    ctx.beginPath();
                    if (isEven) {
                        ctx.moveTo(x + ox - 5, y - 5); ctx.lineTo(x + ox + 5, y + 5);
                    } else {
                        ctx.moveTo(x + ox - 5, y + 5); ctx.lineTo(x + ox + 5, y - 5);
                    }
                    ctx.stroke();
                }
            }
        }
        else if (effect === 'zebra') {
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            for (let x = 0; x < w; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                for (let y = 0; y <= h; y += 20) {
                    ctx.lineTo(x + Math.sin(y * 0.05 + x) * 15 + Math.random()*5, y);
                }
                for (let y = h; y >= 0; y -= 20) {
                    ctx.lineTo(x + 15 + Math.sin(y * 0.05 + x) * 15 + Math.random()*5, y);
                }
                ctx.fill();
            }
        }
        else if (effect === 'synthwave') {
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, "#1a0b2e"); grad.addColorStop(1, "#3b0944");
            ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
            const cy = h * 0.5;
            ctx.fillStyle = "#ff0055";
            ctx.beginPath(); ctx.arc(w/2, cy, 80, Math.PI, 0); ctx.fill();
            ctx.strokeStyle = "#00ffff"; ctx.lineWidth = 2;
            for (let y = cy; y < h; y += Math.max(2, (y - cy)*0.15)) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }
            for (let x = -w; x < w*2; x += 40) {
                ctx.beginPath(); ctx.moveTo(w/2, cy); ctx.lineTo(x, h); ctx.stroke();
            }
        }
        else if (effect === 'memphis') {
            const cols = ['#ff0055', '#00ffff', '#ffdd00', '#000000'];
            for(let i=0; i<30; i++) {
                ctx.strokeStyle = cols[Math.floor(Math.random()*cols.length)];
                ctx.lineWidth = 3 + Math.random()*4;
                const x = Math.random()*w, y = Math.random()*h;
                const type = Math.floor(Math.random()*4);
                ctx.beginPath();
                if(type===0) {
                    for(let j=0;j<3;j++) ctx.lineTo(x+Math.random()*40-20, y+Math.random()*40-20);
                    ctx.closePath(); ctx.stroke();
                } else if(type===1) {
                    ctx.arc(x,y,10+Math.random()*10, 0, Math.PI*2); ctx.stroke();
                } else if(type===2) {
                    ctx.moveTo(x,y); ctx.lineTo(x+Math.random()*30-15, y+Math.random()*30-15); ctx.stroke();
                } else {
                    for(let j=0;j<4;j++) { ctx.lineTo(x+j*10, y+Math.sin(j)*10); } ctx.stroke();
                }
            }
        }
        else if (effect === 'hyperdrive') {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            const cx = w/2, cy = h/2;
            for(let i=0; i<150; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 50 + Math.random() * Math.max(w,h);
                const len = 20 + Math.random() * 80;
                ctx.save();
                ctx.translate(cx + Math.cos(angle)*dist, cy + Math.sin(angle)*dist);
                ctx.rotate(angle);
                ctx.fillRect(0, 0, len, 2 + Math.random()*2);
                ctx.restore();
            }
        }
        else if (effect === 'glitch') {
            ctx.fillStyle = color; ctx.fillRect(0,0,w,h);
            ctx.globalCompositeOperation = 'screen';
            for(let i=0; i<15; i++) {
                const y = Math.random()*h, rh = 10+Math.random()*40;
                ctx.fillStyle = "rgba(255,0,0,0.5)"; ctx.fillRect(-10+Math.random()*20, y, w, rh);
                ctx.fillStyle = "rgba(0,255,0,0.5)"; ctx.fillRect(-10+Math.random()*20, y, w, rh);
                ctx.fillStyle = "rgba(0,0,255,0.5)"; ctx.fillRect(-10+Math.random()*20, y, w, rh);
            }
        }
        else if (effect === 'psychedelic') {
            const cx = w / 2, cy = h / 2;
            const maxR = Math.hypot(cx, cy);
            let colorStep = 0;
            for (let r = maxR; r > 0; r -= 20) {
                colorStep++;
                if (colorStep % 3 === 0) ctx.fillStyle = color;
                else if (colorStep % 3 === 1) ctx.fillStyle = "#ff00ff";
                else ctx.fillStyle = "#00ffff";
                
                ctx.beginPath();
                for (let a = 0; a <= Math.PI * 2.1; a += 0.1) {
                    const wave = Math.sin(a * 6 + r * 0.05) * 25 + Math.cos(a * 3 - r * 0.1) * 15;
                    const rad = Math.max(0, r + wave);
                    if (a === 0) ctx.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
                    else ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
                }
                ctx.fill();
            }
        }
        else if (effect === 'concentric') {
            ctx.strokeStyle = "rgba(0,0,0,0.15)";
            ctx.lineWidth = 4;
            const maxR = Math.hypot(w/2, h/2);
            for(let r=10; r<maxR; r+=20) {
                ctx.beginPath(); ctx.arc(w/2, h/2, r, 0, Math.PI*2); ctx.stroke();
            }
        }
        else if (effect === 'dottedgrad') {
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            const s = 15, cx = w/2, cy = h/2, maxD = Math.hypot(cx, cy);
            for(let y=0; y<h; y+=s) {
                for(let x=0; x<w; x+=s) {
                    const dist = Math.hypot(x-cx, y-cy);
                    const rad = (dist/maxD) * (s/2);
                    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI*2); ctx.fill();
                }
            }
        }
        else if (effect === 'rainstorm') {
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineCap = "round";
            for(let i=0; i<300; i++) {
                ctx.lineWidth = 1 + Math.random()*2;
                const x = Math.random()*w*1.5;
                const y = Math.random()*h;
                const len = 20 + Math.random()*40;
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len*0.5, y + len); ctx.stroke();
            }
        }
        else if (effect === 'blizzard') {
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            for(let i=0; i<400; i++) {
                const r = 1 + Math.random()*4;
                ctx.shadowBlur = r*2;
                ctx.shadowColor = "white";
                ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, r, 0, Math.PI*2); ctx.fill();
            }
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }

    window._checkSnapToCenter = function(item, type, info) {
        if (!state._snapLines) state._snapLines = { x: false, y: false, lines: [], hasSnappedX: false, hasSnappedY: false };
        state._snapLines.x = false;
        state._snapLines.y = false;
        state._snapLines.lines = [];
        state._snapLines.hasSnappedX = false;
        state._snapLines.hasSnappedY = false;
        if (!item || !info) return;
        if (!state.snapEnabled && !state.showCenterLines) return;
        const threshold = 10; 
        let itemX, itemY, itemW, itemH;

        if (type === 'text' || type === 'shape') {
            itemW = item.w * info.outW;
            itemH = item.h * info.outH;
            itemX = item.x * info.outW;
            itemY = item.y * info.outH;
        } else if (type === 'image') {
            itemW = item.w;
            itemH = item.h;
            itemX = item.x;
            itemY = item.y;
        }

        const iLinesX = [
            { val: itemX, offset: 0 },
            { val: itemX + itemW / 2, offset: itemW / 2 },
            { val: itemX + itemW, offset: itemW }
        ];
        const iLinesY = [
            { val: itemY, offset: 0 },
            { val: itemY + itemH / 2, offset: itemH / 2 },
            { val: itemY + itemH, offset: itemH }
        ];

        const checkTarget = (tX, tY, tW, tH, isCanvasCenter = false) => {
            const tLinesX = isCanvasCenter ? [tX + tW / 2] : [tX, tX + tW / 2, tX + tW];
            const tLinesY = isCanvasCenter ? [tY + tH / 2] : [tY, tY + tH / 2, tY + tH];

            for (let il of iLinesX) {
                for (let tl of tLinesX) {
                    if (Math.abs(il.val - tl) < threshold) {
                        if (!state._snapLines.hasSnappedX) {
                            state._snapLines.hasSnappedX = true;
                            let newPx = tl - il.offset;
                            if (type === 'text' || type === 'shape') item.x = newPx / info.outW;
                            else item.x = newPx;
                            let diff = tl - il.val;
                            iLinesX.forEach(l => l.val += diff);
                        }
                        if (Math.abs(il.val - tl) < 1) {
                            if (isCanvasCenter) {
                                state._snapLines.x = true;
                            } else {
                                if (!state._snapLines.lines.some(l => l.vertical && Math.abs(l.x - tl) < 1)) {
                                    state._snapLines.lines.push({ x: tl, vertical: true });
                                }
                            }
                        }
                    }
                }
            }

            for (let il of iLinesY) {
                for (let tl of tLinesY) {
                    if (Math.abs(il.val - tl) < threshold) {
                        if (!state._snapLines.hasSnappedY) {
                            state._snapLines.hasSnappedY = true;
                            let newPy = tl - il.offset;
                            if (type === 'text' || type === 'shape') item.y = newPy / info.outH;
                            else item.y = newPy;
                            let diff = tl - il.val;
                            iLinesY.forEach(l => l.val += diff);
                        }
                        if (Math.abs(il.val - tl) < 1) {
                            if (isCanvasCenter) {
                                state._snapLines.y = true;
                            } else {
                                if (!state._snapLines.lines.some(l => !l.vertical && Math.abs(l.y - tl) < 1)) {
                                    state._snapLines.lines.push({ y: tl, vertical: false });
                                }
                            }
                        }
                    }
                }
            }
        };

       if (state.showCenterLines) {
            if (state.stageCropRect && state.stageCropRect.w > 0) {
                checkTarget(state.stageCropRect.x * info.outW, state.stageCropRect.y * info.outH, state.stageCropRect.w * info.outW, state.stageCropRect.h * info.outH, true);
            } else {
                checkTarget(0, 0, info.outW, info.outH, true);
            }
        }

        if (state.snapEnabled) {
            state.images.forEach(i => {
                if (i === item || i.w === undefined || i.locked) return;
                checkTarget(i.x, i.y, i.w, i.h, false);
            });
            (state.shapes || []).forEach(s => {
                if (s === item) return;
                checkTarget(s.x * info.outW, s.y * info.outH, s.w * info.outW, s.h * info.outH, false);
            });
            state.texts.forEach(t => {
                if (t === item) return;
                checkTarget(t.x * info.outW, t.y * info.outH, t.w * info.outW, t.h * info.outH, false);
            });
        }
    };


      let _previewRaf = null;
      function queuedDrawPreview(skipSync = false) {
          if (!_previewRaf) {
              _previewRaf = requestAnimationFrame(() => {
                  _previewRaf = null;
                  drawPreview(skipSync);
              });
          }
      }

      function drawPreview(skipSync = false) {
    updateWhiteSpaceLinesToggle();
    updateWhiteSpaceTopScopeToggle();

    const hint = overlay.querySelector(".meme-creator-hint");
    if (hint) {
        if (!state.advancedMode && state.whiteSpacePos !== 'none') {
            hint.textContent = "Drag the green handles to expand/shrink white space";
                        hint.classList.remove("is-hidden");
        } else {
            hint.textContent = "";
                        hint.classList.add("is-hidden");
        }
    }
    
        // Handle logic for empty state or populated state
    const imgs = state.images.map(o => o.img);
    let info;

        const stgEl = overlay.querySelector(".meme-creator-stage");

    const measuredW = stgEl ? stgEl.clientWidth : 0;
    const measuredH = stgEl ? stgEl.clientHeight : 0;

    const usableW = (measuredW && measuredW > 60) ? (measuredW - 20) : (state._lastStageW || 800);
    const usableH = (measuredH && measuredH > 60) ? (measuredH - 20) : (state._lastStageH || 600);

    if (measuredW && measuredW > 60) state._lastStageW = measuredW - 20;
    if (measuredH && measuredH > 60) state._lastStageH = measuredH - 20;

    const advW = usableW;
    const advH = usableH;


    const hasShapes = Array.isArray(state.shapes) && state.shapes.length > 0;
    const hasText = Array.isArray(state.texts) && state.texts.length > 0;

    if (imgs.length === 0) {
        const useStageSize = state.advancedMode || hasShapes || hasText;
        const w = (state.advancedMode && state.fixedSize) ? state.fixedSize.w : advW;
        const h = (state.advancedMode && state.fixedSize) ? state.fixedSize.h : advH;

        info = useStageSize
            ? { outW: w, outH: h, gapPx: 0, rects: [], wsPos: 'none' }
            : { outW: 800, outH: 600, gapPx: 0, rects: [], wsPos: 'none' };
    } else if (state.advancedMode) {
        const w = state.fixedSize ? state.fixedSize.w : advW;
        const h = state.fixedSize ? state.fixedSize.h : advH;

        info = { outW: w, outH: h, gapPx: 0, rects: [], wsPos: 'none' };
        info.rects = state.images.map(img => {
            if (img.w === undefined) {
                    const aspect = img.img.width / img.img.height;
                    img.w = 266; // Default width
                    img.h = 266 / aspect;
                    img.x = (advW - img.w) / 2;
                    img.y = (advH - img.h) / 2;
                }
            return { x: img.x, y: img.y, w: img.w, h: img.h };
        });
    } else {
        info = computeComposite(imgs, state.layout, state.whiteSpacePos, state.whiteSpaceSize, state.whiteSpaceTopScope);
    }


    state._layoutInfo = info;

    canvas.width = info.outW;
        canvas.height = info.outH;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, info.outW, info.outH);

        // Fill background with Effect
        drawBackgroundEffect(ctx, info.outW, info.outH, state.canvasColor || "#ffffff", state.canvasEffect);

        const drawGridOverlay = () => {
            if (!state.showGrid) return;
            ctx.save();
            let startX = 0, startY = 0, endX = info.outW, endY = info.outH;
            if (info.wsPos === 'top') startY = info.gapPx;
            else if (info.wsPos === 'right') endX = info.outW - info.gapPx;
            const gridW = Math.round(endX - startX), gridH = Math.round(endY - startY);
            const calcGcd = (a, b) => b === 0 ? a : calcGcd(b, a % b);
            let step = calcGcd(gridW, gridH);
            while (step > 150) {
                if (step % 2 === 0) step /= 2; else if (step % 3 === 0) step /= 3; else if (step % 5 === 0) step /= 5; else break;
            }
            if (step < 20) step = Math.round(Math.min(gridW, gridH) / 10);
            if (state.showGrid === 2) step /= 2;

            ctx.lineWidth = 1;
            ctx.strokeStyle = state.showGrid === 2 ? "rgba(233, 30, 99, 0.5)" : "rgba(0, 0, 0, 0.25)";
            ctx.beginPath();
            for (let x = startX; x <= endX; x += step) { ctx.moveTo(x, startY); ctx.lineTo(x, endY); }
            for (let y = startY; y <= endY; y += step) { ctx.moveTo(startX, y); ctx.lineTo(endX, y); }
            ctx.stroke();

            ctx.strokeStyle = state.showGrid === 2 ? "rgba(255, 192, 203, 0.5)" : "rgba(255, 255, 255, 0.4)";
            ctx.beginPath();
            for (let x = startX; x <= endX; x += step) { ctx.moveTo(x + 1, startY); ctx.lineTo(x + 1, endY); }
            for (let y = startY; y <= endY; y += step) { ctx.moveTo(startX, y + 1); ctx.lineTo(endX, y + 1); }
            ctx.stroke();
            ctx.restore();
        };

        if (!state.gridAbove) drawGridOverlay();

                // Unified Layer Drawing (Shapes + Images + Text in Advanced Mode)
        const renderList = [];
        
        // 1. Add Images
        state.images.forEach((imgObj, idx) => {
            if (imgObj.zIndex === undefined || imgObj.zIndex === null) imgObj.zIndex = state.nextZIndex++;
            renderList.push({ type: 'image', data: imgObj, index: idx, z: imgObj.zIndex });
        });

        // 2. Add Shapes
        if (state.shapes) {
            state.shapes.forEach(s => {
                if (s.zIndex === undefined || s.zIndex === null) s.zIndex = state.nextZIndex++;
                renderList.push({ type: 'shape', data: s, z: s.zIndex });
            });
        }

        state.texts.forEach(t => {
            if (t.zIndex === undefined || t.zIndex === null) t.zIndex = state.nextZIndex++;
            renderList.push({ type: 'text', data: t, z: t.zIndex });
        });

        renderList.sort((a, b) => a.z - b.z);

        renderList.forEach(item => {
            const d = item.data;

            let cx, cy;
            if (item.type === 'shape') {
                cx = (d.x * info.outW) + (d.w * info.outW) / 2;
                cy = (d.y * info.outH) + (d.h * info.outH) / 2;
            } else if (item.type === 'text') {
                cx = (d.x * info.outW) + (d.w * info.outW) / 2;
                cy = (d.y * info.outH) + (d.h * info.outH) / 2;
            } else {
                const r = info.rects[item.index];
                if (!r) return;
                cx = r.x + r.w / 2;
                cy = r.y + r.h / 2;
            }

            ctx.save();
            
            // Apply Rotation & Flip
            ctx.translate(cx, cy);
            if (d.rotation) ctx.rotate(d.rotation * Math.PI / 180);
            if (d.flip) ctx.scale(-1, 1);
            ctx.translate(-cx, -cy);

           // Text layer drawing (Advanced Mode stack)
            if (item.type === 'text') {
                const t = d;


                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                if (t.opacity !== undefined) ctx.globalAlpha = t.opacity;
                if (t.hidden) ctx.globalAlpha = 0.3;
                if (state.cutMode || state.lassoMode || state.cropMode) ctx.globalAlpha *= 0.2;

                const x = Math.round(t.x * info.outW);
                const y = Math.round(t.y * info.outH);
                const tw = Math.round(t.w * info.outW);

                const dispH = state._displayH || Math.round(info.outH * (state._displayScale || 1));
                const outPerDispY = info.outH / Math.max(1, dispH);
                const outPerDispX = info.outW / Math.max(1, (state._displayW || 1));

                const fontSize = Math.max(10, Math.round(t.fontSize || state.baseFontSize));
                const fam = t.fontFamily || state.baseFontFamily || "Anton";
                const rawWeight = t.fontWeight || state.baseFontWeight || "900";
                const fStyle = t.fontStyle || state.baseFontStyle || "normal";
                const weight = fStyle === "bold" ? "bold" : rawWeight;
                const famForCanvas = fam.includes(" ") ? `"${fam}"` : fam;
                const font = `${fStyle === "italic" ? "italic " : ""}${weight} ${fontSize}px ${famForCanvas}, Impact, Arial Black, sans-serif`;

                const color = __normalizeMemeTextColor(t.color || state.baseColor);

                const bgEnabled = (t.shadowEnabled !== undefined) ? t.shadowEnabled : state.baseShadowEnabled;
                let stroke = "transparent";
                let strokeWidth = 0;
                if (bgEnabled) {
                const shadowColor = __normalizeMemeTextColor(t.shadowColor || state.baseShadowColor || __contrastMemeColor(color));
                const depthRaw = (t.shadowDepth || state.baseShadowDepth || 2);
                const depth = Math.max(1, Math.min(7, parseInt(depthRaw, 10) || 2));
                stroke = shadowColor;
                strokeWidth = Math.max(2, Math.round(depth * 2 * outPerDispX));
            }

                const tsEnabled = (t.textShadowEnabled !== undefined) ? t.textShadowEnabled : state.baseTextShadowEnabled;
                let tsColor = "transparent", tsOff = 0, tsBlur = 0;
                if (tsEnabled) {
                    tsColor = (t.textShadowColor || state.baseTextShadowColor || "#000000");
                    const tsDepthRaw = (t.textShadowDepth ?? state.baseTextShadowDepth ?? 3);
                    const tsDepth = Math.max(1, Math.min(7, parseInt(tsDepthRaw, 10) || 3));
                    tsOff = Math.max(1, Math.round(tsDepth * outPerDispX));
                    tsBlur = Math.round(tsOff * 1.2);
                }

                const padY = Math.round(6 * outPerDispY);
                const padX = Math.round(8 * outPerDispX);
                const yOffset = Math.round(fontSize * 0.2);
                const cxText = x + Math.round(tw / 2) - Math.round(padX * 0.5);

                wrapAndDrawText(
                    ctx,
                    t.text || "",
                    cxText,
                    y + padY + yOffset,
                    Math.max(10, tw - padX * 2),
                    font,
                    fontSize,
                    color,
                    stroke,
                    strokeWidth,
                    tsColor,
                    tsOff,
                    tsOff,
                    tsBlur
                );

                ctx.restore();
                return;
            }


            if (item.type === 'shape') {
                const s = item.data;
                const sx = s.x * info.outW;
                const sy = s.y * info.outH;
                const sw = s.w * info.outW;
                const sh = s.h * info.outH;


                if (s.opacity !== undefined) ctx.globalAlpha = s.opacity;
                if (s.hidden) ctx.globalAlpha = 0.3;
                if (state.cutMode || state.lassoMode || state.cropMode) ctx.globalAlpha *= 0.2;

                // Shadow
                if (s.shadowEnabled) {
                    ctx.shadowColor = s.shadowColor || "#000000";
                    ctx.shadowBlur = (s.shadowBlur || 10) * 2;
                    ctx.shadowOffsetX = 5; 
                    ctx.shadowOffsetY = 5;
                }

                ctx.beginPath();
                ctx.strokeStyle = s.color || "#e67e22";
                ctx.lineWidth = s.strokeWidth || 5; 
                ctx.fillStyle = (s.fillEnabled && s.fillColor) ? s.fillColor : "transparent";

                // Define Path Helpers
                const defineStar = (ctx, cx, cy, r) => {
                    const spikes = 5; 
                    const outer = r; 
                    const inner = r * 0.5;
                    let rot = (Math.PI / 2) * 3;
                    let x = cx, y = cy;
                    const step = Math.PI / spikes;
                    ctx.moveTo(cx, cy - outer);
                    for (let i = 0; i < spikes; i++) {
                        x = cx + Math.cos(rot) * outer; y = cy + Math.sin(rot) * outer; ctx.lineTo(x, y); rot += step;
                        x = cx + Math.cos(rot) * inner; y = cy + Math.sin(rot) * inner; ctx.lineTo(x, y); rot += step;
                    }
                    ctx.lineTo(cx, cy - outer); ctx.closePath();
                };

                const defineHeart = (ctx, x, y, w, h) => {
                    const topCurve = h * 0.3;
                    ctx.moveTo(x + w/2, y + h * 0.2);
                    ctx.bezierCurveTo(x + w/2, y + h * 0.2 - topCurve, x, y, x, y + h * 0.4);
                    ctx.bezierCurveTo(x, y + h * 0.6, x + w/2, y + h * 0.85, x + w/2, y + h);
                    ctx.bezierCurveTo(x + w/2, y + h * 0.85, x + w, y + h * 0.6, x + w, y + h * 0.4);
                    ctx.bezierCurveTo(x + w, y, x + w/2, y + h * 0.2 - topCurve, x + w/2, y + h * 0.2);
                    ctx.closePath();
                };

                const defineArrow = (ctx, x, y, w, h) => {
                    const shaftH = h * 0.4;
                    const headW = w * 0.4;
                    const midY = y + h/2;
                    ctx.moveTo(x, midY - shaftH/2);
                    ctx.lineTo(x + w - headW, midY - shaftH/2);
                    ctx.lineTo(x + w - headW, y);
                    ctx.lineTo(x + w, midY);
                    ctx.lineTo(x + w - headW, y + h);
                    ctx.lineTo(x + w - headW, midY + shaftH/2);
                    ctx.lineTo(x, midY + shaftH/2);
                    ctx.closePath();
                };

                // Standard Shapes
                if (s.type === 'square' || s.type === 'rect') {
                    ctx.rect(sx, sy, sw, sh);
                } else if (s.type === 'circle') {
                    ctx.ellipse(sx + sw/2, sy + sh/2, sw/2, sh/2, 0, 0, 2 * Math.PI);
                } else if (s.type === 'line') {
                    ctx.moveTo(sx, sy + sh/2);
                    ctx.lineTo(sx + sw, sy + sh/2);
                } else if (s.type === 'triangle') {
                    ctx.moveTo(sx + sw/2, sy);
                    ctx.lineTo(sx + sw, sy + sh);
                    ctx.lineTo(sx, sy + sh);
                    ctx.closePath();
                } else if (s.type === 'octagon') {
                    const step = (2 * Math.PI) / 8;
                    const cx = sx + sw/2; const cy = sy + sh/2; const r = Math.min(sw, sh) / 2;
                    for(let k=0; k<8; k++) {
                        const ang = k * step;
                        if(k===0) ctx.moveTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
                        else ctx.lineTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
                    }
                    ctx.closePath();
                } else if (s.type === 'star') {
                    defineStar(ctx, sx + sw/2, sy + sh/2, Math.min(sw, sh)/2);
                } else if (s.type === 'heart') {
                    defineHeart(ctx, sx, sy, sw, sh);
                } else if (s.type === 'arrow') {
                    defineArrow(ctx, sx, sy, sw, sh);
                }
                // Draw Emoji inside the shape frame
                else if (s.type === 'emoji') {
                    ctx.fillStyle = "black"; // Force visible fill
                    const size = Math.min(sw, sh);
                    ctx.font = `${size}px serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(s.text, sx + sw/2, sy + sh/2 + (size * 0.10));
                }
                
                // Thought Bubbles
                else if (s.type === 'bubble_oval') {
                    ctx.ellipse(sx + sw/2, sy + sh * 0.45, sw/2, sh * 0.4, 0, 0, 2 * Math.PI);
                    ctx.moveTo(sx + sw * 0.25, sy + sh * 0.85);
                    ctx.arc(sx + sw * 0.2, sy + sh * 0.95, sw * 0.05, 0, 2 * Math.PI);
                    ctx.moveTo(sx + sw * 0.15, sy + sh);
                    ctx.arc(sx + sw * 0.1, sy + sh, sw * 0.03, 0, 2 * Math.PI);
                } else if (s.type === 'bubble_cloud') {
                    const cx = sx + sw/2; const cy = sy + sh/2;
                    ctx.ellipse(cx, cy, sw*0.4, sh*0.35, 0, 0, 2*Math.PI);
                    ctx.ellipse(cx - sw*0.3, cy, sw*0.2, sh*0.25, 0, 0, 2*Math.PI);
                    ctx.ellipse(cx + sw*0.3, cy, sw*0.2, sh*0.25, 0, 0, 2*Math.PI);
                    ctx.ellipse(cx, cy - sh*0.3, sw*0.25, sh*0.2, 0, 0, 2*Math.PI);
                    ctx.ellipse(cx, cy + sh*0.3, sw*0.25, sh*0.2, 0, 0, 2*Math.PI);
                    // Dots
                    ctx.moveTo(sx + sw * 0.2, sy + sh * 0.9);
                    ctx.arc(sx + sw * 0.2, sy + sh * 0.9, sw * 0.04, 0, 2 * Math.PI);
                    ctx.moveTo(sx + sw * 0.15, sy + sh * 0.98);
                    ctx.arc(sx + sw * 0.12, sy + sh * 0.98, sw * 0.025, 0, 2 * Math.PI);
                } else if (s.type === 'bubble_square') {
                    const r = 10;
                    const bx = sx; const by = sy; const bw = sw; const bh = sh * 0.8;
                    ctx.moveTo(bx + r, by);
                    ctx.lineTo(bx + bw - r, by); ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
                    ctx.lineTo(bx + bw, by + bh - r); ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
                    ctx.lineTo(bx + bw * 0.4, by + bh);
                    ctx.lineTo(bx + bw * 0.2, by + bh + (sh * 0.2)); // Tail point
                    ctx.lineTo(bx + bw * 0.3, by + bh);
                    ctx.lineTo(bx + r, by + bh); ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
                    ctx.lineTo(bx, by + r); ctx.quadraticCurveTo(bx, by, bx + r, by);
                }

                // 3D Shapes (Extrusions)
                else if (s.type.startsWith('3d_')) {
                    const offX = sw * 0.1; const offY = sh * 0.1;
                    const backX = sx + offX; const backY = sy;
                    const frontX = sx; const frontY = sy + offY;
                    const dW = sw - offX; const dH = sh - offY;

                    ctx.beginPath();
                    if (s.type === '3d_square' || s.type === '3d_rect') {
                        ctx.rect(backX, backY, dW, dH);
                        ctx.moveTo(backX, backY); ctx.lineTo(frontX, frontY);
                        ctx.moveTo(backX + dW, backY); ctx.lineTo(frontX + dW, frontY);
                        ctx.moveTo(backX + dW, backY + dH); ctx.lineTo(frontX + dW, frontY + dH);
                        ctx.moveTo(backX, backY + dH); ctx.lineTo(frontX, frontY + dH);
                    } else if (s.type === '3d_circle') {
                        ctx.ellipse(backX + dW/2, backY + dH/2, dW/2, dH/2, 0, 0, 2*Math.PI);
                        ctx.moveTo(backX + dW/2, backY); ctx.lineTo(frontX + dW/2, frontY); // top connector
                        ctx.moveTo(backX + dW, backY + dH/2); ctx.lineTo(frontX + dW, frontY + dH/2); // right
                        ctx.moveTo(backX + dW/2, backY + dH); ctx.lineTo(frontX + dW/2, frontY + dH); // bottom
                        ctx.moveTo(backX, backY + dH/2); ctx.lineTo(frontX, frontY + dH/2); // left
                    } else if (s.type === '3d_cylinder') {
                        const ry = sw * 0.15;
                        ctx.ellipse(sx + sw/2, sy + sh - ry, sw/2, ry, 0, 0, 2*Math.PI);
                        ctx.moveTo(sx, sy + ry); ctx.lineTo(sx, sy + sh - ry);
                        ctx.moveTo(sx + sw, sy + ry); ctx.lineTo(sx + sw, sy + sh - ry);
                    } else if (s.type === '3d_triangle') {
                        ctx.moveTo(backX + dW/2, backY); ctx.lineTo(backX + dW, backY + dH); ctx.lineTo(backX, backY + dH); ctx.closePath();
                        ctx.moveTo(backX + dW/2, backY); ctx.lineTo(frontX + dW/2, frontY);
                        ctx.moveTo(backX + dW, backY + dH); ctx.lineTo(frontX + dW, frontY + dH);
                        ctx.moveTo(backX, backY + dH); ctx.lineTo(frontX, frontY + dH);
                    } else if (s.type === '3d_star') {
                        const r = Math.min(dW, dH) / 2;
                        const cxB = backX + dW / 2;
                        const cyB = backY + dH / 2;
                        const cxF = frontX + dW / 2;
                        const cyF = frontY + dH / 2;

                        defineStar(ctx, cxB, cyB, r);
                        const toRad = Math.PI / 180;
                        const tips = [270, 54, 126].map(deg => ({ 
                            x: Math.cos(deg * toRad) * r, 
                            y: Math.sin(deg * toRad) * r 
                        }));

                        ctx.moveTo(cxB + tips[0].x, cyB + tips[0].y); 
                        ctx.lineTo(cxF + tips[0].x, cyF + tips[0].y);
                        ctx.moveTo(cxB + tips[1].x, cyB + tips[1].y);
                        ctx.lineTo(cxF + tips[1].x, cyF + tips[1].y);
                        ctx.moveTo(cxB + tips[2].x, cyB + tips[2].y);
                        ctx.lineTo(cxF + tips[2].x, cyF + tips[2].y);

                    } else if (s.type === '3d_heart') {
                        defineHeart(ctx, backX, backY, dW, dH);
                        ctx.moveTo(backX + dW/2, backY + dH*0.2); ctx.lineTo(frontX + dW/2, frontY + dH*0.2); // center dip
                        ctx.moveTo(backX + dW/2, backY + dH); ctx.lineTo(frontX + dW/2, frontY + dH); // bottom tip
                        ctx.moveTo(backX, backY + dH*0.4); ctx.lineTo(frontX, frontY + dH*0.4); // left bump
                        ctx.moveTo(backX + dW, backY + dH*0.4); ctx.lineTo(frontX + dW, frontY + dH*0.4); // right bump
                    } else if (s.type === '3d_arrow') {
                        defineArrow(ctx, backX, backY, dW, dH);
                        ctx.moveTo(backX + dW, backY + dH/2); ctx.lineTo(frontX + dW, frontY + dH/2); // tip
                        ctx.moveTo(backX, backY + dH*0.3); ctx.lineTo(frontX, frontY + dH*0.3); // tail top
                        ctx.moveTo(backX, backY + dH*0.7); ctx.lineTo(frontX, frontY + dH*0.7); // tail bot
                    }
                    ctx.stroke();
                    ctx.beginPath();
                    if (s.type === '3d_square' || s.type === '3d_rect') ctx.rect(frontX, frontY, dW, dH);
                    else if (s.type === '3d_circle') ctx.ellipse(frontX + dW/2, frontY + dH/2, dW/2, dH/2, 0, 0, 2*Math.PI);
                    else if (s.type === '3d_cylinder') { const ry = sw * 0.15; ctx.ellipse(sx + sw/2, sy + ry, sw/2, ry, 0, 0, 2*Math.PI); }
                    else if (s.type === '3d_triangle') { ctx.moveTo(frontX + dW/2, frontY); ctx.lineTo(frontX + dW, frontY + dH); ctx.lineTo(frontX, frontY + dH); ctx.closePath(); }
                    else if (s.type === '3d_star') defineStar(ctx, frontX + dW/2, frontY + dH/2, Math.min(dW, dH)/2);
                    else if (s.type === '3d_heart') defineHeart(ctx, frontX, frontY, dW, dH);
                    else if (s.type === '3d_arrow') defineArrow(ctx, frontX, frontY, dW, dH);
                }

                if (s.type !== 'line') {
                    if (s.fillEnabled) ctx.fill();
                    ctx.stroke();
                } else {
                    ctx.stroke();
                }


            } else {
                const imgObj = item.data;
                const r = info.rects[item.index];
                
                const crop = imgObj.crop;
                
                if (imgObj.opacity !== undefined) ctx.globalAlpha = imgObj.opacity;
                if (imgObj.hidden) ctx.globalAlpha = 0.3;
                if (state.cutMode || state.lassoMode || state.cropMode) {
                    let targetIdx = state.cropMode ? state.cropTargetIdx : state.selectedImageIdx;
                    if (item.index !== targetIdx) ctx.globalAlpha *= 0.2;
                }

                if (crop) {
                    const iw = imgObj.img.naturalWidth || imgObj.img.width;
                    const ih = imgObj.img.naturalHeight || imgObj.img.height;
                    const sx = Math.max(0, Math.min(iw - 1, Math.round(crop.x * iw)));
                    const sy = Math.max(0, Math.min(ih - 1, Math.round(crop.y * ih)));
                    const sw = Math.max(1, Math.min(iw - sx, Math.round(crop.w * iw)));
                    const sh = Math.max(1, Math.min(ih - sy, Math.round(crop.h * ih)));
                    ctx.drawImage(imgObj.img, sx, sy, sw, sh, r.x, r.y, r.w, r.h);
                } else {
                    ctx.drawImage(imgObj.img, r.x, r.y, r.w, r.h);
                }
            }
            
            ctx.restore(); 
        });

       let outlineItems = [];
        if (state.multiSelected && state.multiSelected.length > 0) {
            outlineItems = state.multiSelected;
        } else {
            let act = null;
            if (state.selectedTextId) act = state.texts.find(t => t.id === state.selectedTextId);
            else if (state.selectedShapeId) act = state.shapes.find(s => s.id === state.selectedShapeId);
            else if (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined) act = state.images[state.selectedImageIdx];
            if (act && act.groupId) {
                state.images.forEach(i => { if (i.groupId === act.groupId) outlineItems.push({type: 'image', data: i}); });
                (state.shapes || []).forEach(s => { if (s.groupId === act.groupId) outlineItems.push({type: 'shape', data: s}); });
                state.texts.forEach(t => { if (t.groupId === act.groupId) outlineItems.push({type: 'text', data: t}); });
            }
        }

        if (outlineItems.length > 0) {
            ctx.save();
            ctx.strokeStyle = "#ff00ff";
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            outlineItems.forEach(m => {
                let sx, sy, sw, sh;
                if (m.type === 'image') {
                    sx = m.data.x; sy = m.data.y; sw = m.data.w; sh = m.data.h;
                } else {
                    sx = m.data.x * info.outW; sy = m.data.y * info.outH; sw = m.data.w * info.outW; sh = m.data.h * info.outH;
                }
                ctx.save();
                const cx = sx + sw/2; const cy = sy + sh/2;
                ctx.translate(cx, cy);
                if (m.data.rotation) ctx.rotate(m.data.rotation * Math.PI / 180);
                if (m.data.flip) ctx.scale(-1, 1);
                ctx.translate(-cx, -cy);
                ctx.strokeRect(sx, sy, sw, sh);
                ctx.restore();
            });
            ctx.restore();
        }

        if ((state.cutMode || state.lassoMode) && state.cutPath.length > 1) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "#c0392b";
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);

            state.cutPath.forEach((pt, i) => {
                const px = pt.x * info.outW;
                const py = pt.y * info.outH;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });
            ctx.stroke();
            ctx.restore();
        }

       if (state.gridAbove) drawGridOverlay();

        if (state._showSnapLines && state._snapLines) {
            ctx.save();
            ctx.setLineDash([5, 5]);
            
            if (state.showCenterLines) {
                ctx.strokeStyle = "#00ffff"; 
                ctx.lineWidth = 2;
                ctx.beginPath();
                let cx = info.outW / 2;
                let cy = info.outH / 2;
                let startX = 0, endX = info.outW, startY = 0, endY = info.outH;
                if (state.stageCropRect && state.stageCropRect.w > 0) {
                    startX = state.stageCropRect.x * info.outW;
                    startY = state.stageCropRect.y * info.outH;
                    endX = startX + (state.stageCropRect.w * info.outW);
                    endY = startY + (state.stageCropRect.h * info.outH);
                    cx = startX + (state.stageCropRect.w * info.outW) / 2;
                    cy = startY + (state.stageCropRect.h * info.outH) / 2;
                }
                if (state._snapLines.x) { ctx.moveTo(cx, startY); ctx.lineTo(cx, endY); }
                if (state._snapLines.y) { ctx.moveTo(startX, cy); ctx.lineTo(endX, cy); }
                ctx.stroke();
            }

            if (state.snapEnabled && state._snapLines.lines) {
                ctx.strokeStyle = "#ff00ff"; 
                ctx.lineWidth = 2;
                ctx.beginPath();
                state._snapLines.lines.forEach(l => {
                    if (l.vertical) {
                        ctx.moveTo(l.x, 0); ctx.lineTo(l.x, info.outH);
                    } else {
                        ctx.moveTo(0, l.y); ctx.lineTo(info.outW, l.y);
                    }
                });
                ctx.stroke();
            }
            
            ctx.restore();
        }

        const cropWrap = overlay.querySelector(".meme-creator-canvas-wrap");
        let cropDimmer = cropWrap ? cropWrap.querySelector("#meme-stage-crop-dimmer") : null;

        if (state.stageCropRect) {
            const r = state.stageCropRect;
            const rx = Math.round(r.x * info.outW);
            const ry = Math.round(r.y * info.outH);
            const rw = Math.round(r.w * info.outW);
            const rh = Math.round(r.h * info.outH);

            if (!cropDimmer && cropWrap) {
                cropDimmer = document.createElement("div");
                cropDimmer.id = "meme-stage-crop-dimmer";
                cropDimmer.style.cssText = "position:absolute; pointer-events:none; z-index:90; box-shadow: 0 0 0 9999px rgba(0,0,0,0.5);";
                cropWrap.appendChild(cropDimmer);
            }
            if (cropDimmer) {
                cropDimmer.style.display = "block";
                const s = state._displayScale || 1;
                cropDimmer.style.left = (rx * s) + "px";
                cropDimmer.style.top = (ry * s) + "px";
                cropDimmer.style.width = (rw * s) + "px";
                cropDimmer.style.height = (rh * s) + "px";
            }

            ctx.save();

            const guideScale = 0.75 * Math.max(info.outW / 800, info.outH / 600);
            const lw = 2 * guideScale;
            const dash = 6 * guideScale;

            ctx.strokeStyle = "#fff";
            ctx.lineWidth = lw;
            ctx.setLineDash([dash, dash]);
            ctx.strokeRect(rx, ry, rw, rh);
            
            ctx.strokeStyle = "#000";
            ctx.setLineDash([dash, dash]);
            ctx.lineDashOffset = dash;
            ctx.strokeRect(rx, ry, rw, rh);
            ctx.strokeStyle = "red";
            ctx.lineWidth = lw * 2;
            ctx.setLineDash([]);
            const hLen = 20 * guideScale; 
            ctx.beginPath(); ctx.moveTo(rx + rw/2 - hLen/2, ry); ctx.lineTo(rx + rw/2 + hLen/2, ry); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rx + rw/2 - hLen/2, ry + rh); ctx.lineTo(rx + rw/2 + hLen/2, ry + rh); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rx, ry + rh/2 - hLen/2); ctx.lineTo(rx, ry + rh/2 + hLen/2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rx + rw, ry + rh/2 - hLen/2); ctx.lineTo(rx + rw, ry + rh/2 + hLen/2); ctx.stroke();
            
            ctx.restore();
        } else {
             if (cropDimmer) cropDimmer.style.display = "none";
        }

        const wrap = overlay.querySelector(".meme-creator-canvas-wrap");
        const viewportEl = viewport || overlay.querySelector(".meme-creator-viewport");
        const stageEl = overlay.querySelector(".meme-creator-stage");

        const stageW = stageEl ? stageEl.clientWidth : 800;
        const stageH = stageEl ? stageEl.clientHeight : 600;

        const maxW = Math.max(200, stageW - 20);
        const maxH = Math.max(200, stageH - 20);

        const fitScale = Math.min(1, maxW / canvas.width, maxH / canvas.height);
        const FULL_ZOOM_SCALE = 0.50;

        const scale = state.zoomMode ? FULL_ZOOM_SCALE : fitScale;

        state._displayScale = scale;

        state._displayScale = scale;

        if (bgToolsRow) {
            const hasSelectedImage = state.selectedImageIdx !== null && state.selectedImageIdx !== undefined;
            bgToolsRow.style.display = state.advancedMode ? 'flex' : 'none';

            if (btnRemoveBg) {
                btnRemoveBg.disabled = !hasSelectedImage;
                btnRemoveBg.style.opacity = hasSelectedImage ? '1' : '0.5';
                btnRemoveBg.style.cursor = hasSelectedImage ? 'pointer' : 'not-allowed';
            }

            if (btnLassoKeep) {
                btnLassoKeep.disabled = !hasSelectedImage;
                btnLassoKeep.style.opacity = hasSelectedImage ? '1' : '0.5';
                btnLassoKeep.style.cursor = hasSelectedImage ? 'pointer' : 'not-allowed';
                
                if (state.lassoMode) {
                    btnLassoKeep.classList.add('meme-crop-cancel'); 
                    btnLassoKeep.textContent = "✖ Cancel Lasso";
                } else {
                    btnLassoKeep.classList.remove('meme-crop-cancel');
                    btnLassoKeep.textContent = "➰ Lasso";
                }
            }
        }

        const mainBox = document.querySelector('.mc-box');
        if (mainBox) {
            mainBox.classList.toggle('mc-active-tool', !!(state.cropMode || state.cutMode || state.lassoMode));
            mainBox.classList.toggle('mc-crop-mode', !!state.cropMode);
            mainBox.classList.toggle('mc-cut-mode', !!state.cutMode);
            mainBox.classList.toggle('mc-lasso-mode', !!state.lassoMode);
        }

updateCropUi();

updateCropUi();

if (
    state.whiteSpaceLines &&
    info.wsPos === "right" &&
    state.layout === "vertical" &&
    imgs.length > 1 &&
    info.gapPx > 0
) {
    const imgBlockW = info.outW - info.gapPx;
    const targetScreenPx = 2;
    const safeScale = Math.max(0.01, scale || 1);
    const lw = Math.max(1, Math.round(targetScreenPx / safeScale));

    ctx.save();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = lw;
    ctx.lineCap = "butt";
    ctx.beginPath();

    for (let i = 0; i < info.rects.length - 1; i++) {
        const r = info.rects[i];
        if (!r) continue;
        const y = Math.round(r.y + r.h) + (lw % 2 ? 0.5 : 0);

        ctx.moveTo(imgBlockW, y);
        ctx.lineTo(info.outW, y);
    }

    ctx.stroke();
    ctx.restore();
}


        const dispW = Math.max(1, Math.round(canvas.width * scale));
        const dispH = Math.max(1, Math.round(canvas.height * scale));
        state._displayW = dispW;
        state._displayH = dispH;
        canvas.style.width = dispW + "px";
        canvas.style.height = dispH + "px";

        if (viewportEl) {
            if (state.zoomMode) {
                viewportEl.classList.add("is-zoomed");
                viewportEl.style.width = Math.min(maxW, dispW) + "px";
                viewportEl.style.height = Math.min(maxH, dispH) + "px";
            } else {
                viewportEl.classList.remove("is-zoomed");
                viewportEl.style.width = dispW + "px";
                viewportEl.style.height = dispH + "px";
            }
        }

        if (wrap) {
            wrap.style.width = dispW + "px";
            wrap.style.height = dispH + "px";
        }

        const btnGrp = overlay.querySelector(".meme-group-btn");
        if (btnGrp) {
            let actGrp = null;
            let actItem = null;
            if (state.selectedTextId) actItem = state.texts.find(t => t.id === state.selectedTextId);
            else if (state.selectedShapeId) actItem = state.shapes.find(s => s.id === state.selectedShapeId);
            else if (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined) actItem = state.images[state.selectedImageIdx];
            if (actItem && actItem.groupId) actGrp = actItem.groupId;

            if (actGrp) {
                btnGrp.style.opacity = "1";
                btnGrp.style.pointerEvents = "auto";
                btnGrp.style.cursor = "pointer";
                btnGrp.textContent = "Unlink";
                btnGrp.style.backgroundColor = "#fce4ec";
                btnGrp.style.color = "#c2185b";
                btnGrp.style.borderColor = "#c2185b";
            } else if (state.multiSelected && state.multiSelected.length > 1) {
                btnGrp.style.opacity = "1";
                btnGrp.style.pointerEvents = "auto";
                btnGrp.style.cursor = "pointer";
                btnGrp.textContent = "Link";
                btnGrp.style.backgroundColor = "#e3f2fd";
                btnGrp.style.color = "#1976d2";
                btnGrp.style.borderColor = "#1976d2";
          } else {
                btnGrp.style.opacity = "0.5";
                btnGrp.style.pointerEvents = "auto";
                btnGrp.style.cursor = "default";
                btnGrp.textContent = "Link";
                btnGrp.style.backgroundColor = "#e3f2fd";
                btnGrp.style.color = "#1976d2";
                btnGrp.style.borderColor = "#1976d2";
            }
        }

        const btnMold = overlay.querySelector(".meme-mold-btn");
        if (btnMold) {
            if (state.multiSelected && state.multiSelected.length > 1) {
                btnMold.style.opacity = "1";
                btnMold.style.pointerEvents = "auto";
                btnMold.style.cursor = "pointer";
            } else {
                btnMold.style.opacity = "0.5";
                btnMold.style.pointerEvents = "auto";
                btnMold.style.cursor = "default";
            }
        }

updateDragHandle();
    if (!state.draggingTextId && !skipSync) syncTextLayer();
}


    function updateDragHandle() {
        const wrap = overlay.querySelector(".meme-creator-canvas-wrap");
        let handle = wrap.querySelector(".meme-ws-handle");

        if (state.whiteSpacePos === 'none') {
            if (handle) handle.remove();
            return;
        }

        if (!handle) {
            handle = document.createElement("div");
            handle.className = "meme-ws-handle";
            wrap.appendChild(handle);
            
            handle.addEventListener("mousedown", (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const startY = e.clientY;
                const startX = e.clientX;
                const startSize = state.whiteSpaceSize;
                const oldInfo = state._layoutInfo;
                const oldW = oldInfo.outW;
                const oldH = oldInfo.outH;
                const oldGap = oldInfo.gapPx;
                
                const textSnapshots = state.texts.map(t => ({
                    id: t.id,
                    pxX: t.x * oldW,
                    pxY: t.y * oldH,
                    pxW: t.w * oldW,
                    pxH: t.h * oldH
                }));
                
                function onMove(me) {
                    const info = state._layoutInfo;
                    const scale = state._displayScale || 1;
                    
                    if (state.whiteSpacePos === 'top') {
                        const dy = (me.clientY - startY) / scale;
                        const baseH = (info.outH - (state.layout === 'vertical' ? info.gapPx * state.images.length : info.gapPx));
                        const change = dy / baseH; 
                        state.whiteSpaceSize = Math.max(0.05, startSize + change);
                    } else {
                        const dx = (me.clientX - startX) / scale;
                        const baseW = (info.outW - info.gapPx);
                        const change = dx / baseW;
                        // Invert direction: dragging right (positive dx) shrinks size
                        state.whiteSpaceSize = Math.max(0.05, startSize - change);
                    }

                    const imgs = state.images.map(o => o.img);
                    const newLayout = computeComposite(imgs, state.layout, state.whiteSpacePos, state.whiteSpaceSize, state.whiteSpaceTopScope);

                    textSnapshots.forEach(snap => {
                        const t = state.texts.find(x => x.id === snap.id);
                        if (!t) return;
                        
                        let newPxX = snap.pxX;
                        let newPxY = snap.pxY;

                        if (state.whiteSpacePos === 'top') {
                            const gapDiff = newLayout.gapPx - oldGap;
                            newPxY += gapDiff;
                        }
                        
                        t.x = newPxX / newLayout.outW;
                        t.y = newPxY / newLayout.outH;
                        t.w = snap.pxW / newLayout.outW;
                        t.h = snap.pxH / newLayout.outH;
                    });

                    drawPreview();
                }
                
                function onUp() {
                    window.removeEventListener("mousemove", onMove);
                    window.removeEventListener("mouseup", onUp);
                }
                window.addEventListener("mousemove", onMove);
                window.addEventListener("mouseup", onUp);
            });
        }
        
        const info = state._layoutInfo;
        const s = state._displayScale || 1;
        
        handle.className = "meme-ws-handle " + state.whiteSpacePos;
        const handleLen = 40;

        if (state.whiteSpacePos === 'top') {
            const yPos = Math.round(info.gapPx * s);
            const dispW = Math.max(1, Math.round(info.outW * s));
            const handleW = Math.min(handleLen, Math.max(20, dispW - 20));

            handle.style.top = (yPos - 6) + "px"; // Centered on line
            handle.style.width = handleW + "px";
            handle.style.height = "12px";
            handle.style.left = Math.round((dispW - handleW) / 2) + "px";
            handle.style.right = "auto";
            handle.style.bottom = "auto";
            handle.title = "Drag to expand/shrink whitespace";

        } else {
            const xPos = Math.round((info.outW - info.gapPx) * s);
            const dispH = Math.max(1, Math.round(info.outH * s));
            const handleH = Math.min(handleLen, Math.max(20, dispH - 20));

            handle.style.left = (xPos - 6) + "px";
            handle.style.height = handleH + "px";
            handle.style.width = "12px";
            handle.style.top = Math.round((dispH - handleH) / 2) + "px";
            handle.style.bottom = "auto";
            handle.style.right = "auto";
            handle.title = "Drag to widen/narrow whitespace";
        }
    }


       function pxFromNormX(nx) {
    const info = state._layoutInfo;
    if (!info) return 0;

    const s = state._displayScale || 1;
    const dispW = state._displayW || Math.round(info.outW * s);

    return nx * dispW;
}

function pxFromNormY(ny) {
    const info = state._layoutInfo;
    if (!info) return 0;

    const s = state._displayScale || 1;
    const dispH = state._displayH || Math.round(info.outH * s);

    return ny * dispH;
}

function normFromPxX(px) {
    const info = state._layoutInfo;
    if (!info) return 0;

    const s = state._displayScale || 1;
    const dispW = state._displayW || Math.round(info.outW * s);

    return clamp(px / Math.max(1, dispW), -3.0, 4.0);
}

function normFromPxY(px) {
    const info = state._layoutInfo;
    if (!info) return 0;

    const s = state._displayScale || 1;
    const dispH = state._displayH || Math.round(info.outH * s);

    return clamp(px / Math.max(1, dispH), -3.0, 4.0);
}



function applyAutoFontSize(t, editor) {
    if (!editor) return;

    const minPx = 10;
    const maxPx = 1400;
    editor.style.whiteSpace = 'pre-wrap';
    editor.style.overflowWrap = 'break-word';
    editor.style.wordBreak = 'break-word';

    const boxH = Math.max(20, editor.clientHeight);

    let fs = Math.min(maxPx, boxH);
    editor.style.fontSize = fs + "px";

    while (fs > minPx && editor.scrollHeight > editor.clientHeight) {
        fs -= 2; 
        editor.style.fontSize = fs + "px";
    }

    const info = state._layoutInfo;
            if (info) {
                const dispH = state._displayH || Math.round(info.outH * (state._displayScale || 1));
                const outPerDispY = info.outH / Math.max(1, dispH);
                t.fontSize = Math.round(fs * outPerDispY);
            } else {
                t.fontSize = fs;
            }

            const fontInput = document.querySelector(".meme-creator-fontsize");
            if (fontInput && state.selectedTextId === t.id) {
                fontInput.value = t.fontSize;
            }
        }



    function positionTextEl(el, t, recalcSize = false) {
        const info = state._layoutInfo;
        if (!info) return;

        const x = pxFromNormX(t.x);
        const y = pxFromNormY(t.y);
        const w = Math.max(40, pxFromNormX(t.w));
        const h = Math.max(30, pxFromNormY(t.h));

        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.width = w + "px";
        el.style.height = h + "px";
        const rot = t.rotation || 0;
        el.style.transform = `rotate(${rot}deg)`;
        const baseZ = (t.zIndex !== undefined && t.zIndex !== null) ? t.zIndex : 0;
        el.style.zIndex = (state.selectedTextId === t.id || state.draggingTextId === t.id) ? String(baseZ + 10000) : String(baseZ);
        
        const isMulti = (state.multiSelected && state.multiSelected.length > 0) || t.groupId;
        el.classList.toggle('is-multi', !!isMulti);

        el.style.pointerEvents = (state.cropMode || state.cutMode || state.lassoMode) ? "none" : "auto";
        
        el.classList.toggle('is-locked', !!t.locked);

        const delHandle = el.querySelector('.meme-delete-handle');
        if (delHandle) {
            delHandle.style.left = "-15px"; 
            delHandle.style.right = "auto";
            delHandle.style.transform = "none";
            delHandle.style.top = "-15px"; 
        }

        const editor = el.querySelector(".meme-text-editor");
        if (editor) {
            editor.style.whiteSpace = "pre-wrap";
            editor.style.wordBreak = "break-word";
            editor.contentEditable = t.locked ? "false" : "true";

            const baseOpacity = (t.opacity !== undefined) ? t.opacity : 1;
            const isActiveText = (state.selectedTextId === t.id) || (state.draggingTextId === t.id);
            let finalOpacity = t.hidden ? 0.3 : baseOpacity;
            if (state.cutMode || state.lassoMode || state.cropMode) finalOpacity *= 0.2;
            editor.style.opacity = finalOpacity;

            const scaleX = t.flip ? -1 : 1;
            editor.style.transform = `scaleX(${scaleX})`;

            if (recalcSize) applyAutoFontSize(t, editor);
            
const info = state._layoutInfo;
const dispH = state._displayH || Math.round(info.outH * (state._displayScale || 1));
const outPerDispY = info.outH / Math.max(1, dispH);

const rawFontSize = t.fontSize || state.baseFontSize;
const size = Math.max(10, rawFontSize / outPerDispY);

editor.style.fontSize = size + "px";

            const fStyle = t.fontStyle || state.baseFontStyle || "normal";
            editor.style.fontFamily = (t.fontFamily || state.baseFontFamily) + ", Impact, Arial Black, sans-serif";
            editor.style.fontWeight = fStyle === "bold" ? "bold" : (t.fontWeight || state.baseFontWeight || "900");
            editor.style.fontStyle = fStyle === "italic" ? "italic" : "normal";
            const normalizeTextColor = (v) => {
                const s = String(v || "").trim().toLowerCase();
                if (s === "white") return "#ffffff";
                if (s === "black") return "#000000";
                if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;
                return "#ffffff";
            };

            const contrastTextColor = (hex) => {
                const h = normalizeTextColor(hex).replace("#", "");
                const full = h.length === 3 ? (h[0] + h[0] + h[1] + h[1] + h[2] + h[2]) : h;
                const r = parseInt(full.slice(0, 2), 16) || 0;
                const g = parseInt(full.slice(2, 4), 16) || 0;
                const b = parseInt(full.slice(4, 6), 16) || 0;
                const luma = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
                return luma < 128 ? "#ffffff" : "#000000";
            };

            const color = normalizeTextColor(t.color || state.baseColor);

            editor.style.caretColor = color;
            editor.style.color = "transparent";
            editor.style.textShadow = "none";
        }
    }

 function makeTextEl(t) {
        const el = document.createElement("div");
        el.className = "meme-text-item";
        el.dataset.id = t.id;

       el.innerHTML = `
            <div class="meme-rotate-handle" title="Rotate">⟳</div>
            <div class="meme-move-handle" title="Move">⠿</div>
            <div class="meme-move-handle right" title="Move">⠿</div>
            <div class="meme-delete-handle" title="Delete">×</div>
                <div class="meme-text-editor" contenteditable="true" spellcheck="false"></div>
                <div class="meme-resize-handle" title="Resize"></div>
                <div class="meme-resize-handle left" title="Resize"></div>
                <div class="meme-resize-handle top-right" title="Resize"></div>
                <div class="meme-resize-handle top-left" title="Resize"></div>
            `;

        const rotate = el.querySelector(".meme-rotate-handle");
        const editor = el.querySelector(".meme-text-editor");
        const move = el.querySelector(".meme-move-handle:not(.right)");
        const moveRight = el.querySelector(".meme-move-handle.right");
        const resize = el.querySelector(".meme-resize-handle:not(.left):not(.top-right):not(.top-left)");
        const resizeLeft = el.querySelector(".meme-resize-handle.left");
        const resizeTopRight = el.querySelector(".meme-resize-handle.top-right");
        const resizeTopLeft = el.querySelector(".meme-resize-handle.top-left");
        const del = el.querySelector(".meme-delete-handle");

        if (del) {
            del.addEventListener("mousedown", (e) => {
                e.stopPropagation(); // Prevent selection
                e.preventDefault();
                state.texts = state.texts.filter(x => x.id !== t.id);
                if (state.selectedTextId === t.id) state.selectedTextId = null;
                syncTextLayer();
                drawPreview();
            });
        }

                function hasHigherNonTextHit(e) {
            if (state.selectedTextId === t.id) return false; // Prioritize selected text
            const info = state._layoutInfo;
            const rect = layer.getBoundingClientRect();
            if (!info || !rect.width || !rect.height) return false;

            const mouseX = ((e.clientX - rect.left) / rect.width) * info.outW;
            const mouseY = ((e.clientY - rect.top) / rect.height) * info.outH;

            if (state.stageCropMode && state.stageCropRect && state.stageCropRect.w > 0) {
                const r = state.stageCropRect;
                const rx = r.x * info.outW;
                const ry = r.y * info.outH;
                const rw = r.w * info.outW;
                const rh = r.h * info.outH;
                const tol = 10;
                const hitW = 30;

                if (Math.abs(mouseY - ry) < tol && Math.abs(mouseX - (rx + rw / 2)) < hitW) return true;
                if (Math.abs(mouseY - (ry + rh)) < tol && Math.abs(mouseX - (rx + rw / 2)) < hitW) return true;
                if (Math.abs(mouseX - rx) < tol && Math.abs(mouseY - (ry + rh / 2)) < hitW) return true;
                if (Math.abs(mouseX - (rx + rw)) < tol && Math.abs(mouseY - (ry + rh / 2)) < hitW) return true;
            }

            const textZ = t.zIndex || 0;

            for (let i = 0; i < state.images.length; i++) {
                const img = state.images[i];
                if (!img || img.w === undefined) continue;
                if ((img.zIndex || 0) <= textZ) continue;

                if (
                    mouseX >= img.x && mouseX <= img.x + img.w &&
                    mouseY >= img.y && mouseY <= img.y + img.h
                ) {
                    return true;
                }
            }

            if (state.shapes) {
                for (const s of state.shapes) {
                    if (!s) continue;
                    if ((s.zIndex || 0) <= textZ) continue;

                    const sx = s.x * info.outW;
                    const sy = s.y * info.outH;
                    const sw = s.w * info.outW;
                    const sh = s.h * info.outH;

                    if (
                        mouseX >= sx && mouseX <= sx + sw &&
                        mouseY >= sy && mouseY <= sy + sh
                    ) {
                        return true;
                    }
                }
            }

            return false;
        }

        if (editor) {
            editor.textContent = t.text || "";
            editor.addEventListener("input", () => {
                t.text = editor.textContent || "";

                editor.style.height = "auto";
                const neededH = editor.scrollHeight;
                editor.style.height = "100%";

                t.h = clamp(normFromPxY(neededH), 0.03, 1);
                positionTextEl(el, t, false);

                drawPreview(true); 
            });

            editor.addEventListener("mousedown", (e) => {
                if (hasHigherNonTextHit(e)) return;

                if (state.multiSelectMode || e.shiftKey) {
                    e.preventDefault();
                    if (editor) editor.blur();
                    return;
                }

                e.stopPropagation();

                if (state.selectedTextId === t.id && state.frameVisible) {
                    return;
                }

                e.preventDefault();
                if (editor) editor.blur();
                startDrag("move", e, true);
            });
        }

        function startDrag(kind, startEvent, delayedSelect = false) {
            if (!startEvent.target.classList.contains('meme-text-editor')) {
                startEvent.preventDefault();
            }
                        startEvent.stopPropagation();
            state.draggingTextId = t.id;

            if (!delayedSelect) setSelected(t.id);

            const info = state._layoutInfo;
            if (!info) return;

            let hasMoved = false;
            const startX = startEvent.clientX;
            const startY = startEvent.clientY;

           const startNormX = t.x;
            const startNormY = t.y;
           const startNormW = t.w;
            const startNormH = t.h;

            let multiSnap = [];
            if (state.multiSelected && state.multiSelected.find(m => m.data === t)) {
                multiSnap = state.multiSelected.map(m => ({ item: m.data, type: m.type, w: m.data.w, h: m.data.h, x: m.data.x, y: m.data.y, fontSize: m.data.fontSize }));
            } else if (t.groupId) {
                state.images.forEach(i => { if (i.groupId === t.groupId) multiSnap.push({ item: i, type: 'image', w: i.w, h: i.h, x: i.x, y: i.y }); });
                (state.shapes || []).forEach(s => { if (s.groupId === t.groupId) multiSnap.push({ item: s, type: 'shape', w: s.w, h: s.h, x: s.x, y: s.y }); });
                state.texts.forEach(tx => { if (tx.groupId === t.groupId) multiSnap.push({ item: tx, type: 'text', w: tx.w, h: tx.h, x: tx.x, y: tx.y, fontSize: tx.fontSize }); });
            }

            function onMove(e) {
                if (t.locked) return;
                if (t.posLocked && kind === "move") return;
                const rect = layer.getBoundingClientRect();
                if (!rect.width || !rect.height) return;

                const ndx = (e.clientX - startX) / rect.width;
                const ndy = (e.clientY - startY) / rect.height;

                if (Math.abs(e.clientX - startX) > 2 || Math.abs(e.clientY - startY) > 2) hasMoved = true;

               if (kind === "move") {
                    t.x = startNormX + ndx;
                    t.y = startNormY + ndy;

                    window._checkSnapToCenter(t, 'text', info);
                    state._showSnapLines = true;
                    positionTextEl(el, t, false); // Move: Keep size
                } else if (kind === "resize-left") {
                    t.w = clamp(startNormW - ndx, 0.05, 3);
                    t.h = clamp(startNormH + ndy, 0.03, 3);
                    t.x = startNormX + startNormW - t.w;
                    positionTextEl(el, t, true);
                } else if (kind === "resize-top-right") {
                    t.w = clamp(startNormW + ndx, 0.05, 3);
                    t.h = clamp(startNormH - ndy, 0.03, 3);
                    t.y = startNormY + startNormH - t.h;
                    positionTextEl(el, t, true);
                } else if (kind === "resize-top-left") {
                    t.w = clamp(startNormW - ndx, 0.05, 3);
                    t.h = clamp(startNormH - ndy, 0.03, 3);
                    t.x = startNormX + startNormW - t.w;
                    t.y = startNormY + startNormH - t.h;
                    positionTextEl(el, t, true);
                } else {
                    t.w = clamp(startNormW + ndx, 0.05, 3);
                    t.h = clamp(startNormH + ndy, 0.03, 3);
                    positionTextEl(el, t, true);
                }

                if (multiSnap.length > 1) {
                    const dxPos = t.x - startNormX;
                    const dyPos = t.y - startNormY;
                    const scaleW = startNormW ? (t.w / startNormW) : 1;
                    const scaleH = startNormH ? (t.h / startNormH) : 1;
                    
                    multiSnap.forEach(snap => {
                        if (snap.item !== t && !snap.item.locked && !snap.item.posLocked) {
                            if (kind !== "move") {
                                snap.item.w = snap.w * scaleW;
                                snap.item.h = snap.h * scaleH;
                                if (snap.type === 'text' && snap.fontSize) snap.item.fontSize = snap.fontSize * Math.min(scaleW, scaleH);
                            }
                            if (snap.type === 'image' && info) {
                                snap.item.x = snap.x + (dxPos * info.outW);
                                snap.item.y = snap.y + (dyPos * info.outH);
                            } else {
                                snap.item.x = snap.x + dxPos;
                                snap.item.y = snap.y + dyPos;
                            }
                        }
                    });
                }

                queuedDrawPreview();
            }

            function onUp(me) {
            state._showSnapLines = false;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            state.draggingTextId = null;
            drawPreview();
            if (delayedSelect) {
                setSelected(t.id, !hasMoved);
            }
            if (me && !hasMoved && Math.abs(me.clientX - startX) < 3 && Math.abs(me.clientY - startY) < 3) {
                const rect = layer.getBoundingClientRect();
                const info = state._layoutInfo;
                if (info && rect.width && rect.height) {
                    const mouseX = ((me.clientX - rect.left) / rect.width) * info.outW;
                    const mouseY = ((me.clientY - rect.top) / rect.height) * info.outH;
                    const hitList = [];
                    state.images.forEach((img, idx) => { if (img.w !== undefined) hitList.push({ type: 'image', data: img, index: idx, z: img.zIndex || 0 }); });
                    if (state.shapes) state.shapes.forEach((s) => hitList.push({ type: 'shape', data: s, z: s.zIndex || 0 }));
                    state.texts.forEach((tx) => hitList.push({ type: 'text', data: tx, z: tx.zIndex || 0 }));
                    hitList.sort((a, b) => b.z - a.z);

                    const actualHits = [];
                    for (let item of hitList) {
                        if (item.type === 'image') {
                            const img = item.data;
                            if (mouseX >= img.x && mouseX <= img.x + img.w && mouseY >= img.y && mouseY <= img.y + img.h) actualHits.push(item);
                        } else if (item.type === 'shape') {
                            const s = item.data;
                            const sx = s.x * info.outW, sy = s.y * info.outH;
                            const sw = s.w * info.outW, sh = s.h * info.outH;
                            if (mouseX >= sx && mouseX <= sx + sw && mouseY >= sy && mouseY <= sy + sh) actualHits.push(item);
                        } else if (item.type === 'text') {
                            const tx = item.data;
                            const txX = tx.x * info.outW, ty = tx.y * info.outH;
                            const tw = tx.w * info.outW, th = tx.h * info.outH;
                            if (mouseX >= txX && mouseX <= txX + tw && mouseY >= ty && mouseY <= ty + th) actualHits.push(item);
                        }
                    }
                    if (actualHits.length > 0 && actualHits[0].data !== t && !state.multiSelectMode && !startEvent.shiftKey) {
                        const topHit = actualHits[0];
                        if (topHit.type === 'image') {
                            state.selectedImageIdx = topHit.index; state.selectedShapeId = null; state.selectedTextId = null; setSelected(null, false);
                        } else if (topHit.type === 'shape') {
                            state.selectedShapeId = topHit.data.id; state.selectedImageIdx = null; state.selectedTextId = null; setSelected(null, false);
                        } else if (topHit.type === 'text') {
                            state.selectedTextId = topHit.data.id; state.selectedImageIdx = null; state.selectedShapeId = null; setSelected(topHit.data.id, true);
                        }
                        drawPreview(); syncTextLayer();
                    }
                }
            }
        }

            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        }

        if (move) move.addEventListener("mousedown", (e) => startDrag("move", e));
        if (moveRight) moveRight.addEventListener("mousedown", (e) => startDrag("move", e));
        if (resize) resize.addEventListener("mousedown", (e) => startDrag("resize", e));
        if (resizeLeft) resizeLeft.addEventListener("mousedown", (e) => startDrag("resize-left", e));
        if (resizeTopRight) resizeTopRight.addEventListener("mousedown", (e) => startDrag("resize-top-right", e));
        if (resizeTopLeft) resizeTopLeft.addEventListener("mousedown", (e) => startDrag("resize-top-left", e));

        if (rotate) {
            rotate.addEventListener("mousedown", (e) => {
                e.stopPropagation(); e.preventDefault();
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const startRot = t.rotation || 0;
                const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);

               let multiSnap = [];
                if (state.multiSelected && state.multiSelected.find(m => m.data === t)) {
                    multiSnap = state.multiSelected.map(m => ({ item: m.data, rot: m.data.rotation || 0 }));
                } else if (t.groupId) {
                    state.images.forEach(i => { if (i.groupId === t.groupId) multiSnap.push({ item: i, rot: i.rotation || 0 }); });
                    (state.shapes || []).forEach(s => { if (s.groupId === t.groupId) multiSnap.push({ item: s, rot: s.rotation || 0 }); });
                    state.texts.forEach(tx => { if (tx.groupId === t.groupId) multiSnap.push({ item: tx, rot: tx.rotation || 0 }); });
                }

                const onRotate = (me) => {
                    if (t.locked) return;
                    const curAngle = Math.atan2(me.clientY - cy, me.clientX - cx);
                    const degDiff = (curAngle - startAngle) * (180 / Math.PI);
                    t.rotation = startRot + degDiff;

                    if (multiSnap.length > 1) {
                        multiSnap.forEach(snap => {
                            if (snap.item !== t && !snap.item.locked) snap.item.rotation = snap.rot + degDiff;
                        });
                    }

                    positionTextEl(el, t, false);
                    queuedDrawPreview(true);
                };
                const onEnd = () => {
                    window.removeEventListener("mousemove", onRotate);
                    window.removeEventListener("mouseup", onEnd);
                };
                window.addEventListener("mousemove", onRotate);
                window.addEventListener("mouseup", onEnd);
            });
        }

                el.addEventListener("mousedown", (e) => {
            if (hasHigherNonTextHit(e)) return;

            e.stopPropagation();
            let isMultiDeselect = false;
            let startClientX = e.clientX;
            let startClientY = e.clientY;

            if (state.multiSelectMode || e.shiftKey) {
                if (!state.multiSelected) state.multiSelected = [];
                const idx = state.multiSelected.findIndex(x => x.data === t);
                if (idx >= 0) {
                    if (state.selectedTextId === t.id) {
                        isMultiDeselect = true;
                    }
                } else {
                    state.multiSelected.push({type: 'text', data: t});
                }
            } else {
                if (state.multiSelected && state.multiSelected.length > 1 && state.multiSelected.find(x => x.data === t)) {
                } else {
                    state.multiSelected = [];
                }
            }

            if (isMultiDeselect) {
                const deselectUp = (me) => {
                    window.removeEventListener("mouseup", deselectUp);
                    if (Math.abs(me.clientX - startClientX) < 3 && Math.abs(me.clientY - startClientY) < 3) {
                        const idx = state.multiSelected.findIndex(x => x.data === t);
                        if (idx >= 0) {
                            state.multiSelected.splice(idx, 1);
                            if (state.selectedTextId === t.id) state.selectedTextId = null;
                            drawPreview();
                            syncTextLayer();
                        }
                    }
                };
                window.addEventListener("mouseup", deselectUp);
            }
            
            if (state.selectedTextId !== t.id || state.multiSelectMode || e.shiftKey) {
                startDrag("move", e, true);
            }
        });

        return el;
    }

        function syncLayerPanel() {
            if (!layerPanel || layerPanel.style.display === "none") return;
            const layerList = layerPanel.querySelector(".mc-layer-list");
            if (!layerList) return;

            const allLayers = [];
            state.images.forEach((img, idx) => allLayers.push({ type: 'image', data: img, idx, z: img.zIndex || 0 }));
            if (state.shapes) state.shapes.forEach((s) => allLayers.push({ type: 'shape', data: s, z: s.zIndex || 0 }));
            state.texts.forEach((t) => allLayers.push({ type: 'text', data: t, z: t.zIndex || 0 }));

            allLayers.sort((a, b) => b.z - a.z);

            const shapeIcons = {
                square: '■', rect: '▬', circle: '●', line: '━', triangle: '▲',
                octagon: '⬟', star: '★', heart: '❤', arrow: '➔',
                bubble_oval: '💬', bubble_cloud: '💭', bubble_square: '🗨️'
            };
            const shapeNames = {
                square: 'Square', rect: 'Rectangle', circle: 'Circle', line: 'Line', triangle: 'Triangle',
                octagon: 'Octagon', star: 'Star', heart: 'Heart', arrow: 'Arrow',
                bubble_oval: 'Thought Oval', bubble_cloud: 'Thought Cloud', bubble_square: 'Speech Box',
                '3d_square': '3D Box', '3d_circle': '3D Wheel', '3d_cylinder': '3D Cylinder', 
                '3d_triangle': '3D Pyramid', '3d_star': '3D Star', '3d_heart': '3D Heart', '3d_arrow': '3D Arrow'
            };

            layerList.innerHTML = "";
            allLayers.forEach(item => {
                const el = document.createElement("div");
                el.className = "mc-layer-item";
                
                let isSelected = false;
                let label = "";
                let icon = "";

                if (item.type === 'text') {
                    isSelected = state.selectedTextId === item.data.id;
                    label = item.data.customName || (item.data.text ? item.data.text.substring(0, 15) : "Text");
                    icon = "T";
                } else if (item.type === 'shape') {
                    isSelected = state.selectedShapeId === item.data.id;
                    if (item.data.type === 'emoji') {
                        label = item.data.customName || item.data.text;
                        icon = item.data.text;
                    } else {
                        label = item.data.customName || shapeNames[item.data.type] || "Shape";
                        icon = shapeIcons[item.data.type] || (item.data.type && item.data.type.startsWith('3d_') ? '🧊' : '⭐');
                    }
                } else {
                    isSelected = state.selectedImageIdx === item.idx;
                    label = item.data.customName || "Image";
                    icon = "🖼️";
                }
                
                if (state.multiSelected && state.multiSelected.find(m => m.data === item.data)) isSelected = true;
                if (isSelected) el.classList.add("active");

                const isHidden = !!item.data.hidden;
                const isLocked = !!item.data.locked;
                
                const renameBtn = `<button type="button" class="mc-layer-action-btn" title="Rename" data-action="rename">✏️</button>`;

                el.innerHTML = `
                    <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                        <span style="font-size:14px; opacity:0.7;">${icon}</span>
                        <span style="font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; ${isLocked ? 'font-style:italic; opacity:0.6;' : ''}">${__escapeHtml(label)}</span>
                    </div>
                    <div class="mc-layer-actions">
                        ${renameBtn}
                        <button type="button" class="mc-layer-action-btn ${isHidden ? 'is-active' : ''}" title="Toggle Visibility" data-action="toggle-vis">${isHidden ? '🙈' : '👁️'}</button>
                        <button type="button" class="mc-layer-action-btn ${isLocked ? 'is-active' : ''}" title="Toggle Lock" data-action="toggle-lock">${isLocked ? '🔒' : '🔓'}</button>
                    </div>
                `;

                el.onclick = (e) => {
                    e.preventDefault();
                    
                    const actionBtn = e.target.closest('.mc-layer-action-btn');
                    if (actionBtn) {
                        e.stopPropagation();
                        if (actionBtn.dataset.action === 'rename') {
                            const d = document.createElement('div');
                            d.className = 'custom-dialog-overlay open';
                            d.style.zIndex = '16000';
                            d.innerHTML = `
                                <div class="custom-dialog-box" style="max-width: 300px;">
                                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Rename Layer</h3>
                                    <input type="text" id="layerRenameInput" class="settings-input" style="width:100%; margin-bottom:15px;" value="${__escapeHtml(label)}" autocomplete="off">
                                    <div class="dialog-actions">
                                        <button type="button" class="btn-cancel" id="cancelLayerRename">Cancel</button>
                                        <button type="button" class="btn-cancel" id="confirmLayerRename">Save</button>
                                    </div>
                                </div>
                            `;
                            document.body.appendChild(d);
                            const inp = d.querySelector('#layerRenameInput');
                            setTimeout(() => { inp.focus(); inp.select(); }, 50);

                            d.querySelector('#cancelLayerRename').onclick = () => d.remove();
                            d.querySelector('#confirmLayerRename').onclick = () => {
                                item.data.customName = inp.value.trim() || undefined;
                                d.remove();
                                syncLayerPanel();
                            };
                            inp.addEventListener('keydown', (ev) => {
                                if (ev.key === 'Enter') { ev.preventDefault(); d.querySelector('#confirmLayerRename').click(); }
                            });
                        } else if (actionBtn.dataset.action === 'toggle-vis') {
                            item.data.hidden = !item.data.hidden;
                        } else if (actionBtn.dataset.action === 'toggle-lock') {
                            item.data.locked = !item.data.locked;
                            if (item.data.locked) item.data.posLocked = false;
                        }
                        drawPreview();
                        syncTextLayer();
                        return;
                    }

                    if (item.type === 'text') {
                        state.selectedTextId = item.data.id;
                        state.selectedShapeId = null;
                        state.selectedImageIdx = null;
                    } else if (item.type === 'shape') {
                        state.selectedShapeId = item.data.id;
                        state.selectedTextId = null;
                        state.selectedImageIdx = null;
                    } else {
                        state.selectedImageIdx = item.idx;
                    state.selectedTextId = null;
                    state.selectedShapeId = null;
                }
                state.multiSelected = [];
                drawPreview();
                syncTextLayer();
            };

            el.ondblclick = (e) => {
                e.preventDefault();
                const renameBtn = el.querySelector('[data-action="rename"]');
                if (renameBtn) renameBtn.click();
            };

            layerList.appendChild(el);
        });

            setTimeout(() => {
                const activeItem = layerList.querySelector(".mc-layer-item.active");
                if (activeItem) {
                    activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }, 10);
        }

        function syncTextLayer() {
        const info = state._layoutInfo;
        if (!info) return;

        const wrap = overlay.querySelector(".meme-creator-canvas-wrap");
        if (wrap) {
            wrap.style.position = "relative";
            wrap.style.display = "inline-block";
        }

        const dispW = state._displayW || Math.round(canvas.width * (state._displayScale || 1));
        const dispH = state._displayH || Math.round(canvas.height * (state._displayScale || 1));

        layer.style.position = "absolute";
        layer.style.left = "0";
        layer.style.top = "0";
        layer.style.width = dispW + "px";
        layer.style.height = dispH + "px";

        layer.innerHTML = "";

        const hasShapes = Array.isArray(state.shapes) && state.shapes.length > 0;
        const hasText = Array.isArray(state.texts) && state.texts.length > 0;

        if (state.images.length === 0 && !hasShapes && !hasText) {
            const emptyEl = document.createElement("div");
            emptyEl.className = "meme-empty-state-btn";
            emptyEl.style.cssText = "position:absolute; inset:20px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; color:#90949c; background:rgba(0,0,0,0.03); border: 3px dashed #ccd0d5; border-radius: 12px;";
            if (state.stageCropMode) emptyEl.style.pointerEvents = "none";
            emptyEl.innerHTML = `<div style="font-size:48px; margin-bottom:10px;">📷</div><div style="font-weight:700; font-size:16px; text-align: center;">Add Picture<br>(click or drag & drop)</div>`;
            emptyEl.onclick = (e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                if(btnAddPhoto) btnAddPhoto.click(); 
            };
            layer.appendChild(emptyEl);
        }

        const s = state._displayScale || 1;
        state.images.forEach((imgObj, idx) => {
            if (imgObj.locked) return;
            if (state.cropMode) return;
if (state.advancedMode) return; 

const r = info.rects[idx];
            if (!r) return;

            const btn = document.createElement("div");
            btn.className = "meme-delete-handle";
            btn.innerHTML = "×";
            btn.title = "Remove Image";

            btn.style.position = "absolute";
            btn.style.zIndex = "99999";
            btn.style.pointerEvents = "auto";

            const left = Math.round(r.x * s) - 8;
            const top = Math.round(r.y * s) - 8;

            btn.style.left = left + "px";
            btn.style.top = top + "px";



            btn.addEventListener("mousedown", (e) => {
                e.stopPropagation(); // Stop layer selection clearing
                e.preventDefault();
                
                state.images.splice(idx, 1);

                if (state.sourceFiles && state.sourceFiles.length > idx) {
                    state.sourceFiles.splice(idx, 1);
                }
                drawPreview();
            });
            layer.appendChild(btn);
        });

        if (state.advancedMode && state.selectedImageIdx !== null) {
            const img = state.images[state.selectedImageIdx];
            if (img && img.w !== undefined) {
                const s = state._displayScale || 1;
                const frame = document.createElement("div");
                frame.className = "meme-image-frame" + ((state.cropMode && state.cropDraft) ? " is-crop" : "");

let fx = img.x, fy = img.y, fw = img.w, fh = img.h;
if (state.cropMode && state.cropDraft) {
    fx = img.x + (img.w * state.cropDraft.x);
    fy = img.y + (img.h * state.cropDraft.y);
    fw = img.w * state.cropDraft.w;
    fh = img.h * state.cropDraft.h;
}

frame.style.left = (fx * s) + "px";
frame.style.top = (fy * s) + "px";
frame.style.width = (fw * s) + "px";
frame.style.height = (fh * s) + "px";

const rot = img.rotation || 0;
frame.style.transform = `rotate(${rot}deg)`;
frame.style.transformOrigin = "center center";

const isMulti = (state.multiSelected && state.multiSelected.length > 0) || img.groupId;
if (isMulti) frame.classList.add("is-multi");

frame.style.pointerEvents = "auto";
const baseImgZ = img.zIndex || 0;
frame.style.zIndex = (state.selectedImageIdx === state.images.indexOf(img)) ? String(baseImgZ + 10000) : String(baseImgZ);

const handles = (state.cropMode && state.cropDraft) ? ['nw', 'ne', 'se', 'sw', 'n', 'e', 's', 'w'] : ['nw', 'ne', 'se', 'sw'];
                handles.forEach(pos => {
                    const h = document.createElement("div");
                    h.className = "meme-resize-handle " + pos;
                    
                    h.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;

    if (state.cropMode && state.cropDraft) {
        const start = { ...state.cropDraft };
        const right = start.x + start.w;
        const bottom = start.y + start.h;
        const min = 0.05;

        const onCropMove = (me) => {
            const scale = state._displayScale || 1;
            const dx = (me.clientX - startX) / scale;
            const dy = (me.clientY - startY) / scale;

            const ndx = dx / Math.max(1, img.w);
            const ndy = dy / Math.max(1, img.h);

            let x = start.x, y = start.y, w = start.w, h = start.h;

            if (pos === "se") {
                w = start.w + ndx;
                h = start.h + ndy;
            } else if (pos === "sw") {
                x = Math.max(0, Math.min(right - min, start.x + ndx));
                w = right - x;
                h = start.h + ndy;
            } else if (pos === "ne") {
                y = Math.max(0, Math.min(bottom - min, start.y + ndy));
                h = bottom - y;
                w = start.w + ndx;
            } else if (pos === "nw") {
                x = Math.max(0, Math.min(right - min, start.x + ndx));
                y = Math.max(0, Math.min(bottom - min, start.y + ndy));
                w = right - x;
                h = bottom - y;
            } else if (pos === "n") {
                y = Math.max(0, Math.min(bottom - min, start.y + ndy));
                h = bottom - y;
            } else if (pos === "s") {
                h = start.h + ndy;
            } else if (pos === "e") {
                w = start.w + ndx;
            } else if (pos === "w") {
                x = Math.max(0, Math.min(right - min, start.x + ndx));
                w = right - x;
            }

            x = Math.max(0, Math.min(1 - min, x));
            y = Math.max(0, Math.min(1 - min, y));
            w = Math.max(min, Math.min(1 - x, w));
            h = Math.max(min, Math.min(1 - y, h));

            state.cropDraft = { x, y, w, h };
            drawPreview();
        };

        const onCropUp = () => {
            window.removeEventListener("mousemove", onCropMove);
            window.removeEventListener("mouseup", onCropUp);
        };

        window.addEventListener("mousemove", onCropMove);
        window.addEventListener("mouseup", onCropUp);
        return;
    }

    const startW = img.w;
    const startH = img.h;
    const startImgX = img.x;
    const startImgY = img.y;
    const ratio = startW / startH;

    let multiSnap = [];
    if (state.multiSelected && state.multiSelected.find(m => m.data === img)) {
        multiSnap = state.multiSelected.map(m => ({ item: m.data, type: m.type, w: m.data.w, h: m.data.h, x: m.data.x, y: m.data.y, fontSize: m.data.fontSize }));
    } else if (img.groupId) {
        state.images.forEach(i => { if (i.groupId === img.groupId) multiSnap.push({ item: i, type: 'image', w: i.w, h: i.h, x: i.x, y: i.y }); });
        (state.shapes || []).forEach(s => { if (s.groupId === img.groupId) multiSnap.push({ item: s, type: 'shape', w: s.w, h: s.h, x: s.x, y: s.y }); });
        state.texts.forEach(tx => { if (tx.groupId === img.groupId) multiSnap.push({ item: tx, type: 'text', w: tx.w, h: tx.h, x: tx.x, y: tx.y, fontSize: tx.fontSize }); });
    }

    const onResizeMove = (me) => {
        if (img.locked) return;
        const scale = state._displayScale || 1;
        const dx = (me.clientX - startX) / scale;

        let newW = startW;
        let newH = startH;

        if (pos === 'se') {
            newW = Math.max(20, startW + dx);
            newH = newW / ratio;
        } else if (pos === 'sw') {
            newW = Math.max(20, startW - dx);
            newH = newW / ratio;
            img.x = startImgX + (startW - newW);
        } else if (pos === 'ne') {
            newW = Math.max(20, startW + dx);
            newH = newW / ratio;
            img.y = startImgY + (startH - newH);
        } else if (pos === 'nw') {
            newW = Math.max(20, startW - dx);
            newH = newW / ratio;
            img.x = startImgX + (startW - newW);
            img.y = startImgY + (startH - newH);
        }

        img.w = newW;
        img.h = newH;

        if (multiSnap.length > 1) {
            const scaleW = newW / startW;
            const scaleH = newH / startH;
            const dxPos = img.x - startImgX;
            const dyPos = img.y - startImgY;
            const info = state._layoutInfo;
            multiSnap.forEach(snap => {
                if (snap.item !== img && !snap.item.locked && !snap.item.posLocked) {
                    snap.item.w = snap.w * scaleW;
                    snap.item.h = snap.h * scaleH;
                    if (snap.type === 'text' && snap.fontSize) snap.item.fontSize = snap.fontSize * Math.min(scaleW, scaleH);
                    if (snap.type === 'image') {
                        snap.item.x = snap.x + dxPos;
                        snap.item.y = snap.y + dyPos;
                    } else if (info) {
                        snap.item.x = snap.x + (dxPos / info.outW);
                        snap.item.y = snap.y + (dyPos / info.outH);
                    }
                }
            });
        }
        queuedDrawPreview();
    };

    const onResizeUp = () => {
        window.removeEventListener("mousemove", onResizeMove);
        window.removeEventListener("mouseup", onResizeUp);
    };

    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", onResizeUp);
});


                    frame.appendChild(h);
    });

    const btnDel = document.createElement("div");
    btnDel.className = "meme-delete-handle";
    btnDel.innerHTML = "×";
    btnDel.title = "Remove Image";

    btnDel.style.left = "-20px";
    btnDel.style.right = "auto";
    btnDel.style.transform = "none";
    btnDel.style.top = "-18px";

    btnDel.style.position = "absolute";
    btnDel.style.zIndex = "99999";
    btnDel.style.pointerEvents = "auto";

    const btnRot = document.createElement("div");
    btnRot.className = "meme-rotate-handle";
    btnRot.innerHTML = "⟳";
    btnRot.title = "Rotate";
    
    btnRot.style.transform = "translateX(-50%)";

    btnRot.addEventListener("mousedown", (e) => {
        e.stopPropagation(); e.preventDefault();
        // Use frame rect for center point
        const rect = frame.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const startRot = img.rotation || 0;
                    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);

                    let multiSnap = [];
                    if (state.multiSelected && state.multiSelected.find(m => m.data === img)) {
                        multiSnap = state.multiSelected.map(m => ({ item: m.data, rot: m.data.rotation || 0 }));
                    } else if (img.groupId) {
                        state.images.forEach(i => { if (i.groupId === img.groupId) multiSnap.push({ item: i, rot: i.rotation || 0 }); });
                        (state.shapes || []).forEach(s => { if (s.groupId === img.groupId) multiSnap.push({ item: s, rot: s.rotation || 0 }); });
                        state.texts.forEach(tx => { if (tx.groupId === img.groupId) multiSnap.push({ item: tx, rot: tx.rotation || 0 }); });
                    }

                    const onRotMove = (me) => {
            if (img.locked) return;
            const curAngle = Math.atan2(me.clientY - cy, me.clientX - cx);
            const degDiff = (curAngle - startAngle) * (180 / Math.PI);
            img.rotation = startRot + degDiff;

            if (multiSnap.length > 1) {
                multiSnap.forEach(snap => {
                    if (snap.item !== img && !snap.item.locked) {
                        snap.item.rotation = snap.rot + degDiff;
                    }
                });
            }
            drawPreview(); // Refresh canvas & frame
        };
        const onRotUp = () => {
            window.removeEventListener("mousemove", onRotMove);
            window.removeEventListener("mouseup", onRotUp);
        };
        window.addEventListener("mousemove", onRotMove);
        window.addEventListener("mouseup", onRotUp);
    });
    frame.appendChild(btnRot);

    
    btnDel.addEventListener("mousedown", (e) => {
        e.stopPropagation(); 
        e.preventDefault();
        
        state.images.splice(state.selectedImageIdx, 1);
        if (state.sourceFiles && state.sourceFiles.length > state.selectedImageIdx) {
            state.sourceFiles.splice(state.selectedImageIdx, 1);
        }
        state.selectedImageIdx = null;
        drawPreview();
    });
    frame.appendChild(btnDel);

    layer.appendChild(frame);
}
        }

        if (state.selectedShapeId) {
            const sShape = state.shapes.find(x => x.id === state.selectedShapeId);
            if (sShape) {
                const s = state._displayScale || 1;
                const frame = document.createElement("div");
                frame.className = "meme-image-frame"; 
                frame.style.left = (sShape.x * info.outW * s - 10) + "px";
                frame.style.top = (sShape.y * info.outH * s - 10) + "px";
                frame.style.width = (sShape.w * info.outW * s + 20) + "px";
                frame.style.height = (sShape.h * info.outH * s + 20) + "px";

const rot = sShape.rotation || 0;
frame.style.transform = `rotate(${rot}deg)`;
frame.style.transformOrigin = "center center";
const baseShapeZ = sShape.zIndex || 0;
frame.style.zIndex = (state.selectedShapeId === sShape.id) ? String(baseShapeZ + 10000) : String(baseShapeZ);

const isMulti = (state.multiSelected && state.multiSelected.length > 0) || sShape.groupId;
if (isMulti) frame.classList.add("is-multi");
if (isMulti) frame.classList.add("is-multi");

               const mover = document.createElement("div");
                mover.style.cssText = "position:absolute; inset:0; cursor:move; pointer-events:auto; z-index:45;";
                mover.addEventListener("mousedown", (e) => {
                    if (state.stageCropMode && state.stageCropRect && state.stageCropRect.w > 0) {
                        const rect = layer.getBoundingClientRect();
                        const info = state._layoutInfo;
                        if (info && rect.width && rect.height) {
                            const mouseX = ((e.clientX - rect.left) / rect.width) * info.outW;
                            const mouseY = ((e.clientY - rect.top) / rect.height) * info.outH;
                            const r = state.stageCropRect;
                            const rx = r.x * info.outW;
                            const ry = r.y * info.outH;
                            const rw = r.w * info.outW;
                            const rh = r.h * info.outH;
                            const tol = 10;
                            const hitW = 30;

                            if (Math.abs(mouseY - ry) < tol && Math.abs(mouseX - (rx + rw / 2)) < hitW) return;
                            if (Math.abs(mouseY - (ry + rh)) < tol && Math.abs(mouseX - (rx + rw / 2)) < hitW) return;
                            if (Math.abs(mouseX - rx) < tol && Math.abs(mouseY - (ry + rh / 2)) < hitW) return;
                            if (Math.abs(mouseX - (rx + rw)) < tol && Math.abs(mouseY - (ry + rh / 2)) < hitW) return;
                        }
                    }

                    e.stopPropagation(); e.preventDefault();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startXPos = sShape.x;
                    const startYPos = sShape.y;

                    let multiSnap = [];
                    if (state.multiSelected && state.multiSelected.find(m => m.data === sShape)) {
                        multiSnap = state.multiSelected.map(m => ({ item: m.data, type: m.type, x: m.data.x, y: m.data.y }));
                    }

                    const onMove = (me) => {
                        if (sShape.locked || sShape.posLocked) return;
                        const scale = state._displayScale || 1;
                        const dx = (me.clientX - startX) / scale / info.outW;
                        const dy = (me.clientY - startY) / scale / info.outH;
                        sShape.x = startXPos + dx;
                        sShape.y = startYPos + dy;
                        
                        if (multiSnap.length > 1) {
                            multiSnap.forEach(snap => {
                                if (snap.item !== sShape && !snap.item.locked && !snap.item.posLocked) {
                                    if (snap.type === 'image') {
                                        snap.item.x = snap.x + (dx * info.outW);
                                        snap.item.y = snap.y + (dy * info.outH);
                                    } else {
                                        snap.item.x = snap.x + dx;
                                        snap.item.y = snap.y + dy;
                                    }
                                }
                            });
                        }

                        window._checkSnapToCenter(sShape, 'shape', info);
                        state._showSnapLines = true;
                        drawPreview();
                        // Update frame immediately
                        frame.style.left = (sShape.x * info.outW * scale - 10) + "px";
                        frame.style.top = (sShape.y * info.outH * scale - 10) + "px";
                    };
                    const onUp = (me) => {
                state._showSnapLines = false;
                drawPreview();
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
                if (me && Math.abs(me.clientX - startX) < 3 && Math.abs(me.clientY - startY) < 3) {
                    const rect = layer.getBoundingClientRect();
                    const info = state._layoutInfo;
                    if (info && rect.width && rect.height) {
                        const mouseX = ((me.clientX - rect.left) / rect.width) * info.outW;
                        const mouseY = ((me.clientY - rect.top) / rect.height) * info.outH;
                        const hitList = [];
                        state.images.forEach((img, idx) => { if (img.w !== undefined) hitList.push({ type: 'image', data: img, index: idx, z: img.zIndex || 0 }); });
                        if (state.shapes) state.shapes.forEach((s) => hitList.push({ type: 'shape', data: s, z: s.zIndex || 0 }));
                        state.texts.forEach((tx) => hitList.push({ type: 'text', data: tx, z: tx.zIndex || 0 }));
                        hitList.sort((a, b) => b.z - a.z);

                        const actualHits = [];
                        for (let item of hitList) {
                            if (item.type === 'image') {
                                const img = item.data;
                                if (mouseX >= img.x && mouseX <= img.x + img.w && mouseY >= img.y && mouseY <= img.y + img.h) actualHits.push(item);
                            } else if (item.type === 'shape') {
                                const s = item.data;
                                const sx = s.x * info.outW, sy = s.y * info.outH;
                                const sw = s.w * info.outW, sh = s.h * info.outH;
                                if (mouseX >= sx && mouseX <= sx + sw && mouseY >= sy && mouseY <= sy + sh) actualHits.push(item);
                            } else if (item.type === 'text') {
                                const tx = item.data;
                                const txX = tx.x * info.outW, ty = tx.y * info.outH;
                                const tw = tx.w * info.outW, th = tx.h * info.outH;
                                if (mouseX >= txX && mouseX <= txX + tw && mouseY >= ty && mouseY <= ty + th) actualHits.push(item);
                            }
                        }
                        if (actualHits.length > 0 && actualHits[0].data !== sShape && !state.multiSelectMode && !e.shiftKey) {
                            const topHit = actualHits[0];
                            if (topHit.type === 'image') {
                                state.selectedImageIdx = topHit.index; state.selectedShapeId = null; state.selectedTextId = null; setSelected(null, false);
                            } else if (topHit.type === 'shape') {
                                state.selectedShapeId = topHit.data.id; state.selectedImageIdx = null; state.selectedTextId = null; setSelected(null, false);
                            } else if (topHit.type === 'text') {
                                state.selectedTextId = topHit.data.id; state.selectedImageIdx = null; state.selectedShapeId = null; setSelected(topHit.data.id, true);
                            }
                            drawPreview(); syncTextLayer();
                        }
                    }
                }
            };
                    window.addEventListener("mousemove", onMove);
                    window.addEventListener("mouseup", onUp);
                });
                frame.appendChild(mover);

                const corners = ['nw', 'ne', 'se', 'sw'];
                corners.forEach(pos => {
                    const h = document.createElement("div");
                    h.className = "meme-resize-handle " + pos;
                    h.style.zIndex = "50"; 
                    h.addEventListener("mousedown", (e) => {
                        e.stopPropagation(); e.preventDefault();
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startW = sShape.w;
                        const startH = sShape.h;
                        const startXPos = sShape.x;
                        const startYPos = sShape.y;

                        let multiSnap = [];
                        if (state.multiSelected && state.multiSelected.find(m => m.data === sShape)) {
                            multiSnap = state.multiSelected.map(m => ({ item: m.data, type: m.type, w: m.data.w, h: m.data.h, x: m.data.x, y: m.data.y, fontSize: m.data.fontSize }));
                        } else if (sShape.groupId) {
                            state.images.forEach(i => { if (i.groupId === sShape.groupId) multiSnap.push({ item: i, type: 'image', w: i.w, h: i.h, x: i.x, y: i.y }); });
                            (state.shapes || []).forEach(s => { if (s.groupId === sShape.groupId) multiSnap.push({ item: s, type: 'shape', w: s.w, h: s.h, x: s.x, y: s.y }); });
                            state.texts.forEach(tx => { if (tx.groupId === sShape.groupId) multiSnap.push({ item: tx, type: 'text', w: tx.w, h: tx.h, x: tx.x, y: tx.y, fontSize: tx.fontSize }); });
                        }

                        const onMove = (me) => {
                            if (sShape.locked) return;
                            const scale = state._displayScale || 1;
                            const dx = (me.clientX - startX) / scale / info.outW;
                            const dy = (me.clientY - startY) / scale / info.outH;

                            if (pos === 'se') {
                                sShape.w = Math.max(0.05, startW + dx);
                                sShape.h = Math.max(0.05, startH + dy);
                            } else if (pos === 'sw') {
                                sShape.w = Math.max(0.05, startW - dx);
                                sShape.x = startXPos + (startW - sShape.w);
                                sShape.h = Math.max(0.05, startH + dy);
                            } else if (pos === 'ne') {
                                sShape.w = Math.max(0.05, startW + dx);
                                sShape.h = Math.max(0.05, startH - dy);
                                sShape.y = startYPos + (startH - sShape.h);
                            } else if (pos === 'nw') {
                                sShape.w = Math.max(0.05, startW - dx);
                                sShape.x = startXPos + (startW - sShape.w);
                                sShape.h = Math.max(0.05, startH - dy);
                                sShape.y = startYPos + (startH - sShape.h);
                            }

                            if (multiSnap.length > 1) {
                                const scaleW = startW ? (sShape.w / startW) : 1;
                                const scaleH = startH ? (sShape.h / startH) : 1;
                                const dxNorm = sShape.x - startXPos;
                                const dyNorm = sShape.y - startYPos;
                                
                                multiSnap.forEach(snap => {
                                    if (snap.item !== sShape && !snap.item.locked && !snap.item.posLocked) {
                                        snap.item.w = snap.w * scaleW;
                                        snap.item.h = snap.h * scaleH;
                                        if (snap.type === 'text' && snap.fontSize) snap.item.fontSize = snap.fontSize * Math.min(scaleW, scaleH);
                                        if (snap.type === 'image') {
                                            snap.item.x = snap.x + (dxNorm * info.outW);
                                            snap.item.y = snap.y + (dyNorm * info.outH);
                                        } else {
                                            snap.item.x = snap.x + dxNorm;
                                            snap.item.y = snap.y + dyNorm;
                                        }
                                    }
                                });
                            }

                            drawPreview();
                            frame.style.left = (sShape.x * info.outW * scale - 10) + "px";
                            frame.style.top = (sShape.y * info.outH * scale - 10) + "px";
                            frame.style.width = (sShape.w * info.outW * scale + 20) + "px";
                            frame.style.height = (sShape.h * info.outH * scale + 20) + "px";
                        };
                        const onUp = () => {
                            window.removeEventListener("mousemove", onMove);
                            window.removeEventListener("mouseup", onUp);
                            syncTextLayer();
                        };
                        window.addEventListener("mousemove", onMove);
                        window.addEventListener("mouseup", onUp);
                    });
                    frame.appendChild(h);
                });
                
                                // Shape Rotate Handle
                const btnRot = document.createElement("div");
                btnRot.className = "meme-rotate-handle";
                btnRot.innerHTML = "⟳";
                btnRot.title = "Rotate";

                btnRot.style.position = "absolute";
                btnRot.style.zIndex = "99999";
                btnRot.style.pointerEvents = "auto";

                btnRot.style.transform = "translateX(-50%)";

                btnRot.addEventListener("mousedown", (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    const rect = frame.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;

                    const startRot = sShape.rotation || 0;
                    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);

                    let multiSnap = [];
                    if (state.multiSelected && state.multiSelected.find(m => m.data === sShape)) {
                        multiSnap = state.multiSelected.map(m => ({ item: m.data, rot: m.data.rotation || 0 }));
                    } else if (sShape.groupId) {
                        state.images.forEach(i => { if (i.groupId === sShape.groupId) multiSnap.push({ item: i, rot: i.rotation || 0 }); });
                        (state.shapes || []).forEach(s => { if (s.groupId === sShape.groupId) multiSnap.push({ item: s, rot: s.rotation || 0 }); });
                        state.texts.forEach(tx => { if (tx.groupId === sShape.groupId) multiSnap.push({ item: tx, rot: tx.rotation || 0 }); });
                    }

                    const onRotMove = (me) => {
                        if (sShape.locked) return;
                        const curAngle = Math.atan2(me.clientY - cy, me.clientX - cx);
                        const degDiff = (curAngle - startAngle) * (180 / Math.PI);

                        const nextRot = startRot + degDiff;
                        sShape.rotation = nextRot;

                        if (multiSnap.length > 1) {
                            multiSnap.forEach(snap => {
                                if (snap.item !== sShape && !snap.item.locked) snap.item.rotation = snap.rot + degDiff;
                            });
                        }

                        frame.style.transform = `rotate(${nextRot}deg)`;

                        drawPreview();
                    };

                    const onRotUp = () => {
                        window.removeEventListener("mousemove", onRotMove);
                        window.removeEventListener("mouseup", onRotUp);
                    };

                    window.addEventListener("mousemove", onRotMove);
                    window.addEventListener("mouseup", onRotUp);
                });

                frame.appendChild(btnRot);

                const btnDel = document.createElement("div");
                btnDel.className = "meme-delete-handle";
                btnDel.style.display = "flex"; 
                btnDel.style.zIndex = "55";
                btnDel.innerHTML = "×";
                
                btnDel.style.left = "-20px";
                btnDel.style.right = "auto";
                btnDel.style.transform = "none";
                btnDel.style.top = "-20px";

                btnDel.addEventListener("mousedown", (e) => {
                    e.stopPropagation();
                    state.shapes = state.shapes.filter(x => x.id !== state.selectedShapeId);
                    state.selectedShapeId = null;
                    drawPreview();
                    syncTextLayer();
                });
                frame.appendChild(btnDel);

                layer.appendChild(frame);
            }
        }

        state.texts.forEach(t => {
            const el = makeTextEl(t);
            layer.appendChild(el);
            positionTextEl(el, t, false);
        });

        syncLayerPanel();
        setSelected(state.selectedTextId, state.frameVisible);
    }


    function addTextBox() {
        const info = state._layoutInfo;
        const id = makeId();

        const t = {
            id,
            zIndex: state.nextZIndex++,
            x: 0.08,
            y: info && info.whiteTop > 0 ? 0.03 : 0.10,
            w: 0.25,
            h: 0.10,
           text: "Type here",
            fontSize: state.baseFontSize,
            fontFamily: state.baseFontFamily,
            fontWeight: state.baseFontWeight,
            fontStyle: state.baseFontStyle,
            color: "#ffffff",
            shadowColor: "#000000",
            shadowDepth: 2,
           shadowEnabled: true,
            textShadowColor: "#000000",
            textShadowDepth: 3,
            textShadowEnabled: false
        };

        state.texts.push(t);
        setSelected(id);
        syncTextLayer();
        
        const el = layer.querySelector(`.meme-text-item[data-id="${id}"]`);
        if (el) positionTextEl(el, t, true);
        
        drawPreview();
        saveHistory();
    }

   function deleteSelected() {
        if (!state.selectedTextId) return;
        state.texts = state.texts.filter(t => t.id !== state.selectedTextId);
        state.selectedTextId = null;
        syncTextLayer();
    }

    function wrapAndDrawText(
        ctx,
        text,
        x,
        y,
        w,
        font,
        fontSize,
        fill,
        stroke,
        strokeWidth,
        dropShadowColor,
        dropShadowOffX,
        dropShadowOffY,
        dropShadowBlur
    ) {

        const lines = [];
        const parts = (text || "").split("\n");

        if (!window._memeMeasureCtx) {
            window._memeMeasureCanvas = document.createElement("canvas");
            window._memeMeasureCtx = window._memeMeasureCanvas.getContext("2d");
        }
        window._memeMeasureCtx.font = font;

        ctx.font = font;
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;

        parts.forEach(p => {
            const words = p.split(" ");
            let line = "";

            words.forEach(word => {
                const test = line === "" ? word : (line + " " + word);
                const m = window._memeMeasureCtx.measureText(test).width;
                if (m > (w + (fontSize * 0.15)) && line !== "") {
                    lines.push(line);
                    line = word;
                } else {
                    line = test;
                }
            });

            if (line !== "") lines.push(line);
            lines.push("");
        });

        if (lines.length && lines[lines.length - 1] === "") lines.pop();

        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;

        let yy = y;
        const lineHeight = Math.round(fontSize * 1.05);

        const doDrop =
            !!dropShadowColor &&
            ((dropShadowOffX || 0) !== 0 || (dropShadowOffY || 0) !== 0 || (dropShadowBlur || 0) !== 0);

        const hasStroke = stroke && stroke !== 'transparent' && stroke !== 'none';

        lines.forEach(l => {
            if (!l) {
                yy += Math.round(lineHeight * 0.6);
                return;
            }

            if (hasStroke) {
                ctx.lineWidth = strokeWidth || Math.max(2, Math.round(fontSize * 0.10));
            }

            if (doDrop) {
                ctx.save();
                ctx.shadowColor = dropShadowColor;
                ctx.shadowOffsetX = dropShadowOffX || 0;
                ctx.shadowOffsetY = dropShadowOffY || 0;
                ctx.shadowBlur = dropShadowBlur || 0;

                if (hasStroke) ctx.strokeText(l, x, yy);
                ctx.fillText(l, x, yy);

                ctx.restore();
            } else {
                if (hasStroke) ctx.strokeText(l, x, yy);
                ctx.fillText(l, x, yy);
            }

            yy += lineHeight;
        });
    }


        async function saveMeme(saveMode = "binder", templateMeta = null) {
        const imgs = state.images.map(o => o.img);
        let info;
        
        if (state.advancedMode) {

             const pW = (state._layoutInfo && state._layoutInfo.outW) || 1200;
             const pH = (state._layoutInfo && state._layoutInfo.outH) || 1200;
             info = { outW: pW, outH: pH, gapPx: 0, rects: [], wsPos: 'none' };

             info.rects = state.images.map(img => ({
                x: img.x || 0,
                y: img.y || 0,
                w: img.w || img.img.width,
                h: img.h || img.img.height
            }));
        } else {

             if (imgs.length === 0) {
                 const pW = (state._layoutInfo && state._layoutInfo.outW) || 800;
                 const pH = (state._layoutInfo && state._layoutInfo.outH) || 600;
                 info = { outW: pW, outH: pH, gapPx: 0, rects: [], wsPos: 'none' };
             } else {
                 info = computeComposite(imgs, state.layout, state.whiteSpacePos, state.whiteSpaceSize, state.whiteSpaceTopScope);
             }
        }


        const maxSourceDim = state.images.reduce((max, obj) => Math.max(max, obj.img.naturalWidth || 0, obj.img.naturalHeight || 0), 1920);
        const targetMax = Math.min(4096, Math.max(1920, maxSourceDim)); // Cap at 4k to prevent crashes
        
        const currentMax = Math.max(info.outW, info.outH);
        let saveScale = 1;
        
        if (currentMax < targetMax) {
            saveScale = targetMax / currentMax;
        }

        const out = document.createElement("canvas");
        out.width = Math.round(info.outW * saveScale);
        out.height = Math.round(info.outH * saveScale);

        const ctx = out.getContext("2d");
        ctx.scale(saveScale, saveScale);

        drawBackgroundEffect(ctx, info.outW, info.outH, state.canvasColor || "#ffffff", state.canvasEffect);

        if (state.whiteSpaceLines && info.wsPos === "right" && state.layout === "vertical" && imgs.length > 1 && info.gapPx > 0) {
            const imgBlockW = info.outW - info.gapPx;
            ctx.save();
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < info.rects.length - 1; i++) {
                const r = info.rects[i];
                if (!r) continue;
                const y = Math.round(r.y + r.h);
                ctx.moveTo(imgBlockW, y);
                ctx.lineTo(info.outW, y);
            }
            ctx.stroke();
            ctx.restore();
        }

        const renderList = [];
        state.images.forEach((imgObj, idx) => renderList.push({ type: 'image', index: idx, z: imgObj.zIndex || 0 }));
        if (state.shapes) state.shapes.forEach(s => renderList.push({ type: 'shape', data: s, z: s.zIndex || 0 }));
        state.texts.forEach(t => renderList.push({ type: 'text', data: t, z: t.zIndex || 0 }));
        renderList.sort((a, b) => a.z - b.z);

        renderList.forEach(item => {
            if (item.type === 'image') {
                const i = item.index;
                const r = info.rects[i];
                if (!r) return;
                ctx.save();

            const cx = r.x + r.w / 2;
            const cy = r.y + r.h / 2;
            ctx.translate(cx, cy);
            if (state.images[i].rotation) ctx.rotate(state.images[i].rotation * Math.PI / 180);
            if (state.images[i].flip) ctx.scale(-1, 1);
            ctx.translate(-cx, -cy);

            if (state.images[i].opacity !== undefined) ctx.globalAlpha = state.images[i].opacity;
            const crop = state.images[i] && state.images[i].crop;
if (crop) {
    const iw = imgs[i].naturalWidth || imgs[i].width;
    const ih = imgs[i].naturalHeight || imgs[i].height;

    const sx = Math.round(crop.x * iw);
    const sy = Math.round(crop.y * ih);
    const sw = Math.max(1, Math.round(crop.w * iw));
    const sh = Math.max(1, Math.round(crop.h * ih));

    ctx.drawImage(imgs[i], sx, sy, sw, sh, r.x, r.y, r.w, r.h);
} else {
    ctx.drawImage(imgs[i], r.x, r.y, r.w, r.h);
}

            ctx.restore();
            } else if (item.type === 'shape') {
                const s = item.data;
                const cx = (s.x * info.outW) + (s.w * info.outW)/2;
                const cy = (s.y * info.outH) + (s.h * info.outH)/2;
                
                ctx.save();
                ctx.translate(cx, cy);
                if (s.rotation) ctx.rotate(s.rotation * Math.PI / 180);
                if (s.flip) ctx.scale(-1, 1);
                ctx.translate(-cx, -cy);
                
                if (s.opacity !== undefined) ctx.globalAlpha = s.opacity;

                const sx = s.x * info.outW;
                const sy = s.y * info.outH;
                const sw = s.w * info.outW;
                const sh = s.h * info.outH;

                const defineStar = (ctx, cx, cy, r) => {
                    const spikes = 5; const outer = r; const inner = r * 0.5;
                    let rot = (Math.PI / 2) * 3; let x = cx, y = cy; const step = Math.PI / spikes;
                    ctx.moveTo(cx, cy - outer);
                    for (let i = 0; i < spikes; i++) {
                        x = cx + Math.cos(rot) * outer; y = cy + Math.sin(rot) * outer; ctx.lineTo(x, y); rot += step;
                        x = cx + Math.cos(rot) * inner; y = cy + Math.sin(rot) * inner; ctx.lineTo(x, y); rot += step;
                    }
                    ctx.lineTo(cx, cy - outer); ctx.closePath();
                };
                const defineHeart = (ctx, x, y, w, h) => {
                    const topCurve = h * 0.3;
                    ctx.moveTo(x + w/2, y + h * 0.2);
                    ctx.bezierCurveTo(x + w/2, y + h * 0.2 - topCurve, x, y, x, y + h * 0.4);
                    ctx.bezierCurveTo(x, y + h * 0.6, x + w/2, y + h * 0.85, x + w/2, y + h);
                    ctx.bezierCurveTo(x + w/2, y + h * 0.85, x + w, y + h * 0.6, x + w, y + h * 0.4);
                    ctx.bezierCurveTo(x + w, y, x + w/2, y + h * 0.2 - topCurve, x + w/2, y + h * 0.2);
                    ctx.closePath();
                };
                const defineArrow = (ctx, x, y, w, h) => {
                    const shaftH = h * 0.4; const headW = w * 0.4; const midY = y + h/2;
                    ctx.moveTo(x, midY - shaftH/2); ctx.lineTo(x + w - headW, midY - shaftH/2);
                    ctx.lineTo(x + w - headW, y); ctx.lineTo(x + w, midY);
                    ctx.lineTo(x + w - headW, y + h); ctx.lineTo(x + w - headW, midY + shaftH/2);
                    ctx.lineTo(x, midY + shaftH/2); ctx.closePath();
                };

                if (s.shadowEnabled) {
                    ctx.shadowColor = s.shadowColor || "#000000";
                    ctx.shadowBlur = (s.shadowBlur || 10) * 2;
                    ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 5;
                }

                ctx.beginPath();
                ctx.strokeStyle = s.color || "#e67e22";
                ctx.lineWidth = s.strokeWidth || 5; 
                ctx.fillStyle = (s.fillEnabled && s.fillColor) ? s.fillColor : "transparent";

                if (s.type === 'square' || s.type === 'rect') { ctx.rect(sx, sy, sw, sh); }
                else if (s.type === 'circle') { ctx.ellipse(sx + sw/2, sy + sh/2, sw/2, sh/2, 0, 0, 2 * Math.PI); }
                else if (s.type === 'line') { ctx.moveTo(sx, sy + sh/2); ctx.lineTo(sx + sw, sy + sh/2); }
                else if (s.type === 'triangle') { ctx.moveTo(sx + sw/2, sy); ctx.lineTo(sx + sw, sy + sh); ctx.lineTo(sx, sy + sh); ctx.closePath(); }
                else if (s.type === 'octagon') {
                    const step = (2 * Math.PI) / 8; const cx = sx + sw/2; const cy = sy + sh/2; const r = Math.min(sw, sh) / 2;
                    for(let k=0; k<8; k++) {
                        const ang = k * step;
                        if(k===0) ctx.moveTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
                        else ctx.lineTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
                    }
                    ctx.closePath();
                }
                else if (s.type === 'star') defineStar(ctx, sx + sw/2, sy + sh/2, Math.min(sw, sh)/2);
                else if (s.type === 'heart') defineHeart(ctx, sx, sy, sw, sh);
                else if (s.type === 'arrow') defineArrow(ctx, sx, sy, sw, sh);
                else if (s.type === 'bubble_oval') {
                    ctx.ellipse(sx + sw/2, sy + sh * 0.45, sw/2, sh * 0.4, 0, 0, 2 * Math.PI);
                    ctx.moveTo(sx + sw * 0.25, sy + sh * 0.85); ctx.arc(sx + sw * 0.2, sy + sh * 0.95, sw * 0.05, 0, 2 * Math.PI);
                    ctx.moveTo(sx + sw * 0.15, sy + sh); ctx.arc(sx + sw * 0.1, sy + sh, sw * 0.03, 0, 2 * Math.PI);
                } 
                else if (s.type === 'bubble_cloud') {
                    const cx = sx + sw/2; const cy = sy + sh/2;
                    ctx.ellipse(cx, cy, sw*0.4, sh*0.35, 0, 0, 2*Math.PI);
                    ctx.ellipse(cx - sw*0.3, cy, sw*0.2, sh*0.25, 0, 0, 2*Math.PI);
                    ctx.ellipse(cx + sw*0.3, cy, sw*0.2, sh*0.25, 0, 0, 2*Math.PI);
                    ctx.ellipse(cx, cy - sh*0.3, sw*0.25, sh*0.2, 0, 0, 2*Math.PI);
                    ctx.ellipse(cx, cy + sh*0.3, sw*0.25, sh*0.2, 0, 0, 2*Math.PI);
                    ctx.moveTo(sx + sw * 0.2, sy + sh * 0.9); ctx.arc(sx + sw * 0.2, sy + sh * 0.9, sw * 0.04, 0, 2 * Math.PI);
                    ctx.moveTo(sx + sw * 0.15, sy + sh * 0.98); ctx.arc(sx + sw * 0.12, sy + sh * 0.98, sw * 0.025, 0, 2 * Math.PI);
                }
                else if (s.type === 'bubble_square') {
                    const r = 10; const bx = sx; const by = sy; const bw = sw; const bh = sh * 0.8;
                    ctx.moveTo(bx + r, by); ctx.lineTo(bx + bw - r, by); ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
                    ctx.lineTo(bx + bw, by + bh - r); ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
                    ctx.lineTo(bx + bw * 0.4, by + bh); ctx.lineTo(bx + bw * 0.2, by + bh + (sh * 0.2));
                    ctx.lineTo(bx + bw * 0.3, by + bh); ctx.lineTo(bx + r, by + bh); ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
                    ctx.lineTo(bx, by + r); ctx.quadraticCurveTo(bx, by, bx + r, by);
                }
                else if (s.type.startsWith('3d_')) {
                    const offX = sw * 0.1; const offY = sh * 0.1;
                    const backX = sx + offX; const backY = sy;
                    const frontX = sx; const frontY = sy + offY;
                    const dW = sw - offX; const dH = sh - offY;

                    ctx.beginPath();
                    if (s.type.includes('square') || s.type.includes('rect')) {
                        ctx.rect(backX, backY, dW, dH);
                        ctx.moveTo(backX, backY); ctx.lineTo(frontX, frontY);
                        ctx.moveTo(backX + dW, backY); ctx.lineTo(frontX + dW, frontY);
                        ctx.moveTo(backX + dW, backY + dH); ctx.lineTo(frontX + dW, frontY + dH);
                        ctx.moveTo(backX, backY + dH); ctx.lineTo(frontX, frontY + dH);
                    } else if (s.type.includes('circle')) {
                         ctx.ellipse(backX + dW/2, backY + dH/2, dW/2, dH/2, 0, 0, 2*Math.PI);
                         ctx.moveTo(backX + dW/2, backY); ctx.lineTo(frontX + dW/2, frontY);
                         ctx.moveTo(backX + dW, backY + dH/2); ctx.lineTo(frontX + dW, frontY + dH/2);
                         ctx.moveTo(backX + dW/2, backY + dH); ctx.lineTo(frontX + dW/2, frontY + dH);
                         ctx.moveTo(backX, backY + dH/2); ctx.lineTo(frontX, frontY + dH/2);
                    } else if (s.type.includes('cylinder')) {
                         const ry = sw * 0.15;
                         ctx.ellipse(sx + sw/2, sy + sh - ry, sw/2, ry, 0, 0, 2*Math.PI);
                         ctx.moveTo(sx, sy + ry); ctx.lineTo(sx, sy + sh - ry);
                         ctx.moveTo(sx + sw, sy + ry); ctx.lineTo(sx + sw, sy + sh - ry);
                    } else if (s.type.includes('triangle')) {
                        ctx.moveTo(backX + dW/2, backY); ctx.lineTo(backX + dW, backY + dH); ctx.lineTo(backX, backY + dH); ctx.closePath();
                        ctx.moveTo(backX + dW/2, backY); ctx.lineTo(frontX + dW/2, frontY);
                        ctx.moveTo(backX + dW, backY + dH); ctx.lineTo(frontX + dW, frontY + dH);
                        ctx.moveTo(backX, backY + dH); ctx.lineTo(frontX, frontY + dH);
                    } else if (s.type.includes('star')) {
                        defineStar(ctx, backX + dW/2, backY + dH/2, Math.min(dW,dH)/2);
                        // Simplified connectors
                        ctx.moveTo(backX + dW/2, backY); ctx.lineTo(frontX + dW/2, frontY);
                    } else if (s.type.includes('heart')) {
                        defineHeart(ctx, backX, backY, dW, dH);
                        ctx.moveTo(backX + dW/2, backY + dH); ctx.lineTo(frontX + dW/2, frontY + dH);
                    } else if (s.type.includes('arrow')) {
                        defineArrow(ctx, backX, backY, dW, dH);
                        ctx.moveTo(backX + dW, backY + dH/2); ctx.lineTo(frontX + dW, frontY + dH/2);
                    }
                    ctx.stroke();

                    ctx.beginPath(); // Front
                    if (s.type.includes('square') || s.type.includes('rect')) ctx.rect(frontX, frontY, dW, dH);
                    else if (s.type.includes('circle')) ctx.ellipse(frontX + dW/2, frontY + dH/2, dW/2, dH/2, 0, 0, 2*Math.PI);
                    else if (s.type.includes('cylinder')) { const ry = sw * 0.15; ctx.ellipse(sx + sw/2, sy + ry, sw/2, ry, 0, 0, 2*Math.PI); }
                    else if (s.type.includes('triangle')) { ctx.moveTo(frontX + dW/2, frontY); ctx.lineTo(frontX + dW, frontY + dH); ctx.lineTo(frontX, frontY + dH); ctx.closePath(); }
                    else if (s.type.includes('star')) defineStar(ctx, frontX + dW/2, frontY + dH/2, Math.min(dW, dH)/2);
                    else if (s.type.includes('heart')) defineHeart(ctx, frontX, frontY, dW, dH);
                    else if (s.type.includes('arrow')) defineArrow(ctx, frontX, frontY, dW, dH);
                }

                if (s.type === 'emoji') {
                    ctx.fillStyle = "black";
                    const size = Math.min(sw, sh);
                    ctx.font = `${size}px serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(s.text, cx, cy + (size * 0.15));
                } else if (s.type !== 'line') {
                    if (s.fillEnabled) ctx.fill();
                    ctx.stroke();
                } else {
                    ctx.stroke();
                }
                
                ctx.restore();
            } else if (item.type === 'text') {
                const t = item.data;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";

                const x = Math.round(t.x * info.outW);
                const y = Math.round(t.y * info.outH);
            const w = Math.round(t.w * info.outW);
            const h = Math.round(t.h * info.outH); // Enabled for rotation calculation

            const dispH = state._displayH || Math.round(info.outH * (state._displayScale || 1));
            const outPerDispY = info.outH / Math.max(1, dispH);
            const outPerDispX = info.outW / Math.max(1, (state._displayW || 1));

            const rawFontSize = t.fontSize || state.baseFontSize;
            const fontSize = Math.max(10, Math.round(rawFontSize));

            const fam = t.fontFamily || state.baseFontFamily || "Anton";
            const rawWeight = t.fontWeight || state.baseFontWeight || "900";
            const fStyle = t.fontStyle || state.baseFontStyle || "normal";
            const weight = fStyle === "bold" ? "bold" : rawWeight;
            const famForCanvas = fam.includes(" ") ? `"${fam}"` : fam;
            const font = `${fStyle === "italic" ? "italic " : ""}${weight} ${fontSize}px ${famForCanvas}, Impact, Arial Black, sans-serif`;

            const normalizeTextColor = (v) => {
                const s = String(v || "").trim().toLowerCase();
                if (s === "white") return "#ffffff";
                if (s === "black") return "#000000";
                if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;
                return "#ffffff";
            };

            const contrastTextColor = (hex) => {
                const h = normalizeTextColor(hex).replace("#", "");
                const full = h.length === 3 ? (h[0] + h[0] + h[1] + h[1] + h[2] + h[2]) : h;
                const r = parseInt(full.slice(0, 2), 16) || 0;
                const g = parseInt(full.slice(2, 4), 16) || 0;
                const b = parseInt(full.slice(4, 6), 16) || 0;
                const luma = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
                return luma < 128 ? "#ffffff" : "#000000";
            };

            const color = normalizeTextColor(t.color || state.baseColor);
            const fill = color;

            const bgEnabled = (t.shadowEnabled !== undefined) ? t.shadowEnabled : state.baseShadowEnabled;
            let stroke = "transparent";
            let strokeWidth = 0;

            if (bgEnabled) {
                const shadowColor = normalizeTextColor(t.shadowColor || state.baseShadowColor || contrastTextColor(color));


                const depthRaw = (t.shadowDepth || state.baseShadowDepth || 2);
                const depth = Math.max(1, Math.min(7, parseInt(depthRaw, 10) || 2));
                stroke = shadowColor;
                strokeWidth = Math.max(2, Math.round(depth * 2 * outPerDispX));
            }

            const padY = Math.round(6 * outPerDispY);
            const padX = Math.round(8 * outPerDispX);
            
            const yOffset = Math.round(fontSize * 0.2);

            const cx = x + Math.round(w / 2) - Math.round(padX * 0.5);
            const cy = y + Math.round(h / 2);

            const tsEnabled = (t.textShadowEnabled !== undefined) ? t.textShadowEnabled : state.baseTextShadowEnabled;            let tsColor = "transparent";
            let tsOff = 0;
            let tsBlur = 0;

            if (tsEnabled) {
                tsColor = (t.textShadowColor || state.baseTextShadowColor || "#000000");
                const tsDepthRaw = (t.textShadowDepth ?? state.baseTextShadowDepth ?? 3);
                const tsDepth = Math.max(1, Math.min(7, parseInt(tsDepthRaw, 10) || 3));
                tsOff = Math.max(1, Math.round(tsDepth * outPerDispX));
                tsBlur = Math.round(tsOff * 1.2);
            }

            ctx.save();
            
            // Apply Rotation & Flip
            ctx.translate(cx, cy);
            if (t.rotation) ctx.rotate(t.rotation * Math.PI / 180);
            if (t.flip) ctx.scale(-1, 1);
            ctx.translate(-cx, -cy);

            if (t.opacity !== undefined) ctx.globalAlpha = t.opacity;

            wrapAndDrawText(
                ctx,
                t.text || "",
                cx,
                y + padY + yOffset,
                Math.max(10, w - padX * 2),
                font,
                fontSize,
                fill,
                stroke,
                strokeWidth,
                tsColor,
                tsOff,
                tsOff,
                tsBlur
            );
            ctx.restore();
            }
        });

        // Apply Stage Crop if active
        let finalCanvas = out;
        if (state.stageCropRect && state.stageCropRect.w > 0.01) {
            const r = state.stageCropRect;
            const rx = Math.round(r.x * info.outW * saveScale);
            const ry = Math.round(r.y * info.outH * saveScale);
            const rw = Math.round(r.w * info.outW * saveScale);
            const rh = Math.round(r.h * info.outH * saveScale);
            
            const cropC = document.createElement("canvas");
            cropC.width = rw;
            cropC.height = rh;
            cropC.getContext("2d").drawImage(out, rx, ry, rw, rh, 0, 0, rw, rh);
            finalCanvas = cropC;
        }

        if (window._isGuestMode) {
            const wCtx = finalCanvas.getContext("2d");
            wCtx.save();
            wCtx.font = "bold 32px Impact, sans-serif";
            wCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
            wCtx.strokeStyle = "rgba(0, 0, 0, 0.7)";
            wCtx.lineWidth = 4;
            wCtx.textAlign = "right";
            wCtx.textBaseline = "bottom";
            wCtx.strokeText("Created with Meme Creator", finalCanvas.width - 20, finalCanvas.height - 20);
            wCtx.fillText("Created with Meme Creator", finalCanvas.width - 20, finalCanvas.height - 20);
            wCtx.restore();
        }

        const formatSelect = document.getElementById("memeDownloadFormat");
        let formatExt = "png";
        let mimeType = "image/png";
        
        if (formatSelect && (saveMode === "download" || saveMode === "publish")) {
            formatExt = formatSelect.value;
            if (formatExt === "jpeg") mimeType = "image/jpeg";
            else if (formatExt === "webp") mimeType = "image/webp";
        }

        const blob = await new Promise(resolve => finalCanvas.toBlob(resolve, mimeType, 0.92));
if (!blob) return;

if (saveMode === "timeline") return blob;

const fd = new FormData();
const ext = formatExt === "jpeg" ? "jpg" : formatExt;
const filename = (saveMode === "template" ? "template_" : "meme_") + Date.now() + "." + ext;
fd.append("meme", blob, filename);


        // 1. Handle Binder/Template Saving to Server
        if (saveMode === "binder" || saveMode === "template") {
            if (templateMeta) {
                fd.append("name", templateMeta.name || "");
                fd.append("keywords", templateMeta.keywords || "");
                // Send selected categories (as JSON string)
                if (templateMeta.categories && templateMeta.categories.length) {
                    fd.append("categories", JSON.stringify(templateMeta.categories));
                }
            }

            const url = saveMode === "binder" ? "/api/memes/binder" : "/api/memes/templates";

            try {
                const r = await fetch(url, { method: "POST", body: fd });
                const d = await r.json().catch(() => ({}));

                if (d && d.success) {
                    const msg = saveMode === "binder" ? "Meme Saved" : "Saved Template";

                    if (overlay && overlay.dataset && overlay.dataset.logoutAfterClose === "true") {
                        sessionStorage.setItem("postLogoutToast", msg);
                        overlay.dataset.logoutAfterClose = "";
                        overlay.dataset.closeOnSave = "";
                        await doLogout();
                        return;
                    }

                    showToast(msg);

                    if (overlay && overlay.dataset && overlay.dataset.closeOnSave === "true") {
                        overlay.dataset.closeOnSave = "";
                        closeEditor(true);
                    }

                    return;
                }

                showToast("Save failed");
            } catch (e) {
                showToast("Error saving");
            }
            return;
        }


        if (saveMode === "publish") {
            const file = new File([blob], filename, { type: mimeType });
            if (wrapper) {
                wrapper._uploadMode = 'meme';
                if (isMemeInput) isMemeInput.value = '1';
                
                // Reset selection to only include the new meme (clears source files)
                wrapper._selectedFiles = [];
                wrapper._selectedFiles.push(file);
                
                const dt = new DataTransfer();
                wrapper._selectedFiles.forEach(f => dt.items.add(f));
                if (input) input.files = dt.files;
                if (input) input.dispatchEvent(new Event('change'));
            }
                        wrapper._preserveSelectedFilesOnClose = true;

            if (state.paintMode && btnPaintCanvas) {
                btnPaintCanvas.click(); // safe: paint button handler turns paint off and returns early
            }

            closeEditor(true);
            return;

        }


        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (overlay && overlay.dataset && overlay.dataset.logoutAfterClose === "true") {
            overlay.dataset.logoutAfterClose = "";
            await new Promise(r => setTimeout(r, 200));
            await doLogout();
            return;
        }

        showToast("Meme downloaded!");



        }

async function __imageToDataUrl(obj) {
    const src = (obj && typeof obj.src === "string") ? obj.src : "";

    // If the image already exists as a real URL/path, save the URL like binder does
    if (src && !src.startsWith("blob:") && !src.startsWith("data:")) {
        return src;
    }

    // If it is already a data URL, keep it as-is
    if (src && src.startsWith("data:")) {
        return src;
    }

    // If we have a Blob, encode it
    if (obj && obj.file instanceof Blob) {
        return new Promise((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result || "");
            r.onerror = () => resolve("");
            r.readAsDataURL(obj.file);
        });
    }

    // If it is a blob URL, fetch and encode it
    if (src && src.startsWith("blob:")) {
        try {
            const b = await (await fetch(src)).blob();
            return await new Promise((resolve) => {
                const r = new FileReader();
                r.onload = () => resolve(r.result || "");
                r.onerror = () => resolve("");
                r.readAsDataURL(b);
            });
        } catch (e) {
            console.error("Blob serialize error:", e);
        }
    }

    // Fallback: rasterize, but cap size so state_json does not explode
    try {
        const img = obj && obj.img;
        if (!img) return "";

        let w = img.naturalWidth || img.width || 100;
        let h = img.naturalHeight || img.height || 100;

        const maxSide = 1920;
        const biggest = Math.max(w, h);
        if (biggest > maxSide) {
            const scale = maxSide / biggest;
            w = Math.max(1, Math.round(w * scale));
            h = Math.max(1, Math.round(h * scale));
        }

        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;

        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        return c.toDataURL("image/png");
    } catch (e) {
        console.error("Image serialize error:", e);
        return "";
    }
}


function __deepCloneJson(v) {
    try {
        return JSON.parse(JSON.stringify(v || {}));
    } catch (e) {
        return {};
    }
}

async function __buildProgressSnapshot() {
    const serializedImages = [];
    if (Array.isArray(state.images)) {
        for (const imgObj of state.images) {
            const dataUrl = await __imageToDataUrl(imgObj);
            serializedImages.push({
                src: dataUrl, // The actual image data
                x: imgObj.x || 0, 
                y: imgObj.y || 0, 
                w: imgObj.w, 
                h: imgObj.h,
                rotation: imgObj.rotation || 0,
                flip: !!imgObj.flip,
                opacity: (imgObj.opacity !== undefined ? imgObj.opacity : 1),
                zIndex: imgObj.zIndex || 0,
                crop: imgObj.crop ? { ...imgObj.crop } : null,
                locked: !!imgObj.locked,
                isPaintLayer: !!imgObj.isPaintLayer
            });
        }
    }

   let previewThumb = "";
    try {
        const thumbBlob = await __makeThumbBlob(1200);
        previewThumb = await new Promise(r => {
            const fr = new FileReader();
            fr.onload = () => r(fr.result);
            fr.onerror = () => r("");
            fr.readAsDataURL(thumbBlob);
        });
    } catch(e) {}

    return {
        version: 2, // Bumped version for tracking
        previewThumb: previewThumb,
        timestamp: Date.now(),
        
        // Canvas Settings
        layout: state.layout || "vertical",
        canvasColor: state.canvasColor || "#ffffff",
        canvasEffect: state.canvasEffect || "none",
        whiteSpacePos: state.whiteSpacePos || "none",
        whiteSpaceSize: state.whiteSpaceSize || 0.15,
        whiteSpaceTopScope: state.whiteSpaceTopScope || "all",
        whiteSpaceLines: !!state.whiteSpaceLines,
        snapEnabled: !!state.snapEnabled,
        
        // Mode Settings
        advancedMode: !!state.advancedMode,
        fixedSize: state.fixedSize ? { ...state.fixedSize } : null,
        stageCropRect: state.stageCropRect ? { ...state.stageCropRect } : null,
        
        // Defaults
       baseFontSize: state.baseFontSize || 48,
        baseFontFamily: state.baseFontFamily || "Anton",
        baseFontWeight: state.baseFontWeight || "900",
        baseFontStyle: state.baseFontStyle || "normal",
        baseColor: state.baseColor || "#ffffff",
        
        // Shadow Defaults
        baseShadowColor: state.baseShadowColor || "#000000",
        baseShadowDepth: state.baseShadowDepth || 2,
        baseShadowEnabled: (state.baseShadowEnabled !== false),
        
        baseTextShadowColor: state.baseTextShadowColor || "#000000",
        baseTextShadowDepth: state.baseTextShadowDepth || 3,
        baseTextShadowEnabled: !!state.baseTextShadowEnabled,

        // Internal counters
        nextZIndex: state.nextZIndex || 100,

        // Content
        texts: __deepCloneJson(state.texts),
        shapes: __deepCloneJson(state.shapes),
        images: serializedImages
    };
}

async function __makeThumbBlob(maxSide = 420) {
    try {
        const fullBlob = await saveMeme("timeline");
        if (!fullBlob) throw new Error("Empty blob");
        
        const img = await loadImageFromFile(fullBlob);
        
        const w = img.width;
        const h = img.height;
        const scale = Math.min(1, maxSide / Math.max(w, h));

        const out = document.createElement("canvas");
        out.width = Math.max(1, Math.round(w * scale));
        out.height = Math.max(1, Math.round(h * scale));

        const ctx = out.getContext("2d");
        ctx.drawImage(img, 0, 0, out.width, out.height);

        return await new Promise(resolve => out.toBlob(resolve, "image/png", 0.92));
    } catch (err) {
        return await new Promise(resolve => {
            const blank = document.createElement("canvas");
            blank.width = 10;
            blank.height = 10;
            blank.toBlob(resolve, "image/png", 0.92);
        });
    }
}

async function saveProgressToServer(name, keywords = "", categories = [0], overwrite = false) {
    try {
        showToast("Packing data...");
        
        const snapshot = await __buildProgressSnapshot();
        const jsonString = JSON.stringify(snapshot);

        const thumbBlob = await __makeThumbBlob(1200); // Higher res for preview
        if (!thumbBlob) throw new Error("Could not generate thumbnail");

        const fd = new FormData();
        fd.append("name", String(name || "Untitled").trim().substring(0, 60));
        fd.append("keywords", keywords);
        fd.append("categories", JSON.stringify(categories));
        fd.append("state", jsonString);
        fd.append("thumb", thumbBlob, "thumb.png");
        fd.append("overwrite", overwrite);

        showToast("Saving to server...");
        // Send
        const res = await fetch("/api/memes/progress", { 
            method: "POST", 
            body: fd,
            credentials: "same-origin"
        });

        if (res.status === 409) {
            const d = document.createElement('div');
            d.className = 'custom-dialog-overlay open';
            d.style.zIndex = '12000';
            d.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 300px; text-align: center;">
                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Confirm Overwrite</h3>
                    <p>Would you like to overwrite save?</p>
                    <div class="dialog-actions" style="display:flex; justify-content:space-between; gap:10px;">
                        <button class="btn-cancel" id="overwriteNo">No</button>
                        <button class="btn-cancel" id="overwriteYes">Yes</button>
                    </div>
                </div>`;
            document.body.appendChild(d);

            d.querySelector('#overwriteNo').onclick = () => d.remove();
            d.querySelector('#overwriteYes').onclick = () => {
                d.remove();
                saveProgressToServer(name, keywords, categories, true);
            };
            return;
        }

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || `Server error: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
            showToast("Progress Saved!");
        } else {
            throw new Error(data.error || "Unknown save error");
        }

    } catch (err) {
        console.error("Progress Save Error:", err);
        showToast("Save Failed: " + err.message);
    }
}

async function saveProgressDialog() {
    let folderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <label style="font-weight:600; font-size:12px; margin:0;">Save to Folder(s):</label>
            <button type="button" class="btn-create-folder-inline" title="Create Folder" style="background:#c0392b; color:#000; font-weight:900; border:none; border-radius:4px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; padding:0;">+</button>
        </div>
        <div style="max-height:120px; overflow-y:auto; border:1px solid #ccd0d5; border-radius:4px; padding:6px; background:#f7f8fa; margin-bottom:15px;">
        <label style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:4px; cursor:pointer; color:#1c1e21; user-select:none;">
            <input type="checkbox" class="save-folder-check" value="0" style="cursor:pointer;"> 
            <span>📁 Unsorted</span>
        </label>`;

    try {
        const res = await fetch('/api/categories/progress');
        const data = await res.json();
        if (data.categories) {
            data.categories.forEach(c => {
                folderHtml += `<label style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:4px; cursor:pointer; color:#1c1e21; user-select:none;">
                    <input type="checkbox" class="save-folder-check" value="${c.id}" style="cursor:pointer;"> 
                    <span>📁 ${__escapeHtml(c.name)}</span>
                </label>`;
            });
        }
    } catch(err) { console.error("Error fetching folders", err); }
    folderHtml += `</div>`;

    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "10000";

    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 850px; width: 90vw; padding: 0; display: flex; overflow: hidden; height: 70vh; max-height: 600px;">
            <div style="width: 340px; padding: 16px; display: flex; flex-direction: column; overflow-y: auto; border-right: 1px solid #ccd0d5; flex-shrink: 0;">
                <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Save/Load Progress</h3>
                <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Name:</label>
                <input type="text" id="progressNameInput" class="settings-input" style="width:100%; margin-bottom:12px;" placeholder="In-Progress Meme" autocomplete="off">
                <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Keywords:</label>
                <textarea id="progressKeywordsInput" class="custom-dialog-textarea" style="min-height:60px; margin-bottom:15px;" placeholder="kermit, funny, cats" autocomplete="off"></textarea>
                ${folderHtml}
                <div class="dialog-actions" style="display:flex; justify-content:space-between; gap:10px; margin-top: auto;">
                    <button type="button" class="btn-cancel" id="cancelProgressSave">Cancel</button>
                    <div style="display:flex; gap:10px;">
                        <button type="button" class="btn-cancel" id="openProgressLoad">Load</button>
                        <button type="button" class="btn-cancel" id="confirmProgressSave" style="font-weight:bold;">Save</button>
                    </div>
                </div>
            </div>
            <div style="flex: 1; display: flex; background: #f0f2f5; overflow: hidden;">
                <div style="width: 150px; background: #fff; border-right: 1px solid #ccd0d5; padding: 10px; overflow-y: auto; font-size: 11px;" id="miniProgressFolders">
                    Loading folders...
                </div>
                <div style="flex: 1; padding: 10px; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px;" id="miniProgressGrid">
                        <div style="color:#666;">Loading items...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(div);

    fetch('/api/memes/progress').then(r => r.json()).then(pData => {
        const items = pData.items || [];
        const renderGrid = (catId) => {
            const grid = div.querySelector('#miniProgressGrid');
            if (!grid) return;
            let filtered = items;
            if (catId === 'unsorted') filtered = items.filter(m => !m.category_id || m.category_id == 0);
            else if (catId !== 'all') filtered = items.filter(m => m.category_id == catId);
            grid.innerHTML = '';
            if (!filtered.length) grid.innerHTML = '<div style="color:#666; font-size:12px;">No items here.</div>';
            filtered.forEach(m => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'background:#000; border-radius:4px; border:1px solid #ccc; position:relative; height:120px; overflow:hidden;';
                const img = document.createElement('img');
                img.src = __safeImageSrc(m.thumb_path + (m.updated_at ? `?t=${encodeURIComponent(m.updated_at)}` : ""));
                img.style.cssText = 'width:100%; height:100%; object-fit:contain;';
                const title = document.createElement('div');
                title.style.cssText = 'position:absolute; top:0; left:0; right:0; background:rgba(0,0,0,0.7); color:#fff; font-size:10px; padding:2px 4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center;';
                title.textContent = m.name || 'Untitled';
                wrap.appendChild(img);
                wrap.appendChild(title);
                grid.appendChild(wrap);
            });
        };
        const renderSidebar = () => {
            const side = div.querySelector('#miniProgressFolders');
            if (!side) return;
            let html = `
                <div class="folder-item active" data-cat="all" style="padding:6px; margin-bottom:2px;">📂 All Items</div>
                <div class="folder-item" data-cat="unsorted" style="padding:6px; margin-bottom:2px;">📁 Unsorted</div>
                <hr style="margin:6px 0; border:0; border-top:1px solid #ddd;">
            `;
            try {
                const categories = Array.from(div.querySelectorAll('.save-folder-check')).map(cb => {
                    const span = cb.nextElementSibling;
                    return { id: cb.value, name: span ? span.textContent.replace('📁 ', '') : '' };
                }).filter(c => c.id != "0");
                categories.forEach(c => {
                    html += `<div class="folder-item" data-cat="${c.id}" style="padding:6px; margin-bottom:2px;">📁 ${__escapeHtml(c.name)}</div>`;
                });
            } catch(e){}
            side.innerHTML = html;
            side.querySelectorAll('.folder-item').forEach(el => {
                el.onclick = () => {
                    side.querySelectorAll('.folder-item').forEach(x => x.classList.remove('active'));
                    el.classList.add('active');
                    renderGrid(el.dataset.cat);
                };
            });
        };
        renderSidebar();
        renderGrid('all');
    });

  

    const nameInput = div.querySelector("#progressNameInput");
    const keysInput = div.querySelector("#progressKeywordsInput");
    setTimeout(() => nameInput.focus(), 50);

    if (window._tempSaveName !== undefined) nameInput.value = window._tempSaveName;
    if (window._tempSaveKeys !== undefined) keysInput.value = window._tempSaveKeys;
    window._tempSaveName = undefined;
    window._tempSaveKeys = undefined;

    const createFolderBtn = div.querySelector('.btn-create-folder-inline');
    if (createFolderBtn) {
        createFolderBtn.onclick = (e) => {
            e.preventDefault();
            const fd = document.createElement('div');
            fd.className = 'custom-dialog-overlay open';
            fd.style.zIndex = '10005';
            fd.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 300px;">
                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">New Folder</h3>
                    <input type="text" id="inlineFolderInput" class="settings-input" style="width:100%; margin-bottom:15px;" placeholder="Folder Name" autocomplete="off">
                    <div class="dialog-actions">
                        <button type="button" class="btn-cancel" id="inlineCancelFolder">Cancel</button>
                        <button type="button" class="btn-cancel" id="inlineConfirmFolder">Create</button>
                    </div>
                </div>`;
            document.body.appendChild(fd);
            setTimeout(() => fd.querySelector('#inlineFolderInput').focus(), 50);
            fd.querySelector('#inlineCancelFolder').onclick = () => fd.remove();
            fd.querySelector('#inlineConfirmFolder').onclick = async () => {
                const newName = fd.querySelector('#inlineFolderInput').value.trim();
                if(newName) {
                    await fetch('/api/categories', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:newName, type:'progress'}) });
                    window._tempSaveName = div.querySelector('#progressNameInput').value;
                    window._tempSaveKeys = div.querySelector('#progressKeywordsInput').value;
                    fd.remove(); div.remove(); saveProgressDialog();
                }
            };
        };
    }

    div.querySelector("#cancelProgressSave").onclick = () => div.remove();

    div.querySelector("#openProgressLoad").onclick = () => {
        div.remove();
        window.openProgressOverlay();
    };

    div.querySelector("#confirmProgressSave").onclick = async () => {
        const name = (nameInput.value || "").trim() || "Untitled";
        const keywords = keysInput.value.trim();
        const categories = Array.from(div.querySelectorAll('.save-folder-check:checked')).map(cb => cb.value);

        div.remove();
        await saveProgressToServer(name, keywords, categories);
    };
}
async function doLogout() {

        window._currentMemeState = null;

        if (window.location.protocol === "file:") {
            window.location.href = "index.html";
            return;
        }

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "same-origin"
            });
        } catch (e) {
        }

        window.location.href = "index.html";
    }

    function openLogoutConfirmDialog() {
        const d = document.createElement("div");
        d.className = "custom-dialog-overlay open";
        d.style.zIndex = "10000";

        d.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 340px; text-align: center; position: relative;">
            <button type="button" class="logout-close-x" title="Close" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#c0392b; font-size:20px; line-height:1; font-weight:bold; cursor:pointer;">&times;</button>
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Log Out</h3>
            <p>Are you sure you want to logout without saving?</p>
           <div class="dialog-actions" style="display: flex; flex-direction: column; gap: 10px;">
                <button type="button" class="btn-public" id="logoutSaveMemeBtn" style="width:100%; background-color:#d1c4e9; color:#4a148c; border:none; box-shadow:none;">Save as meme</button>
                <button type="button" class="btn-public" id="logoutSaveTemplateBtn" style="width:100%; background-color:#b2dfdb; color:#00695c; border:none; box-shadow:none;">Save as template</button>
                <button type="button" class="btn-public" id="logoutDownloadBtn" style="width:100%; background-color:#bbdefb; color:#0d47a1; border:none; box-shadow:none;">Download to computer</button>
                <button type="button" class="btn-cancel" id="logoutNowBtn" style="width:100%; background:#fff0f0; color:#c0392b; border:1px solid #c0392b; font-weight:800; transition: background-color 0.2s; cursor: pointer;">Logout</button>

            </div>
        </div>
    `;
        document.body.appendChild(d);

        d.querySelector(".logout-close-x").onclick = () => d.remove();

        d.querySelector("#logoutSaveMemeBtn").onclick = () => {
            d.remove();
            overlay.dataset.logoutAfterClose = "true";
            overlay.dataset.closeOnSave = "true";
            if (btnSave) btnSave.click();
        };

        d.querySelector("#logoutSaveTemplateBtn").onclick = () => {
            d.remove();
            overlay.dataset.logoutAfterClose = "true";
            overlay.dataset.closeOnSave = "true";
            if (btnSaveTemplate) btnSaveTemplate.click();
        };

        d.querySelector("#logoutDownloadBtn").onclick = () => {
            d.remove();
            overlay.dataset.logoutAfterClose = "true";
            if (btnDownload) btnDownload.click();
        };


        d.querySelector("#logoutNowBtn").onclick = async () => {
            d.remove();
            await doLogout();
        };
    }



window._toggleBanView = (btn) => {
            const root = btn.closest('div').nextElementSibling;
            const banView = root.querySelector('.banned-view');
            const banList = root.querySelector('.banned-list');
            const catView = root.querySelector('.cat-view');
            const isBanned = banView.style.display !== 'none';
            
            if (isBanned) {
                banView.style.display = 'none';
                if(banList) banList.style.display = 'none';
                catView.style.display = 'block';
                btn.textContent = 'Banned Keywords';
                btn.style.color = '#c0392b';
            } else {
                banView.style.display = 'block';
                if(banList) banList.style.display = 'grid';
                catView.style.display = 'none';
                btn.textContent = 'Show Categories';
                btn.style.color = '#1976d2';
            }
        };

    // One-time init listeners
    if (!overlay._memeInit) {
        window.addEventListener("resize", () => drawPreview());
        setupGlobalHistory(); // Initialize the global listener
        
        // Timeline Scroll Listener
        const feedEl = overlay.querySelector('.timeline-feed-container');
        if (feedEl) {
            feedEl.addEventListener('scroll', () => {
                if (feedEl.scrollTop + feedEl.clientHeight >= feedEl.scrollHeight - 100) {
                    if (!window._timelineLoading) {
                        window._timelineOffset = (window._timelineOffset || 0) + 50;
                        
                        // Add spinner logic
                        const spinner = document.createElement('div');
                        spinner.className = 'timeline-spinner';
                        spinner.style.cssText = 'text-align:center; padding:20px; width:100%; color:#666;';
                        spinner.textContent = 'Loading more...';
                        feedEl.appendChild(spinner);
                        
                        loadTimelineFeed(true);
                    }
                }
            });
        }

        overlay._memeInit = true;

if (stage) {
    stage.addEventListener("mousedown", (e) => {
        if (!state.advancedMode) return;
        if (state.cropMode) return;
        if (state.cutMode) return;
        if (state.lassoMode) return; // Prevent deselection if Lasso is on

const clickedEmptyStage =
    e.target === stage ||
    e.target === canvas ||
    e.target === layer ||
    e.target.classList.contains("meme-creator-viewport") ||
    e.target.classList.contains("meme-creator-canvas-wrap");

if (!clickedEmptyStage) return;

        state.selectedImageIdx = null;
        state.selectedShapeId = null;
        state.selectedTextId = null;
        state.multiSelected = [];
        state.multiSelectMode = false;
        
        const btnMulti = document.querySelector(".meme-multiselect-btn");
        if (btnMulti) btnMulti.classList.remove("active");

        if (opacityControl && opacityInput) {
            opacityControl.style.opacity = "0.5";
            opacityControl.style.pointerEvents = "none";
            opacityInput.disabled = true;
        }

        drawPreview();
        syncTextLayer();
    });
}


if (btnShapes) btnShapes.addEventListener("click", (e) => {
            e.preventDefault();
            if (shapePicker) shapePicker.style.display = "block";
        });

        if (shapePickerClose) shapePickerClose.addEventListener("click", (e) => {
            e.preventDefault();
            if (shapePicker) shapePicker.style.display = "none";
        });

        // Tab Logic
        const tabShapes = overlay.querySelector('#tabShapes');
        const tabEmotes = overlay.querySelector('#tabEmotes');
        const viewShapes = overlay.querySelector('#viewShapes');
        const viewEmotes = overlay.querySelector('#viewEmotes');
        const viewMoreEmotes = overlay.querySelector('#viewMoreEmotes');
        const btnMoreEmotes = overlay.querySelector('#btnMoreEmotes');
        const searchMoreEmotes = overlay.querySelector('#searchMoreEmotes');
        const gridMoreEmotes = overlay.querySelector('#gridMoreEmotes');

        // Enable horizontal scrolling with mouse wheel
        [viewShapes, viewEmotes].forEach(el => {
            if (!el) return;
            el.addEventListener('wheel', (e) => {
                // Only hijack if content overflows horizontally
                if (el.scrollWidth > el.clientWidth) {
                    e.preventDefault();
                    e.stopPropagation();
                    el.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        });

        if(tabShapes && tabEmotes) {
            tabShapes.onclick = (e) => { 
                e.preventDefault(); 
                viewShapes.style.display = 'grid'; 
                viewEmotes.style.display = 'none';
                if (viewMoreEmotes) viewMoreEmotes.style.display = 'none';
                tabShapes.style.borderBottomColor = '#e67e22'; tabShapes.style.color = '#000';
                tabEmotes.style.borderBottomColor = 'transparent'; tabEmotes.style.color = '#999';
            };
            tabEmotes.onclick = (e) => { 
                e.preventDefault(); 
                viewShapes.style.display = 'none'; 
                viewEmotes.style.display = 'grid';
                if (viewMoreEmotes) viewMoreEmotes.style.display = 'none';
                tabShapes.style.borderBottomColor = 'transparent'; tabShapes.style.color = '#999';
                tabEmotes.style.borderBottomColor = '#e67e22'; tabEmotes.style.color = '#000';
            };
        }

        const renderMoreEmotes = (filter = '') => {
            if (!gridMoreEmotes) return;
            gridMoreEmotes.replaceChildren();
            const term = filter.toLowerCase();
            
            for (const cat of EMOJI_CATEGORIES) {
                const emojis = cat.list.split(' ');
                for (const em of emojis) {
                    const keywords = EMOJI_KEYWORDS[em] || '';
                    if (!term || keywords.includes(term)) {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.dataset.text = em;
                        btn.style.cssText = 'height:40px; font-size:24px; border:1px solid #ddd; background:#fff; cursor:pointer;';
                        btn.textContent = em;
                        gridMoreEmotes.appendChild(btn);
                    }
                }
            }
        };

        if (btnMoreEmotes) {
            btnMoreEmotes.onclick = (e) => {
                e.preventDefault();
                viewEmotes.style.display = 'none';
                viewMoreEmotes.style.display = 'flex';
                renderMoreEmotes();
                setTimeout(() => searchMoreEmotes.focus(), 50);
            };
        }

        if (searchMoreEmotes) {
            searchMoreEmotes.oninput = (e) => renderMoreEmotes(e.target.value);
        }

        if (gridMoreEmotes) {
            gridMoreEmotes.onclick = (e) => {
                const btn = e.target.closest('button[data-text]');
                if (!btn) return;
                e.preventDefault();
                const eText = btn.getAttribute("data-text");
                const id = "emoji_" + Date.now();
                state.shapes = state.shapes || [];
                state.shapes.push({
                    id: id,
                    type: 'emoji',
                    text: eText,
                    x: 0.4, y: 0.4, w: 0.15, h: 0.15,
                    rotation: 0,
                    opacity: 1,
                    zIndex: state.nextZIndex++
                });
                state.selectedShapeId = id;
                state.selectedImageIdx = null;
                state.selectedTextId = null;
                if (shapePicker) shapePicker.style.display = "none";
                drawPreview();
                syncTextLayer();
                saveHistory();
            };
        }

        // Unified Shape/Emote Picker
        const allPickers = overlay.querySelectorAll(".meme-shapes-picker button[data-shape], .meme-shapes-picker button[data-text]");
        if (allPickers) {
            allPickers.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const sType = btn.getAttribute("data-shape");
                    const eText = btn.getAttribute("data-text");

                    if (sType) {
                        // Add Vector Shape
                        const id = "shape_" + Date.now();
                        state.shapes = state.shapes || [];
                        state.shapes.push({
                            id: id,
                            type: sType,
                            x: 0.35, y: 0.35, w: 0.3, h: 0.3,
                            color: "#000000",
                            strokeWidth: 5,
                            zIndex: state.nextZIndex++
                        });
                        state.selectedShapeId = id;
                        state.selectedImageIdx = null;
                        state.selectedTextId = null;
                    } 
                    else if (eText) {
                        // Add Emoticon (as Shape/Picture Layer)
                        const id = "emoji_" + Date.now();
                        state.shapes = state.shapes || [];
                        state.shapes.push({
                            id: id,
                            type: 'emoji',
                            text: eText,
                            x: 0.4, y: 0.4, w: 0.15, h: 0.15,
                            rotation: 0,
                            opacity: 1,
                            zIndex: state.nextZIndex++
                        });
                        state.selectedShapeId = id;
                        state.selectedImageIdx = null;
                        state.selectedTextId = null;
                    }
                    
                    if (shapePicker) shapePicker.style.display = "none";
                    drawPreview();
                    syncTextLayer();
                    saveHistory();
                });
            });
        }



        // Drag Visual Feedback
        ['dragenter', 'dragover'].forEach(evt => {
            stage.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
                layer.classList.add("drag-active");
            });
        });

        stage.addEventListener("dragleave", (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Prevent flickering when dragging over child elements (like the canvas)
            if (e.relatedTarget && stage.contains(e.relatedTarget)) return;
            layer.classList.remove("drag-active");
        });

        stage.addEventListener("drop", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            layer.classList.remove("drag-active");

            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
                
                for (const f of files) {
                    const img = await loadImageFromFile(f);
                    
                    // Add to state
                    const imgObj = { file: f, img: img };
                    
                    // If dropping in advanced mode, position under mouse
                    if (state.advancedMode) {
                        const rect = layer.getBoundingClientRect();
                        const scale = state._displayScale || 1;
                        
                        // Center image on mouse position
                        const w = 266; // Default width
                        const h = 266 / (img.width / img.height);
                        
                        imgObj.w = w;
                        imgObj.h = h;
                        imgObj.x = (e.clientX - rect.left) / scale - (w / 2);
                        imgObj.y = (e.clientY - rect.top) / scale - (h / 2);
                    }

                    imgObj.zIndex = state.nextZIndex++;
                    state.images.push(imgObj);
                    if (state.sourceFiles) state.sourceFiles.push(f);
                }
                
                syncTextLayer();
                drawPreview();
                saveHistory();
            }
        });

        btnClose.addEventListener("click", async (e) => {
    e.preventDefault();

    const hasContent =
        state.images.length > 0 ||
        state.texts.length > 0 ||
        (state.shapes && state.shapes.length > 0);

    if (hasContent) {
        openLogoutConfirmDialog();
        return;
    }

    await doLogout();
});


        // 1. Slider Functionality
        const sliderControl = overlay.querySelector('.timeline-slider-control');
        const tmSlider = overlay.querySelector(".timeline-zoom-slider");
        
        if (tmSlider) {
            tmSlider.oninput = (e) => {
                const val = e.target.value;
                const posts = timelineView.querySelectorAll(".timeline-post");
                posts.forEach(p => {
                    p.style.maxWidth = val + "px";
                    const img = p.querySelector('.timeline-img');
                    if (img) img.style.maxHeight = (val * 1.25) + "px";
                });
            };
        }

        // 2. Toggle Logic 
if (btnTimeline) btnTimeline.addEventListener("click", (e) => {
    e.preventDefault();

    const isTimeline = timelineView && timelineView.classList.contains("is-flex");

    if (isTimeline) {
        box.classList.remove("timeline-mode");

        if (sliderControl) sliderControl.classList.add("is-hidden");
        if (timelineView) {
            timelineView.classList.add("is-hidden");
            timelineView.classList.remove("is-flex");
        }
        if (splitView) {
            splitView.classList.remove("is-hidden");
            splitView.classList.add("is-flex");
        }

        btnTimeline.textContent = "🌎 Timeline";
        btnTimeline.classList.remove("btn-editor");
        btnTimeline.classList.add("btn-timeline");

        localStorage.setItem("mc_viewMode", "editor");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                try { drawPreview(); } catch (e) {}
            });
        });
    } else {
        // Switch to Timeline
        box.classList.add("timeline-mode");

        if (sliderControl) {
            sliderControl.classList.remove("is-hidden");
            sliderControl.classList.add("is-flex");
        }
        if (timelineView) {
            timelineView.classList.remove("is-hidden");
            timelineView.classList.add("is-flex");
        }
        if (splitView) {
            splitView.classList.add("is-hidden");
            splitView.classList.remove("is-flex");
        }

        btnTimeline.textContent = "✏️ Editor";
        btnTimeline.classList.remove("btn-timeline");
        btnTimeline.classList.add("btn-editor");

        loadTimelineFeed();
        localStorage.setItem("mc_viewMode", "timeline");
    }
});


        window.setTimelineSort = (btn, mode) => {
            window._timelineSortMode = mode;
            // Update UI
            const sidebar = btn.closest('.timeline-sidebar');
            if(sidebar) {
                sidebar.querySelectorAll('.btn-sidebar-link').forEach(b => {
                    b.classList.remove('active');
                    b.style.fontWeight = '600';
                    b.style.color = '#606770';
                    b.style.background = 'none';
                });
            }
            btn.classList.add('active');
            btn.style.fontWeight = '700';
            btn.style.color = '#1c1e21';
            btn.style.background = '#e4e6eb';
            
            // Reload
            loadTimelineFeed();
        };

        async function loadTimelineFeed(isScroll = false) {
            const feedContainer = overlay.querySelector('.timeline-feed-container');
if (!feedContainer) return;
__ensureTimelineDelegation(feedContainer);

            
            if (window._timelineLoading) return;
            window._timelineLoading = true;

            // Initialize offset if fresh load
            if (!isScroll) {
                window._timelineOffset = 0;
                feedContainer.innerHTML = '<div style="text-align:center; padding:20px; width:100%;">Loading...</div>';
            } else {
                // If scrolling, check if we need to prune memory (max 200 items)
                const posts = feedContainer.querySelectorAll('.timeline-post');
                if (posts.length >= 200) {
                    // Remove top 50 to maintain buffer while loading next 50
                    for (let i = 0; i < 50; i++) {
                        if (posts[i]) posts[i].remove();
                    }
                }
            }
            
            // Collect checked categories (Blue)
            const checks = Array.from(overlay.querySelectorAll('.timeline-sidebar .cat-check:checked'));
            const catValues = checks.map(c => c.value).join(',');

            // Collect excluded categories (Red)
            const excludes = Array.from(overlay.querySelectorAll('.timeline-sidebar .cat-exclude:checked'));
            const exValues = excludes.map(c => c.value).join(',');

            // Update UI Strikethroughs
            overlay.querySelectorAll('.timeline-sidebar .cat-text').forEach(el => el.classList.remove('excluded'));
            excludes.forEach(el => {
                const row = el.closest('.cat-row');
                if(row) row.querySelector('.cat-text').classList.add('excluded');
            });

           try {
                // Construct URL cleanly using URLSearchParams
                const params = new URLSearchParams();
                if (catValues) params.append('categories', catValues);
                if (exValues) params.append('excludes', exValues);
                
                const bannedArea = document.getElementById('bannedKeywordsInput');
                if (bannedArea && bannedArea.value.trim()) params.append('banned', bannedArea.value.trim());

                if (window._timelineKeyword) params.append('keyword', window._timelineKeyword);
                if (window._timelineAuthorId) params.append('author_id', window._timelineAuthorId);
                
                // Add Sort & Offset
                if (window._timelineSortMode) params.append('sort', window._timelineSortMode);
                params.append('offset', window._timelineOffset || 0);

                // Fetch with constructed query
                const res = await fetch(`/api/timeline?${params.toString()}`);
                const data = await res.json();
                
                window._timelineLoading = false;


let headerHtml = '';
if (window._timelineKeyword) {
    headerHtml = `
    <div style="position:-webkit-sticky; position:sticky; top:0; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.15); width:100%; max-width:${overlay.querySelector(".timeline-zoom-slider")?.value || 350}px; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; background:rgba(227, 242, 253, 0.70); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); padding:8px 12px; border-radius:6px; border:1px solid #90caf9; color:#1565c0; font-size:13px; font-weight:600;">
        <span>🔍 Searching: #${__escapeHtml(window._timelineKeyword)}</span>
        <button type="button" data-action="clearTagFilter" style="background:none; border:none; color:#c62828; cursor:pointer; font-weight:800; font-size:12px;">✕ Clear</button>
    </div>`;
}


                if (!data.success || !data.posts || data.posts.length === 0) {
                    feedContainer.innerHTML = headerHtml + '<div style="text-align:center; padding:40px; color:#666;">No posts found.</div>';
                    return;
                }
                const s = overlay.querySelector(".timeline-zoom-slider");
                const sizeVal = s ? s.value + "px" : "350px";

                if (!isScroll && headerHtml) {
                    const headerDiv = document.createElement('div');
                    headerDiv.innerHTML = headerHtml;
                    feedContainer.innerHTML = ''; 
                    feedContainer.appendChild(headerDiv.firstElementChild);
                } else if (!isScroll) {
                    feedContainer.innerHTML = '';
                } else {
                    const spinner = feedContainer.querySelector('.timeline-spinner');
                    if (spinner) spinner.remove();
                }

const frag = document.createDocumentFragment();

data.posts.forEach(p => {
    const dateText = new Date(p.created_at).toLocaleDateString();

    const avatarPathRaw = (p.author_avatar || '').trim();
    const avatarPath = __safeImageSrc(avatarPathRaw);

    const imgSrc = __safeImageSrc(p.image_path);

    const isRepost = (p.original_post_id_resolved && p.original_post_id_resolved != p.id);
    const origUid = (p.original_user_id_resolved || p.user_id);
    const origName = (p.original_author_name || p.author_name || 'Unknown');

    const post = document.createElement('div');
    post.className = 'timeline-post';
    post.style.maxWidth = `${sizeVal}`;

    if (p.user_id === data.currentUserId) {
        const del = document.createElement('button');
        del.className = 'timeline-delete-btn';
        del.dataset.action = 'deletePost';
        del.dataset.postId = String(p.id);
        del.textContent = '×';
        post.appendChild(del);
    }

    const header = document.createElement('div');
    header.className = 'timeline-header';

    const avatar = document.createElement('div');
    avatar.className = 'timeline-avatar';
    avatar.style.cursor = 'pointer';
    avatar.dataset.action = 'openProfile';
    avatar.dataset.userId = String(p.user_id);
    avatar.title = 'View Profile';

    if (avatarPath) {
        const img = document.createElement('img');
        img.src = avatarPath;
        img.alt = '';
        img.loading = 'lazy';
        avatar.appendChild(img);
    } else {
        const initial = (p.author_name || 'U')[0].toUpperCase();
        avatar.textContent = initial;
    }

    header.appendChild(avatar);

    const nameBlock = document.createElement('div');

    const author = document.createElement('div');
    author.className = 'timeline-author-name';
    author.dataset.action = 'openProfile';
    author.dataset.userId = String(p.user_id);
    author.style.cursor = 'pointer';
    author.textContent = (p.author_name || 'Unknown');

    if (isRepost) {
        const repIcon = document.createElement('span');
        repIcon.title = 'Repost';
        repIcon.style.fontSize = '13px';
        repIcon.style.color = '#2e7d32';
        repIcon.textContent = '↪';
        author.appendChild(document.createTextNode(' '));
        author.appendChild(repIcon);
    }

    nameBlock.appendChild(author);

    if (isRepost) {
        const repostLine = document.createElement('div');
        repostLine.className = 'timeline-repost-line';
        repostLine.appendChild(document.createTextNode('Reposted from '));

        const origSpan = document.createElement('span');
        origSpan.style.fontWeight = '700';
        origSpan.style.cursor = 'pointer';
        origSpan.dataset.action = 'filterAuthor';
        origSpan.dataset.userId = String(origUid);
        origSpan.dataset.authorName = String(origName);
        origSpan.textContent = String(origName);

        repostLine.appendChild(origSpan);
        nameBlock.appendChild(repostLine);
    }

    const date = document.createElement('div');
    date.style.fontSize = '11px';
    date.style.color = '#65676b';
    date.textContent = dateText;
    nameBlock.appendChild(date);

    header.appendChild(nameBlock);

    const isFollowing = !!p.is_following;
    if (p.user_id !== data.currentUserId) {
        const right = document.createElement('div');
        right.style.marginLeft = 'auto';
        right.style.display = 'flex';
        right.style.alignItems = 'center';
        right.style.gap = '4px';

        const ban = document.createElement('button');
        ban.className = 'timeline-ban-btn';
        ban.title = 'Ban Creator';
        ban.dataset.action = 'banUser';
        ban.dataset.userId = String(p.user_id);
        ban.textContent = '🚫';

        const follow = document.createElement('button');
        follow.className = `timeline-follow-btn ${isFollowing ? 'following' : ''}`.trim();
        follow.title = isFollowing ? 'Unfollow' : 'Follow Creator';
        follow.dataset.action = 'followUser';
        follow.dataset.userId = String(p.user_id);
        follow.textContent = isFollowing ? '✓' : '＋';

        right.appendChild(ban);
        right.appendChild(follow);
        header.appendChild(right);
    }

    post.appendChild(header);

    const imgEl = document.createElement('img');
    imgEl.className = 'timeline-img';
    imgEl.loading = 'lazy';
    imgEl.src = imgSrc;
    imgEl.style.cursor = 'zoom-in';
    imgEl.style.maxHeight = `calc(${sizeVal} * 1.25)`;
    imgEl.dataset.action = 'openImage';
    imgEl.dataset.src = imgSrc;
    post.appendChild(imgEl);

    const footer = document.createElement('div');
    footer.className = 'timeline-footer';

    if (p.category) {
        const cat = document.createElement('div');
        cat.style.display = 'inline-block';
        cat.style.background = '#e8f5e9';
        cat.style.color = '#2e7d32';
        cat.style.padding = '2px 8px';
        cat.style.borderRadius = '10px';
        cat.style.fontSize = '10px';
        cat.style.fontWeight = '700';
        cat.style.textTransform = 'uppercase';
        cat.style.marginBottom = '8px';
        cat.textContent = String(p.category);
        footer.appendChild(cat);
    }

    if (p.keywords) {
        const tags = String(p.keywords).split(',').map(k => k.trim()).filter(Boolean);
        tags.forEach(t => {
            const tagRaw = String(t).trim().toLowerCase();

            const sp = document.createElement('span');
            sp.dataset.action = 'filterTag';
            sp.dataset.tag = tagRaw;
            sp.style.fontSize = '11px';
            sp.style.color = '#1976d2';
            sp.style.marginLeft = '6px';
            sp.style.cursor = 'pointer';
            sp.style.textDecoration = 'underline';
            sp.title = `Filter by #${tagRaw}`;
            sp.textContent = `#${tagRaw}`;

            footer.appendChild(sp);
        });
    }

    const actions = document.createElement('div');
    actions.className = 'timeline-actions';

    const like = document.createElement('button');
    like.className = 'timeline-btn';
    like.dataset.action = 'likePost';
    like.dataset.postId = String(p.id);
    like.textContent = `❤️ ${p.likes || 0}`;

    const share = document.createElement('button');
    share.className = 'timeline-btn';
    share.dataset.action = 'repostPost';
    share.dataset.postId = String(p.id);
    share.textContent = '↪ Share';

    const save = document.createElement('button');
    save.className = 'timeline-btn';
    save.dataset.action = 'savePost';
    save.dataset.src = imgSrc;
    save.textContent = '⬇️ Save';

    const remix = document.createElement('button');
    remix.className = 'timeline-btn';
    remix.dataset.action = 'remixPost';
    remix.dataset.src = imgSrc;
    remix.style.marginLeft = 'auto';
    remix.textContent = '💫 Remix';

    actions.appendChild(like);
    actions.appendChild(share);
    actions.appendChild(save);
    actions.appendChild(remix);

    footer.appendChild(actions);
    post.appendChild(footer);

    frag.appendChild(post);
});

feedContainer.appendChild(frag);


           } catch (e) {
                window._timelineLoading = false;
                const feedContainer = overlay.querySelector('.timeline-feed-container');
                if (feedContainer) feedContainer.innerHTML = '<div style="text-align:center; color:red;">Failed to load timeline.</div>';
            }
        }

// 3. Bind Sidebar Category Checkboxes (Blue and Red)
       const bindTimelineChecks = () => {
            const bannedInput = document.getElementById('bannedKeywordsInput');
            const banEntry = document.getElementById('banEntryInput');
            const banList = overlay.querySelector('.banned-list');
            const btnBanAdd = document.getElementById('btnBanAdd');

            const saveTimelinePrefs = () => {
                const ex = Array.from(overlay.querySelectorAll('.cat-exclude:checked')).map(c=>c.value).join(',');
                const ban = bannedInput ? bannedInput.value : '';
                fetch('/api/prefs/timeline', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({excludes:ex, banned:ban}) }).catch(()=>{});
            };

           const renderBannedTags = () => {
                if(!bannedInput || !banList) return;
                const tags = bannedInput.value.split(',').map(t => t.trim()).filter(Boolean);

                banList.innerHTML = '';


                tags.forEach((t) => {
                    const row = document.createElement('div');
                    row.className = 'ban-row';
                    row.style.cssText = "display:flex; align-items:center; justify-content:space-between; background:#fff; border:1px solid #eee; border-radius:4px; padding:2px 4px; font-size:10px; color:#c0392b; font-weight:600; overflow:hidden;";

                    const label = document.createElement('span');
                    label.style.cssText = "white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
                    label.textContent = t;

                    const x = document.createElement('span');
                    x.className = 'ban-x';
                    x.style.cssText = "cursor:pointer; color:#999; font-weight:bold; padding-left:2px;";
                    x.title = "Remove";
                    x.textContent = '×';
                    x.addEventListener('click', () => window._removeBanTag(t));

                    row.appendChild(label);
                    row.appendChild(x);
                    banList.appendChild(row);
                });
            };


            window._removeBanTag = (tag) => {
                const tags = bannedInput.value.split(',').map(t=>t.trim()).filter(Boolean);
                const newTags = tags.filter(t => t !== tag);
                bannedInput.value = newTags.join(',');
                renderBannedTags();
                saveTimelinePrefs();
                loadTimelineFeed();
            };

            const addBan = () => {
                const val = banEntry.value.trim();
                if(!val) return;
                const tags = bannedInput.value.split(',').map(t=>t.trim()).filter(Boolean);
                if(!tags.includes(val)) {
                    tags.push(val);
                    bannedInput.value = tags.join(',');
                    renderBannedTags();
                    saveTimelinePrefs();
                    loadTimelineFeed();
                }
                banEntry.value = '';
            };

            if (btnBanAdd) btnBanAdd.onclick = addBan;
            if (banEntry) banEntry.onkeydown = (e) => { if(e.key === 'Enter') addBan(); };

            // NSFW confirm dialog (Always vs Until I log out)
            const nsfwGate = overlay.querySelector('.nsfw-confirm-overlay');
            let nsfwPending = null;

            const setNsfwTemp = (enabled) => {
                fetch('/api/prefs/timeline/nsfw-temp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ enabled: !!enabled })
                }).catch(()=>{});
            };

            const openNsfwDialog = (cb) => {
                if (!nsfwGate) { cb('always'); return; }
                nsfwPending = cb;
                nsfwGate.style.display = 'flex';
            };

            if (nsfwGate) {
                const btnAlways = nsfwGate.querySelector('.nsfw-always');
                const btnUntil = nsfwGate.querySelector('.nsfw-until-logout');
                const btnCancel = nsfwGate.querySelector('.nsfw-cancel');

                const close = (mode) => {
                    nsfwGate.style.display = 'none';
                    const fn = nsfwPending;
                    nsfwPending = null;
                    if (fn) fn(mode);
                };

                nsfwGate.onclick = (e) => { if (e.target === nsfwGate) close('cancel'); };
                if (btnAlways) btnAlways.onclick = () => close('always');
                if (btnUntil) btnUntil.onclick = () => close('temp');
                if (btnCancel) btnCancel.onclick = () => close('cancel');
            }

// Blue Checks
            overlay.querySelectorAll('.timeline-sidebar .cat-check').forEach(chk => {
                chk.onchange = () => {
                    if (chk.value === 'nsfw' && chk.checked) {
                        const row = chk.closest('.cat-row');
                        const red = row ? row.querySelector('.cat-exclude') : null;

                        chk.checked = false;

                        openNsfwDialog((mode) => {
                            if (mode === 'cancel') {
                                if (red) red.checked = true;
                                loadTimelineFeed();
                                return;
                            }

                            chk.checked = true;
                            if (red) red.checked = false;

                            if (mode === 'always') {
                                setNsfwTemp(false);
                                saveTimelinePrefs();
                            } else {
                                setNsfwTemp(true);
                            }

                            loadTimelineFeed();
                        });
                        return;
                    }

                    if (chk.checked) {
                        const row = chk.closest('.cat-row');
                        const red = row.querySelector('.cat-exclude');
                        if (red && red.checked) { red.checked = false; saveTimelinePrefs(); }
                    }
                    loadTimelineFeed();
                };
            });

            // Red Checks
            overlay.querySelectorAll('.timeline-sidebar .cat-exclude').forEach(chk => {
                chk.onchange = () => {
                    if (chk.value === 'nsfw' && !chk.checked) {
                        chk.checked = true;

                        openNsfwDialog((mode) => {
                            if (mode === 'cancel') return;

                            chk.checked = false;

                            if (mode === 'always') {
                                setNsfwTemp(false);
                                saveTimelinePrefs();
                            } else {
                                setNsfwTemp(true);
                            }

                            loadTimelineFeed();
                        });
                        return;
                    }

                    if (chk.checked) {
                        const row = chk.closest('.cat-row');
                        const blue = row.querySelector('.cat-check');
                        if (blue && blue.checked) blue.checked = false;
                    }

                    if (chk.value === 'nsfw' && chk.checked) setNsfwTemp(false);

                    saveTimelinePrefs();
                    loadTimelineFeed();
                };
            });


            return renderBannedTags; 
        };
        
        const renderBans = bindTimelineChecks();

       // Load Saved Prefs
        fetch('/api/prefs/timeline').then(r=>r.json()).then(d=>{
            if(d.success) {
                const exStr = (d.excludes !== undefined && d.excludes !== null) ? d.excludes : '';
                const arr = exStr.split(',').map(s => s.trim()).filter(Boolean);

                overlay.querySelectorAll('.cat-exclude').forEach(chk => {
                    const isExcluded = arr.includes(chk.value);
                    chk.checked = isExcluded;
                    
                    if (isExcluded) {
                        const row = chk.closest('.cat-row');
                        const blue = row ? row.querySelector('.cat-check') : null;
                        if(blue) blue.checked = false;
                    }
                });
                
                if (d.banned && document.getElementById('bannedKeywordsInput')) {
                    document.getElementById('bannedKeywordsInput').value = d.banned;
                    if(renderBans) renderBans(); 
                }
                
                if(overlay.querySelector('.timeline-mode')) loadTimelineFeed();
            }
        }).catch(()=>{});


// Global Remix Handler
        window.remixPost = async (url) => {
            try {
                showToast("Loading image...");
                const res = await fetch(url);
                const blob = await res.blob();
                const file = new File([blob], "remix.png", { type: "image/png" });
                const img = await loadImageFromFile(file);

                state.images.push({ file, img, zIndex: state.nextZIndex++ });

                // Switch View back to Editor
                if (btnTimeline) btnTimeline.click();

                drawPreview();
                syncTextLayer();
            } catch (e) {
                console.error(e);
                showToast("Failed to load remix.");
            }
        };

                // Global Like Handler
        window.likePost = async (btn, id) => {
            if (btn.classList.contains('liked')) return;
            try {
                await fetch('/api/timeline/like', {
                    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id})
                });
                btn.classList.add('liked');
                const count = parseInt(btn.textContent.split(' ')[1] || 0) + 1;
                btn.textContent = `❤️ ${count}`;
            } catch(e) {}
        };

        // Global Repost (Share) Handler
        window.repostPost = async (id) => {
            try {
                const res = await fetch('/api/timeline/repost', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ id })
                });
                const d = await res.json();

                if (d && d.success) {
                    showToast("Reposted!");
                    window._timelineOffset = 0;
                    loadTimelineFeed(false);
                } else {
                    showToast((d && d.error) ? d.error : "Repost failed.");
                }
            } catch(e) {
                showToast("Repost failed.");
            }
        };


        // Global Follow Handler
        window.followUser = async (btn, author_id) => {
            try {
                const res = await fetch('/api/follow', {
                    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({author_id})
                });
                const d = await res.json();
                if(d.success) {
                   // Custom Silver Bubble Toast
                   const showSilver = (msg) => {
                        const b = document.createElement('div');
                        b.textContent = msg;
                        b.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#bdc3c7; background:linear-gradient(to bottom right, #fdfbfb, #bdc3c7); color:#1c1e21; border:1px solid #999; padding:14px 28px; border-radius:50px; font-weight:800; font-size:16px; box-shadow:0 5px 20px rgba(0,0,0,0.25); z-index:999999; pointer-events:none;";
                        document.body.appendChild(b);
                        setTimeout(() => { b.style.transition = "opacity 0.3s"; b.style.opacity = "0"; setTimeout(() => b.remove(), 300); }, 1000);
                   };

                   if(d.following) {
                        btn.classList.add('following');
                        btn.textContent = '✓';
                        btn.title = 'Unfollow';
                        btn.style.background = ''; 
                        showSilver("Followed!");
                    } else {
                        btn.classList.remove('following');
                        btn.textContent = '＋';
                        btn.title = 'Follow Creator';
                        btn.style.background = '';
                        showSilver("Unfollowed");
                    }
                }
            } catch(e) {}
        };

        if (btnCancel) btnCancel.addEventListener("click", (e) => { e.preventDefault(); closeEditor(); });
        if (btnPublish) btnPublish.addEventListener("click", (e) => { 
            e.preventDefault(); 
            
            const d = document.createElement('div');
            d.className = 'custom-dialog-overlay open';
            d.style.zIndex = '10000';
           d.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 340px; text-align: center; position: relative;">
                    <button type="button" class="pub-close-x" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#c0392b; font-size:20px; line-height:1; font-weight:bold; cursor:pointer;">&times;</button>
                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Publish Meme</h3>
                    <p>How would you like to proceed?</p>
                    <div class="dialog-actions" style="display: flex; flex-direction:column; gap:10px;">
                        <button type="button" class="btn-public" id="pubSaveMeme" style="width:100%; background-color:#d1c4e9; color:#4a148c; border:none; box-shadow:none;">Save As Meme Before Publishing</button>
                        <button type="button" class="btn-public" id="pubSaveTemp" style="width:100%; background-color:#b2dfdb; color:#00695c; border:none; box-shadow:none;">Save As Template Before Publishing</button>
                        <button type="button" class="btn-public" id="pubNoSave" style="width:100%; background-color:#bbdefb; color:#0d47a1; border:none; box-shadow:none;">Publish Without Saving</button>
                    </div>
                </div>`;
            document.body.appendChild(d);

            d.querySelector('.pub-close-x').onclick = () => d.remove();

            // 1. Save Meme -> Then Publish
            d.querySelector('#pubSaveMeme').onclick = () => {
                d.remove();
                overlay.dataset.publishOnSave = 'true';
                if(btnSave) btnSave.click(); // Triggers the name dialog
            };

            // 2. Save Template -> Then Publish
            d.querySelector('#pubSaveTemp').onclick = () => {
                d.remove();
                overlay.dataset.publishOnSave = 'true';
                if(btnSaveTemplate) btnSaveTemplate.click(); // Triggers the name dialog
            };

            // 3. Post to Timeline
            d.querySelector('#pubNoSave').onclick = () => {
                d.remove();
                // Open Category Selector Dialog
                const catD = document.createElement('div');
                catD.className = 'custom-dialog-overlay open';
                catD.style.zIndex = '10000';
                catD.innerHTML = `
                    <div class="custom-dialog-box" style="max-width:300px;">
                        <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Select Category</h3>
                        <label style="font-size:12px; color:#666; display:block; margin-bottom:6px;">Choose one category:</label>
                        <select id="pubCategory" class="settings-input" style="width:100%; margin-bottom:10px; height:36px;">
                            <optgroup label="Core">
                                <option value="general">General</option>
                                <option value="funny">Funny</option>
                                <option value="wholesome">Wholesome</option>
                                <option value="political">Political</option>
                            </optgroup>
                            <optgroup label="Culture & Interests">
                                <option value="animals">Animals</option>
                                <option value="gaming">Gaming</option>
                                <option value="movies_tv">Movies / TV</option>
                                <option value="music">Music</option>
                                <option value="sports">Sports</option>
                                <option value="anime">Anime / Manga</option>
                                <option value="comics">Comics</option>
                                <option value="books">Books</option>
                            </optgroup>
                            <optgroup label="Lifestyle">
                                <option value="work_school">Work / School</option>
                                <option value="tech_science">Tech / Science</option>
                                <option value="relationships">Relationships</option>
                                <option value="food">Food</option>
                                <option value="crafts">Crafts</option>
                                <option value="lgbtq">LGBTQ+</option>
                                <option value="nostalgia">Nostalgia</option>
                            </optgroup>
                        </select>

                        <label style="font-size:12px; color:#c0392b; display:flex; align-items:center; gap:6px; margin-bottom:12px; font-weight:700; cursor:pointer;">
                            <input type="checkbox" id="pubNsfw" style="accent-color:#c0392b;">
                            NSFW
                        </label>

                        <label style="font-size:12px; color:#666; display:block; margin-bottom:6px;">Add keywords (comma separated):</label>
                        <textarea id="pubKeywords" class="custom-dialog-textarea" style="min-height:50px; margin-bottom:15px;" placeholder="funny, dog, reaction"></textarea>

                        <div class="dialog-actions" style="display:flex; width:100%; gap:10px;">
                            <button class="btn-cancel" style="flex:1; cursor:pointer;" data-action="dlgClose">Cancel</button>
                            <button class="btn-public" id="pubConfirm" style="flex:1; background-color:#bbdefb; color:#0d47a1; border:none; box-shadow:none;">Post</button>
                        </div>
                    </div>`;
                document.body.appendChild(catD);
                
                catD.querySelector('#pubConfirm').onclick = async () => {
                    const category = catD.querySelector('#pubCategory').value;
                    const keywords = catD.querySelector('#pubKeywords').value.trim();
                    const isNsfw = catD.querySelector('#pubNsfw').checked;
                    catD.remove();
                    
                    const blob = await saveMeme("timeline");
                    if (!blob) return;

                    const fd = new FormData();
                    fd.append('meme', blob, 'post.png');
                    fd.append('category', category); 
                    fd.append('keywords', keywords);
                    fd.append('is_nsfw', isNsfw ? '1' : '0');

                    showToast("Posting...");
                    
                    try {
                        const res = await fetch('/api/timeline', { method:'POST', body:fd });
                        const data = await res.json();
                        if(data.success) {
                            showToast("Posted to Timeline!");
                            // Auto-switch to timeline view
                            if(btnTimeline) btnTimeline.click();
                            // Refresh feed to show new post
                            loadTimelineFeed();
                        } else {
                            showToast("Error: " + (data.error || "Failed"));
                        }
                    } catch(e) {
                        showToast("Network Error");
                    }
                };
            };
        });

        if (btnUndo) btnUndo.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevents global auto-save from overriding the undo
            if (state.historyStep > 0) {
                state.historyStep--;
                restoreHistory(state.historyStep);
            }
        };

        if (btnRedo) btnRedo.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevents global auto-save from overriding the redo
            if (state.historyStep < state.history.length - 1) {
                state.historyStep++;
                restoreHistory(state.historyStep);
            }
        };

        if (menuBtn) {
            menuBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                menuDrop.style.display = menuDrop.style.display === "none" ? "block" : "none";
            };
        }

        if (btnCheckUpdate) {
            btnCheckUpdate.onclick = (e) => {
                e.preventDefault();
                menuDrop.style.display = "none";
                if (window.api && window.api.checkForUpdate) {
                    window.api.checkForUpdate();
                } else {
                    alert("Update checking is not available.");
                }
            };
        }

        if (btnToggleCursor) {
            const isDefault = localStorage.getItem("mc_cursorDefault") === "true";
            if (isDefault) document.body.classList.add("default-button-cursor");
            btnToggleCursor.textContent = isDefault ? "Cursor: Regular" : "Cursor: Hand";

            btnToggleCursor.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const willBeDefault = !document.body.classList.contains("default-button-cursor");
                if (willBeDefault) {
                    document.body.classList.add("default-button-cursor");
                    localStorage.setItem("mc_cursorDefault", "true");
                    btnToggleCursor.textContent = "Cursor: Regular";
                } else {
                    document.body.classList.remove("default-button-cursor");
                    localStorage.setItem("mc_cursorDefault", "false");
                    btnToggleCursor.textContent = "Cursor: Hand";
                }
            };
        }

        if (btnUpgradePro) {
            btnUpgradePro.style.display = "block";
            btnUpgradePro.textContent = window._isGuestMode ? "Upgrade to Pro-Tools" : "Pro version";
            
            if (!window._isGuestMode) {
                fetch('/api/app-version')
                    .then(res => res.json())
                    .then(data => {
                        if (data.version) {
                            btnUpgradePro.textContent = `Pro version ${data.version}`;
                        }
                    })
                    .catch(err => console.error(err));
            }

            btnUpgradePro.style.cursor = window._isGuestMode ? "pointer" : "default";
            btnUpgradePro.onclick = (e) => {
                e.preventDefault();
                if (!window._isGuestMode) return;
            menuDrop.style.display = "none";
            const d = document.createElement('div');
                d.className = 'custom-dialog-overlay open';
                d.style.zIndex = '20000';
                d.innerHTML = `
                    <div class="custom-dialog-box" style="max-width: 320px; text-align: center;">
                        <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Upgrade to Pro-Tools</h3>
                        <p style="margin-bottom:15px; font-size:12px;">Enter your license key to unlock Advanced Mode.</p>
                        <input type="text" id="upgradeKeyInput" class="settings-input" style="width:100%; margin-bottom:10px; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;" placeholder="Paste key here">
                        <div id="upgradeMessage" style="font-size:12px; margin-bottom:10px; font-weight:bold; min-height:14px;"></div>
                        <div class="dialog-actions" style="display:flex; flex-direction:column; gap:8px;">
                            <button type="button" class="btn-public" id="btnVerifyUpgrade" style="width:100%; padding:10px; font-size:13px; font-weight:800; background:linear-gradient(135deg, #2e7d32, #1b5e20); color:#fff; border:none; border-radius:6px; box-shadow:0 4px 12px rgba(46, 125, 50, 0.3); text-transform:uppercase; letter-spacing:0.5px;">Verify Key</button>
                            <a href="https://payhip.com/thememecreator" target="_blank" style="font-size:11px; color:#1976d2; text-decoration:underline;">Don't have a key? Buy one here.</a>
                            <button type="button" class="btn-cancel" id="btnCancelUpgrade" style="width:100%;">Cancel</button>
                        </div>
                    </div>`;
                document.body.appendChild(d);
                d.querySelector('#btnCancelUpgrade').onclick = () => d.remove();
               d.querySelector('#btnVerifyUpgrade').onclick = async () => {
                    const key = d.querySelector('#upgradeKeyInput').value.trim();
                    const msg = d.querySelector('#upgradeMessage');
                    if (!key) { msg.textContent = 'Please enter a key.'; msg.style.color = '#c0392b'; return; }
                    
                    msg.textContent = 'Verifying...'; msg.style.color = '#1c1e21';
                    
                    if (window.api && window.api.verifyLicense) {
                        try {
                            const isValid = await window.api.verifyLicense(key);
                            if (isValid) {
                                msg.textContent = 'Success! Restarting...'; msg.style.color = '#2e7d32';
                                setTimeout(() => window.location.reload(), 1000);
                            } else {
                                msg.textContent = 'Invalid key. Please try again.'; msg.style.color = '#c0392b';
                            }
                        } catch (err) {
                            msg.textContent = 'Error connecting to server.'; msg.style.color = '#c0392b';
                        }
                    } else {
                        msg.textContent = 'Verification requires the downloaded Desktop App.'; msg.style.color = '#c0392b';
                    }
                };
            };
        }

        window.addEventListener("click", (e) => {
            if (menuDrop && e.target !== menuBtn && !menuDrop.contains(e.target)) {
                menuDrop.style.display = "none";
            }
        });

        if (btnClear) btnClear.addEventListener("click", (e) => {
            e.preventDefault();
            const div = document.createElement('div');
            div.className = 'custom-dialog-overlay open';
            div.style.zIndex = '12000'; 
            div.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 300px; text-align: center;">
                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Refresh?</h3>
                    <p>Are you sure you want to refresh? Progress will be lost.</p>
                    <div class="dialog-actions" style="display:flex; width:100%; justify-content:space-between; gap:10px;">
                        <button class="btn-cancel" id="cancelClear" style="width:40%;">No</button>
                        <button class="btn-cancel" id="confirmClear" style="width:40%;">Yes</button>
                    </div>
                </div>
            `;
            document.body.appendChild(div);

            div.querySelector('#cancelClear').onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    div.remove();
};

div.querySelector('#confirmClear').onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
        // 1. Reset Content
        state.images = [];
        state.texts = [];
        state.shapes = [];
        state.sourceFiles = [];

        // 2. Reset Selections & Modes
        state.selectedImageIdx = null;
        state.selectedTextId = null;
        state.selectedShapeId = null;
        state.cropMode = false;
        state.cutMode = false;

        // 3. Reset Paint Mode
        state.paintMode = false;
        if (paintToolbar) paintToolbar.classList.remove('open');
        if (btnPaintCanvas) btnPaintCanvas.classList.remove('active');
        if (layer) layer.style.cursor = 'default';

        state.canvasColor = "#ffffff";
       state.canvasEffect = "none";
        state.fixedSize = null;
        state.showCenterLines = true;
        state.showGrid = 0;
        state.gridAbove = true;
        if (btnCenter) btnCenter.classList.add("active");
        const btnGrid = overlay.querySelector(".meme-grid-btn");
        if (btnGrid) {
            btnGrid.classList.remove("active");
            btnGrid.style.setProperty("background-color", "#e3f2fd");
            btnGrid.style.setProperty("color", "#1976d2");
            btnGrid.style.setProperty("border-color", "#1976d2");
        }
        if (canvasColorInput) canvasColorInput.value = "#ffffff";
        const cHex = overlay.querySelector(".meme-creator-canvas-hex");
        if (cHex) cHex.value = "#ffffff";

        if (canvasEffectSelect) canvasEffectSelect.value = "none";
    } finally {
        div.remove();
    }

    // Clear external inputs too
    const clearBtn = (wrapper && wrapper.querySelector) ? wrapper.querySelector('.clear-images-btn') : null;
    if (clearBtn) clearBtn.click();
    if (input) input.value = '';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            drawPreview();
            syncTextLayer();
            saveHistory();
            if (canvas && canvas.focus) canvas.focus();
        });
    });
};

        });

        if (btnAddText) btnAddText.addEventListener("click", (e) => { e.preventDefault(); addTextBox(); });

        if (btnAddPhoto) btnAddPhoto.addEventListener("click", (e) => {
    e.preventDefault();
    const tempInput = document.createElement("input");
    tempInput.type = "file";
    tempInput.accept = "image/*";
    tempInput.onchange = async () => {
        if (tempInput.files && tempInput.files[0]) {
            if (state.paintMode) {
                state.paintMode = false;
                if (paintToolbar) paintToolbar.classList.remove('open');
                if (btnPaintCanvas) btnPaintCanvas.classList.remove('active');
                if (layer) layer.style.cursor = 'default';
                if (canvas) canvas.style.cursor = 'default';
                document.body.style.cursor = 'default';
            }

            const f = tempInput.files[0];
                    const img = await loadImageFromFile(f);
                    state.images.push({ file: f, img, zIndex: state.nextZIndex++ });
                    if (state.sourceFiles) state.sourceFiles.push(f);
                    drawPreview();
                    saveHistory();
                }
            };
            tempInput.click();
        });

        if (btnWhitespace) btnWhitespace.addEventListener("click", (e) => {
            e.preventDefault();
            // Cycle: none -> top -> right -> none
            if (state.whiteSpacePos === "none") {
                state.whiteSpacePos = "top";
                state.whiteSpaceSize = 0.10; // Top starts smaller
            } else if (state.whiteSpacePos === "top") {
                state.whiteSpacePos = "right";
                state.whiteSpaceSize = 0.35; // Right starts bigger
            } else {
                state.whiteSpacePos = "none";
            }
            
            updateWhitespaceBtnLabel();
            drawPreview();
        });

        if (btnZoom) btnZoom.addEventListener("click", (e) => {
            e.preventDefault();
            state.zoomMode = !state.zoomMode;
            updateZoomBtnLabel();
            drawPreview();
        });

        if (btnRemoveBg) btnRemoveBg.addEventListener("click", async (e) => {
            e.preventDefault();
            if (state.selectedImageIdx === null || !state.images[state.selectedImageIdx]) return;
            
            const imgObj = state.images[state.selectedImageIdx];
            const originalText = btnRemoveBg.textContent;
            btnRemoveBg.textContent = "Processing...";
            btnRemoveBg.disabled = true;

            try {
                const fd = new FormData();
                if (imgObj.file) {
                    fd.append('image', imgObj.file);
                } else {
                    throw new Error("Source file not found.");
                }

                const res = await fetch('/api/utils/remove-bg', {
    method: 'POST',
    body: fd,
    credentials: 'same-origin'
});

const ct = (res.headers.get('content-type') || '').toLowerCase();

if (!res.ok) {
    let msg = `Background removal failed (${res.status})`;

    if (ct.includes('application/json')) {
        const j = await res.json().catch(() => null);
        if (j && (j.error || j.message || j.detail)) msg = j.error || j.message || j.detail;

    } else {
        const t = await res.text().catch(() => '');
        if (t) msg = t;
    }

    throw new Error(msg);
}

if (!ct.includes('image/')) {
    const t = await res.text().catch(() => '');
    throw new Error(t || 'Remove-bg did not return an image.');
}

const blob = await res.blob();
const newImg = await loadImageFromFile(blob);

                
                imgObj.img = newImg;
                imgObj.file = new File([blob], "nobg.png", { type: "image/png" });
                imgObj._version = (imgObj._version || 0) + 1;
                
                drawPreview();
                saveHistory();
            } catch (err) {
                alert(err && err.message ? err.message : "Background removal failed.");
                console.error(err);
            } finally {
                btnRemoveBg.textContent = originalText;
                btnRemoveBg.disabled = false;
            }
        });


if (btnCrop) btnCrop.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!state.advancedMode) return;

    // If cutting, stop cutting first
    if (state.cutMode) {
        state.cutMode = false;
        state.cutPath = [];
        updateCropUi();
    }

    // Convert text/shape to image if needed
    if (!state.cropMode) {
        const success = await bakeSelectedToImage("Crop");
        if (!success && (state.selectedImageIdx === null || state.selectedImageIdx === undefined)) return;
    }

    if (!state.cropMode) startCropMode();
    else finishCropMode(true);

    drawPreview();
});


if (btnCut) btnCut.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!state.advancedMode) return;

    // If cropping, this button acts as Cancel
    if (state.cropMode) {
        finishCropMode(false);
        drawPreview();
        return;
    }

    // Convert text/shape to image if needed
    if (!state.cutMode) {
        const success = await bakeSelectedToImage("Cut");
        if (!success && (state.selectedImageIdx === null || state.selectedImageIdx === undefined)) return;
    }
    
    state.cutMode = !state.cutMode;
    state.cutPath = [];
    
    updateCropUi();
    drawPreview();
});


if (btnLassoKeep) btnLassoKeep.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!state.advancedMode) return;

    // Convert text/shape if necessary
    if (!state.lassoMode) {
        const success = await bakeSelectedToImage("Lasso");
        if (!success && (state.selectedImageIdx === null || state.selectedImageIdx === undefined)) return;
    }

    state.lassoMode = !state.lassoMode;
    state.cutPath = [];
    
    // Disable Cut Mode if Lasso is active
    if (state.lassoMode) { 
        state.cutMode = false;
        if(btnCut) btnCut.textContent = "Cut";
    }

    drawPreview();
});


layer.addEventListener("mousedown", (e) => {
            if (!state.cutMode && !state.lassoMode) return;
            e.stopPropagation();
            e.preventDefault();
            
            const rect = layer.getBoundingClientRect();
            const info = state._layoutInfo;
            if(!info || !rect.width || !rect.height) return;
            
            const nX = (e.clientX - rect.left) / rect.width;
            const nY = (e.clientY - rect.top) / rect.height;
            
            state.cutPath = [{ x: nX, y: nY }];
            
            const onDraw = (me) => {
                const mx = (me.clientX - rect.left) / rect.width;
                const my = (me.clientY - rect.top) / rect.height;
                state.cutPath.push({ x: mx, y: my });
                drawPreview(); // Visual feedback
            };            
            const onEnd = async () => {
                window.removeEventListener("mousemove", onDraw);
                window.removeEventListener("mouseup", onEnd);
                
                if (state.cutMode) {
                    await performFreehandCut();
                    state.cutMode = false;
                    updateCropUi();
                } else if (state.lassoMode) {
                    await performLassoKeep();
                    state.lassoMode = false;
                }
                
                drawPreview();
                saveHistory();
            };
            
            window.addEventListener("mousemove", onDraw);
            window.addEventListener("mouseup", onEnd);
        });




                const moveLayer = (dir) => {
            if (state.advancedMode) {
                let selItems = [];
                if (state.multiSelected && state.multiSelected.length > 0) {
                    selItems = state.multiSelected.map(m => m.data);
                } else {
                    let selItem = null;
                    if (state.selectedTextId) selItem = state.texts.find(t => t.id === state.selectedTextId);
                    else if (state.selectedImageIdx !== null) selItem = state.images[state.selectedImageIdx];
                    else if (state.selectedShapeId) selItem = state.shapes.find(s => s.id === state.selectedShapeId);
                    if (selItem) selItems.push(selItem);
                }

                if (selItems.length === 0) return;

                const allLayers = [];

                state.images.forEach(img => {
                    if (img.zIndex === undefined || img.zIndex === null) img.zIndex = state.nextZIndex++;
                    allLayers.push(img);
                });

                if (state.shapes) {
                    state.shapes.forEach(shp => {
                        if (shp.zIndex === undefined || shp.zIndex === null) shp.zIndex = state.nextZIndex++;
                        allLayers.push(shp);
                    });
                }

                state.texts.forEach(t => {
                    if (t.zIndex === undefined || t.zIndex === null) t.zIndex = state.nextZIndex++;
                    allLayers.push(t);
                });

                allLayers.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

                if (dir > 0) {
                    for (let i = allLayers.length - 1; i >= 0; i--) {
                        if (selItems.includes(allLayers[i]) && i < allLayers.length - 1 && !selItems.includes(allLayers[i + 1])) {
                            const temp = allLayers[i];
                            allLayers[i] = allLayers[i + 1];
                            allLayers[i + 1] = temp;
                        }
                    }
                } else {
                    for (let i = 0; i < allLayers.length; i++) {
                        if (selItems.includes(allLayers[i]) && i > 0 && !selItems.includes(allLayers[i - 1])) {
                            const temp = allLayers[i];
                            allLayers[i] = allLayers[i - 1];
                            allLayers[i - 1] = temp;
                        }
                    }
                }

                allLayers.forEach((layer, idx) => {
                    layer.zIndex = idx + 1;
                });
                state.nextZIndex = allLayers.length + 1;

                drawPreview();
                syncTextLayer();
                return;
            }

            if (state.selectedTextId) {
                const idx = state.texts.findIndex(t => t.id === state.selectedTextId);
                if (idx === -1) return;

                const newIdx = idx + dir;
                if (newIdx >= 0 && newIdx < state.texts.length) {
                    const temp = state.texts[idx];
                    state.texts[idx] = state.texts[newIdx];
                    state.texts[newIdx] = temp;
                    syncTextLayer();
                    drawPreview(); // REPLACEMENT: Refresh canvas to show new layer order
                }
            }
        };


        if (btnLayerUp) btnLayerUp.addEventListener("click", (e) => { e.preventDefault(); moveLayer(1); });
        if (btnLayerDown) btnLayerDown.addEventListener("click", (e) => { e.preventDefault(); moveLayer(-1); });

        if (btnLayerPanel && layerPanel) {
            btnLayerPanel.addEventListener("click", (e) => {
                e.preventDefault();
                const isHidden = layerPanel.style.display !== "flex";
                layerPanel.style.display = isHidden ? "flex" : "none";
                if (isHidden && typeof syncLayerPanel === "function") syncLayerPanel();
            });
            
            if (panelClose) panelClose.addEventListener("click", () => {
                layerPanel.style.display = "none";
            });

            let isDraggingPanel = false;
            let startPX, startPY, initLeft, initTop;

            if (panelHeader) panelHeader.addEventListener("mousedown", (e) => {
                if (e.target === panelClose) return;
                isDraggingPanel = true;
                startPX = e.clientX;
                startPY = e.clientY;
                initLeft = layerPanel.offsetLeft;
                initTop = layerPanel.offsetTop;
                e.preventDefault();
            });

            window.addEventListener("mousemove", (e) => {
                if (!isDraggingPanel) return;
                
                let newLeft = initLeft + (e.clientX - startPX);
                let newTop = initTop + (e.clientY - startPY);
                
                // Keep panel safely within the viewport
                const maxLeft = window.innerWidth - layerPanel.offsetWidth;
                const maxTop = window.innerHeight - layerPanel.offsetHeight;
                
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));

                layerPanel.style.left = newLeft + "px";
                layerPanel.style.top = newTop + "px";
                layerPanel.style.right = "auto";
                layerPanel.style.bottom = "auto";
            });

            window.addEventListener("mouseup", () => { isDraggingPanel = false; });
        }

        const getActiveItem = () => {
            if (state.selectedTextId) return state.texts.find(t => t.id === state.selectedTextId);
            if (state.selectedShapeId) return state.shapes.find(s => s.id === state.selectedShapeId);
            if (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined) return state.images[state.selectedImageIdx];
            return null;
        };

        const toggleObjProp = (prop) => {
            const item = getActiveItem();
            if (item) {
                item[prop] = !item[prop];
                if (prop === 'locked' && item.locked) item.posLocked = false;
                if (prop === 'posLocked' && item.posLocked) item.locked = false;
                setSelected(state.selectedTextId, state.frameVisible);
                drawPreview();
                syncTextLayer();
            }
        };

       const btnVis = overlay.querySelector(".meme-visibility-btn");
        const btnLock = overlay.querySelector(".meme-lock-btn");
        const btnPos = overlay.querySelector(".meme-pos-lock-btn");
        const btnSnap = overlay.querySelector(".meme-snap-btn");
        const btnCenter = overlay.querySelector(".meme-center-btn");
        const btnGrid = overlay.querySelector(".meme-grid-btn");
        const btnGridUp = overlay.querySelector(".meme-grid-up-btn");
        const btnGridDown = overlay.querySelector(".meme-grid-down-btn");
        const btnClone = overlay.querySelector(".meme-clone-btn");
        const btnMulti = overlay.querySelector(".meme-multiselect-btn");
        const btnGroup = overlay.querySelector(".meme-group-btn");
        const btnMold = overlay.querySelector(".meme-mold-btn");

        if (btnVis) btnVis.addEventListener("click", (e) => { e.preventDefault(); toggleObjProp('hidden'); });
        if (btnLock) btnLock.addEventListener("click", (e) => { e.preventDefault(); toggleObjProp('locked'); });
        if (btnPos) btnPos.addEventListener("click", (e) => { e.preventDefault(); toggleObjProp('posLocked'); });

        if (btnSnap) btnSnap.addEventListener("click", function(e) {
            e.preventDefault();
            state.snapEnabled = !state.snapEnabled;
            this.classList.toggle("active", state.snapEnabled);
        });

        if (btnCenter) {
            btnCenter.classList.toggle("active", state.showCenterLines);
            btnCenter.addEventListener("click", function(e) {
                e.preventDefault();
                state.showCenterLines = !state.showCenterLines;
                this.classList.toggle("active", state.showCenterLines);
                drawPreview();
            });
        }

       if (btnGrid) {
            btnGrid.classList.toggle("active", state.showGrid === 1 || state.showGrid === 2);
            if (state.showGrid === 2) {
                btnGrid.style.setProperty("background-color", "#fce4ec", "important");
                btnGrid.style.setProperty("color", "#c2185b", "important");
                btnGrid.style.setProperty("border-color", "#c2185b", "important");
            }
            btnGrid.addEventListener("click", function(e) {
                e.preventDefault();
                if (!state.showGrid) state.showGrid = 1;
                else if (state.showGrid === 1) state.showGrid = 2;
                else state.showGrid = 0;

                this.classList.toggle("active", state.showGrid === 1 || state.showGrid === 2);
                if (state.showGrid === 2) {
                    this.style.setProperty("background-color", "#fce4ec", "important");
                    this.style.setProperty("color", "#c2185b", "important");
                    this.style.setProperty("border-color", "#c2185b", "important");
                } else {
                    this.style.setProperty("background-color", "#e3f2fd");
                    this.style.setProperty("color", "#1976d2");
                    this.style.setProperty("border-color", "#1976d2");
                }
                
                const gridOn = state.showGrid === 1 || state.showGrid === 2;
                if (btnGridUp) {
                    btnGridUp.style.opacity = gridOn ? "1" : "0.5";
                    btnGridUp.style.pointerEvents = gridOn ? "auto" : "none";
                }
                if (btnGridDown) {
                    btnGridDown.style.opacity = gridOn ? "1" : "0.5";
                    btnGridDown.style.pointerEvents = gridOn ? "auto" : "none";
                }
                drawPreview();
            });
        }

        const updateGridArrows = () => {
            if (btnGridUp) {
                btnGridUp.classList.toggle("active", state.gridAbove);
                btnGridUp.style.backgroundColor = state.gridAbove ? "#f3e5f5" : "#e3f2fd";
                btnGridUp.style.color = state.gridAbove ? "#7b1fa2" : "#1976d2";
                btnGridUp.style.borderColor = state.gridAbove ? "#7b1fa2" : "#1976d2";
            }
            if (btnGridDown) {
                btnGridDown.classList.toggle("active", !state.gridAbove);
                btnGridDown.style.backgroundColor = !state.gridAbove ? "#f3e5f5" : "#e3f2fd";
                btnGridDown.style.color = !state.gridAbove ? "#7b1fa2" : "#1976d2";
                btnGridDown.style.borderColor = !state.gridAbove ? "#7b1fa2" : "#1976d2";
            }
        };

        if (btnGridUp) {
            btnGridUp.addEventListener("click", (e) => {
                e.preventDefault();
                state.gridAbove = true;
                updateGridArrows();
                drawPreview();
            });
        }

        if (btnGridDown) {
            btnGridDown.addEventListener("click", (e) => {
                e.preventDefault();
                state.gridAbove = false;
                updateGridArrows();
                drawPreview();
            });
        }

        if (btnClone) btnClone.addEventListener("click", (e) => {
            e.preventDefault();
            let itemsToClone = [];
            if (state.multiSelected && state.multiSelected.length > 0) {
                itemsToClone = state.multiSelected;
            } else {
                const active = getActiveItem();
                if (active) {
                    let type = 'image';
                    if (state.selectedTextId) type = 'text';
                    else if (state.selectedShapeId) type = 'shape';
                    itemsToClone = [{ type: type, data: active }];
                }
            }

            if (itemsToClone.length === 0) return;

            const newMultiSelected = [];
            const newGroupId = itemsToClone.length > 1 ? Date.now() + Math.random() : null;

            itemsToClone.forEach(item => {
                let clone;
                if (item.type === 'image') {
                    clone = { ...item.data, crop: item.data.crop ? { ...item.data.crop } : null };
                    clone.x += 20; clone.y += 20;
                } else {
                    clone = JSON.parse(JSON.stringify(item.data));
                    clone.x += 0.05; clone.y += 0.05;
                }

                clone.zIndex = state.nextZIndex++;
                clone.locked = false;
                clone.posLocked = false;
                
                if (newGroupId) clone.groupId = newGroupId;
                else if (clone.groupId) clone.groupId = null;

                if (item.type === 'text') {
                    clone.id = "t_" + Math.random().toString(16).slice(2);
                    state.texts.push(clone);
                } else if (item.type === 'shape') {
                    clone.id = "shape_" + Math.random().toString(16).slice(2);
                    state.shapes.push(clone);
                } else if (item.type === 'image') {
                    state.images.push(clone);
                }

                newMultiSelected.push({ type: item.type, data: clone, index: item.type === 'image' ? state.images.length - 1 : null });
            });

            if (newMultiSelected.length === 1) {
                const single = newMultiSelected[0];
                if (single.type === 'text') {
                    setSelected(single.data.id);
                    state.selectedShapeId = null;
                    state.selectedImageIdx = null;
                } else if (single.type === 'shape') {
                    state.selectedShapeId = single.data.id;
                    setSelected(null);
                    state.selectedImageIdx = null;
                } else if (single.type === 'image') {
                    state.selectedImageIdx = single.index;
                    setSelected(null);
                    state.selectedShapeId = null;
                }
                state.multiSelected = [];
            } else {
                state.multiSelected = newMultiSelected.map(m => ({ type: m.type, data: m.data }));
                state.selectedTextId = null;
                state.selectedShapeId = null;
                state.selectedImageIdx = null;
            }

            drawPreview();
            syncTextLayer();
            saveHistory();
        });
        
        if (btnMulti) btnMulti.addEventListener("click", function(e) {
            e.preventDefault();
            state.multiSelectMode = !state.multiSelectMode;
            this.classList.toggle("active", state.multiSelectMode);
            if (!state.multiSelectMode) {
                state.multiSelected = [];
            } else {
                const active = getActiveItem();
                if (active) {
                    let type = 'image';
                    if (state.selectedTextId) type = 'text';
                    else if (state.selectedShapeId) type = 'shape';
                    state.multiSelected = [{ type: type, data: active }];
                }
            }
            drawPreview();
            syncTextLayer();
        });

        if (btnGroup) btnGroup.addEventListener("click", function(e) {
            e.preventDefault();
            const active = getActiveItem();
            if (active && active.groupId) {
                const gid = active.groupId;
                state.images.forEach(i => { if (i.groupId === gid) i.groupId = null; });
                if (state.shapes) state.shapes.forEach(s => { if (s.groupId === gid) s.groupId = null; });
                state.texts.forEach(t => { if (t.groupId === gid) t.groupId = null; });
            } else if (state.multiSelected && state.multiSelected.length > 1) {
                const id = Date.now();
                state.multiSelected.forEach(item => { if (item.data) item.data.groupId = id; });
                state.multiSelected = [];
                if (btnMulti) { state.multiSelectMode = false; btnMulti.classList.remove("active"); }
            }
            drawPreview();
            syncTextLayer();
        });

        if (btnMold) btnMold.addEventListener("click", function(e) {
            e.preventDefault();
            if (!state.multiSelected || state.multiSelected.length < 2) return;
            
            const d = document.createElement('div');
            d.className = 'custom-dialog-overlay open';
            d.style.zIndex = '10000';
            d.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 380px; text-align: center;">
                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Mold Objects</h3>
                    <p>Are you sure you want to merge the selected objects into a single image?</p>
                    <div class="dialog-actions" style="display:flex; width:100%; justify-content:space-between; gap:10px; margin-top:15px; padding:0;">
                        <button type="button" class="btn-cancel" id="moldCancel" style="width:45%;">Cancel</button>
                        <button type="button" class="btn-cancel" id="moldConfirm" style="width:45%;">Yes</button>
                    </div>
                </div>`;
            document.body.appendChild(d);

            d.querySelector('#moldCancel').onclick = () => d.remove();
            d.querySelector('#moldConfirm').onclick = async () => {
                d.remove();
                
                const stashImages = [...state.images];
                const stashTexts = [...state.texts];
                const stashShapes = [...(state.shapes || [])];
                const stashMulti = [...state.multiSelected];

                state.images = state.images.filter(i => stashMulti.find(m => m.data === i));
                state.texts = state.texts.filter(t => stashMulti.find(m => m.data === t));
                state.shapes = (state.shapes || []).filter(s => stashMulti.find(m => m.data === s));

                const oldColor = state.canvasColor;
                const oldEffect = state.canvasEffect;
                state.canvasColor = "rgba(0,0,0,0)";
                state.canvasEffect = "none";
                state.multiSelected = []; // Clear selection temporarily so the pink outline isn't drawn

                drawPreview(true);

                const info = state._layoutInfo;
                const w = info.outW;
                const h = info.outH;
                let minX = w, minY = h, maxX = 0, maxY = 0;

                stashMulti.forEach(m => {
                    let px, py, pw, ph;
                    if (m.type === 'image') {
                        px = m.data.x; py = m.data.y; pw = m.data.w; ph = m.data.h;
                    } else {
                        px = m.data.x * w; py = m.data.y * h; pw = m.data.w * w; ph = m.data.h * h;
                    }
                    if (px < minX) minX = px;
                    if (py < minY) minY = py;
                    if (px + pw > maxX) maxX = px + pw;
                    if (py + ph > maxY) maxY = py + ph;
                });

                const pad = 10;
                minX = Math.floor(Math.max(0, minX - pad));
                minY = Math.floor(Math.max(0, minY - pad));
                maxX = Math.ceil(Math.min(w, maxX + pad));
                maxY = Math.ceil(Math.min(h, maxY + pad));

                const cW = Math.max(1, maxX - minX);
                const cH = Math.max(1, maxY - minY);

                const tempC = document.createElement('canvas');
                tempC.width = cW;
                tempC.height = cH;
                tempC.getContext('2d').drawImage(canvas, minX, minY, cW, cH, 0, 0, cW, cH);

                state.images = stashImages.filter(i => !stashMulti.find(m => m.data === i));
                state.texts = stashTexts.filter(t => !stashMulti.find(m => m.data === t));
                state.shapes = stashShapes.filter(s => !stashMulti.find(m => m.data === s));

                state.canvasColor = oldColor;
                state.canvasEffect = oldEffect;

                const blob = await new Promise(r => tempC.toBlob(r));
                const newImg = await loadImageFromFile(blob);

                state.images.push({
                    file: new File([blob], "molded.png", { type: "image/png" }),
                    img: newImg,
                    x: minX, y: minY, w: cW, h: cH,
                    zIndex: state.nextZIndex++
                });

                state.multiSelected = [];
                state.multiSelectMode = false;
                if (btnMulti) btnMulti.classList.remove("active");

                state.selectedImageIdx = state.images.length - 1;
                state.selectedTextId = null;
                state.selectedShapeId = null;

                saveHistory();
                drawPreview();
                syncTextLayer();
            };
        });

        const applyTransform = (key, valFn) => {
            let items = [];
            if (state.multiSelected && state.multiSelected.length > 0) {
                items = state.multiSelected.map(m => m.data);
            } else {
                let item = null;
                if (state.selectedTextId) item = state.texts.find(t => t.id === state.selectedTextId);
                else if (state.selectedImageIdx !== null) item = state.images[state.selectedImageIdx];
                else if (state.selectedShapeId) item = state.shapes.find(s => s.id === state.selectedShapeId);
                if (item) items.push(item);
            }

            if (items.length > 0) {
                items.forEach(it => {
                    it[key] = valFn(it[key]);
                });
                drawPreview();
                syncTextLayer();
            }
        };

        if (btnFlip) btnFlip.addEventListener("click", (e) => {
    e.preventDefault();
    applyTransform('flip', (curr) => !curr);
});

if (btnRotate) btnRotate.addEventListener("click", (e) => {
    e.preventDefault();
    applyTransform('rotation', (curr) => (curr || 0) + 45);
});

if (btnPaint) btnPaint.onclick = (e) => {
    e.preventDefault();
    openPaintEditor();
};

if (btnPaintCanvas && paintToolbar) {
    // Helper to toggle Paint Mode
    const togglePaintMode = async (active) => {
        state.paintMode = active;
        paintToolbar.classList.toggle('open', active);
        btnPaintCanvas.classList.toggle('active', active);

        if (active) {
            // Paint on Merged Background 
            let paintImgObj = null;
            const bgIndex = state.images.findIndex(img => img.locked === true);

            if (bgIndex !== -1) {
                state.selectedImageIdx = bgIndex;
                paintImgObj = state.images[bgIndex];
                paintImgObj.isPaintLayer = true; // Enable painting on background
            }
            else if (state.selectedImageIdx !== null) {
                const img = state.images[state.selectedImageIdx];
                if (img && img.isPaintLayer) paintImgObj = img;
            }

            if (!paintImgObj) {
                const w = (state._layoutInfo && state._layoutInfo.outW) || 800;
                const h = (state._layoutInfo && state._layoutInfo.outH) || 600;
                const c = document.createElement("canvas");
                c.width = w;
                c.height = h;
                
                const blob = await new Promise(r => c.toBlob(r));
                const img = await loadImageFromFile(blob);
                
                paintImgObj = {
                    img: img,
                    file: new File([blob], "paint_layer.png", { type: "image/png" }),
                    x: 0, y: 0, w: 1, h: 1, // Full Normalized Size
                    rotation: 0, flip: false,
                    zIndex: state.nextZIndex++,
                    isPaintLayer: true // Tag it
                };
                
                if (!state.advancedMode && btnAdvanced) btnAdvanced.click();

                // If Advanced, use pixel coords
                if (state.advancedMode && state._layoutInfo) {
                    paintImgObj.x = 0; paintImgObj.y = 0;
                    paintImgObj.w = state._layoutInfo.outW;
                    paintImgObj.h = state._layoutInfo.outH;
                }

                state.images.push(paintImgObj);
                state.selectedImageIdx = state.images.length - 1;
            }
            
            // Disable other interactions
            layer.style.pointerEvents = 'auto'; 
            layer.style.cursor = 'crosshair';
            
            drawPreview();
        } else {
            layer.style.cursor = 'default';
        }
    };

const mergeAllToBackground = async () => {
        saveHistory();
        const info = state._layoutInfo;
        const w = info.outW;
        const h = info.outH;
        const tempC = document.createElement('canvas');
        tempC.width = w;
        tempC.height = h;
       const ctx = tempC.getContext('2d');
ctx.drawImage(canvas, 0, 0);

// Match drawPreview() text alignment so merge does not shift text
ctx.textAlign = "center";
ctx.textBaseline = "top";

state.texts.forEach(t => {

            const x = Math.round(t.x * w);
            const y = Math.round(t.y * h);
            const tw = Math.round(t.w * w);
            const th = Math.round(t.h * h);
            
            const dispH = state._displayH || Math.round(info.outH * (state._displayScale || 1));
            const outPerDispY = info.outH / Math.max(1, dispH);
            const outPerDispX = info.outW / Math.max(1, (state._displayW || 1));
            
            const rawFontSize = t.fontSize || state.baseFontSize;
            const fontSize = Math.max(10, Math.round(rawFontSize));
            const fam = t.fontFamily || state.baseFontFamily || "Anton";
            const rawWeight = t.fontWeight || state.baseFontWeight || "900";
            const fStyle = t.fontStyle || state.baseFontStyle || "normal";
            const weight = fStyle === "bold" ? "bold" : rawWeight;
            const famForCanvas = fam.includes(" ") ? `"${fam}"` : fam;
            const font = `${fStyle === "italic" ? "italic " : ""}${weight} ${fontSize}px ${famForCanvas}, Impact, Arial Black, sans-serif`;

            const normalizeTextColor = (v) => {
                const s = String(v || "").trim().toLowerCase();
                if (s === "white") return "#ffffff";
                if (s === "black") return "#000000";
                if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;
                return "#ffffff";
            };
            const contrastTextColor = (hex) => {
                const h = normalizeTextColor(hex).replace("#", "");
                const full = h.length === 3 ? (h[0] + h[0] + h[1] + h[1] + h[2] + h[2]) : h;
                const r = parseInt(full.slice(0, 2), 16) || 0;
                const g = parseInt(full.slice(2, 4), 16) || 0;
                const b = parseInt(full.slice(4, 6), 16) || 0;
                return ((0.2126 * r) + (0.7152 * g) + (0.0722 * b)) < 128 ? "#ffffff" : "#000000";
            };

            const color = normalizeTextColor(t.color || state.baseColor);
            const bgEnabled = (t.shadowEnabled !== undefined) ? t.shadowEnabled : state.baseShadowEnabled;
            let stroke = "transparent", strokeWidth = 0;

            if (bgEnabled) {
                const shadowColor = normalizeTextColor(t.shadowColor || state.baseShadowColor || contrastTextColor(color));
                const depthRaw = (t.shadowDepth || state.baseShadowDepth || 2);
                const depth = Math.max(1, Math.min(7, parseInt(depthRaw, 10) || 2));
                stroke = shadowColor;
                strokeWidth = Math.max(2, Math.round(depth * 2 * outPerDispX));
            }

           // Match editor padding: 6px top/bottom, 8px left/right
            const padY = Math.round(6 * outPerDispY);
            const padX = Math.round(8 * outPerDispX);

            // Correction: Canvas 'top' baseline draws higher than HTML. Push down ~20%.
            const yOffset = Math.round(fontSize * 0.2);

            // Center X and Y for rotation
            // Nudge X left (-padX * 0.5) to match HTML editor alignment
            const cx = x + Math.round(tw / 2) - Math.round(padX * 0.5);
            const cy = y + Math.round(th / 2);
            
            const tsEnabled = (t.textShadowEnabled !== undefined) ? t.textShadowEnabled : state.baseTextShadowEnabled;
            let tsColor = "transparent", tsOff = 0, tsBlur = 0;

            if (tsEnabled) {
                tsColor = (t.textShadowColor || state.baseTextShadowColor || "#000000");
                const tsDepthRaw = (t.textShadowDepth ?? state.baseTextShadowDepth ?? 3);
                const tsDepth = Math.max(1, Math.min(7, parseInt(tsDepthRaw, 10) || 3));
                tsOff = Math.max(1, Math.round(tsDepth * outPerDispX));
                tsBlur = Math.round(tsOff * 1.2);
            }

            ctx.save();
            ctx.translate(cx, cy);
            if (t.rotation) ctx.rotate(t.rotation * Math.PI / 180);
            if (t.flip) ctx.scale(-1, 1);
            ctx.translate(-cx, -cy);
            if (t.opacity !== undefined) ctx.globalAlpha = t.opacity;

            wrapAndDrawText(ctx, t.text || "", cx, y + padY + yOffset, Math.max(10, tw - padX * 2), font, fontSize, color, stroke, strokeWidth, tsColor, tsOff, tsOff, tsBlur);
            ctx.restore();
        });

        const blob = await new Promise(r => tempC.toBlob(r));
        const newImg = await loadImageFromFile(blob);

        state.images = [{
            file: new File([blob], "merged_bg.png", { type: "image/png" }),
            img: newImg,
            x: 0, y: 0, w: w, h: h,
            zIndex: -9999,
            locked: true
        }];
        state.texts = [];
        state.shapes = [];
        state.selectedImageIdx = null;
        state.selectedTextId = null;
        state.selectedShapeId = null;

        if (!state.advancedMode && btnAdvanced) btnAdvanced.click();
        state.fixedSize = { w, h };
        state.whiteSpacePos = 'none';
        
        drawPreview();
        syncTextLayer();
    };

    btnPaintCanvas.onclick = (e) => {
        e.preventDefault();
        if (state.paintMode) {
            togglePaintMode(false);
            return;
        }

        const hasContent = state.images.length > 0 || state.texts.length > 0 || (state.shapes && state.shapes.length > 0);
        if (!hasContent) {
             togglePaintMode(true);
             return;
        }

        const d = document.createElement('div');
        d.className = 'custom-dialog-overlay open';
        d.style.zIndex = '10000';
        d.innerHTML = `
            <div class="custom-dialog-box" style="max-width: 380px; text-align: center;">
                <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Merge Objects?</h3>
                <p>Merge all objects into a single background? You can undo merge.</p>
                <div class="dialog-actions" style="display:flex; width:100%; justify-content:space-between; gap:10px; margin-top:15px; padding:0;">
                    <button type="button" class="btn-cancel" id="mergeCancel" style="width:45%;">Cancel</button>
                    <button type="button" class="btn-cancel" id="mergeConfirm" style="width:45%;">Merge</button>
                </div>
            </div>`;
        document.body.appendChild(d);

        d.querySelector('#mergeCancel').onclick = () => d.remove();
        d.querySelector('#mergeConfirm').onclick = async () => {
            d.remove();
            await mergeAllToBackground();
            togglePaintMode(true);
        };
    };

   // Toolbar Logic
    const pTool = { tool: 'brush', color: '#ff0000', size: 5, shape: 'round', brushStyle: 'regular' };
    
    paintToolbar.querySelector('.meme-paint-done-btn').onclick = (e) => {
        e.preventDefault();
        togglePaintMode(false);
    };

    paintToolbar.querySelectorAll('.meme-paint-toolbtn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            pTool.tool = btn.dataset.tool;
            paintToolbar.querySelectorAll('.meme-paint-toolbtn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    paintToolbar.querySelector('.meme-paint-color').oninput = (e) => pTool.color = e.target.value;
    paintToolbar.querySelector('.meme-paint-size').onchange = (e) => pTool.size = parseInt(e.target.value);
    paintToolbar.querySelector('.meme-paint-style').onchange = (e) => pTool.brushStyle = e.target.value;
    paintToolbar.querySelector('.meme-paint-shape').onchange = (e) => pTool.shape = (e.target.value === 'square' ? 'square' : 'round');

    // DRAWING EVENT HANDLER (Directly on Layer)
   layer.addEventListener("mousedown", async (e) => {
    if (!state.paintMode) return;

    let paintIdx = state.selectedImageIdx;
    if (paintIdx === null || !state.images[paintIdx] || !state.images[paintIdx].isPaintLayer) {
        paintIdx = state.images.findIndex(img => img && img.isPaintLayer);
    }
    if (paintIdx === -1) return;

    state.selectedImageIdx = paintIdx;
    const imgObj = state.images[paintIdx];
    if (!imgObj) return;

    e.stopPropagation(); e.preventDefault();

    const canvasW = imgObj.img.naturalWidth || imgObj.img.width;
    const canvasH = imgObj.img.naturalHeight || imgObj.img.height;
    const tempC = document.createElement('canvas');
    tempC.width = canvasW; tempC.height = canvasH;
    const ctx = tempC.getContext('2d');
    ctx.drawImage(imgObj.img, 0, 0);

    const rect = layer.getBoundingClientRect();
    const info = state._layoutInfo;
    const getLocalCoords = (evt) => {
        const mx = ((evt.clientX - rect.left) / rect.width) * info.outW;
        const my = ((evt.clientY - rect.top) / rect.height) * info.outH;
        const ix = mx - imgObj.x;
        const iy = my - imgObj.y;
        return { x: ix * (canvasW / imgObj.w), y: iy * (canvasH / imgObj.h) };
    };

    const pos = getLocalCoords(e);

    // --- FILL TOOL ---
    if (pTool.tool === 'fill') {
        const hexToRgba = (hex) => {
            const h = String(hex || "").replace("#", "");
            const f = h.length === 3 ? (h[0]+h[0]+h[1]+h[1]+h[2]+h[2]) : h;
            return { r: parseInt(f.slice(0,2),16), g: parseInt(f.slice(2,4),16), b: parseInt(f.slice(4,6),16), a: 255 };
        };
        const colorsMatch = (d, i, c) => (Math.abs(d[i]-c.r)<18 && Math.abs(d[i+1]-c.g)<18 && Math.abs(d[i+2]-c.b)<18 && Math.abs(d[i+3]-c.a)<18);
        
        const imgD = ctx.getImageData(0, 0, canvasW, canvasH);
        const d = imgD.data;
        const x = Math.floor(pos.x), y = Math.floor(pos.y);
        if (x>=0 && x<canvasW && y>=0 && y<canvasH) {
            const idx0 = (y*canvasW+x)*4;
            const target = { r:d[idx0], g:d[idx0+1], b:d[idx0+2], a:d[idx0+3] };
            const fill = hexToRgba(pTool.color);
            
            if (!(target.r===fill.r && target.g===fill.g && target.b===fill.b && target.a===fill.a)) {
                const stack = [[x, y]];
                while (stack.length) {
                    const [px, py] = stack.pop();
                    const i = (py*canvasW+px)*4;
                    if (colorsMatch(d, i, target)) {
                        d[i]=fill.r; d[i+1]=fill.g; d[i+2]=fill.b; d[i+3]=255;
                        if(px>0) stack.push([px-1, py]); if(px<canvasW-1) stack.push([px+1, py]);
                        if(py>0) stack.push([px, py-1]); if(py<canvasH-1) stack.push([px, py+1]);
                    }
                }
                ctx.putImageData(imgD, 0, 0);
                
                const blob = await new Promise(r => tempC.toBlob(r));
                imgObj.img = await loadImageFromFile(blob);
                imgObj.file = new File([blob], "paint_fill.png", { type: "image/png" });
                imgObj._version = (imgObj._version || 0) + 1;
                saveHistory();
                drawPreview();
            }
        }
        return;
    }

    // --- BRUSH STROKE LOGIC ---
    const strokeLine = (x1, y1, x2, y2) => {
        ctx.save();
        if (pTool.tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0,0,0,1)";
            ctx.lineWidth = pTool.size * 2;
            ctx.lineCap = "round"; ctx.lineJoin = "round";
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = pTool.color;
            ctx.fillStyle = pTool.color;
            ctx.lineWidth = pTool.size;
            ctx.lineCap = pTool.shape === "square" ? "butt" : "round";
            ctx.lineJoin = "round";
            const style = pTool.brushStyle;

            if (style === 'airbrush') {
                ctx.globalAlpha = 0.1; ctx.shadowBlur = pTool.size; ctx.shadowColor = pTool.color;
                const dist = Math.hypot(x2-x1, y2-y1), steps = Math.ceil(dist/(pTool.size/4)); 
                for (let i=0; i<=steps; i++) {
                    const t=i/steps; ctx.beginPath(); ctx.arc(x1+(x2-x1)*t, y1+(y2-y1)*t, pTool.size/2, 0, Math.PI*2); ctx.fill();
                }
            } else if (style === 'oil') {
                ctx.globalAlpha = 0.8; ctx.shadowBlur = 1; ctx.shadowColor = pTool.color;
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.globalAlpha = 0.4; ctx.lineWidth = pTool.size*0.5; ctx.strokeStyle = '#ffffff'; 
                ctx.globalCompositeOperation = 'overlay'; ctx.stroke();
            } else if (style === 'crayon' || style === 'chalk') {
                ctx.globalAlpha = (style==='chalk')?0.6:0.8; 
                const dist = Math.hypot(x2-x1, y2-y1), steps = Math.ceil(dist);
                for(let i=0; i<steps; i++) {
                    if(Math.random()>0.8) continue;
                    const t=i/steps, jit=(Math.random()-0.5)*(pTool.size*0.6);
                    ctx.beginPath(); ctx.arc(x1+(x2-x1)*t+jit, y1+(y2-y1)*t+jit, (Math.random()*pTool.size/2)+1, 0, Math.PI*2); ctx.fill();
                }
            } else if (style === 'marker') {
                ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            } else if (style === 'pencil') {
                ctx.globalAlpha = 0.9; ctx.lineWidth = Math.max(1, pTool.size*0.5); 
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            } else if (style === 'watercolor') {
                ctx.globalAlpha = 0.15;
                const dist = Math.hypot(x2 - x1, y2 - y1);
                const steps = Math.ceil(dist / (pTool.size / 2));
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const spread = (Math.random() - 0.5) * (pTool.size * 0.5);
                    const x = x1 + (x2 - x1) * t + spread;
                    const y = y1 + (y2 - y1) * t + spread;
                    const rad = pTool.size * (0.8 + Math.random() * 0.4);
                    ctx.beginPath();
                    ctx.arc(x, y, rad, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (style === 'calligraphy_pen') {
                ctx.globalAlpha = 1; ctx.lineWidth = 1; 
                const dist=Math.hypot(x2-x1, y2-y1), steps=Math.ceil(dist), dx=Math.cos(-0.785)*pTool.size, dy=Math.sin(-0.785)*pTool.size;
                ctx.beginPath();
                for(let i=0;i<=steps;i++){ const t=i/steps, cx=x1+(x2-x1)*t, cy=y1+(y2-y1)*t; ctx.moveTo(cx-dx/2, cy-dy/2); ctx.lineTo(cx+dx/2, cy+dy/2); }
                ctx.stroke();
            } else if (style === 'calligraphy_brush') {
                ctx.globalAlpha = 1;
                const dist = Math.hypot(x2 - x1, y2 - y1);
                const steps = Math.ceil(dist / (pTool.size / 6)); 
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const x = x1 + (x2 - x1) * t;
                    const y = y1 + (y2 - y1) * t;
                    ctx.beginPath();
                    ctx.ellipse(x, y, pTool.size, pTool.size * 0.3, -45 * Math.PI/180, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            }
        }
        ctx.restore();
    };

    strokeLine(pos.x, pos.y, pos.x+0.1, pos.y+0.1);
    imgObj.img = tempC;
    drawPreview();

    let lastX = pos.x, lastY = pos.y;
    let paintRaf = 0;

    const onPaintMove = (me) => {
        const p = getLocalCoords(me);
        strokeLine(lastX, lastY, p.x, p.y);
        lastX = p.x; lastY = p.y;
        imgObj.img = tempC;
        if (!paintRaf) paintRaf = requestAnimationFrame(() => { paintRaf = 0; drawPreview(); });
    };

    const onPaintUp = async () => {
        window.removeEventListener("mousemove", onPaintMove);
        window.removeEventListener("mouseup", onPaintUp);
        const blob = await new Promise(r => tempC.toBlob(r));
        imgObj.img = await loadImageFromFile(blob);
        imgObj.file = new File([blob], "paint_layer.png", { type: "image/png" });
        imgObj._version = (imgObj._version || 0) + 1;
        saveHistory();
        drawPreview();
    };

    window.addEventListener("mousemove", onPaintMove);
    window.addEventListener("mouseup", onPaintUp);
});
}

if (btnStageCrop) btnStageCrop.onclick = (e) => {
    e.preventDefault();
    state.stageCropMode = !state.stageCropMode;
    
    // Clear selection if turning off
    if (!state.stageCropMode) state.stageCropRect = null;
    
        if (state.stageCropMode) {
            [btnSizeV, btnSizeH, btnSizeSq, btnSizePort, selectBookSize].forEach(b => { if(b) b.classList.remove('active'); });
            if (selectBookSize) selectBookSize.value = "";
            btnStageCrop.classList.add('active');
            if (layer) layer.style.cursor = "crosshair";
            btnStageCrop.style.setProperty("background-color", "#fff9c4", "important");
            btnStageCrop.style.setProperty("color", "#333", "important");
            btnStageCrop.style.setProperty("border-color", "#fbc02d", "important");
       } else {
            document.body.classList.remove("osb-stagecrop-hover");
            btnStageCrop.classList.remove('active');
            if (layer) layer.style.cursor = "default";
            
            btnStageCrop.style.setProperty("background-color", "#f7f8e8", "important");
            btnStageCrop.style.setProperty("color", "#e67e22", "important");
            btnStageCrop.style.setProperty("border-color", "#e67e22", "important");

            if (state.fixedSize) {
                const { w, h } = state.fixedSize;
                if (w === 1080 && h === 1920 && btnSizeV) btnSizeV.classList.add('active');
                else if (w === 1920 && h === 1080 && btnSizeH) btnSizeH.classList.add('active');
                else if (w === 1080 && h === 1080 && btnSizeSq) btnSizeSq.classList.add('active');
                else if (w === 1080 && h === 1350 && btnSizePort) btnSizePort.classList.add('active');
                else if (selectBookSize) {
                    if (w === 1000 && h === 1600) { selectBookSize.value = "5:8"; selectBookSize.classList.add('active'); }
                    else if (w === 1080 && h === 1620) { selectBookSize.value = "2:3"; selectBookSize.classList.add('active'); }
                    else if (w === 1080 && h === 1750) { selectBookSize.value = "1:1.62"; selectBookSize.classList.add('active'); }
                    else if (w === 2400 && h === 2400) { selectBookSize.value = "1:1"; selectBookSize.classList.add('active'); }
                    else if (w === 2400 && h === 1200) { selectBookSize.value = "2:1"; selectBookSize.classList.add('active'); }
                    else if (w === 1200 && h === 630) { selectBookSize.value = "1.91:1"; selectBookSize.classList.add('active'); }
                    else if (w === 1500 && h === 500) { selectBookSize.value = "3:1"; selectBookSize.classList.add('active'); }
                    else if (w === 1584 && h === 396) { selectBookSize.value = "4:1"; selectBookSize.classList.add('active'); }
                    else if (w === 2550 && h === 3300) { selectBookSize.value = "8.5:11"; selectBookSize.classList.add('active'); }
                    else if (w === 2480 && h === 3508) { selectBookSize.value = "1:1.414"; selectBookSize.classList.add('active'); }
                    else if (w === 1500 && h === 2100) { selectBookSize.value = "5:7"; selectBookSize.classList.add('active'); }
                        else if (w === 1024 && h === 768) { selectBookSize.value = "4:3"; selectBookSize.classList.add('active'); }
                    }

                    if (inputCustomRatio) {
                        if (inputCustomRatio.dataset.mode === "pixel") {
                            inputCustomRatio.value = `${w}x${h}`;
                        } else if (state.customRatioString) {
                            inputCustomRatio.value = state.customRatioString;
                        } else {
                            const rw = Math.round(w), rh = Math.round(h);
                            const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
                            const divisor = gcd(rw, rh);
                            const wRat = rw / divisor;
                            const hRat = rh / divisor;
                            if (wRat > 99 || hRat > 99) {
                                inputCustomRatio.value = wRat >= hRat ? `${+(wRat/hRat).toFixed(2)}:1` : `1:${+(hRat/wRat).toFixed(2)}`;
                            } else {
                                inputCustomRatio.value = `${wRat}:${hRat}`;
                            }
                        }
                    }
                }
            }
        
        drawPreview();
    };


        if (btnVert) btnVert.addEventListener("click", (e) => {
            e.preventDefault();
            state.layout = "vertical";
            btnVert.classList.add('active');
            if (btnHorz) btnHorz.classList.remove('active');
            drawPreview();
        });

        if (btnHorz) btnHorz.addEventListener("click", (e) => {
            e.preventDefault();
            state.layout = "horizontal";
            btnHorz.classList.add('active');
            if (btnVert) btnVert.classList.remove('active');
            drawPreview();
        });

        if (fontInput) {
            fontInput.addEventListener("keydown", (e) => {
                if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;
                if (!/[0-9]/.test(e.key)) e.preventDefault();
            });
            fontInput.addEventListener("input", () => {
                fontInput.value = fontInput.value.replace(/[^0-9]/g, '');
                const v = parseInt(fontInput.value, 10);
                const t = state.texts.find(x => x.id === state.selectedTextId);
                if (t && Number.isFinite(v)) {
                    t.fontSize = clamp(v, 1, 1400);
                    const info = state._layoutInfo;
                    if (info) {
                        const minH = t.fontSize / info.outH;
                        if (t.h < minH) t.h = minH * 1.2;
                    }
                    syncTextLayer();
                    drawPreview();
                }
            });
        }

        if (colorSelect) {
            const normalizeTextColor = (v) => {
                const s = String(v || "").trim().toLowerCase();
                if (s === "white") return "#ffffff";
                if (s === "black") return "#000000";
                if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;
                return "#ffffff";
            };

            const applyColor = () => {
                const v = normalizeTextColor(colorSelect.value);
                const t = state.texts.find(x => x.id === state.selectedTextId);
                const s = state.shapes ? state.shapes.find(x => x.id === state.selectedShapeId) : null;
                
                if (colorHexInput) colorHexInput.value = v;

                if (t) {
                    t.color = v;
                    drawPreview();
                } else if (s) {
                    s.color = v; // Update shape stroke
                    drawPreview();
                } else {
                    state.baseColor = v;
                    drawPreview();
                }
            };

            colorSelect.addEventListener("input", applyColor);
            colorSelect.addEventListener("change", applyColor);

            if (colorHexInput) {
                colorHexInput.addEventListener("input", (e) => {
                    let val = e.target.value;
                    if (!val.startsWith("#")) val = "#" + val;
                    if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
                        colorSelect.value = val;
                        applyColor();
                    }
                });
            }
        }

        const canvasHexInput = overlay.querySelector(".meme-creator-canvas-hex");

        if (canvasColorInput && canvasHexInput) {
            const initial = state.canvasColor || "#ffffff";
            canvasColorInput.value = initial;
            canvasHexInput.value = initial;

            canvasColorInput.addEventListener("input", (e) => {
                state.canvasColor = e.target.value;
                canvasHexInput.value = e.target.value;
                drawPreview();
            });
            canvasColorInput.addEventListener("change", () => saveHistory());

            canvasHexInput.addEventListener("input", (e) => {
                let val = e.target.value;
                if (!val.startsWith("#")) val = "#" + val;
                if (/^#[0-9A-F]{6}$/i.test(val)) {
                    state.canvasColor = val;
                    canvasColorInput.value = val;
                    drawPreview();
                    saveHistory();
                }
            });
        }

        if (canvasEffectSelect) {
            canvasEffectSelect.value = state.canvasEffect || "none";
            canvasEffectSelect.addEventListener("change", (e) => {
                state.canvasEffect = e.target.value;
                drawPreview();
                saveHistory();
            });
        }



        // Text Background (outline) OR Shape Fill
        if (shadowColorInput) shadowColorInput.addEventListener("input", () => {
            const v = shadowColorInput.value;
            if (shadowColorHexInput) shadowColorHexInput.value = v;
            
            const t = state.texts.find(x => x.id === state.selectedTextId);
            const s = state.shapes ? state.shapes.find(x => x.id === state.selectedShapeId) : null;
            
            if (t) {
                t.shadowColor = v;
                syncTextLayer();
                drawPreview();
            } else if (s) {
                s.fillColor = v;
                drawPreview();
            } else {
                state.baseShadowColor = v;
                syncTextLayer();
                drawPreview();
            }
        });

        if (shadowColorHexInput) {
            shadowColorHexInput.addEventListener("input", (e) => {
                let val = e.target.value;
                if (!val.startsWith("#")) val = "#" + val;
                if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
                    shadowColorInput.value = val;
                    shadowColorInput.dispatchEvent(new Event("input"));
                }
            });
        }

        if (shadowDepthSelect) shadowDepthSelect.addEventListener("input", () => {
            const depth = Math.max(1, Math.min(7, parseInt(shadowDepthSelect.value, 10) || 2));
            const t = state.texts.find(x => x.id === state.selectedTextId);
            if (t) {
                t.shadowDepth = depth;
            } else {
                state.baseShadowDepth = depth;
            }
            syncTextLayer();
            drawPreview();
        });

        if (textShadowDepthSelect) textShadowDepthSelect.addEventListener("input", () => {
            const depth = Math.max(1, Math.min(7, parseInt(textShadowDepthSelect.value, 10) || 3));
            const t = state.texts.find(x => x.id === state.selectedTextId);
            const s = state.shapes ? state.shapes.find(x => x.id === state.selectedShapeId) : null;

            if (t) {
                t.textShadowDepth = depth;
                syncTextLayer();
                drawPreview();
            } else if (s) {
                s.shadowBlur = depth;
                drawPreview();
            } else {
                state.baseTextShadowDepth = depth;
                syncTextLayer();
                drawPreview();
            }
        });

// Text Shadow (offset)
        if (textShadowColorInput) textShadowColorInput.addEventListener("input", () => {
            const v = textShadowColorInput.value;
            if (textShadowColorHexInput) textShadowColorHexInput.value = v;
            
            const t = state.texts.find(x => x.id === state.selectedTextId);
            const s = state.shapes ? state.shapes.find(x => x.id === state.selectedShapeId) : null;

            if (t) {
                t.textShadowColor = v;
                syncTextLayer();
                drawPreview();
            } else if (s) {
                s.shadowColor = v;
                drawPreview();
            } else {
                state.baseTextShadowColor = v;
                syncTextLayer();
                drawPreview();
            }
        });

        if (textShadowColorHexInput) {
            textShadowColorHexInput.addEventListener("input", (e) => {
                let val = e.target.value;
                if (!val.startsWith("#")) val = "#" + val;
                if (/^#[0-9A-Fa-f]{6}$/i.test(val)) {
                    textShadowColorInput.value = val;
                    textShadowColorInput.dispatchEvent(new Event("input"));
                }
            });
        }

        if (btnBgToggle) btnBgToggle.addEventListener("click", (e) => {
            e.preventDefault();
            const t = state.texts.find(x => x.id === state.selectedTextId);
            const s = state.shapes ? state.shapes.find(x => x.id === state.selectedShapeId) : null;

            if (t) {
                t.shadowEnabled = !t.shadowEnabled;
                syncTextLayer();
                drawPreview();
            } else if (s) {
                s.fillEnabled = !s.fillEnabled;
                if(!s.fillColor) s.fillColor = "#ffffff"; 
                drawPreview();
            } else {
                state.baseShadowEnabled = !state.baseShadowEnabled;
                syncTextLayer();
                drawPreview();
            }
            setSelected(state.selectedTextId, state.frameVisible); // refresh UI
        });

        if (btnTsToggle) btnTsToggle.addEventListener("click", (e) => {
            e.preventDefault();
            const t = state.texts.find(x => x.id === state.selectedTextId);
            const s = state.shapes ? state.shapes.find(x => x.id === state.selectedShapeId) : null;

            if (t) {
                t.textShadowEnabled = !t.textShadowEnabled;
                syncTextLayer();
                drawPreview();
            } else if (s) {
                s.shadowEnabled = !s.shadowEnabled;
                drawPreview();
            } else {
                state.baseTextShadowEnabled = !state.baseTextShadowEnabled;
                syncTextLayer();
                drawPreview();
            }
            setSelected(state.selectedTextId, state.frameVisible); // refresh UI
        });

        if (opacityInput) {
            opacityInput.addEventListener("input", () => {
                const val = parseFloat(opacityInput.value);
                // 1. Text Selected
                if (state.selectedTextId) {
                    const t = state.texts.find(x => x.id === state.selectedTextId);
                    if (t) {
                        t.opacity = val;
                        // Update DOM immediately (Target editor only)
                        const el = layer.querySelector(`.meme-text-item[data-id="${t.id}"] .meme-text-editor`);
                        if(el) el.style.opacity = val;
                        drawPreview();
                    }
                }
                // 2. Image Selected (Advanced Mode)
                else if (state.advancedMode && state.selectedImageIdx !== null) {
                    const img = state.images[state.selectedImageIdx];
                    if (img) {
                        img.opacity = val;
                        drawPreview();
                    }
                }
                // 3. Shape Selected
                else if (state.selectedShapeId) {
                    const s = state.shapes.find(x => x.id === state.selectedShapeId);
                    if (s) {
                        s.opacity = val;
                        drawPreview();
                    }
                }
            });
        }




if (weightSelect) weightSelect.addEventListener("change", () => {
    const w = weightSelect.value;
    const t = state.texts.find(x => x.id === state.selectedTextId);
    
    if (t) {
        t.fontWeight = w;
        // Update DOM editor immediately
        const el = layer.querySelector(`.meme-text-item[data-id="${t.id}"] .meme-text-editor`);
        if(el) el.style.fontWeight = w;
    } else {
        state.baseFontWeight = w;
    }
    
    syncTextLayer();
    drawPreview();
});

if (styleSelect) styleSelect.addEventListener("change", () => {
    const s = styleSelect.value;
    const t = state.texts.find(x => x.id === state.selectedTextId);
    
    if (t) {
        t.fontStyle = s;
        const el = layer.querySelector(`.meme-text-item[data-id="${t.id}"] .meme-text-editor`);
        if (el) {
            el.style.fontStyle = s === "italic" ? "italic" : "normal";
            el.style.fontWeight = s === "bold" ? "bold" : (t.fontWeight || state.baseFontWeight || "900");
        }
    } else {
        state.baseFontStyle = s;
    }
    
    syncTextLayer();
    drawPreview();
});


const updateFontChange = () => {
        const fam = fontSelect.value;
        const t = state.texts.find(x => x.id === state.selectedTextId);

        if (t) {
            t.fontFamily = fam;
        } else {
            state.baseFontFamily = fam;
        }

        if (document.fonts && fam) {
            const famQuoted = fam.includes(" ") ? `"${fam}"` : fam;
            document.fonts.load(`900 48px ${famQuoted}`).then(() => drawPreview());
        } else {
            drawPreview();
        }

        syncTextLayer();
    };


// SHAPE SIZE LOGIC (THICKNESS)
    const updateShapeSize = (delta, absoluteVal = null) => {
        const s = state.shapes ? state.shapes.find(x => x.id === state.selectedShapeId) : null;
        if (!s) return;

        let current = s.strokeWidth || 5;
        let newVal;
        
        if (absoluteVal !== null) {
            newVal = parseInt(absoluteVal, 10);
        } else {
            newVal = current + delta;
        }

        // Constraints (Thickness: 1px to 100px)
        newVal = Math.max(1, Math.min(100, newVal));
        
        s.strokeWidth = newVal;

        if (shapeSizeInput) shapeSizeInput.value = newVal;
        
        drawPreview();
    };
    if (shapeSizeInput) {
        shapeSizeInput.addEventListener("input", () => {
            updateShapeSize(0, shapeSizeInput.value);
        });
    }

    // Hold-to-repeat logic with 500ms delay
    const bindRepeater = (btn, amount) => {
        if (!btn) return;
        let delayTimer, repeatTimer;

        const stop = (e) => { 
            if(e) e.preventDefault(); 
            clearTimeout(delayTimer);
            clearInterval(repeatTimer); 
        };

        const start = (e) => {
            e.preventDefault();
            // Immediate single step
            updateShapeSize(amount);
            
            // Wait 500ms before starting rapid fire
            delayTimer = setTimeout(() => {
                repeatTimer = setInterval(() => updateShapeSize(amount), 100);
            }, 500);
        };

        btn.addEventListener("mousedown", start);
        btn.addEventListener("mouseup", stop);
        btn.addEventListener("mouseleave", stop);
    };

    bindRepeater(btnShapeSizeUp, 1);
    bindRepeater(btnShapeSizeDown, -1);

    if (btnShapeSizeDown) {
        btnShapeSizeDown.addEventListener("click", (e) => {
            e.preventDefault();
            updateShapeSize(-1); // -1%
        });
    }

        if (btnSave) btnSave.addEventListener("click", async (e) => {
            e.preventDefault();
            if (window._isGuestMode) return showGuestDialog();
            
            // 1. Fetch available folders (Always show Unsorted)
            let folderHtml = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <label style="font-weight:600; font-size:12px; margin:0;">Save to Folder(s):</label>
                    <button type="button" class="btn-create-folder-inline" title="Create Folder" style="background:#c0392b; color:#000; font-weight:900; border:none; border-radius:4px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; padding:0;">+</button>
                </div>
                <div style="max-height:120px; overflow-y:auto; border:1px solid #ccd0d5; border-radius:4px; padding:6px; background:#f7f8fa; margin-bottom:15px;">
                <label style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:4px; cursor:pointer; color:#1c1e21; user-select:none;">
                    <input type="checkbox" class="save-folder-check" value="0" style="cursor:pointer;"> 
                    <span>📁 Unsorted</span>
                </label>`;

            try {
                const res = await fetch('/api/categories/binder');
                const data = await res.json();
                if (data.categories) {
                     data.categories.forEach(c => {
                         folderHtml += `<label style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:4px; cursor:pointer; color:#1c1e21; user-select:none;">
                            <input type="checkbox" class="save-folder-check" value="${c.id}" style="cursor:pointer;"> 
                            <span>📁 ${__escapeHtml(c.name)}</span>
                         </label>`;
                     });
                }
            } catch(err) { console.error("Error fetching folders", err); }
            folderHtml += `</div>`;

            // 2. Show Dialog
            const div = document.createElement('div');
            div.className = 'custom-dialog-overlay open';
            div.style.zIndex = '10000';

            div.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 850px; width: 90vw; padding: 0; display: flex; overflow: hidden; height: 70vh; max-height: 600px;">
                    <div style="width: 340px; padding: 16px; display: flex; flex-direction: column; overflow-y: auto; border-right: 1px solid #ccd0d5; flex-shrink: 0;">
                        <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Save to Binder</h3>
                        <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Name:</label>
                        <input type="text" id="binderNameInput" class="settings-input" style="width:100%; margin-bottom:12px;" placeholder="Meme Name" autocomplete="off">
                        <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Keywords:</label>
                        <textarea id="binderKeywordsInput" class="custom-dialog-textarea" style="min-height:60px; margin-bottom:15px;" placeholder="movies, actor, animals" autocomplete="off"></textarea>
                        ${folderHtml}
                        <div class="dialog-actions" style="display:flex; justify-content:flex-end; gap:10px; margin-top: auto;">
                            <button type="button" class="btn-cancel" id="cancelBinderSave">Cancel</button>
                            <button type="button" class="btn-cancel" id="confirmBinderSave" style="font-weight:bold;">Save</button>
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; background: #f0f2f5; overflow: hidden;">
                        <div style="width: 150px; background: #fff; border-right: 1px solid #ccd0d5; padding: 10px; overflow-y: auto; font-size: 11px;" id="miniMemeFolders">
                            Loading folders...
                        </div>
                        <div style="flex: 1; padding: 10px; overflow-y: auto;">
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px;" id="miniMemeGrid">
                                <div style="color:#666;">Loading items...</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        document.body.appendChild(div);

        fetch('/api/memes/binder').then(r => r.json()).then(mData => {
            const items = mData.memes || [];
            const renderGrid = (catId) => {
                const grid = div.querySelector('#miniMemeGrid');
                if (!grid) return;
                let filtered = items;
                if (catId === 'unsorted') filtered = items.filter(m => !m.category_id || m.category_id == 0);
                else if (catId !== 'all') filtered = items.filter(m => m.category_id == catId);
                grid.innerHTML = '';
                if (!filtered.length) grid.innerHTML = '<div style="color:#666; font-size:12px;">No items here.</div>';
                filtered.forEach(m => {
                    const wrap = document.createElement('div');
                    wrap.style.cssText = 'background:#000; border-radius:4px; border:1px solid #ccc; position:relative; height:120px; overflow:hidden;';
                    const img = document.createElement('img');
                    img.src = __safeImageSrc(m.image_path);
                    img.style.cssText = 'width:100%; height:100%; object-fit:contain;';
                    const title = document.createElement('div');
                    title.style.cssText = 'position:absolute; top:0; left:0; right:0; background:rgba(0,0,0,0.7); color:#fff; font-size:10px; padding:2px 4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center;';
                    title.textContent = m.name || 'Untitled';
                    wrap.appendChild(img);
                    wrap.appendChild(title);
                    grid.appendChild(wrap);
                });
            };
            const renderSidebar = () => {
                const side = div.querySelector('#miniMemeFolders');
                if (!side) return;
                let html = `
                    <div class="folder-item active" data-cat="all" style="padding:6px; margin-bottom:2px;">📂 All Items</div>
                    <div class="folder-item" data-cat="unsorted" style="padding:6px; margin-bottom:2px;">📁 Unsorted</div>
                    <hr style="margin:6px 0; border:0; border-top:1px solid #ddd;">
                `;
                try {
                    const categories = Array.from(div.querySelectorAll('.save-folder-check')).map(cb => {
                        const span = cb.nextElementSibling;
                        return { id: cb.value, name: span ? span.textContent.replace('📁 ', '') : '' };
                    }).filter(c => c.id != "0");
                    categories.forEach(c => {
                        html += `<div class="folder-item" data-cat="${c.id}" style="padding:6px; margin-bottom:2px;">📁 ${__escapeHtml(c.name)}</div>`;
                    });
                } catch(e){}
                side.innerHTML = html;
                side.querySelectorAll('.folder-item').forEach(el => {
                    el.onclick = () => {
                        side.querySelectorAll('.folder-item').forEach(x => x.classList.remove('active'));
                        el.classList.add('active');
                        renderGrid(el.dataset.cat);
                    };
                });
            };
            renderSidebar();
            renderGrid('all');
        });

        

        const nameInput = div.querySelector('#binderNameInput');
            setTimeout(() => nameInput.focus(), 50);

            if (window._tempSaveName !== undefined) nameInput.value = window._tempSaveName;
            if (window._tempSaveKeys !== undefined) div.querySelector('#binderKeywordsInput').value = window._tempSaveKeys;
            window._tempSaveName = undefined;
            window._tempSaveKeys = undefined;

            const createFolderBtn = div.querySelector('.btn-create-folder-inline');
            if (createFolderBtn) {
                createFolderBtn.onclick = (e) => {
                    e.preventDefault();
                    const fd = document.createElement('div');
                    fd.className = 'custom-dialog-overlay open';
                    fd.style.zIndex = '10005';
                    fd.innerHTML = `
                        <div class="custom-dialog-box" style="max-width: 300px;">
                            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">New Folder</h3>
                            <input type="text" id="inlineFolderInput" class="settings-input" style="width:100%; margin-bottom:15px;" placeholder="Folder Name" autocomplete="off">
                            <div class="dialog-actions">
                                <button type="button" class="btn-cancel" id="inlineCancelFolder">Cancel</button>
                                <button type="button" class="btn-cancel" id="inlineConfirmFolder">Create</button>
                            </div>
                        </div>`;
                    document.body.appendChild(fd);
                    setTimeout(() => fd.querySelector('#inlineFolderInput').focus(), 50);
                    fd.querySelector('#inlineCancelFolder').onclick = () => fd.remove();
                    fd.querySelector('#inlineConfirmFolder').onclick = async () => {
                        const newName = fd.querySelector('#inlineFolderInput').value.trim();
                        if(newName) {
                            await fetch('/api/categories', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:newName, type:'binder'}) });
                            window._tempSaveName = div.querySelector('#binderNameInput').value;
                            window._tempSaveKeys = div.querySelector('#binderKeywordsInput').value;
                            fd.remove(); div.remove(); btnSave.click();
                        }
                    };
                };
            }

            div.querySelector('#cancelBinderSave').onclick = () => div.remove();
            
            div.querySelector('#confirmBinderSave').onclick = async () => {
                const name = nameInput.value.trim();
                const keywords = div.querySelector('#binderKeywordsInput').value.trim();
                
                // Collect checked categories
                const categories = Array.from(div.querySelectorAll('.save-folder-check:checked')).map(cb => cb.value);

                div.remove();
                await saveMeme("binder", { name, keywords, categories });
            };
        });

                if (btnSaveProgress) btnSaveProgress.addEventListener("click", async (e) => {
            e.preventDefault();
            if (window._isGuestMode) return showGuestDialog();
            await saveProgressDialog();
        });

        if (btnOpenProgress) btnOpenProgress.addEventListener("click", (e) => {
            e.preventDefault();
            window.openProgressOverlay();
        });

        if (btnDownload) btnDownload.addEventListener("click", (e) => {
            e.preventDefault();
            saveMeme("download");
        });


if (btnSaveTemplate) btnSaveTemplate.addEventListener("click", async (e) => {
    e.preventDefault();
    if (window._isGuestMode) return showGuestDialog();
    
    // 1. Fetch available template folders (Always show Unsorted)
    let folderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <label style="font-weight:600; font-size:12px; margin:0;">Save to Folder(s):</label>
            <button type="button" class="btn-create-folder-inline" title="Create Folder" style="background:#c0392b; color:#000; font-weight:900; border:none; border-radius:4px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; padding:0;">+</button>
        </div>
        <div style="max-height:120px; overflow-y:auto; border:1px solid #ccd0d5; border-radius:4px; padding:6px; background:#f7f8fa; margin-bottom:15px;">
        <label style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:4px; cursor:pointer; color:#1c1e21; user-select:none;">
            <input type="checkbox" class="save-folder-check" value="0" style="cursor:pointer;"> 
            <span>📁 Unsorted</span>
        </label>`;

    try {
        const res = await fetch('/api/categories/templates');
        const data = await res.json();
        if (data.categories) {
             data.categories.forEach(c => {
                 folderHtml += `<label style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:4px; cursor:pointer; color:#1c1e21; user-select:none;">
                    <input type="checkbox" class="save-folder-check" value="${c.id}" style="cursor:pointer;"> 
                    <span>📁 ${__escapeHtml(c.name)}</span>
                 </label>`;
             });
        }
    } catch(err) { console.error(err); }
    folderHtml += `</div>`;

    // 2. Create Dialog
    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '10000';

    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 850px; width: 90vw; padding: 0; display: flex; overflow: hidden; height: 70vh; max-height: 600px;">
            <div style="width: 340px; padding: 16px; display: flex; flex-direction: column; overflow-y: auto; border-right: 1px solid #ccd0d5; flex-shrink: 0;">
                <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Save Template</h3>
                <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Name Template:</label>
                <input type="text" id="templateNameInput" class="settings-input" style="width:100%; margin-bottom:12px;" placeholder="Template Name" autocomplete="off">
                <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Keywords:</label>
                <textarea id="templateKeywordsInput" class="custom-dialog-textarea" style="min-height:60px; margin-bottom:15px;" placeholder="cartoon, d&d, anime" autocomplete="off"></textarea>
                ${folderHtml}
                <div class="dialog-actions" style="display:flex; justify-content:flex-end; gap:10px; margin-top: auto;">
                    <button type="button" class="btn-cancel" id="cancelTemplateBtn">Cancel</button>
                    <button type="button" class="btn-cancel" id="confirmTemplateBtn" style="font-weight:bold;">Save</button>
                </div>
            </div>
            <div style="flex: 1; display: flex; background: #f0f2f5; overflow: hidden;">
                <div style="width: 150px; background: #fff; border-right: 1px solid #ccd0d5; padding: 10px; overflow-y: auto; font-size: 11px;" id="miniTemplateFolders">
                    Loading folders...
                </div>
                <div style="flex: 1; padding: 10px; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px;" id="miniTemplateGrid">
                        <div style="color:#666;">Loading items...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(div);

    fetch('/api/memes/templates').then(r => r.json()).then(tData => {
        const items = tData.templates || [];
        const renderGrid = (catId) => {
            const grid = div.querySelector('#miniTemplateGrid');
            if (!grid) return;
            let filtered = items;
            if (catId === 'unsorted') filtered = items.filter(m => !m.category_id || m.category_id == 0);
            else if (catId !== 'all') filtered = items.filter(m => m.category_id == catId);
            grid.innerHTML = '';
            if (!filtered.length) grid.innerHTML = '<div style="color:#666; font-size:12px;">No items here.</div>';
            filtered.forEach(m => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'background:#000; border-radius:4px; border:1px solid #ccc; position:relative; height:120px; overflow:hidden;';
                const img = document.createElement('img');
                img.src = __safeImageSrc(m.image_path);
                img.style.cssText = 'width:100%; height:100%; object-fit:contain;';
                const title = document.createElement('div');
                title.style.cssText = 'position:absolute; top:0; left:0; right:0; background:rgba(0,0,0,0.7); color:#fff; font-size:10px; padding:2px 4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center;';
                title.textContent = m.name || 'Untitled';
                wrap.appendChild(img);
                wrap.appendChild(title);
                grid.appendChild(wrap);
            });
        };
        const renderSidebar = () => {
            const side = div.querySelector('#miniTemplateFolders');
            if (!side) return;
            let html = `
                <div class="folder-item active" data-cat="all" style="padding:6px; margin-bottom:2px;">📂 All Items</div>
                <div class="folder-item" data-cat="unsorted" style="padding:6px; margin-bottom:2px;">📁 Unsorted</div>
                <hr style="margin:6px 0; border:0; border-top:1px solid #ddd;">
            `;
            try {
                const categories = Array.from(div.querySelectorAll('.save-folder-check')).map(cb => {
                    const span = cb.nextElementSibling;
                    return { id: cb.value, name: span ? span.textContent.replace('📁 ', '') : '' };
                }).filter(c => c.id != "0");
                categories.forEach(c => {
                    html += `<div class="folder-item" data-cat="${c.id}" style="padding:6px; margin-bottom:2px;">📁 ${__escapeHtml(c.name)}</div>`;
                });
            } catch(e){}
            side.innerHTML = html;
            side.querySelectorAll('.folder-item').forEach(el => {
                el.onclick = () => {
                    side.querySelectorAll('.folder-item').forEach(x => x.classList.remove('active'));
                    el.classList.add('active');
                    renderGrid(el.dataset.cat);
                };
            });
        };
        renderSidebar();
        renderGrid('all');
    });

    

    const close = () => {
        div.remove();
        delete overlay.dataset.closeOnSave;
    };
    const confirmBtn = div.querySelector('#confirmTemplateBtn');
    const cancelBtn = div.querySelector('#cancelTemplateBtn');
    const nameInput = div.querySelector('#templateNameInput');
    const keyInput = div.querySelector('#templateKeywordsInput');

    setTimeout(() => nameInput.focus(), 50);

    if (window._tempSaveName !== undefined) nameInput.value = window._tempSaveName;
    if (window._tempSaveKeys !== undefined) keyInput.value = window._tempSaveKeys;
    window._tempSaveName = undefined;
    window._tempSaveKeys = undefined;

    const createFolderBtn = div.querySelector('.btn-create-folder-inline');
    if (createFolderBtn) {
        createFolderBtn.onclick = (e) => {
            e.preventDefault();
            const fd = document.createElement('div');
            fd.className = 'custom-dialog-overlay open';
            fd.style.zIndex = '10005';
            fd.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 300px;">
                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">New Folder</h3>
                    <input type="text" id="inlineFolderInput" class="settings-input" style="width:100%; margin-bottom:15px;" placeholder="Folder Name" autocomplete="off">
                    <div class="dialog-actions">
                        <button type="button" class="btn-cancel" id="inlineCancelFolder">Cancel</button>
                        <button type="button" class="btn-cancel" id="inlineConfirmFolder">Create</button>
                    </div>
                </div>`;
            document.body.appendChild(fd);
            setTimeout(() => fd.querySelector('#inlineFolderInput').focus(), 50);
            fd.querySelector('#inlineCancelFolder').onclick = () => fd.remove();
            fd.querySelector('#inlineConfirmFolder').onclick = async () => {
                const newName = fd.querySelector('#inlineFolderInput').value.trim();
                if(newName) {
                    await fetch('/api/categories', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:newName, type:'templates'}) });
                    window._tempSaveName = div.querySelector('#templateNameInput').value;
                    window._tempSaveKeys = div.querySelector('#templateKeywordsInput').value;
                    fd.remove(); div.remove(); btnSaveTemplate.click();
                }
            };
        };
    }

    cancelBtn.onclick = () => {
        div.remove();
        delete overlay.dataset.closeOnSave; 
    };

    confirmBtn.onclick = async () => {
        const name = nameInput.value.trim() || 'Untitled';
        const keywords = keyInput.value.trim();
        const categories = Array.from(div.querySelectorAll('.save-folder-check:checked')).map(cb => cb.value);

        await saveMeme("template", { name, keywords, categories });

        // Check flags BEFORE removing the dialog
        const shouldClose = (overlay.dataset.closeOnSave === 'true');
        const shouldPublish = (overlay.dataset.publishOnSave === 'true');
        
        div.remove();
        delete overlay.dataset.closeOnSave;

        if (shouldPublish) {
            delete overlay.dataset.publishOnSave;
            saveMeme("publish");
        } else if (shouldClose) {
            closeEditor(true);
        }
    };
});

window._lastBinderCallback = async (file, mode) => {
     const img = await loadImageFromFile(file);

     if (!state.advancedMode) {
         btnAdvanced.click();
         state.fixedSize = { w: img.width, h: img.height };
         const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
         const divisor = gcd(img.width, img.height);
         const inputCustomRatio = document.querySelector(".meme-custom-ratio-input");
         if (inputCustomRatio) inputCustomRatio.value = `${img.width/divisor}:${img.height/divisor}`;
     }

     if (mode === 'background') {
         state.fixedSize = { w: img.width, h: img.height };
         state.images.unshift({ file, img, x:0, y:0, w:img.width, h:img.height, zIndex:-9999, locked:true });
     } else {
         const w = 266;
         const h = 266 / (img.width / img.height);
         state.images.push({ file, img, x:100, y:100, w, h, zIndex: state.nextZIndex++ });
     }
     syncTextLayer();
     drawPreview();
     saveHistory();
};

if (btnBinder) btnBinder.addEventListener("click", (e) => {
    e.preventDefault();
    window.openMemeBinderOverlay(window._lastBinderCallback);
});

if (btnTemplate) btnTemplate.addEventListener("click", (e) => {
    e.preventDefault();
    window.openTemplateOverlay(window._lastBinderCallback);
});

if (btnAdvanced) btnAdvanced.addEventListener("click", (e) => {
    e.preventDefault();

    if (!state.advancedMode && (state.images.length > 0 || state.texts.length > 0 || (state.shapes && state.shapes.length > 0))) {
        if (state._aspectChoice === undefined) {
            const d = document.createElement('div');
            d.className = 'custom-dialog-overlay open';
            d.style.zIndex = '20000';
            d.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 320px; text-align: center;">
                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Keep current aspect ratio?</h3>
                    <div class="dialog-actions" style="display: flex; justify-content:space-between; gap:10px;">
                        <button class="btn-cancel" id="aspectNo" style="width:45%;">No</button>
                        <button class="btn-cancel" id="aspectYes" style="width:45%;">Yes</button>
                    </div>
                </div>`;
            document.body.appendChild(d);
            d.querySelector('#aspectNo').onclick = () => { d.remove(); state._aspectChoice = false; btnAdvanced.click(); };
            d.querySelector('#aspectYes').onclick = () => { d.remove(); state._aspectChoice = true; btnAdvanced.click(); };
            return;
        }
    }

    const keepAspect = state._aspectChoice === true;
    state._aspectChoice = undefined;

    if (!state.advancedMode) {
        if (keepAspect && state._layoutInfo) {
            state.fixedSize = { w: state._layoutInfo.outW, h: state._layoutInfo.outH };
            state.images.forEach((img, idx) => {
                const r = state._layoutInfo.rects[idx];
                if (r) { img.x = r.x; img.y = r.y; img.w = r.w; img.h = r.h; }
            });
        } else {
            state.fixedSize = { w: 1920, h: 1080 };
        }
    }

    state.advancedMode = !state.advancedMode;
    
    if (window._isGuestMode && state.advancedMode) {
        showGuestDialog(() => {
            if (btnAdvanced) btnAdvanced.click();
        });
    }
            
            if (state.advancedMode) {
                if (!state.fixedSize) {
                    state.fixedSize = { w: 1920, h: 1080 };
                    if(btnSizeH) btnSizeH.classList.add('active');
                    if(btnSizeV) btnSizeV.classList.remove('active');
                    if(inputCustomRatio) inputCustomRatio.value = "16:9";
                } else {
                    const { w, h } = state.fixedSize;
                    [btnSizeAuto, btnSizeV, btnSizeH, btnSizeSq, btnSizePort, selectBookSize].forEach(b => { if(b) b.classList.remove('active'); });
                    if (selectBookSize) selectBookSize.value = "";
                    
                    const isAuto = keepAspect && state._layoutInfo && w === state._layoutInfo.outW && h === state._layoutInfo.outH;
                    if (isAuto && btnSizeAuto) btnSizeAuto.classList.add('active');
                    else if (w === 1080 && h === 1920 && btnSizeV) btnSizeV.classList.add('active');
                    else if (w === 1920 && h === 1080 && btnSizeH) btnSizeH.classList.add('active');
                    else if (w === 1080 && h === 1080 && btnSizeSq) btnSizeSq.classList.add('active');
                    else if (w === 1080 && h === 1350 && btnSizePort) btnSizePort.classList.add('active');
                    else if (selectBookSize) {
                        if (w === 1000 && h === 1600) { selectBookSize.value = "5:8"; selectBookSize.classList.add('active'); }
                        else if (w === 1080 && h === 1620) { selectBookSize.value = "2:3"; selectBookSize.classList.add('active'); }
                        else if (w === 1080 && h === 1750) { selectBookSize.value = "1:1.62"; selectBookSize.classList.add('active'); }
                        else if (w === 2400 && h === 2400) { selectBookSize.value = "1:1"; selectBookSize.classList.add('active'); }
                        else if (w === 2400 && h === 1200) { selectBookSize.value = "2:1"; selectBookSize.classList.add('active'); }
                        else if (w === 1200 && h === 630) { selectBookSize.value = "1.91:1"; selectBookSize.classList.add('active'); }
                        else if (w === 1500 && h === 500) { selectBookSize.value = "3:1"; selectBookSize.classList.add('active'); }
                        else if (w === 1584 && h === 396) { selectBookSize.value = "4:1"; selectBookSize.classList.add('active'); }
                        else if (w === 2550 && h === 3300) { selectBookSize.value = "8.5:11"; selectBookSize.classList.add('active'); }
                        else if (w === 2480 && h === 3508) { selectBookSize.value = "1:1.414"; selectBookSize.classList.add('active'); }
                        else if (w === 1500 && h === 2100) { selectBookSize.value = "5:7"; selectBookSize.classList.add('active'); }
                        else if (w === 1024 && h === 768) { selectBookSize.value = "4:3"; selectBookSize.classList.add('active'); }
                    }
                    
                    if (inputCustomRatio) {
                        if (w === 1080 && h === 1920) inputCustomRatio.value = "9:16";
                        else if (w === 1920 && h === 1080) inputCustomRatio.value = "16:9";
                        else if (w === 1080 && h === 1080) inputCustomRatio.value = "1:1";
                        else if (w === 1080 && h === 1350) inputCustomRatio.value = "4:5";
                        else if (w === 1000 && h === 1600) inputCustomRatio.value = "5:8";
                        else if (w === 1080 && h === 1620) inputCustomRatio.value = "2:3";
                        else if (w === 1080 && h === 1750) inputCustomRatio.value = "1:1.62";
                        else if (w === 2400 && h === 2400) inputCustomRatio.value = "1:1";
                        else if (w === 2400 && h === 1200) inputCustomRatio.value = "2:1";
                            else {
                                if (state.customRatioString) {
                                    inputCustomRatio.value = state.customRatioString;
                                } else {
                                    const rw = Math.round(w), rh = Math.round(h);
                                    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
                                    const divisor = gcd(rw, rh);
                                    const wRat = rw / divisor;
                                    const hRat = rh / divisor;
                                    if (wRat > 99 || hRat > 99) {
                                        inputCustomRatio.value = wRat >= hRat ? `${+(wRat/hRat).toFixed(2)}:1` : `1:${+(hRat/wRat).toFixed(2)}`;
                                    } else {
                                        inputCustomRatio.value = `${wRat}:${hRat}`;
                                    }
                                }
                            }
                        }
                    }
                } else {
    if (state.cropMode) finishCropMode(false);

    if (state.paintMode && btnPaintCanvas) {
        btnPaintCanvas.click(); // safe: paint button handler turns paint off and returns early
    }
}


            if (state.advancedMode) {
                state.whiteSpacePos = "none";
                updateWhitespaceBtnLabel();
            }
            
            // Update Toggle Button Style
            btnAdvanced.textContent = state.advancedMode ? "ON" : "OFF";
            btnAdvanced.classList.toggle('active', state.advancedMode);
            
            // Toggle controls visibility
            if (btnVert) btnVert.parentElement.parentElement.style.display = state.advancedMode ? 'none' : 'flex';
            if (btnWhitespace) btnWhitespace.style.display = state.advancedMode ? 'none' : 'block';
            
            // Toggle Zoom vs Layer Controls
            if (btnZoom) btnZoom.style.display = state.advancedMode ? 'none' : 'block';
            
            const displayStyle = state.advancedMode ? 'inline-flex' : 'none';
            if (btnSizeAuto) { btnSizeAuto.classList.toggle("is-hidden", !state.advancedMode); btnSizeAuto.style.display = displayStyle; }
            if (btnSizeV) { btnSizeV.classList.toggle("is-hidden", !state.advancedMode); btnSizeV.style.display = displayStyle; }
            if (btnSizeH) { btnSizeH.classList.toggle("is-hidden", !state.advancedMode); btnSizeH.style.display = displayStyle; }
            if (btnSizeSq) { btnSizeSq.classList.toggle("is-hidden", !state.advancedMode); btnSizeSq.style.display = displayStyle; }
            if (btnSizePort) { btnSizePort.classList.toggle("is-hidden", !state.advancedMode); btnSizePort.style.display = displayStyle; }
            if (selectBookSize) { selectBookSize.classList.toggle("is-hidden", !state.advancedMode); selectBookSize.style.display = displayStyle; }
            
            if (btnStageCrop) {
                btnStageCrop.classList.toggle("is-hidden", !state.advancedMode);
                btnStageCrop.style.display = state.advancedMode ? 'inline-flex' : 'none';
            }
            if (inputCustomRatio) {
    inputCustomRatio.classList.toggle("is-hidden", !state.advancedMode);
    inputCustomRatio.style.display = state.advancedMode ? 'inline-flex' : 'none';
}

if (layerControls) layerControls.style.display = state.advancedMode ? 'flex' : 'none';
if (transformRow) transformRow.style.display = state.advancedMode ? 'flex' : 'none';
if (canvasOptionsRow) canvasOptionsRow.style.display = state.advancedMode ? 'flex' : 'none';
if (opacityControl) opacityControl.style.display = state.advancedMode ? 'flex' : 'none';
if (cropRow) cropRow.style.display = state.advancedMode ? 'flex' : 'none';
objectToolsRows.forEach(el => {
                if (el) el.style.display = state.advancedMode ? 'flex' : 'none';
            });
            if (btnSaveTemplate) btnSaveTemplate.style.display = 'inline-flex';

            const hint = overlay.querySelector(".meme-creator-hint");
            if (hint) hint.classList.toggle("is-hidden", state.advancedMode);

            drawPreview();
    });


const resetSizeBtns = () => {
            [btnSizeAuto, btnSizeV, btnSizeH, btnSizeSq, btnSizePort, selectBookSize].forEach(b => { if(b) b.classList.remove('active'); });
            if (selectBookSize) selectBookSize.value = "";

            if (state.cropMode) finishCropMode(false);
            if (state.cutMode) { state.cutMode = false; state.cutPath = []; updateCropUi(); }
            if (state.lassoMode) { state.lassoMode = false; state.cutPath = []; updateCropUi(); }
            if (state.stageCropMode) {
                state.stageCropMode = false;
                state.stageCropRect = null;
                document.body.classList.remove("osb-stagecrop-hover");
                if (btnStageCrop) {
                    btnStageCrop.classList.remove('active');
                    btnStageCrop.style.setProperty("background-color", "#f7f8e8", "important");
                    btnStageCrop.style.setProperty("color", "#e67e22", "important");
                    btnStageCrop.style.setProperty("border-color", "#e67e22", "important");
                }
                if (layer) layer.style.cursor = "default";
            }
        };

        if (selectBookSize) {
            const restoreBookSizeTexts = () => {
                Array.from(selectBookSize.options).forEach(opt => {
                    if (opt.dataset.full) opt.textContent = opt.dataset.full;
                });
            };
            const applyBookSizeShortText = () => {
                Array.from(selectBookSize.options).forEach(opt => {
                    if (opt.dataset.short) opt.textContent = opt.dataset.short;
                });
            };

            applyBookSizeShortText();

            selectBookSize.addEventListener("mousedown", function(e) {
                if (document.activeElement === this) {
                    e.preventDefault();
                    this.blur();
                }
            });
            
            selectBookSize.addEventListener("focus", restoreBookSizeTexts);
            selectBookSize.addEventListener("blur", applyBookSizeShortText);

            selectBookSize.addEventListener("change", (e) => {
                e.preventDefault();
                const val = e.target.value;
                if (val === "5:8") state.fixedSize = { w: 1000, h: 1600 };
                else if (val === "2:3") state.fixedSize = { w: 1080, h: 1620 };
                else if (val === "1:1.62") state.fixedSize = { w: 1080, h: 1750 };
                else if (val === "1:1") state.fixedSize = { w: 2400, h: 2400 };
                else if (val === "2:1") state.fixedSize = { w: 2400, h: 1200 };
                else if (val === "1.91:1") state.fixedSize = { w: 1200, h: 630 };
                else if (val === "3:1") state.fixedSize = { w: 1500, h: 500 };
                else if (val === "4:1") state.fixedSize = { w: 1584, h: 396 };
                else if (val === "8.5:11") state.fixedSize = { w: 2550, h: 3300 };
                else if (val === "1:1.414") state.fixedSize = { w: 2480, h: 3508 };
                else if (val === "5:7") state.fixedSize = { w: 1500, h: 2100 };
                else if (val === "4:3") state.fixedSize = { w: 1024, h: 768 };
                
                resetSizeBtns();
                selectBookSize.value = val; 
                selectBookSize.classList.add('active');
                if (inputCustomRatio) inputCustomRatio.value = val;
                drawPreview();
                applyBookSizeShortText();
                selectBookSize.blur();
            });
        }

        if (btnSizeV) btnSizeV.addEventListener("click", (e) => {
            e.preventDefault();
            state.fixedSize = { w: 1080, h: 1920 };
            resetSizeBtns();
            btnSizeV.classList.add('active');
            if (inputCustomRatio) inputCustomRatio.value = "9:16";
            drawPreview();
        });

        if (btnSizeH) btnSizeH.addEventListener("click", (e) => {
            e.preventDefault();
            state.fixedSize = { w: 1920, h: 1080 };
            resetSizeBtns();
            btnSizeH.classList.add('active');
            if (inputCustomRatio) inputCustomRatio.value = "16:9";
            drawPreview();
        });

        if (btnSizeSq) btnSizeSq.addEventListener("click", (e) => {
            e.preventDefault();
            state.fixedSize = { w: 1080, h: 1080 };
            resetSizeBtns();
            btnSizeSq.classList.add('active');
            if (inputCustomRatio) inputCustomRatio.value = "1:1";
            drawPreview();
        });

        if (btnSizePort) btnSizePort.addEventListener("click", (e) => {
            e.preventDefault();
            state.fixedSize = { w: 1080, h: 1350 }; 
            resetSizeBtns();
            btnSizePort.classList.add('active');
            if (inputCustomRatio) inputCustomRatio.value = "4:5";
            drawPreview();
        });


function ensureStageCropDragCursorCss() {
    if (document.getElementById("osb-stagecrop-cursor-css")) return;
    const s = document.createElement("style");
    s.id = "osb-stagecrop-cursor-css";
    s.textContent = `
.osb-stagecrop-hover,
.osb-stagecrop-hover * {
  cursor: grab !important;
}
.osb-stagecrop-dragging,
.osb-stagecrop-dragging * {
  cursor: grabbing !important;
}
`;
    document.head.appendChild(s);
}


        // Cursor feedback for Stage Crop handles
   layer.addEventListener("mousemove", (e) => {
    if (!state.stageCropMode) return;
    if (e.buttons > 0) return;

    const info = state._layoutInfo;
    const rect = layer.getBoundingClientRect();
    if (!info || !rect.width || !rect.height || !state.stageCropRect || state.stageCropRect.w <= 0) {
        layer.style.cursor = "crosshair";
        canvas.style.cursor = "crosshair";
        document.body.style.cursor = "crosshair";
        return;
    }

        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        const r = state.stageCropRect;
        const rx = r.x * rect.width;
        const ry = r.y * rect.height;
        const rw = r.w * rect.width;
        const rh = r.h * rect.height;

        const tol = 18;
        const hitW = 34;

        let hit = false;

        if (Math.abs(py - ry) <= tol && Math.abs(px - (rx + rw / 2)) <= hitW) hit = true;
        else if (Math.abs(py - (ry + rh)) <= tol && Math.abs(px - (rx + rw / 2)) <= hitW) hit = true;
        else if (Math.abs(px - rx) <= tol && Math.abs(py - (ry + rh / 2)) <= hitW) hit = true;
        else if (Math.abs(px - (rx + rw)) <= tol && Math.abs(py - (ry + rh / 2)) <= hitW) hit = true;

        ensureStageCropDragCursorCss();
        document.body.classList.toggle("osb-stagecrop-hover", hit);

        layer.style.cursor = hit ? "grab" : "default";
canvas.style.cursor = hit ? "grab" : "default";
document.body.style.cursor = hit ? "grab" : "default";
    });

    layer.addEventListener("mousedown", (e) => {
            if (state.stageCropMode) {
                const rect = layer.getBoundingClientRect();
                const info = state._layoutInfo;
                if (!info || !rect.width || !rect.height) return;

                const nX = (e.clientX - rect.left) / rect.width;
const nY = (e.clientY - rect.top) / rect.height;
const startX = nX * info.outW;
const startY = nY * info.outH;

let dragMode = null;
let startRect = null;

// 1. Check if clicking existing handles
if (state.stageCropRect && state.stageCropRect.w > 0) {
     const r = state.stageCropRect;
     const rx = r.x * info.outW;
     const ry = r.y * info.outH;
     const rw = r.w * info.outW;
     const rh = r.h * info.outH;
     const tol = 10;
     const hitW = 30;

     if (Math.abs(startY - ry) < tol && Math.abs(startX - (rx + rw / 2)) < hitW) dragMode = 'n';
     else if (Math.abs(startY - (ry + rh)) < tol && Math.abs(startX - (rx + rw / 2)) < hitW) dragMode = 's';
     else if (Math.abs(startX - rx) < tol && Math.abs(startY - (ry + rh / 2)) < hitW) dragMode = 'w';
     else if (Math.abs(startX - (rx + rw)) < tol && Math.abs(startY - (ry + rh / 2)) < hitW) dragMode = 'e';

     if (dragMode) startRect = { ...r };
}

                // 2. If no handle hit, determine action
                if (!dragMode) {
                    // If no box exists (or it's invisible), create new one
                    if (!state.stageCropRect || state.stageCropRect.w <= 0.001) {
                        dragMode = 'new';
                    }
                    // ELSE: Box exists but we missed the handles -> FALL THROUGH to standard item selection
                }

                // 3. Execute Crop Drag (Create or Resize) if applicable
                if (dragMode) {
                    e.stopPropagation();
                    e.preventDefault();

                    ensureStageCropDragCursorCss();
                    document.body.classList.remove("osb-stagecrop-hover");
                    document.body.classList.add("osb-stagecrop-dragging");
                    layer.style.cursor = "grabbing";
                    canvas.style.cursor = "grabbing";
                    document.body.style.cursor = "grabbing";

                    if (dragMode === 'new') {
                        state.stageCropRect = { x: nX, y: nY, w: 0, h: 0 };
                    }

                    const onCropMove = (me) => {
    layer.style.cursor = "grabbing";
    document.body.style.cursor = "grabbing";

    const cnX = (me.clientX - rect.left) / rect.width;
    const cnY = (me.clientY - rect.top) / rect.height;
    const currX = cnX * info.outW;
    const currY = cnY * info.outH;
    
    if (dragMode === 'new') {
        let w = cnX - nX;
        let h = cnY - nY;
        state.stageCropRect = {
            x: w < 0 ? cnX : nX,
            y: h < 0 ? cnY : nY,
            w: Math.abs(w),
            h: Math.abs(h)
        };
    } else {
        let { x, y, w, h } = startRect;
        let px = x * info.outW;
        let py = y * info.outH;
        let pw = w * info.outW;
        let ph = h * info.outH;

        if (dragMode === 'n') {
             let newY = Math.min(currY, py + ph - 5);
             ph = (py + ph) - newY;
             py = newY;
        } else if (dragMode === 's') {
             ph = Math.max(5, currY - py);
        } else if (dragMode === 'w') {
             let newX = Math.min(currX, px + pw - 5);
             pw = (px + pw) - newX;
             px = newX;
        } else if (dragMode === 'e') {
                     pw = Math.max(5, currX - px);
                }

                state.stageCropRect = {
                     x: px / info.outW,
                     y: py / info.outH,
                     w: pw / info.outW,
                     h: ph / info.outH
                };
            }

            const ratioInput = overlay.querySelector(".meme-custom-ratio-input");
            if (ratioInput && state.stageCropRect) {
                const rw = Math.round(state.stageCropRect.w * info.outW);
                const rh = Math.round(state.stageCropRect.h * info.outH);
                if (rw > 0 && rh > 0) {
                    let r = rw / rh;
                    let bestN = 1, bestD = 1, minErr = Infinity;
                    
                    for (let d = 1; d <= 99; d++) {
                        let n = Math.round(r * d);
                        if (n > 99) continue;
                        let err = Math.abs(r - n / d);
                        if (err < minErr) {
                            minErr = err;
                            bestN = n;
                            bestD = d;
                        }
                    }

                    if (minErr < 0.005) {
                        ratioInput.value = `${bestN}:${bestD}`;
                    } else {
                        if (rw >= rh) {
                            ratioInput.value = `${+(rw / rh).toFixed(2)}:1`;
                        } else {
                            ratioInput.value = `1:${+(rh / rw).toFixed(2)}`;
                        }
                    }
                }
            }

            drawPreview();
        };

                    const onCropUp = () => {
                        window.removeEventListener("mousemove", onCropMove);
                        window.removeEventListener("mouseup", onCropUp);
                        
                        document.body.classList.remove("osb-stagecrop-dragging");
                        layer.style.cursor = "default";
                        canvas.style.cursor = "default";
                        document.body.style.cursor = "default";
                    };
                    window.addEventListener("mousemove", onCropMove);
                    window.addEventListener("mouseup", onCropUp);
                    return; 
                }
            }

            if (!state.advancedMode) return;
            if (state.paintMode) return;
            if (state.cropMode) return;
            if (state.cutMode) return;
            if (state.lassoMode) return; 
            if (e.target.closest('.meme-resize-handle, .meme-rotate-handle, .meme-delete-handle, .meme-empty-state-btn')) return;

            const rect = layer.getBoundingClientRect();
            const info = state._layoutInfo;
            if (!info || !rect.width || !rect.height) return;
            const mouseX = ((e.clientX - rect.left) / rect.width) * info.outW;
            const mouseY = ((e.clientY - rect.top) / rect.height) * info.outH;

            const hitList = [];

            state.images.forEach((img, idx) => {
                if (img.w === undefined) return;
                hitList.push({ type: 'image', data: img, index: idx, z: img.zIndex || 0 });
            });

            if (state.shapes && info) {
                state.shapes.forEach((s) => {
                    hitList.push({ type: 'shape', data: s, z: s.zIndex || 0 });
                });
            }

            if (state.texts && info) {
                state.texts.forEach((t) => {
                    hitList.push({ type: 'text', data: t, z: t.zIndex || 0 });
                });
            }

            hitList.sort((a, b) => b.z - a.z);

            // Find all hits under cursor
            const actualHits = [];
            for (let item of hitList) {
                if (item.type === 'image') {
                    const img = item.data;
                    if (mouseX >= img.x && mouseX <= img.x + img.w && mouseY >= img.y && mouseY <= img.y + img.h) {
                        actualHits.push(item);
                    }
                } else if (item.type === 'shape') {
                    const s = item.data;
                    const sx = s.x * info.outW;
                    const sy = s.y * info.outH;
                    const sw = s.w * info.outW;
                    const sh = s.h * info.outH;
                    if (mouseX >= sx && mouseX <= sx + sw && mouseY >= sy && mouseY <= sy + sh) {
                        actualHits.push(item);
                    }
                } else if (item.type === 'text') {
                    const t = item.data;
                    const tx = t.x * info.outW;
                    const ty = t.y * info.outH;
                    const tw = t.w * info.outW;
                    const th = t.h * info.outH;
                    if (mouseX >= tx && mouseX <= tx + tw && mouseY >= ty && mouseY <= ty + th) {
                        actualHits.push(item);
                    }
                }
            }

            let hitItem = null;
            if (actualHits.length > 0) {
                // Prioritize the currently selected item if it is under the cursor
                let activeHit = null;
                if (state.selectedImageIdx !== null) {
                    activeHit = actualHits.find(h => h.type === 'image' && h.index === state.selectedImageIdx);
                } else if (state.selectedShapeId !== null) {
                    activeHit = actualHits.find(h => h.type === 'shape' && h.data.id === state.selectedShapeId);
                } else if (state.selectedTextId !== null) {
                    activeHit = actualHits.find(h => h.type === 'text' && h.data.id === state.selectedTextId);
                }

                hitItem = activeHit || actualHits[0];
            }

            if (!hitItem) {
                state.selectedImageIdx = null;
                state.selectedShapeId = null;
                state.multiSelected = [];
                if (opacityControl && opacityInput) {
                    opacityControl.style.opacity = "0.5";
                    opacityControl.style.pointerEvents = "none";
                    opacityInput.disabled = true;
                }
                drawPreview();
                syncTextLayer();
                return;
            }

            e.stopPropagation();
            
            let isMultiDeselect = false;
            let startClientX = e.clientX;
            let startClientY = e.clientY;

            if (state.multiSelectMode || e.shiftKey) {
                if (!state.multiSelected) state.multiSelected = [];
                const idx = state.multiSelected.findIndex(x => x.data === hitItem.data);
                if (idx >= 0) {
                    const isMainSelected = (hitItem.type === 'image' && state.selectedImageIdx === hitItem.index) ||
                                           (hitItem.type === 'shape' && state.selectedShapeId === hitItem.data.id);
                    if (isMainSelected) {
                        isMultiDeselect = true;
                    }
                } else {
                    state.multiSelected.push(hitItem);
                }
            } else {
                if (state.multiSelected && state.multiSelected.length > 1 && state.multiSelected.find(x => x.data === hitItem.data)) {
                } else {
                    state.multiSelected = [];
                }
            }

            if (isMultiDeselect) {
                const deselectUp = (me) => {
                    window.removeEventListener("mouseup", deselectUp);
                    if (Math.abs(me.clientX - startClientX) < 3 && Math.abs(me.clientY - startClientY) < 3) {
                        const idx = state.multiSelected.findIndex(x => x.data === hitItem.data);
                        if (idx >= 0) {
                            state.multiSelected.splice(idx, 1);
                            if (hitItem.type === 'image' && state.selectedImageIdx === hitItem.index) state.selectedImageIdx = null;
                            if (hitItem.type === 'shape' && state.selectedShapeId === hitItem.data.id) state.selectedShapeId = null;
                            drawPreview();
                            syncTextLayer();
                        }
                    }
                };
                window.addEventListener("mouseup", deselectUp);
            }

            state.selectedTextId = null;

            if (hitItem.type === 'image') {
                state.selectedImageIdx = hitItem.index;
                state.selectedShapeId = null;
                setSelected(null, false); // Clear shape UI

                // Image Drag Logic
                const targetImg = hitItem.data;
                const offsetX = mouseX - targetImg.x;
                const offsetY = mouseY - targetImg.y;
                
                if (opacityInput) {
                    opacityInput.value = (targetImg.opacity !== undefined) ? targetImg.opacity : 1;
                    if (opacityControl) {
                        opacityControl.style.opacity = "1";
                        opacityControl.style.pointerEvents = "auto";
                        opacityInput.disabled = false;
                    }
                }

                drawPreview();

                const onMove = (me) => {
                    if (targetImg.locked || targetImg.posLocked) return;
                    const mx = ((me.clientX - rect.left) / rect.width) * info.outW;
                    const my = ((me.clientY - rect.top) / rect.height) * info.outH;
                    
                    const prevX = targetImg.x;
                    const prevY = targetImg.y;
                    
                    targetImg.x = mx - offsetX;
                    targetImg.y = my - offsetY;

                    window._checkSnapToCenter(targetImg, 'image', info);

                    const dx = targetImg.x - prevX;
                    const dy = targetImg.y - prevY;

                    if (targetImg.groupId) {
                        state.images.forEach(i => { if (i !== targetImg && i.groupId === targetImg.groupId && !i.locked && !i.posLocked) { i.x += dx; i.y += dy; }});
                        (state.shapes || []).forEach(s => { if (s.groupId === targetImg.groupId && !s.locked && !s.posLocked) { s.x += dx/info.outW; s.y += dy/info.outH; }});
                        state.texts.forEach(t => { if (t.groupId === targetImg.groupId && !t.locked && !t.posLocked) { t.x += dx/info.outW; t.y += dy/info.outH; }});
                    }
                    if (state.multiSelected && state.multiSelected.find(m => m.data === targetImg)) {
                        state.multiSelected.forEach(m => {
                            if (m.data !== targetImg && !m.data.locked && !m.data.posLocked) {
                                if (m.type === 'image') { m.data.x += dx; m.data.y += dy; }
                                else { m.data.x += dx/info.outW; m.data.y += dy/info.outH; }
                            }
                        });
                    }
                state._showSnapLines = true;
                queuedDrawPreview();
            };

            const onUp = (me) => {
                state._showSnapLines = false;
                drawPreview();
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);

                if (Math.abs(me.clientX - startClientX) < 3 && Math.abs(me.clientY - startClientY) < 3) {
                    if (actualHits.length > 0 && actualHits[0] !== hitItem && !isMultiDeselect && !state.multiSelectMode && !e.shiftKey) {
                        const topHit = actualHits[0];
                        if (topHit.type === 'image') {
                            state.selectedImageIdx = topHit.index;
                            state.selectedShapeId = null;
                            state.selectedTextId = null;
                            setSelected(null, false);
                        } else if (topHit.type === 'shape') {
                            state.selectedShapeId = topHit.data.id;
                            state.selectedImageIdx = null;
                            state.selectedTextId = null;
                            setSelected(null, false);
                        } else if (topHit.type === 'text') {
                            state.selectedTextId = topHit.data.id;
                            state.selectedImageIdx = null;
                            state.selectedShapeId = null;
                            setSelected(topHit.data.id, true);
                        }
                        drawPreview();
                        syncTextLayer();
                    }
                }
            };

            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);

        } else if (hitItem.type === 'shape') {
            // Shape Logic
            const sShape = hitItem.data;
                state.selectedShapeId = sShape.id;
                state.selectedImageIdx = null;
                setSelected(null, false); // Refresh shape UI

                const offX = mouseX - (sShape.x * info.outW);
                const offY = mouseY - (sShape.y * info.outH);

                const onShapeMove = (me) => {
                    if (sShape.locked || sShape.posLocked) return;
                    const mx = ((me.clientX - rect.left) / rect.width) * info.outW;
                    const my = ((me.clientY - rect.top) / rect.height) * info.outH;

                    const prevX = sShape.x;
                    const prevY = sShape.y;

                    sShape.x = (mx - offX) / info.outW;
                    sShape.y = (my - offY) / info.outH;

                    window._checkSnapToCenter(sShape, 'shape', info);

                    const dxNorm = sShape.x - prevX;
                    const dyNorm = sShape.y - prevY;

                    if (sShape.groupId) {
                        (state.shapes || []).forEach(s => { if (s !== sShape && s.groupId === sShape.groupId && !s.locked && !s.posLocked) { s.x += dxNorm; s.y += dyNorm; }});
                        state.texts.forEach(t => { if (t.groupId === sShape.groupId && !t.locked && !t.posLocked) { t.x += dxNorm; t.y += dyNorm; }});
                        state.images.forEach(i => { if (i.groupId === sShape.groupId && !i.locked && !i.posLocked) { i.x += dxNorm * info.outW; i.y += dyNorm * info.outH; }});
                    }
                    if (state.multiSelected && state.multiSelected.find(m => m.data === sShape)) {
                        state.multiSelected.forEach(m => {
                            if (m.data !== sShape && !m.data.locked && !m.data.posLocked) {
                                if (m.type === 'image') { m.data.x += dxNorm * info.outW; m.data.y += dyNorm * info.outH; }
                                else { m.data.x += dxNorm; m.data.y += dyNorm; }
                            }
                        });
                    }
                state._showSnapLines = true;
                queuedDrawPreview();
                syncTextLayer();
            };

            const onShapeUp = (me) => {
                state._showSnapLines = false;
                drawPreview();
                window.removeEventListener("mousemove", onShapeMove);
                window.removeEventListener("mouseup", onShapeUp);

                if (Math.abs(me.clientX - startClientX) < 3 && Math.abs(me.clientY - startClientY) < 3) {
                    if (actualHits.length > 0 && actualHits[0] !== hitItem && !isMultiDeselect && !state.multiSelectMode && !e.shiftKey) {
                        const topHit = actualHits[0];
                        if (topHit.type === 'image') {
                            state.selectedImageIdx = topHit.index;
                            state.selectedShapeId = null;
                            state.selectedTextId = null;
                            setSelected(null, false);
                        } else if (topHit.type === 'shape') {
                            state.selectedShapeId = topHit.data.id;
                            state.selectedImageIdx = null;
                            state.selectedTextId = null;
                            setSelected(null, false);
                        } else if (topHit.type === 'text') {
                            state.selectedTextId = topHit.data.id;
                            state.selectedImageIdx = null;
                            state.selectedShapeId = null;
                            setSelected(topHit.data.id, true);
                        }
                        drawPreview();
                        syncTextLayer();
                    }
                }
            };

            window.addEventListener("mousemove", onShapeMove);
            window.addEventListener("mouseup", onShapeUp);
            syncTextLayer();
            drawPreview();
        } else if (hitItem.type === 'text') {
            state.selectedTextId = hitItem.data.id;
            state.selectedImageIdx = null;
            state.selectedShapeId = null;
            setSelected(hitItem.data.id, true);
            drawPreview();
            syncTextLayer();
        }
    });

    // Advanced Mode: Resize Images (Mouse Wheel)
        layer.addEventListener("wheel", (e) => {
            if (!state.advancedMode) return;
            if (state.cropMode) return;

            e.preventDefault();
            e.stopPropagation();

            const rect = layer.getBoundingClientRect();
            const info = state._layoutInfo;
            if (!info || !rect.width || !rect.height) return;

            const mouseX = ((e.clientX - rect.left) / rect.width) * info.outW;
            const mouseY = ((e.clientY - rect.top) / rect.height) * info.outH;

            for (let i = state.images.length - 1; i >= 0; i--) {
                const img = state.images[i];
                if (img.w === undefined) continue;
                if (mouseX >= img.x && mouseX <= img.x + img.w &&
                    mouseY >= img.y && mouseY <= img.y + img.h) {
                    
                    const delta = Math.sign(e.deltaY) * -0.1;
                    const newScale = Math.max(0.1, 1 + delta);
                    
                    const oldW = img.w;
                    const oldH = img.h;
                    
                    img.w *= newScale;
                    img.h *= newScale;
                    
                    // Zoom centered on image
                    img.x -= (img.w - oldW) / 2;
                    img.y -= (img.h - oldH) / 2;
                    
                    drawPreview();
                    break;
                }
            }
        }, { passive: false });

        if (box) {
            box.addEventListener("mousedown", (e) => e.stopPropagation());
        }

        layer.addEventListener("mousedown", (e) => {
            if (e.target === layer) setSelected(null);
        });
    }

   // Apply UI state
    updateWhitespaceBtnLabel();
    updateZoomBtnLabel();

    // Init Opacity State & Sync UI with Loaded Progress
    if (opacityControl && opacityInput) {
        const hasSel = state.selectedTextId || (state.selectedImageIdx !== null && state.selectedImageIdx !== undefined) || state.selectedShapeId;
        opacityControl.style.opacity = hasSel ? "1" : "0.5";
        opacityControl.style.pointerEvents = hasSel ? "auto" : "none";
        opacityInput.disabled = !hasSel;
    }

    // Sync Advanced Mode UI if loaded state requires it
    if (state.advancedMode) {
        if (btnAdvanced) {
            btnAdvanced.textContent = "ON";
            btnAdvanced.classList.add('active');
        }
        
        // Toggle visibility
        if (btnVert && btnVert.parentElement && btnVert.parentElement.parentElement) {
            btnVert.parentElement.parentElement.style.display = 'none';
        }
        if (btnWhitespace) btnWhitespace.style.display = 'none';
        if (btnZoom) btnZoom.style.display = 'none';
        
        // Show Advanced Tools
        if (btnSizeAuto) btnSizeAuto.classList.remove("is-hidden");
        if (btnSizeV) btnSizeV.classList.remove("is-hidden");
        if (btnSizeH) btnSizeH.classList.remove("is-hidden");
        if (btnSizeSq) btnSizeSq.classList.remove("is-hidden");
        if (btnSizePort) btnSizePort.classList.remove("is-hidden");
        if (selectBookSize) selectBookSize.classList.remove("is-hidden");
        if (btnStageCrop) btnStageCrop.style.display = 'inline-flex';
        if (inputCustomRatio) inputCustomRatio.style.display = 'inline-flex';

        if (layerControls) {
            layerControls.style.display = 'flex';
            const groupContexts = layerControls.parentElement.querySelectorAll('.group-context');
            groupContexts.forEach(el => el.style.display = 'flex');
        }
        if (transformRow) transformRow.style.display = 'flex';
        if (opacityControl) opacityControl.style.display = 'flex';
        if (cropRow) cropRow.style.display = 'flex';
        if (btnSaveTemplate) btnSaveTemplate.style.display = 'inline-flex';

        const hint = overlay.querySelector(".meme-creator-hint");
        if (hint) hint.style.display = 'none';

        // Sync Size Buttons
        if (state.fixedSize) {
            [btnSizeAuto, btnSizeV, btnSizeH, btnSizeSq, btnSizePort].forEach(b => { if(b) b.classList.remove('active'); });
            const { w, h } = state.fixedSize;
            const isAuto = state._layoutInfo && w === state._layoutInfo.outW && h === state._layoutInfo.outH;
            if (isAuto && btnSizeAuto) btnSizeAuto.classList.add('active');
            else if (w === 1080 && h === 1920 && btnSizeV) btnSizeV.classList.add('active');
            else if (w === 1920 && h === 1080 && btnSizeH) btnSizeH.classList.add('active');
            else if (w === 1080 && h === 1080 && btnSizeSq) btnSizeSq.classList.add('active');
            else if (w === 1080 && h === 1350 && btnSizePort) btnSizePort.classList.add('active');
        }
        
        if (state.stageCropMode && btnStageCrop) {
            btnStageCrop.classList.add('active');
            btnStageCrop.style.setProperty("background-color", "#fff9c4", "important");
            btnStageCrop.style.setProperty("color", "#333", "important");
            btnStageCrop.style.setProperty("border-color", "#fbc02d", "important");
        }
    } else {
        // Sync Standard Mode Layout Buttons
        if (state.layout === 'horizontal' && btnHorz) {
            btnHorz.classList.add('active');
            if(btnVert) btnVert.classList.remove('active');
        } else if (btnVert) {
            btnVert.classList.add('active');
            if(btnHorz) btnHorz.classList.remove('active');
        }
    }

    if (fontInput) fontInput.value = String(state.baseFontSize || 48);
    if (colorSelect) colorSelect.value = __normalizeMemeTextColor(state.baseColor || "#ffffff");
    
    const snapToggleRef = overlay.querySelector(".meme-snap-btn");
    if (snapToggleRef) snapToggleRef.classList.toggle("active", !!state.snapEnabled);

        // Restore Mode
    if (localStorage.getItem("mc_viewMode") === "timeline") {

        if (timelineView && timelineView.style.display === "flex") {
            loadTimelineFeed();
        }
    }


    // Load images if needed
    (async () => {
        if (!state.images.length) {
            state.sourceFiles = sourceFiles;
            state.images = [];
            for (const f of sourceFiles) {
                const img = await loadImageFromFile(f);
                state.images.push({ file: f, img, zIndex: state.nextZIndex++ });
            }

if (state.images.length > 1) {
    state.baseFontSize = 36;
} else {
    state.baseFontSize = 48;
}

        }

        drawPreview();
        
        requestAnimationFrame(() => drawPreview());

        saveHistory(); // Save initial state
    })().catch(err => console.error("Meme creator load error:", err));
}




function __escapeHtml(s) {
    return String(s || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function __escapeAttr(s) { return __escapeHtml(s); }
function __safeHttpUrl(u) {
    const s = String(u || '').trim();
    if (!s) return '';
    try {
        const x = new URL(s, location.origin);
        if (x.protocol === 'http:' || x.protocol === 'https:') return x.href;
    } catch (e) {}
    return '';
}
function __safeImageSrc(u) {
    const s = String(u || '').trim();
    if (!s) return '';
    if (s.startsWith('/uploads/') || s.startsWith('uploads/')) return s;
    if (s.startsWith('data:') || s.startsWith('blob:')) return s;
    return __safeHttpUrl(s);
}

function __ensureTimelineDelegation(feedContainer) {
    if (!feedContainer || feedContainer._timelineDelegated) return;
    feedContainer._timelineDelegated = true;

    feedContainer.addEventListener('click', (e) => {
        const el = e.target.closest('[data-action]');
        if (!el || !feedContainer.contains(el)) return;

        const action = el.getAttribute('data-action');
        const uid = parseInt(el.getAttribute('data-user-id') || '0', 10);
        const pid = parseInt(el.getAttribute('data-post-id') || '0', 10);
        const src = el.getAttribute('data-src') || '';
        const tag = el.getAttribute('data-tag');

        if (action === 'clearTagFilter') { window.filterTimelineTag(null); return; }
        if (action === 'filterTag') { window.filterTimelineTag(tag || null); return; }
        if (action === 'openProfile') { if (uid) window.openCreatorProfile(uid); return; }
        if (action === 'deletePost') { if (pid) window.confirmDeletePost(el, pid); return; }
        if (action === 'banUser') { if (uid) window.banUser(el, uid); return; }
        if (action === 'followUser') { if (uid) window.followUser(el, uid); return; }
        if (action === 'openImage') { if (src) window.openImageModal(src); return; }
        if (action === 'likePost') { if (pid) window.likePost(el, pid); return; }
        if (action === 'repostPost') { if (pid) window.repostPost(pid); return; }
        if (action === 'savePost') { if (src) window.saveTimelinePost(src); return; }
        if (action === 'remixPost') { if (src) window.remixPost(src); return; }
        if (action === 'filterAuthor') {
            const name = el.getAttribute('data-author-name') || '';
            if (uid) window.filterTimelineAuthor(uid, name);
            return;
        }
    }, false);
}

window._openGalleryLightbox = function(idx) {

    const items = window._galleryItems || [];
    if (!items[idx]) return;

    let overlay = document.getElementById('galleryLightbox');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'galleryLightbox';
    overlay.style.cssText = "position:fixed; top:0; left:0; right:0; bottom:0; z-index:13000; background:rgba(0,0,0,0.9); display:flex; flex-direction:column; align-items:center; justify-content:center; -webkit-user-select:none; user-select:none;";
    
    overlay.innerHTML = `
        <button id="glbClose" style="position:absolute; top:20px; right:20px; z-index:100; background:none; border:none; color:#fff; font-size:30px; cursor:pointer; padding:10px;">&times;</button>
        <div style="flex:1; display:flex; align-items:center; justify-content:center; width:100%; position:relative;">
            <button id="glbPrev" style="position:absolute; left:20px; background:rgba(255,255,255,0.2); border:none; color:#fff; font-size:40px; cursor:pointer; padding:10px 20px; border-radius:4px; transition:background 0.2s;">&#10094;</button>
            <img id="glbImg" style="max-width:90%; max-height:85vh; object-fit:contain; box-shadow:0 0 20px rgba(0,0,0,0.5);">
            <button id="glbNext" style="position:absolute; right:20px; background:rgba(255,255,255,0.2); border:none; color:#fff; font-size:40px; cursor:pointer; padding:10px 20px; border-radius:4px; transition:background 0.2s;">&#10095;</button>
        </div>
    `;
    document.body.appendChild(overlay);

    let cur = idx;
    const update = () => {
        if (cur < 0) cur = items.length - 1;
        if (cur >= items.length) cur = 0;
        const item = items[cur];
        const img = overlay.querySelector('#glbImg');
img.src = __safeImageSrc(item.image_path);

    };

    const close = () => { overlay.remove(); window.removeEventListener('keydown', onKey); };

    const onKey = (e) => {
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') { cur--; update(); }
        else if (e.key === 'ArrowRight') { cur++; update(); }
    };

    overlay.querySelector('#glbClose').onclick = close;
    overlay.querySelector('#glbPrev').onclick = () => { cur--; update(); };
    overlay.querySelector('#glbNext').onclick = () => { cur++; update(); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay || (e.target.parentElement === overlay && e.target.tagName === 'DIV')) close(); });

    window.addEventListener('keydown', onKey);
    update();
};

window.openMemeBinderOverlay = function(onSelectCallback) {
    if (onSelectCallback) window._lastBinderCallback = onSelectCallback;
    else if (window._lastBinderCallback) onSelectCallback = window._lastBinderCallback;

    let overlay = document.getElementById('memeBinderOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'memeBinderOverlay';
        overlay.className = 'gallery-panel open'; 
        overlay.style.zIndex = '9600'; 
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
                <div class="gallery-backdrop" data-action="binderClose"></div>
        <div class="gallery-content" style="display:flex; flex-direction:column;">
            <div class="gallery-header">
                <div style="display:flex; align-items:center; gap:8px;">
    Meme Binder 
       <span style="cursor:pointer; font-size:16px;" title="Download Collection" data-action="binderDownload">💾</span>
    <span style="cursor:pointer; font-size:16px;" title="Upload Images" data-action="binderUpload">⬆️</span>
    <span style="cursor:pointer; font-size:16px;" title="Edit Mode" data-action="binderToggleEdit">✏️</span>
    <select id="binderSortSelect" style="font-size:11px; border:1px solid #ccc; border-radius:4px; margin-left:8px; padding:2px; height:24px;">
                <option value="alpha">Alphabetical</option>
                <option value="dateDesc" selected>Date Descending</option>
                <option value="dateAsc">Date Ascending</option>
            </select>
            <button type="button" class="btn-public" style="padding: 2px 8px; font-size: 11px; margin-left: 8px; background-color: #d1c4e9; color: #4a148c; box-shadow: inset 0 3px 6px rgba(0,0,0,0.3); transform: translateY(2px); cursor: default;" data-action="binderGoMemes">Memes</button>
            <button type="button" class="btn-public" style="padding: 2px 8px; font-size: 11px; margin-left: 4px; background-color: #009688;" data-action="binderGoTemplates">Templates</button>
            <button type="button" class="btn-public" style="padding: 2px 8px; font-size: 11px; margin-left: 4px; background-color: #ffcc80; color: #4e342e;" data-action="binderGoProgress">In-Progress</button>
        </div>

                                <button class="gallery-close" data-action="binderClose">×</button>

            </div>
            
            <div class="gallery-body">
                <div class="gallery-sidebar">
                    <button type="button" id="btnSortBinderFolders" style="width:100%; margin-bottom:8px; font-size:11px; padding:6px; background:#e0e0e0; color:#333; border:1px solid #ccc; border-radius:4px; cursor:pointer; font-weight:bold;">Sort: Alphabetical</button>
                    <div id="binderFolderList" style="flex:1; overflow-y:auto;"></div>
                    <button type="button" class="btn-public" id="btnCreateFolder" style="width:100%; margin-top:8px; font-size:11px; padding:6px;">+ New Folder</button>
                </div>

                 <div class="gallery-main">
                <div style="padding:10px; border-bottom:1px solid #eee;">
   <div id="binderEditActions" style="display:none; align-items:center; gap:8px; margin-bottom:10px;">
        <button type="button" class="btn-public" data-action="binderToggleEdit" style="padding:6px 10px; font-size:12px; background-color:#c0392b; box-shadow: 0 3px 0 #922b21;" title="Cancel Edit">✕</button>
        <button type="button" class="btn-public" id="binderMoveBtn" style="padding:6px 10px; font-size:12px;">Move To</button>
        <button type="button" class="btn-public" id="binderBulkDeleteBtn" style="padding:6px 10px; font-size:12px; background-color:#c0392b; box-shadow: 0 3px 0 #922b21;">Delete</button>
        <div id="binderSelCount" style="font-size:12px; color:#444; font-weight:800; margin-left:4px;"></div>
    </div>

    <div style="display:flex; gap:10px; align-items:center;">
        <input id="binderSearchInput" type="text" placeholder="Search... separate keywords with commas" autocomplete="off" style="margin-bottom:0;">
        <input id="binderZoom" type="range" min="100" max="600" value="250" style="width:80px; cursor:pointer; accent-color: #2196f3;" title="Zoom">
    </div>
</div>

                    <div class="gallery-grid" id="memeBinderGrid" style="flex:1; padding:10px;">
                        <div style="color:#666; padding:20px; text-align:center;">Loading...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

       if (!overlay._binderClickBound) {
        overlay._binderClickBound = true;

        overlay.addEventListener("click", (e) => {
            const el = e.target && e.target.closest ? e.target.closest("[data-action]") : null;
            const action = el ? el.dataset.action : "";
            if (!action) return;

            if (action === "binderClose") {
                overlay.remove();
                return;
            }

            if (action === "binderDownload") {
                window.confirmDownloadCollection("binder");
                return;
            }

            if (action === "binderUpload") {
                window.openGalleryUploadDialog("binder");
                return;
            }

            if (action === "binderToggleEdit") {
                if (window._toggleBinderEditMode) window._toggleBinderEditMode();
                return;
            }

            if (action === "binderGoTemplates") {
                overlay.remove();
                window.openTemplateOverlay(window._lastBinderCallback);
                return;
            }

            if (action === "binderGoProgress") {
                overlay.remove();
                window.openProgressOverlay();
                return;
            }
        });
    }

    // Parallel Fetch: Memes + Categories

  Promise.all([
        fetch('/api/memes/binder').then(r => r.json()),
        fetch('/api/categories/binder').then(r => r.json())
    ]).then(([memeData, catData]) => {
        const memes = memeData.memes || [];
        const categories = catData.categories || [];
binderCategories = categories;

        let currentCatId = window._preservedBinderCat !== undefined ? window._preservedBinderCat : 'all';

        const grid = document.getElementById('memeBinderGrid');
const folderList = document.getElementById('binderFolderList');
const input = document.getElementById('binderSearchInput');
const zoom = document.getElementById('binderZoom');
const btnNewFolder = document.getElementById('btnCreateFolder');
const sortSelect = document.getElementById('binderSortSelect');

let binderFolderSort = 'alpha';
const btnSortFolders = document.getElementById('btnSortBinderFolders');
if (btnSortFolders) {
    btnSortFolders.onclick = () => {
        if (binderFolderSort === 'alpha') { binderFolderSort = 'dateDesc'; btnSortFolders.textContent = 'Sort: Date Created Desc'; }
        else if (binderFolderSort === 'dateDesc') { binderFolderSort = 'dateAsc'; btnSortFolders.textContent = 'Sort: Date Created Asc'; }
        else { binderFolderSort = 'alpha'; btnSortFolders.textContent = 'Sort: Alphabetical'; }
        renderFolders();
    };
}


if (grid && !grid._binderDelegationAttached) {
    grid._binderDelegationAttached = true;

    grid.addEventListener('click', (e) => {
        const actionEl = e.target.closest('[data-action]');
        if (!actionEl || !grid.contains(actionEl)) return;

        const item = actionEl.closest('.gallery-grid-item');
        if (!item) return;

        const id = parseInt(item.dataset.binderId, 10);
        const index = parseInt(item.dataset.binderIndex, 10);
        const src = item.dataset.binderSrc || '';
        const name = item.dataset.binderName || '';
        const keys = item.dataset.binderKeys || '';

        const action = actionEl.dataset.action;

        if (action === 'editMeta') return window.editBinderMeta(id, name, keys);
        if (action === 'toggleSelect') return window._binderCheckboxClick && window._binderCheckboxClick(e, id, index);
        if (action === 'preview') return window._binderImgClick && window._binderImgClick(e, id, index);
        if (action === 'addCanvas') return window._selectBinderItem(src, name);
        if (action === 'delete') return window.confirmDeleteMeme(id);
    });

    grid.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.gallery-grid-item');
        if (!item || !grid.contains(item)) return;

        const id = parseInt(item.dataset.binderId, 10);
        const sourceCatId = item.dataset.binderCat || 'all';
        const sourceCatName = item.dataset.binderCatname || 'All Items';

        if (window._binderDragStart) window._binderDragStart(e, id, sourceCatId, sourceCatName);
    });
}


if (sortSelect) {
    sortSelect.onchange = () => {
        // Trigger search input event to re-run filters and render
        if (input) input.dispatchEvent(new Event('input'));
    };
}

binderEditActions = document.getElementById('binderEditActions');
binderMoveBtn = document.getElementById('binderMoveBtn');
binderBulkDeleteBtn = document.getElementById('binderBulkDeleteBtn');
binderSelCount = document.getElementById('binderSelCount');

if (binderMoveBtn) binderMoveBtn.onclick = openBinderMoveDialog;
if (binderBulkDeleteBtn) binderBulkDeleteBtn.onclick = openBinderBulkDeleteDialog;


        // Render Sidebar
        const renderFolders = () => {
    folderList.textContent = "";

    const makeDropHandlers = (el, catId) => {
        el.addEventListener("dragover", (e) => {
            e.preventDefault();
            el.style.backgroundColor = "#e3f2fd";
        });
        el.addEventListener("dragleave", () => {
            el.style.backgroundColor = "";
        });
        el.addEventListener("drop", (e) => {
            e.preventDefault();
            el.style.backgroundColor = "";
            window._binderDrop(e, catId);
        });
    };

    const addFolderItem = (labelText, catId, withDelete) => {
        const item = document.createElement("div");
        item.className = "folder-item" + (String(currentCatId) === String(catId) ? " active" : "");
        item.textContent = labelText;

        item.addEventListener("click", () => window._setBinderCat(catId));
        makeDropHandlers(item, (catId === "unsorted") ? 0 : catId);

        if (withDelete) {
            item.textContent = "";

            const left = document.createElement("span");
            left.textContent = labelText;

            const del = document.createElement("span");
            del.className = "folder-del";
            del.textContent = "×";
            del.addEventListener("click", (e) => {
                e.stopPropagation();
                window._deleteFolder(catId, "binder");
            });

            item.appendChild(left);
            item.appendChild(del);
        }

        folderList.appendChild(item);
    };

    addFolderItem("📂 All Items", "all", false);
    addFolderItem("📁 Unsorted", "unsorted", false);

    const hr = document.createElement("hr");
    hr.style.border = "0";
    hr.style.borderTop = "1px solid #ddd";
    hr.style.margin = "4px 0";
    folderList.appendChild(hr);

    let sortedCats = [...categories];
    if (binderFolderSort === 'alpha') {
        sortedCats.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (binderFolderSort === 'dateDesc') {
        sortedCats.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else {
        sortedCats.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    }

    sortedCats.forEach((c) => {
        addFolderItem(`📁 ${c.name || ""}`, c.id, true);
    });
};


        // Helper to switch category
        window._setBinderCat = (id) => {
            currentCatId = id;
            window._preservedBinderCat = id; // Save state globally so it persists across reloads
            renderFolders();
            input.value = ""; 
            input.dispatchEvent(new Event('input')); 
        };

        // Helper to delete folder
        window._deleteFolder = async (id, type) => {
            if(!confirm('Delete this folder? Items inside will move to Unsorted.')) return;
            await fetch('/api/categories/delete', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id, type}) });
            document.getElementById('memeBinderOverlay').remove();
            window.openMemeBinderOverlay(onSelectCallback);
        };

        // Create Folder
        btnNewFolder.onclick = (e) => {
            e.preventDefault();
            const d = document.createElement('div');
            d.className = 'custom-dialog-overlay open';
            d.style.zIndex = '13000';
            d.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 300px;">
                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">New Folder</h3>
                    <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Folder Name:</label>
                    <input type="text" id="newFolderInput" class="settings-input" style="width:100%; margin-bottom:15px;" placeholder="My Stuff" autocomplete="off">
                    <div class="dialog-actions">
                        <button type="button" class="btn-cancel" id="cancelFolder">Cancel</button>
                        <button type="button" class="btn-cancel" id="confirmFolder">Create</button>
                    </div>
                </div>
            `;
            document.body.appendChild(d);
            const input = d.querySelector('#newFolderInput');
            setTimeout(() => input.focus(), 50);

            const submit = async () => {
                const name = input.value.trim();
                if(name) {
                    await fetch('/api/categories', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name, type:'binder'}) });
                    d.remove();
                    document.getElementById('memeBinderOverlay').remove();
                    window.openMemeBinderOverlay(onSelectCallback);
                }
            };

            d.querySelector('#cancelFolder').onclick = () => d.remove();
            d.querySelector('#confirmFolder').onclick = submit;

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submit();
                }
            });
        };

            if(!grid || !input) return;

            let currentSize = 250;

const applyZoom = (val) => {
    const n = Math.max(100, Math.min(600, parseInt(val, 10) || 250));
    currentSize = n;
    if (zoom) zoom.value = String(n);
    grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${n}px, 1fr))`;
    Array.from(grid.children).forEach(c => c.style.height = n + "px");
};

// 1) Instant load from this browser (fast)
applyZoom(localStorage.getItem("mc_binderZoom") || 250);

// 2) If logged in (web mode), override from server so it follows the user to other browsers
if (window.location.protocol !== "file:") {
    fetch("/api/prefs/zoom")
        .then(r => (r.ok ? r.json() : null))
        .then(d => {
            if (d && d.success && d.binderZoom != null) {
                applyZoom(d.binderZoom);
                localStorage.setItem("mc_binderZoom", String(d.binderZoom));
            }
        })
        .catch(() => {});
}

// 3) Save on change (local + server)
if (zoom) {
    zoom.oninput = (e) => {
        applyZoom(e.target.value);
        localStorage.setItem("mc_binderZoom", String(currentSize));

        if (window.location.protocol !== "file:") {
            fetch("/api/prefs/zoom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ binderZoom: currentSize })
            }).catch(() => {});
        }
    };
}


           // Initial Render Sidebar
        renderFolders();

        const render = (items) => {
            // 1. Filter by Search (passed in 'items')
            // 2. Filter by Category
            let filtered = items;
            
            if (currentCatId === 'unsorted') {
                filtered = items.filter(m => !m.category_id || m.category_id == 0);
            } else if (currentCatId !== 'all') {
                filtered = items.filter(m => m.category_id == currentCatId);
            }

            // 3. Sort
            const sortMode = document.getElementById('binderSortSelect') ? document.getElementById('binderSortSelect').value : 'dateDesc';
            filtered.sort((a, b) => {
                if (sortMode === 'alpha') return (a.name || '').localeCompare(b.name || '');
                if (sortMode === 'dateAsc') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                // Default dateDesc
                return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            });

            // Figure out the current folder name once (used for drag metadata)
let curName = "All Items";
if (currentCatId === "unsorted") curName = "Unsorted";
else if (currentCatId !== "all") {
    const c = categories.find(cat => cat.id == currentCatId);
    if (c) curName = c.name;
}

if (filtered.length === 0) {
    grid.replaceChildren();
    const msg = document.createElement("div");
    msg.style.cssText = "color:#666; padding:20px; text-align:center;";
    msg.textContent = "No items here.";
    grid.appendChild(msg);
    return;
}

window._galleryItems = filtered;
window._galleryType = "binder";

grid.replaceChildren();

filtered.forEach((m, index) => {
    const itemName = String(m.name || "");
    const itemKeys = String(m.keywords || "");
    const itemSrc = String(m.image_path || "");
    const safeSrc = __safeImageSrc(itemSrc);

    const card = document.createElement("div");
    card.className = "gallery-grid-item";
    card.id = "meme-item-" + m.id;
    card.style.position = "relative";
    card.style.height = currentSize + "px";
    card.draggable = true;

    // data for existing binder handlers
    card.dataset.binderId = String(m.id);
    card.dataset.binderIndex = String(index);
    card.dataset.binderCat = String(currentCatId);
    card.dataset.binderCatname = String(curName);
    card.dataset.binderSrc = String(safeSrc);
    card.dataset.binderName = itemName;
    card.dataset.binderKeys = itemKeys;

    const title = document.createElement("div");
    title.className = "overlay-title";
    title.title = "Click to edit name";
    title.dataset.action = "editMeta";
    title.textContent = itemName || "Untitled";

    const checkbox = document.createElement("div");
    checkbox.className = "mc-edit-checkbox";
    checkbox.dataset.action = "toggleSelect";

    const img = document.createElement("img");
    img.src = safeSrc;
    img.style.cursor = "pointer";
    img.dataset.action = "preview";

    const add = document.createElement("div");
    add.className = "meme-template-add";
    add.title = "Add to Canvas";
    add.dataset.action = "addCanvas";
    add.textContent = "＋";

    const trash = document.createElement("div");
    trash.className = "meme-binder-trash";
    trash.title = "Delete";
    trash.dataset.action = "delete";
    trash.style.zIndex = "30";
    trash.textContent = "🗑️";

    const keys = document.createElement("div");
    keys.className = "overlay-keywords";
    keys.title = "Click to edit keywords";
    keys.dataset.action = "editMeta";
    
    let displayKeys = "No keywords";
    if (itemKeys) {
        displayKeys = itemKeys.split(',').map(k => k.trim().toLowerCase()).filter(k => k).map(k => '#' + k).join(' ');
    }
    keys.textContent = displayKeys;

    card.append(title, checkbox, img, add, trash, keys);
    grid.appendChild(card);
});


            };

            render(memes);

           input.addEventListener('input', () => {
                const terms = String(input.value || '').toLowerCase().split(',').map(t => t.trim()).filter(Boolean);
                if (terms.length === 0) return render(memes);

                const filtered = memes.filter(m => {
                    const nameVal = String(m.name || '').toLowerCase();
                    const kWords = String(m.keywords || '').toLowerCase().split(',');
                    return terms.every(term => {
                        const nameMatch = nameVal.startsWith(term);
                        const keywordMatch = kWords.some(k => k.trim().startsWith(term));
                        return nameMatch || keywordMatch;
                    });
                });
                render(filtered);
            });
        });

   // Helper to handle selection
    window._selectBinderItem = async (path, name) => {
        const div = document.createElement('div');
        div.className = 'custom-dialog-overlay open';
        div.style.zIndex = '12000';
        div.innerHTML = `
            <div class="custom-dialog-box" style="max-width: 320px; text-align: center; position: relative;">
                <button type="button" class="binder-close-x" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#c0392b; font-size:20px; line-height:1; font-weight:bold; cursor:pointer;">&times;</button>
                <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Use Meme</h3>
               <div class="dialog-actions" style="display:flex; flex-direction:column; gap:8px;">
                    <button class="btn-public" id="btnBinderBg" style="background:#ffcdd2; color:#b71c1c; border:none; box-shadow:none;">Add as Background</button>
                    <button class="btn-public" id="btnBinderPic" style="background:#bbdefb; color:#0d47a1; border:none; box-shadow:none;">Add as Picture</button>
                    <button class="btn-public" id="btnBinderDown" style="background:#c8e6c9; color:#1b5e20; border:none; box-shadow:none;">Download to Computer</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        const close = () => div.remove();
        div.querySelector('.binder-close-x').onclick = close;

        const process = async (mode) => {
            try {
                if (mode === 'download') {
                    const response = await fetch(path);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = (name || 'meme') + '.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    close();
                    return;
                }
                close();
                const res = await fetch(path);
                const blob = await res.blob();
                const file = new File([blob], "binder_item.png", { type: "image/png" });
                
                if (onSelectCallback) {
                    onSelectCallback(file, mode);
                    const ov = document.getElementById('memeBinderOverlay');
                    if (ov) ov.remove();
                }
            } catch(e) { console.error(e); close(); }
        };

        div.querySelector('#btnBinderBg').onclick = () => process('background');
        div.querySelector('#btnBinderPic').onclick = () => process('picture');
        div.querySelector('#btnBinderDown').onclick = () => process('download');
    };
};

window.downloadProgressLocal = async (name) => {
    try {
        showToast("Generating file...");
        const snapshot = await __buildProgressSnapshot();
        const jsonString = JSON.stringify(snapshot);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = (name || "My_Meme_Project") + ".mcproj";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Project downloaded!");
    } catch (err) {
        console.error(err);
        showToast("Failed to export project.");
    }
};

window.uploadProgressLocal = (file, skipReload = false) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                if (!skipReload) showToast("Importing project...");
                const raw = JSON.parse(e.target.result);
            const jsonString = JSON.stringify(raw);
            let name = raw.name || file.name.replace('.mcproj', '').replace('.json', '');
            if (name.length > 60) name = name.substring(0, 60);
            
            let keywords = raw.keywords !== undefined ? raw.keywords : "imported";

            let thumbBlob = null;
            if (raw.previewThumb) {
                try {
                    const dataURI = raw.previewThumb;
                    const byteString = atob(dataURI.split(',')[1]);
                    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    thumbBlob = new Blob([ab], { type: mimeString });
                } catch (err) {
                    console.error("Failed to parse previewThumb", err);
                }
            }
            
            if (!thumbBlob && raw.images && raw.images.length > 0 && raw.images[0].src) {
                const img = new Image();
                await new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = raw.images[0].src;
                });
                if (img.naturalWidth && img.naturalHeight) {
                    const scale = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
                    const c = document.createElement("canvas");
                    c.width = Math.max(1, Math.round(img.naturalWidth * scale));
                    c.height = Math.max(1, Math.round(img.naturalHeight * scale));
                    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
                    thumbBlob = await new Promise(r => c.toBlob(r, "image/png", 0.92));
                }
            }
            
            if (!thumbBlob && raw.images && raw.images.length > 0 && raw.images[0].src) {
                const img = new Image();
                await new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = raw.images[0].src;
                });
                if (img.width && img.height) {
                    const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
                    const c = document.createElement("canvas");
                    c.width = Math.max(1, Math.round(img.width * scale));
                    c.height = Math.max(1, Math.round(img.height * scale));
                    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
                    thumbBlob = await new Promise(r => c.toBlob(r, "image/png", 0.92));
                }
            }

            if (!thumbBlob) {
                const c = document.createElement("canvas");
                c.width = 200; c.height = 150;
                const ctx = c.getContext("2d");
                ctx.fillStyle = raw.canvasColor || "#e3f2fd";
                ctx.fillRect(0, 0, 200, 150);
                ctx.fillStyle = "#1565c0";
                ctx.font = "20px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Imported", 100, 80);
                thumbBlob = await new Promise(r => c.toBlob(r, "image/png"));
            }

            const fd = new FormData();
            fd.append("name", name);
            fd.append("keywords", keywords);
            fd.append("categories", JSON.stringify([0]));
            fd.append("state", jsonString);
            fd.append("thumb", thumbBlob, "thumb.png");
            fd.append("overwrite", "false");

            const res = await fetch("/api/memes/progress", { 
                method: "POST", 
                body: fd,
                credentials: "same-origin"
            });

            if (res.ok) {
                if (!skipReload) {
                    showToast("Project imported!");
                    const ov = document.getElementById("memeProgressOverlay");
                    if (ov) ov.remove();
                    if (window.openProgressOverlay) window.openProgressOverlay();
                }
                resolve(true);
            } else {
                if (!skipReload) showToast("Failed to import.");
                resolve(false);
            }
        } catch (err) {
            console.error(err);
            if (!skipReload) showToast("Invalid project file.");
            resolve(false);
        }
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
    });
};

window.openProgressUploadDialog = function() {
    if (window._isGuestMode) return showGuestDialog();
    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "14000";

    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 420px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Import Project Files</h3>
            <p>Drag and drop one or more project files (.mcproj, .json) here, or use Browse.</p>

            <div class="gallery-upload-dropzone" id="progressUploadDropzone">
                <div style="font-weight:800; margin-bottom:6px;">Drop files here</div>
                <div style="font-size:12px; opacity:0.8;">.mcproj, .json</div>
            </div>

            <input id="progressUploadInput" type="file" accept=".mcproj,.json" multiple style="display:none;">

            <div id="progressUploadStatus" style="margin-top:10px; font-size:12px; color:#333;"></div>

           <div class="dialog-actions" style="display:flex; justify-content:space-between; width:100%; margin-top:12px;">
                <button class="btn-cancel" id="progressUploadCancelBtn" type="button">Cancel</button>
                <button class="btn-cancel" id="progressBrowseBtn" type="button">Browse</button>
            </div>
        </div>
    `;

    document.body.appendChild(div);

    const dropzone = div.querySelector("#progressUploadDropzone");
    const input = div.querySelector("#progressUploadInput");
    const status = div.querySelector("#progressUploadStatus");
    const browseBtn = div.querySelector("#progressBrowseBtn");
    const cancelBtn = div.querySelector("#progressUploadCancelBtn");

    const close = () => div.remove();

    const uploadFiles = async (fileList) => {
        const files = Array.from(fileList || []).filter(f => f.name.endsWith('.mcproj') || f.name.endsWith('.json'));
        if (!files.length) {
            status.textContent = "No valid project files selected.";
            return;
        }

        status.textContent = `Importing ${files.length} project(s)...`;
        
        let okCount = 0;
        for (const f of files) {
            const success = await window.uploadProgressLocal(f, true);
            if (success) okCount++;
        }

        status.textContent = `Imported ${okCount}/${files.length} project(s).`;

        if (typeof showToast === "function") {
            showToast("Project import complete");
        }

        close();
        
        const ov = document.getElementById("memeProgressOverlay");
        if (ov) ov.remove();
        if (window.openProgressOverlay) window.openProgressOverlay();
    };

    browseBtn.onclick = () => input.click();
    cancelBtn.onclick = close;

    dropzone.addEventListener("click", () => input.click());

    input.addEventListener("change", () => {
        uploadFiles(input.files);
        input.value = "";
    });

    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("is-dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("is-dragover");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("is-dragover");
        if (e.dataTransfer && e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
    });

    div.addEventListener("click", (e) => {
        if (e.target === div) close();
    });
};

async function __hydrateProgressState(raw) {
    const st = raw || {};

    const out = {
        generated: true,
        sourceFiles: [],
        images: [],
        layout: st.layout || "vertical",
        whiteSpacePos: st.whiteSpacePos || "none",
        whiteSpaceTopScope: st.whiteSpaceTopScope || "all",
        whiteSpaceSize: (st.whiteSpaceSize == null ? 0.15 : st.whiteSpaceSize),
        whiteSpaceLines: (st.whiteSpaceLines !== false),
        zoomMode: !!st.zoomMode,
        snapEnabled: !!st.snapEnabled,

        texts: st.texts || [],
        selectedTextId: null,
        draggingTextId: null,

        baseFontSize: st.baseFontSize || 48,
        baseFontFamily: st.baseFontFamily || "Anton",
        baseFontWeight: st.baseFontWeight || "900",
        baseFontStyle: st.baseFontStyle || "normal",

        canvasColor: st.canvasColor || "#ffffff",
        canvasEffect: st.canvasEffect || "none",

        baseColor: st.baseColor || "#ffffff",
        baseShadowColor: st.baseShadowColor || "#000000",
        baseShadowDepth: st.baseShadowDepth || 2,
        baseShadowEnabled: (st.baseShadowEnabled !== false),
        baseTextShadowColor: st.baseTextShadowColor || "#000000",
        baseTextShadowDepth: st.baseTextShadowDepth || 3,
        baseTextShadowEnabled: !!st.baseTextShadowEnabled,

        advancedMode: !!st.advancedMode,
        selectedImageIdx: null,

        shapes: st.shapes || [],
        selectedShapeId: null,

        cropMode: false,
        cropTargetIdx: null,
        cropDraft: null,
        cropBackup: null,

        cutMode: false,
        cutPath: [],

        fixedSize: st.fixedSize || null,

        stageCropMode: !!st.stageCropRect,
        stageCropRect: st.stageCropRect || null,

        nextZIndex: st.nextZIndex || 1,
        history: [],
        historyStep: -1,
        lastFingerprint: "",
        _fromProgressLoad: true
    };

    const imgs = st.images || [];
    for (const i of imgs) {
        const img = new Image();
        img.decoding = "async";
        img.src = __safeImageSrc(String(i.src || ""));


        await new Promise(resolve => {
            const done = () => resolve();
            if (img.complete) return done();
            img.onload = done;
            img.onerror = done;
        });

                out.images.push({
            img,
            file: null,

            x: i.x, y: i.y, w: i.w, h: i.h,
            rotation: i.rotation || 0,
            flip: !!i.flip,
            opacity: (i.opacity === undefined ? 1 : i.opacity),
            zIndex: i.zIndex || 0,
            crop: i.crop || null,
            locked: !!i.locked,
            isPaintLayer: !!i.isPaintLayer
        });

    }

    return out;
}

window._loadProgressItem = async function(id) {
try {
showToast("Loading...");
const r = await fetch(`/api/memes/progress/${id}`);
const d = await r.json().catch(() => ({}));
if (!d || !d.success || !d.state) {
showToast("Load failed.");
return;
}

const raw = JSON.parse(d.state);
const hydrated = await __hydrateProgressState(raw);

// Prefer loading into the current open editor so it stays editable
if (typeof window.__mcLoadHydratedState === "function") {
const ok = window.__mcLoadHydratedState(hydrated);
if (ok) {
const ov1 = document.getElementById("memeProgressOverlay");
if (ov1) ov1.remove();
showToast("Loaded.");
return;
}
}

// Fallback: reopen using wrapper state
wrapper._uploadMode = "creator";
wrapper._memeCreatorState = hydrated;
openMemeCreatorDialog(wrapper, form, input, null, [], true);

const ov2 = document.getElementById("memeProgressOverlay");
if (ov2) ov2.remove();
showToast("Loaded.");
} catch (e) {
console.error(e);
showToast("Load error.");
}
};



window._deleteProgressItem = async function(id) {
    if (!confirm("Delete this progress item?")) return;
    const r = await fetch("/api/memes/progress/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    const d = await r.json().catch(() => ({}));
    if (d && d.success) window.openProgressOverlay();
};

window._exportProgressItem = async function(id, name) {
    try {
        showToast("Exporting...");
        const r = await fetch(`/api/memes/progress/${id}`);
        const d = await r.json().catch(() => ({}));
        if (!d || !d.success || !d.state) {
            showToast("Export failed.");
            return;
        }

        let stateStr = d.state;
        try {
            const stateObj = JSON.parse(d.state);
            if (d.name) stateObj.name = d.name;
            if (d.keywords !== undefined) stateObj.keywords = d.keywords;
            stateStr = JSON.stringify(stateObj);
        } catch(e) {}

        const blob = new Blob([stateStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = (name || "Project") + ".mcproj";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Exported to PC!");
    } catch (e) {
        console.error(e);
        showToast("Export error.");
    }
};


window.openProgressPreview = function(url) {
    const d = document.createElement('div');
    d.style.cssText = "position:fixed; top:0; left:0; right:0; bottom:0; z-index:20000; background:rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; cursor:zoom-out;";

    const img = document.createElement('img');
    img.style.cssText = "width:95%; height:95%; object-fit:contain; box-shadow:0 0 20px rgba(0,0,0,0.5);";
    img.src = __safeImageSrc(String(url || ""));


    d.onclick = () => d.remove();
    d.appendChild(img);
    document.body.appendChild(d);
};

window.openProgressOverlay = function() {
    let overlay = document.getElementById("memeProgressOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "memeProgressOverlay";
        overlay.className = "gallery-panel open";
        overlay.style.zIndex = "11000";
        document.body.appendChild(overlay);
    }

   overlay.innerHTML = `
        <div class="gallery-backdrop" data-action="closeProgress"></div>
        <div class="gallery-content" style="display:flex; flex-direction:column;">
            <div class="gallery-header">
                <div style="display:flex; align-items:center; gap:8px;">
                    Progress Binder
                    <span style="cursor:pointer; font-size:16px; margin-left:4px;" title="Download Collection" data-action="downloadProgressCollection">💾</span>
                    <span style="cursor:pointer; font-size:16px;" title="Import Project File" data-action="importProgress">⬆️</span>
                    <span style="cursor:pointer; font-size:16px;" title="Edit Mode" data-action="progressToggleEdit">✏️</span>
                    <select id="progressSortSelect" style="font-size:11px; border:1px solid #ccc; border-radius:4px; margin-left:8px; padding:2px; height:24px;">
                        <option value="alpha">Alphabetical</option>
                        <option value="dateDesc" selected>Date Descending</option>
                        <option value="dateAsc">Date Ascending</option>
                    </select>
                    <button type="button" class="btn-public" style="padding: 2px 8px; font-size: 11px; margin-left: 8px; background-color: #d1c4e9; color: #4a148c;" data-action="goMemes">Memes</button>
                    <button type="button" class="btn-public" style="padding: 2px 8px; font-size: 11px; margin-left: 4px; background-color: #009688;" data-action="goTemplates">Templates</button>
                    <button type="button" class="btn-public" style="padding: 2px 8px; font-size: 11px; margin-left: 4px; background-color: #ffcc80; color: #4e342e; box-shadow: inset 0 3px 6px rgba(0,0,0,0.3); transform: translateY(2px); cursor: default;" data-action="goProgress">In-Progress</button>
                </div>
                <button class="gallery-close" data-action="closeProgress">×</button>
            </div>
            <div class="gallery-body">
                <div class="gallery-sidebar">
                    <button type="button" id="btnSortProgressFolders" style="width:100%; margin-bottom:8px; font-size:11px; padding:6px; background:#e0e0e0; color:#333; border:1px solid #ccc; border-radius:4px; cursor:pointer; font-weight:bold;">Sort: Alphabetical</button>
                    <div id="progressFolderList" style="flex:1; overflow-y:auto;"></div>
                    <button type="button" class="btn-public" id="btnCreateProgressFolder" style="width:100%; margin-top:8px; font-size:11px; padding:6px;">+ New Folder</button>
                </div>
                <div class="gallery-main">
                    <div style="padding:10px; border-bottom:1px solid #eee;">
                        <div id="progressEditActions" style="display:none; align-items:center; gap:8px; margin-bottom:10px;">
                            <button type="button" class="btn-public" data-action="progressToggleEdit" style="padding:6px 10px; font-size:12px; background-color:#c0392b; box-shadow: 0 3px 0 #922b21;" title="Cancel Edit">✕</button>
                            <button type="button" class="btn-public" id="progressMoveBtn" style="padding:6px 10px; font-size:12px;">Move To</button>
                            <button type="button" class="btn-public" id="progressBulkDeleteBtn" style="padding:6px 10px; font-size:12px; background-color:#c0392b; box-shadow: 0 3px 0 #922b21;">Delete</button>
                            <div id="progressSelCount" style="font-size:12px; color:#444; font-weight:800; margin-left:4px;"></div>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input id="progressSearchInput" type="text" placeholder=" Search... separate keywords with commas" autocomplete="off" style="margin-bottom:0; width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;">
                        <input id="progressZoom" type="range" min="100" max="600" value="250" style="width:80px; cursor:pointer; accent-color: #2196f3;" title="Zoom">
                    </div>
                </div>
                <div class="gallery-grid" id="memeProgressGrid" style="flex:1; padding:10px;">
                        <div style="color:#666; padding:20px; text-align:center;">Loading...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

        if (!overlay._progressClickBound) {
        overlay._progressClickBound = true;
        overlay.addEventListener("click", (e) => {
            const el = e.target && e.target.closest ? e.target.closest("[data-action]") : null;
            const action = el ? el.dataset.action : "";

            if (!action) return;

            if (action === "closeProgress") {
                overlay.remove();
                return;
            }

            if (action === "goMemes") {
                overlay.remove();
                window.openMemeBinderOverlay(window._lastBinderCallback);
                return;
            }

            if (action === "goTemplates") {
                overlay.remove();
                window.openTemplateOverlay(window._lastBinderCallback);
                return;
            }

            if (action === "renameProgress") {
                const id = parseInt(el.dataset.id, 10);
                const name = decodeURIComponent(el.dataset.name || "");
                const keys = decodeURIComponent(el.dataset.keys || "");
                window.editProgressMeta(id, name, keys);
                return;
            }

            if (action === "previewProgress") {
                window.openProgressPreview(el.dataset.thumb || "");
                return;
            }

            if (action === "loadProgress") {
                const id = parseInt(el.dataset.id, 10);
                window._loadProgressItem(id);
                return;
            }

            if (action === "deleteProgress") {
                const id = parseInt(el.dataset.id, 10);
                window._deleteProgressItem(id);
                return;
            }

            if (action === "downloadProgressCollection") {
                if (window.confirmDownloadCollection) window.confirmDownloadCollection("progress");
                return;
            }

            if (action === "exportProgress") {
                const id = parseInt(el.dataset.id, 10);
                const name = decodeURIComponent(el.dataset.name || "My_Project");
                window._exportProgressItem(id, name);
                return;
            }

            if (action === "importProgress") {
                if (window.openProgressUploadDialog) window.openProgressUploadDialog();
                return;
            }

            if (action === "progressToggleEdit") {
                if (window._toggleProgressEditMode) window._toggleProgressEditMode();
                return;
            }

            if (action === "progressSetCat") {
                const cat = el.getAttribute('data-cat');
                if (cat === 'all' || cat === 'unsorted') window._setProgressCat(cat);
                else window._setProgressCat(parseInt(cat, 10));
                return;
            }

            if (action === "progressDeleteFolder") {
                const id = parseInt(el.getAttribute('data-folder-id') || '0', 10);
                if (id && window._deleteProgressFolder) window._deleteProgressFolder(id);
                return;
            }
        });
    }

    Promise.all([
        fetch("/api/memes/progress").then(r => r.json()),
        fetch("/api/categories/progress").then(r => r.json())
    ])

        .then(([progData, catData]) => {
        const items = progData.items || [];
        const categories = catData.categories || [];
        progressCategories = categories;

        let currentCatId = window._preservedProgressCat !== undefined ? window._preservedProgressCat : "all";

        const grid = document.getElementById("memeProgressGrid");
        const folderList = document.getElementById("progressFolderList");
        const input = document.getElementById("progressSearchInput");
        const zoom = document.getElementById("progressZoom");
        const btnNewFolder = document.getElementById("btnCreateProgressFolder");
        const sortSelect = document.getElementById("progressSortSelect");

        let progFolderSort = 'alpha';
        const btnSortProgFolders = document.getElementById('btnSortProgressFolders');
        if (btnSortProgFolders) {
            btnSortProgFolders.onclick = () => {
                if (progFolderSort === 'alpha') { progFolderSort = 'dateDesc'; btnSortProgFolders.textContent = 'Sort: Date Created Desc'; }
                else if (progFolderSort === 'dateDesc') { progFolderSort = 'dateAsc'; btnSortProgFolders.textContent = 'Sort: Date Created Asc'; }
                else { progFolderSort = 'alpha'; btnSortProgFolders.textContent = 'Sort: Alphabetical'; }
                renderFolders();
            };
        }

        progressEditActions = document.getElementById("progressEditActions");
        progressMoveBtn = document.getElementById("progressMoveBtn");
        progressBulkDeleteBtn = document.getElementById("progressBulkDeleteBtn");
        progressSelCount = document.getElementById("progressSelCount");

        if (progressMoveBtn) progressMoveBtn.onclick = openProgressMoveDialog;
        if (progressBulkDeleteBtn) progressBulkDeleteBtn.onclick = openProgressBulkDeleteDialog;

        if (sortSelect) {
            sortSelect.onchange = () => {
                if (input) input.dispatchEvent(new Event("input"));
            };
        }

        if (folderList && !folderList._dndDelegated) {
            folderList._dndDelegated = true;
            folderList.addEventListener('dragover', (e) => {
                const item = e.target.closest('.folder-item[data-drop-cat]');
                if (!item || !folderList.contains(item)) return;
                e.preventDefault();
                item.classList.add('drag-over');
            });
            folderList.addEventListener('dragleave', (e) => {
                const item = e.target.closest('.folder-item[data-drop-cat]');
                if (!item || !folderList.contains(item)) return;
                item.classList.remove('drag-over');
            });
            folderList.addEventListener('drop', (e) => {
                const item = e.target.closest('.folder-item[data-drop-cat]');
                if (!item || !folderList.contains(item)) return;
                e.preventDefault();
                item.classList.remove('drag-over');
                const cat = parseInt(item.getAttribute('data-drop-cat') || '0', 10);
                if (window._progressDrop) window._progressDrop(e, cat);
            });
        }

        const renderFolders = () => {
            let html = `
                <div class="folder-item ${currentCatId === "all" ? "active" : ""}" data-action="progressSetCat" data-cat="all">📂 All Items</div>
                <div class="folder-item ${currentCatId === "unsorted" ? "active" : ""}" data-action="progressSetCat" data-cat="unsorted" data-drop-cat="0">📁 Unsorted</div>
                <hr style="border:0; border-top:1px solid #ddd; margin:4px 0;">
            `;

            let sortedCats = [...categories];
            if (progFolderSort === 'alpha') {
                sortedCats.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            } else if (progFolderSort === 'dateDesc') {
                sortedCats.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            } else {
                sortedCats.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
            }

            sortedCats.forEach(c => {
                html += `
                    <div class="folder-item ${currentCatId == c.id ? "active" : ""}" data-action="progressSetCat" data-cat="${c.id}" data-drop-cat="${c.id}">
                        <span>📁 ${__escapeHtml(c.name)}</span>
                        <span class="folder-del" data-action="progressDeleteFolder" data-folder-id="${c.id}">×</span>
                    </div>
                `;
            });
            if (folderList) folderList.innerHTML = html;
        };

        window._setProgressCat = (id) => {
            currentCatId = id;
            window._preservedProgressCat = id;
            renderFolders();
            if (input) {
                input.value = "";
                input.dispatchEvent(new Event("input"));
            }
        };

        window._deleteProgressFolder = async (id) => {
            if (!confirm("Delete this folder? Items inside will move to Unsorted.")) return;
            await fetch("/api/categories/delete", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, type: "progress" })
            });
            const ov = document.getElementById("memeProgressOverlay");
            if (ov) ov.remove();
            window.openProgressOverlay();
        };

        if (btnNewFolder) {
            btnNewFolder.onclick = (e) => {
                e.preventDefault();
                const d = document.createElement("div");
                d.className = "custom-dialog-overlay open";
                d.style.zIndex = "13000";
                d.innerHTML = `
                    <div class="custom-dialog-box" style="max-width: 300px;">
                        <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">New Folder</h3>
                        <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Folder Name:</label>
                        <input type="text" id="newProgFolderInput" class="settings-input" style="width:100%; margin-bottom:15px;" placeholder="My Stuff" autocomplete="off">
                        <div class="dialog-actions">
                            <button type="button" class="btn-cancel" id="cancelProgFolder">Cancel</button>
                            <button type="button" class="btn-cancel" id="confirmProgFolder">Create</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(d);
                const inp = d.querySelector("#newProgFolderInput");
                setTimeout(() => inp.focus(), 50);

                const submit = async () => {
                    const name = inp.value.trim();
                    if (name) {
                        await fetch("/api/categories", {
                            method: "POST", headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name, type: "progress" })
                        });
                        d.remove();
                        const ov = document.getElementById("memeProgressOverlay");
                        if (ov) ov.remove();
                        window.openProgressOverlay();
                    }
                };

                d.querySelector("#cancelProgFolder").onclick = () => d.remove();
                d.querySelector("#confirmProgFolder").onclick = submit;
                inp.addEventListener("keydown", (ev) => {
                    if (ev.key === "Enter") { ev.preventDefault(); submit(); }
                });
            };
        }

        let currentSize = 250;

        const applyZoom = (val) => {
            const n = Math.max(100, Math.min(600, parseInt(val, 10) || 250));
            currentSize = n;
            if (zoom) zoom.value = String(n);
            if (grid) {
                grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${n}px, 1fr))`;
                Array.from(grid.children).forEach(c => c.style.height = n + "px");
            }
        };

        applyZoom(localStorage.getItem("mc_progressZoom") || 250);

        if (zoom) {
            zoom.oninput = (e) => {
                applyZoom(e.target.value);
                localStorage.setItem("mc_progressZoom", String(currentSize));
            };
        }

        renderFolders();

        const render = (renderItems) => {
            let filtered = renderItems;
            if (currentCatId === "unsorted") {
                filtered = renderItems.filter(t => !t.category_id || t.category_id == 0);
            } else if (currentCatId !== "all") {
                filtered = renderItems.filter(t => t.category_id == currentCatId);
            }

            const sortMode = document.getElementById("progressSortSelect") ? document.getElementById("progressSortSelect").value : "dateDesc";
            filtered.sort((a, b) => {
                if (sortMode === "alpha") return (a.name || "").localeCompare(b.name || "");
                if (sortMode === "dateAsc") return new Date(a.updated_at || 0) - new Date(b.updated_at || 0);
                return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
            });

            if (filtered.length === 0) {
                grid.replaceChildren();
                const msg = document.createElement("div");
                msg.style.cssText = "color:#666; padding:20px; text-align:center;";
                msg.textContent = "No progress saved yet.";
                grid.appendChild(msg);
                return;
            }

            if (grid.dataset.progBound !== "1") {
                grid.dataset.progBound = "1";
                grid.addEventListener("click", (e) => {
                    const card = e.target.closest(".gallery-grid-item");
                    if (!card || !grid.contains(card)) return;

                    const id = Number(card.dataset.id);
                    const index = Number(card.dataset.index);

                    if (e.target.classList.contains("mc-edit-checkbox")) {
                        if (window._progressCheckboxClick) window._progressCheckboxClick(e, id, index);
                        return;
                    }
                });

                grid.addEventListener("dragstart", (e) => {
                    const card = e.target.closest(".gallery-grid-item");
                    if (!card || !grid.contains(card)) return;
                    const id = Number(card.dataset.id);
                    const catId = card.dataset.catId || "all";
                    const curName = card.dataset.curName || "All Items";
                    if (window._progressDragStart) window._progressDragStart(e, id, catId, curName);
                });
            }

            grid.textContent = "";

            filtered.forEach((it, index) => {
                let curName = "All Items";
                if (currentCatId === "unsorted") curName = "Unsorted";
                else if (currentCatId !== "all") {
                    const c = categories.find(cat => cat.id == currentCatId);
                    if (c) curName = c.name;
                }

                const thumb = (it.thumb_path || "") + (it.updated_at ? `?t=${encodeURIComponent(it.updated_at)}` : "");
                const safeThumbSrc = __safeImageSrc(thumb);
                const nameRaw = String(it.name || "Untitled");
                const encName = encodeURIComponent(nameRaw);
                const itemKeys = String(it.keywords || "");
                const encKeys = encodeURIComponent(itemKeys);

                const card = document.createElement("div");
                card.className = "gallery-grid-item";
                card.id = "progress-item-" + it.id;
                card.style.position = "relative";
                card.style.height = currentSize + "px";
                card.title = nameRaw;
                card.draggable = true;

                card.dataset.id = String(it.id);
                card.dataset.index = String(index);
                card.dataset.catId = String(currentCatId);
                card.dataset.curName = String(curName);

                const title = document.createElement("div");
                title.className = "overlay-title";
                title.title = "Edit name & keywords";
                title.dataset.action = "renameProgress";
                title.dataset.id = String(it.id);
                title.dataset.name = encName;
                title.dataset.keys = encKeys;
                title.textContent = nameRaw;

                const checkbox = document.createElement("div");
                checkbox.className = "mc-edit-checkbox";

                const img = document.createElement("img");
                img.src = safeThumbSrc;
                img.alt = nameRaw;
                img.dataset.action = "previewProgress";
                img.dataset.thumb = safeThumbSrc;
                img.style.cursor = "zoom-in";

                const load = document.createElement("div");
                load.className = "meme-template-add";
                load.title = "Load";
                load.dataset.action = "loadProgress";
                load.dataset.id = String(it.id);
                load.textContent = "⤵";

                const exp = document.createElement("div");
                exp.className = "meme-template-add";
                exp.style.left = "4px";
                exp.style.right = "auto";
                exp.style.backgroundColor = "#8e44ad";
                exp.title = "Download to PC";
                exp.dataset.action = "exportProgress";
                exp.dataset.id = String(it.id);
                exp.dataset.name = encName;
                exp.textContent = "⬇️";

                const del = document.createElement("div");
                del.className = "meme-binder-trash";
                del.style.top = "40px";
                del.style.left = "4px";
                del.title = "Delete";
                del.dataset.action = "deleteProgress";
                del.dataset.id = String(it.id);
                del.textContent = "🗑️";

                const keysDiv = document.createElement("div");
                keysDiv.className = "overlay-keywords";
                keysDiv.title = "Edit name & keywords";
                keysDiv.dataset.action = "renameProgress";
                keysDiv.dataset.id = String(it.id);
                keysDiv.dataset.name = encName;
                keysDiv.dataset.keys = encKeys;
                
                let displayKeys = "No keywords";
                if (itemKeys) {
                    displayKeys = itemKeys.split(',').map(k => k.trim().toLowerCase()).filter(k => k).map(k => '#' + k).join(' ');
                }
                keysDiv.textContent = displayKeys;

                card.append(title, checkbox, img, exp, load, del, keysDiv);
                grid.appendChild(card);
            });
        };

        render(items);

        if (input) {
            input.addEventListener("input", () => {
                const terms = String(input.value || "").toLowerCase().split(",").map(t => t.trim()).filter(Boolean);
                if (terms.length === 0) return render(items);
                const filtered = items.filter(t => {
                    const nameVal = String(t.name || "").toLowerCase();
                    const kWords = String(t.keywords || "").toLowerCase().split(",");
                    return terms.every(term => {
                        const nameMatch = nameVal.startsWith(term);
                        const keywordMatch = kWords.some(k => k.trim().startsWith(term));
                        return nameMatch || keywordMatch;
                    });
                });
                render(filtered);
            });
        }
    })
    .catch(() => {
        const grid = document.getElementById("memeProgressGrid");
        if (grid) {
            grid.replaceChildren();
            const msg = document.createElement("div");
            msg.style.cssText = "color:#666; padding:20px; text-align:center;";
            msg.textContent = "Failed to load.";
            grid.appendChild(msg);
        }
    });
};


window.editProgressMeta = function(id, currentName, currentKeywords) {
    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '12000';
     const box = document.createElement('div');
    box.className = 'custom-dialog-box';
    box.style.maxWidth = '320px';

    const h3 = document.createElement('h3');
    h3.textContent = 'Edit Details';
    h3.style.background = 'transparent';
    h3.style.color = '#1c1e21';
    h3.style.border = 'none';
    h3.style.padding = '0';
    h3.style.marginBottom = '10px';

    const label = document.createElement('label');
    label.textContent = 'Name:';
    label.style.fontWeight = '600';
    label.style.fontSize = '12px';
    label.style.display = 'block';
    label.style.marginBottom = '4px';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'editProgName';
    input.className = 'settings-input';
    input.style.width = '100%';
    input.style.marginBottom = '12px';
    input.value = String(currentName || '');

    const labelKeys = document.createElement('label');
    labelKeys.textContent = 'Keywords:';
    labelKeys.style.fontWeight = '600';
    labelKeys.style.fontSize = '12px';
    labelKeys.style.display = 'block';
    labelKeys.style.marginBottom = '4px';

    const inputKeys = document.createElement('textarea');
    inputKeys.id = 'editProgKeys';
    inputKeys.className = 'custom-dialog-textarea';
    inputKeys.style.minHeight = '60px';
    inputKeys.style.marginBottom = '15px';
    inputKeys.value = String(currentKeywords || '');

    const actions = document.createElement('div');
    actions.className = 'dialog-actions';
    actions.style.display = 'flex';
    actions.style.justifyContent = 'space-between';
    actions.style.gap = '10px';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn-cancel';
    cancelBtn.id = 'cancelEditProg';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => div.remove());

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn-cancel';
    saveBtn.id = 'saveEditProg';
    saveBtn.style.fontWeight = 'bold';
    saveBtn.textContent = 'Save';

    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);

    box.appendChild(h3);
    box.appendChild(label);
    box.appendChild(input);
    box.appendChild(labelKeys);
    box.appendChild(inputKeys);
    box.appendChild(actions);

    div.replaceChildren(box);
    document.body.appendChild(div);

        div.querySelector('#cancelEditProg').onclick = () => div.remove();

    div.querySelector('#saveEditProg').onclick = async () => {
    const btn = div.querySelector('#saveEditProg');
    const name = div.querySelector('#editProgName').value.trim();
    const keywords = div.querySelector('#editProgKeys').value.trim();
    if (!name) return;

    if (window.location.protocol === "file:") {
        alert("Renaming works only when running the local Node.js server.");
        return;
    }

    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Saving...";

    try {
        const r = await fetch(`/api/memes/progress/${id}/edit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ name, keywords })
        });

        const d = await r.json().catch(() => null);

        if (!r.ok || !d || !d.success) {
            throw new Error((d && d.error) ? d.error : `Rename failed (${r.status})`);
        }

        div.remove();
        if (window.openProgressOverlay) window.openProgressOverlay();
    } catch (e) {
        console.error(e);
        alert(e.message || "Rename failed.");
    } finally {
        btn.disabled = false;
        btn.textContent = oldText;
    }
};

};

window.openTemplateOverlay = function(onSelectCallback) {

    if (onSelectCallback) window._lastBinderCallback = onSelectCallback;
    else if (window._lastBinderCallback) onSelectCallback = window._lastBinderCallback;

    let overlay = document.getElementById('memeTemplateOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'memeTemplateOverlay';
        overlay.className = 'gallery-panel open';
        overlay.style.zIndex = '11000'; 
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
    <div class="gallery-backdrop" data-action="tplClose"></div>
    <div class="gallery-content" style="display:flex; flex-direction:column;">
        <div class="gallery-header">
            <div style="display:flex; align-items:center; gap:8px;">
                Template Binder
               <span style="cursor:pointer; font-size:16px;" title="Download Collection" data-action="tplDownload">💾</span>
                <span style="cursor:pointer; font-size:16px;" title="Upload Images" data-action="tplUpload">⬆️</span>
              <span style="cursor:pointer; font-size:16px;" title="Edit Mode" data-action="tplToggleEdit">✏️</span>
                <select id="templateSortSelect" style="font-size:11px; border:1px solid #ccc; border-radius:4px; margin-left:8px; padding:2px; height:24px;">
                            <option value="alpha">Alphabetical</option>
                            <option value="dateDesc" selected>Date Descending</option>
                            <option value="dateAsc">Date Ascending</option>
                        </select>
                        <button type="button" class="btn-public" style="padding: 2px 8px; font-size: 11px; margin-left: 8px; background-color: #d1c4e9; color: #4a148c;" data-action="tplOpenMemes">Memes</button>
                        <button type="button" class="btn-public" style="padding: 2px 8px; font-size: 11px; margin-left: 4px; background-color: #009688; box-shadow: inset 0 3px 6px rgba(0,0,0,0.3); transform: translateY(2px); cursor: default;" data-action="tplOpenTemplates">Templates</button>
                        <button type="button" class="btn-public" style="padding: 2px 8px; font-size: 11px; margin-left: 4px; background-color: #ffcc80; color: #4e342e;" data-action="tplOpenProgress">In-Progress</button>
                    </div>
            <button class="gallery-close" data-action="tplClose">×</button>
        </div>

        <div class="gallery-body">
            <div class="gallery-sidebar">
                <button type="button" id="btnSortTemplateFolders" style="width:100%; margin-bottom:8px; font-size:11px; padding:6px; background:#e0e0e0; color:#333; border:1px solid #ccc; border-radius:4px; cursor:pointer; font-weight:bold;">Sort: Alphabetical</button>
                <div id="templateFolderList" style="flex:1; overflow-y:auto;"></div>
                <button type="button" class="btn-public" id="btnCreateTemplateFolder" style="width:100%; margin-top:8px; font-size:11px; padding:6px;">+ New Folder</button>
            </div>

            <div class="gallery-main">
                <div style="padding:10px; border-bottom:1px solid #eee;">
                    <div id="templateEditActions" style="display:none; align-items:center; gap:8px; margin-bottom:10px;">
                        <button type="button" class="btn-public" data-action="tplToggleEdit" style="padding:6px 10px; font-size:12px; background-color:#c0392b; box-shadow: 0 3px 0 #922b21;" title="Cancel Edit">✕</button>
                        <button type="button" class="btn-public" id="templateMoveBtn" style="padding:6px 10px; font-size:12px;">Move To</button>
                        <button type="button" class="btn-public" id="templateBulkDeleteBtn" style="padding:6px 10px; font-size:12px; background-color:#c0392b; box-shadow: 0 3px 0 #922b21;">Delete</button>
                        <div id="templateSelCount" style="font-size:12px; color:#444; font-weight:800; margin-left:4px;"></div>
                    </div>

                    <div style="display:flex; gap:10px; align-items:center;">
                        <input id="templateSearchInput" type="text" placeholder="Search... separate keywords with commas" autocomplete="off" style="margin-bottom:0;">
                        <input id="templateZoom" type="range" min="100" max="600" value="250" style="width:80px; cursor:pointer; accent-color: #2196f3;" title="Zoom">
                    </div>
                </div>

                <div class="gallery-grid" id="memeTemplateGrid" style="flex:1; padding:10px;">
                    <div style="color:#666; padding:20px; text-align:center;">Loading...</div>
                </div>
            </div>
        </div>
    </div>
`;

Promise.all([
    fetch("/api/memes/templates").then(r => r.json()),
    fetch("/api/categories/templates").then(r => r.json())
]).then(([tplData, catData]) => {
    const templates = tplData.templates || [];
    const categories = catData.categories || [];

    templateCategories = categories;

    let currentCatId = window._preservedTemplateCat !== undefined ? window._preservedTemplateCat : "all";

    const grid = document.getElementById("memeTemplateGrid");
    const folderList = document.getElementById("templateFolderList");

    let tplFolderSort = 'alpha';
    const btnSortTplFolders = document.getElementById('btnSortTemplateFolders');
    if (btnSortTplFolders) {
        btnSortTplFolders.onclick = () => {
            if (tplFolderSort === 'alpha') { tplFolderSort = 'dateDesc'; btnSortTplFolders.textContent = 'Sort: Date Created Desc'; }
            else if (tplFolderSort === 'dateDesc') { tplFolderSort = 'dateAsc'; btnSortTplFolders.textContent = 'Sort: Date Created Asc'; }
            else { tplFolderSort = 'alpha'; btnSortTplFolders.textContent = 'Sort: Alphabetical'; }
            renderFolders();
        };
    }

if (folderList && !folderList._dndDelegated) {
    folderList._dndDelegated = true;

    folderList.addEventListener('dragover', (e) => {
        const item = e.target.closest('.folder-item[data-drop-cat]');
        if (!item || !folderList.contains(item)) return;
        e.preventDefault();
        item.classList.add('drag-over');
    });

    folderList.addEventListener('dragleave', (e) => {
        const item = e.target.closest('.folder-item[data-drop-cat]');
        if (!item || !folderList.contains(item)) return;
        item.classList.remove('drag-over');
    });

    folderList.addEventListener('drop', (e) => {
        const item = e.target.closest('.folder-item[data-drop-cat]');
        if (!item || !folderList.contains(item)) return;
        e.preventDefault();
        item.classList.remove('drag-over');

        const cat = parseInt(item.getAttribute('data-drop-cat') || '0', 10);
        if (window._templateDrop) window._templateDrop(e, cat);
    });
}

    const input = document.getElementById("templateSearchInput");
    const zoom = document.getElementById("templateZoom");
    const btnNewFolder = document.getElementById("btnCreateTemplateFolder");
    const sortSelect = document.getElementById("templateSortSelect");

    if (sortSelect) {
        sortSelect.onchange = () => {
            if (input) input.dispatchEvent(new Event("input"));
        };
    }

    templateEditActions = document.getElementById("templateEditActions");
    templateMoveBtn = document.getElementById("templateMoveBtn");
    templateBulkDeleteBtn = document.getElementById("templateBulkDeleteBtn");
    templateSelCount = document.getElementById("templateSelCount");

    if (templateMoveBtn) templateMoveBtn.onclick = openTemplateMoveDialog;
    if (templateBulkDeleteBtn) templateBulkDeleteBtn.onclick = openTemplateBulkDeleteDialog;

    const renderFolders = () => {
        let html = `
    <div class="folder-item ${currentCatId === "all" ? "active" : ""}" data-action="tplSetCat" data-cat="all">📂 All Items</div>
    <div class="folder-item ${currentCatId === "unsorted" ? "active" : ""}" data-action="tplSetCat" data-cat="unsorted" data-drop-cat="0">📁 Unsorted</div>
    <hr style="border:0; border-top:1px solid #ddd; margin:4px 0;">
`;

let sortedCats = [...categories];
if (tplFolderSort === 'alpha') {
    sortedCats.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
} else if (tplFolderSort === 'dateDesc') {
    sortedCats.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
} else {
    sortedCats.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
}

sortedCats.forEach(c => {
    html += `
        <div class="folder-item ${currentCatId == c.id ? "active" : ""}" data-action="tplSetCat" data-cat="${c.id}" data-drop-cat="${c.id}">
            <span>📁 ${__escapeHtml(c.name)}</span>
            <span class="folder-del" data-action="tplDeleteFolder" data-folder-id="${c.id}">×</span>
        </div>
    `;
});


        if (folderList) folderList.innerHTML = html;
    };

    window._setTemplateCat = (id) => {
        currentCatId = id;
        window._preservedTemplateCat = id;
        renderFolders();
        if (input) {
            input.value = "";
            input.dispatchEvent(new Event("input"));
        }
    };

    window._deleteTemplateFolder = async (id) => {
        if (!confirm("Delete this folder? Items inside will move to Unsorted.")) return;
        await fetch("/api/categories/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, type: "templates" })
        });
        const ov = document.getElementById("memeTemplateOverlay");
        if (ov) ov.remove();
        window.openTemplateOverlay(onSelectCallback);
    };

    if (btnNewFolder) {
        btnNewFolder.onclick = (e) => {
            e.preventDefault();

            const d = document.createElement("div");
            d.className = "custom-dialog-overlay open";
            d.style.zIndex = "13000";
            d.innerHTML = `
                <div class="custom-dialog-box" style="max-width: 300px;">
                    <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">New Folder</h3>
                    <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Folder Name:</label>
                    <input type="text" id="newTemplateFolderInput" class="settings-input" style="width:100%; margin-bottom:15px;" placeholder="My Stuff" autocomplete="off">
                    <div class="dialog-actions">
                        <button type="button" class="btn-cancel" id="cancelTemplateFolder">Cancel</button>
                        <button type="button" class="btn-cancel" id="confirmTemplateFolder">Create</button>
                    </div>
                </div>
            `;
            document.body.appendChild(d);

            const inp = d.querySelector("#newTemplateFolderInput");
            setTimeout(() => inp.focus(), 50);

            const submit = async () => {
                const name = inp.value.trim();
                if (!name) return;

                await fetch("/api/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, type: "templates" })
                });

                d.remove();
                const ov = document.getElementById("memeTemplateOverlay");
                if (ov) ov.remove();
                window.openTemplateOverlay(onSelectCallback);
            };

            d.querySelector("#cancelTemplateFolder").onclick = () => d.remove();
            d.querySelector("#confirmTemplateFolder").onclick = submit;

            inp.addEventListener("keydown", (ev) => {
                if (ev.key === "Enter") {
                    ev.preventDefault();
                    submit();
                }
            });
        };
    }

    if (!grid || !input) return;

    let currentSize = 250;

    const applyZoom = (val) => {
        const n = Math.max(100, Math.min(600, parseInt(val, 10) || 250));
        currentSize = n;
        if (zoom) zoom.value = String(n);
        grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${n}px, 1fr))`;
        Array.from(grid.children).forEach(c => c.style.height = n + "px");
    };

    applyZoom(localStorage.getItem("mc_templateZoom") || 250);

    if (window.location.protocol !== "file:") {
        fetch("/api/prefs/zoom")
            .then(r => (r.ok ? r.json() : null))
            .then(d => {
                if (d && d.success && d.templateZoom != null) {
                    applyZoom(d.templateZoom);
                    localStorage.setItem("mc_templateZoom", String(d.templateZoom));
                }
            })
            .catch(() => {});
    }

    if (zoom) {
        zoom.oninput = (e) => {
            applyZoom(e.target.value);
            localStorage.setItem("mc_templateZoom", String(currentSize));

            if (window.location.protocol !== "file:") {
                fetch("/api/prefs/zoom", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templateZoom: currentSize })
                }).catch(() => {});
            }
        };
    }

    renderFolders();

    const render = (items) => {
        let filtered = items;

        if (currentCatId === "unsorted") {
            filtered = items.filter(t => !t.category_id || t.category_id == 0);
        } else if (currentCatId !== "all") {
            filtered = items.filter(t => t.category_id == currentCatId);
        }

        const sortMode = document.getElementById("templateSortSelect") ? document.getElementById("templateSortSelect").value : "dateDesc";
        filtered.sort((a, b) => {
            if (sortMode === "alpha") return (a.name || "").localeCompare(b.name || "");
            if (sortMode === "dateAsc") return new Date(a.created_at || 0) - new Date(b.created_at || 0);
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        });

        if (filtered.length === 0) {
    grid.replaceChildren();
    const msg = document.createElement("div");
    msg.style.cssText = "color:#666; padding:20px; text-align:center;";
    msg.textContent = "No items here.";
    grid.appendChild(msg);
    return;
}

        window._galleryItems = filtered;
        window._galleryType = "template";

if (grid.dataset.tplBound !== "1") {
    grid.dataset.tplBound = "1";

    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".gallery-grid-item");
        if (!card || !grid.contains(card)) return;

        const id = Number(card.dataset.id);
        const index = Number(card.dataset.index);
        const path = card.dataset.path || "";
        const name = card.dataset.name || "";
        const keys = card.dataset.keys || "";

        if (e.target.classList.contains("mc-edit-checkbox")) {
            if (window._templateCheckboxClick) window._templateCheckboxClick(e, id, index);
            return;
        }

        if (e.target.classList.contains("meme-template-add")) {
            if (window._selectTemplate) window._selectTemplate(path, name);
            return;
        }

        if (e.target.classList.contains("meme-binder-trash")) {
            if (window.confirmDeleteTemplate) window.confirmDeleteTemplate(id);
            return;
        }

        if (
            e.target.classList.contains("overlay-title") ||
            e.target.classList.contains("overlay-keywords")
        ) {
            if (window.editTemplateMeta) window.editTemplateMeta(id, name, keys);
            return;
        }

        if (e.target.tagName === "IMG") {
            if (window._templateImgClick) window._templateImgClick(e, id, index);
            return;
        }
    });

    grid.addEventListener("dragstart", (e) => {
        const card = e.target.closest(".gallery-grid-item");
        if (!card || !grid.contains(card)) return;

        const id = Number(card.dataset.id);
        const catId = card.dataset.catId || "all";
        const curName = card.dataset.curName || "All Items";

        if (window._templateDragStart) window._templateDragStart(e, id, catId, curName);
    });
}

grid.textContent = "";

filtered.forEach((t, index) => {
    let curName = "All Items";
    if (currentCatId === "unsorted") curName = "Unsorted";
    else if (currentCatId !== "all") {
        const c = categories.find(cat => cat.id == currentCatId);
        if (c) curName = c.name;
    }

    const card = document.createElement("div");
    card.className = "gallery-grid-item";
    card.id = "template-item-" + t.id;
    card.style.position = "relative";
    card.style.height = currentSize + "px";
    card.draggable = true;

    card.dataset.id = String(t.id);
    card.dataset.index = String(index);
    card.dataset.catId = String(currentCatId);
    card.dataset.curName = String(curName);
    card.dataset.path = String(t.image_path || "");
    card.dataset.name = String(t.name || "");
    card.dataset.keys = String(t.keywords || "");

    const title = document.createElement("div");
    title.className = "overlay-title";
    title.title = "Click to edit name";
    title.textContent = String(t.name || "Untitled");

    const checkbox = document.createElement("div");
    checkbox.className = "mc-edit-checkbox";

    const img = document.createElement("img");
    const safeSrc = (typeof __safeImageSrc === "function")
        ? __safeImageSrc(String(t.image_path || ""))
        : String(t.image_path || "");
    if (safeSrc) img.src = safeSrc;
    img.style.cursor = "pointer";

    const addBtn = document.createElement("div");
    addBtn.className = "meme-template-add";
    addBtn.title = "Add to Canvas";
    addBtn.textContent = "＋";

    const trashBtn = document.createElement("div");
    trashBtn.className = "meme-binder-trash";
    trashBtn.title = "Delete";
    trashBtn.style.zIndex = "30";
    trashBtn.textContent = "🗑️";

    const keys = document.createElement("div");
    keys.className = "overlay-keywords";
    keys.title = "Click to edit keywords";
    
    const itemKeys = String(t.keywords || "");
    let displayKeys = "No keywords";
    if (itemKeys) {
        displayKeys = itemKeys.split(',').map(k => k.trim().toLowerCase()).filter(k => k).map(k => '#' + k).join(' ');
    }
    keys.textContent = displayKeys;

    card.appendChild(title);
    card.appendChild(checkbox);
    card.appendChild(img);
    card.appendChild(addBtn);
    card.appendChild(trashBtn);
    card.appendChild(keys);

    grid.appendChild(card);
});

    };

    render(templates);

    input.addEventListener("input", () => {
        const terms = String(input.value || "").toLowerCase().split(",").map(t => t.trim()).filter(Boolean);
        if (terms.length === 0) return render(templates);

        const filtered = templates.filter(t => {
            const nameVal = String(t.name || "").toLowerCase();
            const kWords = String(t.keywords || "").toLowerCase().split(",");
            return terms.every(term => {
                const nameMatch = nameVal.startsWith(term);
                const keywordMatch = kWords.some(k => k.trim().startsWith(term));
                return nameMatch || keywordMatch;
            });
        });

        render(filtered);
    });
});


    window._selectTemplate = async (path, name) => {
        const div = document.createElement('div');
        div.className = 'custom-dialog-overlay open';
        div.style.zIndex = '12000';
        div.innerHTML = `
            <div class="custom-dialog-box" style="max-width: 300px; text-align: center; position: relative;">
                <button type="button" class="tpl-close-x" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#c0392b; font-size:20px; line-height:1; font-weight:bold; cursor:pointer;">&times;</button>
                <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Use Template</h3>
                <div class="dialog-actions" style="display:flex; flex-direction:column; gap:8px;">
                    <button class="btn-public" id="btnAsBg" style="background:#ffcdd2; color:#b71c1c; border:none; box-shadow:none;">Add as Background</button>
                    <button class="btn-public" id="btnAsPic" style="background:#bbdefb; color:#0d47a1; border:none; box-shadow:none;">Add as Picture</button>
                    <button class="btn-public" id="btnAsDown" style="background:#c8e6c9; color:#1b5e20; border:none; box-shadow:none;">Download to Computer</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        const close = () => div.remove();
        div.querySelector('.tpl-close-x').onclick = close;

        const process = async (mode) => {
            try {
                if (mode === 'download') {
                    const response = await fetch(path);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = (name || 'template') + '.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    close();
                    return;
                }
                close();
                const res = await fetch(path);
                const blob = await res.blob();
                const file = new File([blob], "template.png", { type: "image/png" });
                
                if(onSelectCallback) {
                    onSelectCallback(file, mode);
                    const ov = document.getElementById('memeTemplateOverlay');
                    if (ov) ov.remove();
                }
            } catch (e) { console.error(e); close(); }
        };

        div.querySelector('#btnAsBg').onclick = () => process('background');
        div.querySelector('#btnAsPic').onclick = () => process('picture');
        div.querySelector('#btnAsDown').onclick = () => process('download');
    };
};

window.editBinderMeta = function(id, currentName, currentKeywords) {
    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '12000';
        div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 320px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Edit Details</h3>
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Name:</label>
            <input type="text" id="editBinderName" class="settings-input" style="width:100%; margin-bottom:12px;">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Keywords:</label>
            <textarea id="editBinderKeys" class="custom-dialog-textarea" style="min-height:60px; margin-bottom:15px;"></textarea>
            <div class="dialog-actions" style="display:flex; justify-content:space-between; gap:10px;">
                <button type="button" class="btn-cancel" id="cancelEditProg">Cancel</button>
                <button type="button" class="btn-cancel" id="saveEditBinder" style="font-weight:bold;">Save</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    const n = div.querySelector('#editBinderName');
    if (n) n.value = String(currentName || '');

    const k = div.querySelector('#editBinderKeys');
    if (k) k.value = String(currentKeywords || '');

    const cancelBtn = div.querySelector('#cancelEditProg');
    if (cancelBtn) cancelBtn.onclick = () => div.remove();

    div.querySelector('#saveEditBinder').onclick = () => {
        const name = div.querySelector('#editBinderName').value.trim();
        const keywords = div.querySelector('#editBinderKeys').value.trim();
        fetch(`/api/memes/binder/${id}/edit`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, keywords })
        }).then(r => r.json()).then(d => {
            if(d.success) { div.remove(); if(window.openMemeBinderOverlay) window.openMemeBinderOverlay(); }
        });
    };
};

window.editTemplateMeta = function(id, currentName, currentKeywords) {
    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '12000';
    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 320px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Edit Template</h3>
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Name:</label>
            <input type="text" id="editTempName" class="settings-input" style="width:100%; margin-bottom:12px;" value="${__escapeHtml(currentName)}">
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Keywords:</label>
            <textarea id="editTempKeys" class="custom-dialog-textarea" style="min-height:60px; margin-bottom:15px;">${__escapeHtml(currentKeywords)}</textarea>
            <div class="dialog-actions" style="display:flex; justify-content:space-between; gap:10px;">
                <button type="button" class="btn-cancel" data-action="dlgClose">Cancel</button>
                <button type="button" class="btn-cancel" id="saveEditTemp" style="font-weight:bold;">Save</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);
    div.querySelector('#saveEditTemp').onclick = () => {
        const name = div.querySelector('#editTempName').value.trim();
        const keywords = div.querySelector('#editTempKeys').value.trim();
        fetch(`/api/memes/templates/${id}/edit`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, keywords })
        }).then(r => r.json()).then(d => {
            if(d.success) { div.remove(); if(window.openTemplateOverlay) window.openTemplateOverlay(); }
        });
    };
};

window._openDeleteDialog = function(opts) {
    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '13000';
    div.innerHTML = `
        <div class="custom-dialog-box delete-meme-dialog" style="max-width: 320px;">
            <h3>${__escapeHtml(opts.title || 'Confirm Delete')}</h3>
                           <p>${__escapeHtml(opts.message || 'Are you sure?')}</p>
            <div class="dialog-actions" style="justify-content:center;">
                <button type="button" class="btn-delete-no">Cancel</button>
                <button type="button" class="btn-delete-yes">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    const close = () => div.remove();
    div.addEventListener('click', (e) => { if (e.target === div) close(); });

    div.querySelector('.btn-delete-no').onclick = close;
    div.querySelector('.btn-delete-yes').onclick = () => {
        try { if (typeof opts.onYes === 'function') opts.onYes(); } finally { close(); }
    };
};

window.confirmDeleteMeme = function(id) {
    window._openDeleteDialog({
        title: 'Delete Meme',
        message: 'Are you sure you want to delete this meme?',
        onYes: () => window.deleteMeme(id, 'binder')
    });
};


window.confirmDeleteTemplate = function(id) {
    window._openDeleteDialog({
        title: 'Delete Template',
        message: 'Are you sure you want to delete this template?',
        onYes: () => window.deleteMeme(id, 'templates')
    });
};


window.deleteMeme = function(id, type) {
    const url = type === "binder" ? "/api/memes/delete" : "/api/memes/templates/delete";

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id })
    })
    .then(r => r.json())
    .then(d => {
        if (!d || d.success !== true) return;

        const el = document.getElementById((type === "binder" ? "meme-item-" : "template-item-") + id);
        if (el) el.remove();

        if (type === "binder") {
            const ov = document.getElementById("memeBinderOverlay");
            if (ov && typeof window.openMemeBinderOverlay === "function") {
                ov.remove();
                window.openMemeBinderOverlay();
            }
        }

        if (type === "templates") {
            const ov = document.getElementById("memeTemplateOverlay");
            if (ov && typeof window.openTemplateOverlay === "function") {
                ov.remove();
                window.openTemplateOverlay();
            }
        }
    });
};


window.confirmDownloadCollection = function(type) {
    const label = type === 'templates' ? 'templates' : (type === 'progress' ? 'projects' : 'memes');
    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '13000';
    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 300px; text-align: center;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Download Collection</h3>
            <p>Download all ${label} as a ZIP file?</p>
            <div class="dialog-actions" style="display: flex; width: 100%; justify-content: space-between;">
                <button class="btn-cancel" data-action="dlgClose">No</button>
                <button class="btn-cancel" data-action="downloadZip" data-type="${type}">Yes</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);
};



window.openGalleryUploadDialog = function(type) {
    if (window._isGuestMode) return showGuestDialog();
    const isBinder = type === "binder";
    const title = isBinder ? "Upload to Meme Binder" : "Upload to Meme Templates";
    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "14000";

   div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 420px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">${title}</h3>
            <p>Drag and drop one or more images here, or use Browse.</p>

            <div class="gallery-upload-dropzone" id="galleryUploadDropzone">
                <div style="font-weight:800; margin-bottom:6px;">Drop images here</div>
                <div style="font-size:12px; opacity:0.8;">PNG, JPG, WEBP, GIF</div>
            </div>

            <input id="galleryUploadInput" type="file" accept="image/*" multiple style="display:none;">

            <div id="galleryUploadStatus" style="margin-top:10px; font-size:12px; color:#333;"></div>

           <div class="dialog-actions" style="display:flex; justify-content:space-between; width:100%; margin-top:12px;">
                <button class="btn-cancel" id="galleryUploadCancelBtn" type="button">Cancel</button>
                <button class="btn-cancel" id="galleryBrowseBtn" type="button">Browse</button>
            </div>
        </div>
    `;

    document.body.appendChild(div);

    const dropzone = div.querySelector("#galleryUploadDropzone");
    const input = div.querySelector("#galleryUploadInput");
    const status = div.querySelector("#galleryUploadStatus");
    const browseBtn = div.querySelector("#galleryBrowseBtn");
    const cancelBtn = div.querySelector("#galleryUploadCancelBtn");

    const close = () => div.remove();

    const uploadFiles = async (fileList) => {
        const files = Array.from(fileList || []).filter(f => f && f.type && f.type.startsWith("image/"));
        if (!files.length) {
            status.textContent = "No images selected.";
            return;
        }

        status.textContent = `Uploading ${files.length} image(s)...`;

        const url = isBinder ? "/api/memes/binder" : "/api/memes/templates";
        let okCount = 0;

        for (const f of files) {
            const fd = new FormData();
            fd.append("meme", f, f.name);

            const baseName = String(f.name || "Untitled").replace(/\.[^/.]+$/, "");
            fd.append("name", baseName);
            fd.append("keywords", "");

            try {
                const r = await fetch(url, { method: "POST", body: fd });
                const d = await r.json().catch(() => ({}));
                if (r.ok && d && d.success) okCount++;
            } catch (e) {}
        }

        if (okCount === files.length) {
            status.textContent = `Uploaded ${okCount} image(s).`;
        } else {
            status.textContent = `Uploaded ${okCount}/${files.length}.`;
        }

        if (typeof showToast === "function") {
            showToast(isBinder ? "Upload complete (Binder)" : "Upload complete (Templates)");
        }

        close();

        if (isBinder && document.getElementById("memeBinderOverlay") && typeof window.openMemeBinderOverlay === "function") {
            window.openMemeBinderOverlay();
        }
        if (!isBinder && document.getElementById("memeTemplateOverlay") && typeof window.openTemplateOverlay === "function") {
            window.openTemplateOverlay();
        }
    };

    browseBtn.onclick = () => input.click();
    cancelBtn.onclick = close;

    dropzone.addEventListener("click", () => input.click());

    input.addEventListener("change", () => {
        uploadFiles(input.files);
        input.value = "";
    });

    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("is-dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("is-dragover");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("is-dragover");
        if (e.dataTransfer && e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
    });

    div.addEventListener("click", (e) => {
        if (e.target === div) close();
    });

    window.addEventListener("keydown", function onKey(e) {
        if (e.key === "Escape") {
            window.removeEventListener("keydown", onKey);
            close();
        }
    });
};

window._moveItem = async (id, type) => {
    const r = await fetch(`/api/categories/${type}`);
    const d = await r.json();
    const cats = (d && Array.isArray(d.categories)) ? d.categories : [];

    const overlay = document.createElement('div');
    overlay.className = 'custom-dialog-overlay open';
    overlay.style.zIndex = '13000';

    const box = document.createElement('div');
    box.className = 'custom-dialog-box';
    box.style.maxWidth = '300px';

    const h = document.createElement('h3');
    h.textContent = 'Move Item';

    const list = document.createElement('div');
    list.style.maxHeight = '300px';
    list.style.overflowY = 'auto';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '4px';

    const btnUnsorted = document.createElement('button');
    btnUnsorted.type = 'button';
    btnUnsorted.className = 'btn-public';
    btnUnsorted.style.background = '#777';
    btnUnsorted.textContent = '📁 Unsorted';
    btnUnsorted.addEventListener('click', () => window._doMove(id, type, 0));
    list.appendChild(btnUnsorted);

    for (const c of cats) {
        const cid = Number(c && c.id);
        if (!Number.isFinite(cid)) continue;

        const name = String((c && c.name) || '').trim() || '(unnamed)';

        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-public';
        b.textContent = `📁 ${name}`;
        b.addEventListener('click', () => window._doMove(id, type, cid));
        list.appendChild(b);
    }

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'btn-cancel';
    cancel.style.marginTop = '10px';
    cancel.style.width = '100%';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', () => overlay.remove());

    box.appendChild(h);
    box.appendChild(list);
    box.appendChild(cancel);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
};


window._doMove = async (id, type, catId) => {
    await fetch(`/api/memes/${type}/move`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id, category_id: catId })
    });

    const dlg = document.querySelector('.custom-dialog-overlay.open');
    if (dlg) dlg.remove();

    if(type === 'binder' && document.getElementById('memeBinderOverlay')) {
        document.getElementById('memeBinderOverlay').remove();
        if(window.openMemeBinderOverlay) window.openMemeBinderOverlay();
    }
    if(type === 'templates' && document.getElementById('memeTemplateOverlay')) {
        document.getElementById('memeTemplateOverlay').remove();
        if(window.openTemplateOverlay) window.openTemplateOverlay();
    }
    if(type === 'progress' && document.getElementById('memeProgressOverlay')) {
        document.getElementById('memeProgressOverlay').remove();
        if(window.openProgressOverlay) window.openProgressOverlay();
    }
};

window._binderDragStart = (e, id, sourceCatId, sourceCatName) => {
    e.dataTransfer.setData("text/id", id);
    e.dataTransfer.setData("text/source", sourceCatId);
    e.dataTransfer.setData("text/sourceName", sourceCatName);
};

window._templateDragStart = (e, id, sourceCatId, sourceCatName) => {
    e.dataTransfer.setData("text/id", id);
    e.dataTransfer.setData("text/source", sourceCatId);
    e.dataTransfer.setData("text/sourceName", sourceCatName);
};

window._templateDrop = (e, targetCatId) => {
    const id = e.dataTransfer.getData("text/id");
    const sourceCat = e.dataTransfer.getData("text/source");
    const sourceName = e.dataTransfer.getData("text/sourceName");

    if (sourceCat == targetCatId) return;

    if (sourceCat === "all") {
        window._doMove(id, "templates", targetCatId);
        return;
    }

    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "15000";
    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 320px; text-align: center; position: relative;">
            <button type="button" id="btnTplDropClose" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#c0392b; font-size:20px; line-height:1; font-weight:bold; cursor:pointer;">&times;</button>
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Organize Template</h3>
            <p>Do you want to keep a copy in <b>${__escapeHtml(sourceName)}</b>?</p>
            <div class="dialog-actions" style="display:flex; width:100%; justify-content: space-between; gap: 10px;">
                <button class="btn-cancel" id="btnTplDropMove">No</button>
                <button class="btn-cancel" id="btnTplDropCopy">Yes (Copy)</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    div.querySelector("#btnTplDropClose").onclick = () => div.remove();

    div.querySelector("#btnTplDropMove").onclick = () => {
        window._doMove(id, "templates", targetCatId);
    };

    div.querySelector("#btnTplDropCopy").onclick = async () => {
        const btnCopy = div.querySelector("#btnTplDropCopy");
        const btnMove = div.querySelector("#btnTplDropMove");

        btnCopy.disabled = true;
        btnMove.disabled = true;
        const oldText = btnCopy.textContent;
        btnCopy.textContent = "Copying.";

        try {
            const resp = await fetch("/api/memes/templates/copy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({ id, category_id: targetCatId })
            });

            let data = null;
            try { data = await resp.json(); } catch (e) {}

            if (!resp.ok || !data || data.success !== true) {
                btnCopy.disabled = false;
                btnMove.disabled = false;
                btnCopy.textContent = oldText;

                const msg = (data && data.error) ? data.error : (resp.status === 429 ? "Too many requests. Try again in a moment." : "Copy failed.");
                if (typeof showToast === "function") showToast(msg, "error");
                return;
            }

            div.remove();
            const ov = document.getElementById("memeTemplateOverlay");
            if (ov) ov.remove();
            if (window.openTemplateOverlay) window.openTemplateOverlay();
        } catch (err) {
            btnCopy.disabled = false;
            btnMove.disabled = false;
            btnCopy.textContent = oldText;
            if (typeof showToast === "function") showToast("Copy failed. Check the server and try again.", "error");
                }
    };
};

window._binderDrop = (e, targetCatId) => {
    const id = e.dataTransfer.getData("text/id");
    const sourceCat = e.dataTransfer.getData("text/source");
    const sourceName = e.dataTransfer.getData("text/sourceName");

    if (!id) return;
    if (sourceCat == targetCatId) return;

    if (sourceCat === "all") {
        window._doMove(id, "binder", targetCatId);
        return;
    }

    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "15000";
    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 320px; text-align: center; position: relative;">
            <button type="button" id="btnBndDropClose" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#c0392b; font-size:20px; line-height:1; font-weight:bold; cursor:pointer;">&times;</button>
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Organize Meme</h3>
            <p>Do you want to keep a copy in <b>${__escapeHtml(sourceName)}</b>?</p>
            <div class="dialog-actions" style="display:flex; width:100%; justify-content: space-between; gap: 10px;">
                <button class="btn-cancel" id="btnBndDropMove">No</button>
                <button class="btn-cancel" id="btnBndDropCopy">Yes (Copy)</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    div.querySelector("#btnBndDropClose").onclick = () => div.remove();

    div.querySelector("#btnBndDropMove").onclick = () => {
        window._doMove(id, "binder", targetCatId);
    };

    div.querySelector("#btnBndDropCopy").onclick = async () => {
        const btnCopy = div.querySelector("#btnBndDropCopy");
        const btnMove = div.querySelector("#btnBndDropMove");

        btnCopy.disabled = true;
        btnMove.disabled = true;
        const oldText = btnCopy.textContent;
        btnCopy.textContent = "Copying.";

        try {
            const resp = await fetch("/api/memes/binder/copy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({ id, category_id: targetCatId })
            });

            let data = null;
            try { data = await resp.json(); } catch (e) {}

            if (!resp.ok || !data || data.success !== true) {
                btnCopy.disabled = false;
                btnMove.disabled = false;
                btnCopy.textContent = oldText;

                const msg = (data && data.error) ? data.error : (resp.status === 429 ? "Too many requests. Try again in a moment." : "Copy failed.");
                if (typeof showToast === "function") showToast(msg, "error");
                return;
            }

            div.remove();
            const ov = document.getElementById("memeBinderOverlay");
            if (ov) ov.remove();
            if (window.openMemeBinderOverlay) window.openMemeBinderOverlay();
        } catch (err) {
            btnCopy.disabled = false;
            btnMove.disabled = false;
            btnCopy.textContent = oldText;
            if (typeof showToast === "function") showToast("Copy failed. Check the server and try again.", "error");
        }
    };
};


let binderEditMode = false;
const binderSelected = new Set();

let binderCategories = [];


let binderEditActions = null;
let binderMoveBtn = null;
let binderBulkDeleteBtn = null;
let binderSelCount = null;


const binderSyncEditUi = () => {
    if (!binderEditActions) return;

    binderEditActions.style.display = binderEditMode ? 'flex' : 'none';
    binderSelCount.textContent = binderEditMode ? `${binderSelected.size} selected` : '';

    const disable = !binderEditMode || binderSelected.size === 0;
    if (binderMoveBtn) binderMoveBtn.disabled = disable;
    if (binderBulkDeleteBtn) binderBulkDeleteBtn.disabled = disable;

    const ov = document.getElementById('memeBinderOverlay');
    if (ov) ov.classList.toggle('mc-edit-mode', binderEditMode);

    const gridEl = document.getElementById('memeBinderGrid');
    if (!gridEl) return;

    const cards = gridEl.querySelectorAll('.gallery-grid-item');
    cards.forEach(card => {
        if (binderEditMode) {
            const strId = card.id.replace('meme-item-', '');
            const id = Number(strId);
            card.classList.toggle('mc-selected', binderSelected.has(id));
        } else {
            card.classList.remove('mc-selected');
        }
        card.draggable = !binderEditMode;
    });

};

let lastBinderCheckedIndex = null;

window._toggleBinderEditMode = () => {
    binderEditMode = !binderEditMode;
    if (!binderEditMode) {
        binderSelected.clear();
        lastBinderCheckedIndex = null;
    }
    binderSyncEditUi();
};

window._binderCheckboxClick = (e, id, index) => {
    if (e) e.stopPropagation();
    if (!binderEditMode) return;

    const numId = Number(id);
    const isSelecting = !binderSelected.has(numId);

    if (e && e.shiftKey && lastBinderCheckedIndex !== null && index !== undefined) {
        const start = Math.min(lastBinderCheckedIndex, index);
        const end = Math.max(lastBinderCheckedIndex, index);
        const cards = Array.from(document.getElementById('memeBinderGrid').querySelectorAll('.gallery-grid-item'));

        for (let i = start; i <= end; i++) {
            const c = cards[i];
            if (c) {
                const cId = Number(c.dataset.binderId);
                if (isSelecting) binderSelected.add(cId);
                else binderSelected.delete(cId);
                c.classList.toggle('mc-selected', isSelecting);
            }
        }
    } else {
        if (isSelecting) binderSelected.add(numId);
        else binderSelected.delete(numId);

        const card = document.getElementById('meme-item-' + id);
        if (card) card.classList.toggle('mc-selected', isSelecting);
    }

    lastBinderCheckedIndex = index;
    binderSyncEditUi();
};

window._binderImgClick = (e, id, index) => {
    if (binderEditMode) {
        if (e) e.preventDefault();
        window._binderCheckboxClick(e, id, index);
        return;
    }
    window._openGalleryLightbox(index);
};

const openBinderMoveDialog = () => {
    if (binderSelected.size === 0) return;

    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '15000';

    const folderRows = [];
    folderRows.push(`
        <label style="display:flex; align-items:center; gap:8px; padding:6px 2px; cursor:pointer;">
            <input type="checkbox" class="mc-move-dest" value="0">
            <span>📁 Unsorted</span>
        </label>
    `);

    binderCategories.forEach(c => { 
        folderRows.push(`
            <label style="display:flex; align-items:center; gap:8px; padding:6px 2px; cursor:pointer;">
                <input type="checkbox" class="mc-move-dest" value="${c.id}">
                <span>📁 ${__escapeHtml(c.name)}</span>
            </label>
        `);
    });

    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 360px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Move To</h3>
            <p style="margin-top:0;">Choose folder(s) to move the selected images to.</p>
            <div style="max-height: 260px; overflow:auto; background:#fff; border:1px solid #ccd0d5; border-radius:10px; padding:8px 10px;">
                ${folderRows.join('')}
            </div>
          <div class="dialog-actions" style="display:flex; width:100%; justify-content:space-between; gap:10px; margin-top:12px;">
                <button class="btn-cancel" id="mcMoveCancel">Cancel</button>
                <button class="btn-cancel" id="mcMoveGo">Move</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    div.querySelector('#mcMoveCancel').onclick = () => div.remove();

    div.querySelector('#mcMoveGo').onclick = async () => {
        const checks = Array.from(div.querySelectorAll('.mc-move-dest:checked'));
        const dests = checks.map(ch => Number(ch.value)).filter(v => Number.isFinite(v));

        if (dests.length === 0) return;

        const ids = Array.from(binderSelected);

        const primary = dests[0];
        const extras = dests.slice(1);

        const btn = div.querySelector('#mcMoveGo');
        btn.disabled = true;
        const oldTxt = btn.textContent;
        btn.textContent = 'Moving.';

        try {
            for (const id of ids) {
                await fetch('/api/memes/binder/move', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ id, category_id: primary })
                });

                for (const catId of extras) {
                    await fetch('/api/memes/binder/copy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin',
                        body: JSON.stringify({ id, category_id: catId })
                    });
                }
            }

            div.remove();
            binderEditMode = false;
            binderSelected.clear();

            if (document.getElementById('memeBinderOverlay')) {
                document.getElementById('memeBinderOverlay').remove();
                if (window.openMemeBinderOverlay) window.openMemeBinderOverlay();
            }
        } catch (err) {
            btn.disabled = false;
            btn.textContent = oldTxt;
            alert('Move failed.');
        }
    };
};

const openBinderBulkDeleteDialog = () => {
    const count = binderSelected.size;
    if (count === 0) return;

    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '15000';
    div.innerHTML = `
        <div class="custom-dialog-box delete-meme-dialog" style="max-width: 360px;">
            <h3>Delete</h3>
            <p>Are you sure you want to delete <b>${count}</b>?</p>
            <div class="dialog-actions" style="justify-content:center; gap:10px; margin-top:12px;">
                <button class="btn-delete-no" id="mcBulkNo">Cancel</button>
                <button class="btn-delete-yes" id="mcBulkYes">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    div.querySelector('#mcBulkNo').onclick = () => div.remove();

    div.querySelector('#mcBulkYes').onclick = async () => {
        const btn = div.querySelector('#mcBulkYes');
        btn.disabled = true;
        const oldTxt = btn.textContent;
        btn.textContent = 'Deleting.';

        try {
            const ids = Array.from(binderSelected);
            for (const id of ids) {
                await fetch('/api/memes/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ id })
                });
            }

            ids.forEach(id => {
                const el = document.getElementById('meme-item-' + id);
                if (el) el.remove();
            });

            div.remove();
            binderEditMode = false;
            binderSelected.clear();

const ov = document.getElementById('memeBinderOverlay');
if (ov) ov.remove();
if (typeof window.openMemeBinderOverlay === 'function') window.openMemeBinderOverlay();

        } catch (err) {
            btn.disabled = false;
            btn.textContent = oldTxt;
            alert('Delete failed.');
        }
    };
};

if (binderMoveBtn) binderMoveBtn.onclick = openBinderMoveDialog;
if (binderBulkDeleteBtn) binderBulkDeleteBtn.onclick = openBinderBulkDeleteDialog;

let templateEditMode = false;
const templateSelected = new Set();

let templateCategories = [];

let templateEditActions = null;
let templateMoveBtn = null;
let templateBulkDeleteBtn = null;
let templateSelCount = null;

const templateSyncEditUi = () => {
    if (!templateEditActions) return;

    templateEditActions.style.display = templateEditMode ? "flex" : "none";
    if (templateSelCount) templateSelCount.textContent = templateEditMode ? `${templateSelected.size} selected` : "";

    const disable = !templateEditMode || templateSelected.size === 0;
    if (templateMoveBtn) templateMoveBtn.disabled = disable;
    if (templateBulkDeleteBtn) templateBulkDeleteBtn.disabled = disable;

    const ov = document.getElementById("memeTemplateOverlay");
    if (ov) ov.classList.toggle("mc-edit-mode", templateEditMode);

    const gridEl = document.getElementById("memeTemplateGrid");
    if (!gridEl) return;

    const cards = gridEl.querySelectorAll(".gallery-grid-item");
    cards.forEach(card => {
        if (templateEditMode) {
            const strId = card.id.replace("template-item-", "");
            const id = Number(strId);
            card.classList.toggle("mc-selected", templateSelected.has(id));
        } else {
            card.classList.remove("mc-selected");
        }
        card.draggable = !templateEditMode;
    });
};

let lastTemplateCheckedIndex = null;

window._toggleTemplateEditMode = () => {
    templateEditMode = !templateEditMode;
    if (!templateEditMode) {
        templateSelected.clear();
        lastTemplateCheckedIndex = null;
    }
    templateSyncEditUi();
};

window._templateCheckboxClick = (e, id, index) => {
    if (e) e.stopPropagation();
    if (!templateEditMode) return;

    const numId = Number(id);
    const isSelecting = !templateSelected.has(numId);

    if (e && e.shiftKey && lastTemplateCheckedIndex !== null && index !== undefined) {
        const start = Math.min(lastTemplateCheckedIndex, index);
        const end = Math.max(lastTemplateCheckedIndex, index);
        const cards = Array.from(document.getElementById('memeTemplateGrid').querySelectorAll('.gallery-grid-item'));

        for (let i = start; i <= end; i++) {
            const c = cards[i];
            if (c) {
                const cId = Number(c.dataset.id);
                if (isSelecting) templateSelected.add(cId);
                else templateSelected.delete(cId);
                c.classList.toggle('mc-selected', isSelecting);
            }
        }
    } else {
        if (isSelecting) templateSelected.add(numId);
        else templateSelected.delete(numId);

        const card = document.getElementById("template-item-" + id);
        if (card) card.classList.toggle("mc-selected", isSelecting);
    }

    lastTemplateCheckedIndex = index;
    templateSyncEditUi();
};

window._templateImgClick = (e, id, index) => {
    if (templateEditMode) {
        if (e) e.preventDefault();
        window._templateCheckboxClick(e, id, index);
        return;
    }
    window._openGalleryLightbox(index);
};

const openTemplateMoveDialog = () => {
    if (templateSelected.size === 0) return;

    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "15000";

    const folderRows = [];
    folderRows.push(`
        <label style="display:flex; align-items:center; gap:8px; padding:6px 2px; cursor:pointer;">
            <input type="checkbox" class="mc-move-dest-tpl" value="0">
            <span>📁 Unsorted</span>
        </label>
    `);

    templateCategories.forEach(c => {
        folderRows.push(`
            <label style="display:flex; align-items:center; gap:8px; padding:6px 2px; cursor:pointer;">
                <input type="checkbox" class="mc-move-dest-tpl" value="${c.id}">
                <span>📁 ${__escapeHtml(c.name)}</span>
            </label>
        `);
    });

    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 360px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Move To</h3>
            <p style="margin-top:0;">Choose folder(s) to move the selected images to.</p>
            <div style="max-height: 260px; overflow:auto; background:#fff; border:1px solid #ccd0d5; border-radius:10px; padding:8px 10px;">
                ${folderRows.join("")}
            </div>
            <div class="dialog-actions" style="display:flex; width:100%; justify-content:space-between; gap:10px; margin-top:12px;">
                <button class="btn-cancel" id="mcTplMoveCancel">Cancel</button>
                <button class="btn-cancel" id="mcTplMoveGo">Move</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    div.querySelector("#mcTplMoveCancel").onclick = () => div.remove();

    div.querySelector("#mcTplMoveGo").onclick = async () => {
        const checks = Array.from(div.querySelectorAll(".mc-move-dest-tpl:checked"));
        const dests = checks.map(ch => Number(ch.value)).filter(v => Number.isFinite(v));
        if (dests.length === 0) return;

        const ids = Array.from(templateSelected);

        const primary = dests[0];
        const extras = dests.slice(1);

        const btn = div.querySelector("#mcTplMoveGo");
        btn.disabled = true;
        const oldTxt = btn.textContent;
        btn.textContent = "Moving.";

        try {
            for (const id of ids) {
                await fetch("/api/memes/templates/move", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    body: JSON.stringify({ id, category_id: primary })
                });

                for (const catId of extras) {
                    await fetch("/api/memes/templates/copy", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "same-origin",
                        body: JSON.stringify({ id, category_id: catId })
                    });
                }
            }

            div.remove();
            templateEditMode = false;
            templateSelected.clear();

            const ov = document.getElementById("memeTemplateOverlay");
            if (ov) ov.remove();
            if (window.openTemplateOverlay) window.openTemplateOverlay();
        } catch (err) {
            btn.disabled = false;
            btn.textContent = oldTxt;
            alert("Move failed.");
        }
    };
};

const openTemplateBulkDeleteDialog = () => {
    const count = templateSelected.size;
    if (count === 0) return;

    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "15000";
    div.innerHTML = `
        <div class="custom-dialog-box delete-meme-dialog" style="max-width: 360px;">
            <h3>Delete</h3>
            <p>Are you sure you want to delete <b>${count}</b>?</p>
            <div class="dialog-actions" style="justify-content:center; gap:10px; margin-top:12px;">
                <button class="btn-delete-no" id="mcTplBulkNo">Cancel</button>
                <button class="btn-delete-yes" id="mcTplBulkYes">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    div.querySelector("#mcTplBulkNo").onclick = () => div.remove();

    div.querySelector("#mcTplBulkYes").onclick = async () => {
        const btn = div.querySelector("#mcTplBulkYes");
        btn.disabled = true;
        const oldTxt = btn.textContent;
        btn.textContent = "Deleting.";

        try {
            const ids = Array.from(templateSelected);

            for (const id of ids) {
                await fetch("/api/memes/templates/delete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    body: JSON.stringify({ id })
                });
            }

            ids.forEach(id => {
                const el = document.getElementById("template-item-" + id);
                if (el) el.remove();
            });

            div.remove();
            templateEditMode = false;
            templateSelected.clear();

            const ov = document.getElementById("memeTemplateOverlay");
            if (ov) ov.remove();
            if (typeof window.openTemplateOverlay === "function") window.openTemplateOverlay();
        } catch (err) {
            btn.disabled = false;
            btn.textContent = oldTxt;
            alert("Delete failed.");
        }
    };
};


window._toggleBanList = async (btn) => {
    const root = btn.parentElement;
    const list = root.querySelector('.ban-list-dropdown');
    const arrow = btn.querySelector('.cat-arrow');
    const isClosed = list.style.display === 'none';

    list.style.display = isClosed ? 'grid' : 'none';
    list.style.gridTemplateColumns = 'repeat(3, 1fr)';
    list.style.gap = '4px';
    arrow.style.transform = isClosed ? 'rotate(90deg)' : 'rotate(0deg)';

    if (!isClosed) return;

    const showMsg = (msg, color) => {
        list.replaceChildren();
        const div = document.createElement('div');
        div.style.fontSize = '10px';
        div.style.color = color || '#999';
        div.style.padding = '4px';
        div.textContent = msg;
        list.appendChild(div);
    };

    try {
        showMsg('Loading...', '#999');

        const res = await fetch('/api/banned');
        const data = await res.json();

        const banned = (data && data.success && Array.isArray(data.banned)) ? data.banned : [];
        if (banned.length === 0) {
            showMsg('No banned users', '#999');
            return;
        }

        list.replaceChildren();

        for (const u of banned) {
            const uid = Number(u && u.id);
            if (!Number.isFinite(uid)) continue;

            const displayName = String((u && u.name) || '').trim() || '(unknown)';

            const row = document.createElement('div');
            row.className = 'ban-user-row';

            const nameBtn = document.createElement('button');
            nameBtn.type = 'button';
            nameBtn.className = 'ban-user-name';
            nameBtn.textContent = displayName;
            nameBtn.addEventListener('click', () => window.openCreatorProfile(uid));

            const xBtn = document.createElement('button');
            xBtn.type = 'button';
            xBtn.className = 'ban-user-x';
            xBtn.title = 'Unban';
            xBtn.textContent = '×';
            xBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.confirmUnbanUser(uid, displayName);
            });

            row.appendChild(nameBtn);
            row.appendChild(xBtn);
            list.appendChild(row);
        }
    } catch (e) {
        showMsg('Error', '#c0392b');
    }
};


window.banUser = (btn, target_id) => {
    const d = document.createElement('div');
    d.className = 'custom-dialog-overlay open';
    d.style.zIndex = '12000';
    d.innerHTML = `
        <div class="custom-dialog-box" style="max-width:300px; text-align:center;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Ban User</h3>
            <p>Ban this user? You won't see their posts anymore.</p>
            <div class="dialog-actions" style="display:flex; justify-content:space-between; gap:10px; margin-top:15px;">
                <button class="btn-cancel" data-action="dlgClose">No</button>
                <button class="btn-public" id="btnConfirmBan">Yes</button>
            </div>
        </div>`;
    document.body.appendChild(d);

    d.querySelector('#btnConfirmBan').onclick = async () => {
        try {
            await fetch('/api/ban', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({target_id}) });
            const post = btn.closest('.timeline-post');
            if (post) post.remove();
            d.remove();
        } catch(e) {
            d.remove();
        }
    };
};

window.confirmUnbanUser = (id, name) => {
    const d = document.createElement('div');
    d.className = 'custom-dialog-overlay open';
    d.style.zIndex = '12000';

    const box = document.createElement('div');
    box.className = 'custom-dialog-box';
    box.style.maxWidth = '300px';
    box.style.textAlign = 'center';

    const h3 = document.createElement('h3');
    h3.style.cssText = 'background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;';
    h3.textContent = 'Unban User';

    const p = document.createElement('p');
    p.append('Are you sure you want to unban ');

    const b = document.createElement('b');
    b.textContent = String(name || '');
    p.appendChild(b);

    p.append('?');

    const actions = document.createElement('div');
    actions.className = 'dialog-actions';
    actions.style.cssText = 'display:flex; justify-content:space-between; gap:10px; margin-top:15px;';

    const btnNo = document.createElement('button');
    btnNo.className = 'btn-cancel';
    btnNo.type = 'button';
    btnNo.textContent = 'No';
    btnNo.addEventListener('click', () => d.remove());

    const btnYes = document.createElement('button');
    btnYes.className = 'btn-public';
    btnYes.type = 'button';
    btnYes.textContent = 'Yes';

    actions.appendChild(btnNo);
    actions.appendChild(btnYes);

    box.appendChild(h3);
    box.appendChild(p);
    box.appendChild(actions);

    d.appendChild(box);
    document.body.appendChild(d);

    btnYes.onclick = async () => {
        await fetch('/api/unban', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ target_id: id })
        });
        d.remove();
        const btn = document.querySelector('button[data-action="toggleBanList"]');
        if (btn) { btn.parentElement.querySelector('.ban-list-dropdown').style.display = 'none'; window._toggleBanList(btn); }
    };
};

window.confirmDeletePost = (btn, id) => {
    const deleteDialog = document.createElement('div');
    deleteDialog.className = 'custom-dialog-overlay open';
    deleteDialog.style.zIndex = '10000';

    const box = document.createElement('div');
    box.className = 'custom-dialog-box';
    box.style.maxWidth = '300px';
    box.style.textAlign = 'center';

    const h3 = document.createElement('h3');
    h3.style.cssText = 'background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;';
    h3.textContent = 'Delete Meme?';

    const p = document.createElement('p');
    p.textContent = 'Are you sure you want to delete meme?';

    const actions = document.createElement('div');
    actions.className = 'dialog-actions';
    actions.style.cssText = 'display:flex; justify-content:space-between; gap:10px;';

    const btnNo = document.createElement('button');
    btnNo.className = 'btn-cancel';
    btnNo.type = 'button';
    btnNo.textContent = 'No';
    btnNo.addEventListener('click', () => deleteDialog.remove());

    const btnYes = document.createElement('button');
    btnYes.className = 'btn-cancel';
    btnYes.type = 'button';
    btnYes.textContent = 'Yes';

    actions.appendChild(btnNo);
    actions.appendChild(btnYes);

    box.appendChild(h3);
    box.appendChild(p);
    box.appendChild(actions);

    deleteDialog.appendChild(box);
    document.body.appendChild(deleteDialog);

    btnYes.onclick = async () => {
        try {
            await fetch('/api/timeline/delete', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ id })
            });
            const post = btn.closest('.timeline-post');
            if (post) post.remove();
            deleteDialog.remove();
        } catch (e) {
            alert('Delete failed');
        }
    };
};

window._toggleFollowingList = async (btn) => {
    const root = btn.parentElement;
    const list = root.querySelector('.following-list-dropdown');
    const arrow = btn.querySelector('.cat-arrow');
    const isClosed = list.style.display === 'none';

    list.style.display = isClosed ? 'flex' : 'none';
    arrow.style.transform = isClosed ? 'rotate(90deg)' : 'rotate(0deg)';

    if (isClosed) {
        try {
            const res = await fetch('/api/following');
            const data = await res.json();
            
            if (data.success && data.following.length > 0) {
                list.textContent = '';
data.following.forEach((u) => {
    const initial = (u.name || 'U')[0].toUpperCase();

    const b = document.createElement('button');
    b.type = 'button';
    b.style.cssText = 'text-align:left; background:none; border:none; padding:4px 0; color:#1c1e21; font-size:12px; cursor:pointer; font-weight:500; display:flex; align-items:center;';

    const badge = document.createElement('div');
    badge.style.cssText = 'width:20px; height:20px; background:#2e7d32; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold; margin-right:8px;';
    badge.textContent = initial;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'u-name';
    nameSpan.textContent = u.name || '';

    b.appendChild(badge);
    b.appendChild(nameSpan);

    b.addEventListener('mouseenter', () => { nameSpan.style.color = '#2196f3'; });
    b.addEventListener('mouseleave', () => { nameSpan.style.color = '#1c1e21'; });
    b.addEventListener('click', () => { window.filterTimelineAuthor(u.id, u.name); });

    list.appendChild(b);
});

            } else {
                list.innerHTML = `<div style="font-size:11px; color:#999; padding:4px;">Not following anyone</div>`;
            }
        } catch (e) {
            list.innerHTML = `<div style="font-size:11px; color:#c0392b; padding:4px;">Error loading list</div>`;
        }
    }
};

window.showCreatorTooltip = (el, name, avatar, followers, joined, posts) => {
    window.hideCreatorTooltip();

    let dateStr = 'Unknown';
    if (joined) {
        const d = new Date(joined);
        if (!Number.isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
        }
    }

    const t = document.createElement('div');
    t.id = 'creator-tooltip-pop';
    t.className = 'creator-tooltip';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex; align-items:center; gap:10px; margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:8px;';

    const initial = String(name || '').trim().charAt(0).toUpperCase() || '?';

    let avatarNode = null;
    const safeSrc = avatar ? __safeImageSrc(avatar) : '';
    if (safeSrc) {
        const img = document.createElement('img');
        img.src = safeSrc;
        img.alt = '';
        img.style.cssText = 'width:40px; height:40px; border-radius:50%; object-fit:cover; border:1px solid #ddd;';
        avatarNode = img;
    } else {
        const div = document.createElement('div');
        div.style.cssText = 'width:40px; height:40px; border-radius:50%; background:#2e7d32; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:18px;';
        div.textContent = initial;
        avatarNode = div;
    }

    const nameDiv = document.createElement('div');
    nameDiv.style.cssText = 'font-weight:800; font-size:14px; color:#1c1e21;';
    nameDiv.textContent = String(name || '');

    header.appendChild(avatarNode);
    header.appendChild(nameDiv);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid; grid-template-columns:auto 1fr; gap:2px 8px; font-size:11px; color:#65676b;';

    const addRow = (labelText, valueText) => {
        const label = document.createElement('span');
        label.textContent = labelText;

        const value = document.createElement('span');
        value.style.cssText = 'font-weight:600; color:#1c1e21;';
        value.textContent = String(valueText);

        grid.appendChild(label);
        grid.appendChild(value);
    };

    addRow('👥 Followers:', followers || 0);
    addRow('📝 Posts:', posts || 0);
    addRow('📅 Joined:', dateStr);

    t.appendChild(header);
    t.appendChild(grid);
    document.body.appendChild(t);

    const rect = el.getBoundingClientRect();
    t.style.left = rect.left + 'px';
    t.style.top = (rect.bottom + 6) + 'px';

    const tRect = t.getBoundingClientRect();
    if (tRect.bottom > window.innerHeight) t.style.top = (rect.top - tRect.height - 6) + 'px';

    requestAnimationFrame(() => t.style.opacity = '1');
};


window.hideCreatorTooltip = () => {
    const t = document.getElementById('creator-tooltip-pop');
    if (t) t.remove();
};

window._toggleMyInfo = async (btn) => {
    const root = btn.parentElement;
    const list = root.querySelector('.my-info-dropdown');
    const arrow = btn.querySelector('.cat-arrow');
    const isClosed = list.style.display === 'none';

    list.style.display = isClosed ? 'flex' : 'none';
    arrow.style.transform = isClosed ? 'rotate(90deg)' : 'rotate(0deg)';

    if (isClosed) {
        try {
            const res = await fetch('/api/profile/stats');
            const data = await res.json();
            
            if (data.success && data.stats) {
                const s = data.stats;
                const joined = s.created_at ? new Date(s.created_at).toLocaleDateString() : 'N/A';
                const likeCount = s.total_likes || 0;
                const digits = String(likeCount).length;
                const heartW = Math.max(24, 18 + (digits * 9)); 

                let topPostHtml = '<span style="color:#999;">None</span>';
                if (s.top_post) {
                    topPostHtml = `<button data-action="globalOpenImage" data-src="${__escapeAttr(__safeImageSrc(s.top_post.image_path))}" style="background:none; border:none; padding:0; color:#2196f3; font-weight:bold; cursor:pointer; text-decoration:underline;">View (❤️ ${s.top_post.likes})</button>`;
                }

                list.innerHTML = `
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:4px; margin-bottom:4px;">
                        <div style="background:#f0f2f5; padding:6px 4px; border-radius:4px; text-align:center;">
                            <div style="font-weight:800; font-size:13px; color:#1c1e21;">${s.following_count}</div>
                            <div style="font-size:9px; color:#65676b; text-transform:uppercase;">Following</div>
                        </div>
                        <div style="background:#f0f2f5; padding:6px 4px; border-radius:4px; text-align:center;">
                            <div style="font-weight:800; font-size:13px; color:#1c1e21;">${s.followers_count}</div>
                            <div style="font-size:9px; color:#65676b; text-transform:uppercase;">Followers</div>
                        </div>
                    </div>
                    <div style="margin-bottom:2px;"><b>Joined:</b> ${joined}</div>
                    <div style="margin-bottom:2px;"><b>Posts:</b> ${s.post_count}</div>
                    <div style="margin-bottom:6px;"><b>Top Post:</b> ${topPostHtml}</div>
                    <div><b>Total Likes:</b> ${s.total_likes || 0}</div>
                    <div><b>Total Direct Shares:</b> ${s.total_shares || 0}</div>
                    <div><b>Total Chain Shares:</b> ${s.total_chain_shares || 0}</div>
                `;
            } else {
                list.innerHTML = `<div style="color:#c0392b; padding:4px;">Sign in to view stats</div>`;
            }
        } catch (e) {
            list.innerHTML = `<div style="color:#c0392b; padding:4px;">Error loading stats</div>`;
        }
    }
};


window.filterTimelineAuthor = (id, name) => {
    window._timelineAuthorId = id;
    window._timelineKeyword = null;
    
    const feedContainer = document.querySelector('.meme-timeline-view .timeline-feed-container');
    if(feedContainer) {
        window._timelineOffset = 0;
        window.loadTimelineFeed();

        const header = document.createElement('div');
        header.innerHTML = `
            <div style="position:-webkit-sticky; position:sticky; top:0; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.15); width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; background:rgba(227, 242, 253, 0.95); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); padding:8px 12px; border-radius:6px; border:1px solid #90caf9; color:#1565c0; font-size:13px; font-weight:600;">
                <span>👤 Posts by: ${__escapeHtml(name)}</span>
                <button data-action="clearTimelineAuthor" style="background:none; border:none; color:#c62828; cursor:pointer; font-weight:800; font-size:12px;">✕ Clear</button>
            </div>`;
        feedContainer.prepend(header);
    }
};

window.saveTimelinePost = (url) => {
    const d = document.createElement('div');
    d.className = 'custom-dialog-overlay open';
    d.style.zIndex = '10000';
    d.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 340px; text-align: center; position: relative;">
            <button type="button" class="save-close-x" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#c0392b; font-size:20px; line-height:1; font-weight:bold; cursor:pointer;">&times;</button>
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Save Meme</h3>
            <p>How do you want to save meme?</p>
            <div class="dialog-actions" style="display: flex; flex-direction:column; gap:10px;">
                <button type="button" class="btn-public" id="saveBinder" style="width:100%; background-color:#d1c4e9; color:#4a148c; border:none; box-shadow:none;">Save in meme binder</button>
                <button type="button" class="btn-public" id="saveTemplate" style="width:100%; background-color:#b2dfdb; color:#00695c; border:none; box-shadow:none;">Save in template binder</button>
                <button type="button" class="btn-public" id="saveDevice" style="width:100%; background-color:#bbdefb; color:#0d47a1; border:none; box-shadow:none;">Save to device</button>
            </div>
        </div>`;
    document.body.appendChild(d);

    d.querySelector('.save-close-x').onclick = () => d.remove();

    const handleSave = async (type) => {
        d.remove();
        if (typeof showToast === 'function') showToast("Saving...");
        
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            
            if (type === 'device') {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = "meme_" + Date.now() + ".png";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                if (typeof showToast === 'function') showToast("Saved to device");
                return;
            }

            const fd = new FormData();
            const file = new File([blob], "saved_meme.png", { type: "image/png" });
            fd.append('meme', file);
            
            fd.append('name', 'Saved from Timeline');
            fd.append('keywords', '');

            const api = (type === 'binder') ? '/api/memes/binder' : '/api/memes/templates';
            
            const up = await fetch(api, { 
                method: 'POST', 
                body: fd,
                credentials: 'same-origin'
            });
            const json = await up.json();
            
            if (json.success) {
                if (typeof showToast === 'function') showToast(type === 'binder' ? "Saved to Meme Binder" : "Saved to Templates");
            } else {
                if (typeof showToast === 'function') showToast("Save failed");
            }
        } catch(e) {
            console.error(e);
            if (typeof showToast === 'function') showToast("Error saving");
        }
    };

    d.querySelector('#saveBinder').onclick = () => handleSave('binder');
    d.querySelector('#saveTemplate').onclick = () => handleSave('template');
    d.querySelector('#saveDevice').onclick = () => handleSave('device');
};

window.filterTimelineTag = (tag) => {
    window._timelineKeyword = tag;
    

    const overlay = document.querySelector('.meme-creator-overlay');
    if (overlay) {
        const chk = overlay.querySelector('.cat-check');
        if (chk) {
            chk.dispatchEvent(new Event('change'));
        }
    }
};

window.openImageModal = (url) => {
    const d = document.createElement('div');
    d.style.cssText = "position:fixed; top:0; left:0; right:0; bottom:0; z-index:20000; background:rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; cursor:zoom-out;";
    const img = document.createElement('img');
img.src = __safeImageSrc(url);
img.style.cssText = "max-width:95%; max-height:95%; object-fit:contain; box-shadow:0 0 20px rgba(0,0,0,0.5); border-radius:4px;";
d.appendChild(img);
    d.onclick = () => d.remove();
    document.body.appendChild(d);
};


window.openSettingsDialog = function() {
    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '13000';
    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 340px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">User Settings</h3>
            
            <div style="margin-bottom:15px; text-align:center;">
                <div id="settingsAvatarDisplay" style="width:60px; height:60px; background:#e0e0e0; border-radius:50%; margin:0 auto 8px; display:flex; align-items:center; justify-content:center; font-size:24px; color:#666; border:2px solid #fff; box-shadow:0 2px 5px rgba(0,0,0,0.1); background-size:cover; background-position:center;">👤</div>
                <button class="btn-public" id="btnChangeAvatar" style="font-size:11px; padding:4px 8px; background-color:#607d8b; box-shadow:none;">Change Avatar</button>
                <input type="file" id="settingsAvatarInput" accept="image/*" style="display:none;">
            </div>

            <div style="border-top:1px solid #eee; margin:10px 0;"></div>

            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Update Email</label>
            <input type="email" id="setNewEmail" class="settings-input" style="width:100%; margin-bottom:12px; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;" placeholder="New Email Address">

            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px;">Change Password</label>
            <input type="password" id="setOldPass" class="settings-input" style="width:100%; margin-bottom:6px; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;" placeholder="Current Password">
            <input type="password" id="setNewPass" class="settings-input" style="width:100%; margin-bottom:15px; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;" placeholder="New Password">

            <div style="border-top:1px solid #eee; margin:10px 0;"></div>
            <label style="font-weight:600; font-size:12px; display:block; margin-bottom:4px; color:#c0392b;">License</label>
            <button type="button" class="btn-cancel" id="btnDeactivateLicense" style="width:100%; margin-bottom:15px; border-color:#c0392b; color:#c0392b; box-shadow:none;">Deactivate License</button>

            <div class="dialog-actions" style="display:flex; justify-content:flex-end; gap:10px;">
    <button type="button" class="btn-cancel" id="btnCloseSettings">Close</button>
    <button type="button" class="btn-public" id="btnSaveSettings">Save Changes</button>
</div>
</div>
`;
document.body.appendChild(div);

div.querySelector('#btnCloseSettings').addEventListener('click', () => {
    div.remove();
});

    const deactivateBtn = div.querySelector('#btnDeactivateLicense');
    if (deactivateBtn) {
        deactivateBtn.onclick = async () => {
            if (!confirm("Are you sure you want to deactivate your license? This will log you out.")) return;
            deactivateBtn.disabled = true;
            deactivateBtn.textContent = "Deactivating...";
            try {
                if (window.api && window.api.deactivateLicense) {
                    const success = await window.api.deactivateLicense();
                    if (success) {
                        // Main process automatically routes back to license.html
                        return;
                    } else {
                        if (typeof showToast === 'function') showToast("Deactivation failed");
                    }
                } else {
                    if (typeof showToast === 'function') showToast("Deactivation requires the Desktop App.");
                }
                deactivateBtn.disabled = false;
                deactivateBtn.textContent = "Deactivate License";
            } catch (e) {
                if (typeof showToast === 'function') showToast("Network Error");
                deactivateBtn.disabled = false;
                deactivateBtn.textContent = "Deactivate License";
            }
        };
    }

    const avatarBtn = div.querySelector('#btnChangeAvatar');    
const avatarInput = div.querySelector('#settingsAvatarInput');
    const avatarDisp = div.querySelector('#settingsAvatarDisplay');

    if (avatarBtn) {
        avatarBtn.onclick = () => avatarInput.click();
        avatarInput.onchange = (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    avatarDisp.textContent = ''; // Remove emoji
                    avatarDisp.style.backgroundImage = `url(${evt.target.result})`;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        };
    }

    div.querySelector('#btnSaveSettings').onclick = async () => {
    if (window.location.protocol === "file:") {
        if (typeof showToast === "function") showToast("Settings only save when running the local Node.js server.");
        return;
    }

    const btn = div.querySelector('#btnSaveSettings');
    const email = div.querySelector('#setNewEmail').value.trim();
    const oldPass = div.querySelector('#setOldPass').value;
    const newPass = div.querySelector('#setNewPass').value;
    const fileInput = div.querySelector('#settingsAvatarInput');

    btn.disabled = true;
    btn.textContent = "Saving.";

    const fd = new FormData();
    if (fileInput.files[0]) fd.append('avatar', fileInput.files[0]);
    if (email) fd.append('email', email);
    if (newPass) {
        fd.append('newPassword', newPass);
        fd.append('oldPassword', oldPass);
    }

    try {
        const res = await fetch('/api/settings', {
            method: 'POST',
            body: fd,
            credentials: 'same-origin'
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
            if (typeof showToast === 'function') showToast(data.error || "Error saving");
            return;
        }

        if (typeof showToast === 'function') showToast("Settings Saved!");

        if (data.avatarPath) {
            const disp = div.querySelector('#settingsAvatarDisplay');
            if (disp) {
                disp.textContent = '';
                disp.style.backgroundImage = `url('${data.avatarPath}')`;
            }
            window._userAvatarPath = data.avatarPath;
        }

        div.remove();
    } catch (e) {
        if (typeof showToast === 'function') showToast("Network Error");
    } finally {
        btn.disabled = false;
        btn.textContent = "Save Changes";
    }
};

    if (window.location.protocol !== "file:") {
        fetch('/api/auth/me', { credentials: 'same-origin' })
            .then(r => r.json())
            .then(d => {
                const p = (d && d.user && d.user.avatar_path) ? d.user.avatar_path : '';
                if (p) {
                    const disp = div.querySelector('#settingsAvatarDisplay');
                    if (disp) {
                        disp.textContent = '';
                        disp.style.backgroundImage = `url('${p}')`;
                    }
                }
                window._userAvatarPath = p;
            })
            .catch(() => {});
    }

};

window.openCreatorProfile = async (userId) => {
    window._lastProfileId = userId;
    const old = document.getElementById('creatorProfileOverlay');
    if(old) old.remove();

    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '11000';
    div.id = 'creatorProfileOverlay';
    
div.innerHTML = `
    <div class="custom-dialog-box" style="max-width: 1200px; width: 95vw; height: 90vh; padding: 0; overflow: hidden; display: flex; flex-direction: column;">
        <div style="padding: 10px 15px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background: #fff;">
            <h3 style="margin: 0; padding: 0; background: none; color: #1c1e21; border: none;">Creator Profile</h3>
            <button data-action="dlgCloseById" data-target-id="creatorProfileOverlay" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>        </div>
        <div class="profile-modal-grid">
            <div class="profile-sidebar" id="profSidebar"><div style="text-align:center;color:#666;margin-top:20px;">Loading...</div></div>
            <div class="profile-main">
                <div id="profPinnedArea" style="display:none;">
                    <h4 style="margin:0 0 10px;font-size:13px;color:#666;text-transform:uppercase;">📌 Pinned Memes</h4>
                    <div class="pinned-section" id="profPinnedGrid"></div>
                </div>
                <div id="profGalleryHeader" style="display:flex;justify-content:flex-start;gap:10px;align-items:center;margin-bottom:10px;">
<h4 style="margin:0;font-size:13px;color:#666;text-transform:uppercase;">Gallery</h4>
<div id="profCatLabel" style="font-size:10px;font-weight:900;color:#2e7d32;background:#e8f5e9;padding:2px 8px;border-radius:999px;text-transform:uppercase;">All Posts</div>
<select id="profSort" style="font-size:11px;padding:4px;"><option value="newest">Recent</option><option value="likes">Popular</option></select>
</div>

                <div class="profile-feed-grid" id="profFeedGrid"><div style="grid-column:1/-1;text-align:center;color:#999;padding:40px;">Loading posts...</div></div>
            </div>
        </div>
    </div>`;
       document.body.appendChild(div);

    let currentCat = null;
    let profData = null;
    let viewerId = null;
    let showBannedPosts = false;


    const loadMeta = async () => {
        try {
            const r = await fetch(`/api/profile/view/${userId}`);
            const d = await r.json();
            if (!d.success) throw new Error();
            profData = d.data;
            viewerId = d.currentUserId;

            const header = document.getElementById('profGalleryHeader');
            const existBtn = document.getElementById('profBanToggle');
            if (existBtn) existBtn.remove();

            if (profData.user.is_banned) {
                const btn = document.createElement('button');
                btn.id = 'profBanToggle';
                btn.className = 'btn-public';
                btn.style.cssText = "padding:2px 8px; font-size:11px; background:#c0392b; margin-left:auto; transition:background 0.2s;";
                btn.textContent = showBannedPosts ? "Hide Posts" : "See Posts";
                
                if (showBannedPosts) btn.style.backgroundColor = "#7f8c8d";

                btn.onclick = () => {
                    showBannedPosts = !showBannedPosts;
                    btn.textContent = showBannedPosts ? "Hide Posts" : "See Posts";
                    btn.style.backgroundColor = showBannedPosts ? "#7f8c8d" : "#c0392b";
                    loadFeed(document.getElementById('profSearch')?.value);
                };
                header.appendChild(btn);
            }

            renderSidebar();
            renderPinned();
            loadFeed();
        } catch(e) { document.getElementById('profSidebar').innerHTML = "Error loading."; }
    };

    const renderSidebar = () => {
        const u = profData.user;
        const c = profData.counts;
        const avatarSrc = __safeImageSrc(u.avatar_path);
        const avatar = avatarSrc
            ? `<img src="${__escapeAttr(avatarSrc)}" class="profile-avatar-large">`
            : `<div class="profile-avatar-large" style="display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;background:#2e7d32;">${__escapeHtml(String(u.name || '?').charAt(0).toUpperCase())}</div>`;

        const cats = profData.categories.map(cat => {
            const catName = String(cat.category || '');
            return `<button class="profile-cat-btn ${currentCat === catName ? 'active' : ''}" data-action="profFilter" data-cat="${__escapeAttr(catName)}"><span>${__escapeHtml(catName)}</span><b>${cat.count}</b></button>`;
        }).join('');

        const isOwner = (viewerId === u.id);
        const bioText = u.bio ? __escapeHtml(u.bio) : '';
        const bioHtml = bioText ? `<div style="font-size:12px; color:#444; margin-top:6px; font-style:italic; line-height:1.4;">${bioText}</div>` : '';
        
        let bioBtn = '';
        if (isOwner) {
            const label = bioText ? "Edit Bio" : "Add Bio";
            bioBtn = `<div style="display:flex; justify-content:center; margin-top:6px;">
                <button data-action="editBio" data-bio="${__escapeAttr(String(u.bio || ''))}" title="${label}" style="width:20px; height:20px; background:#2196f3; color:#fff; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:bold; cursor:pointer; border:none; padding:0;">＋</button>
            </div>`;
        }


        document.getElementById('profSidebar').innerHTML = `
            <div style="text-align:center;margin-bottom:10px;">
                ${avatar}
                <div style="font-weight:900;font-size:18px;margin-top:10px;">${__escapeHtml(u.name)}</div>
                <div style="font-size:11px;color:#666;">Joined: ${new Date(u.created_at).toLocaleDateString()}</div>
                ${bioHtml}
                ${bioBtn}
            </div>
          <div style="background:#f7f8fa;border-radius:8px;padding:10px;">
                <div class="profile-stat-box stat-link" data-action="openFollowers" data-userid="${u.id}"><span>Followers</span><b>${c.followers}</b></div>
<div class="profile-stat-box stat-link" data-action="openFollowing" data-userid="${u.id}"><span>Following</span><b>${c.following||0}</b></div>
                <div class="profile-stat-box"><span>Posts</span><b>${c.total_posts}</b></div>
                <div class="profile-stat-box"><span>Likes</span><b>${c.total_likes||0}</b></div>
                <div class="profile-stat-box" style="border:none;"><span>Shares</span><b>${c.total_shares_received||0}</b></div>
            </div>
            
                        
            ${renderLinksBox(u.links, isOwner)}
<button type="button" class="btn-public" style="width:100%; margin-top:8px; background:#f7f8e8; color:#2e7d32; border:2px solid #2e7d32; font-weight:900;"
data-action="openStickers">🏆 Achievements</button>

<div id="profStickerDialog" class="custom-dialog-overlay" style="z-index:14000;">

<button type="button" class="btn-public" style="background:#888;" data-action="closeStickers">Close</button>
</div>
</div>
</div>

            <div style="border-top:1px solid #eee;margin-top:5px;padding-top:10px;">

                <input type="text" id="profSearch" placeholder="Search..." style="width:100%;padding:6px;font-size:12px;border:1px solid #ccc;border-radius:4px;margin-bottom:10px;">
                <h5 style="margin:0 0 6px;font-size:11px;color:#999;">CATEGORIES</h5>
                <div style="display:flex;flex-direction:column;gap:2px;">
<button class="profile-cat-btn ${currentCat === null ? 'active' : ''}" data-action="profFilter" data-cat="__all__"><span>All Posts</span><b>${c.total_posts}</b></button>${cats}
            </div>`;

const profStickerDlg = document.getElementById('profStickerDialog');
if (profStickerDlg && !profStickerDlg._outsideCloseAttached) {
    profStickerDlg._outsideCloseAttached = true;
    profStickerDlg.addEventListener('click', (ev) => {
        if (ev.target !== profStickerDlg) return;
        const ov = document.getElementById('creatorProfileOverlay');
        if (ov && ov._closeStickers) ov._closeStickers();
    });
}

const profSidebarEl = document.getElementById('profSidebar');

if (profSidebarEl && !profSidebarEl._profDelegationAttached) {
    profSidebarEl._profDelegationAttached = true;

    profSidebarEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn || !profSidebarEl.contains(btn)) return;

        const action = btn.dataset.action;

        if (action === 'profFilter') {
            const ov = document.getElementById('creatorProfileOverlay');
            if (!ov || !ov._filter) return;

            const cat = btn.dataset.cat;
            return ov._filter(cat === '__all__' ? null : cat);
        }

                if (action === 'editBio') {
    return window._editBio(btn.dataset.bio || '');
}

if (action === 'editLinks') {
    return window._editLinks(window._editLinksData || []);
}


        if (action === 'openFollowers') {
            const id = Number(btn.dataset.userid || 0);
            if (id) return window.openFollowersList(id);
            return;
        }

        if (action === 'openFollowing') {
            const id = Number(btn.dataset.userid || 0);
            if (id) return window.openFollowingList(id);
            return;
        }

        if (action === 'openStickers') {
            const ov = document.getElementById('creatorProfileOverlay');
            if (ov && ov._openStickers) return ov._openStickers();
            return;
        }

        if (action === 'closeStickers') {
            const ov = document.getElementById('creatorProfileOverlay');
            if (ov && ov._closeStickers) return ov._closeStickers();
            return;
        }

    });
}


       document.getElementById('profSearch').oninput = (e) => loadFeed(e.target.value);

const openStickerBook = () => {
    const dlg = document.getElementById('profStickerDialog');
    const grid = document.getElementById('profStickerGrid');
    const title = document.getElementById('profStickerTitle');
    if (!dlg || !grid || !title) return;

    const followers = Number(c.followers || 0);
    const totalPosts = Number(c.total_posts || 0);
    const totalLikes = Number(c.total_likes || 0);
    const shares = Number(c.total_shares_received || 0);
    const best = Number(c.best_post_likes || 0);

    const stickers = [
        { name:"First Friend",    icon:"👥", hint:"1 follower",     ok: followers >= 1 },
        { name:"Friendly Face",   icon:"👋", hint:"10 followers",   ok: followers >= 10 },
        { name:"Local Favorite",  icon:"🌟", hint:"50 followers",   ok: followers >= 50 },
        { name:"Crowd Magnet",    icon:"🏆", hint:"200 followers",  ok: followers >= 200 },
        { name:"Big Deal",        icon:"💎", hint:"1,000 followers",ok: followers >= 1000 },
        { name:"Creator Royalty", icon:"👑", hint:"10,000 followers",ok: followers >= 10000 },

        { name:"First Post",      icon:"📝", hint:"1 post",      ok: totalPosts >= 1 },
        { name:"Seedling",        icon:"🌱", hint:"10 posts",    ok: totalPosts >= 10 },
        { name:"Builder",         icon:"🧱", hint:"50 posts",    ok: totalPosts >= 50 },
        { name:"On a Roll",       icon:"🔥", hint:"200 posts",   ok: totalPosts >= 200 },
        { name:"Machine",         icon:"🚀", hint:"1,000 posts", ok: totalPosts >= 1000 },

        { name:"Spark",           icon:"⭐", hint:"10 total likes",     ok: totalLikes >= 10 },
        { name:"Warm Welcome",    icon:"❤️", hint:"100 total likes",    ok: totalLikes >= 100 },
        { name:"Heart Collector", icon:"💖", hint:"1,000 total likes",  ok: totalLikes >= 1000 },
        { name:"Love Storm",      icon:"💘", hint:"10,000 total likes", ok: totalLikes >= 10000 },
        { name:"Like Magnet",     icon:"🧲", hint:"100,000 total likes",ok: totalLikes >= 100000 },

        { name:"Passed Around", icon:"🔁", hint:"50 shares",   ok: shares >= 50 },
        { name:"Signal Boost",  icon:"📣", hint:"500 shares",  ok: shares >= 500 },
        { name:"Viral",         icon:"🌍", hint:"5,000 shares",ok: shares >= 5000 },

        { name:"Bullseye",         icon:"🎯", hint:"50 likes on one post",   ok: best >= 50 },
        { name:"Lightning Strike", icon:"⚡", hint:"250 likes on one post",  ok: best >= 250 },
        { name:"Eruption",         icon:"🌋", hint:"1,000 likes on one post",ok: best >= 1000 }
    ];

    grid.textContent = "";

stickers.forEach(s => {
    const locked = !s.ok;
    const opacity = locked ? "0.35" : "1";
    const border = locked ? "#ddd" : "#2e7d32";
    const titleAttr = (locked ? "Locked: " : "Unlocked: ") + String(s.hint || "");

    const card = document.createElement("div");
    card.title = titleAttr;
    card.style.cssText = `width:100px;height:100px;border:3px solid ${border};border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff;opacity:${opacity};box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:4px;`;

    const icon = document.createElement("div");
    icon.style.cssText = "font-size:28px;line-height:1;margin-bottom:4px;";
    icon.textContent = String(s.icon || "");

    const name = document.createElement("div");
    name.style.cssText = "font-size:10px;font-weight:900;text-align:center;color:#1c1e21;line-height:1.1;margin-bottom:2px;";
    name.textContent = String(s.name || "");

    const hint = document.createElement("div");
    hint.style.cssText = "font-size:9px;color:#666;text-align:center;line-height:1;";
    hint.textContent = String(s.hint || "");

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(hint);

    grid.appendChild(card);
});


    dlg.classList.add("open");
};

const closeStickerBook = () => {
    const dlg = document.getElementById('profStickerDialog');
    if (dlg) dlg.classList.remove("open");
};

const ov = document.getElementById('creatorProfileOverlay');
if (ov) {
    ov._openStickers = openStickerBook;
    ov._closeStickers = closeStickerBook;
}

};


        const renderPinned = () => {
        const pins = profData.pinned;
        const area = document.getElementById("profPinnedArea");
        const grid = document.getElementById("profPinnedGrid");

        if (!pins || pins.length === 0) { area.style.display = "none"; return; }
        area.style.display = "block";

        grid.textContent = "";
        const isOwner = (viewerId == userId);

        pins.forEach(p => {
            const card = document.createElement("div");
            card.className = "timeline-post profile-pinned-post";
            card.style.maxWidth = "100%";

            const badge = document.createElement("div");
            badge.className = "pinned-badge";
            badge.textContent = "📌 Pinned";

            const img = document.createElement("img");
            img.className = "timeline-img";
            img.loading = "lazy";
            const imgPath = p.image_path ? __safeImageSrc(p.image_path) : "";
img.src = imgPath;
img.style.cursor = "zoom-in";
img.style.maxHeight = "400px";
img.style.width = "auto";
img.style.margin = "0 auto";
img.addEventListener("click", () => {
    if (imgPath) window.openImageModal(imgPath);
});


            const footer = document.createElement("div");
            footer.className = "timeline-footer";

            const meta = document.createElement("div");
            meta.style.cssText = "font-size:10px;color:#999;margin-bottom:6px;display:flex;align-items:center;gap:8px;";

            const dateSpan = document.createElement("span");
            dateSpan.textContent = new Date(p.created_at).toLocaleDateString();
            meta.appendChild(dateSpan);

            if (p.category) {
                const cat = document.createElement("div");
                cat.style.cssText = "background:#e8f5e9; color:#2e7d32; padding:2px 6px; border-radius:4px; font-size:9px; font-weight:700; text-transform:uppercase;";
                cat.textContent = String(p.category);
                meta.appendChild(cat);
            }

            const tagsWrap = document.createElement("div");
            tagsWrap.style.marginBottom = "8px";

            if (p.keywords) {
                const tags = String(p.keywords).split(",").map(k => k.trim()).filter(k => k);
                tags.forEach(t => {
                    const tag = String(t).toLowerCase();

                    const tagEl = document.createElement("span");
                    tagEl.textContent = "#" + tag;
                    tagEl.title = "Search #" + tag + " in profile";
                    tagEl.style.cssText = "font-size:11px; color:#1976d2; margin-right:6px; cursor:pointer; text-decoration:underline;";

                    tagEl.addEventListener("click", () => {
                        const ov = document.getElementById("creatorProfileOverlay");
                        if (ov && typeof ov._search === "function") ov._search(tag);
                    });

                    tagsWrap.appendChild(tagEl);
                });
            }

            const actions = document.createElement("div");
            actions.className = "timeline-actions";

            const likeBtn = document.createElement("button");
            likeBtn.className = "timeline-btn";
            likeBtn.textContent = `❤️ ${p.likes}`;
            likeBtn.addEventListener("click", () => window.likePost(likeBtn, p.id));

            const shareBtn = document.createElement("button");
            shareBtn.className = "timeline-btn";
            shareBtn.textContent = "↪ Share";
            shareBtn.addEventListener("click", () => window.repostPost(p.id));

            actions.appendChild(likeBtn);
            actions.appendChild(shareBtn);

            if (isOwner) {
                const pinBtn = document.createElement("button");
                pinBtn.className = "timeline-btn";
                pinBtn.textContent = (p.is_pinned ? "🚫 Unpin" : "📌 Pin");
                pinBtn.addEventListener("click", () => window._profTogglePin(p.id));
                actions.appendChild(pinBtn);
            }

            const saveBtn = document.createElement("button");
            saveBtn.className = "timeline-btn";
            saveBtn.textContent = "⬇️";
            saveBtn.addEventListener("click", () => {
                if (p.image_path) window.saveTimelinePost(p.image_path);
            });
            actions.appendChild(saveBtn);

            footer.appendChild(meta);
            footer.appendChild(tagsWrap);
            footer.appendChild(actions);

            card.appendChild(badge);
            card.appendChild(img);
            card.appendChild(footer);

            grid.appendChild(card);
        });
    };


    const loadFeed = async (keyword = '') => {
        const grid = document.getElementById('profFeedGrid');
        const sort = document.getElementById('profSort').value;

        if (profData && profData.user.is_banned && !showBannedPosts) {
            grid.textContent = '';

            const msg = document.createElement('div');
            msg.style.cssText = 'grid-column:1/-1;text-align:center;padding:40px;color:#c0392b;font-weight:bold;';
            msg.appendChild(document.createTextNode('🚫 User is banned.'));
            msg.appendChild(document.createElement('br'));

            const sub = document.createElement('span');
            sub.style.cssText = 'font-size:12px;font-weight:normal;color:#666;';
            sub.textContent = 'Posts are hidden.';
            msg.appendChild(sub);

            grid.appendChild(msg);
            return;
        }


        const params = new URLSearchParams();
        params.append('author_id', userId);
        if (currentCat) params.append('categories', currentCat);
        if (keyword) params.append('keyword', keyword);
        if (sort === 'likes') params.append('sort', 'trending');

        if (showBannedPosts) params.append('ignore_ban', 'true');
        
        const r = await fetch(`/api/timeline?${params.toString()}`);
        const d = await r.json();
        if (!d.posts || d.posts.length === 0) {
    grid.textContent = '';

    const empty = document.createElement('div');
    empty.style.cssText = 'grid-column:1/-1;text-align:center;padding:40px;color:#999;';
    empty.textContent = 'No posts found.';
    grid.appendChild(empty);

    return;
}


                const isOwner = (d.currentUserId == userId);

        grid.textContent = '';

        for (const p of d.posts) {
            const postEl = document.createElement('div');
            postEl.className = 'timeline-post';
            postEl.style.maxWidth = '100%';

            const imgPathRaw = (typeof p.image_path === 'string') ? p.image_path : '';
     const imgPath = __safeImageSrc(imgPathRaw);


            const img = document.createElement('img');
            img.className = 'timeline-img';
            img.loading = 'lazy';
            img.style.cursor = 'zoom-in';
            img.style.maxHeight = '400px';
            img.style.width = 'auto';
            img.style.margin = '0 auto';
            img.src = imgPath;

            img.addEventListener('click', () => {
                if (imgPath) window.openImageModal(imgPath);
            });

            postEl.appendChild(img);

            const footer = document.createElement('div');
            footer.className = 'timeline-footer';

            const meta = document.createElement('div');
            meta.style.fontSize = '10px';
            meta.style.color = '#999';
            meta.style.marginBottom = '6px';
            meta.style.display = 'flex';
            meta.style.alignItems = 'center';
            meta.style.gap = '8px';

            const dateSpan = document.createElement('span');
            dateSpan.textContent = new Date(p.created_at).toLocaleDateString();
            meta.appendChild(dateSpan);

            if (p.category) {
                const cat = document.createElement('div');
                cat.style.background = '#e8f5e9';
                cat.style.color = '#2e7d32';
                cat.style.padding = '2px 6px';
                cat.style.borderRadius = '4px';
                cat.style.fontSize = '9px';
                cat.style.fontWeight = '700';
                cat.style.textTransform = 'uppercase';
                cat.textContent = String(p.category);
                meta.appendChild(cat);
            }

            footer.appendChild(meta);

            const tagsWrap = document.createElement('div');
            tagsWrap.style.marginBottom = '8px';

            if (p.keywords) {
                const tags = String(p.keywords).split(',').map(k => k.trim()).filter(Boolean);
                for (const t of tags) {
                    const tagLower = String(t).toLowerCase();

                    const tagSpan = document.createElement('span');
                    tagSpan.style.fontSize = '11px';
                    tagSpan.style.color = '#1976d2';
                    tagSpan.style.marginRight = '6px';
                    tagSpan.style.cursor = 'pointer';
                    tagSpan.style.textDecoration = 'underline';
                    tagSpan.title = `Search #${tagLower} in profile`;
                    tagSpan.textContent = `#${tagLower}`;

                    tagSpan.addEventListener('click', () => {
                        const prof = document.getElementById('creatorProfileOverlay');
                        if (prof && typeof prof._search === 'function') prof._search(tagLower);
                    });

                    tagsWrap.appendChild(tagSpan);
                }
            }

            footer.appendChild(tagsWrap);

            const actions = document.createElement('div');
            actions.className = 'timeline-actions';

            const postId = Number(p.id);

            const likeBtn = document.createElement('button');
            likeBtn.className = 'timeline-btn';
            likeBtn.textContent = `❤️ ${Number(p.likes) || 0}`;
            likeBtn.addEventListener('click', () => window.likePost(likeBtn, postId));
            actions.appendChild(likeBtn);

            const shareBtn = document.createElement('button');
            shareBtn.className = 'timeline-btn';
            shareBtn.textContent = '↪ Share';
            shareBtn.addEventListener('click', () => window.repostPost(postId));
            actions.appendChild(shareBtn);

            if (isOwner) {
                const pinBtn = document.createElement('button');
                pinBtn.className = 'timeline-btn';
                pinBtn.textContent = (p.is_pinned ? '🚫 Unpin' : '📌 Pin');
                pinBtn.addEventListener('click', () => window._profTogglePin(postId));
                actions.appendChild(pinBtn);
            }

            const saveBtn = document.createElement('button');
            saveBtn.className = 'timeline-btn';
            saveBtn.textContent = '⬇️';
            saveBtn.addEventListener('click', () => {
                if (imgPath) window.saveTimelinePost(imgPath);
            });
            actions.appendChild(saveBtn);

            footer.appendChild(actions);
            postEl.appendChild(footer);

            grid.appendChild(postEl);
        }


    };


window._editBio = (currentBio) => {
    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '13000';
   div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 300px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Update Bio</h3>
            <textarea id="bioInput" class="custom-dialog-textarea" style="min-height:80px; margin-bottom:10px;" maxlength="160" placeholder="Tell us about yourself (160 chars max)...">${__escapeHtml(currentBio)}</textarea>
            <div style="text-align:right; font-size:10px; color:#666; margin-bottom:10px;" id="bioCount">0/160</div>
            <div class="dialog-actions" style="display:flex; width:100%; gap:10px;">
               <button type="button" class="btn-cancel" style="flex:1;" data-action="dlgClose">Cancel</button>
                <button type="button" class="btn-cancel" id="saveBioBtn" style="flex:1; font-weight:bold;">Save</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    const txt = div.querySelector('#bioInput');
    const cnt = div.querySelector('#bioCount');
    
    txt.oninput = () => { cnt.textContent = txt.value.length + '/160'; };
    txt.dispatchEvent(new Event('input'));

    div.querySelector('#saveBioBtn').onclick = async () => {
        const val = txt.value.trim();
        await fetch('/api/profile/bio', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ bio: val })
        });
        div.remove();

        const prof = document.getElementById('creatorProfileOverlay');
        if (prof) {
            if(window._lastProfileId) window.openCreatorProfile(window._lastProfileId);
        }
    };
};


function renderLinksBox(jsonLinks, isOwner) {
    let links = [];
    try { links = JSON.parse(jsonLinks || '[]'); } catch(e) {}

    if (!isOwner && links.length === 0) return '';

    const listHtml = links.map(l => 
    `<a class="prof-link" href="${__escapeAttr(__safeHttpUrl(l.url) || '#')}" target="_blank" rel="noopener noreferrer" style="display:block; background:#fff; border:1px solid #ffe0b2; color:#e65100; padding:6px 10px; border-radius:4px; font-size:12px; font-weight:600; text-decoration:none; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${__escapeHtml(l.label || 'Link')} 🔗</a>
`
).join('');

if (isOwner) window._editLinksData = links;
const editBtn = isOwner
    ? `<button type="button" data-action="editLinks" style="border:none; background:none; cursor:pointer; font-size:12px; color:#ef6c00; font-weight:bold;">✏️ Edit</button>`
    : '';

    return `
    <div style="background:#fff8e1; border-radius:8px; padding:10px; margin-top:10px; border:1px solid #ffe0b2;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <h5 style="margin:0; font-size:11px; color:#f57c00; text-transform:uppercase;">Links</h5>
            ${editBtn}
        </div>
        <div>${listHtml || '<div style="font-size:11px; color:#fb8c00; opacity:0.7;">No links added</div>'}</div>
    </div>`;
}

window._editLinks = (currentLinks) => {
    const div = document.createElement('div');
    div.className = 'custom-dialog-overlay open';
    div.style.zIndex = '13000';

    const rows = (currentLinks || []).concat([{label:'', url:''}]).map(l => `
        <div class="link-row" style="display:flex; gap:6px; margin-bottom:8px; align-items:center;">
            <input type="text" class="link-label" placeholder="Label (e.g. Twitter)" value="${__escapeAttr(l.label)}" style="width:100px; padding:6px; font-size:12px; border:1px solid #ccc; border-radius:4px;">
<input type="text" class="link-url" placeholder="URL (https://...)" value="${__escapeAttr(l.url)}" style="flex:1; padding:6px; font-size:12px; border:1px solid #ccc; border-radius:4px;">
<button type="button" class="link-remove-btn" style="color:#c0392b; background:none; border:none; cursor:pointer; font-weight:bold; font-size:16px; padding:0 4px;" title="Remove link">×</button>
        </div>
    `).join('');

    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 380px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Edit Links</h3>
            <div id="linkRowsContainer" style="max-height:200px; overflow-y:auto; margin-bottom:10px;">
                ${rows}
            </div>
            <button class="btn-public" id="addLinkRowBtn" style="width:100%; background:#e3f2fd; color:#1565c0; border:none; margin-bottom:12px; font-size:11px;">+ Add Another Link</button>
            <div class="dialog-actions" style="display:flex; gap:10px; width:100%;">
                <button type="button" class="btn-cancel" id="cancelLinksBtn" style="flex:1;">Cancel</button>
                <button type="button" class="btn-public" id="saveLinksBtn" style="flex:1; background-color:#bdc3c7; color:#1c1e21; border:1px solid #999; box-shadow:none;">Save</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

div.querySelector('#cancelLinksBtn').onclick = () => div.remove();

div.addEventListener('click', (e) => {
    const rm = e.target.closest('.link-remove-btn');
    if (rm && div.contains(rm)) {
        const row = rm.closest('.link-row');
        if (row) row.remove();
    }
});


    div.querySelector('#addLinkRowBtn').onclick = () => {
        const row = document.createElement('div');
        row.className = 'link-row';
        row.style.cssText = "display:flex; gap:6px; margin-bottom:8px; align-items:center;";
        row.innerHTML = `
            <input type="text" class="link-label" placeholder="Label" style="width:100px; padding:6px; font-size:12px; border:1px solid #ccc; border-radius:4px;">
            <input type="text" class="link-url" placeholder="URL" style="flex:1; padding:6px; font-size:12px; border:1px solid #ccc; border-radius:4px;">
            <button type="button" class="link-remove-btn" style="color:#c0392b; background:none; border:none; cursor:pointer; font-weight:bold; font-size:16px; padding:0 4px;" title="Remove link">×</button>
        `;
        div.querySelector('#linkRowsContainer').appendChild(row);
    };

    div.querySelector('#saveLinksBtn').onclick = async () => {
        const newLinks = [];
        div.querySelectorAll('.link-row').forEach(r => {
            const label = r.querySelector('.link-label').value.trim();
            const url = r.querySelector('.link-url').value.trim();
            if (label && url) newLinks.push({ label, url });
        });

        await fetch('/api/profile/links', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ links: JSON.stringify(newLinks) })
        });
        
        div.remove();
        if(window._lastProfileId) window.openCreatorProfile(window._lastProfileId);
    };
};



    div._filter = (cat) => {
        currentCat = cat;
        const lbl = document.getElementById('profCatLabel');
        if (lbl) lbl.textContent = cat ? cat : 'All Posts';

        const header = document.getElementById('profGalleryHeader');
        if (header) header.scrollIntoView(true);

        renderSidebar();
        loadFeed(document.getElementById('profSearch')?.value);
    };

    div._search = (kw) => { document.getElementById('profSearch').value = kw; loadFeed(kw); };
window._profTogglePin = async (pid) => {
const openReplaceDialog = (newPostId) => {
const pins = (profData && profData.pinned) ? profData.pinned : [];
if (!pins || pins.length < 4) { loadMeta(); return; }

const existing = document.getElementById('pinReplaceOverlay');
if (existing) existing.remove();

const overlay = document.createElement('div');
overlay.className = 'custom-dialog-overlay open';
overlay.id = 'pinReplaceOverlay';
overlay.style.zIndex = '12000';

overlay.innerHTML = `
<div class="custom-dialog-box" style="max-width:560px; width:92vw; padding:14px 14px 12px;">
<h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Only 4 memes can be pinned</h3>
<div style="text-align:center; font-size:13px; font-weight:900; color:#1c1e21; margin-top:4px;">Replace meme?</div>
<div class="pin-replace-grid" style="margin-top:12px;">
${pins.map(p => `
<div class="pin-replace-thumb" data-id="${p.id}" data-img="${p.image_path}">
<img src="${p.image_path}" alt="Pinned meme">
<div style="display:flex; justify-content:space-between; gap:8px; padding:6px 8px; font-size:11px; font-weight:800; color:#444;">
<span>❤️ ${p.likes || 0}</span>
<span style="color:#666;">Click twice to zoom</span>
</div>
</div>
`).join('')}
</div>
<div class="dialog-actions" style="display:flex; justify-content:space-between; gap:10px; margin-top:12px;">
<button type="button" class="btn-public pin-replace-cancel" style="background:#9e9e9e; box-shadow:0 3px 0 #616161;">Cancel</button>
<button type="button" class="btn-public pin-replace-do" disabled style="opacity:0.6; pointer-events:none;">Replace</button>
</div>
</div>
`;

overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
document.body.appendChild(overlay);

let selectedOldId = null;

const thumbs = Array.from(overlay.querySelectorAll('.pin-replace-thumb'));
const replaceBtn = overlay.querySelector('.pin-replace-do');

const setReplaceEnabled = (on) => {
if (!replaceBtn) return;
if (on) {
replaceBtn.disabled = false;
replaceBtn.style.opacity = '1';
replaceBtn.style.pointerEvents = 'auto';
} else {
replaceBtn.disabled = true;
replaceBtn.style.opacity = '0.6';
replaceBtn.style.pointerEvents = 'none';
}
};

thumbs.forEach(el => {
el.addEventListener('click', () => {
const id = String(el.getAttribute('data-id') || '');
const img = String(el.getAttribute('data-img') || '');
if (!id) return;

if (selectedOldId === id) {
if (img) window.openImageModal(img);
return;
}

selectedOldId = id;
thumbs.forEach(t => t.classList.remove('selected'));
el.classList.add('selected');
setReplaceEnabled(true);
});
});

const cancelBtn = overlay.querySelector('.pin-replace-cancel');
if (cancelBtn) cancelBtn.onclick = () => overlay.remove();

if (replaceBtn) {
replaceBtn.onclick = async () => {
if (!selectedOldId) return;
try {
const rr = await fetch('/api/profile/pin/replace', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ oldPostId: Number(selectedOldId), newPostId: Number(newPostId) })
});
const dd = await rr.json().catch(() => null);
if (dd && dd.success) {
overlay.remove();
loadMeta();
return;
}
alert((dd && dd.error) ? dd.error : 'Replace failed');
} catch (e) {
alert('Replace failed');
}
};
}
};

try {
const r = await fetch('/api/profile/pin', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ postId: pid })
});
const d = await r.json().catch(() => null);

if (d && d.success) { loadMeta(); return; }
if (d && d.error === 'Max 4 pins allowed') { openReplaceDialog(pid); return; }

loadMeta();
} catch (e) {
loadMeta();
}
};

    document.getElementById('profSort').onchange = () => loadFeed(document.getElementById('profSearch')?.value);



window.openFollowingList = async (userId) => {
    try {
        const res = await fetch(`/api/profile/following/${userId}`);
        const data = await res.json();
        if (!data.success) throw new Error();

        const div = document.createElement('div');
        div.className = 'custom-dialog-overlay open';
        div.style.zIndex = '12000';
        
        const listHtml = data.following.map(u => {
            const initial = (u.name || 'U')[0].toUpperCase();
           const avatar = u.avatar_path 
    ? `<img src="${__escapeAttr(__safeImageSrc(u.avatar_path))}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:1px solid #ddd;">`
                : `<div style="width:32px; height:32px; background:#2e7d32; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px;">${initial}</div>`;
                
            return `
            <div style="display:flex; align-items:center; gap:12px; padding:8px 4px; border-bottom:1px solid #f0f2f5; cursor:pointer;"
     data-action="closeAndOpenProfile" data-user-id="${u.id}">
                ${avatar}
                <span style="font-weight:700; font-size:13px; color:#1c1e21;">${__escapeHtml(u.name)}</span>
            </div>`;
        }).join('');

        div.innerHTML = `
            <div class="custom-dialog-box" style="max-width:320px; max-height:500px; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid #eee;">
                    <h3 style="margin:0; padding:0; background:none; color:#1c1e21; border:none; font-size:16px;">Following</h3>
                    <button data-action="dlgClose" style="border:none; background:none; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
                </div>
                <div style="overflow-y:auto; flex:1;">
                    ${listHtml || '<div style="padding:10px; text-align:center; color:#666; font-size:12px;">Not following anyone.</div>'}
                </div>
            </div>
        `;
        document.body.appendChild(div);
    } catch (e) {

    }
};


    // Start
    loadMeta();
};

let progressEditMode = false;
const progressSelected = new Set();
let progressCategories = [];

let progressEditActions = null;
let progressMoveBtn = null;
let progressBulkDeleteBtn = null;
let progressSelCount = null;
let lastProgressCheckedIndex = null;

const progressSyncEditUi = () => {
    if (!progressEditActions) return;
    progressEditActions.style.display = progressEditMode ? "flex" : "none";
    if (progressSelCount) progressSelCount.textContent = progressEditMode ? `${progressSelected.size} selected` : "";

    const disable = !progressEditMode || progressSelected.size === 0;
    if (progressMoveBtn) progressMoveBtn.disabled = disable;
    if (progressBulkDeleteBtn) progressBulkDeleteBtn.disabled = disable;

    const ov = document.getElementById("memeProgressOverlay");
    if (ov) ov.classList.toggle("mc-edit-mode", progressEditMode);

    const gridEl = document.getElementById("memeProgressGrid");
    if (!gridEl) return;

    const cards = gridEl.querySelectorAll(".gallery-grid-item");
    cards.forEach(card => {
        if (progressEditMode) {
            const strId = card.id.replace("progress-item-", "");
            const id = Number(strId);
            card.classList.toggle("mc-selected", progressSelected.has(id));
        } else {
            card.classList.remove("mc-selected");
        }
        card.draggable = !progressEditMode;
    });
};

window._toggleProgressEditMode = () => {
    progressEditMode = !progressEditMode;
    if (!progressEditMode) {
        progressSelected.clear();
        lastProgressCheckedIndex = null;
    }
    progressSyncEditUi();
};

window._progressCheckboxClick = (e, id, index) => {
    if (e) e.stopPropagation();
    if (!progressEditMode) return;

    const numId = Number(id);
    const isSelecting = !progressSelected.has(numId);

    if (e && e.shiftKey && lastProgressCheckedIndex !== null && index !== undefined) {
        const start = Math.min(lastProgressCheckedIndex, index);
        const end = Math.max(lastProgressCheckedIndex, index);
        const cards = Array.from(document.getElementById('memeProgressGrid').querySelectorAll('.gallery-grid-item'));

        for (let i = start; i <= end; i++) {
            const c = cards[i];
            if (c) {
                const cId = Number(c.dataset.id);
                if (isSelecting) progressSelected.add(cId);
                else progressSelected.delete(cId);
                c.classList.toggle('mc-selected', isSelecting);
            }
        }
    } else {
        if (isSelecting) progressSelected.add(numId);
        else progressSelected.delete(numId);

        const card = document.getElementById("progress-item-" + id);
        if (card) card.classList.toggle("mc-selected", isSelecting);
    }
    lastProgressCheckedIndex = index;
    progressSyncEditUi();
};

const openProgressMoveDialog = () => {
    if (progressSelected.size === 0) return;

    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "15000";

    const folderRows = [];
    folderRows.push(`
        <label style="display:flex; align-items:center; gap:8px; padding:6px 2px; cursor:pointer;">
            <input type="checkbox" class="mc-move-dest-prog" value="0">
            <span>📁 Unsorted</span>
        </label>
    `);

    progressCategories.forEach(c => {
        folderRows.push(`
            <label style="display:flex; align-items:center; gap:8px; padding:6px 2px; cursor:pointer;">
                <input type="checkbox" class="mc-move-dest-prog" value="${c.id}">
                <span>📁 ${__escapeHtml(c.name)}</span>
            </label>
        `);
    });

    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 360px;">
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Move To</h3>
            <p style="margin-top:0;">Choose folder(s) to move the selected saves to.</p>
            <div style="max-height: 260px; overflow:auto; background:#fff; border:1px solid #ccd0d5; border-radius:10px; padding:8px 10px;">
                ${folderRows.join("")}
            </div>
            <div class="dialog-actions" style="display:flex; width:100%; justify-content:space-between; gap:10px; margin-top:12px;">
                <button class="btn-cancel" id="mcProgMoveCancel">Cancel</button>
                <button class="btn-cancel" id="mcProgMoveGo">Move</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    div.querySelector("#mcProgMoveCancel").onclick = () => div.remove();

    div.querySelector("#mcProgMoveGo").onclick = async () => {
        const checks = Array.from(div.querySelectorAll(".mc-move-dest-prog:checked"));
        const dests = checks.map(ch => Number(ch.value)).filter(v => Number.isFinite(v));
        if (dests.length === 0) return;

        const ids = Array.from(progressSelected);
        const primary = dests[0];
        const extras = dests.slice(1);

        const btn = div.querySelector("#mcProgMoveGo");
        btn.disabled = true;
        const oldTxt = btn.textContent;
        btn.textContent = "Moving.";

        try {
            for (const id of ids) {
                await fetch("/api/memes/progress/move", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, category_id: primary })
                });

                for (const catId of extras) {
                    await fetch("/api/memes/progress/copy", {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, category_id: catId })
                    });
                }
            }

            div.remove();
            progressEditMode = false;
            progressSelected.clear();

            const ov = document.getElementById("memeProgressOverlay");
            if (ov) ov.remove();
            if (window.openProgressOverlay) window.openProgressOverlay();
        } catch (err) {
            btn.disabled = false;
            btn.textContent = oldTxt;
            alert("Move failed.");
        }
    };
};

const openProgressBulkDeleteDialog = () => {
    const count = progressSelected.size;
    if (count === 0) return;

    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "15000";
    div.innerHTML = `
        <div class="custom-dialog-box delete-meme-dialog" style="max-width: 360px;">
            <h3>Delete</h3>
            <p>Are you sure you want to delete <b>${count}</b>?</p>
            <div class="dialog-actions" style="justify-content:center; gap:10px; margin-top:12px;">
                <button class="btn-delete-no" id="mcProgBulkNo">Cancel</button>
                <button class="btn-delete-yes" id="mcProgBulkYes">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    div.querySelector("#mcProgBulkNo").onclick = () => div.remove();

    div.querySelector("#mcProgBulkYes").onclick = async () => {
        const btn = div.querySelector("#mcProgBulkYes");
        btn.disabled = true;
        const oldTxt = btn.textContent;
        btn.textContent = "Deleting.";

        try {
            const ids = Array.from(progressSelected);
            for (const id of ids) {
                await fetch("/api/memes/progress/delete", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id })
                });
            }

            div.remove();
            progressEditMode = false;
            progressSelected.clear();

            const ov = document.getElementById("memeProgressOverlay");
            if (ov) ov.remove();
            if (typeof window.openProgressOverlay === "function") window.openProgressOverlay();
        } catch (err) {
            btn.disabled = false;
            btn.textContent = oldTxt;
            alert("Delete failed.");
        }
    };
};

window._progressDragStart = (e, id, sourceCatId, sourceCatName) => {
    e.dataTransfer.setData("text/id", id);
    e.dataTransfer.setData("text/source", sourceCatId);
    e.dataTransfer.setData("text/sourceName", sourceCatName);
};

window._progressDrop = (e, targetCatId) => {
    const id = e.dataTransfer.getData("text/id");
    const sourceCat = e.dataTransfer.getData("text/source");
    const sourceName = e.dataTransfer.getData("text/sourceName");

    if (sourceCat == targetCatId) return;

    if (sourceCat === "all") {
        window._doMove(id, "progress", targetCatId);
        return;
    }

    const div = document.createElement("div");
    div.className = "custom-dialog-overlay open";
    div.style.zIndex = "15000";
    div.innerHTML = `
        <div class="custom-dialog-box" style="max-width: 320px; text-align: center; position: relative;">
            <button type="button" id="btnProgDropClose" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#c0392b; font-size:20px; line-height:1; font-weight:bold; cursor:pointer;">&times;</button>
            <h3 style="background:transparent; color:#1c1e21; border:none; padding:0; margin-bottom:10px;">Organize Project</h3>
            <p>Do you want to keep a copy in <b>${__escapeHtml(sourceName)}</b>?</p>
            <div class="dialog-actions" style="display:flex; width:100%; justify-content: space-between; gap: 10px;">
                <button class="btn-cancel" id="btnProgDropMove">No</button>
                <button class="btn-cancel" id="btnProgDropCopy">Yes (Copy)</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    div.querySelector("#btnProgDropClose").onclick = () => div.remove();
    div.querySelector("#btnProgDropMove").onclick = () => window._doMove(id, "progress", targetCatId);

    div.querySelector("#btnProgDropCopy").onclick = async () => {
        const btnCopy = div.querySelector("#btnProgDropCopy");
        const btnMove = div.querySelector("#btnProgDropMove");

        btnCopy.disabled = true;
        btnMove.disabled = true;
        btnCopy.textContent = "Copying.";

        try {
            await fetch("/api/memes/progress/copy", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, category_id: targetCatId })
            });

            div.remove();
            const ov = document.getElementById("memeProgressOverlay");
            if (ov) ov.remove();
            if (window.openProgressOverlay) window.openProgressOverlay();
        } catch (err) {
            btnCopy.disabled = false;
            btnMove.disabled = false;
            btnCopy.textContent = "Yes (Copy)";
            alert("Copy failed");
        }
    };
};

window.addEventListener("beforeunload", (e) => {
    const state = window._currentMemeState;
    if (state) {
        const hasContent = state.images.length > 0 || state.texts.length > 0 || (state.shapes && state.shapes.length > 0);
        if (hasContent) {
            e.preventDefault();
            e.returnValue = "Are you sure you want to refresh? Progress will be lost.";
        }
    }
});


