// ============================================================
// EDITOR.JS — Editör mantığı
// ============================================================

let siteData = {
  id: null,
  name: 'Yeni Site',
  template: null,
  lang: 'tr',
  colors: {},
  fonts: { heading: '', subheading: '', body: '' },
  content: {},
  social: { whatsapp: '', instagram: '', facebook: '', twitter: '', youtube: '', linkedin: '' },
  images: {},
  galleryItems: []
};

let currentLang = 'tr';
let currentViewport = 'desktop';
let isDirty = false;
let selectedEl = null;
window._freePosMode = true;

// ─── HISTORY (Geri/İleri) ────────────────────────────────────
const MAX_HISTORY = 40;
let historyStack = [];
let historyIndex = -1;

function pushHistory() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Görsel snapshot — img-zone base64'lerini dışarıda bırak (hafıza tasarrufu)
  const clone = canvas.cloneNode(true);
  clone.querySelectorAll('[data-img-key]').forEach(el => {
    el.style.backgroundImage = '';
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
  });

  // Gelecekteki undo ağacını kes
  historyStack = historyStack.slice(0, historyIndex + 1);

  historyStack.push({
    html: clone.innerHTML,
    data: JSON.stringify({ ...siteData, images: {} })
  });

  if (historyStack.length > MAX_HISTORY) historyStack.shift();
  historyIndex = historyStack.length - 1;
  updateUndoRedoBtns();
}

function undoHistory() {
  if (historyIndex <= 0) { showToast('↩ Daha fazla geri alınamaz', 'info'); return; }
  historyIndex--;
  applySnapshot(historyStack[historyIndex]);
  showToast('↩ Geri alındı', 'info');
}

function redoHistory() {
  if (historyIndex >= historyStack.length - 1) { showToast('↪ Daha fazla ileri gidilemez', 'info'); return; }
  historyIndex++;
  applySnapshot(historyStack[historyIndex]);
  showToast('↪ İleri gidildi', 'info');
}

function resetToOriginal() {
  if (historyStack.length === 0) { showToast('Sıfırlanacak değişiklik yok', 'info'); return; }
  if (!confirm('Tüm değişiklikler geri alınacak ve sayfa ilk haline getirilecek.\nDevam etmek istiyor musunuz?')) return;
  historyIndex = 0;
  applySnapshot(historyStack[0]);
  showToast('↺ Sayfa ilk haline getirildi', 'success');
}

function applySnapshot(snap) {
  if (!snap) return;
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = snap.html;

  const parsed = JSON.parse(snap.data);
  siteData = { ...parsed, images: siteData.images }; // görselleri koru

  setupEditable();
  setupImageZones();
  restoreImages(siteData.images || {});
  setupSectionDrag();
  applyColors(siteData.colors);
  updateColorInputs(siteData.colors);
  applyFonts(siteData.fonts || {});
  updateFontInputs(siteData.fonts || {});
  if (siteData.social) updateSocialInputs(siteData.social);
  restoreGradients(siteData);
  setupCardManagement();
  setupGalleryAdd();

  // FAQ butonu senkronize et
  const faqBtn = document.getElementById('faq-toggle-btn');
  if (faqBtn) {
    const has = !!document.getElementById('faq-section');
    faqBtn.textContent = has ? '✕ Kaldır' : '+ Ekle';
    faqBtn.classList.toggle('removing', has);
  }

  isDirty = true;
  updateUndoRedoBtns();
}

function updateUndoRedoBtns() {
  const u = document.getElementById('undo-btn');
  const r = document.getElementById('redo-btn');
  if (u) u.disabled = historyIndex <= 0;
  if (r) r.disabled = historyIndex >= historyStack.length - 1;
}

// ─── INIT ────────────────────────────────────────────────────
function initEditor() {
  const params = new URLSearchParams(window.location.search);
  // npx serve strips query params on redirect — fall back to sessionStorage
  const templateId = params.get('template') || sessionStorage.getItem('_ed_template') || '';
  const siteId     = params.get('id')       || sessionStorage.getItem('_ed_site')     || '';
  const autoExport = params.get('autoexport') || sessionStorage.getItem('_ed_export') || '';
  sessionStorage.removeItem('_ed_template');
  sessionStorage.removeItem('_ed_site');
  sessionStorage.removeItem('_ed_export');

  if (autoExport === '1' && siteId) {
    const saved = localStorage.getItem('site_' + siteId);
    if (saved) {
      siteData = JSON.parse(saved);
      loadTemplate(siteData.template, siteData);
      document.getElementById('site-name-input').value = siteData.name;
      setTimeout(() => { exportSite(); }, 800);
      return;
    }
  }

  if (siteId && siteId !== 'new') {
    // Load existing site
    const saved = localStorage.getItem('site_' + siteId);
    if (saved) {
      siteData = JSON.parse(saved);
      loadTemplate(siteData.template, siteData);
      document.getElementById('site-name-input').value = siteData.name;
      return;
    }
  }

  if (templateId && TEMPLATES[templateId]) {
    siteData.id = (siteId && siteId !== 'new') ? siteId : Date.now().toString();
    siteData.template = templateId;
    siteData.name = siteData.name || 'Yeni Site';
    siteData.colors = { ...TEMPLATES[templateId].defaultColors };
    localStorage.setItem('mif_last_site', siteData.id);
    // Save immediately so page refresh can restore the session
    localStorage.setItem('site_' + siteData.id, JSON.stringify(siteData));
    loadTemplate(templateId, null);
    return;
  }

  // Fallback for page refresh: no sessionStorage/params available anymore —
  // redirect to dashboard if no saved session exists
  const lastId = localStorage.getItem('mif_last_site');
  if (lastId) {
    const saved = localStorage.getItem('site_' + lastId);
    if (saved) {
      try {
        siteData = JSON.parse(saved);
        loadTemplate(siteData.template, siteData);
        const nameInp = document.getElementById('site-name-input');
        if (nameInp) nameInp.value = siteData.name || '';
      } catch(e) {}
    }
  }
}

// ─── LOAD TEMPLATE ───────────────────────────────────────────
function loadTemplate(templateId, savedData) {
  const tpl = TEMPLATES[templateId];
  if (!tpl) return;

  // Inject CSS
  let styleTag = document.getElementById('template-css');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'template-css';
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = tpl.css;

  // Inject HTML
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = tpl.html;

  // Apply colors
  const colors = savedData ? savedData.colors : tpl.defaultColors;
  applyColors(colors);
  updateColorInputs(colors);

  // Restore saved content
  if (savedData && savedData.content) {
    restoreContent(savedData.content, savedData.lang || 'tr');
  }

  // Restore social links
  if (savedData && savedData.social) {
    restoreSocial(savedData.social);
    updateSocialInputs(savedData.social);
  }

  // Make text editable
  setupEditable();

  // Setup image upload zones
  setupImageZones();

  // Restore saved images
  if (savedData && savedData.images) {
    restoreImages(savedData.images);
  }

  // Set language: prefer site's saved lang, fall back to dashboard preference, then 'tr'
  currentLang = (savedData && savedData.lang) ? savedData.lang : (localStorage.getItem('mif_lang') || 'tr');
  updateLangUI();
  window.toggleLang = toggleLanguage;

  // Bölüm sürükleme
  setupSectionDrag();
  setupGridItemDrag();
  setupElementDrag();
  setupResizeHandles();

  // Canvas scroll → selection overlay repositioning
  const scrollEl = document.getElementById('canvas-scroll');
  if (scrollEl && !scrollEl._selScrollBound) {
    scrollEl._selScrollBound = true;
    scrollEl.addEventListener('scroll', () => { if (selectedEl) positionSelOverlay(selectedEl); });
  }

  // Özel öğeleri geri yükle
  if (savedData && savedData.customItems && savedData.customItems.length) {
    restoreCustomItems(savedData.customItems);
  }

  // SSS bölümünü geri yükle
  if (savedData && savedData.faqEnabled) {
    _buildFAQ(savedData.faqItems || []);
    document.getElementById('faq-toggle-btn').textContent = '✕ Kaldır';
    document.getElementById('faq-toggle-btn').classList.add('removing');
  }

  // Bölüm sırasını geri yükle (öğeler eklendikten sonra)
  if (savedData && savedData.sectionOrder) {
    restoreSectionOrder(savedData.sectionOrder);
  }

  // Element transform'larını geri yükle (viewport-aware)
  if (savedData && savedData.elementTransforms) {
    restoreElementTransforms(savedData.elementTransforms, currentViewport);
    restoreFrozenParentHeights();
  }

  // Fontları geri yükle
  if (savedData && savedData.fonts) {
    siteData.fonts = savedData.fonts;
    applyFonts(savedData.fonts);
    updateFontInputs(savedData.fonts);
  }

  // Gradientleri geri yükle
  restoreGradients(savedData);

  // Kart yönetimini kur
  setupCardManagement();

  // Logo yükleme alanını aktif et
  setupLogoUpload();

  // Galeri genişletme
  setupGalleryAdd();
  if (savedData && savedData.galleryItems && savedData.galleryItems.length) {
    restoreGalleryItems(savedData.galleryItems);
  }

  // Konum modunu etkinleştir (her zaman aktif)
  setTimeout(() => {
    freezeAllEditableContainers();
    pushHistory();
    // Persist immediately so page refresh restores the session without waiting for auto-save
    if (!savedData) saveSite();
  }, 80);
}

// ─── IMAGE ZONES ─────────────────────────────────────────────
function setupImageZones() {
  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('.img-zone').forEach(el => {
    el.addEventListener('click', function(e) {
      if (e.target.closest('.editable')) return;
      const key = this.dataset.imgKey;
      if (!key) return;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (loadEv) => {
          const dataUrl = loadEv.target.result;
          this.style.backgroundImage = `url(${dataUrl})`;
          this.style.backgroundSize = 'cover';
          this.style.backgroundPosition = 'center';
          if (!siteData.images) siteData.images = {};
          siteData.images[key] = dataUrl;
          isDirty = true;
          showAutoSaveIndicator();
          showToast('📷 Fotoğraf yüklendi!', 'success');
          pushHistory();
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  });
}

// ─── GALERİ GENIŞLET ─────────────────────────────────────────
const _GAL_HINT = `<div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div>`;

function setupGalleryAdd() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  canvas.querySelectorAll('.gallery-add-btn').forEach(b => b.remove());

  canvas.querySelectorAll('[data-gallery-add]').forEach(grid => {
    const btn = document.createElement('div');
    btn.className = 'gallery-add-btn';
    btn.innerHTML = '<div class="gab-icon">+</div><span>Fotoğraf Ekle</span>';
    btn.addEventListener('click', () => addGalleryItem(grid));
    grid.appendChild(btn);

    grid.querySelectorAll('[data-gallery-dyn]').forEach(item => attachGalleryRemoveBtn(item));
  });
}

function addGalleryItem(grid) {
  const itemClass = grid.dataset.galleryAdd;
  const key = 'gal-dyn-' + Date.now();

  const newItem = document.createElement('div');
  newItem.className = itemClass + ' img-zone';
  newItem.dataset.imgKey = key;
  newItem.dataset.galleryDyn = '1';
  newItem.innerHTML = _GAL_HINT;

  const addBtn = grid.querySelector('.gallery-add-btn');
  grid.insertBefore(newItem, addBtn);
  attachGalleryRemoveBtn(newItem);
  setupSingleImageZone(newItem);
  newItem.click();

  if (!siteData.galleryItems) siteData.galleryItems = [];
  siteData.galleryItems.push({ key, itemClass });
  isDirty = true;
  showAutoSaveIndicator();
  pushHistory();
}

function attachGalleryRemoveBtn(el) {
  if (el.querySelector('.gallery-remove-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'gallery-remove-btn';
  btn.textContent = '✕';
  btn.title = 'Fotoğrafı kaldır';
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const key = el.dataset.imgKey;
    if (siteData.galleryItems) siteData.galleryItems = siteData.galleryItems.filter(i => i.key !== key);
    if (siteData.images) delete siteData.images[key];
    el.remove();
    isDirty = true;
    showAutoSaveIndicator();
    pushHistory();
  });
  el.appendChild(btn);
}

function restoreGalleryItems(items) {
  if (!items || !items.length) return;
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  items.forEach(({ key, itemClass }) => {
    if (canvas.querySelector('[data-img-key="' + key + '"]')) return;
    const grid = canvas.querySelector('[data-gallery-add="' + itemClass + '"]');
    if (!grid) return;
    const newItem = document.createElement('div');
    newItem.className = itemClass + ' img-zone';
    newItem.dataset.imgKey = key;
    newItem.dataset.galleryDyn = '1';
    newItem.innerHTML = _GAL_HINT;
    const addBtn = grid.querySelector('.gallery-add-btn');
    grid.insertBefore(newItem, addBtn);
    attachGalleryRemoveBtn(newItem);
    setupSingleImageZone(newItem);
  });
}

function setupSingleImageZone(el) {
  el.addEventListener('click', function(e) {
    if (e.target.closest('.gallery-remove-btn')) return;
    if (e.target.closest('.editable')) return;
    const key = this.dataset.imgKey;
    if (!key) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = ev => {
      const file = ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = loadEv => {
        const dataUrl = loadEv.target.result;
        this.style.backgroundImage = `url(${dataUrl})`;
        this.style.backgroundSize = 'cover';
        this.style.backgroundPosition = 'center';
        if (!siteData.images) siteData.images = {};
        siteData.images[key] = dataUrl;
        isDirty = true;
        showAutoSaveIndicator();
        showToast('📷 Fotoğraf yüklendi!', 'success');
        pushHistory();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

function restoreImages(images) {
  if (!images) return;
  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('.img-zone').forEach(el => {
    const key = el.dataset.imgKey;
    if (key && images[key]) {
      el.style.backgroundImage = `url(${images[key]})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    }
  });
  if (images['site-logo']) {
    applyLogo(images['site-logo']);
    const zone = document.getElementById('logo-upload-zone');
    if (zone) {
      zone.style.backgroundImage = `url(${images['site-logo']})`;
      zone.style.backgroundSize = 'contain';
      zone.style.backgroundRepeat = 'no-repeat';
      zone.style.backgroundPosition = 'center';
      const hint = zone.querySelector('.logo-zone-hint');
      if (hint) hint.style.display = 'none';
    }
    const removeBtn = document.getElementById('logo-remove-btn');
    if (removeBtn) removeBtn.style.display = '';
  }
}

// ─── CARD & ITEM MANAGEMENT ──────────────────────────────────
function setupCardManagement() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  canvas.querySelectorAll('.card-del-btn, .card-add-btn, .item-del-btn, .item-add-btn').forEach(b => b.remove());
  canvas.querySelectorAll('[data-cards]').forEach(grid => _initCardGrid(grid));
  canvas.querySelectorAll('[data-items]').forEach(container => _initItemList(container));
}

function _initCardGrid(grid) {
  const cardClass = grid.dataset.cards;
  grid.querySelectorAll(':scope > .' + cardClass).forEach(card => {
    if (card.querySelector('.card-del-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'card-del-btn';
    btn.innerHTML = '✕';
    btn.title = 'Kartı Sil';
    btn.onclick = (e) => {
      e.stopPropagation();
      if (grid.querySelectorAll(':scope > .' + cardClass).length <= 1) {
        showToast('En az 1 kart gerekli', 'info'); return;
      }
      card.remove();
      isDirty = true; showAutoSaveIndicator(); pushHistory();
    };
    card.appendChild(btn);
  });
  if (!grid.querySelector('.card-add-btn')) {
    const addBtn = document.createElement('button');
    addBtn.className = 'card-add-btn';
    addBtn.innerHTML = '+ Kart Ekle';
    addBtn.onclick = () => _addCard(grid, cardClass);
    grid.appendChild(addBtn);
  }
}

function _addCard(grid, cardClass) {
  const first = grid.querySelector(':scope > .' + cardClass);
  if (!first) return;
  const clone = first.cloneNode(true);
  clone.querySelectorAll('.card-del-btn').forEach(b => b.remove());
  const ts = Date.now().toString(36);
  clone.querySelectorAll('[data-key]').forEach((el, i) => { el.dataset.key = el.dataset.key + '_' + ts + i; });
  const addBtn = grid.querySelector('.card-add-btn');
  grid.insertBefore(clone, addBtn);
  _initCardGrid(grid);
  setupEditable();
  setupImageZones();
  isDirty = true; showAutoSaveIndicator(); pushHistory();
  showToast('Kart eklendi', 'success');
}

function _initItemList(container) {
  const itemClass = container.dataset.items;
  container.querySelectorAll(':scope > .' + itemClass).forEach(item => {
    if (item.querySelector('.item-del-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'item-del-btn';
    btn.innerHTML = '✕';
    btn.title = 'Sil';
    btn.onclick = (e) => {
      e.stopPropagation();
      if (container.querySelectorAll(':scope > .' + itemClass).length <= 1) {
        showToast('En az 1 öğe gerekli', 'info'); return;
      }
      item.remove();
      isDirty = true; showAutoSaveIndicator(); pushHistory();
    };
    item.appendChild(btn);
  });
  if (!container.querySelector('.item-add-btn')) {
    const addBtn = document.createElement('button');
    addBtn.className = 'item-add-btn';
    addBtn.innerHTML = '+ Öğe Ekle';
    addBtn.onclick = () => _addItem(container, itemClass);
    container.appendChild(addBtn);
  }
}

function _addItem(container, itemClass) {
  const first = container.querySelector(':scope > .' + itemClass);
  if (!first) return;
  const clone = first.cloneNode(true);
  clone.querySelectorAll('.item-del-btn').forEach(b => b.remove());
  const ts = Date.now().toString(36);
  clone.querySelectorAll('[data-key]').forEach((el, i) => { el.dataset.key = el.dataset.key + '_' + ts + i; });
  const addBtn = container.querySelector('.item-add-btn');
  container.insertBefore(clone, addBtn);
  _initItemList(container);
  setupEditable();
  isDirty = true; showAutoSaveIndicator(); pushHistory();
}

// ─── EDITABLE TEXT ───────────────────────────────────────────
function setupEditable() {
  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('.editable').forEach(el => {
    if (el.dataset.editableReady) return; // duplicate listener koruması
    el.dataset.editableReady = '1';
    el.setAttribute('title', 'Çift tıklayarak düzenleyin');

    el.addEventListener('click', function(e) {
      if (window._isDraggingElement) return;
      e.stopPropagation();
      if (this.tagName === 'A') e.preventDefault(); // href navigasyonunu engelle
      if (this.getAttribute('contenteditable') === 'true') return;
      this.setAttribute('contenteditable', 'true');
      this.focus();
      _lastActiveEditable = this;
      // Sidebar align buttons'ı güncelle
      const curAlign = this.style.textAlign || window.getComputedStyle(this).textAlign || 'center';
      _updateSbAlignBtns(curAlign === 'start' ? 'left' : curAlign);
      showFormatBar(this);

      const range = document.createRange();
      range.selectNodeContents(this);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    el.addEventListener('blur', function() {
      const self = this;
      // Format bar'a tıklandıysa blur'u ertele
      setTimeout(() => {
        if (_formatBarEl && _formatBarEl.contains(document.activeElement)) return;
        self.setAttribute('contenteditable', 'false');
        const key = self.dataset.key;
        if (key) {
          if (!siteData.content[key]) siteData.content[key] = { tr: '', en: '' };
          siteData.content[key][currentLang] = self.innerHTML;
        }
        // Kart içi elemanlar boşaldıysa gizle (yıldız vb. silinebilsin)
        if (self.closest('.custom-card, .custom-btn-wrap')) {
          const raw = self.innerHTML.replace(/<br\s*\/?>/gi, '').replace(/&nbsp;/gi, '').trim();
          self.classList.toggle('editable-empty', !raw);
        }
        isDirty = true;
        showAutoSaveIndicator();
        pushHistory();
        hideFormatBar();
      }, 120);
    });

    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.blur();
      }
      if (e.key === 'Escape') {
        this.blur();
      }
    });
  });
}

// ─── LANGUAGE TOGGLE ─────────────────────────────────────────
function toggleLanguage() {
  currentLang = currentLang === 'tr' ? 'en' : 'tr';
  updateLangUI();

  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (siteData.content[key] && siteData.content[key][currentLang]) {
      el.innerHTML = siteData.content[key][currentLang];
    } else {
      const fallback = el.dataset[currentLang];
      if (fallback) el.innerHTML = fallback;
    }
  });

  siteData.lang = currentLang;
  isDirty = true;
}

function updateLangUI() {
  const lang = currentLang;

  // Sync to localStorage so the dashboard reads the same preference
  localStorage.setItem('mif_lang', lang);

  // Canvas template language toggle labels (e.g. "EN" / "TR")
  document.querySelectorAll('#lang-label').forEach(el => {
    el.textContent = lang === 'tr' ? 'EN' : 'TR';
  });

  // Top-bar and sidebar language buttons
  const topBtn = document.getElementById('top-lang-btn');
  if (topBtn) topBtn.textContent = lang === 'tr' ? '🌐 Türkçe → English' : '🌐 English → Türkçe';
  const sbBtn = document.getElementById('sb-lang-btn');
  if (sbBtn) sbBtn.textContent = lang === 'tr' ? '🌐 Türkçe → English' : '🌐 English → Türkçe';

  // Update all static UI elements that carry data-tr / data-en
  document.querySelectorAll('[data-tr]').forEach(el => {
    if (el.closest('#canvas')) return; // canvas content handled separately
    const val = el.getAttribute('data-' + lang);
    if (val) el.innerHTML = val;
  });

  // Update site-name-input placeholder
  const nameInput = document.getElementById('site-name-input');
  if (nameInput) nameInput.placeholder = lang === 'tr' ? 'Site adı...' : 'Site name...';

  // Complex info-box HTML content (contains markup tags)
  const infoContent = {
    'sb-info-wa': {
      tr: '<strong>Nasıl girilir?</strong> Ülke kodu ile birlikte, boşluksuz:<br><code style="color:#A78BFA">905301234567</code>',
      en: '<strong>How to enter?</strong> Country code included, no spaces:<br><code style="color:#A78BFA">905301234567</code>'
    },
    'sb-info-faq': {
      tr: '<strong>Nasıl çalışır?</strong> Footer\'ın üstüne SSS bölümü eklenir. Sorular ve cevaplar doğrudan tıklayarak düzenlenir. Yeni soru eklenebilir.',
      en: '<strong>How it works?</strong> An FAQ section is added above the footer. Questions and answers can be edited by clicking directly on them.'
    },
    'sb-tip-move': {
      tr: '<strong>⠿ Bölüm Taşıma</strong> Sayfadaki bölümlerin üzerine gelince çıkan <strong>"Taşı"</strong> butonunu sürükleyerek sıralarını değiştirin.',
      en: '<strong>⠿ Section Reordering</strong> Drag the <strong>"Move"</strong> handle that appears when hovering over a section to reorder it.'
    },
    'sb-tip-delete': {
      tr: '<strong>✕ Öğe Silme</strong> Eklenen kartların ve butonların üzerine gelince <strong>Sil</strong> butonu çıkar.',
      en: '<strong>✕ Delete Element</strong> Hover over added cards and buttons to reveal the <strong>Delete</strong> button.'
    },
    'info-text-edit': {
      tr: '<strong>📝 Metin Düzenleme</strong> Sitedeki herhangi bir metne tıklayarak düzenleyebilirsiniz. Düzenleme bitince <strong>Enter</strong> veya dışarıya tıklayın.',
      en: '<strong>📝 Text Editing</strong> Click any text on the site to edit it. Press <strong>Enter</strong> or click outside when done.'
    },
    'info-lang': {
      tr: '<strong>🌐 TR / EN Dil Desteği</strong> Üst barda "Türkçe → English" butonuyla dil geçişi yapabilirsiniz. Her dilde ayrı metin girebilirsiniz.',
      en: '<strong>🌐 TR / EN Language</strong> Use the "Türkçe → English" button in the top bar to switch languages. You can enter separate text for each language.'
    },
    'info-color': {
      tr: '<strong>🎨 Renk Teması</strong> "Tasarım" sekmesinden hazır temalar veya özel renk seçebilirsiniz. Değişiklikler anlık uygulanır.',
      en: '<strong>🎨 Color Theme</strong> Choose from presets or set custom colors in the "Design" tab. Changes apply instantly.'
    },
    'info-zip': {
      tr: '<strong>⬇ ZIP İndir</strong> "ZIP İndir" ile <code style="color:#A78BFA">index.html</code>, <code style="color:#A78BFA">css/style.css</code> ve <code style="color:#A78BFA">js/site.js</code> dosyalarını içeren hazır bir klasör iner.',
      en: '<strong>⬇ ZIP Download</strong> Creates a ready-to-use folder with <code style="color:#A78BFA">index.html</code>, <code style="color:#A78BFA">css/style.css</code> and <code style="color:#A78BFA">js/site.js</code>. Upload all files to hosting to publish.'
    },
    'info-save': {
      tr: '<strong>💾 Kayıt Sistemi</strong> Değişiklikler 3 saniye sonra otomatik kaydedilir. "Kaydet" butonu ile de manuel kaydedebilirsiniz. Tüm siteler tarayıcıda saklanır.',
      en: '<strong>💾 Save System</strong> Changes auto-save after 3 seconds of inactivity. You can also save manually with the "Save" button. All sites are stored in your browser.'
    },
    'info-screen': {
      tr: '<strong>📐 Ekran Boyutu</strong> Üstteki seçeneklerle masaüstü / tablet / mobil görünümünü önizleyebilirsiniz.',
      en: '<strong>📐 Screen Size</strong> Preview desktop / tablet / mobile layouts using the size buttons at the top.'
    }
  };

  Object.entries(infoContent).forEach(([id, texts]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = texts[lang] || texts.tr;
  });
}

// ─── GRADIENT ─────────────────────────────────────────────────
const _grad = { target: 'hero', c1: '#7C3AED', c2: '#EC4899', angle: 90 };

function _gradSetTarget(btn) {
  document.querySelectorAll('.grad-target-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _grad.target = btn.dataset.target;
  const saved = siteData.gradients && siteData.gradients[_grad.target];
  if (saved) {
    _grad.c1 = saved.c1; _grad.c2 = saved.c2; _grad.angle = saved.angle;
    const c1 = document.getElementById('grad-c1');
    const c2 = document.getElementById('grad-c2');
    if (c1) { c1.value = saved.c1; }
    const h1 = document.getElementById('grad-c1-hex'); if (h1) h1.value = saved.c1;
    if (c2) { c2.value = saved.c2; }
    const h2 = document.getElementById('grad-c2-hex'); if (h2) h2.value = saved.c2;
    _syncAngleInputs(saved.angle);
    _refreshGradPreview();
  }
}

function _onGradAngleInput(val) {
  const n = Math.max(0, Math.min(359, parseInt(val) || 0));
  _grad.angle = n;
  _syncAngleInputs(n);
  _refreshGradPreview();
}

function _syncAngleInputs(n) {
  const r = document.getElementById('grad-angle-range');
  const num = document.getElementById('grad-angle-num');
  if (r) r.value = n;
  if (num) num.value = n;
}

function _onGradInput() {
  const c1 = document.getElementById('grad-c1');
  const c2 = document.getElementById('grad-c2');
  if (c1) {
    _grad.c1 = c1.value;
    const h1 = document.getElementById('grad-c1-hex'); if (h1) h1.value = c1.value;
  }
  if (c2) {
    _grad.c2 = c2.value;
    const h2 = document.getElementById('grad-c2-hex'); if (h2) h2.value = c2.value;
  }
  _refreshGradPreview();
}

function _onGradHexInput(colorId, text) {
  const t = text.trim();
  let resolved = null;
  if (/^#[0-9a-fA-F]{6}$/.test(t)) {
    resolved = t;
  } else if (/^[0-9a-fA-F]{6}$/.test(t)) {
    resolved = '#' + t;
  } else {
    const m = t.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (m) resolved = '#' + [m[1],m[2],m[3]].map(v => parseInt(v).toString(16).padStart(2,'0')).join('');
  }
  if (!resolved) return;
  const picker = document.getElementById('grad-' + colorId);
  if (picker) picker.value = resolved;
  if (colorId === 'c1') _grad.c1 = resolved;
  else _grad.c2 = resolved;
  _refreshGradPreview();
}

function _refreshGradPreview() {
  const strip = document.getElementById('grad-preview-strip');
  if (strip) strip.style.background = `linear-gradient(${_grad.angle}deg, ${_grad.c1}, ${_grad.c2})`;
}

function _gradTargetCSS(target, gradient, prefix) {
  const p = (prefix === undefined ? '#canvas ' : prefix);
  if (target === 'hero') {
    return [
      `${p}[class*="-hero-bg"]`,
      `${p}.sv-hero`,
      `${p}.ec-hero`,
      `${p}.md-hero`
    ].join(', ') + ` { background: ${gradient} !important; background-size: 100% 100% !important; }`;
  }
  if (target === 'buttons') {
    return [
      `${p}[class*="-btn-form"]`,
      `${p}[class*="-btn-send"]`,
      `${p}[class*="-cta-btn"]`,
      `${p}[class*="-btn-primary"]`,
      `${p}.cus-sec-btn`,
      `${p}.custom-btn`
    ].join(', ') + ` { background: ${gradient} !important; }`;
  }
  if (target === 'page') {
    return `${p === '#canvas ' ? '#canvas' : 'body'} { background: ${gradient} !important; }`;
  }
  return '';
}

function _applyAllGradients() {
  let styleEl = document.getElementById('custom-gradient-css');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'custom-gradient-css';
    document.head.appendChild(styleEl);
  }
  if (!siteData.gradients || !Object.keys(siteData.gradients).length) {
    styleEl.textContent = '';
    return;
  }
  styleEl.textContent = Object.entries(siteData.gradients).map(([target, g]) =>
    _gradTargetCSS(target, `linear-gradient(${g.angle}deg, ${g.c1}, ${g.c2})`)
  ).join('\n');
}

function applyGradient() {
  if (!siteData.gradients) siteData.gradients = {};
  siteData.gradients[_grad.target] = { c1: _grad.c1, c2: _grad.c2, angle: _grad.angle };
  _applyAllGradients();
  isDirty = true;
  showAutoSaveIndicator();
  clearTimeout(window._gradHistoryTimer);
  window._gradHistoryTimer = setTimeout(pushHistory, 600);
  showToast('🎨 Gradient uygulandı!', 'success');
}

function removeGradient() {
  if (!siteData.gradients || !siteData.gradients[_grad.target]) {
    showToast('Bu hedef için gradient yok', 'info');
    return;
  }
  delete siteData.gradients[_grad.target];
  _applyAllGradients();
  isDirty = true;
  showAutoSaveIndicator();
  pushHistory();
  showToast('Gradient kaldırıldı', 'info');
}

function restoreGradients(savedData) {
  if (!savedData || !savedData.gradients || !Object.keys(savedData.gradients).length) return;
  siteData.gradients = { ...savedData.gradients };
  _applyAllGradients();
  const [firstTarget, g] = Object.entries(savedData.gradients)[0];
  _grad.target = firstTarget; _grad.c1 = g.c1; _grad.c2 = g.c2; _grad.angle = g.angle;
  const c1 = document.getElementById('grad-c1');
  const c2 = document.getElementById('grad-c2');
  if (c1) c1.value = g.c1;
  const h1 = document.getElementById('grad-c1-hex'); if (h1) h1.value = g.c1;
  if (c2) c2.value = g.c2;
  const h2 = document.getElementById('grad-c2-hex'); if (h2) h2.value = g.c2;
  document.querySelectorAll('.grad-target-btn').forEach(b => b.classList.toggle('active', b.dataset.target === firstTarget));
  _syncAngleInputs(g.angle);
  _refreshGradPreview();
}

// ─── COLORS ──────────────────────────────────────────────────
function applyColors(colors) {
  const canvas = document.getElementById('canvas');
  Object.entries(colors).forEach(([key, val]) => {
    canvas.style.setProperty('--' + key, val);
    document.documentElement.style.setProperty('--' + key, val);
  });
  siteData.colors = { ...siteData.colors, ...colors };
}

function updateColorInputs(colors) {
  Object.entries(colors).forEach(([key, val]) => {
    const inp = document.getElementById('color-' + key);
    if (inp) inp.value = val;
  });
}

function onColorChange(key, value) {
  const colors = { ...siteData.colors, [key]: value };
  applyColors(colors);
  isDirty = true;
  clearTimeout(window._colorHistoryTimer);
  window._colorHistoryTimer = setTimeout(pushHistory, 800);
}

// ─── FONTS ───────────────────────────────────────────────────
function applyFonts(fonts) {
  let style = document.getElementById('font-css');
  if (!style) {
    style = document.createElement('style');
    style.id = 'font-css';
    document.head.appendChild(style);
  }
  const f = fonts || {};
  const rules = [];
  if (f.heading) {
    rules.push(`#canvas h1,#canvas h2,#canvas [class*="-title"],#canvas [class*="-logo"],#canvas [class*="-hero-title"],#canvas [class*="-heading"] { font-family: ${f.heading} !important; }`);
  }
  if (f.subheading) {
    rules.push(`#canvas h3,#canvas h4,#canvas h5,#canvas [class*="-subtitle"],#canvas [class*="-section-title"],#canvas [class*="-step-title"],#canvas [class*="-card-title"],#canvas [class*="-custom-card-title"] { font-family: ${f.subheading} !important; }`);
  }
  if (f.body) {
    rules.push(`#canvas p,#canvas li,#canvas [class*="-body"],#canvas [class*="-text"],#canvas [class*="-desc"],#canvas [class*="-card-body"],#canvas [class*="-tagline"],#canvas [class*="-info"],#canvas [class*="-price"],#canvas [class*="-tag"] { font-family: ${f.body} !important; }`);
  }
  style.textContent = rules.join('\n');
  siteData.fonts = { ...(siteData.fonts || {}), ...f };
}

function getFontCSS(fonts) {
  const f = fonts || {};
  const rules = [];
  if (f.heading) {
    rules.push(`h1,h2,[class*="-title"],[class*="-logo"],[class*="-hero-title"],[class*="-heading"] { font-family: ${f.heading} !important; }`);
  }
  if (f.subheading) {
    rules.push(`h3,h4,h5,[class*="-subtitle"],[class*="-section-title"],[class*="-step-title"],[class*="-card-title"] { font-family: ${f.subheading} !important; }`);
  }
  if (f.body) {
    rules.push(`p,li,[class*="-body"],[class*="-text"],[class*="-desc"],[class*="-card-body"],[class*="-tagline"],[class*="-info"],[class*="-price"],[class*="-tag"] { font-family: ${f.body} !important; }`);
  }
  return rules.join('\n');
}

function updateFontInputs(fonts) {
  const f = fonts || {};
  const h = document.getElementById('font-heading');
  const s = document.getElementById('font-subheading');
  const b = document.getElementById('font-body');
  if (h) h.value = f.heading || '';
  if (s) s.value = f.subheading || '';
  if (b) b.value = f.body || '';
}

function onFontChange(type, value) {
  if (!siteData.fonts) siteData.fonts = {};
  siteData.fonts[type] = value;
  applyFonts(siteData.fonts);
  isDirty = true;
  showAutoSaveIndicator();
  clearTimeout(window._fontHistoryTimer);
  window._fontHistoryTimer = setTimeout(pushHistory, 800);
}

// ─── LOGO ────────────────────────────────────────────────────
function applyLogo(base64) {
  if (!base64) return;
  const canvas = document.getElementById('canvas');
  const logoText = canvas.querySelector('[data-key="logo"]');
  if (!logoText) return;
  let logoImg = logoText.parentElement.querySelector('.site-logo-img');
  if (!logoImg) {
    logoImg = document.createElement('img');
    logoImg.className = 'site-logo-img';
    logoImg.alt = 'Logo';
    logoText.parentElement.insertBefore(logoImg, logoText);
  }
  logoImg.src = base64;
  logoText.style.display = 'none';
  const removeBtn = document.getElementById('logo-remove-btn');
  if (removeBtn) removeBtn.style.display = '';
}

function removeLogo() {
  const canvas = document.getElementById('canvas');
  const logoText = canvas.querySelector('[data-key="logo"]');
  if (logoText) {
    const logoImg = logoText.parentElement.querySelector('.site-logo-img');
    if (logoImg) logoImg.remove();
    logoText.style.display = '';
  }
  if (siteData.images) delete siteData.images['site-logo'];
  const zone = document.getElementById('logo-upload-zone');
  if (zone) {
    zone.style.backgroundImage = '';
    const hint = zone.querySelector('.logo-zone-hint');
    if (hint) hint.style.display = '';
  }
  const removeBtn = document.getElementById('logo-remove-btn');
  if (removeBtn) removeBtn.style.display = 'none';
  isDirty = true;
  showAutoSaveIndicator();
  pushHistory();
  showToast('Logo kaldırıldı', 'info');
}

function setupLogoUpload() {
  const zone = document.getElementById('logo-upload-zone');
  if (!zone || zone._logoReady) return;
  zone._logoReady = true;
  zone.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (ev) => {
      const file = ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        const dataUrl = loadEv.target.result;
        if (!siteData.images) siteData.images = {};
        siteData.images['site-logo'] = dataUrl;
        applyLogo(dataUrl);
        zone.style.backgroundImage = `url(${dataUrl})`;
        zone.style.backgroundSize = 'contain';
        zone.style.backgroundRepeat = 'no-repeat';
        zone.style.backgroundPosition = 'center';
        const hint = zone.querySelector('.logo-zone-hint');
        if (hint) hint.style.display = 'none';
        isDirty = true;
        showAutoSaveIndicator();
        pushHistory();
        showToast('🖼 Logo yüklendi!', 'success');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

// Color presets
const COLOR_PRESETS = [
  { name: 'Klasik Kırmızı', colors: { primary: '#C0392B', secondary: '#E67E22', bg: '#FFFFFF', text: '#2C3E50', light: '#FDF2E9' } },
  { name: 'Modern Mavi', colors: { primary: '#2563EB', secondary: '#1E40AF', bg: '#FFFFFF', text: '#1F2937', light: '#EFF6FF' } },
  { name: 'Doğa Yeşili', colors: { primary: '#16A34A', secondary: '#15803D', bg: '#FFFFFF', text: '#14532D', light: '#F0FDF4' } },
  { name: 'Lüks Mor', colors: { primary: '#7C3AED', secondary: '#5B21B6', bg: '#FFFFFF', text: '#111827', light: '#F5F3FF' } },
  { name: 'Okyanus', colors: { primary: '#0891B2', secondary: '#0E7490', bg: '#FFFFFF', text: '#164E63', light: '#ECFEFF' } },
  { name: 'Gece Altın', colors: { primary: '#D4AF37', secondary: '#B8972D', bg: '#0F0F0F', text: '#F5F5F5', light: '#1A1A1A' } },
];

// ─── SOCIAL LINKS ─────────────────────────────────────────────
function updateSocialLinks() {
  const platforms = ['whatsapp', 'instagram', 'facebook', 'twitter', 'youtube', 'linkedin'];
  platforms.forEach(p => {
    const inp = document.getElementById('social-' + p);
    if (inp) siteData.social[p] = inp.value.trim();
  });

  restoreSocial(siteData.social);
  isDirty = true;
  pushHistory();
}

function restoreSocial(social) {
  // WhatsApp button
  const waBtn = document.getElementById('wa-btn');
  if (waBtn) {
    if (social.whatsapp) {
      waBtn.href = 'https://wa.me/' + social.whatsapp.replace(/\D/g, '');
      waBtn.style.display = 'flex';
    } else {
      waBtn.style.display = 'flex'; // show anyway in editor
    }
  }

  // Social icon links
  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('[data-social]').forEach(el => {
    const platform = el.dataset.social;
    if (social[platform]) {
      let url = social[platform];
      if (!url.startsWith('http')) {
        if (platform === 'whatsapp') url = 'https://wa.me/' + url.replace(/\D/g, '');
        else if (platform === 'instagram') url = 'https://instagram.com/' + url.replace('@', '');
        else if (platform === 'facebook') url = 'https://facebook.com/' + url;
        else if (platform === 'twitter') url = 'https://twitter.com/' + url.replace('@', '');
        else if (platform === 'youtube') url = 'https://youtube.com/' + url;
        else if (platform === 'linkedin') url = 'https://linkedin.com/company/' + url;
      }
      el.href = url;
      el.style.opacity = '1';
    } else {
      el.href = '#';
      el.style.opacity = '0.4';
    }
  });
}

function updateSocialInputs(social) {
  Object.entries(social).forEach(([key, val]) => {
    const inp = document.getElementById('social-' + key);
    if (inp) inp.value = val;
  });
}

// ─── DELETE DRAFT ────────────────────────────────────────────
function deleteDraft() {
  if (!confirm('Bu taslağı silmek istediğinizden emin misiniz?\nBu işlem geri alınamaz.')) return;
  if (siteData.id) {
    localStorage.removeItem('site_' + siteData.id);
    if (localStorage.getItem('mif_last_site') === siteData.id) {
      localStorage.removeItem('mif_last_site');
    }
    try {
      const idx = JSON.parse(localStorage.getItem('sites_index') || '[]')
        .filter(s => s.id !== siteData.id);
      localStorage.setItem('sites_index', JSON.stringify(idx));
    } catch(e) {}
  }
  window.location.href = 'index.html';
}

// ─── SAVE ────────────────────────────────────────────────────
function saveSite() {
  siteData.name = document.getElementById('site-name-input').value || 'İsimsiz Site';
  siteData.updatedAt = new Date().toISOString();
  if (!siteData.createdAt) siteData.createdAt = siteData.updatedAt;

  // Bölüm sırasını kaydet
  siteData.sectionOrder = getSectionOrder();

  // Özel öğeleri kaydet
  siteData.customItems = getCustomItemsData();

  // SSS durumunu kaydet
  const faqEl = document.getElementById('faq-section');
  siteData.faqEnabled = !!faqEl;
  if (faqEl) siteData.faqItems = getFAQItemsData();

  // Element konumları endDrag tarafından siteData.elementTransforms'a yazılır,
  // burada DOM'dan okumak gereksiz (mobile modda pozisyonlar silinmiş olabilir).

  localStorage.setItem('site_' + siteData.id, JSON.stringify(siteData));
  updateSiteIndex(siteData.id, siteData.name, siteData.template);

  isDirty = false;
  showToast('✅ Site kaydedildi!', 'success');
}

function updateSiteIndex(id, name, template) {
  let index = JSON.parse(localStorage.getItem('sites_index') || '[]');
  const existing = index.findIndex(s => s.id === id);
  const entry = { id, name, template, updatedAt: new Date().toISOString() };
  if (existing >= 0) index[existing] = entry;
  else index.unshift(entry);
  localStorage.setItem('sites_index', JSON.stringify(index));
}

function showAutoSaveIndicator() {
  const el = document.getElementById('save-indicator');
  if (el) {
    el.textContent = '● Kaydedilmemiş değişiklikler';
    el.style.color = '#F59E0B';
  }
  // Auto-save after 3 seconds of inactivity
  clearTimeout(window._autoSaveTimer);
  window._autoSaveTimer = setTimeout(() => {
    saveSite();
    if (el) {
      el.textContent = '✓ Otomatik kaydedildi';
      el.style.color = '#10B981';
    }
  }, 3000);
}

// ─── RESTORE CONTENT ─────────────────────────────────────────
function restoreContent(content, lang) {
  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (content[key] && content[key][lang]) {
      el.innerHTML = content[key][lang];
    }
  });
}

// ─── EXPORT (ZIP) ────────────────────────────────────────────
function exportSite() {
  const tpl = TEMPLATES[siteData.template];
  if (!tpl) return;

  const canvas    = document.getElementById('canvas');
  const siteName  = (siteData.name || 'site').replace(/[^a-z0-9çğıöşüÇĞİÖŞÜ]/gi, '_').toLowerCase();
  const folder    = siteName + '/';

  // ─── Temiz HTML (editör nitelikleri kaldırılmış) ──────────
  const clone = canvas.cloneNode(true);
  clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
  clone.querySelectorAll('[title="Düzenlemek için tıklayın"]').forEach(el => el.removeAttribute('title'));
  clone.querySelectorAll('.drag-handle, .section-del-btn').forEach(el => el.remove());
  clone.querySelectorAll('.item-controls').forEach(el => el.remove());
  clone.querySelectorAll('.faq-editor-btns').forEach(el => el.remove());
  clone.querySelectorAll('.faq-remove-btn').forEach(el => el.remove());
  clone.querySelectorAll('.gallery-add-btn').forEach(el => el.remove());
  clone.querySelectorAll('.gallery-remove-btn').forEach(el => el.remove());
  const bodyHTML = clone.innerHTML;

  // ─── CSS ─────────────────────────────────────────────────
  const colorVars = Object.entries(siteData.colors)
    .map(([k, v]) => `  --${k}: ${v};`).join('\n');
  // Template'in varsayılan :root bloğunu çıkar, kullanıcı renkleri ile değiştir
  const cleanCss = tpl.css.replace(/:root\s*\{[^}]*\}/g, '');

  const fontCssExport = getFontCSS(siteData.fonts);
  const gradientCssExport = siteData.gradients
    ? Object.entries(siteData.gradients).map(([target, g]) =>
        _gradTargetCSS(target, `linear-gradient(${g.angle}deg, ${g.c1}, ${g.c2})`, '')
      ).join('\n')
    : '';
  const cssContent =
`/* Oluşturan: SiteYapıcı */

/* === Renk Değişkenleri === */
:root {
${colorVars}
}

/* === Şablon Stilleri === */
${cleanCss}

/* === Yazı Tipleri === */
${fontCssExport}

/* === Gradient === */
${gradientCssExport}

/* === Yayın modu (editör stilleri devre dışı) === */
body { container-type: inline-size; }
.editable:hover { outline: none !important; cursor: inherit !important; }
.editable[contenteditable] { outline: none !important; background: transparent !important; }
.img-upload-hint { display: none !important; }
.img-zone { cursor: default !important; }
.site-logo-img { max-height: 44px; width: auto; max-width: 180px; object-fit: contain; }

/* === Özelleştirilmiş Bölüm === */
.cus-section{position:relative;padding:80px 52px;background:var(--bg,#fff);container-type:inline-size;}
.cus-sec-inner{display:flex;align-items:center;gap:52px;max-width:1100px;margin:0 auto;}
.cus-sec-text{flex:1;display:flex;flex-direction:column;gap:20px;}
.cus-sec-h{font-size:clamp(1.5rem,3vw,2.6rem);font-weight:800;color:var(--text,#111827);line-height:1.2;}
.cus-sec-p{font-size:1rem;color:var(--text,#374151);line-height:1.75;opacity:.8;}
.cus-sec-btn{display:inline-flex;align-items:center;padding:13px 30px;background:var(--primary,#7C3AED);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:.9rem;align-self:flex-start;transition:opacity .2s;}
.cus-sec-btn:hover{opacity:.88;}
.cus-sec-img{flex:1;aspect-ratio:4/3;border-radius:16px;background:var(--light,#f5f3ff);min-height:200px;}
@container(max-width:640px){.cus-sec-inner{flex-direction:column;}.cus-section{padding:52px 22px;}.cus-sec-img{width:100%;}}
`;

  // ─── site.js ─────────────────────────────────────────────
  const lang = currentLang;
  const jsContent =
`/* Oluşturan: SiteYapıcı — site.js */
(function () {
  'use strict';

  var currentLang = '${lang}';

  // Dil değiştirme
  function toggleLang() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    document.querySelectorAll('[data-key]').forEach(function (el) {
      var val = el.getAttribute('data-' + currentLang);
      if (val) el.innerHTML = val;
    });
    var lbl = document.getElementById('lang-label');
    if (lbl) lbl.textContent = currentLang === 'tr' ? 'EN' : 'TR';
  }
  window.toggleLang = toggleLang;

  // WhatsApp yardımcıları
  function getWAPhone() {
    var wa = document.getElementById('wa-btn');
    if (wa && wa.href && wa.href.indexOf('wa.me/') > -1) {
      return wa.href.replace(/.*wa\\.me\\//, '').split('?')[0];
    }
    return '';
  }
  function openWA(phone, msg) {
    window.open(
      (phone ? 'https://wa.me/' + phone : 'https://wa.me/') +
      '?text=' + encodeURIComponent(msg),
      '_blank'
    );
  }

  // Restoran — Rezervasyon formu
  window.rtSendWA = function () {
    var phone = getWAPhone();
    var name  = (document.getElementById('rt-res-name') || {}).value || '';
    var tel   = (document.getElementById('rt-res-tel')  || {}).value || '';
    var date  = (document.getElementById('rt-res-date') || {}).value || '';
    var pax   = (document.getElementById('rt-res-pax')  || {}).value || '';
    var note  = (document.getElementById('rt-res-note') || {}).value || '';
    if (!name || !date || !pax) {
      alert('Lütfen adınızı, tarihi ve kişi sayısını girin.');
      return;
    }
    var msg = 'Merhaba, rezervasyon talebim:\\n\\n' +
      '\\uD83D\\uDC64 Ad Soyad: ' + name + '\\n' +
      '\\uD83D\\uDCC5 Tarih: '    + date + '\\n' +
      '\\uD83D\\uDC65 Kişi: '     + pax  +
      (tel  ? '\\n\\uD83D\\uDCDE Telefon: ' + tel  : '') +
      (note ? '\\n\\uD83D\\uDCDD Not: '     + note : '');
    openWA(phone, msg);
  };

  // Hizmet firması — Teklif formu
  window.svSendWA = function () {
    var phone = getWAPhone();
    var name  = (document.getElementById('sv-form-name')  || {}).value || '';
    var tel   = (document.getElementById('sv-form-tel')   || {}).value || '';
    var email = (document.getElementById('sv-form-email') || {}).value || '';
    var msg   = (document.getElementById('sv-form-msg')   || {}).value || '';
    if (!name || !msg) {
      alert('Lütfen adınızı ve mesajınızı girin.');
      return;
    }
    var text = 'Merhaba, teklif talebim:\\n\\n' +
      '\\uD83D\\uDC64 Ad Soyad: ' + name +
      (tel   ? '\\n\\uD83D\\uDCDE Telefon: ' + tel   : '') +
      (email ? '\\n\\u2709\\uFE0F E-posta: '  + email : '') +
      '\\n\\n\\uD83D\\uDCDD ' + msg;
    openWA(phone, text);
  };

  // İşletme — İletişim formu
  window.bzSendWA = function () {
    var phone = getWAPhone();
    var name  = (document.getElementById('bz-form-name')  || {}).value || '';
    var email = (document.getElementById('bz-form-email') || {}).value || '';
    var tel   = (document.getElementById('bz-form-tel')   || {}).value || '';
    var msg   = (document.getElementById('bz-form-msg')   || {}).value || '';
    if (!name || !msg) {
      alert('Lütfen adınızı ve mesajınızı girin.');
      return;
    }
    var text = 'Merhaba, iletişim talebim:\\n\\n' +
      '\\uD83D\\uDC64 Ad Soyad: ' + name +
      (tel   ? '\\n\\uD83D\\uDCDE Telefon: ' + tel   : '') +
      (email ? '\\n\\u2709\\uFE0F E-posta: '  + email : '') +
      '\\n\\n\\uD83D\\uDCDD ' + msg;
    openWA(phone, text);
  };

  // Generic WA (yeni şablonlar)
  window.genericSendWA = function(prefix) {
    var phone = getWAPhone();
    var name  = (document.getElementById(prefix + '-form-name') || {}).value || '';
    var tel   = (document.getElementById(prefix + '-form-tel')  || {}).value || '';
    var msg   = (document.getElementById(prefix + '-form-msg')  || {}).value || '';
    if (!name) { alert('Lütfen adınızı girin.'); return; }
    var text = 'Merhaba, iletişim talebim:\\n\\n👤 Ad: ' + name +
      (tel ? '\\n📞 Tel: ' + tel : '') +
      (msg ? '\\n📝 ' + msg : '');
    openWA(phone, text);
  };

})();
`;

  // ─── index.html ───────────────────────────────────────────
  const htmlContent =
`<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteData.name}</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
${bodyHTML}
<script src="js/site.js"><\/script>
</body>
</html>`;

  // ─── Kullanım kılavuzu ────────────────────────────────────
  const readmeContent =
`SİTENİZİ NASIL KULLANIRSINIZ
================================

BİLGİSAYARDA AÇMAK İÇİN:
  1. Bu ZIP dosyasını açın / çıkartın
  2. "${siteName}" klasörüne girin
  3. "index.html" dosyasına çift tıklayın
  4. Siteniz tarayıcınızda açılır

YAYINLAMAK (HOSTING) İÇİN:
  "${siteName}" klasörünün İÇİNDEKİ tüm
  dosya ve klasörleri hosting panelinize
  (cPanel, FTP vb.) yükleyin:

    index.html
    css/
      style.css
    js/
      site.js

  index.html'i kök dizine yükleyin.

DOSYA YAPISI:
  index.html   → Ana sayfa
  css/         → Stiller (renkler, düzen)
  js/          → Dil geçişi + WhatsApp formu

Oluşturan: SiteYapıcı
`;

  // ─── ZIP oluştur ve indir ────────────────────────────────
  downloadZip(siteName + '.zip', [
    { name: folder + 'index.html',         content: htmlContent   },
    { name: folder + 'css/style.css',      content: cssContent    },
    { name: folder + 'js/site.js',         content: jsContent     },
    { name: folder + 'NASIL-KULLANILIR.txt', content: readmeContent },
  ]);

  showToast('⬇️ ZIP indirildi! (' + siteName + '.zip)', 'success');
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast toast-' + type + ' toast-show';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('toast-show'), 3000);
}

// ─── SIDEBAR TABS ─────────────────────────────────────────────
function switchTab(tabName) {
  document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.sidebar-tab[data-tab="' + tabName + '"]').classList.add('active');
  document.getElementById('panel-' + tabName).classList.add('active');
}

// ─── PREVIEW ─────────────────────────────────────────────────
function openPreview() {
  const tpl = TEMPLATES[siteData.template];
  const canvas = document.getElementById('canvas');
  const clone = canvas.cloneNode(true);
  clone.querySelectorAll('.drag-handle, .section-del-btn, .item-controls, #format-bar, .gallery-add-btn, .gallery-remove-btn').forEach(el => el.remove());
  clone.querySelectorAll('[data-editable-ready]').forEach(el => {
    el.removeAttribute('data-editable-ready');
    el.removeAttribute('contenteditable');
    el.removeAttribute('title');
    el.removeAttribute('data-drag-id');
  });
  const bodyHTML = clone.innerHTML;
  const colorVars = Object.entries(siteData.colors).map(([k, v]) => `--${k}:${v};`).join('');
  const previewFontCss = getFontCSS(siteData.fonts);

  const waFns = `function _getWAPhone(){var wa=document.getElementById('wa-btn');if(wa&&wa.href&&wa.href.indexOf('wa.me/')>-1){return wa.href.replace(/.*wa\\.me\\//,'').split('?')[0];}return '';}function _openWA(phone,msg){window.open((phone?'https://wa.me/'+phone:'https://wa.me/')+'?text='+encodeURIComponent(msg),'_blank');}window.rtSendWA=function(){var phone=_getWAPhone();var name=(document.getElementById('rt-res-name')||{}).value||'';var tel=(document.getElementById('rt-res-tel')||{}).value||'';var date=(document.getElementById('rt-res-date')||{}).value||'';var pax=(document.getElementById('rt-res-pax')||{}).value||'';var note=(document.getElementById('rt-res-note')||{}).value||'';if(!name||!date||!pax){alert('Lütfen adınızı, tarihi ve kişi sayısını girin.');return;}var msg='Merhaba, rezervasyon talebim:\\n\\n👤 Ad Soyad: '+name+'\\n📅 Tarih: '+date+'\\n👥 Kişi Sayısı: '+pax+(tel?'\\n📞 Telefon: '+tel:'')+(note?'\\n📝 Not: '+note:'');_openWA(phone,msg);};window.svSendWA=function(){var phone=_getWAPhone();var name=(document.getElementById('sv-form-name')||{}).value||'';var tel=(document.getElementById('sv-form-tel')||{}).value||'';var email=(document.getElementById('sv-form-email')||{}).value||'';var msg=(document.getElementById('sv-form-msg')||{}).value||'';if(!name||!msg){alert('Lütfen adınızı ve mesajınızı girin.');return;}var text='Merhaba, teklif talebim:\\n\\n👤 Ad Soyad: '+name+(tel?'\\n📞 Telefon: '+tel:'')+(email?'\\n✉️ E-posta: '+email:'')+' \\n\\n📝 '+msg;_openWA(phone,text);};window.bzSendWA=function(){var phone=_getWAPhone();var name=(document.getElementById('bz-form-name')||{}).value||'';var email=(document.getElementById('bz-form-email')||{}).value||'';var tel=(document.getElementById('bz-form-tel')||{}).value||'';var msg=(document.getElementById('bz-form-msg')||{}).value||'';if(!name||!msg){alert('Lütfen adınızı ve mesajınızı girin.');return;}var text='Merhaba, iletişim talebim:\\n\\n👤 Ad Soyad: '+name+(tel?'\\n📞 Telefon: '+tel:'')+(email?'\\n✉️ E-posta: '+email:'')+' \\n\\n📝 '+msg;_openWA(phone,text);};window.genericSendWA=function(prefix){var phone=_getWAPhone();var name=(document.getElementById(prefix+'-form-name')||{}).value||'';var tel=(document.getElementById(prefix+'-form-tel')||{}).value||'';var msg=(document.getElementById(prefix+'-form-msg')||{}).value||'';if(!name){alert('Lütfen adınızı girin.');return;}var text='Merhaba, iletişim talebim:\\n\\n👤 Ad: '+name+(tel?'\\n📞 Tel: '+tel:'')+(msg?'\\n📝 '+msg:'');_openWA(phone,text);};`;
  const cusSectionCss = `.cus-section{position:relative;padding:80px 52px;background:var(--bg,#fff);container-type:inline-size;}.cus-sec-inner{display:flex;align-items:center;gap:52px;max-width:1100px;margin:0 auto;}.cus-sec-text{flex:1;display:flex;flex-direction:column;gap:20px;}.cus-sec-h{font-size:clamp(1.5rem,3vw,2.6rem);font-weight:800;color:var(--text,#111827);line-height:1.2;}.cus-sec-p{font-size:1rem;color:var(--text,#374151);line-height:1.75;opacity:.8;}.cus-sec-btn{display:inline-flex;align-items:center;padding:13px 30px;background:var(--primary,#7C3AED);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:.9rem;align-self:flex-start;transition:opacity .2s;}.cus-sec-btn:hover{opacity:.88;}.cus-sec-img{flex:1;aspect-ratio:4/3;border-radius:16px;background:var(--light,#f5f3ff);min-height:200px;}@container(max-width:640px){.cus-sec-inner{flex-direction:column;}.cus-section{padding:52px 22px;}.cus-sec-img{width:100%;}}`;
  const html = `<!DOCTYPE html><html lang="${currentLang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Önizleme — ${siteData.name}</title><style>:root{${colorVars}}${tpl.css}${previewFontCss}${cusSectionCss}.site-logo-img{max-height:44px;width:auto;max-width:180px;object-fit:contain;}.editable:hover{outline:none!important;cursor:default!important;}</style></head><body style="container-type:inline-size;">${bodyHTML}<script>var currentLang='${currentLang}';function toggleLang(){currentLang=currentLang==='tr'?'en':'tr';document.querySelectorAll('[data-key]').forEach(function(el){var v=el.dataset[currentLang];if(v)el.innerHTML=v;});var l=document.getElementById('lang-label');if(l)l.textContent=currentLang==='tr'?'EN':'TR';}window.toggleLang=toggleLang;${waFns}<\/script></body></html>`;

  const w = window.open('', '_blank', 'width=1280,height=800');
  w.document.write(html);
  w.document.close();
}

// ─── WHATSAPP FORM HANDLERS ──────────────────────────────────
function _getWAPhone() {
  return (siteData.social && siteData.social.whatsapp || '').replace(/\D/g, '');
}
function _openWA(phone, msg) {
  var url = (phone ? 'https://wa.me/' + phone : 'https://wa.me/') + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
}

window.rtSendWA = function() {
  var phone = _getWAPhone();
  var name  = (document.getElementById('rt-res-name') || {}).value || '';
  var tel   = (document.getElementById('rt-res-tel')  || {}).value || '';
  var date  = (document.getElementById('rt-res-date') || {}).value || '';
  var pax   = (document.getElementById('rt-res-pax')  || {}).value || '';
  var note  = (document.getElementById('rt-res-note') || {}).value || '';
  if (!name || !date || !pax) { showToast('Lütfen adınızı, tarihi ve kişi sayısını girin.', 'error'); return; }
  var msg = 'Merhaba, rezervasyon talebim:\n\n👤 Ad Soyad: ' + name + '\n📅 Tarih: ' + date + '\n👥 Kişi Sayısı: ' + pax + (tel ? '\n📞 Telefon: ' + tel : '') + (note ? '\n📝 Not: ' + note : '');
  _openWA(phone, msg);
};

window.svSendWA = function() {
  var phone = _getWAPhone();
  var name  = (document.getElementById('sv-form-name')  || {}).value || '';
  var tel   = (document.getElementById('sv-form-tel')   || {}).value || '';
  var email = (document.getElementById('sv-form-email') || {}).value || '';
  var msg   = (document.getElementById('sv-form-msg')   || {}).value || '';
  if (!name || !msg) { showToast('Lütfen adınızı ve mesajınızı girin.', 'error'); return; }
  var text = 'Merhaba, teklif talebim:\n\n👤 Ad Soyad: ' + name + (tel ? '\n📞 Telefon: ' + tel : '') + (email ? '\n✉️ E-posta: ' + email : '') + '\n\n📝 ' + msg;
  _openWA(phone, text);
};

window.bzSendWA = function() {
  var phone = _getWAPhone();
  var name  = (document.getElementById('bz-form-name')  || {}).value || '';
  var email = (document.getElementById('bz-form-email') || {}).value || '';
  var tel   = (document.getElementById('bz-form-tel')   || {}).value || '';
  var msg   = (document.getElementById('bz-form-msg')   || {}).value || '';
  if (!name || !msg) { showToast('Lütfen adınızı ve mesajınızı girin.', 'error'); return; }
  var text = 'Merhaba, iletişim talebim:\n\n👤 Ad Soyad: ' + name + (tel ? '\n📞 Telefon: ' + tel : '') + (email ? '\n✉️ E-posta: ' + email : '') + '\n\n📝 ' + msg;
  _openWA(phone, text);
};

// Generic WA: yeni şablonlar için evrensel iletişim fonksiyonu
window.genericSendWA = function(prefix) {
  var phone = _getWAPhone();
  var name  = (document.getElementById(prefix + '-form-name') || {}).value || '';
  var tel   = (document.getElementById(prefix + '-form-tel')  || {}).value || '';
  var msg   = (document.getElementById(prefix + '-form-msg')  || {}).value || '';
  if (!name) { showToast('Lütfen adınızı girin.', 'error'); return; }
  var text = 'Merhaba, iletişim talebim:\n\n👤 Ad: ' + name +
    (tel ? '\n📞 Tel: ' + tel : '') +
    (msg ? '\n📝 ' + msg : '');
  _openWA(phone, text);
};

// ─── MOBILE SIDEBAR ──────────────────────────────────────────
function toggleMobileSidebar() {
  const sidebar = document.querySelector('.editor-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar.classList.contains('mobile-open')) {
    closeMobileSidebar();
  } else {
    sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('visible');
  }
}

function closeMobileSidebar() {
  const sidebar = document.querySelector('.editor-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (backdrop) backdrop.classList.remove('visible');
}

let _mobileEditOn = true;
function toggleMobileEditMode() {
  _mobileEditOn = !_mobileEditOn;
  const canvas = document.getElementById('canvas');
  const btn = document.getElementById('mobile-edit-toggle');
  if (_mobileEditOn) {
    canvas.classList.remove('edit-locked');
    btn.textContent = '✏️ Düzenleme: Açık';
    btn.classList.remove('edit-off');
  } else {
    canvas.classList.add('edit-locked');
    btn.textContent = '🔒 Düzenleme: Kapalı';
    btn.classList.add('edit-off');
    // Açık panel ve seçimi kapat
    deselectElement();
    const pp = document.getElementById('props-panel');
    if (pp) pp.classList.add('hidden');
  }
}

// ─── SECTION DRAG-TO-REORDER (mouse events) ──────────────────
function setupSectionDrag() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Add handle + delete button to any section that doesn't have one yet
  canvas.querySelectorAll('section').forEach(sec => {
    if (sec.querySelector('.drag-handle')) return;
    sec.style.position = 'relative';

    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.textContent = '⠿ Taşı';
    sec.appendChild(handle);

    const delBtn = document.createElement('button');
    delBtn.className = 'section-del-btn';
    delBtn.textContent = '✕';
    delBtn.title = 'Bu bölümü sil';
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      const secId = sec.id;
      // Bu bölüme işaret eden nav linklerini kaldır
      if (secId) {
        canvas.querySelectorAll('a[href="#' + secId + '"]').forEach(a => {
          const li = a.closest('li');
          if (li) li.remove(); else a.remove();
        });
      }
      sec.remove();
      isDirty = true;
      showAutoSaveIndicator();
      pushHistory();
      showToast('Bölüm silindi', 'info');
    });
    sec.appendChild(delBtn);
  });

  // Global mouse-based drag manager — install only once
  if (window._sectionDragSetup) return;
  window._sectionDragSetup = true;

  let dragSec = null, ghost = null, placeholder = null, offsetY = 0, startX = 0, startY = 0, secDragActive = false;

  document.addEventListener('mousedown', function(e) {
    const handle = e.target.closest('.drag-handle');
    if (!handle) return;
    if (!_mobileEditOn) return;
    const sec = handle.closest('section');
    const cvs = document.getElementById('canvas');
    if (!sec || !cvs || !cvs.contains(sec)) return;

    e.preventDefault();
    dragSec = sec;
    secDragActive = false;
    startX = e.clientX;
    startY = e.clientY;
    const rect = sec.getBoundingClientRect();
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragSec) return;

    // Threshold: ghost sadece 5px hareket sonrası çıkar
    if (!secDragActive) {
      if (Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY) < 5) return;
      secDragActive = true;
      window._sectionDragActive = true;

      const sec = dragSec;
      const rect = sec.getBoundingClientRect();

      placeholder = document.createElement('div');
      placeholder.style.cssText = 'height:4px;background:#A78BFA;border-radius:4px;margin:0;pointer-events:none;';
      sec.after(placeholder);

      ghost = document.createElement('div');
      ghost.style.cssText =
        'position:fixed;pointer-events:none;z-index:9999;border:2px dashed #A78BFA;border-radius:12px;' +
        'background:rgba(124,58,237,.08);backdrop-filter:blur(2px);display:flex;align-items:flex-start;' +
        'justify-content:flex-end;padding:14px;box-sizing:border-box;' +
        'left:' + rect.left + 'px;top:' + rect.top + 'px;' +
        'width:' + rect.width + 'px;height:' + rect.height + 'px;';
      ghost.innerHTML = '<span style="background:#A78BFA;color:#fff;padding:4px 14px;border-radius:20px;font-size:.75rem;font-weight:700;">⠿ Taşınıyor</span>';
      document.body.appendChild(ghost);
      sec.style.opacity = '0.25';
    }

    e.preventDefault();
    ghost.style.top = (e.clientY - offsetY) + 'px';

    const cvs = document.getElementById('canvas');
    const sections = Array.from(cvs.querySelectorAll('section')).filter(s => s !== dragSec);

    let insertBefore = null;
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) { insertBefore = s; break; }
    }

    if (insertBefore) {
      cvs.insertBefore(placeholder, insertBefore);
    } else {
      const footer = cvs.querySelector('footer');
      footer ? cvs.insertBefore(placeholder, footer) : cvs.appendChild(placeholder);
    }
  });

  document.addEventListener('mouseup', function() {
    if (!dragSec) return;
    if (secDragActive && placeholder && ghost) {
      placeholder.replaceWith(dragSec);
      ghost.remove();
      isDirty = true;
      showAutoSaveIndicator();
      pushHistory();
    }
    dragSec.style.opacity = '';
    dragSec = null; ghost = null; placeholder = null;
    secDragActive = false;
    window._sectionDragActive = false;
  });
}

// ─── GRID ITEM DRAG (tüm [data-item-id] öğeleri, tüm gridler) ─
function setupGridItemDrag() {
  if (window._gridDragSetup) return;
  window._gridDragSetup = true;

  let dragEl = null, dragGrid = null, ghost = null, placeholder = null, offsetX = 0, offsetY = 0;

  document.addEventListener('mousedown', function(e) {
    // In freePosMode, setupElementDrag handles [data-item-id] items with absolute positioning
    if (window._freePosMode) return;
    if (e.target.closest('.item-controls')) return;
    if (e.target.closest('.ic-btn')) return;
    if (e.target.classList.contains('img-resize-handle')) return;
    // [data-item-id] olan herhangi bir öğe, herhangi bir gridde
    const item = e.target.closest('[data-item-id]');
    const grid = item && (item.closest('.sec-extras-grid') || item.closest('#custom-items-grid'));
    if (!item || !grid) return;

    dragEl = item;
    dragGrid = grid;
    const rect = item.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    window._gridDragStartX = e.clientX;
    window._gridDragStartY = e.clientY;
    window._gridDragReady = false;
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragEl) return;

    if (!window._gridDragReady) {
      const dx = Math.abs(e.clientX - window._gridDragStartX);
      const dy = Math.abs(e.clientY - window._gridDragStartY);
      if (dx + dy < 6) return;
      window._gridDragReady = true;

      const rect = dragEl.getBoundingClientRect();
      placeholder = document.createElement('div');
      placeholder.style.cssText = 'width:' + rect.width + 'px;height:' + rect.height + 'px;border:2px dashed rgba(167,139,250,.4);border-radius:16px;background:rgba(124,58,237,.06);pointer-events:none;flex:0 0 ' + rect.width + 'px;';
      dragEl.after(placeholder);

      ghost = document.createElement('div');
      ghost.style.cssText =
        'position:fixed;pointer-events:none;z-index:99999;opacity:.75;border-radius:16px;' +
        'width:' + rect.width + 'px;height:' + rect.height + 'px;' +
        'left:' + rect.left + 'px;top:' + rect.top + 'px;' +
        'box-shadow:0 8px 32px rgba(124,58,237,.4);overflow:hidden;transition:none;';
      ghost.appendChild(dragEl.cloneNode(true));
      document.body.appendChild(ghost);
      dragEl.style.opacity = '0.15';
    }

    e.preventDefault();
    ghost.style.left = (e.clientX - offsetX) + 'px';
    ghost.style.top  = (e.clientY - offsetY) + 'px';

    // Grid içindeki diğer öğelere göre placeholder konumunu güncelle
    const siblings = Array.from(dragGrid.querySelectorAll(':scope > [data-item-id]')).filter(i => i !== dragEl);
    let insertBefore = null;
    for (const it of siblings) {
      const r = it.getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) { insertBefore = it; break; }
    }
    if (insertBefore) dragGrid.insertBefore(placeholder, insertBefore);
    else dragGrid.appendChild(placeholder);
  });

  document.addEventListener('mouseup', function() {
    if (!dragEl) return;
    if (window._gridDragReady && placeholder && ghost) {
      placeholder.replaceWith(dragEl);
      ghost.remove();
      isDirty = true;
      showAutoSaveIndicator();
      pushHistory();
    }
    if (dragEl) dragEl.style.opacity = '';
    dragEl = null; dragGrid = null; ghost = null; placeholder = null;
    window._gridDragReady = false;
  });
}

// ─── RESİM BOYUTLANDIRMA (img-resize-handle) ─────────────────
(function setupImgResize() {
  let _resizingImg = null;
  let _resizeStartX = 0;
  let _resizeStartW = 0;

  document.addEventListener('mousedown', function(e) {
    if (!e.target.classList.contains('img-resize-handle')) return;
    const wrap = e.target.closest('.custom-img-wrap');
    if (!wrap) return;
    _resizingImg = wrap;
    _resizeStartX = e.clientX;
    _resizeStartW = wrap.offsetWidth;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', function(e) {
    if (!_resizingImg) return;
    const dx = e.clientX - _resizeStartX;
    const newW = Math.max(120, _resizeStartW + dx);
    _resizingImg.style.width = newW + 'px';
    _resizingImg.style.flex = '0 0 ' + newW + 'px';
  });

  document.addEventListener('mouseup', function() {
    if (_resizingImg) {
      isDirty = true;
      showAutoSaveIndicator();
      pushHistory();
      _resizingImg = null;
    }
  });
})();

function getSectionOrder() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return [];
  return Array.from(canvas.querySelectorAll('section'))
    .map(s => s.id)
    .filter(Boolean);
}

function restoreSectionOrder(order) {
  if (!order || !order.length) return;
  const canvas = document.getElementById('canvas');
  const footer = canvas.querySelector('footer');
  order.forEach(id => {
    const sec = canvas.querySelector('section#' + CSS.escape(id));
    if (!sec) return;
    if (footer) canvas.insertBefore(sec, footer);
    else canvas.appendChild(sec);
  });
}

// ─── YENİ BÖLÜM EKLEME ───────────────────────────────────────
function addCustomSection() {
  const name = prompt('Yeni bölüm adı (nav menüsüne de eklenecek):');
  if (!name || !name.trim()) return;

  const canvas = document.getElementById('canvas');
  const secId = 'csec-' + Date.now();
  const imgKey = 'csec-img-' + Date.now();
  const title = name.trim();

  const sec = document.createElement('section');
  sec.id = secId;
  sec.className = 'cus-section';
  sec.innerHTML =
    '<button class="drag-handle" title="Taşı">⠿</button>' +
    '<div class="item-controls">' +
      '<button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button>' +
    '</div>' +
    '<div class="cus-sec-inner">' +
      '<div class="cus-sec-text">' +
        '<h2 class="cus-sec-h editable" data-key="' + secId + '-h" contenteditable="false">' + title + '</h2>' +
        '<p class="cus-sec-p editable" data-key="' + secId + '-p" contenteditable="false">Bu bölümün açıklamasını buraya yazın. Düzenlemek için tıklayın.</p>' +
        '<a href="#" class="cus-sec-btn editable" data-key="' + secId + '-btn" contenteditable="false" onclick="return false;">Daha Fazla Bilgi</a>' +
      '</div>' +
      '<div class="cus-sec-img img-zone" data-img-key="' + imgKey + '">' +
        '<div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Resim Ekle</div>' +
      '</div>' +
    '</div>';

  const footer = canvas.querySelector('footer');
  if (footer) canvas.insertBefore(sec, footer);
  else canvas.appendChild(sec);

  // Nav'a link ekle
  const navUl = canvas.querySelector('nav ul:first-child, nav > ul, nav > div > ul, nav > div > div > ul');
  if (navUl) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + secId;
    a.className = 'editable';
    a.dataset.key = secId + '-nav';
    a.setAttribute('contenteditable', 'false');
    a.setAttribute('title', 'Düzenlemek için tıklayın');
    a.textContent = title;
    li.appendChild(a);
    navUl.appendChild(li);
  }

  setupEditable();
  setupImageZones();
  setupSectionDrag();

  isDirty = true;
  showAutoSaveIndicator();
  showToast('✦ "' + title + '" bölümü eklendi!', 'success');
  pushHistory();
  closeMobileSidebar();
  sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteFullSection(btn) {
  const sec = btn.closest('section');
  if (!sec) return;
  const secId = sec.id;

  // Nav linkini de sil
  const canvas = document.getElementById('canvas');
  const navLink = canvas.querySelector('a[href="#' + secId + '"]');
  if (navLink) {
    const li = navLink.closest('li');
    if (li) li.remove(); else navLink.remove();
  }

  sec.remove();
  isDirty = true;
  showAutoSaveIndicator();
  pushHistory();
  showToast('Bölüm silindi', 'info');
}

// ─── CUSTOM ITEMS (KART / BUTON) ─────────────────────────────
function _ensureCustomSection() {
  let sec = document.getElementById('custom-section');
  if (!sec) {
    sec = document.createElement('section');
    sec.id = 'custom-section';
    sec.className = 'custom-section';
    sec.innerHTML =
      '<div class="custom-section-title editable" contenteditable="false" data-key="custom-sec-title" data-tr="Öne Çıkanlar" data-en="Highlights" title="Düzenlemek için tıklayın">Öne Çıkanlar</div>' +
      '<div class="custom-items-grid" id="custom-items-grid"></div>';
    const footer = document.getElementById('canvas').querySelector('footer');
    if (footer) footer.parentNode.insertBefore(sec, footer);
    else document.getElementById('canvas').appendChild(sec);
    setupEditable();
    setupSectionDrag();
  }
  return sec;
}

// Mevcut ekleme fonksiyonları artık add-mode'u başlatıyor
function addCustomCard()   { startAddMode('card');   }
function addCustomButton() { startAddMode('button'); }

// ─── ADD MODE (tıklayarak öğe yerleştirme) ───────────────────
let _addMode = null;
const _ADD_LABELS = {
  card:   'Kart eklemek için bir bölümün boş alanına tıklayın',
  button: 'Buton eklemek için bir bölümün boş alanına tıklayın',
  text:   'Metin eklemek için bir bölümün boş alanına tıklayın',
  image:  'Resim eklemek için bir bölümün boş alanına tıklayın',
  icon:   'İkon eklemek için bir bölümün boş alanına tıklayın'
};

// Feather Icons (MIT License) — https://feathericons.com
const ICON_LIBRARY = [
  { id:'home', name:'Ev', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { id:'user', name:'Kişi', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id:'users', name:'Kişiler', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { id:'phone', name:'Telefon', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38C1.63 2.19 2.52 1 3.71 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' },
  { id:'mail', name:'E-posta', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
  { id:'map-pin', name:'Konum', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' },
  { id:'search', name:'Arama', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' },
  { id:'star', name:'Yıldız', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { id:'heart', name:'Kalp', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
  { id:'check', name:'Onay', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' },
  { id:'check-circle', name:'Onay Dairesi', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' },
  { id:'settings', name:'Ayarlar', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
  { id:'bell', name:'Zil', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
  { id:'message-circle', name:'Mesaj', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  { id:'calendar', name:'Takvim', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
  { id:'clock', name:'Saat', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
  { id:'camera', name:'Kamera', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' },
  { id:'shopping-cart', name:'Alışveriş', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
  { id:'shield', name:'Kalkan', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  { id:'eye', name:'Göz', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' },
  { id:'lock', name:'Kilit', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
  { id:'globe', name:'Dünya', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
  { id:'map', name:'Harita', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>' },
  { id:'briefcase', name:'Evrak Çantası', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
  { id:'award', name:'Ödül', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>' },
  { id:'thumbs-up', name:'Beğeni', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>' },
  { id:'zap', name:'Şimşek', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
  { id:'info', name:'Bilgi', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' },
  { id:'help-circle', name:'Yardım', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
  { id:'tag', name:'Etiket', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>' },
  { id:'gift', name:'Hediye', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>' },
  { id:'trending-up', name:'Artış', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' },
  { id:'bar-chart', name:'Grafik', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>' },
  { id:'layers', name:'Katmanlar', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' },
  { id:'link', name:'Bağlantı', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
  { id:'send', name:'Gönder', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' },
  { id:'share-2', name:'Paylaş', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' },
  { id:'download', name:'İndir', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' },
  { id:'package', name:'Paket', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' },
  { id:'book', name:'Kitap', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
  { id:'music', name:'Müzik', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
  { id:'wifi', name:'WiFi', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>' },
  { id:'truck', name:'Teslimat', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' },
  { id:'film', name:'Film', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>' },
  { id:'code', name:'Kod', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
];

function startAddMode(type) {
  _addMode = type;
  document.body.classList.add('add-mode', 'add-mode-' + type);
  closeMobileSidebar();
  showToast('✚ ' + _ADD_LABELS[type] + ' — ESC ile iptal', 'info');

  // Iptal overlay'ini göster
  let overlay = document.getElementById('add-mode-bar');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'add-mode-bar';
    overlay.innerHTML = '<span id="add-mode-label"></span><button onclick="cancelAddMode()">✕ İptal</button>';
    document.body.appendChild(overlay);
  }
  document.getElementById('add-mode-label').textContent = _ADD_LABELS[type];
  overlay.style.display = 'flex';
}

function cancelAddMode() {
  _addMode = null;
  _hoveredGridItem = null;
  document.body.classList.remove('add-mode', 'add-mode-card', 'add-mode-button', 'add-mode-text', 'add-mode-image', 'add-mode-icon');
  _hideAddPlacementOverlay();
  const bar = document.getElementById('add-mode-bar');
  if (bar) bar.style.display = 'none';
}

// ─── YÖN OKLARI OVERLAY ──────────────────────────────────────
let _hoveredGridItem = null;

function _showAddPlacementOverlay(item) {
  let ov = document.getElementById('add-placement-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'add-placement-overlay';
    ov.innerHTML =
      '<button class="add-dir-btn" onclick="_addDirPlace(\'before\')">↑ Üstüne ekle</button>' +
      '<div class="add-dir-label">Nereye eklensin?</div>' +
      '<button class="add-dir-btn" onclick="_addDirPlace(\'after\')">↓ Altına ekle</button>';
    document.body.appendChild(ov);
  }
  const rect = item.getBoundingClientRect();
  ov.style.left = (rect.left + rect.width / 2) + 'px';
  ov.style.top  = (rect.top  + rect.height / 2) + 'px';
  ov.style.display = 'flex';
}

function _hideAddPlacementOverlay() {
  const ov = document.getElementById('add-placement-overlay');
  if (ov) ov.style.display = 'none';
}

function _addDirPlace(dir) {
  if (!_hoveredGridItem || !_addMode) return;
  const item = _hoveredGridItem;
  const grid = item.closest('.sec-extras-grid, #custom-items-grid');
  if (!grid) return;
  const section = grid.closest('section');
  const insertBefore = dir === 'before' ? item : (item.nextElementSibling || null);
  placeItemInSection(section, _addMode, insertBefore, grid);
  cancelAddMode();
}

// Add-mode mousemove: öğelerin üzerinde overlay göster
document.addEventListener('mousemove', function(e) {
  if (!_addMode) return;
  if (e.target.closest('#add-placement-overlay')) return;
  const item = e.target.closest('[data-item-id]');
  const inGrid = item && (item.closest('.sec-extras-grid') || item.closest('#custom-items-grid'));
  if (!inGrid) {
    if (_hoveredGridItem) { _hideAddPlacementOverlay(); _hoveredGridItem = null; }
    return;
  }
  if (item !== _hoveredGridItem) {
    _hoveredGridItem = item;
    _showAddPlacementOverlay(item);
  }
}, { passive: true });

// Add-mode canvas click handler
document.addEventListener('click', function(e) {
  if (!_addMode) return;

  // Sidebar, topbar, add-mode-bar veya yön oklari overlay'ine tıklanmışsa atla
  if (e.target.closest('.editor-sidebar, .editor-topbar, .canvas-toolbar, #add-mode-bar, #add-placement-overlay')) {
    return;
  }

  const section = e.target.closest('#canvas section');
  if (!section) { cancelAddMode(); return; }

  // Mevcut içerik elementine tıklanırsa boş alana yönlendir
  const onContent = e.target.closest(
    'h1,h2,h3,h4,h5,h6,p,span,a,button,img,input,textarea,select,' +
    '.img-zone,.drag-handle,.section-del-btn,.gallery-add-btn,.gallery-remove-btn,' +
    '[data-item-id],.faq-item,.faq-editor-btns'
  );
  if (onContent) {
    showToast('⚠ Öğenin üstüne veya altına eklemek için beliren oklara tıklayın', 'info');
    return;
  }

  e.preventDefault();
  e.stopPropagation();
  placeItemInSection(section, _addMode);
  cancelAddMode();
}, true);

document.addEventListener('keydown', e => { if (e.key === 'Escape' && _addMode) cancelAddMode(); });

function _ensureSectionExtras(section) {
  let grid = section.querySelector('.sec-extras-grid');
  if (!grid) {
    grid = document.createElement('div');
    grid.className = 'sec-extras-grid';
    // Flex section'larda wrap zorla — grid kendi satırına geçsin
    const display = getComputedStyle(section).display;
    if (display === 'flex' || display === 'inline-flex') {
      section.style.flexWrap = 'wrap';
      section.style.alignContent = 'flex-start';
    }
    const before = section.querySelector('.drag-handle');
    if (before) section.insertBefore(grid, before);
    else section.appendChild(grid);
  }
  return grid;
}

// Ortak kontrol butonları HTML oluşturucu
function _itemControls(extra) {
  return '<div class="item-controls">' +
    '<button class="ic-btn grid-move-btn" onclick="moveGridItem(this,-1)" title="Yukarı taşı">↑</button>' +
    '<button class="ic-btn grid-move-btn" onclick="moveGridItem(this,1)" title="Aşağı taşı">↓</button>' +
    (extra || '') +
    '<button class="ic-btn" onclick="_showItemProps(this)" title="Özellikler">⚙</button>' +
    '<button class="ic-btn del" onclick="deleteCustomItem(this)" title="Sil">✕</button>' +
  '</div>';
}

function _showItemProps(btn) {
  if (!_mobileEditOn) return;
  const item = btn.closest('[data-item-id]');
  if (!item) return;
  if (!item.dataset.dragId) item.dataset.dragId = 'drag-' + Date.now();
  selectedEl = item;
  updatePropsPanel(item);
  document.getElementById('props-panel').classList.remove('hidden');
}

function placeItemInSection(section, type, insertBefore, targetGrid) {
  const grid = targetGrid || _ensureSectionExtras(section);
  const id = type + '-' + Date.now();
  let el = document.createElement('div');
  el.dataset.itemId = id;
  el.dataset.type = type;
  el.dataset.sectionId = section.id || '';

  if (type === 'card') {
    el.className = 'custom-card';
    el.innerHTML =
      _itemControls(
        '<button class="ic-btn" onclick="editItemBgColor(this)" title="Arka Plan Rengi">🖼</button>' +
        '<button class="ic-btn" onclick="editItemAccentColor(this)" title="Buton Rengi">🎨</button>'
      ) +
      '<div class="custom-card-icon editable" contenteditable="false" data-key="' + id + '-icon">⭐</div>' +
      '<div class="custom-card-title editable" contenteditable="false" data-key="' + id + '-title">Başlık</div>' +
      '<div class="custom-card-body editable" contenteditable="false" data-key="' + id + '-body">Açıklama metni buraya yazılır.</div>' +
      '<a href="#" class="custom-card-btn editable" contenteditable="false" data-key="' + id + '-btn" onclick="return false;">Daha Fazla</a>';

  } else if (type === 'button') {
    el.className = 'custom-btn-wrap';
    el.innerHTML =
      _itemControls(
        '<button class="ic-btn" onclick="editCustomBtnUrl(this)" title="Link">🔗</button>' +
        '<button class="ic-btn" onclick="editItemColor(this)" title="Renk">🎨</button>'
      ) +
      '<a href="#" class="custom-standalone-btn editable" contenteditable="false" data-key="' + id + '-label" onclick="return false;">Butona Tıkla</a>';

  } else if (type === 'text') {
    el.className = 'custom-text-wrap';
    el.innerHTML =
      _itemControls() +
      '<p class="custom-text-block editable" contenteditable="false" data-key="' + id + '-text">Metni buraya yazın.</p>';

  } else if (type === 'image') {
    el.className = 'custom-img-wrap';
    const imgKey = 'placed-' + Date.now();
    el.dataset.imgRef = imgKey;
    el.innerHTML =
      _itemControls() +
      '<div class="custom-img-block img-zone" data-img-key="' + imgKey + '">' +
        '<div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Resim Ekle</div>' +
      '</div>' +
      '<div class="img-resize-handle" title="Boyutu değiştir">⤡</div>';

  } else if (type === 'icon') {
    el.className = 'custom-icon-wrap';
    const iconSvg = window._selectedIconSvg ||
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    window._selectedIconSvg = null;
    el.innerHTML =
      _itemControls(
        '<button class="ic-btn" onclick="openIconPicker(this)" title="İkon Değiştir">✦</button>'
      ) +
      '<div class="custom-icon-block" data-key="' + id + '-icon">' + iconSvg + '</div>';
  }

  if (insertBefore) {
    grid.insertBefore(el, insertBefore);
  } else {
    grid.appendChild(el);
  }
  _refreshGridMoveButtons(grid);
  setupEditable();
  setupImageZones();
  isDirty = true;
  showAutoSaveIndicator();
  pushHistory();
  showToast('✓ Eklendi!', 'success');
}

function moveGridItem(btn, dir) {
  const item = btn.closest('[data-item-id]');
  if (!item) return;
  const grid = item.closest('.sec-extras-grid, #custom-items-grid');
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll(':scope > [data-item-id]'));
  const idx = items.indexOf(item);
  if (dir === -1 && idx > 0) {
    grid.insertBefore(item, items[idx - 1]);
  } else if (dir === 1 && idx < items.length - 1) {
    grid.insertBefore(item, items[idx + 2] || null);
  }
  _refreshGridMoveButtons(grid);
  isDirty = true;
  showAutoSaveIndicator();
  pushHistory();
}

function _refreshGridMoveButtons(grid) {
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll(':scope > [data-item-id]'));
  items.forEach((item, idx) => {
    const up   = item.querySelector('.ic-btn[onclick*="-1"]');
    const down = item.querySelector('.ic-btn[onclick*=",1"]');
    if (up)   up.disabled   = idx === 0;
    if (down) down.disabled = idx === items.length - 1;
  });
}

function deleteCustomItem(el) {
  const item = el.closest('[data-item-id]');
  if (!item) return;
  // Resimse siteData.images'ten temizle
  const imgZone = item.querySelector('[data-img-key]');
  if (imgZone && siteData.images) delete siteData.images[imgZone.dataset.imgKey];

  item.remove();

  // Boşalan gridi temizle
  const grid = item.closest('.sec-extras-grid, #custom-items-grid');
  if (grid && grid.querySelectorAll('[data-item-id]').length === 0) {
    // sec-extras-grid'i kaldır ama parent section'ı kaldırma
    if (grid.classList.contains('sec-extras-grid')) grid.remove();
    // Eski custom-section: boşsa section'ı kaldır
    else if (grid.id === 'custom-items-grid') {
      const sec = document.getElementById('custom-section');
      if (sec) sec.remove();
    }
  }
  isDirty = true;
  showAutoSaveIndicator();
  pushHistory();
}

function editCustomBtnUrl(el) {
  const wrap = el.closest('[data-item-id]');
  if (!wrap) return;
  const a = wrap.querySelector('a');
  const current = (a && a.getAttribute('href') !== '#') ? a.getAttribute('href') : '';
  const url = prompt('Buton linki (örn: https://siteadi.com):', current);
  if (url !== null && a) a.href = url || '#';
}

function editItemColor(el) {
  const item = el.closest('[data-item-id]');
  if (!item) return;
  const input = document.createElement('input');
  input.type = 'color';
  const cur = item.style.getPropertyValue('--item-color').trim();
  input.value = cur || '#7C3AED';
  input.addEventListener('input', () => { item.style.setProperty('--item-color', input.value); });
  input.addEventListener('change', () => { isDirty = true; showAutoSaveIndicator(); pushHistory(); });
  input.click();
}

function editItemBgColor(el) {
  const item = el.closest('[data-item-id]');
  if (!item) return;
  const input = document.createElement('input');
  input.type = 'color';
  const cur = item.style.getPropertyValue('--card-bg').trim();
  input.value = cur || '#ffffff';
  input.addEventListener('input', () => { item.style.setProperty('--card-bg', input.value); });
  input.addEventListener('change', () => { isDirty = true; showAutoSaveIndicator(); pushHistory(); });
  input.click();
}

function editItemAccentColor(el) {
  const item = el.closest('[data-item-id]');
  if (!item) return;
  const input = document.createElement('input');
  input.type = 'color';
  const cur = item.style.getPropertyValue('--card-accent').trim();
  input.value = cur || '#7C3AED';
  input.addEventListener('input', () => { item.style.setProperty('--card-accent', input.value); });
  input.addEventListener('change', () => { isDirty = true; showAutoSaveIndicator(); pushHistory(); });
  input.click();
}

function _extractItemData(item) {
  const id = item.dataset.itemId;
  const type = item.dataset.type;
  const sectionId = item.dataset.sectionId || item.closest('section')?.id || '';
  const data = { id, type, _sectionId: sectionId };
  item.querySelectorAll('[data-key]').forEach(el => { data[el.dataset.key] = el.innerHTML; });
  const a = item.querySelector('a');
  if (a) data._href = a.getAttribute('href') || '#';
  data._color       = item.style.getPropertyValue('--item-color')    || '';
  data._bgColor     = item.style.getPropertyValue('--card-bg')       || '';
  data._accentColor = item.style.getPropertyValue('--card-accent')   || '';
  if (item.dataset.imgRef) data._imgRef = item.dataset.imgRef;
  if (item.classList.contains('custom-img-wrap') && item.style.width) data._imgWidth = item.style.width;
  return data;
}

function getCustomItemsData() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return [];
  const items = [];
  // Eski custom-items-grid (geriye dönük uyumluluk)
  const oldGrid = document.getElementById('custom-items-grid');
  if (oldGrid) {
    Array.from(oldGrid.children).forEach(item => {
      if (item.dataset.itemId) items.push(_extractItemData(item));
    });
  }
  // Yeni sec-extras-grid (herhangi bir bölüm içinde)
  canvas.querySelectorAll('.sec-extras-grid').forEach(grid => {
    Array.from(grid.children).forEach(item => {
      if (item.dataset.itemId) items.push(_extractItemData(item));
    });
  });
  return items;
}

function restoreCustomItems(items) {
  if (!items || !items.length) return;
  const canvas = document.getElementById('canvas');

  items.forEach(data => {
    const { id, type } = data;
    const sectionId = data._sectionId || 'custom-section';

    // Hedef grid'i bul/oluştur
    let grid;
    if (sectionId === 'custom-section' || !sectionId) {
      _ensureCustomSection();
      grid = document.getElementById('custom-items-grid');
    } else {
      const sec = document.getElementById(sectionId);
      if (!sec) return; // bölüm silindiyse atla
      grid = _ensureSectionExtras(sec);
    }

    const el = document.createElement('div');
    el.dataset.itemId = id;
    el.dataset.type = type;
    el.dataset.sectionId = sectionId;
    if (data._color) el.style.setProperty('--item-color', data._color);
    if (data._bgColor) el.style.setProperty('--card-bg', data._bgColor);
    if (data._accentColor) el.style.setProperty('--card-accent', data._accentColor);

    if (type === 'card') {
      el.className = 'custom-card';
      const iconVal  = data[id + '-icon']  || '⭐';
      const titleVal = data[id + '-title'] || 'Başlık';
      const bodyVal  = data[id + '-body']  || '';
      const btnVal   = data[id + '-btn']   || 'Daha Fazla';
      const href     = data._href || '#';
      el.innerHTML =
        _itemControls(
          '<button class="ic-btn" onclick="editItemBgColor(this)" title="Arka Plan Rengi">🖼</button>' +
          '<button class="ic-btn" onclick="editItemAccentColor(this)" title="Buton Rengi">🎨</button>'
        ) +
        '<div class="custom-card-icon editable" contenteditable="false" data-key="' + id + '-icon">' + iconVal + '</div>' +
        '<div class="custom-card-title editable" contenteditable="false" data-key="' + id + '-title">' + titleVal + '</div>' +
        '<div class="custom-card-body editable" contenteditable="false" data-key="' + id + '-body">' + bodyVal + '</div>' +
        '<a href="' + href + '" class="custom-card-btn editable" contenteditable="false" data-key="' + id + '-btn" onclick="return false;">' + btnVal + '</a>';

    } else if (type === 'button') {
      el.className = 'custom-btn-wrap';
      const labelVal = data[id + '-label'] || 'Butona Tıkla';
      const href     = data._href || '#';
      el.innerHTML =
        _itemControls(
          '<button class="ic-btn" onclick="editCustomBtnUrl(this)" title="Link">🔗</button>' +
          '<button class="ic-btn" onclick="editItemColor(this)" title="Renk">🎨</button>'
        ) +
        '<a href="' + href + '" class="custom-standalone-btn editable" contenteditable="false" data-key="' + id + '-label" onclick="return false;">' + labelVal + '</a>';

    } else if (type === 'text') {
      el.className = 'custom-text-wrap';
      const textVal = data[id + '-text'] || 'Metin';
      el.innerHTML =
        _itemControls() +
        '<p class="custom-text-block editable" contenteditable="false" data-key="' + id + '-text">' + textVal + '</p>';

    } else if (type === 'image') {
      el.className = 'custom-img-wrap';
      const imgKey = data._imgRef || ('placed-' + id);
      el.dataset.imgRef = imgKey;
      if (data._imgWidth) { el.style.width = data._imgWidth; el.style.flex = '0 0 ' + data._imgWidth; }
      el.innerHTML =
        _itemControls() +
        '<div class="custom-img-block img-zone" data-img-key="' + imgKey + '">' +
          '<div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Resim Ekle</div>' +
        '</div>' +
        '<div class="img-resize-handle" title="Boyutu değiştir">⤡</div>';
    }

    if (el.innerHTML) grid.appendChild(el);
  });

  setupEditable();
  setupImageZones();
  setupSectionDrag();
}

// ─── FAQ (Sık Sorulan Sorular) ────────────────────────────────
function toggleFAQ() {
  const existing = document.getElementById('faq-section');
  if (existing) {
    existing.remove();
    const btn = document.getElementById('faq-toggle-btn');
    if (btn) { btn.textContent = '+ Ekle'; btn.classList.remove('removing'); }
    isDirty = true;
    showAutoSaveIndicator();
    showToast('SSS bölümü kaldırıldı', 'info');
    pushHistory();
  } else {
    _buildFAQ([]);
    const btn = document.getElementById('faq-toggle-btn');
    if (btn) { btn.textContent = '✕ Kaldır'; btn.classList.add('removing'); }
    isDirty = true;
    showAutoSaveIndicator();
    showToast('✅ SSS bölümü eklendi!', 'success');
    pushHistory();
    closeMobileSidebar();
  }
}

function _buildFAQ(items) {
  const canvas = document.getElementById('canvas');
  const footer = canvas.querySelector('footer');

  const sec = document.createElement('section');
  sec.id = 'faq-section';
  sec.className = 'faq-section';

  const rows = items.length ? items : [
    { q: 'Sık sorulan soru 1?', a: 'Bu sorunun cevabı buraya yazılır.' },
    { q: 'Sık sorulan soru 2?', a: 'Bu sorunun cevabı buraya yazılır.' },
  ];

  const rowsHTML = rows.map((item, i) =>
    '<div class="faq-item" data-idx="' + i + '">' +
      '<div class="faq-q editable" contenteditable="false" data-key="faq-q-' + i + '" title="Düzenlemek için tıklayın">' + item.q + '</div>' +
      '<div class="faq-a editable" contenteditable="false" data-key="faq-a-' + i + '" title="Düzenlemek için tıklayın">' + item.a + '</div>' +
    '</div>'
  ).join('');

  sec.innerHTML =
    '<div class="faq-remove-btn" title="SSS bölümünü kaldır" onclick="toggleFAQ()">✕</div>' +
    '<div class="faq-con">' +
      '<h2 class="faq-heading editable" contenteditable="false" data-key="faq-heading" data-tr="Sık Sorulan Sorular" data-en="Frequently Asked Questions" title="Düzenlemek için tıklayın">Sık Sorulan Sorular</h2>' +
      '<div class="faq-list" id="faq-list">' + rowsHTML + '</div>' +
      '<div class="faq-editor-btns">' +
        '<button class="faq-add-btn" onclick="addFAQItem()">+ Soru Ekle</button>' +
      '</div>' +
    '</div>';

  if (footer) footer.parentNode.insertBefore(sec, footer);
  else canvas.appendChild(sec);

  // FAQ accordion (canvas içinde)
  sec.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', function() {
      if (this.getAttribute('contenteditable') === 'true') return;
      this.closest('.faq-item').classList.toggle('open');
    });
  });

  setupEditable();
  setupSectionDrag();
}

function addFAQItem() {
  const list = document.getElementById('faq-list');
  if (!list) return;
  const idx = list.children.length;
  const item = document.createElement('div');
  item.className = 'faq-item';
  item.dataset.idx = idx;
  item.innerHTML =
    '<div class="faq-q editable" contenteditable="false" data-key="faq-q-' + idx + '" title="Düzenlemek için tıklayın">Yeni Soru?</div>' +
    '<div class="faq-a editable" contenteditable="false" data-key="faq-a-' + idx + '" title="Düzenlemek için tıklayın">Cevap buraya yazılır.</div>';
  item.querySelector('.faq-q').addEventListener('click', function() {
    if (this.getAttribute('contenteditable') === 'true') return;
    this.closest('.faq-item').classList.toggle('open');
  });
  list.appendChild(item);
  setupEditable();
  isDirty = true;
  showAutoSaveIndicator();
  pushHistory();
}

function getFAQItemsData() {
  const list = document.getElementById('faq-list');
  if (!list) return [];
  return Array.from(list.querySelectorAll('.faq-item')).map(item => ({
    q: (item.querySelector('.faq-q') || {}).innerHTML || '',
    a: (item.querySelector('.faq-a') || {}).innerHTML || '',
  }));
}

// ─── ELEMENT DRAG (position:absolute tabanlı, touch destekli) ─
function setupElementDrag() {
  if (window._elementDragSetup) return;
  window._elementDragSetup = true;

  let target = null, host = null, placeholder = null;
  let startX = 0, startY = 0, origLeft = 0, origTop = 0;
  let lastX = 0, lastY = 0;
  window._isDraggingElement = false;

  function pickTarget(clientX, clientY) {
    if (window._sectionDragActive) return null;
    const pt = document.elementFromPoint(clientX, clientY);
    if (!pt) return null;
    const canvas = document.getElementById('canvas');
    if (!canvas || !canvas.contains(pt)) return null;
    if (pt.closest('.drag-handle,.item-controls,input,textarea,select,#format-bar')) return null;
    // Sidebar-added item containers ([data-item-id]) drag as a whole unit
    const itemContainer = pt.closest('[data-item-id]');
    if (itemContainer) {
      // Don't intercept if an inner editable is currently being typed in
      const innerEditable = pt.closest('.editable');
      if (innerEditable && innerEditable.getAttribute('contenteditable') === 'true') return null;
      return itemContainer;
    }
    const el = pt.closest('#canvas .editable, #canvas a:not(.drag-handle), #canvas img:not(.site-logo-img)');
    if (!el) return null;
    if (['SECTION','FOOTER','NAV'].includes(el.tagName)) return null;
    // Don't intercept elements currently in text-edit mode
    if (el.getAttribute('contenteditable') === 'true') return null;
    return el;
  }

  function startDrag(el, clientX, clientY) {
    // Düzenleme modundaysa hemen çık
    if (el.getAttribute('contenteditable') === 'true') {
      el.setAttribute('contenteditable', 'false');
      el.blur();
      hideFormatBar();
    }
    target = el;
    host = el.closest('section, footer') || el.parentElement;
    startX = clientX; startY = clientY;
    lastX = clientX; lastY = clientY;
    window._isDraggingElement = false;
  }

  function activateDrag() {
    if (window._isDraggingElement) return;
    window._isDraggingElement = true;

    const elemRect = target.getBoundingClientRect();

    // Include CSS margins so siblings don't shift when the dragged element leaves flow
    const _cs = getComputedStyle(target);
    const _mT = parseFloat(_cs.marginTop)    || 0;
    const _mB = parseFloat(_cs.marginBottom) || 0;
    const _mL = parseFloat(_cs.marginLeft)   || 0;
    const _mR = parseFloat(_cs.marginRight)  || 0;

    placeholder = document.createElement('div');
    placeholder.style.cssText =
      'width:' + (elemRect.width + _mL + _mR) + 'px;' +
      'height:' + (elemRect.height + _mT + _mB) + 'px;' +
      'visibility:hidden;flex-shrink:0;pointer-events:none;margin:0;';
    target.parentNode.insertBefore(placeholder, target);

    // Use the nearest already-positioned ancestor as the containing block.
    // If none exists inside the section, make the immediate parent relative.
    let cb = target.offsetParent;
    if (!cb || cb === document.documentElement || cb === document.body) {
      target.parentElement.style.position = 'relative';
      cb = target.parentElement;
    }

    const cbRect = cb.getBoundingClientRect();
    origLeft = elemRect.left - cbRect.left;
    origTop  = elemRect.top  - cbRect.top;

    target.style.position = 'absolute';
    target.style.left = origLeft + 'px';
    target.style.top  = origTop  + 'px';
    target.style.width = elemRect.width + 'px';
    target.style.zIndex = '50';
    target.style.outline = '2px dashed #A78BFA';
    target.style.outlineOffset = '3px';
    target.style.setProperty('transition', 'none', 'important');
    target.setAttribute('contenteditable', 'false');
  }

  function moveDrag(clientX, clientY) {
    lastX = clientX; lastY = clientY;
    const dx = clientX - startX;
    const dy = clientY - startY;
    if (!window._isDraggingElement) {
      if (Math.abs(dx) + Math.abs(dy) < 4) return;
      activateDrag();
    }
    target.style.left = (origLeft + dx) + 'px';
    target.style.top  = (origTop  + dy) + 'px';
    if (window._freePosMode) showSnapGuides(target);
  }

  function endDrag() {
    if (!target) return;

    if (window._isDraggingElement) {
      if (!target.dataset.dragId) target.dataset.dragId = 'drag-' + Date.now();
      // Safety net: freeze this container if it wasn't frozen at mode activation
      // (e.g. elements added to the canvas after free position mode was enabled)
      if (window._freePosMode) _freezeOneContainer(target.parentElement);
      if (placeholder) { placeholder.remove(); placeholder = null; }
      target.style.removeProperty('outline');
      target.style.removeProperty('outline-offset');
      target.style.removeProperty('z-index');  // remove temp drag z-index (50) before saving
      target.style.removeProperty('transition');
      if (!siteData.elementTransforms) siteData.elementTransforms = {};
      if (!siteData.elementTransforms[currentViewport]) siteData.elementTransforms[currentViewport] = {};
      const _prevZ = (siteData.elementTransforms[currentViewport][target.dataset.dragId] || {}).zIndex || 1;
      siteData.elementTransforms[currentViewport][target.dataset.dragId] = {
        left: target.style.left, top: target.style.top, width: target.style.width,
        height: target.style.height || '', zIndex: _prevZ
      };
      isDirty = true;
      showAutoSaveIndicator();
      pushHistory();
      clearSnapGuides();
      const el = target;
      target = null; host = null; placeholder = null;
      window._isDraggingElement = false;
      if (window._freePosMode) {
        if (!el.dataset.itemId) { selectElement(el); positionSelOverlay(el); }
        else deselectElement();
      }
      refreshLayersPanel();
      const block = ev => { ev.preventDefault(); ev.stopImmediatePropagation(); document.removeEventListener('click', block, true); };
      document.addEventListener('click', block, true);
      return;
    } else {
      // Click only — activateDrag was never called, so no drag-applied styles to remove.
      // Keep any existing absolute position from a prior drag.
      if (placeholder) { placeholder.remove(); placeholder = null; }
      target.style.removeProperty('outline');
      target.style.removeProperty('outline-offset');
      target.style.removeProperty('transition');
      if (window._freePosMode) {
        const el = target;
        target = null; host = null; placeholder = null;
        window._isDraggingElement = false;
        deselectElement(); // always clear previous selection first
        if (!el.dataset.itemId) selectElement(el);
        const block = ev => { ev.stopImmediatePropagation(); document.removeEventListener('click', block, true); };
        document.addEventListener('click', block, true);
        return;
      }
    }

    target = null; host = null; placeholder = null;
    window._isDraggingElement = false;
  }

  // Mouse
  document.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return; // sağ/orta tık ile drag başlatma
    if (window._sectionDragActive) return;
    if (!_mobileEditOn) return;
    const el = pickTarget(e.clientX, e.clientY);
    if (el) {
      e.preventDefault(); // tarayıcının link/metin drag'ini engelle
      startDrag(el, e.clientX, e.clientY);
    } else if (window._freePosMode) {
      // Clicked outside any draggable — deselect unless near the selection overlay or in the props panel
      const overlay = document.getElementById('sel-overlay');
      const pp = document.getElementById('props-panel');
      if (pp && pp.contains(e.target)) return;
      if (overlay && !overlay.classList.contains('hidden')) {
        const or = overlay.getBoundingClientRect();
        // Allow 12px slack around the overlay so handle clicks (which extend 6px) are never missed
        if (e.clientX >= or.left - 12 && e.clientX <= or.right + 12 &&
            e.clientY >= or.top - 12 && e.clientY <= or.bottom + 12) return;
      }
      deselectElement();
    }
  });
  document.addEventListener('mousemove', function(e) {
    if (!target) return;
    e.preventDefault();
    moveDrag(e.clientX, e.clientY);
  });
  document.addEventListener('mouseup', function(e) {
    if (e.button !== 0) return; // right-click mouseup must not trigger endDrag
    endDrag();
  });

  // Touch (mobil)
  document.addEventListener('touchstart', function(e) {
    if (window._sectionDragActive) return;
    if (!_mobileEditOn) return;
    const t = e.touches[0];
    const el = pickTarget(t.clientX, t.clientY);
    if (el) startDrag(el, t.clientX, t.clientY);
  }, { passive: false });
  document.addEventListener('touchmove', function(e) {
    if (!target) return;
    e.preventDefault();
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  }, { passive: false });
  document.addEventListener('touchend', endDrag);

  // Double-click to enter text-edit mode (works in both normal and freePosMode)
  document.getElementById('canvas').addEventListener('dblclick', function(e) {
    if (window._sectionDragActive) return;
    const editable = e.target.closest('.editable');
    if (!editable || !this.contains(editable)) return;
    if (editable.getAttribute('contenteditable') === 'true') return;
    if (selectedEl) deselectElement();
    editable.setAttribute('contenteditable', 'true');
    editable.focus();
    _lastActiveEditable = editable;
    const curAlign = editable.style.textAlign || window.getComputedStyle(editable).textAlign || 'center';
    _updateSbAlignBtns(curAlign === 'start' ? 'left' : curAlign);
    showFormatBar(editable);
    const range = document.createRange();
    range.selectNodeContents(editable);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    e.stopPropagation();
    e.preventDefault();
  });
}

function getElementTransforms() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return {};
  const result = {};
  canvas.querySelectorAll('[data-drag-id]').forEach(el => {
    if (el.style.position === 'absolute') {
      result[el.dataset.dragId] = { left: el.style.left, top: el.style.top, width: el.style.width };
    } else if (el.style.transform) {
      result[el.dataset.dragId] = el.style.transform; // legacy uyumluluk
    }
  });
  return result;
}

function restoreElementTransforms(transforms, viewport) {
  if (!transforms) return;
  const canvas = document.getElementById('canvas');
  // Support both legacy flat format and new per-viewport format
  let map = transforms;
  if (viewport && transforms[viewport] && typeof transforms[viewport] === 'object' &&
      !transforms[viewport].left) {
    map = transforms[viewport];
  } else if (viewport && !transforms[viewport]) {
    // No transforms for this viewport — clear any existing
    canvas.querySelectorAll('[data-drag-id]').forEach(el => {
      el.style.removeProperty('position');
      el.style.removeProperty('left');
      el.style.removeProperty('top');
      el.style.removeProperty('width');
    });
    return;
  }
  Object.entries(map).forEach(([id, val]) => {
    const el = canvas.querySelector('[data-drag-id="' + id + '"]');
    if (!el) return;
    if (typeof val === 'object') {
      let cb = el.offsetParent;
      if (!cb || cb === document.documentElement || cb === document.body) {
        el.parentElement.style.position = 'relative';
      }
      el.style.position = 'absolute';
      el.style.left  = val.left  || '';
      el.style.top   = val.top   || '';
      if (val.width)  el.style.width  = val.width;
      if (val.height) el.style.height = val.height;
      if (val.zIndex) el.style.zIndex = val.zIndex;
    } else {
      el.style.transform = val; // legacy string
    }
  });
}

// ─── CANVAS BOYUTU ────────────────────────────────────────────
function setCanvasSize(size, btn) {
  document.querySelectorAll('.canvas-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const canvas = document.getElementById('canvas');
  canvas.className = 'size-' + size;
  currentViewport = size;

  deselectElement();

  // Clear all absolute positions and frozen parent markers
  canvas.querySelectorAll('[data-drag-id]').forEach(el => {
    el.style.removeProperty('position');
    el.style.removeProperty('left');
    el.style.removeProperty('top');
    el.style.removeProperty('width');
    el.style.removeProperty('height');
    el.style.removeProperty('z-index');
    el.style.removeProperty('transform');
  });
  canvas.querySelectorAll('[data-free-pos-frozen]').forEach(el => {
    el.style.removeProperty('min-height');
    el.removeAttribute('data-free-pos-frozen');
  });

  // Restore positions for this viewport
  const transforms = siteData.elementTransforms;
  if (transforms) {
    restoreElementTransforms(transforms, size);
    restoreFrozenParentHeights();
  }
}

// ─── FORMAT BAR (yazı tipi, boyut, renk, hizalama) ──────────
const FONT_OPTIONS = [
  { label: 'Varsayılan', value: '' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Trebuchet MS', value: "'Trebuchet MS', sans-serif" },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Impact', value: 'Impact, sans-serif' },
  { label: 'Palatino', value: 'Palatino, serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
];

let _formatBarEl = null;
let _formatBarTarget = null;
let _lastActiveEditable = null;

function _updateSbAlignBtns(align) {
  ['left','center','right'].forEach(a => {
    const b = document.getElementById('align-sb-' + a);
    if (b) b.classList.toggle('active', a === align);
  });
}

function applySbAlign(align) {
  const target = _formatBarTarget || _lastActiveEditable;
  if (!target) { showToast('Önce bir metne tıklayın', 'info'); return; }
  target.style.textAlign = align;

  const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
  const btnWrap = target.closest('.custom-btn-wrap');
  if (btnWrap) btnWrap.style.justifyContent = justifyMap[align] || 'center';
  const imgWrap = target.closest('.custom-img-wrap');
  if (imgWrap) {
    imgWrap.style.marginLeft  = align === 'right'  ? 'auto' : (align === 'center' ? 'auto' : '0');
    imgWrap.style.marginRight = align === 'left'   ? 'auto' : (align === 'center' ? 'auto' : '0');
  }

  _updateSbAlignBtns(align);
  isDirty = true; showAutoSaveIndicator(); pushHistory();
}

function _rgbToHex(rgb) {
  if (!rgb) return '#000000';
  if (rgb.startsWith('#')) return rgb;
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return '#000000';
  return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
}

function _mkSep() {
  const d = document.createElement('div');
  d.className = 'fmt-sep';
  return d;
}

function showFormatBar(el) {
  hideFormatBar();
  _formatBarTarget = el;

  const bar = document.createElement('div');
  bar.id = 'format-bar';
  bar.className = 'format-bar';

  // ── Yazı Tipi ──────────────────────────────────────────────
  const fontLbl = document.createElement('span');
  fontLbl.className = 'format-bar-label';
  fontLbl.textContent = 'Aa';
  bar.appendChild(fontLbl);

  const sel = document.createElement('select');
  sel.className = 'format-font-select';
  const curFont = el.style.fontFamily || '';
  FONT_OPTIONS.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    if (opt.value) o.style.fontFamily = opt.value;
    if (curFont === opt.value) o.selected = true;
    sel.appendChild(o);
  });
  sel.addEventListener('mousedown', e => e.stopPropagation());
  sel.addEventListener('change', function() {
    if (!_formatBarTarget) return;
    _formatBarTarget.style.fontFamily = this.value;
    isDirty = true;
    showAutoSaveIndicator();
  });
  bar.appendChild(sel);

  bar.appendChild(_mkSep());

  // ── Yazı Boyutu ────────────────────────────────────────────
  const curSize = Math.round(parseFloat(window.getComputedStyle(el).fontSize)) || 16;

  const sizeGrp = document.createElement('div');
  sizeGrp.className = 'fmt-size-grp';

  const decBtn = document.createElement('button');
  decBtn.className = 'fmt-size-btn';
  decBtn.textContent = '−';

  const sizeInp = document.createElement('input');
  sizeInp.type = 'number';
  sizeInp.className = 'fmt-size-inp';
  sizeInp.value = curSize;
  sizeInp.min = '8';
  sizeInp.max = '160';

  const incBtn = document.createElement('button');
  incBtn.className = 'fmt-size-btn';
  incBtn.textContent = '+';

  function applySize(val) {
    if (!_formatBarTarget) return;
    const s = Math.max(8, Math.min(160, parseInt(val) || curSize));
    sizeInp.value = s;
    _formatBarTarget.style.fontSize = s + 'px';
    isDirty = true;
    showAutoSaveIndicator();
  }

  decBtn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); applySize(parseInt(sizeInp.value) - 1); });
  incBtn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); applySize(parseInt(sizeInp.value) + 1); });
  sizeInp.addEventListener('mousedown', e => e.stopPropagation());
  sizeInp.addEventListener('change', () => applySize(sizeInp.value));

  sizeGrp.appendChild(decBtn);
  sizeGrp.appendChild(sizeInp);
  sizeGrp.appendChild(incBtn);
  bar.appendChild(sizeGrp);

  bar.appendChild(_mkSep());

  // ── Yazı Rengi ─────────────────────────────────────────────
  const colorLbl = document.createElement('span');
  colorLbl.className = 'format-bar-label fmt-color-lbl';
  colorLbl.textContent = 'A';

  const colorInp = document.createElement('input');
  colorInp.type = 'color';
  colorInp.className = 'fmt-color-inp';
  colorInp.value = _rgbToHex(window.getComputedStyle(el).color);
  colorInp.addEventListener('mousedown', e => e.stopPropagation());
  colorInp.addEventListener('input', () => {
    if (!_formatBarTarget) return;
    _formatBarTarget.style.color = colorInp.value;
    colorLbl.style.borderBottomColor = colorInp.value;
    isDirty = true;
    showAutoSaveIndicator();
  });
  colorInp.addEventListener('change', () => pushHistory());
  colorLbl.style.borderBottom = '3px solid ' + colorInp.value;

  bar.appendChild(colorLbl);
  bar.appendChild(colorInp);

  bar.appendChild(_mkSep());

  // ── Hizalama ───────────────────────────────────────────────
  const alignGrp = document.createElement('div');
  alignGrp.className = 'fmt-align-grp';
  const curAlign = window.getComputedStyle(el).textAlign || 'start';

  [['⬅', 'left', 'Sol hizala'], ['↔', 'center', 'Ortala'], ['➡', 'right', 'Sağ hizala']].forEach(([icon, align, ttip]) => {
    const btn = document.createElement('button');
    btn.className = 'fmt-align-btn' + (curAlign === align || (align === 'left' && (curAlign === 'start' || curAlign === 'left')) ? ' active' : '');
    btn.textContent = icon;
    btn.title = ttip;
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      if (!_formatBarTarget) return;
      _formatBarTarget.style.textAlign = align;

      // sec-extras-grid içindeki öğelerde konumlandırmayı da uygula
      const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
      const btnWrap = _formatBarTarget.closest('.custom-btn-wrap');
      if (btnWrap) {
        btnWrap.style.justifyContent = justifyMap[align] || 'center';
      }
      const imgWrap = _formatBarTarget.closest('.custom-img-wrap');
      if (imgWrap) {
        if (align === 'left')   { imgWrap.style.marginLeft = '0';    imgWrap.style.marginRight = 'auto'; }
        if (align === 'center') { imgWrap.style.marginLeft = 'auto'; imgWrap.style.marginRight = 'auto'; }
        if (align === 'right')  { imgWrap.style.marginLeft = 'auto'; imgWrap.style.marginRight = '0';    }
      }

      alignGrp.querySelectorAll('.fmt-align-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      isDirty = true;
      showAutoSaveIndicator();
    });
    alignGrp.appendChild(btn);
  });
  bar.appendChild(alignGrp);

  bar.appendChild(_mkSep());

  // ── Arka Plan Rengi ────────────────────────────────────────
  const bgLbl = document.createElement('span');
  bgLbl.className = 'format-bar-label';
  bgLbl.title = 'Arka plan rengi';
  bgLbl.textContent = 'BG';
  bgLbl.style.cssText = 'font-size:.65rem;font-weight:800;letter-spacing:.5px;';

  // Arka plan rengi: önce inline style, sonra parent btn/a'nın inline style'ına bak
  const bgTarget = _getBgTarget(el);
  const rawBg = bgTarget.style.backgroundColor || '';
  const bgInp = document.createElement('input');
  bgInp.type = 'color';
  bgInp.className = 'fmt-color-inp';
  bgInp.value = rawBg ? _rgbToHex(rawBg) : '#ffffff';
  bgInp.title = 'Arka plan rengi';
  bgInp.addEventListener('mousedown', e => e.stopPropagation());
  bgInp.addEventListener('input', () => {
    _getBgTarget(_formatBarTarget).style.backgroundColor = bgInp.value;
    isDirty = true;
    showAutoSaveIndicator();
  });
  bgInp.addEventListener('change', () => pushHistory());

  bar.appendChild(bgLbl);
  bar.appendChild(bgInp);

  bar.appendChild(_mkSep());

  // ── Kapat ──────────────────────────────────────────────────
  const doneBtn = document.createElement('button');
  doneBtn.className = 'fmt-done-btn';
  doneBtn.textContent = '✓';
  doneBtn.title = 'Düzenlemeyi bitir';
  doneBtn.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    exitFormatBar();
  });
  bar.appendChild(doneBtn);

  // ── Sil ────────────────────────────────────────────────────
  const delBtn = document.createElement('button');
  delBtn.className = 'fmt-del-btn';
  delBtn.textContent = '🗑';
  delBtn.title = 'Bu öğeyi sil';
  delBtn.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    if (!_formatBarTarget) return;
    const target = _formatBarTarget;
    hideFormatBar();
    // Nav link: tüm <li>'yi sil
    const li = target.closest('li');
    if (li) { li.remove(); isDirty = true; pushHistory(); return; }
    // Aksi halde elementi kaldır
    target.remove();
    isDirty = true;
    showAutoSaveIndicator();
    pushHistory();
  });
  bar.appendChild(delBtn);

  document.body.appendChild(bar);
  _formatBarEl = bar;
  _positionFormatBar(el);
}

function _getBgTarget(el) {
  if (!el) return el;
  // Span bir butonun veya link'in içindeyse, bg'yi o parent'a uygula
  if (el.tagName === 'SPAN') {
    const parent = el.closest('button, a');
    if (parent) return parent;
  }
  return el;
}

function _positionFormatBar(el) {
  if (!_formatBarEl) return;
  const rect = el.getBoundingClientRect();
  const barW = _formatBarEl.offsetWidth || 380;
  let top = rect.top - 48 - 6 + window.scrollY;
  if (top < 4) top = rect.bottom + 6 + window.scrollY;
  let left = rect.left + window.scrollX;
  if (left + barW > window.innerWidth - 8) left = window.innerWidth - barW - 8;
  if (left < 4) left = 4;
  _formatBarEl.style.top = top + 'px';
  _formatBarEl.style.left = left + 'px';
}

function hideFormatBar() {
  if (_formatBarEl) { _formatBarEl.remove(); _formatBarEl = null; }
  _formatBarTarget = null;
}

function exitFormatBar() {
  const el = _formatBarTarget || _lastActiveEditable;
  if (el) {
    el.setAttribute('contenteditable', 'false');
    el.blur();
    const key = el.dataset.key;
    if (key) {
      if (!siteData.content[key]) siteData.content[key] = { tr: '', en: '' };
      siteData.content[key][currentLang] = el.innerHTML;
    }
    isDirty = true;
    showAutoSaveIndicator();
    pushHistory();
  }
  hideFormatBar();
}

// ─── KLAVYE KISAYOLLARI ───────────────────────────────────────
document.addEventListener('keydown', function(e) {
  const active = document.activeElement;
  if (active && (active.getAttribute('contenteditable') === 'true' ||
      active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
  if (e.ctrlKey && !e.shiftKey && e.key === 'z') { e.preventDefault(); undoHistory(); }
  if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); redoHistory(); }
});

// ─── FREE POSITION MODE ──────────────────────────────────────
// Always active — no toggle. Called on template load.
function toggleFreePositionMode() {
  // No-op: mode is permanently on.
}

// Freeze every direct parent of .editable elements so all siblings are
// position:absolute before the first drag. Called once on template load.
function freezeAllEditableContainers() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Collect unique parents of .editable elements (skip canvas + nav/header/footer)
  const parentsSet = new Set();
  canvas.querySelectorAll('.editable').forEach(el => {
    const p = el.parentElement;
    if (!p || p === canvas || p.id === 'canvas') return;
    // Nav, header, footer use flex/grid — freezing breaks their layout
    if (p.closest('nav, header, footer') ||
        ['NAV', 'HEADER', 'FOOTER'].includes(p.tagName)) return;
    parentsSet.add(p);
  });

  // Sort: process ancestor containers before descendant ones so that
  // when a child container becomes absolute, its rect is still correct.
  const parents = [...parentsSet].sort((a, b) =>
    a.contains(b) ? -1 : b.contains(a) ? 1 : 0
  );

  parents.forEach(parent => {
    // Skip if any ancestor was already frozen in this pass — prevents cascade
    // reflow where freezing sibling containers causes subsequent sibling rects
    // to shift. On-demand freezing (drag start) handles inner containers instead.
    if (parent.parentElement && parent.parentElement.closest('[data-free-pos-frozen]')) return;
    _freezeOneContainer(parent);
  });

  // Freeze nav/header link lists so individual nav items don't reflow when dragged.
  // These are excluded from the main loop above but need their own pass.
  canvas.querySelectorAll('nav ul, header ul').forEach(ul => {
    if (!ul.querySelector('.editable')) return;
    _freezeOneContainer(ul);
  });

  isDirty = true;
  showAutoSaveIndicator();
  refreshLayersPanel();
}

// ─── SELECTION ────────────────────────────────────────────────
function selectElement(el) {
  if (!_mobileEditOn) return;
  if (!el) { deselectElement(); return; }
  if (selectedEl === el) { positionSelOverlay(el); return; }
  deselectElement();
  selectedEl = el;
  if (!el.dataset.dragId) el.dataset.dragId = 'drag-' + Date.now();
  const overlay = document.getElementById('sel-overlay');
  if (overlay) { positionSelOverlay(el); overlay.classList.remove('hidden'); }
  updatePropsPanel(el);
  document.getElementById('props-panel').classList.remove('hidden');
}

function deselectElement() {
  selectedEl = null;
  const overlay = document.getElementById('sel-overlay');
  if (overlay) overlay.classList.add('hidden');
  const pp = document.getElementById('props-panel');
  if (pp) pp.classList.add('hidden');
  clearSnapGuides();
}

function positionSelOverlay(el) {
  const overlay = document.getElementById('sel-overlay');
  if (!overlay || !el) return;
  const r = el.getBoundingClientRect();
  overlay.style.left   = r.left   + 'px';
  overlay.style.top    = r.top    + 'px';
  overlay.style.width  = r.width  + 'px';
  overlay.style.height = r.height + 'px';
}

window.addEventListener('resize', () => { if (selectedEl) positionSelOverlay(selectedEl); });

// ─── RESIZE HANDLES ──────────────────────────────────────────
let _resizing = false, _resizeDir = null;
let _resizeStartX = 0, _resizeStartY = 0;
let _resizeOrigLeft = 0, _resizeOrigTop = 0, _resizeOrigW = 0, _resizeOrigH = 0;

function setupResizeHandles() {
  const overlay = document.getElementById('sel-overlay');
  if (!overlay || overlay._resizeBound) return;
  overlay._resizeBound = true;

  overlay.querySelectorAll('.sel-handle').forEach(handle => {
    handle.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      if (!selectedEl) return;
      _resizing = true;
      _resizeDir = handle.dataset.dir;
      _resizeStartX = e.clientX;
      _resizeStartY = e.clientY;
      // Ensure element is absolutely positioned before resizing
      if (selectedEl.style.position !== 'absolute') {
        const r = selectedEl.getBoundingClientRect();
        const cb = selectedEl.offsetParent || selectedEl.parentElement;
        const pr = cb.getBoundingClientRect();
        selectedEl.parentElement.style.position = 'relative';
        selectedEl.style.position = 'absolute';
        selectedEl.style.left  = (r.left - pr.left) + 'px';
        selectedEl.style.top   = (r.top  - pr.top)  + 'px';
        selectedEl.style.width  = r.width  + 'px';
        selectedEl.style.height = r.height + 'px';
      }
      _resizeOrigLeft = parseFloat(selectedEl.style.left)   || 0;
      _resizeOrigTop  = parseFloat(selectedEl.style.top)    || 0;
      _resizeOrigW    = parseFloat(selectedEl.style.width)  || selectedEl.offsetWidth;
      _resizeOrigH    = parseFloat(selectedEl.style.height) || selectedEl.offsetHeight;
    });
  });

  document.addEventListener('mousemove', function(e) {
    if (!_resizing || !selectedEl) return;
    const dx = e.clientX - _resizeStartX;
    const dy = e.clientY - _resizeStartY;
    const d = _resizeDir;
    let nl = _resizeOrigLeft, nt = _resizeOrigTop;
    let nw = _resizeOrigW,    nh = _resizeOrigH;
    if (d.includes('e')) nw = Math.max(40, _resizeOrigW + dx);
    if (d.includes('s')) nh = Math.max(20, _resizeOrigH + dy);
    if (d.includes('w')) { nw = Math.max(40, _resizeOrigW - dx); nl = _resizeOrigLeft + (_resizeOrigW - nw); }
    if (d.includes('n')) { nh = Math.max(20, _resizeOrigH - dy); nt = _resizeOrigTop  + (_resizeOrigH - nh); }
    selectedEl.style.left   = nl + 'px';
    selectedEl.style.top    = nt + 'px';
    selectedEl.style.width  = nw + 'px';
    selectedEl.style.height = nh + 'px';
    positionSelOverlay(selectedEl);
    showSnapGuides(selectedEl);
    updatePropsPanelXYWH();
  });

  document.addEventListener('mouseup', function() {
    if (!_resizing) return;
    _resizing = false;
    clearSnapGuides();
    if (selectedEl) {
      saveElTransform(selectedEl);
      positionSelOverlay(selectedEl);
      updatePropsPanel(selectedEl);
      isDirty = true;
      showAutoSaveIndicator();
      pushHistory();
      refreshLayersPanel();
    }
  });
}

// ─── SAVE ELEMENT TRANSFORM ──────────────────────────────────
function saveElTransform(el) {
  if (!el || !el.dataset.dragId) return;
  if (!siteData.elementTransforms) siteData.elementTransforms = {};
  if (!siteData.elementTransforms[currentViewport]) siteData.elementTransforms[currentViewport] = {};
  const prev = siteData.elementTransforms[currentViewport][el.dataset.dragId] || {};
  siteData.elementTransforms[currentViewport][el.dataset.dragId] = {
    left:   el.style.left   || '',
    top:    el.style.top    || '',
    width:  el.style.width  || '',
    height: el.style.height || '',
    zIndex: parseInt(el.style.zIndex) || prev.zIndex || 1
  };
}

// ─── FREEZE CONTAINER ────────────────────────────────────────
// Converts all non-absolute children of `parent` to position:absolute
// at their current computed positions. Two-pass to avoid reflow cascade.
function _freezeOneContainer(parent) {
  if (!parent || parent === document.body || parent.id === 'canvas') return;
  if (parent.dataset.freePosFrozen) return; // already done
  // Nav / header / footer root elements are structural — don't freeze them.
  // Descendants inside them (e.g. nav > ul) ARE freezable.
  if (['NAV', 'HEADER', 'FOOTER'].includes(parent.tagName)) return;

  const parentH = parent.offsetHeight;
  const prect   = parent.getBoundingClientRect();

  // Pass 1: collect rects before any style change
  const toFreeze = [...parent.children]
    .filter(child => child.style.position !== 'absolute')
    .map(child => ({ child, r: child.getBoundingClientRect() }));

  if (!toFreeze.length) return;

  // Lock the parent so it doesn't collapse when children leave the flow.
  // Width must also be locked: flex/inline items shrink to 0 when all children
  // become position:absolute, shifting the absolute children's left offsets.
  parent.style.minHeight = parentH + 'px';
  if (prect.width > 0) parent.style.width = prect.width + 'px';
  if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
  parent.dataset.freePosFrozen = '1';

  // Pass 2: apply absolute positions
  toFreeze.forEach(({ child, r }) => {
    if (!child.dataset.dragId) {
      child.dataset.dragId = 'drag-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    }
    child.style.position = 'absolute';
    child.style.left   = (r.left - prect.left) + 'px';
    child.style.top    = (r.top  - prect.top)  + 'px';
    child.style.width  = r.width + 'px';
    child.style.height = r.height + 'px';
    saveElTransform(child);
  });
}

// After restoring transforms, ensure parents of absolute elements have enough height
function restoreFrozenParentHeights() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const parents = new Set();
  canvas.querySelectorAll('[data-drag-id]').forEach(el => {
    if (el.style.position === 'absolute' && el.parentElement && el.parentElement.id !== 'canvas') {
      parents.add(el.parentElement);
    }
  });
  parents.forEach(parent => {
    let maxBottom = 0;
    [...parent.children].forEach(child => {
      if (child.style.position === 'absolute') {
        const b = (parseFloat(child.style.top) || 0) + (parseFloat(child.style.height) || child.offsetHeight || 0);
        if (b > maxBottom) maxBottom = b;
      }
    });
    if (maxBottom > 0) {
      parent.style.minHeight = (maxBottom + 20) + 'px';
      if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
      parent.dataset.freePosFrozen = '1';
    }
  });
}

// ─── SNAP GUIDES ─────────────────────────────────────────────
const SNAP_THR = 8;

function showSnapGuides(el) {
  const svg = document.getElementById('snap-guides');
  if (!svg) return;
  const r = el.getBoundingClientRect();
  const sec = el.closest('section, footer') || el.parentElement;
  const sr = sec.getBoundingClientRect();
  const siblings = [];
  sec.querySelectorAll('[data-drag-id]').forEach(s => { if (s !== el) siblings.push(s.getBoundingClientRect()); });

  const elEdges = { L: r.left, R: r.right, CX: r.left + r.width/2, T: r.top, B: r.bottom, CY: r.top + r.height/2 };
  const refLines = [
    sr.left, sr.right, sr.left + sr.width/2,
    ...siblings.flatMap(s => [s.left, s.right, s.left + s.width/2])
  ];
  const refLineH = [
    sr.top, sr.bottom, sr.top + sr.height/2,
    ...siblings.flatMap(s => [s.top, s.bottom, s.top + s.height/2])
  ];

  const guideV = [], guideH = [];
  refLines.forEach(x => {
    if ([elEdges.L, elEdges.R, elEdges.CX].some(v => Math.abs(v - x) < SNAP_THR)) guideV.push(x);
  });
  refLineH.forEach(y => {
    if ([elEdges.T, elEdges.B, elEdges.CY].some(v => Math.abs(v - y) < SNAP_THR)) guideH.push(y);
  });

  const uniqV = [...new Set(guideV)];
  const uniqH = [...new Set(guideH)];
  if (!uniqV.length && !uniqH.length) { svg.innerHTML = ''; svg.classList.add('hidden'); return; }

  const W = window.innerWidth, H = window.innerHeight;
  svg.classList.remove('hidden');
  svg.innerHTML =
    uniqV.map(x => `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#EF4444" stroke-width="1" stroke-dasharray="4 3" opacity=".85"/>`).join('') +
    uniqH.map(y => `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#EF4444" stroke-width="1" stroke-dasharray="4 3" opacity=".85"/>`).join('');
}

function clearSnapGuides() {
  const svg = document.getElementById('snap-guides');
  if (svg) { svg.innerHTML = ''; svg.classList.add('hidden'); }
}

// ─── PROPERTIES PANEL ────────────────────────────────────────
function updatePropsPanel(el) {
  if (!el) return;
  const cs = window.getComputedStyle(el);
  _setPropVal('pp-x', Math.round(parseFloat(el.style.left)   || 0));
  _setPropVal('pp-y', Math.round(parseFloat(el.style.top)    || 0));
  _setPropVal('pp-w', Math.round(parseFloat(el.style.width)  || el.offsetWidth));
  _setPropVal('pp-h', Math.round(parseFloat(el.style.height) || el.offsetHeight));

  const op = el.style.opacity !== '' ? parseFloat(el.style.opacity) : 1;
  const opVal = Math.round((isNaN(op) ? 1 : op) * 100);
  _setPropVal('pp-opacity', opVal);
  _setPropVal('pp-opacity-r', opVal);

  const br = parseFloat(el.style.borderRadius) || 0;
  _setPropVal('pp-radius', Math.round(br));
  _setPropVal('pp-radius-r', Math.round(br));

  _setPropVal('pp-rotation', Math.round(_getRotation(el)));
  _setPropVal('pp-z', parseInt(el.style.zIndex) || 1);

  const fs = parseFloat(el.style.fontSize || cs.fontSize);
  if (!isNaN(fs)) _setPropVal('pp-fontsize', Math.round(fs));

  const fontFamInp = document.getElementById('pp-fontfamily');
  if (fontFamInp) fontFamInp.value = el.style.fontFamily || '';

  const colorInp = document.getElementById('pp-color');
  if (colorInp && el.style.color) { const h = _cssToHex(el.style.color); if (h) colorInp.value = h; }

  const bgInp = document.getElementById('pp-bg');
  if (bgInp && el.style.backgroundColor && el.style.backgroundColor !== 'transparent') {
    const h = _cssToHex(el.style.backgroundColor); if (h) bgInp.value = h;
  }

  const shad = document.getElementById('pp-shadow');
  if (shad) shad.checked = !!el.style.boxShadow;

  const tagEl = document.getElementById('pp-tag');
  if (tagEl) {
    const cls = (el.className || '').split(' ').filter(c => !['editable','active'].includes(c)).slice(0,2).join('.');
    tagEl.textContent = el.tagName.toLowerCase() + (cls ? '.' + cls : '');
  }
}

function updatePropsPanelXYWH() {
  if (!selectedEl) return;
  _setPropVal('pp-x', Math.round(parseFloat(selectedEl.style.left)   || 0));
  _setPropVal('pp-y', Math.round(parseFloat(selectedEl.style.top)    || 0));
  _setPropVal('pp-w', Math.round(parseFloat(selectedEl.style.width)  || selectedEl.offsetWidth));
  _setPropVal('pp-h', Math.round(parseFloat(selectedEl.style.height) || selectedEl.offsetHeight));
}

function _setPropVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; }

function _getRotation(el) {
  const t = el.style.transform || '';
  const m = t.match(/rotate\(([-\d.]+)deg\)/);
  return m ? parseFloat(m[1]) : 0;
}

function _cssToHex(color) {
  if (!color || color === 'transparent') return null;
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  const m = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  return m ? '#' + [m[1],m[2],m[3]].map(v => parseInt(v).toString(16).padStart(2,'0')).join('') : null;
}

function onPropChange(prop, value) {
  if (!selectedEl) return;
  const n = parseFloat(value);
  switch (prop) {
    case 'x': selectedEl.style.position = 'absolute'; selectedEl.style.left = n + 'px'; break;
    case 'y': selectedEl.style.position = 'absolute'; selectedEl.style.top  = n + 'px'; break;
    case 'w': selectedEl.style.width  = n + 'px'; break;
    case 'h': selectedEl.style.height = n + 'px'; break;
    case 'opacity':   selectedEl.style.opacity = (n / 100).toFixed(2); break;
    case 'radius':    selectedEl.style.borderRadius = n + 'px'; break;
    case 'shadow':    selectedEl.style.boxShadow = value ? '0 4px 20px rgba(0,0,0,.35)' : ''; break;
    case 'fontSize':    selectedEl.style.fontSize = n + 'px'; break;
    case 'fontFamily':  selectedEl.style.fontFamily = value; isDirty = true; showAutoSaveIndicator(); break;
    case 'color':       selectedEl.style.color = value; break;
    case 'bgColor':   selectedEl.style.backgroundColor = value; break;
    case 'rotation': {
      const base = (selectedEl.style.transform || '').replace(/rotate\([^)]+\)/g, '').trim();
      selectedEl.style.transform = (base + ' rotate(' + n + 'deg)').trim();
      break;
    }
    case 'zIndex': selectedEl.style.zIndex = Math.round(n); break;
  }
  positionSelOverlay(selectedEl);
  saveElTransform(selectedEl);
  isDirty = true;
  showAutoSaveIndicator();
  clearTimeout(window._propHistoryTimer);
  window._propHistoryTimer = setTimeout(pushHistory, 600);
}

function onPropReset() {
  if (!selectedEl) return;
  ['position','left','top','width','height','z-index'].forEach(p => selectedEl.style.removeProperty(p));
  if (siteData.elementTransforms && siteData.elementTransforms[currentViewport])
    delete siteData.elementTransforms[currentViewport][selectedEl.dataset.dragId];
  deselectElement();
  isDirty = true; showAutoSaveIndicator(); pushHistory();
  showToast('Konum sıfırlandı', 'info');
}

function onPropDelete() {
  if (!selectedEl) return;
  const el = selectedEl;
  if (el.dataset.itemId) {
    const imgZone = el.querySelector('[data-img-key]');
    if (imgZone && siteData.images) delete siteData.images[imgZone.dataset.imgKey];
    deselectElement();
    el.remove();
    isDirty = true; showAutoSaveIndicator(); pushHistory();
    showToast('Öğe silindi', 'info');
    return;
  }
  if (!confirm('Bu öğe silinsin mi?')) return;
  const id = el.dataset.dragId;
  deselectElement();
  if (id && siteData.elementTransforms) {
    ['desktop','tablet','mobile'].forEach(vp => {
      if (siteData.elementTransforms[vp]) delete siteData.elementTransforms[vp][id];
    });
  }
  el.remove();
  isDirty = true; showAutoSaveIndicator(); pushHistory();
  showToast('Öğe silindi', 'info');
}

function onPropBringFront() {
  if (!selectedEl) return;
  const els = document.querySelectorAll('#canvas [data-drag-id]');
  const maxZ = Math.max(0, ...[...els].map(e => parseInt(e.style.zIndex) || 0));
  selectedEl.style.zIndex = maxZ + 1;
  saveElTransform(selectedEl);
  _setPropVal('pp-z', maxZ + 1);
  isDirty = true; showAutoSaveIndicator(); refreshLayersPanel();
}

function onPropSendBack() {
  if (!selectedEl) return;
  const els = document.querySelectorAll('#canvas [data-drag-id]');
  const minZ = Math.min(1, ...[...els].map(e => parseInt(e.style.zIndex) || 1));
  const newZ = Math.max(0, minZ - 1);
  selectedEl.style.zIndex = newZ;
  saveElTransform(selectedEl);
  _setPropVal('pp-z', newZ);
  isDirty = true; showAutoSaveIndicator(); refreshLayersPanel();
}

// ─── LAYERS PANEL ─────────────────────────────────────────────
function refreshLayersPanel() {
  const list = document.getElementById('layers-list');
  if (!list) return;
  const canvas = document.getElementById('canvas');
  const els = [...canvas.querySelectorAll('[data-drag-id]')];
  if (!els.length) {
    list.innerHTML = '<div class="layers-empty">Henüz konumlandırılmış öğe yok.<br>Bir öğeyi sürükleyin.</div>';
    return;
  }
  els.sort((a, b) => (parseInt(b.style.zIndex) || 0) - (parseInt(a.style.zIndex) || 0));
  list.innerHTML = '';
  els.forEach(el => {
    const row = document.createElement('div');
    row.className = 'layer-row' + (el === selectedEl ? ' active' : '');
    const id = el.dataset.dragId;
    const tag = el.tagName.toLowerCase();
    const cls = (el.className || '').split(' ').filter(c => !['editable','active'].includes(c)).slice(0,2).join('.');
    const label = (cls || tag).substring(0, 22);
    const icon = tag === 'img' ? '🖼' : tag === 'a' ? '🔗' : 'T';
    const z = parseInt(el.style.zIndex) || 0;
    row.innerHTML = `
      <span class="layer-icon">${icon}</span>
      <span class="layer-label" title="${label}">${label}</span>
      <span class="layer-z">z:${z}</span>
      <div class="layer-btns">
        <button class="layer-btn" title="Öne Al" onclick="event.stopPropagation();_layerZ('${id}',1)">▲</button>
        <button class="layer-btn" title="Arkaya Al" onclick="event.stopPropagation();_layerZ('${id}',-1)">▼</button>
        <button class="layer-btn layer-btn-del" title="Sil" onclick="event.stopPropagation();_layerDel('${id}')">✕</button>
      </div>`;
    row.addEventListener('click', () => {
      const target = document.querySelector('[data-drag-id="' + id + '"]');
      if (target) selectElement(target);
    });
    list.appendChild(row);
  });
}

function _layerZ(id, delta) {
  const el = document.querySelector('[data-drag-id="' + id + '"]');
  if (!el) return;
  const cur = parseInt(el.style.zIndex) || 0;
  el.style.zIndex = Math.max(0, cur + delta);
  saveElTransform(el);
  if (el === selectedEl) _setPropVal('pp-z', el.style.zIndex);
  isDirty = true; showAutoSaveIndicator(); refreshLayersPanel();
}

function _layerDel(id) {
  const el = document.querySelector('#canvas [data-drag-id="' + id + '"]');
  if (!el) return;
  if (el === selectedEl) deselectElement();
  if (siteData.elementTransforms) {
    ['desktop','tablet','mobile'].forEach(vp => {
      if (siteData.elementTransforms[vp]) delete siteData.elementTransforms[vp][id];
    });
  }
  el.remove();
  isDirty = true; showAutoSaveIndicator(); pushHistory(); refreshLayersPanel();
}

// Escape to deselect
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && selectedEl) { deselectElement(); }
});

// ═══════════════════════════════════════════════════════════════
// CONTEXT MENU
// ═══════════════════════════════════════════════════════════════
let _ctxTarget = null;   // raw element right-clicked
let _ctxElem   = null;   // best specific element (card, editable, drag-el…)
let _ctxSection = null;  // closest section / nav / footer
let _clipboard = null;   // { type:'section'|'element', html:'', tag:'' }

// Find the most meaningful element to act on for cut/copy/duplicate
function _pickCtxElem(target) {
  if (!target) return null;
  // 1. Free-positioned drag element
  const drag = target.closest('[data-drag-id]');
  if (drag) return drag;
  // 2. Custom card / button wrapper / image wrapper
  const item = target.closest('.custom-card, .custom-btn-wrap, .custom-text-wrap, .custom-img-wrap');
  if (item) return item;
  // 3. Individual editable (p, h1, h2, a, span…) — not the section itself
  const ed = target.closest('.editable');
  if (ed && !['SECTION','NAV','FOOTER','HEADER'].includes(ed.tagName)) return ed;
  // 4. Nothing specific — caller falls back to section
  return null;
}

function _showCtxMenu(x, y, target) {
  const menu = document.getElementById('ctx-menu');
  _ctxTarget  = target;
  _ctxElem    = _pickCtxElem(target);
  _ctxSection = target ? target.closest('#canvas section, #canvas nav, #canvas footer') : null;

  // Label cut/copy/duplicate based on what they will target
  const isElem = !!_ctxElem;
  const suffix  = isElem ? 'Öğeyi' : 'Bölümü';
  menu.querySelector('[data-action="cut"]').firstChild.textContent       = '✂ Kes ' + suffix + ' ';
  menu.querySelector('[data-action="copy"]').firstChild.textContent      = '⧉ Kopyala ' + suffix + ' ';
  menu.querySelector('[data-action="duplicate"]').firstChild.textContent = '⊕ Çoğalt ' + suffix + ' ';

  // Show/hide section-only items
  const inSection = !!_ctxSection;
  menu.querySelectorAll('.ctx-sec-only').forEach(el => {
    el.style.display = inSection ? '' : 'none';
  });
  // Show/hide element-only items (Düzenle)
  const isEditableElem = !!(_ctxElem && (_ctxElem.classList.contains('editable') || _ctxElem.querySelector('.editable')));
  menu.querySelectorAll('.ctx-elem-only').forEach(el => {
    el.style.display = isEditableElem ? '' : 'none';
  });

  // Disable paste if nothing copied
  const pasteBtn = menu.querySelector('[data-action="paste"]');
  if (pasteBtn) pasteBtn.disabled = !_clipboard;

  // Disable cut/copy/duplicate if nothing to act on
  const hasTarget = !!(target && target.closest('#canvas'));
  ['cut','copy','duplicate'].forEach(a => {
    const b = menu.querySelector('[data-action="' + a + '"]');
    if (b) b.disabled = !hasTarget;
  });

  menu.classList.add('visible');
  const mw = menu.offsetWidth, mh = menu.offsetHeight;
  const vw = window.innerWidth, vh = window.innerHeight;
  menu.style.left = (x + mw > vw ? vw - mw - 8 : x) + 'px';
  menu.style.top  = (y + mh > vh ? vh - mh - 8 : y) + 'px';
}

function _hideCtxMenu() {
  const menu = document.getElementById('ctx-menu');
  if (menu) menu.classList.remove('visible');
}

document.addEventListener('contextmenu', function(e) {
  const canvas = document.getElementById('canvas');
  if (!canvas || !canvas.contains(e.target)) return;
  e.preventDefault();
  _showCtxMenu(e.clientX, e.clientY, e.target);
}, true);

document.addEventListener('click', function() { _hideCtxMenu(); });

// ── Mouse position + hover element tracking ──────────────────────
let _mouseX = 0, _mouseY = 0;
let _hoverElem = null, _hoverSection = null;

document.addEventListener('mousemove', function(e) {
  _mouseX = e.clientX;
  _mouseY = e.clientY;
  const canvas = document.getElementById('canvas');
  if (!canvas || !canvas.contains(e.target)) return;
  _hoverSection = e.target.closest('#canvas section, #canvas nav, #canvas footer');
  _hoverElem    = _pickCtxElem(e.target);
});

// ── Paste near mouse position ─────────────────────────────────────
// refEl / refSec: context menu'den çağrılınca sağ tık pozisyonu geçirilir;
// Ctrl+V'den çağrılınca null → o anki mouse pozisyonu kullanılır.
function _pasteAtMouse(refEl, refSec) {
  if (!_clipboard) return;
  const canvas = document.getElementById('canvas');
  const tmp = document.createElement('div');
  // Kaynak öğe hâlâ DOM'daysa anlık outerHTML'i al (format bar değişikliklerini korur)
  const freshHtml = (_clipboard.sourceEl && document.contains(_clipboard.sourceEl))
    ? _clipboard.sourceEl.outerHTML
    : _clipboard.html;
  tmp.innerHTML = freshHtml;
  const el = tmp.firstElementChild;
  if (!el) return;

  // Freshen item ID so paste doesn't share state with the original
  const _oldItemId = el.dataset.itemId;
  if (_oldItemId) {
    const _base = _oldItemId.replace(/-\d+$/, '');
    const _newId = _base + '-' + Date.now();
    el.dataset.itemId = _newId;
    el.querySelectorAll('[data-key]').forEach(c => {
      c.dataset.key = c.dataset.key.replace(_oldItemId, _newId);
    });
  }
  // Clear drag ID — gets a fresh one on first drag
  const _hadDragId = !!el.dataset.dragId;
  if (el.dataset.dragId) delete el.dataset.dragId;
  // Absolute pozisyon temizleme/kaydırma:
  //   - Grid'e gidecek sidebar item → mutlaka sıfırla
  //   - Serbest konumlandırılmış (data-drag-id vardı) öğe → 20px kaydır
  //   - Şablon/editable öğesi (ne grid ne serbest) → sıfırla (section içine yerleşince yanlış konumda kalmasın)
  const willGoToGrid = !!(_oldItemId);
  if (el.style.position === 'absolute') {
    if (!_hadDragId || willGoToGrid) {
      el.style.removeProperty('position');
      el.style.removeProperty('left');
      el.style.removeProperty('top');
      el.style.removeProperty('width');
      el.style.removeProperty('height');
    } else {
      // Serbest konumlandırılmış öğe: aynı section içine offset ile yapıştır
      el.style.left = (parseFloat(el.style.left || '0') + 20) + 'px';
      el.style.top  = (parseFloat(el.style.top  || '0') + 20) + 'px';
    }
  }
  // Reset any contenteditable=true children so the pasted element is interactive on first click
  el.querySelectorAll('[contenteditable="true"]').forEach(c => c.setAttribute('contenteditable', 'false'));
  if (el.getAttribute('contenteditable') === 'true') el.setAttribute('contenteditable', 'false');

  // Context menüden çağrılınca sağ tık referans öğesini kullan;
  // Ctrl+V'den çağrılınca mevcut mouse pozisyonunu kullan.
  const elemAtMouse = refEl || document.elementFromPoint(_mouseX, _mouseY);
  const secAtMouse  = refSec
    || (elemAtMouse ? elemAtMouse.closest('#canvas section, #canvas nav, #canvas footer') : null);

  if (_clipboard.isSection) {
    const _oldSecId = el.id;
    el.id = 'csec-' + Date.now();
    const _newSecId = el.id;
    // Çocuk data-key'lerini yeni bölüm ID'siyle güncelle; içerikleri de kopyala
    if (_oldSecId) {
      el.querySelectorAll('[data-key]').forEach(child => {
        if (child.dataset.key.startsWith(_oldSecId)) {
          const newKey = child.dataset.key.replace(_oldSecId, _newSecId);
          if (siteData.content[child.dataset.key]) {
            siteData.content[newKey] = JSON.parse(JSON.stringify(siteData.content[child.dataset.key]));
          }
          child.dataset.key = newKey;
        }
      });
    }
    if (secAtMouse) secAtMouse.after(el);
    else {
      const footer = canvas.querySelector('footer');
      if (footer) canvas.insertBefore(el, footer);
      else canvas.appendChild(el);
    }
    // editableReady flag'i temizle — setupEditable yeni handler eklesin
    el.querySelectorAll('[data-editable-ready]').forEach(c => c.removeAttribute('data-editable-ready'));
    el.removeAttribute('data-editable-ready');
    setupEditable(); setupImageZones(); setupSectionDrag();
  } else {
    const targetSec = secAtMouse || _hoverSection;
    // editableReady flag'i temizle — setupEditable yeni handler eklesin
    el.querySelectorAll('[data-editable-ready]').forEach(c => c.removeAttribute('data-editable-ready'));
    el.removeAttribute('data-editable-ready');
    if (targetSec) {
      if (el.dataset.itemId) {
        // Sidebar öğesi: mutlaka grid içine yerleştir (section'a değil)
        const grid = _ensureSectionExtras(targetSec);
        const hoveredItem = elemAtMouse && grid.contains(elemAtMouse)
          ? elemAtMouse.closest('[data-item-id]') : null;
        if (hoveredItem) hoveredItem.after(el);
        else grid.appendChild(el);
        _refreshGridMoveButtons(grid);
      } else if (elemAtMouse && targetSec.contains(elemAtMouse) && elemAtMouse !== targetSec) {
        // Kart veya iç içe geçmiş yapının içine gömülmemesi için
        // section'ın doğrudan çocuğuna kadar çık, sonra onun arkasına ekle
        let directChild = elemAtMouse;
        while (directChild.parentElement && directChild.parentElement !== targetSec) {
          directChild = directChild.parentElement;
        }
        if (directChild.parentElement === targetSec) {
          directChild.after(el);
        } else {
          targetSec.appendChild(el);
        }
      } else {
        targetSec.appendChild(el);
      }
    } else {
      const last = canvas.lastElementChild;
      if (last) last.appendChild(el);
    }
    setupEditable();
  }
  // Yapıştırılan editable öğelerde text-align yoksa center uygula
  el.querySelectorAll('.editable').forEach(function(e) {
    if (!e.style.textAlign) e.style.textAlign = 'center';
  });
  if (el.classList && el.classList.contains('editable') && !el.style.textAlign) {
    el.style.textAlign = 'center';
  }

  isDirty = true; showAutoSaveIndicator(); pushHistory();
  showToast('📌 Yapıştırıldı', 'success');
}

// ── Keyboard shortcuts ────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { _hideCtxMenu(); return; }

  // Don't steal shortcuts while user is typing
  const active = document.activeElement;
  if (active && (active.contentEditable === 'true' || active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;

  const ctrl = e.ctrlKey || e.metaKey;
  if (!ctrl) return;

  if (e.key === 'c') {
    const target = _hoverElem || _hoverSection;
    if (!target) return;
    _clipboard = { html: target.outerHTML, isSection: !_hoverElem, sourceEl: target };
    showToast('⧉ Kopyalandı', 'info');
    e.preventDefault();
  } else if (e.key === 'x') {
    const target = _hoverElem || _hoverSection;
    if (!target) return;
    _clipboard = { html: target.outerHTML, isSection: !_hoverElem };
    target.remove();
    isDirty = true; showAutoSaveIndicator(); pushHistory();
    showToast('✂ Kesildi', 'info');
    e.preventDefault();
  } else if (e.key === 'v') {
    if (!_clipboard) return;
    _pasteAtMouse();
    e.preventDefault();
  }
});

document.getElementById('ctx-menu').addEventListener('click', function(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  _hideCtxMenu();
  const action = btn.dataset.action;
  const canvas = document.getElementById('canvas');

  // The operative target: specific elem > section
  const opTarget = _ctxElem || _ctxSection;

  if (action === 'edit') {
    if (!_ctxElem) return;
    // Open the editable element for text editing
    const editable = _ctxElem.classList.contains('editable')
      ? _ctxElem
      : _ctxElem.querySelector('.editable');
    if (editable) {
      editable.setAttribute('contenteditable', 'true');
      editable.focus();
      _lastActiveEditable = editable;
      showFormatBar(editable);
      const range = document.createRange();
      range.selectNodeContents(editable);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      // No editable child — open props panel
      selectElement(_ctxElem);
    }

  } else if (action === 'cut') {
    if (!opTarget) return;
    _clipboard = { html: opTarget.outerHTML, isSection: !_ctxElem, sourceEl: null };
    opTarget.remove();
    isDirty = true; showAutoSaveIndicator(); pushHistory();
    showToast('✂ Kesildi', 'info');

  } else if (action === 'copy') {
    if (!opTarget) return;
    _clipboard = { html: opTarget.outerHTML, isSection: !_ctxElem, sourceEl: opTarget };
    showToast('⧉ Kopyalandı', 'info');

  } else if (action === 'paste') {
    _pasteAtMouse(_ctxTarget, _ctxSection);

  } else if (action === 'duplicate') {
    if (!opTarget) return;
    const clone = opTarget.cloneNode(true);
    if (!_ctxElem) {
      clone.id = 'csec-' + Date.now();
    } else {
      // Freshen item-id and drag-id to avoid conflicts with original
      const _oldId = clone.dataset.itemId;
      if (_oldId) {
        const _newId = _oldId.replace(/-\d+$/, '') + '-' + Date.now();
        clone.dataset.itemId = _newId;
        clone.querySelectorAll('[data-key]').forEach(c => {
          c.dataset.key = c.dataset.key.replace(_oldId, _newId);
        });
      }
      delete clone.dataset.dragId;
      // If absolutely positioned, offset so clone doesn't hide under original
      if (clone.style.position === 'absolute') {
        clone.style.left = (parseFloat(clone.style.left || '0') + 20) + 'px';
        clone.style.top  = (parseFloat(clone.style.top  || '0') + 20) + 'px';
      }
      // Reset contenteditable
      clone.querySelectorAll('[contenteditable="true"]').forEach(c => c.setAttribute('contenteditable', 'false'));
    }
    opTarget.after(clone);
    if (!_ctxElem) { setupEditable(); setupImageZones(); setupSectionDrag(); }
    else setupEditable();
    isDirty = true; showAutoSaveIndicator(); pushHistory();
    showToast('⊕ Çoğaltıldı', 'success');

  } else if (action === 'move-down') {
    if (!_ctxSection) return;
    const next = _ctxSection.nextElementSibling;
    if (next && next.tagName !== 'FOOTER') {
      next.after(_ctxSection);
      isDirty = true; showAutoSaveIndicator(); pushHistory();
    }

  } else if (action === 'set-bg') {
    if (_ctxSection) openSecBgPanel(_ctxSection);

  } else if (action === 'delete') {
    if (_ctxElem) {
      // Delete only the specific element, no confirm needed
      _ctxElem.remove();
      isDirty = true; showAutoSaveIndicator(); pushHistory();
      showToast('Öğe silindi', 'info');
    } else if (_ctxSection) {
      if (confirm('Bu bölüm silinsin mi?')) {
        _ctxSection.remove();
        isDirty = true; showAutoSaveIndicator(); pushHistory();
        showToast('Bölüm silindi', 'info');
      }
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// SECTION BACKGROUND PANEL
// ═══════════════════════════════════════════════════════════════
let _sbpSection = null;
let _sbpImageData = null;

function openSecBgPanel(sec) {
  _sbpSection = sec;
  _sbpImageData = null;
  const panel = document.getElementById('sec-bg-panel');
  const overlay = document.getElementById('panel-overlay');
  panel.classList.remove('hidden');
  overlay.classList.add('visible');
  // Reset preview
  const preview = document.getElementById('sbp-img-preview');
  if (preview) { preview.style.display = 'none'; preview.src = ''; }
  const uploadBtn = document.getElementById('sbp-img-btn');
  if (uploadBtn) uploadBtn.style.display = '';
  // Pre-fill color from section's current bg
  const currentBg = sec.style.backgroundColor || '';
  const colorPick = document.getElementById('sbp-color-pick');
  const colorHex = document.getElementById('sbp-color-hex');
  if (currentBg && colorPick) {
    colorPick.value = _rgbToHex(currentBg) || '#ffffff';
    if (colorHex) colorHex.value = colorPick.value;
  }
}

function closeSecBgPanel() {
  document.getElementById('sec-bg-panel').classList.add('hidden');
  document.getElementById('panel-overlay').classList.remove('visible');
  _sbpSection = null;
}

function closePanelOverlay() {
  closeSecBgPanel();
  closeSectionPicker();
  closePagePicker();
}

function sbpSwitchTab(btn) {
  document.querySelectorAll('.sbp-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sbp-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const pane = document.getElementById('sbp-pane-' + btn.dataset.pane);
  if (pane) pane.classList.add('active');
}

function sbpPickImage() {
  document.getElementById('sbp-img-input').click();
}

function sbpImageSelected(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    _sbpImageData = e.target.result;
    const preview = document.getElementById('sbp-img-preview');
    preview.src = _sbpImageData;
    preview.style.display = 'block';
    document.getElementById('sbp-img-btn').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function applySecBg(mode) {
  if (!_sbpSection) return;

  if (mode === 'color') {
    const hex = document.getElementById('sbp-color-hex').value || document.getElementById('sbp-color-pick').value;
    const opacity = parseInt(document.getElementById('sbp-opacity').value) / 100;
    _sbpSection.style.backgroundColor = hex;
    _sbpSection.style.opacity = opacity < 1 ? opacity : '';
    _sbpSection.style.backgroundImage = '';
    _sbpSection.style.backgroundSize = '';
    _sbpSection.style.backgroundPosition = '';
    // Remove any video overlay
    const vov = _sbpSection.querySelector('.sec-bg-video');
    if (vov) vov.remove();

  } else if (mode === 'image') {
    if (!_sbpImageData) { showToast('Önce resim seçin', 'info'); return; }
    const size = document.getElementById('sbp-bg-size').value;
    const overlay = parseInt(document.getElementById('sbp-img-overlay').value);
    _sbpSection.style.backgroundImage = 'url(' + _sbpImageData + ')';
    _sbpSection.style.backgroundSize = size;
    _sbpSection.style.backgroundPosition = 'center';
    _sbpSection.style.position = 'relative';
    // Remove old overlay div
    let ov = _sbpSection.querySelector('.sec-bg-overlay');
    if (ov) ov.remove();
    if (overlay > 0) {
      ov = document.createElement('div');
      ov.className = 'sec-bg-overlay';
      ov.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,' + (overlay / 100) + ');pointer-events:none;z-index:0;';
      _sbpSection.insertBefore(ov, _sbpSection.firstChild);
    }
    // Remove any video
    const vov = _sbpSection.querySelector('.sec-bg-video');
    if (vov) vov.remove();

  } else if (mode === 'video') {
    const url = document.getElementById('sbp-video-url').value.trim();
    if (!url) { showToast('Video URL girin', 'info'); return; }
    const op = parseInt(document.getElementById('sbp-video-opacity').value) / 100;
    const blend = document.getElementById('sbp-blend-mode').value;
    const bgColor = document.getElementById('sbp-video-bg-color').value;
    _sbpSection.style.position = 'relative';
    _sbpSection.style.backgroundColor = bgColor;
    _sbpSection.style.backgroundImage = '';
    const old = _sbpSection.querySelector('.sec-bg-video');
    if (old) old.remove();

    const isYT = url.includes('youtube') || url.includes('youtu.be');
    const vWrap = document.createElement('div');
    vWrap.className = 'sec-bg-video';
    vWrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';

    if (isYT) {
      const embedId = _extractYouTubeId(url);
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + embedId + '?autoplay=1&mute=1&loop=1&playlist=' + embedId + '&controls=0';
      iframe.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:177.78%;height:100%;min-width:100%;opacity:' + op + ';mix-blend-mode:' + blend + ';border:none;';
      iframe.allow = 'autoplay';
      vWrap.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.src = url;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);min-width:100%;min-height:100%;width:auto;height:auto;opacity:' + op + ';mix-blend-mode:' + blend + ';';
      vWrap.appendChild(video);
    }
    _sbpSection.insertBefore(vWrap, _sbpSection.firstChild);
  }

  isDirty = true; showAutoSaveIndicator(); pushHistory();
  showToast('✓ Arka plan uygulandı', 'success');
  closeSecBgPanel();
}

// Sync color picker + hex input in background panel
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const pick = document.getElementById('sbp-color-pick');
    const hex = document.getElementById('sbp-color-hex');
    const opR = document.getElementById('sbp-opacity');
    const opN = document.getElementById('sbp-opacity-num');
    const ioR = document.getElementById('sbp-img-overlay');
    const ioN = document.getElementById('sbp-img-overlay-num');
    const voR = document.getElementById('sbp-video-opacity');
    const voN = document.getElementById('sbp-video-opacity-num');
    if (pick && hex) {
      pick.oninput = () => { hex.value = pick.value; };
      hex.oninput = () => { if (/^#[0-9a-f]{6}$/i.test(hex.value)) pick.value = hex.value; };
    }
    if (opR && opN) { opR.oninput = () => opN.value = opR.value; opN.oninput = () => opR.value = opN.value; }
    if (ioR && ioN) { ioR.oninput = () => ioN.value = ioR.value; ioN.oninput = () => ioR.value = ioN.value; }
    if (voR && voN) { voR.oninput = () => voN.value = voR.value; voN.oninput = () => voR.value = voN.value; }
  });
})();

function _rgbToHex(rgb) {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return '#' + [m[1],m[2],m[3]].map(x => parseInt(x).toString(16).padStart(2,'0')).join('');
}

function _extractYouTubeId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : '';
}

// ═══════════════════════════════════════════════════════════════
// SECTION TEMPLATES DATA
// ═══════════════════════════════════════════════════════════════
const SECTION_CATS = [
  { id: 'hero',          icon: '🌟', label: 'Hoş Geldiniz' },
  { id: 'about',         icon: '👤', label: 'Hakkında' },
  { id: 'services',      icon: '⚙️', label: 'Hizmetler' },
  { id: 'contact',       icon: '📞', label: 'İletişim' },
  { id: 'products',      icon: '🛍', label: 'Ürünler' },
  { id: 'features',      icon: '✨', label: 'Özellikler' },
  { id: 'pricing',       icon: '💰', label: 'Fiyatlandırma' },
  { id: 'testimonials',  icon: '💬', label: 'Değerlendirmeler' },
  { id: 'stats',         icon: '📊', label: 'İstatistikler' },
  { id: 'cta',           icon: '🚀', label: 'Eylem Çağrısı' },
  { id: 'gallery',       icon: '🖼', label: 'Galeri' },
  { id: 'team',          icon: '👥', label: 'Ekip' },
  { id: 'faq',           icon: '❓', label: 'SSS' },
];

function _thumbSVG(shapes) {
  const parts = shapes.map(r => {
    if (r.type === 'text') return '<text x="' + r.x + '" y="' + r.y + '" font-size="' + (r.size||8) + '" fill="' + (r.fill||'#fff') + '" font-weight="' + (r.bold?'700':'400') + '" text-anchor="' + (r.anchor||'start') + '" dominant-baseline="central">' + (r.text||'') + '</text>';
    if (r.type === 'circle') return '<circle cx="' + r.cx + '" cy="' + r.cy + '" r="' + (r.r||6) + '" fill="' + (r.fill||'#7C3AED') + '"/>';
    if (r.type === 'line') return '<line x1="' + (r.x1||0) + '" y1="' + (r.y1||0) + '" x2="' + (r.x2||240) + '" y2="' + (r.y2||0) + '" stroke="' + (r.stroke||'rgba(0,0,0,0.1)') + '" stroke-width="' + (r.sw||0.5) + '"/>';
    return '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="' + (r.rx||0) + '" fill="' + (r.fill||'rgba(255,255,255,0.12)') + '"/>';
  }).join('');
  return '<svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg"><style>text{font-family:system-ui,-apple-system,sans-serif;}</style><rect width="240" height="140" fill="#0D1117"/>' + parts + '</svg>';
}

const _p = '#7C3AED';   // primary placeholder
const _s = 'rgba(255,255,255,0.08)'; // subtle
const _t = 'rgba(255,255,255,0.18)'; // text placeholder
const _tl = 'rgba(255,255,255,0.08)'; // light text

const SECTION_TEMPLATES_DATA = {
  hero: [
    {
      name: 'Hero Tam Ekran',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#4c1d95'},
        {type:'text',x:120,y:50,text:'Başlığınızı Buraya',size:11,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:120,y:68,text:'Etkileyici bir açıklama yazın.',size:7,fill:'rgba(255,255,255,0.6)',anchor:'middle'},
        {x:82,y:80,w:76,h:22,rx:11,fill:'#fff'},
        {type:'text',x:120,y:94,text:'Hemen Başlayın →',size:7,fill:'#7C3AED',bold:true,anchor:'middle'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:linear-gradient(135deg,var(--primary,#7C3AED),var(--secondary,#5B21B6));text-align:center;padding:100px 40px;">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <h1 class="editable" data-key="${id}-h" style="color:#fff;font-size:clamp(2rem,5vw,3.5rem);font-weight:900;margin-bottom:16px;" contenteditable="false">Başlığınızı Buraya Yazın</h1>
        <p class="editable" data-key="${id}-p" style="color:rgba(255,255,255,.75);font-size:1.15rem;max-width:600px;margin:0 auto 32px;" contenteditable="false">Ziyaretçilerinizi karşılayan etkileyici bir açıklama yazın.</p>
        <a href="#" class="editable" data-key="${id}-btn" style="display:inline-flex;align-items:center;padding:14px 36px;background:#fff;color:var(--primary,#7C3AED);border-radius:50px;font-weight:700;font-size:1rem;text-decoration:none;" contenteditable="false" onclick="return false;">Hemen Başlayın</a>
      </section>`
    },
    {
      name: 'Hero İki Sütun',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#0f0f1a'},
        {x:124,y:0,w:116,h:140,fill:'#1a1a2e'},
        {type:'text',x:8,y:38,text:'Güçlü Bir Başlık',size:9,fill:'#fff',bold:true},
        {x:8,y:50,w:88,h:5,rx:2,fill:'rgba(255,255,255,0.2)'},
        {x:8,y:60,w:76,h:5,rx:2,fill:'rgba(255,255,255,0.2)'},
        {x:8,y:76,w:56,h:18,rx:9,fill:'#7C3AED'},
        {type:'text',x:36,y:88,text:'Keşfet',size:7,fill:'#fff',bold:true,anchor:'middle'},
        {x:134,y:24,w:96,h:90,rx:10,fill:'rgba(124,58,237,0.25)'},
        {type:'circle',cx:182,cy:65,r:14,fill:'rgba(124,58,237,0.45)'},
      ]),
      html: id => `<section id="${id}" class="cus-section">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div class="cus-sec-inner">
          <div class="cus-sec-text">
            <h1 class="cus-sec-h editable" data-key="${id}-h" contenteditable="false">Güçlü Bir Başlık</h1>
            <p class="cus-sec-p editable" data-key="${id}-p" contenteditable="false">Markanızı tanıtan etkileyici bir paragraf yazın. Ziyaretçilerinizi ikna edin.</p>
            <a href="#" class="cus-sec-btn editable" data-key="${id}-btn" contenteditable="false" onclick="return false;">Keşfet</a>
          </div>
          <div class="cus-sec-img img-zone" data-img-key="${id}-img" style="min-height:220px;background:var(--light,#f5f3ff);border-radius:16px;display:flex;align-items:center;justify-content:center;">
            <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Resim Ekle</div>
          </div>
        </div>
      </section>`
    },
    {
      name: 'Hero Minimal',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:50,text:'Sade ve Güçlü Başlık',size:10,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:120,y:68,text:'Ziyaretçilere sunduğunuz değeri anlatan metin.',size:6.5,fill:'rgba(0,0,0,0.4)',anchor:'middle'},
        {x:88,y:80,w:64,h:22,rx:11,fill:'#7C3AED'},
        {type:'text',x:120,y:94,text:'Başlayın →',size:7,fill:'#fff',bold:true,anchor:'middle'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);text-align:center;padding:80px 40px;">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:680px;margin:0 auto;">
          <h1 class="editable" data-key="${id}-h" style="font-size:clamp(2rem,5vw,3rem);font-weight:900;color:var(--text,#111);margin-bottom:18px;line-height:1.2;" contenteditable="false">Sade ve Güçlü Başlık</h1>
          <p class="editable" data-key="${id}-p" style="font-size:1.1rem;color:rgba(0,0,0,.55);margin-bottom:32px;" contenteditable="false">Ziyaretçilerinize sunduğunuz değeri anlatan kısa bir metin.</p>
          <a href="#" class="editable" data-key="${id}-btn" style="display:inline-flex;align-items:center;padding:13px 34px;background:var(--primary,#7C3AED);color:#fff;border-radius:50px;font-weight:700;text-decoration:none;" contenteditable="false" onclick="return false;">Başlayın →</a>
        </div>
      </section>`
    },
  ],

  about: [
    {
      name: 'Hakkında + Resim',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
        {x:8,y:10,w:102,h:120,rx:10,fill:'rgba(124,58,237,0.18)'},
        {type:'circle',cx:59,cy:58,r:16,fill:'rgba(124,58,237,0.45)'},
        {type:'text',x:120,y:28,text:'Biz Kimiz?',size:9,fill:'#1f2937',bold:true},
        {x:120,y:36,w:100,h:5,rx:2,fill:'rgba(31,41,55,0.18)'},
        {x:120,y:46,w:94,h:5,rx:2,fill:'rgba(31,41,55,0.18)'},
        {x:120,y:56,w:88,h:5,rx:2,fill:'rgba(31,41,55,0.18)'},
        {x:120,y:66,w:80,h:5,rx:2,fill:'rgba(31,41,55,0.18)'},
        {x:120,y:80,w:58,h:18,rx:9,fill:'#7C3AED'},
        {type:'text',x:149,y:92,text:'Daha Fazla',size:7,fill:'#fff',bold:true,anchor:'middle'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div class="cus-sec-inner">
          <div class="cus-sec-img img-zone" data-img-key="${id}-img" style="min-height:260px;background:var(--primary,#7C3AED)20;border-radius:20px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
            <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Resim Ekle</div>
          </div>
          <div class="cus-sec-text">
            <h2 class="cus-sec-h editable" data-key="${id}-h" contenteditable="false">Biz Kimiz?</h2>
            <p class="cus-sec-p editable" data-key="${id}-p" contenteditable="false">Şirketinizin hikayesini, değerlerinizi ve misyonunuzu anlatan bir paragraf yazın. Müşterilerinize neden sizi tercih etmeleri gerektiğini açıklayın.</p>
            <a href="#" class="cus-sec-btn editable" data-key="${id}-btn" contenteditable="false" onclick="return false;">Daha Fazla</a>
          </div>
        </div>
      </section>`
    },
    {
      name: 'Hakkında İstatistikli',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:22,text:'Rakamlarla Biz',size:10,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:120,y:36,text:'Yılların deneyimi ve güvenin kanıtı.',size:6,fill:'rgba(0,0,0,0.4)',anchor:'middle'},
        {x:8,y:50,w:68,h:76,rx:10,fill:'#f5f3ff'},
        {x:86,y:50,w:68,h:76,rx:10,fill:'#f5f3ff'},
        {x:164,y:50,w:68,h:76,rx:10,fill:'#f5f3ff'},
        {type:'text',x:42,y:82,text:'250+',size:13,fill:'#7C3AED',bold:true,anchor:'middle'},
        {type:'text',x:120,y:82,text:'10+',size:13,fill:'#7C3AED',bold:true,anchor:'middle'},
        {type:'text',x:198,y:82,text:'98%',size:13,fill:'#7C3AED',bold:true,anchor:'middle'},
        {type:'text',x:42,y:104,text:'Müşteri',size:6,fill:'rgba(0,0,0,0.4)',anchor:'middle'},
        {type:'text',x:120,y:104,text:'Yıl',size:6,fill:'rgba(0,0,0,0.4)',anchor:'middle'},
        {type:'text',x:198,y:104,text:'Memnun',size:6,fill:'rgba(0,0,0,0.4)',anchor:'middle'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);text-align:center;">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:760px;margin:0 auto 48px;">
          <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;color:var(--text,#111);margin-bottom:14px;" contenteditable="false">Rakamlarla Biz</h2>
          <p class="editable" data-key="${id}-p" style="color:rgba(0,0,0,.55);font-size:1rem;" contenteditable="false">Yılların deneyimi ve güvenin rakamlarla kanıtı.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:24px;max-width:900px;margin:0 auto;">
          <div style="padding:32px 20px;background:var(--light,#f5f3ff);border-radius:16px;">
            <div class="editable" data-key="${id}-n1" style="font-size:2.5rem;font-weight:900;color:var(--primary,#7C3AED);" contenteditable="false">250+</div>
            <div class="editable" data-key="${id}-l1" style="font-size:.9rem;color:rgba(0,0,0,.5);margin-top:6px;" contenteditable="false">Mutlu Müşteri</div>
          </div>
          <div style="padding:32px 20px;background:var(--light,#f5f3ff);border-radius:16px;">
            <div class="editable" data-key="${id}-n2" style="font-size:2.5rem;font-weight:900;color:var(--primary,#7C3AED);" contenteditable="false">10+</div>
            <div class="editable" data-key="${id}-l2" style="font-size:.9rem;color:rgba(0,0,0,.5);margin-top:6px;" contenteditable="false">Yıl Deneyim</div>
          </div>
          <div style="padding:32px 20px;background:var(--light,#f5f3ff);border-radius:16px;">
            <div class="editable" data-key="${id}-n3" style="font-size:2.5rem;font-weight:900;color:var(--primary,#7C3AED);" contenteditable="false">98%</div>
            <div class="editable" data-key="${id}-l3" style="font-size:.9rem;color:rgba(0,0,0,.5);margin-top:6px;" contenteditable="false">Memnuniyet</div>
          </div>
        </div>
      </section>`
    },
  ],

  services: [
    {
      name: 'Hizmetler 3\'lü Grid',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:16,text:'Hizmetlerimiz',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:120,y:28,text:'Size sunduğumuz hizmetler',size:6,fill:'rgba(0,0,0,0.35)',anchor:'middle'},
        {x:6,y:38,w:72,h:94,rx:10,fill:'#f5f3ff'},
        {x:84,y:38,w:72,h:94,rx:10,fill:'#f5f3ff'},
        {x:162,y:38,w:72,h:94,rx:10,fill:'#f5f3ff'},
        {type:'circle',cx:42,cy:62,r:10,fill:'rgba(124,58,237,0.3)'},
        {type:'circle',cx:120,cy:62,r:10,fill:'rgba(124,58,237,0.3)'},
        {type:'circle',cx:198,cy:62,r:10,fill:'rgba(124,58,237,0.3)'},
        {type:'text',x:42,y:80,text:'Hizmet 1',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:120,y:80,text:'Hizmet 2',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:198,y:80,text:'Hizmet 3',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:12,y:90,w:60,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},{x:90,y:90,w:60,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},{x:168,y:90,w:60,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {x:12,y:98,w:50,h:4,rx:2,fill:'rgba(31,41,55,0.08)'},{x:90,y:98,w:50,h:4,rx:2,fill:'rgba(31,41,55,0.08)'},{x:168,y:98,w:50,h:4,rx:2,fill:'rgba(31,41,55,0.08)'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:1100px;margin:0 auto;">
          <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:14px;" contenteditable="false">Hizmetlerimiz</h2>
          <p class="editable" data-key="${id}-sub" style="text-align:center;color:rgba(0,0,0,.5);margin-bottom:44px;font-size:1rem;" contenteditable="false">Size sunduğumuz hizmetlere göz atın</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;">
            <div style="padding:32px 24px;background:var(--light,#f5f3ff);border-radius:16px;border:1px solid rgba(0,0,0,.05);">
              <div class="editable" data-key="${id}-i1" style="font-size:2rem;margin-bottom:14px;" contenteditable="false">⚙️</div>
              <h3 class="editable" data-key="${id}-t1" style="font-size:1.1rem;font-weight:700;color:var(--text,#111);margin-bottom:10px;" contenteditable="false">Hizmet Adı</h3>
              <p class="editable" data-key="${id}-d1" style="font-size:.9rem;color:rgba(0,0,0,.55);line-height:1.65;" contenteditable="false">Hizmetin kısa açıklaması buraya gelir.</p>
            </div>
            <div style="padding:32px 24px;background:var(--light,#f5f3ff);border-radius:16px;border:1px solid rgba(0,0,0,.05);">
              <div class="editable" data-key="${id}-i2" style="font-size:2rem;margin-bottom:14px;" contenteditable="false">🎯</div>
              <h3 class="editable" data-key="${id}-t2" style="font-size:1.1rem;font-weight:700;color:var(--text,#111);margin-bottom:10px;" contenteditable="false">Hizmet Adı</h3>
              <p class="editable" data-key="${id}-d2" style="font-size:.9rem;color:rgba(0,0,0,.55);line-height:1.65;" contenteditable="false">Hizmetin kısa açıklaması buraya gelir.</p>
            </div>
            <div style="padding:32px 24px;background:var(--light,#f5f3ff);border-radius:16px;border:1px solid rgba(0,0,0,.05);">
              <div class="editable" data-key="${id}-i3" style="font-size:2rem;margin-bottom:14px;" contenteditable="false">💡</div>
              <h3 class="editable" data-key="${id}-t3" style="font-size:1.1rem;font-weight:700;color:var(--text,#111);margin-bottom:10px;" contenteditable="false">Hizmet Adı</h3>
              <p class="editable" data-key="${id}-d3" style="font-size:.9rem;color:rgba(0,0,0,.55);line-height:1.65;" contenteditable="false">Hizmetin kısa açıklaması buraya gelir.</p>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      name: 'Hizmetler Liste',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
        {type:'text',x:120,y:14,text:'Ne Yapıyoruz?',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:8,y:26,w:224,h:24,rx:8,fill:'#fff'},
        {x:14,y:31,w:14,h:14,rx:7,fill:'#7C3AED'},
        {type:'text',x:34,y:40,text:'Web Tasarım',size:7,fill:'#1f2937',bold:true},
        {x:100,y:37,w:80,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {x:8,y:55,w:224,h:24,rx:8,fill:'#fff'},
        {x:14,y:60,w:14,h:14,rx:7,fill:'#10B981'},
        {type:'text',x:34,y:69,text:'Dijital Pazarlama',size:7,fill:'#1f2937',bold:true},
        {x:112,y:66,w:70,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {x:8,y:84,w:224,h:24,rx:8,fill:'#fff'},
        {x:14,y:89,w:14,h:14,rx:7,fill:'#F59E0B'},
        {type:'text',x:34,y:98,text:'Grafik Tasarım',size:7,fill:'#1f2937',bold:true},
        {x:104,y:95,w:70,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {x:8,y:113,w:224,h:24,rx:8,fill:'#fff'},
        {x:14,y:118,w:14,h:14,rx:7,fill:'#EC4899'},
        {type:'text',x:34,y:127,text:'SEO Optimizasyon',size:7,fill:'#1f2937',bold:true},
        {x:112,y:124,w:70,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:820px;margin:0 auto;">
          <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Ne Yapıyoruz?</h2>
          <div style="display:flex;flex-direction:column;gap:16px;">
            ${[1,2,3,4].map(n => `<div style="display:flex;align-items:flex-start;gap:18px;padding:22px 24px;background:var(--bg,#fff);border-radius:14px;border:1px solid rgba(0,0,0,.05);">
              <div class="editable" data-key="${id}-i${n}" style="font-size:1.6rem;flex-shrink:0;" contenteditable="false">${['⚙️','🎯','💡','🔒'][n-1]}</div>
              <div>
                <h3 class="editable" data-key="${id}-t${n}" style="font-size:1rem;font-weight:700;color:var(--text,#111);margin-bottom:6px;" contenteditable="false">Hizmet ${n}</h3>
                <p class="editable" data-key="${id}-d${n}" style="font-size:.88rem;color:rgba(0,0,0,.55);line-height:1.6;margin:0;" contenteditable="false">Bu hizmetin açıklaması ve sunduğu faydalar hakkında kısa bilgi.</p>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
  ],

  contact: [
    {
      name: 'İletişim Formu',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:14,text:'İletişime Geçin',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:120,y:26,text:'En kısa sürede yanıt vereceğiz.',size:6,fill:'rgba(0,0,0,0.4)',anchor:'middle'},
        {x:20,y:34,w:200,h:18,rx:5,fill:'rgba(31,41,55,0.07)'},
        {type:'text',x:28,y:45,text:'Adınız Soyadınız',size:6.5,fill:'rgba(31,41,55,0.3)'},
        {x:20,y:57,w:200,h:18,rx:5,fill:'rgba(31,41,55,0.07)'},
        {type:'text',x:28,y:68,text:'E-posta adresiniz',size:6.5,fill:'rgba(31,41,55,0.3)'},
        {x:20,y:80,w:200,h:28,rx:5,fill:'rgba(31,41,55,0.07)'},
        {type:'text',x:28,y:95,text:'Mesajınız...',size:6.5,fill:'rgba(31,41,55,0.3)'},
        {x:20,y:114,w:200,h:18,rx:9,fill:'#7C3AED'},
        {type:'text',x:120,y:126,text:'Gönder',size:7,fill:'#fff',bold:true,anchor:'middle'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:600px;margin:0 auto;text-align:center;">
          <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:10px;" contenteditable="false">İletişime Geçin</h2>
          <p class="editable" data-key="${id}-sub" style="color:rgba(0,0,0,.5);margin-bottom:36px;" contenteditable="false">Sorularınız için bize ulaşın, en kısa sürede dönüş yapacağız.</p>
          <form style="display:flex;flex-direction:column;gap:14px;text-align:left;" onsubmit="return false;">
            <input type="text" placeholder="Adınız" style="padding:13px 16px;border:1.5px solid rgba(0,0,0,.12);border-radius:10px;font-size:.93rem;outline:none;width:100%;">
            <input type="email" placeholder="E-posta" style="padding:13px 16px;border:1.5px solid rgba(0,0,0,.12);border-radius:10px;font-size:.93rem;outline:none;width:100%;">
            <textarea rows="4" placeholder="Mesajınız..." style="padding:13px 16px;border:1.5px solid rgba(0,0,0,.12);border-radius:10px;font-size:.93rem;outline:none;width:100%;resize:vertical;"></textarea>
            <button type="submit" style="padding:13px;background:var(--primary,#7C3AED);color:#fff;border:none;border-radius:10px;font-size:.95rem;font-weight:700;cursor:pointer;">Gönder</button>
          </form>
        </div>
      </section>`
    },
    {
      name: 'İletişim Bilgileri',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
        {type:'text',x:120,y:14,text:'Bize Ulaşın',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:6,y:26,w:70,h:106,rx:10,fill:'#fff'},
        {x:84,y:26,w:70,h:106,rx:10,fill:'#fff'},
        {x:162,y:26,w:70,h:106,rx:10,fill:'#fff'},
        {type:'circle',cx:41,cy:52,r:12,fill:'rgba(124,58,237,0.2)'},
        {type:'text',x:41,y:52,text:'T',size:9,fill:'#7C3AED',bold:true,anchor:'middle'},
        {type:'text',x:41,y:74,text:'Telefon',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:11,y:82,w:60,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {type:'circle',cx:119,cy:52,r:12,fill:'rgba(124,58,237,0.2)'},
        {type:'text',x:119,y:52,text:'@',size:9,fill:'#7C3AED',bold:true,anchor:'middle'},
        {type:'text',x:119,y:74,text:'E-posta',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:89,y:82,w:60,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {type:'circle',cx:197,cy:52,r:12,fill:'rgba(124,58,237,0.2)'},
        {type:'text',x:197,y:52,text:'A',size:9,fill:'#7C3AED',bold:true,anchor:'middle'},
        {type:'text',x:197,y:74,text:'Adres',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:167,y:82,w:60,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:900px;margin:0 auto;">
          <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Bize Ulaşın</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;">
            ${[['📞','Telefon','0212 000 00 00'],['📧','E-posta','info@sirket.com'],['📍','Adres','Şehir, Türkiye']].map((c,n) =>
              `<div style="padding:28px 24px;background:var(--bg,#fff);border-radius:16px;text-align:center;">
                <div class="editable" data-key="${id}-i${n}" style="font-size:2rem;margin-bottom:12px;" contenteditable="false">${c[0]}</div>
                <h3 class="editable" data-key="${id}-t${n}" style="font-weight:700;margin-bottom:8px;color:var(--text,#111);" contenteditable="false">${c[1]}</h3>
                <p class="editable" data-key="${id}-v${n}" style="color:rgba(0,0,0,.5);font-size:.9rem;" contenteditable="false">${c[2]}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
  ],

  products: [
    {
      name: 'Ürün Kartları',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:14,text:'Ürünlerimiz',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:6,y:24,w:70,h:108,rx:10,fill:'#f5f3ff'},
        {x:85,y:24,w:70,h:108,rx:10,fill:'#f5f3ff'},
        {x:164,y:24,w:70,h:108,rx:10,fill:'#f5f3ff'},
        {x:6,y:24,w:70,h:56,rx:10,fill:'rgba(124,58,237,0.2)'},
        {x:85,y:24,w:70,h:56,rx:10,fill:'rgba(124,58,237,0.2)'},
        {x:164,y:24,w:70,h:56,rx:10,fill:'rgba(124,58,237,0.2)'},
        {type:'text',x:41,y:94,text:'Ürün 1',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:120,y:94,text:'Ürün 2',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:199,y:94,text:'Ürün 3',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:14,y:107,text:'₺199',size:8,fill:'#7C3AED',bold:true},
        {type:'text',x:93,y:107,text:'₺299',size:8,fill:'#7C3AED',bold:true},
        {type:'text',x:172,y:107,text:'₺399',size:8,fill:'#7C3AED',bold:true},
        {x:10,y:118,w:62,h:12,rx:6,fill:'#7C3AED'},{x:89,y:118,w:62,h:12,rx:6,fill:'#7C3AED'},{x:168,y:118,w:62,h:12,rx:6,fill:'#7C3AED'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:1100px;margin:0 auto;">
          <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Ürünlerimiz</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px;">
            ${[1,2,3].map(n => `<div style="background:var(--light,#f5f3ff);border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,.05);">
              <div class="img-zone" data-img-key="${id}-img${n}" style="height:180px;background:rgba(124,58,237,0.12);display:flex;align-items:center;justify-content:center;position:relative;">
                <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Resim</div>
              </div>
              <div style="padding:16px 18px;">
                <h3 class="editable" data-key="${id}-t${n}" style="font-size:1rem;font-weight:700;color:var(--text,#111);margin-bottom:6px;" contenteditable="false">Ürün ${n}</h3>
                <p class="editable" data-key="${id}-d${n}" style="font-size:.85rem;color:rgba(0,0,0,.5);margin-bottom:12px;" contenteditable="false">Kısa açıklama</p>
                <div style="display:flex;align-items:center;justify-content:space-between;">
                  <span class="editable" data-key="${id}-p${n}" style="font-weight:800;color:var(--primary,#7C3AED);font-size:1.1rem;" contenteditable="false">₺199</span>
                  <a href="#" style="padding:7px 16px;background:var(--primary,#7C3AED);color:#fff;border-radius:20px;font-size:.8rem;font-weight:600;text-decoration:none;" onclick="return false;">Sepete Ekle</a>
                </div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
  ],

  features: [
    {
      name: 'Özellikler İkonlu',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
        {type:'text',x:120,y:14,text:'Neden Biz?',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:6,y:26,w:110,h:50,rx:10,fill:'#fff'},{x:124,y:26,w:110,h:50,rx:10,fill:'#fff'},
        {x:6,y:82,w:110,h:50,rx:10,fill:'#fff'},{x:124,y:82,w:110,h:50,rx:10,fill:'#fff'},
        {type:'circle',cx:22,cy:46,r:8,fill:'rgba(124,58,237,0.25)'},{type:'circle',cx:140,cy:46,r:8,fill:'rgba(124,58,237,0.25)'},
        {type:'circle',cx:22,cy:102,r:8,fill:'rgba(124,58,237,0.25)'},{type:'circle',cx:140,cy:102,r:8,fill:'rgba(124,58,237,0.25)'},
        {type:'text',x:36,y:42,text:'Güvenilir',size:7,fill:'#1f2937',bold:true},{type:'text',x:154,y:42,text:'Hızlı',size:7,fill:'#1f2937',bold:true},
        {type:'text',x:36,y:98,text:'Kaliteli',size:7,fill:'#1f2937',bold:true},{type:'text',x:154,y:98,text:'Destekli',size:7,fill:'#1f2937',bold:true},
        {x:36,y:50,w:72,h:4,rx:2,fill:'rgba(31,41,55,0.1)'},{x:154,y:50,w:72,h:4,rx:2,fill:'rgba(31,41,55,0.1)'},
        {x:36,y:106,w:72,h:4,rx:2,fill:'rgba(31,41,55,0.1)'},{x:154,y:106,w:72,h:4,rx:2,fill:'rgba(31,41,55,0.1)'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:960px;margin:0 auto;">
          <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Neden Biz?</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;">
            ${[['🛡','Güvenilir','Yıllarca kanıtlanmış deneyim'],['⚡','Hızlı','En hızlı teslimat garantisi'],['💎','Kaliteli','En yüksek standartlar'],['🤝','Destekli','7/24 müşteri hizmetleri']].map((f,n) =>
              `<div style="padding:26px 22px;background:var(--bg,#fff);border-radius:14px;display:flex;align-items:flex-start;gap:14px;border:1px solid rgba(0,0,0,.05);">
                <div class="editable" data-key="${id}-i${n}" style="font-size:1.7rem;flex-shrink:0;" contenteditable="false">${f[0]}</div>
                <div>
                  <h3 class="editable" data-key="${id}-t${n}" style="font-size:1rem;font-weight:700;color:var(--text,#111);margin-bottom:6px;" contenteditable="false">${f[1]}</h3>
                  <p class="editable" data-key="${id}-d${n}" style="font-size:.85rem;color:rgba(0,0,0,.5);line-height:1.6;margin:0;" contenteditable="false">${f[2]}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
  ],

  pricing: [
    {
      name: '3 Fiyat Planı',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:14,text:'Fiyatlandırma',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:4,y:26,w:70,h:108,rx:10,fill:'#f5f3ff'},
        {x:82,y:20,w:76,h:116,rx:10,fill:'#7C3AED'},
        {x:166,y:26,w:70,h:108,rx:10,fill:'#f5f3ff'},
        {type:'text',x:39,y:44,text:'Başlangıç',size:7,fill:'#6b7280',anchor:'middle'},
        {type:'text',x:120,y:38,text:'Profesyonel',size:7,fill:'rgba(255,255,255,0.8)',anchor:'middle'},
        {type:'text',x:201,y:44,text:'Kurumsal',size:7,fill:'#6b7280',anchor:'middle'},
        {type:'text',x:39,y:62,text:'₺99',size:11,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:120,y:56,text:'₺299',size:12,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:201,y:62,text:'₺599',size:11,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:10,y:78,w:58,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},{x:10,y:86,w:50,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},{x:10,y:94,w:54,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {x:88,y:72,w:64,h:4,rx:2,fill:'rgba(255,255,255,0.35)'},{x:88,y:80,w:56,h:4,rx:2,fill:'rgba(255,255,255,0.35)'},{x:88,y:88,w:60,h:4,rx:2,fill:'rgba(255,255,255,0.35)'},
        {x:172,y:78,w:58,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},{x:172,y:86,w:50,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},{x:172,y:94,w:54,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {x:10,y:116,w:58,h:14,rx:7,fill:'rgba(31,41,55,0.12)'},
        {x:88,y:110,w:64,h:22,rx:11,fill:'#fff'},
        {x:172,y:116,w:58,h:14,rx:7,fill:'rgba(31,41,55,0.12)'},
        {type:'text',x:120,y:124,text:'Satın Al',size:7,fill:'#7C3AED',bold:true,anchor:'middle'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:1050px;margin:0 auto;text-align:center;">
          <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:10px;" contenteditable="false">Fiyatlandırma</h2>
          <p class="editable" data-key="${id}-sub" style="color:rgba(0,0,0,.5);margin-bottom:44px;" contenteditable="false">İhtiyacınıza uygun planı seçin</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;align-items:start;">
            ${[['Başlangıç','₺99/ay',['3 Kullanıcı','10 GB Depolama','E-posta Desteği'],false],
               ['Profesyonel','₺299/ay',['10 Kullanıcı','100 GB Depolama','Öncelikli Destek'],true],
               ['Kurumsal','₺599/ay',['Sınırsız Kullanıcı','1 TB Depolama','7/24 Destek'],false]].map(([name,price,features,highlighted], n) =>
              `<div style="padding:36px 28px;border-radius:18px;border:${highlighted ? '2px solid var(--primary,#7C3AED)' : '1.5px solid rgba(0,0,0,.08)'};background:${highlighted ? 'var(--primary,#7C3AED)' : 'var(--light,#f5f3ff)'};">
                <div class="editable" data-key="${id}-pn${n}" style="font-size:1rem;font-weight:700;color:${highlighted ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.5)'};margin-bottom:12px;" contenteditable="false">${name}</div>
                <div class="editable" data-key="${id}-pp${n}" style="font-size:2.2rem;font-weight:900;color:${highlighted ? '#fff' : 'var(--text,#111)'};margin-bottom:24px;" contenteditable="false">${price}</div>
                <ul style="list-style:none;padding:0;margin:0 0 28px;text-align:left;display:flex;flex-direction:column;gap:10px;">
                  ${features.map((f,fi) => `<li style="display:flex;align-items:center;gap:8px;font-size:.88rem;color:${highlighted ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.6)'};">
                    <span style="color:${highlighted ? '#fff' : 'var(--primary,#7C3AED)'};">✓</span>
                    <span class="editable" data-key="${id}-f${n}${fi}" contenteditable="false">${f}</span>
                  </li>`).join('')}
                </ul>
                <a href="#" style="display:block;text-align:center;padding:12px;background:${highlighted ? '#fff' : 'var(--primary,#7C3AED)'};color:${highlighted ? 'var(--primary,#7C3AED)' : '#fff'};border-radius:30px;font-weight:700;text-decoration:none;" onclick="return false;">Satın Al</a>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
  ],

  testimonials: [
    {
      name: 'Değerlendirmeler',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
        {type:'text',x:120,y:14,text:'Müşterilerimiz Ne Diyor?',size:8,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:6,y:26,w:110,h:108,rx:12,fill:'#fff'},{x:124,y:26,w:110,h:108,rx:12,fill:'#fff'},
        {type:'text',x:16,y:42,text:'★★★★★',size:8,fill:'#F59E0B'},{type:'text',x:134,y:42,text:'★★★★★',size:8,fill:'#F59E0B'},
        {x:12,y:52,w:96,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},{x:130,y:52,w:96,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {x:12,y:60,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},{x:130,y:60,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {x:12,y:68,w:84,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},{x:130,y:68,w:84,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {type:'circle',cx:22,cy:100,r:10,fill:'#7C3AED'},{type:'text',x:22,y:100,text:'A',size:7,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:38,y:96,text:'Ayşe Y.',size:7,fill:'#1f2937',bold:true},{x:38,y:102,w:52,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
        {type:'circle',cx:140,cy:100,r:10,fill:'#7C3AED'},{type:'text',x:140,y:100,text:'M',size:7,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:156,y:96,text:'Mehmet K.',size:7,fill:'#1f2937',bold:true},{x:156,y:102,w:52,h:4,rx:2,fill:'rgba(31,41,55,0.12)'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:1000px;margin:0 auto;">
          <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Müşterilerimiz Ne Diyor?</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">
            ${[1,2,3].map(n => `<div style="padding:28px;background:var(--bg,#fff);border-radius:16px;border:1px solid rgba(0,0,0,.06);">
              <div style="color:#F59E0B;font-size:1rem;margin-bottom:14px;">★★★★★</div>
              <p class="editable" data-key="${id}-q${n}" style="font-size:.93rem;color:var(--text,#111);line-height:1.7;font-style:italic;margin-bottom:20px;" contenteditable="false">"Harika bir deneyimdi. Hizmet kalitesi beklentilerimin çok üzerindeydi. Kesinlikle tavsiye ederim!"</p>
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:50%;background:var(--primary,#7C3AED);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.9rem;">
                  <span class="editable" data-key="${id}-av${n}" contenteditable="false">M</span>
                </div>
                <div>
                  <div class="editable" data-key="${id}-name${n}" style="font-weight:700;font-size:.9rem;color:var(--text,#111);" contenteditable="false">Müşteri Adı</div>
                  <div class="editable" data-key="${id}-role${n}" style="font-size:.78rem;color:rgba(0,0,0,.45);" contenteditable="false">Şirket / Pozisyon</div>
                </div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
  ],

  stats: [
    {
      name: 'İstatistik Şeridi',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#7C3AED'},
        {x:8,y:20,w:50,h:100,rx:10,fill:'rgba(255,255,255,0.12)'},
        {x:68,y:20,w:50,h:100,rx:10,fill:'rgba(255,255,255,0.12)'},
        {x:128,y:20,w:50,h:100,rx:10,fill:'rgba(255,255,255,0.12)'},
        {x:188,y:20,w:48,h:100,rx:10,fill:'rgba(255,255,255,0.12)'},
        {type:'text',x:33,y:62,text:'500+',size:11,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:93,y:62,text:'10+',size:11,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:153,y:62,text:'250+',size:11,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:212,y:62,text:'98%',size:11,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:33,y:90,text:'Proje',size:6,fill:'rgba(255,255,255,0.6)',anchor:'middle'},
        {type:'text',x:93,y:90,text:'Yıl',size:6,fill:'rgba(255,255,255,0.6)',anchor:'middle'},
        {type:'text',x:153,y:90,text:'Müşteri',size:6,fill:'rgba(255,255,255,0.6)',anchor:'middle'},
        {type:'text',x:212,y:90,text:'Memnun',size:6,fill:'rgba(255,255,255,0.6)',anchor:'middle'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--primary,#7C3AED);padding:60px 40px;">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:960px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:24px;text-align:center;">
          ${[['500+','Tamamlanan Proje'],['10+','Yıl Deneyim'],['250+','Mutlu Müşteri'],['98%','Memnuniyet']].map(([n,l],i) =>
            `<div>
              <div class="editable" data-key="${id}-n${i}" style="font-size:2.8rem;font-weight:900;color:#fff;" contenteditable="false">${n}</div>
              <div class="editable" data-key="${id}-l${i}" style="font-size:.9rem;color:rgba(255,255,255,.7);margin-top:6px;" contenteditable="false">${l}</div>
            </div>`).join('')}
        </div>
      </section>`
    },
  ],

  cta: [
    {
      name: 'Eylem Çağrısı',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#1e1b4b'},
        {x:20,y:14,w:200,h:112,rx:16,fill:'rgba(124,58,237,0.3)'},
        {type:'text',x:120,y:50,text:'Hemen Başlayın',size:10,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:120,y:66,text:'Beklemeyin. Bugün harekete geçin.',size:7,fill:'rgba(255,255,255,0.65)',anchor:'middle'},
        {x:46,y:80,w:68,h:20,rx:10,fill:'#fff'},
        {x:126,y:80,w:88,h:20,rx:10,fill:'rgba(255,255,255,0.15)'},
        {type:'text',x:80,y:93,text:'Deneyin',size:7,fill:'#7C3AED',bold:true,anchor:'middle'},
        {type:'text',x:170,y:93,text:'Daha Fazla Bilgi',size:6.5,fill:'#fff',anchor:'middle'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:linear-gradient(135deg,var(--primary,#7C3AED),var(--secondary,#5B21B6));text-align:center;padding:80px 40px;">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:640px;margin:0 auto;">
          <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;margin-bottom:16px;" contenteditable="false">Hemen Başlayın</h2>
          <p class="editable" data-key="${id}-p" style="color:rgba(255,255,255,.75);font-size:1.05rem;margin-bottom:36px;" contenteditable="false">Beklemeyin. Bugün harekete geçin ve farkı yaşayın.</p>
          <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
            <a href="#" class="editable" data-key="${id}-btn1" style="padding:14px 36px;background:#fff;color:var(--primary,#7C3AED);border-radius:50px;font-weight:700;text-decoration:none;font-size:.95rem;" contenteditable="false" onclick="return false;">Ücretsiz Deneyin</a>
            <a href="#" class="editable" data-key="${id}-btn2" style="padding:14px 36px;background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.4);border-radius:50px;font-weight:700;text-decoration:none;font-size:.95rem;" contenteditable="false" onclick="return false;">Daha Fazla Bilgi</a>
          </div>
        </div>
      </section>`
    },
  ],

  gallery: [
    {
      name: 'Galeri Grid',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:14,text:'Galeri',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:6,y:24,w:72,h:52,rx:8,fill:'rgba(124,58,237,0.15)'},{x:84,y:24,w:72,h:52,rx:8,fill:'rgba(124,58,237,0.15)'},{x:162,y:24,w:72,h:52,rx:8,fill:'rgba(124,58,237,0.15)'},
        {x:6,y:82,w:72,h:52,rx:8,fill:'rgba(124,58,237,0.15)'},{x:84,y:82,w:72,h:52,rx:8,fill:'rgba(124,58,237,0.15)'},{x:162,y:82,w:72,h:52,rx:8,fill:'rgba(124,58,237,0.15)'},
        {type:'circle',cx:42,cy:48,r:8,fill:'rgba(124,58,237,0.3)'},{type:'circle',cx:120,cy:48,r:8,fill:'rgba(124,58,237,0.3)'},{type:'circle',cx:198,cy:48,r:8,fill:'rgba(124,58,237,0.3)'},
        {type:'circle',cx:42,cy:108,r:8,fill:'rgba(124,58,237,0.3)'},{type:'circle',cx:120,cy:108,r:8,fill:'rgba(124,58,237,0.3)'},{type:'circle',cx:198,cy:108,r:8,fill:'rgba(124,58,237,0.3)'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:1100px;margin:0 auto;">
          <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Galeri</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;">
            ${[1,2,3,4,5,6].map(n => `<div class="img-zone" data-img-key="${id}-img${n}" style="aspect-ratio:4/3;border-radius:14px;background:rgba(124,58,237,0.1);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;">
              <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Resim ${n}</div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
  ],

  team: [
    {
      name: 'Ekip Bölümü',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
        {type:'text',x:120,y:14,text:'Ekibimiz',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:120,y:26,text:'Başarının arkasındaki insanlar',size:6,fill:'rgba(0,0,0,0.4)',anchor:'middle'},
        {x:8,y:34,w:68,h:98,rx:12,fill:'#fff'},{x:86,y:34,w:68,h:98,rx:12,fill:'#fff'},{x:164,y:34,w:68,h:98,rx:12,fill:'#fff'},
        {type:'circle',cx:42,cy:62,r:16,fill:'#7C3AED'},{type:'circle',cx:120,cy:62,r:16,fill:'#7C3AED'},{type:'circle',cx:198,cy:62,r:16,fill:'#7C3AED'},
        {type:'text',x:42,y:62,text:'A',size:9,fill:'#fff',bold:true,anchor:'middle'},{type:'text',x:120,y:62,text:'B',size:9,fill:'#fff',bold:true,anchor:'middle'},{type:'text',x:198,y:62,text:'C',size:9,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:42,y:90,text:'Ad Soyad',size:7,fill:'#1f2937',bold:true,anchor:'middle'},{type:'text',x:120,y:90,text:'Ad Soyad',size:7,fill:'#1f2937',bold:true,anchor:'middle'},{type:'text',x:198,y:90,text:'Ad Soyad',size:7,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:14,y:100,w:56,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},{x:92,y:100,w:56,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},{x:170,y:100,w:56,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:1000px;margin:0 auto;text-align:center;">
          <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:10px;" contenteditable="false">Ekibimiz</h2>
          <p class="editable" data-key="${id}-sub" style="color:rgba(0,0,0,.5);margin-bottom:44px;" contenteditable="false">Başarının arkasındaki insanlar</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:22px;">
            ${[['A','Ad Soyad','Pozisyon'],['B','Ad Soyad','Pozisyon'],['C','Ad Soyad','Pozisyon']].map(([av,n,r],i) =>
              `<div style="padding:28px 20px;background:var(--bg,#fff);border-radius:16px;">
                <div style="width:72px;height:72px;border-radius:50%;background:var(--primary,#7C3AED);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:#fff;font-size:1.5rem;font-weight:700;overflow:hidden;position:relative;" class="img-zone" data-img-key="${id}-av${i}">
                  <span class="editable" data-key="${id}-avt${i}" contenteditable="false">${av}</span>
                  <div class="img-upload-hint" style="border-radius:50%;">+</div>
                </div>
                <h3 class="editable" data-key="${id}-n${i}" style="font-weight:700;color:var(--text,#111);margin-bottom:6px;" contenteditable="false">${n}</h3>
                <p class="editable" data-key="${id}-r${i}" style="font-size:.85rem;color:rgba(0,0,0,.45);" contenteditable="false">${r}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
  ],

  faq: [
    {
      name: 'SSS Akordeon',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:14,text:'Sık Sorulan Sorular',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:8,y:24,w:224,h:24,rx:8,fill:'#f5f3ff'},{type:'text',x:16,y:38,text:'Fiyatlarınız nasıl belirleniyor?',size:7,fill:'#1f2937',bold:true},{x:220,y:30,w:8,h:8,rx:4,fill:'#7C3AED'},
        {x:8,y:52,w:224,h:24,rx:8,fill:'#f5f3ff'},{type:'text',x:16,y:66,text:'Ne kadar sürede teslim edilir?',size:7,fill:'#1f2937',bold:true},{x:220,y:58,w:8,h:8,rx:4,fill:'#7C3AED'},
        {x:8,y:80,w:224,h:24,rx:8,fill:'#f5f3ff'},{type:'text',x:16,y:94,text:'Garanti sunuyor musunuz?',size:7,fill:'#1f2937',bold:true},{x:220,y:86,w:8,h:8,rx:4,fill:'#7C3AED'},
        {x:8,y:108,w:224,h:24,rx:8,fill:'#f5f3ff'},{type:'text',x:16,y:122,text:'Ödeme yöntemleri neler?',size:7,fill:'#1f2937',bold:true},{x:220,y:114,w:8,h:8,rx:4,fill:'#7C3AED'},
      ]),
      html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
        <button class="drag-handle" title="Taşı">⠿</button>
        <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
        <div style="max-width:720px;margin:0 auto;">
          <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Sık Sorulan Sorular</h2>
          <div style="display:flex;flex-direction:column;gap:10px;" id="${id}-faq-list">
            ${[['Fiyatlarınız nasıl belirleniyor?','Fiyatlarımız projenin kapsamı ve gereksinimlerine göre belirlenmektedir.'],
               ['Ne kadar sürede teslim edilir?','Proje büyüklüğüne bağlı olarak 3-14 iş günü içinde teslim ediyoruz.'],
               ['Garanti sunuyor musunuz?','Evet, tüm hizmetlerimiz için 30 günlük memnuniyet garantisi sunuyoruz.']].map(([q,a],n) =>
              `<div style="border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,.08);">
                <div style="padding:16px 20px;font-weight:700;font-size:.95rem;color:var(--text,#111);display:flex;justify-content:space-between;cursor:pointer;background:var(--light,#f5f3ff);" onclick="const a=this.nextElementSibling;a.style.display=a.style.display==='none'?'block':'none';">
                  <span class="editable" data-key="${id}-q${n}" contenteditable="false">${q}</span>
                  <span style="color:var(--primary,#7C3AED);font-size:1.2rem;">+</span>
                </div>
                <div style="padding:14px 20px;font-size:.9rem;color:rgba(0,0,0,.6);line-height:1.7;display:none;">
                  <p class="editable" data-key="${id}-a${n}" contenteditable="false">${a}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
  ],
};

// ─── EXTRA SECTION TEMPLATES (pushed into existing categories) ──

// HERO — 2 extra
SECTION_TEMPLATES_DATA.hero.push(
  {
    name: 'Hero Özellik Kartlı',
    svg: _thumbSVG([
      {x:0,y:0,w:240,h:140,fill:'#0f0f1a'},
      {type:'text',x:8,y:28,text:'Güçlü Başlık',size:10,fill:'#fff',bold:true},
      {x:8,y:38,w:90,h:5,rx:2,fill:'rgba(255,255,255,0.2)'},
      {x:8,y:48,w:80,h:5,rx:2,fill:'rgba(255,255,255,0.2)'},
      {x:8,y:60,w:58,h:16,rx:8,fill:'#7C3AED'},
      {type:'text',x:37,y:71,text:'Başlayın',size:7,fill:'#fff',bold:true,anchor:'middle'},
      {x:130,y:12,w:104,h:54,rx:10,fill:'rgba(255,255,255,0.06)'},
      {x:130,y:72,w:50,h:58,rx:10,fill:'rgba(255,255,255,0.06)'},
      {x:186,y:72,w:48,h:58,rx:10,fill:'rgba(255,255,255,0.06)'},
      {type:'text',x:140,y:36,text:'⚡ Hızlı',size:7,fill:'rgba(255,255,255,0.7)',bold:true},
      {x:138,y:44,w:88,h:4,rx:2,fill:'rgba(255,255,255,0.15)'},
      {type:'circle',cx:155,cy:98,r:8,fill:'rgba(124,58,237,0.4)'},{type:'circle',cx:210,cy:98,r:8,fill:'rgba(124,58,237,0.4)'},
    ]),
    html: id => `<section id="${id}" class="cus-section" style="background:#0f0f1a;padding:80px 52px;">
      <button class="drag-handle" title="Taşı">⠿</button>
      <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;max-width:1100px;margin:0 auto;">
        <div>
          <h1 class="editable" data-key="${id}-h" style="font-size:clamp(1.8rem,4vw,3rem);font-weight:900;color:#fff;margin-bottom:16px;line-height:1.2;" contenteditable="false">Güçlü Başlık — Dikkat Çeken İfade</h1>
          <p class="editable" data-key="${id}-p" style="color:rgba(255,255,255,.6);font-size:1.05rem;margin-bottom:28px;line-height:1.7;" contenteditable="false">Ürününüzün veya hizmetinizin en önemli avantajını vurgulayan bir paragraf.</p>
          <a href="#" class="editable" data-key="${id}-btn" style="display:inline-flex;align-items:center;padding:13px 32px;background:var(--primary,#7C3AED);color:#fff;border-radius:50px;font-weight:700;text-decoration:none;" contenteditable="false" onclick="return false;">Ücretsiz Başlayın</a>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div style="grid-column:1/-1;padding:22px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;">
            <div class="editable" data-key="${id}-f1i" style="font-size:1.5rem;margin-bottom:8px;" contenteditable="false">⚡</div>
            <div class="editable" data-key="${id}-f1t" style="font-weight:700;color:#fff;margin-bottom:4px;" contenteditable="false">Süper Hızlı</div>
            <div class="editable" data-key="${id}-f1d" style="font-size:.84rem;color:rgba(255,255,255,.5);" contenteditable="false">Milisaniyeler içinde sonuç</div>
          </div>
          <div style="padding:22px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;">
            <div class="editable" data-key="${id}-f2i" style="font-size:1.5rem;margin-bottom:8px;" contenteditable="false">🔒</div>
            <div class="editable" data-key="${id}-f2t" style="font-weight:700;color:#fff;margin-bottom:4px;" contenteditable="false">Güvenli</div>
            <div class="editable" data-key="${id}-f2d" style="font-size:.84rem;color:rgba(255,255,255,.5);" contenteditable="false">256-bit şifreleme</div>
          </div>
          <div style="padding:22px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;">
            <div class="editable" data-key="${id}-f3i" style="font-size:1.5rem;margin-bottom:8px;" contenteditable="false">🌍</div>
            <div class="editable" data-key="${id}-f3t" style="font-weight:700;color:#fff;margin-bottom:4px;" contenteditable="false">Global</div>
            <div class="editable" data-key="${id}-f3d" style="font-size:.84rem;color:rgba(255,255,255,.5);" contenteditable="false">150+ ülke desteği</div>
          </div>
        </div>
      </div>
    </section>`
  },
  {
    name: 'Hero Sayaçlı',
    svg: _thumbSVG([
      {x:0,y:0,w:240,h:140,fill:'#1e3a5f'},
      {x:0,y:98,w:240,h:42,fill:'#162f4e'},
      {type:'text',x:120,y:34,text:'Sonuçlar Konuşuyor',size:10,fill:'#fff',bold:true,anchor:'middle'},
      {type:'text',x:120,y:52,text:'Rakamlar yalan söylemez.',size:7,fill:'rgba(255,255,255,0.55)',anchor:'middle'},
      {x:84,y:62,w:72,h:18,rx:9,fill:'#3B82F6'},
      {type:'text',x:120,y:74,text:'Keşfet →',size:7,fill:'#fff',bold:true,anchor:'middle'},
      {type:'line',x1:0,y1:98,x2:240,y2:98,stroke:'rgba(255,255,255,0.1)',sw:1},
      {type:'text',x:30,y:119,text:'1200+',size:8,fill:'#fff',bold:true,anchor:'middle'},
      {type:'text',x:90,y:119,text:'50K+',size:8,fill:'#fff',bold:true,anchor:'middle'},
      {type:'text',x:150,y:119,text:'15 Yıl',size:8,fill:'#fff',bold:true,anchor:'middle'},
      {type:'text',x:210,y:119,text:'99.9%',size:8,fill:'#fff',bold:true,anchor:'middle'},
      {type:'line',x1:60,y1:104,x2:60,y2:134,stroke:'rgba(255,255,255,0.15)',sw:1},{type:'line',x1:120,y1:104,x2:120,y2:134,stroke:'rgba(255,255,255,0.15)',sw:1},{type:'line',x1:180,y1:104,x2:180,y2:134,stroke:'rgba(255,255,255,0.15)',sw:1},
    ]),
    html: id => `<section id="${id}" class="cus-section" style="background:linear-gradient(135deg,#1e3a5f,#0f2744);padding:0;">
      <button class="drag-handle" title="Taşı">⠿</button>
      <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
      <div style="text-align:center;padding:70px 40px 40px;">
        <h1 class="editable" data-key="${id}-h" style="font-size:clamp(2rem,5vw,3.2rem);font-weight:900;color:#fff;margin-bottom:14px;" contenteditable="false">Sonuçlar Konuşuyor</h1>
        <p class="editable" data-key="${id}-p" style="color:rgba(255,255,255,.65);font-size:1.05rem;margin-bottom:28px;max-width:560px;margin-left:auto;margin-right:auto;" contenteditable="false">Rakamlar yalan söylemez. İşte yıllarca süren çalışmamızın somut kanıtı.</p>
        <a href="#" class="editable" data-key="${id}-btn" style="display:inline-flex;align-items:center;padding:12px 30px;background:#3B82F6;color:#fff;border-radius:50px;font-weight:700;text-decoration:none;" contenteditable="false" onclick="return false;">Keşfet →</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0;border-top:1px solid rgba(255,255,255,.08);">
        ${[['1.200+','Proje'],['50K+','Kullanıcı'],['15','Yıl'],['99.9%','Uptime']].map(([n,l],i) =>
          `<div style="padding:28px 20px;text-align:center;${i>0?'border-left:1px solid rgba(255,255,255,.08)':''}">
            <div class="editable" data-key="${id}-n${i}" style="font-size:2rem;font-weight:900;color:#fff;" contenteditable="false">${n}</div>
            <div class="editable" data-key="${id}-l${i}" style="font-size:.82rem;color:rgba(255,255,255,.5);margin-top:4px;" contenteditable="false">${l}</div>
          </div>`).join('')}
      </div>
    </section>`
  }
);

// ABOUT — 2 extra
SECTION_TEMPLATES_DATA.about.push(
  {
    name: 'Zaman Çizelgesi',
    svg: _thumbSVG([
      {x:0,y:0,w:240,h:140,fill:'#ffffff'},
      {type:'text',x:120,y:18,text:'Hikayemiz',size:10,fill:'#1f2937',bold:true,anchor:'middle'},
      {x:117,y:30,w:6,h:104,fill:'rgba(124,58,237,0.2)'},
      {x:8,y:34,w:100,h:26,rx:8,fill:'#f5f3ff'},{x:8,y:76,w:100,h:26,rx:8,fill:'#f5f3ff'},
      {x:132,y:55,w:100,h:26,rx:8,fill:'#f5f3ff'},{x:132,y:97,w:100,h:26,rx:8,fill:'#f5f3ff'},
      {type:'circle',cx:120,cy:47,r:5,fill:'#7C3AED'},{type:'circle',cx:120,cy:68,r:5,fill:'#7C3AED'},{type:'circle',cx:120,cy:89,r:5,fill:'#7C3AED'},{type:'circle',cx:120,cy:110,r:5,fill:'#7C3AED'},
      {type:'text',x:14,y:44,text:'2014  Kuruluş',size:6.5,fill:'#7C3AED',bold:true},
      {type:'text',x:14,y:86,text:'2021  Uluslararası',size:6.5,fill:'#7C3AED',bold:true},
      {type:'text',x:138,y:65,text:'2018  Büyüme',size:6.5,fill:'#7C3AED',bold:true},
      {type:'text',x:138,y:107,text:'2024  Bugün',size:6.5,fill:'#7C3AED',bold:true},
    ]),
    html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
      <button class="drag-handle" title="Taşı">⠿</button>
      <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
      <div style="max-width:760px;margin:0 auto;">
        <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:48px;" contenteditable="false">Hikayemiz</h2>
        <div style="position:relative;">
          <div style="position:absolute;left:50%;transform:translateX(-50%);top:0;bottom:0;width:3px;background:rgba(124,58,237,.15);"></div>
          ${[['2014','Kuruluş','Küçük bir ofiste, büyük hayallerle yola çıktık.'],
             ['2018','Büyüme','Ekibimizi 20 kişiye çıkardık ve ilk büyük projemizi teslim ettik.'],
             ['2021','Uluslararası','Avrupa pazarına açıldık ve 500+ müşteriye ulaştık.'],
             ['2024','Bugün','Sektörün öncü firmalarından biri olarak hizmet veriyoruz.']
            ].map(([yr,t,d], i) => {
              const left = i % 2 === 0;
              return `<div style="display:flex;justify-content:${left ? 'flex-start' : 'flex-end'};margin-bottom:32px;position:relative;">
                <div style="width:45%;padding:22px 24px;background:var(--light,#f5f3ff);border-radius:14px;border:1px solid rgba(0,0,0,.06);">
                  <div class="editable" data-key="${id}-yr${i}" style="font-size:.8rem;font-weight:700;color:var(--primary,#7C3AED);margin-bottom:6px;" contenteditable="false">${yr}</div>
                  <h3 class="editable" data-key="${id}-t${i}" style="font-size:1rem;font-weight:700;color:var(--text,#111);margin-bottom:6px;" contenteditable="false">${t}</h3>
                  <p class="editable" data-key="${id}-d${i}" style="font-size:.86rem;color:rgba(0,0,0,.55);line-height:1.6;margin:0;" contenteditable="false">${d}</p>
                </div>
                <div style="position:absolute;left:50%;transform:translateX(-50%);top:18px;width:18px;height:18px;border-radius:50%;background:var(--primary,#7C3AED);border:3px solid #fff;box-shadow:0 0 0 3px rgba(124,58,237,.2);"></div>
              </div>`;
            }).join('')}
        </div>
      </div>
    </section>`
  },
  {
    name: 'Değerlerimiz',
    svg: _thumbSVG([
      {x:0,y:0,w:240,h:140,fill:'#fdf4ff'},
      {type:'text',x:120,y:18,text:'Temel Değerlerimiz',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
      {x:8,y:30,w:108,h:50,rx:10,fill:'#fff'},{x:124,y:30,w:108,h:50,rx:10,fill:'#fff'},
      {x:8,y:86,w:108,h:50,rx:10,fill:'#fff'},{x:124,y:86,w:108,h:50,rx:10,fill:'#fff'},
      {type:'circle',cx:26,cy:50,r:9,fill:'rgba(124,58,237,0.25)'},{type:'circle',cx:142,cy:50,r:9,fill:'rgba(236,72,153,0.25)'},
      {type:'circle',cx:26,cy:106,r:9,fill:'rgba(16,185,129,0.25)'},{type:'circle',cx:142,cy:106,r:9,fill:'rgba(245,158,11,0.25)'},
      {type:'text',x:40,y:46,text:'Odak',size:7,fill:'#1f2937',bold:true},{type:'text',x:156,y:46,text:'Tutku',size:7,fill:'#1f2937',bold:true},
      {type:'text',x:40,y:102,text:'Sürdürülebilir',size:7,fill:'#1f2937',bold:true},{type:'text',x:156,y:102,text:'Dürüstlük',size:7,fill:'#1f2937',bold:true},
      {x:14,y:58,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.1)'},{x:130,y:58,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.1)'},
      {x:14,y:114,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.1)'},{x:130,y:114,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.1)'},
    ]),
    html: id => `<section id="${id}" class="cus-section" style="background:linear-gradient(135deg,rgba(124,58,237,.06),rgba(236,72,153,.06));">
      <button class="drag-handle" title="Taşı">⠿</button>
      <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
      <div style="max-width:960px;margin:0 auto;text-align:center;">
        <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:10px;" contenteditable="false">Temel Değerlerimiz</h2>
        <p class="editable" data-key="${id}-sub" style="color:rgba(0,0,0,.5);margin-bottom:44px;" contenteditable="false">Bizi biz yapan ilkeler</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;">
          ${[['🎯','#7C3AED','Odak','Hedeflerimize kararlılıkla ilerleriz.'],
             ['❤️','#EC4899','Tutku','Her projede kalbimizi koyarız.'],
             ['🌱','#10B981','Sürdürülebilirlik','Geleceği düşünerek çalışırız.'],
             ['🤝','#F59E0B','Dürüstlük','Şeffaf ve güvenilir partneriz.']
            ].map(([icon,color,title,desc], i) =>
            `<div style="padding:28px 20px;background:var(--bg,#fff);border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,.05);">
              <div style="width:52px;height:52px;border-radius:50%;background:${color}18;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:1.5rem;">
                <span class="editable" data-key="${id}-ic${i}" contenteditable="false">${icon}</span>
              </div>
              <h3 class="editable" data-key="${id}-t${i}" style="font-weight:700;font-size:1rem;color:var(--text,#111);margin-bottom:8px;" contenteditable="false">${title}</h3>
              <p class="editable" data-key="${id}-d${i}" style="font-size:.86rem;color:rgba(0,0,0,.5);line-height:1.65;margin:0;" contenteditable="false">${desc}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`
  }
);

// SERVICES — 2 extra
SECTION_TEMPLATES_DATA.services.push(
  {
    name: 'Adım Adım Süreç',
    svg: _thumbSVG([
      {x:0,y:0,w:240,h:140,fill:'#ffffff'},
      {type:'text',x:120,y:16,text:'Nasıl Çalışıyoruz?',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
      {x:4,y:30,w:54,h:100,rx:10,fill:'rgba(124,58,237,0.08)'},{x:63,y:30,w:54,h:100,rx:10,fill:'rgba(124,58,237,0.08)'},{x:122,y:30,w:54,h:100,rx:10,fill:'rgba(124,58,237,0.08)'},{x:181,y:30,w:55,h:100,rx:10,fill:'rgba(124,58,237,0.08)'},
      {type:'circle',cx:31,cy:54,r:10,fill:'#7C3AED'},{type:'circle',cx:90,cy:54,r:10,fill:'#7C3AED'},{type:'circle',cx:149,cy:54,r:10,fill:'#7C3AED'},{type:'circle',cx:208,cy:54,r:10,fill:'#7C3AED'},
      {type:'text',x:31,y:54,text:'01',size:6,fill:'#fff',bold:true,anchor:'middle'},{type:'text',x:90,y:54,text:'02',size:6,fill:'#fff',bold:true,anchor:'middle'},{type:'text',x:149,y:54,text:'03',size:6,fill:'#fff',bold:true,anchor:'middle'},{type:'text',x:208,y:54,text:'04',size:6,fill:'#fff',bold:true,anchor:'middle'},
      {type:'text',x:31,y:78,text:'Analiz',size:6.5,fill:'#1f2937',bold:true,anchor:'middle'},{type:'text',x:90,y:78,text:'Planlama',size:6.5,fill:'#1f2937',bold:true,anchor:'middle'},{type:'text',x:149,y:78,text:'Üretim',size:6.5,fill:'#1f2937',bold:true,anchor:'middle'},{type:'text',x:208,y:78,text:'Teslimat',size:6.5,fill:'#1f2937',bold:true,anchor:'middle'},
      {x:57,y:51,w:8,h:4,rx:2,fill:'rgba(124,58,237,0.3)'},{x:116,y:51,w:8,h:4,rx:2,fill:'rgba(124,58,237,0.3)'},{x:175,y:51,w:8,h:4,rx:2,fill:'rgba(124,58,237,0.3)'},
    ]),
    html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
      <button class="drag-handle" title="Taşı">⠿</button>
      <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
      <div style="max-width:1050px;margin:0 auto;text-align:center;">
        <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:10px;" contenteditable="false">Nasıl Çalışıyoruz?</h2>
        <p class="editable" data-key="${id}-sub" style="color:rgba(0,0,0,.5);margin-bottom:48px;" contenteditable="false">Basit, şeffaf ve etkili bir süreç</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0;position:relative;">
          ${[['01','Analiz','Projenizi ve hedeflerinizi detaylıca anlıyoruz.'],
             ['02','Planlama','Özel bir yol haritası ve strateji oluşturuyoruz.'],
             ['03','Üretim','Uzman ekibimizle hızlı ve kaliteli üretim yapıyoruz.'],
             ['04','Teslimat','Sonucu test edip onayınıza sunuyoruz.']
            ].map(([step,t,d], i) =>
            `<div style="padding:28px 20px;position:relative;">
              ${i < 3 ? '<div style="position:absolute;top:42px;right:-8px;width:16px;height:16px;border-top:2px solid rgba(124,58,237,.3);border-right:2px solid rgba(124,58,237,.3);transform:rotate(45deg);z-index:1;"></div>' : ''}
              <div style="width:48px;height:48px;border-radius:50%;background:var(--primary,#7C3AED);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:#fff;font-size:.9rem;font-weight:900;">
                <span class="editable" data-key="${id}-step${i}" contenteditable="false">${step}</span>
              </div>
              <h3 class="editable" data-key="${id}-t${i}" style="font-weight:700;font-size:1rem;color:var(--text,#111);margin-bottom:8px;" contenteditable="false">${t}</h3>
              <p class="editable" data-key="${id}-d${i}" style="font-size:.86rem;color:rgba(0,0,0,.5);line-height:1.65;margin:0;" contenteditable="false">${d}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`
  },
  {
    name: 'Hizmetler Alternatif',
    svg: _thumbSVG([
      {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
      {type:'text',x:120,y:14,text:'Hizmetlerimiz',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
      {x:6,y:24,w:228,h:26,rx:8,fill:'#fff'},
      {x:12,y:29,w:18,h:16,rx:6,fill:'rgba(124,58,237,0.2)'},{type:'text',x:36,y:39,text:'Web Tasarım',size:7,fill:'#1f2937',bold:true},{x:36,y:44,w:100,h:3,rx:1,fill:'rgba(31,41,55,0.12)'},{x:200,y:31,w:28,h:14,rx:7,fill:'#7C3AED'},
      {x:6,y:55,w:228,h:26,rx:8,fill:'#fff'},
      {x:12,y:60,w:18,h:16,rx:6,fill:'rgba(16,185,129,0.2)'},{type:'text',x:36,y:70,text:'Dijital Pazarlama',size:7,fill:'#1f2937',bold:true},{x:36,y:75,w:100,h:3,rx:1,fill:'rgba(31,41,55,0.12)'},{x:200,y:62,w:28,h:14,rx:7,fill:'#10B981'},
      {x:6,y:86,w:228,h:26,rx:8,fill:'#fff'},
      {x:12,y:91,w:18,h:16,rx:6,fill:'rgba(245,158,11,0.2)'},{type:'text',x:36,y:101,text:'Grafik Tasarım',size:7,fill:'#1f2937',bold:true},{x:36,y:106,w:100,h:3,rx:1,fill:'rgba(31,41,55,0.12)'},{x:200,y:93,w:28,h:14,rx:7,fill:'#F59E0B'},
      {x:6,y:117,w:228,h:20,rx:8,fill:'#fff'},
      {x:12,y:122,w:18,h:12,rx:5,fill:'rgba(236,72,153,0.2)'},{type:'text',x:36,y:132,text:'SEO Optimizasyon',size:7,fill:'#1f2937',bold:true},{x:200,y:124,w:28,h:10,rx:5,fill:'#EC4899'},
    ]),
    html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);">
      <button class="drag-handle" title="Taşı">⠿</button>
      <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
      <div style="max-width:860px;margin:0 auto;">
        <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:36px;" contenteditable="false">Hizmetlerimiz</h2>
        <div style="display:flex;flex-direction:column;gap:14px;">
          ${[['⚙️','#7C3AED','Web Tasarım','Markanızı yansıtan modern ve dönüşüm odaklı web siteleri.'],
             ['📈','#10B981','Dijital Pazarlama','Hedef kitlenize ulaşın, satışlarınızı artırın.'],
             ['🎨','#F59E0B','Grafik Tasarım','Logo, kurumsal kimlik ve sosyal medya görselleri.'],
             ['🔍','#EC4899','SEO Optimizasyon','Arama motorlarında üst sıralara çıkın, organik trafik kazanın.']
            ].map(([icon,color,title,desc], i) =>
            `<div style="display:flex;align-items:center;gap:20px;padding:22px 24px;background:var(--bg,#fff);border-radius:14px;border:1px solid rgba(0,0,0,.06);">
              <div style="width:56px;height:56px;flex-shrink:0;border-radius:14px;background:${color}18;display:flex;align-items:center;justify-content:center;font-size:1.6rem;">
                <span class="editable" data-key="${id}-ic${i}" contenteditable="false">${icon}</span>
              </div>
              <div style="flex:1;">
                <h3 class="editable" data-key="${id}-t${i}" style="font-weight:700;color:var(--text,#111);margin-bottom:4px;" contenteditable="false">${title}</h3>
                <p class="editable" data-key="${id}-d${i}" style="font-size:.87rem;color:rgba(0,0,0,.5);margin:0;" contenteditable="false">${desc}</p>
              </div>
              <a href="#" style="padding:8px 18px;background:${color};color:#fff;border-radius:20px;font-size:.8rem;font-weight:600;text-decoration:none;white-space:nowrap;" onclick="return false;">Detay</a>
            </div>`).join('')}
        </div>
      </div>
    </section>`
  }
);

// CONTACT — 1 extra
SECTION_TEMPLATES_DATA.contact.push({
  name: 'WhatsApp İletişim',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#f0fdf4'},
    {type:'text',x:120,y:22,text:'Hızlı Destek Alın',size:9,fill:'#111',bold:true,anchor:'middle'},
    {type:'text',x:120,y:36,text:'WhatsApp\'tan mesaj atın, yanıt verelim.',size:6.5,fill:'rgba(0,0,0,0.5)',anchor:'middle'},
    {x:30,y:50,w:180,h:34,rx:17,fill:'#25D366'},
    {type:'text',x:120,y:70,text:'WhatsApp\'tan Yaz',size:8,fill:'#fff',bold:true,anchor:'middle'},
    {x:50,y:96,w:60,h:18,rx:9,fill:'rgba(37,211,102,0.2)'},{x:130,y:96,w:60,h:18,rx:9,fill:'rgba(37,211,102,0.2)'},
    {type:'text',x:80,y:108,text:'Ara',size:7,fill:'#374151',anchor:'middle'},{type:'text',x:160,y:108,text:'E-posta',size:7,fill:'#374151',anchor:'middle'},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:#f0fdf4;text-align:center;">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:560px;margin:0 auto;">
      <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:#111;margin-bottom:10px;" contenteditable="false">Hızlı Destek Alın</h2>
      <p class="editable" data-key="${id}-sub" style="color:rgba(0,0,0,.55);margin-bottom:32px;" contenteditable="false">WhatsApp'tan mesaj atın, dakikalar içinde yanıt verelim.</p>
      <div style="display:flex;flex-direction:column;gap:14px;align-items:center;">
        <a href="https://wa.me/905301234567" style="display:inline-flex;align-items:center;gap:12px;padding:16px 36px;background:#25D366;color:#fff;border-radius:50px;font-size:1.05rem;font-weight:700;text-decoration:none;box-shadow:0 6px 24px rgba(37,211,102,.3);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span class="editable" data-key="${id}-btn" contenteditable="false">WhatsApp'tan Yaz</span>
        </a>
        <div style="display:flex;gap:24px;margin-top:8px;">
          <a href="tel:+905301234567" style="display:flex;align-items:center;gap:6px;color:#374151;text-decoration:none;font-size:.9rem;">
            <span>📞</span><span class="editable" data-key="${id}-phone" contenteditable="false">+90 530 123 45 67</span>
          </a>
          <a href="mailto:info@site.com" style="display:flex;align-items:center;gap:6px;color:#374151;text-decoration:none;font-size:.9rem;">
            <span>📧</span><span class="editable" data-key="${id}-email" contenteditable="false">info@site.com</span>
          </a>
        </div>
      </div>
    </div>
  </section>`
});

// PRODUCTS — 1 extra
SECTION_TEMPLATES_DATA.products.push({
  name: 'Öne Çıkan Ürün',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#ffffff'},
    {x:6,y:8,w:110,h:124,rx:10,fill:'rgba(124,58,237,0.15)'},
    {type:'circle',cx:61,cy:58,r:16,fill:'rgba(124,58,237,0.4)'},
    {type:'text',x:124,y:24,text:'Öne Çıkan Ürün',size:6.5,fill:'#7C3AED',bold:true},
    {type:'text',x:124,y:38,text:'Ürün Adı ve Slogan',size:9,fill:'#1f2937',bold:true},
    {x:124,y:48,w:100,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},{x:124,y:56,w:92,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},{x:124,y:64,w:84,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
    {type:'text',x:124,y:84,text:'₺499',size:14,fill:'#7C3AED',bold:true},
    {x:124,y:96,w:80,h:18,rx:9,fill:'rgba(124,58,237,0.15)'},
    {x:124,y:120,w:80,h:18,rx:9,fill:'#7C3AED'},
    {type:'text',x:164,y:132,text:'Satın Al',size:7,fill:'#fff',bold:true,anchor:'middle'},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:960px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
      <div class="img-zone" data-img-key="${id}-img" style="aspect-ratio:1;border-radius:20px;background:rgba(124,58,237,.1);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
        <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="36"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Ürün Fotoğrafı</div>
      </div>
      <div>
        <div class="editable" data-key="${id}-cat" style="font-size:.78rem;font-weight:700;color:var(--primary,#7C3AED);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;" contenteditable="false">Öne Çıkan Ürün</div>
        <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:14px;line-height:1.25;" contenteditable="false">Ürün Adı ve Kısa Slogan</h2>
        <p class="editable" data-key="${id}-desc" style="color:rgba(0,0,0,.55);line-height:1.7;margin-bottom:24px;" contenteditable="false">Ürününüzün özelliklerini ve faydalarını anlatan açıklama metni. Müşteriyi ikna edecek bilgileri buraya yazın.</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
          ${['✓ Yüksek Kalite','✓ Hızlı Teslimat','✓ Garanti'].map((f,i) =>
            `<span class="editable" data-key="${id}-tag${i}" style="padding:5px 12px;background:var(--light,#f5f3ff);border-radius:20px;font-size:.8rem;color:var(--text,#111);" contenteditable="false">${f}</span>`).join('')}
        </div>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;">
          <span class="editable" data-key="${id}-price" style="font-size:2rem;font-weight:900;color:var(--primary,#7C3AED);" contenteditable="false">₺499</span>
          <span class="editable" data-key="${id}-old" style="font-size:1.1rem;color:rgba(0,0,0,.35);text-decoration:line-through;" contenteditable="false">₺799</span>
        </div>
        <a href="#" style="display:inline-flex;align-items:center;gap:8px;padding:14px 32px;background:var(--primary,#7C3AED);color:#fff;border-radius:50px;font-weight:700;text-decoration:none;" onclick="return false;">Şimdi Satın Al</a>
      </div>
    </div>
  </section>`
});

// FEATURES — 1 extra
SECTION_TEMPLATES_DATA.features.push({
  name: 'Önce / Sonra',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#ffffff'},
    {type:'text',x:120,y:13,text:'Farkı Görün',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {x:6,y:24,w:108,h:112,rx:10,fill:'rgba(239,68,68,0.08)'},
    {x:126,y:24,w:108,h:112,rx:10,fill:'rgba(16,185,129,0.08)'},
    {type:'text',x:60,y:38,text:'✗ Rakipler',size:7,fill:'#EF4444',bold:true,anchor:'middle'},
    {type:'text',x:180,y:38,text:'✓ Biz',size:7,fill:'#10B981',bold:true,anchor:'middle'},
    {x:12,y:46,w:96,h:5,rx:2,fill:'rgba(239,68,68,0.25)'},{x:132,y:46,w:96,h:5,rx:2,fill:'rgba(16,185,129,0.25)'},
    {x:12,y:56,w:96,h:5,rx:2,fill:'rgba(239,68,68,0.25)'},{x:132,y:56,w:96,h:5,rx:2,fill:'rgba(16,185,129,0.25)'},
    {x:12,y:66,w:96,h:5,rx:2,fill:'rgba(239,68,68,0.25)'},{x:132,y:66,w:96,h:5,rx:2,fill:'rgba(16,185,129,0.25)'},
    {x:12,y:76,w:96,h:5,rx:2,fill:'rgba(239,68,68,0.25)'},{x:132,y:76,w:96,h:5,rx:2,fill:'rgba(16,185,129,0.25)'},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:900px;margin:0 auto;text-align:center;">
      <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Farkı Görün</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;text-align:left;">
        <div style="padding:28px;background:rgba(239,68,68,.05);border:1.5px solid rgba(239,68,68,.2);border-radius:16px;">
          <div style="font-weight:800;color:#EF4444;margin-bottom:18px;font-size:1rem;">✗ Rakipler</div>
          ${['Yüksek fiyat, düşük kalite','Yavaş teslimat süreleri','Müşteri desteği yok','Gizli ücretler'].map((t,i) =>
            `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
              <span style="color:#EF4444;font-weight:700;flex-shrink:0;">✗</span>
              <span class="editable" data-key="${id}-b${i}" style="font-size:.9rem;color:rgba(0,0,0,.6);" contenteditable="false">${t}</span>
            </div>`).join('')}
        </div>
        <div style="padding:28px;background:rgba(16,185,129,.05);border:1.5px solid rgba(16,185,129,.3);border-radius:16px;">
          <div style="font-weight:800;color:#10B981;margin-bottom:18px;font-size:1rem;">✓ Biz</div>
          ${['Şeffaf fiyatlandırma','24 saat içinde teslimat','7/24 müşteri desteği','Sıfır gizli ücret'].map((t,i) =>
            `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
              <span style="color:#10B981;font-weight:700;flex-shrink:0;">✓</span>
              <span class="editable" data-key="${id}-a${i}" style="font-size:.9rem;color:rgba(0,0,0,.7);" contenteditable="false">${t}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </section>`
});

// PRICING — 1 extra
SECTION_TEMPLATES_DATA.pricing.push({
  name: 'Sade Fiyat Listesi',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#f8f7ff'},
    {type:'text',x:120,y:12,text:'Fiyat Listesi',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {x:8,y:24,w:224,h:22,rx:7,fill:'#ffffff'},{type:'text',x:18,y:37,text:'Web Site Tasarımı',size:7,fill:'#374151'},{type:'text',x:222,y:37,text:'₺2.500',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:8,y:50,w:224,h:22,rx:7,fill:'#ffffff'},{type:'text',x:18,y:63,text:'Logo Tasarımı',size:7,fill:'#374151'},{type:'text',x:222,y:63,text:'₺800',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:8,y:76,w:224,h:22,rx:7,fill:'#ffffff'},{type:'text',x:18,y:89,text:'SEO Paketi',size:7,fill:'#374151'},{type:'text',x:222,y:89,text:'₺1.200/ay',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:8,y:102,w:224,h:22,rx:7,fill:'#ffffff'},{type:'text',x:18,y:115,text:'Sosyal Medya Yönetimi',size:7,fill:'#374151'},{type:'text',x:222,y:115,text:'₺1.800/ay',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {type:'line',x1:8,y1:48,x2:232,y2:48,stroke:'rgba(0,0,0,0.06)',sw:1},
    {type:'line',x1:8,y1:74,x2:232,y2:74,stroke:'rgba(0,0,0,0.06)',sw:1},
    {type:'line',x1:8,y1:100,x2:232,y2:100,stroke:'rgba(0,0,0,0.06)',sw:1},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:700px;margin:0 auto;">
      <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:36px;" contenteditable="false">Fiyat Listesi</h2>
      <div style="background:var(--bg,#fff);border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,.06);">
        ${[['Web Site Tasarımı','Kurumsal, 5 sayfa, responsive','₺2.500'],
           ['Logo Tasarımı','Vektörel, 3 konsept, revize hakkı','₺800'],
           ['SEO Paketi','Aylık, 10 anahtar kelime','₺1.200/ay'],
           ['Sosyal Medya Yönetimi','Haftalık 5 paylaşım, raporlama','₺1.800/ay'],
           ['Mobil Uygulama','iOS + Android, temel özellikler','₺15.000+']
          ].map(([name,desc,price], i) =>
          `<div style="display:flex;align-items:center;gap:16px;padding:18px 22px;${i>0 ? 'border-top:1px solid rgba(0,0,0,.05)' : ''};">
            <div style="flex:1;">
              <div class="editable" data-key="${id}-n${i}" style="font-weight:700;font-size:.95rem;color:var(--text,#111);" contenteditable="false">${name}</div>
              <div class="editable" data-key="${id}-d${i}" style="font-size:.8rem;color:rgba(0,0,0,.45);margin-top:2px;" contenteditable="false">${desc}</div>
            </div>
            <div class="editable" data-key="${id}-p${i}" style="font-weight:800;font-size:1rem;color:var(--primary,#7C3AED);white-space:nowrap;" contenteditable="false">${price}</div>
          </div>`).join('')}
      </div>
      <p style="text-align:center;font-size:.8rem;color:rgba(0,0,0,.4);margin-top:14px;">* Fiyatlar KDV hariçtir. Teklif için iletişime geçin.</p>
    </div>
  </section>`
});

// TESTIMONIALS — 1 extra
SECTION_TEMPLATES_DATA.testimonials.push({
  name: 'Büyük Alıntı',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#1e1b4b'},
    {type:'text',x:20,y:28,text:'"',size:36,fill:'rgba(167,139,250,0.3)',bold:true},
    {type:'text',x:120,y:48,text:'Bu ürün işlerimizi',size:7,fill:'rgba(255,255,255,0.75)',anchor:'middle'},
    {type:'text',x:120,y:60,text:'inanılmaz ölçüde',size:7,fill:'rgba(255,255,255,0.75)',anchor:'middle'},
    {type:'text',x:120,y:72,text:'kolaylaştırdı.',size:7,fill:'rgba(255,255,255,0.75)',anchor:'middle'},
    {type:'circle',cx:96,cy:104,r:12,fill:'rgba(124,58,237,0.7)'},
    {type:'text',x:96,y:105,text:'A',size:9,fill:'#fff',bold:true,anchor:'middle'},
    {type:'text',x:114,y:101,text:'Müşteri Adı',size:7,fill:'rgba(255,255,255,0.9)',bold:true},
    {type:'text',x:114,y:112,text:'CEO, Şirket',size:6,fill:'rgba(255,255,255,0.5)'},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:linear-gradient(135deg,var(--primary,#7C3AED),var(--secondary,#5B21B6));text-align:center;padding:80px 40px;">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:740px;margin:0 auto;">
      <div style="font-size:4rem;color:rgba(255,255,255,.2);line-height:1;margin-bottom:16px;">"</div>
      <p class="editable" data-key="${id}-q" style="font-size:clamp(1.1rem,2.5vw,1.5rem);color:#fff;font-style:italic;line-height:1.7;margin-bottom:36px;font-weight:300;" contenteditable="false">Bu ürün / hizmet sayesinde işlerimiz inanılmaz ölçüde kolaylaştı. Sadece 3 ayda hem verimliliğimizi hem de müşteri memnuniyetimizi ikiye katladık. Kesinlikle tavsiye ediyorum!</p>
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;">
        <div style="width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;color:#fff;overflow:hidden;position:relative;" class="img-zone" data-img-key="${id}-av">
          <span class="editable" data-key="${id}-avt" contenteditable="false">A</span>
          <div class="img-upload-hint" style="border-radius:50%;">+</div>
        </div>
        <div style="text-align:left;">
          <div class="editable" data-key="${id}-name" style="color:#fff;font-weight:700;" contenteditable="false">Müşteri Adı Soyadı</div>
          <div class="editable" data-key="${id}-role" style="color:rgba(255,255,255,.6);font-size:.85rem;" contenteditable="false">CEO, Şirket Adı</div>
        </div>
      </div>
    </div>
  </section>`
});

// STATS — 1 extra
SECTION_TEMPLATES_DATA.stats.push({
  name: 'İlerleme Çubukları',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#ffffff'},
    {type:'text',x:8,y:12,text:'Uzmanlık Alanlarımız',size:9,fill:'#1f2937',bold:true},
    {type:'text',x:8,y:26,text:'Yıllarca geliştirdiğimiz beceriler.',size:6,fill:'#6b7280'},
    {type:'text',x:8,y:44,text:'Web Tasarım',size:7,fill:'#374151',bold:true},{type:'text',x:232,y:44,text:'90%',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:8,y:48,w:224,h:7,rx:3,fill:'rgba(124,58,237,0.12)'},{x:8,y:48,w:202,h:7,rx:3,fill:'#7C3AED'},
    {type:'text',x:8,y:68,text:'Mobil Uygulama',size:7,fill:'#374151',bold:true},{type:'text',x:232,y:68,text:'75%',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:8,y:72,w:224,h:7,rx:3,fill:'rgba(124,58,237,0.12)'},{x:8,y:72,w:168,h:7,rx:3,fill:'#7C3AED'},
    {type:'text',x:8,y:92,text:'SEO & Pazarlama',size:7,fill:'#374151',bold:true},{type:'text',x:232,y:92,text:'85%',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:8,y:96,w:224,h:7,rx:3,fill:'rgba(124,58,237,0.12)'},{x:8,y:96,w:190,h:7,rx:3,fill:'#7C3AED'},
    {type:'text',x:8,y:116,text:'Grafik Tasarım',size:7,fill:'#374151',bold:true},{type:'text',x:232,y:116,text:'70%',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:8,y:120,w:224,h:7,rx:3,fill:'rgba(124,58,237,0.12)'},{x:8,y:120,w:157,h:7,rx:3,fill:'#7C3AED'},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:840px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:center;">
      <div>
        <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:14px;" contenteditable="false">Uzmanlık Alanlarımız</h2>
        <p class="editable" data-key="${id}-sub" style="color:rgba(0,0,0,.5);line-height:1.7;" contenteditable="false">Yıllarca geliştirdiğimiz beceriler ve teknik yetkinliklerimiz.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;">
        ${[['Web Tasarım','90'],['Mobil Uygulama','75'],['SEO & Pazarlama','85'],['Grafik Tasarım','70']].map(([label,pct], i) =>
          `<div>
            <div style="display:flex;justify-content:space-between;margin-bottom:7px;">
              <span class="editable" data-key="${id}-l${i}" style="font-size:.9rem;font-weight:600;color:var(--text,#111);" contenteditable="false">${label}</span>
              <span class="editable" data-key="${id}-p${i}" style="font-size:.85rem;font-weight:700;color:var(--primary,#7C3AED);" contenteditable="false">${pct}%</span>
            </div>
            <div style="height:8px;background:rgba(124,58,237,.12);border-radius:50px;overflow:hidden;">
              <div style="height:100%;width:${pct}%;background:var(--primary,#7C3AED);border-radius:50px;"></div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`
});

// CTA — 1 extra
SECTION_TEMPLATES_DATA.cta.push({
  name: 'Bülten Aboneliği',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
    {type:'text',x:120,y:22,text:'Güncel Kalın',size:11,fill:'#1f2937',bold:true,anchor:'middle'},
    {type:'text',x:120,y:38,text:'Yeni içerikler için bültene katılın.',size:6.5,fill:'#6b7280',anchor:'middle'},
    {x:14,y:52,w:160,h:26,rx:8,fill:'#ffffff'},
    {type:'text',x:24,y:67,text:'E-posta adresiniz...',size:7,fill:'rgba(107,114,128,0.8)'},
    {x:178,y:52,w:50,h:26,rx:8,fill:'#7C3AED'},
    {type:'text',x:203,y:67,text:'Abone Ol',size:6,fill:'#fff',bold:true,anchor:'middle'},
    {type:'text',x:120,y:96,text:'Spam göndermiyoruz. İstediğiniz zaman çıkabilirsiniz.',size:5.5,fill:'rgba(107,114,128,0.7)',anchor:'middle'},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);text-align:center;">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:560px;margin:0 auto;">
      <h2 class="editable" data-key="${id}-h" style="font-size:clamp(1.4rem,3vw,2rem);font-weight:900;color:var(--text,#111);margin-bottom:10px;" contenteditable="false">Güncel Kalın</h2>
      <p class="editable" data-key="${id}-sub" style="color:rgba(0,0,0,.55);margin-bottom:28px;" contenteditable="false">Yeni içerikler, fırsatlar ve haberler için bültene katılın.</p>
      <form style="display:flex;gap:8px;max-width:440px;margin:0 auto 14px;" onsubmit="return false;">
        <input type="email" placeholder="E-posta adresiniz" style="flex:1;padding:13px 16px;border:1.5px solid rgba(0,0,0,.12);border-radius:10px;font-size:.92rem;outline:none;">
        <button type="submit" style="padding:13px 22px;background:var(--primary,#7C3AED);color:#fff;border:none;border-radius:10px;font-size:.9rem;font-weight:700;cursor:pointer;white-space:nowrap;">
          <span class="editable" data-key="${id}-btn" contenteditable="false">Abone Ol</span>
        </button>
      </form>
      <p class="editable" data-key="${id}-note" style="font-size:.75rem;color:rgba(0,0,0,.35);" contenteditable="false">Spam göndermiyoruz. İstediğiniz zaman çıkabilirsiniz.</p>
    </div>
  </section>`
});

// GALLERY — 1 extra
SECTION_TEMPLATES_DATA.gallery.push({
  name: 'Galeri Büyük-Küçük',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#ffffff'},
    {type:'text',x:120,y:12,text:'Çalışmalarımız',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {x:6,y:22,w:118,h:112,rx:10,fill:'rgba(124,58,237,0.18)'},
    {type:'circle',cx:65,cy:68,r:20,fill:'rgba(124,58,237,0.35)'},
    {type:'text',x:65,y:69,text:'Ana',size:7,fill:'#7C3AED',bold:true,anchor:'middle'},
    {x:130,y:22,w:52,h:52,rx:8,fill:'rgba(124,58,237,0.12)'},{type:'circle',cx:156,cy:48,r:10,fill:'rgba(124,58,237,0.3)'},
    {x:188,y:22,w:46,h:52,rx:8,fill:'rgba(124,58,237,0.12)'},{type:'circle',cx:211,cy:48,r:10,fill:'rgba(124,58,237,0.3)'},
    {x:130,y:80,w:52,h:54,rx:8,fill:'rgba(124,58,237,0.12)'},{type:'circle',cx:156,cy:107,r:10,fill:'rgba(124,58,237,0.3)'},
    {x:188,y:80,w:46,h:54,rx:8,fill:'rgba(124,58,237,0.12)'},{type:'circle',cx:211,cy:107,r:10,fill:'rgba(124,58,237,0.3)'},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:1100px;margin:0 auto;">
      <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:36px;" contenteditable="false">Çalışmalarımız</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:14px;">
        <div class="img-zone" data-img-key="${id}-img1" style="grid-row:1/3;border-radius:16px;background:rgba(124,58,237,.1);min-height:280px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
          <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Ana Görsel</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          ${[2,3,4,5].map(n => `<div class="img-zone" data-img-key="${id}-img${n}" style="border-radius:12px;background:rgba(124,58,237,.08);aspect-ratio:1;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
            <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>`
});

// TEAM — 1 extra
SECTION_TEMPLATES_DATA.team.push({
  name: 'Öne Çıkan Kişi',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
    {x:6,y:8,w:108,h:124,rx:12,fill:'rgba(124,58,237,0.18)'},
    {type:'circle',cx:60,cy:55,r:26,fill:'rgba(124,58,237,0.5)'},
    {type:'text',x:60,y:56,text:'AB',size:13,fill:'#fff',bold:true,anchor:'middle'},
    {x:20,y:90,w:80,h:6,rx:3,fill:'rgba(255,255,255,0.7)'},{x:24,y:100,w:72,h:5,rx:2,fill:'rgba(255,255,255,0.5)'},
    {type:'text',x:124,y:22,text:'Genel Müdür',size:6.5,fill:'#7C3AED',bold:true},
    {type:'text',x:124,y:36,text:'Ad Soyad',size:10,fill:'#1f2937',bold:true},
    {x:124,y:48,w:100,h:5,rx:2,fill:'rgba(31,41,55,0.18)'},{x:124,y:57,w:95,h:5,rx:2,fill:'rgba(31,41,55,0.18)'},{x:124,y:66,w:88,h:5,rx:2,fill:'rgba(31,41,55,0.18)'},{x:124,y:75,w:80,h:5,rx:2,fill:'rgba(31,41,55,0.18)'},
    {x:124,y:92,w:46,h:16,rx:8,fill:'#7C3AED'},{type:'text',x:147,y:101,text:'LinkedIn',size:6,fill:'#fff',bold:true,anchor:'middle'},
    {x:176,y:92,w:46,h:16,rx:8,fill:'rgba(124,58,237,0.15)'},{type:'text',x:199,y:101,text:'E-posta',size:6,fill:'#7C3AED',bold:true,anchor:'middle'},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:var(--light,#f5f3ff);">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:860px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
      <div class="img-zone" data-img-key="${id}-img" style="border-radius:20px;aspect-ratio:4/5;background:rgba(124,58,237,.15);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;">
        <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="36"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Fotoğraf</div>
      </div>
      <div>
        <div class="editable" data-key="${id}-role" style="font-size:.78rem;font-weight:700;color:var(--primary,#7C3AED);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;" contenteditable="false">Genel Müdür</div>
        <h2 class="editable" data-key="${id}-name" style="font-size:clamp(1.5rem,3vw,2rem);font-weight:900;color:var(--text,#111);margin-bottom:16px;" contenteditable="false">Ad Soyad</h2>
        <p class="editable" data-key="${id}-bio" style="color:rgba(0,0,0,.55);line-height:1.75;margin-bottom:24px;" contenteditable="false">Kişinin kısa biyografisi ve uzmanlık alanları hakkında birkaç cümle. Vizyon, değerler ve başarılar burada paylaşılabilir.</p>
        <div style="display:flex;gap:10px;">
          <a href="#" style="padding:9px 20px;background:var(--primary,#7C3AED);color:#fff;border-radius:20px;font-size:.84rem;font-weight:600;text-decoration:none;" onclick="return false;">LinkedIn</a>
          <a href="#" style="padding:9px 20px;background:var(--light,#f5f3ff);color:var(--text,#111);border:1px solid rgba(0,0,0,.1);border-radius:20px;font-size:.84rem;font-weight:600;text-decoration:none;" onclick="return false;">E-posta</a>
        </div>
      </div>
    </div>
  </section>`
});

// FAQ — 1 extra
SECTION_TEMPLATES_DATA.faq.push({
  name: 'SSS İki Sütun',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#ffffff'},
    {type:'text',x:120,y:12,text:'Sık Sorulan Sorular',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {x:4,y:22,w:112,h:26,rx:8,fill:'#f5f3ff'},{type:'text',x:12,y:32,text:'Teslimat süresi?',size:7,fill:'#374151',bold:true},{x:12,y:38,w:88,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
    {x:4,y:52,w:112,h:26,rx:8,fill:'#f5f3ff'},{type:'text',x:12,y:62,text:'İade politikası?',size:7,fill:'#374151',bold:true},{x:12,y:68,w:88,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
    {x:4,y:82,w:112,h:26,rx:8,fill:'#f5f3ff'},{type:'text',x:12,y:92,text:'Ödeme yöntemleri?',size:7,fill:'#374151',bold:true},{x:12,y:98,w:88,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
    {x:4,y:112,w:112,h:26,rx:8,fill:'#f5f3ff'},{type:'text',x:12,y:122,text:'Toplu sipariş?',size:7,fill:'#374151',bold:true},{x:12,y:128,w:88,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
    {x:124,y:22,w:112,h:26,rx:8,fill:'#f5f3ff'},{type:'text',x:132,y:32,text:'Garanti süresi?',size:7,fill:'#374151',bold:true},{x:132,y:38,w:88,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
    {x:124,y:52,w:112,h:26,rx:8,fill:'#f5f3ff'},{type:'text',x:132,y:62,text:'Teknik destek?',size:7,fill:'#374151',bold:true},{x:132,y:68,w:88,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
    {x:124,y:82,w:112,h:26,rx:8,fill:'#f5f3ff'},{type:'text',x:132,y:92,text:'Kargo ücreti?',size:7,fill:'#374151',bold:true},{x:132,y:98,w:88,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
    {x:124,y:112,w:112,h:26,rx:8,fill:'#f5f3ff'},{type:'text',x:132,y:122,text:'İptal & değişim?',size:7,fill:'#374151',bold:true},{x:132,y:128,w:88,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
  ]),
  html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
    <button class="drag-handle" title="Taşı">⠿</button>
    <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)">✕ Sil</button></div>
    <div style="max-width:1000px;margin:0 auto;">
      <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Sık Sorulan Sorular</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        ${[['Teslimat ne kadar sürer?','Standart teslimat süresi 3-5 iş günüdür. Ekspres seçeneğiyle 24 saat içinde teslim edebiliriz.'],
           ['İade politikanız nasıl?','Ürün alımından itibaren 30 gün içinde iade edebilirsiniz. Koşulsuz iade garantisi veriyoruz.'],
           ['Ödeme yöntemleri neler?','Kredi kartı, havale/EFT ve PayTR ödeme sistemi ile güvenli ödeme alıyoruz.'],
           ['Toplu sipariş indirimi var mı?','Evet, 10 adedin üzerindeki siparişlerde %15-25 arasında indirim uygulanır.'],
           ['Garanti süresi nedir?','Tüm ürünlerimizde 2 yıl üretici garantisi bulunmaktadır.'],
           ['Teknik destek alabilir miyim?','7/24 teknik destek ekibimiz telefon, e-posta ve canlı sohbet ile hizmetinizdedir.']
          ].map(([q,a], i) =>
          `<div style="padding:18px 20px;background:var(--light,#f5f3ff);border-radius:12px;">
            <h3 class="editable" data-key="${id}-q${i}" style="font-size:.92rem;font-weight:700;color:var(--text,#111);margin-bottom:8px;" contenteditable="false">${q}</h3>
            <p class="editable" data-key="${id}-a${i}" style="font-size:.84rem;color:rgba(0,0,0,.55);line-height:1.65;margin:0;" contenteditable="false">${a}</p>
          </div>`).join('')}
      </div>
    </div>
  </section>`
});

// ═══════════════════════════════════════════════════════════════
// PAGE TEMPLATES DATA
// ═══════════════════════════════════════════════════════════════
const PAGE_CATS = [
  { id: 'contact',    icon: '📞', label: 'İletişim' },
  { id: 'about',      icon: '👤', label: 'Hakkında' },
  { id: 'services',   icon: '⚙️', label: 'Hizmetler' },
  { id: 'portfolio',  icon: '🎨', label: 'Portföy' },
  { id: 'pricing',    icon: '💰', label: 'Fiyatlandırma' },
  { id: 'blog',       icon: '📝', label: 'Blog' },
  { id: 'faq',        icon: '❓', label: 'SSS' },
];

const PAGE_TEMPLATES_DATA = {
  contact: [
    {
      name: 'Tam İletişim Sayfası',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:12,text:'İletişim',size:10,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:4,y:20,w:112,h:116,rx:10,fill:'#f5f3ff'},
        {type:'circle',cx:22,cy:38,r:7,fill:'#7C3AED'},{type:'text',x:34,y:39,text:'Telefon',size:6.5,fill:'#374151',bold:true},{x:34,y:44,w:70,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
        {type:'circle',cx:22,cy:62,r:7,fill:'#7C3AED'},{type:'text',x:34,y:63,text:'E-posta',size:6.5,fill:'#374151',bold:true},{x:34,y:68,w:70,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
        {type:'circle',cx:22,cy:86,r:7,fill:'#7C3AED'},{type:'text',x:34,y:87,text:'Adres',size:6.5,fill:'#374151',bold:true},{x:34,y:92,w:70,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},{x:34,y:98,w:55,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
        {x:120,y:20,w:116,h:116,rx:10,fill:'rgba(124,58,237,0.08)'},
        {type:'text',x:128,y:34,text:'Bize Ulaşın',size:8,fill:'#374151',bold:true},
        {x:128,y:40,w:100,h:12,rx:5,fill:'#ffffff'},{x:128,y:56,w:100,h:12,rx:5,fill:'#ffffff'},{x:128,y:72,w:100,h:22,rx:5,fill:'#ffffff'},
        {x:128,y:98,w:100,h:16,rx:8,fill:'#7C3AED'},{type:'text',x:178,y:108,text:'Gönder',size:7,fill:'#fff',bold:true,anchor:'middle'},
      ]),
      sections: ['contact-form','contact-info']
    },
  ],
  about: [
    {
      name: 'Hakkında Sayfası',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
        {x:0,y:0,w:240,h:48,fill:'#7C3AED'},
        {type:'text',x:120,y:20,text:'Hakkımızda',size:11,fill:'#ffffff',bold:true,anchor:'middle'},
        {type:'text',x:120,y:36,text:'Biz kimiz ve ne yapıyoruz?',size:7,fill:'rgba(255,255,255,0.75)',anchor:'middle'},
        {x:6,y:56,w:108,h:78,rx:10,fill:'rgba(124,58,237,0.2)'},
        {type:'circle',cx:60,cy:88,r:22,fill:'rgba(124,58,237,0.5)'},
        {type:'text',x:60,y:89,text:'Foto',size:7,fill:'#fff',anchor:'middle'},
        {x:120,y:56,w:114,h:36,rx:8,fill:'#ffffff'},
        {type:'text',x:128,y:70,text:'Misyonumuz',size:7.5,fill:'#374151',bold:true},{x:128,y:76,w:98,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},{x:128,y:82,w:80,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
        {x:120,y:98,w:114,h:36,rx:8,fill:'#ffffff'},
        {type:'text',x:128,y:112,text:'250+ Proje  10+ Yıl  98%',size:7,fill:'#7C3AED',bold:true},{x:128,y:118,w:98,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
      ]),
      sections: ['about-image','about-stats']
    },
  ],
  services: [
    {
      name: 'Hizmetler Sayfası',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {x:0,y:0,w:240,h:44,fill:'rgba(124,58,237,0.1)'},
        {type:'text',x:120,y:18,text:'Hizmetlerimiz',size:10,fill:'#1f2937',bold:true,anchor:'middle'},
        {type:'text',x:120,y:34,text:'Size özel çözümler sunuyoruz',size:6.5,fill:'#6b7280',anchor:'middle'},
        {x:6,y:50,w:70,h:86,rx:10,fill:'#f5f3ff'},
        {type:'circle',cx:41,cy:70,r:12,fill:'#7C3AED'},
        {type:'text',x:41,y:71,text:'★',size:10,fill:'#fff',anchor:'middle'},
        {type:'text',x:41,y:91,text:'Web Tasarım',size:6.5,fill:'#374151',bold:true,anchor:'middle'},
        {x:12,y:97,w:58,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},{x:16,y:104,w:50,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
        {x:83,y:50,w:70,h:86,rx:10,fill:'#f5f3ff'},
        {type:'circle',cx:118,cy:70,r:12,fill:'#7C3AED'},
        {type:'text',x:118,y:71,text:'★',size:10,fill:'#fff',anchor:'middle'},
        {type:'text',x:118,y:91,text:'Mobil Uygulama',size:6,fill:'#374151',bold:true,anchor:'middle'},
        {x:89,y:97,w:58,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},{x:93,y:104,w:50,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
        {x:160,y:50,w:74,h:86,rx:10,fill:'#f5f3ff'},
        {type:'circle',cx:197,cy:70,r:12,fill:'#7C3AED'},
        {type:'text',x:197,y:71,text:'★',size:10,fill:'#fff',anchor:'middle'},
        {type:'text',x:197,y:91,text:'SEO & Reklam',size:6.5,fill:'#374151',bold:true,anchor:'middle'},
        {x:166,y:97,w:62,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},{x:170,y:104,w:54,h:4,rx:2,fill:'rgba(31,41,55,0.15)'},
      ]),
      sections: ['services-grid','services-list']
    },
  ],
  portfolio: [
    {
      name: 'Portföy Sayfası',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#0f0f1a'},
        {type:'text',x:120,y:16,text:'Portföyümüz',size:10,fill:'#ffffff',bold:true,anchor:'middle'},
        {x:6,y:26,w:72,h:50,rx:8,fill:'rgba(124,58,237,0.5)'},
        {type:'circle',cx:42,cy:51,r:12,fill:'rgba(255,255,255,0.2)'},
        {x:84,y:26,w:72,h:50,rx:8,fill:'rgba(124,58,237,0.4)'},
        {type:'circle',cx:120,cy:51,r:12,fill:'rgba(255,255,255,0.2)'},
        {x:162,y:26,w:72,h:50,rx:8,fill:'rgba(124,58,237,0.5)'},
        {type:'circle',cx:198,cy:51,r:12,fill:'rgba(255,255,255,0.2)'},
        {x:6,y:82,w:72,h:50,rx:8,fill:'rgba(124,58,237,0.3)'},
        {type:'circle',cx:42,cy:107,r:12,fill:'rgba(255,255,255,0.15)'},
        {x:84,y:82,w:72,h:50,rx:8,fill:'rgba(124,58,237,0.4)'},
        {type:'circle',cx:120,cy:107,r:12,fill:'rgba(255,255,255,0.2)'},
        {x:162,y:82,w:72,h:50,rx:8,fill:'rgba(124,58,237,0.3)'},
        {type:'circle',cx:198,cy:107,r:12,fill:'rgba(255,255,255,0.15)'},
      ]),
      sections: ['gallery-grid']
    },
  ],
  pricing: [
    {
      name: 'Fiyatlandırma Sayfası',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:12,text:'Fiyatlandırma',size:10,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:4,y:22,w:70,h:112,rx:10,fill:'#f5f3ff'},
        {type:'text',x:39,y:38,text:'Başlangıç',size:7,fill:'#374151',bold:true,anchor:'middle'},
        {type:'text',x:39,y:54,text:'₺99/ay',size:9,fill:'#374151',bold:true,anchor:'middle'},
        {x:10,y:62,w:58,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},{x:10,y:70,w:52,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},{x:10,y:78,w:56,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
        {x:10,y:116,w:58,h:14,rx:7,fill:'rgba(124,58,237,0.3)'},{type:'text',x:39,y:124,text:'Seç',size:6,fill:'#7C3AED',bold:true,anchor:'middle'},
        {x:82,y:16,w:76,h:120,rx:10,fill:'#7C3AED'},
        {type:'text',x:120,y:34,text:'Profesyonel',size:7,fill:'#fff',bold:true,anchor:'middle'},
        {type:'text',x:120,y:52,text:'₺299/ay',size:10,fill:'#fff',bold:true,anchor:'middle'},
        {x:88,y:62,w:64,h:4,rx:2,fill:'rgba(255,255,255,0.4)'},{x:88,y:70,w:58,h:4,rx:2,fill:'rgba(255,255,255,0.4)'},{x:88,y:78,w:62,h:4,rx:2,fill:'rgba(255,255,255,0.4)'},
        {x:88,y:116,w:64,h:14,rx:7,fill:'rgba(255,255,255,0.25)'},{type:'text',x:120,y:124,text:'Seç',size:6,fill:'#fff',bold:true,anchor:'middle'},
        {x:164,y:22,w:70,h:112,rx:10,fill:'#f5f3ff'},
        {type:'text',x:199,y:38,text:'Kurumsal',size:7,fill:'#374151',bold:true,anchor:'middle'},
        {type:'text',x:199,y:54,text:'₺599/ay',size:9,fill:'#374151',bold:true,anchor:'middle'},
        {x:170,y:62,w:58,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},{x:170,y:70,w:52,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},{x:170,y:78,w:56,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
        {x:170,y:116,w:58,h:14,rx:7,fill:'rgba(124,58,237,0.3)'},{type:'text',x:199,y:124,text:'Seç',size:6,fill:'#7C3AED',bold:true,anchor:'middle'},
      ]),
      sections: ['pricing-3plan']
    },
  ],
  blog: [
    {
      name: 'Blog Sayfası',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#ffffff'},
        {type:'text',x:120,y:12,text:'Blog',size:10,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:4,y:22,w:112,h:112,rx:10,fill:'#f5f3ff'},
        {x:10,y:28,w:100,h:46,rx:7,fill:'rgba(124,58,237,0.25)'},
        {type:'circle',cx:60,cy:51,r:12,fill:'rgba(124,58,237,0.5)'},
        {type:'text',x:14,y:86,text:'Blog Başlığı 1',size:7,fill:'#374151',bold:true},
        {x:14,y:92,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},{x:14,y:100,w:75,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
        {x:14,y:110,w:40,h:4,rx:2,fill:'rgba(124,58,237,0.5)'},
        {x:122,y:22,w:112,h:112,rx:10,fill:'#f5f3ff'},
        {x:128,y:28,w:100,h:46,rx:7,fill:'rgba(124,58,237,0.2)'},
        {type:'circle',cx:178,cy:51,r:12,fill:'rgba(124,58,237,0.45)'},
        {type:'text',x:132,y:86,text:'Blog Başlığı 2',size:7,fill:'#374151',bold:true},
        {x:132,y:92,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},{x:132,y:100,w:75,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
        {x:132,y:110,w:40,h:4,rx:2,fill:'rgba(124,58,237,0.5)'},
      ]),
      sections: ['blog-grid']
    },
  ],
  faq: [
    {
      name: 'SSS Sayfası',
      svg: _thumbSVG([
        {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
        {type:'text',x:120,y:12,text:'Sık Sorulan Sorular',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
        {x:8,y:20,w:224,h:24,rx:7,fill:'#ffffff'},{type:'text',x:16,y:34,text:'Teslimat ne kadar sürer?',size:7,fill:'#374151',bold:true},{type:'text',x:226,y:34,text:'+',size:10,fill:'#7C3AED',bold:true,anchor:'end'},
        {x:8,y:48,w:224,h:24,rx:7,fill:'#ffffff'},{type:'text',x:16,y:62,text:'İade politikanız nasıl?',size:7,fill:'#374151',bold:true},{type:'text',x:226,y:62,text:'+',size:10,fill:'#7C3AED',bold:true,anchor:'end'},
        {x:8,y:76,w:224,h:24,rx:7,fill:'#ffffff'},{type:'text',x:16,y:90,text:'Ödeme yöntemleri neler?',size:7,fill:'#374151',bold:true},{type:'text',x:226,y:90,text:'+',size:10,fill:'#7C3AED',bold:true,anchor:'end'},
        {x:8,y:104,w:224,h:30,rx:7,fill:'#7C3AED'},{type:'text',x:16,y:118,text:'Garanti süresi nedir?',size:7,fill:'#fff',bold:true},{type:'text',x:226,y:118,text:'−',size:10,fill:'#fff',bold:true,anchor:'end'},
        {x:16,y:124,w:160,h:4,rx:2,fill:'rgba(255,255,255,0.4)'},{x:16,y:130,w:120,h:4,rx:2,fill:'rgba(255,255,255,0.4)'},
      ]),
      sections: ['faq-accordion']
    },
  ],
};

// ─── EXTRA PAGE TEMPLATES ───────────────────────────────────────
PAGE_TEMPLATES_DATA.contact.push({
  name: 'Hızlı İletişim',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#f0fdf4'},
    {type:'text',x:120,y:12,text:'Hızlı İletişim',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {x:4,y:20,w:112,h:116,rx:10,fill:'rgba(37,211,102,0.15)'},
    {type:'circle',cx:60,cy:56,r:20,fill:'rgba(37,211,102,0.6)'},
    {type:'text',x:60,y:57,text:'W',size:14,fill:'#ffffff',bold:true,anchor:'middle'},
    {x:20,y:84,w:80,h:16,rx:8,fill:'rgba(37,211,102,0.8)'},
    {type:'text',x:60,y:94,text:'WhatsApp',size:7,fill:'#fff',bold:true,anchor:'middle'},
    {x:20,y:104,w:36,h:14,rx:7,fill:'rgba(37,211,102,0.3)'},{type:'text',x:38,y:113,text:'Arama',size:6,fill:'#374151',anchor:'middle'},
    {x:62,y:104,w:38,h:14,rx:7,fill:'rgba(37,211,102,0.3)'},{type:'text',x:81,y:113,text:'E-posta',size:6,fill:'#374151',anchor:'middle'},
    {x:120,y:20,w:116,h:116,rx:10,fill:'rgba(124,58,237,0.08)'},
    {type:'text',x:128,y:34,text:'Mesaj Gönderin',size:7.5,fill:'#374151',bold:true},
    {x:128,y:40,w:100,h:12,rx:5,fill:'#ffffff'},{x:128,y:56,w:100,h:12,rx:5,fill:'#ffffff'},{x:128,y:72,w:100,h:22,rx:5,fill:'#ffffff'},
    {x:128,y:100,w:100,h:16,rx:8,fill:'#7C3AED'},{type:'text',x:178,y:110,text:'Gönder',size:7,fill:'#fff',bold:true,anchor:'middle'},
  ]),
  sections: ['whatsapp-contact','contact-form']
});

PAGE_TEMPLATES_DATA.about.push({
  name: 'Tam Hakkında',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#ffffff'},
    {x:0,y:0,w:240,h:36,fill:'rgba(124,58,237,0.1)'},
    {type:'text',x:120,y:14,text:'Hakkımızda',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {type:'text',x:120,y:28,text:'Vizyon · Misyon · Değerler',size:6.5,fill:'#6b7280',anchor:'middle'},
    {x:4,y:42,w:112,h:48,rx:8,fill:'#f5f3ff'},
    {type:'text',x:10,y:56,text:'Zaman Çizelgesi',size:7,fill:'#374151',bold:true},
    {x:10,y:62,w:4,h:20,fill:'#7C3AED'},{x:18,y:62,w:88,h:6,rx:2,fill:'rgba(31,41,55,0.2)'},{x:18,y:72,w:70,h:6,rx:2,fill:'rgba(31,41,55,0.2)'},
    {x:120,y:42,w:116,h:48,rx:8,fill:'#f5f3ff'},
    {type:'text',x:126,y:56,text:'Değerlerimiz',size:7,fill:'#374151',bold:true},
    {type:'circle',cx:136,cy:70,r:6,fill:'#7C3AED'},{x:146,y:67,w:80,h:5,rx:2,fill:'rgba(31,41,55,0.2)'},
    {type:'circle',cx:136,cy:80,r:6,fill:'#7C3AED'},{x:146,y:77,w:80,h:5,rx:2,fill:'rgba(31,41,55,0.2)'},
    {x:4,y:96,w:232,h:38,rx:8,fill:'rgba(124,58,237,0.1)'},
    {type:'circle',cx:36,cy:115,r:9,fill:'rgba(124,58,237,0.5)'},{type:'text',x:36,y:116,text:'A',size:7,fill:'#fff',anchor:'middle'},
    {type:'circle',cx:76,cy:115,r:9,fill:'rgba(124,58,237,0.5)'},{type:'text',x:76,y:116,text:'B',size:7,fill:'#fff',anchor:'middle'},
    {type:'circle',cx:116,cy:115,r:9,fill:'rgba(124,58,237,0.5)'},{type:'text',x:116,y:116,text:'C',size:7,fill:'#fff',anchor:'middle'},
    {type:'text',x:140,y:112,text:'Ekibimiz',size:7,fill:'#374151',bold:true},{x:140,y:118,w:86,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
  ]),
  sections: ['about-timeline','about-values','about-image']
});

PAGE_TEMPLATES_DATA.services.push({
  name: 'Hizmet + Süreç',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#ffffff'},
    {x:0,y:0,w:240,h:36,fill:'rgba(124,58,237,0.1)'},
    {type:'text',x:120,y:14,text:'Hizmetler & Süreç',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {x:4,y:42,w:74,h:50,rx:8,fill:'#f5f3ff'},{type:'circle',cx:41,cy:56,r:8,fill:'#7C3AED'},{type:'text',x:41,y:72,text:'Web',size:6.5,fill:'#374151',bold:true,anchor:'middle'},{x:10,y:78,w:62,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
    {x:83,y:42,w:74,h:50,rx:8,fill:'#f5f3ff'},{type:'circle',cx:120,cy:56,r:8,fill:'#7C3AED'},{type:'text',x:120,y:72,text:'Mobil',size:6.5,fill:'#374151',bold:true,anchor:'middle'},{x:89,y:78,w:62,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
    {x:162,y:42,w:74,h:50,rx:8,fill:'#f5f3ff'},{type:'circle',cx:199,cy:56,r:8,fill:'#7C3AED'},{type:'text',x:199,y:72,text:'SEO',size:6.5,fill:'#374151',bold:true,anchor:'middle'},{x:168,y:78,w:62,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
    {type:'text',x:120,y:104,text:'Çalışma Sürecimiz',size:7.5,fill:'#374151',bold:true,anchor:'middle'},
    {x:4,y:110,w:52,h:24,rx:7,fill:'rgba(124,58,237,0.12)'},{type:'circle',cx:30,cy:115,r:5,fill:'#7C3AED'},{type:'text',x:30,y:116,text:'1',size:5.5,fill:'#fff',bold:true,anchor:'middle'},{type:'text',x:30,y:128,text:'Analiz',size:5.5,fill:'#374151',anchor:'middle'},
    {x:60,y:110,w:52,h:24,rx:7,fill:'rgba(124,58,237,0.12)'},{type:'circle',cx:86,cy:115,r:5,fill:'#7C3AED'},{type:'text',x:86,y:116,text:'2',size:5.5,fill:'#fff',bold:true,anchor:'middle'},{type:'text',x:86,y:128,text:'Tasarım',size:5.5,fill:'#374151',anchor:'middle'},
    {x:116,y:110,w:52,h:24,rx:7,fill:'rgba(124,58,237,0.12)'},{type:'circle',cx:142,cy:115,r:5,fill:'#7C3AED'},{type:'text',x:142,y:116,text:'3',size:5.5,fill:'#fff',bold:true,anchor:'middle'},{type:'text',x:142,y:128,text:'Geliştirme',size:5.5,fill:'#374151',anchor:'middle'},
    {x:172,y:110,w:62,h:24,rx:7,fill:'rgba(124,58,237,0.12)'},{type:'circle',cx:203,cy:115,r:5,fill:'#7C3AED'},{type:'text',x:203,y:116,text:'4',size:5.5,fill:'#fff',bold:true,anchor:'middle'},{type:'text',x:203,y:128,text:'Teslimat',size:5.5,fill:'#374151',anchor:'middle'},
  ]),
  sections: ['services-alt','services-process']
});

PAGE_TEMPLATES_DATA.portfolio.push({
  name: 'Karma Galeri',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#0f0f1a'},
    {type:'text',x:120,y:14,text:'Karma Galeri',size:9,fill:'#ffffff',bold:true,anchor:'middle'},
    {x:4,y:22,w:118,h:112,rx:10,fill:'rgba(124,58,237,0.4)'},
    {type:'circle',cx:63,cy:68,r:22,fill:'rgba(255,255,255,0.15)'},
    {type:'text',x:63,y:74,text:'Ana',size:7,fill:'rgba(255,255,255,0.8)',anchor:'middle'},
    {x:128,y:22,w:52,h:52,rx:8,fill:'rgba(124,58,237,0.35)'},{type:'circle',cx:154,cy:48,r:10,fill:'rgba(255,255,255,0.2)'},
    {x:186,y:22,w:50,h:52,rx:8,fill:'rgba(124,58,237,0.25)'},{type:'circle',cx:211,cy:48,r:10,fill:'rgba(255,255,255,0.15)'},
    {x:128,y:80,w:52,h:54,rx:8,fill:'rgba(124,58,237,0.3)'},{type:'circle',cx:154,cy:107,r:10,fill:'rgba(255,255,255,0.2)'},
    {x:186,y:80,w:50,h:54,rx:8,fill:'rgba(124,58,237,0.35)'},{type:'circle',cx:211,cy:107,r:10,fill:'rgba(255,255,255,0.15)'},
  ]),
  sections: ['gallery-big-small','cta-basic']
});

PAGE_TEMPLATES_DATA.pricing.push({
  name: 'Fiyat + SSS',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#f5f3ff'},
    {type:'text',x:120,y:10,text:'Fiyat & SSS',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {x:6,y:18,w:228,h:20,rx:7,fill:'#ffffff'},{type:'text',x:14,y:31,text:'Web Site Tasarımı',size:7,fill:'#374151'},{type:'text',x:226,y:31,text:'₺2.500',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:6,y:42,w:228,h:20,rx:7,fill:'#ffffff'},{type:'text',x:14,y:55,text:'Logo Tasarımı',size:7,fill:'#374151'},{type:'text',x:226,y:55,text:'₺800',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:6,y:66,w:228,h:20,rx:7,fill:'#ffffff'},{type:'text',x:14,y:79,text:'SEO Paketi',size:7,fill:'#374151'},{type:'text',x:226,y:79,text:'₺1.200/ay',size:7,fill:'#7C3AED',bold:true,anchor:'end'},
    {type:'text',x:120,y:98,text:'Sık Sorulan Sorular',size:7.5,fill:'#374151',bold:true,anchor:'middle'},
    {x:6,y:104,w:228,h:16,rx:7,fill:'#ffffff'},{type:'text',x:14,y:114,text:'Teslimat süresi?',size:6.5,fill:'#374151'},{type:'text',x:226,y:114,text:'+',size:9,fill:'#7C3AED',bold:true,anchor:'end'},
    {x:6,y:124,w:228,h:14,rx:7,fill:'#ffffff'},{type:'text',x:14,y:133,text:'İade politikası?',size:6.5,fill:'#374151'},{type:'text',x:226,y:133,text:'+',size:9,fill:'#7C3AED',bold:true,anchor:'end'},
  ]),
  sections: ['pricing-list','faq-accordion']
});

PAGE_TEMPLATES_DATA.blog.push({
  name: 'Blog + Abonelik',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#ffffff'},
    {type:'text',x:120,y:10,text:'Blog & Bülten',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {x:4,y:18,w:112,h:74,rx:10,fill:'#f5f3ff'},
    {x:10,y:24,w:100,h:36,rx:7,fill:'rgba(124,58,237,0.25)'},{type:'circle',cx:60,cy:42,r:9,fill:'rgba(124,58,237,0.5)'},
    {type:'text',x:10,y:72,text:'Başlık 1',size:7,fill:'#374151',bold:true},{x:10,y:78,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
    {x:122,y:18,w:112,h:74,rx:10,fill:'#f5f3ff'},
    {x:128,y:24,w:100,h:36,rx:7,fill:'rgba(124,58,237,0.2)'},{type:'circle',cx:178,cy:42,r:9,fill:'rgba(124,58,237,0.45)'},
    {type:'text',x:128,y:72,text:'Başlık 2',size:7,fill:'#374151',bold:true},{x:128,y:78,w:90,h:4,rx:2,fill:'rgba(31,41,55,0.2)'},
    {x:4,y:98,w:232,h:36,rx:8,fill:'rgba(124,58,237,0.08)'},
    {type:'text',x:120,y:112,text:'Bültene Abone Ol',size:7.5,fill:'#374151',bold:true,anchor:'middle'},
    {x:28,y:118,w:130,h:12,rx:6,fill:'#ffffff'},{x:162,y:118,w:48,h:12,rx:6,fill:'#7C3AED'},{type:'text',x:186,y:125,text:'Abone Ol',size:5.5,fill:'#fff',bold:true,anchor:'middle'},
  ]),
  sections: ['blog-grid','cta-newsletter']
});

PAGE_TEMPLATES_DATA.faq.push({
  name: 'SSS İki Sütun + CTA',
  svg: _thumbSVG([
    {x:0,y:0,w:240,h:140,fill:'#ffffff'},
    {type:'text',x:120,y:10,text:'SSS & Çağrı',size:9,fill:'#1f2937',bold:true,anchor:'middle'},
    {x:4,y:18,w:112,h:22,rx:7,fill:'#f5f3ff'},{type:'text',x:10,y:31,text:'Teslimat süresi?',size:6.5,fill:'#374151',bold:true},{type:'text',x:114,y:31,text:'+',size:9,fill:'#7C3AED',anchor:'end'},
    {x:4,y:44,w:112,h:22,rx:7,fill:'#f5f3ff'},{type:'text',x:10,y:57,text:'İade politikası?',size:6.5,fill:'#374151',bold:true},{type:'text',x:114,y:57,text:'+',size:9,fill:'#7C3AED',anchor:'end'},
    {x:4,y:70,w:112,h:22,rx:7,fill:'#f5f3ff'},{type:'text',x:10,y:83,text:'Ödeme yöntemleri?',size:6.5,fill:'#374151',bold:true},{type:'text',x:114,y:83,text:'+',size:9,fill:'#7C3AED',anchor:'end'},
    {x:124,y:18,w:112,h:22,rx:7,fill:'#f5f3ff'},{type:'text',x:130,y:31,text:'Garanti süresi?',size:6.5,fill:'#374151',bold:true},{type:'text',x:234,y:31,text:'+',size:9,fill:'#7C3AED',anchor:'end'},
    {x:124,y:44,w:112,h:22,rx:7,fill:'#f5f3ff'},{type:'text',x:130,y:57,text:'Teknik destek?',size:6.5,fill:'#374151',bold:true},{type:'text',x:234,y:57,text:'+',size:9,fill:'#7C3AED',anchor:'end'},
    {x:124,y:70,w:112,h:22,rx:7,fill:'#f5f3ff'},{type:'text',x:130,y:83,text:'Kargo ücreti?',size:6.5,fill:'#374151',bold:true},{type:'text',x:234,y:83,text:'+',size:9,fill:'#7C3AED',anchor:'end'},
    {x:4,y:98,w:232,h:36,rx:8,fill:'rgba(124,58,237,0.1)'},
    {type:'text',x:120,y:112,text:'Hâlâ sorunuz mu var?',size:7.5,fill:'#374151',bold:true,anchor:'middle'},
    {x:72,y:118,w:96,h:12,rx:6,fill:'#7C3AED'},{type:'text',x:120,y:126,text:'Bize Ulaşın',size:6.5,fill:'#fff',bold:true,anchor:'middle'},
  ]),
  sections: ['faq-2col','cta-newsletter']
});

// Map section type names to template data
const _secTypeMap = {
  'contact-form':    () => SECTION_TEMPLATES_DATA.contact[0],
  'contact-info':    () => SECTION_TEMPLATES_DATA.contact[1],
  'whatsapp-contact':() => SECTION_TEMPLATES_DATA.contact[2],
  'about-image':     () => SECTION_TEMPLATES_DATA.about[0],
  'about-stats':     () => SECTION_TEMPLATES_DATA.about[1],
  'about-timeline':  () => SECTION_TEMPLATES_DATA.about[2],
  'about-values':    () => SECTION_TEMPLATES_DATA.about[3],
  'services-grid':   () => SECTION_TEMPLATES_DATA.services[0],
  'services-list':   () => SECTION_TEMPLATES_DATA.services[1],
  'services-process':() => SECTION_TEMPLATES_DATA.services[2],
  'services-alt':    () => SECTION_TEMPLATES_DATA.services[3],
  'gallery-grid':    () => SECTION_TEMPLATES_DATA.gallery[0],
  'gallery-big-small':() => SECTION_TEMPLATES_DATA.gallery[1],
  'pricing-3plan':   () => SECTION_TEMPLATES_DATA.pricing[0],
  'pricing-list':    () => SECTION_TEMPLATES_DATA.pricing[1],
  'faq-accordion':   () => SECTION_TEMPLATES_DATA.faq[0],
  'faq-2col':        () => SECTION_TEMPLATES_DATA.faq[1],
  'cta-basic':       () => SECTION_TEMPLATES_DATA.cta[0],
  'cta-newsletter':  () => SECTION_TEMPLATES_DATA.cta[1],
  'blog-grid':       () => _makeBlogSection,
  'team-featured':   () => SECTION_TEMPLATES_DATA.team[1],
  'testimonials-quote':() => SECTION_TEMPLATES_DATA.testimonials[1],
};

function _makeBlogSection() {
  return {
    name: 'Blog Yazıları',
    html: id => `<section id="${id}" class="cus-section" style="background:var(--bg,#fff);">
      <button class="drag-handle" title="Taşı">⠿</button>
      <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
      <div style="max-width:1000px;margin:0 auto;">
        <h2 class="editable" data-key="${id}-h" style="text-align:center;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:var(--text,#111);margin-bottom:40px;" contenteditable="false">Blog</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:22px;">
          ${[1,2,3].map(n => `<div style="border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,.07);">
            <div class="img-zone" data-img-key="${id}-img${n}" style="height:180px;background:rgba(124,58,237,0.1);display:flex;align-items:center;justify-content:center;position:relative;">
              <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Kapak</div>
            </div>
            <div style="padding:18px 20px;">
              <div class="editable" data-key="${id}-cat${n}" style="font-size:.75rem;font-weight:700;color:var(--primary,#7C3AED);text-transform:uppercase;margin-bottom:8px;" contenteditable="false">Kategori</div>
              <h3 class="editable" data-key="${id}-t${n}" style="font-size:1rem;font-weight:700;color:var(--text,#111);margin-bottom:8px;line-height:1.4;" contenteditable="false">Blog Yazısı Başlığı ${n}</h3>
              <p class="editable" data-key="${id}-d${n}" style="font-size:.85rem;color:rgba(0,0,0,.5);line-height:1.6;margin-bottom:14px;" contenteditable="false">Yazının kısa özeti burada görünür...</p>
              <a href="#" style="font-size:.82rem;font-weight:600;color:var(--primary,#7C3AED);text-decoration:none;" onclick="return false;">Devamını Oku →</a>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`
  };
}

// ─── İKON SEÇİCİ ─────────────────────────────────────────────
let _iconPickerTarget = null;

function openIconPickerForAdd() {
  _iconPickerTarget = null;
  _renderIconGrid('');
  document.getElementById('icon-picker-modal').classList.remove('hidden');
  const s = document.getElementById('icon-picker-search');
  if (s) { s.value = ''; s.focus(); }
}

function openIconPicker(btn) {
  const item = btn ? btn.closest('[data-item-id]') : null;
  _iconPickerTarget = item
    ? (item.querySelector('.custom-icon-block') || item.querySelector('.custom-card-icon'))
    : null;
  _renderIconGrid('');
  document.getElementById('icon-picker-modal').classList.remove('hidden');
  const s = document.getElementById('icon-picker-search');
  if (s) { s.value = ''; s.focus(); }
}

function closeIconPicker() {
  document.getElementById('icon-picker-modal').classList.add('hidden');
  _iconPickerTarget = null;
}

function filterIcons(query) { _renderIconGrid(query); }

function _renderIconGrid(query) {
  const grid = document.getElementById('icon-picker-grid');
  if (!grid) return;
  const q = (query || '').toLowerCase().trim();
  const list = q
    ? ICON_LIBRARY.filter(ic => ic.name.toLowerCase().includes(q) || ic.id.includes(q))
    : ICON_LIBRARY;
  grid.innerHTML = list.map(ic =>
    '<button class="icon-picker-item" onclick="selectIcon(\'' + ic.id + '\')" title="' + ic.name + '">' +
    ic.svg + '<span>' + ic.name + '</span></button>'
  ).join('');
}

function selectIcon(iconId) {
  const ic = ICON_LIBRARY.find(i => i.id === iconId);
  if (!ic) return;
  if (_iconPickerTarget) {
    _iconPickerTarget.innerHTML = ic.svg;
    isDirty = true; showAutoSaveIndicator(); pushHistory();
    showToast('✓ İkon güncellendi', 'success');
    closeIconPicker();
  } else {
    window._selectedIconSvg = ic.svg;
    closeIconPicker();
    startAddMode('icon');
  }
}

// ═══════════════════════════════════════════════════════════════
// SECTION PICKER
// ═══════════════════════════════════════════════════════════════
let _secPickerActiveCat = 'hero';

function openSectionPicker() {
  const modal = document.getElementById('section-picker-modal');
  modal.classList.remove('hidden');
  _renderSecPickerCats();
  _renderSecPickerGrid(_secPickerActiveCat);
}

function closeSectionPicker() {
  document.getElementById('section-picker-modal').classList.add('hidden');
}

function _renderSecPickerCats() {
  const sidebar = document.getElementById('sec-picker-cats');
  sidebar.innerHTML = '';
  SECTION_CATS.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'picker-cat' + (cat.id === _secPickerActiveCat ? ' active' : '');
    btn.innerHTML = cat.icon + ' ' + cat.label;
    btn.onclick = () => {
      _secPickerActiveCat = cat.id;
      sidebar.querySelectorAll('.picker-cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _renderSecPickerGrid(cat.id);
    };
    sidebar.appendChild(btn);
  });
}

function _renderSecPickerGrid(catId) {
  const grid = document.getElementById('sec-picker-grid');
  grid.innerHTML = '';
  const templates = SECTION_TEMPLATES_DATA[catId] || [];
  if (!templates.length) {
    grid.innerHTML = '<p style="color:#6B7280;font-size:.82rem;">Bu kategori için henüz şablon yok.</p>';
    return;
  }
  templates.forEach(tpl => {
    const card = document.createElement('div');
    card.className = 'picker-card';
    card.innerHTML =
      '<div class="picker-thumb">' + tpl.svg + '</div>' +
      '<div class="picker-card-label">' + tpl.name + '</div>';
    card.onclick = () => { _insertSectionTemplate(tpl); closeSectionPicker(); };
    grid.appendChild(card);
  });
}

function _insertSectionTemplate(tpl) {
  const canvas = document.getElementById('canvas');
  const secId = 'csec-' + Date.now();
  const html = tpl.html(secId);
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const sec = tmp.firstElementChild;
  if (!sec) return;
  const footer = canvas.querySelector('footer');
  if (footer) canvas.insertBefore(sec, footer);
  else canvas.appendChild(sec);
  setupEditable(); setupImageZones(); setupSectionDrag();
  isDirty = true; showAutoSaveIndicator(); pushHistory();
  showToast('✦ "' + tpl.name + '" eklendi!', 'success');
  sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function addBlankSection() {
  const name = prompt('Yeni bölüm adı:');
  if (!name || !name.trim()) return;
  const secId = 'csec-' + Date.now();
  const blankTpl = {
    name: name.trim(),
    html: id => `<section id="${id}" class="cus-section">
      <button class="drag-handle" title="Taşı">⠿</button>
      <div class="item-controls"><button class="ic-btn del" onclick="deleteFullSection(this)" title="Bölümü Sil">✕</button></div>
      <div class="cus-sec-inner">
        <div class="cus-sec-text">
          <h2 class="cus-sec-h editable" data-key="${id}-h" contenteditable="false">${name.trim()}</h2>
          <p class="cus-sec-p editable" data-key="${id}-p" contenteditable="false">Bu bölümün içeriğini düzenlemek için tıklayın.</p>
          <a href="#" class="cus-sec-btn editable" data-key="${id}-btn" contenteditable="false" onclick="return false;">Daha Fazla</a>
        </div>
        <div class="cus-sec-img img-zone" data-img-key="${id}-img">
          <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Resim Ekle</div>
        </div>
      </div>
    </section>`
  };

  // Add nav link
  const canvas = document.getElementById('canvas');
  const tmp = document.createElement('div');
  tmp.innerHTML = blankTpl.html(secId);
  const sec = tmp.firstElementChild;
  const footer = canvas.querySelector('footer');
  if (footer) canvas.insertBefore(sec, footer);
  else canvas.appendChild(sec);
  const navUl = canvas.querySelector('nav ul:first-child, nav > ul, nav > div > ul, nav > div > div > ul');
  if (navUl) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + secId; a.className = 'editable';
    a.dataset.key = secId + '-nav'; a.setAttribute('contenteditable','false');
    a.textContent = name.trim(); li.appendChild(a); navUl.appendChild(li);
  }
  setupEditable(); setupImageZones(); setupSectionDrag();
  isDirty = true; showAutoSaveIndicator(); pushHistory();
  showToast('✦ "' + name.trim() + '" bölümü eklendi!', 'success');
  sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══════════════════════════════════════════════════════════════
// PAGE PICKER
// ═══════════════════════════════════════════════════════════════
let _pagePickerActiveCat = 'contact';

function openPagePicker() {
  const modal = document.getElementById('page-picker-modal');
  modal.classList.remove('hidden');
  _renderPagePickerCats();
  _renderPagePickerGrid(_pagePickerActiveCat);
}

function closePagePicker() {
  document.getElementById('page-picker-modal').classList.add('hidden');
}

function _renderPagePickerCats() {
  const sidebar = document.getElementById('page-picker-cats');
  sidebar.innerHTML = '';
  PAGE_CATS.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'picker-cat' + (cat.id === _pagePickerActiveCat ? ' active' : '');
    btn.innerHTML = cat.icon + ' ' + cat.label;
    btn.onclick = () => {
      _pagePickerActiveCat = cat.id;
      sidebar.querySelectorAll('.picker-cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _renderPagePickerGrid(cat.id);
    };
    sidebar.appendChild(btn);
  });
}

function _renderPagePickerGrid(catId) {
  const grid = document.getElementById('page-picker-grid');
  grid.innerHTML = '';
  const templates = PAGE_TEMPLATES_DATA[catId] || [];
  if (!templates.length) {
    grid.innerHTML = '<p style="color:#6B7280;font-size:.82rem;">Bu kategori için henüz şablon yok.</p>';
    return;
  }
  templates.forEach(tpl => {
    const card = document.createElement('div');
    card.className = 'picker-card';
    card.innerHTML =
      '<div class="picker-thumb">' + tpl.svg + '</div>' +
      '<div class="picker-card-label">' + tpl.name + '</div>';
    card.onclick = () => { _insertPageTemplate(tpl); closePagePicker(); };
    grid.appendChild(card);
  });
}

function _insertPageTemplate(pageTpl) {
  const canvas = document.getElementById('canvas');
  const sectionsToAdd = pageTpl.sections || [];
  sectionsToAdd.forEach(secType => {
    const tplGetter = _secTypeMap[secType];
    if (!tplGetter) return;
    let tpl = tplGetter();
    if (typeof tpl === 'function') tpl = tpl();
    if (!tpl || !tpl.html) return;
    const secId = 'csec-' + Date.now() + Math.random().toString(36).slice(2,6);
    const tmp = document.createElement('div');
    tmp.innerHTML = tpl.html(secId);
    const sec = tmp.firstElementChild;
    if (!sec) return;
    const footer = canvas.querySelector('footer');
    if (footer) canvas.insertBefore(sec, footer);
    else canvas.appendChild(sec);
  });
  setupEditable(); setupImageZones(); setupSectionDrag();
  isDirty = true; showAutoSaveIndicator(); pushHistory();
  showToast('📄 "' + pageTpl.name + '" sayfası eklendi!', 'success');
  const firstNew = canvas.querySelector('section:last-of-type');
  if (firstNew) firstNew.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── BOOT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initEditor);
