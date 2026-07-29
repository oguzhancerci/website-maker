// ============================================================
// EDITOR.JS — Editör mantığı
// ============================================================

let siteData = {
  id: null,
  name: 'Yeni Site',
  template: null,
  lang: 'tr',
  colors: {},
  content: {},
  social: { whatsapp: '', instagram: '', facebook: '', twitter: '', youtube: '', linkedin: '' },
  images: {}
};

let currentLang = 'tr';
let isDirty = false;

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
  if (siteData.social) updateSocialInputs(siteData.social);

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
  const templateId = params.get('template');
  const siteId = params.get('id');

  // Auto-export mode (called from dashboard download button)
  if (params.get('autoexport') === '1' && siteId) {
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
    siteData.colors = { ...TEMPLATES[templateId].defaultColors };
    loadTemplate(templateId, null);
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

  // Set language
  currentLang = (savedData && savedData.lang) ? savedData.lang : 'tr';
  updateLangUI();
  window.toggleLang = toggleLanguage;

  // Bölüm sürükleme
  setupSectionDrag();
  setupGridItemDrag();
  setupElementDrag();

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

  // Element transform'larını geri yükle
  if (savedData && savedData.elementTransforms) {
    restoreElementTransforms(savedData.elementTransforms);
  }

  // İlk state'i history'ye kaydet
  setTimeout(pushHistory, 50);
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
}

// ─── EDITABLE TEXT ───────────────────────────────────────────
function setupEditable() {
  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('.editable').forEach(el => {
    el.setAttribute('title', 'Düzenlemek için tıklayın');

    el.addEventListener('click', function(e) {
      if (window._isDraggingElement) return;
      e.stopPropagation();
      if (this.getAttribute('contenteditable') === 'true') return;
      this.setAttribute('contenteditable', 'true');
      this.focus();

      // Select all text
      const range = document.createRange();
      range.selectNodeContents(this);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    el.addEventListener('blur', function() {
      this.setAttribute('contenteditable', 'false');
      const key = this.dataset.key;
      if (key) {
        if (!siteData.content[key]) siteData.content[key] = { tr: '', en: '' };
        siteData.content[key][currentLang] = this.innerHTML;
      }
      isDirty = true;
      showAutoSaveIndicator();
      pushHistory();
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
  document.querySelectorAll('#lang-label').forEach(el => {
    el.textContent = currentLang === 'tr' ? 'EN' : 'TR';
  });
  const topBtn = document.getElementById('top-lang-btn');
  if (topBtn) topBtn.textContent = currentLang === 'tr' ? '🌐 Türkçe → English' : '🌐 English → Türkçe';
  const sbBtn = document.getElementById('sb-lang-btn');
  if (sbBtn) sbBtn.textContent = currentLang === 'tr' ? '🌐 Türkçe → English' : '🌐 English → Türkçe';
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

  // Element konumlarını kaydet
  siteData.elementTransforms = getElementTransforms();

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
  clone.querySelectorAll('.drag-handle').forEach(el => el.remove());
  clone.querySelectorAll('.item-controls').forEach(el => el.remove());
  clone.querySelectorAll('.faq-editor-btns').forEach(el => el.remove());
  clone.querySelectorAll('.faq-remove-btn').forEach(el => el.remove());
  const bodyHTML = clone.innerHTML;

  // ─── CSS ─────────────────────────────────────────────────
  const colorVars = Object.entries(siteData.colors)
    .map(([k, v]) => `  --${k}: ${v};`).join('\n');
  // Template'in varsayılan :root bloğunu çıkar, kullanıcı renkleri ile değiştir
  const cleanCss = tpl.css.replace(/:root\s*\{[^}]*\}/g, '');

  const cssContent =
`/* Oluşturan: SiteYapıcı */

/* === Renk Değişkenleri === */
:root {
${colorVars}
}

/* === Şablon Stilleri === */
${cleanCss}

/* === Yayın modu (editör stilleri devre dışı) === */
body { container-type: inline-size; }
.editable:hover { outline: none !important; cursor: inherit !important; }
.editable[contenteditable] { outline: none !important; background: transparent !important; }
.img-upload-hint { display: none !important; }
.img-zone { cursor: default !important; }
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
  const bodyHTML = canvas.innerHTML;
  const colorVars = Object.entries(siteData.colors).map(([k, v]) => `--${k}:${v};`).join('');

  const waFns = `function _getWAPhone(){var wa=document.getElementById('wa-btn');if(wa&&wa.href&&wa.href.indexOf('wa.me/')>-1){return wa.href.replace(/.*wa\\.me\\//,'').split('?')[0];}return '';}function _openWA(phone,msg){window.open((phone?'https://wa.me/'+phone:'https://wa.me/')+'?text='+encodeURIComponent(msg),'_blank');}window.rtSendWA=function(){var phone=_getWAPhone();var name=(document.getElementById('rt-res-name')||{}).value||'';var tel=(document.getElementById('rt-res-tel')||{}).value||'';var date=(document.getElementById('rt-res-date')||{}).value||'';var pax=(document.getElementById('rt-res-pax')||{}).value||'';var note=(document.getElementById('rt-res-note')||{}).value||'';if(!name||!date||!pax){alert('Lütfen adınızı, tarihi ve kişi sayısını girin.');return;}var msg='Merhaba, rezervasyon talebim:\\n\\n👤 Ad Soyad: '+name+'\\n📅 Tarih: '+date+'\\n👥 Kişi Sayısı: '+pax+(tel?'\\n📞 Telefon: '+tel:'')+(note?'\\n📝 Not: '+note:'');_openWA(phone,msg);};window.svSendWA=function(){var phone=_getWAPhone();var name=(document.getElementById('sv-form-name')||{}).value||'';var tel=(document.getElementById('sv-form-tel')||{}).value||'';var email=(document.getElementById('sv-form-email')||{}).value||'';var msg=(document.getElementById('sv-form-msg')||{}).value||'';if(!name||!msg){alert('Lütfen adınızı ve mesajınızı girin.');return;}var text='Merhaba, teklif talebim:\\n\\n👤 Ad Soyad: '+name+(tel?'\\n📞 Telefon: '+tel:'')+(email?'\\n✉️ E-posta: '+email:'')+' \\n\\n📝 '+msg;_openWA(phone,text);};window.bzSendWA=function(){var phone=_getWAPhone();var name=(document.getElementById('bz-form-name')||{}).value||'';var email=(document.getElementById('bz-form-email')||{}).value||'';var tel=(document.getElementById('bz-form-tel')||{}).value||'';var msg=(document.getElementById('bz-form-msg')||{}).value||'';if(!name||!msg){alert('Lütfen adınızı ve mesajınızı girin.');return;}var text='Merhaba, iletişim talebim:\\n\\n👤 Ad Soyad: '+name+(tel?'\\n📞 Telefon: '+tel:'')+(email?'\\n✉️ E-posta: '+email:'')+' \\n\\n📝 '+msg;_openWA(phone,text);};`;
  const html = `<!DOCTYPE html><html lang="${currentLang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Önizleme — ${siteData.name}</title><style>:root{${colorVars}}${tpl.css}.editable:hover{outline:none!important;cursor:default!important;}</style></head><body style="container-type:inline-size;">${bodyHTML}<script>var currentLang='${currentLang}';function toggleLang(){currentLang=currentLang==='tr'?'en':'tr';document.querySelectorAll('[data-key]').forEach(function(el){var v=el.dataset[currentLang];if(v)el.innerHTML=v;});var l=document.getElementById('lang-label');if(l)l.textContent=currentLang==='tr'?'EN':'TR';}window.toggleLang=toggleLang;${waFns}<\/script></body></html>`;

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

// ─── SECTION DRAG-TO-REORDER (mouse events) ──────────────────
function setupSectionDrag() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Add handle to any section that doesn't have one yet
  canvas.querySelectorAll('section').forEach(sec => {
    if (sec.querySelector('.drag-handle')) return;
    sec.style.position = 'relative';
    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.textContent = '⠿ Taşı';
    sec.appendChild(handle);
  });

  // Global mouse-based drag manager — install only once
  if (window._sectionDragSetup) return;
  window._sectionDragSetup = true;

  let dragSec = null, ghost = null, placeholder = null, offsetY = 0;

  document.addEventListener('mousedown', function(e) {
    const handle = e.target.closest('.drag-handle');
    if (!handle) return;
    const sec = handle.closest('section');
    const cvs = document.getElementById('canvas');
    if (!sec || !cvs || !cvs.contains(sec)) return;

    e.preventDefault();
    window._sectionDragActive = true;
    dragSec = sec;

    const rect = sec.getBoundingClientRect();
    offsetY = e.clientY - rect.top;

    // Thin placeholder bar
    placeholder = document.createElement('div');
    placeholder.style.cssText = 'height:4px;background:#A78BFA;border-radius:4px;margin:0;pointer-events:none;';
    sec.after(placeholder);

    // Semi-transparent ghost overlay
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
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragSec || !ghost) return;
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
    placeholder.replaceWith(dragSec);
    ghost.remove();
    dragSec.style.opacity = '';
    dragSec = null; ghost = null; placeholder = null;
    window._sectionDragActive = false;
    isDirty = true;
    showAutoSaveIndicator();
    pushHistory();
  });
}

// ─── GRID ITEM DRAG (Kart / Buton sıralama) ──────────────────
function setupGridItemDrag() {
  if (window._gridDragSetup) return;
  window._gridDragSetup = true;

  let dragEl = null, ghost = null, placeholder = null, offsetX = 0, offsetY = 0;

  document.addEventListener('mousedown', function(e) {
    if (e.target.closest('.item-controls')) return;
    if (e.target.closest('.ic-btn')) return;
    const item = e.target.closest('.custom-card, .custom-btn-wrap');
    if (!item || !item.closest('#custom-items-grid')) return;

    e.preventDefault();
    dragEl = item;
    const rect = item.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Placeholder
    placeholder = document.createElement('div');
    placeholder.style.cssText = 'width:' + rect.width + 'px;height:' + rect.height + 'px;border:2px dashed rgba(167,139,250,.4);border-radius:16px;background:rgba(124,58,237,.06);pointer-events:none;';
    item.after(placeholder);

    // Ghost
    ghost = document.createElement('div');
    ghost.style.cssText =
      'position:fixed;pointer-events:none;z-index:9999;opacity:.7;border-radius:16px;' +
      'width:' + rect.width + 'px;height:' + rect.height + 'px;' +
      'left:' + rect.left + 'px;top:' + rect.top + 'px;' +
      'box-shadow:0 8px 32px rgba(124,58,237,.35);overflow:hidden;';
    ghost.appendChild(item.cloneNode(true));
    document.body.appendChild(ghost);

    item.style.opacity = '0.2';
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragEl || !ghost) return;
    e.preventDefault();

    ghost.style.left = (e.clientX - offsetX) + 'px';
    ghost.style.top  = (e.clientY - offsetY) + 'px';

    const grid = document.getElementById('custom-items-grid');
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll('.custom-card, .custom-btn-wrap')).filter(i => i !== dragEl);
    let insertBefore = null;

    for (const it of items) {
      const r = it.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      if (e.clientX < cx || e.clientY < cy) { insertBefore = it; break; }
    }

    if (insertBefore) grid.insertBefore(placeholder, insertBefore);
    else grid.appendChild(placeholder);
  });

  document.addEventListener('mouseup', function() {
    if (!dragEl) return;
    placeholder.replaceWith(dragEl);
    ghost.remove();
    dragEl.style.opacity = '';
    dragEl = null; ghost = null; placeholder = null;
    isDirty = true;
    showAutoSaveIndicator();
    pushHistory();
  });
}

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

function addCustomCard() {
  _ensureCustomSection();
  const grid = document.getElementById('custom-items-grid');
  const id = 'card-' + Date.now();
  const card = document.createElement('div');
  card.className = 'custom-card';
  card.dataset.itemId = id;
  card.dataset.type = 'card';
  card.innerHTML =
    '<div class="item-controls">' +
      '<button class="ic-btn" onclick="editItemColor(this)" title="Renk">🎨</button>' +
      '<button class="ic-btn del" onclick="deleteCustomItem(this)" title="Sil">✕</button>' +
    '</div>' +
    '<div class="custom-card-icon editable" contenteditable="false" data-key="' + id + '-icon" data-tr="⭐" data-en="⭐" title="Düzenlemek için tıklayın">⭐</div>' +
    '<div class="custom-card-title editable" contenteditable="false" data-key="' + id + '-title" data-tr="Kart Başlığı" data-en="Card Title" title="Düzenlemek için tıklayın">Kart Başlığı</div>' +
    '<div class="custom-card-body editable" contenteditable="false" data-key="' + id + '-body" data-tr="Kart açıklaması buraya yazılır." data-en="Card description goes here." title="Düzenlemek için tıklayın">Kart açıklaması buraya yazılır.</div>' +
    '<a href="#" class="custom-card-btn editable" contenteditable="false" data-key="' + id + '-btn" data-tr="Daha Fazla" data-en="Learn More" title="Düzenlemek için tıklayın" onclick="return false;">Daha Fazla</a>';
  grid.appendChild(card);
  setupEditable();
  isDirty = true;
  showAutoSaveIndicator();
  showToast('🃏 Kart eklendi!', 'success');
  pushHistory();
  closeMobileSidebar();
}

function addCustomButton() {
  _ensureCustomSection();
  const grid = document.getElementById('custom-items-grid');
  const id = 'btn-' + Date.now();
  const wrap = document.createElement('div');
  wrap.className = 'custom-btn-wrap';
  wrap.dataset.itemId = id;
  wrap.dataset.type = 'button';
  wrap.innerHTML =
    '<div class="item-controls">' +
      '<button class="ic-btn" onclick="editCustomBtnUrl(this)" title="Link">🔗</button>' +
      '<button class="ic-btn" onclick="editItemColor(this)" title="Renk">🎨</button>' +
      '<button class="ic-btn del" onclick="deleteCustomItem(this)" title="Sil">✕</button>' +
    '</div>' +
    '<a href="#" class="custom-standalone-btn editable" contenteditable="false" data-key="' + id + '-label" data-tr="Butona Tıkla" data-en="Click Button" title="Düzenlemek için tıklayın" onclick="return false;">Butona Tıkla</a>';
  grid.appendChild(wrap);
  setupEditable();
  isDirty = true;
  showAutoSaveIndicator();
  showToast('🔘 Buton eklendi!', 'success');
  pushHistory();
  closeMobileSidebar();
}

function deleteCustomItem(el) {
  const item = el.closest('[data-item-id]');
  if (!item) return;
  item.remove();
  const grid = document.getElementById('custom-items-grid');
  if (grid && grid.children.length === 0) {
    const sec = document.getElementById('custom-section');
    if (sec) sec.remove();
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
  const cur = getComputedStyle(item).getPropertyValue('--item-color').trim();
  input.value = cur || '#7C3AED';
  input.addEventListener('input', () => {
    item.style.setProperty('--item-color', input.value);
  });
  input.click();
}

function getCustomItemsData() {
  const grid = document.getElementById('custom-items-grid');
  if (!grid) return [];
  return Array.from(grid.children).map(item => {
    const id = item.dataset.itemId;
    const type = item.dataset.type;
    const data = { id, type };
    item.querySelectorAll('[data-key]').forEach(el => {
      data[el.dataset.key] = el.innerHTML;
    });
    const a = item.querySelector('a');
    if (a) data._href = a.getAttribute('href') || '#';
    data._color = item.style.getPropertyValue('--item-color') || '';
    return data;
  });
}

function restoreCustomItems(items) {
  if (!items || !items.length) return;
  _ensureCustomSection();
  const grid = document.getElementById('custom-items-grid');
  grid.innerHTML = '';

  items.forEach(data => {
    const { id, type } = data;
    const el = document.createElement('div');
    el.dataset.itemId = id;
    el.dataset.type = type;
    if (data._color) el.style.setProperty('--item-color', data._color);

    if (type === 'card') {
      el.className = 'custom-card';
      const iconVal  = data[id + '-icon']  || '⭐';
      const titleVal = data[id + '-title'] || 'Kart Başlığı';
      const bodyVal  = data[id + '-body']  || '';
      const btnVal   = data[id + '-btn']   || 'Daha Fazla';
      const href     = data._href || '#';
      el.innerHTML =
        '<div class="item-controls">' +
          '<button class="ic-btn" onclick="editItemColor(this)" title="Renk">🎨</button>' +
          '<button class="ic-btn del" onclick="deleteCustomItem(this)" title="Sil">✕</button>' +
        '</div>' +
        '<div class="custom-card-icon editable" contenteditable="false" data-key="' + id + '-icon" title="Düzenlemek için tıklayın">' + iconVal + '</div>' +
        '<div class="custom-card-title editable" contenteditable="false" data-key="' + id + '-title" title="Düzenlemek için tıklayın">' + titleVal + '</div>' +
        '<div class="custom-card-body editable" contenteditable="false" data-key="' + id + '-body" title="Düzenlemek için tıklayın">' + bodyVal + '</div>' +
        '<a href="' + href + '" class="custom-card-btn editable" contenteditable="false" data-key="' + id + '-btn" title="Düzenlemek için tıklayın" onclick="return false;">' + btnVal + '</a>';
    } else if (type === 'button') {
      el.className = 'custom-btn-wrap';
      const labelVal = data[id + '-label'] || 'Butona Tıkla';
      const href     = data._href || '#';
      el.innerHTML =
        '<div class="item-controls">' +
          '<button class="ic-btn" onclick="editCustomBtnUrl(this)" title="Link">🔗</button>' +
          '<button class="ic-btn" onclick="editItemColor(this)" title="Renk">🎨</button>' +
          '<button class="ic-btn del" onclick="deleteCustomItem(this)" title="Sil">✕</button>' +
        '</div>' +
        '<a href="' + href + '" class="custom-standalone-btn editable" contenteditable="false" data-key="' + id + '-label" title="Düzenlemek için tıklayın" onclick="return false;">' + labelVal + '</a>';
    }
    grid.appendChild(el);
  });

  setupEditable();
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

// ─── ELEMENT DRAG (transform tabanlı) ────────────────────────
function setupElementDrag() {
  if (window._elementDragSetup) return;
  window._elementDragSetup = true;

  let target = null, startX = 0, startY = 0, origTx = 0, origTy = 0;
  window._isDraggingElement = false;

  document.addEventListener('mousedown', function(e) {
    if (window._sectionDragActive) return;
    if (e.target.closest('.drag-handle')) return;
    if (e.target.closest('.item-controls')) return;
    if (e.target.closest('input, textarea, select')) return;

    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    // Hedef: canvas içindeki .editable veya <a> öğeleri
    const el = e.target.closest('#canvas .editable, #canvas a:not(.drag-handle)');
    if (!el || el.tagName === 'SECTION' || el.tagName === 'FOOTER') return;
    if (!canvas.contains(el)) return;

    const matrix = new DOMMatrix(getComputedStyle(el).transform);
    origTx = matrix.m41 || 0;
    origTy = matrix.m42 || 0;
    target = el;
    startX = e.clientX;
    startY = e.clientY;
    window._isDraggingElement = false;
  });

  document.addEventListener('mousemove', function(e) {
    if (!target) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!window._isDraggingElement) {
      if (Math.abs(dx) + Math.abs(dy) < 6) return;
      window._isDraggingElement = true;
      target.style.zIndex = '50';
      target.style.outline = '2px dashed #A78BFA';
      target.style.outlineOffset = '3px';
      target.setAttribute('contenteditable', 'false');
    }

    e.preventDefault();
    target.style.transform = 'translate(' + (origTx + dx) + 'px,' + (origTy + dy) + 'px)';
  });

  document.addEventListener('mouseup', function() {
    if (!target) return;
    if (window._isDraggingElement) {
      if (!target.dataset.dragId) target.dataset.dragId = 'drag-' + Date.now() + '-' + Math.random().toString(36).slice(2,6);
      if (!siteData.elementTransforms) siteData.elementTransforms = {};
      siteData.elementTransforms[target.dataset.dragId] = target.style.transform;
      target.style.outline = '';
      target.style.outlineOffset = '';
      target.style.zIndex = '';
      isDirty = true;
      showAutoSaveIndicator();
      pushHistory();
      // Bir sonraki click'i engelle (edit'e geçmesin)
      const block = function(ev) { ev.stopImmediatePropagation(); document.removeEventListener('click', block, true); };
      document.addEventListener('click', block, true);
    }
    target = null;
    window._isDraggingElement = false;
  });
}

function getElementTransforms() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return {};
  const result = {};
  canvas.querySelectorAll('[data-drag-id]').forEach(el => {
    if (el.style.transform) result[el.dataset.dragId] = el.style.transform;
  });
  return result;
}

function restoreElementTransforms(transforms) {
  if (!transforms) return;
  const canvas = document.getElementById('canvas');
  Object.entries(transforms).forEach(([id, tx]) => {
    const el = canvas.querySelector('[data-drag-id="' + id + '"]');
    if (el) el.style.transform = tx;
  });
}

// ─── KLAVYE KISAYOLLARI ───────────────────────────────────────
document.addEventListener('keydown', function(e) {
  const active = document.activeElement;
  if (active && (active.getAttribute('contenteditable') === 'true' ||
      active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
  if (e.ctrlKey && !e.shiftKey && e.key === 'z') { e.preventDefault(); undoHistory(); }
  if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); redoHistory(); }
});

// ─── BOOT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initEditor);
