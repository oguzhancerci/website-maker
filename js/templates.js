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
            <div class="rt-menu-cat" data-items="rt-menu-row">
              <h3 class="editable" data-key="cat1" data-tr="🥗 Başlangıçlar" data-en="🥗 Starters">🥗 Başlangıçlar</h3>
              <div class="rt-menu-row"><span class="name editable" data-key="i1n" data-tr="Mercimek Çorbası" data-en="Lentil Soup">Mercimek Çorbası</span><span class="price editable" data-key="i1p" data-tr="₺95" data-en="₺95">₺95</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i2n" data-tr="Mevsim Salatası" data-en="Seasonal Salad">Mevsim Salatası</span><span class="price editable" data-key="i2p" data-tr="₺110" data-en="₺110">₺110</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i3n" data-tr="Humus Tabağı" data-en="Hummus Plate">Humus Tabağı</span><span class="price editable" data-key="i3p" data-tr="₺85" data-en="₺85">₺85</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i4n" data-tr="Sigara Böreği" data-en="Fried Pastry">Sigara Böreği</span><span class="price editable" data-key="i4p" data-tr="₺75" data-en="₺75">₺75</span></div>
            </div>
            <div class="rt-menu-cat" data-items="rt-menu-row">
              <h3 class="editable" data-key="cat2" data-tr="🍖 Ana Yemekler" data-en="🍖 Main Courses">🍖 Ana Yemekler</h3>
              <div class="rt-menu-row"><span class="name editable" data-key="i5n" data-tr="Kuzu Şiş" data-en="Lamb Skewer">Kuzu Şiş</span><span class="price editable" data-key="i5p" data-tr="₺295" data-en="₺295">₺295</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i6n" data-tr="Tavuk Güveç" data-en="Chicken Casserole">Tavuk Güveç</span><span class="price editable" data-key="i6p" data-tr="₺195" data-en="₺195">₺195</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i7n" data-tr="Balık Izgara" data-en="Grilled Fish">Balık Izgara</span><span class="price editable" data-key="i7p" data-tr="₺245" data-en="₺245">₺245</span></div>
              <div class="rt-menu-row"><span class="name editable" data-key="i8n" data-tr="Vejetaryen Tabak" data-en="Vegetarian Plate">Vejetaryen Tabak</span><span class="price editable" data-key="i8p" data-tr="₺165" data-en="₺165">₺165</span></div>
            </div>
            <div class="rt-menu-cat" data-items="rt-menu-row">
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
          <div class="rt-gallery-grid" data-gallery-add="rt-gallery-item">
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
          <div class="rt-testi-grid" data-cards="rt-testi-card">
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
              <button class="rt-btn-form" style="background:#25D366;" onclick="window.rtSendWA&&window.rtSendWA()"><span class="editable" data-key="rt-wa-btn" data-tr="💬 WhatsApp ile Rezervasyon Yap" data-en="💬 Book via WhatsApp">💬 WhatsApp ile Rezervasyon Yap</span></button>
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
          <div class="sv-services-grid" data-cards="sv-svc-card">
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
          <div class="sv-gallery-grid" data-gallery-add="sv-gallery-item">
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
          <div class="sv-testi-grid" data-cards="sv-testi-card">
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
              <button class="sv-btn-send" style="background:#25D366;" onclick="window.svSendWA&&window.svSendWA()"><span class="editable" data-key="sv-wa-btn" data-tr="💬 WhatsApp ile Teklif Al" data-en="💬 Get Quote via WhatsApp">💬 WhatsApp ile Teklif Al</span></button>
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
          <div class="bz-features-grid" data-cards="bz-feat-card">
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
          <div class="bz-products-grid" data-cards="bz-product-card">
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
          <div class="bz-gallery-grid" data-gallery-add="bz-gallery-item">
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
          <div class="bz-testi-grid" data-cards="bz-testi-card">
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
              <button class="bz-btn-send" style="background:#25D366;" onclick="window.bzSendWA&&window.bzSendWA()"><span class="editable" data-key="bz-wa-btn" data-tr="💬 WhatsApp ile Mesaj Gönder" data-en="💬 Message via WhatsApp">💬 WhatsApp ile Mesaj Gönder</span></button>
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
  },

  portfolio: {
    id: 'portfolio',
    name: 'Portfolyo',
    emoji: '🎨',
    description: 'Yaratıcı profesyoneller için animasyonlu karanlık portfolyo',
    defaultColors: { primary: '#8B5CF6', secondary: '#6D28D9', bg: '#0F0F1A', text: '#E2E8F0', light: '#1E1B4B' },
    css: `
      @keyframes pf-fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes pf-pulse{0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,.4)}50%{box-shadow:0 0 0 18px rgba(139,92,246,0)}}
      .pf-wrap{font-family:inherit;background:var(--bg);color:var(--text);}
      .pf-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 56px;background:rgba(15,15,26,.8);backdrop-filter:blur(16px);border-bottom:1px solid rgba(139,92,246,.15);position:sticky;top:0;z-index:50;}
      .pf-logo{font-size:1.3rem;font-weight:900;color:var(--primary);}
      .pf-nav-links{display:flex;gap:28px;list-style:none;}
      .pf-nav-links a{color:var(--text);text-decoration:none;font-size:.88rem;font-weight:500;opacity:.65;transition:opacity .2s;}
      .pf-nav-links a:hover{opacity:1;color:var(--primary);}
      .pf-hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 40px 80px;position:relative;overflow:hidden;}
      .pf-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 40%,rgba(139,92,246,.18) 0%,transparent 70%);pointer-events:none;}
      .pf-hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.3);border-radius:50px;padding:8px 20px;font-size:.78rem;color:var(--primary);margin-bottom:28px;animation:pf-fadeUp .7s ease both;}
      .pf-hero h1{font-size:clamp(2.4rem,5.5vw,4.8rem);font-weight:900;line-height:1.1;margin-bottom:22px;animation:pf-fadeUp .7s .15s ease both;}
      .pf-hero h1 em{font-style:normal;color:var(--primary);}
      .pf-hero-sub{font-size:1.05rem;color:rgba(226,232,240,.5);max-width:540px;margin:0 auto 40px;line-height:1.75;animation:pf-fadeUp .7s .3s ease both;}
      .pf-hero-btns{display:flex;gap:14px;justify-content:center;animation:pf-fadeUp .7s .45s ease both;}
      .pf-btn{padding:13px 30px;border-radius:12px;font-weight:700;font-size:.9rem;cursor:pointer;border:none;text-decoration:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
      .pf-btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 20px rgba(139,92,246,.35);animation:pf-pulse 2.5s infinite;}
      .pf-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(139,92,246,.5);}
      .pf-btn-ghost{background:transparent;color:var(--text);border:2px solid rgba(139,92,246,.35);}
      .pf-btn-ghost:hover{border-color:var(--primary);color:var(--primary);}
      .pf-float-orb{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none;animation:pf-float 6s ease-in-out infinite;}
      .pf-orb1{width:300px;height:300px;background:rgba(139,92,246,.15);top:10%;left:5%;animation-delay:0s;}
      .pf-orb2{width:200px;height:200px;background:rgba(96,165,250,.1);bottom:15%;right:8%;animation-delay:3s;}
      .pf-works{padding:100px 56px;background:var(--bg);}
      .pf-sec-tag{font-size:.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:3px;margin-bottom:10px;}
      .pf-sec-h{font-size:2.2rem;font-weight:900;margin-bottom:12px;}
      .pf-sec-sub{color:rgba(226,232,240,.4);font-size:.92rem;margin-bottom:52px;}
      .pf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
      .pf-card{border-radius:16px;overflow:hidden;position:relative;cursor:pointer;background:var(--light);aspect-ratio:4/3;transition:transform .3s;}
      .pf-card:hover{transform:scale(1.02);}
      .pf-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(15,15,26,.92) 0%,transparent 55%);opacity:0;transition:opacity .3s;display:flex;flex-direction:column;justify-content:flex-end;padding:20px;}
      .pf-card:hover .pf-card-overlay{opacity:1;}
      .pf-card-title{color:#fff;font-size:1rem;font-weight:700;margin-bottom:3px;}
      .pf-card-tag{color:var(--primary);font-size:.75rem;font-weight:600;}
      .pf-about{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;padding:100px 56px;background:var(--light);}
      .pf-about-img-wrap{position:relative;}
      .pf-about-img{width:100%;border-radius:20px;aspect-ratio:1;background:var(--bg);display:flex;align-items:center;justify-content:center;overflow:hidden;}
      .pf-exp-badge{position:absolute;bottom:-14px;right:-14px;background:var(--primary);color:#fff;border-radius:14px;padding:14px 20px;text-align:center;}
      .pf-exp-badge strong{display:block;font-size:1.8rem;font-weight:900;}
      .pf-exp-badge span{font-size:.75rem;opacity:.85;}
      .pf-skills{display:flex;flex-direction:column;gap:12px;margin:24px 0 32px;}
      .pf-skill-lbl{display:flex;justify-content:space-between;font-size:.83rem;margin-bottom:7px;}
      .pf-skill-bar{height:5px;background:rgba(139,92,246,.15);border-radius:10px;overflow:hidden;}
      .pf-skill-fill{height:100%;background:linear-gradient(to right,var(--primary),var(--secondary));border-radius:10px;}
      .pf-contact{padding:100px 56px;text-align:center;background:var(--bg);}
      .pf-contact-card{max-width:580px;margin:40px auto 0;background:var(--light);border:1px solid rgba(139,92,246,.15);border-radius:24px;padding:52px 44px;}
      .pf-form-group{margin-bottom:18px;text-align:left;}
      .pf-form-group label{display:block;font-size:.8rem;font-weight:600;opacity:.65;margin-bottom:7px;}
      .pf-inp{width:100%;padding:13px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(139,92,246,.2);border-radius:10px;color:var(--text);font-size:.88rem;outline:none;transition:border-color .2s;}
      .pf-inp:focus{border-color:var(--primary);}
      .pf-footer{background:var(--light);padding:36px 56px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(139,92,246,.1);}
      .pf-footer-logo{font-size:1.1rem;font-weight:900;color:var(--primary);}
      .pf-footer-cr{color:rgba(226,232,240,.3);font-size:.78rem;}
      .pf-wa{position:fixed;bottom:28px;right:28px;z-index:999;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 18px rgba(37,211,102,.4);text-decoration:none;transition:transform .2s;}
      .pf-wa:hover{transform:scale(1.1);}
      .pf-wa svg{width:28px;height:28px;}
@container(max-width:900px){
  .pf-grid{grid-template-columns:repeat(2,1fr);}
}
@container(max-width:768px){
  .pf-nav{padding:14px 20px;}
  .pf-nav-links,.pf-nav>span:last-child{display:none;}
  .pf-hero{padding:90px 20px 60px;}
  .pf-works{padding:60px 20px;}
  .pf-grid{grid-template-columns:1fr;}
  .pf-about{grid-template-columns:1fr;padding:60px 20px;gap:36px;}
  .pf-contact{padding:60px 20px;}
  .pf-contact-card{padding:36px 24px;}
  .pf-footer{padding:20px;flex-direction:column;gap:8px;text-align:center;}
}
@container(max-width:480px){
  .pf-hero h1{font-size:2rem;}
  .pf-hero-btns{flex-direction:column;align-items:stretch;}
  .pf-btn{justify-content:center;}
}
    `,
    html: `
      <div class="pf-wrap">
        <nav class="pf-nav">
          <button class="drag-handle">⠿</button>
          <div class="pf-logo editable" data-key="pf-logo" data-tr="Portfolyo" data-en="Portfolio">Portfolyo</div>
          <ul class="pf-nav-links">
            <li><a class="editable" data-key="pf-n1" data-tr="Projeler" data-en="Projects">Projeler</a></li>
            <li><a class="editable" data-key="pf-n2" data-tr="Hakkımda" data-en="About">Hakkımda</a></li>
            <li><a class="editable" data-key="pf-n3" data-tr="İletişim" data-en="Contact">İletişim</a></li>
          </ul>
          <span id="lang-label" onclick="window.toggleLang&&window.toggleLang()" style="cursor:pointer;font-size:.8rem;color:var(--primary);font-weight:700;padding:6px 14px;border:1px solid rgba(139,92,246,.3);border-radius:8px;">TR</span>
        </nav>

        <section class="pf-hero">
          <button class="drag-handle">⠿</button>
          <div class="pf-float-orb pf-orb1"></div>
          <div class="pf-float-orb pf-orb2"></div>
          <div class="pf-hero-badge"><span>✦</span><span class="editable" data-key="pf-badge" data-tr="Yaratıcı Tasarımcı &amp; Geliştirici" data-en="Creative Designer &amp; Developer">Yaratıcı Tasarımcı &amp; Geliştirici</span></div>
          <h1 class="editable" data-key="pf-h1" data-tr="Fikirleri &lt;em&gt;Hayata&lt;/em&gt; Geçiriyorum" data-en="Turning Ideas Into &lt;em&gt;Reality&lt;/em&gt;">Fikirleri <em>Hayata</em> Geçiriyorum</h1>
          <p class="pf-hero-sub editable" data-key="pf-sub" data-tr="UI/UX tasarımından web geliştirmeye — yaratıcı projelerinizi birlikte hayata geçirelim." data-en="From UI/UX design to web development — let's bring your creative projects to life.">UI/UX tasarımından web geliştirmeye — yaratıcı projelerinizi birlikte hayata geçirelim.</p>
          <div class="pf-hero-btns">
            <a href="#pf-works" class="pf-btn pf-btn-primary editable" data-key="pf-btn1" data-tr="Projelerimi Gör" data-en="View Projects">Projelerimi Gör</a>
            <a href="#pf-contact" class="pf-btn pf-btn-ghost editable" data-key="pf-btn2" data-tr="İletişime Geç" data-en="Get In Touch">İletişime Geç</a>
          </div>
        </section>

        <section class="pf-works" id="pf-works">
          <button class="drag-handle">⠿</button>
          <p class="pf-sec-tag editable" data-key="pf-w-tag" data-tr="ÇALIŞMALAR" data-en="WORKS">ÇALIŞMALAR</p>
          <h2 class="pf-sec-h editable" data-key="pf-w-h" data-tr="Seçili Projeler" data-en="Selected Projects">Seçili Projeler</h2>
          <p class="pf-sec-sub editable" data-key="pf-w-sub" data-tr="Her projede yaratıcılık ve işlevselliği bir araya getiriyorum" data-en="Combining creativity and functionality in every project">Her projede yaratıcılık ve işlevselliği bir araya getiriyorum</p>
          <div class="pf-grid" data-gallery-add="pf-card">
            <div class="pf-card img-zone" data-img-key="pf-p1">
              <div class="img-upload-hint">🖼 Proje Görseli</div>
              <div class="pf-card-overlay">
                <div class="pf-card-title editable" data-key="pf-p1-t" data-tr="E-ticaret Tasarımı" data-en="E-commerce Design">E-ticaret Tasarımı</div>
                <div class="pf-card-tag editable" data-key="pf-p1-g" data-tr="Web Tasarım" data-en="Web Design">Web Tasarım</div>
              </div>
            </div>
            <div class="pf-card img-zone" data-img-key="pf-p2">
              <div class="img-upload-hint">🖼 Proje Görseli</div>
              <div class="pf-card-overlay">
                <div class="pf-card-title editable" data-key="pf-p2-t" data-tr="Mobil Uygulama" data-en="Mobile App">Mobil Uygulama</div>
                <div class="pf-card-tag editable" data-key="pf-p2-g" data-tr="UI/UX" data-en="UI/UX">UI/UX</div>
              </div>
            </div>
            <div class="pf-card img-zone" data-img-key="pf-p3">
              <div class="img-upload-hint">🖼 Proje Görseli</div>
              <div class="pf-card-overlay">
                <div class="pf-card-title editable" data-key="pf-p3-t" data-tr="Marka Kimliği" data-en="Brand Identity">Marka Kimliği</div>
                <div class="pf-card-tag editable" data-key="pf-p3-g" data-tr="Grafik Tasarım" data-en="Graphic Design">Grafik Tasarım</div>
              </div>
            </div>
          </div>
        </section>

        <section class="pf-about" id="pf-about">
          <button class="drag-handle">⠿</button>
          <div class="pf-about-img-wrap">
            <div class="pf-about-img img-zone" data-img-key="pf-about-img"><div class="img-upload-hint">📷 Profil Fotoğrafı</div></div>
            <div class="pf-exp-badge">
              <strong class="editable" data-key="pf-exp-n" data-tr="5+" data-en="5+">5+</strong>
              <span class="editable" data-key="pf-exp-l" data-tr="Yıl Deneyim" data-en="Years Exp.">Yıl Deneyim</span>
            </div>
          </div>
          <div>
            <p class="pf-sec-tag editable" data-key="pf-a-tag" data-tr="HAKKIMDA" data-en="ABOUT ME">HAKKIMDA</p>
            <h2 class="pf-sec-h editable" data-key="pf-a-h" data-tr="Merhaba, Ben Bir Yaratıcı Tasarımcıyım" data-en="Hi, I'm a Creative Designer">Merhaba, Ben Bir Yaratıcı Tasarımcıyım</h2>
            <p class="editable" style="color:rgba(226,232,240,.55);line-height:1.8;margin-bottom:8px;" data-key="pf-a-txt" data-tr="Kullanıcı deneyimini ön planda tutarak modern dijital ürünler tasarlıyorum. Her projeye özgün bir bakış açısıyla yaklaşıyorum." data-en="I design modern digital products with user experience at the forefront. I approach every project with a unique perspective.">Kullanıcı deneyimini ön planda tutarak modern dijital ürünler tasarlıyorum. Her projeye özgün bir bakış açısıyla yaklaşıyorum.</p>
            <div class="pf-skills">
              <div><div class="pf-skill-lbl"><span class="editable" data-key="pf-sk1" data-tr="UI/UX Tasarım" data-en="UI/UX Design">UI/UX Tasarım</span><span>95%</span></div><div class="pf-skill-bar"><div class="pf-skill-fill" style="width:95%"></div></div></div>
              <div><div class="pf-skill-lbl"><span class="editable" data-key="pf-sk2" data-tr="Web Geliştirme" data-en="Web Development">Web Geliştirme</span><span>88%</span></div><div class="pf-skill-bar"><div class="pf-skill-fill" style="width:88%"></div></div></div>
              <div><div class="pf-skill-lbl"><span class="editable" data-key="pf-sk3" data-tr="Grafik Tasarım" data-en="Graphic Design">Grafik Tasarım</span><span>82%</span></div><div class="pf-skill-bar"><div class="pf-skill-fill" style="width:82%"></div></div></div>
            </div>
            <a href="#pf-contact" class="pf-btn pf-btn-primary editable" data-key="pf-a-btn" data-tr="Birlikte Çalışalım" data-en="Let's Work Together">Birlikte Çalışalım</a>
          </div>
        </section>

        <section class="pf-contact" id="pf-contact">
          <button class="drag-handle">⠿</button>
          <p class="pf-sec-tag editable" data-key="pf-c-tag" data-tr="İLETİŞİM" data-en="CONTACT">İLETİŞİM</p>
          <h2 class="pf-sec-h editable" data-key="pf-c-h" data-tr="Projenizi Konuşalım" data-en="Let's Talk About Your Project">Projenizi Konuşalım</h2>
          <div class="pf-contact-card">
            <div class="pf-form-group"><label class="editable" data-key="pf-fl1" data-tr="Adınız" data-en="Your Name">Adınız</label><input class="pf-inp" id="pf-form-name" type="text" placeholder="Ad Soyad"></div>
            <div class="pf-form-group"><label class="editable" data-key="pf-fl2" data-tr="Telefon" data-en="Phone">Telefon</label><input class="pf-inp" id="pf-form-tel" type="tel" placeholder="+90 500 000 00 00"></div>
            <div class="pf-form-group"><label class="editable" data-key="pf-fl3" data-tr="Mesajınız" data-en="Your Message">Mesajınız</label><textarea class="pf-inp" id="pf-form-msg" rows="4" placeholder="Projenizi kısaca anlatın..."></textarea></div>
            <button class="pf-btn pf-btn-primary" style="width:100%;justify-content:center" onclick="genericSendWA('pf')"><span class="editable" data-key="pf-c-btn" data-tr="WhatsApp ile Gönder" data-en="Send via WhatsApp">WhatsApp ile Gönder</span></button>
          </div>
        </section>

        <footer class="pf-footer">
          <button class="drag-handle">⠿</button>
          <div class="pf-footer-logo editable" data-key="pf-fl" data-tr="Portfolyo" data-en="Portfolio">Portfolyo</div>
          <p class="pf-footer-cr editable" data-key="pf-cr" data-tr="© 2025 Tüm hakları saklıdır." data-en="© 2025 All rights reserved.">© 2025 Tüm hakları saklıdır.</p>
        </footer>

        <a href="#" class="pf-wa" id="wa-btn" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
      </div>
    `
  },

  ecommerce: {
    id: 'ecommerce',
    name: 'E-Ticaret',
    emoji: '🛍️',
    description: 'Animasyonlu ürün kartları ile modern e-ticaret şablonu',
    defaultColors: { primary: '#F97316', secondary: '#EA580C', bg: '#FFFFFF', text: '#1C1917', light: '#FFF7ED' },
    css: `
      @keyframes ec-gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes ec-fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes ec-badge-pop{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
      .ec-wrap{font-family:inherit;background:var(--bg);color:var(--text);}
      .ec-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 52px;background:#fff;border-bottom:1px solid rgba(249,115,22,.12);position:sticky;top:0;z-index:50;box-shadow:0 2px 12px rgba(0,0,0,.06);}
      .ec-logo{font-size:1.3rem;font-weight:900;color:var(--primary);}
      .ec-nav-links{display:flex;gap:26px;list-style:none;}
      .ec-nav-links a{color:var(--text);text-decoration:none;font-size:.87rem;font-weight:600;transition:color .2s;}
      .ec-nav-links a:hover{color:var(--primary);}
      .ec-nav-actions{display:flex;gap:10px;align-items:center;}
      .ec-hero{min-height:90vh;display:flex;align-items:center;justify-content:space-between;padding:60px 52px;gap:48px;background:linear-gradient(135deg,#FFF7ED,#FFEDD5,#FEF3C7,#FFF7ED);background-size:400% 400%;animation:ec-gradient 10s ease infinite;position:relative;overflow:hidden;}
      .ec-hero-content{flex:1;max-width:520px;}
      .ec-hero-tag{display:inline-block;background:rgba(249,115,22,.12);color:var(--primary);border-radius:50px;padding:6px 18px;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:22px;animation:ec-fadeIn .6s ease both;}
      .ec-hero h1{font-size:clamp(2rem,4.5vw,3.8rem);font-weight:900;line-height:1.1;margin-bottom:20px;animation:ec-fadeIn .6s .1s ease both;}
      .ec-hero h1 span{color:var(--primary);}
      .ec-hero-desc{font-size:1.02rem;color:rgba(28,25,23,.6);line-height:1.75;margin-bottom:36px;animation:ec-fadeIn .6s .2s ease both;}
      .ec-hero-btns{display:flex;gap:14px;flex-wrap:wrap;animation:ec-fadeIn .6s .3s ease both;}
      .ec-btn{padding:13px 28px;border-radius:12px;font-weight:700;font-size:.9rem;cursor:pointer;border:none;text-decoration:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
      .ec-btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 18px rgba(249,115,22,.35);}
      .ec-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(249,115,22,.5);}
      .ec-btn-outline{background:transparent;color:var(--primary);border:2px solid var(--primary);}
      .ec-btn-outline:hover{background:var(--primary);color:#fff;}
      .ec-hero-img{flex:1;max-width:480px;position:relative;}
      .ec-hero-img-wrap{border-radius:24px;overflow:hidden;aspect-ratio:4/3;background:rgba(249,115,22,.08);display:flex;align-items:center;justify-content:center;}
      .ec-promo-badge{position:absolute;top:-14px;right:-14px;background:var(--primary);color:#fff;border-radius:50%;width:80px;height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:900;line-height:1.1;animation:ec-badge-pop 2s ease-in-out infinite;box-shadow:0 4px 16px rgba(249,115,22,.4);}
      .ec-promo-badge .pct{font-size:1.4rem;}
      .ec-promo-badge .off{font-size:.65rem;opacity:.9;}
      .ec-products{padding:88px 52px;background:var(--bg);}
      .ec-sec-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:44px;}
      .ec-sec-tag{font-size:.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:3px;margin-bottom:8px;}
      .ec-sec-h{font-size:2rem;font-weight:900;}
      .ec-products-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
      .ec-product-card{background:var(--light);border-radius:16px;overflow:hidden;transition:all .3s;border:1px solid rgba(249,115,22,.08);animation:ec-fadeIn .5s ease both;}
      .ec-product-card:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(249,115,22,.15);}
      .ec-product-card:nth-child(2){animation-delay:.1s;}
      .ec-product-card:nth-child(3){animation-delay:.2s;}
      .ec-product-card:nth-child(4){animation-delay:.3s;}
      .ec-product-img{width:100%;aspect-ratio:1;object-fit:cover;background:rgba(249,115,22,.06);display:flex;align-items:center;justify-content:center;}
      .ec-product-body{padding:16px;}
      .ec-product-name{font-size:.95rem;font-weight:700;margin-bottom:8px;}
      .ec-product-price{font-size:1.1rem;font-weight:900;color:var(--primary);}
      .ec-product-old{font-size:.8rem;color:#999;text-decoration:line-through;margin-left:6px;}
      .ec-product-btn{width:100%;margin-top:12px;background:var(--primary);color:#fff;border:none;border-radius:8px;padding:9px;font-weight:700;font-size:.83rem;cursor:pointer;transition:background .2s;}
      .ec-product-btn:hover{background:var(--secondary);}
      .ec-features{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:72px 52px;background:var(--light);}
      .ec-feature-card{background:#fff;border-radius:16px;padding:32px;border:1px solid rgba(249,115,22,.1);text-align:center;transition:box-shadow .2s;}
      .ec-feature-card:hover{box-shadow:0 8px 32px rgba(249,115,22,.12);}
      .ec-feature-icon{font-size:2.4rem;margin-bottom:14px;}
      .ec-feature-title{font-size:1rem;font-weight:700;margin-bottom:8px;}
      .ec-feature-desc{font-size:.83rem;color:rgba(28,25,23,.55);line-height:1.6;}
      .ec-contact{padding:88px 52px;text-align:center;background:var(--bg);}
      .ec-contact-card{max-width:560px;margin:40px auto 0;background:var(--light);border-radius:20px;padding:48px 40px;border:1px solid rgba(249,115,22,.1);}
      .ec-form-group{margin-bottom:16px;text-align:left;}
      .ec-form-group label{display:block;font-size:.8rem;font-weight:600;margin-bottom:7px;color:rgba(28,25,23,.6);}
      .ec-inp{width:100%;padding:12px 16px;background:#fff;border:1.5px solid rgba(249,115,22,.2);border-radius:10px;color:var(--text);font-size:.88rem;outline:none;transition:border-color .2s;}
      .ec-inp:focus{border-color:var(--primary);}
      .ec-footer{background:var(--text);color:rgba(255,255,255,.7);padding:40px 52px;display:flex;align-items:center;justify-content:space-between;}
      .ec-footer-brand{font-size:1.2rem;font-weight:900;color:#fff;}
      .ec-footer-cr{font-size:.78rem;}
      .ec-wa{position:fixed;bottom:28px;right:28px;z-index:999;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 18px rgba(37,211,102,.4);text-decoration:none;transition:transform .2s;}
      .ec-wa:hover{transform:scale(1.1);}
      .ec-wa svg{width:28px;height:28px;}
@container(max-width:900px){
  .ec-products-grid{grid-template-columns:repeat(2,1fr);}
  .ec-features{grid-template-columns:repeat(2,1fr);}
}
@container(max-width:768px){
  .ec-nav{padding:14px 20px;}
  .ec-nav-links{display:none;}
  .ec-hero{flex-direction:column;padding:60px 20px 48px;gap:28px;}
  .ec-hero-content{max-width:100%;}
  .ec-hero-img{max-width:100%;width:100%;}
  .ec-products{padding:60px 20px;}
  .ec-features{grid-template-columns:1fr;padding:48px 20px;}
  .ec-contact{padding:60px 20px;}
  .ec-footer{padding:20px;flex-direction:column;gap:8px;text-align:center;}
}
@container(max-width:480px){
  .ec-products-grid{grid-template-columns:1fr;}
  .ec-hero-btns{flex-direction:column;align-items:stretch;}
  .ec-btn{justify-content:center;}
  .ec-sec-header{flex-direction:column;align-items:flex-start;gap:12px;}
}
    `,
    html: `
      <div class="ec-wrap">
        <nav class="ec-nav">
          <button class="drag-handle">⠿</button>
          <div class="ec-logo editable" data-key="ec-logo" data-tr="Mağazam" data-en="MyStore">Mağazam</div>
          <ul class="ec-nav-links">
            <li><a class="editable" data-key="ec-n1" data-tr="Ürünler" data-en="Products">Ürünler</a></li>
            <li><a class="editable" data-key="ec-n2" data-tr="Kampanyalar" data-en="Deals">Kampanyalar</a></li>
            <li><a class="editable" data-key="ec-n3" data-tr="Hakkımızda" data-en="About">Hakkımızda</a></li>
            <li><a class="editable" data-key="ec-n4" data-tr="İletişim" data-en="Contact">İletişim</a></li>
          </ul>
          <div class="ec-nav-actions">
            <span id="lang-label" onclick="window.toggleLang&&window.toggleLang()" style="cursor:pointer;font-size:.8rem;color:var(--primary);font-weight:700;padding:6px 14px;border:1px solid rgba(249,115,22,.3);border-radius:8px;">TR</span>
          </div>
        </nav>

        <section class="ec-hero">
          <button class="drag-handle">⠿</button>
          <div class="ec-hero-content">
            <div class="ec-hero-tag editable" data-key="ec-htag" data-tr="YENİ SEZON KOLEKSİYONU" data-en="NEW SEASON COLLECTION">YENİ SEZON KOLEKSİYONU</div>
            <h1 class="editable" data-key="ec-h1" data-tr="En İyi Ürünler &lt;span&gt;En İyi&lt;/span&gt; Fiyatlarla" data-en="Best Products at &lt;span&gt;Best&lt;/span&gt; Prices">En İyi Ürünler <span>En İyi</span> Fiyatlarla</h1>
            <p class="ec-hero-desc editable" data-key="ec-hdesc" data-tr="Binlerce ürün arasından seçim yapın. Güvenli ödeme, hızlı kargo ve kolay iade garantisi ile alışveriş yapın." data-en="Choose from thousands of products. Shop with secure payment, fast shipping and easy return guarantee.">Binlerce ürün arasından seçim yapın. Güvenli ödeme, hızlı kargo ve kolay iade garantisi ile alışveriş yapın.</p>
            <div class="ec-hero-btns">
              <a href="#ec-products" class="ec-btn ec-btn-primary editable" data-key="ec-hbtn1" data-tr="🛍 Alışverişe Başla" data-en="🛍 Start Shopping">🛍 Alışverişe Başla</a>
              <a href="#ec-contact" class="ec-btn ec-btn-outline editable" data-key="ec-hbtn2" data-tr="Kampanyaları Gör" data-en="View Deals">Kampanyaları Gör</a>
            </div>
          </div>
          <div class="ec-hero-img">
            <div class="ec-hero-img-wrap img-zone" data-img-key="ec-hero-img"><div class="img-upload-hint">🛍 Ürün Görseli</div></div>
            <div class="ec-promo-badge"><span class="pct editable" data-key="ec-pct" data-tr="50%" data-en="50%">50%</span><span class="off editable" data-key="ec-off" data-tr="İndirim" data-en="OFF">İndirim</span></div>
          </div>
        </section>

        <section class="ec-products" id="ec-products">
          <button class="drag-handle">⠿</button>
          <div class="ec-sec-header">
            <div>
              <p class="ec-sec-tag editable" data-key="ec-p-tag" data-tr="ÖNE ÇIKANLAR" data-en="FEATURED">ÖNE ÇIKANLAR</p>
              <h2 class="ec-sec-h editable" data-key="ec-p-h" data-tr="Popüler Ürünler" data-en="Popular Products">Popüler Ürünler</h2>
            </div>
            <a href="#" class="ec-btn ec-btn-outline" style="font-size:.83rem;padding:9px 18px;"><span class="editable" data-key="ec-p-all" data-tr="Tümünü Gör →" data-en="View All →">Tümünü Gör →</span></a>
          </div>
          <div class="ec-products-grid" data-cards="ec-product-card">
            <div class="ec-product-card">
              <div class="ec-product-img img-zone" data-img-key="ec-prod1"><div class="img-upload-hint">📦 Ürün</div></div>
              <div class="ec-product-body">
                <div class="ec-product-name editable" data-key="ec-pr1n" data-tr="Ürün Adı 1" data-en="Product Name 1">Ürün Adı 1</div>
                <div><span class="ec-product-price editable" data-key="ec-pr1p" data-tr="₺299" data-en="$29">₺299</span><span class="ec-product-old editable" data-key="ec-pr1o" data-tr="₺599" data-en="$59">₺599</span></div>
                <button class="ec-product-btn"><span class="editable" data-key="ec-pr-btn" data-tr="İncele" data-en="View Details">İncele</span></button>
              </div>
            </div>
            <div class="ec-product-card">
              <div class="ec-product-img img-zone" data-img-key="ec-prod2"><div class="img-upload-hint">📦 Ürün</div></div>
              <div class="ec-product-body">
                <div class="ec-product-name editable" data-key="ec-pr2n" data-tr="Ürün Adı 2" data-en="Product Name 2">Ürün Adı 2</div>
                <div><span class="ec-product-price editable" data-key="ec-pr2p" data-tr="₺449" data-en="$44">₺449</span><span class="ec-product-old editable" data-key="ec-pr2o" data-tr="₺799" data-en="$79">₺799</span></div>
                <button class="ec-product-btn"><span class="editable" data-key="ec-pr-btn2" data-tr="İncele" data-en="View Details">İncele</span></button>
              </div>
            </div>
            <div class="ec-product-card">
              <div class="ec-product-img img-zone" data-img-key="ec-prod3"><div class="img-upload-hint">📦 Ürün</div></div>
              <div class="ec-product-body">
                <div class="ec-product-name editable" data-key="ec-pr3n" data-tr="Ürün Adı 3" data-en="Product Name 3">Ürün Adı 3</div>
                <div><span class="ec-product-price editable" data-key="ec-pr3p" data-tr="₺199" data-en="$19">₺199</span><span class="ec-product-old editable" data-key="ec-pr3o" data-tr="₺399" data-en="$39">₺399</span></div>
                <button class="ec-product-btn"><span class="editable" data-key="ec-pr-btn3" data-tr="İncele" data-en="View Details">İncele</span></button>
              </div>
            </div>
            <div class="ec-product-card">
              <div class="ec-product-img img-zone" data-img-key="ec-prod4"><div class="img-upload-hint">📦 Ürün</div></div>
              <div class="ec-product-body">
                <div class="ec-product-name editable" data-key="ec-pr4n" data-tr="Ürün Adı 4" data-en="Product Name 4">Ürün Adı 4</div>
                <div><span class="ec-product-price editable" data-key="ec-pr4p" data-tr="₺349" data-en="$34">₺349</span><span class="ec-product-old editable" data-key="ec-pr4o" data-tr="₺699" data-en="$69">₺699</span></div>
                <button class="ec-product-btn"><span class="editable" data-key="ec-pr-btn4" data-tr="İncele" data-en="View Details">İncele</span></button>
              </div>
            </div>
          </div>
        </section>

        <section class="ec-features">
          <button class="drag-handle">⠿</button>
          <div class="ec-feature-card">
            <div class="ec-feature-icon">🚚</div>
            <div class="ec-feature-title editable" data-key="ec-f1t" data-tr="Ücretsiz Kargo" data-en="Free Shipping">Ücretsiz Kargo</div>
            <div class="ec-feature-desc editable" data-key="ec-f1d" data-tr="200₺ üzeri siparişlerde ücretsiz teslimat" data-en="Free delivery on orders over $20">200₺ üzeri siparişlerde ücretsiz teslimat</div>
          </div>
          <div class="ec-feature-card">
            <div class="ec-feature-icon">🔒</div>
            <div class="ec-feature-title editable" data-key="ec-f2t" data-tr="Güvenli Ödeme" data-en="Secure Payment">Güvenli Ödeme</div>
            <div class="ec-feature-desc editable" data-key="ec-f2d" data-tr="256-bit SSL şifreleme ile korumalı ödeme" data-en="Protected payment with 256-bit SSL encryption">256-bit SSL şifreleme ile korumalı ödeme</div>
          </div>
          <div class="ec-feature-card">
            <div class="ec-feature-icon">↩️</div>
            <div class="ec-feature-title editable" data-key="ec-f3t" data-tr="Kolay İade" data-en="Easy Returns">Kolay İade</div>
            <div class="ec-feature-desc editable" data-key="ec-f3d" data-tr="30 gün içinde koşulsuz iade garantisi" data-en="30-day unconditional return guarantee">30 gün içinde koşulsuz iade garantisi</div>
          </div>
        </section>

        <section class="ec-contact" id="ec-contact">
          <button class="drag-handle">⠿</button>
          <p class="ec-sec-tag editable" data-key="ec-c-tag" data-tr="İLETİŞİM" data-en="CONTACT">İLETİŞİM</p>
          <h2 class="ec-sec-h editable" data-key="ec-c-h" data-tr="Sipariş &amp; Destek" data-en="Order &amp; Support">Sipariş &amp; Destek</h2>
          <div class="ec-contact-card">
            <div class="ec-form-group"><label class="editable" data-key="ec-fl1" data-tr="Adınız" data-en="Your Name">Adınız</label><input class="ec-inp" id="ec-form-name" type="text" placeholder="Ad Soyad"></div>
            <div class="ec-form-group"><label class="editable" data-key="ec-fl2" data-tr="Telefon" data-en="Phone">Telefon</label><input class="ec-inp" id="ec-form-tel" type="tel" placeholder="+90 500 000 00 00"></div>
            <div class="ec-form-group"><label class="editable" data-key="ec-fl3" data-tr="Mesajınız" data-en="Your Message">Mesajınız</label><textarea class="ec-inp" id="ec-form-msg" rows="3" placeholder="Sorularınızı yazın..."></textarea></div>
            <button class="ec-btn ec-btn-primary" style="width:100%;justify-content:center" onclick="genericSendWA('ec')"><span class="editable" data-key="ec-c-btn" data-tr="WhatsApp ile Gönder" data-en="Send via WhatsApp">WhatsApp ile Gönder</span></button>
          </div>
        </section>

        <footer class="ec-footer">
          <button class="drag-handle">⠿</button>
          <div class="ec-footer-brand editable" data-key="ec-fb" data-tr="Mağazam" data-en="MyStore">Mağazam</div>
          <p class="ec-footer-cr editable" data-key="ec-cr" data-tr="© 2025 Tüm hakları saklıdır." data-en="© 2025 All rights reserved.">© 2025 Tüm hakları saklıdır.</p>
        </footer>

        <a href="#" class="ec-wa" id="wa-btn" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
      </div>
    `
  },


  hotel: {
    id: 'hotel',
    name: 'Otel & Tatil',
    emoji: '🏨',
    description: 'CSS otomatik geçişli slider hero ile lüks otel şablonu',
    defaultColors: { primary: '#B8860B', secondary: '#8B6914', bg: '#1A1209', text: '#F5F0E8', light: '#2A1F0A' },
    css: `
      @keyframes ht-slide{0%,28%{opacity:1}33%,97%{opacity:0}100%{opacity:1}}
      @keyframes ht-fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
      @keyframes ht-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .ht-wrap{font-family:inherit;background:var(--bg);color:var(--text);}
      .ht-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 56px;position:absolute;top:0;left:0;right:0;z-index:20;background:linear-gradient(to bottom,rgba(26,18,9,.7),transparent);}
      .ht-logo{font-size:1.4rem;font-weight:900;color:#F5F0E8;letter-spacing:1px;}
      .ht-logo em{font-style:normal;color:var(--primary);}
      .ht-nav-links{display:flex;gap:28px;list-style:none;}
      .ht-nav-links a{color:rgba(245,240,232,.8);text-decoration:none;font-size:.87rem;font-weight:500;transition:color .2s;}
      .ht-nav-links a:hover{color:var(--primary);}
      .ht-hero{position:relative;height:100vh;overflow:hidden;}
      .ht-slide-el{position:absolute;inset:0;opacity:0;}
      .ht-slide-el:nth-child(1){opacity:1;animation:ht-slide 15s 0s infinite;}
      .ht-slide-el:nth-child(2){animation:ht-slide 15s -10s infinite;}
      .ht-slide-el:nth-child(3){animation:ht-slide 15s -5s infinite;}
      .ht-slide-bg{width:100%;height:100%;object-fit:cover;background:var(--light);display:flex;align-items:center;justify-content:center;font-size:3rem;}
      .ht-slide-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,18,9,.85) 0%,rgba(26,18,9,.3) 60%,transparent 100%);}
      .ht-hero-content{position:absolute;bottom:0;left:0;right:0;padding:80px 56px;z-index:10;}
      .ht-hero-tag{font-size:.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:3px;margin-bottom:14px;animation:ht-fadeUp .7s ease both;}
      .ht-hero h1{font-size:clamp(2.4rem,5vw,4.4rem);font-weight:900;line-height:1.1;color:#F5F0E8;margin-bottom:18px;animation:ht-fadeUp .7s .1s ease both;overflow-wrap:break-word;word-break:break-word;}
      .ht-hero-sub{font-size:1.05rem;color:rgba(245,240,232,.65);max-width:560px;line-height:1.7;margin-bottom:36px;animation:ht-fadeUp .7s .2s ease both;}
      .ht-book-bar{display:flex;gap:0;background:rgba(245,240,232,.95);border-radius:14px;overflow:hidden;max-width:680px;animation:ht-fadeUp .7s .3s ease both;}
      .ht-book-field{flex:1;padding:0 18px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(26,18,9,.1);}
      .ht-book-field label{font-size:.68rem;font-weight:700;color:var(--secondary);text-transform:uppercase;letter-spacing:1px;}
      .ht-book-field input{border:none;background:transparent;font-size:.9rem;color:var(--bg);padding:6px 0;outline:none;font-weight:600;}
      .ht-book-btn{background:var(--primary);color:#fff;border:none;padding:0 28px;font-weight:700;font-size:.9rem;cursor:pointer;white-space:nowrap;transition:background .2s;}
      .ht-book-btn:hover{background:var(--secondary);}
      .ht-slide-dots{position:absolute;bottom:24px;right:56px;display:flex;gap:8px;z-index:15;}
      .ht-dot{width:6px;height:6px;border-radius:50%;background:rgba(245,240,232,.4);}
      .ht-dot.active{background:var(--primary);width:22px;border-radius:4px;}
      .ht-rooms{padding:96px 56px;background:var(--bg);}
      .ht-sec-tag{font-size:.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:3px;margin-bottom:10px;text-align:center;}
      .ht-sec-h{font-size:2.2rem;font-weight:900;text-align:center;margin-bottom:12px;}
      .ht-sec-sub{color:rgba(245,240,232,.45);text-align:center;font-size:.92rem;margin-bottom:52px;}
      .ht-rooms-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
      .ht-room-card{background:var(--light);border-radius:18px;overflow:hidden;border:1px solid rgba(184,134,11,.15);transition:transform .3s,box-shadow .3s;}
      .ht-room-card:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,.3);}
      .ht-room-img{width:100%;aspect-ratio:16/10;object-fit:cover;background:rgba(184,134,11,.08);display:flex;align-items:center;justify-content:center;font-size:2.5rem;}
      .ht-room-body{padding:22px;}
      .ht-room-name{font-size:1.05rem;font-weight:700;margin-bottom:6px;}
      .ht-room-desc{font-size:.82rem;color:rgba(245,240,232,.5);line-height:1.6;margin-bottom:14px;}
      .ht-room-footer{display:flex;align-items:center;justify-content:space-between;}
      .ht-room-price{font-size:1.2rem;font-weight:900;color:var(--primary);}
      .ht-room-price span{font-size:.72rem;font-weight:400;color:rgba(245,240,232,.4);margin-left:2px;}
      .ht-room-btn{background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 18px;font-size:.82rem;font-weight:700;cursor:pointer;transition:background .2s;}
      .ht-room-btn:hover{background:var(--secondary);}
      .ht-amenities{padding:80px 56px;background:var(--light);display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
      .ht-amen-img{border-radius:20px;aspect-ratio:4/3;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:3rem;}
      .ht-amen-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:28px 0;}
      .ht-amen-item{display:flex;align-items:center;gap:12px;background:var(--bg);border-radius:12px;padding:14px;}
      .ht-amen-icon{font-size:1.4rem;}
      .ht-amen-txt{font-size:.87rem;font-weight:600;}
      .ht-contact{padding:88px 56px;text-align:center;background:var(--bg);}
      .ht-contact-card{max-width:560px;margin:40px auto 0;background:var(--light);border:1px solid rgba(184,134,11,.15);border-radius:22px;padding:48px 40px;}
      .ht-form-group{margin-bottom:16px;text-align:left;}
      .ht-form-group label{display:block;font-size:.8rem;font-weight:600;opacity:.6;margin-bottom:7px;}
      .ht-inp{width:100%;padding:13px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(184,134,11,.2);border-radius:10px;color:var(--text);font-size:.88rem;outline:none;transition:border-color .2s;}
      .ht-inp:focus{border-color:var(--primary);}
      .ht-btn-primary{background:var(--primary);color:#1A1209;border:none;border-radius:11px;padding:13px 28px;font-weight:700;font-size:.9rem;cursor:pointer;transition:all .2s;}
      .ht-btn-primary:hover{background:var(--secondary);color:#fff;}
      .ht-footer{background:var(--light);padding:36px 56px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(184,134,11,.1);}
      .ht-footer-logo{font-size:1.1rem;font-weight:900;color:var(--primary);}
      .ht-footer-cr{color:rgba(245,240,232,.3);font-size:.78rem;}
      .ht-wa{position:fixed;bottom:28px;right:28px;z-index:999;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 18px rgba(37,211,102,.4);text-decoration:none;transition:transform .2s;}
      .ht-wa:hover{transform:scale(1.1);}
      .ht-wa svg{width:28px;height:28px;}
@container(max-width:900px){
  .ht-rooms-grid{grid-template-columns:repeat(2,1fr);}
}
@container(max-width:768px){
  .ht-nav{padding:14px 20px;}
  .ht-nav-links{display:none;}
  .ht-hero-content{padding:60px 20px 110px;}
  .ht-book-bar{flex-direction:column;border-radius:12px;max-width:100%;}
  .ht-book-field{padding:10px 16px;border-right:none;border-bottom:1px solid rgba(26,18,9,.1);}
  .ht-book-btn{padding:14px 20px;width:100%;text-align:center;}
  .ht-rooms{padding:60px 20px;}
  .ht-rooms-grid{grid-template-columns:1fr;}
  .ht-amenities{grid-template-columns:1fr;padding:60px 20px;gap:36px;}
  .ht-contact{padding:60px 20px;}
  .ht-contact-card{padding:36px 24px;}
  .ht-footer{padding:20px;flex-direction:column;gap:8px;text-align:center;}
}
@container(max-width:480px){
  .ht-amen-grid{grid-template-columns:1fr;}
  .ht-hero-content{padding:40px 16px 90px;}
  .ht-hero h1{font-size:clamp(1.8rem,7vw,2.4rem);}
}
    `,
    html: `
      <div class="ht-wrap">
        <nav class="ht-nav">
          <button class="drag-handle">⠿</button>
          <div class="ht-logo editable" data-key="ht-logo" data-tr="GRAND <em>OTEL</em>" data-en="GRAND <em>HOTEL</em>">GRAND <em>OTEL</em></div>
          <ul class="ht-nav-links">
            <li><a class="editable" data-key="ht-n1" data-tr="Odalar" data-en="Rooms">Odalar</a></li>
            <li><a class="editable" data-key="ht-n2" data-tr="Olanaklar" data-en="Amenities">Olanaklar</a></li>
            <li><a class="editable" data-key="ht-n3" data-tr="Rezervasyon" data-en="Reservation">Rezervasyon</a></li>
          </ul>
          <span id="lang-label" onclick="window.toggleLang&&window.toggleLang()" style="cursor:pointer;font-size:.8rem;color:var(--primary);font-weight:700;padding:6px 14px;border:1px solid rgba(184,134,11,.3);border-radius:8px;">TR</span>
        </nav>

        <section class="ht-hero">
          <button class="drag-handle">⠿</button>
          <div class="ht-slide-el">
            <div class="ht-slide-bg img-zone" data-img-key="ht-slide1"><div class="img-upload-hint">🏨 Otel Görseli 1</div></div>
            <div class="ht-slide-overlay"></div>
          </div>
          <div class="ht-slide-el">
            <div class="ht-slide-bg img-zone" data-img-key="ht-slide2"><div class="img-upload-hint">🌊 Otel Görseli 2</div></div>
            <div class="ht-slide-overlay"></div>
          </div>
          <div class="ht-slide-el">
            <div class="ht-slide-bg img-zone" data-img-key="ht-slide3"><div class="img-upload-hint">🌅 Otel Görseli 3</div></div>
            <div class="ht-slide-overlay"></div>
          </div>
          <div class="ht-hero-content">
            <p class="ht-hero-tag editable" data-key="ht-htag" data-tr="LÜX TATIL DENEYİMİ" data-en="LUXURY HOLIDAY EXPERIENCE">LÜX TATIL DENEYİMİ</p>
            <h1 class="editable" data-key="ht-h1" data-tr="Hayalinizdeki Tatili Yaşayın" data-en="Live Your Dream Holiday">Hayalinizdeki Tatili Yaşayın</h1>
            <p class="ht-hero-sub editable" data-key="ht-hsub" data-tr="Eşsiz manzaralar, beş yıldızlı hizmet ve unutulmaz anılar için doğru adres." data-en="The perfect destination for breathtaking views, five-star service and unforgettable memories.">Eşsiz manzaralar, beş yıldızlı hizmet ve unutulmaz anılar için doğru adres.</p>
            <div class="ht-book-bar">
              <div class="ht-book-field"><label class="editable" data-key="ht-in" data-tr="GİRİŞ" data-en="CHECK-IN">GİRİŞ</label><input type="date"></div>
              <div class="ht-book-field"><label class="editable" data-key="ht-out" data-tr="ÇIKIŞ" data-en="CHECK-OUT">ÇIKIŞ</label><input type="date"></div>
              <button class="ht-book-btn"><span class="editable" data-key="ht-book-btn" data-tr="Rezervasyon Yap" data-en="Book Now">Rezervasyon Yap</span></button>
            </div>
          </div>
          <div class="ht-slide-dots">
            <div class="ht-dot active"></div>
            <div class="ht-dot"></div>
            <div class="ht-dot"></div>
          </div>
        </section>

        <section class="ht-rooms">
          <button class="drag-handle">⠿</button>
          <p class="ht-sec-tag editable" data-key="ht-r-tag" data-tr="ODALARIMIZ" data-en="OUR ROOMS">ODALARIMIZ</p>
          <h2 class="ht-sec-h editable" data-key="ht-r-h" data-tr="Konforu Seçin" data-en="Choose Your Comfort">Konforu Seçin</h2>
          <p class="ht-sec-sub editable" data-key="ht-r-sub" data-tr="Her bütçeye uygun lüks oda seçenekleri" data-en="Luxury room options for every budget">Her bütçeye uygun lüks oda seçenekleri</p>
          <div class="ht-rooms-grid" data-cards="ht-room-card">
            <div class="ht-room-card">
              <div class="ht-room-img img-zone" data-img-key="ht-r1"><div class="img-upload-hint">🛏 Oda Görseli</div></div>
              <div class="ht-room-body">
                <div class="ht-room-name editable" data-key="ht-r1n" data-tr="Standart Oda" data-en="Standard Room">Standart Oda</div>
                <div class="ht-room-desc editable" data-key="ht-r1d" data-tr="Deniz manzaralı, klimalı, mini bar dahil konforlu oda." data-en="Comfortable room with sea view, air conditioning and mini bar included.">Deniz manzaralı, klimalı, mini bar dahil konforlu oda.</div>
                <div class="ht-room-footer">
                  <div class="ht-room-price editable" data-key="ht-r1p" data-tr="₺1.200<span>/gece</span>" data-en="$120<span>/night</span>">₺1.200<span>/gece</span></div>
                  <button class="ht-room-btn"><span class="editable" data-key="ht-rb" data-tr="Rezervasyon" data-en="Book">Rezervasyon</span></button>
                </div>
              </div>
            </div>
            <div class="ht-room-card">
              <div class="ht-room-img img-zone" data-img-key="ht-r2"><div class="img-upload-hint">🛏 Oda Görseli</div></div>
              <div class="ht-room-body">
                <div class="ht-room-name editable" data-key="ht-r2n" data-tr="Deluxe Suit" data-en="Deluxe Suite">Deluxe Suit</div>
                <div class="ht-room-desc editable" data-key="ht-r2d" data-tr="Panoramik manzara, jakuzi ve özel balkonlu geniş oda." data-en="Spacious room with panoramic view, jacuzzi and private balcony.">Panoramik manzara, jakuzi ve özel balkonlu geniş oda.</div>
                <div class="ht-room-footer">
                  <div class="ht-room-price editable" data-key="ht-r2p" data-tr="₺2.500<span>/gece</span>" data-en="$250<span>/night</span>">₺2.500<span>/gece</span></div>
                  <button class="ht-room-btn"><span class="editable" data-key="ht-rb2" data-tr="Rezervasyon" data-en="Book">Rezervasyon</span></button>
                </div>
              </div>
            </div>
            <div class="ht-room-card">
              <div class="ht-room-img img-zone" data-img-key="ht-r3"><div class="img-upload-hint">🛏 Oda Görseli</div></div>
              <div class="ht-room-body">
                <div class="ht-room-name editable" data-key="ht-r3n" data-tr="Villa Süit" data-en="Villa Suite">Villa Süit</div>
                <div class="ht-room-desc editable" data-key="ht-r3d" data-tr="Özel havuz, butler hizmeti ve tam donanımlı mutfak." data-en="Private pool, butler service and fully equipped kitchen.">Özel havuz, butler hizmeti ve tam donanımlı mutfak.</div>
                <div class="ht-room-footer">
                  <div class="ht-room-price editable" data-key="ht-r3p" data-tr="₺5.000<span>/gece</span>" data-en="$500<span>/night</span>">₺5.000<span>/gece</span></div>
                  <button class="ht-room-btn"><span class="editable" data-key="ht-rb3" data-tr="Rezervasyon" data-en="Book">Rezervasyon</span></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="ht-amenities">
          <button class="drag-handle">⠿</button>
          <div class="ht-amen-img img-zone" data-img-key="ht-amen-img"><div class="img-upload-hint">✨ Olanaklar Görseli</div></div>
          <div>
            <p class="ht-sec-tag" style="text-align:left;" class="editable" data-key="ht-a-tag" data-tr="OLANAKLAR" data-en="AMENITIES">OLANAKLAR</p>
            <h2 class="ht-sec-h editable" style="text-align:left;" data-key="ht-a-h" data-tr="5 Yıldızlı Ayrıcalıklar" data-en="5-Star Privileges">5 Yıldızlı Ayrıcalıklar</h2>
            <div class="ht-amen-grid">
              <div class="ht-amen-item"><div class="ht-amen-icon">🏊</div><div class="ht-amen-txt editable" data-key="ht-a1" data-tr="Sonsuzluk Havuzu" data-en="Infinity Pool">Sonsuzluk Havuzu</div></div>
              <div class="ht-amen-item"><div class="ht-amen-icon">🍽️</div><div class="ht-amen-txt editable" data-key="ht-a2" data-tr="Fine Dining Restoran" data-en="Fine Dining Restaurant">Fine Dining Restoran</div></div>
              <div class="ht-amen-item"><div class="ht-amen-icon">💆</div><div class="ht-amen-txt editable" data-key="ht-a3" data-tr="Lüks Spa & Wellness" data-en="Luxury Spa & Wellness">Lüks Spa & Wellness</div></div>
              <div class="ht-amen-item"><div class="ht-amen-icon">🎾</div><div class="ht-amen-txt editable" data-key="ht-a4" data-tr="Spor Alanları" data-en="Sports Courts">Spor Alanları</div></div>
            </div>
            <a href="#ht-contact" class="ht-btn-primary editable" data-key="ht-a-btn" data-tr="Rezervasyon Yap" data-en="Book Now" style="display:inline-block;text-decoration:none;">Rezervasyon Yap</a>
          </div>
        </section>

        <section class="ht-contact" id="ht-contact">
          <button class="drag-handle">⠿</button>
          <p class="ht-sec-tag editable" data-key="ht-c-tag" data-tr="REZERVASYON" data-en="RESERVATION">REZERVASYON</p>
          <h2 class="ht-sec-h editable" data-key="ht-c-h" data-tr="Yerinizi Ayırtın" data-en="Reserve Your Place">Yerinizi Ayırtın</h2>
          <div class="ht-contact-card">
            <div class="ht-form-group"><label class="editable" data-key="ht-fl1" data-tr="Ad Soyad" data-en="Full Name">Ad Soyad</label><input class="ht-inp" id="ht-form-name" type="text" placeholder="Ad Soyad"></div>
            <div class="ht-form-group"><label class="editable" data-key="ht-fl2" data-tr="Telefon" data-en="Phone">Telefon</label><input class="ht-inp" id="ht-form-tel" type="tel" placeholder="+90 500 000 00 00"></div>
            <div class="ht-form-group"><label class="editable" data-key="ht-fl3" data-tr="İstek &amp; Notlar" data-en="Requests &amp; Notes">İstek &amp; Notlar</label><textarea class="ht-inp" id="ht-form-msg" rows="3" placeholder="Tercihlerinizi belirtin..."></textarea></div>
            <button class="ht-btn-primary" style="width:100%;" onclick="genericSendWA('ht')"><span class="editable" data-key="ht-c-btn" data-tr="WhatsApp ile Rezervasyon" data-en="Reserve via WhatsApp">WhatsApp ile Rezervasyon</span></button>
          </div>
        </section>

        <footer class="ht-footer">
          <button class="drag-handle">⠿</button>
          <div class="ht-footer-logo editable" data-key="ht-fl" data-tr="GRAND OTEL" data-en="GRAND HOTEL">GRAND OTEL</div>
          <p class="ht-footer-cr editable" data-key="ht-cr" data-tr="© 2025 Tüm hakları saklıdır." data-en="© 2025 All rights reserved.">© 2025 Tüm hakları saklıdır.</p>
        </footer>

        <a href="#" class="ht-wa" id="wa-btn" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
      </div>
    `
  },

  medical: {
    id: 'medical',
    name: 'Sağlık & Klinik',
    emoji: '🏥',
    description: 'Animasyonlu istatistikler ile profesyonel klinik şablonu',
    defaultColors: { primary: '#0EA5E9', secondary: '#0284C7', bg: '#FFFFFF', text: '#0F172A', light: '#F0F9FF' },
    css: `
      @keyframes md-fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes md-stat-pop{0%{transform:scale(.8);opacity:0}100%{transform:scale(1);opacity:1}}
      @keyframes md-pulse-ring{0%{box-shadow:0 0 0 0 rgba(14,165,233,.3)}100%{box-shadow:0 0 0 16px rgba(14,165,233,0)}}
      .md-wrap{font-family:inherit;background:var(--bg);color:var(--text);}
      .md-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 52px;background:#fff;border-bottom:1px solid rgba(14,165,233,.12);position:sticky;top:0;z-index:50;box-shadow:0 2px 14px rgba(14,165,233,.08);}
      .md-logo{display:flex;align-items:center;gap:10px;font-size:1.2rem;font-weight:900;color:var(--text);}
      .md-logo-icon{width:36px;height:36px;background:var(--primary);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#fff;animation:md-pulse-ring 2s infinite;}
      .md-nav-links{display:flex;gap:26px;list-style:none;}
      .md-nav-links a{color:var(--text);text-decoration:none;font-size:.87rem;font-weight:500;transition:color .2s;}
      .md-nav-links a:hover{color:var(--primary);}
      .md-appt-btn{background:var(--primary);color:#fff;border:none;border-radius:10px;padding:10px 22px;font-weight:700;font-size:.86rem;cursor:pointer;transition:all .2s;}
      .md-appt-btn:hover{background:var(--secondary);transform:translateY(-1px);}
      .md-hero{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;padding:80px 52px;background:linear-gradient(135deg,#F0F9FF 0%,#E0F2FE 50%,#F0F9FF 100%);}
      .md-hero-tag{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(14,165,233,.2);border-radius:50px;padding:7px 18px;font-size:.75rem;font-weight:700;color:var(--primary);margin-bottom:22px;animation:md-fadeIn .6s ease both;}
      .md-hero h1{font-size:clamp(2rem,4vw,3.4rem);font-weight:900;line-height:1.2;margin-bottom:18px;animation:md-fadeIn .6s .1s ease both;}
      .md-hero h1 span{color:var(--primary);}
      .md-hero-desc{color:rgba(15,23,42,.55);line-height:1.8;margin-bottom:32px;animation:md-fadeIn .6s .2s ease both;}
      .md-hero-btns{display:flex;gap:14px;flex-wrap:wrap;animation:md-fadeIn .6s .3s ease both;}
      .md-btn{padding:13px 28px;border-radius:11px;font-weight:700;font-size:.9rem;cursor:pointer;border:none;text-decoration:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
      .md-btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 16px rgba(14,165,233,.3);}
      .md-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(14,165,233,.45);}
      .md-btn-outline{background:transparent;color:var(--primary);border:2px solid rgba(14,165,233,.4);}
      .md-btn-outline:hover{background:var(--primary);color:#fff;}
      .md-hero-img{border-radius:24px;overflow:hidden;aspect-ratio:4/3;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 60px rgba(14,165,233,.15);}
      .md-hero-badges{display:flex;gap:16px;margin-top:28px;}
      .md-hero-badge{background:#fff;border-radius:14px;padding:14px 20px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 18px rgba(14,165,233,.1);animation:md-fadeIn .6s .5s ease both;}
      .md-hero-badge-icon{font-size:1.5rem;}
      .md-hero-badge-text strong{display:block;font-size:1rem;font-weight:900;color:var(--primary);}
      .md-hero-badge-text span{font-size:.72rem;color:rgba(15,23,42,.5);}
      .md-services{padding:88px 52px;background:var(--bg);}
      .md-sec-tag{font-size:.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:3px;margin-bottom:10px;text-align:center;}
      .md-sec-h{font-size:2.1rem;font-weight:900;text-align:center;margin-bottom:12px;}
      .md-sec-sub{color:rgba(15,23,42,.45);text-align:center;font-size:.9rem;margin-bottom:52px;}
      .md-services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
      .md-service-card{background:var(--light);border-radius:18px;padding:32px;border:1px solid rgba(14,165,233,.08);transition:all .3s;animation:md-fadeIn .5s ease both;}
      .md-service-card:nth-child(2){animation-delay:.1s;}
      .md-service-card:nth-child(3){animation-delay:.2s;}
      .md-service-card:nth-child(4){animation-delay:.3s;}
      .md-service-card:nth-child(5){animation-delay:.4s;}
      .md-service-card:nth-child(6){animation-delay:.5s;}
      .md-service-card:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(14,165,233,.12);border-color:rgba(14,165,233,.2);}
      .md-service-icon{width:52px;height:52px;background:rgba(14,165,233,.1);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin-bottom:16px;}
      .md-service-title{font-size:1.02rem;font-weight:700;margin-bottom:8px;}
      .md-service-desc{font-size:.82rem;color:rgba(15,23,42,.5);line-height:1.65;}
      .md-stats{padding:72px 52px;background:var(--primary);}
      .md-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;text-align:center;}
      .md-stat{color:#fff;animation:md-stat-pop .6s ease both;}
      .md-stat:nth-child(2){animation-delay:.1s;}
      .md-stat:nth-child(3){animation-delay:.2s;}
      .md-stat:nth-child(4){animation-delay:.3s;}
      .md-stat-num{font-size:2.8rem;font-weight:900;line-height:1;margin-bottom:6px;}
      .md-stat-label{font-size:.84rem;opacity:.75;}
      .md-contact{padding:88px 52px;text-align:center;background:var(--bg);}
      .md-contact-card{max-width:580px;margin:40px auto 0;background:var(--light);border-radius:22px;padding:48px 40px;border:1px solid rgba(14,165,233,.1);}
      .md-form-group{margin-bottom:16px;text-align:left;}
      .md-form-group label{display:block;font-size:.8rem;font-weight:600;margin-bottom:7px;color:rgba(15,23,42,.55);}
      .md-inp{width:100%;padding:13px 16px;background:#fff;border:1.5px solid rgba(14,165,233,.2);border-radius:10px;color:var(--text);font-size:.88rem;outline:none;transition:border-color .2s;}
      .md-inp:focus{border-color:var(--primary);}
      .md-footer{background:var(--text);color:rgba(255,255,255,.6);padding:36px 52px;display:flex;align-items:center;justify-content:space-between;}
      .md-footer-brand{font-size:1.1rem;font-weight:900;color:#fff;}
      .md-footer-cr{font-size:.78rem;}
      .md-wa{position:fixed;bottom:28px;right:28px;z-index:999;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 18px rgba(37,211,102,.4);text-decoration:none;transition:transform .2s;}
      .md-wa:hover{transform:scale(1.1);}
      .md-wa svg{width:28px;height:28px;}
@container(max-width:900px){
  .md-services-grid{grid-template-columns:repeat(2,1fr);}
  .md-stats-grid{grid-template-columns:repeat(2,1fr);}
}
@container(max-width:768px){
  .md-nav{padding:14px 20px;}
  .md-nav-links,.md-appt-btn{display:none;}
  .md-hero{grid-template-columns:1fr;padding:60px 20px;gap:36px;}
  .md-hero-badges{flex-direction:column;gap:12px;}
  .md-services{padding:60px 20px;}
  .md-stats{padding:48px 20px;}
  .md-contact{padding:60px 20px;}
  .md-contact-card{padding:36px 24px;}
  .md-footer{padding:20px;flex-direction:column;gap:8px;text-align:center;}
}
@container(max-width:480px){
  .md-services-grid{grid-template-columns:1fr;}
  .md-stats-grid{grid-template-columns:repeat(2,1fr);}
  .md-hero-btns{flex-direction:column;align-items:stretch;}
  .md-btn{justify-content:center;}
}
    `,
    html: `
      <div class="md-wrap">
        <nav class="md-nav">
          <button class="drag-handle">⠿</button>
          <div class="md-logo"><div class="md-logo-icon">➕</div><span class="editable" data-key="md-logo" data-tr="MedKlinik" data-en="MedClinic">MedKlinik</span></div>
          <ul class="md-nav-links">
            <li><a class="editable" data-key="md-n1" data-tr="Hizmetler" data-en="Services">Hizmetler</a></li>
            <li><a class="editable" data-key="md-n2" data-tr="Doktorlar" data-en="Doctors">Doktorlar</a></li>
            <li><a class="editable" data-key="md-n3" data-tr="Randevu" data-en="Appointment">Randevu</a></li>
          </ul>
          <div style="display:flex;align-items:center;gap:10px;">
            <span id="lang-label" onclick="window.toggleLang&&window.toggleLang()" style="cursor:pointer;font-size:.8rem;color:var(--primary);font-weight:700;padding:6px 14px;border:1px solid rgba(14,165,233,.3);border-radius:8px;">TR</span>
            <button class="md-appt-btn"><span class="editable" data-key="md-appt-btn" data-tr="📅 Randevu Al" data-en="📅 Book Appointment">📅 Randevu Al</span></button>
          </div>
        </nav>

        <section class="md-hero">
          <button class="drag-handle">⠿</button>
          <div>
            <div class="md-hero-tag"><span>✦</span><span class="editable" data-key="md-htag" data-tr="Güvenilir Sağlık Hizmetleri" data-en="Trusted Healthcare Services">Güvenilir Sağlık Hizmetleri</span></div>
            <h1 class="editable" data-key="md-h1" data-tr="Sağlığınız İçin &lt;span&gt;En İyi&lt;/span&gt; Bakım" data-en="The &lt;span&gt;Best&lt;/span&gt; Care For Your Health">Sağlığınız İçin <span>En İyi</span> Bakım</h1>
            <p class="md-hero-desc editable" data-key="md-hdesc" data-tr="Uzman doktorlar, modern ekipmanlar ve hasta odaklı yaklaşımımızla yanınızdayız." data-en="We are by your side with specialist doctors, modern equipment and a patient-centred approach.">Uzman doktorlar, modern ekipmanlar ve hasta odaklı yaklaşımımızla yanınızdayız.</p>
            <div class="md-hero-btns">
              <a href="#md-contact" class="md-btn md-btn-primary editable" data-key="md-hbtn1" data-tr="📅 Randevu Al" data-en="📅 Book Now">📅 Randevu Al</a>
              <a href="#md-services" class="md-btn md-btn-outline editable" data-key="md-hbtn2" data-tr="Hizmetleri Gör" data-en="View Services">Hizmetleri Gör</a>
            </div>
            <div class="md-hero-badges">
              <div class="md-hero-badge">
                <div class="md-hero-badge-icon">👨‍⚕️</div>
                <div class="md-hero-badge-text"><strong class="editable" data-key="md-b1n" data-tr="50+" data-en="50+">50+</strong><span class="editable" data-key="md-b1l" data-tr="Uzman Doktor" data-en="Specialist Doctors">Uzman Doktor</span></div>
              </div>
              <div class="md-hero-badge">
                <div class="md-hero-badge-icon">🏆</div>
                <div class="md-hero-badge-text"><strong class="editable" data-key="md-b2n" data-tr="15 Yıl" data-en="15 Years">15 Yıl</strong><span class="editable" data-key="md-b2l" data-tr="Deneyim" data-en="Experience">Deneyim</span></div>
              </div>
            </div>
          </div>
          <div class="md-hero-img img-zone" data-img-key="md-hero-img"><div class="img-upload-hint">🏥 Klinik Görseli</div></div>
        </section>

        <section class="md-services" id="md-services">
          <button class="drag-handle">⠿</button>
          <p class="md-sec-tag editable" data-key="md-s-tag" data-tr="HİZMETLERİMİZ" data-en="OUR SERVICES">HİZMETLERİMİZ</p>
          <h2 class="md-sec-h editable" data-key="md-s-h" data-tr="Uzmanlık Alanlarımız" data-en="Our Specialties">Uzmanlık Alanlarımız</h2>
          <p class="md-sec-sub editable" data-key="md-s-sub" data-tr="Kapsamlı sağlık hizmetleri için tek adres" data-en="One stop for comprehensive health services">Kapsamlı sağlık hizmetleri için tek adres</p>
          <div class="md-services-grid" data-cards="md-service-card">
            <div class="md-service-card"><div class="md-service-icon">❤️</div><div class="md-service-title editable" data-key="md-sv1t" data-tr="Kardiyoloji" data-en="Cardiology">Kardiyoloji</div><div class="md-service-desc editable" data-key="md-sv1d" data-tr="Kalp ve damar hastalıklarında uzman tanı ve tedavi" data-en="Expert diagnosis and treatment of heart and vascular diseases">Kalp ve damar hastalıklarında uzman tanı ve tedavi</div></div>
            <div class="md-service-card"><div class="md-service-icon">🦷</div><div class="md-service-title editable" data-key="md-sv2t" data-tr="Diş Sağlığı" data-en="Dental Health">Diş Sağlığı</div><div class="md-service-desc editable" data-key="md-sv2d" data-tr="Modern diş tedavisi ve estetik diş uygulamaları" data-en="Modern dental treatment and aesthetic dental applications">Modern diş tedavisi ve estetik diş uygulamaları</div></div>
            <div class="md-service-card"><div class="md-service-icon">🧠</div><div class="md-service-title editable" data-key="md-sv3t" data-tr="Nöroloji" data-en="Neurology">Nöroloji</div><div class="md-service-desc editable" data-key="md-sv3d" data-tr="Sinir sistemi hastalıklarında kapsamlı tanı" data-en="Comprehensive diagnosis of nervous system disorders">Sinir sistemi hastalıklarında kapsamlı tanı</div></div>
            <div class="md-service-card"><div class="md-service-icon">👶</div><div class="md-service-title editable" data-key="md-sv4t" data-tr="Pediatri" data-en="Pediatrics">Pediatri</div><div class="md-service-desc editable" data-key="md-sv4d" data-tr="Çocuk sağlığı ve hastalıkları uzmanı" data-en="Child health and diseases specialist">Çocuk sağlığı ve hastalıkları uzmanı</div></div>
            <div class="md-service-card"><div class="md-service-icon">👁️</div><div class="md-service-title editable" data-key="md-sv5t" data-tr="Göz Hastalıkları" data-en="Ophthalmology">Göz Hastalıkları</div><div class="md-service-desc editable" data-key="md-sv5d" data-tr="Göz muayenesi, lazer ve cerrahi tedavi" data-en="Eye examination, laser and surgical treatment">Göz muayenesi, lazer ve cerrahi tedavi</div></div>
            <div class="md-service-card"><div class="md-service-icon">🩺</div><div class="md-service-title editable" data-key="md-sv6t" data-tr="Dahiliye" data-en="Internal Medicine">Dahiliye</div><div class="md-service-desc editable" data-key="md-sv6d" data-tr="İç hastalıkları ve genel sağlık muayenesi" data-en="Internal diseases and general health checkup">İç hastalıkları ve genel sağlık muayenesi</div></div>
          </div>
        </section>

        <section class="md-stats">
          <button class="drag-handle">⠿</button>
          <div class="md-stats-grid">
            <div class="md-stat"><div class="md-stat-num editable" data-key="md-st1n" data-tr="25.000+" data-en="25,000+">25.000+</div><div class="md-stat-label editable" data-key="md-st1l" data-tr="Mutlu Hasta" data-en="Happy Patients">Mutlu Hasta</div></div>
            <div class="md-stat"><div class="md-stat-num editable" data-key="md-st2n" data-tr="50+" data-en="50+">50+</div><div class="md-stat-label editable" data-key="md-st2l" data-tr="Uzman Doktor" data-en="Specialist Doctors">Uzman Doktor</div></div>
            <div class="md-stat"><div class="md-stat-num editable" data-key="md-st3n" data-tr="15" data-en="15">15</div><div class="md-stat-label editable" data-key="md-st3l" data-tr="Yıllık Deneyim" data-en="Years Experience">Yıllık Deneyim</div></div>
            <div class="md-stat"><div class="md-stat-num editable" data-key="md-st4n" data-tr="%98" data-en="98%">%98</div><div class="md-stat-label editable" data-key="md-st4l" data-tr="Hasta Memnuniyeti" data-en="Patient Satisfaction">Hasta Memnuniyeti</div></div>
          </div>
        </section>

        <section class="md-contact" id="md-contact">
          <button class="drag-handle">⠿</button>
          <p class="md-sec-tag editable" data-key="md-c-tag" data-tr="RANDEVU" data-en="APPOINTMENT">RANDEVU</p>
          <h2 class="md-sec-h editable" data-key="md-c-h" data-tr="Online Randevu Alın" data-en="Book an Appointment Online">Online Randevu Alın</h2>
          <div class="md-contact-card">
            <div class="md-form-group"><label class="editable" data-key="md-fl1" data-tr="Ad Soyad" data-en="Full Name">Ad Soyad</label><input class="md-inp" id="md-form-name" type="text" placeholder="Ad Soyad"></div>
            <div class="md-form-group"><label class="editable" data-key="md-fl2" data-tr="Telefon" data-en="Phone">Telefon</label><input class="md-inp" id="md-form-tel" type="tel" placeholder="+90 500 000 00 00"></div>
            <div class="md-form-group"><label class="editable" data-key="md-fl3" data-tr="Şikayet / Bölüm" data-en="Complaint / Department">Şikayet / Bölüm</label><textarea class="md-inp" id="md-form-msg" rows="3" placeholder="Şikayetinizi ve tercih ettiğiniz bölümü yazın..."></textarea></div>
            <button class="md-btn md-btn-primary" style="width:100%;justify-content:center" onclick="genericSendWA('md')"><span class="editable" data-key="md-c-btn" data-tr="WhatsApp ile Randevu" data-en="Book via WhatsApp">WhatsApp ile Randevu</span></button>
          </div>
        </section>

        <footer class="md-footer">
          <button class="drag-handle">⠿</button>
          <div class="md-footer-brand editable" data-key="md-fb" data-tr="MedKlinik" data-en="MedClinic">MedKlinik</div>
          <p class="md-footer-cr editable" data-key="md-cr" data-tr="© 2025 Tüm hakları saklıdır." data-en="© 2025 All rights reserved.">© 2025 Tüm hakları saklıdır.</p>
        </footer>

        <a href="#" class="md-wa" id="wa-btn" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
      </div>
    `
  },


  fitness: {
    id: 'fitness',
    name: 'Fitness & Spor',
    emoji: '💪',
    description: 'Güçlü animasyonlar ile etkileyici spor salonu şablonu',
    defaultColors: { primary: '#EF4444', secondary: '#DC2626', bg: '#0A0A0A', text: '#F9FAFB', light: '#1A0505' },
    css: `
      @keyframes ft-flash{0%,100%{opacity:1}50%{opacity:.7}}
      @keyframes ft-slideLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
      @keyframes ft-slideRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
      @keyframes ft-pulse-btn{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}50%{box-shadow:0 0 0 18px rgba(239,68,68,0)}}
      .ft-wrap{font-family:inherit;background:var(--bg);color:var(--text);}
      .ft-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 52px;background:rgba(10,10,10,.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(239,68,68,.15);position:sticky;top:0;z-index:50;}
      .ft-logo{font-size:1.4rem;font-weight:900;color:#fff;letter-spacing:2px;}
      .ft-logo em{font-style:normal;color:var(--primary);}
      .ft-nav-links{display:flex;gap:28px;list-style:none;}
      .ft-nav-links a{color:rgba(249,250,251,.65);text-decoration:none;font-size:.87rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px;transition:color .2s;}
      .ft-nav-links a:hover{color:var(--primary);}
      .ft-hero{min-height:100vh;display:flex;align-items:center;padding:100px 52px;position:relative;overflow:hidden;}
      .ft-hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,#0A0A0A 40%,rgba(239,68,68,.08) 100%);}
      .ft-hero-bg-img{position:absolute;inset:0;opacity:.2;}
      .ft-hero-content{position:relative;z-index:5;max-width:640px;}
      .ft-hero-tag{font-size:.7rem;font-weight:800;color:var(--primary);text-transform:uppercase;letter-spacing:4px;margin-bottom:18px;animation:ft-slideLeft .6s ease both;}
      .ft-hero h1{font-size:clamp(2.8rem,6vw,5.2rem);font-weight:900;line-height:1.05;text-transform:uppercase;letter-spacing:-1px;margin-bottom:22px;animation:ft-slideLeft .6s .1s ease both;}
      .ft-hero h1 span{color:var(--primary);display:block;}
      .ft-hero-desc{font-size:1.05rem;color:rgba(249,250,251,.55);line-height:1.75;max-width:480px;margin-bottom:36px;animation:ft-slideLeft .6s .2s ease both;}
      .ft-hero-btns{display:flex;gap:14px;animation:ft-slideLeft .6s .3s ease both;}
      .ft-btn{padding:14px 30px;border-radius:10px;font-weight:800;font-size:.9rem;text-transform:uppercase;letter-spacing:.5px;cursor:pointer;border:none;text-decoration:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
      .ft-btn-primary{background:var(--primary);color:#fff;animation:ft-pulse-btn 2s infinite;}
      .ft-btn-primary:hover{transform:translateY(-2px);background:var(--secondary);}
      .ft-btn-ghost{background:transparent;color:#fff;border:2px solid rgba(249,250,251,.25);}
      .ft-btn-ghost:hover{border-color:var(--primary);color:var(--primary);}
      .ft-hero-stats{display:flex;gap:40px;margin-top:48px;animation:ft-slideLeft .6s .4s ease both;}
      .ft-stat{text-align:center;}
      .ft-stat-num{font-size:2.2rem;font-weight:900;color:var(--primary);line-height:1;}
      .ft-stat-label{font-size:.72rem;color:rgba(249,250,251,.4);text-transform:uppercase;letter-spacing:1px;margin-top:4px;}
      .ft-programs{padding:88px 52px;background:var(--bg);}
      .ft-sec-tag{font-size:.7rem;font-weight:800;color:var(--primary);text-transform:uppercase;letter-spacing:4px;margin-bottom:10px;}
      .ft-sec-h{font-size:2.2rem;font-weight:900;text-transform:uppercase;margin-bottom:50px;}
      .ft-programs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
      .ft-prog-card{border-radius:16px;overflow:hidden;position:relative;aspect-ratio:3/4;cursor:pointer;transition:transform .3s;}
      .ft-prog-card:hover{transform:scale(1.02);}
      .ft-prog-card-bg{position:absolute;inset:0;background:var(--light);display:flex;align-items:center;justify-content:center;font-size:4rem;}
      .ft-prog-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,10,.92) 0%,rgba(10,10,10,.3) 50%,transparent 100%);}
      .ft-prog-body{position:absolute;bottom:0;left:0;right:0;padding:24px;}
      .ft-prog-type{font-size:.68rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;}
      .ft-prog-name{font-size:1.2rem;font-weight:800;text-transform:uppercase;margin-bottom:6px;}
      .ft-prog-sub{font-size:.8rem;color:rgba(249,250,251,.6);}
      .ft-pricing{padding:88px 52px;background:var(--light);}
      .ft-pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px;}
      .ft-price-card{background:var(--bg);border-radius:18px;padding:36px 28px;border:1px solid rgba(239,68,68,.12);position:relative;transition:all .3s;}
      .ft-price-card:hover{border-color:var(--primary);transform:translateY(-4px);}
      .ft-price-card.featured{border-color:var(--primary);background:rgba(239,68,68,.06);}
      .ft-price-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;border-radius:20px;padding:4px 16px;font-size:.72rem;font-weight:700;white-space:nowrap;}
      .ft-plan-name{font-size:.85rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(249,250,251,.5);margin-bottom:14px;}
      .ft-plan-price{font-size:2.8rem;font-weight:900;color:#fff;line-height:1;}
      .ft-plan-price span{font-size:.85rem;font-weight:400;color:rgba(249,250,251,.4);}
      .ft-plan-features{list-style:none;margin:20px 0 28px;display:flex;flex-direction:column;gap:10px;}
      .ft-plan-features li{font-size:.85rem;color:rgba(249,250,251,.65);display:flex;align-items:center;gap:8px;}
      .ft-plan-features li::before{content:'✓';color:var(--primary);font-weight:700;}
      .ft-contact{padding:88px 52px;background:var(--bg);text-align:center;}
      .ft-contact-card{max-width:540px;margin:40px auto 0;background:var(--light);border:1px solid rgba(239,68,68,.15);border-radius:20px;padding:44px 36px;}
      .ft-form-group{margin-bottom:16px;text-align:left;}
      .ft-form-group label{display:block;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;color:rgba(249,250,251,.55);}
      .ft-inp{width:100%;padding:13px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(239,68,68,.2);border-radius:10px;color:var(--text);font-size:.88rem;outline:none;transition:border-color .2s;}
      .ft-inp:focus{border-color:var(--primary);}
      .ft-footer{background:var(--light);padding:32px 52px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(239,68,68,.1);}
      .ft-footer-logo{font-size:1.1rem;font-weight:900;color:var(--primary);letter-spacing:2px;}
      .ft-footer-cr{color:rgba(249,250,251,.25);font-size:.78rem;}
      .ft-wa{position:fixed;bottom:28px;right:28px;z-index:999;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 18px rgba(37,211,102,.4);text-decoration:none;transition:transform .2s;}
      .ft-wa:hover{transform:scale(1.1);}
      .ft-wa svg{width:28px;height:28px;}
@container(max-width:900px){
  .ft-programs-grid{grid-template-columns:repeat(2,1fr);}
  .ft-pricing-grid{grid-template-columns:repeat(2,1fr);}
}
@container(max-width:768px){
  .ft-nav{padding:14px 20px;}
  .ft-nav-links{display:none;}
  .ft-hero{padding:80px 20px 60px;}
  .ft-programs{padding:60px 20px;}
  .ft-pricing{padding:60px 20px;}
  .ft-pricing-grid{grid-template-columns:1fr;}
  .ft-contact{padding:60px 20px;}
  .ft-contact-card{padding:36px 24px;}
  .ft-footer{padding:20px;flex-direction:column;gap:8px;text-align:center;}
}
@container(max-width:480px){
  .ft-programs-grid{grid-template-columns:1fr;}
  .ft-hero-btns{flex-direction:column;align-items:stretch;}
  .ft-btn{justify-content:center;}
  .ft-hero-stats{gap:24px;flex-wrap:wrap;justify-content:center;}
  .ft-hero h1{font-size:2.4rem;}
}
    `,
    html: `
      <div class="ft-wrap">
        <nav class="ft-nav">
          <button class="drag-handle">⠿</button>
          <div class="ft-logo editable" data-key="ft-logo" data-tr="POWER<em>FIT</em>" data-en="POWER<em>FIT</em>">POWER<em>FIT</em></div>
          <ul class="ft-nav-links">
            <li><a class="editable" data-key="ft-n1" data-tr="Programlar" data-en="Programs">Programlar</a></li>
            <li><a class="editable" data-key="ft-n2" data-tr="Fiyatlar" data-en="Pricing">Fiyatlar</a></li>
            <li><a class="editable" data-key="ft-n3" data-tr="İletişim" data-en="Contact">İletişim</a></li>
          </ul>
          <div style="display:flex;gap:10px;align-items:center;">
            <span id="lang-label" onclick="window.toggleLang&&window.toggleLang()" style="cursor:pointer;font-size:.8rem;color:var(--primary);font-weight:700;padding:6px 14px;border:1px solid rgba(239,68,68,.3);border-radius:8px;">TR</span>
            <a href="#ft-contact" class="ft-btn ft-btn-primary" style="padding:9px 20px;font-size:.82rem;"><span class="editable" data-key="ft-nav-cta" data-tr="Ücretsiz Dene" data-en="Try Free">Ücretsiz Dene</span></a>
          </div>
        </nav>

        <section class="ft-hero">
          <button class="drag-handle">⠿</button>
          <div class="ft-hero-bg">
            <div class="ft-hero-bg-img img-zone" data-img-key="ft-hero-bg"><div class="img-upload-hint">💪 Arka Plan Görseli</div></div>
          </div>
          <div class="ft-hero-content">
            <p class="ft-hero-tag editable" data-key="ft-htag" data-tr="EN İYİ SPOR SALONU" data-en="THE BEST GYM">EN İYİ SPOR SALONU</p>
            <h1 class="editable" data-key="ft-h1" data-tr="SINIRLARI<span>AŞ</span>" data-en="BREAK<span>LIMITS</span>">SINIRLARI<span>AŞ</span></h1>
            <p class="ft-hero-desc editable" data-key="ft-hdesc" data-tr="Profesyonel eğitmenler, modern ekipmanlar ve motive edici ortam ile hedeflerinize ulaşın." data-en="Reach your goals with professional trainers, modern equipment and a motivating environment.">Profesyonel eğitmenler, modern ekipmanlar ve motive edici ortam ile hedeflerinize ulaşın.</p>
            <div class="ft-hero-btns">
              <a href="#ft-contact" class="ft-btn ft-btn-primary editable" data-key="ft-hbtn1" data-tr="💪 ÜCRETSİZ DENE" data-en="💪 TRY FREE">💪 ÜCRETSİZ DENE</a>
              <a href="#ft-programs" class="ft-btn ft-btn-ghost editable" data-key="ft-hbtn2" data-tr="Programları Gör" data-en="View Programs">Programları Gör</a>
            </div>
            <div class="ft-hero-stats">
              <div class="ft-stat"><div class="ft-stat-num editable" data-key="ft-st1n" data-tr="2000+" data-en="2000+">2000+</div><div class="ft-stat-label editable" data-key="ft-st1l" data-tr="Üye" data-en="Members">Üye</div></div>
              <div class="ft-stat"><div class="ft-stat-num editable" data-key="ft-st2n" data-tr="50+" data-en="50+">50+</div><div class="ft-stat-label editable" data-key="ft-st2l" data-tr="Alet" data-en="Equipment">Alet</div></div>
              <div class="ft-stat"><div class="ft-stat-num editable" data-key="ft-st3n" data-tr="20+" data-en="20+">20+</div><div class="ft-stat-label editable" data-key="ft-st3l" data-tr="Antrenör" data-en="Trainers">Antrenör</div></div>
            </div>
          </div>
        </section>

        <section class="ft-programs" id="ft-programs">
          <button class="drag-handle">⠿</button>
          <p class="ft-sec-tag editable" data-key="ft-p-tag" data-tr="PROGRAMLAR" data-en="PROGRAMS">PROGRAMLAR</p>
          <h2 class="ft-sec-h editable" data-key="ft-p-h" data-tr="Antrenman Seç" data-en="Choose Your Workout">Antrenman Seç</h2>
          <div class="ft-programs-grid" data-cards="ft-prog-card">
            <div class="ft-prog-card">
              <div class="ft-prog-card-bg img-zone" data-img-key="ft-p1"><div class="img-upload-hint">🏋️ Program</div></div>
              <div class="ft-prog-overlay"></div>
              <div class="ft-prog-body">
                <div class="ft-prog-type editable" data-key="ft-p1t" data-tr="GÜÇ" data-en="STRENGTH">GÜÇ</div>
                <div class="ft-prog-name editable" data-key="ft-p1n" data-tr="POWERLIFTING" data-en="POWERLIFTING">POWERLIFTING</div>
                <div class="ft-prog-sub editable" data-key="ft-p1s" data-tr="Maksimum güç ve kas kütlesi" data-en="Maximum strength and muscle mass">Maksimum güç ve kas kütlesi</div>
              </div>
            </div>
            <div class="ft-prog-card">
              <div class="ft-prog-card-bg img-zone" data-img-key="ft-p2"><div class="img-upload-hint">🥊 Program</div></div>
              <div class="ft-prog-overlay"></div>
              <div class="ft-prog-body">
                <div class="ft-prog-type editable" data-key="ft-p2t" data-tr="SAVAŞ" data-en="COMBAT">SAVAŞ</div>
                <div class="ft-prog-name editable" data-key="ft-p2n" data-tr="BOX & MMA" data-en="BOX & MMA">BOX & MMA</div>
                <div class="ft-prog-sub editable" data-key="ft-p2s" data-tr="Savunma sanatları ve kondisyon" data-en="Martial arts and conditioning">Savunma sanatları ve kondisyon</div>
              </div>
            </div>
            <div class="ft-prog-card">
              <div class="ft-prog-card-bg img-zone" data-img-key="ft-p3"><div class="img-upload-hint">🔥 Program</div></div>
              <div class="ft-prog-overlay"></div>
              <div class="ft-prog-body">
                <div class="ft-prog-type editable" data-key="ft-p3t" data-tr="KARDİYO" data-en="CARDIO">KARDİYO</div>
                <div class="ft-prog-name editable" data-key="ft-p3n" data-tr="HIIT & CROSSFIT" data-en="HIIT & CROSSFIT">HIIT & CROSSFIT</div>
                <div class="ft-prog-sub editable" data-key="ft-p3s" data-tr="Yüksek yoğunluklu yağ yakımı" data-en="High-intensity fat burning">Yüksek yoğunluklu yağ yakımı</div>
              </div>
            </div>
          </div>
        </section>

        <section class="ft-pricing">
          <button class="drag-handle">⠿</button>
          <p class="ft-sec-tag editable" data-key="ft-pr-tag" data-tr="ÜYELİK" data-en="MEMBERSHIP">ÜYELİK</p>
          <h2 class="ft-sec-h editable" data-key="ft-pr-h" data-tr="Planını Seç" data-en="Choose Your Plan">Planını Seç</h2>
          <div class="ft-pricing-grid" data-cards="ft-price-card">
            <div class="ft-price-card">
              <div class="ft-plan-name editable" data-key="ft-plan1n" data-tr="BAŞLANGIÇ" data-en="STARTER">BAŞLANGIÇ</div>
              <div class="ft-plan-price editable" data-key="ft-plan1p" data-tr="₺299<span>/ay</span>" data-en="$29<span>/mo</span>">₺299<span>/ay</span></div>
              <ul class="ft-plan-features">
                <li class="editable" data-key="ft-pl1f1" data-tr="Sınırsız Salon Girişi" data-en="Unlimited Gym Access">Sınırsız Salon Girişi</li>
                <li class="editable" data-key="ft-pl1f2" data-tr="Grup Dersleri" data-en="Group Classes">Grup Dersleri</li>
                <li class="editable" data-key="ft-pl1f3" data-tr="Soyunma Odası" data-en="Locker Room">Soyunma Odası</li>
              </ul>
              <a href="#ft-contact" class="ft-btn ft-btn-ghost" style="width:100%;justify-content:center;"><span class="editable" data-key="ft-plan-btn" data-tr="Başla" data-en="Get Started">Başla</span></a>
            </div>
            <div class="ft-price-card featured">
              <div class="ft-price-badge editable" data-key="ft-plan2-badge" data-tr="⭐ En Popüler" data-en="⭐ Most Popular">⭐ En Popüler</div>
              <div class="ft-plan-name editable" data-key="ft-plan2n" data-tr="PRO" data-en="PRO">PRO</div>
              <div class="ft-plan-price editable" data-key="ft-plan2p" data-tr="₺499<span>/ay</span>" data-en="$49<span>/mo</span>">₺499<span>/ay</span></div>
              <ul class="ft-plan-features">
                <li class="editable" data-key="ft-pl2f1" data-tr="Her Şey Dahil" data-en="Everything Included">Her Şey Dahil</li>
                <li class="editable" data-key="ft-pl2f2" data-tr="Kişisel Antrenör (2x/ay)" data-en="Personal Trainer (2x/mo)">Kişisel Antrenör (2x/ay)</li>
                <li class="editable" data-key="ft-pl2f3" data-tr="Beslenme Danışmanlığı" data-en="Nutrition Consulting">Beslenme Danışmanlığı</li>
                <li class="editable" data-key="ft-pl2f4" data-tr="Sauna & Spa" data-en="Sauna & Spa">Sauna & Spa</li>
              </ul>
              <a href="#ft-contact" class="ft-btn ft-btn-primary" style="width:100%;justify-content:center;"><span class="editable" data-key="ft-plan-btn2" data-tr="Başla" data-en="Get Started">Başla</span></a>
            </div>
            <div class="ft-price-card">
              <div class="ft-plan-name editable" data-key="ft-plan3n" data-tr="ELİT" data-en="ELITE">ELİT</div>
              <div class="ft-plan-price editable" data-key="ft-plan3p" data-tr="₺899<span>/ay</span>" data-en="$89<span>/mo</span>">₺899<span>/ay</span></div>
              <ul class="ft-plan-features">
                <li class="editable" data-key="ft-pl3f1" data-tr="Sınırsız Kişisel Antrenör" data-en="Unlimited Personal Trainer">Sınırsız Kişisel Antrenör</li>
                <li class="editable" data-key="ft-pl3f2" data-tr="VIP Lounge Erişimi" data-en="VIP Lounge Access">VIP Lounge Erişimi</li>
                <li class="editable" data-key="ft-pl3f3" data-tr="Özel Program" data-en="Custom Program">Özel Program</li>
                <li class="editable" data-key="ft-pl3f4" data-tr="7/24 Destek" data-en="24/7 Support">7/24 Destek</li>
              </ul>
              <a href="#ft-contact" class="ft-btn ft-btn-ghost" style="width:100%;justify-content:center;"><span class="editable" data-key="ft-plan-btn3" data-tr="Başla" data-en="Get Started">Başla</span></a>
            </div>
          </div>
        </section>

        <section class="ft-contact" id="ft-contact">
          <button class="drag-handle">⠿</button>
          <p class="ft-sec-tag editable" data-key="ft-c-tag" data-tr="İLETİŞİM" data-en="CONTACT">İLETİŞİM</p>
          <h2 class="ft-sec-h editable" data-key="ft-c-h" data-tr="ÜCRETSİZ DENEME BAŞLAT" data-en="START FREE TRIAL">ÜCRETSİZ DENEME BAŞLAT</h2>
          <div class="ft-contact-card">
            <div class="ft-form-group"><label class="editable" data-key="ft-fl1" data-tr="Adınız" data-en="Your Name">Adınız</label><input class="ft-inp" id="ft-form-name" type="text" placeholder="Ad Soyad"></div>
            <div class="ft-form-group"><label class="editable" data-key="ft-fl2" data-tr="Telefon" data-en="Phone">Telefon</label><input class="ft-inp" id="ft-form-tel" type="tel" placeholder="+90 500 000 00 00"></div>
            <div class="ft-form-group"><label class="editable" data-key="ft-fl3" data-tr="Hedef / Program" data-en="Goal / Program">Hedef / Program</label><textarea class="ft-inp" id="ft-form-msg" rows="3" placeholder="Hedefinizi ve ilgilendiğiniz programı yazın..."></textarea></div>
            <button class="ft-btn ft-btn-primary" style="width:100%;justify-content:center;" onclick="genericSendWA('ft')"><span class="editable" data-key="ft-c-btn" data-tr="WhatsApp ile Kayıt Ol" data-en="Register via WhatsApp">WhatsApp ile Kayıt Ol</span></button>
          </div>
        </section>

        <footer class="ft-footer">
          <button class="drag-handle">⠿</button>
          <div class="ft-footer-logo editable" data-key="ft-fl" data-tr="POWERFIT" data-en="POWERFIT">POWERFIT</div>
          <p class="ft-footer-cr editable" data-key="ft-cr" data-tr="© 2025 Tüm hakları saklıdır." data-en="© 2025 All rights reserved.">© 2025 Tüm hakları saklıdır.</p>
        </footer>

        <a href="#" class="ft-wa" id="wa-btn" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
      </div>
    `
  },

  realestate: {
    id: 'realestate',
    name: 'Emlak',
    emoji: '🏠',
    description: 'Arama çubuklu hero ve animasyonlu ilan kartları ile emlak şablonu',
    defaultColors: { primary: '#0F766E', secondary: '#0D9488', bg: '#FFFFFF', text: '#0F172A', light: '#F0FDFA' },
    css: `
      @keyframes re-fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes re-card-in{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      .re-wrap{font-family:inherit;background:var(--bg);color:var(--text);}
      .re-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 52px;background:#fff;border-bottom:1px solid rgba(15,118,110,.1);position:sticky;top:0;z-index:50;box-shadow:0 2px 12px rgba(15,118,110,.06);}
      .re-logo{display:flex;align-items:center;gap:8px;font-size:1.3rem;font-weight:900;color:var(--text);}
      .re-logo em{font-style:normal;color:var(--primary);}
      .re-nav-links{display:flex;gap:26px;list-style:none;}
      .re-nav-links a{color:var(--text);text-decoration:none;font-size:.87rem;font-weight:500;transition:color .2s;}
      .re-nav-links a:hover{color:var(--primary);}
      .re-nav-cta{background:var(--primary);color:#fff;border:none;border-radius:10px;padding:10px 22px;font-weight:700;font-size:.86rem;cursor:pointer;transition:all .2s;}
      .re-nav-cta:hover{background:var(--secondary);}
      .re-hero{min-height:88vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px 52px 60px;position:relative;background:linear-gradient(160deg,#F0FDFA 0%,#CCFBF1 50%,#F0FDFA 100%);}
      .re-hero-tag{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(15,118,110,.15);border-radius:50px;padding:7px 18px;font-size:.75rem;font-weight:700;color:var(--primary);margin-bottom:22px;animation:re-fadeUp .6s ease both;}
      .re-hero h1{font-size:clamp(2.2rem,5vw,4rem);font-weight:900;line-height:1.15;margin-bottom:18px;animation:re-fadeUp .6s .1s ease both;}
      .re-hero h1 span{color:var(--primary);}
      .re-hero-sub{color:rgba(15,23,42,.55);max-width:520px;line-height:1.75;margin-bottom:40px;animation:re-fadeUp .6s .2s ease both;}
      .re-search-bar{display:flex;gap:0;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(15,118,110,.15);max-width:700px;width:100%;animation:re-fadeUp .6s .3s ease both;border:1px solid rgba(15,118,110,.1);}
      .re-search-field{flex:1;padding:0 20px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(15,118,110,.1);}
      .re-search-field label{font-size:.65rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:1px;}
      .re-search-field select,.re-search-field input{border:none;background:transparent;font-size:.9rem;color:var(--text);padding:6px 0;outline:none;font-weight:600;width:100%;}
      .re-search-btn{background:var(--primary);color:#fff;border:none;padding:0 28px;font-weight:700;font-size:.88rem;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background .2s;}
      .re-search-btn:hover{background:var(--secondary);}
      .re-stats{display:flex;gap:48px;justify-content:center;margin-top:44px;animation:re-fadeUp .6s .4s ease both;}
      .re-hero-stat{text-align:center;}
      .re-hero-stat-num{font-size:1.8rem;font-weight:900;color:var(--primary);}
      .re-hero-stat-label{font-size:.75rem;color:rgba(15,23,42,.45);margin-top:2px;}
      .re-listings{padding:88px 52px;background:var(--bg);}
      .re-sec-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:44px;}
      .re-sec-tag{font-size:.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:3px;margin-bottom:8px;}
      .re-sec-h{font-size:2.1rem;font-weight:900;}
      .re-listings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
      .re-listing-card{background:var(--light);border-radius:18px;overflow:hidden;border:1px solid rgba(15,118,110,.08);transition:all .3s;animation:re-card-in .5s ease both;}
      .re-listing-card:nth-child(2){animation-delay:.1s;}
      .re-listing-card:nth-child(3){animation-delay:.2s;}
      .re-listing-card:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(15,118,110,.12);}
      .re-listing-img{width:100%;aspect-ratio:4/3;object-fit:cover;background:rgba(15,118,110,.08);display:flex;align-items:center;justify-content:center;font-size:2.5rem;position:relative;}
      .re-listing-badge{position:absolute;top:14px;left:14px;background:var(--primary);color:#fff;border-radius:8px;padding:4px 12px;font-size:.72rem;font-weight:700;}
      .re-listing-body{padding:20px;}
      .re-listing-price{font-size:1.3rem;font-weight:900;color:var(--primary);margin-bottom:6px;}
      .re-listing-title{font-size:.98rem;font-weight:700;margin-bottom:8px;}
      .re-listing-meta{display:flex;gap:16px;font-size:.78rem;color:rgba(15,23,42,.45);}
      .re-listing-meta span{display:flex;align-items:center;gap:4px;}
      .re-listing-btn{width:100%;margin-top:14px;background:var(--primary);color:#fff;border:none;border-radius:10px;padding:10px;font-weight:700;font-size:.84rem;cursor:pointer;transition:background .2s;}
      .re-listing-btn:hover{background:var(--secondary);}
      .re-why{padding:80px 52px;background:var(--light);display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
      .re-why-img{border-radius:20px;aspect-ratio:4/3;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:3rem;box-shadow:0 12px 40px rgba(15,118,110,.1);}
      .re-why-features{display:flex;flex-direction:column;gap:20px;margin-top:28px;}
      .re-why-item{display:flex;gap:16px;align-items:flex-start;}
      .re-why-icon{width:44px;height:44px;background:rgba(15,118,110,.1);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
      .re-why-text strong{display:block;font-size:.95rem;font-weight:700;margin-bottom:4px;}
      .re-why-text span{font-size:.82rem;color:rgba(15,23,42,.5);line-height:1.6;}
      .re-contact{padding:88px 52px;text-align:center;background:var(--bg);}
      .re-contact-card{max-width:560px;margin:40px auto 0;background:var(--light);border-radius:22px;padding:48px 40px;border:1px solid rgba(15,118,110,.1);}
      .re-form-group{margin-bottom:16px;text-align:left;}
      .re-form-group label{display:block;font-size:.8rem;font-weight:600;margin-bottom:7px;color:rgba(15,23,42,.55);}
      .re-inp{width:100%;padding:13px 16px;background:#fff;border:1.5px solid rgba(15,118,110,.2);border-radius:10px;color:var(--text);font-size:.88rem;outline:none;transition:border-color .2s;}
      .re-inp:focus{border-color:var(--primary);}
      .re-btn-primary{background:var(--primary);color:#fff;border:none;border-radius:11px;padding:13px 28px;font-weight:700;font-size:.9rem;cursor:pointer;transition:all .2s;width:100%;}
      .re-btn-primary:hover{background:var(--secondary);}
      .re-footer{background:var(--text);color:rgba(255,255,255,.6);padding:36px 52px;display:flex;align-items:center;justify-content:space-between;}
      .re-footer-brand{font-size:1.1rem;font-weight:900;color:#fff;}
      .re-footer-cr{font-size:.78rem;}
      .re-wa{position:fixed;bottom:28px;right:28px;z-index:999;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 18px rgba(37,211,102,.4);text-decoration:none;transition:transform .2s;}
      .re-wa:hover{transform:scale(1.1);}
      .re-wa svg{width:28px;height:28px;}
@container(max-width:900px){
  .re-listings-grid{grid-template-columns:repeat(2,1fr);}
}
@container(max-width:768px){
  .re-nav{padding:14px 20px;}
  .re-nav-links,.re-nav-cta{display:none;}
  .re-hero{padding:60px 20px 40px;}
  .re-search-bar{flex-direction:column;border-radius:12px;}
  .re-search-field{padding:10px 16px;border-right:none;border-bottom:1px solid rgba(15,118,110,.1);}
  .re-search-btn{padding:14px 20px;width:100%;justify-content:center;}
  .re-stats{gap:20px;flex-wrap:wrap;justify-content:center;}
  .re-listings{padding:60px 20px;}
  .re-listings-grid{grid-template-columns:1fr;}
  .re-why{grid-template-columns:1fr;padding:60px 20px;gap:36px;}
  .re-contact{padding:60px 20px;}
  .re-contact-card{padding:36px 24px;}
  .re-footer{padding:20px;flex-direction:column;gap:8px;text-align:center;}
}
@container(max-width:480px){
  .re-sec-header{flex-direction:column;align-items:flex-start;gap:12px;}
  .re-hero h1{font-size:2rem;}
}
    `,
    html: `
      <div class="re-wrap">
        <nav class="re-nav">
          <button class="drag-handle">⠿</button>
          <div class="re-logo">🏠 <span class="editable" data-key="re-logo" data-tr="<em>Prime</em>Emlak" data-en="<em>Prime</em>Realty"><em>Prime</em>Emlak</span></div>
          <ul class="re-nav-links">
            <li><a class="editable" data-key="re-n1" data-tr="İlanlar" data-en="Listings">İlanlar</a></li>
            <li><a class="editable" data-key="re-n2" data-tr="Satılık" data-en="For Sale">Satılık</a></li>
            <li><a class="editable" data-key="re-n3" data-tr="Kiralık" data-en="For Rent">Kiralık</a></li>
            <li><a class="editable" data-key="re-n4" data-tr="Hakkımızda" data-en="About">Hakkımızda</a></li>
          </ul>
          <div style="display:flex;gap:10px;align-items:center;">
            <span id="lang-label" onclick="window.toggleLang&&window.toggleLang()" style="cursor:pointer;font-size:.8rem;color:var(--primary);font-weight:700;padding:6px 14px;border:1px solid rgba(15,118,110,.3);border-radius:8px;">TR</span>
            <button class="re-nav-cta"><span class="editable" data-key="re-nav-cta" data-tr="İlan Ver" data-en="List Property">İlan Ver</span></button>
          </div>
        </nav>

        <section class="re-hero">
          <button class="drag-handle">⠿</button>
          <div class="re-hero-tag"><span>🏠</span><span class="editable" data-key="re-htag" data-tr="Türkiye'nin Güvenilir Emlak Platformu" data-en="Trusted Real Estate Platform">Türkiye'nin Güvenilir Emlak Platformu</span></div>
          <h1 class="editable" data-key="re-h1" data-tr="Hayalinizdeki Evi &lt;span&gt;Buluyoruz&lt;/span&gt;" data-en="We Find Your &lt;span&gt;Dream Home&lt;/span&gt;">Hayalinizdeki Evi <span>Buluyoruz</span></h1>
          <p class="re-hero-sub editable" data-key="re-hsub" data-tr="Binlerce konut ve ticari ilan arasından size en uygun mülkü bulun." data-en="Find the most suitable property for you among thousands of residential and commercial listings.">Binlerce konut ve ticari ilan arasından size en uygun mülkü bulun.</p>
          <div class="re-search-bar">
            <div class="re-search-field"><label class="editable" data-key="re-sf1" data-tr="KONUM" data-en="LOCATION">KONUM</label><input type="text" placeholder="Şehir, ilçe veya mahalle..."></div>
            <div class="re-search-field"><label class="editable" data-key="re-sf2" data-tr="TİP" data-en="TYPE">TİP</label><select><option>Satılık</option><option>Kiralık</option></select></div>
            <button class="re-search-btn">🔍 <span class="editable" data-key="re-search-btn" data-tr="Ara" data-en="Search">Ara</span></button>
          </div>
          <div class="re-stats">
            <div class="re-hero-stat"><div class="re-hero-stat-num editable" data-key="re-st1n" data-tr="5.000+" data-en="5,000+">5.000+</div><div class="re-hero-stat-label editable" data-key="re-st1l" data-tr="Aktif İlan" data-en="Active Listings">Aktif İlan</div></div>
            <div class="re-hero-stat"><div class="re-hero-stat-num editable" data-key="re-st2n" data-tr="2.500+" data-en="2,500+">2.500+</div><div class="re-hero-stat-label editable" data-key="re-st2l" data-tr="Satılan Mülk" data-en="Sold Properties">Satılan Mülk</div></div>
            <div class="re-hero-stat"><div class="re-hero-stat-num editable" data-key="re-st3n" data-tr="15+" data-en="15+">15+</div><div class="re-hero-stat-label editable" data-key="re-st3l" data-tr="Yıllık Deneyim" data-en="Years Experience">Yıllık Deneyim</div></div>
          </div>
        </section>

        <section class="re-listings" id="re-listings">
          <button class="drag-handle">⠿</button>
          <div class="re-sec-header">
            <div><p class="re-sec-tag editable" data-key="re-l-tag" data-tr="ÖNE ÇIKAN İLANLAR" data-en="FEATURED LISTINGS">ÖNE ÇIKAN İLANLAR</p><h2 class="re-sec-h editable" data-key="re-l-h" data-tr="Güncel İlanlar" data-en="Latest Listings">Güncel İlanlar</h2></div>
            <a href="#" class="re-btn-primary" style="width:auto;font-size:.83rem;padding:9px 18px;"><span class="editable" data-key="re-l-all" data-tr="Tümünü Gör →" data-en="View All →">Tümünü Gör →</span></a>
          </div>
          <div class="re-listings-grid" data-cards="re-listing-card">
            <div class="re-listing-card">
              <div class="re-listing-img img-zone" data-img-key="re-l1"><div class="img-upload-hint">🏠 Mülk Görseli</div><div class="re-listing-badge editable" data-key="re-l1-badge" data-tr="Satılık" data-en="For Sale">Satılık</div></div>
              <div class="re-listing-body">
                <div class="re-listing-price editable" data-key="re-l1p" data-tr="₺3.500.000" data-en="$350,000">₺3.500.000</div>
                <div class="re-listing-title editable" data-key="re-l1t" data-tr="Modern Daire, Beşiktaş" data-en="Modern Apartment, City Center">Modern Daire, Beşiktaş</div>
                <div class="re-listing-meta">
                  <span>🛏 <span class="editable" data-key="re-l1r" data-tr="3+1" data-en="3 bed">3+1</span></span>
                  <span>🚿 <span class="editable" data-key="re-l1b" data-tr="2 Banyo" data-en="2 bath">2 Banyo</span></span>
                  <span>📐 <span class="editable" data-key="re-l1s" data-tr="120 m²" data-en="120 m²">120 m²</span></span>
                </div>
                <button class="re-listing-btn"><span class="editable" data-key="re-lb" data-tr="Detayları Gör" data-en="View Details">Detayları Gör</span></button>
              </div>
            </div>
            <div class="re-listing-card">
              <div class="re-listing-img img-zone" data-img-key="re-l2"><div class="img-upload-hint">🏡 Mülk Görseli</div><div class="re-listing-badge editable" data-key="re-l2-badge" data-tr="Kiralık" data-en="For Rent">Kiralık</div></div>
              <div class="re-listing-body">
                <div class="re-listing-price editable" data-key="re-l2p" data-tr="₺25.000/ay" data-en="$2,500/mo">₺25.000/ay</div>
                <div class="re-listing-title editable" data-key="re-l2t" data-tr="Lüks Villa, Bodrum" data-en="Luxury Villa, Seaside">Lüks Villa, Bodrum</div>
                <div class="re-listing-meta">
                  <span>🛏 <span class="editable" data-key="re-l2r" data-tr="5+2" data-en="5 bed">5+2</span></span>
                  <span>🚿 <span class="editable" data-key="re-l2b" data-tr="3 Banyo" data-en="3 bath">3 Banyo</span></span>
                  <span>📐 <span class="editable" data-key="re-l2s" data-tr="280 m²" data-en="280 m²">280 m²</span></span>
                </div>
                <button class="re-listing-btn"><span class="editable" data-key="re-lb2" data-tr="Detayları Gör" data-en="View Details">Detayları Gör</span></button>
              </div>
            </div>
            <div class="re-listing-card">
              <div class="re-listing-img img-zone" data-img-key="re-l3"><div class="img-upload-hint">🏢 Mülk Görseli</div><div class="re-listing-badge editable" data-key="re-l3-badge" data-tr="Satılık" data-en="For Sale">Satılık</div></div>
              <div class="re-listing-body">
                <div class="re-listing-price editable" data-key="re-l3p" data-tr="₺8.200.000" data-en="$820,000">₺8.200.000</div>
                <div class="re-listing-title editable" data-key="re-l3t" data-tr="Penthouse, İstanbul" data-en="Penthouse, City View">Penthouse, İstanbul</div>
                <div class="re-listing-meta">
                  <span>🛏 <span class="editable" data-key="re-l3r" data-tr="4+1" data-en="4 bed">4+1</span></span>
                  <span>🚿 <span class="editable" data-key="re-l3b" data-tr="3 Banyo" data-en="3 bath">3 Banyo</span></span>
                  <span>📐 <span class="editable" data-key="re-l3s" data-tr="220 m²" data-en="220 m²">220 m²</span></span>
                </div>
                <button class="re-listing-btn"><span class="editable" data-key="re-lb3" data-tr="Detayları Gör" data-en="View Details">Detayları Gör</span></button>
              </div>
            </div>
          </div>
        </section>

        <section class="re-why">
          <button class="drag-handle">⠿</button>
          <div class="re-why-img img-zone" data-img-key="re-why-img"><div class="img-upload-hint">🏠 Ofis Görseli</div></div>
          <div>
            <p class="re-sec-tag editable" data-key="re-w-tag" data-tr="NEDEN BİZ?" data-en="WHY US?">NEDEN BİZ?</p>
            <h2 class="re-sec-h editable" data-key="re-w-h" data-tr="Emlak Uzmanınız" data-en="Your Real Estate Expert">Emlak Uzmanınız</h2>
            <div class="re-why-features">
              <div class="re-why-item"><div class="re-why-icon">🔑</div><div class="re-why-text"><strong class="editable" data-key="re-wi1t" data-tr="Güvenilir Aracılık" data-en="Trusted Mediation">Güvenilir Aracılık</strong><span class="editable" data-key="re-wi1d" data-tr="15 yıllık deneyim ile şeffaf ve güvenli işlemler" data-en="Transparent and secure transactions with 15 years of experience">15 yıllık deneyim ile şeffaf ve güvenli işlemler</span></div></div>
              <div class="re-why-item"><div class="re-why-icon">📊</div><div class="re-why-text"><strong class="editable" data-key="re-wi2t" data-tr="Piyasa Analizi" data-en="Market Analysis">Piyasa Analizi</strong><span class="editable" data-key="re-wi2d" data-tr="Güncel piyasa verileri ile doğru fiyatlandırma" data-en="Accurate pricing with up-to-date market data">Güncel piyasa verileri ile doğru fiyatlandırma</span></div></div>
              <div class="re-why-item"><div class="re-why-icon">🤝</div><div class="re-why-text"><strong class="editable" data-key="re-wi3t" data-tr="7/24 Destek" data-en="24/7 Support">7/24 Destek</strong><span class="editable" data-key="re-wi3d" data-tr="Satın alma sürecinin her adımında yanınızdayız" data-en="We are with you every step of the buying process">Satın alma sürecinin her adımında yanınızdayız</span></div></div>
            </div>
          </div>
        </section>

        <section class="re-contact" id="re-contact">
          <button class="drag-handle">⠿</button>
          <p class="re-sec-tag editable" data-key="re-c-tag" data-tr="İLETİŞİM" data-en="CONTACT">İLETİŞİM</p>
          <h2 class="re-sec-h editable" data-key="re-c-h" data-tr="Ücretsiz Danışmanlık" data-en="Free Consultation">Ücretsiz Danışmanlık</h2>
          <div class="re-contact-card">
            <div class="re-form-group"><label class="editable" data-key="re-fl1" data-tr="Ad Soyad" data-en="Full Name">Ad Soyad</label><input class="re-inp" id="re-form-name" type="text" placeholder="Ad Soyad"></div>
            <div class="re-form-group"><label class="editable" data-key="re-fl2" data-tr="Telefon" data-en="Phone">Telefon</label><input class="re-inp" id="re-form-tel" type="tel" placeholder="+90 500 000 00 00"></div>
            <div class="re-form-group"><label class="editable" data-key="re-fl3" data-tr="Aradığınız Mülk" data-en="Property You're Looking For">Aradığınız Mülk</label><textarea class="re-inp" id="re-form-msg" rows="3" placeholder="Bütçe, lokasyon ve özelliklerinizi belirtin..."></textarea></div>
            <button class="re-btn-primary" onclick="genericSendWA('re')"><span class="editable" data-key="re-c-btn" data-tr="WhatsApp ile Ulaşın" data-en="Contact via WhatsApp">WhatsApp ile Ulaşın</span></button>
          </div>
        </section>

        <footer class="re-footer">
          <button class="drag-handle">⠿</button>
          <div class="re-footer-brand editable" data-key="re-fb" data-tr="PrimeEmlak" data-en="PrimeRealty">PrimeEmlak</div>
          <p class="re-footer-cr editable" data-key="re-cr" data-tr="© 2025 Tüm hakları saklıdır." data-en="© 2025 All rights reserved.">© 2025 Tüm hakları saklıdır.</p>
        </footer>

        <a href="#" class="re-wa" id="wa-btn" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
      </div>
    `
  },

  salon: {
    id: 'salon',
    name: 'Güzellik & Salon',
    emoji: '💅',
    description: 'Zarif animasyonlar ile modern güzellik salonu şablonu',
    defaultColors: { primary: '#EC4899', secondary: '#DB2777', bg: '#FFFFFF', text: '#1F0A12', light: '#FDF2F8' },
    css: `
      @keyframes sl-fadeIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
      @keyframes sl-float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-12px) rotate(2deg)}}
      @keyframes sl-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .sl-wrap{font-family:inherit;background:var(--bg);color:var(--text);}
      .sl-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 52px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(236,72,153,.1);position:sticky;top:0;z-index:50;box-shadow:0 2px 20px rgba(236,72,153,.06);}
      .sl-logo{font-size:1.3rem;font-weight:900;color:var(--text);font-style:italic;}
      .sl-logo em{font-style:normal;color:var(--primary);}
      .sl-nav-links{display:flex;gap:26px;list-style:none;}
      .sl-nav-links a{color:var(--text);text-decoration:none;font-size:.87rem;font-weight:500;transition:color .2s;}
      .sl-nav-links a:hover{color:var(--primary);}
      .sl-book-btn{background:var(--primary);color:#fff;border:none;border-radius:50px;padding:10px 24px;font-weight:700;font-size:.86rem;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(236,72,153,.3);}
      .sl-book-btn:hover{background:var(--secondary);transform:translateY(-1px);}
      .sl-hero{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;padding:80px 52px;background:linear-gradient(135deg,#FDF2F8 0%,#FCE7F3 50%,#FDF2F8 100%);}
      .sl-hero-tag{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(236,72,153,.15);border-radius:50px;padding:7px 18px;font-size:.75rem;font-weight:700;color:var(--primary);margin-bottom:22px;animation:sl-fadeIn .6s ease both;}
      .sl-hero h1{font-size:clamp(2.2rem,4.5vw,3.8rem);font-weight:900;line-height:1.15;margin-bottom:20px;font-style:italic;animation:sl-fadeIn .6s .1s ease both;}
      .sl-hero h1 span{color:var(--primary);font-style:normal;}
      .sl-hero-desc{color:rgba(31,10,18,.55);line-height:1.8;margin-bottom:32px;animation:sl-fadeIn .6s .2s ease both;}
      .sl-hero-btns{display:flex;gap:14px;flex-wrap:wrap;animation:sl-fadeIn .6s .3s ease both;}
      .sl-btn{padding:13px 28px;border-radius:50px;font-weight:700;font-size:.9rem;cursor:pointer;border:none;text-decoration:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
      .sl-btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 16px rgba(236,72,153,.35);}
      .sl-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(236,72,153,.5);}
      .sl-btn-outline{background:transparent;color:var(--primary);border:2px solid rgba(236,72,153,.35);}
      .sl-btn-outline:hover{background:var(--primary);color:#fff;}
      .sl-hero-img-wrap{position:relative;}
      .sl-hero-img{border-radius:30px;aspect-ratio:3/4;background:rgba(236,72,153,.06);display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 20px 60px rgba(236,72,153,.15);}
      .sl-float-badge{position:absolute;animation:sl-float 4s ease-in-out infinite;background:#fff;border-radius:16px;padding:12px 18px;box-shadow:0 8px 24px rgba(236,72,153,.15);}
      .sl-float-badge-1{top:-18px;right:-18px;}
      .sl-float-badge-2{bottom:-18px;left:-18px;animation-delay:2s;}
      .sl-float-badge-icon{font-size:1.4rem;display:block;margin-bottom:2px;}
      .sl-float-badge-text{font-size:.75rem;font-weight:700;color:var(--primary);}
      .sl-services{padding:88px 52px;background:var(--bg);}
      .sl-sec-tag{font-size:.72rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:3px;margin-bottom:10px;text-align:center;}
      .sl-sec-h{font-size:2.2rem;font-weight:900;text-align:center;margin-bottom:12px;font-style:italic;}
      .sl-sec-sub{color:rgba(31,10,18,.4);text-align:center;font-size:.9rem;margin-bottom:52px;}
      .sl-services-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}
      .sl-service-card{display:flex;gap:20px;align-items:flex-start;background:var(--light);border-radius:18px;padding:26px;border:1px solid rgba(236,72,153,.08);transition:all .3s;animation:sl-fadeIn .5s ease both;}
      .sl-service-card:nth-child(2){animation-delay:.1s;}
      .sl-service-card:nth-child(3){animation-delay:.2s;}
      .sl-service-card:nth-child(4){animation-delay:.3s;}
      .sl-service-card:hover{box-shadow:0 10px 32px rgba(236,72,153,.1);border-color:rgba(236,72,153,.2);transform:translateY(-2px);}
      .sl-service-icon-wrap{width:56px;height:56px;background:rgba(236,72,153,.1);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0;}
      .sl-service-title{font-size:1.02rem;font-weight:700;margin-bottom:6px;}
      .sl-service-desc{font-size:.82rem;color:rgba(31,10,18,.5);line-height:1.65;margin-bottom:10px;}
      .sl-service-price{font-size:.95rem;font-weight:800;color:var(--primary);}
      .sl-gallery{padding:80px 52px;background:var(--light);}
      .sl-gallery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:44px;}
      .sl-gallery-item{border-radius:16px;overflow:hidden;aspect-ratio:3/4;cursor:pointer;transition:transform .3s;}
      .sl-gallery-item:hover{transform:scale(1.03);}
      .sl-gallery-item:first-child{grid-row:span 2;aspect-ratio:unset;}
      .sl-team{padding:88px 52px;background:var(--bg);}
      .sl-team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:44px;}
      .sl-team-card{text-align:center;animation:sl-fadeIn .5s ease both;}
      .sl-team-card:nth-child(2){animation-delay:.15s;}
      .sl-team-card:nth-child(3){animation-delay:.3s;}
      .sl-team-img{width:100%;aspect-ratio:1;border-radius:50%;background:var(--light);display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin-bottom:16px;overflow:hidden;border:4px solid rgba(236,72,153,.1);}
      .sl-team-name{font-size:1.05rem;font-weight:700;margin-bottom:4px;}
      .sl-team-role{font-size:.82rem;color:var(--primary);font-weight:600;}
      .sl-contact{padding:88px 52px;text-align:center;background:var(--light);}
      .sl-contact-card{max-width:560px;margin:40px auto 0;background:#fff;border-radius:24px;padding:48px 40px;box-shadow:0 8px 40px rgba(236,72,153,.1);border:1px solid rgba(236,72,153,.08);}
      .sl-form-group{margin-bottom:16px;text-align:left;}
      .sl-form-group label{display:block;font-size:.8rem;font-weight:600;margin-bottom:7px;color:rgba(31,10,18,.55);}
      .sl-inp{width:100%;padding:13px 16px;background:var(--light);border:1.5px solid rgba(236,72,153,.15);border-radius:12px;color:var(--text);font-size:.88rem;outline:none;transition:border-color .2s;}
      .sl-inp:focus{border-color:var(--primary);}
      .sl-footer{background:var(--text);color:rgba(255,255,255,.6);padding:36px 52px;display:flex;align-items:center;justify-content:space-between;}
      .sl-footer-brand{font-size:1.1rem;font-weight:900;color:#fff;font-style:italic;}
      .sl-footer-cr{font-size:.78rem;}
      .sl-wa{position:fixed;bottom:28px;right:28px;z-index:999;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 18px rgba(37,211,102,.4);text-decoration:none;transition:transform .2s;}
      .sl-wa:hover{transform:scale(1.1);}
      .sl-wa svg{width:28px;height:28px;}
@container(max-width:900px){
  .sl-gallery-grid{grid-template-columns:repeat(3,1fr);}
  .sl-gallery-item:first-child{grid-row:span 1;aspect-ratio:3/4;}
}
@container(max-width:768px){
  .sl-nav{padding:14px 20px;}
  .sl-nav-links,.sl-book-btn{display:none;}
  .sl-hero{grid-template-columns:1fr;padding:60px 20px;gap:36px;}
  .sl-services{padding:60px 20px;}
  .sl-services-grid{grid-template-columns:1fr;}
  .sl-gallery{padding:60px 20px;}
  .sl-gallery-grid{grid-template-columns:repeat(2,1fr);}
  .sl-team{padding:60px 20px;}
  .sl-team-grid{grid-template-columns:repeat(2,1fr);}
  .sl-contact{padding:60px 20px;}
  .sl-contact-card{padding:36px 24px;}
  .sl-footer{padding:20px;flex-direction:column;gap:8px;text-align:center;}
}
@container(max-width:480px){
  .sl-team-grid{grid-template-columns:1fr;}
  .sl-gallery-grid{grid-template-columns:1fr;}
  .sl-hero-btns{flex-direction:column;align-items:stretch;}
  .sl-btn{justify-content:center;}
}
    `,
    html: `
      <div class="sl-wrap">
        <nav class="sl-nav">
          <button class="drag-handle">⠿</button>
          <div class="sl-logo"><em>✦</em> <span class="editable" data-key="sl-logo" data-tr="Belle Salon" data-en="Belle Salon">Belle Salon</span></div>
          <ul class="sl-nav-links">
            <li><a class="editable" data-key="sl-n1" data-tr="Hizmetler" data-en="Services">Hizmetler</a></li>
            <li><a class="editable" data-key="sl-n2" data-tr="Galeri" data-en="Gallery">Galeri</a></li>
            <li><a class="editable" data-key="sl-n3" data-tr="Ekibimiz" data-en="Our Team">Ekibimiz</a></li>
            <li><a class="editable" data-key="sl-n4" data-tr="İletişim" data-en="Contact">İletişim</a></li>
          </ul>
          <div style="display:flex;gap:10px;align-items:center;">
            <span id="lang-label" onclick="window.toggleLang&&window.toggleLang()" style="cursor:pointer;font-size:.8rem;color:var(--primary);font-weight:700;padding:6px 14px;border:1px solid rgba(236,72,153,.3);border-radius:50px;">TR</span>
            <button class="sl-book-btn"><span class="editable" data-key="sl-nav-btn" data-tr="💅 Randevu Al" data-en="💅 Book Now">💅 Randevu Al</span></button>
          </div>
        </nav>

        <section class="sl-hero">
          <button class="drag-handle">⠿</button>
          <div>
            <div class="sl-hero-tag"><span>✦</span><span class="editable" data-key="sl-htag" data-tr="Premium Güzellik Deneyimi" data-en="Premium Beauty Experience">Premium Güzellik Deneyimi</span></div>
            <h1 class="editable" data-key="sl-h1" data-tr="Güzelliğinizi &lt;span&gt;Keşfedin&lt;/span&gt;" data-en="Discover Your &lt;span&gt;Beauty&lt;/span&gt;">Güzelliğinizi <span>Keşfedin</span></h1>
            <p class="sl-hero-desc editable" data-key="sl-hdesc" data-tr="Uzman ekibimiz ve modern tekniklerimizle en iyi bakım hizmetlerini sunuyoruz. Her ziyarette kendinizi özel hissedin." data-en="We offer the best care services with our expert team and modern techniques. Feel special on every visit.">Uzman ekibimiz ve modern tekniklerimizle en iyi bakım hizmetlerini sunuyoruz. Her ziyarette kendinizi özel hissedin.</p>
            <div class="sl-hero-btns">
              <a href="#sl-contact" class="sl-btn sl-btn-primary editable" data-key="sl-hbtn1" data-tr="💅 Randevu Al" data-en="💅 Book Appointment">💅 Randevu Al</a>
              <a href="#sl-services" class="sl-btn sl-btn-outline editable" data-key="sl-hbtn2" data-tr="Hizmetleri Gör" data-en="View Services">Hizmetleri Gör</a>
            </div>
          </div>
          <div class="sl-hero-img-wrap">
            <div class="sl-hero-img img-zone" data-img-key="sl-hero-img"><div class="img-upload-hint">💅 Salon Görseli</div></div>
            <div class="sl-float-badge sl-float-badge-1">
              <span class="sl-float-badge-icon">⭐</span>
              <span class="sl-float-badge-text editable" data-key="sl-fb1" data-tr="5 Yıldız Hizmet" data-en="5-Star Service">5 Yıldız Hizmet</span>
            </div>
            <div class="sl-float-badge sl-float-badge-2">
              <span class="sl-float-badge-icon">✨</span>
              <span class="sl-float-badge-text editable" data-key="sl-fb2" data-tr="500+ Mutlu Müşteri" data-en="500+ Happy Clients">500+ Mutlu Müşteri</span>
            </div>
          </div>
        </section>

        <section class="sl-services" id="sl-services">
          <button class="drag-handle">⠿</button>
          <p class="sl-sec-tag editable" data-key="sl-s-tag" data-tr="HİZMETLERİMİZ" data-en="OUR SERVICES">HİZMETLERİMİZ</p>
          <h2 class="sl-sec-h editable" data-key="sl-s-h" data-tr="Neler Yapıyoruz?" data-en="What We Do?">Neler Yapıyoruz?</h2>
          <p class="sl-sec-sub editable" data-key="sl-s-sub" data-tr="Güzellik ve bakım için tek adres" data-en="One stop for beauty and care">Güzellik ve bakım için tek adres</p>
          <div class="sl-services-grid">
            <div class="sl-service-card"><div class="sl-service-icon-wrap">💇</div><div><div class="sl-service-title editable" data-key="sl-sv1t" data-tr="Saç Kesim & Şekillendirme" data-en="Haircut & Styling">Saç Kesim & Şekillendirme</div><div class="sl-service-desc editable" data-key="sl-sv1d" data-tr="Yüz tipine uygun profesyonel kesim ve şekillendirme" data-en="Professional cut and styling suited to your face type">Yüz tipine uygun profesyonel kesim ve şekillendirme</div><div class="sl-service-price editable" data-key="sl-sv1p" data-tr="₺150'den başlayan" data-en="From $15">₺150'den başlayan</div></div></div>
            <div class="sl-service-card"><div class="sl-service-icon-wrap">💄</div><div><div class="sl-service-title editable" data-key="sl-sv2t" data-tr="Makyaj & Boya" data-en="Makeup & Color">Makyaj & Boya</div><div class="sl-service-desc editable" data-key="sl-sv2d" data-tr="Günlük ve özel gün makyajı, kalıcı renklendirme" data-en="Everyday and special occasion makeup, permanent coloring">Günlük ve özel gün makyajı, kalıcı renklendirme</div><div class="sl-service-price editable" data-key="sl-sv2p" data-tr="₺200'den başlayan" data-en="From $20">₺200'den başlayan</div></div></div>
            <div class="sl-service-card"><div class="sl-service-icon-wrap">💅</div><div><div class="sl-service-title editable" data-key="sl-sv3t" data-tr="Manikür & Pedikür" data-en="Manicure & Pedicure">Manikür & Pedikür</div><div class="sl-service-desc editable" data-key="sl-sv3d" data-tr="Kalıcı oje, tırnak tasarımı ve el-ayak bakımı" data-en="Gel nails, nail art, hand and foot care">Kalıcı oje, tırnak tasarımı ve el-ayak bakımı</div><div class="sl-service-price editable" data-key="sl-sv3p" data-tr="₺120'den başlayan" data-en="From $12">₺120'den başlayan</div></div></div>
            <div class="sl-service-card"><div class="sl-service-icon-wrap">✨</div><div><div class="sl-service-title editable" data-key="sl-sv4t" data-tr="Cilt Bakımı & Spa" data-en="Skin Care & Spa">Cilt Bakımı & Spa</div><div class="sl-service-desc editable" data-key="sl-sv4d" data-tr="Yüz maskesi, peeling ve dinlendirici spa uygulamaları" data-en="Face mask, peeling and relaxing spa treatments">Yüz maskesi, peeling ve dinlendirici spa uygulamaları</div><div class="sl-service-price editable" data-key="sl-sv4p" data-tr="₺250'den başlayan" data-en="From $25">₺250'den başlayan</div></div></div>
          </div>
        </section>

        <section class="sl-gallery" id="sl-gallery">
          <button class="drag-handle">⠿</button>
          <p class="sl-sec-tag editable" data-key="sl-g-tag" data-tr="GALERİ" data-en="GALLERY">GALERİ</p>
          <h2 class="sl-sec-h editable" data-key="sl-g-h" data-tr="Çalışmalarımız" data-en="Our Work">Çalışmalarımız</h2>
          <div class="sl-gallery-grid" data-gallery-add="sl-gallery-item">
            <div class="sl-gallery-item img-zone" data-img-key="sl-g1"><div class="img-upload-hint">💅 Galeri</div></div>
            <div class="sl-gallery-item img-zone" data-img-key="sl-g2"><div class="img-upload-hint">✨ Galeri</div></div>
            <div class="sl-gallery-item img-zone" data-img-key="sl-g3"><div class="img-upload-hint">💇 Galeri</div></div>
            <div class="sl-gallery-item img-zone" data-img-key="sl-g4"><div class="img-upload-hint">💄 Galeri</div></div>
            <div class="sl-gallery-item img-zone" data-img-key="sl-g5"><div class="img-upload-hint">🌸 Galeri</div></div>
          </div>
        </section>

        <section class="sl-team" id="sl-team">
          <button class="drag-handle">⠿</button>
          <p class="sl-sec-tag editable" data-key="sl-t-tag" data-tr="EKİBİMİZ" data-en="OUR TEAM">EKİBİMİZ</p>
          <h2 class="sl-sec-h editable" data-key="sl-t-h" data-tr="Uzman Ekibimiz" data-en="Meet Our Experts">Uzman Ekibimiz</h2>
          <div class="sl-team-grid">
            <div class="sl-team-card">
              <div class="sl-team-img img-zone" data-img-key="sl-t1"><div class="img-upload-hint">👤 Uzman</div></div>
              <div class="sl-team-name editable" data-key="sl-t1n" data-tr="Ayşe Yılmaz" data-en="Anna Smith">Ayşe Yılmaz</div>
              <div class="sl-team-role editable" data-key="sl-t1r" data-tr="Saç Uzmanı" data-en="Hair Specialist">Saç Uzmanı</div>
            </div>
            <div class="sl-team-card">
              <div class="sl-team-img img-zone" data-img-key="sl-t2"><div class="img-upload-hint">👤 Uzman</div></div>
              <div class="sl-team-name editable" data-key="sl-t2n" data-tr="Fatma Kaya" data-en="Sophie Martin">Fatma Kaya</div>
              <div class="sl-team-role editable" data-key="sl-t2r" data-tr="Makyaj Sanatçısı" data-en="Makeup Artist">Makyaj Sanatçısı</div>
            </div>
            <div class="sl-team-card">
              <div class="sl-team-img img-zone" data-img-key="sl-t3"><div class="img-upload-hint">👤 Uzman</div></div>
              <div class="sl-team-name editable" data-key="sl-t3n" data-tr="Zeynep Demir" data-en="Lisa Johnson">Zeynep Demir</div>
              <div class="sl-team-role editable" data-key="sl-t3r" data-tr="Cilt Bakım Uzmanı" data-en="Skin Care Specialist">Cilt Bakım Uzmanı</div>
            </div>
          </div>
        </section>

        <section class="sl-contact" id="sl-contact">
          <button class="drag-handle">⠿</button>
          <p class="sl-sec-tag editable" data-key="sl-c-tag" data-tr="RANDEVU" data-en="APPOINTMENT">RANDEVU</p>
          <h2 class="sl-sec-h editable" data-key="sl-c-h" data-tr="Randevu Alın" data-en="Book Your Appointment">Randevu Alın</h2>
          <div class="sl-contact-card">
            <div class="sl-form-group"><label class="editable" data-key="sl-fl1" data-tr="Adınız" data-en="Your Name">Adınız</label><input class="sl-inp" id="sl-form-name" type="text" placeholder="Ad Soyad"></div>
            <div class="sl-form-group"><label class="editable" data-key="sl-fl2" data-tr="Telefon" data-en="Phone">Telefon</label><input class="sl-inp" id="sl-form-tel" type="tel" placeholder="+90 500 000 00 00"></div>
            <div class="sl-form-group"><label class="editable" data-key="sl-fl3" data-tr="İstediğiniz Hizmet" data-en="Desired Service">İstediğiniz Hizmet</label><textarea class="sl-inp" id="sl-form-msg" rows="3" placeholder="Hangi hizmeti almak istediğinizi yazın..."></textarea></div>
            <button class="sl-btn sl-btn-primary" style="width:100%;justify-content:center;border-radius:12px;" onclick="genericSendWA('sl')"><span class="editable" data-key="sl-c-btn" data-tr="WhatsApp ile Randevu Al" data-en="Book via WhatsApp">WhatsApp ile Randevu Al</span></button>
          </div>
        </section>

        <footer class="sl-footer">
          <button class="drag-handle">⠿</button>
          <div class="sl-footer-brand editable" data-key="sl-fl" data-tr="Belle Salon" data-en="Belle Salon">Belle Salon</div>
          <p class="sl-footer-cr editable" data-key="sl-cr" data-tr="© 2025 Tüm hakları saklıdır." data-en="© 2025 All rights reserved.">© 2025 Tüm hakları saklıdır.</p>
        </footer>

        <a href="#" class="sl-wa" id="wa-btn" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
      </div>
    `
  }


};
