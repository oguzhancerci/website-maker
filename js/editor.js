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

  localStorage.setItem('site_' + siteData.id, JSON.stringify(siteData));

  // Update index
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

// ─── BOOT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initEditor);
