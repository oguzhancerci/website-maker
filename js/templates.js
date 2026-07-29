// ============================================================
// TEMPLATES.JS — 3 hazır şablon (Wix kalitesinde, görsel yükleme destekli)
// ============================================================

const TEMPLATES = {

  // ============================================================
  // 1. RESTORAN & KAFE
  // ============================================================
  restaurant: {
    id: 'restaurant',
    name: 'Restoran & Kafe',
    emoji: '🍽️',
    description: 'Restoranlar, kafeler ve yemek işletmeleri için premium şablon',
    defaultColors: { primary: '#C0392B', secondary: '#E67E22', bg: '#FFFFFF', text: '#2C3E50', light: '#FDF2E9' },

    css: `
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:var(--bg,#fff);color:var(--text,#2C3E50);}
:root{--primary:#C0392B;--secondary:#E67E22;--bg:#FFFFFF;--text:#2C3E50;--light:#FDF2E9;}
a{text-decoration:none;color:inherit;}
img{max-width:100%;display:block;}

/* IMAGE ZONES */
.img-zone{background:linear-gradient(135deg,#ccc 0%,#aaa 100%) center/cover no-repeat;position:relative;overflow:hidden;cursor:pointer;}
.img-upload-hint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.28);color:#fff;font-size:.8rem;font-weight:600;gap:8px;opacity:0;transition:opacity .25s;pointer-events:none;text-align:center;padding:10px;}
.img-upload-hint svg{width:30px;height:30px;opacity:.9;}
.img-zone:hover .img-upload-hint{opacity:1;}

/* EDITABLE */
.editable:hover{outline:2px dashed var(--secondary,#E67E22);outline-offset:3px;cursor:text;border-radius:3px;}
.editable[contenteditable="true"]{outline:2px solid var(--primary,#C0392B)!important;outline-offset:3px;background:rgba(255,255,255,.08);border-radius:3px;}

/* CONTAINER */
.rt-con{max-width:1200px;margin:0 auto;padding:0 clamp(16px,4vw,32px);}

/* NAVBAR */
.rt-nav{position:sticky;top:0;width:100%;background:rgba(18,18,18,.96);backdrop-filter:blur(14px);z-index:500;}
.rt-nav-inner{display:flex;align-items:center;justify-content:space-between;padding:15px clamp(16px,4vw,32px);}
.rt-logo{font-size:clamp(1.1rem,3vw,1.4rem);font-weight:900;color:var(--secondary,#E67E22);white-space:nowrap;}
.rt-navlinks{display:flex;list-style:none;gap:24px;}
.rt-navlinks a{color:#ddd;font-size:.9rem;font-weight:500;transition:color .2s;white-space:nowrap;}
.rt-navlinks a:hover{color:var(--secondary,#E67E22);}
.rt-nav-right{display:flex;align-items:center;gap:10px;}
.rt-lang-btn{background:transparent;border:1px solid rgba(255,255,255,.3);color:#fff;padding:6px 14px;border-radius:20px;cursor:pointer;font-size:.8rem;transition:all .2s;white-space:nowrap;}
.rt-lang-btn:hover{background:var(--primary);border-color:var(--primary);}
.rt-ham{display:none;background:none;border:none;color:#fff;font-size:1.6rem;cursor:pointer;padding:4px;line-height:1;flex-shrink:0;}

/* MOBILE MENU */
.rt-mob-nav{display:none;position:fixed;inset:0;background:rgba(12,12,12,.98);z-index:600;flex-direction:column;align-items:center;justify-content:center;gap:28px;}
.rt-mob-nav.open{display:flex;}
.rt-mob-nav a{color:#fff;font-size:1.5rem;font-weight:700;text-decoration:none;transition:color .2s;}
.rt-mob-nav a:hover{color:var(--secondary,#E67E22);}
.rt-mob-close{position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;line-height:1;}
.rt-mob-lang{background:none;border:1px solid #555;color:#fff;padding:9px 24px;border-radius:24px;font-size:1rem;cursor:pointer;margin-top:8px;}

/* HERO */
.rt-hero{position:relative;min-height:92vh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;}
.rt-hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,#1a0a00 0%,#4a1500 100%);z-index:0;}
.rt-hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.35) 60%,rgba(0,0,0,.6) 100%);z-index:1;}
.rt-hero-content{position:relative;z-index:2;max-width:760px;padding:100px 24px 60px;}
.rt-hero h1{font-size:clamp(2rem,6vw,4.2rem);font-weight:900;color:#fff;text-shadow:0 3px 16px rgba(0,0,0,.4);margin-bottom:20px;line-height:1.12;}
.rt-hero p{font-size:clamp(.95rem,2.5vw,1.25rem);color:rgba(255,255,255,.88);margin-bottom:40px;line-height:1.65;}
.rt-hero-btns{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;}
.rt-btn{display:inline-flex;align-items:center;justify-content:center;padding:clamp(12px,2vw,16px) clamp(24px,4vw,44px);border-radius:50px;font-weight:700;font-size:clamp(.88rem,2vw,1rem);transition:all .25s;cursor:pointer;border:none;text-decoration:none;white-space:nowrap;}
.rt-btn-primary{background:#fff;color:var(--primary,#C0392B);}
.rt-btn-primary:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.25);}
.rt-btn-outline{background:transparent;border:2px solid rgba(255,255,255,.7);color:#fff;}
.rt-btn-outline:hover{background:rgba(255,255,255,.12);border-color:#fff;}
.rt-scroll-hint{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);z-index:2;color:rgba(255,255,255,.5);font-size:.75rem;display:flex;flex-direction:column;align-items:center;gap:6px;animation:bounce 2s infinite;}
@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(6px);}}

/* SECTION SHARED */
.rt-sec-label{display:inline-block;background:var(--primary,#C0392B);color:#fff;font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:14px;}
.rt-sec-title{font-size:clamp(1.7rem,4vw,2.6rem);font-weight:900;color:var(--text,#2C3E50);margin-bottom:14px;line-height:1.2;}
.rt-sec-sub{font-size:clamp(.9rem,2vw,1.05rem);color:#888;line-height:1.7;max-width:600px;}
.rt-sec-header{text-align:center;margin-bottom:clamp(36px,5vw,56px);}
.rt-sec-header .rt-sec-sub{margin:0 auto;}

/* ABOUT */
.rt-about{padding:clamp(60px,8vw,100px) 0;background:var(--bg,#fff);}
.rt-about-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,6vw,72px);align-items:center;}
.rt-about-text .rt-sec-title{text-align:left;}
.rt-about-text p{font-size:clamp(.9rem,2vw,1.05rem);line-height:1.85;color:#666;margin-bottom:32px;}
.rt-stats{display:flex;gap:clamp(20px,4vw,40px);flex-wrap:wrap;}
.rt-stat strong{display:block;font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;color:var(--primary,#C0392B);}
.rt-stat span{font-size:.78rem;color:#999;text-transform:uppercase;letter-spacing:.5px;}
.rt-about-img{border-radius:20px;height:clamp(260px,35vw,420px);min-height:200px;}

/* MENU */
.rt-menu{padding:clamp(60px,8vw,100px) 0;background:var(--light,#FDF2E9);}
.rt-menu-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,3vw,32px);}
.rt-menu-cat{background:var(--bg,#fff);border-radius:18px;padding:clamp(20px,3vw,30px);box-shadow:0 4px 24px rgba(0,0,0,.06);}
.rt-menu-cat h3{font-size:clamp(.95rem,2vw,1.2rem);font-weight:700;color:var(--primary,#C0392B);margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid var(--primary,#C0392B);}
.rt-menu-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #f0f0f0;gap:8px;}
.rt-menu-row:last-child{border:none;}
.rt-menu-row .name{color:var(--text,#2C3E50);font-size:.92rem;flex:1;min-width:0;}
.rt-menu-row .price{font-weight:700;color:var(--primary,#C0392B);font-size:.92rem;white-space:nowrap;flex-shrink:0;}

/* GALLERY */
.rt-gallery{padding:clamp(60px,8vw,100px) 0;background:var(--bg,#fff);}
.rt-gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,2vw,16px);}
.rt-gallery-item{border-radius:14px;aspect-ratio:4/3;background:linear-gradient(135deg,#e8e0da,#d0c4bc);}

/* TESTIMONIALS */
.rt-testi{padding:clamp(60px,8vw,100px) 0;background:var(--light,#FDF2E9);}
.rt-testi-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,3vw,28px);}
.rt-testi-card{background:var(--bg,#fff);border-radius:18px;padding:clamp(20px,3vw,32px);box-shadow:0 4px 24px rgba(0,0,0,.06);display:flex;flex-direction:column;gap:16px;}
.rt-stars{color:var(--secondary,#E67E22);font-size:1rem;letter-spacing:2px;}
.rt-testi-text{font-size:.95rem;color:#666;line-height:1.7;font-style:italic;flex:1;}
.rt-testi-author{display:flex;align-items:center;gap:12px;border-top:1px solid #f0f0f0;padding-top:16px;}
.rt-author-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--primary,#C0392B),var(--secondary,#E67E22));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.1rem;flex-shrink:0;}
.rt-author-name{font-weight:700;font-size:.9rem;color:var(--text,#2C3E50);}
.rt-author-role{font-size:.78rem;color:#999;}

/* CONTACT */
.rt-contact{padding:clamp(60px,8vw,100px) 0;background:var(--bg,#fff);}
.rt-contact-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,6vw,72px);align-items:start;}
.rt-contact-item{display:flex;gap:16px;margin-bottom:28px;align-items:flex-start;}
.rt-c-icon{width:44px;height:44px;background:var(--light,#FDF2E9);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;}
.rt-contact-item strong{display:block;font-weight:700;color:var(--text,#2C3E50);margin-bottom:4px;font-size:.95rem;}
.rt-contact-item p{color:#777;line-height:1.55;font-size:.9rem;}
.rt-reserve-form{background:var(--light,#FDF2E9);border-radius:20px;padding:clamp(20px,4vw,36px);}
.rt-reserve-form h3{font-size:1.2rem;font-weight:700;color:var(--text,#2C3E50);margin-bottom:20px;}
.rt-inp{width:100%;padding:12px 16px;border:1px solid #e0e0e0;border-radius:10px;font-size:.93rem;color:var(--text,#2C3E50);background:#fff;outline:none;transition:border .2s;font-family:inherit;margin-bottom:12px;}
.rt-inp:focus{border-color:var(--primary,#C0392B);}
.rt-btn-form{width:100%;padding:14px;background:var(--primary,#C0392B);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .25s;margin-top:4px;}
.rt-btn-form:hover{opacity:.88;transform:translateY(-1px);}

/* FOOTER */
.rt-footer{background:#111;color:#fff;padding:clamp(36px,6vw,60px) 0 20px;}
.rt-footer-grid{display:grid;grid-template-columns:1.5fr repeat(2,1fr);gap:clamp(24px,4vw,48px);margin-bottom:clamp(28px,4vw,44px);}
.rt-footer-brand .name{font-size:1.3rem;font-weight:800;color:var(--secondary,#E67E22);margin-bottom:8px;}
.rt-footer-brand .tagline{color:rgba(255,255,255,.45);font-size:.88rem;line-height:1.6;margin-bottom:20px;}
.rt-socials{display:flex;gap:10px;flex-wrap:wrap;}
.rt-soc{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.72rem;color:#fff;text-decoration:none;transition:all .25s;text-transform:uppercase;flex-shrink:0;}
.soc-ig{background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);}
.soc-fb{background:#1877F2;}.soc-tw{background:#1DA1F2;}.soc-yt{background:#FF0000;}.soc-li{background:#0A66C2;}
.rt-soc:hover{transform:translateY(-3px) scale(1.12);}
.rt-footer-col h4{font-size:.88rem;font-weight:700;color:#fff;margin-bottom:16px;text-transform:uppercase;letter-spacing:.5px;}
.rt-footer-col ul{list-style:none;}
.rt-footer-col li{margin-bottom:10px;}
.rt-footer-col a{color:rgba(255,255,255,.45);font-size:.85rem;transition:color .2s;}
.rt-footer-col a:hover{color:var(--secondary,#E67E22);}
.rt-footer-bot{border-top:1px solid rgba(255,255,255,.08);padding-top:20px;text-align:center;color:rgba(255,255,255,.3);font-size:.8rem;}

/* WHATSAPP */
.rt-wa{position:fixed;bottom:28px;right:28px;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 20px rgba(37,211,102,.45);z-index:999;transition:all .25s;text-decoration:none;}
.rt-wa:hover{transform:scale(1.12);box-shadow:0 6px 32px rgba(37,211,102,.65);}
.rt-wa svg{width:26px;height:26px;}

/* RESPONSIVE */
@container(max-width:900px){
  .rt-menu-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .rt-testi-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .rt-footer-grid{grid-template-columns:1fr 1fr;}
}
@container(max-width:768px){
  .rt-navlinks,.rt-nav-right{display:none;}
  .rt-ham{display:block;}
  .rt-about-grid,.rt-contact-grid{grid-template-columns:minmax(0,1fr);}
  .rt-menu-grid{grid-template-columns:minmax(0,1fr);}
  .rt-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .rt-testi-grid{grid-template-columns:minmax(0,1fr);}
  .rt-footer-grid{grid-template-columns:minmax(0,1fr);}
  .rt-wa{bottom:16px;right:16px;}
}
@container(max-width:480px){
  .rt-gallery-grid{grid-template-columns:minmax(0,1fr);}
  .rt-hero-btns{flex-direction:column;align-items:stretch;}
  .rt-btn{width:100%;text-align:center;}
}
    `,

    html: `
      <!-- NAVBAR -->
      <nav class="rt-nav">
        <div class="rt-nav-inner">
          <div class="rt-logo editable" data-key="logo" data-tr="🍽️ Restoran Adı" data-en="🍽️ Restaurant Name">🍽️ Restoran Adı</div>
          <ul class="rt-navlinks">
            <li><a href="#rt-about" class="editable" data-key="nav-about" data-tr="Hakkımızda" data-en="About">Hakkımızda</a></li>
            <li><a href="#rt-menu" class="editable" data-key="nav-menu" data-tr="Menü" data-en="Menu">Menü</a></li>
            <li><a href="#rt-gallery" class="editable" data-key="nav-gallery" data-tr="Galeri" data-en="Gallery">Galeri</a></li>
            <li><a href="#rt-contact" class="editable" data-key="nav-contact" data-tr="İletişim" data-en="Contact">İletişim</a></li>
          </ul>
          <div class="rt-nav-right">
            <button class="rt-lang-btn" id="lang-toggle-btn" onclick="window.toggleLang&&window.toggleLang()">🌐 <span id="lang-label">EN</span></button>
          </div>
          <button class="rt-ham" onclick="document.getElementById('rt-mob-nav').classList.add('open')">☰</button>
        </div>
      </nav>
      <div class="rt-mob-nav" id="rt-mob-nav">
        <button class="rt-mob-close" onclick="document.getElementById('rt-mob-nav').classList.remove('open')">✕</button>
        <a href="#rt-about" onclick="document.getElementById('rt-mob-nav').classList.remove('open')">Hakkımızda</a>
        <a href="#rt-menu" onclick="document.getElementById('rt-mob-nav').classList.remove('open')">Menü</a>
        <a href="#rt-gallery" onclick="document.getElementById('rt-mob-nav').classList.remove('open')">Galeri</a>
        <a href="#rt-contact" onclick="document.getElementById('rt-mob-nav').classList.remove('open')">İletişim</a>
        <button class="rt-mob-lang" onclick="window.toggleLang&&window.toggleLang()">🌐 TR / EN</button>
      </div>

      <!-- HERO -->
      <section class="rt-hero" id="rt-hero">
        <div class="rt-hero-bg img-zone" data-img-key="hero-bg">
          <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Hero arka plan fotoğrafı</div>
        </div>
        <div class="rt-hero-overlay"></div>
        <div class="rt-hero-content">
          <h1 class="editable" data-key="hero-title" data-tr="Lezzet Durağı" data-en="Taste Stop">Lezzet Durağı</h1>
          <p class="editable" data-key="hero-sub" data-tr="Geleneksel lezzetler, modern bir sunumla buluşuyor. Her lokmada bir hikaye var." data-en="Traditional flavors meet modern presentation. There is a story in every bite.">Geleneksel lezzetler, modern bir sunumla buluşuyor. Her lokmada bir hikaye var.</p>
          <div class="rt-hero-btns">
            <a href="#rt-menu" class="rt-btn rt-btn-primary editable" data-key="hero-btn1" data-tr="Menüye Göz At" data-en="View Menu">Menüye Göz At</a>
            <a href="#rt-contact" class="rt-btn rt-btn-outline editable" data-key="hero-btn2" data-tr="Rezervasyon Yap" data-en="Make Reservation">Rezervasyon Yap</a>
          </div>
        </div>
        <div class="rt-scroll-hint">▼</div>
      </section>

      <!-- ABOUT -->
      <section class="rt-about" id="rt-about">
        <div class="rt-con">
          <div class="rt-about-grid">
            <div class="rt-about-text">
              <span class="rt-sec-label">Hakkımızda</span>
              <h2 class="rt-sec-title editable" data-key="about-title" data-tr="Hikayemiz" data-en="Our Story">Hikayemiz</h2>
              <p class="editable" data-key="about-text" data-tr="Yıllardır ailemizden gelen tarifleri sizlerle buluşturuyoruz. Her tabak, özenle seçilmiş taze malzemeler ve sevgiyle hazırlanmış eşsiz bir deneyimdir. Misafirlerimize en iyi lezzet deneyimini sunmak için her gün çalışıyoruz." data-en="We bring you recipes passed down through generations. Every dish is a unique experience crafted with fresh ingredients and love. We work every day to offer our guests the finest dining experience.">Yıllardır ailemizden gelen tarifleri sizlerle buluşturuyoruz. Her tabak, özenle seçilmiş taze malzemeler ve sevgiyle hazırlanmış eşsiz bir deneyimdir.</p>
              <div class="rt-stats">
                <div class="rt-stat">
                  <strong class="editable" data-key="s1n" data-tr="15+" data-en="15+">15+</strong>
                  <span class="editable" data-key="s1l" data-tr="Yıl Deneyim" data-en="Years">Yıl Deneyim</span>
                </div>
                <div class="rt-stat">
                  <strong class="editable" data-key="s2n" data-tr="200+" data-en="200+">200+</strong>
                  <span class="editable" data-key="s2l" data-tr="Müşteri/Gün" data-en="Guests/Day">Müşteri/Gün</span>
                </div>
                <div class="rt-stat">
                  <strong class="editable" data-key="s3n" data-tr="50+" data-en="50+">50+</strong>
                  <span class="editable" data-key="s3l" data-tr="Özel Tarif" data-en="Recipes">Özel Tarif</span>
                </div>
              </div>
            </div>
            <div class="rt-about-img img-zone" data-img-key="about-img">
              <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Restoran fotoğrafı yükle</div>
            </div>
          </div>
        </div>
      </section>

      <!-- MENU -->
      <section class="rt-menu" id="rt-menu">
        <div class="rt-con">
          <div class="rt-sec-header">
            <span class="rt-sec-label">Menü</span>
            <h2 class="rt-sec-title editable" data-key="menu-title" data-tr="Seçkin Lezzetlerimiz" data-en="Our Signature Dishes">Seçkin Lezzetlerimiz</h2>
            <p class="rt-sec-sub editable" data-key="menu-sub" data-tr="Taze malzemeler ve geleneksel tariflerle hazırlanan özel menümüz" data-en="Our special menu prepared with fresh ingredients and traditional recipes">Taze malzemeler ve geleneksel tariflerle hazırlanan özel menümüz</p>
          </div>
          <div class="rt-menu-grid">
            <div class="rt-menu-cat">
              <h3 class="editable" data-key="cat1" data-tr="🥗 Başlangıçlar" data-en="🥗 Starters">🥗 Başlangıçlar</h3>
              <div class="rt-menu-row"><span class="name editable" data-key="i1n" data-tr="Mercimek Çorbası" data-en="Lentil Soup">Mercimek Çorbası</span><span class="price editable" data-key="i1p" data-tr="₺95" data-en="₺95">₺95</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i2n" data-tr="Mevsim Salatası" data-en="Seasonal Salad">Mevsim Salatası</span><span class="price editable" data-key="i2p" data-tr="₺110" data-en="₺110">₺110</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i3n" data-tr="Humus Tabağı" data-en="Hummus Plate">Humus Tabağı</span><span class="price editable" data-key="i3p" data-tr="₺85" data-en="₺85">₺85</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i4n" data-tr="Sigara Böreği" data-en="Fried Pastry">Sigara Böreği</span><span class="price editable" data-key="i4p" data-tr="₺75" data-en="₺75">₺75</span></div>
            </div>
            <div class="rt-menu-cat">
              <h3 class="editable" data-key="cat2" data-tr="🍖 Ana Yemekler" data-en="🍖 Main Courses">🍖 Ana Yemekler</h3>
              <div class="rt-menu-row"><span class="name editable" data-key="i5n" data-tr="Kuzu Şiş" data-en="Lamb Skewer">Kuzu Şiş</span><span class="price editable" data-key="i5p" data-tr="₺295" data-en="₺295">₺295</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i6n" data-tr="Tavuk Güveç" data-en="Chicken Casserole">Tavuk Güveç</span><span class="price editable" data-key="i6p" data-tr="₺195" data-en="₺195">₺195</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i7n" data-tr="Balık Izgara" data-en="Grilled Fish">Balık Izgara</span><span class="price editable" data-key="i7p" data-tr="₺245" data-en="₺245">₺245</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i8n" data-tr="Vejetaryen Tabak" data-en="Vegetarian Plate">Vejetaryen Tabak</span><span class="price editable" data-key="i8p" data-tr="₺165" data-en="₺165">₺165</span></div>
            </div>
            <div class="rt-menu-cat">
              <h3 class="editable" data-key="cat3" data-tr="🍮 Tatlılar" data-en="🍮 Desserts">🍮 Tatlılar</h3>
              <div class="rt-menu-row"><span class="name editable" data-key="i9n" data-tr="Baklava" data-en="Baklava">Baklava</span><span class="price editable" data-key="i9p" data-tr="₺130" data-en="₺130">₺130</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i10n" data-tr="Sütlaç" data-en="Rice Pudding">Sütlaç</span><span class="price editable" data-key="i10p" data-tr="₺95" data-en="₺95">₺95</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i11n" data-tr="Künefe" data-en="Kunefe">Künefe</span><span class="price editable" data-key="i11p" data-tr="₺155" data-en="₺155">₺155</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i12n" data-tr="Dondurma" data-en="Ice Cream">Dondurma</span><span class="price editable" data-key="i12p" data-tr="₺75" data-en="₺75">₺75</span></div>
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section class="rt-gallery" id="rt-gallery">
        <div class="rt-con">
          <div class="rt-sec-header">
            <span class="rt-sec-label">Galeri</span>
            <h2 class="rt-sec-title editable" data-key="gallery-title" data-tr="Fotoğraf Galerimiz" data-en="Photo Gallery">Fotoğraf Galerimiz</h2>
          </div>
          <div class="rt-gallery-grid">
            <div class="rt-gallery-item img-zone" data-img-key="gal-1"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="rt-gallery-item img-zone" data-img-key="gal-2"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="rt-gallery-item img-zone" data-img-key="gal-3"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="rt-gallery-item img-zone" data-img-key="gal-4"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="rt-gallery-item img-zone" data-img-key="gal-5"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="rt-gallery-item img-zone" data-img-key="gal-6"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section class="rt-testi" id="rt-testi">
        <div class="rt-con">
          <div class="rt-sec-header">
            <span class="rt-sec-label">Yorumlar</span>
            <h2 class="rt-sec-title editable" data-key="testi-title" data-tr="Müşterilerimiz Ne Diyor?" data-en="What Our Guests Say?">Müşterilerimiz Ne Diyor?</h2>
          </div>
          <div class="rt-testi-grid">
            <div class="rt-testi-card">
              <div class="rt-stars">★★★★★</div>
              <p class="rt-testi-text editable" data-key="t1" data-tr="Harika bir akşam yemeği deneyimiydi. Yemekler nefis, servis mükemmeldi. Kesinlikle tekrar geleceğiz!" data-en="It was a wonderful dining experience. The food was delicious, the service was excellent. We will definitely come back!">Harika bir akşam yemeği deneyimiydi. Yemekler nefis, servis mükemmeldi. Kesinlikle tekrar geleceğiz!</p>
              <div class="rt-testi-author"><div class="rt-author-avatar">A</div><div><div class="rt-author-name editable" data-key="t1n" data-tr="Ayşe Kaya" data-en="Ayşe Kaya">Ayşe Kaya</div><div class="rt-author-role editable" data-key="t1r" data-tr="Google Yorumu" data-en="Google Review">Google Yorumu</div></div></div>
            </div>
            <div class="rt-testi-card">
              <div class="rt-stars">★★★★★</div>
              <p class="rt-testi-text editable" data-key="t2" data-tr="Ortam çok şık ve samimi. Kuzu şiş hayatımda yediğim en lezzetlisiydi. Fiyat-performans açısından da çok iyi." data-en="The atmosphere is very stylish and warm. The lamb skewer was the most delicious I've ever had. Great value for money too.">Ortam çok şık ve samimi. Kuzu şiş hayatımda yediğim en lezzetlisiydi. Fiyat-performans açısından da çok iyi.</p>
              <div class="rt-testi-author"><div class="rt-author-avatar">M</div><div><div class="rt-author-name editable" data-key="t2n" data-tr="Mehmet Demir" data-en="Mehmet Demir">Mehmet Demir</div><div class="rt-author-role editable" data-key="t2r" data-tr="TripAdvisor" data-en="TripAdvisor">TripAdvisor</div></div></div>
            </div>
            <div class="rt-testi-card">
              <div class="rt-stars">★★★★★</div>
              <p class="rt-testi-text editable" data-key="t3" data-tr="Her zaman tazelenen menüleri ve özel günlere özel sunumları ile ayrıcalıklı bir deneyim sunuyorlar." data-en="They offer a special experience with their ever-changing menus and special occasion presentations.">Her zaman tazelenen menüleri ve özel günlere özel sunumları ile ayrıcalıklı bir deneyim sunuyorlar.</p>
              <div class="rt-testi-author"><div class="rt-author-avatar">Z</div><div><div class="rt-author-name editable" data-key="t3n" data-tr="Zeynep Arslan" data-en="Zeynep Arslan">Zeynep Arslan</div><div class="rt-author-role editable" data-key="t3r" data-tr="Düzenli Müşteri" data-en="Regular Guest">Düzenli Müşteri</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTACT -->
      <section class="rt-contact" id="rt-contact">
        <div class="rt-con">
          <div class="rt-sec-header">
            <span class="rt-sec-label">İletişim</span>
            <h2 class="rt-sec-title editable" data-key="contact-title" data-tr="Bize Ulaşın" data-en="Get In Touch">Bize Ulaşın</h2>
          </div>
          <div class="rt-contact-grid">
            <div>
              <div class="rt-contact-item"><div class="rt-c-icon">📍</div><div><strong class="editable" data-key="addr-l" data-tr="Adres" data-en="Address">Adres</strong><p class="editable" data-key="addr" data-tr="Örnek Mah. Lezzet Sk. No:1, Kadıköy / İstanbul" data-en="Example St. No:1, Kadikoy / Istanbul">Örnek Mah. Lezzet Sk. No:1, Kadıköy / İstanbul</p></div></div>
              <div class="rt-contact-item"><div class="rt-c-icon">📞</div><div><strong class="editable" data-key="phone-l" data-tr="Telefon" data-en="Phone">Telefon</strong><p class="editable" data-key="phone" data-tr="+90 (555) 000 00 00" data-en="+90 (555) 000 00 00">+90 (555) 000 00 00</p></div></div>
              <div class="rt-contact-item"><div class="rt-c-icon">🕐</div><div><strong class="editable" data-key="hours-l" data-tr="Çalışma Saatleri" data-en="Opening Hours">Çalışma Saatleri</strong><p class="editable" data-key="hours" data-tr="Her gün 11:00 – 23:00" data-en="Every day 11:00 – 23:00">Her gün 11:00 – 23:00</p></div></div>
              <div class="rt-contact-item"><div class="rt-c-icon">✉️</div><div><strong class="editable" data-key="email-l" data-tr="E-posta" data-en="Email">E-posta</strong><p class="editable" data-key="email" data-tr="info@restoranim.com" data-en="info@restaurant.com">info@restoranim.com</p></div></div>
            </div>
            <div class="rt-reserve-form">
              <h3 class="editable" data-key="res-title" data-tr="Rezervasyon Talebi" data-en="Reservation Request">Rezervasyon Talebi</h3>
              <input id="rt-res-name" class="rt-inp" placeholder="Adınız Soyadınız">
              <input id="rt-res-tel" class="rt-inp" type="tel" placeholder="Telefon Numaranız">
              <input id="rt-res-date" class="rt-inp" type="date">
              <input id="rt-res-pax" class="rt-inp" placeholder="Kişi Sayısı (ör. 4)">
              <input id="rt-res-note" class="rt-inp" placeholder="Not / Özel İstek (isteğe bağlı)">
              <button class="rt-btn-form" style="background:#25D366;" onclick="window.rtSendWA&&window.rtSendWA()">💬 WhatsApp ile Rezervasyon Yap</button>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="rt-footer">
        <div class="rt-con">
          <div class="rt-footer-grid">
            <div class="rt-footer-brand">
              <div class="name editable" data-key="footer-logo" data-tr="🍽️ Restoran Adı" data-en="🍽️ Restaurant Name">🍽️ Restoran Adı</div>
              <div class="tagline editable" data-key="footer-tag" data-tr="Lezzetin en özel adresi" data-en="The finest address of taste">Lezzetin en özel adresi</div>
              <div class="rt-socials">
                <a class="rt-soc soc-ig" data-social="instagram" href="#" title="Instagram">ig</a>
                <a class="rt-soc soc-fb" data-social="facebook" href="#" title="Facebook">fb</a>
                <a class="rt-soc soc-tw" data-social="twitter" href="#" title="Twitter">tw</a>
                <a class="rt-soc soc-yt" data-social="youtube" href="#" title="YouTube">yt</a>
              </div>
            </div>
            <div class="rt-footer-col">
              <h4>Hızlı Linkler</h4>
              <ul>
                <li><a href="#rt-about">Hakkımızda</a></li>
                <li><a href="#rt-menu">Menü</a></li>
                <li><a href="#rt-gallery">Galeri</a></li>
                <li><a href="#rt-contact">İletişim</a></li>
              </ul>
            </div>
            <div class="rt-footer-col">
              <h4>İletişim</h4>
              <ul>
                <li><a href="#" class="editable" data-key="footer-addr" data-tr="Kadıköy / İstanbul" data-en="Kadikoy / Istanbul">Kadıköy / İstanbul</a></li>
                <li><a href="#" class="editable" data-key="footer-phone" data-tr="+90 555 000 0000" data-en="+90 555 000 0000">+90 555 000 0000</a></li>
                <li><a href="#" class="editable" data-key="footer-email" data-tr="info@restoran.com" data-en="info@restoran.com">info@restoran.com</a></li>
              </ul>
            </div>
          </div>
          <div class="rt-footer-bot">
            <p class="editable" data-key="footer-cr" data-tr="© 2025 Restoran Adı. Tüm hakları saklıdır." data-en="© 2025 Restaurant Name. All rights reserved.">© 2025 Restoran Adı. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      <!-- WHATSAPP -->
      <a href="#" class="rt-wa" id="wa-btn" title="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    `
  },

  // ============================================================
  // 2. HİZMET FİRMASI
  // ============================================================
  service: {
    id: 'service',
    name: 'Hizmet Firması',
    emoji: '🔧',
    description: 'Berber, tamirci, temizlik ve tüm hizmet işletmeleri için',
    defaultColors: { primary: '#2563EB', secondary: '#1E40AF', bg: '#FFFFFF', text: '#1F2937', light: '#EFF6FF' },

    css: `
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:var(--bg,#fff);color:var(--text,#1F2937);}
:root{--primary:#2563EB;--secondary:#1E40AF;--bg:#FFFFFF;--text:#1F2937;--light:#EFF6FF;}
a{text-decoration:none;color:inherit;}
img{max-width:100%;display:block;}

.img-zone{background:linear-gradient(135deg,#ccc 0%,#aaa 100%) center/cover no-repeat;position:relative;overflow:hidden;cursor:pointer;}
.img-upload-hint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.28);color:#fff;font-size:.8rem;font-weight:600;gap:8px;opacity:0;transition:opacity .25s;pointer-events:none;text-align:center;padding:10px;}
.img-upload-hint svg{width:30px;height:30px;opacity:.9;}
.img-zone:hover .img-upload-hint{opacity:1;}

.editable:hover{outline:2px dashed var(--primary,#2563EB);outline-offset:3px;cursor:text;border-radius:3px;}
.editable[contenteditable="true"]{outline:2px solid var(--primary,#2563EB)!important;outline-offset:3px;background:rgba(255,255,255,.08);border-radius:3px;}

.sv-con{max-width:1200px;margin:0 auto;padding:0 clamp(16px,4vw,32px);}

/* NAVBAR */
.sv-nav{position:sticky;top:0;background:#fff;box-shadow:0 2px 20px rgba(0,0,0,.08);z-index:500;}
.sv-nav-inner{display:flex;align-items:center;justify-content:space-between;padding:15px clamp(16px,4vw,32px);}
.sv-logo{font-size:clamp(1.1rem,3vw,1.35rem);font-weight:900;color:var(--primary,#2563EB);white-space:nowrap;}
.sv-navlinks{display:flex;list-style:none;gap:24px;}
.sv-navlinks a{color:var(--text,#1F2937);font-size:.9rem;font-weight:500;transition:color .2s;white-space:nowrap;}
.sv-navlinks a:hover{color:var(--primary,#2563EB);}
.sv-nav-right{display:flex;align-items:center;gap:10px;}
.sv-lang-btn{background:transparent;border:1px solid #ddd;color:var(--text,#1F2937);padding:6px 14px;border-radius:20px;cursor:pointer;font-size:.8rem;transition:all .2s;white-space:nowrap;}
.sv-lang-btn:hover{border-color:var(--primary);color:var(--primary);}
.sv-phone-badge{background:var(--primary,#2563EB);color:#fff;padding:8px 18px;border-radius:20px;font-size:.85rem;font-weight:600;white-space:nowrap;}
.sv-ham{display:none;background:none;border:none;color:var(--text,#1F2937);font-size:1.6rem;cursor:pointer;padding:4px;line-height:1;flex-shrink:0;}

.sv-mob-nav{display:none;position:fixed;inset:0;background:rgba(255,255,255,.98);z-index:600;flex-direction:column;align-items:center;justify-content:center;gap:28px;}
.sv-mob-nav.open{display:flex;}
.sv-mob-nav a{color:var(--text,#1F2937);font-size:1.5rem;font-weight:700;text-decoration:none;transition:color .2s;}
.sv-mob-nav a:hover{color:var(--primary,#2563EB);}
.sv-mob-close{position:absolute;top:20px;right:24px;background:none;border:none;color:var(--text,#1F2937);font-size:2rem;cursor:pointer;line-height:1;}
.sv-mob-lang{background:var(--primary);border:none;color:#fff;padding:10px 28px;border-radius:24px;font-size:1rem;cursor:pointer;margin-top:8px;}

/* HERO */
.sv-hero{padding:clamp(80px,12vw,130px) 0 clamp(60px,8vw,100px);background:linear-gradient(135deg,var(--secondary,#1E40AF) 0%,var(--primary,#2563EB) 65%,#60A5FA 100%);position:relative;overflow:hidden;}
.sv-hero::before{content:'';position:absolute;top:-40%;right:-8%;width:500px;height:500px;border-radius:50%;background:rgba(255,255,255,.06);}
.sv-hero::after{content:'';position:absolute;bottom:-30%;left:-5%;width:350px;height:350px;border-radius:50%;background:rgba(255,255,255,.04);}
.sv-hero-inner{display:grid;grid-template-columns:1.2fr minmax(0,1fr);gap:clamp(32px,6vw,64px);align-items:center;position:relative;z-index:1;}
.sv-badge{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:#fff;padding:5px 16px;border-radius:30px;font-size:.78rem;font-weight:600;letter-spacing:.5px;margin-bottom:18px;}
.sv-hero h1{font-size:clamp(1.8rem,4.5vw,3.4rem);font-weight:900;color:#fff;line-height:1.2;margin-bottom:16px;}
.sv-hero p{font-size:clamp(.9rem,2vw,1.1rem);color:rgba(255,255,255,.85);line-height:1.7;margin-bottom:32px;}
.sv-hero-btns{display:flex;gap:12px;flex-wrap:wrap;}
.sv-btn{display:inline-flex;align-items:center;justify-content:center;padding:clamp(11px,2vw,14px) clamp(22px,3vw,32px);border-radius:10px;font-weight:700;font-size:clamp(.85rem,2vw,.95rem);transition:all .25s;cursor:pointer;border:none;text-decoration:none;white-space:nowrap;}
.sv-btn-white{background:#fff;color:var(--primary,#2563EB);}
.sv-btn-white:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.15);}
.sv-btn-outline{background:transparent;border:2px solid rgba(255,255,255,.5);color:#fff;}
.sv-btn-outline:hover{background:rgba(255,255,255,.1);border-color:#fff;}
.sv-hero-card{background:#fff;border-radius:20px;padding:clamp(20px,3vw,36px);box-shadow:0 20px 60px rgba(0,0,0,.2);}
.sv-hero-card h3{font-size:1.05rem;font-weight:700;color:var(--text,#1F2937);margin-bottom:18px;}
.sv-cq-item{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#f8f9ff;border-radius:10px;margin-bottom:10px;}
.sv-cq-icon{font-size:1.2rem;flex-shrink:0;}
.sv-cq-text strong{display:block;font-size:.72rem;color:#999;font-weight:600;text-transform:uppercase;}
.sv-cq-text span{font-size:.92rem;font-weight:600;color:var(--text,#1F2937);}

/* SERVICES */
.sv-services{padding:clamp(60px,8vw,100px) 0;background:var(--bg,#fff);}
.sv-sec-label{display:inline-block;background:var(--primary,#2563EB);color:#fff;font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:14px;}
.sv-sec-title{font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;color:var(--text,#1F2937);margin-bottom:12px;line-height:1.2;}
.sv-sec-sub{font-size:clamp(.9rem,2vw,1.05rem);color:#888;line-height:1.7;max-width:580px;}
.sv-sec-header{text-align:center;margin-bottom:clamp(36px,5vw,56px);}
.sv-sec-header .sv-sec-sub{margin:0 auto;}
.sv-services-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,3vw,28px);}
.sv-svc-card{background:#fff;border:1px solid #eee;border-radius:18px;padding:clamp(20px,3vw,32px);text-align:center;transition:all .3s;box-shadow:0 2px 12px rgba(0,0,0,.04);}
.sv-svc-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px rgba(37,99,235,.12);border-color:var(--primary,#2563EB);}
.sv-svc-icon{width:64px;height:64px;background:var(--light,#EFF6FF);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 18px;}
.sv-svc-card h3{font-size:clamp(.95rem,2vw,1.15rem);font-weight:700;color:var(--text,#1F2937);margin-bottom:10px;}
.sv-svc-card p{font-size:.88rem;color:#888;line-height:1.6;}
.sv-svc-price{display:inline-block;margin-top:14px;background:var(--light,#EFF6FF);color:var(--primary,#2563EB);padding:5px 14px;border-radius:20px;font-size:.85rem;font-weight:700;}

/* WHY US */
.sv-why{padding:clamp(60px,8vw,100px) 0;background:var(--light,#EFF6FF);}
.sv-why-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,6vw,72px);align-items:center;}
.sv-why-text .sv-sec-title{text-align:left;}
.sv-why-text>p{color:#666;line-height:1.7;margin-bottom:28px;font-size:clamp(.9rem,2vw,1rem);}
.sv-why-items{display:flex;flex-direction:column;gap:18px;}
.sv-why-item{display:flex;gap:14px;align-items:flex-start;}
.sv-why-dot{width:42px;height:42px;background:var(--primary,#2563EB);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.1rem;flex-shrink:0;}
.sv-why-item strong{display:block;font-weight:700;margin-bottom:3px;color:var(--text,#1F2937);font-size:.95rem;}
.sv-why-item span{font-size:.87rem;color:#888;}
.sv-why-img{border-radius:20px;height:clamp(260px,35vw,420px);}

/* STEPS */
.sv-steps{padding:clamp(60px,8vw,100px) 0;background:var(--bg,#fff);}
.sv-steps-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(16px,3vw,28px);}
.sv-step{text-align:center;padding:clamp(20px,3vw,28px) 16px;position:relative;}
.sv-step::after{content:'→';position:absolute;top:32px;right:-10px;font-size:1.4rem;color:#ddd;}
.sv-step:last-child::after{display:none;}
.sv-step-num{width:52px;height:52px;background:var(--primary,#2563EB);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:900;margin:0 auto 18px;}
.sv-step h3{font-size:clamp(.88rem,2vw,1rem);font-weight:700;color:var(--text,#1F2937);margin-bottom:8px;}
.sv-step p{font-size:.85rem;color:#888;line-height:1.6;}

/* GALLERY */
.sv-gallery{padding:clamp(60px,8vw,100px) 0;background:var(--light,#EFF6FF);}
.sv-gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,2vw,16px);}
.sv-gallery-item{border-radius:14px;aspect-ratio:4/3;background:linear-gradient(135deg,#bfdbfe,#93c5fd);}

/* TESTIMONIALS */
.sv-testi{padding:clamp(60px,8vw,100px) 0;background:var(--bg,#fff);}
.sv-testi-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,3vw,28px);}
.sv-testi-card{background:#fff;border:1px solid #eee;border-radius:18px;padding:clamp(20px,3vw,32px);box-shadow:0 4px 24px rgba(0,0,0,.05);display:flex;flex-direction:column;gap:14px;}
.sv-stars{color:var(--primary,#2563EB);font-size:1rem;letter-spacing:2px;}
.sv-testi-text{font-size:.93rem;color:#666;line-height:1.7;font-style:italic;flex:1;}
.sv-testi-author{display:flex;align-items:center;gap:12px;border-top:1px solid #f0f0f0;padding-top:14px;}
.sv-author-av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--primary,#2563EB),var(--secondary,#1E40AF));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1rem;flex-shrink:0;}
.sv-author-name{font-weight:700;font-size:.88rem;color:var(--text,#1F2937);}
.sv-author-role{font-size:.76rem;color:#999;}

/* CONTACT */
.sv-contact{padding:clamp(60px,8vw,100px) 0;background:var(--light,#EFF6FF);}
.sv-contact-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,6vw,72px);align-items:start;}
.sv-contact-item{display:flex;gap:14px;margin-bottom:24px;align-items:flex-start;}
.sv-c-icon{width:42px;height:42px;background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;box-shadow:0 2px 12px rgba(0,0,0,.06);}
.sv-contact-item strong{display:block;font-weight:700;color:var(--text,#1F2937);margin-bottom:3px;font-size:.93rem;}
.sv-contact-item p{color:#777;line-height:1.55;font-size:.88rem;}
.sv-contact-form{background:#fff;border-radius:20px;padding:clamp(20px,4vw,36px);box-shadow:0 4px 32px rgba(0,0,0,.07);}
.sv-contact-form h3{font-size:1.15rem;font-weight:700;color:var(--text,#1F2937);margin-bottom:18px;}
.sv-inp{width:100%;padding:12px 16px;border:1px solid #e0e0e0;border-radius:10px;font-size:.92rem;color:var(--text,#1F2937);background:#f9fafb;outline:none;transition:border .2s;font-family:inherit;margin-bottom:12px;}
.sv-inp:focus{border-color:var(--primary,#2563EB);background:#fff;}
.sv-inp-ta{resize:vertical;min-height:100px;}
.sv-btn-send{width:100%;padding:14px;background:var(--primary,#2563EB);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .25s;margin-top:4px;}
.sv-btn-send:hover{opacity:.9;transform:translateY(-1px);}

/* FOOTER */
.sv-footer{background:#0f172a;color:#fff;padding:clamp(36px,6vw,60px) 0 20px;}
.sv-footer-grid{display:grid;grid-template-columns:1.5fr repeat(2,1fr);gap:clamp(24px,4vw,48px);margin-bottom:clamp(28px,4vw,44px);}
.sv-footer-brand .name{font-size:1.25rem;font-weight:800;color:var(--primary,#2563EB);margin-bottom:8px;}
.sv-footer-brand .tagline{color:rgba(255,255,255,.4);font-size:.86rem;line-height:1.6;margin-bottom:20px;}
.sv-socials{display:flex;gap:10px;flex-wrap:wrap;}
.sv-soc{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.7rem;color:#fff;text-decoration:none;transition:all .25s;text-transform:uppercase;flex-shrink:0;}
.soc-ig{background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);}
.soc-fb{background:#1877F2;}.soc-tw{background:#1DA1F2;}.soc-yt{background:#FF0000;}.soc-li{background:#0A66C2;}
.sv-soc:hover{transform:translateY(-3px) scale(1.12);}
.sv-footer-col h4{font-size:.84rem;font-weight:700;color:#fff;margin-bottom:14px;text-transform:uppercase;letter-spacing:.5px;}
.sv-footer-col ul{list-style:none;}
.sv-footer-col li{margin-bottom:9px;}
.sv-footer-col a{color:rgba(255,255,255,.4);font-size:.83rem;transition:color .2s;}
.sv-footer-col a:hover{color:var(--primary,#2563EB);}
.sv-footer-bot{border-top:1px solid rgba(255,255,255,.07);padding-top:20px;text-align:center;color:rgba(255,255,255,.28);font-size:.78rem;}

/* WHATSAPP */
.sv-wa{position:fixed;bottom:28px;right:28px;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 20px rgba(37,211,102,.45);z-index:999;transition:all .25s;text-decoration:none;}
.sv-wa:hover{transform:scale(1.12);box-shadow:0 6px 32px rgba(37,211,102,.65);}
.sv-wa svg{width:26px;height:26px;}

/* RESPONSIVE */
@container(max-width:900px){
  .sv-services-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .sv-steps-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .sv-testi-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .sv-footer-grid{grid-template-columns:1fr 1fr;}
  .sv-step::after{display:none;}
}
@container(max-width:768px){
  .sv-navlinks,.sv-nav-right{display:none;}
  .sv-ham{display:block;}
  .sv-hero-inner{grid-template-columns:minmax(0,1fr);}
  .sv-hero-card{display:none;}
  .sv-why-grid,.sv-contact-grid{grid-template-columns:minmax(0,1fr);}
  .sv-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .sv-testi-grid{grid-template-columns:minmax(0,1fr);}
  .sv-footer-grid{grid-template-columns:minmax(0,1fr);}
  .sv-wa{bottom:16px;right:16px;}
}
@container(max-width:480px){
  .sv-services-grid{grid-template-columns:minmax(0,1fr);}
  .sv-steps-grid{grid-template-columns:minmax(0,1fr);}
  .sv-gallery-grid{grid-template-columns:minmax(0,1fr);}
  .sv-hero-btns{flex-direction:column;align-items:stretch;}
  .sv-btn{width:100%;text-align:center;}
}
    `,

    html: `
      <!-- NAVBAR -->
      <nav class="sv-nav">
        <div class="sv-nav-inner">
          <div class="sv-logo editable" data-key="logo" data-tr="🔧 Firma Adı" data-en="🔧 Company Name">🔧 Firma Adı</div>
          <ul class="sv-navlinks">
            <li><a href="#sv-services" class="editable" data-key="nav-svc" data-tr="Hizmetler" data-en="Services">Hizmetler</a></li>
            <li><a href="#sv-why" class="editable" data-key="nav-why" data-tr="Neden Biz" data-en="Why Us">Neden Biz</a></li>
            <li><a href="#sv-gallery" class="editable" data-key="nav-gallery" data-tr="Galeri" data-en="Gallery">Galeri</a></li>
            <li><a href="#sv-contact" class="editable" data-key="nav-contact" data-tr="İletişim" data-en="Contact">İletişim</a></li>
          </ul>
          <div class="sv-nav-right">
            <button class="sv-lang-btn" id="lang-toggle-btn" onclick="window.toggleLang&&window.toggleLang()">🌐 <span id="lang-label">EN</span></button>
            <span class="sv-phone-badge editable" data-key="nav-phone" data-tr="+90 555 000 0000" data-en="+90 555 000 0000">+90 555 000 0000</span>
          </div>
          <button class="sv-ham" onclick="document.getElementById('sv-mob-nav').classList.add('open')">☰</button>
        </div>
      </nav>
      <div class="sv-mob-nav" id="sv-mob-nav">
        <button class="sv-mob-close" onclick="document.getElementById('sv-mob-nav').classList.remove('open')">✕</button>
        <a href="#sv-services" onclick="document.getElementById('sv-mob-nav').classList.remove('open')">Hizmetler</a>
        <a href="#sv-why" onclick="document.getElementById('sv-mob-nav').classList.remove('open')">Neden Biz</a>
        <a href="#sv-gallery" onclick="document.getElementById('sv-mob-nav').classList.remove('open')">Galeri</a>
        <a href="#sv-contact" onclick="document.getElementById('sv-mob-nav').classList.remove('open')">İletişim</a>
        <button class="sv-mob-lang" onclick="window.toggleLang&&window.toggleLang()">🌐 TR / EN</button>
      </div>

      <!-- HERO -->
      <section class="sv-hero" id="sv-hero">
        <div class="sv-con">
          <div class="sv-hero-inner">
            <div class="sv-hero-text">
              <span class="sv-badge editable" data-key="hero-badge" data-tr="✓ Güvenilir & Profesyonel" data-en="✓ Reliable & Professional">✓ Güvenilir & Profesyonel</span>
              <h1 class="editable" data-key="hero-title" data-tr="Kaliteli Hizmet,<br>Güvenilir Çözüm" data-en="Quality Service,<br>Reliable Solution">Kaliteli Hizmet,<br>Güvenilir Çözüm</h1>
              <p class="editable" data-key="hero-sub" data-tr="Uzman kadromuzla her işi zamanında ve eksiksiz teslim ediyoruz. Müşteri memnuniyeti önceliğimizdir." data-en="We deliver every job on time and completely with our expert team. Customer satisfaction is our priority.">Uzman kadromuzla her işi zamanında ve eksiksiz teslim ediyoruz. Müşteri memnuniyeti önceliğimizdir.</p>
              <div class="sv-hero-btns">
                <a href="#sv-contact" class="sv-btn sv-btn-white editable" data-key="hero-btn1" data-tr="Teklif Al" data-en="Get Quote">Teklif Al</a>
                <a href="#sv-services" class="sv-btn sv-btn-outline editable" data-key="hero-btn2" data-tr="Hizmetlerimiz" data-en="Our Services">Hizmetlerimiz</a>
              </div>
            </div>
            <div class="sv-hero-card">
              <h3 class="editable" data-key="card-title" data-tr="Hemen İletişime Geçin" data-en="Contact Us Now">Hemen İletişime Geçin</h3>
              <div class="sv-cq-item">
                <span class="sv-cq-icon">📞</span>
                <div class="sv-cq-text">
                  <strong>Telefon</strong>
                  <span class="editable" data-key="card-phone" data-tr="+90 555 000 0000" data-en="+90 555 000 0000">+90 555 000 0000</span>
                </div>
              </div>
              <div class="sv-cq-item">
                <span class="sv-cq-icon">🕐</span>
                <div class="sv-cq-text">
                  <strong>Çalışma Saati</strong>
                  <span class="editable" data-key="card-hours" data-tr="Pzt–Cmt: 08:00–19:00" data-en="Mon–Sat: 08:00–19:00">Pzt–Cmt: 08:00–19:00</span>
                </div>
              </div>
              <div class="sv-cq-item">
                <span class="sv-cq-icon">📍</span>
                <div class="sv-cq-text">
                  <strong>Konum</strong>
                  <span class="editable" data-key="card-loc" data-tr="İstanbul, Türkiye" data-en="Istanbul, Turkey">İstanbul, Türkiye</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SERVICES -->
      <section class="sv-services" id="sv-services">
        <div class="sv-con">
          <div class="sv-sec-header">
            <span class="sv-sec-label">Hizmetler</span>
            <h2 class="sv-sec-title editable" data-key="svc-title" data-tr="Sunduğumuz Hizmetler" data-en="Our Services">Sunduğumuz Hizmetler</h2>
            <p class="sv-sec-sub editable" data-key="svc-sub" data-tr="Profesyonel ekibimizle her ihtiyacınıza özel çözümler sunuyoruz" data-en="We provide solutions tailored to your every need with our professional team">Profesyonel ekibimizle her ihtiyacınıza özel çözümler sunuyoruz</p>
          </div>
          <div class="sv-services-grid">
            <div class="sv-svc-card">
              <div class="sv-svc-icon editable" data-key="svc1-icon" data-tr="🔧" data-en="🔧">🔧</div>
              <h3 class="editable" data-key="svc1-name" data-tr="Hizmet 1" data-en="Service 1">Hizmet 1</h3>
              <p class="editable" data-key="svc1-desc" data-tr="Bu hizmetin açıklaması buraya yazılır. Kısa ve öz bir tanım yapın." data-en="Description of this service goes here. Write a brief and concise definition.">Bu hizmetin açıklaması buraya yazılır. Kısa ve öz bir tanım yapın.</p>
              <span class="sv-svc-price editable" data-key="svc1-price" data-tr="₺150'den başlar" data-en="From ₺150">₺150'den başlar</span>
            </div>
            <div class="sv-svc-card">
              <div class="sv-svc-icon editable" data-key="svc2-icon" data-tr="⚡" data-en="⚡">⚡</div>
              <h3 class="editable" data-key="svc2-name" data-tr="Hizmet 2" data-en="Service 2">Hizmet 2</h3>
              <p class="editable" data-key="svc2-desc" data-tr="Bu hizmetin açıklaması buraya yazılır. Müşteriye faydasını vurgulayın." data-en="Description of this service goes here. Highlight the benefit to the customer.">Bu hizmetin açıklaması buraya yazılır. Müşteriye faydasını vurgulayın.</p>
              <span class="sv-svc-price editable" data-key="svc2-price" data-tr="₺250'den başlar" data-en="From ₺250">₺250'den başlar</span>
            </div>
            <div class="sv-svc-card">
              <div class="sv-svc-icon editable" data-key="svc3-icon" data-tr="🛡️" data-en="🛡️">🛡️</div>
              <h3 class="editable" data-key="svc3-name" data-tr="Hizmet 3" data-en="Service 3">Hizmet 3</h3>
              <p class="editable" data-key="svc3-desc" data-tr="Bu hizmetin açıklaması buraya yazılır. Güçlü yönlerinizi öne çıkarın." data-en="Description of this service goes here. Highlight your strengths.">Bu hizmetin açıklaması buraya yazılır. Güçlü yönlerinizi öne çıkarın.</p>
              <span class="sv-svc-price editable" data-key="svc3-price" data-tr="Teklif için arayın" data-en="Call for quote">Teklif için arayın</span>
            </div>
            <div class="sv-svc-card">
              <div class="sv-svc-icon editable" data-key="svc4-icon" data-tr="🏆" data-en="🏆">🏆</div>
              <h3 class="editable" data-key="svc4-name" data-tr="Hizmet 4" data-en="Service 4">Hizmet 4</h3>
              <p class="editable" data-key="svc4-desc" data-tr="Bu hizmetin açıklaması buraya yazılır." data-en="Description of this service goes here.">Bu hizmetin açıklaması buraya yazılır.</p>
              <span class="sv-svc-price editable" data-key="svc4-price" data-tr="₺200'den başlar" data-en="From ₺200">₺200'den başlar</span>
            </div>
            <div class="sv-svc-card">
              <div class="sv-svc-icon editable" data-key="svc5-icon" data-tr="✨" data-en="✨">✨</div>
              <h3 class="editable" data-key="svc5-name" data-tr="Hizmet 5" data-en="Service 5">Hizmet 5</h3>
              <p class="editable" data-key="svc5-desc" data-tr="Bu hizmetin açıklaması buraya yazılır." data-en="Description of this service goes here.">Bu hizmetin açıklaması buraya yazılır.</p>
              <span class="sv-svc-price editable" data-key="svc5-price" data-tr="₺180'den başlar" data-en="From ₺180">₺180'den başlar</span>
            </div>
            <div class="sv-svc-card">
              <div class="sv-svc-icon editable" data-key="svc6-icon" data-tr="💎" data-en="💎">💎</div>
              <h3 class="editable" data-key="svc6-name" data-tr="Hizmet 6" data-en="Service 6">Hizmet 6</h3>
              <p class="editable" data-key="svc6-desc" data-tr="Bu hizmetin açıklaması buraya yazılır." data-en="Description of this service goes here.">Bu hizmetin açıklaması buraya yazılır.</p>
              <span class="sv-svc-price editable" data-key="svc6-price" data-tr="₺350'den başlar" data-en="From ₺350">₺350'den başlar</span>
            </div>
          </div>
        </div>
      </section>

      <!-- WHY US -->
      <section class="sv-why" id="sv-why">
        <div class="sv-con">
          <div class="sv-why-grid">
            <div class="sv-why-text">
              <span class="sv-sec-label">Neden Biz</span>
              <h2 class="sv-sec-title editable" data-key="why-title" data-tr="Neden Bizi Seçmelisiniz?" data-en="Why Choose Us?">Neden Bizi Seçmelisiniz?</h2>
              <p class="editable" data-key="why-intro" data-tr="Yılların deneyimi ve yüzlerce memnun müşteriyle sektörün en güvenilir isimlerinden biriyiz." data-en="With years of experience and hundreds of satisfied customers, we are one of the most reliable names in the industry.">Yılların deneyimi ve yüzlerce memnun müşteriyle sektörün en güvenilir isimlerinden biriyiz.</p>
              <div class="sv-why-items">
                <div class="sv-why-item"><div class="sv-why-dot">✓</div><div><strong class="editable" data-key="w1t" data-tr="Zamanında Teslim" data-en="On-Time Delivery">Zamanında Teslim</strong><span class="editable" data-key="w1d" data-tr="Söz verdiğimiz sürede, eksiksiz teslim." data-en="Delivered on time, without fail.">Söz verdiğimiz sürede, eksiksiz teslim.</span></div></div>
                <div class="sv-why-item"><div class="sv-why-dot">✓</div><div><strong class="editable" data-key="w2t" data-tr="Uzman Kadro" data-en="Expert Team">Uzman Kadro</strong><span class="editable" data-key="w2d" data-tr="Alanında uzman, sertifikalı profesyoneller." data-en="Certified professionals specialized in their field.">Alanında uzman, sertifikalı profesyoneller.</span></div></div>
                <div class="sv-why-item"><div class="sv-why-dot">✓</div><div><strong class="editable" data-key="w3t" data-tr="Garanti Hizmet" data-en="Guaranteed Service">Garanti Hizmet</strong><span class="editable" data-key="w3d" data-tr="Tüm hizmetlerimizde memnuniyet garantisi." data-en="Satisfaction guarantee on all our services.">Tüm hizmetlerimizde memnuniyet garantisi.</span></div></div>
                <div class="sv-why-item"><div class="sv-why-dot">✓</div><div><strong class="editable" data-key="w4t" data-tr="Uygun Fiyat" data-en="Fair Pricing">Uygun Fiyat</strong><span class="editable" data-key="w4d" data-tr="Piyasanın en rekabetçi fiyatlarıyla hizmet." data-en="Service at the most competitive prices in the market.">Piyasanın en rekabetçi fiyatlarıyla hizmet.</span></div></div>
              </div>
            </div>
            <div class="sv-why-img img-zone" data-img-key="why-img">
              <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Ekip fotoğrafı yükle</div>
            </div>
          </div>
        </div>
      </section>

      <!-- STEPS -->
      <section class="sv-steps" id="sv-steps">
        <div class="sv-con">
          <div class="sv-sec-header">
            <span class="sv-sec-label">Süreç</span>
            <h2 class="sv-sec-title editable" data-key="steps-title" data-tr="Nasıl Çalışıyoruz?" data-en="How Do We Work?">Nasıl Çalışıyoruz?</h2>
          </div>
          <div class="sv-steps-grid">
            <div class="sv-step"><div class="sv-step-num">1</div><h3 class="editable" data-key="step1t" data-tr="İletişim" data-en="Contact">İletişim</h3><p class="editable" data-key="step1d" data-tr="Bizi arayın veya form doldurun." data-en="Call us or fill out a form.">Bizi arayın veya form doldurun.</p></div>
            <div class="sv-step"><div class="sv-step-num">2</div><h3 class="editable" data-key="step2t" data-tr="Keşif" data-en="Assessment">Keşif</h3><p class="editable" data-key="step2d" data-tr="Uzmanımız durumu yerinde inceler." data-en="Our expert examines the situation on-site.">Uzmanımız durumu yerinde inceler.</p></div>
            <div class="sv-step"><div class="sv-step-num">3</div><h3 class="editable" data-key="step3t" data-tr="Teklif" data-en="Quote">Teklif</h3><p class="editable" data-key="step3d" data-tr="Şeffaf fiyat teklifi sunulur." data-en="A transparent price quote is provided.">Şeffaf fiyat teklifi sunulur.</p></div>
            <div class="sv-step"><div class="sv-step-num">4</div><h3 class="editable" data-key="step4t" data-tr="Teslim" data-en="Delivery">Teslim</h3><p class="editable" data-key="step4d" data-tr="İş tamamlanır, onayınız alınır." data-en="Job is completed and your approval is taken.">İş tamamlanır, onayınız alınır.</p></div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section class="sv-gallery" id="sv-gallery">
        <div class="sv-con">
          <div class="sv-sec-header">
            <span class="sv-sec-label">Galeri</span>
            <h2 class="sv-sec-title editable" data-key="gallery-title" data-tr="Çalışmalarımız" data-en="Our Work">Çalışmalarımız</h2>
          </div>
          <div class="sv-gallery-grid">
            <div class="sv-gallery-item img-zone" data-img-key="gal-1"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="sv-gallery-item img-zone" data-img-key="gal-2"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="sv-gallery-item img-zone" data-img-key="gal-3"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="sv-gallery-item img-zone" data-img-key="gal-4"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="sv-gallery-item img-zone" data-img-key="gal-5"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="sv-gallery-item img-zone" data-img-key="gal-6"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section class="sv-testi" id="sv-testi">
        <div class="sv-con">
          <div class="sv-sec-header">
            <span class="sv-sec-label">Yorumlar</span>
            <h2 class="sv-sec-title editable" data-key="testi-title" data-tr="Müşteri Yorumları" data-en="Customer Reviews">Müşteri Yorumları</h2>
          </div>
          <div class="sv-testi-grid">
            <div class="sv-testi-card">
              <div class="sv-stars">★★★★★</div>
              <p class="sv-testi-text editable" data-key="t1" data-tr="Çok profesyonel bir ekip. İşi zamanında ve eksiksiz teslim ettiler. Kesinlikle tavsiye ederim." data-en="A very professional team. They delivered the job on time and completely. I definitely recommend them.">"Çok profesyonel bir ekip. İşi zamanında ve eksiksiz teslim ettiler. Kesinlikle tavsiye ederim."</p>
              <div class="sv-testi-author"><div class="sv-author-av">A</div><div><div class="sv-author-name editable" data-key="t1n" data-tr="Ahmet Yılmaz" data-en="Ahmet Yılmaz">Ahmet Yılmaz</div><div class="sv-author-role editable" data-key="t1r" data-tr="Google Yorumu" data-en="Google Review">Google Yorumu</div></div></div>
            </div>
            <div class="sv-testi-card">
              <div class="sv-stars">★★★★★</div>
              <p class="sv-testi-text editable" data-key="t2" data-tr="Fiyat-performans açısından mükemmel. Hızlı müdahale ve kaliteli iş çıkardılar. Teşekkürler!" data-en="Excellent value for money. Fast response and quality work. Thank you!">"Fiyat-performans açısından mükemmel. Hızlı müdahale ve kaliteli iş çıkardılar. Teşekkürler!"</p>
              <div class="sv-testi-author"><div class="sv-author-av">F</div><div><div class="sv-author-name editable" data-key="t2n" data-tr="Fatma Çelik" data-en="Fatma Çelik">Fatma Çelik</div><div class="sv-author-role editable" data-key="t2r" data-tr="Düzenli Müşteri" data-en="Regular Customer">Düzenli Müşteri</div></div></div>
            </div>
            <div class="sv-testi-card">
              <div class="sv-stars">★★★★★</div>
              <p class="sv-testi-text editable" data-key="t3" data-tr="İkinci kez çalıştığımız firma. Her seferinde aynı kalite ve güven. Uzun vadeli iş ortağım oldu." data-en="The second time we worked with this company. Same quality and trust every time. They became my long-term business partner.">"İkinci kez çalıştığımız firma. Her seferinde aynı kalite ve güven. Uzun vadeli iş ortağım oldu."</p>
              <div class="sv-testi-author"><div class="sv-author-av">E</div><div><div class="sv-author-name editable" data-key="t3n" data-tr="Emre Kaya" data-en="Emre Kaya">Emre Kaya</div><div class="sv-author-role editable" data-key="t3r" data-tr="İşletme Sahibi" data-en="Business Owner">İşletme Sahibi</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTACT -->
      <section class="sv-contact" id="sv-contact">
        <div class="sv-con">
          <div class="sv-sec-header">
            <span class="sv-sec-label">İletişim</span>
            <h2 class="sv-sec-title editable" data-key="contact-title" data-tr="Teklif İsteyin" data-en="Request a Quote">Teklif İsteyin</h2>
          </div>
          <div class="sv-contact-grid">
            <div>
              <div class="sv-contact-item"><div class="sv-c-icon">📍</div><div><strong class="editable" data-key="addr-l" data-tr="Adres" data-en="Address">Adres</strong><p class="editable" data-key="addr" data-tr="Örnek Mah. No:1, İstanbul" data-en="Example St. No:1, Istanbul">Örnek Mah. No:1, İstanbul</p></div></div>
              <div class="sv-contact-item"><div class="sv-c-icon">📞</div><div><strong class="editable" data-key="phone-l" data-tr="Telefon" data-en="Phone">Telefon</strong><p class="editable" data-key="phone" data-tr="+90 (555) 000 00 00" data-en="+90 (555) 000 00 00">+90 (555) 000 00 00</p></div></div>
              <div class="sv-contact-item"><div class="sv-c-icon">🕐</div><div><strong class="editable" data-key="hours-l" data-tr="Çalışma Saatleri" data-en="Working Hours">Çalışma Saatleri</strong><p class="editable" data-key="hours" data-tr="Pzt–Cmt: 08:00–19:00" data-en="Mon–Sat: 08:00–19:00">Pzt–Cmt: 08:00–19:00</p></div></div>
              <div class="sv-contact-item"><div class="sv-c-icon">✉️</div><div><strong class="editable" data-key="email-l" data-tr="E-posta" data-en="Email">E-posta</strong><p class="editable" data-key="email" data-tr="info@firma.com" data-en="info@company.com">info@firma.com</p></div></div>
            </div>
            <div class="sv-contact-form">
              <h3 class="editable" data-key="form-title" data-tr="Ücretsiz Teklif Alın" data-en="Get Free Quote">Ücretsiz Teklif Alın</h3>
              <input id="sv-form-name" class="sv-inp" placeholder="Adınız Soyadınız">
              <input id="sv-form-tel" class="sv-inp" type="tel" placeholder="Telefon Numaranız">
              <input id="sv-form-email" class="sv-inp" type="email" placeholder="E-posta Adresiniz (isteğe bağlı)">
              <textarea id="sv-form-msg" class="sv-inp sv-inp-ta" placeholder="Hizmet talebi veya mesajınız..."></textarea>
              <button class="sv-btn-send" style="background:#25D366;" onclick="window.svSendWA&&window.svSendWA()">💬 WhatsApp ile Teklif Al</button>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="sv-footer">
        <div class="sv-con">
          <div class="sv-footer-grid">
            <div class="sv-footer-brand">
              <div class="name editable" data-key="footer-logo" data-tr="🔧 Firma Adı" data-en="🔧 Company Name">🔧 Firma Adı</div>
              <div class="tagline editable" data-key="footer-tag" data-tr="Güvenilir hizmetin adresi" data-en="The address of reliable service">Güvenilir hizmetin adresi</div>
              <div class="sv-socials">
                <a class="sv-soc soc-ig" data-social="instagram" href="#" title="Instagram">ig</a>
                <a class="sv-soc soc-fb" data-social="facebook" href="#" title="Facebook">fb</a>
                <a class="sv-soc soc-tw" data-social="twitter" href="#" title="Twitter">tw</a>
                <a class="sv-soc soc-li" data-social="linkedin" href="#" title="LinkedIn">in</a>
              </div>
            </div>
            <div class="sv-footer-col">
              <h4>Hizmetler</h4>
              <ul>
                <li><a href="#sv-services">Hizmet 1</a></li>
                <li><a href="#sv-services">Hizmet 2</a></li>
                <li><a href="#sv-services">Hizmet 3</a></li>
                <li><a href="#sv-services">Hizmet 4</a></li>
              </ul>
            </div>
            <div class="sv-footer-col">
              <h4>İletişim</h4>
              <ul>
                <li><a href="#" class="editable" data-key="footer-addr" data-tr="İstanbul, Türkiye" data-en="Istanbul, Turkey">İstanbul, Türkiye</a></li>
                <li><a href="#" class="editable" data-key="footer-phone" data-tr="+90 555 000 0000" data-en="+90 555 000 0000">+90 555 000 0000</a></li>
                <li><a href="#" class="editable" data-key="footer-email" data-tr="info@firma.com" data-en="info@firma.com">info@firma.com</a></li>
              </ul>
            </div>
          </div>
          <div class="sv-footer-bot">
            <p class="editable" data-key="footer-cr" data-tr="© 2025 Firma Adı. Tüm hakları saklıdır." data-en="© 2025 Company Name. All rights reserved.">© 2025 Firma Adı. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      <!-- WHATSAPP -->
      <a href="#" class="sv-wa" id="wa-btn" title="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    `
  },

  // ============================================================
  // 3. GENEL İŞLETME
  // ============================================================
  business: {
    id: 'business',
    name: 'Genel İşletme',
    emoji: '🏢',
    description: 'Her tür işletmeye uygun modern kurumsal şablon',
    defaultColors: { primary: '#7C3AED', secondary: '#5B21B6', bg: '#FFFFFF', text: '#111827', light: '#F5F3FF' },

    css: `
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:var(--bg,#fff);color:var(--text,#111827);}
:root{--primary:#7C3AED;--secondary:#5B21B6;--bg:#FFFFFF;--text:#111827;--light:#F5F3FF;}
a{text-decoration:none;color:inherit;}
img{max-width:100%;display:block;}

.img-zone{background:linear-gradient(135deg,#ccc 0%,#aaa 100%) center/cover no-repeat;position:relative;overflow:hidden;cursor:pointer;}
.img-upload-hint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.28);color:#fff;font-size:.8rem;font-weight:600;gap:8px;opacity:0;transition:opacity .25s;pointer-events:none;text-align:center;padding:10px;}
.img-upload-hint svg{width:30px;height:30px;opacity:.9;}
.img-zone:hover .img-upload-hint{opacity:1;}

.editable:hover{outline:2px dashed var(--primary,#7C3AED);outline-offset:3px;cursor:text;border-radius:3px;}
.editable[contenteditable="true"]{outline:2px solid var(--primary,#7C3AED)!important;outline-offset:3px;background:rgba(255,255,255,.08);border-radius:3px;}

.bz-con{max-width:1200px;margin:0 auto;padding:0 clamp(16px,4vw,32px);}

/* NAVBAR */
.bz-nav{position:sticky;top:0;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);box-shadow:0 1px 24px rgba(0,0,0,.07);z-index:500;}
.bz-nav-inner{display:flex;align-items:center;justify-content:space-between;padding:15px clamp(16px,4vw,32px);}
.bz-logo{font-size:clamp(1.1rem,3vw,1.35rem);font-weight:900;color:var(--primary,#7C3AED);white-space:nowrap;}
.bz-navlinks{display:flex;list-style:none;gap:24px;}
.bz-navlinks a{color:var(--text,#111827);font-size:.9rem;font-weight:500;transition:color .2s;white-space:nowrap;}
.bz-navlinks a:hover{color:var(--primary,#7C3AED);}
.bz-nav-right{display:flex;align-items:center;gap:10px;}
.bz-lang-btn{background:transparent;border:1px solid #ddd;color:var(--text,#111827);padding:6px 14px;border-radius:20px;cursor:pointer;font-size:.8rem;white-space:nowrap;}
.bz-lang-btn:hover{border-color:var(--primary);color:var(--primary);}
.bz-cta-btn{background:var(--primary,#7C3AED);color:#fff;padding:9px 22px;border-radius:10px;font-size:.88rem;font-weight:700;border:none;cursor:pointer;transition:all .2s;white-space:nowrap;}
.bz-cta-btn:hover{opacity:.88;transform:translateY(-1px);}
.bz-ham{display:none;background:none;border:none;color:var(--text,#111827);font-size:1.6rem;cursor:pointer;padding:4px;line-height:1;flex-shrink:0;}

.bz-mob-nav{display:none;position:fixed;inset:0;background:rgba(255,255,255,.98);z-index:600;flex-direction:column;align-items:center;justify-content:center;gap:28px;}
.bz-mob-nav.open{display:flex;}
.bz-mob-nav a{color:var(--text,#111827);font-size:1.5rem;font-weight:700;text-decoration:none;transition:color .2s;}
.bz-mob-nav a:hover{color:var(--primary,#7C3AED);}
.bz-mob-close{position:absolute;top:20px;right:24px;background:none;border:none;color:var(--text);font-size:2rem;cursor:pointer;line-height:1;}
.bz-mob-lang{background:var(--primary);border:none;color:#fff;padding:10px 28px;border-radius:24px;font-size:1rem;cursor:pointer;margin-top:8px;}

/* HERO */
.bz-hero{position:relative;min-height:92vh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;}
.bz-hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,var(--secondary,#5B21B6) 0%,var(--primary,#7C3AED) 60%,#A78BFA 100%);z-index:0;}
.bz-hero-pattern{position:absolute;inset:0;z-index:1;background-image:radial-gradient(rgba(255,255,255,.07) 1px, transparent 1px);background-size:32px 32px;}
.bz-hero-overlay{position:absolute;inset:0;background:rgba(0,0,0,.15);z-index:2;}
.bz-hero-content{position:relative;z-index:3;max-width:800px;padding:120px 24px 80px;}
.bz-hero-badge{display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:#fff;padding:6px 18px;border-radius:30px;font-size:.8rem;font-weight:600;letter-spacing:.5px;margin-bottom:22px;}
.bz-hero h1{font-size:clamp(2rem,6vw,4.4rem);font-weight:900;color:#fff;text-shadow:0 3px 16px rgba(0,0,0,.3);margin-bottom:20px;line-height:1.12;}
.bz-hero h1 em{font-style:normal;background:linear-gradient(135deg,#fbbf24,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.bz-hero p{font-size:clamp(.95rem,2.5vw,1.2rem);color:rgba(255,255,255,.85);margin-bottom:40px;line-height:1.65;}
.bz-hero-btns{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;}
.bz-btn{display:inline-flex;align-items:center;justify-content:center;padding:clamp(12px,2vw,16px) clamp(24px,4vw,40px);border-radius:10px;font-weight:700;font-size:clamp(.88rem,2vw,1rem);transition:all .25s;cursor:pointer;border:none;text-decoration:none;white-space:nowrap;}
.bz-btn-white{background:#fff;color:var(--primary,#7C3AED);}
.bz-btn-white:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.2);}
.bz-btn-outline{background:transparent;border:2px solid rgba(255,255,255,.6);color:#fff;}
.bz-btn-outline:hover{background:rgba(255,255,255,.12);border-color:#fff;}
.bz-hero-stats{display:flex;gap:clamp(24px,4vw,48px);justify-content:center;margin-top:clamp(32px,5vw,56px);flex-wrap:wrap;}
.bz-hstat strong{display:block;font-size:clamp(1.8rem,4vw,2.6rem);font-weight:900;color:#fff;}
.bz-hstat span{font-size:.8rem;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.5px;}

/* FEATURES */
.bz-features{padding:clamp(60px,8vw,100px) 0;background:var(--bg,#fff);}
.bz-sec-label{display:inline-block;background:var(--primary,#7C3AED);color:#fff;font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:14px;}
.bz-sec-title{font-size:clamp(1.6rem,4vw,2.5rem);font-weight:900;color:var(--text,#111827);margin-bottom:12px;line-height:1.2;}
.bz-sec-sub{font-size:clamp(.9rem,2vw,1.05rem);color:#888;line-height:1.7;max-width:580px;}
.bz-sec-header{text-align:center;margin-bottom:clamp(36px,5vw,56px);}
.bz-sec-header .bz-sec-sub{margin:0 auto;}
.bz-features-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,3vw,28px);}
.bz-feat-card{padding:clamp(24px,3vw,36px);border-radius:20px;background:var(--light,#F5F3FF);transition:all .3s;border:2px solid transparent;}
.bz-feat-card:hover{border-color:var(--primary,#7C3AED);transform:translateY(-4px);box-shadow:0 12px 40px rgba(124,58,237,.1);}
.bz-feat-icon{width:56px;height:56px;background:var(--primary,#7C3AED);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin-bottom:20px;}
.bz-feat-card h3{font-size:clamp(.95rem,2vw,1.15rem);font-weight:700;color:var(--text,#111827);margin-bottom:10px;}
.bz-feat-card p{font-size:.88rem;color:#777;line-height:1.65;}

/* PRODUCTS */
.bz-products{padding:clamp(60px,8vw,100px) 0;background:var(--light,#F5F3FF);}
.bz-products-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(16px,3vw,28px);}
.bz-product-card{background:var(--bg,#fff);border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06);transition:all .3s;}
.bz-product-card:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(124,58,237,.12);}
.bz-product-img{height:clamp(180px,22vw,260px);}
.bz-product-body{padding:clamp(16px,2.5vw,28px);}
.bz-product-tag{display:inline-block;background:var(--light,#F5F3FF);color:var(--primary,#7C3AED);padding:4px 12px;border-radius:20px;font-size:.74rem;font-weight:700;margin-bottom:10px;}
.bz-product-card h3{font-size:clamp(.95rem,2vw,1.15rem);font-weight:700;color:var(--text,#111827);margin-bottom:8px;}
.bz-product-card p{font-size:.87rem;color:#777;line-height:1.6;margin-bottom:14px;}
.bz-product-price{font-size:1.2rem;font-weight:900;color:var(--primary,#7C3AED);}

/* ABOUT */
.bz-about{padding:clamp(60px,8vw,100px) 0;background:var(--bg,#fff);}
.bz-about-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,6vw,72px);align-items:center;}
.bz-about-img{border-radius:24px;height:clamp(260px,35vw,440px);}
.bz-about-text .bz-sec-title{text-align:left;}
.bz-about-text p{font-size:clamp(.9rem,2vw,1.05rem);color:#666;line-height:1.8;margin-bottom:24px;}
.bz-about-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:8px;}
.bz-astat{background:var(--light,#F5F3FF);border-radius:14px;padding:18px 12px;text-align:center;}
.bz-astat strong{display:block;font-size:clamp(1.5rem,3.5vw,2.2rem);font-weight:900;color:var(--primary,#7C3AED);}
.bz-astat span{font-size:.76rem;color:#888;text-transform:uppercase;letter-spacing:.4px;}

/* GALLERY */
.bz-gallery{padding:clamp(60px,8vw,100px) 0;background:var(--light,#F5F3FF);}
.bz-gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,2vw,16px);}
.bz-gallery-item{border-radius:14px;aspect-ratio:4/3;background:linear-gradient(135deg,#ddd6fe,#c4b5fd);}

/* TESTIMONIALS */
.bz-testi{padding:clamp(60px,8vw,100px) 0;background:var(--bg,#fff);}
.bz-testi-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,3vw,28px);}
.bz-testi-card{background:var(--light,#F5F3FF);border-radius:18px;padding:clamp(20px,3vw,32px);display:flex;flex-direction:column;gap:14px;border:2px solid transparent;transition:border-color .25s;}
.bz-testi-card:hover{border-color:var(--primary,#7C3AED);}
.bz-stars{color:var(--primary,#7C3AED);font-size:1rem;letter-spacing:2px;}
.bz-testi-text{font-size:.93rem;color:#666;line-height:1.7;font-style:italic;flex:1;}
.bz-testi-author{display:flex;align-items:center;gap:12px;border-top:1px solid rgba(0,0,0,.07);padding-top:14px;}
.bz-author-av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--primary,#7C3AED),var(--secondary,#5B21B6));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1rem;flex-shrink:0;}
.bz-author-name{font-weight:700;font-size:.88rem;color:var(--text,#111827);}
.bz-author-role{font-size:.76rem;color:#999;}

/* CONTACT */
.bz-contact{padding:clamp(60px,8vw,100px) 0;background:var(--light,#F5F3FF);}
.bz-contact-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,6vw,72px);align-items:start;}
.bz-contact-item{display:flex;gap:14px;margin-bottom:22px;align-items:flex-start;}
.bz-c-icon{width:42px;height:42px;background:var(--primary,#7C3AED);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
.bz-contact-item strong{display:block;font-weight:700;color:var(--text,#111827);margin-bottom:3px;font-size:.93rem;}
.bz-contact-item p{color:#777;line-height:1.55;font-size:.88rem;}
.bz-contact-form{background:var(--bg,#fff);border-radius:20px;padding:clamp(20px,4vw,36px);box-shadow:0 4px 32px rgba(0,0,0,.07);}
.bz-contact-form h3{font-size:1.15rem;font-weight:700;color:var(--text,#111827);margin-bottom:18px;}
.bz-inp{width:100%;padding:12px 16px;border:1px solid #e0e0e0;border-radius:10px;font-size:.92rem;color:var(--text,#111827);background:#f9fafb;outline:none;transition:border .2s;font-family:inherit;margin-bottom:12px;}
.bz-inp:focus{border-color:var(--primary,#7C3AED);background:#fff;}
.bz-inp-ta{resize:vertical;min-height:100px;}
.bz-btn-send{width:100%;padding:14px;background:var(--primary,#7C3AED);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .25s;margin-top:4px;}
.bz-btn-send:hover{opacity:.9;transform:translateY(-1px);}

/* FOOTER */
.bz-footer{background:#0d0d1f;color:#fff;padding:clamp(36px,6vw,60px) 0 20px;}
.bz-footer-grid{display:grid;grid-template-columns:1.5fr repeat(2,1fr);gap:clamp(24px,4vw,48px);margin-bottom:clamp(28px,4vw,44px);}
.bz-footer-brand .name{font-size:1.25rem;font-weight:800;color:var(--primary,#7C3AED);margin-bottom:8px;}
.bz-footer-brand .tagline{color:rgba(255,255,255,.4);font-size:.86rem;line-height:1.6;margin-bottom:20px;}
.bz-socials{display:flex;gap:10px;flex-wrap:wrap;}
.bz-soc{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.7rem;color:#fff;text-decoration:none;transition:all .25s;text-transform:uppercase;flex-shrink:0;}
.soc-ig{background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);}
.soc-fb{background:#1877F2;}.soc-tw{background:#1DA1F2;}.soc-yt{background:#FF0000;}.soc-li{background:#0A66C2;}
.bz-soc:hover{transform:translateY(-3px) scale(1.12);}
.bz-footer-col h4{font-size:.84rem;font-weight:700;color:#fff;margin-bottom:14px;text-transform:uppercase;letter-spacing:.5px;}
.bz-footer-col ul{list-style:none;}
.bz-footer-col li{margin-bottom:9px;}
.bz-footer-col a{color:rgba(255,255,255,.38);font-size:.83rem;transition:color .2s;}
.bz-footer-col a:hover{color:var(--primary,#7C3AED);}
.bz-footer-bot{border-top:1px solid rgba(255,255,255,.07);padding-top:20px;text-align:center;color:rgba(255,255,255,.28);font-size:.78rem;}

/* WHATSAPP */
.bz-wa{position:fixed;bottom:28px;right:28px;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 20px rgba(37,211,102,.45);z-index:999;transition:all .25s;text-decoration:none;}
.bz-wa:hover{transform:scale(1.12);box-shadow:0 6px 32px rgba(37,211,102,.65);}
.bz-wa svg{width:26px;height:26px;}

/* RESPONSIVE */
@container(max-width:900px){
  .bz-features-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .bz-testi-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .bz-footer-grid{grid-template-columns:1fr 1fr;}
}
@container(max-width:768px){
  .bz-navlinks,.bz-nav-right{display:none;}
  .bz-ham{display:block;}
  .bz-about-grid,.bz-contact-grid{grid-template-columns:minmax(0,1fr);}
  .bz-products-grid{grid-template-columns:minmax(0,1fr);}
  .bz-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .bz-testi-grid{grid-template-columns:minmax(0,1fr);}
  .bz-footer-grid{grid-template-columns:minmax(0,1fr);}
  .bz-wa{bottom:16px;right:16px;}
}
@container(max-width:480px){
  .bz-features-grid{grid-template-columns:minmax(0,1fr);}
  .bz-gallery-grid{grid-template-columns:minmax(0,1fr);}
  .bz-hero-btns{flex-direction:column;align-items:stretch;}
  .bz-btn{width:100%;text-align:center;}
  .bz-about-stats{grid-template-columns:repeat(3,minmax(0,1fr));}
}
    `,

    html: `
      <!-- NAVBAR -->
      <nav class="bz-nav">
        <div class="bz-nav-inner">
          <div class="bz-logo editable" data-key="logo" data-tr="🏢 Firma Adı" data-en="🏢 Company Name">🏢 Firma Adı</div>
          <ul class="bz-navlinks">
            <li><a href="#bz-features" class="editable" data-key="nav-feat" data-tr="Özellikler" data-en="Features">Özellikler</a></li>
            <li><a href="#bz-products" class="editable" data-key="nav-prod" data-tr="Ürünler" data-en="Products">Ürünler</a></li>
            <li><a href="#bz-about" class="editable" data-key="nav-about" data-tr="Hakkımızda" data-en="About">Hakkımızda</a></li>
            <li><a href="#bz-contact" class="editable" data-key="nav-contact" data-tr="İletişim" data-en="Contact">İletişim</a></li>
          </ul>
          <div class="bz-nav-right">
            <button class="bz-lang-btn" id="lang-toggle-btn" onclick="window.toggleLang&&window.toggleLang()">🌐 <span id="lang-label">EN</span></button>
            <button class="bz-cta-btn editable" data-key="nav-cta" data-tr="Teklif Al" data-en="Get Quote" onclick="document.getElementById('bz-contact').scrollIntoView({behavior:'smooth'})">Teklif Al</button>
          </div>
          <button class="bz-ham" onclick="document.getElementById('bz-mob-nav').classList.add('open')">☰</button>
        </div>
      </nav>
      <div class="bz-mob-nav" id="bz-mob-nav">
        <button class="bz-mob-close" onclick="document.getElementById('bz-mob-nav').classList.remove('open')">✕</button>
        <a href="#bz-features" onclick="document.getElementById('bz-mob-nav').classList.remove('open')">Özellikler</a>
        <a href="#bz-products" onclick="document.getElementById('bz-mob-nav').classList.remove('open')">Ürünler</a>
        <a href="#bz-about" onclick="document.getElementById('bz-mob-nav').classList.remove('open')">Hakkımızda</a>
        <a href="#bz-contact" onclick="document.getElementById('bz-mob-nav').classList.remove('open')">İletişim</a>
        <button class="bz-mob-lang" onclick="window.toggleLang&&window.toggleLang()">🌐 TR / EN</button>
      </div>

      <!-- HERO -->
      <section class="bz-hero" id="bz-hero">
        <div class="bz-hero-bg img-zone" data-img-key="hero-bg">
          <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Hero arka plan fotoğrafı</div>
        </div>
        <div class="bz-hero-pattern"></div>
        <div class="bz-hero-overlay"></div>
        <div class="bz-hero-content">
          <div class="bz-hero-badge editable" data-key="hero-badge" data-tr="✦ Güvenilir · Kaliteli · Profesyonel" data-en="✦ Reliable · Quality · Professional">✦ Güvenilir · Kaliteli · Profesyonel</div>
          <h1 class="editable" data-key="hero-title" data-tr="İşletmenizi <em>Bir Üst Seviyeye</em> Taşıyın" data-en="Take Your Business to <em>The Next Level</em>">İşletmenizi <em>Bir Üst Seviyeye</em> Taşıyın</h1>
          <p class="editable" data-key="hero-sub" data-tr="Yenilikçi çözümlerimiz ve deneyimli ekibimizle hedeflerinize ulaşmanıza yardımcı oluyoruz. Başarı hikayenizi birlikte yazalım." data-en="We help you achieve your goals with our innovative solutions and experienced team. Let's write your success story together.">Yenilikçi çözümlerimiz ve deneyimli ekibimizle hedeflerinize ulaşmanıza yardımcı oluyoruz. Başarı hikayenizi birlikte yazalım.</p>
          <div class="bz-hero-btns">
            <a href="#bz-contact" class="bz-btn bz-btn-white editable" data-key="hero-btn1" data-tr="Hemen Başlayalım" data-en="Let's Get Started">Hemen Başlayalım</a>
            <a href="#bz-features" class="bz-btn bz-btn-outline editable" data-key="hero-btn2" data-tr="Daha Fazla Bilgi" data-en="Learn More">Daha Fazla Bilgi</a>
          </div>
          <div class="bz-hero-stats">
            <div class="bz-hstat"><strong class="editable" data-key="hs1n" data-tr="500+" data-en="500+">500+</strong><span class="editable" data-key="hs1l" data-tr="Mutlu Müşteri" data-en="Happy Clients">Mutlu Müşteri</span></div>
            <div class="bz-hstat"><strong class="editable" data-key="hs2n" data-tr="10+" data-en="10+">10+</strong><span class="editable" data-key="hs2l" data-tr="Yıl Deneyim" data-en="Years Exp.">Yıl Deneyim</span></div>
            <div class="bz-hstat"><strong class="editable" data-key="hs3n" data-tr="98%" data-en="98%">98%</strong><span class="editable" data-key="hs3l" data-tr="Memnuniyet" data-en="Satisfaction">Memnuniyet</span></div>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="bz-features" id="bz-features">
        <div class="bz-con">
          <div class="bz-sec-header">
            <span class="bz-sec-label">Özellikler</span>
            <h2 class="bz-sec-title editable" data-key="feat-title" data-tr="Neden Bizi Seçmelisiniz?" data-en="Why Choose Us?">Neden Bizi Seçmelisiniz?</h2>
            <p class="bz-sec-sub editable" data-key="feat-sub" data-tr="Müşterilerimize sunduğumuz değerlerin başında kalite, güven ve yenilik geliyor" data-en="Quality, trust and innovation are at the top of the values we offer our customers">Müşterilerimize sunduğumuz değerlerin başında kalite, güven ve yenilik geliyor</p>
          </div>
          <div class="bz-features-grid">
            <div class="bz-feat-card"><div class="bz-feat-icon">⚡</div><h3 class="editable" data-key="f1t" data-tr="Hızlı Teslimat" data-en="Fast Delivery">Hızlı Teslimat</h3><p class="editable" data-key="f1d" data-tr="Projelerinizi belirlenen sürede eksiksiz teslim ediyoruz." data-en="We deliver your projects on time and completely.">Projelerinizi belirlenen sürede eksiksiz teslim ediyoruz.</p></div>
            <div class="bz-feat-card"><div class="bz-feat-icon">🛡️</div><h3 class="editable" data-key="f2t" data-tr="Güvenilir Hizmet" data-en="Reliable Service">Güvenilir Hizmet</h3><p class="editable" data-key="f2d" data-tr="Tüm süreçlerde şeffaflık ve güvenilirlik ilkesiyle hareket ediyoruz." data-en="We act with the principle of transparency and reliability in all processes.">Tüm süreçlerde şeffaflık ve güvenilirlik ilkesiyle hareket ediyoruz.</p></div>
            <div class="bz-feat-card"><div class="bz-feat-icon">💡</div><h3 class="editable" data-key="f3t" data-tr="Yenilikçi Çözümler" data-en="Innovative Solutions">Yenilikçi Çözümler</h3><p class="editable" data-key="f3d" data-tr="Sektörün en güncel teknoloji ve yöntemlerini kullanıyoruz." data-en="We use the latest technology and methods in the industry.">Sektörün en güncel teknoloji ve yöntemlerini kullanıyoruz.</p></div>
            <div class="bz-feat-card"><div class="bz-feat-icon">🤝</div><h3 class="editable" data-key="f4t" data-tr="Müşteri Odaklı" data-en="Customer Focused">Müşteri Odaklı</h3><p class="editable" data-key="f4d" data-tr="Müşteri memnuniyeti her zaman önceliğimizdir." data-en="Customer satisfaction is always our priority.">Müşteri memnuniyeti her zaman önceliğimizdir.</p></div>
            <div class="bz-feat-card"><div class="bz-feat-icon">📊</div><h3 class="editable" data-key="f5t" data-tr="Ölçülebilir Sonuçlar" data-en="Measurable Results">Ölçülebilir Sonuçlar</h3><p class="editable" data-key="f5d" data-tr="Veriye dayalı kararlarla somut başarılar elde ediyoruz." data-en="We achieve concrete success with data-driven decisions.">Veriye dayalı kararlarla somut başarılar elde ediyoruz.</p></div>
            <div class="bz-feat-card"><div class="bz-feat-icon">🌍</div><h3 class="editable" data-key="f6t" data-tr="Global Ağ" data-en="Global Network">Global Ağ</h3><p class="editable" data-key="f6d" data-tr="Dünya genelindeki iş ortaklarımızla güçlü bir ağ sunuyoruz." data-en="We offer a strong network with our global business partners.">Dünya genelindeki iş ortaklarımızla güçlü bir ağ sunuyoruz.</p></div>
          </div>
        </div>
      </section>

      <!-- PRODUCTS -->
      <section class="bz-products" id="bz-products">
        <div class="bz-con">
          <div class="bz-sec-header">
            <span class="bz-sec-label">Ürünler & Hizmetler</span>
            <h2 class="bz-sec-title editable" data-key="prod-title" data-tr="Öne Çıkan Ürünlerimiz" data-en="Featured Products">Öne Çıkan Ürünlerimiz</h2>
          </div>
          <div class="bz-products-grid">
            <div class="bz-product-card">
              <div class="bz-product-img img-zone" data-img-key="prod-1"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Ürün fotoğrafı</div></div>
              <div class="bz-product-body">
                <span class="bz-product-tag editable" data-key="prod1-tag" data-tr="Yeni Ürün" data-en="New Product">Yeni Ürün</span>
                <h3 class="editable" data-key="prod1-name" data-tr="Ürün / Hizmet Adı 1" data-en="Product / Service Name 1">Ürün / Hizmet Adı 1</h3>
                <p class="editable" data-key="prod1-desc" data-tr="Bu ürün veya hizmetin kısa açıklaması buraya yazılır. Müşteri için faydayı öne çıkarın." data-en="A short description of this product or service goes here. Highlight the benefit for the customer.">Bu ürün veya hizmetin kısa açıklaması buraya yazılır.</p>
                <div class="bz-product-price editable" data-key="prod1-price" data-tr="₺999" data-en="₺999">₺999</div>
              </div>
            </div>
            <div class="bz-product-card">
              <div class="bz-product-img img-zone" data-img-key="prod-2"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Ürün fotoğrafı</div></div>
              <div class="bz-product-body">
                <span class="bz-product-tag editable" data-key="prod2-tag" data-tr="Çok Satan" data-en="Best Seller">Çok Satan</span>
                <h3 class="editable" data-key="prod2-name" data-tr="Ürün / Hizmet Adı 2" data-en="Product / Service Name 2">Ürün / Hizmet Adı 2</h3>
                <p class="editable" data-key="prod2-desc" data-tr="Bu ürün veya hizmetin kısa açıklaması buraya yazılır. Müşteri için faydayı öne çıkarın." data-en="A short description of this product or service goes here.">Bu ürün veya hizmetin kısa açıklaması buraya yazılır.</p>
                <div class="bz-product-price editable" data-key="prod2-price" data-tr="₺1.499" data-en="₺1.499">₺1.499</div>
              </div>
            </div>
            <div class="bz-product-card">
              <div class="bz-product-img img-zone" data-img-key="prod-3"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Ürün fotoğrafı</div></div>
              <div class="bz-product-body">
                <span class="bz-product-tag editable" data-key="prod3-tag" data-tr="Öne Çıkan" data-en="Featured">Öne Çıkan</span>
                <h3 class="editable" data-key="prod3-name" data-tr="Ürün / Hizmet Adı 3" data-en="Product / Service Name 3">Ürün / Hizmet Adı 3</h3>
                <p class="editable" data-key="prod3-desc" data-tr="Bu ürün veya hizmetin kısa açıklaması buraya yazılır." data-en="A short description of this product or service goes here.">Bu ürün veya hizmetin kısa açıklaması buraya yazılır.</p>
                <div class="bz-product-price editable" data-key="prod3-price" data-tr="₺749" data-en="₺749">₺749</div>
              </div>
            </div>
            <div class="bz-product-card">
              <div class="bz-product-img img-zone" data-img-key="prod-4"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Ürün fotoğrafı</div></div>
              <div class="bz-product-body">
                <span class="bz-product-tag editable" data-key="prod4-tag" data-tr="Premium" data-en="Premium">Premium</span>
                <h3 class="editable" data-key="prod4-name" data-tr="Ürün / Hizmet Adı 4" data-en="Product / Service Name 4">Ürün / Hizmet Adı 4</h3>
                <p class="editable" data-key="prod4-desc" data-tr="Bu ürün veya hizmetin kısa açıklaması buraya yazılır." data-en="A short description of this product or service goes here.">Bu ürün veya hizmetin kısa açıklaması buraya yazılır.</p>
                <div class="bz-product-price editable" data-key="prod4-price" data-tr="₺2.999" data-en="₺2.999">₺2.999</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ABOUT -->
      <section class="bz-about" id="bz-about">
        <div class="bz-con">
          <div class="bz-about-grid">
            <div class="bz-about-img img-zone" data-img-key="about-img">
              <div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Ekip / Ofis fotoğrafı</div>
            </div>
            <div class="bz-about-text">
              <span class="bz-sec-label">Hakkımızda</span>
              <h2 class="bz-sec-title editable" data-key="about-title" data-tr="Güçlü Bir Vizyonla İleriyoruz" data-en="Moving Forward With a Strong Vision">Güçlü Bir Vizyonla İleriyoruz</h2>
              <p class="editable" data-key="about-text" data-tr="10 yılı aşkın süredir sektörde lider konumumuzu koruyoruz. Müşterilerimizin başarısını kendi başarımız olarak görüyor, her projede maksimum değer yaratmayı hedefliyoruz." data-en="We have maintained our leadership position in the industry for over 10 years. We see our customers' success as our own and aim to create maximum value in every project.">10 yılı aşkın süredir sektörde lider konumumuzu koruyoruz. Müşterilerimizin başarısını kendi başarımız olarak görüyor, her projede maksimum değer yaratmayı hedefliyoruz.</p>
              <div class="bz-about-stats">
                <div class="bz-astat"><strong class="editable" data-key="as1n" data-tr="10+" data-en="10+">10+</strong><span class="editable" data-key="as1l" data-tr="Yıl" data-en="Years">Yıl</span></div>
                <div class="bz-astat"><strong class="editable" data-key="as2n" data-tr="500+" data-en="500+">500+</strong><span class="editable" data-key="as2l" data-tr="Müşteri" data-en="Clients">Müşteri</span></div>
                <div class="bz-astat"><strong class="editable" data-key="as3n" data-tr="50+" data-en="50+">50+</strong><span class="editable" data-key="as3l" data-tr="Ekip" data-en="Team">Ekip</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section class="bz-gallery" id="bz-gallery">
        <div class="bz-con">
          <div class="bz-sec-header">
            <span class="bz-sec-label">Galeri</span>
            <h2 class="bz-sec-title editable" data-key="gallery-title" data-tr="Portfolyomuz" data-en="Our Portfolio">Portfolyomuz</h2>
          </div>
          <div class="bz-gallery-grid">
            <div class="bz-gallery-item img-zone" data-img-key="gal-1"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="bz-gallery-item img-zone" data-img-key="gal-2"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="bz-gallery-item img-zone" data-img-key="gal-3"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="bz-gallery-item img-zone" data-img-key="gal-4"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="bz-gallery-item img-zone" data-img-key="gal-5"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
            <div class="bz-gallery-item img-zone" data-img-key="gal-6"><div class="img-upload-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>Fotoğraf yükle</div></div>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section class="bz-testi" id="bz-testi">
        <div class="bz-con">
          <div class="bz-sec-header">
            <span class="bz-sec-label">Referanslar</span>
            <h2 class="bz-sec-title editable" data-key="testi-title" data-tr="Müşterilerimiz Ne Diyor?" data-en="What Our Clients Say?">Müşterilerimiz Ne Diyor?</h2>
          </div>
          <div class="bz-testi-grid">
            <div class="bz-testi-card">
              <div class="bz-stars">★★★★★</div>
              <p class="bz-testi-text editable" data-key="t1" data-tr="Bu firmayı seçmek hayatımda aldığım en doğru kararlardan biri oldu. Profesyonellik ve kalite bir arada." data-en="Choosing this company was one of the best decisions I ever made. Professionalism and quality combined.">"Bu firmayı seçmek hayatımda aldığım en doğru kararlardan biri oldu. Profesyonellik ve kalite bir arada."</p>
              <div class="bz-testi-author"><div class="bz-author-av">C</div><div><div class="bz-author-name editable" data-key="t1n" data-tr="Can Öztürk" data-en="Can Öztürk">Can Öztürk</div><div class="bz-author-role editable" data-key="t1r" data-tr="CEO, Tech Startup" data-en="CEO, Tech Startup">CEO, Tech Startup</div></div></div>
            </div>
            <div class="bz-testi-card">
              <div class="bz-stars">★★★★★</div>
              <p class="bz-testi-text editable" data-key="t2" data-tr="Beklentilerimizin çok ötesinde bir hizmet aldık. Ekip gerçekten ilgi çekici ve çözüm odaklı." data-en="We received service far beyond our expectations. The team is truly engaging and solution-oriented.">"Beklentilerimizin çok ötesinde bir hizmet aldık. Ekip gerçekten ilgi çekici ve çözüm odaklı."</p>
              <div class="bz-testi-author"><div class="bz-author-av">S</div><div><div class="bz-author-name editable" data-key="t2n" data-tr="Selin Akay" data-en="Selin Akay">Selin Akay</div><div class="bz-author-role editable" data-key="t2r" data-tr="Genel Müdür" data-en="General Manager">Genel Müdür</div></div></div>
            </div>
            <div class="bz-testi-card">
              <div class="bz-stars">★★★★★</div>
              <p class="bz-testi-text editable" data-key="t3" data-tr="5 yıldır çalıştığımız iş ortağımız. Her seferinde aynı kalite, aynı güven ve aynı özen." data-en="Our business partner for 5 years. Same quality, same trust and same care every time.">"5 yıldır çalıştığımız iş ortağımız. Her seferinde aynı kalite, aynı güven ve aynı özen."</p>
              <div class="bz-testi-author"><div class="bz-author-av">B</div><div><div class="bz-author-name editable" data-key="t3n" data-tr="Burak Şahin" data-en="Burak Şahin">Burak Şahin</div><div class="bz-author-role editable" data-key="t3r" data-tr="İşletme Sahibi" data-en="Business Owner">İşletme Sahibi</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTACT -->
      <section class="bz-contact" id="bz-contact">
        <div class="bz-con">
          <div class="bz-sec-header">
            <span class="bz-sec-label">İletişim</span>
            <h2 class="bz-sec-title editable" data-key="contact-title" data-tr="Birlikte Çalışalım" data-en="Let's Work Together">Birlikte Çalışalım</h2>
          </div>
          <div class="bz-contact-grid">
            <div>
              <div class="bz-contact-item"><div class="bz-c-icon">📍</div><div><strong class="editable" data-key="addr-l" data-tr="Adres" data-en="Address">Adres</strong><p class="editable" data-key="addr" data-tr="İş Merkezi, Kat 5, Levent / İstanbul" data-en="Business Center, Floor 5, Levent / Istanbul">İş Merkezi, Kat 5, Levent / İstanbul</p></div></div>
              <div class="bz-contact-item"><div class="bz-c-icon">📞</div><div><strong class="editable" data-key="phone-l" data-tr="Telefon" data-en="Phone">Telefon</strong><p class="editable" data-key="phone" data-tr="+90 (212) 000 00 00" data-en="+90 (212) 000 00 00">+90 (212) 000 00 00</p></div></div>
              <div class="bz-contact-item"><div class="bz-c-icon">✉️</div><div><strong class="editable" data-key="email-l" data-tr="E-posta" data-en="Email">E-posta</strong><p class="editable" data-key="email" data-tr="info@sirketim.com" data-en="info@company.com">info@sirketim.com</p></div></div>
              <div class="bz-contact-item"><div class="bz-c-icon">🕐</div><div><strong class="editable" data-key="hours-l" data-tr="Çalışma Saatleri" data-en="Working Hours">Çalışma Saatleri</strong><p class="editable" data-key="hours" data-tr="Pzt–Cum: 09:00–18:00" data-en="Mon–Fri: 09:00–18:00">Pzt–Cum: 09:00–18:00</p></div></div>
            </div>
            <div class="bz-contact-form">
              <h3 class="editable" data-key="form-title" data-tr="Mesaj Gönderin" data-en="Send a Message">Mesaj Gönderin</h3>
              <input id="bz-form-name" class="bz-inp" placeholder="Adınız Soyadınız">
              <input id="bz-form-email" class="bz-inp" type="email" placeholder="E-posta Adresiniz (isteğe bağlı)">
              <input id="bz-form-tel" class="bz-inp" type="tel" placeholder="Telefon Numaranız">
              <textarea id="bz-form-msg" class="bz-inp bz-inp-ta" placeholder="Mesajınız veya proje detayları..."></textarea>
              <button class="bz-btn-send" style="background:#25D366;" onclick="window.bzSendWA&&window.bzSendWA()">💬 WhatsApp ile Mesaj Gönder</button>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="bz-footer">
        <div class="bz-con">
          <div class="bz-footer-grid">
            <div class="bz-footer-brand">
              <div class="name editable" data-key="footer-logo" data-tr="🏢 Firma Adı" data-en="🏢 Company Name">🏢 Firma Adı</div>
              <div class="tagline editable" data-key="footer-tag" data-tr="Başarıya giden yolda güvenilir ortağınız" data-en="Your reliable partner on the road to success">Başarıya giden yolda güvenilir ortağınız</div>
              <div class="bz-socials">
                <a class="bz-soc soc-ig" data-social="instagram" href="#" title="Instagram">ig</a>
                <a class="bz-soc soc-fb" data-social="facebook" href="#" title="Facebook">fb</a>
                <a class="bz-soc soc-tw" data-social="twitter" href="#" title="Twitter">tw</a>
                <a class="bz-soc soc-li" data-social="linkedin" href="#" title="LinkedIn">in</a>
                <a class="bz-soc soc-yt" data-social="youtube" href="#" title="YouTube">yt</a>
              </div>
            </div>
            <div class="bz-footer-col">
              <h4>Sayfalar</h4>
              <ul>
                <li><a href="#bz-features">Özellikler</a></li>
                <li><a href="#bz-products">Ürünler</a></li>
                <li><a href="#bz-about">Hakkımızda</a></li>
                <li><a href="#bz-gallery">Galeri</a></li>
              </ul>
            </div>
            <div class="bz-footer-col">
              <h4>İletişim</h4>
              <ul>
                <li><a href="#" class="editable" data-key="footer-addr" data-tr="Levent / İstanbul" data-en="Levent / Istanbul">Levent / İstanbul</a></li>
                <li><a href="#" class="editable" data-key="footer-phone" data-tr="+90 212 000 0000" data-en="+90 212 000 0000">+90 212 000 0000</a></li>
                <li><a href="#" class="editable" data-key="footer-email" data-tr="info@sirketim.com" data-en="info@sirketim.com">info@sirketim.com</a></li>
              </ul>
            </div>
          </div>
          <div class="bz-footer-bot">
            <p class="editable" data-key="footer-cr" data-tr="© 2025 Firma Adı. Tüm hakları saklıdır." data-en="© 2025 Company Name. All rights reserved.">© 2025 Firma Adı. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      <!-- WHATSAPP -->
      <a href="#" class="bz-wa" id="wa-btn" title="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    `
  }

};
